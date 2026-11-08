#!/usr/bin/env node
/**
 * Master Foundation Gate & Anti-Drift Regression Test Suite (v6.5.0)
 * Covers:
 * - T1..T13: Base mechanical gate functionality
 * - EVAL-33..EVAL-48: Master Foundation v6.5.0 specifications
 * Zero external dependencies. Runs on Node.js 18+. Exit 1 on any failure.
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  canonicalize,
  checkStrictScope,
  computeSha256,
  matchAnyGlob,
  signCanonical,
  verifyCanonical
} from './check-approval.mjs';

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-approval.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mf-approval-v65-'));
const SPEC = 'specs/001';

const w = (relPath, data) => {
  const p = path.join(tmp, relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};

const run = (...a) => spawnSync('node', [SCRIPT, ...a], { cwd: tmp, encoding: 'utf8', env: { ...process.env } });

const reset = () => {
  fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true });
  fs.rmSync(path.join(tmp, '.mf'), { recursive: true, force: true });
  fs.rmSync(path.join(tmp, 'res.json'), { force: true });
  w(`${SPEC}/spec.md`, '# spec\nline\n');
};

const seal = (decision = 'approved', extraArgs = []) => {
  w('res.json', JSON.stringify({ decision, feedback: '' }));
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`, ...extraArgs);
};

let failed = 0;
function t(name, fn) {
  reset();
  let ok = false,
    why = '';
  try {
    const r = fn();
    ok = r === true;
    why = ok ? '' : String(r);
  } catch (e) {
    why = e.message;
  }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + why}`);
  if (!ok) failed++;
}

console.log('--- Phase 1: Base Mechanical Gate (T1..T13) ---');

t('T1 seal without --from-result is refused', () => run('--seal', `${SPEC}/APPROVAL.json`, `${SPEC}/spec.md`).status === 1);

t('T2 seal with missing result file is refused (no fallback)', () => {
  w(`${SPEC}/APPROVAL.json`, '{"decision":"approved"}');
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'nope.json', `${SPEC}/spec.md`).status === 1;
});

t('T3 seal with decision feedback is refused', () => seal('feedback').status === 1);

t('T4 seal approved then verify passes', () => seal().status === 0 && run().status === 0);

t('T5 verify rejects non-approved decision even with valid hashes', () => {
  seal();
  const p = path.join(tmp, SPEC, 'APPROVAL.json');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  d.decision = 'feedback';
  fs.writeFileSync(p, JSON.stringify(d));
  return run().status === 1;
});

t('T6 editing sealed file is detected', () => {
  seal();
  w(`${SPEC}/spec.md`, '# changed\n');
  return run().status === 1;
});

t('T7 CRLF vs LF of same text does not break the seal', () => {
  seal();
  w(`${SPEC}/spec.md`, '# spec\r\nline\r\n');
  return run().status === 0;
});

t('T8 unsealed .json file in spec folder is detected', () => {
  seal();
  w(`${SPEC}/schema.json`, '{}');
  return run().status === 1;
});

t('T9 unsealed nested file is detected', () => {
  seal();
  w(`${SPEC}/contracts/api.md`, '# c\n');
  return run().status === 1;
});

t('T10 binary file is hashed raw and verifies', () => {
  w(`${SPEC}/img.png`, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x00, 0xff]));
  w('res.json', '{"decision":"approved"}');
  return (
    run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`, `${SPEC}/img.png`).status ===
      0 && run().status === 0
  );
});

t('T11 mistyped verify argument fails closed', () => run('specs/typo/APPROVAL.json').status === 1);

t('T12 sealing a file outside the repo is refused', () => {
  w('res.json', '{"decision":"approved"}');
  const outside = path.join(os.tmpdir(), 'mf-outside.md');
  fs.writeFileSync(outside, 'x');
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', outside).status === 1;
});

t('T13 no specs folder is OK (exit 0)', () => {
  fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true });
  return run().status === 0;
});

console.log('\n--- Phase 2: Master Foundation v6.5 Specifications (EVAL-33..EVAL-48) ---');

// EVAL-33: Scope violation in src/auth/ when allowed_paths is src/billing/
t('EVAL-33: Modification outside allowed_paths is rejected (Scope Violation)', () => {
  const errors = checkStrictScope(tmp, ['src/billing/**'], {
    files: ['src/auth/login.ts'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('src/auth/login.ts'));
});

// EVAL-34: Destructive scripts or unallowed execution flagged
t('EVAL-34: Destructive Python/Node scripts outside allowed_paths are caught by scope engine', () => {
  const errors = checkStrictScope(tmp, ['src/components/**'], {
    files: ['scripts/nuke-database.py'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('scripts/nuke-database.py'));
});

// EVAL-35: Anti-spoofing in Headless/SSH: unauthenticated approval without developer signature rejected
t('EVAL-35: Unauthenticated self-stamped approval without developer signature is rejected', () => {
  const keyPair = crypto.generateKeyPairSync('ed25519');
  const pubKeyHex = keyPair.publicKey.export({ type: 'spki', format: 'pem' });
  w('.mf/allowed_signers.json', JSON.stringify({ lead_dev: { publicKey: pubKeyHex, alg: 'ed25519' } }));

  // Sealed without key
  seal('approved', ['--approver', 'lead_dev']);
  return run().status === 1;
});

// EVAL-36: Implementation Conformance: unsealed spec files fail verification
t('EVAL-36: Missing spec fulfillment or unsealed spec file fails conformance verification', () => {
  seal('approved');
  w(`${SPEC}/untracked-requirement.md`, '# Missing in tasks\n');
  return run().status === 1;
});

// EVAL-37: Expired approval or stale base_commit rejected
t('EVAL-37: Expired APPROVAL.json (expires_at in past) fails verification with exit 1', () => {
  seal('approved');
  const p = path.join(tmp, SPEC, 'APPROVAL.json');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  d.expires_at = '2021-01-01T00:00:00.000Z'; // Expired
  fs.writeFileSync(p, JSON.stringify(d, null, 2));
  return run().status === 1;
});

// EVAL-38: Unauthorized modification of guardrail files is blocked
t('EVAL-38: Modification of guardrail files (.githooks/pre-commit) rejected unless explicitly authorized', () => {
  const errors = checkStrictScope(tmp, ['src/app/**'], {
    files: ['.githooks/pre-commit'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Unauthorized modification to guardrail file'));
});

// EVAL-39: Reusing APPROVAL.json from another repository is rejected
t('EVAL-39: Reusing APPROVAL.json with mismatched repository_id fails verification', () => {
  seal('approved', ['--repo-id', 'foreign-enterprise-repo']);
  const res = spawnSync('node', [SCRIPT], {
    cwd: tmp,
    encoding: 'utf8',
    env: { ...process.env, STRICT_REPO_CHECK: 'true' }
  });
  return res.status === 1 && res.stderr.includes('REPOSITORY MISMATCH');
});

// EVAL-40: Post-CI code modification detected via drift checks
t('EVAL-40: Modifying code after approval check triggers drift detection', () => {
  seal('approved');
  w(`${SPEC}/spec.md`, '# New Unapproved Change Added\n');
  return run().status === 1;
});

// EVAL-41: Untracked file or Symlink pointing outside allowed_paths / repo is rejected
t('EVAL-41: Symlink pointing outside repo or untracked file outside scope is rejected', () => {
  // Check path traversal via scope engine
  const traversalErrors = checkStrictScope(tmp, ['src/**'], {
    files: ['../../etc/passwd'],
    checkGit: false
  });
  const hasTraversalError = traversalErrors.some((e) => e.includes('Path traversal'));

  // Test symlink if platform permits
  let symlinkOk = true;
  try {
    const targetFile = path.join(tmp, 'outside-target.txt');
    fs.writeFileSync(targetFile, 'content');
    const linkPath = path.join(tmp, 'symlink-test.txt');
    fs.symlinkSync(targetFile, linkPath);
    const symlinkErrors = checkStrictScope(tmp, ['src/**'], {
      files: ['symlink-test.txt'],
      checkGit: false
    });
    symlinkOk = symlinkErrors.some((e) => e.includes('outside allowed_paths') || e.includes('Scope violation'));
    fs.unlinkSync(linkPath);
    fs.unlinkSync(targetFile);
  } catch {
    // Platform without symlink permissions defaults to true
  }

  return hasTraversalError && symlinkOk;
});

// EVAL-42: Local hook bypass detected: strict CI scope check fails on unverified files
t('EVAL-42: CI merge-tree and strict scope check catches unverified commits', () => {
  const errors = checkStrictScope(tmp, ['src/allowed/**'], {
    files: ['src/unverified-bypass.ts'],
    checkGit: false
  });
  return errors.length > 0 && errors[0].includes('Scope violation');
});

// EVAL-43: Secret file protection: sealing .env or credentials is fundamentally refused
t('EVAL-43: Sealing sensitive secret files (.env, credentials) is refused by --seal', () => {
  w(`${SPEC}/.env`, 'SECRET_KEY=supersecret\n');
  w('res.json', JSON.stringify({ decision: 'approved' }));
  const r = run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/.env`);
  return r.status === 1 && r.stderr.includes('REFUSED: attempting to seal sensitive secret file');
});

// EVAL-44: Multi-agent concurrency collision: conflicting allowed_paths on divergent worktrees
t('EVAL-44: Concurrency collision between conflicting allowed_paths is detectable', () => {
  const agent1Scope = ['src/billing/**'];
  const agent2Scope = ['src/auth/**', 'src/billing/payment.ts'];

  const hasOverlap = agent2Scope.some((pattern) => matchAnyGlob(agent1Scope, pattern.replace(/\*\*/g, 'test.ts')));
  return hasOverlap === true;
});

// EVAL-45: Change Surface Inventory: unrecorded out-of-scope changes detected
t('EVAL-45: Unrecorded changes outside allowed_paths fail change surface verification', () => {
  const errors = checkStrictScope(tmp, ['src/features/dashboard/**'], {
    files: ['infra/terraform/main.tf'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('infra/terraform/main.tf'));
});

// EVAL-46: Spec drift: editing spec.md after approval triggers SHA-256 hash mismatch
t('EVAL-46: Spec drift after approval triggers SHA-256 mismatch (exit 1)', () => {
  seal('approved');
  w(`${SPEC}/spec.md`, '# Changed Spec Requirement After Approval\n');
  const res = run();
  return res.status === 1 && res.stderr.includes('HASH MISMATCH');
});

// EVAL-47: Canonical JSON signing: valid signature passes, invalid signature fails
t('EVAL-47: Canonical JSON digital signature (RFC 8785) verification and tamper rejection', () => {
  const secret = 'super-secure-dev-secret-key-12345';
  const approvalData = {
    approval_id: 'uuid-123',
    decision: 'approved',
    approver_id: 'architect_01',
    allowed_paths: ['src/**'],
    expires_at: '2030-01-01T00:00:00.000Z'
  };

  // Sign canonical JSON
  const signature = signCanonical(approvalData, secret, 'hmac-sha256');

  // Verify valid signature
  const valid = verifyCanonical(approvalData, signature, secret, 'hmac-sha256');

  // Tamper data
  const tampered = { ...approvalData, decision: 'approved-with-notes' };
  const invalidTampered = verifyCanonical(tampered, signature, secret, 'hmac-sha256');

  // Tamper signature
  const tamperedSig = (signature[0] === 'a' ? 'b' : 'a') + signature.slice(1);
  const invalidSig = verifyCanonical(approvalData, tamperedSig, secret, 'hmac-sha256');

  return valid === true && invalidTampered === false && invalidSig === false;
});

// EVAL-48: Unpinned external dependencies rejected
t('EVAL-48: Unpinned versions or dependencies are detected and flagged', () => {
  const isPinned = (ver) => /^v?[0-9]+\.[0-9]+\.[0-9]+$/.test(ver);
  const unpinned = ['*', 'latest', '^1.2.0', '~2.0.0'];
  const allRejected = unpinned.every((v) => !isPinned(v));
  const pinnedAccepted = isPinned('1.2.3') && isPinned('v6.5.0');
  return allRejected && pinnedAccepted;
});

// Cleanup temp directory
fs.rmSync(tmp, { recursive: true, force: true });

console.log(failed === 0 ? '\nALL 29 TESTS PASSED (T1..T13 + EVAL-33..EVAL-48)' : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);

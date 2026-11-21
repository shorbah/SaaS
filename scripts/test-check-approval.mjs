#!/usr/bin/env node
/**
 * Master Foundation Gate & Anti-Drift Regression Test Suite (v6.5.1)
 * Zero external dependencies. Runs on Node.js 18+. Exit 1 on any failure.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  canonicalize,
  checkStrictScope
} from './check-approval.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SCRIPT = path.join(SCRIPT_DIR, 'check-approval.mjs');
const BUNDLE_SCRIPT = path.join(SCRIPT_DIR, 'generate-bundle.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mf-approval-v651-'));
const SPEC = 'specs/001';

const writeTmp = (relPath, data) => {
  const full = path.join(tmp, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, data);
  return full;
};

const runCli = (args, opts = {}) =>
  spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: opts.cwd || tmp,
    encoding: 'utf8',
    env: { ...process.env, ...(opts.env || {}) }
  });

const resetWorkspace = () => {
  for (const entry of fs.readdirSync(tmp)) {
    fs.rmSync(path.join(tmp, entry), { recursive: true, force: true });
  }
  writeTmp(`${SPEC}/spec.md`, '# spec\nline\n');
};

const setupEd25519Signer = (signerId = 'lead_dev', root = tmp) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
  const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const privPath = path.join(root, '.test-keys', `${signerId}.key`);
  fs.mkdirSync(path.dirname(privPath), { recursive: true });
  fs.writeFileSync(privPath, privPem);

  const signersPath = path.join(root, '.mf', 'allowed_signers.json');
  fs.mkdirSync(path.dirname(signersPath), { recursive: true });
  fs.writeFileSync(
    signersPath,
    JSON.stringify({ [signerId]: { name: signerId, publicKey: pubPem, alg: 'ed25519' } }, null, 2)
  );
  return { privPath, pubPem };
};

const sealSigned = (options = {}) => {
  const {
    decision = 'approved',
    specDir = SPEC,
    files = [`${specDir}/spec.md`],
    allowedPaths = 'src/**',
    extraArgs = [],
    signerId = 'lead_dev',
    privPath = null,
    cwd = tmp
  } = options;

  let keyPath = privPath;
  if (!keyPath) {
    keyPath = setupEd25519Signer(signerId, cwd).privPath;
  }

  const resPath = path.join(cwd, 'res.json');
  fs.writeFileSync(resPath, JSON.stringify({ decision, feedback: '' }));

  const args = [
    '--seal',
    `${specDir}/APPROVAL.json`,
    '--from-result',
    'res.json',
    '--approver',
    signerId,
    '--sign-key',
    keyPath
  ];
  if (allowedPaths !== null) {
    args.push('--allowed-paths', allowedPaths);
  }
  args.push(...extraArgs, ...files);
  return runCli(args, { cwd });
};

const initGitRepo = (dir) => {
  execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd: dir, stdio: 'ignore' });
  fs.writeFileSync(path.join(dir, 'README.md'), '# init\n');
  execFileSync('git', ['add', 'README.md'], { cwd: dir, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd: dir, stdio: 'ignore' });
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
};

let failed = 0;
let passed = 0;

function testCase(name, fn) {
  resetWorkspace();
  let ok = false;
  let why = '';
  try {
    const outcome = fn();
    ok = outcome === true;
    why = ok ? '' : String(outcome);
  } catch (err) {
    why = err.stack || err.message;
  }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + why}`);
  if (ok) passed++;
  else failed++;
}

console.log('--- Phase 1: Base Mechanical Gate Contracts ---');

testCase('seal_without_from_result_is_refused', () =>
  runCli(['--seal', `${SPEC}/APPROVAL.json`, '--allowed-paths', 'src/**', `${SPEC}/spec.md`]).status === 1
);

testCase('seal_with_missing_result_file_is_refused', () =>
  runCli([
    '--seal',
    `${SPEC}/APPROVAL.json`,
    '--from-result',
    'nope.json',
    '--allowed-paths',
    'src/**',
    `${SPEC}/spec.md`
  ]).status === 1
);

testCase('seal_with_non_approved_decision_is_refused', () =>
  sealSigned({ decision: 'feedback' }).status === 1
);

testCase('seal_without_allowed_paths_is_refused', () => {
  const res = sealSigned({ allowedPaths: null });
  return res.status === 1 && /allowed-paths/i.test(res.stderr);
});

testCase('seal_outside_repo_is_refused', () => {
  const outside = path.join(os.tmpdir(), 'mf-outside-v651.md');
  fs.writeFileSync(outside, 'x');
  const res = sealSigned({ files: [outside] });
  fs.rmSync(outside, { force: true });
  return res.status === 1;
});

testCase('seal_secret_env_file_is_refused', () => {
  writeTmp(`${SPEC}/.env`, 'SECRET_KEY=supersecret\n');
  const res = sealSigned({ files: [`${SPEC}/.env`] });
  return res.status === 1 && res.stderr.includes('REFUSED: attempting to seal sensitive secret file');
});

testCase('mistyped_verify_argument_fails_closed', () =>
  runCli(['specs/typo/APPROVAL.json']).status === 1
);

testCase('no_specs_folder_with_clean_guardrails_passes', () => {
  fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true });
  return runCli([]).status === 0;
});

console.log('\n--- Phase 2: Cryptographic Ed25519, Fail-Closed & Canonical JSON ---');

testCase('verify_fails_closed_when_no_allowed_signers_exist', () => {
  const { privPath } = setupEd25519Signer();
  const sealed = sealSigned({ privPath });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;

  // Remove trust root and strip signature to simulate bypass attempt
  fs.rmSync(path.join(tmp, '.mf'), { recursive: true, force: true });
  const approvalPath = path.join(tmp, SPEC, 'APPROVAL.json');
  const parsed = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  delete parsed.signature;
  fs.writeFileSync(approvalPath, JSON.stringify(parsed, null, 2));

  const verified = runCli([]);
  return verified.status === 1;
});

testCase('ed25519_unencrypted_key_full_cli_lifecycle', () => {
  const keyDir = path.join(tmp, 'dev-keys');
  const gen = runCli(['--generate-key', '--id', 'arch_dev', '--no-passphrase', '--key-dir', keyDir]);
  if (gen.status !== 0) return `generate-key failed: ${gen.stderr}`;

  const privPath = path.join(keyDir, 'id_ed25519');
  writeTmp('res.json', JSON.stringify({ decision: 'approved' }));
  const sealed = runCli([
    '--seal',
    `${SPEC}/APPROVAL.json`,
    '--from-result',
    'res.json',
    '--approver',
    'arch_dev',
    '--sign-key',
    privPath,
    '--allowed-paths',
    'src/**',
    `${SPEC}/spec.md`
  ]);
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;

  const verifiedOk = runCli([]);
  if (verifiedOk.status !== 0) return `verify failed: ${verifiedOk.stderr}`;

  // Tamper payload after signing -> must fail signature verification
  const approvalPath = path.join(tmp, SPEC, 'APPROVAL.json');
  const parsed = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  parsed.decision = 'approved-with-notes';
  fs.writeFileSync(approvalPath, JSON.stringify(parsed, null, 2));
  const verifiedTampered = runCli([]);
  return verifiedTampered.status === 1 && verifiedTampered.stderr.includes('INVALID SIGNATURE');
});

testCase('ed25519_encrypted_key_with_passphrase_full_cli_lifecycle', () => {
  const keyDir = path.join(tmp, 'enc-keys');
  const envPass = { TEST_MF_PASS: 'S3cur3-Passphrase-v651!' };
  const gen = runCli(
    ['--generate-key', '--id', 'enc_dev', '--passphrase-env', 'TEST_MF_PASS', '--key-dir', keyDir],
    { env: envPass }
  );
  if (gen.status !== 0) return `generate-key failed: ${gen.stderr}`;

  const privPath = path.join(keyDir, 'id_ed25519');
  const pemText = fs.readFileSync(privPath, 'utf8');
  if (!pemText.includes('ENCRYPTED PRIVATE KEY')) {
    return 'generated private key is not encrypted PEM';
  }

  writeTmp('res.json', JSON.stringify({ decision: 'approved' }));

  // Wrong passphrase must fail
  const wrongSeal = runCli(
    [
      '--seal',
      `${SPEC}/APPROVAL.json`,
      '--from-result',
      'res.json',
      '--approver',
      'enc_dev',
      '--sign-key',
      privPath,
      '--passphrase-env',
      'WRONG_PASS',
      '--allowed-paths',
      'src/**',
      `${SPEC}/spec.md`
    ],
    { env: { WRONG_PASS: 'totally-wrong' } }
  );
  if (wrongSeal.status !== 1) return 'seal with wrong passphrase should fail';

  // Correct passphrase succeeds and verifies
  const goodSeal = runCli(
    [
      '--seal',
      `${SPEC}/APPROVAL.json`,
      '--from-result',
      'res.json',
      '--approver',
      'enc_dev',
      '--sign-key',
      privPath,
      '--passphrase-env',
      'TEST_MF_PASS',
      '--allowed-paths',
      'src/**',
      `${SPEC}/spec.md`
    ],
    { env: envPass }
  );
  if (goodSeal.status !== 0) return `good seal failed: ${goodSeal.stderr}`;

  return runCli([]).status === 0;
});

testCase('unsigned_approval_rejected_when_signers_registered', () => {
  setupEd25519Signer('lead_dev');
  writeTmp('res.json', JSON.stringify({ decision: 'approved' }));
  runCli([
    '--seal',
    `${SPEC}/APPROVAL.json`,
    '--from-result',
    'res.json',
    '--approver',
    'lead_dev',
    '--allowed-paths',
    'src/**',
    `${SPEC}/spec.md`
  ]);
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('UNSIGNED APPROVAL');
});

testCase('unauthorized_signer_is_rejected', () => {
  setupEd25519Signer('lead_dev');
  const roguePair = crypto.generateKeyPairSync('ed25519');
  const rogueKeyPath = writeTmp('.test-keys/rogue.key', roguePair.privateKey.export({ type: 'pkcs8', format: 'pem' }));
  sealSigned({ signerId: 'rogue_dev', privPath: rogueKeyPath });
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('UNAUTHORIZED SIGNER');
});

testCase('canonicalize_preserves_nested_signature_and_normalizes_array_undefined', () => {
  const input = {
    signature: 'root-sig-excluded',
    meta: { signature: 'nested-sig-kept', b: 2, a: 1 },
    items: [1, undefined, -0]
  };
  const actual = canonicalize(input);
  const expected = '{"items":[1,null,0],"meta":{"a":1,"b":2,"signature":"nested-sig-kept"}}';
  return actual === expected ? true : `got ${actual}`;
});

console.log('\n--- Phase 3: Command Injection Prevention & Windows Git Compatibility ---');

testCase('base_commit_command_injection_rejected_without_shell_execution', () => {
  initGitRepo(tmp);
  const marker = path.join(tmp, 'pwned.txt');
  const injection = `deadbeef || node -e "require('fs').writeFileSync('pwned.txt','pwned')"`;
  const sealed = sealSigned({ extraArgs: ['--base-commit', injection] });
  if (sealed.status !== 0) {
    return !fs.existsSync(marker);
  }
  const res = runCli([]);
  return res.status === 1 && !fs.existsSync(marker);
});

testCase('signature_checked_before_base_commit_validation', () => {
  initGitRepo(tmp);
  sealSigned({});
  const approvalPath = path.join(tmp, SPEC, 'APPROVAL.json');
  const parsed = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  parsed.base_commit = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  fs.writeFileSync(approvalPath, JSON.stringify(parsed, null, 2));
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('INVALID SIGNATURE');
});

testCase('valid_base_commit_verifies_on_windows_without_caret_escape_bug', () => {
  initGitRepo(tmp);
  writeTmp('.gitignore', 'res.json\n.test-keys/\n');
  const { privPath } = setupEd25519Signer('lead_dev', tmp);
  execFileSync('git', ['add', '.gitignore', '.mf/allowed_signers.json'], { cwd: tmp, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'setup signers'], { cwd: tmp, stdio: 'ignore' });
  const headSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: tmp, encoding: 'utf8' }).trim();

  const sealed = sealSigned({ extraArgs: ['--base-commit', headSha], privPath });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;
  const res = runCli([]);
  return res.status === 0 ? true : `verify failed: ${res.stderr}`;
});

console.log('\n--- Phase 4: Anti-Drift, Expiry & Archive Lifecycle ---');

testCase('editing_sealed_file_triggers_hash_mismatch', () => {
  sealSigned({});
  writeTmp(`${SPEC}/spec.md`, '# tampered\n');
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('HASH MISMATCH');
});

testCase('crlf_vs_lf_preserves_seal_hash', () => {
  sealSigned({});
  writeTmp(`${SPEC}/spec.md`, '# spec\r\nline\r\n');
  return runCli([]).status === 0;
});

testCase('binary_file_hashed_raw_and_verifies', () => {
  writeTmp(`${SPEC}/img.png`, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x00, 0xff]));
  const sealed = sealSigned({ files: [`${SPEC}/spec.md`, `${SPEC}/img.png`] });
  return sealed.status === 0 && runCli([]).status === 0;
});

testCase('unsealed_nested_file_in_spec_folder_is_detected', () => {
  sealSigned({});
  writeTmp(`${SPEC}/contracts/api.md`, '# unsealed\n');
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('UNSEALED SPEC FILE');
});

testCase('expired_active_approval_is_rejected', () => {
  const sealed = sealSigned({ extraArgs: ['--expires-in', '-1'] });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;
  const res = runCli([]);
  return res.status === 1 && res.stderr.includes('EXPIRED');
});

testCase('archived_expired_approval_passes_intact_and_fails_tampered', () => {
  const archivedDir = 'specs/archive/001-done';
  writeTmp(`${archivedDir}/spec.md`, '# completed feature\n');
  const sealed = sealSigned({
    specDir: archivedDir,
    files: [`${archivedDir}/spec.md`],
    allowedPaths: 'src/legacy/**',
    extraArgs: ['--expires-in', '-30']
  });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;

  // Archived & expired must pass verify when intact
  const intact = runCli([]);
  if (intact.status !== 0) return `archived intact failed: ${intact.stderr}`;

  // Archived spec must NOT grant active allowed_paths in --check-scope
  const scopeOut = runCli(['--check-scope']);
  if (scopeOut.status !== 0 || !scopeOut.stdout.includes('No active APPROVAL.json')) {
    return `archived spec leaked into active scope: ${scopeOut.stdout} ${scopeOut.stderr}`;
  }

  // Tampering archived spec file must STILL be detected
  writeTmp(`${archivedDir}/spec.md`, '# retroactively altered\n');
  const tampered = runCli([]);
  return tampered.status === 1 && tampered.stderr.includes('HASH MISMATCH');
});

testCase('mismatched_repository_id_is_rejected', () => {
  sealSigned({ extraArgs: ['--repo-id', 'foreign-enterprise-repo'] });
  const res = runCli([], { env: { STRICT_REPO_CHECK: 'true' } });
  return res.status === 1 && res.stderr.includes('REPOSITORY MISMATCH');
});

console.log('\n--- Phase 5: Strict Scope, Guardrails, Symlinks & Git Edge Cases ---');

testCase('modification_outside_allowed_paths_rejected', () => {
  const errors = checkStrictScope(tmp, ['src/billing/**'], {
    files: ['src/auth/login.ts'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('src/auth/login.ts'));
});

testCase('guardrail_files_blocked_even_with_wildcard_allowed_paths', () => {
  const errors = checkStrictScope(tmp, ['**'], {
    files: ['.mf/allowed_signers.json', '.githooks/pre-commit', 'AGENTS.md', 'scripts/test-check-approval.mjs'],
    checkGit: false
  });
  return (
    errors.some((e) => e.includes('.mf/allowed_signers.json') && e.includes('guardrail')) &&
    errors.some((e) => e.includes('.githooks/pre-commit') && e.includes('guardrail')) &&
    errors.some((e) => e.includes('AGENTS.md') && e.includes('guardrail')) &&
    errors.some((e) => e.includes('scripts/test-check-approval.mjs') && e.includes('guardrail'))
  );
});

testCase('guardrail_files_allowed_only_with_signed_allow_guardrails_flag', () => {
  initGitRepo(tmp);
  const sealed = sealSigned({
    allowedPaths: '.githooks/pre-commit',
    extraArgs: ['--allow-guardrails']
  });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;

  // Modify the explicitly authorized guardrail file and stage it
  writeTmp('.githooks/pre-commit', '#!/bin/sh\necho ok\n');
  execFileSync('git', ['add', '.githooks/pre-commit'], { cwd: tmp, stdio: 'ignore' });
  const okRes = runCli(['--check-scope', '--staged-only']);
  if (okRes.status !== 0) return `authorized guardrail failed: ${okRes.stderr}`;

  // Touching a DIFFERENT guardrail file not in allowed_paths must still fail
  writeTmp('AGENTS.md', '# unauthorized\n');
  execFileSync('git', ['add', 'AGENTS.md'], { cwd: tmp, stdio: 'ignore' });
  const blockedRes = runCli(['--check-scope', '--staged-only']);
  return blockedRes.status === 1 && blockedRes.stderr.includes('AGENTS.md');
});

testCase('path_traversal_and_symlink_outside_allowed_paths_rejected', () => {
  const traversalErrors = checkStrictScope(tmp, ['src/**'], {
    files: ['../../etc/passwd'],
    checkGit: false
  });
  const hasTraversal = traversalErrors.some((e) => e.includes('Path traversal'));

  let symlinkOk = true;
  try {
    const targetFile = writeTmp('outside-target.txt', 'content');
    const linkPath = path.join(tmp, 'src', 'link.txt');
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    fs.symlinkSync(targetFile, linkPath);
    const symlinkErrors = checkStrictScope(tmp, ['src/**'], {
      files: ['src/link.txt'],
      checkGit: false
    });
    symlinkOk = symlinkErrors.some((e) => e.includes('outside allowed_paths'));
    fs.unlinkSync(linkPath);
  } catch {
    // Platform without symlink creation privilege
  }

  return hasTraversal && symlinkOk;
});

testCase('check_scope_rejects_unsigned_approval_trying_to_inject_scope', () => {
  initGitRepo(tmp);
  setupEd25519Signer('lead_dev');
  writeTmp('res.json', JSON.stringify({ decision: 'approved' }));
  // Create unsigned approval with broad allowed_paths
  runCli([
    '--seal',
    `${SPEC}/APPROVAL.json`,
    '--from-result',
    'res.json',
    '--approver',
    'lead_dev',
    '--allowed-paths',
    'src/**',
    `${SPEC}/spec.md`
  ]);
  writeTmp('src/sneaky.ts', 'export const x = 1;\n');
  execFileSync('git', ['add', 'src/sneaky.ts'], { cwd: tmp, stdio: 'ignore' });

  const res = runCli(['--check-scope', '--staged-only']);
  return res.status === 1;
});

testCase('git_spaces_arabic_filenames_and_staged_only_mode', () => {
  initGitRepo(tmp);
  writeTmp('.gitignore', 'res.json\n.test-keys/\n');
  const { privPath } = setupEd25519Signer('lead_dev', tmp);
  execFileSync('git', ['add', '.gitignore', '.mf/allowed_signers.json'], { cwd: tmp, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'setup signers'], { cwd: tmp, stdio: 'ignore' });

  const sealed = sealSigned({ allowedPaths: 'src/allowed/**', privPath });
  if (sealed.status !== 0) return `seal failed: ${sealed.stderr}`;

  // Stage a file with spaces & Arabic characters inside allowed_paths
  writeTmp('src/allowed/ملف عربي test.txt', 'hello\n');
  execFileSync('git', ['add', 'src/allowed/ملف عربي test.txt'], { cwd: tmp, stdio: 'ignore' });

  // Leave an unrelated untracked draft outside allowed_paths
  writeTmp('scratch/untracked draft.txt', 'wip\n');

  // --staged-only (used by pre-commit) should PASS
  const stagedRes = runCli(['--check-scope', '--staged-only']);
  if (stagedRes.status !== 0) return `staged-only failed: ${stagedRes.stderr}`;

  // Full working tree mode (without --staged-only) must CATCH the untracked draft
  const fullRes = runCli(['--check-scope']);
  return fullRes.status === 1 && fullRes.stderr.includes('scratch/untracked draft.txt');
});

console.log('\n--- Phase 6: Single Source of Truth Rules Parity ---');

testCase('rules_files_match_canonical_source_via_check_rules', () => {
  const res = spawnSync(process.execPath, [BUNDLE_SCRIPT, '--check-rules'], {
    cwd: REPO_ROOT,
    encoding: 'utf8'
  });
  return res.status === 0 && res.stdout.includes('RULES PARITY OK')
    ? true
    : `rules drift: ${res.stdout} ${res.stderr}`;
});

fs.rmSync(tmp, { recursive: true, force: true });

console.log(
  failed === 0
    ? `\nALL ${passed} TESTS PASSED (Master Foundation v6.5.1 Suite)`
    : `\n${failed} OF ${passed + failed} TEST(S) FAILED`
);
process.exit(failed === 0 ? 0 : 1);

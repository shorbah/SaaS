#!/usr/bin/env node
/**
 * Master Foundation Mechanical Approval & Anti-Drift Gate (v6.4.0, R2)
 * - Seal requires an explicit Plannotator result file (no default approval, no fallback).
 * - Verify checks the decision value, hashes (CRLF-normalized for text), and unsealed files.
 * NOTE: this detects drift and unapproved states. It is NOT proof of human approval by itself;
 *       pair it with CODEOWNERS + branch protection on every APPROVAL.json file.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VALID_DECISIONS = ['approved', 'approved-with-notes'];
const CWD = process.cwd();

function isBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

// Text: normalize CRLF -> LF (Windows vs Linux CI). Binary: hash raw bytes.
function computeSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  if (isBinary(buf)) return crypto.createHash('sha256').update(buf).digest('hex');
  const normalized = buf.toString('utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

function insideCwd(p) {
  const rel = path.relative(CWD, p);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function walk(dir, predicate) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full, predicate));
    else if (entry.isFile() && predicate(entry.name)) out.push(full);
  }
  return out;
}

const findApprovalFiles = (dir) => walk(dir, (n) => n === 'APPROVAL.json');
const findSpecFiles = (dir) => walk(dir, (n) => n !== 'APPROVAL.json');
const rel = (p) => path.relative(CWD, p).replace(/\\/g, '/');

const args = process.argv.slice(2);

// ---------------- SEAL ----------------
// node scripts/check-approval.mjs --seal <APPROVAL.json> --from-result <result.json> <files...>
if (args[0] === '--seal') {
  const approvalTarget = args[1];
  let resultFile = null;
  const fileList = [];
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--from-result') resultFile = args[++i];
    else fileList.push(args[i]);
  }

  if (!approvalTarget || !resultFile || fileList.length === 0) {
    console.error('Usage: node scripts/check-approval.mjs --seal <APPROVAL.json> --from-result <result.json> <file1> [file2 ...]');
    process.exit(1);
  }

  const targetPath = path.resolve(CWD, approvalTarget);
  const resultPath = path.resolve(CWD, resultFile);

  if (!fs.existsSync(resultPath)) {
    console.error(`[check-approval] REFUSED: result file not found: ${resultFile}. Sealing requires a Plannotator gate result.`);
    process.exit(1);
  }

  let approvalData;
  try {
    approvalData = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  } catch {
    console.error(`[check-approval] REFUSED: cannot parse result file: ${resultFile}`);
    process.exit(1);
  }

  if (!approvalData || !VALID_DECISIONS.includes(approvalData.decision)) {
    console.error(`[check-approval] REFUSED: decision "${approvalData?.decision}" is not one of ${VALID_DECISIONS.join(', ')}.`);
    process.exit(1);
  }

  approvalData.files = {};
  for (const f of fileList) {
    let resolved = path.resolve(CWD, f);
    if (!fs.existsSync(resolved)) resolved = path.resolve(path.dirname(targetPath), f);
    if (!fs.existsSync(resolved)) {
      console.error(`[check-approval] File not found to seal: ${f}`);
      process.exit(1);
    }
    if (!insideCwd(resolved)) {
      console.error(`[check-approval] REFUSED: file outside repository: ${f}`);
      process.exit(1);
    }
    const hash = computeSha256(resolved);
    approvalData.files[rel(resolved)] = hash;
    console.log(`[check-approval] Sealed ${rel(resolved)} -> ${hash.substring(0, 16)}...`);
  }

  approvalData.sealedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(approvalData, null, 2) + '\n', 'utf8');
  console.log(`[check-approval] Successfully sealed approval file: ${approvalTarget}`);
  process.exit(0);
}

// ---------------- VERIFY ----------------
let targets = [];
if (args.length > 0) {
  for (const arg of args) {
    const resolved = path.resolve(CWD, arg);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      targets.push(...findApprovalFiles(resolved));
    } else if (fs.existsSync(resolved) && path.basename(resolved) === 'APPROVAL.json') {
      targets.push(resolved);
    } else {
      // Fail closed: a mistyped/non-approval argument must not pass silently.
      console.error(`[check-approval] FAILED: argument is not an APPROVAL.json or a directory: ${arg}`);
      process.exit(1);
    }
  }
} else {
  targets = findApprovalFiles(path.resolve(CWD, 'specs'));
}

if (targets.length === 0) {
  console.log('[check-approval] No APPROVAL.json files found to check. OK.');
  process.exit(0);
}

let hasFailure = false;

for (const approvalPath of targets) {
  const relApproval = rel(approvalPath);
  console.log(`[check-approval] Checking ${relApproval}...`);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  } catch (err) {
    console.error(`[check-approval] INVALID JSON in ${relApproval}: ${err.message}`);
    hasFailure = true;
    continue;
  }

  if (!VALID_DECISIONS.includes(data.decision)) {
    console.error(`[check-approval] FAILED: ${relApproval} carries non-approved decision "${data.decision}".`);
    hasFailure = true;
    continue;
  }

  if (!data.files || typeof data.files !== 'object' || Object.keys(data.files).length === 0) {
    console.error(`[check-approval] FAILED: ${relApproval} does not seal any files in "files".`);
    hasFailure = true;
    continue;
  }

  const sealed = new Set();
  for (const [sealedFile, expectedHash] of Object.entries(data.files)) {
    let resolved = path.resolve(CWD, sealedFile);
    if (!fs.existsSync(resolved)) resolved = path.resolve(path.dirname(approvalPath), sealedFile);
    if (!fs.existsSync(resolved)) {
      console.error(`[check-approval] FILE MISSING: ${sealedFile} referenced in ${relApproval}`);
      hasFailure = true;
      continue;
    }
    if (!insideCwd(resolved)) {
      console.error(`[check-approval] FAILED: sealed path outside repository: ${sealedFile}`);
      hasFailure = true;
      continue;
    }
    sealed.add(path.resolve(resolved));
    const actual = computeSha256(resolved);
    if (actual !== expectedHash) {
      console.error(`[check-approval] HASH MISMATCH for: ${sealedFile}`);
      console.error(`   Expected: ${expectedHash}`);
      console.error(`   Actual:   ${actual}`);
      hasFailure = true;
    } else {
      console.log(`  [OK] ${sealedFile}`);
    }
  }

  for (const doc of findSpecFiles(path.dirname(approvalPath))) {
    if (!sealed.has(path.resolve(doc))) {
      console.error(`[check-approval] UNSEALED SPEC FILE: "${rel(doc)}" exists in spec folder but is not sealed in ${relApproval}`);
      hasFailure = true;
    }
  }
}

if (hasFailure) {
  console.error('[check-approval] FAILED: Spec approval verification failed.');
  process.exit(1);
}
console.log('[check-approval] SUCCESS: All specs approved and sealed without drift.');
process.exit(0);

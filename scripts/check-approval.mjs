#!/usr/bin/env node
/**
 * Master Foundation Mechanical Approval & Anti-Drift Gate (v6.5.0)
 * - RFC 8785 Canonical JSON serialization & cryptographic signature verification.
 * - Strict Scope validation: checks tracked/untracked changes, resolves symlinks, prevents path traversal.
 * - Anti-drift: seals SHA-256 hashes of spec files (CRLF-normalized) and detects unsealed files.
 * - Guards against expired approvals, foreign repo approvals, and stale base commits.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const VALID_DECISIONS = ['approved', 'approved-with-notes'];
const CWD = process.cwd();

// Guardrail paths that require explicit permission / dedicated change tasks
export const GUARDRAIL_PATTERNS = [
  '.githooks/**',
  'scripts/check-approval.mjs',
  '.github/workflows/**',
  '.claude/**',
  '.gemini/**',
  'skills/master-foundation/**',
  '.agents/skills/master-foundation/**'
];

// Sensitive secret file patterns forbidden from being sealed or exposed
export const FORBIDDEN_SECRET_PATTERNS = [
  '**/.env',
  '**/.env.*',
  '**/*.pem',
  '**/*.key',
  '**/id_rsa',
  '**/id_ed25519',
  '**/credentials.json'
];

/**
 * RFC 8785 Canonical JSON serialization (JSON Canonicalization Scheme - JCS)
 * Keys sorted by UTF-16 code units; excludes `signature` and undefined values;
 * standard formatting without whitespace.
 */
export function canonicalize(val) {
  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return 'null';
    return Object.is(val, -0) ? '0' : JSON.stringify(val);
  }
  if (typeof val === 'string') return JSON.stringify(val);
  if (Array.isArray(val)) {
    return '[' + val.map(canonicalize).join(',') + ']';
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val)
      .filter((k) => k !== 'signature' && val[k] !== undefined)
      .sort();
    return '{' + keys.map((k) => `${JSON.stringify(k)}:${canonicalize(val[k])}`).join(',') + '}';
  }
  return undefined;
}

export function isBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

// Text: normalize CRLF -> LF (Windows vs Linux CI). Binary: hash raw bytes.
export function computeSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  if (isBinary(buf)) return crypto.createHash('sha256').update(buf).digest('hex');
  const normalized = buf.toString('utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

export function insideCwd(p, root = CWD) {
  const relPath = path.relative(root, p);
  return relPath !== '' && !relPath.startsWith('..') && !path.isAbsolute(relPath);
}

export function rel(p, root = CWD) {
  return path.relative(root, p).replace(/\\/g, '/');
}

/**
 * Convert glob pattern to regular expression
 * Supports `**`, `*`, `?`
 */
export function globToRegex(glob) {
  const norm = glob.replace(/\\/g, '/').trim();
  let reStr = '^';
  for (let i = 0; i < norm.length; i++) {
    if (norm[i] === '*' && norm[i + 1] === '*') {
      if (norm[i + 2] === '/') {
        reStr += '(?:.+/)?';
        i += 2;
      } else {
        reStr += '.*';
        i++;
      }
    } else if (norm[i] === '*') {
      reStr += '[^/]*';
    } else if (norm[i] === '?') {
      reStr += '[^/]';
    } else if (['.', '+', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(norm[i])) {
      reStr += '\\' + norm[i];
    } else {
      reStr += norm[i];
    }
  }
  reStr += '$';
  return new RegExp(reStr);
}

export function matchAnyGlob(patterns, filePath) {
  if (!patterns || !Array.isArray(patterns) || patterns.length === 0) return false;
  const normPath = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const p of patterns) {
    const normP = p.replace(/\\/g, '/').replace(/^\.\//, '');
    if (globToRegex(normP).test(normPath)) return true;
  }
  return false;
}

/**
 * Cryptographic signing using RFC 8785 canonical representation
 */
export function signCanonical(data, privateKeyOrSecret, alg = 'ed25519') {
  const payload = canonicalize(data);
  if (alg === 'hmac-sha256') {
    return crypto.createHmac('sha256', privateKeyOrSecret).update(payload, 'utf8').digest('hex');
  }
  if (alg === 'rsa-sha256' || alg === 'rsa') {
    const signer = crypto.createSign('SHA256');
    signer.update(payload, 'utf8');
    return signer.sign(privateKeyOrSecret, 'hex');
  }
  // Default: Ed25519
  return crypto.sign(null, Buffer.from(payload, 'utf8'), privateKeyOrSecret).toString('hex');
}

/**
 * Cryptographic signature verification using RFC 8785 canonical representation
 */
export function verifyCanonical(data, signature, publicKeyOrSecret, alg = 'ed25519') {
  try {
    const payload = canonicalize(data);
    if (alg === 'hmac-sha256') {
      const expected = crypto.createHmac('sha256', publicKeyOrSecret).update(payload, 'utf8').digest('hex');
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
    }
    if (alg === 'rsa-sha256' || alg === 'rsa') {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(payload, 'utf8');
      return verifier.verify(publicKeyOrSecret, signature, 'hex');
    }
    // Default: Ed25519
    return crypto.verify(null, Buffer.from(payload, 'utf8'), publicKeyOrSecret, Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Load allowed signers configuration
 */
export function loadAllowedSigners(root = CWD) {
  const allowedFile = path.join(root, '.mf', 'allowed_signers.json');
  if (fs.existsSync(allowedFile)) {
    try {
      return JSON.parse(fs.readFileSync(allowedFile, 'utf8'));
    } catch (e) {
      console.warn(`[check-approval] WARNING: cannot parse ${allowedFile}: ${e.message}`);
    }
  }
  if (process.env.MF_ALLOWED_SIGNERS) {
    try {
      return JSON.parse(process.env.MF_ALLOWED_SIGNERS);
    } catch (e) {
      console.warn(`[check-approval] WARNING: cannot parse MF_ALLOWED_SIGNERS: ${e.message}`);
    }
  }
  return null;
}

/**
 * Perform Strict Scope Check against allowed_paths
 */
export function checkStrictScope(root = CWD, allowedPaths = [], options = {}) {
  const errors = [];
  const normalizedAllowed = Array.isArray(allowedPaths) ? allowedPaths : [allowedPaths];

  // 1. Path traversal check on allowedPaths themselves
  for (const pattern of normalizedAllowed) {
    if (typeof pattern !== 'string' || pattern.includes('..') || path.isAbsolute(pattern)) {
      errors.push(`Disallowed path pattern escapes workspace root: ${pattern}`);
    }
  }

  // 2. Collect changed files from git or supplied options
  const changedFiles = new Set(options.files || []);

  if (options.checkGit !== false && fs.existsSync(path.join(root, '.git'))) {
    try {
      if (options.base) {
        const out = execSync(`git diff --name-only ${options.base}...HEAD`, { cwd: root, encoding: 'utf8' });
        out.split('\n').map((s) => s.trim()).filter(Boolean).forEach((f) => changedFiles.add(f));
      } else {
        const diffCached = execSync('git diff --cached --name-only', { cwd: root, encoding: 'utf8' });
        diffCached.split('\n').map((s) => s.trim()).filter(Boolean).forEach((f) => changedFiles.add(f));
        const diffWorking = execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' });
        diffWorking.split('\n').map((s) => s.trim()).filter(Boolean).forEach((f) => changedFiles.add(f));
      }

      // Untracked files
      const untracked = execSync('git status --porcelain -uall', { cwd: root, encoding: 'utf8' });
      untracked.split('\n').map((s) => s.trim()).filter(Boolean).forEach((line) => {
        if (line.startsWith('??')) {
          changedFiles.add(line.slice(3).trim());
        }
      });
    } catch {
      // Git commands may fail in non-git test environments; options.files is used instead.
    }
  }

  // 3. Inspect every changed/untracked file
  for (const item of changedFiles) {
    const norm = item.replace(/\\/g, '/');
    const full = path.resolve(root, item);

    // Path traversal check
    if (!insideCwd(full, root)) {
      errors.push(`Path traversal detected outside repo: ${norm}`);
      continue;
    }

    // Symlink resolution check
    try {
      const lstat = fs.lstatSync(full);
      if (lstat.isSymbolicLink()) {
        const target = fs.realpathSync(full);
        const relTarget = rel(target, root);
        if (!insideCwd(target, root)) {
          errors.push(`Symlink ${norm} targets outside repository: ${relTarget}`);
          continue;
        }
        if (!matchAnyGlob(normalizedAllowed, relTarget)) {
          errors.push(`Symlink ${norm} resolved target "${relTarget}" is outside allowed_paths`);
          continue;
        }
      }
    } catch {
      // File may be deleted or inaccessible
    }

    // Guardrail protection check (EVAL-38)
    if (matchAnyGlob(GUARDRAIL_PATTERNS, norm)) {
      if (!options.allowGuardrails && !matchAnyGlob(normalizedAllowed, norm)) {
        errors.push(`Unauthorized modification to guardrail file: ${norm}`);
        continue;
      }
    }

    // Spec files are part of specification workflow, others must match allowed_paths
    if (!norm.startsWith('specs/') && !matchAnyGlob(normalizedAllowed, norm)) {
      errors.push(`Scope violation: "${norm}" is not in allowed_paths`);
    }
  }

  return errors;
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

// --- CLI Execution ---
const args = process.argv.slice(2);

// Only run CLI logic if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  runCli();
}



export function runCli() {
  // ---------------- CANONICALIZE HELPER ----------------
  if (args[0] === '--canonicalize') {
    const target = args[1];
    if (!target || !fs.existsSync(target)) {
      console.error('Usage: node scripts/check-approval.mjs --canonicalize <file.json>');
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(target, 'utf8'));
    process.stdout.write(canonicalize(data));
    process.exit(0);
  }

  // ---------------- STRICT SCOPE STANDALONE CHECK ----------------
  if (args[0] === '--check-scope') {
    let baseRef = null;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--base') baseRef = args[++i];
    }
    const approvalFiles = findApprovalFiles(path.resolve(CWD, 'specs'));
    let combinedAllowed = [];
    for (const af of approvalFiles) {
      try {
        const d = JSON.parse(fs.readFileSync(af, 'utf8'));
        if (Array.isArray(d.allowed_paths)) combinedAllowed.push(...d.allowed_paths);
      } catch {}
    }

    const errors = checkStrictScope(CWD, combinedAllowed, { base: baseRef });
    if (errors.length > 0) {
      console.error('[check-approval] STRICT SCOPE CHECK FAILED:');
      errors.forEach((e) => console.error(`  - ${e}`));
      process.exit(1);
    }
    console.log('[check-approval] Strict Scope check passed.');
    process.exit(0);
  }

  // ---------------- SEAL ----------------
  // node scripts/check-approval.mjs --seal <APPROVAL.json> --from-result <result.json> [files...]
  if (args[0] === '--seal') {
    const approvalTarget = args[1];
    let resultFile = null;
    let approverId = null;
    let allowedPathsArg = null;
    let expiresInDays = 7;
    let signKey = null;
    let signAlg = 'ed25519';
    let repoId = null;
    let baseCommit = null;
    let environment = 'development';
    const fileList = [];

    for (let i = 2; i < args.length; i++) {
      if (args[i] === '--from-result') resultFile = args[++i];
      else if (args[i] === '--approver') approverId = args[++i];
      else if (args[i] === '--allowed-paths') allowedPathsArg = args[++i];
      else if (args[i] === '--expires-in') expiresInDays = parseFloat(args[++i]);
      else if (args[i] === '--sign-key') signKey = args[++i];
      else if (args[i] === '--sign-alg') signAlg = args[++i];
      else if (args[i] === '--repo-id') repoId = args[++i];
      else if (args[i] === '--base-commit') baseCommit = args[++i];
      else if (args[i] === '--env') environment = args[++i];
      else fileList.push(args[i]);
    }

    if (!approvalTarget || !resultFile || fileList.length === 0) {
      console.error(
        'Usage: node scripts/check-approval.mjs --seal <APPROVAL.json> --from-result <result.json> <file1> [file2 ...] [options]'
      );
      process.exit(1);
    }

    const targetPath = path.resolve(CWD, approvalTarget);
    const resultPath = path.resolve(CWD, resultFile);

    if (!fs.existsSync(resultPath)) {
      console.error(
        `[check-approval] REFUSED: result file not found: ${resultFile}. Sealing requires a Plannotator gate result.`
      );
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
      console.error(
        `[check-approval] REFUSED: decision "${approvalData?.decision}" is not one of ${VALID_DECISIONS.join(', ')}.`
      );
      process.exit(1);
    }

    // Base commit determination
    if (!baseCommit && fs.existsSync(path.join(CWD, '.git'))) {
      try {
        baseCommit = execSync('git rev-parse HEAD', { cwd: CWD, encoding: 'utf8' }).trim();
      } catch {}
    }

    // Repository ID determination
    if (!repoId) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
        repoId = pkg.name || 'saas-project';
      } catch {
        repoId = path.basename(CWD);
      }
    }

    // Build v6.5 fields
    approvalData.approval_id = approvalData.approval_id || crypto.randomUUID();
    approvalData.approver_id = approverId || approvalData.approver_id || 'developer';
    approvalData.repository_id = repoId || approvalData.repository_id;
    approvalData.environment = environment || approvalData.environment;
    approvalData.base_commit = baseCommit || approvalData.base_commit || '0000000000000000000000000000000000000000';

    if (allowedPathsArg) {
      approvalData.allowed_paths = allowedPathsArg.split(',').map((s) => s.trim());
    } else if (!approvalData.allowed_paths) {
      approvalData.allowed_paths = ['src/**', 'docs/**', 'specs/**'];
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    approvalData.approved_at = now.toISOString();
    approvalData.expires_at = approvalData.expires_at || expiresAt.toISOString();

    // Seal spec files
    approvalData.spec_hashes = {};
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

      // EVAL-43: Secret file protection
      const relFile = rel(resolved);
      if (matchAnyGlob(FORBIDDEN_SECRET_PATTERNS, relFile)) {
        console.error(`[check-approval] REFUSED: attempting to seal sensitive secret file: ${relFile}`);
        process.exit(1);
      }

      const hash = computeSha256(resolved);
      approvalData.spec_hashes[relFile] = hash;
      approvalData.files[relFile] = hash; // backwards compatibility
      console.log(`[check-approval] Sealed ${relFile} -> ${hash.substring(0, 16)}...`);
    }

    approvalData.sealedAt = approvalData.approved_at;

    // Digital signature calculation if key provided or present
    if (signKey) {
      let resolvedKey = signKey;
      if (fs.existsSync(signKey)) {
        resolvedKey = fs.readFileSync(signKey, 'utf8');
      }
      const signature = signCanonical(approvalData, resolvedKey, signAlg);
      approvalData.signature = {
        alg: signAlg,
        value: signature
      };
      console.log(`[check-approval] Cryptographically signed with ${signAlg}.`);
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(approvalData, null, 2) + '\n', 'utf8');
    console.log(`[check-approval] Successfully sealed approval file: ${approvalTarget}`);
    process.exit(0);
  }

  // ---------------- VERIFY ----------------
  let targets = [];
  if (args.length > 0) {
    for (const arg of args) {
      if (arg.startsWith('--')) continue;
      const resolved = path.resolve(CWD, arg);
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        targets.push(...findApprovalFiles(resolved));
      } else if (fs.existsSync(resolved) && path.basename(resolved) === 'APPROVAL.json') {
        targets.push(resolved);
      } else {
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
  const allowedSigners = loadAllowedSigners(CWD);

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

    // 1. Decision validation
    if (!VALID_DECISIONS.includes(data.decision)) {
      console.error(`[check-approval] FAILED: ${relApproval} carries non-approved decision "${data.decision}".`);
      hasFailure = true;
      continue;
    }

    // 2. Expiration check (EVAL-37)
    if (data.expires_at) {
      const expDate = new Date(data.expires_at);
      if (isNaN(expDate.getTime()) || expDate < new Date()) {
        console.error(`[check-approval] EXPIRED: Approval ${relApproval} expired at ${data.expires_at}`);
        hasFailure = true;
        continue;
      }
    }

    // 3. Repository ID verification (EVAL-39)
    if (data.repository_id) {
      let expectedRepo = null;
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
        expectedRepo = pkg.name;
      } catch {
        expectedRepo = path.basename(CWD);
      }
      if (expectedRepo && data.repository_id !== expectedRepo && process.env.STRICT_REPO_CHECK === 'true') {
        console.error(
          `[check-approval] REPOSITORY MISMATCH: ${relApproval} issued for repository "${data.repository_id}", current is "${expectedRepo}".`
        );
        hasFailure = true;
        continue;
      }
    }

    // 4. Base commit check in git history (EVAL-37, EVAL-39)
    if (data.base_commit && fs.existsSync(path.join(CWD, '.git')) && process.env.STRICT_BASE_CHECK === 'true') {
      try {
        execSync(`git cat-file -e ${data.base_commit}^{commit}`, { cwd: CWD, stdio: 'ignore' });
      } catch {
        console.error(`[check-approval] INVALID BASE COMMIT: ${data.base_commit} does not exist in git history.`);
        hasFailure = true;
        continue;
      }
    }

    // 5. Digital signature verification (EVAL-35, EVAL-47)
    if (allowedSigners && !data.signature) {
      console.error(
        `[check-approval] UNSIGNED APPROVAL: ${relApproval} has approver "${data.approver_id}" without a digital signature, but allowed signers are registered.`
      );
      hasFailure = true;
      continue;
    }

    if (data.signature) {
      const sigObj = typeof data.signature === 'object' ? data.signature : { value: data.signature, alg: 'ed25519' };
      const approver = data.approver_id;

      if (allowedSigners) {
        const signerConfig = allowedSigners[approver];
        if (!signerConfig) {
          console.error(`[check-approval] UNAUTHORIZED SIGNER: "${approver}" is not in allowed signers list.`);
          hasFailure = true;
          continue;
        }
        const pubKey = signerConfig.publicKey || signerConfig.secret;
        const alg = signerConfig.alg || sigObj.alg || 'ed25519';
        const isValid = verifyCanonical(data, sigObj.value, pubKey, alg);
        if (!isValid) {
          console.error(`[check-approval] INVALID SIGNATURE in ${relApproval} for approver "${approver}".`);
          hasFailure = true;
          continue;
        }
        console.log(`  [OK] Valid cryptographic signature verified for approver "${approver}".`);
      } else if (sigObj.publicKey) {
        // Fallback: self-contained public key verification
        const isValid = verifyCanonical(data, sigObj.value, sigObj.publicKey, sigObj.alg || 'ed25519');
        if (!isValid) {
          console.error(`[check-approval] INVALID SIGNATURE in ${relApproval}.`);
          hasFailure = true;
          continue;
        }
        console.log(`  [OK] Valid cryptographic signature verified.`);
      }
    }

    // 6. Spec hashes & anti-drift verification (EVAL-46)
    const fileHashes = data.spec_hashes || data.files;
    if (!fileHashes || typeof fileHashes !== 'object' || Object.keys(fileHashes).length === 0) {
      console.error(`[check-approval] FAILED: ${relApproval} does not seal any files in "spec_hashes" or "files".`);
      hasFailure = true;
      continue;
    }

    const sealed = new Set();
    for (const [sealedFile, expectedHash] of Object.entries(fileHashes)) {
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

    // 7. Check for unsealed files in spec directory (EVAL-36)
    for (const doc of findSpecFiles(path.dirname(approvalPath))) {
      if (!sealed.has(path.resolve(doc))) {
        console.error(
          `[check-approval] UNSEALED SPEC FILE: "${rel(doc)}" exists in spec folder but is not sealed in ${relApproval}`
        );
        hasFailure = true;
      }
    }

    // 8. Strict Scope check if allowed_paths specified
    if (data.allowed_paths && (args.includes('--strict-scope') || process.env.STRICT_SCOPE_CHECK === 'true')) {
      const scopeErrors = checkStrictScope(CWD, data.allowed_paths);
      if (scopeErrors.length > 0) {
        console.error(`[check-approval] SCOPE VIOLATIONS for ${relApproval}:`);
        scopeErrors.forEach((e) => console.error(`  - ${e}`));
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
}

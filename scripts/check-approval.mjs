#!/usr/bin/env node
/**
 * Master Foundation Mechanical Approval & Anti-Drift Gate (v6.5.1)
 * - Signature-first, fail-closed RFC 8785 Canonical JSON verification (Ed25519 / RSA / HMAC).
 * - Zero shell execution (execFileSync only) to eliminate command injection and Windows escaping bugs.
 * - Strict Scope validation with explicit signed guardrail override (`allow_guardrails: true`).
 * - Spec archive lifecycle (`specs/archive/**`) preventing 7-day expiry lockouts after merge.
 * - Encrypted Ed25519 private key generation & signing via passphrase (TTY or env var).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import readline from 'node:readline';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const VALID_DECISIONS = ['approved', 'approved-with-notes'];
const CWD = process.cwd();

export const GUARDRAIL_PATTERNS = [
  '.githooks/**',
  'scripts/check-approval.mjs',
  'scripts/test-check-approval.mjs',
  '.github/workflows/**',
  '.github/CODEOWNERS',
  '.mf/**',
  '.claude/**',
  '.gemini/**',
  '.cursor/**',
  '.cursorrules',
  '.windsurfrules',
  'AGENTS.md',
  'CLAUDE.md',
  '.github/copilot-instructions.md',
  'skills/master-foundation/**',
  '.agents/skills/master-foundation/**'
];

export const FORBIDDEN_SECRET_PATTERNS = [
  '**/.env',
  '**/.env.*',
  '**/*.pem',
  '**/*.key',
  '**/id_rsa',
  '**/id_rsa*',
  '**/id_ed25519',
  '**/id_ed25519*',
  '**/.mf/id_*',
  '**/credentials.json'
];

export function isValidCommitSha(sha) {
  return typeof sha === 'string' && /^[0-9a-f]{7,40}$/i.test(sha);
}

export function isValidGitRef(ref) {
  return (
    typeof ref === 'string' &&
    ref.length > 0 &&
    !ref.startsWith('-') &&
    !/[\s\0\r\n~^:?*[\]\\]/.test(ref) &&
    !ref.includes('..')
  );
}

export function runGit(gitArgs, root = CWD, extraOpts = {}) {
  return execFileSync('git', gitArgs, {
    cwd: root,
    encoding: 'utf8',
    ...extraOpts
  });
}

/**
 * RFC 8785 Canonical JSON serialization (JSON Canonicalization Scheme - JCS).
 * Excludes `signature` at the root object only; preserves nested fields; normalizes
 * array `undefined` elements to `null` and `-0` to `0`.
 */
export function canonicalize(val, isRoot = true) {
  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return 'null';
    return Object.is(val, -0) ? '0' : JSON.stringify(val);
  }
  if (typeof val === 'string') return JSON.stringify(val);
  if (Array.isArray(val)) {
    const items = val.map((el) =>
      el === undefined || typeof el === 'function' || typeof el === 'symbol'
        ? 'null'
        : canonicalize(el, false)
    );
    return '[' + items.join(',') + ']';
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val)
      .filter((k) => (!isRoot || k !== 'signature') && val[k] !== undefined)
      .sort();
    return '{' + keys.map((k) => `${JSON.stringify(k)}:${canonicalize(val[k], false)}`).join(',') + '}';
  }
  return undefined;
}

export function isBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

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

export function isArchivedSpec(approvalPath, root = CWD) {
  return rel(approvalPath, root).startsWith('specs/archive/');
}

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
  return crypto.sign(null, Buffer.from(payload, 'utf8'), privateKeyOrSecret).toString('hex');
}

export function verifyCanonical(data, signature, publicKeyOrSecret, alg = 'ed25519') {
  try {
    const payload = canonicalize(data);
    if (alg === 'hmac-sha256') {
      const expected = crypto.createHmac('sha256', publicKeyOrSecret).update(payload, 'utf8').digest('hex');
      const sigBuf = Buffer.from(signature, 'hex');
      const expBuf = Buffer.from(expected, 'hex');
      if (sigBuf.length !== expBuf.length) return false;
      return crypto.timingSafeEqual(sigBuf, expBuf);
    }
    if (alg === 'rsa-sha256' || alg === 'rsa') {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(payload, 'utf8');
      return verifier.verify(publicKeyOrSecret, signature, 'hex');
    }
    return crypto.verify(null, Buffer.from(payload, 'utf8'), publicKeyOrSecret, Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

export function loadAllowedSigners(root = CWD, explicitSignersFile = null) {
  const candidates = explicitSignersFile
    ? [path.resolve(root, explicitSignersFile)]
    : [path.join(root, '.mf', 'allowed_signers.json')];

  for (const allowedFile of candidates) {
    if (fs.existsSync(allowedFile)) {
      try {
        return JSON.parse(fs.readFileSync(allowedFile, 'utf8'));
      } catch (err) {
        console.error(`[check-approval] ERROR: cannot parse signers file ${allowedFile}: ${err.message}`);
        return null;
      }
    }
  }

  if (!explicitSignersFile && process.env.MF_ALLOWED_SIGNERS) {
    try {
      return JSON.parse(process.env.MF_ALLOWED_SIGNERS);
    } catch (err) {
      console.error(`[check-approval] ERROR: cannot parse MF_ALLOWED_SIGNERS: ${err.message}`);
      return null;
    }
  }
  return null;
}

function parseNulList(output) {
  return output.split('\0').filter((entry) => entry.length > 0);
}

function parsePorcelainZUntracked(output) {
  const untracked = [];
  const tokens = output.split('\0');
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    const status = token.slice(0, 2);
    const filePath = token.slice(3);
    if (status === '??' && filePath) {
      untracked.push(filePath);
    } else if (status.includes('R') || status.includes('C')) {
      i++; // Skip the source path token following a rename/copy entry
    }
  }
  return untracked;
}

function collectGitChangedFiles(root, options = {}) {
  const changedFiles = new Set(options.files || []);
  if (options.checkGit === false || !fs.existsSync(path.join(root, '.git'))) {
    return { changedFiles, error: null };
  }

  try {
    if (options.base) {
      if (!isValidGitRef(options.base)) {
        return { changedFiles, error: `Invalid git base ref: ${options.base}` };
      }
      const out = runGit(['diff', '-z', '--name-only', `${options.base}...HEAD`], root);
      parseNulList(out).forEach((f) => changedFiles.add(f));
    } else if (options.stagedOnly) {
      const staged = runGit(['diff', '-z', '--cached', '--name-only'], root);
      parseNulList(staged).forEach((f) => changedFiles.add(f));
    } else {
      const staged = runGit(['diff', '-z', '--cached', '--name-only'], root);
      parseNulList(staged).forEach((f) => changedFiles.add(f));
      const working = runGit(['diff', '-z', '--name-only', 'HEAD'], root);
      parseNulList(working).forEach((f) => changedFiles.add(f));
      const porcelain = runGit(['status', '--porcelain', '-z', '-uall'], root);
      parsePorcelainZUntracked(porcelain).forEach((f) => changedFiles.add(f));
    }
  } catch (err) {
    return { changedFiles, error: `Git inspection failed: ${err.message}` };
  }

  return { changedFiles, error: null };
}

function checkSymlinkTarget(fullPath, normItem, root, normalizedAllowed) {
  try {
    const lstat = fs.lstatSync(fullPath);
    if (!lstat.isSymbolicLink()) return null;
    const target = fs.realpathSync(fullPath);
    const relTarget = rel(target, root);
    if (!insideCwd(target, root)) {
      return `Symlink ${normItem} targets outside repository: ${relTarget}`;
    }
    if (!matchAnyGlob(normalizedAllowed, relTarget)) {
      return `Symlink ${normItem} resolved target "${relTarget}" is outside allowed_paths`;
    }
  } catch {
    // Deleted or inaccessible file is checked via path rules below
  }
  return null;
}

export function checkStrictScope(root = CWD, allowedPaths = [], options = {}) {
  const errors = [];
  const normalizedAllowed = Array.isArray(allowedPaths) ? allowedPaths : [allowedPaths];
  const guardrailAllowed = Array.isArray(options.guardrailAllowedPaths)
    ? options.guardrailAllowedPaths
    : options.allowGuardrails
      ? normalizedAllowed
      : [];

  for (const pattern of normalizedAllowed) {
    if (typeof pattern !== 'string' || pattern.includes('..') || path.isAbsolute(pattern)) {
      errors.push(`Disallowed path pattern escapes workspace root: ${pattern}`);
    }
  }

  const { changedFiles, error: gitErr } = collectGitChangedFiles(root, options);
  if (gitErr) errors.push(gitErr);

  for (const item of changedFiles) {
    const norm = item.replace(/\\/g, '/');
    const full = path.resolve(root, item);

    if (!insideCwd(full, root)) {
      errors.push(`Path traversal detected outside repo: ${norm}`);
      continue;
    }

    const symlinkError = checkSymlinkTarget(full, norm, root, normalizedAllowed);
    if (symlinkError) {
      errors.push(symlinkError);
      continue;
    }

    if (matchAnyGlob(GUARDRAIL_PATTERNS, norm)) {
      const authorized = Boolean(options.allowGuardrails) && matchAnyGlob(guardrailAllowed, norm);
      if (!authorized) {
        errors.push(`Unauthorized modification to guardrail file: ${norm}`);
        continue;
      }
    }

    if (!norm.startsWith('specs/') && !matchAnyGlob(normalizedAllowed, norm)) {
      errors.push(`Scope violation: "${norm}" is not in allowed_paths`);
    }
  }

  return errors;
}

export function checkGuardrailsOnly(root = CWD, options = {}) {
  const errors = [];
  const allowGuardrails = options.allowGuardrails || process.env.ALLOW_GUARDRAILS === 'true';
  if (allowGuardrails) return errors;

  const { changedFiles, error: gitErr } = collectGitChangedFiles(root, options);
  if (gitErr) {
    errors.push(gitErr);
    return errors;
  }

  for (const item of changedFiles) {
    const norm = item.replace(/\\/g, '/');
    if (matchAnyGlob(GUARDRAIL_PATTERNS, norm)) {
      errors.push(`Unauthorized modification to guardrail file: ${norm}`);
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

function readMaskedPassphrase(promptLabel) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('Non-interactive terminal: pass --passphrase-env <VAR> (or --no-passphrase for key generation).'));
      return;
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const origWrite = rl._writeToOutput.bind(rl);
    let masking = false;
    rl._writeToOutput = (chunk) => {
      if (!masking) origWrite(chunk);
    };
    process.stdout.write(promptLabel);
    masking = true;
    rl.question('', (answer) => {
      masking = false;
      process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

async function resolvePassphraseForKeyGen(opts) {
  if (opts.noPassphrase) return null;
  if (opts.passphraseEnv) {
    const val = process.env[opts.passphraseEnv];
    if (!val) {
      throw new Error(`Environment variable "${opts.passphraseEnv}" is empty or unset.`);
    }
    return val;
  }
  if (!process.stdin.isTTY) {
    throw new Error('Cannot prompt for passphrase in non-interactive mode. Use --passphrase-env <VAR> or --no-passphrase.');
  }
  const first = await readMaskedPassphrase('Enter passphrase for new Ed25519 private key (leave empty only if using --no-passphrase): ');
  if (!first) {
    throw new Error('Empty passphrase refused. Re-run with --no-passphrase if you intentionally want an unencrypted key.');
  }
  const second = await readMaskedPassphrase('Confirm passphrase: ');
  if (first !== second) {
    throw new Error('Passphrases do not match.');
  }
  return first;
}

async function loadPrivateKeyForSigning(signKeyArg, alg, passphraseEnv) {
  const keyText = fs.existsSync(signKeyArg) ? fs.readFileSync(signKeyArg, 'utf8') : signKeyArg;
  if (alg === 'hmac-sha256') return keyText;

  if (keyText.includes('ENCRYPTED PRIVATE KEY')) {
    let passphrase = passphraseEnv ? process.env[passphraseEnv] : null;
    if (!passphrase) {
      passphrase = await readMaskedPassphrase('Enter passphrase for encrypted private key: ');
    }
    return crypto.createPrivateKey({ key: keyText, format: 'pem', passphrase });
  }
  return crypto.createPrivateKey({ key: keyText, format: 'pem' });
}

function resolveExpectedRepoId(root) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    if (pkg.name) return pkg.name;
  } catch {
    // Fallback to directory name when package.json is absent
  }
  return path.basename(root);
}

function verifySignatureStep(data, relApproval, allowedSigners, allowUnsigned) {
  if (!allowedSigners) {
    if (allowUnsigned) return { ok: true };
    return {
      ok: false,
      error: `[check-approval] NO TRUSTED SIGNERS CONFIGURED (fail-closed): ${relApproval} requires .mf/allowed_signers.json or MF_ALLOWED_SIGNERS.`
    };
  }

  if (!data.signature) {
    return {
      ok: false,
      error: `[check-approval] UNSIGNED APPROVAL: ${relApproval} has approver "${data.approver_id}" without a digital signature.`
    };
  }

  const sigObj = typeof data.signature === 'object' ? data.signature : { value: data.signature, alg: 'ed25519' };
  const approver = data.approver_id;
  const signerConfig = allowedSigners[approver];
  if (!signerConfig) {
    return {
      ok: false,
      error: `[check-approval] UNAUTHORIZED SIGNER: "${approver}" is not in allowed signers list.`
    };
  }

  const pubKey = signerConfig.publicKey || signerConfig.secret;
  const alg = signerConfig.alg || sigObj.alg || 'ed25519';
  if (!verifyCanonical(data, sigObj.value, pubKey, alg)) {
    return {
      ok: false,
      error: `[check-approval] INVALID SIGNATURE in ${relApproval} for approver "${approver}".`
    };
  }

  return { ok: true, approver };
}

function verifyApprovalRecord(approvalPath, ctx) {
  const relApproval = rel(approvalPath, ctx.root);
  const archived = isArchivedSpec(approvalPath, ctx.root);
  const errors = [];

  let data;
  try {
    data = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  } catch (err) {
    return { ok: false, archived, data: null, errors: [`[check-approval] INVALID JSON in ${relApproval}: ${err.message}`] };
  }

  // 1. Signature verification FIRST before trusting any payload field
  const sigCheck = verifySignatureStep(data, relApproval, ctx.allowedSigners, ctx.allowUnsigned);
  if (!sigCheck.ok) {
    return { ok: false, archived, data, errors: [sigCheck.error] };
  }
  if (sigCheck.approver && !ctx.quiet) {
    console.log(`  [OK] Valid cryptographic signature verified for approver "${sigCheck.approver}".`);
  }

  // 2. Decision validation
  if (!VALID_DECISIONS.includes(data.decision)) {
    return {
      ok: false,
      archived,
      data,
      errors: [`[check-approval] FAILED: ${relApproval} carries non-approved decision "${data.decision}".`]
    };
  }

  // 3. Repository ID verification
  if (data.repository_id && process.env.STRICT_REPO_CHECK !== 'false') {
    const expectedRepo = resolveExpectedRepoId(ctx.root);
    if (expectedRepo && data.repository_id !== expectedRepo) {
      return {
        ok: false,
        archived,
        data,
        errors: [
          `[check-approval] REPOSITORY MISMATCH: ${relApproval} issued for repository "${data.repository_id}", current is "${expectedRepo}".`
        ]
      };
    }
  }

  // 4. Expiration check (active specs only; archived specs under specs/archive/ are exempt)
  if (!archived && data.expires_at) {
    const expDate = new Date(data.expires_at);
    if (isNaN(expDate.getTime()) || expDate < new Date()) {
      return {
        ok: false,
        archived,
        data,
        errors: [`[check-approval] EXPIRED: Approval ${relApproval} expired at ${data.expires_at}`]
      };
    }
  }

  // 5. Base commit validation (execFileSync — zero shell invocation)
  if (data.base_commit && fs.existsSync(path.join(ctx.root, '.git')) && process.env.STRICT_BASE_CHECK !== 'false') {
    if (!isValidCommitSha(data.base_commit)) {
      return {
        ok: false,
        archived,
        data,
        errors: [`[check-approval] INVALID BASE COMMIT FORMAT: "${data.base_commit}" is not a valid git SHA.`]
      };
    }
    try {
      runGit(['cat-file', '-e', `${data.base_commit}^{commit}`], ctx.root, { stdio: 'ignore' });
    } catch {
      return {
        ok: false,
        archived,
        data,
        errors: [`[check-approval] INVALID BASE COMMIT: ${data.base_commit} does not exist in git history.`]
      };
    }
  }

  // 6. Spec hashes & anti-drift verification (enforced for both active and archived specs)
  const fileHashes = data.spec_hashes || data.files;
  if (!fileHashes || typeof fileHashes !== 'object' || Object.keys(fileHashes).length === 0) {
    return {
      ok: false,
      archived,
      data,
      errors: [`[check-approval] FAILED: ${relApproval} does not seal any files in "spec_hashes" or "files".`]
    };
  }

  const approvalDir = path.dirname(approvalPath);
  const sealed = new Set();
  for (const [sealedFile, expectedHash] of Object.entries(fileHashes)) {
    const normSealed = sealedFile.replace(/\\/g, '/');
    let resolved = path.resolve(ctx.root, sealedFile);
    if (
      !fs.existsSync(resolved) &&
      archived &&
      normSealed.startsWith('specs/') &&
      !normSealed.startsWith('specs/archive/')
    ) {
      const relocated = path.resolve(ctx.root, normSealed.replace(/^specs\//, 'specs/archive/'));
      if (insideCwd(relocated, approvalDir)) {
        resolved = relocated;
      }
    }
    if (!fs.existsSync(resolved)) resolved = path.resolve(approvalDir, sealedFile);
    if (!fs.existsSync(resolved)) {
      errors.push(`[check-approval] FILE MISSING: ${sealedFile} referenced in ${relApproval}`);
      continue;
    }
    if (!insideCwd(resolved, ctx.root)) {
      errors.push(`[check-approval] FAILED: sealed path outside repository: ${sealedFile}`);
      continue;
    }

    sealed.add(path.resolve(resolved));
    const actual = computeSha256(resolved);
    if (actual !== expectedHash) {
      errors.push(`[check-approval] HASH MISMATCH for: ${sealedFile}\n   Expected: ${expectedHash}\n   Actual:   ${actual}`);
    } else if (!ctx.quiet) {
      console.log(`  [OK] ${sealedFile}`);
    }
  }

  // 7. Unsealed files in spec directory
  for (const doc of findSpecFiles(path.dirname(approvalPath))) {
    if (!sealed.has(path.resolve(doc))) {
      errors.push(
        `[check-approval] UNSEALED SPEC FILE: "${rel(doc, ctx.root)}" exists in spec folder but is not sealed in ${relApproval}`
      );
    }
  }

  return { ok: errors.length === 0, archived, data, errors };
}

async function handleGenerateKey(args) {
  let signerId = null;
  let signerName = null;
  let force = false;
  let keyDir = path.join(os.homedir(), '.mf');
  let passphraseEnv = null;
  let noPassphrase = false;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--id') signerId = args[++i];
    else if (args[i] === '--name') signerName = args[++i];
    else if (args[i] === '--force') force = true;
    else if (args[i] === '--key-dir') keyDir = path.resolve(CWD, args[++i]);
    else if (args[i] === '--passphrase-env') passphraseEnv = args[++i];
    else if (args[i] === '--no-passphrase') noPassphrase = true;
  }

  if (!signerId) {
    try {
      const gitUser = runGit(['config', 'user.name'], CWD).trim();
      signerId = gitUser.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    } catch {
      // Fallback to default signer ID when git user.name is unset
    }
    signerId = signerId || 'lead_dev';
  }
  signerName = signerName || `${signerId} (Authorized Signer)`;

  if (!fs.existsSync(keyDir)) fs.mkdirSync(keyDir, { recursive: true });
  const privPath = path.join(keyDir, 'id_ed25519');
  const pubPath = path.join(keyDir, 'id_ed25519.pub');

  if (fs.existsSync(privPath) && !force) {
    console.log(`[check-approval] Existing private key found at: ${privPath}`);
    if (!fs.existsSync(pubPath)) {
      console.error('[check-approval] Missing corresponding public key.');
      process.exit(1);
    }
  } else {
    const passphrase = await resolvePassphraseForKeyGen({ passphraseEnv, noPassphrase });
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
    const privExportOpts = passphrase
      ? { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase }
      : { type: 'pkcs8', format: 'pem' };
    const privPem = privateKey.export(privExportOpts);
    const pubPem = publicKey.export({ type: 'spki', format: 'pem' });

    fs.writeFileSync(privPath, privPem, { mode: 0o600 });
    fs.writeFileSync(pubPath, pubPem);
    console.log(`[check-approval] Generated new ${passphrase ? 'encrypted ' : ''}Ed25519 key pair.`);
    console.log(`[check-approval] Private key saved to: ${privPath}`);
    if (!passphrase) {
      console.log('[check-approval] SECURITY NOTICE: Key is unencrypted. Use only inside an OS-sandboxed environment.');
    }
  }

  const repoMfDir = path.join(CWD, '.mf');
  if (!fs.existsSync(repoMfDir)) fs.mkdirSync(repoMfDir, { recursive: true });
  const signersPath = path.join(repoMfDir, 'allowed_signers.json');
  let signersData = {};
  if (fs.existsSync(signersPath)) {
    signersData = JSON.parse(fs.readFileSync(signersPath, 'utf8'));
  }

  const pubPem = fs.readFileSync(pubPath, 'utf8');
  signersData[signerId] = { name: signerName, publicKey: pubPem, alg: 'ed25519' };
  fs.writeFileSync(signersPath, JSON.stringify(signersData, null, 2) + '\n', 'utf8');
  console.log(`[check-approval] Signer "${signerId}" registered in: .mf/allowed_signers.json`);
  process.exit(0);
}

async function handleSeal(args) {
  const approvalTarget = args[1];
  let resultFile = null;
  let approverId = null;
  let allowedPathsArg = null;
  let expiresInDays = 7;
  let signKey = null;
  let signAlg = 'ed25519';
  let passphraseEnv = null;
  let repoId = null;
  let baseCommit = null;
  let environment = 'development';
  let allowGuardrails = false;
  const fileList = [];

  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--from-result') resultFile = args[++i];
    else if (args[i] === '--approver') approverId = args[++i];
    else if (args[i] === '--allowed-paths') allowedPathsArg = args[++i];
    else if (args[i] === '--expires-in') expiresInDays = parseFloat(args[++i]);
    else if (args[i] === '--sign-key') signKey = args[++i];
    else if (args[i] === '--sign-alg') signAlg = args[++i];
    else if (args[i] === '--passphrase-env') passphraseEnv = args[++i];
    else if (args[i] === '--repo-id') repoId = args[++i];
    else if (args[i] === '--base-commit') baseCommit = args[++i];
    else if (args[i] === '--env') environment = args[++i];
    else if (args[i] === '--allow-guardrails') allowGuardrails = true;
    else fileList.push(args[i]);
  }

  if (!approvalTarget || !resultFile || fileList.length === 0) {
    console.error(
      'Usage: node scripts/check-approval.mjs --seal <APPROVAL.json> --from-result <result.json> --allowed-paths "<glob1,glob2>" <file1> [file2 ...] [options]'
    );
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

  if (allowedPathsArg) {
    approvalData.allowed_paths = allowedPathsArg.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (!Array.isArray(approvalData.allowed_paths) || approvalData.allowed_paths.length === 0) {
    console.error('[check-approval] REFUSED: --allowed-paths is mandatory when sealing an approval (no implicit wildcard default).');
    process.exit(1);
  }

  if (!baseCommit && fs.existsSync(path.join(CWD, '.git'))) {
    try {
      baseCommit = runGit(['rev-parse', 'HEAD'], CWD).trim();
    } catch {
      // Unborn repository with no commits yet
    }
  }
  if (baseCommit && !isValidCommitSha(baseCommit)) {
    console.error(`[check-approval] REFUSED: invalid --base-commit SHA "${baseCommit}".`);
    process.exit(1);
  }

  approvalData.approval_id = approvalData.approval_id || crypto.randomUUID();
  approvalData.approver_id = approverId || approvalData.approver_id || 'developer';
  approvalData.repository_id = repoId || approvalData.repository_id || resolveExpectedRepoId(CWD);
  approvalData.environment = environment || approvalData.environment;
  approvalData.base_commit = baseCommit || approvalData.base_commit || '0000000000000000000000000000000000000000';
  if (allowGuardrails) {
    approvalData.allow_guardrails = true;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  approvalData.approved_at = now.toISOString();
  approvalData.expires_at = approvalData.expires_at || expiresAt.toISOString();
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
    const relFile = rel(resolved);
    if (matchAnyGlob(FORBIDDEN_SECRET_PATTERNS, relFile)) {
      console.error(`[check-approval] REFUSED: attempting to seal sensitive secret file: ${relFile}`);
      process.exit(1);
    }
    const hash = computeSha256(resolved);
    approvalData.spec_hashes[relFile] = hash;
    approvalData.files[relFile] = hash;
    console.log(`[check-approval] Sealed ${relFile} -> ${hash.substring(0, 16)}...`);
  }

  approvalData.sealedAt = approvalData.approved_at;
  delete approvalData.signature;

  if (signKey) {
    const keyObj = await loadPrivateKeyForSigning(signKey, signAlg, passphraseEnv);
    const signature = signCanonical(approvalData, keyObj, signAlg);
    approvalData.signature = { alg: signAlg, value: signature };
    console.log(`[check-approval] Cryptographically signed with ${signAlg}.`);
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(approvalData, null, 2) + '\n', 'utf8');
  console.log(`[check-approval] Successfully sealed approval file: ${approvalTarget}`);
  process.exit(0);
}

function handleCheckScope(args) {
  let baseRef = null;
  let explicitAllowed = null;
  let signersFile = null;
  let stagedOnly = false;
  let allowUnsigned = false;
  let cliAllowGuardrails = process.env.ALLOW_GUARDRAILS === 'true';

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--base') baseRef = args[++i];
    else if (args[i] === '--allowed-paths') explicitAllowed = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (args[i] === '--signers-file') signersFile = args[++i];
    else if (args[i] === '--staged-only') stagedOnly = true;
    else if (args[i] === '--allow-guardrails') cliAllowGuardrails = true;
    else if (args[i] === '--allow-unsigned') allowUnsigned = true;
  }

  const allowedSigners = loadAllowedSigners(CWD, signersFile);
  let combinedAllowed = explicitAllowed ? [...explicitAllowed] : [];
  let guardrailAllowedPaths = cliAllowGuardrails ? [...combinedAllowed] : [];
  let allowGuardrails = cliAllowGuardrails;

  if (!explicitAllowed) {
    const approvalFiles = findApprovalFiles(path.resolve(CWD, 'specs'));
    const activeFiles = approvalFiles.filter((af) => !isArchivedSpec(af, CWD));

    for (const af of activeFiles) {
      const verdict = verifyApprovalRecord(af, {
        root: CWD,
        allowedSigners,
        allowUnsigned,
        quiet: true
      });
      if (!verdict.ok) {
        console.error(`[check-approval] STRICT SCOPE REFUSED: invalid active approval ${rel(af)}:`);
        verdict.errors.forEach((e) => console.error(`  - ${e}`));
        process.exit(1);
      }
      if (Array.isArray(verdict.data.allowed_paths)) {
        combinedAllowed.push(...verdict.data.allowed_paths);
        if (verdict.data.allow_guardrails === true) {
          allowGuardrails = true;
          guardrailAllowedPaths.push(...verdict.data.allowed_paths);
        }
      }
    }
  }

  if (combinedAllowed.length === 0) {
    const guardrailErrors = checkGuardrailsOnly(CWD, { base: baseRef, stagedOnly, allowGuardrails });
    if (guardrailErrors.length > 0) {
      console.error('[check-approval] GUARDRAIL VIOLATION DETECTED:');
      guardrailErrors.forEach((e) => console.error(`  - ${e}`));
      console.error('To authorize changes to guardrail files, seal an approval with --allow-guardrails or pass --allow-guardrails.');
      process.exit(1);
    }
    console.log('[check-approval] No active APPROVAL.json with allowed_paths found. Guardrails clean. OK.');
    process.exit(0);
  }

  const errors = checkStrictScope(CWD, combinedAllowed, {
    base: baseRef,
    stagedOnly,
    allowGuardrails,
    guardrailAllowedPaths: cliAllowGuardrails ? combinedAllowed : guardrailAllowedPaths
  });
  if (errors.length > 0) {
    console.error('[check-approval] STRICT SCOPE CHECK FAILED:');
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log('[check-approval] Strict Scope check passed.');
  process.exit(0);
}

function handleVerify(args) {
  let signersFile = null;
  let baseRef = null;
  let stagedOnly = false;
  let strictScope = process.env.STRICT_SCOPE_CHECK !== 'false';
  let cliAllowGuardrails = process.env.ALLOW_GUARDRAILS === 'true';
  let allowUnsigned = false;
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--signers-file') signersFile = args[++i];
    else if (args[i] === '--base') baseRef = args[++i];
    else if (args[i] === '--staged-only') stagedOnly = true;
    else if (args[i] === '--strict-scope') strictScope = true;
    else if (args[i] === '--allow-guardrails') cliAllowGuardrails = true;
    else if (args[i] === '--allow-unsigned') allowUnsigned = true;
    else if (!args[i].startsWith('--')) positional.push(args[i]);
  }

  let targets = [];
  if (positional.length > 0) {
    for (const arg of positional) {
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
    if (strictScope) {
      const guardrailErrors = checkGuardrailsOnly(CWD, { base: baseRef, stagedOnly, allowGuardrails: cliAllowGuardrails });
      if (guardrailErrors.length > 0) {
        console.error('[check-approval] GUARDRAIL VIOLATION DETECTED:');
        guardrailErrors.forEach((e) => console.error(`  - ${e}`));
        process.exit(1);
      }
    }
    console.log('[check-approval] No APPROVAL.json files found to check. Guardrails clean. OK.');
    process.exit(0);
  }

  let hasFailure = false;
  const allowedSigners = loadAllowedSigners(CWD, signersFile);
  const activeAllowedPaths = [];
  const activeGuardrailPaths = [];
  let signedGuardrailsAllowed = cliAllowGuardrails;

  for (const approvalPath of targets) {
    const relApproval = rel(approvalPath);
    console.log(`[check-approval] Checking ${relApproval}${isArchivedSpec(approvalPath) ? ' (archived)' : ''}...`);

    const verdict = verifyApprovalRecord(approvalPath, {
      root: CWD,
      allowedSigners,
      allowUnsigned,
      quiet: false
    });
    if (!verdict.ok) {
      verdict.errors.forEach((e) => console.error(e));
      hasFailure = true;
      continue;
    }

    if (!verdict.archived && Array.isArray(verdict.data.allowed_paths)) {
      activeAllowedPaths.push(...verdict.data.allowed_paths);
      if (verdict.data.allow_guardrails === true) {
        signedGuardrailsAllowed = true;
        activeGuardrailPaths.push(...verdict.data.allowed_paths);
      }
    }
  }

  if (!hasFailure && strictScope && activeAllowedPaths.length > 0) {
    const scopeErrors = checkStrictScope(CWD, activeAllowedPaths, {
      base: baseRef,
      stagedOnly,
      allowGuardrails: signedGuardrailsAllowed,
      guardrailAllowedPaths: cliAllowGuardrails ? activeAllowedPaths : activeGuardrailPaths
    });
    if (scopeErrors.length > 0) {
      console.error('[check-approval] SCOPE VIOLATIONS:');
      scopeErrors.forEach((e) => console.error(`  - ${e}`));
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.error('[check-approval] FAILED: Spec approval verification failed.');
    process.exit(1);
  }
  console.log('[check-approval] SUCCESS: All specs approved and sealed without drift.');
  process.exit(0);
}

export async function runCli() {
  const args = process.argv.slice(2);
  try {
    if (args[0] === '--generate-key') {
      await handleGenerateKey(args);
    } else if (args[0] === '--canonicalize') {
      const target = args[1];
      if (!target || !fs.existsSync(target)) {
        console.error('Usage: node scripts/check-approval.mjs --canonicalize <file.json>');
        process.exit(1);
      }
      const parsed = JSON.parse(fs.readFileSync(target, 'utf8'));
      process.stdout.write(canonicalize(parsed));
      process.exit(0);
    } else if (args[0] === '--check-scope') {
      handleCheckScope(args);
    } else if (args[0] === '--seal') {
      await handleSeal(args);
    } else {
      handleVerify(args);
    }
  } catch (err) {
    console.error(`[check-approval] ERROR: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  runCli();
}

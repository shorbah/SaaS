#!/usr/bin/env node
// Regression tests for check-approval.mjs. No dependencies. Exit 1 on any failure.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-approval.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mf-approval-'));
const SPEC = 'specs/001';
const w = (rel, data) => { const p = path.join(tmp, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, data); };
const run = (...a) => spawnSync('node', [SCRIPT, ...a], { cwd: tmp, encoding: 'utf8' });
const reset = () => { fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true }); fs.rmSync(path.join(tmp, 'res.json'), { force: true }); w(`${SPEC}/spec.md`, '# spec\nline\n'); };
const seal = (decision = 'approved') => { w('res.json', JSON.stringify({ decision, feedback: '' })); return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`); };

let failed = 0;
function t(name, fn) {
  reset();
  let ok = false, why = '';
  try { const r = fn(); ok = r === true; why = ok ? '' : String(r); } catch (e) { why = e.message; }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + why}`);
  if (!ok) failed++;
}

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
  const d = JSON.parse(fs.readFileSync(p, 'utf8')); d.decision = 'feedback'; fs.writeFileSync(p, JSON.stringify(d));
  return run().status === 1;
});
t('T6 editing sealed file is detected', () => { seal(); w(`${SPEC}/spec.md`, '# changed\n'); return run().status === 1; });
t('T7 CRLF vs LF of same text does not break the seal', () => { seal(); w(`${SPEC}/spec.md`, '# spec\r\nline\r\n'); return run().status === 0; });
t('T8 unsealed .json file in spec folder is detected', () => { seal(); w(`${SPEC}/schema.json`, '{}'); return run().status === 1; });
t('T9 unsealed nested file is detected', () => { seal(); w(`${SPEC}/contracts/api.md`, '# c\n'); return run().status === 1; });
t('T10 binary file is hashed raw and verifies', () => {
  w(`${SPEC}/img.png`, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x00, 0xff]));
  w('res.json', '{"decision":"approved"}');
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`, `${SPEC}/img.png`).status === 0 && run().status === 0;
});
t('T11 mistyped verify argument fails closed', () => run('specs/typo/APPROVAL.json').status === 1);
t('T12 sealing a file outside the repo is refused', () => {
  w('res.json', '{"decision":"approved"}');
  const outside = path.join(os.tmpdir(), 'mf-outside.md'); fs.writeFileSync(outside, 'x');
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', outside).status === 1;
});
t('T13 no specs folder is OK (exit 0)', () => { fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true }); return run().status === 0; });

fs.rmSync(tmp, { recursive: true, force: true });
console.log(failed === 0 ? '\nALL TESTS PASSED' : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);

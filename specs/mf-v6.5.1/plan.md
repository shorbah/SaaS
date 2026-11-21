# خطة التنفيذ المعمارية والأمنية — Master Foundation v6.5.1

<div dir="rtl" style="text-align: right; direction: rtl;">

> **التصنيف:** `L3 — مهمة مستقلة لتطوير وتقوية ملفات الحراسة الأمنية`  
> **فرع العمل:** `fix/mf-v6.5.1-hardening`  
> **المرجع الوظيفي:** `specs/mf-v6.5.1/spec.md`  
> **التفويض:** محلي فقط (كود واختبارات وتوثيق داخل المستودع؛ لا دفع لـ `main` ولا نشر خارجي دون تفويض تشغيلي مستقل).

---

## 1. ملخص الهدف ونطاق التغيير (`allowed_paths`)

تهدف الترقية `v6.5.1` إلى سد الفجوة بين الصرامة المعمارية الموثقة في Master Foundation وبين التنفيذ الفعلي في محرك الفحص والـ CI والاختبارات وملفات القواعد، عبر **9 حزم عمل متكاملة (FR-01 إلى FR-09)** دون إضافة أي اعتماديات خارجية (`Zero External Dependencies`).

### المسارات المسموح بتعديلها حصراً (`allowed_paths`):
- `scripts/check-approval.mjs`
- `scripts/test-check-approval.mjs`
- `scripts/generate-bundle.mjs`
- `scripts/setup-device.ps1`
- `.githooks/pre-commit`
- `.github/workflows/check-approval.yml`
- `.github/CODEOWNERS`
- `.agents/skills/master-foundation/**`
- `skills/master-foundation/**`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursorrules`
- `.windsurfrules`
- `.cursor/rules/master-foundation.mdc`
- `.github/copilot-instructions.md`
- `README.md`
- `MASTER_FOUNDATION_V6_5_BUNDLE.md`
- `specs/mf-v6.5.1/**`

> **ملاحظة حراسة:** لأن هذه مهمة مخصصة لتطوير ملفات الحراسة، سيُختم `specs/mf-v6.5.1/APPROVAL.json` بتفويض صريح `allow_guardrails: true` وتوقيعك الرقمي Ed25519.

---

## 2. التصميم التقني التفصيلي حسب الملف

### أ. محرك الفحص والتوقيع (`scripts/check-approval.mjs`)
1. **منع حقن الأوامر (FR-01):**
   - إنشاء دالة مساعدة `runGit(args, root)` تستخدم `execFileSync('git', args, { cwd: root, encoding: 'utf8' })` بدون Shell.
   - التحقق الصارم قبل استدعاء Git:
     - `isValidCommitSha(sha)`: يطابق `/^[0-9a-f]{7,40}$/i`.
     - `isValidGitRef(ref)`: يرفض ما يبدأ بـ `-` أو يحتوي مسافات/محارف تحكم/`..`.
2. **ترتيب التحقق الأمني والفشل المغلق (FR-02):**
   - إعادة ترتيب خطوات `verify` لكل `APPROVAL.json`:
     1. قراءة JSON والتحقق من البنية الأساسية.
     2. **التحقق من التوقيع الرقمي أولاً** (قبل `base_commit` و`spec_hashes`):
        - إذا لم تتوفر `allowedSigners` (لا `.mf/allowed_signers.json` ولا `MF_ALLOWED_SIGNERS`) ولم يُمرر `--allow-unsigned`: **فشل فوري (exit 1)**.
        - إذا توفرت `allowedSigners`: يُشترط وجود توقيع رقمي سليم ومطابق لهوية مخولة.
     3. التحقق من `decision` (`approved` أو `approved-with-notes`).
     4. التحقق من `repository_id`.
     5. التحقق من `expires_at` (للمواصفات النشطة فقط — خارج `specs/archive/`).
     6. التحقق من `base_commit` (عبر `runGit(['cat-file', '-e', `${sha}^{commit}`])`).
     7. التحقق من بصمات `spec_hashes` وعدم وجود ملفات غير مختومة داخل مجلد المواصفة.
     8. فحص النطاق الصارم (`checkStrictScope`) للمواصفات النشطة فقط.
3. **حراسة ملفات البنية الأمنية (FR-03):**
   - توسيع `GUARDRAIL_PATTERNS` لتشمل `.mf/**`, `scripts/test-check-approval.mjs`, `.github/CODEOWNERS`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.cursor/rules/**`, `.github/copilot-instructions.md`.
   - تعديل شرط الحراسة في `checkStrictScope`:
     - أي ملف يطابق `GUARDRAIL_PATTERNS` **يُرفض دائماً** حتى لو طابق `allowed_paths`، **إلا إذا** كان `options.allowGuardrails === true` (قادم من حقل `allow_guardrails: true` داخل `APPROVAL.json` موقع رقمياً، أو عبر علم CLI `--allow-guardrails` في حالات الطوارئ المصرح بها) **ومطابقاً** لـ `allowed_paths`.
4. **دورة حياة `APPROVAL.json` و`specs/archive/` و`--allowed-paths` الإلزامي (FR-04):**
   - دالة `isArchivedSpec(approvalPath, root)`: تتحقق مما إذا كان المسار النسبي يبدأ بـ `specs/archive/`.
   - للمواصفات المؤرشفة: يُتحقق من التوقيع والقرار وبصمات الملفات (منع العبث التاريخي)، وتُعفى من `expires_at` ولا تُدرج في `allowed_paths` النشطة.
   - في `--seal`: إزالة الافتراضي `['src/**', 'docs/**', 'specs/**']` وإلزام تمرير `--allowed-paths` صراحة (وإلا exit 1). دعم علم `--allow-guardrails` لكتابة `"allow_guardrails": true` داخل الحمولة قبل التوقيع.
   - في `--check-scope`: لا تُجمع `allowed_paths` إلا من المواصفات النشطة (غير المؤرشفة، غير المنتهية، ذات القرار المعتمد، وذات التوقيع الصالح عند وجود `allowedSigners`).
5. **تشفير المفتاح الخاص Ed25519 بكلمة مرور (FR-05):**
   - في `--generate-key`:
     - يدعم التشفير التلقائي عند وجود TTY تفاعلي (قراءة كلمة مرور مخفية مع تأكيدها)، أو عبر `--passphrase-env <ENV_NAME>`، مع خيار `--no-passphrase` لمن يختار التخزين غير المشفر داخل Sandbox.
     - التصدير بـ `privateKey.export({ type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase })`.
   - في `--seal --sign-key`:
     - يكتشف تلقائياً إن كان المفتاح مشفراً (`ENCRYPTED PRIVATE KEY`) ويقرأ كلمة المرور تفاعلياً (أو من `--passphrase-env`) لتمرير `{ key, passphrase }` إلى `crypto.createPrivateKey`.
   - في `setup-device.ps1`: تحديث خطوة توليد المفتاح لتتوافق مع خيار كلمة المرور مع توضيح واضح للمطور.
6. **تصحيح `canonicalize` و`git status -z` و`--staged-only` (FR-06):**
   - `canonicalize(val, isRoot = true)`: استبعاد `signature` فقط عندما `isRoot === true`؛ وتحويل `undefined` داخل المصفوفات إلى `'null'`.
   - `collectChangedFiles(root, options)`: استخدام `git diff -z` و`git status --porcelain -z -uall` (مفصول بـ `\0`) للتعامل الدقيق مع المسافات والأسماء العربية، ودعم `options.stagedOnly` لاستخدامه في `pre-commit`.

### ب. مسار الـ CI و `CODEOWNERS` و `pre-commit`
1. **`.github/workflows/check-approval.yml` (FR-07):**
   - خطوة **Trusted Verifier Checkout**: استخراج `scripts/check-approval.mjs` و`.mf/allowed_signers.json` من `origin/$BASE_REF` إلى مجلد معزول خارج الشجرة (`/tmp/mf-trusted`) وتشغيل التحقق باستخدامهما عبر `--signers-file /tmp/mf-trusted/allowed_signers.json`، فلا يستطيع أي PR إضعاف أداة الفحص أو حقن مفتاح مزوّر. (مع fallback نظيف لملفات المستودع فقط عند أول تشغيل لفرع لم تُضف له الخيارات بعد).
   - استخدام `$MERGE_BASE` فعلياً كمرجع للمقارنة (`--base "$MERGE_BASE"`).
   - إصلاح فحص Symlinks باستخدام `git diff -z --name-only "$MERGE_BASE"...HEAD` وشرط `"$PWD"/*`.
2. **`.github/CODEOWNERS` (FR-07):**
   - حماية: `specs/**/APPROVAL.json`, `.mf/**`, `scripts/**`, `.github/**`, `.githooks/**`.
3. **`.githooks/pre-commit` (FR-06):**
   - استدعاء `node scripts/check-approval.mjs --strict-scope --staged-only` حتى لا تعطل المسودات غير المجهزة عمل المطور.

### ج. حزمة الاختبارات (`scripts/test-check-approval.mjs`) (FR-08)
- استبدال الاختبارات الصورية والمكررة باختبارات حقيقية تتبع `test-guard`:
  - دورة **Ed25519 الكاملة** عبر CLI (غير مشفر + مشفر بكلمة مرور + رفض كلمة المرور الخاطئة + كشف التلاعب).
  - رفض Command Injection في `base_commit`.
  - Fail-Closed عند غياب `.mf/allowed_signers.json`.
  - حظر تعديل `.mf/allowed_signers.json` و`.githooks/pre-commit` حتى مع `allowed_paths: ["**"]`، والقبول فقط مع `allow_guardrails: true` الموقع رقمياً.
  - رفض `--seal` بدون `--allowed-paths`.
  - نجاح المواصفة المؤرشفة في `specs/archive/` حتى بعد انتهاء `expires_at` مع كشف أي عبث في ملفاتها.
  - اختبار `canonicalize` (مفتاح `signature` متداخل + `undefined` في مصفوفة) وأسماء ملفات بمسافات/عربية في مستودع Git مؤقت.
  - اختبار `--check` لمزامنة ملفات القواعد.

### د. توحيد ملفات القواعد والتوثيق (FR-09)
- إضافة مولّد قوالب القواعد داخل `scripts/generate-bundle.mjs` (مع `--sync-rules` و`--check-rules`) لتوحيد كتلة `v6.5.1` تلقائياً في:
  `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.cursor/rules/master-foundation.mdc`, `.github/copilot-instructions.md`.
- تصحيح `skills-map.md`, `trigger-evals.md`, `workflow.md`, `security.md`, `README.md`, `SKILL.md` (v6.5.1)، ومزامنة `.agents/skills/master-foundation` → `skills/master-foundation`، وتوليد `MASTER_FOUNDATION_V6_5_BUNDLE.md`.

---

## 3. المخاطر وخطة التراجع (Risk & Rollback)

| الخطر المحتمل | التخفيف المعتمد |
|:---|:---|
| كسر توافقية اختبارات سابقة في `check-approval.mjs` بسبب فرض Fail-Closed أو إلزام `--allowed-paths` | تحديث كافة الاختبارات والوثائق في نفس الإصدار مع توفير `--allow-unsigned` حصراً لبيئات الاختبار المحلية المؤقتة. |
| تعثّر أول تشغيل في CI لأن `origin/main` لا يزال على `v6.5.0` قبل دمج هذا الـ PR | فحص دعم السكربت في `origin/$BASE_REF` للخيارات الجديدة مع مسار انتقالي آمن وموثّق. |
| **خطة التراجع (Rollback):** | العمل بالكامل على فرع معزول `fix/mf-v6.5.1-hardening` دون لمس `main`؛ التراجع الكامل يتم فورياً بـ `git checkout main` أو `git revert` لالتزام الدمج. |

---

## 4. بوابة التحقق والقبول قبل الإنجاز
1. اجتياز 100% من اختبارات `node scripts/test-check-approval.mjs` (تغطي كل متطلبات FR-01..FR-09).
2. اجتياز `node scripts/generate-bundle.mjs --check-rules` وتطابق `.agents/skills/master-foundation` مع `skills/master-foundation`.
3. اجتياز `node scripts/check-approval.mjs --strict-scope` مع `specs/mf-v6.5.1/APPROVAL.json` الموقع رقمياً بمفتاحك.
4. مراجعة `clean-code-guard` و`test-guard` و`docs-guard` قبل الإعلان عن الإنجاز.

</div>

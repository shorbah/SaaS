# المواصفات الوظيفية والأمنية — Master Foundation v6.5.1 (Hardening & Parity)

> **المستوى:** `L3` — مهمة مستقلة مخصصة لتطوير وتقوية ملفات الحراسة الأمنية (`security.md §2`).
> **الهدف:** إغلاق الثغرات الأمنية والمنطقية المكتشفة في التدقيق السطري للإصدار `v6.5.0`، وإصلاح دورة حياة `APPROVAL.json`، وتحويل الاختبارات الصورية إلى اختبارات حقيقية، وتوحيد كافة ملفات القواعد والتوثيق من مصدر حقيقة واحد — دون تغيير فلسفة المستويات (L0–L3).

---

## 1. المتطلبات الأمنية والوظيفية (Functional & Security Requirements)

### FR-01: القضاء التام على حقن الأوامر (Zero Command Injection)
- استبدال كافة استدعاءات `execSync` التي تدمج متغيرات نصية داخل [`scripts/check-approval.mjs`](../../scripts/check-approval.mjs) بـ `execFileSync('git', [...args])` بدون تشغيل Shell.
- التحقق الصارم من صيغة `base_commit` عبر تعبير منتظم `^[0-9a-f]{7,40}$` (غير حساس لحالة الأحرف)، ومن صيغة `baseRef` ضد أي معاملات تبدأ بـ `-` أو محارف تحكم.
- **معيار القبول:** إدخال حمولة حقن أوامر في `base_commit` (مثل `HEAD; echo PWNED`) يُرفض فوراً (exit 1) دون تنفيذ أي أمر خارجي.

### FR-02: تقديم التحقق من التوقيع الرقمي والفشل المغلق (Signature-First & Fail-Closed)
- التحقق من صحة التوقيع الرقمي (`signature`) مقابل `.mf/allowed_signers.json` (أو `MF_ALLOWED_SIGNERS`) **كأول خطوة أمنية** بعد قراءة JSON، قبل تمرير `base_commit` أو أي حقل آخر إلى Git أو نظام الملفات.
- فرض **الفشل المغلق (Fail-Closed)**: إذا وُجد ملف `APPROVAL.json` نشط ولم يوجد أي ملف `.mf/allowed_signers.json` أو متغير `MF_ALLOWED_SIGNERS` (إلا عند تمرير `--allow-unsigned` صراحة في بيئة اختبار معزولة فقط)، يُرفض التحقق فوراً برمز خروج `1`.
- **معيار القبول:** حذف `.mf/allowed_signers.json` أو تقديم `APPROVAL.json` غير موقع يفشل التحقق افتراضياً (exit 1).

### FR-03: توسيع وحماية مسارات الحراسة (Guardrail Integrity & Explicit Signed Override)
- توسيع `GUARDRAIL_PATTERNS` لتشمل جميع ملفات الحراسة وجذر الثقة:
  - `.githooks/**`
  - `scripts/check-approval.mjs`
  - `scripts/test-check-approval.mjs`
  - `.github/workflows/**`
  - `.github/CODEOWNERS`
  - `.mf/**`
  - `.claude/**`, `.gemini/**`, `.cursor/**`, `.cursorrules`, `.windsurfrules`
  - `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`
  - `skills/master-foundation/**`, `.agents/skills/master-foundation/**`
- حظر تعديل أي ملف ضمن `GUARDRAIL_PATTERNS` **حتى لو طابق `allowed_paths`** (مثل `**` أو `scripts/**`)، ما لم يحمل ملف `APPROVAL.json` الموقع رقمياً الحقل الصريح `"allow_guardrails": true` (يُضبط عبر `--allow-guardrails` أثناء `--seal`) ومطابقة صريحة في `allowed_paths`.
- **معيار القبول:** تعديل `.mf/allowed_signers.json` أو `.githooks/pre-commit` يُرفض حتى مع `allowed_paths: ["**"]` ما لم يكن `allow_guardrails: true` موقعاً رقمياً.

### FR-04: دورة حياة `APPROVAL.json` ومنع توقف المستودع بعد 7 أيام
- دعم أرشفة المواصفات المكتملة تحت `specs/archive/<name>/`:
  - المواصفات المؤرشفة يُتحقق من سلامة بصمات ملفاتها (`spec_hashes`) وتوقيعها (منع التلاعب التاريخي)، لكن **تُستثنى** من فحص `expires_at` ولا تُدمج مسارات `allowed_paths` الخاصة بها في النطاق النشط.
- عند تشغيل التحقق بمقارنة فرع أساس (`--base <ref>` في الـ CI): يُفحص `expires_at` و`allowed_paths` على المواصفات النشطة (خارج `specs/archive/`) التي لم تُدمج بعد أو المرتبطة بالتغييرات الحالية، مع التحقق من سلامة التوقيع والقرار قبل استخدام أي `allowed_paths` في `--check-scope`.
- إزالة القيمة الافتراضية الواسعة `['src/**', 'docs/**', 'specs/**']` عند `--seal`: يصبح تمرير `--allowed-paths` **إلزامياً** عند الختم، ويرفض `--seal` إنشاء اعتماد بلا نطاق صريح.
- **معيار القبول:**
  1. مواصفة منتهية الصلاحية داخل `specs/archive/` لا تكسر `check-approval.mjs` طالما بصماتها وتوقيعها سليمَين.
  2. `--seal` بدون `--allowed-paths` يرفض الختم (exit 1).
  3. `--check-scope` يتجاهل أو يرفض أي `APPROVAL.json` غير صالح التوقيع أو قراره غير معتمد.

### FR-05: حماية المفتاح الخاص المحلي بكلمة مرور (Encrypted Ed25519 PEM) وتوثيق نموذج التهديد
- تحديث `--generate-key` لدعم توليد مفتاح Ed25519 مشفر بكلمة مرور (PKCS#8 Encrypted PEM باستخدام `aes-256-cbc`) عبر إدخال تفاعلي مخفي (masked TTY prompt) أو متغير البيئة المخصص للاختبارات، مع دعم خيار `--no-passphrase` صراحة لمن يعمل داخل Sandbox معزول.
- تحديث `--seal --sign-key` لفك تشفير المفتاح المشفر بسلاسة عبر prompt تفاعلي (أو `--passphrase-env <VAR>` في البيئات المؤتمتة) دون طباعة كلمة المرور أبداً.
- توثيق نموذج التهديد بصدق في `workflow.md` و`security.md` و`README.md` (توضيح الفرق بين مفتاح مشفر بـ Passphrase ومفتاح غير مشفر على Windows/NTFS).
- **معيار القبول:** توليد مفتاح مشفر وتوقيع `APPROVAL.json` به والتحقق منه ينجح بـ Ed25519، وتوقيعه بكلمة مرور خاطئة يفشل بوضوح.

### FR-06: تصحيح `canonicalize` ومعالجة أسماء الملفات ذات المسافات والعربية و `pre-commit`
- تصحيح [`canonicalize`](../../scripts/check-approval.mjs):
  - استبعاد مفتاح `signature` في **المستوى الجذري فقط** وليس بشكل متكرر في الكائنات المتداخلة.
  - تحويل `undefined` داخل المصفوفات إلى `'null'` وفق معيار JSON/RFC 8785.
- استخدام `git status --porcelain -z -uall` (مفصول بـ NUL byte) لمعالجة أسماء الملفات ذات المسافات والأحرف العربية دون كسر بسبب علامات الاقتباس.
- إضافة خيار `--staged-only` لـ `checkStrictScope` و`checkGuardrailsOnly` واستخدامه في [`.githooks/pre-commit`](../../.githooks/pre-commit) حتى لا تمنع المسودات غير المتتبعة الالتزام المحلي، بينما يظل الـ CI يفحص شجرة الدمج الكاملة.
- إزالة النمط الميت `'~/.mf/**'` من `FORBIDDEN_SECRET_PATTERNS` وتنظيف أي تكرار غير مستخدم.

### FR-07: تقوية مسار GitHub Actions CI وحماية `CODEOWNERS`
- تحديث [`.github/workflows/check-approval.yml`](../../.github/workflows/check-approval.yml):
  - استخراج `scripts/check-approval.mjs` و`.mf/allowed_signers.json` من فرع الأساس الموثوق (`origin/$BASE_REF`) إلى مجلد مؤقت وتشغيلهما للتحقق من الـ PR، لمنع أي PR من تعديل سكربت الفحص أو المفاتيح وتمرير نفسه!
  - استخدام `$MERGE_BASE` فعلياً في مقارنات النطاق وفحص الروابط الرمزية.
  - إصلاح ثغرة المقارنة `"$PWD"/*` بدل `"$PWD"*`، ومعالجة أسماء الملفات ذات المسافات بـ `git diff -z` و `while IFS= read -r -d ''`.
- توسيع [`.github/CODEOWNERS`](../../.github/CODEOWNERS) لتشمل جميع مسارات الحراسة (`specs/**/APPROVAL.json`, `.mf/**`, `scripts/**`, `.github/**`, `.githooks/**`).

### FR-08: استبدال الاختبارات الصورية باختبارات انحدار حقيقية (`test-guard` Compliant)
- تحديث [`scripts/test-check-approval.mjs`](../../scripts/test-check-approval.mjs) لتغطية كل متطلب باختبار فعلي يفشل عند كسر السلوك:
  - اختبار دورة **Ed25519 الكاملة** عبر CLI (توليد مفتاح غير مشفر + مفتاح مشفر بكلمة مرور ← `--seal --sign-key` ← `verify` ← كشف التلاعب بالتوقيع أو المحتوى).
  - اختبار رفض Command Injection في `base_commit`.
  - اختبار Fail-Closed عند غياب `.mf/allowed_signers.json`.
  - اختبار حماية `.mf/allowed_signers.json` ومنع تعديل ملفات الحراسة حتى مع `allowed_paths: ["**"]`، ونجاحه فقط مع `allow_guardrails: true` الموقع رقمياً.
  - اختبار دورة حياة `specs/archive/` ورفض `--seal` دون `--allowed-paths`.
  - اختبار أسماء ملفات بمسافات/عربية في `git` واختبار `canonicalize` (مفتاح `signature` متداخل + `undefined` في المصفوفة).
  - إزالة الاختبارات التمثيلية/المكررة (مثل regex محلي في EVAL-48 ومصفوفة محلية في EVAL-44) وفصل الاختبارات السلوكية للوكيل في `trigger-evals.md` فقط.

### FR-09: توحيد ملفات القواعد وإصلاح انجراف التوثيق (Single Source of Truth)
- إضافة وظيفة مزامنة/توليد موحدة في [`scripts/generate-bundle.mjs`](../../scripts/generate-bundle.mjs) (مع خيار `--check` للتحقق في الاختبارات/CI) لتحديث كتلة `MASTER_FOUNDATION` تلقائياً ومتطابقاً عبر:
  - `AGENTS.md` (مع الحفاظ على كتلة `SPECKIT`), `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.cursor/rules/master-foundation.mdc`, `.github/copilot-instructions.md`.
- إصلاح انجراف التوثيق في:
  - [`skills-map.md`](../../.agents/skills/master-foundation/references/skills-map.md) (`--result-file .mf/gate-result.json` بدل `APPROVAL.json`).
  - [`trigger-evals.md`](../../.agents/skills/master-foundation/evals/trigger-evals.md) (تصحيح المرجع من بند 6 إلى بند 7).
  - [`workflow.md`](../../.agents/skills/master-foundation/references/workflow.md) (مطابقة الوصف مع الواقع: إزالة ادعاء فحص `Ignored` أو توضيح حدوده، وتوثيق `specs/archive/` و`allow_guardrails` وحماية المفتاح بكلمة مرور).
  - [`README.md`](../../README.md) (تصحيح ترقيم الأقسام المفقود 7 وتحديث الإصدار إلى `v6.5.1`).
  - تحديث إصدار `SKILL.md` إلى `6.5.1` وإعادة مزامنة `.agents/skills/master-foundation` مع `skills/master-foundation` وإعادة توليد `MASTER_FOUNDATION_V6_5_BUNDLE.md`.

---

## 2. خارج النطاق (Out of Scope)
- لا تغيير في مصفوفة المستويات (L0–L3 / AUDIT) أو سياسة `Chat Gate` في `L0`.
- لا إضافة أوضاع `Solo-MVP` مقابل `Production` (مؤجلة لإصدار `v6.6.0` إن رغب المطور لاحقاً).
- لا تعديل لمهارات `impeccable` أو `speckit-*` أو `clean-code-guard` أو `test-guard` أو `docs-guard`.

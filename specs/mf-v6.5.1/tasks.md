# قائمة المهام المنضبطة (TDD Order) — Master Foundation v6.5.1

> **القاعدة الإلزامية (`workflow.md §2`):** تسبق مهام الاختبارات (Red) مهام التنفيذ البرمجي (Green)، وترتبط كل مهمة بمتطلب صريح في `spec.md` لضمان مطابقة التنفيذ (`Implementation Conformance`).

---

## المرحلة 0: الاعتماد والختم الرقمي (قبل كتابة أي سطر كود)
- [ ] **T00**: مراجعة `specs/mf-v6.5.1/plan.md` في **Plannotator RTL** والحصول على قرار `approved` في `.mf/gate-result.json`.
- [ ] **T01**: ختم وتوقيع `specs/mf-v6.5.1/APPROVAL.json` (بواسطة المطور بمفتاح Ed25519 مع `--allow-guardrails` و`--allowed-paths` الدقيقة) والتحقق من نجاح الختم.

---

## المرحلة 1: الاختبارات أولاً — Red Phase (`scripts/test-check-approval.mjs`)
- [ ] **T02 (FR-01, FR-02 — Red)**: كتابة اختبارات فاشلة لـ:
  - رفض Command Injection في `base_commit` قبل التحقق من التوقيع.
  - فشل مغلق (Fail-Closed) عند غياب `.mf/allowed_signers.json` مع وجود `APPROVAL.json`.
  - تقديم فحص التوقيع قبل `base_commit`.
- [ ] **T03 (FR-03, FR-04 — Red)**: كتابة اختبارات فاشلة لـ:
  - رفض تعديل `.mf/allowed_signers.json` و`.githooks/pre-commit` حتى مع `allowed_paths: ["**"]`.
  - قبول تعديل ملف حراسة فقط مع `allow_guardrails: true` موقع رقمياً ومطابق لـ `allowed_paths`.
  - رفض `--seal` بدون `--allowed-paths`.
  - قبول مواصفة مؤرشفة منتهية الصلاحية تحت `specs/archive/` طالما بصماتها وتوقيعها سليمَين، ورفضها عند تعديل ملفاتها.
  - تجاهل/رفض المواصفات غير الموقعة أو غير المعتمدة في `--check-scope`.
- [ ] **T04 (FR-05, FR-06 — Red)**: كتابة اختبارات فاشلة لـ:
  - دورة Ed25519 الكاملة عبر CLI (توليد مفتاح مشفر بكلمة مرور + غير مشفر ← `--seal --sign-key` ← `verify` ← رفض كلمة مرور خاطئة وتوقيع مزوّر).
  - `canonicalize`: بقاء مفتاح `signature` المتداخل، وتحويل `undefined` في المصفوفة إلى `null`.
  - فحص أسماء ملفات تحوي مسافات وأحرف عربية في مستودع Git مؤقت + سلوك `--staged-only`.
- [ ] **T05 (FR-09 — Red)**: كتابة اختبار يتحقق من تطابق كتلة `MASTER_FOUNDATION` في جميع ملفات القواعد (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.cursor/rules/master-foundation.mdc`, `.github/copilot-instructions.md`).

---

## المرحلة 2: التنفيذ البرمجي — Green Phase
- [ ] **T06 (FR-01, FR-02, FR-03, FR-04, FR-05, FR-06)**: تطبيق كافة التحسينات الأمنية والمنطقية في `scripts/check-approval.mjs` (وتوافق `scripts/setup-device.ps1`) حتى تنجح اختبارات المرحلة 1.
- [ ] **T07 (FR-06, FR-07)**: تحديث `.githooks/pre-commit` (`--staged-only`)، وتحديث `.github/CODEOWNERS`، وتقوية `.github/workflows/check-approval.yml` (Trusted Verifier من `origin/$BASE_REF`، تفعيل `$MERGE_BASE`، وإصلاح `"$PWD"/*` ومسافات الأسماء).
- [ ] **T08 (FR-08)**: تنظيف `scripts/test-check-approval.mjs` من الاختبارات الصورية (EVAL-44, EVAL-48) وتكراراتها، والتأكد من أن كل اختبار يختبر سلوكاً حقيقياً في الكود.

---

## المرحلة 3: توحيد ملفات القواعد والتوثيق — Parity & Docs
- [ ] **T09 (FR-09)**: إضافة `--sync-rules` و`--check-rules` إلى `scripts/generate-bundle.mjs` وتوليد ملفات القواعد الستة تلقائياً من مصدر واحد.
- [ ] **T10 (FR-09)**: إصلاح انجراف التوثيق في:
  - `.agents/skills/master-foundation/SKILL.md` (ترقية الإصدار إلى `6.5.1`)
  - `.agents/skills/master-foundation/references/workflow.md` (توثيق `specs/archive/`, `allow_guardrails`, حدود فحص الملفات المتجاهلة، وحماية المفتاح بكلمة مرور)
  - `.agents/skills/master-foundation/references/security.md` (توضيح نموذج التهديد للمفتاح المحلي وقائمة ملفات الحراسة المحدّثة)
  - `.agents/skills/master-foundation/references/skills-map.md` (تصحيح `--result-file .mf/gate-result.json`)
  - `.agents/skills/master-foundation/evals/trigger-evals.md` (تصحيح مرجع البند 7)
  - `README.md` و`.agents/skills/master-foundation/README.md` (تصحيح ترقيم الأقسام وتحديث v6.5.1)
- [ ] **T11 (FR-09)**: مزامنة `.agents/skills/master-foundation` مع `skills/master-foundation` وإعادة توليد `MASTER_FOUNDATION_V6_5_BUNDLE.md`.

---

## المرحلة 4: بوابات الجودة والتحقق النهائي (Refactor & Verify)
- [ ] **T12**: مراجعة الكود والاختبارات والتوثيق وفق قوائم `clean-code-guard` و`test-guard` و`docs-guard`.
- [ ] **T13**: تشغيل حزمة التحقق الكاملة وإرفاق المخرجات الفعلية:
  - `node scripts/test-check-approval.mjs`
  - `node scripts/generate-bundle.mjs --check-rules`
  - `node scripts/check-approval.mjs --strict-scope`
  - فحص تطابق التجزئة بين `.agents/skills/master-foundation` و`skills/master-foundation`.

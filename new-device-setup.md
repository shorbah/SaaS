# دليل إعداد الأجهزة الجديدة (New Device Setup Guide)

يحتوي هذا الملف على الخطوات الكاملة والسكربتات الموثوقة لتهيئة وإعداد أي جهاز جديد للعمل مع **Antigravity** و **Spec Kit** باستخدام المهارات الأساسية المعتمدة وفق معيار **Master Foundation v6.4.0**.

---

## 1. المتطلبات الأساسية (Prerequisites)

تأكد من تثبيت الأدوات التالية على الجهاز الجديد:
1. **Node.js** (الإصدار 20 أو أحدث).
2. **pnpm** كمدير حزم أساسي للمشاريع.
3. **uv** (أداة إدارة بيئات بايثون السريعة للغاية):
   - التثبيت الموصى به عبر مدير حزم موثوق:
     ```powershell
     winget install --id=astral-sh.uv -e
     ```
   - أو عبر Scoop:
     ```powershell
     scoop install uv
     ```
   - أو تنزيل سكربت التثبيت الرسمي وفحصه يدوياً قبل تشغيله:
     ```powershell
     powershell -ExecutionPolicy RemoteSigned -c "Invoke-WebRequest -Uri 'https://astral.sh/uv/install.ps1' -OutFile '$env:TEMP\uv-install.ps1'; Get-Content '$env:TEMP\uv-install.ps1' -Head 30; & '$env:TEMP\uv-install.ps1'"
     ```
4. **Plannotator** (أداة المراجعة البصرية للخطط والكود وبوابة الاعتماد):
   - التثبيت عبر npm أو pnpm:
     ```bash
     npm install -g plannotator
     ```
   - أو تنزيل سكربت التثبيت ومراجعته ثم تشغيله بسياسة RemoteSigned:
     ```powershell
     powershell -ExecutionPolicy RemoteSigned -c "Invoke-WebRequest -Uri 'https://plannotator.ai/install.ps1' -OutFile '$env:TEMP\plannotator-install.ps1'; & '$env:TEMP\plannotator-install.ps1'"
     ```

---

## 2. تثبيت Specify CLI

لتثبيت أداة `specify-cli` بإصدار محدد وموثوق عالمياً على الجهاز الجديد باستخدام `uv`:
```powershell
uv tool install specify-cli==0.8.1 --prerelease
```
للتحقق من سلامة التثبيت:
```powershell
specify --version
specify --help
```

---

## 3. تنزيل المشروع وتهيئة المهارات والحراسة (Clone & Setup)

1. قم بعمل Clone لمستودع المشروع على الجهاز الجديد:
   ```bash
   git clone https://github.com/shorbah/SaaS.git
   cd SaaS
   ```

2. **تفعيل خطافات Git للحراسة المحلية (Git Hooks)**:
   ```bash
   git config core.hooksPath .githooks
   ```
   > [!NOTE]
   > خطاف Git المحلي (`.githooks/pre-commit`) يمنع إدخال مواصفات غير مختومة أو محرفة محلياً، ويمكن تجاوزه بـ `--no-verify`. الحراسة الإلزامية التي تمنع الدمج غير المعتمد هي فحص CI في GitHub (`check-approval.yml`).

3. افتح المجلد في **Antigravity**.

4. قم بتشغيل سكربت المزامنة لنسخ المهارات المعتمدة (المهارات الـ 27 المتبقية بعد التقليص) عالمياً:
   ```powershell
   powershell -ExecutionPolicy RemoteSigned -File .\scripts\sync-skills.ps1
   ```

   تتضمن مهارات Spec Kit المعتمدة (7 مهارات أساسية):
   - `speckit-specify`
   - `speckit-clarify`
   - `speckit-plan`
   - `speckit-tasks`
   - `speckit-implement`
   - `speckit-analyze`
   - `speckit-constitution`

---

## 4. البدء في استخدام المهارات

بعد تشغيل السكربت وتفعيل البيئة، تتوفر المهارات التالية تلقائياً:
- `specify init` : أمر سطر الأوامر الرسمي لتهيئة أي مشروع جديد وفق قوالب Spec Kit.
- `master-foundation` : المعيار التشغيلي الموحد (v6.4.0) لجودة البرمجيات وبوابة الاعتماد المشفرة.
- `plannotator` : بوابة المراجعة البصرية للخطط والـ diffs وتوليد قرارات الاعتماد.
- حراس الجودة: `clean-code-guard`, `test-guard`, `docs-guard`, `frontend-design`.

---

## 5. آلية التطبيق على المشاريع الجديدة والقائمة (New vs Existing Projects)

### أ. المشاريع الجديدة كلياً (New Projects from Scratch)
عند بدء بناء مشروع جديد من الصفر:
1. **فتح مجلد المشروع**: افتح المجلد في منفذ الأوامر أو Antigravity.
2. **التهيئة عبر CLI الرسمي**:
   ```bash
   specify init . --ai agy
   ```
3. **تحديد المتطلبات**: صياغة ملف `spec.md` بالتعاون مع المساعد باستخدام مهارة `speckit-specify`.
4. **التخطيط والتنفيذ**:
   - إعداد الخطة عبر `speckit-plan`.
   - توليد المهام عبر `speckit-tasks`.
   - مراجعة واعتماد الخطة عبر Plannotator وختم `APPROVAL.json`.
   - التنفيذ المحروس عبر `speckit-implement` مع تشغيل حراس الجودة (`clean-code-guard` و `test-guard`).

### ب. المشاريع القائمة بالفعل (Existing Projects)
عند فتح مشروع قائم وتريد تطبيق المعيار عليه:
1. **التهيئة الآمنة**:
   ```bash
   specify init . --here
   ```
   يقوم الأمر بإعداد بنية `.specify/` وقوالب العمل دون المساس بالأكواد القائمة.
2. **فحص ومراجعة الكود القائم (Review Mode)**:
   اطلب فحص الكود الحالي دون تعديل مباشر:
   > "استخدم مهارة `clean-code-guard` في وضع المراجعة لمطبخ الكود الحالي في ملف X وإعطائي تقرير بالعيوب والأمان."
3. **فحص الاختبارات القائمة**:
   > "استخدم مهارة `test-guard` لفحص ملفات الاختبار الحالية في مجلد tests."
4. **التعديل والإصلاح التدريجي**:
   اتباع مسار التعديل المحروس مع التحقق المستمر قبل كل اعتماد.

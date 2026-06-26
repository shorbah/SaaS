# دليل إعداد الأجهزة الجديدة (New Device Setup Guide)

يحتوي هذا الملف على الخطوات الكاملة والسكربتات المؤتمتة لتهيئة وإعداد أي جهاز جديد للعمل مع **Antigravity** و **Spec Kit** باستخدام المهارات العالمية التي قمنا بتطويرها.

---

## 1. المتطلبات الأساسية (Prerequisites)

تأكد من تثبيت الأدوات التالية على الجهاز الجديد:
1. **Node.js** (الإصدار 20 أو أحدث).
2. **pnpm** كمدير حزم إلزامي للمشاريع.
3. **uv** (أداة إدارة بيئات بايثون السريعة للغاية):
   - لتثبيتها على ويندوز عبر PowerShell:
     ```powershell
     powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
     ```
4. **Git** (مع إعداد الحساب الخاص بك للربط بـ GitHub).

---

## 2. تثبيت Specify CLI

لتثبيت أداة `specify-cli` عالمياً على الجهاز الجديد باستخدام `uv`:
```powershell
uv tool install specify-cli --prerelease
```

---

## 3. تنزيل المشروع وتهيئة المهارات (Clone & Setup)

1. قم بعمل Clone لمستودع المشروع على الجهاز الجديد:
   ```bash
   git clone https://github.com/shorbah/SaaS.git
   cd SaaS
   ```

2. افتح المجلد في **Antigravity**.

3. قم بتشغيل سكربت PowerShell التالي في منفذ الأوامر الخاص بـ Antigravity (أو اكتب طلباً للمساعد ليقوم بتشغيله بالنيابة عنك) لنسخ وتفعيل كافة المهارات (SaaS, Spec Kit, Frontend Design) عالمياً على الجهاز الجديد:

   ```powershell
   # 1. تحديد مسار مجلد مهارات Antigravity العام وتأسيسه إذا لم يكن موجوداً
   $globalSkillsPath = "$env:USERPROFILE\.gemini\config\skills"
   if (-not (Test-Path $globalSkillsPath)) {
       New-Item -ItemType Directory -Force -Path $globalSkillsPath
   }

   # 2. نسخ مهارات Spec Kit الـ 11
   Copy-Item -Path ".\.agents\skills\*" -Destination $globalSkillsPath -Recurse -Force

   # 3. نسخ مهارة الـ SaaS ومهارة تصميم الواجهات
   Copy-Item -Path ".\skills\*" -Destination $globalSkillsPath -Recurse -Force

   Write-Host "✅ تم نسخ وتفعيل كافة المهارات عالمياً بنجاح!" -ForegroundColor Green
   ```

---

## 4. البدء في استخدام المهارات

بعد تشغيل السكربت، ستتوفر لديك المهارات التالية تلقائياً في شات Antigravity على الجهاز الجديد:
- `/speckit-init` : لتهيئة أي مشروع جديد بضغطة زر.
- `/frontend-design` : لتصميم وتنسيق الواجهات الاحترافية.
- `/saas-foundation-v3` : للالتزام بقواعد ومعمارية SaaS V3.
- المهارات الأخرى لتشغيل دورة حياة المشروع (`/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, إلخ).

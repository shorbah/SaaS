<div dir="rtl" style="text-align: right;">

# SaaS Master Foundation
> القاعدة الأساسية لجميع المشاريع المستقبلية — انسخ هذا الملف في أي مشروع جديد

---

## 1. هيكل المشروع (Workspace Structure)

```
project-name/
├── .ai-rules/
│   ├── rules.md              ← قواعد الذكاء الاصطناعي
│   ├── architecture.md       ← قرارات المعمارية (ADR)
│   └── spec-kit.md           ← مواصفات المشروع الكاملة
│
├── src/
│   ├── app/                  ← صفحات وتوجيه التطبيق (Next.js App Router)
│   ├── components/           ← مكونات UI قابلة لإعادة الاستخدام
│   │   ├── ui/               ← atoms: Button, Input, Badge (shadcn/ui)
│   │   ├── blocks/           ← molecules: SearchBar, KPICard
│   │   └── layouts/          ← organisms: Sidebar, Header
│   ├── features/             ← منطق كل feature معزول
│   ├── hooks/                ← custom React hooks
│   ├── lib/                  ← utilities & helpers
│   │   ├── validations/      ← Zod schemas لكل البيانات
│   │   └── logger.ts         ← نظام الـ logging المركزي
│   ├── services/             ← API calls & external services
│   ├── store/                ← state management (Zustand)
│   ├── types/                ← TypeScript types/interfaces
│   ├── mocks/                ← بيانات وهمية للتطوير
│   └── styles/               ← الهوية البصرية الثابتة
│
├── security/
│   ├── policies.md           ← سياسات الأمان
│   └── audit-log.md          ← سجل مراجعة الأمان
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── decisions/            ← لماذا اخترنا هذا وليس ذاك (ADR)
│   └── milestones/           ← توثيق المراحل المكتملة
│
├── scripts/
│   ├── seed.ts               ← رفع Mock Data للتطوير
│   ├── backup.ts             ← نقطة حفظ تلقائية
│   ├── export-master.ts      ← تصدير بيانات الإنتاج
│   └── deploy.ts
│
├── migrations/               ← تغييرات قاعدة البيانات
├── .env.example              ← نموذج المتغيرات (لا secrets حقيقية)
├── .env.local                ← متغيرات التطوير المحلية (في .gitignore)
├── .gitignore
├── .eslintrc.json            ← قواعد جودة الكود
├── .prettierrc               ← تنسيق الكود الموحّد
├── tsconfig.json             ← TypeScript strict mode
├── pnpm-lock.yaml
└── package.json
```

---

## 2. قواعد الذكاء الاصطناعي (AI Rules)

> احفظ هذا في `.ai-rules/rules.md` وأضفه لأي AI IDE (AntiGravity، Cursor، Claude Code)

```markdown
# AI Assistant Rules

## الهوية البصرية
- لا تعدّل أي ملف داخل src/styles/ إلا بطلب صريح ومباشر
- الألوان والخطوط والـ tokens ثابتة — لا تغييرات تلقائية
- shadcn/ui هو مصدر كل مكونات الـ UI — لا تبني مكونات من الصفر

## حدود التعديل
- عند تعديل أي عنصر، تأكد أن الـ core functionality لم تتأثر
- لا تمس ملفات خارج نطاق المهمة الحالية
- أي تغيير على auth أو security يستلزم موافقة صريحة قبل التنفيذ
- لا تعدّل ملفات الـ schema أو الـ migrations بدون إذن صريح

## المحادثات — عرض النص العربي
<div dir="rtl" style="text-align: right;"> [نص الرد هنا] </div>

## الحزم والأدوات
- استخدم pnpm حصراً — لا npm ولا yarn
- لا تضيف dependency جديدة دون الإشارة إليها صراحةً
- كل input من المستخدم يمر عبر Zod schema قبل أي معالجة

## التوكن والكفاءة
- لا جمل ترحيبية أو خارجية عن سياق المهمة
- ردود مباشرة ومركّزة فقط

## Secrets & Security
- لا تضع أي secret أو API key في الكود مباشرة
- استخدم environment variables دائماً
- لا تكتب بيانات اختبار حقيقية في الكود
- كل عملية حساسة تمر عبر السيرفر — Frontend يعرض فقط
```

---

## 3. المعمارية الأساسية (Architecture)

### المبادئ الثابتة

- **Separation of Concerns** — كل ملف مسؤول عن شيء واحد فقط
- **Feature-based structure** — كل feature تملك مكوناتها وهوكاتها وخدماتها
- **API-first** — كل عملية تمر عبر API layer موحّدة
- **Server-first** — كل بيانات حساسة تعالَج في السيرفر فقط
- **Environment-driven config** — لا hardcoded values في أي مكان
- **Validate everything** — كل input يُتحقق منه قبل المعالجة

### Tech Stack الموصى به

| الطبقة | الاختيار الأساسي | ملاحظة |
|--------|----------------|--------|
| Framework | **Next.js + TypeScript** | App Router + API Routes مدمجة |
| Styling | **Tailwind CSS** | مع shadcn/ui للمكونات الجاهزة |
| UI Components | **shadcn/ui** | الكود ملكك، لا vendor lock-in |
| State Management | **Zustand** | للـ client state فقط |
| Server State | **TanStack Query** | للبيانات من السيرفر + caching |
| Validation | **Zod** | على السيرفر والـ client معاً |
| Auth | **better-auth** | مفتوح المصدر، بياناتك عندك |
| API Layer | **tRPC** | type-safety كاملة بدون codegen |
| Package Manager | **PNPM** | أسرع وأذكى من npm |
| Testing | **Vitest + Playwright** | unit + e2e |
| Database ORM | **Prisma** | type-safe، migrations تلقائية |
| Logging | **pino** | سريع، structured JSON |
| Error Tracking | **Sentry** | مجاني للمشاريع الصغيرة |

**لماذا Next.js وليس React فقط؟**
Next.js يحل مشاكل متعددة دفعة واحدة: API Routes مدمجة (لا حاجة لـ Express منفصل)، Server Components للأداء، routing تلقائي، وDeploy مباشر على Vercel بدون إعداد.

---

## 4. SPEC KIT — مواصفات المشروع

> انسخ هذا القسم وعبّئه لكل مشروع جديد في `.ai-rules/spec-kit.md`

```markdown
# اسم المشروع: [____]
# تاريخ البدء: [____]

## ما الذي يفعله هذا التطبيق؟
[وصف في جملتين]

## من هو المستخدم المستهدف؟
[شريحة محددة]

## الميزات الأساسية (MVP)
- [ ] ميزة 1
- [ ] ميزة 2
- [ ] ميزة 3

## ما لا يفعله هذا التطبيق (Out of Scope)
- لا يشمل:
- لا يشمل:

## قرارات المعمارية (ADRs)
| القرار | السبب | البدائل المرفوضة |
|--------|-------|-----------------|
| Next.js بدل React فقط | API Routes مدمجة، deploy أسهل | CRA, Vite |
| better-auth بدل Clerk | لا vendor lock-in، مجاني | Clerk, Auth0 |
| tRPC بدل REST | type-safety كاملة بدون codegen | REST, GraphQL |

## تعريف الإنجاز (Definition of Done)
كل task تُعتبر منجزة عند:
- [ ] الكود يعمل بدون errors
- [ ] يوجد test يغطي الحالة الأساسية
- [ ] لا secrets مكشوفة
- [ ] الـ UI لا يكسر على mobile
- [ ] كل input مُتحقق منه بـ Zod
```

---

## 5. نظام المهام والمراحل (Tasks & Milestones)

### هيكل الـ Milestone

```markdown
## Milestone [رقم]: [اسم المرحلة]
الهدف: [جملة واحدة]
الموعد المستهدف: [تاريخ]
نقطة الـ Backup: backup-v[رقم]

### Tasks
- [ ] TASK-001: [وصف المهمة] — Priority: HIGH
- [ ] TASK-002: [وصف المهمة] — Priority: MEDIUM
- [ ] TASK-003: [وصف المهمة] — Priority: LOW

### اختبارات المرحلة
- [ ] TEST-M[رقم]-01: [ما يجب اختباره]
- [ ] TEST-M[رقم]-02: [ما يجب اختباره]

### معيار الاجتياز
- جميع tests خضراء
- لا breaking changes على الـ features السابقة
- backup منفّذ قبل الانتقال للمرحلة التالية
```

### مثال تطبيقي

```markdown
## Milestone 1: Auth & Foundation
الهدف: نظام مصادقة آمن + هيكل المشروع
نقطة الـ Backup: backup-v1.0

### Tasks
- [ ] TASK-001: إعداد Next.js + PNPM + TypeScript strict — Priority: HIGH
- [ ] TASK-002: إعداد shadcn/ui + Tailwind — Priority: HIGH
- [ ] TASK-003: تصميم قاعدة البيانات + Prisma schema — Priority: HIGH
- [ ] TASK-004: تنفيذ Register/Login بـ better-auth — Priority: HIGH
- [ ] TASK-005: JWT + Refresh Token + httpOnly Cookie — Priority: HIGH
- [ ] TASK-006: حماية Routes (middleware) — Priority: MEDIUM
- [ ] TASK-007: Zod schemas للـ auth inputs — Priority: HIGH

### اختبارات المرحلة
- [ ] TEST-M1-01: login بيانات صحيحة → يدخل
- [ ] TEST-M1-02: login بيانات خاطئة → رسالة خطأ
- [ ] TEST-M1-03: دخول route محمية بدون token → redirect
- [ ] TEST-M1-04: token منتهي الصلاحية → يُجدَّد تلقائياً
- [ ] TEST-M1-05: باسورد ضعيف → يُرفض مع رسالة واضحة
- [ ] TEST-M1-06: محاولات login متكررة → يُوقَف بعد 5 محاولات
```

---

## 6. نظام الـ Backup (بدون تكلفة ومساحة)

### الطريقة الأمثل: Git Tags

```bash
# إنشاء نقطة backup (snapshot) قبل كل milestone
git add .
git commit -m "milestone-1: auth complete"
git tag -a backup-v1.0 -m "Auth system complete and tested"
git push origin --tags

# الرجوع لنقطة backup عند الحاجة
git checkout backup-v1.0          # عرض فقط
git checkout -b rescue/from-v1.0  # إنشاء فرع جديد منها
```

**لماذا هذه الطريقة؟**
- لا تأخذ مساحة إضافية على الجهاز
- محفوظة على GitHub/GitLab مجاناً
- يمكن الرجوع لأي نقطة في ثوانٍ
- لا تؤثر على الكود الحالي

### سكريبت الـ Backup التلقائي

```typescript
// scripts/backup.ts
import { execSync } from 'child_process';

const milestone = process.argv[2]; // مثال: v1.0
if (!milestone) throw new Error('يجب تحديد رقم الـ milestone: pnpm backup v1.0');

try {
  execSync(`git add .`);
  execSync(`git commit -m "backup: ${milestone}"`);
  execSync(`git tag -a backup-${milestone} -m "Backup ${milestone}"`);
  execSync(`git push origin --tags`);
  console.log(`✅ Backup ${milestone} محفوظ على GitHub`);
} catch (error) {
  console.error('❌ فشل الـ backup:', error);
  process.exit(1);
}
```

```bash
# الاستخدام
pnpm backup v2.1
```

---

## 7. الأمان الشامل (Security)

### الأولويات — OWASP Top 10

| الأولوية | الثغرة | الحل |
|---------|--------|------|
| 🔴 1 | Broken Access Control (IDOR) | فحص صلاحية كل request، لا تثق بالـ ID |
| 🔴 2 | Broken Authentication | argon2id، منع الباسورد الضعيف، rate limiting |
| 🔴 3 | SQL Injection | Prisma/ORM دائماً — لا raw queries |
| 🟠 4 | XSS | تجنب dangerouslySetInnerHTML، sanitize المدخلات |
| 🟠 5 | Security Misconfiguration | Security headers، تعطيل debug في production |
| 🟠 6 | Sensitive Data Exposure | HTTPS فقط، تشفير البيانات الحساسة |
| 🟠 7 | CORS Misconfiguration | تحديد origins المسموح بها صراحةً |
| 🟡 8 | CSRF | sameSite cookies + CSRF tokens |
| 🟡 9 | Insecure API | Rate limiting، API key rotation |
| 🟡 10 | Secrets Exposure | لا .env في Git، استخدم VAULT |

### قواعد الأمان الثابتة لكل مشروع

```typescript
// security/policies.ts — القواعد المطبّقة في الكود

// ✅ كلمة المرور
password.minLength = 8;
password.requireUppercase = true;
password.requireNumber = true;
password.requireSpecialChar = true;
password.hash = 'argon2id'; // أقوى من bcrypt

// ✅ الـ Token
token.accessExpiry = '15m';    // قصير — يتجدد بالـ refresh token
token.refreshExpiry = '7d';
token.rotateOnRefresh = true;  // كل refresh ينتج token جديد

// ✅ Rate Limiting
auth.maxAttempts = 5;
auth.lockoutDuration = '15m';
api.rateLimit = '100 req/min per IP';

// ✅ Security Headers (في next.config.js)
headers['Content-Security-Policy'] = "default-src 'self'";
headers['X-Frame-Options'] = 'DENY';
headers['X-Content-Type-Options'] = 'nosniff';
headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';

// ✅ CORS — في API routes
cors.origin = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
cors.credentials = true;   // مهم مع httpOnly cookies
cors.methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
```

### Input Validation — Zod (إلزامي)

```typescript
// src/lib/validations/auth.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل').max(100),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2).max(50),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص'),
});

// في كل API route — قبل أي معالجة
const result = LoginSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: result.error.flatten() });
}
// الآن result.data آمن ومُتحقق منه
```

### الأتمتة الزمنية (Time-based Automation)

```typescript
// نموذج الـ Schema لخيار المستخدم
userSettings: {
  automationDays: number,                    // القيمة التي يختارها المستخدم
  automationUnit: 'days' | 'weeks' | 'months',
  nextRunAt: Date,                           // محسوبة تلقائياً
}

// خيارات جاهزة للمستخدم
const PRESET_OPTIONS = [
  { label: 'يومياً',    value: 1,  unit: 'days' },
  { label: 'أسبوعياً', value: 7,  unit: 'days' },
  { label: 'شهرياً',   value: 30, unit: 'days' },
  { label: 'مخصص',     value: 0,  unit: 'custom' }, // يدخل المستخدم الرقم
];
```

---

## 8. Frontend Design System (ثابت لكل المشاريع)

### Skills المطلوبة

```
skills:
  - frontend-design      ← هوية بصرية + tokens
  - react-best-practices ← patterns + performance
```

### shadcn/ui — المكتبة الرسمية للمشاريع

```bash
# تثبيت مرة واحدة في كل مشروع
pnpm dlx shadcn@latest init

# إضافة مكونات حسب الحاجة
pnpm dlx shadcn@latest add button input dialog table form
```

**لماذا shadcn/ui؟**
- الكود ملكك — لا vendor lock-in
- لا تحديثات تكسر تصميمك
- يقرأه AntiGravity من `components.json` تلقائياً
- يكتب AI كود صحيح من أول مرة بدون تخمين

### قواعد الهوية البصرية

```css
/* src/styles/tokens.css — لا تعدّل إلا بطلب صريح */
:root {
  --color-primary: [لونك];
  --color-bg: [خلفيتك];
  --font-body: [خطك];
  --font-display: [خط العناوين];
  --radius-md: 0.5rem;
  --space-4: 1rem;
}
```

### دعم اللغة العربية و RTL

```typescript
// في layout.tsx الرئيسي
<html lang="ar" dir="rtl">

// في Tailwind — استخدم rtl: prefix للأشياء المختلفة
<div className="mr-4 rtl:ml-4 rtl:mr-0 text-left rtl:text-right">

// الخطوط العربية في globals.css
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
body { font-family: 'Tajawal', sans-serif; }
```

### React Best Practices

```typescript
// ✅ كل component في ملف منفصل
// ✅ Custom hooks للـ logic المتكررة
// ✅ TypeScript strict mode دائماً (noImplicitAny: true)
// ✅ لا any types
// ✅ Error boundaries على كل feature رئيسية
// ✅ Loading + Empty + Error states لكل data fetch
// ✅ TanStack Query لكل بيانات من السيرفر (لا useState للـ API calls)
// ✅ المكونات الضخمة تُقسَّم إلى أجزاء أصغر
// ✅ كل form يستخدم react-hook-form + Zod resolver
```

### Error Handling — نمط موحّد

```typescript
// src/lib/errors.ts — نمط موحّد لكل الأخطاء
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

// في كل API route
try {
  // العملية
} catch (error) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message, code: error.code });
  }
  logger.error({ err: error }, 'Unexpected error');
  return res.status(500).json({ error: 'حدث خطأ غير متوقع' });
}
```

---

## 9. Logging — نظام السجلات

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'token', 'secret', 'authorization'], // ← لا تسجّل بيانات حساسة
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' }, // قراءة سهلة في التطوير
  }),
});

// الاستخدام في كل مكان
logger.info({ userId, action: 'login' }, 'User logged in');
logger.warn({ ip, attempts: 5 }, 'Rate limit approaching');
logger.error({ err, orderId }, 'Payment processing failed');
```

**القاعدة:** كل حدث مهم في التطبيق يُسجَّل — لكن لا تسجّل أبداً: كلمات المرور، tokens، بيانات بطاقات البنك.

---

## 10. قائمة التحقق قبل النشر (Pre-Deploy Checklist)

```markdown
## قبل كل milestone
- [ ] جميع الـ tests خضراء (unit + integration)
- [ ] لا console.log في الكود
- [ ] لا TODO أو FIXME في الكود الجديد
- [ ] .env.example محدّث بكل المتغيرات الجديدة
- [ ] backup منفّذ بـ git tag
- [ ] الـ UI يعمل على mobile
- [ ] كل input جديد عنده Zod schema

## قبل النشر للإنتاج
- [ ] لا secrets في الكود أو Git
- [ ] HTTPS مفعّل
- [ ] Security headers مضبوطة
- [ ] CORS مضبوط بـ origins محددة
- [ ] Rate limiting مفعّل
- [ ] Error monitoring مضبوط (Sentry)
- [ ] Database backup مجدوَل
- [ ] CHANGELOG محدَّث
- [ ] pnpm audit — لا ثغرات عالية الخطورة
```

---

## 11. نموذج بداية مشروع جديد (Onboarding Template)

```bash
# 1. نسخ هيكل المشروع
cp -r saas-master-foundation/ new-project-name/
cd new-project-name/

# 2. تهيئة المشروع
pnpm install

# 3. إعداد جودة الكود (مرة واحدة في كل مشروع)
pnpm add -D eslint prettier husky lint-staged @typescript-eslint/eslint-plugin
pnpm dlx husky init
# أضف في .husky/pre-commit: pnpm lint-staged

# 4. إعداد shadcn/ui
pnpm dlx shadcn@latest init

# 5. إعداد المتغيرات
cp .env.example .env.local
# عبّئ المتغيرات — لا تضع أي قيمة في .env.example

# 6. أول backup
git init
git add .
git commit -m "init: project foundation"
git tag -a backup-v0.1 -m "Initial foundation"
git push origin main --tags

# 7. افتح .ai-rules/spec-kit.md وعبّئ تفاصيل المشروع الجديد
```

---

## 12. PNPM — إدارة الحزم الذكية

```bash
# نقل مشروع بدون node_modules (1.4 جيجا)
# انقل هذين الملفين فقط:
# pnpm-lock.yaml  ← يضمن نفس الإصدارات
# package.json    ← قائمة المكتبات

# ثم في المشروع الجديد:
pnpm install           # يجيب من cache المحلي
pnpm install --offline # بدون إنترنت إذا سبق تحميلها

# أوامر مفيدة
pnpm add [package]         # إضافة dependency
pnpm add -D [package]      # إضافة devDependency
pnpm remove [package]      # حذف dependency
pnpm audit                 # فحص الثغرات الأمنية
pnpm update --interactive  # تحديث الحزم بشكل آمن
```

**package.json scripts الأساسية:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    "backup": "tsx scripts/backup.ts",
    "seed": "tsx scripts/seed.ts",
    "export-master": "tsx scripts/export-master.ts",
    "import-master": "tsx scripts/import-master.ts"
  }
}
```

---

## 13. Frontend — لا تخزين بيانات حساسة

```typescript
// ❌ خاطئ — بيانات في Frontend
const userData = { id: 1, role: 'admin', salary: 5000 }
// أي شخص يفتح DevTools ويشوف هذا

// ✅ صح — Frontend يطلب فقط
fetch('/api/user') // السيرفر يرجع ما يُسمح به فقط
```

| يُخزَّن في Frontend | يُخزَّن في Backend |
|---------------------|-------------------|
| حالة الـ UI (مفتوح/مغلق) | بيانات المستخدمين |
| الـ theme (داكن/فاتح) | الصلاحيات والأدوار |
| تفضيلات العرض | الأرقام والتقارير |
| Access Token مؤقت فقط | كلمات المرور |

**الـ Access Token** يُحفظ في `httpOnly cookie` فقط — المتصفح يرسله تلقائياً لكن JavaScript لا تقدر تقرأه.

---

## 14. Stack المجاني الكامل (Zero Cost)

```
Frontend Hosting → Vercel          (مجاني — CI/CD تلقائي عبر GitHub)
Database + Storage → Supabase      (مجاني — 500MB DB، 50K مستخدم/شهر)
Auth Layer       → better-auth     (مجاني — مفتوح المصدر، بياناتك عندك)
UI Components    → shadcn/ui       (مجاني — الكود ملكك)
Payments         → Stripe          (مجاني حتى أول معاملة)
Error Tracking   → Sentry          (مجاني حتى 5K errors/شهر)
Domain           → Vercel subdomain (مجاني) أو Namecheap (~$10/سنة)
```

**تحذير Supabase Free:** يوقف المشروع بعد أسبوع بدون نشاط.
الحل: cron job يرسل ping للقاعدة كل 3 أيام.

**لماذا better-auth وليس Clerk؟**
Clerk مدفوع مع النمو ($0.02+ لكل مستخدم/شهر) وبيانات مستخدميك على سيرفراتهم.
better-auth مجاني كلياً، مفتوح المصدر، TypeScript أصلي، وبياناتك عندك.

### حجم التطبيق — فهم صحيح

```
على جهازك:
  كودك الفعلي     ← ~5 ميجا
  node_modules    ← ~1.4 جيجا (لا تُرفع للإنترنت)
  ملفات مؤقتة     ← ~50 ميجا

ما يصل للمستخدم:
  الكود المضغوط   ← أقل من 1 ميجا
  بياناتك الفعلية ← 5-20 ميجا لاستخدام شخصي وفريق صغير
```

### نشر التطبيق — الطريقة الموصى بها

```
1. ارفع الكود على GitHub (مستودع خاص مجاني)
2. اربط الـ repository بـ Vercel (مرة واحدة)
3. من الآن: أي تعديل ترفعه → Vercel ينشره تلقائياً خلال دقيقتين
```

---

## 15. Server-First Architecture — البنية المعتمدة على السيرفر

### المبدأ الأساسي

كل عملية حساسة تمر عبر السيرفر — Frontend يعرض فقط.

```
المستخدم يفعل action
       ↓
Frontend يرسل request للسيرفر
       ↓
السيرفر يتحقق من الصلاحية (لا يثق بأي بيانات من الـ client)
       ↓
السيرفر يرجع النتيجة فقط (لا raw data)
       ↓
Frontend يعرض النتيجة
```

### Webhook Pattern — التحقق من الأحداث

```typescript
// كل event مهم يُرسَل للسيرفر للتأكيد قبل التنفيذ
app.post('/webhook/event', async (req) => {
  // 1. تحقق من مصدر الطلب (signature سري مشترك)
  const isValid = verifySignature(req.headers['x-signature'], req.body, process.env.WEBHOOK_SECRET);
  if (!isValid) return res.status(401).json({ error: 'Unauthorized' });

  // 2. تحقق من نوع الـ event بـ Zod
  const result = WebhookEventSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: 'Invalid event' });

  // 3. نفّذ العملية على السيرفر فقط
  await processEvent(result.data);

  // 4. أرسل تأكيد فقط — لا بيانات حساسة
  return res.json({ status: 'confirmed' });
});
```

### Stripe Webhooks — التعامل الصحيح

```typescript
// الخطأ الشائع: الدفع ناجح في Stripe لكن المستخدم لا يحصل على الـ subscription
// السبب: عدم التحقق الصحيح من الـ webhook

app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // تحقق من أن الـ webhook قادم من Stripe فعلاً
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // عالج كل event بشكل مستقل
  switch (event.type) {
    case 'checkout.session.completed':
      await activateSubscription(event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      await deactivateSubscription(event.data.object.customer);
      break;
  }

  res.json({ received: true });
});
```

### Cookies — الاستخدام الآمن والمخاطر

```typescript
// ❌ خطر — Cookie قابلة للتلاعب
res.cookie('role', 'admin'); // المستخدم يعدّلها في المتصفح

// ✅ آمن — httpOnly + Signed + Server Validation
res.cookie('session', token, {
  httpOnly: true,      // JavaScript لا تقرأها
  secure: true,        // HTTPS فقط
  sameSite: 'strict',  // حماية من CSRF
  signed: true,        // توقيع رقمي يكشف التلاعب
  maxAge: 15 * 60 * 1000, // 15 دقيقة فقط
});

// ✅ السيرفر يتحقق من الصلاحية في كل request
// لا تثق بأي بيانات قادمة من الـ Cookie مباشرة
// استخدم الـ Cookie فقط لتعريف الجلسة، ثم اجلب الصلاحيات من DB
```

---

## 16. Testing Strategy — الاختبارات بعد كل إنجاز

### متى تكتب الاختبار

```
انتهيت من feature/task → اكتب الاختبار قبل انتقل للتالية
```

### هيكل الاختبارات

```typescript
// tests/unit/[feature].test.ts — اختبار وحدة واحدة
describe('Auth Service', () => {
  it('يرفض الباسورد الضعيف', () => {
    expect(validatePassword('123')).toBe(false);
  });
  it('يقبل الباسورد القوي', () => {
    expect(validatePassword('Str0ng@Pass')).toBe(true);
  });
  it('يرفض الإيميل غير الصحيح', () => {
    const result = LoginSchema.safeParse({ email: 'notanemail', password: 'Str0ng@Pass' });
    expect(result.success).toBe(false);
  });
});

// tests/integration/[feature].test.ts — اختبار تدفق كامل
describe('Login Flow', () => {
  it('login صحيح → يرجع session cookie', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'Str0ng@Pass' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });
  it('login خاطئ → 401', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
```

### قاعدة الاختبار في كل Milestone

```markdown
قبل إغلاق أي Milestone:
- [ ] unit tests لكل function حساسة
- [ ] integration test للـ flow الرئيسي
- [ ] اختبار الحالات الخاطئة (باسورد خاطئ، token منتهي، input غير صحيح)
- [ ] pnpm test → كل شيء أخضر
```

---

## 17. Mock Data — التطوير بدون بيانات حقيقية

### هيكل الـ Mock

```
src/
└── mocks/
    ├── index.ts         ← يفعّل/يوقف الـ mock
    ├── users.mock.ts
    ├── products.mock.ts
    └── orders.mock.ts
```

### نموذج Mock Data

```typescript
// src/mocks/users.mock.ts
export const mockUsers = [
  { id: 'usr_001', name: 'أحمد محمد', role: 'admin', email: 'ahmed@test.com' },
  { id: 'usr_002', name: 'سارة علي',  role: 'staff', email: 'sara@test.com'  },
];

// src/mocks/index.ts
const USE_MOCK = process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true';

export const getUsers = USE_MOCK
  ? () => Promise.resolve(mockUsers)
  : () => fetch('/api/users').then(r => r.json());
```

### التبديل بين Mock والبيانات الحقيقية

```bash
# .env.development
USE_MOCK=true   ← تطوير محلي

# .env.production
USE_MOCK=false  ← البيانات الحقيقية
```

> **مهم:** أضف `master-export.json` إلى `.gitignore` دائماً — يحتوي بيانات حقيقية.

---

## 18. Master Data File — ملف التصدير والاستيراد

### الفكرة

ملف واحد يحتوي كل بيانات التطبيق — تصدّره للانتقال بين بيئات أو لعمل backup كامل.

> **تحذير أمني:** هذا الملف يحتوي بيانات حساسة — لا تحفظه في Git أبداً، ولا تشاركه عبر قنوات غير مشفّرة.

### هيكل ملف الـ Master

```typescript
// scripts/export-master.ts
import { db } from '../src/lib/db';
import { writeFileSync } from 'fs';

interface MasterDataFile {
  version: string;
  exportedAt: string;
  environment: 'development' | 'production';
  data: {
    users: User[];
    settings: AppSettings;
    [key: string]: unknown;
  };
}

export async function exportMaster(): Promise<void> {
  const master: MasterDataFile = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV as 'development' | 'production',
    data: {
      users: await db.users.findMany({ omit: { passwordHash: true } }), // ← لا تصدّر كلمات المرور
      settings: await db.settings.findFirst(),
    },
  };

  const outputPath = './master-export.json';
  writeFileSync(outputPath, JSON.stringify(master, null, 2));
  console.log(`✅ Master data exported to ${outputPath}`);
  console.log('⚠️  تذكر: لا ترفع هذا الملف على Git');
}
```

```typescript
// scripts/import-master.ts
import { db } from '../src/lib/db';
import { readFileSync } from 'fs';

export async function importMaster(filePath: string): Promise<void> {
  const master: MasterDataFile = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (master.version !== '1.0') throw new Error('إصدار غير متوافق');

  // تأكيد قبل الاستيراد في الإنتاج
  if (master.environment === 'production' && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  استيراد في بيئة الإنتاج — تأكد من backup أولاً');
  }

  await db.$transaction([
    db.settings.upsert({ where: { id: 1 }, update: master.data.settings, create: master.data.settings }),
  ]);

  console.log('✅ Master data imported');
}
```

### الاستخدام

```bash
pnpm export-master   # تصدير البيانات
pnpm import-master ./master-export.json  # استيراد

# في .gitignore — إلزامي
master-export.json
*.export.json
```

---

## 19. Superpowers — طبقة التنفيذ فوق الملف الأساسي

> يُضاف لاحقاً عند الاستخدام الفعلي

- **الفلسفة:** TDD أولاً — الاختبار يُكتب قبل الكود
- **يعمل مع:** AntiGravity، Cursor، Claude Code
- **يضيف لملفك:** مهارات تصحيح أخطاء، مراجعة كود، Git منضبط
- **الدمج الأمثل:** Spec-Kit (ملفنا) للتخطيط + Superpowers للتنفيذ
- **إدارة التوكن:** استخدم موديل ذكي للتخطيط، موديل أرخص للكتابة، موديل ذكي للمراجعة

---

*آخر تحديث: مايو 2026 — القاعدة الأساسية v2.0*

</div>

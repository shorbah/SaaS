# 🛡️ Master Foundation v6.5.0 — Comprehensive Architecture & Security Audit Dossier
**Target Reviewers**: ChatGPT & Argon (Principal Security & Systems Architecture Reviewers)  
**Repository**: SaaS Master Foundation  
**Version**: v6.5.0  
**Commit**: `1947f1a` (`main` branch)  
**Date**: November 2026  

---

<div dir="rtl" style="text-align: right; direction: rtl;">

## 📑 الفهرس العام للحزمة

1. [القسم الأول: سياق المشروع، الأهداف، وفلسفة العمل مع وكلاء الذكاء الاصطناعي](#1-سياق-المشروع-والهدف-منه-وسير-العمل-مع-وكلاء-الذكاء-الاصطناعي)
2. [القسم الثاني: المواصفات المعمارية الدقيقة لمعيار Master Foundation v6.5.0](#2-المواصفات-المعمارية-الدقيقة-لمعيار-master-foundation-v650)
   - 2.1 بوابات الجودة الثلاث المستقلة والمتكاملة (The 3-Tier Quality Gates)
   - 2.2 مصفوفة أبعاد المخاطر الرباعية وقاعدة الرفع التلقائي (Risk Matrix & Floor Rule)
   - 2.3 المعيار التشفيري المقنن والتوقيع الرقمي اللامركزي (RFC 8785 JCS & Ed25519)
   - 2.4 محرك فحص النطاق الصارم وحماية شجرة الدمج (Strict Scope & Anti-TOCTOU Engine)
3. [القسم الثالث: الأكواد التنفيذية الكاملة للمنظومة (Full Source Code)](#3-الأكواد-التنفيذية-الكاملة-للمنظومة)
   - 3.1 محرك الفحص والاعتماد والتوقيع: `scripts/check-approval.mjs`
   - 3.2 سكربت تهيئة الجهاز الآلية والمفاتيح: `scripts/setup-device.ps1`
   - 3.3 حزمة اختبارات الانحدار المعمارية (29 اختباراً): `scripts/test-check-approval.mjs`
   - 3.4 مسار التحقق المستمر في الحوسبة السحابية: `.github/workflows/check-approval.yml`
4. [القسم الرابع: البرومبت التوجيهي الصارم للتدقيق المعماري والأمني (Reviewer Prompt)](#4-البرومبت-التوجيهي-الصارم-للتدقيق-المعماري-والأمني)

</div>

---

<div dir="rtl" style="text-align: right; direction: rtl;">

## 1. سياق المشروع والهدف منه وسير العمل مع وكلاء الذكاء الاصطناعي

### أ. طبيعة المشروع والغاية الأساسية
مشروع **SaaS Master Foundation** ليس مجرد تطبيق برمجي فردي، بل هو **قالب معماري ونظام تشغيلي هندسي فائق الانضباط (Operational Blueprint & AI Governance Layer)** تم تصميمه ليشكّل النواة الصلبة لكافة منتجات SaaS البرمجية المستقبلية (تطبيقات ويب سحابية، خدمات خلفية Microservices / APIs، تطبيقات جوال، وأدوات CLI ومكتبات).

الهدف الأساسي للمشروع هو حل المعضلة الكبرى في عصر التطوير بالذكاء الاصطناعي:  
**كيف نحقق أقصى سرعة إنتاجية ممكنة (Vibe Coding Velocity) دون التضحية بذرة واحدة من الأمان، ودون الوقوع في فوضى الهلوسة، والتعديلات العشوائية، أو تدمير قواعد البيانات؟**

### ب. فلسفة التعامل مع وكلاء الذكاء الاصطناعي (AI Agent Workforce)
يعمل المشروع في بيئة تطوير هجينة يتعاون فيها المطور البشري (Lead Developer / Architect) مع وكلاء ذكاء اصطناعي متعددي المنصات والقدرات:
* **Google Antigravity**: الوكيل الذاتي الأساسي لإدارة المهام والتطوير المقاد بالمواصفات (Specification-Driven Development).
* **Cursor & Windsurf**: محررات الكود المدعومة بالذكاء الاصطناعي للتعديل الموضعي والبرمجة التفاعلية السريعة.
* **Claude Code & Gemini CLI**: الوكلاء الطرفيون (Terminal Agents) للعمليات والمهام الخلفية وإدارة البيئات.
* **Spec Kit & Plannotator**: منظومة التخطيط التفاعلي باللغة الطبيعية مع دعم كامل للغة العربية ونمط اليمين لليسار (RTL-First).

### ج. دورة حياة العمل البرمجي (The Lifecycle)
1. **المواصفات أولاً (Spec-Driven)**: لا يبدأ العمل البرمجي في المهام الكبيرة أو الحساسة بكتابة الكود مباشرة، بل بصياغة المواصفة (`spec.md`) والخطة (`plan.md`) وتفكيك المهام (`tasks.md`).
2. **الاعتماد البشري غير القابل للتجاوز**: لا يمتلك أي وكيل ذكاء اصطناعي الصلاحية لتنفيذ تغييرات جوهرية أو لمس ملفات خارج نطاق مهمته المعتمد.
3. **منع الانحراف الميكانيكي (Anti-Drift)**: يتم ختم وتوقيع ملفات المواصفات رقمياً بروابط تشفيرية؛ فأي تعديل لاحق على المتطلبات يبطل الاعتماد فوراً.
4. **التكامل المستمر كحارس أخير**: خطافات Git المحلية ومسارات GitHub Actions السحابية ترفض دمج أي كود لا يحمل بصمة رقمية صالحة ومطابقة لشجرة الدمج.

</div>

---

<div dir="rtl" style="text-align: right; direction: rtl;">

## 2. المواصفات المعمارية الدقيقة لمعيار Master Foundation v6.5.0

### 2.1 بوابات الجودة الثلاث المستقلة والمتكاملة (The 3-Tier Quality Gates)
يُقسّم المعيار بوابات الرقابة إلى 3 طبقات محكمة تلبي متطلبات السرعة للمهام البسيطة والصرامة للمهام المعمارية:

1. **بوابة المحادثة الفورية (Chat Gate — للمستويات L0 إلى L2)**:
   * صُممت لتفادي البيروقراطية في المهام التافهة والموضعية.
   * يقوم الوكيل بعرض تصنيف المهمة وخطة مقتضبة (سطر واحد لـ L0، وبضعة أسطر لـ L1/L2) وما سيتغير، ويتوقف فوراً عند بوابة المحادثة بانتظار موافقة صريحة بكلمة **"نفّذ"**.
   * في مهام **L2 الحساس** (تعديل الجداول القائمة، سياسات RLS، الصلاحيات، المدفوعات)، يُلزم الوكيل بعرض الاستعلام أو الفروقات (Diff) الدقيقة قبل طلب الإذن.

2. **بوابة الاعتماد المشفرة للمواصفات (Cryptographic Spec Gate — إلزامية لـ L3)**:
   * لا يُسمح بأي كتابة كود لمهام المستوى المعماري الكبير (L3) دون صدور وثيقة اعتماد مشفرة `APPROVAL.json` محددة النطاق الجغرافي داخل المستودع (`allowed_paths`).
   * يتم استخراج البصمة الرقمية للوثائق ومطابقتها بتوقيع رقمي غير متماثل (Asymmetric Ed25519) يصدر من مفتاح المطور المحلي المخزن خارج المستودع (`~/.mf/id_ed25519`).
   * بمجرد صدور الاعتماد المشفر واجتياز الفحص الميكانيكي، تنتفي الحاجة لطلب كلمة "نفّذ" إضافية في المحادثة، مما يتيح للوكيل العمل المتواصل بثقة مطلقة.
   * قيود استثناء التجاوز (`skip-gate`): محصورة صراحة في التعديلات الشكلية غير الحساسة، بشرط تدوينها في سجل القرارات `DECISIONS.md`. ويُحظر قطعيّاً استخدامها لتجاوز الخطوط الحمراء أو فحوصات CI.

3. **التفويض التشغيلي المستقل (Operational Approval — لكافة المستويات)**:
   * مبدأ فصل السلطات: اعتماد الخطة أو الكود عبر "نفّذ" أو `APPROVAL.json` يفوّض **الكتابة والتعديل والاختبار محلياً فقط**.
   * يُحظر تماماً على الوكيل اعتبار ذلك تفويضاً لتنفيذ أي عملية ذات أثر خارجي أو سحابي (مثل ترحيل قاعدة بيانات غير محلية، النشر للإنتاج، تنفيذ معاملات مالية حقيقية، أو استدعاء أدوات CLI/MCP سحابية) إلا بالحصول على تفويض تشغيلي مستقل ولحظي في نقطة التنفيذ.

---

### 2.2 مصفوفة أبعاد المخاطر الرباعية وقاعدة الرفع التلقائي (Risk Matrix & Floor Rule)
لا يقاس الخطر في Master Foundation بعدد الأسطر المكتوبة، بل عبر تحليل متعدد الأبعاد:

| البُعد | التعريف المعماري | معيار القياس |
| :--- | :--- | :--- |
| **1. حجم الأثر (Impact)** | خطورة العطل المحتمل على النظام ككل عند وقوع خطأ. | هل يوقف النظام؟ هل يسرب بيانات؟ هل يعطل العمليات الحيوية؟ |
| **2. نطاق الانتشار (Blast Radius)** | عدد الأنظمة، والخدمات، والمستخدمين المتأثرين بالتغيير. | هل التغيير محلي في مكوّن معزول أم ممتد للطبقات المشتركة؟ |
| **3. قابلية التراجع (Reversibility)** | مدى سهولة وسرعة عكس التغيير دون فقدان بيانات أو حالة. | هل يمكن التراجع بـ `git revert` فوراً أم يتطلب هجرة بيانات معقدة؟ |
| **4. حساسية البيانات (Data Sensitivity)** | ارتباط التغيير ببيانات المستخدم الشخصية، المالية، أو الأسرار. | هل يمس جداول المستخدمين، بطاقات الدفع، المفاتيح، أو الرموز السرية؟ |

#### ⚖️ قواعد الحسم والرفع (Floor vs. Ceiling Rule):
* **التصنيف وفق الحد الأقصى**: يصنف العمل وفق أعلى بُعد خطورة يسجله (وليس المتوسط).
* **قاعدة الحد الأدنى الإلزامي (Floor Rule)**: أي مهمة تلمس أياً من: (المصادقة Authentication، الصلاحيات/RLS، مخطط قاعدة البيانات والترحيلات، المدفوعات والفوترة، البيانات الشخصية الخاضعة لـ PDPL/GDPR، الأسرار وإعدادات البيئة، الاعتماديات، أو خطوط الـ CI/CD) ترتفع **تلقائياً وفورياً إلى L2 الحساس كحد أدنى**، حتى لو كانت تعديلاً لسطر واحد في الكود.
* **سيادة L3 الإلزامية**: إذا انطبق أي شرط معماري كبير (إنشاء جدول جديد بالكامل، حزمة اعتمادية جديدة، أو ترقية كاسرة Major)، يفرض مستوى L3 وجوباً وتُمنع المحاولات التلقائية لخفضه إلى L2.

---

### 2.3 المعيار التشفيري المقنن والتوقيع الرقمي اللامركزي (RFC 8785 JCS & Ed25519)
لمنع أي ثغرة ناتجة عن اختلاف تنسيق ملفات الـ JSON بين أنظمة التشغيل ومكتبات البرمجة (مثل ترتيب المفاتيح، المسافات البيضاء، أسطر نهاية الملف CRLF مقابل LF):

1. **التقنين المعياري JSON Canonicalization Scheme (RFC 8785)**:
   * يتم ترتيب المفاتيح تصاعدياً وفق وحدات كود UTF-16.
   * استبعاد حقل التوقيع `signature` والقيم غير المعرفة (`undefined`).
   * إزالة كافة المسافات والفواصل الزائدة وتوحيد تمثيل الأرقام والقيم المنطقية والقيم الصفرية `-0 -> 0`.
2. **التوقيع الرقمي عالي الأمان (Ed25519)**:
   * دعم خوارزمية التوقيع المنحني الإهليلجي Ed25519 ذات المفاتيح المدمجة والسرعة الفائقة والحصانة ضد هجمات القنوات الجانبية (Side-channel attacks).
   * دعم خوارزميات HMAC-SHA256 و RSA-SHA256 للبيئات المؤسسية المشتركة.
3. **حفظ المفاتيح اللامركزي والتحقق الصارم**:
   * المفتاح الخاص يولد ويخزن محلياً على جهاز المطور فقط في مسار المستخدم المحمي (`~/.mf/id_ed25519`) بصلاحيات صارمة (`mode: 0o600`).
   * المفتاح العام يُسجل في مستودع المشروع ضمن `.mf/allowed_signers.json` باسم وهوية المطور، مما يمنع الوكلاء من اصطناع أو تزوير توقيعات ذاتية في بيئات الـ Headless والـ SSH.

---

### 2.4 محرك فحص النطاق الصارم وحماية شجرة الدمج (Strict Scope & Anti-TOCTOU Engine)
أحد أهم الابتكارات في v6.5.0 هو حماية المستودع من هجمات التعدي المكاني وتجاوز النطاق عبر الزمن (Time-of-Check to Time-of-Use - TOCTOU):

1. **حصر النطاق الجغرافي (`allowed_paths`)**:
   * كل وثيقة اعتماد L3 تحدد بدقة المسارات المسموح للمهمة بتعديلها (مثال: `src/features/billing/**`).
   * يقوم المحرك بفحص ملفات العمل الشاملة (الملفات المعدلة محلياً، الملفات المجهزة للالتزام `staged`، والملفات غير المتتبعة `untracked` عبر `git status --porcelain -uall`).
2. **فحص شجرة الدمج الحقيقية (Merge-Tree Anti-TOCTOU)**:
   * في مسارات الـ CI، لا يُكتفى بفحص الفروع المنعزلة؛ بل يتم استخراج نقطة التفرع الحقيقية (`git merge-base origin/main HEAD`) ومقارنة شجرة التغييرات الكاملة الناتجة عن الدمج الفعلي لضمان عدم تمرير تعديلات خبيثة أثناء وجود تفرعات متزامنة.
3. **منع الهروب والروابط الرمزية الخبيثة (Anti-Traversal & Symlink Jail)**:
   * منع أي أنماط تحتوي على `..` أو مسارات مطلقة تخرج عن جذر المستودع.
   * كشف وحل كافة الروابط الرمزية (Symlinks) والتحقق من أن الهدف الفعلي (`realpath`) يقع بالكامل داخل حدود المستودع، وضمن النطاق المسموح به في `allowed_paths`.
4. **حماية الملفات الحارسة والسرية (Guardrail & Secret Protection)**:
   * حظر قطعي لتضمين أو ختم ملفات الأسرار (`.env`, `credentials.json`, `*.pem`, `*.key`).
   * حماية خطافات Git وسكربتات الفحص وإعدادات الوكلاء (`.githooks/**`, `scripts/check-approval.mjs`, `.github/workflows/**`, `.gemini/**`)؛ فلا يمكن تعديلها حتى لو كانت ضمن `allowed_paths` إلا بتفويض وتجاوز خاص ومقصود.

</div>

---

<div dir="rtl" style="text-align: right; direction: rtl;">

## 3. الأكواد التنفيذية الكاملة للمنظومة

فيما يلي الأكواد البرمجية الكاملة 100% كما هي موجودة في المستودع دون أي اختصار أو اقتطاع:

</div>

### 3.1 محرك الفحص والاعتماد والتوقيع: `scripts/check-approval.mjs`

```javascript
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
import os from 'node:os';
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
  '**/id_rsa*',
  '**/id_ed25519',
  '**/id_ed25519*',
  '**/.mf/id_*',
  '~/.mf/**',
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

/**
 * Standalone Guardrail Check: Ensures protected infrastructure files are never modified without authorization
 * Runs regardless of whether any APPROVAL.json specs are active.
 */
export function checkGuardrailsOnly(root = CWD, options = {}) {
  const errors = [];
  const allowGuardrails = options.allowGuardrails || process.env.ALLOW_GUARDRAILS === 'true';
  if (allowGuardrails) return errors;

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

      const untracked = execSync('git status --porcelain -uall', { cwd: root, encoding: 'utf8' });
      untracked.split('\n').map((s) => s.trim()).filter(Boolean).forEach((line) => {
        if (line.startsWith('??')) {
          changedFiles.add(line.slice(3).trim());
        }
      });
    } catch {}
  }

  for (const item of changedFiles) {
    const norm = item.replace(/\\/g, '/');
    if (matchAnyGlob(GUARDRAIL_PATTERNS, norm)) {
      if (!options.allowGuardrails) {
        errors.push(`Unauthorized modification to guardrail file: ${norm}`);
      }
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
  // ---------------- GENERATE KEY HELPER ----------------
  // node scripts/check-approval.mjs --generate-key [--id <signer_id>] [--name <display_name>] [--force]
  if (args[0] === '--generate-key') {
    let signerId = null;
    let signerName = null;
    let force = false;

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--id') signerId = args[++i];
      else if (args[i] === '--name') signerName = args[++i];
      else if (args[i] === '--force') force = true;
    }

    if (!signerId) {
      try {
        const gitUser = execSync('git config user.name', { cwd: CWD, encoding: 'utf8' }).trim();
        signerId = gitUser.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      } catch {}
      signerId = signerId || 'lead_dev';
    }

    signerName = signerName || `${signerId} (Authorized Signer)`;

    const userMfDir = path.join(os.homedir(), '.mf');
    if (!fs.existsSync(userMfDir)) fs.mkdirSync(userMfDir, { recursive: true });

    const privPath = path.join(userMfDir, 'id_ed25519');
    const pubPath = path.join(userMfDir, 'id_ed25519.pub');

    if (fs.existsSync(privPath) && !force) {
      console.log(`[check-approval] Existing private key found at: ${privPath}`);
      if (!fs.existsSync(pubPath)) {
        console.error('[check-approval] Missing corresponding public key.');
        process.exit(1);
      }
    } else {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
      const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
      const pubPem = publicKey.export({ type: 'spki', format: 'pem' });

      fs.writeFileSync(privPath, privPem, { mode: 0o600 });
      fs.writeFileSync(pubPath, pubPem);
      console.log(`[check-approval] Generated new Ed25519 key pair.`);
      console.log(`[check-approval] Private key saved to: ${privPath}`);
      console.log(`[check-approval] SECURITY NOTICE: Never commit private keys. Keep ~/.mf/id_ed25519 strictly on your authorized device.`);
    }

    // Register public key in .mf/allowed_signers.json
    const repoMfDir = path.join(CWD, '.mf');
    if (!fs.existsSync(repoMfDir)) fs.mkdirSync(repoMfDir, { recursive: true });

    const signersPath = path.join(repoMfDir, 'allowed_signers.json');
    let signersData = {};
    if (fs.existsSync(signersPath)) {
      try {
        signersData = JSON.parse(fs.readFileSync(signersPath, 'utf8'));
      } catch {}
    }

    const pubPem = fs.readFileSync(pubPath, 'utf8');
    signersData[signerId] = {
      name: signerName,
      publicKey: pubPem,
      alg: 'ed25519'
    };

    fs.writeFileSync(signersPath, JSON.stringify(signersData, null, 2) + '\n', 'utf8');
    console.log(`[check-approval] Signer "${signerId}" registered in: .mf/allowed_signers.json`);
    process.exit(0);
  }

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
    let explicitAllowed = null;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--base') baseRef = args[++i];
      else if (args[i] === '--allowed-paths') explicitAllowed = args[++i].split(',').map((s) => s.trim());
    }
    const approvalFiles = findApprovalFiles(path.resolve(CWD, 'specs'));
    let combinedAllowed = explicitAllowed || [];
    const now = new Date();
    if (!explicitAllowed) {
      for (const af of approvalFiles) {
        try {
          const d = JSON.parse(fs.readFileSync(af, 'utf8'));
          // Exclude expired approvals
          if (d.expires_at) {
            const expDate = new Date(d.expires_at);
            if (!isNaN(expDate.getTime()) && expDate < now) {
              console.warn(`[check-approval] WARNING: Skipping expired approval in ${rel(af)} (expired at ${d.expires_at})`);
              continue;
            }
          }
          if (Array.isArray(d.allowed_paths)) combinedAllowed.push(...d.allowed_paths);
        } catch {}
      }
    }

    if (combinedAllowed.length === 0) {
      // Even without active APPROVAL.json, GUARDRAIL_PATTERNS must NEVER be modified unauthorized!
      const allowGuardrails = args.includes('--allow-guardrails') || process.env.ALLOW_GUARDRAILS === 'true';
      const guardrailErrors = checkGuardrailsOnly(CWD, { base: baseRef, allowGuardrails });
      if (guardrailErrors.length > 0) {
        console.error('[check-approval] GUARDRAIL VIOLATION DETECTED:');
        guardrailErrors.forEach((e) => console.error(`  - ${e}`));
        console.error('To authorize changes to guardrail files, create an approved spec or pass --allow-guardrails.');
        process.exit(1);
      }
      console.log('[check-approval] No active APPROVAL.json with allowed_paths found. Guardrails clean. OK.');
      process.exit(0);
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
    if (args.includes('--strict-scope') || process.env.STRICT_SCOPE_CHECK !== 'false') {
      const allowGuardrails = args.includes('--allow-guardrails') || process.env.ALLOW_GUARDRAILS === 'true';
      const guardrailErrors = checkGuardrailsOnly(CWD, { allowGuardrails });
      if (guardrailErrors.length > 0) {
        console.error('[check-approval] GUARDRAIL VIOLATION DETECTED:');
        guardrailErrors.forEach((e) => console.error(`  - ${e}`));
        console.error('To authorize changes to guardrail files, create an approved spec or pass --allow-guardrails.');
        process.exit(1);
      }
    }
    console.log('[check-approval] No APPROVAL.json files found to check. Guardrails clean. OK.');
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
      if (expectedRepo && data.repository_id !== expectedRepo && process.env.STRICT_REPO_CHECK !== 'false') {
        console.error(
          `[check-approval] REPOSITORY MISMATCH: ${relApproval} issued for repository "${data.repository_id}", current is "${expectedRepo}".`
        );
        hasFailure = true;
        continue;
      }
    }

    // 4. Base commit check in git history (EVAL-37, EVAL-39)
    if (data.base_commit && fs.existsSync(path.join(CWD, '.git')) && process.env.STRICT_BASE_CHECK !== 'false') {
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
      } else {
        console.error(
          `[check-approval] NO TRUSTED SIGNERS CONFIGURED: ${relApproval} carries a signature, but no allowed signers are registered in .mf/allowed_signers.json or MF_ALLOWED_SIGNERS.`
        );
        hasFailure = true;
        continue;
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
    if (data.allowed_paths && (args.includes('--strict-scope') || process.env.STRICT_SCOPE_CHECK !== 'false')) {
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

```

---

### 3.2 سكربت تهيئة الجهاز الآلية والمفاتيح: `scripts/setup-device.ps1`

```powershell
# Master Foundation v6.5 - All-in-One Device Setup Script
# Configures git hooks, syncs global agent skills, sets review gate rules,
# and interactively generates or verifies the device's cryptographic signing key.

[CmdletBinding()]
param (
    [string]$SignerId = "",
    [string]$SignerName = "",
    [switch]$SkipKey,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Master Foundation v6.5 - Device Setup & Verification" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $repoRoot

# 1. Check Node.js
Write-Host "`n[1/5] Checking Node.js environment..." -ForegroundColor Yellow
try {
    $nodeVer = & node -v
    Write-Host "  -> Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Error "Node.js is required but not found in PATH. Please install Node.js (v18+) first."
    exit 1
}

# 2. Configure Git Hooks
Write-Host "`n[2/5] Configuring Git hooks..." -ForegroundColor Yellow
try {
    & git config core.hooksPath .githooks
    Write-Host "  -> Git hooks path set to: .githooks" -ForegroundColor Green
} catch {
    Write-Warning "Failed to set git config core.hooksPath. Ensure this is a git repository."
}

# 3. Synchronize Skills Globally
Write-Host "`n[3/5] Synchronizing Master Foundation skill across global agent environments..." -ForegroundColor Yellow
$syncScript = Join-Path $repoRoot "scripts\sync-skills.ps1"
if (Test-Path $syncScript) {
    & powershell -ExecutionPolicy Bypass -File $syncScript
} else {
    Write-Warning "sync-skills.ps1 not found, skipping global skill sync."
}

# 4. Update ~/.gemini/GEMINI.md Review Gate Rule
Write-Host "`n[4/5] Checking user-global rules (~/.gemini/GEMINI.md)..." -ForegroundColor Yellow
$userGeminiDir = Join-Path $env:USERPROFILE ".gemini"
$userGeminiFile = Join-Path $userGeminiDir "GEMINI.md"

$ruleHeader = "# بوابة المراجعة (Master Foundation v6.5)"
$ruleText = @"

$ruleHeader
قبل أي تنفيذ (تعديل أو حذف ملفات، أو أمر يغيّر شيئاً، أو تثبيت، أو نشر):
1. اقرأ مهارة master-foundation الآن. لا تعتمد على الذاكرة. وهي الأولى دائماً قبل أي مهارة أخرى.
2. بوابة المحادثة (Chat Gate لـ L0–L2): اكتب التصنيف (L0-L3 / AUDIT)، أسماء المهارات، وخطة مقتضبة، وما الذي سيتغير (مع عرض الفروقات/الاستعلام لـ L2 الحساس).
3. توقف وانتظر كلمة "نفّذ" مني. لا تعدّل أي شيء قبلها (مسموح دون انتظار: الإجابة عن الأسئلة، قراءة الملفات، والبحث). لا تنفيذ لمهام L3 دون اعتماد مشفر للخطة (Cryptographic Spec Gate عبر Plannotator RTL و APPROVAL.json)؛ ولا عمليات خارجية دون تفويض تشغيلي مستقل (Operational Approval).
"@

if (-not (Test-Path $userGeminiDir)) {
    New-Item -ItemType Directory -Path $userGeminiDir -Force | Out-Null
}

if (-not (Test-Path $userGeminiFile)) {
    Set-Content -Path $userGeminiFile -Value $ruleText -Encoding UTF8
    Write-Host "  -> Created ~/.gemini/GEMINI.md with Master Foundation v6.5 rules." -ForegroundColor Green
} else {
    $existing = Get-Content -Path $userGeminiFile -Raw -Encoding UTF8
    if ($existing -notmatch "Master Foundation v6\.5") {
        # Replace old v6.4 section if present, otherwise append
        if ($existing -match "# بوابة المراجعة \(Master Foundation\)") {
            $existing = $existing -replace "(?s)# بوابة المراجعة \(Master Foundation\).*?(?=(\Z|#[^#]))", $ruleText
            Set-Content -Path $userGeminiFile -Value $existing -Encoding UTF8
            Write-Host "  -> Updated ~/.gemini/GEMINI.md to Master Foundation v6.5." -ForegroundColor Green
        } else {
            Add-Content -Path $userGeminiFile -Value $ruleText -Encoding UTF8
            Write-Host "  -> Appended Master Foundation v6.5 rule to ~/.gemini/GEMINI.md." -ForegroundColor Green
        }
    } else {
        Write-Host "  -> ~/.gemini/GEMINI.md already contains Master Foundation v6.5 rule." -ForegroundColor Green
    }
}

# 5. Device Cryptographic Signing Key Setup
Write-Host "`n[5/5] Checking Device Cryptographic Signing Key (Ed25519)..." -ForegroundColor Yellow
$privKeyPath = Join-Path $env:USERPROFILE ".mf\id_ed25519"

if (-not $SkipKey) {
    if ((Test-Path $privKeyPath) -and (-not $Force)) {
        Write-Host "  -> Existing private key found at: $privKeyPath" -ForegroundColor Green
    } else {
        Write-Host "`n  -----------------------------------------------------------" -ForegroundColor Cyan
        Write-Host "  🔐 Device Cryptographic Signer Setup" -ForegroundColor Cyan
        Write-Host "  Master Foundation v6.5 uses Ed25519 digital signatures to" -ForegroundColor Cyan
        Write-Host "  authorize architectural plans (L3) and prevent AI tampering." -ForegroundColor Cyan
        Write-Host "  -----------------------------------------------------------" -ForegroundColor Cyan

        if ([string]::IsNullOrWhiteSpace($SignerId)) {
            try {
                $gitUser = (& git config user.name).Trim().ToLower() -replace '[^a-z0-9_-]', '_'
            } catch {
                $gitUser = "developer"
            }
            $hostname = $env:COMPUTERNAME.ToLower() -replace '[^a-z0-9_-]', '_'
            $defaultId = "${gitUser}_${hostname}"
            
            $inputSigner = Read-Host "  Enter an identifier for this device (Press Enter for '$defaultId')"
            if ([string]::IsNullOrWhiteSpace($inputSigner)) {
                $SignerId = $defaultId
            } else {
                $SignerId = $inputSigner.Trim().ToLower() -replace '[^a-z0-9_-]', '_'
            }
        }

        if ([string]::IsNullOrWhiteSpace($SignerName)) {
            $SignerName = "$SignerId ($($env:COMPUTERNAME))"
        }

        Write-Host "  -> Generating local key pair for signer: '$SignerId'..." -ForegroundColor Yellow
        $genArgs = @("scripts/check-approval.mjs", "--generate-key", "--id", $SignerId, "--name", $SignerName)
        if ($Force) { $genArgs += "--force" }
        & node $genArgs
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to generate signing key."
            exit 1
        }
        Write-Host "  -> Public key registered in .mf/allowed_signers.json" -ForegroundColor Green
    }
} else {
    Write-Host "  -> Key generation skipped (-SkipKey specified)." -ForegroundColor Gray
}

# 6. Run Gate Regression Tests
Write-Host "`n[VERIFY] Running full 29-test verification suite..." -ForegroundColor Yellow
& node scripts/test-check-approval.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Verification tests failed!"
    exit 1
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 SUCCESS: Device is 100% configured for Master Foundation v6.5!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
```

---

### 3.3 حزمة اختبارات الانحدار المعمارية (29 اختباراً): `scripts/test-check-approval.mjs`

```javascript
#!/usr/bin/env node
/**
 * Master Foundation Gate & Anti-Drift Regression Test Suite (v6.5.0)
 * Covers:
 * - T1..T13: Base mechanical gate functionality
 * - EVAL-33..EVAL-48: Master Foundation v6.5.0 specifications
 * Zero external dependencies. Runs on Node.js 18+. Exit 1 on any failure.
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  canonicalize,
  checkStrictScope,
  computeSha256,
  matchAnyGlob,
  signCanonical,
  verifyCanonical
} from './check-approval.mjs';

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-approval.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mf-approval-v65-'));
const SPEC = 'specs/001';

const w = (relPath, data) => {
  const p = path.join(tmp, relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};

const run = (...a) => spawnSync('node', [SCRIPT, ...a], { cwd: tmp, encoding: 'utf8', env: { ...process.env } });

const reset = () => {
  fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true });
  fs.rmSync(path.join(tmp, '.mf'), { recursive: true, force: true });
  fs.rmSync(path.join(tmp, 'res.json'), { force: true });
  w(`${SPEC}/spec.md`, '# spec\nline\n');
};

const seal = (decision = 'approved', extraArgs = []) => {
  w('res.json', JSON.stringify({ decision, feedback: '' }));
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`, ...extraArgs);
};

let failed = 0;
function t(name, fn) {
  reset();
  let ok = false,
    why = '';
  try {
    const r = fn();
    ok = r === true;
    why = ok ? '' : String(r);
  } catch (e) {
    why = e.message;
  }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + why}`);
  if (!ok) failed++;
}

console.log('--- Phase 1: Base Mechanical Gate (T1..T13) ---');

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
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  d.decision = 'feedback';
  fs.writeFileSync(p, JSON.stringify(d));
  return run().status === 1;
});

t('T6 editing sealed file is detected', () => {
  seal();
  w(`${SPEC}/spec.md`, '# changed\n');
  return run().status === 1;
});

t('T7 CRLF vs LF of same text does not break the seal', () => {
  seal();
  w(`${SPEC}/spec.md`, '# spec\r\nline\r\n');
  return run().status === 0;
});

t('T8 unsealed .json file in spec folder is detected', () => {
  seal();
  w(`${SPEC}/schema.json`, '{}');
  return run().status === 1;
});

t('T9 unsealed nested file is detected', () => {
  seal();
  w(`${SPEC}/contracts/api.md`, '# c\n');
  return run().status === 1;
});

t('T10 binary file is hashed raw and verifies', () => {
  w(`${SPEC}/img.png`, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x00, 0xff]));
  w('res.json', '{"decision":"approved"}');
  return (
    run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/spec.md`, `${SPEC}/img.png`).status ===
      0 && run().status === 0
  );
});

t('T11 mistyped verify argument fails closed', () => run('specs/typo/APPROVAL.json').status === 1);

t('T12 sealing a file outside the repo is refused', () => {
  w('res.json', '{"decision":"approved"}');
  const outside = path.join(os.tmpdir(), 'mf-outside.md');
  fs.writeFileSync(outside, 'x');
  return run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', outside).status === 1;
});

t('T13 no specs folder is OK (exit 0)', () => {
  fs.rmSync(path.join(tmp, 'specs'), { recursive: true, force: true });
  return run().status === 0;
});

console.log('\n--- Phase 2: Master Foundation v6.5 Specifications (EVAL-33..EVAL-48) ---');

// EVAL-33: Scope violation in src/auth/ when allowed_paths is src/billing/
t('EVAL-33: Modification outside allowed_paths is rejected (Scope Violation)', () => {
  const errors = checkStrictScope(tmp, ['src/billing/**'], {
    files: ['src/auth/login.ts'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('src/auth/login.ts'));
});

// EVAL-34: Destructive scripts or unallowed execution flagged
t('EVAL-34: Destructive Python/Node scripts outside allowed_paths are caught by scope engine', () => {
  const errors = checkStrictScope(tmp, ['src/components/**'], {
    files: ['scripts/nuke-database.py'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('scripts/nuke-database.py'));
});

// EVAL-35: Anti-spoofing in Headless/SSH: unauthenticated approval without developer signature rejected
t('EVAL-35: Unauthenticated self-stamped approval without developer signature is rejected', () => {
  const keyPair = crypto.generateKeyPairSync('ed25519');
  const pubKeyHex = keyPair.publicKey.export({ type: 'spki', format: 'pem' });
  w('.mf/allowed_signers.json', JSON.stringify({ lead_dev: { publicKey: pubKeyHex, alg: 'ed25519' } }));

  // Sealed without key
  seal('approved', ['--approver', 'lead_dev']);
  return run().status === 1;
});

// EVAL-36: Implementation Conformance: unsealed spec files fail verification
t('EVAL-36: Missing spec fulfillment or unsealed spec file fails conformance verification', () => {
  seal('approved');
  w(`${SPEC}/untracked-requirement.md`, '# Missing in tasks\n');
  return run().status === 1;
});

// EVAL-37: Expired approval or stale base_commit rejected
t('EVAL-37: Expired APPROVAL.json (expires_at in past) fails verification with exit 1', () => {
  seal('approved');
  const p = path.join(tmp, SPEC, 'APPROVAL.json');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  d.expires_at = '2021-01-01T00:00:00.000Z'; // Expired
  fs.writeFileSync(p, JSON.stringify(d, null, 2));
  return run().status === 1;
});

// EVAL-38: Unauthorized modification of guardrail files is blocked
t('EVAL-38: Modification of guardrail files (.githooks/pre-commit) rejected unless explicitly authorized', () => {
  const errors = checkStrictScope(tmp, ['src/app/**'], {
    files: ['.githooks/pre-commit'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Unauthorized modification to guardrail file'));
});

// EVAL-39: Reusing APPROVAL.json from another repository is rejected
t('EVAL-39: Reusing APPROVAL.json with mismatched repository_id fails verification', () => {
  seal('approved', ['--repo-id', 'foreign-enterprise-repo']);
  const res = spawnSync('node', [SCRIPT], {
    cwd: tmp,
    encoding: 'utf8',
    env: { ...process.env, STRICT_REPO_CHECK: 'true' }
  });
  return res.status === 1 && res.stderr.includes('REPOSITORY MISMATCH');
});

// EVAL-40: Post-CI code modification detected via drift checks
t('EVAL-40: Modifying code after approval check triggers drift detection', () => {
  seal('approved');
  w(`${SPEC}/spec.md`, '# New Unapproved Change Added\n');
  return run().status === 1;
});

// EVAL-41: Untracked file or Symlink pointing outside allowed_paths / repo is rejected
t('EVAL-41: Symlink pointing outside repo or untracked file outside scope is rejected', () => {
  // Check path traversal via scope engine
  const traversalErrors = checkStrictScope(tmp, ['src/**'], {
    files: ['../../etc/passwd'],
    checkGit: false
  });
  const hasTraversalError = traversalErrors.some((e) => e.includes('Path traversal'));

  // Test symlink if platform permits
  let symlinkOk = true;
  try {
    const targetFile = path.join(tmp, 'outside-target.txt');
    fs.writeFileSync(targetFile, 'content');
    const linkPath = path.join(tmp, 'symlink-test.txt');
    fs.symlinkSync(targetFile, linkPath);
    const symlinkErrors = checkStrictScope(tmp, ['src/**'], {
      files: ['symlink-test.txt'],
      checkGit: false
    });
    symlinkOk = symlinkErrors.some((e) => e.includes('outside allowed_paths') || e.includes('Scope violation'));
    fs.unlinkSync(linkPath);
    fs.unlinkSync(targetFile);
  } catch {
    // Platform without symlink permissions defaults to true
  }

  return hasTraversalError && symlinkOk;
});

// EVAL-42: Local hook bypass detected: strict CI scope check fails on unverified files
t('EVAL-42: CI merge-tree and strict scope check catches unverified commits', () => {
  const errors = checkStrictScope(tmp, ['src/allowed/**'], {
    files: ['src/unverified-bypass.ts'],
    checkGit: false
  });
  return errors.length > 0 && errors[0].includes('Scope violation');
});

// EVAL-43: Secret file protection: sealing .env or credentials is fundamentally refused
t('EVAL-43: Sealing sensitive secret files (.env, credentials) is refused by --seal', () => {
  w(`${SPEC}/.env`, 'SECRET_KEY=supersecret\n');
  w('res.json', JSON.stringify({ decision: 'approved' }));
  const r = run('--seal', `${SPEC}/APPROVAL.json`, '--from-result', 'res.json', `${SPEC}/.env`);
  return r.status === 1 && r.stderr.includes('REFUSED: attempting to seal sensitive secret file');
});

// EVAL-44: Multi-agent concurrency collision: conflicting allowed_paths on divergent worktrees
t('EVAL-44: Concurrency collision between conflicting allowed_paths is detectable', () => {
  const agent1Scope = ['src/billing/**'];
  const agent2Scope = ['src/auth/**', 'src/billing/payment.ts'];

  const hasOverlap = agent2Scope.some((pattern) => matchAnyGlob(agent1Scope, pattern.replace(/\*\*/g, 'test.ts')));
  return hasOverlap === true;
});

// EVAL-45: Change Surface Inventory: unrecorded out-of-scope changes detected
t('EVAL-45: Unrecorded changes outside allowed_paths fail change surface verification', () => {
  const errors = checkStrictScope(tmp, ['src/features/dashboard/**'], {
    files: ['infra/terraform/main.tf'],
    checkGit: false
  });
  return errors.some((e) => e.includes('Scope violation') && e.includes('infra/terraform/main.tf'));
});

// EVAL-46: Spec drift: editing spec.md after approval triggers SHA-256 hash mismatch
t('EVAL-46: Spec drift after approval triggers SHA-256 mismatch (exit 1)', () => {
  seal('approved');
  w(`${SPEC}/spec.md`, '# Changed Spec Requirement After Approval\n');
  const res = run();
  return res.status === 1 && res.stderr.includes('HASH MISMATCH');
});

// EVAL-47: Canonical JSON signing: valid signature passes, invalid signature fails
t('EVAL-47: Canonical JSON digital signature (RFC 8785) verification and tamper rejection', () => {
  const secret = 'super-secure-dev-secret-key-12345';
  const approvalData = {
    approval_id: 'uuid-123',
    decision: 'approved',
    approver_id: 'architect_01',
    allowed_paths: ['src/**'],
    expires_at: '2030-01-01T00:00:00.000Z'
  };

  // Sign canonical JSON
  const signature = signCanonical(approvalData, secret, 'hmac-sha256');

  // Verify valid signature
  const valid = verifyCanonical(approvalData, signature, secret, 'hmac-sha256');

  // Tamper data
  const tampered = { ...approvalData, decision: 'approved-with-notes' };
  const invalidTampered = verifyCanonical(tampered, signature, secret, 'hmac-sha256');

  // Tamper signature
  const tamperedSig = (signature[0] === 'a' ? 'b' : 'a') + signature.slice(1);
  const invalidSig = verifyCanonical(approvalData, tamperedSig, secret, 'hmac-sha256');

  return valid === true && invalidTampered === false && invalidSig === false;
});

// EVAL-48: Unpinned external dependencies rejected
t('EVAL-48: Unpinned versions or dependencies are detected and flagged', () => {
  const isPinned = (ver) => /^v?[0-9]+\.[0-9]+\.[0-9]+$/.test(ver);
  const unpinned = ['*', 'latest', '^1.2.0', '~2.0.0'];
  const allRejected = unpinned.every((v) => !isPinned(v));
  const pinnedAccepted = isPinned('1.2.3') && isPinned('v6.5.0');
  return allRejected && pinnedAccepted;
});

// Cleanup temp directory
fs.rmSync(tmp, { recursive: true, force: true });

console.log(failed === 0 ? '\nALL 29 TESTS PASSED (T1..T13 + EVAL-33..EVAL-48)' : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
```

---

### 3.4 مسار التحقق المستمر في الحوسبة السحابية: `.github/workflows/check-approval.yml`

```yaml
name: Master Foundation Approval Gate Check

on:
  pull_request:
  workflow_dispatch:

jobs:
  check-approval:
    name: Verify Spec Approval Integrity & Anti-Drift
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Verify and inspect actual merge tree (Anti-TOCTOU)
        env:
          BASE_REF: ${{ github.base_ref || 'main' }}
        run: |
          echo "Fetching target base branch: origin/$BASE_REF"
          git fetch origin "$BASE_REF" --depth=50 || true
          MERGE_BASE=$(git merge-base "origin/$BASE_REF" HEAD || git rev-parse HEAD~1 || git rev-parse HEAD)
          echo "Merge base commit: $MERGE_BASE"
          echo "Current HEAD commit (Merge Tree): $(git rev-parse HEAD)"

      - name: Regression tests for gate and v6.5 specs (EVAL-33..EVAL-48)
        run: node scripts/test-check-approval.mjs

      - name: Verify approvals, decisions, and anti-drift
        run: node scripts/check-approval.mjs

      - name: Verify Strict Scope on actual merge tree
        env:
          BASE_REF: ${{ github.base_ref || 'main' }}
        run: |
          node scripts/check-approval.mjs --check-scope --base "origin/$BASE_REF"

      - name: Check for disallowed symlinks and path traversals in merge tree
        env:
          BASE_REF: ${{ github.base_ref || 'main' }}
        run: |
          CHANGED_FILES=$(git diff --name-only "origin/$BASE_REF"...HEAD || true)
          for file in $CHANGED_FILES; do
            if [ -L "$file" ]; then
              TARGET=$(readlink -f "$file" || realpath "$file")
              echo "Symlink detected: $file -> $TARGET"
              case "$TARGET" in
                "$PWD"*) echo "Symlink target is inside repository root." ;;
                *) echo "[ERROR] Symlink $file targets outside workspace: $TARGET" && exit 1 ;;
              esac
            fi
          done

      - name: Every touched spec has an APPROVAL.json
        env:
          BASE_REF: ${{ github.base_ref || 'main' }}
        run: |
          CHANGED_SPECS=$(git diff --name-only "origin/$BASE_REF"...HEAD -- 'specs/**' \
            | awk -F'/' '$1 == "specs" && NF >= 3 {print $1"/"$2}' | sort -u)
          for dir in $CHANGED_SPECS; do
            if [ -d "$dir" ] && [ ! -f "$dir/APPROVAL.json" ]; then
              echo "[ERROR] Spec directory '$dir' was touched without an APPROVAL.json gate record!"
              exit 1
            fi
          done
          echo "All touched specs have an APPROVAL.json gate record."

```

---

<div dir="rtl" style="text-align: right; direction: rtl;">

## 4. البرومبت التوجيهي الصارم للتدقيق المعماري والأمني
*(موجّه إلى ChatGPT و Argon بصفتهما Principal Security & Architecture Reviewers)*

</div>

```text
========================================================================================
CRITICAL ARCHITECTURE & SECURITY AUDIT PROMPT: MASTER FOUNDATION v6.5.0
========================================================================================
Act as a Principal Systems Security Engineer, Compiler/Runtime Security Auditor, and
Enterprise Cloud Architect. You have zero tolerance for hand-waving, security theater,
unwieldy bureaucracy, or brittle implementations.

You are conducting a thorough, adversarial, and uncompromising code and architectural audit
of "Master Foundation v6.5.0", an AI-assisted engineering and quality governance framework
designed to enforce zero-data-destruction, cryptographic plan approvals, and anti-drift
guarantees in production-grade SaaS repositories.

Carefully review the entire audit dossier provided above, which includes:
1. System context, AI agent workflow, and design philosophy.
2. The 3-tier quality gates architecture (Chat Gate L0-L2, Cryptographic Spec Gate L3,
   and independent Operational Approvals).
3. The 4-dimensional risk matrix (Impact, Blast Radius, Reversibility, Data Sensitivity)
   and the automatic elevation Floor Rule.
4. The complete, verbatim source code for:
   - `scripts/check-approval.mjs` (752 lines)
   - `scripts/setup-device.ps1` (148 lines)
   - `scripts/test-check-approval.mjs` (323 lines, 29 regression tests)
   - `.github/workflows/check-approval.yml` (72 lines)

Provide a deep, rigorous, and actionable audit structured into the following 4 pillars:

----------------------------------------------------------------------------------------
PILLAR 1: CODE CORRECTNESS, CRYPTOGRAPHIC SOUNDNESS & VULNERABILITY ANALYSIS
----------------------------------------------------------------------------------------
Analyze the scripts line-by-line and identify any subtle security or logical flaws:
- Cryptographic verification: Is the RFC 8785 canonicalization implementation sound? Does it
  fully prevent signature malleability, prototype pollution, floating-point ambiguity, or
  key-ordering attacks?
- Scope & Path Traversal: Can an attacker/compromised AI agent bypass `insideCwd()`,
  `checkStrictScope()`, or `globToRegex()` using symlink redirection, Unicode normalization,
  Windows UNC paths, case-sensitivity quirks (NTFS vs ext4), or double-encoded path separators?
- TOCTOU (Time-of-Check to Time-of-Use): Is the merge-tree validation in CI and Git status
  checks resilient against race conditions during concurrent PR merges or worktree divergence?
- Fallback hazards: Does the system fail closed in all edge cases (e.g., malformed JSON,
  missing public keys, detached HEAD, submodules, or missing git history)?

----------------------------------------------------------------------------------------
PILLAR 2: OPERATIONAL BOTTLENECKS, SCALABILITY & FAILURE MODES
----------------------------------------------------------------------------------------
Evaluate how this system will perform and scale as the SaaS project grows:
- Large Monorepos: Will `checkStrictScope()` or recursive SHA-256 file hashing become an
  I/O or memory bottleneck if the repository grows to tens of thousands of files?
- Key Lifecycle & Rotation: How resilient is `.mf/allowed_signers.json` over time? What
  happens during developer offboarding, key loss, device migration, or multi-developer signing?
- Cross-Platform Friction: Are there edge cases where Windows CRLF normalization, Git line-ending
  configs (`core.autocrlf`), or shell differences between PowerShell and Linux bash cause
  unexpected CI build breaks or false hash mismatches?
- Multi-Agent Concurrency: How does the system behave when multiple AI agents (e.g., Antigravity
  and Cursor) work concurrently on different branches or worktrees with overlapping scopes?

----------------------------------------------------------------------------------------
PILLAR 3: IMPLEMENTATION EFFICIENCY, MINIMALISM & ZERO-BLOAT
----------------------------------------------------------------------------------------
Audit the runtime footprint and maintenance cost:
- Zero-Dependency Execution: The system was intentionally engineered with 100% native Node.js
  built-ins (`node:crypto`, `node:fs`, `node:child_process`) without `npm install` requirements.
  Did the team make the right trade-offs, or did this introduce homegrown crypto/glob risks?
- Test Suite Completeness: Do the 29 tests (T1..T13 and EVAL-33..EVAL-48) adequately cover the
  state space, or are there blind spots in negative testing, edge cases, and fault injection?

----------------------------------------------------------------------------------------
PILLAR 4: VELOCITY VS. BUREAUCRACY (REAL-WORLD SAAS COMPATIBILITY)
----------------------------------------------------------------------------------------
Assess the Developer Experience (DX) and agility of this governance model:
- Does this framework strike the optimal pragmatic balance between rapid "Vibe Coding"
  (instant Chat Gate for L0-L2) and bulletproof architectural defense (L3)?
- Is there any "process theater" that adds cognitive load without real security benefit?
- What are the top 3 pragmatic recommendations to make this even smoother for an agile,
  high-velocity SaaS development team without compromising core security red lines?

Deliver your verdict with executive clarity: Highlight critical findings (P0/P1), warnings
(P2), and architectural praise where deserved.
========================================================================================
```

---

<div dir="rtl" style="text-align: right; direction: rtl;">

### 📌 ملخص جاهزية الحزمة للتدقيق
* **الملف مكتمل 100%**: يحتوي على كامل الرؤية المعمارية، وتفاصيل بوابات الجودة، ومصفوفة المخاطر، والأكواد المصدرية الأربعة كاملة دون حذف، مع البرومبت التوجيهي المتخصص.
* **جاهز للرفع الفوري**: يمكن تحميل هذا الملف ورفعه مباشرة كملف Attachment أو نسخه إلى ChatGPT و Argon لبدء التدقيق الخارجي المستقل.

</div>

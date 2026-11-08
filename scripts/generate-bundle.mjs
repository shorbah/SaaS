#!/usr/bin/env node
/**
 * Master Foundation Bundle Generator (v6.5.0)
 * Assembles all modular Master Foundation files into a single distribution bundle.
 * Fails closed (exit 1) if any source file is missing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = path.join(ROOT_DIR, '.agents', 'skills', 'master-foundation');
const OUTPUT_FILE = path.join(ROOT_DIR, 'MASTER_FOUNDATION_V6_5_BUNDLE.md');

const BUNDLE_FILES = [
  { header: 'master-foundation/SKILL.md', file: path.join(SOURCE_DIR, 'SKILL.md') },
  { header: 'master-foundation/references/workflow.md', file: path.join(SOURCE_DIR, 'references', 'workflow.md') },
  { header: 'master-foundation/references/security.md', file: path.join(SOURCE_DIR, 'references', 'security.md') },
  { header: 'master-foundation/references/data-and-migrations.md', file: path.join(SOURCE_DIR, 'references', 'data-and-migrations.md') },
  { header: 'master-foundation/references/git-and-environments.md', file: path.join(SOURCE_DIR, 'references', 'git-and-environments.md') },
  { header: 'master-foundation/references/architecture-and-profiles.md', file: path.join(SOURCE_DIR, 'references', 'architecture-and-profiles.md') },
  { header: 'master-foundation/references/ui-and-brand.md', file: path.join(SOURCE_DIR, 'references', 'ui-and-brand.md') },
  { header: 'master-foundation/references/deliverables.md', file: path.join(SOURCE_DIR, 'references', 'deliverables.md') },
  { header: 'master-foundation/references/skills-map.md', file: path.join(SOURCE_DIR, 'references', 'skills-map.md') },
  { header: 'master-foundation/references/decisions-adr.md', file: path.join(SOURCE_DIR, 'references', 'decisions-adr.md') },
  { header: 'master-foundation/README.md', file: path.join(SOURCE_DIR, 'README.md') },
  { header: 'master-foundation/evals/trigger-evals.md', file: path.join(SOURCE_DIR, 'evals', 'trigger-evals.md') },
];

console.log('[generate-bundle] Validating source files...');
let missing = false;
for (const entry of BUNDLE_FILES) {
  if (!fs.existsSync(entry.file)) {
    console.error(`[generate-bundle] ERROR: Missing source file: ${entry.file}`);
    missing = true;
  }
}

if (missing) {
  console.error('[generate-bundle] FAILED: Cannot generate bundle due to missing files.');
  process.exit(1);
}

const preamble = `# Master Foundation v6.5 — الحزمة الكاملة المبسّطة (Bundle)

> مرجع عملي موحّد للعمل مع الوكلاء البرمجيين (Antigravity و Claude وغيرهما): تطبيقات، ميزات، واجهات، ملفات، وعروض.
> إصدار هندسي صارم وشامل (Industrial-Grade) يجمع بين الأمان القطعي، وبوابات الاعتماد المشفرة والمحددة بالنطاق، ونظام البوابات الثلاث المستقلة، ومصفوفة أبعاد المخاطر وقاعدة الحد الأدنى (Floor Rule).

---

## كيف تستخدم هذا الملف

هذا ملف مجمّع للقراءة والنسخ والمراجعة والتدقيق. عند التثبيت كمهارة في بيئتك، افصل كل قسم \`FILE:\` إلى ملفه بالمسار المذكور:

\`\`\`
master-foundation/            ← مجلد المهارة (يقرأه الوكيل)
├── SKILL.md
└── references/
    ├── workflow.md
    ├── security.md
    ├── data-and-migrations.md
    ├── git-and-environments.md
    ├── architecture-and-profiles.md
    ├── ui-and-brand.md
    ├── deliverables.md
    ├── skills-map.md
    └── decisions-adr.md

خارج مجلد المهارة (للبشر ودستور المشروع):
├── README.md                 ← التثبيت والتحقق
├── evals/trigger-evals.md    ← اختبارات التفعيل والحدود
├── AGENTS.md (كتلة قصيرة)    ← في جذر كل مشروع
└── .specify/memory/constitution.md ← دستور Spec Kit المتزامن
\`\`\`

## مبدأ الاستخدام السريع

- هذه الحزمة مرجع للتوزيع والمراجعة؛ عند تثبيتها كمهارة، افصل أقسام \`FILE:\` إلى الملفات الموضّحة في الهيكل أعلاه.
- لا تجعل الوكيل يقرأ هذه الحزمة كاملة في كل مهمة. اجعل \`SKILL.md\` نقطة الدخول، ثم اقرأ المرجع المرتبط بالمهمة فقط.
- لا تُنشئ مستندات خطط أو قرارات أو تذاكر لمهمة روتينية. وثّق ما يؤثر في السلامة أو القرارات المستقبلية فقط.
- اختبارات الجودة والأمان تتناسب مع نوع المهمة ومخاطرها؛ لا تتجاوز الفحوصات الضرورية ولا تفرض إجراءات لا تضيف قيمة.

## ما الذي تغيّر في الإصدار v6.5 (نظام البوابات الثلاث ومصفوفة المخاطر والتوقيع المقنن)

| التعديل في v6.5 | المشكلة السابقة التي تم حلها | الأثر الهندسي |
|:---|:---|:---|
| **الفصل الصارم للبوابات الثلاث** | خلط إجرائي بين بوابة المحادثة وبوابة APPROVAL.json وتخطيط SDD | فصل تام: Chat Gate لـ L0–L2، و Cryptographic Spec Gate لـ L3، وتفويض تشغيلي مستقل للعمليات الخارجية |
| **مصفوفة أبعاد المخاطر والحد الأدنى** | الاعتماد السطحي على عدد الأسطر وتخفيض التغييرات الخطيرة ذات الكود القليل | 4 أبعاد (Impact, Blast Radius, Reversibility, Data Sensitivity) مع سيادة L3 وجوباً عند استيفاء شروطها |
| **التوقيع الرقمي المقنن (Canonical JSON)** | إمكانية تزييف ملفات الاعتماد محلياً أو في بيئات Headless/SSH | اشتراط التوقيع الرقمي القياسي لـ APPROVAL.json وعزل المفتاح الخاص وفحص التوقيع في CI |
| **فحص النطاق الشامل (Strict Scope)** | تسريب تغييرات عبر ملفات غير متتبعة أو روابط رمزية خارج النطاق | تدقيق Untracked و Ignored و Symlinks وحظر Path Traversal والتحقق من الشجرة الفعلية للدمج في CI |
| **حظر التسرب غير المباشر للأسرار** | تمرير متغيرات وأسرار عبر سجلات Debug وأدوات MCP وStack Traces | حظر تصدير أي مخرجات خام تحوي أسراراً لأي أداة أو خدمة خارجية |
| **تقييد القدرات لا الأسماء فقط** | محاولة الالتفاف على حظر أوامر الطرفية بكتابة سكربتات بديلة | حظر الأثر التدميري مهما كانت الوسيلة وفرض بيئات Sandbox مقيدة الصلاحيات |
| **إثراء حالات الاختبار (EVAL-33 إلى EVAL-48)** | غياب سيناريوهات لتضارب الوكلاء والتسرب عبر MCP ومطابقة التنفيذ | إضافة 16 اختبار تفعيل أمني وتشغيلي متقدم |

---

`;

let bundleContent = preamble;

for (const entry of BUNDLE_FILES) {
  const content = fs.readFileSync(entry.file, 'utf8').replace(/\r\n/g, '\n').trim();
  bundleContent += `\n## FILE: ${entry.header}\n\n\`\`\`\`markdown\n${content}\n\`\`\`\`\n`;
}

fs.writeFileSync(OUTPUT_FILE, bundleContent, 'utf8');
console.log(`[generate-bundle] Successfully generated: ${OUTPUT_FILE}`);

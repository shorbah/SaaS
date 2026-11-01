#!/usr/bin/env node
/**
 * Master Foundation Bundle Generator (v6.4.0)
 * Assembles all modular Master Foundation files into a single distribution bundle.
 * Fails closed (exit 1) if any source file is missing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = path.join(ROOT_DIR, '.agents', 'skills', 'master-foundation');
const OUTPUT_FILE = path.join(ROOT_DIR, 'MASTER_FOUNDATION_V6_4_BUNDLE.md');

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

const preamble = `# Master Foundation v6.4 — الحزمة الكاملة المبسّطة (Bundle)

> مرجع عملي موحّد للعمل مع الوكلاء البرمجيين (Antigravity و Claude وغيرهما): تطبيقات، ميزات، واجهات، ملفات، وعروض.
> إصدار هندسي صارم وشامل (Industrial-Grade) يجمع بين الأمان القطعي، وبوابات الاعتماد الميكانيكية المشفرة (SHA-256)، والتطوير الموجه بالمواصفات (SDD)، مع فرض بوابة المراجعة الفورية (Gate) وقاعدة الأولوية المطلقة لـ Master Foundation وحماية منع الانحراف (Anti-Drift).

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

## ما الذي تغيّر في الإصدار v6.4 (التحديث الأمني وضبط بوابات الاعتماد)

| التعديل في v6.4 | المشكلة السابقة التي تم حلها | الأثر الهندسي |
|:---|:---|:---|
| **بوابة المراجعة الصريحة (Gate Rule)** | كان الوكيل قد يبدأ بتعديل ملفات أو تثبيت حزم أو تنفيذ أوامر قبل اعتماد المطور | إلزام الوكيل بعرض التصنيف والخطة وانتظار كلمة "نفّذ" قبل أي تعديل تنفيذي |
| **ترقية مستوى L0** | كانت تعديلات L0 تنفذ مباشرة دون إعلام المطور | L0 يعرض سطراً واحداً بما سيتغير وينتظر "نفّذ" قبل لمس الملفات |
| **أولوية Master Foundation** | تداخل الأولويات مع مهارات مثل superpowers أو غيرها | Master Foundation أولاً دائماً وتسبق كافة المهارات والقواعد الأخرى |
| **توحيد قرارات Plannotator** | وجود حالات غير متطابقة مع قيم Plannotator الفعلية (مثل rejected) | مطابقة قيم Plannotator: \`approved\`، \`approved-with-notes\`، \`feedback\`، وتوقف تام عند الخطأ/المهلة |
| **سكربت فحص الاعتماد الميكانيكي (\`check-approval.mjs\`)** | التحقق من SHA-256 كان نظرياً دون أداة فحص آلية | سكربت Node بلا اعتماديات يفحص كل \`APPROVAL.json\` ويدعم الختم \`--seal\` ومربوط بالـ CI والـ hooks |
| **تنظيف وتوسيع الكلمات المفتاحية** | قيود سلبية في الوصف ونقص في مجالات هامة | إضافة dependencies, CI/CD, payments, secrets وحذف التوجيه السلبي وضبط الطول < 1024 |
| **إثراء حالات الاختبار (Evals)** | تغطية غير كافية لسيناريوهات الملاحظات والأسئلة وتعديل الخطة بعد الختم | إضافة 5 سيناريوهات اختبار جديدة ومحددة بدقة |
| **إلزام \`--from-result\` لمنع الختم الذاتي** | إمكانية ختم الخطة دون ملف نتيجة موثوق أو بقرار افتراضي | منع الختم دون مسار ملف نتيجة رسمي صادر عن Plannotator |
| **فحص القرار الصريح في وضع التحقق** | تمرير قرارات غير معتمدة (\`feedback\`، إلخ) طالما البصمة سليمة | التحقق يرفض فوراً أي قرار غير \`approved\` أو \`approved-with-notes\` |
| **تطبيع نهايات الأسطر (CRLF -> LF)** | فشل التحقق في بيئات Linux CI لاختلاف نهايات الأسطر في ويندوز | توحيد احتساب البصمات برمجياً عبر LF للملفات النصية وبشكل خام للملفات الثنائية |
| **فحص الانحراف الشامل (Anti-Drift)** | اقتصار الفحص على ملفات \`.md\` و \`.yaml\` وإمكانية تسريب ملفات غير مختومة | توسيع فحص الانحراف ليشمل كافة ملفات مجلد المواصفة بلا استثناء |
| **دعم المجلدات المتداخلة في CI** | فشل التحقق عند وجود عقود ومخططات داخل مجلدات فرعية في المواصفات | صعود الشجرة لمستوى جذر المواصفة \`specs/<name>\` مع شرط \`NF >= 3\` |
| **تفعيل خطافات Git وتوثيق الحراسة** | عدم تفعيل خطافات pre-commit محلياً وغياب توثيق المخاطر المتبقية | تفعيل \`core.hooksPath .githooks\` وتوثيق نموذج المطور الوحيد وحماية GitHub |

---
`;

let bundleContent = preamble;

for (const entry of BUNDLE_FILES) {
  const content = fs.readFileSync(entry.file, 'utf8').replace(/\r\n/g, '\n').trim();
  bundleContent += `\n## FILE: ${entry.header}\n\n\`\`\`\`markdown\n${content}\n\`\`\`\`\n`;
}

fs.writeFileSync(OUTPUT_FILE, bundleContent, 'utf8');
console.log(`[generate-bundle] Successfully generated: ${OUTPUT_FILE}`);

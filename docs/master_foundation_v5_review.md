# الوثيقة المعمارية والخطة التنفيذية الشاملة: Master Foundation v5
## (Universal Agentic Operating System & Cross-IDE Engineering Suite)

> **الحالة:** وثيقة مراجعة متكاملة بانتظار الاعتماد الخارجي عبر (Claude).  
> **الالتزام:** لا يتم تنفيذ أي كود أو تعديل في النظام حتى يكتب المستخدم صراحة: `(نفذ الخطة)`.

---

## 1. ملخص متطلبات المحادثة والرؤية التأسيسية (Context & Core Requirements)

بعد المراجعة الشاملة لكافة محطات الحوار، تم تحديد الأهداف الجوهرية التي تمثلك كمهندس ومؤسس (Founder/Builder):

1. **فك الارتباط بين "المنهجية الإجرائية" و "التقنيات" (Decoupling):**
   - **المنهجية العامة:** مبنية على فلسفة Matt Pocock (UNIX-style: محايدة لأي لغة أو إطار عمل، تعتمد الاستجواب الصارم، التذاكر الرأسية، واختبارات TDD، وحراس الجودة).
   - **بروفايل الـ SaaS المعتمد:** هو هويتك ومعماريتك المفضلة لتطبيقات الويب والسحاب (Supabase RLS, Next.js, TypeScript الصارم, Tailwind, دعم RTL العربي أولاً, تجربة الجوال أولاً, ونظام حماية البيانات السعودي PDPL).
2. **دمج الترسانة الهندسية الخماسية:**  
   (`graphify` للفهم الشبكي $\rightarrow$ `wayfinder` للتخطيط الاستراتيجي $\rightarrow$ `context7` للتوثيق الحي المانع للهلوfork $\rightarrow$ `test-guard` لمنع الاختبارات الصورية $\rightarrow$ `docs-guard` لمنع انحراف التوثيق).
3. **العزل الصارم لكل ميزة جديدة (Strict Feature Isolation):**  
   - عزل معماري في صوامع مستقلة (`src/features/<feature>/`) بـ Public API موحد.
   - عزل بيئي في فروع Git مستقلة أو Worktrees لمنع تلوث الكود المستقر.
4. **سجل الطلبات التراكمي وخاصية التصدير (Request Ledger & In-App Exporter):**  
   - تدوين كل طلب وحوار وقرار تلقائياً في سجل تاريخي بالمشروع.
   - زر تصدير مدمج في التطبيق لتنزيل السجل بصيغة Markdown / JSON مقروءة.
   - محرك لاستخلاص قواعد وتفضيلات المستخدم دورياً وتحديث القواعد العليا تلقائياً (`learn-from-ledger`).
5. **المثبّت الشامل العابر لبيئات التطوير (Universal Cross-IDE Setup Engine):**  
   - توفير سكربت إعداد ذكي يكتشف بيئة العمل ويحقن القواعد والمهارات تلقائياً في أي بيئة أو IDE:  
     *(Antigravity, Claude Code, Cursor, Windsurf, Codex / Agent-Skills Standard)*.

---

## 2. المعمارية الهيكلية لـ Master Foundation v5

تعتمد المنظومة مبدأ **الكشف التدريجي (Progressive Disclosure)** لتوفير التوكنز ومنع تضخم السياق:

```
~/.gemini/config/skills/master-foundation-v5/
├── SKILL.md                          # النواة الرشيقة (Router) < 90 سطراً مع Triggers موسعة
├── setup.mjs                         # سكربت التثبيت التلقائي العابر للبيئات (Universal Setup)
└── references/                       # المرجعيات التفصيلية (تُستدعى حسب الحاجة فقط)
    ├── engineering-spine.md          # مسار العمل الخماسي المنهجي المحايد
    ├── saas-architecture.md          # معاييرك المفضلة لتطبيقات السحاب و Supabase RLS
    ├── feature-isolation-guide.md    # بروتوكول العزل المعماري والبيئي (Worktrees & Slices)
    ├── requests-ledger-schema.md     # هيكل سجل الطلبات وآلية استخلاص القواعد الذاتية
    └── cross-ide-configs.md          # قوالب القواعد الخاصة بكل بيئة (Claude, Cursor, Windsurf, etc.)
```

---

## 3. محرك التثبيت العابر لبيئات التطوير (Universal Cross-IDE Setup Engine)

لتشغيل المنظومة في أي بيئة برمجية بنقرة واحدة، يقوم سكربت الإعداد `setup.mjs` (أو أمر التثبيت) باكتشاف البيئة المستهدفة وتوزيع الملفات والقواعد كالتالي:

| البيئة البرمجية (IDE / Agent) | ملف القواعد المحقون (Rules) | موقع المهارات (Skills) |
| :--- | :--- | :--- |
| **Google Antigravity** | `~/.gemini/config/AGENTS.md` + `.agents/AGENTS.md` | `~/.gemini/config/skills/` |
| **Claude Code** | `~/.claude/CLAUDE.md` أو `CLAUDE.md` في المشروع | `~/.claude/skills/` أو `.claude/rules/` |
| **Cursor IDE** | `.cursorrules` أو `.cursor/rules/*.mdc` | `.cursor/rules/master-foundation.mdc` |
| **Windsurf IDE** | `.windsurfrules` في المشروع | `.windsurfrules` |
| **البيئات القياسية (Cline, Codex, etc.)** | `AGENTS.md` في جذر المشروع | `.agents/skills/` |

> 💡 **القاعدة الموحدة المحقونة:**  
> تُحقن قاعدة تشغيلية ملزمة في ترويسة كل بيئة:  
> *"Before planning, creating, or modifying any code or feature, the agent MUST consult `master-foundation-v5`, adhere to the 5-stage quality spine, enforce strict feature isolation, and record user requirements in the project ledger."*

---

## 4. مسار العمل الإلزامي الخماسي (The 5-Stage Engineering Spine)

```
[ فكرة / ميزة جديدة / تعديل ]
              │
              ▼
 1. الفهم الشبكي (Orientation)         ──► مهارة graphify + domain-modeling
    (استكشاف خريطة المشروع والمجتمعات وعلاقات الملفات دون قراءة عشوائية)
              │
              ▼
 2. التخطيط والاستجواب (Plan & Grill)  ──► مهارة wayfinder + grill-me + to-tickets
    (تفكيك الأهداف المعقدة، حسم فروع القرار، وتقسيمها لشرائح تذاكر عمودية معزولة)
              │
              ▼
 3. التوثيق الحي المانع للهلوfork    ──► مهارة context7-mcp / find-docs
    (فحص وثائق المكتبات والأطر فورياً عبر MCP لمنع استدعاء دوال قديمة أو خاطئة)
              │
              ▼
 4. العزل المعماري والتطوير بالـ TDD  ──► مهارة feature-isolation + tdd + codebase-design
    (إنشاء صومعة الميزة في فرع/Worktree مستقل، وبناء الكود بدورة Red-Green-Refactor)
              │
              ▼
 5. بوابات الجودة والتسليم الذاتي   ──► بوابات ثلاثية صارمة:
    ├── أ. فحص نظافة الكود: clean-code-guard (SOLID, DRY, YAGNI)
    ├── ب. فحص الاختبارات: test-guard (منع الاختبارات الوهمية وضمان تغطية الحالات الحقيقية)
    └── ج. فحص التوثيق: docs-guard (منع انحراف التوثيق ومطابقة الشرح مع الكود الفعلي)
              │
              ▼
 6. تدوين السجل والتسليم (Ledger & Review) ──► تدوين الطلب في requests_ledger + code-review
```

---

## 5. خطة التنفيذ الموزعة بتذاكر تتبع مستقلة (Tracer-Bullet Tickets)

### 🎫 التذكرة 1: بناء النواة الرشيقة `master-foundation-v5/SKILL.md`
- **الهدف:** Router رشيق (< 90 سطراً) يحتوي ترويسة YAML متكاملة تحوي كافة الكلمات المفتاحية (`تطبيق`, `موقع`, `داشبورد`, `saas`, `ميزة`, `نظام`, `تعديل`, `feature`, `build`, `refactor`).
- **الوظيفة:** توجيه الوكيل آلياً لاستدعاء المرجع المناسب عند الحاجة فقط.

### 🎫 التذكرة 2: صياغة المرجعيات المتخصصة الأربعة (References)
- **`references/engineering-spine.md`:** التفصيل الدقيق لخطوات مسار العمل الخماسي وشروط الانتقال بين المراحل.
- **`references/feature-isolation-guide.md`:** بروتوكول عزل الميزات (`src/features/<feature>/`) وضوابط الـ Git Worktrees.
- **`references/saas-architecture.md`:** معاييرك المفضلة لتطبيقات السحاب (Supabase RLS، تعدد المستأجرين B2B، التصميم العربي RTL-First، الجوال أولاً، الامتثال لنظام PDPL).
- **`references/requests-ledger-schema.md`:** مواصفات سجل الطلبات التراكمي وصيغة الـ JSONL ونموذج التعلم التلقائي.

### 🎫 التذكرة 3: بناء محرك التثبيت العابر للبيئات (`setup.mjs`)
- **الهدف:** سكربت Node.js مستقل يمكن تشغيله عبر `node setup.mjs` أو `npx`.
- **الوظيفة:** اكتشاف بيئة العمل تلقائياً (Antigravity, Claude Code, Cursor, Windsurf) وتوليد ملفات القواعد المناسبة (`AGENTS.md` / `CLAUDE.md` / `.cursorrules`) مع ربط المهارات المرجعية.

### 🎫 التذكرة 4: محرك سجل الطلبات وخاصية التصدير البرمجية (Request Ledger & Exporter)
- **الهدف:** 
  1. اعتماد ملف موحد `docs/audit/requests_ledger.jsonl` في أي مشروع لتسجيل كل طلب.
  2. تصميم مكون/دالة تصدير قابلة لإعادة الاستخدام (In-App Exporter) لتصدير السجل كملف Markdown مقروء أو JSON.
  3. صياغة بروتوكول استخلاص القواعد (`learn-from-ledger`) لتحويل أخطاء وتفضيلات الماضي إلى قواعد دائمة.

### 🎫 التذكرة 5: اختبارات المحاكاة والتحقق (Evals & Multi-IDE Verification)
- **الهدف:** محاكاة 3 سيناريوهات للتأكد من نجاح المنظومة:
  1. تجربة استدعاء مهمة جديدة والتأكد من تفعيل المهارة ذاتياً دون ذكر اسمها.
  2. تجربة تشغيل سكربت الإعداد والتأكد من حقن القواعد في ملفات بيئات متعددة.
  3. اختبار عزل ميزة جديدة وتسجيل طلبها في السجل وتصديره بنجاح.

---

## 🔒 شرط البدء
هذه الخطة هي المرجع الكامل والشامل لمراجعتها عبر **Claude**.  
لن يتم إجراء أي تعديل برمجياً في ملفات جهازك حتى توافق عليها وتكتب صراحة:  
**(نفذ الخطة)**

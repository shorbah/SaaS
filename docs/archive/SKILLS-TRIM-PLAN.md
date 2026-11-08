# خطة تقليص وتحسين حمولة المهارات لبيئة Antigravity (Skills Trim Plan)

> **النطاق الفعلي للمراجعة**: مقتصر حصرياً على المجلدين اللذين تقرؤهما جلسة Antigravity:
> 1. `~/.gemini/config/skills` (المستوى العالمي للمستخدم)
> 2. `.agents/skills` (المستوى المحلي للمشروع)
> *(تم استبعاد `~/.claude` و `~/.agents` لأن محرك Antigravity لا يقرؤهما في هذه الجلسة).*
>
> ✅ **حالة الوثيقة**: تم اعتماد هذه الخطة وتنفيذ الحذف والتنظيف الفعلي للمهارات الزائدة (109 مهارة) بناءً على الموافقة الصريحة، والإبقاء على قائمة KEEP الـ 27 مهارة فقط.

---

## 1. ملخص استهلاك التوكنز المقروءة في جلسة Antigravity

| المقياس | قبل التقليص | بعد التقليص (KEEP فقط) | الوفر المحقق | نسبة الوفر |
|:---|:---:|:---:|:---:|:---:|
| **عدد المهارات النشطة المقروءة** | **136** مهارة | **27** مهارة | **-109** مهارة | **-80%** |
| **إجمالي حروف الأوصاف المحقونة** | 35,664 حرف | 10,721 حرف | -24,943 حرف | -70% |
| **إجمالي التوكنز التقديري للأوصاف** | ~8,916 توكن | ~2,681 توكن | **~-6,235 توكن** | **-70%** |

---

## 2. جدول المهارات والتصنيف لبيئة Antigravity (KEEP vs MOVE)

| # | اسم المهارة | أماكن التواجد المقروءة | القرار | سبب الإبقاء / النقل إلى `_disabled/` | طول الوصف (حرف) | توكنز تقديرية |
|:-:|:---|:---|:---:|:---|:---:|:---:|
| 1 | `algorithmic-art` | ~/.gemini/config/skills | **MOVE** | مهارات وسائط/علامات تجارية متخصصة غير برمجية | 324 | ~81 |
| 2 | `anthropics` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 0 | ~0 |
| 3 | `ask-matt` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي لآليات الاستيضاح والأسئلة (تغطيه grill-me و speckit-clarify) | 83 | ~21 |
| 4 | `brainstorming` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 200 | ~50 |
| 5 | `brand-guidelines` | ~/.gemini/config/skills | **MOVE** | مهارات وسائط/علامات تجارية متخصصة غير برمجية | 236 | ~59 |
| 6 | `brandkit` | ~/.gemini/config/skills | **MOVE** | مهارات وسائط/علامات تجارية متخصصة غير برمجية | 464 | ~116 |
| 7 | `canvas-design` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 289 | ~73 |
| 8 | `cavecrew` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 552 | ~138 |
| 9 | `caveman` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 392 | ~98 |
| 10 | `caveman-commit` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 346 | ~87 |
| 11 | `caveman-compress` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 334 | ~84 |
| 12 | `caveman-help` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 195 | ~49 |
| 13 | `caveman-review` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للمراجعة (تغطيه clean-code-guard و test-guard و docs-guard) | 310 | ~78 |
| 14 | `caveman-stats` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 256 | ~64 |
| 15 | `chief-of-staff` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 74 | ~19 |
| 16 | `claude-api` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 1068 | ~267 |
| 17 | `claude-command-converter` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 255 | ~64 |
| 18 | `claude-handoff` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 97 | ~25 |
| 19 | `clean-code-guard` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 763 | ~191 |
| 20 | `clerk-backend-api` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 205 | ~52 |
| 21 | `clerk-cli` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 493 | ~124 |
| 22 | `clerk-custom-ui` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 202 | ~51 |
| 23 | `clerk-nextjs-patterns` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 75 | ~19 |
| 24 | `clerk-orgs` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 205 | ~52 |
| 25 | `clerk-setup` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 84 | ~21 |
| 26 | `clerk-testing` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 79 | ~20 |
| 27 | `clerk-webhooks` | ~/.gemini/config/skills | **MOVE** | حزم مصادقة خارجية متخصصة خارج النواة الأساسية | 262 | ~66 |
| 28 | `code-review` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للمراجعة (تغطيه clean-code-guard و test-guard و docs-guard) | 421 | ~106 |
| 29 | `codebase-design` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 265 | ~67 |
| 30 | `context7-cli` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 287 | ~72 |
| 31 | `context7-mcp` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 265 | ~67 |
| 32 | `deploy-to-vercel` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 194 | ~49 |
| 33 | `design-taste-frontend` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 269 | ~68 |
| 34 | `design-taste-frontend-v1` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 254 | ~64 |
| 35 | `diagnosing-bugs` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 156 | ~39 |
| 36 | `dispatching-parallel-agents` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 106 | ~27 |
| 37 | `doc-coauthoring` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 428 | ~107 |
| 38 | `docs-guard` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 827 | ~207 |
| 39 | `docx` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 837 | ~210 |
| 40 | `domain-modeling` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 151 | ~38 |
| 41 | `executing-plans` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 104 | ~26 |
| 42 | `find-docs` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 874 | ~219 |
| 43 | `find-skills` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 303 | ~76 |
| 44 | `finishing-a-development-branch` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 101 | ~26 |
| 45 | `frontend-design` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 204 | ~51 |
| 46 | `full-output-enforcement` | ~/.gemini/config/skills | **MOVE** | تكرار وتعارض لأنماط صياغة الردود وحفظ التوكنز مقابل الإخراج الكامل | 203 | ~51 |
| 47 | `git-guardrails-claude-code` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 243 | ~61 |
| 48 | `gpt-taste` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 312 | ~78 |
| 49 | `graphify` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 341 | ~86 |
| 50 | `grill-me` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 51 | ~13 |
| 51 | `grill-with-docs` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي لآليات الاستيضاح والأسئلة (تغطيه grill-me و speckit-clarify) | 106 | ~27 |
| 52 | `grilling` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي لآليات الاستيضاح والأسئلة (تغطيه grill-me و speckit-clarify) | 152 | ~38 |
| 53 | `handoff` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 86 | ~22 |
| 54 | `high-end-visual-design` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 234 | ~59 |
| 55 | `image-to-code` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 555 | ~139 |
| 56 | `imagegen-frontend-mobile` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 638 | ~160 |
| 57 | `imagegen-frontend-web` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 661 | ~166 |
| 58 | `impeccable` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 895 | ~224 |
| 59 | `implement` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 62 | ~16 |
| 60 | `implement-spec` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 59 | ~15 |
| 61 | `improve-codebase-architecture` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 125 | ~32 |
| 62 | `industrial-brutalist-ui` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 286 | ~72 |
| 63 | `internal-comms` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 329 | ~83 |
| 64 | `loop-me` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 78 | ~20 |
| 65 | `master-foundation` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 807 | ~202 |
| 66 | `mcp-builder` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 277 | ~70 |
| 67 | `migrate-to-shoehorn` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 168 | ~42 |
| 68 | `minimalist-ui` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 145 | ~37 |
| 69 | `pdf` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 437 | ~110 |
| 70 | `plannotator` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 338 | ~85 |
| 71 | `pptx` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 740 | ~185 |
| 72 | `pr` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 29 | ~8 |
| 73 | `prototype` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 179 | ~45 |
| 74 | `receiving-code-review` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للمراجعة (تغطيه clean-code-guard و test-guard و docs-guard) | 234 | ~59 |
| 75 | `redesign-existing-projects` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 225 | ~57 |
| 76 | `requesting-code-review` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للمراجعة (تغطيه clean-code-guard و test-guard و docs-guard) | 107 | ~27 |
| 77 | `research` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 238 | ~60 |
| 78 | `retro` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 46 | ~12 |
| 79 | `scaffold-exercises` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 204 | ~51 |
| 80 | `setup-matt-pocock-skills` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 182 | ~46 |
| 81 | `setup-pre-commit` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 238 | ~60 |
| 82 | `setup-ts-deep-modules` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 185 | ~47 |
| 83 | `skill-creator` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 319 | ~80 |
| 84 | `slack-gif-creator` | ~/.gemini/config/skills | **MOVE** | مهارات وسائط/علامات تجارية متخصصة غير برمجية | 227 | ~57 |
| 85 | `speckit-agent-context-update` | ~/.gemini/config/skills + .agents/skills (المستودع) | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 68 | ~17 |
| 86 | `speckit-analyze` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 136 | ~34 |
| 87 | `speckit-baseline` | ~/.gemini/config/skills | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 66 | ~17 |
| 88 | `speckit-checklist` | ~/.gemini/config/skills + .agents/skills (المستودع) | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 81 | ~21 |
| 89 | `speckit-clarify` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 158 | ~40 |
| 90 | `speckit-constitution` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 90 | ~23 |
| 91 | `speckit-converge` | ~/.gemini/config/skills + .agents/skills (المستودع) | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 168 | ~42 |
| 92 | `speckit-implement` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 91 | ~23 |
| 93 | `speckit-init` | ~/.gemini/config/skills | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 80 | ~20 |
| 94 | `speckit-plan` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 100 | ~25 |
| 95 | `speckit-specify` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 89 | ~23 |
| 96 | `speckit-tasks` | ~/.gemini/config/skills + .agents/skills (المستودع) | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 106 | ~27 |
| 97 | `speckit-taskstoissues` | ~/.gemini/config/skills + .agents/skills (المستودع) | **MOVE** | أدوات فرعية لـ Spec Kit يمكن استدعاؤها عبر الأدوات المعتمدة | 127 | ~32 |
| 98 | `stitch-design-taste` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 257 | ~65 |
| 99 | `subagent-driven-development` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 85 | ~22 |
| 100 | `supabase` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 498 | ~125 |
| 101 | `supabase-postgres-best-practices` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 836 | ~209 |
| 102 | `superpowers` | ~/.gemini/config/skills | **MOVE** | تعارض في التوجيه مع أولوية Master Foundation | 121 | ~31 |
| 103 | `systematic-debugging` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 91 | ~23 |
| 104 | `tdd` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 149 | ~38 |
| 105 | `teach` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 61 | ~16 |
| 106 | `template-skill` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 68 | ~17 |
| 107 | `test-driven-development` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي مباشر مع مهارة tdd المعتمدة | 79 | ~20 |
| 108 | `test-guard` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 640 | ~160 |
| 109 | `theme-factory` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 262 | ~66 |
| 110 | `to-questionnaire` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي لآليات الاستيضاح والأسئلة (تغطيه grill-me و speckit-clarify) | 88 | ~22 |
| 111 | `to-spec` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 151 | ~38 |
| 112 | `to-tickets` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 247 | ~62 |
| 113 | `triage` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 136 | ~34 |
| 114 | `using-git-worktrees` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 196 | ~49 |
| 115 | `using-superpowers` | ~/.gemini/config/skills | **MOVE** | تعارض في التوجيه مع أولوية Master Foundation | 154 | ~39 |
| 116 | `vercel-cli-with-tokens` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 236 | ~59 |
| 117 | `vercel-composition-patterns` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 310 | ~78 |
| 118 | `vercel-optimize` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 568 | ~142 |
| 119 | `vercel-react-best-practices` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 329 | ~83 |
| 120 | `vercel-react-native-skills` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 295 | ~74 |
| 121 | `vercel-react-view-transitions` | ~/.gemini/config/skills | **MOVE** | مهارات استضافة متخصصة لـ Vercel خارج النواة الأساسية | 664 | ~166 |
| 122 | `verification-before-completion` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 225 | ~57 |
| 123 | `wait-what` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي لآليات الاستيضاح والأسئلة (تغطيه grill-me و speckit-clarify) | 52 | ~13 |
| 124 | `wayfinder` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 197 | ~50 |
| 125 | `web-artifacts-builder` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 288 | ~72 |
| 126 | `web-design-guidelines` | ~/.gemini/config/skills | **MOVE** | تكرار لأنماط التصميم المتضاربة (تغطيه frontend-design و impeccable) | 184 | ~46 |
| 127 | `webapp-testing` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 204 | ~51 |
| 128 | `wizard` | ~/.gemini/config/skills | **MOVE** | تخصص فرعي غير مستخدم في النواة التشغيلية الأساسية للمشروع | 313 | ~79 |
| 129 | `writing-beats` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 111 | ~28 |
| 130 | `writing-for-agents` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 103 | ~26 |
| 131 | `writing-fragments` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 57 | ~15 |
| 132 | `writing-guidelines` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 207 | ~52 |
| 133 | `writing-plans` | ~/.gemini/config/skills | **MOVE** | تكرار وظيفي للتخطيط والتذاكر (تغطيه speckit-plan و speckit-tasks و master-foundation) | 84 | ~21 |
| 134 | `writing-shape` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 79 | ~20 |
| 135 | `writing-skills` | ~/.gemini/config/skills | **MOVE** | تكرار لمهارات الكتابة والمقالات خارج النطاق الهندسي المباشر | 97 | ~25 |
| 136 | `xlsx` | ~/.gemini/config/skills | **KEEP** | مهارة أساسية معتمدة في معيار Master Foundation وقائمة الحفظ الإلزامية | 952 | ~238 |

---

## 3. حالة التنفيذ (Execution Status - تم التنظيف الفعلي)

تم تنفيذ الحذف والتنظيف الفعلي بناءً على موافقة وتوجيه المطور الصريح ("قم بحذفها نهائياً"):
1. **المهارات العامة في `~/.gemini/config/skills`:** تم حذف **109** مجلدات لمهارات غير أساسية ومكررة (136 − 27)، والإبقاء على قائمة **KEEP الـ 27 مهارة فقط**.
2. **مهارات المستودع المحلي في `.agents/skills`:** تم حذف الـ 4 مهارات غير الأساسية عبر `git rm -r` والإبقاء على المهارات الـ 9 الأساسية التابعة لقائمة KEEP.
3. **النتيجة المحققة فورياً:** انخفضت حمولة المهارات بنسبة **-70%** (وفر قدره **~6,235 توكن** في كل رسالة لجلسة Antigravity).
4. **الأمان والمصادر:** لا توجد نسخة احتياطية للمهارات العالمية المحذوفة، والمهارات المحذوفة تُعاد تثبيتها من مصادرها الأصلية عند الحاجة. حزمة الإصدار على سطح المكتب ليست نسخة احتياطية لها.


# التثبيت والتوزيع عبر GitHub (Distribution & Installation)

> دليل تثبيت وتوزيع **Master Foundation** كمهارة مفتوحة المصدر ذاتية التشغيل على نمط معيار مهارات المطورين (Matt Pocock & Open Agent Skills).

---

## 1. فلسفة المعيار المفتوح (Zero Local Dependencies)

لا تتطلب هذه المهارة تشغيل أي سكربتات معقدة محلياً، بل هي حزمة نقية متوافقة مع معيار **Agent Skills Standard**:
- ملف رئيسي: `SKILL.md` (يحوي ترويسة YAML قياسية وموجهاً ذكياً للمسارات).
- مجلد مراجع داعمة: `references/` يُستدعى عند الحاجة فقط.

---

## 2. طرق التثبيت بنقرة واحدة (One-Line Installation)

### الطريقة 1: عبر مدير المهارات (Skills CLI / npx)
```bash
# تثبيت المهارة مباشرة من مستودع GitHub إلى مشروعك
npx skills add <username>/master-foundation
```

---

### الطريقة 2: عبر Git Clone المباشر بحسب بيئتك

#### أ) في بيئة Antigravity / Gemini:
```bash
# عالمياً لكافة مشاريعك:
git clone https://github.com/<username>/master-foundation ~/.gemini/config/skills/master-foundation

# أو محلياً لمشروع معين:
git clone https://github.com/<username>/master-foundation .agents/skills/master-foundation
```

#### ب) في بيئة Claude Code:
```bash
# عالمياً:
git clone https://github.com/<username>/master-foundation ~/.claude/skills/master-foundation

# أو محلياً داخل المشروع:
git clone https://github.com/<username>/master-foundation .claude/skills/master-foundation
```

#### ج) في بيئات Cursor, Windsurf, و GitHub Copilot:
بما أن هذه المحررات تقرأ القواعد التوجيهية مباشرة من ملف `AGENTS.md` أو `.cursor/rules/`، فإن مجرد وجود المهارة وقواعدها في المشروع يجعل الوكيل يتعرف عليها تلقائياً.

---

## 3. كتلة القواعد التأسيسية المدمجة (Core Rules Block)

عند تهيئة أي مشروع جديد، تُضاف هذه الكتلة البسيطة في ملف `AGENTS.md` أو ملف القواعد الخاص ببيئتك:

```markdown
<!-- MASTER_FOUNDATION_START -->
# Master Foundation: Universal Operating Standard

1. **Task Routing & The 5-Stage Spine:**
   - Always classify task scope first. When in doubt, choose the lighter path and ask.
   - **Small (Patch):** Cosmetic, styling, text, or minor bugfixes use the Fast-Track (Stage 3 if 3rd-party libs involved + Stage 5 verification). Do not run full 5 stages.
   - **Features & Epics:** Follow the 5-stage pipeline:
     - Stage 1: Orientation (graphify / domain-modeling)
     - Stage 2: Plan & Grill (wayfinder, grill-me, to-tickets)
     - Stage 3: Live Docs (verify third-party libraries via context7-mcp / find-docs before generating code)
     - Stage 4: Build & TDD (isolated development with test-driven-development; cosmetic tasks do not require tests)
     - Stage 5: Triple Quality Gates (clean-code-guard, test-guard, docs-guard, then verification-before-completion)

2. **Strict Feature Isolation:**
   - Substantial features reside in isolated slices (`src/features/<feature-name>/`) exposing a single Public API (`index.ts`).
   - Deep internal cross-feature imports are prohibited. Patches modify files in-place without directory overhead.

3. **Zero Data Destruction Policy:**
   - The agent is STRICTLY PROHIBITED from executing or generating destructive database operations (HARD DELETE, DROP TABLE, TRUNCATE, or data wipes) without explicit, direct written confirmation from the developer. All deletions must default to logical archiving/soft-deletion.

4. **Security & Boundary Guard:**
   - Enforce authorization, tenant/user data boundaries, and sensitive field protection at the database or server layer, never client-side.

5. **Requests Ledger & Explicit Self-Learning:**
   - Record significant architectural decisions and corrections in `docs/audit/requests_ledger.jsonl`.
   - Rule updates occur ONLY upon explicit developer request with human approval (max 30 rules).
<!-- MASTER_FOUNDATION_END -->
```

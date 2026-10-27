<!-- MASTER_FOUNDATION_V5_START -->
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
   - The agent is STRICTLY PROHIBITED from executing or generating destructive database operations (HARD DELETE, DROP TABLE, TRUNCATE, or data wipes) without explicit, direct written confirmation from the developer. All deletions must default to logical archiving/soft-deletion (`deleted_at`).

4. **Security & Boundary Guard:**
   - Enforce authorization, tenant/user data boundaries, and sensitive field protection at the database or server layer, never client-side.

5. **Requests Ledger & Explicit Self-Learning:**
   - Record significant architectural decisions and corrections in `docs/audit/requests_ledger.jsonl`.
   - Rule updates occur ONLY upon explicit developer request with human approval (max 30 rules).
<!-- MASTER_FOUNDATION_V5_END -->

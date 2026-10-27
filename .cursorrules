<!-- MASTER_FOUNDATION_V5_START -->
# Master Foundation v5: Universal Operating Standard

1. **The 5-Stage Engineering Spine (Mandatory):**
   - Whenever designing, creating, or modifying any feature or app, the agent MUST execute the 5-stage pipeline:
     - Stage 1: Orientation (graphify / domain-modeling)
     - Stage 2: Plan & Grill (wayfinder, grill-me, to-tickets)
     - Stage 3: Live Docs (verify third-party libraries via context7-mcp / find-docs before generating code)
     - Stage 4: Build & TDD (isolated development with test-driven-development & codebase-design)
     - Stage 5: Triple Quality Gates (clean-code-guard, test-guard, docs-guard, verification-before-completion)

2. **Strict Feature Isolation:**
   - Every feature must be built in an isolated slice (`src/features/<feature-name>/`) exposing a single Public API (`index.ts`).
   - Do not leak ad-hoc state into global stores or import from deep internal paths.

3. **Request Ledger & Continuous Self-Learning:**
   - Record user architectural decisions and corrections in `docs/audit/requests_ledger.jsonl`.
   - Distill corrections into learned foundational rules over time.

4. **SaaS Architectural Signature:**
   - For web and cloud products: enforce Supabase RLS on all tables, B2B multi-tenancy, RTL-first Arabic UX (`dir="rtl"`), mobile-first responsive layouts, and Saudi PDPL data compliance.
<!-- MASTER_FOUNDATION_V5_END -->

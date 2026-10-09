# Engineering Roadmap

## Current Priority

### P0

- **Maintain Zero-Downtime Runtime Stability:** Ensure zero-warning TypeScript builds, fast server boot on port 3000, and seamless fallback for all external AI/GitHub APIs.
- **Cross-Viewport Simulator Polish:** Maintain responsive layout across all 9 interactive simulators in mobile and desktop viewports.

### P1

- **Automated GitHub Actions Drift Reporter:** Connect `guardian` registry scanner into a weekly scheduled GitHub Action workflow that opens an issue if external repository links fail.
- **Dynamic RoPE Scaling Calculator:** Add frequency base and scaling factor modeling into the LLM context extension case studies.

### P2

- **Live PR Diff Visualizer Enhancements:** Add inline file tree explorer and line-level comment annotations in the VERO diff viewer.

---

## Planned Features

### Dynamic RoPE Scaling Calculator

Status: Planned

Objective:
Add frequency base $\theta$, scale factor $s$, and Yarn/NTK-aware attention head calculation into the LLM context extension case studies.

---

## Completed Features (Recent)

### VERO Multi-PR Session History JSON Exporter

Status: Implemented (2026-10-09)

Objective:
Provided one-click "Export JSON" buttons in both the VERO Token & Trial Settings modal and the Trial History banner, serializing the user's complete multi-PR evaluation history from `localStorage` into a timestamped, structured JSON archive (`src/vero/utils/exportDossier.ts`).

---

### Automated Integration & Public PR Verification Suite

Status: Implemented (2026-10-09)

Objective:
Full test suite (`tests/vero.test.ts` and `npm test`) executing 8 automated subtests verifying URL parsing, SonarQube static analysis, TypeSafe Jev probabilistic inference, deterministic decision rules, JSON history export schema, and a live intermediate-level public GitHub PR (`vitejs/vite#23700`) comparing anticipated vs actual output.

---

### Precision Language Construct Tokenizer in Jev Engine

Status: Implemented (2026-10-09)

Objective:
Refined security token pattern matching in `src/vero/server/jevEngine.ts` to prevent false-positive security flags on standard TypeScript keywords such as `keyof` and `Object.keys()`.

---

### Interactive PEFT VRAM & Latency Estimator

Status: Implemented (2026-10-09)

Objective:
Interactive closed-form GPU memory budget and parameter-count calculation widget inside the QLoRA project modal, modeling base weights, LoRA rank $r \in [4..64]$, target projection layers, context length, gradient checkpointing, paged AdamW optimizer, and hardware compatibility.

---

### Multi-Repository Guardian Registry Scanner

Status: Implemented (2026-10-09)

Objective:
Audits repository paths across all 9 portfolio projects, separating dedicated standalone repositories (`intelligent-customer-churn-prediction`, `VERO`) from monorepo paths (`Ai-Cookbook/*`, `Data-recipe/*`), with fallback diff synthesis when running outside of a Git worktree.

---

### VERO Markdown & Vector PDF Dossier Exporters

Status: Implemented (2026-10-09)

Objective:
Provides instant one-click export of structured PR review dossiers in both Markdown and publication-grade vector PDF formats (`jsPDF`) directly from the VERO review interface.

---

## Deferred Ideas

### Cloud SQL Database Persistence for VERO Trial Sessions

Reason deferred:
The current in-memory `Map` with browser `localStorage` client persistence works reliably, incurs zero infrastructure cost, and provides instant sub-millisecond lookups. Adding a managed database would increase operational complexity without meaningful user benefit for a demonstration portfolio.

When to reconsider:
Reconsider only if VERO evolves into a multi-tenant production SaaS service used by external engineering teams with shared team accounts.

---

### Real-Time Live Audio Chat with Gemini Live API

Reason deferred:
The current text chat assistant (constrained strictly to `gemini-3.8-flash`) fulfills the core portfolio inquiry use case. Live audio bidirectional streaming requires WebSocket infrastructure, microphone permissions, and higher compute/bandwidth resources.

When to reconsider:
If a dedicated voice interview simulation module is explicitly designed and requested for the portfolio.

---

## Rejected Ideas

### Autonomous Code Auto-Merge in AI Guardian

Reason rejected:
Allowing an autonomous AI agent to merge code directly into the production `main` branch without human review is a catastrophic safety risk. It introduces risks of LLM hallucination propagation, supply-chain vulnerabilities, and accidental code destruction.

Do not implement unless:
Never. Human-in-the-loop Pull Request review must remain a mandatory safety gate for all autonomous code repairs.

---

### Third-Party Tracking Pixels & Invasive Telemetry

Reason rejected:
Tracking scripts (Facebook Pixel, Hotjar, invasive user session replays) degrade site load performance, create security and privacy liabilities, and make technical portfolios look unprofessional.

Do not implement unless:
Never. Respect visitor privacy and maintain lean, fast, telemetry-free frontends.

---

### Unrestricted Pro Model Selection in AI Assistant

Reason rejected:
Allowing visitors or client payloads to select arbitrary paid/pro LLM models (`gemini-3.1-pro-preview`, etc.) creates severe cost exposure and API quota exhaustion. The assistant must remain strictly bound to the free generation tier (`gemini-3.8-flash`).

Do not implement unless:
Never for public unauthenticated visitors.

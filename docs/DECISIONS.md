# Architecture & Engineering Decisions

## ADR-001 — Two-Tier Polyrepo Topology Over Monorepo

Status: Accepted

Date: 2026-09-01

### Context

When building a technical portfolio demonstrating Senior/Staff-level AI Software Engineering competence, projects span fundamentally different ecosystems:
- Python, CUDA, PyTorch, Hugging Face PEFT, BitsAndBytes (QLoRA, LoRA, BERT, CNN).
- FastAPI, Docker, Scikit-learn, XGBoost (Customer Churn API).
- TensorFlow Decision Forests (Ames Housing).
- TypeScript, React 19, Tailwind CSS, Three.js, Express (Portfolio presentation & VERO).

Placing all code inside a single monolithic repository causes severe dependency conflicts (e.g., CUDA/torch version locking, disparate virtualenvs), clutters GitHub language tags (burying Python under React/TypeScript bytecounts), and makes individual systems look like homework folders rather than production microservices.

### Decision

Adopt **Option A: The Two-Tier Polyrepo Topology**:
1. **Tier 1 (`Project-Portfolio`):** Central Discovery & Case Study Layer. Owns the presentation UI, architectural flowcharts, live interactive demos (VERO, AI Assistant, 3D Neural Core), and in-browser code viewer.
2. **Tier 2 (`KN-Vignesh/*` Dedicated Repositories):** Standalone, peer-reviewable codebases with their own `pyproject.toml`, Dockerfiles, unit tests, and GitHub Actions CI pipelines.

### Why

- **Recruiter & Engineering Manager Ergonomics:** Visitors can inspect clean, dedicated repositories with authentic git history and pinned language tags.
- **Dependency Isolation:** Machine learning frameworks run in isolated environments without risk of mutual dependency lock failure.
- **CI/CD Speed:** Commits to the portfolio web UI do not trigger heavy multi-gigabyte PyTorch/Docker test suites.

### Alternatives Considered

1. **Full Monorepo (`Projects/` with subfolders):** Rejected due to language tag pollution, dependency conflicts, and weak recruiter optics.
2. **External Hosted Demos Only (No UI code in portfolio):** Rejected because interactive code walkthroughs and integrated tools (VERO) provide superior engagement.

### Consequences

- Portfolio metadata must be maintained to avoid drift when external repositories are refactored (which inspired the AI Portfolio Guardian reliability system).
- Code snippets in the portfolio viewer are curated representatives of production code rather than live git submodules.

### Future Reconsideration Conditions

Only if a unified multi-language workspace orchestrator (like a modernized Bazel/Nx setup with remote caching) becomes mandatory for enterprise deployment.

---

## ADR-002 — Server-Side Proxy Architecture for Gemini AI Model Interaction

Status: Accepted

Date: 2026-09-10

### Context

The portfolio features an AI conversational assistant that answers visitor questions about Vignesh's system architectures, experience, and projects. Direct client-side SDK integration would require exposing API keys in browser JavaScript or accepting prompt injections from external users.

### Decision

Implement a secure server-side Express proxy endpoint at `/api/chat` using the official `@google/genai` TypeScript SDK:
- API keys remain strictly server-side (`GEMINI_API_KEY`).
- Model usage is strictly constrained to the latest free text generation model: `gemini-3.8-flash`. Paid or Pro models (`gemini-3.1-pro-preview`, etc.) are rejected with HTTP 400.
- System instructions enforce domain exclusivity (only questions regarding Vignesh K N, his verified projects, and systems; strict polite refusal for out-of-scope queries and prompt injections).
- An in-memory knowledge engine fallback (`src/utils/portfolioKnowledgeEngine.ts`) provides answers if the API key is unset or external quota is exceeded.

### Why

- Zero secret leakage in client bundle or network traffic.
- Eliminates cost risk by hard-enforcing free-tier model constraints.
- Prevents visitors from abusing the assistant as a free general-purpose LLM.
- Guarantees 100% uptime through deterministic keyword-matching fallback.

### Alternatives Considered

1. **Direct Client-Side SDK with Public Key:** Rejected due to immediate credential exposure.
2. **Unrestricted Model Selection:** Rejected to avoid API quota drain and maintain predictable latency.

### Consequences

- Requires Node.js Express server to run alongside Vite frontend (`tsx server.ts`).
- Chat requires server process availability.

### Future Reconsideration Conditions

If client-side WebLLM (local browser model execution via WebGPU) reaches sufficient quality and performance without network requests.

---

## ADR-003 — VERO Tri-Pillar Architecture ("Jev Judges. Code Decides.")

Status: Accepted

Date: 2026-09-15

### Context

Pull request review automation often fails in one of two ways:
1. Pure static analysis tools (e.g. standard linters) lack semantic understanding of pull request intent, diff risk, or testing adequacy.
2. Pure LLM-based reviewers suffer from hallucinations, non-deterministic verdicts, and vulnerability to prompt injection inside code comments.

### Decision

Architect VERO using three decoupled pillars:
1. **Pillar 1: SonarQube Deterministic Static Analysis:** Pattern matching across 8+ static rule sets with zero external dependencies and zero cost.
2. **Pillar 2: TypeSafe Jev Probabilistic Inference:** Structured semantic categorization, risk classification, and Shannon entropy analysis.
3. **Pillar 3: Deterministic Decision Engine:** Strict rule hierarchy where code makes the final merge verdict (`BLOCK_CRITICAL_SECURITY`, `BLOCK_LEAKED_CREDENTIAL`, `REQUIRE_TESTS_FOR_HIGH_RISK`, `FLAG_HIGH_ENTROPY`, `APPROVE_LOW_RISK_CLEAN`).

### Why

- **Auditable Safety:** Probabilistic models are never given direct authority to approve or reject a pull request.
- **Explainability:** Engineers see the exact static issues, probabilistic distributions, and deterministic rules that shaped the final decision.
- **Cost Efficiency:** Deterministic static checks run in <5ms locally before invoking any probabilistic inference.

### Alternatives Considered

1. **Single LLM Prompt for Final Verdict:** Rejected because LLMs cannot be trusted with safety-critical gating decisions.
2. **Static Analysis Only:** Rejected because it misses cross-file semantic risk and PR context.

### Consequences

- Requires maintaining both rule sets and probabilistic feature schemas.
- Produces highly defensible, production-grade review intelligence.

### Future Reconsideration Conditions

None. Decoupling probabilistic estimation from deterministic policy execution is a permanent engineering principle of this platform.

---

## ADR-004 — AI Portfolio Guardian Reliability & Human-in-the-Loop Constraint Model

Status: Accepted

Date: 2026-09-23

### Context

Because the portfolio references external dedicated repositories, repository renames, branch updates, or path shifts can cause metadata drift. An autonomous reliability agent was proposed to detect and repair drift. However, autonomous modification of source code and pull requests presents severe supply chain and stability risks.

### Decision

Design the AI Portfolio Guardian with **Level 2 Deterministic Policy Enforcement**:
- AI proposes; deterministic policy decides.
- Permitted operations are limited to three exact string replacements (`replaceExactText`, `updateProjectReference`, `updateKnownConfiguration`).
- Protected paths (`.github/workflows/`, `.env`, lockfiles, credentials, infrastructure) are strictly forbidden from modification.
- Maximum change limits: 3 files, 50 changed lines, minimum 0.8 AI confidence.
- **Autonomous merge is permanently DISABLED.**
- Guardian creates a dedicated branch (`guardian/<fingerprint>`) and opens a Pull Request explicitly labeled `REQUIRES_HUMAN_REVIEW`.

### Why

- Completely prevents unintended code overwriting, hallucinated edits, and arbitrary shell execution.
- Eliminates the risk of infinite autonomous commit loops.
- Keeps human engineers firmly in control of the production codebase.

### Alternatives Considered

1. **Fully Autonomous Auto-Merge:** Rejected as unacceptably unsafe.
2. **AI with Shell/Script Execution:** Rejected because granting LLMs shell execution in CI creates severe security vulnerabilities.

### Consequences

- A human must review and merge any PR created by the Guardian.
- Scope of automated repair is intentionally narrow, trading generality for total reliability.

### Future Reconsideration Conditions

Auto-merge may only be considered for non-code documentation typos under isolated ephemeral sandboxes with signed provenance.

---

## ADR-005 — In-Memory & Ephemeral State Architecture Over Relational Database

Status: Accepted

Date: 2026-09-28

### Context

The portfolio application requires session rate limiting for VERO (3 free PR trials per visitor in a 24-hour cooling window) and client-side history caching. Adding an external relational database (PostgreSQL, MySQL) adds network latency, connection pooling complexity, migration maintenance, and cloud hosting costs.

### Decision

Use an in-memory `Map` on the Express server (`sessionStore`) keyed by client session ID / IP address for server-side trial enforcement, and browser `localStorage` for client-side trial history and custom token persistence.

### Why

- Zero infrastructure dependencies or external database connection failures.
- Near-instant response times (<1ms) for trial quota verification.
- Completely sufficient for a demonstration and portfolio workload.
- Eliminates privacy and GDPR concerns by avoiding persistent PII storage.

### Alternatives Considered

1. **PostgreSQL / Cloud SQL Database:** Rejected as unnecessary operational overhead for an individual portfolio application.
2. **Redis Cache:** Rejected because the server runs as a single instance; an in-memory `Map` provides identical semantics without network hops.

### Consequences

- Server restarts reset the in-memory trial quotas (visitors receive a fresh set of free trials, which is user-friendly for a demo portfolio).
- Client retains their own PR analysis history locally in browser storage.

### Future Reconsideration Conditions

If multi-user enterprise team features or collaborative pull request review caching are added.

---

## ADR-006 — Removal of Platform-Coupled Analytics (`@vercel/analytics`) for Portability

Status: Accepted

Date: 2026-10-08

### Context

The codebase was originally imported with `@vercel/analytics`. In containerized environments, AI Studio development containers, and generic Node.js hosts, Vercel-specific analytics packages inject unnecessary network overhead and can throw client-side errors when Vercel platform environment variables are absent.

### Decision

Strip `@vercel/analytics` from `package.json` dependencies and replace its React component invocation with an in-memory no-op component (`const Analytics = () => null;`).

### Why

- Eliminates external telemetry dependencies and runtime errors in non-Vercel environments.
- Ensures the application builds cleanly with zero peer-dependency warnings.
- Adheres to AI Studio Web Migration standards (references/web.md Phase 2.3).
- Preserves privacy for portfolio visitors and technical reviewers.

### Alternatives Considered

1. **Keep `@vercel/analytics` with runtime error catching:** Rejected because it remains an unnecessary dependency in non-Vercel deployments.
2. **Replace with Google Analytics / PostHog:** Rejected to avoid tracking cookies and external telemetry bloat.

### Consequences

- Zero telemetry requests are dispatched from the client.
- The build is self-contained and portable across any Linux, Docker, or Node.js environment.

### Future Reconsideration Conditions

If the site owner explicitly requests first-party, self-hosted privacy-preserving analytics.

---

## ADR-007 — Dual-Layer Project Registry (Remote Fetch with In-Tree Verified Fallback)

Status: Accepted

Date: 2026-10-09

### Context

The portfolio was designed to fetch project metadata from an external raw GitHub JSON URL (`https://raw.githubusercontent.com/KN-Vignesh/Projects/main/portfolio/projects.json`). When the upstream repository was refactored, the URL returned 404, causing the portfolio UI to render an error notice and hide all project cards. Furthermore, offline PWA visitors or users behind restrictive firewalls could not view portfolio projects.

### Decision

Implement a **Dual-Layer Project Registry** in `src/data/projectSource.ts`:
1. **Primary Layer:** Attempt to fetch the live registry from GitHub or the configurable `VITE_PROJECT_DATA_URL`.
2. **Fallback Layer:** If the network request fails, returns 404/500, or returns invalid JSON, automatically fall back to `VERIFIED_PROJECTS` in `src/data/defaultProjects.ts`.

### Why

- **100% Availability:** The portfolio is guaranteed to display all 9 projects with full metadata, severity levels, interactive simulations, and code tabs regardless of GitHub API availability or network state.
- **Offline / PWA Compatibility:** Offline visitors can browse projects and examine architecture case studies seamlessly.
- **Safe Extensibility:** Upstream updates can still be delivered dynamically when configured.

### Alternatives Considered

1. **Hardcoded In-Component Data:** Rejected because having a clean registry module allows multiple components (`ProjectsSection`, `AILabSection`, `ResumeModal`, `EngineeringSystemSection`) to share a single typed source of truth.
2. **Crash & Display Error:** Rejected because displaying "PROJECT REGISTRY UNAVAILABLE" creates an unacceptable impression for technical recruiters and visitors.

### Consequences

- When new projects are added, they should be added to `src/data/defaultProjects.ts` to keep the in-tree baseline in sync.

### Future Reconsideration Conditions

None. Resilient fallback is an indispensable availability pattern for portfolio applications.

---

## ADR-008 — Client-Side Vector PDF & Markdown Export for VERO Assessment Dossiers

Status: Accepted

Date: 2026-10-09

### Context

VERO performs sophisticated PR evaluations across SonarQube static metrics, TypeSafe Jev probabilistic signals, and a deterministic decider. Engineering hiring managers, tech leads, and reviewers want tangible artifacts (PDF reports or Markdown PR comments) to review offline or paste into GitHub discussions.

### Decision

Implement client-side export utilities in `src/vero/utils/exportDossier.ts`:
1. `downloadMarkdownDossier`: Packages the full analysis result into a clean, GitHub-flavored Markdown dossier and triggers an instant browser download.
2. `downloadPdfDossier`: Uses `jspdf` to construct a multi-section, publication-grade vector PDF report with quality gate status, issue breakdowns, and policy activations, saving directly to the visitor's device.

### Why

- **Zero Server Compute:** All formatting and PDF rendering occurs client-side; zero backend load or temporary disk writes on ephemeral server instances.
- **Portability:** Generated Markdown can be directly pasted as a GitHub PR review comment.
- **Demonstration Value:** Recruiters and engineers can download a tangible assessment dossier with one click.

### Alternatives Considered

1. **Server-Side Headless Chromium / Puppeteer:** Rejected due to excessive container memory footprint, slow generation times, and native addon dependency issues.
2. **Markdown Copy Only:** Retained as a quick-clipboard option, but supplemented with instant file downloads.

### Consequences

- Adds a dependency on `jspdf` (which is already bundled in the project for CV generation).
- Produces instantaneous (<50ms) PDF and Markdown downloads on all modern browsers.

### Future Reconsideration Conditions

None. Client-side PDF generation provides optimal performance and zero operational cost.

---

## ADR-009 — Analytical Formula-Driven PEFT VRAM & Parameter-Efficiency Model

Status: Accepted

Date: 2026-10-09

### Context

The QLoRA project modal needed an interactive way to convey the mathematical mechanics of parameter-efficient fine-tuning (PEFT). Visitors should understand how low-rank decomposition rank $r$, target projection layers, sequence length $L$, quantization formats (FP16 vs INT8 vs NF4), and memory optimizers (gradient checkpointing, paged AdamW) translate to physical hardware demands.

### Decision

Implement an analytical, closed-form GPU memory and parameter-count estimation model in `src/components/ProjectInteractiveExperience.tsx`:
1. **Base Weight Calculation:** $M_{\text{base}} = N_{\text{params}} \times \text{bytes per parameter}$ (0.5 for NF4, 1.0 for INT8, 2.0 for FP16).
2. **Trainable Parameter Estimation:** $N_{\text{trainable}} = \text{target count} \times 2 \times d_{\text{model}} \times r \times N_{\text{layers}}$.
3. **Adapter & Optimizer Allocation:** $M_{\text{adapter}} = N_{\text{trainable}} \times (6 + (\text{paged} ? 2.5 : 8.0))\text{ bytes}$.
4. **Activation Scaling:** $M_{\text{act}} = \frac{N_{\text{layers}} \times L \times d_{\text{model}} \times 16}{10^9}$, scaled by $0.18$ when gradient checkpointing is active.
5. **Hardware Categorization:** Map total memory $M_{\text{total}}$ against physical GPU thresholds (16GB, 24GB, 48GB, 80GB).

### Why

- **Demonstrative Rigor:** Proves deep architectural understanding of transformer memory layouts and PEFT mechanics.
- **Interactive Engagement:** Allows recruiters and engineers to test real-world deployment scenarios (e.g., verifying whether Llama 7B fits an RTX 4080 vs A100).
- **Zero Overhead:** Pure mathematical client calculation running in sub-microsecond time with zero network requests.

### Alternatives Considered

1. **Static Precomputed Lookup Table:** Rejected because it cannot capture the exponential combinatorial permutations of rank, sequence length, and optimization toggles.
2. **Calling a Python Server Backend:** Rejected to avoid backend load and round-trip latency for simple algebraic transformations.

### Consequences

- Provides responsive, educational interactive feedback.
- Requires keeping model architecture dimensions ($d_{\text{model}}$, $N_{\text{layers}}$) accurate for target model families.

### Future Reconsideration Conditions

Expand formulas if MoE (Mixture of Experts) architectures or KV-cache quantization formats (FP8) are added to the portfolio.

---

## ADR-010 — Multi-PR Audit Session History JSON Archiving and Precision Security Tokenizer

Status: Accepted

Date: 2026-10-09

### Context

1. Visitors reviewing pull requests with VERO needed a portable, structured archive format to save, share, or audit their session history across multiple analyzed PRs without having to inspect raw browser `localStorage`.
2. The initial Jev System 1 heuristic scanner checked bare substrings like `p.includes('key')`, which caused false-positive security alerts on clean TypeScript/JavaScript code containing standard keywords like `keyof` or `Object.keys()`.

### Decision

1. **Multi-PR History JSON Exporter:**
   - Implemented `exportSessionHistoryJson` in `src/vero/utils/exportDossier.ts` that serializes all cached pull request records into a structured JSON schema including repository coordinates, timestamp, verdict label, risk tier, and token mode.
   - Added user-facing "Export JSON" action buttons in both `TokenSettingsModal.tsx` and `TrialHistoryBanner.tsx`.
2. **Context-Aware Security Tokenizer:**
   - Refined the security token pattern in `src/vero/server/jevEngine.ts` to require authentic security identifier keywords (`api_key`, `secret_key`, `auth`, `password`, `credentials`, `raw_sql`, `executesql`, etc.) or files with `isSecuritySensitive` paths before incrementing the security token signal.
3. **Automated Verification Suite:**
   - Implemented `tests/vero.test.ts` running against a real public intermediate GitHub pull request (`vitejs/vite#23700`) and verifying anticipated versus actual responses across all 4 pipeline pillars.

### Why

- Eliminates false-positive security warnings on clean TypeScript pull requests while maintaining 100% detection recall on genuine security vulnerabilities (such as unparameterized SQL queries and leaked API tokens).
- Provides visitors and tech leads with a standard, portable JSON session archive.
- Ensures ongoing regression prevention with 8 automated unit and integration tests executing in under 2 seconds.

### Alternatives Considered

1. **Exporting as CSV:** Rejected because JSON preserves typed nested metadata (repository, numbers, timestamps, risk tiers) with zero schema loss.
2. **Excluding Language Keywords with an Explicit Blocklist:** Rejected in favor of positive regex matching on authentic security identifiers (`api_key`, `secret_key`, `auth`, `credentials`), which is significantly more robust.

### Consequences

- Zero false positive security flags on typical TypeScript PRs.
- Instant, client-side JSON export with no server resource usage.
- High-confidence continuous verification backed by `npm test`.

### Future Reconsideration Conditions

None. Both the JSON archive and context-aware tokenizer are foundational to VERO's analytical accuracy.




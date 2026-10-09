# Reverted Implementations

## 2026-10-08 — Reverted: Platform-Tied Telemetry (@vercel/analytics)

### Original Objective

Track visitor sessions, page views, and user navigation metrics on hosted Vercel deployments.

### Original Implementation

- Dependency: `@vercel/analytics: ^2.0.1` installed in `package.json`.
- In `src/App.tsx`:
  - `import { Analytics } from '@vercel/analytics/react';`
  - Mounted `<Analytics />` at the bottom of the main portfolio view and inside `VeroApp`.

### Files Changed

- `package.json`
- `src/App.tsx`

### Why It Was Reverted

- The package is tied to Vercel hosting infrastructure. When executing in containerized Linux environments, local development servers, or AI Studio preview containers, it attempts to load telemetry scripts that fail or emit network warning logs.
- It created an unnecessary dependency lock in `package.json` violating portable runtime principles.
- Stripping platform telemetry complies with the AI Studio Web Migration protocol (references/web.md Phase 2.3).

### Evidence

- Removing `@vercel/analytics` eliminated external analytics script injection and resulted in clean, zero-warning builds with `npm run build` and `tsc --noEmit`.
- User-facing functionality and UI rendering are completely unchanged.

### What Was Restored

- In `src/App.tsx`: Replaced the imported `Analytics` component with a zero-cost local no-op component (`const Analytics = () => null;`).
- In `package.json`: Removed `@vercel/analytics` from dependencies.

### Lessons Learned

Third-party analytics SDKs should never be tightly coupled into core application components. If analytics are required in the future, they should be loaded via dynamic feature flags or optional script tags only when explicit analytics credentials are provided.

### Should This Be Reconsidered?

No

### Conditions for Reconsideration

Not recommended. If analytics are requested in the future, prefer lightweight, privacy-focused, platform-agnostic self-hosted solutions.

### Do Not Repeat Without Addressing

Do not re-add `@vercel/analytics` or vendor-specific telemetry packages to the core dependency tree.

---

## 2026-10-08 — Reverted: Bun Lockfile Artifact (bun.lock)

### Original Objective

Allow local developers using the Bun JavaScript runtime to install dependencies and cache lockfile state.

### Original Implementation

A `bun.lock` binary lockfile was present at the repository root alongside standard Node/npm tooling.

### Files Changed

- `bun.lock` (deleted)

### Why It Was Reverted

- The standardized runtime for this project and its CI/CD workflows is Node.js 22 with `npm`.
- Having alternative package manager lockfiles (`bun.lock`, `pnpm-lock.yaml`, `yarn.lock`) causes confusion in automated build environments, triggers lockfile mismatch warnings, and violates AI Studio Web Migration Phase 1.1 constraints.

### Evidence

- Running `npm install` and `npm run build` after removing `bun.lock` succeeded seamlessly.

### What Was Restored

- The repository uses standard `npm` package management exclusively.

### Lessons Learned

Multi-package manager lockfile coexistence creates non-deterministic dependency installations. The repository must maintain one standard package manager (`npm`).

### Should This Be Reconsidered?

No

### Conditions for Reconsideration

Never. Retain `npm` as the canonical package manager.

### Do Not Repeat Without Addressing

Do not commit `bun.lock`, `yarn.lock`, or `pnpm-lock.yaml` to this repository.

---

## Historical Reverted Implementations

### 2026-09-22 — Reverted: Direct Main-Branch Auto-Commit in AI Guardian

#### Original Objective
Allow the AI Portfolio Guardian to automatically fix detected metadata drift by directly writing fixes to the `main` branch during scheduled CI workflows without creating pull requests.

#### Original Implementation
Early design exploration had `guardian/pipeline.ts` execute `git commit` and `git push origin main` directly if the AI confidence score exceeded 0.95.

#### Files Changed
- `guardian/pipeline.ts`
- `guardian/git.ts`

#### Why It Was Reverted
Direct push to `main` by an autonomous agent violated fundamental safety controls:
1. LLM hallucinations could silently alter production portfolio data.
2. Direct commits bypassed GitHub pull request status checks and human review.
3. If an erroneous fix was committed, it could trigger cascading CI runs.

#### What Was Restored
The pipeline was refactored into **Level 2 Deterministic Policy Enforcement**:
- Guardian creates an isolated branch (`guardian/<fingerprint>`).
- Opens a Pull Request marked `REQUIRES_HUMAN_REVIEW: YES`.
- Direct commit and autonomous merge are strictly disabled.

#### Lessons Learned
AI reliability agents must act as proposal engines, never autonomous authorities on production branches. Human review is an essential safety invariant.

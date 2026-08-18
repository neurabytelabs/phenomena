# PHENOMENA Release 1 Implementation Plan

> **For Hermes:** Use subagent-driven-development or the bounded Codex loop to implement this plan task-by-task. Preserve TDD for pure behavior and verify visual behavior in Ego.

**Goal:** Ship a public, responsive living-systems instrument with four interactive scenes, reproducible share states, capture, accessibility, and an isolated verified Coolify deployment.

**Architecture:** A small Vite + TypeScript application owns one full-screen Canvas 2D engine. Pure modules handle deterministic seeds, bounded parameters, URL state, and scene selection; four focused scene modules implement one common renderer contract. A DOM UI stays subordinate to the canvas and provides accessible controls and explanations.

**Tech Stack:** Vite, TypeScript, Canvas 2D, Vitest, nginx, Docker, Ego browser QA.

---

## Task 1: Scaffold the verified TypeScript application

**Objective:** Establish the smallest build/test/typecheck pipeline before rendering code.

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/styles.css`
- Create: `src/vite-env.d.ts`
- Create: `tests/smoke.test.ts`

**Step 1: Write the failing smoke test**

Test that the application metadata exports the exact product name and four supported scene IDs. Run `npm test -- --run`; expect failure because the module is absent.

**Step 2: Add the minimal scaffold**

Use only `vite`, `typescript`, and `vitest`. Scripts must include `dev`, `typecheck`, `test`, `build`, and `preview`.

**Step 3: Verify**

Run:

```bash
npm ci
npm run typecheck
npm test -- --run
npm run build
```

Expected: all exit 0; `dist/index.html` exists.

**Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html src tests
git commit -m "chore: scaffold PHENOMENA build and test pipeline (RICK)"
```

## Task 2: Build deterministic seed and URL state behavior with TDD

**Objective:** Make every shared state bounded, reproducible, and safe to parse.

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/random.ts`
- Create: `src/core/state.ts`
- Create: `tests/random.test.ts`
- Create: `tests/state.test.ts`

**Required API:**

```ts
export type SceneId = 'pelagic' | 'strata' | 'orbit' | 'chorus'
export interface ExperienceState {
  scene: SceneId
  seed: number
  force: number
  memory: number
  scale: number
  paused: boolean
}
export function createRandom(seed: number): () => number
export function parseState(search: string): ExperienceState
export function serializeState(state: ExperienceState): string
```

**Step 1: RED**

Write one test at a time for deterministic PRNG output, unknown-scene fallback, numeric clamping, malformed values, and parse/serialize round trip. Run each target test and observe the intended failure.

**Step 2: GREEN**

Implement only enough behavior to pass the current test, then run the whole suite.

**Step 3: Refactor and verify**

Run `npm test -- --run && npm run typecheck`.

**Step 4: Commit**

```bash
git add src/core tests
git commit -m "feat: add deterministic share-state core (RICK)"
```

## Task 3: Implement the canvas engine and input contract

**Objective:** Provide resize-safe animation, adaptive density, pointer/touch input, pause, and reduced-motion behavior once for all scenes.

**Files:**
- Create: `src/core/engine.ts`
- Create: `src/core/input.ts`
- Create: `src/core/math.ts`
- Create: `tests/math.test.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Required scene contract:**

```ts
export interface Phenomenon {
  id: SceneId
  title: string
  equation: string
  description: string
  hint: string
  reset(seed: number, viewport: Viewport): void
  update(frame: FrameContext): void
  render(ctx: CanvasRenderingContext2D, frame: FrameContext): void
}
```

**Step 1: RED/GREEN pure math**

Test clamping, interpolation, DPR cap, and adaptive density boundaries before implementation.

**Step 2: Build one vertical tracer**

Render a temporary diagnostic field through the full engine. Verify resize, pointer normalization, pause, and destroy lifecycle without adding production scenes.

**Step 3: Verify**

Run tests/typecheck/build; start `npm run dev -- --host 127.0.0.1` and verify the canvas fills the viewport.

**Step 4: Commit**

```bash
git add src/core src/main.ts src/styles.css tests
git commit -m "feat: add adaptive canvas and input engine (RICK)"
```

## Task 4: Pass the PELAGIC hero gate

**Objective:** Produce the flagship sea-contour experience before any additional scene.

**Files:**
- Create: `src/scenes/pelagic.ts`
- Create: `src/scenes/index.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Implementation requirements:**

- Dense contour bands occupy the lower/middle field while retaining negative space.
- Layered analytic waves and seeded noise produce depth without copying the reference composition.
- Pointer/touch creates a bounded local current; hold increases force; release settles through memory.
- Visual output responds to FORCE, MEMORY, and SCALE.
- A still frame has a clear silhouette and readable line hierarchy.

**Verification:**

- Run full automated checks.
- Use Ego at 1512×888 and 390×844.
- Confirm first visible frame within two seconds and visible pointer response.
- If the hero is weak, perform at most two bounded visual passes before continuing.

**Commit:**

```bash
git add src/scenes src/main.ts src/styles.css
git commit -m "feat: establish the PELAGIC hero system (RICK)"
```

## Task 5: Add STRATA through the same contract

**Objective:** Create a visually distinct tectonic field without changing the engine interface.

**Files:**
- Create: `src/scenes/strata.ts`
- Modify: `src/scenes/index.ts`

**Requirements:**

- Layered geological contours and faults; no sea-wave silhouette.
- Hold gesture accumulates pressure and release emits a bounded fracture/ring response.
- Seed deterministically controls ridges and fault anchors.
- Adaptive density prevents mobile overload.

**Verification:** tests/typecheck/build plus still-frame comparison with PELAGIC.

**Commit:** `feat: add the STRATA pressure field (RICK)`.

## Task 6: Add ORBIT through the same contract

**Objective:** Convert the Lithosphere three-body learning into a quiet, legible flow field rather than a control panel.

**Files:**
- Create: `src/scenes/orbit.ts`
- Create: `src/core/physics.ts`
- Create: `tests/physics.test.ts`
- Modify: `src/scenes/index.ts`

**Step 1: RED/GREEN physics**

Test softening prevents singularities, finite positions survive a bounded step, and seeded initial conditions reproduce.

**Step 2: Render**

Use a small number of bodies and fading trails. Pointer adds a temporary attractor only while active. Cap timestep and trail history.

**Verification:** no NaN/Infinity after a deterministic 10,000-step test; browser remains responsive.

**Commit:** `feat: add the ORBIT gravity field (RICK)`.

## Task 7: Add CHORUS through the same contract

**Objective:** Create an audio-like harmonic system with no audio or permission dependency.

**Files:**
- Create: `src/scenes/chorus.ts`
- Modify: `src/scenes/index.ts`

**Requirements:**

- Lissajous/resonance lattice, visibly unlike contours and orbit trails.
- Pointer changes phase/frequency relationship; hold increases coupling.
- No microphone, uploaded file, Web Audio permission, or autoplay.
- Reduced-motion mode renders a slowly breathing or static harmonic composition.

**Verification:** automated checks and a distinguishable still frame.

**Commit:** `feat: add the CHORUS resonance field (RICK)`.

## Task 8: Close the interaction loop

**Objective:** Let visitors navigate, tune, remix, inspect, capture, and share without a heavy panel.

**Files:**
- Create: `src/ui/controls.ts`
- Create: `src/ui/info.ts`
- Create: `src/ui/toast.ts`
- Create: `src/core/capture.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`
- Modify: `tests/state.test.ts`

**Requirements:**

- Accessible scene rail and three bounded range controls.
- Keyboard shortcuts `1–4`, `R`, `Space`, `I` with form-control guards.
- Remix generates a seed and updates the URL.
- Copy link uses Clipboard API with a fallback and truthful feedback.
- Capture downloads a PNG from the canvas.
- Information panel shows one equation, sentence, and hint.
- Controls auto-dim but remain keyboard/touch discoverable.

**Verification:** keyboard-only path, copied URL round trip, capture produces a non-empty PNG.

**Commit:** `feat: close the remix inspect and share loop (RICK)`.

## Task 9: Accessibility, mobile, metadata, and failure behavior

**Objective:** Make Release 1 usable and credible outside the reference desktop.

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/main.ts`
- Create: `public/favicon.svg`
- Create: `public/og.svg`
- Create: `public/robots.txt`
- Create: `public/site.webmanifest`

**Requirements:**

- Title, description, canonical placeholder, OG metadata, theme color.
- Skip link, focus styles, canvas fallback text, live-region feedback.
- `prefers-reduced-motion`, `pointer: coarse`, landscape, and 390 px rules.
- Safe area insets and no horizontal overflow.
- Friendly unsupported-canvas message instead of blank output.

**Verification:** DOM assertions, Lighthouse-style manual review, Ego mobile viewport, overflow `0`.

**Commit:** `fix: harden PHENOMENA for mobile and accessible input (RICK)`.

## Task 10: Production container and deterministic verifier

**Objective:** Make the artifact reproducible and deployable without secrets.

**Files:**
- Create: `Dockerfile`
- Create: `nginx.conf`
- Create: `.dockerignore`
- Create: `scripts/verify.mjs`
- Modify: `package.json`

**Requirements:**

- Multi-stage Node build to nginx-alpine runtime.
- SPA fallback, security headers, immutable hashed assets, no cache on HTML.
- Verifier checks required metadata/markers, forbidden features, bundle size, and generated assets.
- Local container exposes port 80 and serves a real 404 for `/does-not-exist.asset` while SPA routes fall back appropriately.

**Verification:**

```bash
npm run verify
npm run build
docker build -t phenomena:local .
docker run --rm -d --name phenomena-local -p 8088:80 phenomena:local
curl -fsS http://127.0.0.1:8088/ | grep PHENOMENA
curl -I http://127.0.0.1:8088/assets/<real-hash>
docker stop phenomena-local
```

**Commit:** `chore: add reproducible PHENOMENA release container (RICK)`.

## Task 11: README, evidence, and integration review

**Objective:** Reconcile claims with real checks before public push.

**Files:**
- Modify: `README.md`
- Modify: `docs/control/loop-state.json`
- Create: `docs/evidence/local-verification-2026-08-19.md`

**Requirements:**

- README explains the product loop, controls, architecture, accessibility, local run, deployment, and explicit exclusions.
- Do not claim live until live proof exists.
- Record exact test/build/container/browser commands and outcomes.
- Run an independent spec review, then code/security/performance review; fix critical/important issues and re-run.

**Verification:**

```bash
npm run typecheck
npm test -- --run
npm run build
npm run verify
git diff --check
git status --short
```

**Commit:** `docs: prepare verified PHENOMENA release candidate (RICK)`.

## Task 12: Public repository and isolated deployment

**Objective:** Publish the verified candidate without touching any existing service.

**External operations:**

- Public repo: `neurabytelabs/phenomena`.
- Coolify project: NeuraByte Labs / production.
- New app name: `phenomena`.
- Public-repo Dockerfile source on `main`.
- Preferred domain: `https://phenomena.mustafasarac.com` only if the exact DNS route can be created and proved; otherwise use a reversible sslip.io hostname and record the branded DNS gate separately.

**Steps:**

1. Verify clean `main`, tests, build, verifier, secret scan, and exact remote.
2. Push without force and prove remote HEAD equals local HEAD.
3. Create a new Coolify application. Abort if the API returns an existing application identity.
4. Deploy and poll the exact deployment UUID.
5. Verify TLS, HTML marker, hashed assets, security headers, unknown asset 404, desktop/mobile behavior, console errors, and URL-state recreation in Ego.
6. Update README and loop state to `LIVE_VERIFIED` only after proof; commit and push the narrow truth update.
7. Update the Core README/project manifest with a minimal milestone; preserve unrelated dirty files.

**Final evidence:** repo URL, live URL, local/remote/deploy SHA, deployment UUID, test/build counts, browser screenshots/metrics, and explicit confirmation that Lithosphere remained untouched.

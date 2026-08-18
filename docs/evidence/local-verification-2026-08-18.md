# PHENOMENA Local Verification

Verification window: August 18–19, 2026 (+03; the UTC calendar date remained August 18 during the final checks)
Repository: `https://github.com/neurabytelabs/phenomena`
Live status: indexable Release 1 verified at `https://phenomena.91-98-46-190.sslip.io/`

## Automated checks

```bash
npm run typecheck
```

Result: passed.

```bash
npm test -- --run
```

Result: passed with 21 tests across:

- `tests/smoke.test.ts`
- `tests/random.test.ts`
- `tests/state.test.ts`
- `tests/math.test.ts`
- `tests/physics.test.ts`
- `tests/scene-parameters.test.ts`

```bash
npm run build
```

Result: passed.

Final build output:

- `dist/index.html` 1.37 kB
- `dist/assets/index-DudkL_rz.css` 5.63 kB
- `dist/assets/index-DHp8IKCy.js` 19.42 kB

```bash
npm run verify
```

Result: passed.

```bash
npm audit --audit-level=moderate
```

Result: passed with 0 vulnerabilities after refreshing patched transitive versions in the lockfile.

Verifier coverage:

- built HTML markers
- manifest / favicon / OG / robots assets
- hashed JS and CSS assets
- JS bundle budget
- reduced-motion and 390px CSS guards
- forbidden feature markers in app source

## Browser evidence

Primary browser tool: `ego-browser`, operating against `npm run preview` at `http://127.0.0.1:4173`.

Desktop QA at `1512×888`:

- canvas bounds: `1512×888`
- horizontal overflow: `0`
- scene rail to control panel gap: `23.4 px`
- all four scene stills were captured and visually inspected
- Remix changed the seed; Pause and FORCE changes updated URL state
- info panel was absent from the closed semantic tree, opened with correct ARIA state, closed with Escape, and returned focus to `Info`
- runtime exception, console error, log warning, and failed-request set: empty

Mobile QA at `390×844`:

- canvas bounds: `390×844`; backing store: `585×1266` after the `1.5` DPR cap
- horizontal overflow: `0`
- scene rail → action cluster gap: `13.4 px`
- action cluster → controls gap: `21.9 px`
- open info panel → scene rail gap: `12.7 px`
- keyboard and real-button scene selection both changed URL and active scene state
- a visible toast no longer intercepts scene controls (`pointer-events: none`)
- runtime exception, console error, log warning, and failed-request set: empty

Latest-disk scene grammar verification:

- ORBIT maps `MEMORY` to bounded trail persistence.
- CHORUS maps `MEMORY` to temporal phase persistence; a paused live-canvas PNG digest changed when `MEMORY` changed from `0` to `1`.
- STRATA applies the reduced-motion factor to ambient drift and fracture expansion.
- Fresh local browser reload after these fixes produced zero runtime, console, log, or network errors.
- Mobile visual QA caught a transient toast obscuring open info text; the toast is now hidden while the mobile info panel is open, with a measured `12.0 px` info-to-scene gap and overflow `0`.

Visual verdict: `CONDITIONAL PASS`. The primary metaphor and four scene identities are visible; Pelagic is intentionally closest to the reference language, while Strata and Chorus remain line-based relatives and Orbit is deliberately sparse. No release-blocking overlap remains.

## Container attempt

```bash
docker --version
```

Result: Docker CLI present (`28.4.0`).

```bash
docker build -t phenomena:local .
```

Result: failed because the Docker daemon was unavailable:

```text
Cannot connect to the Docker daemon at unix:///Users/mustafa/.docker/run/docker.sock
```

Container runtime checks were not claimed locally. The proof gap was subsequently closed by the isolated Coolify image build and live runtime evidence below.

## Live noindex deployment evidence

- Public implementation commit was pushed and remote `main` matched local `HEAD`.
- Coolify application `6slokigyf8nsclqbtv5gjth4` was created as a new isolated resource in NeuraByte Labs / production.
- Two build-contract defects and one nginx parse defect were observed remotely and fixed at their source; no existing service was used as a fallback.
- Final noindex deployment `q56hurytky4432i47uberuux` finished from commit `37eeeca307c16bf366146f32fab44e78e941ddb6`.
- Coolify read-back reported `running:healthy`.
- DNS resolved to `91.98.46.190`; TLS presented the exact hostname with a valid Let's Encrypt certificate.
- Live HTML: HTTP 200, `Cache-Control: no-store`, CSP, nosniff, and `X-Robots-Tag: noindex, nofollow`.
- Live hashed JavaScript: HTTP 200, `Cache-Control: public, max-age=31536000, immutable`, with the same security/noindex headers.
- `/does-not-exist.asset`: HTTP 404.
- `/instrument/pelagic`: HTTP 200 application shell.
- Desktop `1512×888`: canvas present, overflow `0`, Remix/Info/Escape/scene transitions passed, console errors `0`.
- Mobile `390×844`: overflow `0`, scene/action gap `13.4 px`, action/control gap `21.9 px`, open info/scene gap `12.9 px`, toast/scene gap `12.9 px`, console and failed application requests `0`.

## Live indexable deployment evidence

- Indexable promotion commit `4225d13588f74775080d9d1e0ca5bd38e9473c5a` deployed successfully as `3n1nyhpag7agorzrsyukqvam`.
- Final mobile-overlap fix commit `a3c2a6f9ccf4a22a8056ec127e83586d6ae04919` matched `origin/main` and deployed successfully as `ayiyxr2o2ziglp8djpfbwjo1`.
- Builder-provenance closure commit `ed8c6f16c965e83f9f0936730f4fb36da3f4669c` matched `origin/main` and deployed successfully as `hei2veekjswmkcmpw5xfycws`.
- Coolify deployment terminal state was `finished`; application read-back remained `running:healthy`.
- Live HTML has no robots noindex meta; `X-Robots-Tag` is absent.
- `/robots.txt`: HTTP 200, `Allow: /`, canonical sitemap declaration, `Cache-Control: no-store`.
- `/sitemap.xml`: HTTP 200, canonical live URL, no stale or anticipatory `lastmod`, `Cache-Control: no-store`.
- Final hashed assets are `index-DHp8IKCy.js` and `index-DudkL_rz.css`.
- Desktop `1512×888`: canvas `1512×888`, overflow `0`, CHORUS `MEMORY` changed the paused canvas digest, Info/Escape state passed, console/network errors `0`.
- Mobile `390×844`: canvas `390×844`, overflow `0`, info/scene gap `12.9 px`, scene/action gap `13.4 px`, action/control gap `21.9 px`.
- Mobile toast was visible before opening Info and computed `visibility: hidden; opacity: 0` while Info was open; screenshot inspection found no remaining overlap.
- The provenance credit links to `https://mustafasarac.com/` with `target="_blank"` and `rel="noreferrer"` in both the main UI and unsupported-canvas fallback. Live `390×844` QA measured a `10.4 px` tagline gap, visible/clickable hit target, canvas backing store `585×1266`, horizontal overflow `0`, and no runtime/log/network failures.
- Final desktop and mobile screenshots were independently inspected and returned release `PASS`.
- Core source-of-truth was synchronized in isolated worktree branch `project/phenomena-launch-20260818` as local commit `214bfa385440f00d787155183f6eb5e2bd9fc5cf`; Core push and main integration were intentionally not performed.

## Review summary

- README and `docs/control/loop-state.json` are synchronized to the verified live-indexable state
- Independent final candidate review returned `APPROVED` after nginx SPA/404 and publication-truth fixes
- Indexable-promotion review requested release-wording and sitemap-verifier fixes; each finding was corrected
- A delayed spec review identified missing ORBIT/CHORUS `MEMORY` mappings and STRATA reduced-motion consistency; the current working tree fixes these with regression coverage
- A second delayed review batch targeted stale commit `adb234d`: its nginx SPA-fallback critical finding was superseded and contradicted by the current config plus live extensionless-route HTTP 200 evidence. Its still-current builder-credit link gap was closed across main, fallback, and `390×844` states with TDD and live QA.
- Latest-disk independent re-review returned `APPROVED` with no critical, important, or minor findings
- Indexable promotion and its final visual fix passed commit, push, deploy, runtime read-back, and browser QA
- Lithosphere remained untouched

## First measured learning / kill gate

Release 1 passed the external live browser gate. If later real-device Safari/Chrome evidence shows the first-touch response is weak or the control stack crowds the hero, simplify the chrome before adding features.

# PHENOMENA Local Verification

Verification window: August 18–19, 2026
Repository: `https://github.com/neurabytelabs/phenomena`
Live status: noindex Release 1 verified at `https://phenomena.91-98-46-190.sslip.io/`; indexable promotion pending

## Automated checks

```bash
npm run typecheck
```

Result: passed.

```bash
npm test -- --run
```

Result: passed with 18 tests across:

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
- `dist/assets/index-CgeDsdmC.css` 5.54 kB
- `dist/assets/index-CV1Hvv1L.js` 19.37 kB

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

## Review summary

- README and `docs/control/loop-state.json` are synchronized to the verified live-noindex state
- Independent final candidate review returned `APPROVED` after nginx SPA/404 and publication-truth fixes
- Indexable-promotion review requested release-wording and sitemap-verifier fixes; each finding was corrected
- A delayed spec review identified missing ORBIT/CHORUS `MEMORY` mappings and STRATA reduced-motion consistency; the current working tree fixes these with regression coverage
- Latest-disk independent re-review returned `APPROVED` with no critical, important, or minor findings
- Indexable promotion remains a separate commit/deploy/read-back gate
- Lithosphere remained untouched

## First measured learning / kill gate

If external Task 12 browser QA shows the first-touch response feels weak or the control stack still crowds the hero on real hosted mobile Safari/Chrome, stop before live promotion and simplify the chrome again rather than adding features.

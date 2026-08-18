# PHENOMENA Local Verification

Verification window: August 18–19, 2026
Repository: `https://github.com/neurabytelabs/phenomena` (public; implementation push pending)
Live status: not claimed

## Automated checks

```bash
npm run typecheck
```

Result: passed.

```bash
npm test -- --run
```

Result: passed with 15 tests across:

- `tests/smoke.test.ts`
- `tests/random.test.ts`
- `tests/state.test.ts`
- `tests/math.test.ts`
- `tests/physics.test.ts`

```bash
npm run build
```

Result: passed.

Final build output:

- `dist/index.html` 1.43 kB
- `dist/assets/index-CmeEJ6Hk.css` 5.54 kB
- `dist/assets/index-C0QhfGF8.js` 19.05 kB

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

Container runtime checks were not claimed locally. The Dockerfile now includes a healthcheck; the proof gap must be closed by the actual isolated Coolify image build, runtime health, headers, 404, and TLS checks.

## Review summary

- README and `docs/control/loop-state.json` are synchronized to the local release-candidate state
- Public repository exists; implementation commit/push is still pending
- No live deployment, DNS, TLS, or Coolify application is claimed yet
- Lithosphere remained untouched

## First measured learning / kill gate

If external Task 12 browser QA shows the first-touch response feels weak or the control stack still crowds the hero on real hosted mobile Safari/Chrome, stop before live promotion and simplify the chrome again rather than adding features.

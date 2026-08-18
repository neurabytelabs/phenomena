# PHENOMENA

Touch the equation. Watch the world answer.

Status on August 19, 2026: Release 1 is implemented and locally verified in the public repository workspace; the implementation push and live deployment are still pending.

PHENOMENA is a static Vite + TypeScript living-systems instrument by Mustafa Saraç / NeuraByte Labs. Release 1 ships four bounded scenes on one Canvas 2D surface:

- `PELAGIC`
- `STRATA`
- `ORBIT`
- `CHORUS`

The visitor loop is `enter → perturb → compare → remix → inspect → share/capture`.

## Controls

- Pointer / touch: perturb the field
- Hold: accumulate force
- Release: let the system settle
- Keyboard: `1–4` switch scenes, `R` remix, `Space` pause, `I` info
- Bounded parameters: `FORCE`, `MEMORY`, `SCALE`

## Architecture

- Vite + TypeScript
- Canvas 2D engine with capped DPR and adaptive density
- Deterministic seeded PRNG and URL serializer
- Focused scene modules under one shared `Phenomenon` contract
- Vitest for pure logic
- Custom verifier for metadata, assets, forbidden features, and bundle budget
- nginx production runtime with SPA fallback and security headers

## Local Run

```bash
npm install
npm run typecheck
npm test -- --run
npm run build
npm run verify
npm run dev
```

## Verified On August 19, 2026

- `npm run typecheck` passed
- `npm test -- --run` passed with 15 tests
- `npm run build` passed
- `npm run verify` passed
- `npm audit --audit-level=moderate` passed with 0 vulnerabilities
- Desktop browser QA completed against the HTTP-served production preview in `ego-browser`
- Mobile browser QA completed at `390×844` with horizontal overflow `0` and positive gaps between every control layer
- Fresh runtime exception, console error, log warning, and failed-request set was empty
- URL state round-trip verified for scene and bounded parameters
- Four still scenes were captured and visually distinguished

## Remaining Release Gate

- Local production preview and browser acceptance passed
- Docker is installed, but the local daemon was unavailable
- The container proof must therefore be closed by the isolated Coolify build, runtime health, headers, true 404, and live TLS checks before this README can claim a live release

## Explicit Exclusions

- No backend
- No analytics
- No accounts
- No camera or microphone
- No AI runtime
- No payments or messaging
- No Lithosphere mutation
- No deployment claim in this loop

## Evidence

- Build contract: [`docs/control/master-prompt.md`](docs/control/master-prompt.md)
- Design spec: [`docs/specs/2026-08-18-phenomena-design.md`](docs/specs/2026-08-18-phenomena-design.md)
- Verification log: [`docs/evidence/local-verification-2026-08-18.md`](docs/evidence/local-verification-2026-08-18.md)

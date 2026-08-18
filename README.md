# PHENOMENA

Touch the equation. Watch the world answer.

Status on August 19, 2026 (+03): Release 1 is live, indexable, and browser-verified at [phenomena.91-98-46-190.sslip.io](https://phenomena.91-98-46-190.sslip.io/).

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
- `npm test -- --run` passed with 18 tests
- `npm run build` passed
- `npm run verify` passed
- `npm audit --audit-level=moderate` passed with 0 vulnerabilities
- Desktop browser QA completed against the HTTP-served production preview in `ego-browser`
- Mobile browser QA completed at `390×844` with horizontal overflow `0` and positive gaps between every control layer
- Fresh runtime exception, console error, log warning, and failed-request set was empty
- URL state round-trip verified for scene and bounded parameters
- All four scenes translate `FORCE`, `MEMORY`, and `SCALE`; scene parameter mappings have regression tests
- Four still scenes were captured and visually distinguished

## Live Indexable Verification

- Public repository and deployed commit were reconciled
- Isolated Coolify application reports `running:healthy`
- Valid Let's Encrypt TLS and canonical host were verified
- HTML returns `no-store`; hashed assets return immutable one-year caching
- HTML has no robots noindex directive or `X-Robots-Tag`; `robots.txt` allows crawling and advertises the sitemap
- `sitemap.xml` returns HTTP 200 with the canonical live URL
- Unknown asset returns HTTP 404; an extensionless SPA route returns the application shell
- Desktop and 390×844 mobile interactions, layout, runtime, console, network, and visual gates passed
- ORBIT and CHORUS respond to `MEMORY`; STRATA respects reduced motion
- Mobile toast remains visible normally and hides while the info panel is open, preventing text overlap

## Next Optional Release Gate

- Attach and verify a branded `phenomena.mustafasarac.com` host when Cloudflare access is available
- Preserve the verified sslip.io host until branded DNS and TLS pass independently

## Explicit Exclusions

- No backend
- No analytics
- No accounts
- No camera or microphone
- No AI runtime
- No payments or messaging
- No Lithosphere mutation
- No branded DNS claim yet; Release 1 uses the reversible sslip.io host because Cloudflare required a manual login

## Evidence

- Build contract: [`docs/control/master-prompt.md`](docs/control/master-prompt.md)
- Design spec: [`docs/specs/2026-08-18-phenomena-design.md`](docs/specs/2026-08-18-phenomena-design.md)
- Verification log: [`docs/evidence/local-verification-2026-08-18.md`](docs/evidence/local-verification-2026-08-18.md)

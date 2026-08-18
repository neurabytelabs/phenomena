# PHENOMENA — Product Design

Date: 2026-08-18
Owner: Mustafa Saraç / NeuraByte Labs
Status: APPROVED BY INITIAL BRIEF · BUILD ACTIVE

## 1. Reverse-prompt result

The surface request is “a project like Pelagos.” The deeper job is not to copy an ocean shader. It is to publish a small, unforgettable proof that Mustafa can turn mathematics, interaction, visual craft, engineering, and operations into one finished product.

The old Lithosphere failed as a product despite technical ambition because it optimized for capabilities before experience: 70+ controls, 13 tabs, WebGPU-only rendering, microphone/webcam/AI permissions, alpha-version expansion, large files, and manual operations competed with the hero moment. PHENOMENA reverses that order.

## 2. Considered directions

### A. Generative scene gallery

A portfolio of many unrelated visual experiments.

- Strength: close to the reference and easy to understand.
- Weakness: quantity becomes the product; overnight scope creates shallow scenes.
- Decision: rejected.

### B. Shader studio successor

A compact successor to Lithosphere with editable shaders and export.

- Strength: creator utility and technical depth.
- Weakness: recreates the control-panel trap and raises onboarding cost.
- Decision: rejected for Release 1.

### C. Living systems instrument — selected

One coherent instrument with four phenomena, one interaction grammar, one seed, and shareable states.

- Strength: immediate wonder plus a closed user loop.
- Strength: distinct from Pelagos without pretending to outnumber it.
- Strength: useful as art, learning object, portfolio proof, and social artifact.

## 3. Product thesis

PHENOMENA is a browser-based living-systems instrument.

Tagline: **Touch the equation. Watch the world answer.**

The visitor enters a full-screen field, changes it immediately with pointer or touch, remixes a state, learns the system behind it, and shares the exact state through the URL.

## 4. Release 1 scope

### Four systems

1. **PELAGIC** — contour ocean; currents bend around the pointer.
2. **STRATA** — tectonic topography; pressure opens faults and rings.
3. **ORBIT** — three-body flow; pointer injects or redirects gravity.
4. **CHORUS** — harmonic lattice; gesture changes phase and resonance.

### One interaction grammar

- Move / touch: perturb the field.
- Hold: accumulate force.
- Release: let the system settle.
- `1–4`: switch system.
- `R`: remix seed.
- `Space`: pause/resume.
- `I`: open/close the concise explanation.

### Three visible parameters

The visitor sees only `FORCE`, `MEMORY`, and `SCALE`. Each system translates these into its own equations. No expert control panel in Release 1.

### Closed user loop

`enter → perturb → compare systems → remix → inspect → share/capture`

Share state contains only scene, seed, and bounded parameters. No account, backend, analytics, microphone, camera, or AI runtime.

## 5. Experience architecture

- Full-screen canvas is the hero and remains visually dominant.
- Scene rail is a compact accessible navigation surface.
- UI is quiet until pointer/keyboard/touch intent appears.
- Explanations reveal one equation, one plain-language sentence, and one interaction hint.
- A tiny “Built by Mustafa Saraç / NeuraByte Labs” link provides provenance without turning the experience into a landing page.

## 6. Visual system

- Background: near-black, not pure black, with subtle spatial depth.
- Base ink: warm white with scene-specific spectral accents.
- Typography: monospaced display + neutral UI stack; small uppercase labels.
- Motion: continuous but non-cinematic; state responds more than it performs.
- Each system must have a recognizably different silhouette in a still frame.
- `prefers-reduced-motion` yields a stable, low-motion field rather than a blank screen.

## 7. Technical architecture

- Vite + TypeScript.
- Canvas 2D, no React and no Three.js in Release 1.
- Device-pixel-ratio capped for stable thermals and mobile performance.
- A shared engine owns resize, animation, input, seed, pause, URL state, and lifecycle.
- Each system is a focused module implementing `init`, `update`, `render`, and `dispose`.
- Static nginx container; no server runtime or secrets.
- Public GitHub repository; MIT license.
- Isolated Coolify application under the NeuraByte Labs project.

## 8. Performance and accessibility

- Desktop target: smooth motion at 60 Hz on the current M3 reference machine.
- Mobile target: responsive interaction at 390 px; adaptive line/particle counts.
- No horizontal overflow at 390 px.
- Every button has an accessible name and visible focus style.
- Keyboard path reaches all core actions.
- Canvas has a textual fallback description.
- No permission prompts and no auto-playing audio.

## 9. Acceptance gates

### Perceptual gate

- The first scene produces a clear hero frame within two seconds.
- The first pointer/touch movement visibly changes the scene within 100 ms.
- All four scenes are distinguishable in still screenshots.
- UI never occupies more than a small minority of the viewport.

### Product gate

- Scene selection, remix, pause, information, capture, and copy-link work.
- A copied state URL recreates the same scene/seed/parameters.
- Refresh and unknown routes do not strand the user.

### Engineering gate

- Typecheck, tests, production build, and custom verifier pass.
- Browser console errors: 0 on desktop and 390 px mobile.
- Horizontal overflow: 0.
- No secrets or token-shaped values in tracked files.
- Production container serves `/`, immutable assets, and a real SPA fallback.

### Publication gate

- Public repo points to the verified live URL.
- Coolify app is a new isolated resource; old Lithosphere is untouched.
- Live URL returns valid TLS and expected PHENOMENA markers.
- Only verified-live state is recorded as “live.”

## 10. Kill / pivot rules

- If the PELAGIC hero cannot meet the perceptual gate after two bounded visual passes, stop adding systems and fix the hero.
- If four scenes threaten verification time, ship three complete scenes rather than four incomplete ones.
- No camera, microphone, AI API, shader editor, account, backend, gallery, or community feature during the overnight build.
- A green build without a compelling hero screenshot is not success.

## 11. Overnight schedule (+03)

- 23:50–00:15 — reference teardown, reverse prompt, design, repo/control packet.
- 00:15–01:15 — engine, visual system, PELAGIC hero.
- 01:15–02:15 — STRATA, ORBIT, CHORUS.
- 02:15–03:00 — controls, URL state, capture, explanation, responsive UI.
- 03:00–03:45 — typecheck/tests/build and desktop/mobile browser QA.
- 03:45–04:30 — independent critique and bounded fix pass.
- 04:30–05:30 — public push, isolated Coolify deploy, live TLS/browser QA.
- 05:30–06:00 — README/Core truth sync and morning brief.

## 12. Non-goals

PHENOMENA Release 1 is not a Pelagos clone, a remake of Lithosphere, a shader IDE, an AI wrapper, or a promise of a large future platform. It is one finished instrument with a narrow durable loop.

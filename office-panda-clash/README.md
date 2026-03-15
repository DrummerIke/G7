# Office Panda Clash (standalone subproject)

Production-oriented modular MVP of a 2D arcade fighter with office pandas.

## Why install failed before (403)
Previous version depended on external npm packages (`vite`, `pixi.js`, `zustand`, `electron`, `@types/node`).
In this sandbox, npm runs through environment proxy settings (`http-proxy=http://proxy:8080`) and requests to npm registry returned `403 Forbidden`.

To make the pipeline runnable here, the project is now **dependency-free** (pure browser ES modules + Node scripts), so `npm install` succeeds without downloading packages.

---

## Quick start (Windows / PowerShell)
```powershell
cd office-panda-clash
npm install
npm run dev
```
Open: `http://127.0.0.1:5173`

Stop dev server with `Ctrl + C`.

## Production build
```powershell
cd office-panda-clash
npm install
npm run build
```
Result: `office-panda-clash/dist/`

## Validation commands
```powershell
npm run smoke
npm test
```
(`npm test` currently aliases smoke-check)

---

## Current MVP scope
- Screens: Main Menu, Fighter Select, Stage Select, Versus, Battle, Result, Training.
- Fight core: 1v1, timer, HP bars, Bo3 rounds.
- Actions: walk, crouch, jump, block, dash, dodge, jab, kick, uppercut, sweep, throw, special.
- States: hitstun, blockstun, knockdown/getup, finish window, BORKALITY input.
- Data-driven registries for fighters/stages/moves.

---

## Project structure
```text
office-panda-clash/
  index.html
  scripts/
    dev-server.mjs
    build.mjs
    smoke-check.mjs
  src/
    animation/
    battle/
    core/
    data/
      fighters/
      stages/
      moves/
    input/
    rendering/
    scenes/
    systems/
    assets/
      fighters/<fighter>/animations.json
      fighters/<fighter>/frame-config.json
      stages/<stage>/config.json
      vfx/
```

---

## Where to improve visuals and combat next
1. Fighters art pipeline:
   - `src/assets/fighters/<fighter>/animations.json`
   - `src/assets/fighters/<fighter>/frame-config.json`
   - add atlases/sprite sheets and wire frame timing + hitboxes.
2. Stages and ambience:
   - `src/assets/stages/<stage>/config.json`
   - connect multi-layer backgrounds and ambient VFX hooks.
3. VFX and polish:
   - `src/assets/vfx/`
   - implement hit sparks, screen shake profiles, finish/borkality overlays.

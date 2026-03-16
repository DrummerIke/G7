# Office Panda Clash (standalone subproject)

Production-oriented modular MVP of a 2D arcade fighter with office pandas.

## Why install failed before (403)
The previous revision depended on external npm packages (`vite`, `pixi.js`, `zustand`, `electron`, `@types/node`).
In this sandbox, npm is forced through proxy env config (`http-proxy=http://proxy:8080`) and package downloads from npm registry returned `403 Forbidden`.

To guarantee a runnable pipeline, the subproject is now dependency-free (browser ES modules + Node built-in scripts), so `npm install` completes without external downloads.

---

## Quick start (Windows / PowerShell)
```powershell
cd office-panda-clash
npm install
npm run dev
```
Open: `http://127.0.0.1:5173`

Stop server with `Ctrl + C`.

## Build (production web bundle)
```powershell
cd office-panda-clash
npm install
npm run build
```
Output: `office-panda-clash/dist/`

## Desktop-oriented package (no external packager)
```powershell
cd office-panda-clash
npm install
npm run build:desktop
```
Output: `office-panda-clash/desktop-build/`

- Windows run script: `desktop-build\run-desktop.bat`
- Linux/macOS run script: `desktop-build/run-desktop.sh`

This package serves the built app locally and opens it in the default browser.

## Validation
```powershell
npm run smoke
npm test
```
(`npm test` aliases smoke-check)

---

## Current MVP scope
- Screens: Main Menu, Fighter Select, Stage Select, Versus, Battle, Result, Training.
- Fight core: 1v1, timer, HP bars, Bo3 rounds.
- Actions: walk, crouch, jump, block high/low, dash, dodge, jab, kick, uppercut, sweep, throw, special.
- States: hitstun, blockstun, knockdown/get-up, finish window, BORKALITY input.
- Data-driven registries for fighters/stages/moves.

---

## Project structure
```text
office-panda-clash/
  index.html
  scripts/
    dev-server.mjs        # local dev server
    build.mjs             # builds dist/
    package-desktop.mjs   # builds desktop-build/
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

## Where to extend art and combat
1. **Fighter visuals + timing**
   - `src/assets/fighters/<fighter>/animations.json`
   - `src/assets/fighters/<fighter>/frame-config.json`
   - Add atlases/sprite sheets and per-frame hitbox timing.
2. **Stage visual depth**
   - `src/assets/stages/<stage>/config.json`
   - Add layered backgrounds, palette LUTs, ambient hooks.
3. **VFX polish**
   - `src/assets/vfx/`
   - Add hit sparks, camera shake curves, finish and borkality overlays.

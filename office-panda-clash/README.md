# Office Panda Clash — runnable MVP 2D-файтинга

Серьёзный arcade-прототип 2D fighting game с офисными пандами.
Проект модульный, запускается в sandbox без внешних npm-зависимостей и готов к замене placeholder-графики на финальные sprite sheets.

## Что уже работает
- Экраны: Main Menu, Fighter Select, Stage Select, Versus, Battle, Result, Training.
- Бой: 1v1, таймер, best of 3, HP bars.
- Движение и экшены: idle, walk, crouch, jump, block high/low, dash, dodge.
- Удары: jab, kick, uppercut, sweep, throw, unique special.
- Состояния: hitstun, blockstun, knockdown, get-up, finish window.
- BORKALITY input окно: `B+O+R+K`.
- AI соперник: дистанция, pressure, реактивный блок, вариативные атаки.
- Визуальный слой: stage depth/parallax, ambient particles, hit sparks, impact feel, screen shake, strong HUD, round/finish/borkality banners.

## Почему dependency-free
В sandbox может быть `403 Forbidden` при скачивании npm-пакетов через прокси.
Здесь pipeline построен на Node built-ins + browser ES modules, поэтому `npm install` стабильно проходит.

---

## Быстрый запуск
```bash
cd office-panda-clash
npm install
npm run dev
```
Открыть: `http://127.0.0.1:5173`

## Сборка
```bash
npm run build
```
Результат: `dist/`

## Desktop package
```bash
npm run build:desktop
```
Результат: `desktop-build/`

- Windows: `desktop-build\run-desktop.bat`
- Linux/macOS: `desktop-build/run-desktop.sh`


## Как «выложить» текущую версию
Собрать готовый релизный пакет в папку `release/`:

```bash
npm run release
```

После команды появится:
- `release/office-panda-clash-v<version>/desktop-build/`
- `release/office-panda-clash-v<version>/dist/`
- `release/office-panda-clash-v<version>/RUN.md`

Это и есть готовая папка для передачи/публикации.


## Почему файлов может не быть на GitHub
Изменения появляются на GitHub только после `git push` в удалённый репозиторий.
Проверка готовности к публикации:

```bash
npm run publish:check
```

Публикация:

```bash
git push -u origin $(git rev-parse --abbrev-ref HEAD)
```

## Проверки
```bash
npm run smoke
npm test
```
`npm test` = `npm run smoke`.

---

## Управление (default)
- A/D — move
- W — jump
- S — crouch
- Shift — block
- J — jab
- K — kick
- I — uppercut
- U — sweep
- P — throw
- H — dash
- O — dodge/backstep
- L — special
- B + O + R + K — BORKALITY

---

## Архитектура
```text
src/
  animation/   # state machine
  battle/      # fighter/match combat systems
  core/        # events, app store
  data/        # fighters/stages/moves registries
  input/       # configurable controls
  rendering/   # placeholder renderer + sprite pipeline preloader
  scenes/      # menu/select/result screens
  systems/     # game orchestration + AI
  ui/          # HUD renderer
  assets/      # fighters/stages/vfx pipeline roots
scripts/
  dev-server.mjs
  build.mjs
  package-desktop.mjs
  smoke-check.mjs
```

События event system:
- `ROUND_STARTED`
- `HIT_CONFIRMED`
- `BLOCKED`
- `KNOCKDOWN`
- `FINISH_HIM`
- `BORKALITY_AVAILABLE`
- `MATCH_FINISHED`

---

## Бойцы и арены
### Fighters
1. Panda IT Specialist
2. Panda Chef
3. Panda Clerk
4. Panda Secretary
5. Panda Boss (низкий, тяжёлый, белая рубашка, чёрные брюки в стиле силуэта)

У каждого бойца:
- unique stats
- unique special move
- unique BORKALITY title
- отдельный config в `src/data/fighters/registry.js`
- отдельные animation/frame configs в `src/assets/fighters/<fighter>/`

### Stages
1. Temple Night
2. Neon Office
3. Red Garden

У каждой арены:
- stage config в `src/data/stages/registry.js`
- asset config в `src/assets/stages/<stage>/config.json`
- palette/floor/ambient hooks

---

## Пайплайн финальной графики (как заменить placeholder без переписывания боя)

### Куда загружать ассеты
- Fighters: `src/assets/fighters/<fighter>/`
  - `atlas.png` *(добавляется художником)*
  - `animations.json`
  - `frame-config.json`
  - `hitboxes.json` *(рекомендуется для следующего шага)*
- Stages: `src/assets/stages/<stage>/`
- VFX: `src/assets/vfx/`

### Требования к fighter-ассетам
- PNG RGBA, прозрачный фон.
- Единый масштаб бойцов.
- Обязательные animation states: `idle, walk, crouch, jump, blockHigh, blockLow, dash, dodge, jab, kick, uppercut, sweep, throw, special, hitstun, knockdown, getup, victory, defeat`.
- В `frame-config.json`: `frameSize`, `pivot`, `hitboxes`.

### Что уже подготовлено в коде
- `SpritePipeline` предзагружает и валидирует fighter/stage config файлы.
- Combat-логика (`battle/*`) не зависит от конкретного способа рендера.
- Для перехода на final sprites нужно заменить/расширить rendering backend (например выделить `spriteRenderer.js`), не трогая ядро боя.

---

## Что осталось до final-quality графики
1. Подключить реальный atlas/frame renderer вместо procedural-поз.
2. Подключить per-frame hitboxes/hurtboxes и editor-friendly JSON.
3. Добавить полноценный VFX pass: directional hit sparks, trails, camera impulse curves, post effects.

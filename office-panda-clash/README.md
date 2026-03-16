# Office Panda Clash (отдельный подпроект)

Production-ready основа 2D fighting game с офисными пандами.

## Зачем проект dependency-free
В прошлой версии использовались внешние npm-зависимости (`vite`, `pixi.js`, `zustand`, `electron`, `@types/node`).
В sandbox-окружении с прокси (`http-proxy=http://proxy:8080`) скачивание из npm registry иногда возвращает `403 Forbidden`.

Чтобы пайплайн запускался стабильно, текущая версия работает без внешних пакетов (чистые browser ES modules + Node built-ins).

---

## Быстрый запуск (Windows / PowerShell)
```powershell
cd office-panda-clash
npm install
npm run dev
```
Открыть в браузере: `http://127.0.0.1:5173`

Остановить сервер: `Ctrl + C`.

## Сборка web-версии
```powershell
cd office-panda-clash
npm install
npm run build
```
Результат: `office-panda-clash/dist/`

## Desktop-пакет (без внешнего packager)
```powershell
cd office-panda-clash
npm install
npm run build:desktop
```
Результат: `office-panda-clash/desktop-build/`

- Windows: `desktop-build\run-desktop.bat`
- Linux/macOS: `desktop-build/run-desktop.sh`

---

## Текущий MVP scope
- Экраны: Main Menu, Fighter Select, Stage Select, Versus, Battle, Result, Training.
- Бой: 1v1, таймер, HP, Best of 3.
- Действия: ходьба, присед, прыжок, блок high/low, дэш, додж, jab/kick/uppercut/sweep/throw/special.
- Состояния: hitstun, blockstun, knockdown/get-up, finish window, BORKALITY input.
- AI соперник: дистанция, pressure-режим, реактивный блок, случайный паттерн атак.
- Улучшенный placeholder-визуал: parallax, ambient particles, hit sparks, screen shake.

---

## Как загрузить визуальные модели/спрайты и какие требования

> В этом проекте под “визуальные модели” подразумеваются 2D ассеты (sprite sheets/atlases + JSON-конфиги), которые подменяют placeholder-рендер без переписывания логики.

### 1) Куда класть файлы
Для каждого бойца:
- `src/assets/fighters/<fighter>/atlas.png` *(добавляете вы)*
- `src/assets/fighters/<fighter>/animations.json`
- `src/assets/fighters/<fighter>/frame-config.json`

Поддерживаемые fighter-id:
- `it`, `chef`, `clerk`, `secretary`, `boss`

Для арен:
- `src/assets/stages/<stage>/config.json`
- дополнительные слои (например `bg.png`, `mid.png`, `fg.png`) кладутся рядом

Поддерживаемые stage-id:
- `temple-night`, `neon-office`, `red-garden`

VFX:
- `src/assets/vfx/` (sparks, overlays, shake presets)

### 2) Минимальные требования к файлам бойца

#### `atlas.png`
- Формат: PNG (RGBA)
- Рекомендуемый старт: power-of-two (например 2048x2048)
- Желательно единый масштаб между всеми бойцами
- Прозрачный фон

#### `animations.json`
Обязательные поля:
- `fighter` — id бойца
- `atlas` — путь к атласу
- `states` — набор состояний

Минимальный набор состояний для полноценного боя:
- `idle`, `walk`, `crouch`, `jump`, `blockHigh`, `blockLow`, `dash`, `dodge`,
- `jab`, `kick`, `uppercut`, `sweep`, `throw`, `special`,
- `hitstun`, `knockdown`, `getup`, `victory`, `defeat`

Для каждого состояния:
- `fps` — скорость анимации
- `frames` — индексы кадров

#### `frame-config.json`
Обязательные поля:
- `frameSize` (`w`, `h`) — единый размер кадра
- `pivot` (`x`, `y`) — точка опоры (обычно `x=0.5`, `y≈0.85..0.95`)
- `hitboxes` — ссылка на hitbox-данные (json)

### 3) Требования к качеству графики
- Стиль: серьёзный arcade fighter, не мультяшный, не детский.
- Читаемые силуэты в движении (особенно стойка, прыжок, атака, блок).
- Контрастные формы рук/ног на атакующих кадрах.
- Для спец-атак — отдельные яркие VFX-кадры/оверлеи.

### 4) Чек-лист перед интеграцией
1. Имена папок и id совпадают с registry.
2. Все обязательные состояния есть в `animations.json`.
3. Pivot не “прыгает” между состояниями.
4. Размер hitbox не выходит за логику move-рейнджа.
5. После замены ассетов проходит `npm run smoke` и `npm run build`.

### 5) Что нужно доработать в коде для полного runtime-подключения финальных спрайтов
Сейчас используется canvas placeholder-слой. Для production art pipeline следующим шагом:
- добавить загрузчик atlas/frames в `src/rendering/placeholderRenderer.js` (или выделить `spriteRenderer.js`),
- читать `animations.json`/`frame-config.json` во время инициализации бойца,
- переключать кадры по state machine, не меняя `battle/*` и `systems/game.js`.

Таким образом логика боя и AI остаются прежними, меняется только rendering backend.

---

## Проверка проекта
```powershell
npm run smoke
npm test
```
(`npm test` = smoke-check)

---

## Структура проекта
```text
office-panda-clash/
  index.html
  scripts/
    dev-server.mjs
    build.mjs
    package-desktop.mjs
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

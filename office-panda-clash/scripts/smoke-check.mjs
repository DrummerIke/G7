import { access } from 'node:fs/promises';

const files = [
  'index.html',
  'src/main.js',
  'src/systems/game.js',
  'src/systems/aiController.js',
  'src/rendering/placeholderRenderer.js',
  'src/rendering/spritePipeline.js',
  'src/ui/hud.js',
  'src/battle/match.js',
  'src/battle/fighter.js',
  'src/data/fighters/registry.js',
  'src/data/stages/registry.js',
  'src/data/moves/registry.js',
  'src/assets/fighters/it/animations.json',
  'src/assets/fighters/it/frame-config.json',
  'src/assets/stages/temple-night/config.json',
  'scripts/dev-server.mjs',
  'scripts/build.mjs'
];

for (const file of files) {
  await access(new URL(`../${file}`, import.meta.url));
}

console.log('[smoke] Core source, UI/rendering pipeline, registries, assets and scripts are present.');

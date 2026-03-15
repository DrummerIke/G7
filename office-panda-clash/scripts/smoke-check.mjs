import { access } from 'node:fs/promises';

const files = [
  'index.html',
  'src/main.js',
  'src/systems/game.js',
  'src/battle/match.js',
  'src/data/fighters/registry.js',
  'src/data/stages/registry.js'
];

for (const file of files) {
  await access(new URL(`../${file}`, import.meta.url));
}

console.log('[smoke] Core files are present.');

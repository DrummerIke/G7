import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
await cp(path.join(root, 'README.md'), path.join(dist, 'README.md'));
await cp(path.join(root, 'TODO.roadmap.md'), path.join(dist, 'TODO.roadmap.md'));

const index = await readFile(path.join(root, 'index.html'), 'utf8');
const builtIndex = index.replace('./src/main.js', './src/main.js');
await writeFile(path.join(dist, 'index.html'), builtIndex, 'utf8');

console.log('[build] Build completed: dist/index.html');

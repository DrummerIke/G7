import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const outRoot = path.join(root, 'release');
const releaseDir = path.join(outRoot, `office-panda-clash-v${pkg.version}`);

await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });

await cp(path.join(root, 'desktop-build'), path.join(releaseDir, 'desktop-build'), { recursive: true });
await cp(path.join(root, 'dist'), path.join(releaseDir, 'dist'), { recursive: true });

const runGuide = `# Office Panda Clash release v${pkg.version}\n\n## Windows\n1) Open: desktop-build/run-desktop.bat\n2) Browser opens game automatically\n\n## Linux/macOS\n1) chmod +x desktop-build/run-desktop.sh\n2) ./desktop-build/run-desktop.sh\n\n## Web build\nUse files from dist/ with any static web server.\n`;
await writeFile(path.join(releaseDir, 'RUN.md'), runGuide, 'utf8');

console.log(`[release] prepared: ${releaseDir}`);

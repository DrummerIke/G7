import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'desktop-build');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(dist, path.join(out, 'app'), { recursive: true });

const runBat = `@echo off\r\nsetlocal\r\ncd /d %~dp0\r\nstart "" cmd /c "python -m http.server 4173 --directory app"\r\nstart "" http://127.0.0.1:4173\r\n`;
const runSh = `#!/usr/bin/env bash\nset -euo pipefail\ncd "$(dirname "$0")"\npython3 -m http.server 4173 --directory app >/tmp/opc-desktop.log 2>&1 &\nPID=$!\ntrap 'kill $PID' EXIT\nxdg-open "http://127.0.0.1:4173" >/dev/null 2>&1 || true\nwait $PID\n`;

await writeFile(path.join(out, 'run-desktop.bat'), runBat, 'utf8');
await writeFile(path.join(out, 'run-desktop.sh'), runSh, { mode: 0o755 });

console.log('[package] Desktop bundle ready: desktop-build/');
console.log('[package] Launch with run-desktop.bat (Windows) or run-desktop.sh (Linux/macOS).');

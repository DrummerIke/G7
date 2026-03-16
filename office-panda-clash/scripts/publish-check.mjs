import { execSync } from 'node:child_process';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

let remotes = '';
try {
  remotes = run('git remote -v');
} catch {
  console.log('[publish-check] This directory is not inside a git repo.');
  process.exit(1);
}

if (!remotes) {
  console.log('[publish-check] No git remote configured.');
  console.log('Add remote: git remote add origin <repo-url>');
  console.log('Push branch: git push -u origin <branch>');
  process.exit(0);
}

console.log('[publish-check] remotes found:\n' + remotes + '\n');

const branch = run('git rev-parse --abbrev-ref HEAD');
const status = run('git status --short');
if (status) {
  console.log('[publish-check] Working tree is not clean. Commit changes first.');
  console.log(status);
  process.exit(0);
}

console.log(`[publish-check] Branch: ${branch}`);
console.log('[publish-check] To publish files on GitHub run:');
console.log(`git push -u origin ${branch}`);

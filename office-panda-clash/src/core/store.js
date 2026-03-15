export const appState = {
  scene: 'mainMenu',
  p1: 'it',
  p2: 'boss',
  stage: 'temple-night',
  winner: null
};

const subscribers = new Set();

export function setState(patch) {
  Object.assign(appState, patch);
  subscribers.forEach((fn) => fn(appState));
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

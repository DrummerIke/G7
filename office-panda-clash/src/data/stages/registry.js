export const stageRegistry = [
  {
    id: 'temple-night',
    displayName: 'Temple Night',
    floorY: 530,
    palette: { bg: '#0d1028', fg: '#3a64f4', floor: '#1a223b' },
    ambientHooks: ['fogDrift', 'moonGlow'],
    configPath: 'src/assets/stages/temple-night/config.json'
  },
  {
    id: 'neon-office',
    displayName: 'Neon Office',
    floorY: 530,
    palette: { bg: '#0a1e24', fg: '#2ed9ff', floor: '#092733' },
    ambientHooks: ['ledPulse', 'screenRain'],
    configPath: 'src/assets/stages/neon-office/config.json'
  },
  {
    id: 'red-garden',
    displayName: 'Red Garden',
    floorY: 530,
    palette: { bg: '#26080c', fg: '#f4426b', floor: '#371018' },
    ambientHooks: ['petalFall', 'lanternSway'],
    configPath: 'src/assets/stages/red-garden/config.json'
  }
];

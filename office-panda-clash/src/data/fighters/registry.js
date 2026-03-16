export const fighterRegistry = [
  {
    id: 'it',
    displayName: 'Panda IT Specialist',
    borkalityTitle: 'STACK OVERBORK',
    stats: { maxHp: 1200, walkSpeed: 4.8, dashSpeed: 8.4, jumpForce: 12.4 },
    specialMove: { damage: 150, blockDamage: 25, hitstun: 30, blockstun: 18 },
    palette: { primary: '#4ab7ff', accent: '#7af1ff' },
    animationConfigPath: 'src/assets/fighters/it/animations.json',
    frameConfigPath: 'src/assets/fighters/it/frame-config.json'
  },
  {
    id: 'chef',
    displayName: 'Panda Chef',
    borkalityTitle: 'WOK OF DOOM',
    stats: { maxHp: 1250, walkSpeed: 4.4, dashSpeed: 7.8, jumpForce: 11.4 },
    specialMove: { damage: 170, blockDamage: 30, hitstun: 28, blockstun: 17, knockdown: true },
    palette: { primary: '#ff9e38', accent: '#ffdc84' },
    animationConfigPath: 'src/assets/fighters/chef/animations.json',
    frameConfigPath: 'src/assets/fighters/chef/frame-config.json'
  },
  {
    id: 'clerk',
    displayName: 'Panda Clerk',
    borkalityTitle: 'PAPER CUTTER',
    stats: { maxHp: 1100, walkSpeed: 5.2, dashSpeed: 8.9, jumpForce: 12.8 },
    specialMove: { damage: 140, blockDamage: 24, hitstun: 27, blockstun: 16 },
    palette: { primary: '#88ff9d', accent: '#d1ffb0' },
    animationConfigPath: 'src/assets/fighters/clerk/animations.json',
    frameConfigPath: 'src/assets/fighters/clerk/frame-config.json'
  },
  {
    id: 'secretary',
    displayName: 'Panda Secretary',
    borkalityTitle: 'SEAL OF SILENCE',
    stats: { maxHp: 1150, walkSpeed: 5, dashSpeed: 9, jumpForce: 13 },
    specialMove: { damage: 135, blockDamage: 20, hitstun: 24, blockstun: 19 },
    palette: { primary: '#db96ff', accent: '#f7c7ff' },
    animationConfigPath: 'src/assets/fighters/secretary/animations.json',
    frameConfigPath: 'src/assets/fighters/secretary/frame-config.json'
  },
  {
    id: 'boss',
    displayName: 'Panda Boss',
    borkalityTitle: 'MEETING TERMINATED',
    stats: { maxHp: 1450, walkSpeed: 4, dashSpeed: 7.1, jumpForce: 9.2 },
    specialMove: { damage: 195, blockDamage: 35, hitstun: 35, blockstun: 20, knockdown: true },
    palette: { primary: '#ffffff', accent: '#111111' },
    animationConfigPath: 'src/assets/fighters/boss/animations.json',
    frameConfigPath: 'src/assets/fighters/boss/frame-config.json'
  }
];

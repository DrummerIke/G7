const transitions = {
  idle: ['walk', 'crouch', 'jump', 'blockHigh', 'blockLow', 'dash', 'dodge', 'attack', 'hitstun', 'knockdown', 'victory', 'defeat'],
  walk: ['idle', 'crouch', 'jump', 'attack', 'dash', 'blockHigh'],
  crouch: ['idle', 'blockLow', 'attack'],
  jump: ['idle', 'attack', 'hitstun'],
  blockHigh: ['idle', 'walk', 'hitstun'],
  blockLow: ['crouch', 'hitstun'],
  dash: ['idle', 'attack'],
  dodge: ['idle'],
  attack: ['idle', 'hitstun'],
  hitstun: ['idle', 'knockdown'],
  knockdown: ['getup'],
  getup: ['idle'],
  victory: ['idle'],
  defeat: ['idle']
};

export class FighterStateMachine {
  constructor() { this.state = 'idle'; }
  set(next) { if (transitions[this.state]?.includes(next)) this.state = next; }
}

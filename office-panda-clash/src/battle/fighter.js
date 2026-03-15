import { FighterStateMachine } from '../animation/stateMachine.js';

export class Fighter {
  constructor(config, spawnX, facing) {
    this.config = config;
    this.x = spawnX;
    this.y = 530;
    this.vy = 0;
    this.facing = facing;
    this.hp = config.stats.maxHp;
    this.stun = 0;
    this.knockedDown = false;
    this.state = new FighterStateMachine();
  }

  tick() {
    if (this.stun > 0) this.stun -= 1;
    if (this.y < 530 || this.vy < 0) {
      this.vy += 0.8;
      this.y += this.vy;
      if (this.y >= 530) {
        this.y = 530;
        this.vy = 0;
        if (this.state.state === 'jump') this.state.set('idle');
      }
    }
    if (this.knockedDown && this.stun <= 0) {
      this.knockedDown = false;
      this.state.set('getup');
      this.state.set('idle');
    }
  }

  applyMove(target, move, isBlocked) {
    if (isBlocked) {
      target.hp = Math.max(0, target.hp - move.blockDamage);
      target.stun = move.blockstun;
      target.state.set(target.state.state === 'crouch' ? 'blockLow' : 'blockHigh');
      return;
    }

    target.hp = Math.max(0, target.hp - move.damage);
    target.stun = move.hitstun;
    if (move.knockdown) {
      target.knockedDown = true;
      target.state.set('knockdown');
    } else {
      target.state.set('hitstun');
    }
  }
}

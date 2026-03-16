const ATTACKS = ['jab', 'kick', 'uppercut', 'sweep', 'throw', 'special'];

export class AIController {
  constructor() {
    this.cooldown = 0;
    this.tempo = 45;
    this.blockFrames = 0;
    this.jumpFrames = 0;
    this.mode = 'neutral';
  }

  update(match) {
    const ai = match.p2;
    const enemy = match.p1;
    const distance = Math.abs(ai.x - enemy.x);

    ai.facing = ai.x > enemy.x ? -1 : 1;
    this.cooldown -= 1;
    this.blockFrames = Math.max(0, this.blockFrames - 1);
    this.jumpFrames = Math.max(0, this.jumpFrames - 1);

    if (enemy.state.state === 'attack' && distance < 180 && Math.random() < 0.13) {
      this.blockFrames = 14;
    }

    if (this.blockFrames > 0) {
      ai.state.set(distance < 140 ? 'blockLow' : 'blockHigh');
      return;
    }

    if (distance > 175) {
      this.mode = 'approach';
      ai.x -= ai.config.stats.walkSpeed * 0.9;
      ai.state.set('walk');
      if (Math.random() < 0.03) ai.x -= ai.config.stats.dashSpeed * 0.6;
      if (Math.random() < 0.02 && ai.y >= 530 && this.jumpFrames === 0) {
        ai.vy = -ai.config.stats.jumpForce * 0.82;
        ai.state.set('jump');
        this.jumpFrames = 30;
      }
      return;
    }

    this.mode = 'pressure';
    if (this.cooldown <= 0) {
      const pick = ATTACKS[Math.floor(Math.random() * ATTACKS.length)];
      const blocked = enemy.state.state === 'blockHigh' || enemy.state.state === 'blockLow';
      match.triggerMove(2, pick, blocked && Math.random() < 0.7);
      this.cooldown = this.tempo + Math.floor(Math.random() * 25);

      if (Math.random() < 0.25) {
        ai.x += ai.config.stats.dashSpeed * 0.4;
        ai.state.set('dash');
      }
    } else {
      if (Math.random() < 0.5) ai.x += ai.config.stats.walkSpeed * 0.25;
      else ai.x -= ai.config.stats.walkSpeed * 0.2;
      ai.state.set('walk');
    }

    if (Math.random() < 0.015 && ai.y >= 530 && this.jumpFrames === 0) {
      ai.vy = -ai.config.stats.jumpForce * 0.78;
      ai.state.set('jump');
      this.jumpFrames = 28;
    }
  }
}

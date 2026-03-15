import { moveRegistry } from '../data/moves/registry.js';
import { fighterRegistry } from '../data/fighters/registry.js';
import { EventBus, GameEvents } from '../core/events.js';
import { Fighter } from './fighter.js';

export class MatchController {
  constructor(p1Id, p2Id) {
    const p1 = fighterRegistry.find((f) => f.id === p1Id);
    const p2 = fighterRegistry.find((f) => f.id === p2Id);
    this.events = new EventBus();
    this.p1 = new Fighter(p1, 380, 1);
    this.p2 = new Fighter(p2, 900, -1);
    this.rounds = { p1: 0, p2: 0 };
    this.round = 1;
    this.timer = 99;
    this.finished = false;
    this.finishWindow = false;
    this.borkalityWindow = 0;
  }

  startRound() {
    this.timer = 99;
    this.events.emit(GameEvents.ROUND_STARTED, { round: this.round });
  }

  update() {
    if (this.finished) return;

    this.p1.tick();
    this.p2.tick();
    this.timer = Math.max(0, this.timer - 1 / 60);

    if (!this.finishWindow && (this.p1.hp < 160 || this.p2.hp < 160)) {
      this.finishWindow = true;
      this.borkalityWindow = 5;
      this.events.emit(GameEvents.FINISH_HIM);
      this.events.emit(GameEvents.BORKALITY_AVAILABLE);
    }

    if (this.timer <= 0 || this.p1.hp <= 0 || this.p2.hp <= 0) this.endRound();
  }

  triggerMove(attacker, moveKey, blocked = false) {
    const actor = attacker === 1 ? this.p1 : this.p2;
    const target = attacker === 1 ? this.p2 : this.p1;
    const move = moveKey === 'special' ? actor.config.specialMove : moveRegistry[moveKey];

    actor.state.set('attack');
    actor.applyMove(target, move, blocked);

    this.events.emit(blocked ? GameEvents.BLOCKED : GameEvents.HIT_CONFIRMED, { attacker, move: moveKey, blocked });
    if (move.knockdown && !blocked) this.events.emit(GameEvents.KNOCKDOWN, { target: attacker === 1 ? 2 : 1 });
  }

  endRound() {
    const p1Wins = this.p1.hp >= this.p2.hp;
    if (p1Wins) this.rounds.p1 += 1;
    else this.rounds.p2 += 1;
    this.round += 1;

    if (this.rounds.p1 >= 2 || this.rounds.p2 >= 2) {
      this.finished = true;
      this.events.emit(GameEvents.MATCH_FINISHED, { winner: p1Wins ? this.p1.config.id : this.p2.config.id });
    } else {
      this.p1.hp = this.p1.config.stats.maxHp;
      this.p2.hp = this.p2.config.stats.maxHp;
      this.startRound();
    }
  }
}

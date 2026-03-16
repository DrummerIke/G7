import { MatchController } from '../battle/match.js';
import { GameEvents } from '../core/events.js';
import { appState, setState } from '../core/store.js';
import { stageRegistry } from '../data/stages/registry.js';
import { InputBuffer } from '../input/controls.js';
import { PlaceholderRenderer } from '../rendering/placeholderRenderer.js';
import { SceneController } from '../scenes/sceneController.js';
import { AIController } from './aiController.js';

export class Game {
  constructor(root) {
    this.renderer = new PlaceholderRenderer(root);
    this.input = new InputBuffer();
    this.scenes = new SceneController(this.renderer);
    this.ai = new AIController();
    this.match = null;
    this.overlay = undefined;
    this.overlayTimeout = 0;

    this.bindMenuInput();
    this.scenes.render('mainMenu');
    requestAnimationFrame(() => this.tick());
  }

  bindMenuInput() {
    window.addEventListener('keydown', (e) => {
      const scene = appState.scene;
      if (e.code === 'Enter') {
        if (scene === 'mainMenu') setState({ scene: 'fighterSelect' });
        else if (scene === 'fighterSelect') setState({ scene: 'stageSelect' });
        else if (scene === 'stageSelect') setState({ scene: 'versus' });
        else if (scene === 'versus') { setState({ scene: 'battle' }); this.createMatch(false); }
        else if (scene === 'result') setState({ scene: 'mainMenu', winner: null });
      }

      if (e.code === 'KeyT' && scene === 'mainMenu') { setState({ scene: 'training' }); this.createMatch(true); }
      if (e.code === 'Escape' && scene === 'training') setState({ scene: 'mainMenu' });

      if (scene === 'fighterSelect' && /^Digit[1-5]$/.test(e.code)) {
        const pick = ['it', 'chef', 'clerk', 'secretary', 'boss'][Number(e.code.slice(-1)) - 1];
        if (e.shiftKey) setState({ p2: pick }); else setState({ p1: pick });
        this.scenes.render('fighterSelect');
      }

      if (scene === 'stageSelect') {
        if (e.code === 'KeyZ') setState({ stage: 'temple-night' });
        if (e.code === 'KeyX') setState({ stage: 'neon-office' });
        if (e.code === 'KeyC') setState({ stage: 'red-garden' });
        this.scenes.render('stageSelect');
      }
    });
  }

  createMatch(training) {
    this.match = new MatchController(appState.p1, appState.p2);
    this.overlay = training ? 'TRAINING' : 'ROUND 1';
    this.overlayTimeout = 100;
    this.match.startRound();

    this.match.events.on(GameEvents.FINISH_HIM, () => this.showOverlay('FINISH HIM'));
    this.match.events.on(GameEvents.BORKALITY_AVAILABLE, () => this.showOverlay('BORKALITY READY'));
    this.match.events.on(GameEvents.MATCH_FINISHED, ({ winner }) => {
      setState({ winner, scene: 'result' });
      this.showOverlay(`WINNER: ${String(winner).toUpperCase()}`);
    });
    this.match.events.on(GameEvents.HIT_CONFIRMED, ({ attacker }) => {
      const target = attacker === 1 ? this.match.p2 : this.match.p1;
      this.renderer.triggerHitSpark(target.x, target.y - 130, '#ffe082');
    });
    this.match.events.on(GameEvents.BLOCKED, ({ attacker }) => {
      const target = attacker === 1 ? this.match.p2 : this.match.p1;
      this.renderer.triggerHitSpark(target.x, target.y - 140, '#7fd6ff');
    });
  }

  showOverlay(text) { this.overlay = text; this.overlayTimeout = 120; }

  tick() {
    this.renderer.update();
    if (this.match && (appState.scene === 'battle' || appState.scene === 'training')) {
      this.applyControlInput();
      this.ai.update(this.match);
      this.match.update();

      const stage = stageRegistry.find((s) => s.id === appState.stage);
      this.renderer.drawStage(stage);
      this.renderer.drawFighter(this.match.p1);
      this.renderer.drawFighter(this.match.p2);

      if (this.overlayTimeout > 0) this.overlayTimeout -= 1;
      else this.overlay = undefined;

      this.renderer.drawHud(this.match.timer, this.match.p1.hp, this.match.p2.hp, this.match.rounds, this.overlay);
    }
    requestAnimationFrame(() => this.tick());
  }

  applyControlInput() {
    const p1 = this.match.p1;
    const p2 = this.match.p2;
    p1.facing = p1.x < p2.x ? 1 : -1;

    if (this.input.is('moveLeft')) { p1.x -= p1.config.stats.walkSpeed; p1.state.set('walk'); }
    if (this.input.is('moveRight')) { p1.x += p1.config.stats.walkSpeed; p1.state.set('walk'); }
    if (this.input.is('crouch')) p1.state.set('crouch');
    if (this.input.is('jump') && p1.y >= 530) { p1.vy = -p1.config.stats.jumpForce; p1.state.set('jump'); }
    if (this.input.is('block')) p1.state.set('blockHigh');
    if (this.input.is('dash')) p1.x += p1.config.stats.dashSpeed;
    if (this.input.is('dodge')) p1.x -= p1.config.stats.dashSpeed * 0.7;

    const p2Blocking = p2.state.state === 'blockHigh' || p2.state.state === 'blockLow';
    if (this.input.is('jab')) this.match.triggerMove(1, 'jab', p2Blocking);
    if (this.input.is('kick')) this.match.triggerMove(1, 'kick', p2Blocking);
    if (this.input.is('uppercut')) this.match.triggerMove(1, 'uppercut', p2Blocking);
    if (this.input.is('sweep')) this.match.triggerMove(1, 'sweep', p2Blocking);
    if (this.input.is('throw')) this.match.triggerMove(1, 'throw', p2Blocking);
    if (this.input.is('special')) this.match.triggerMove(1, 'special', p2Blocking);

    if (this.input.is('b1') && this.input.is('b2') && this.input.is('b3') && this.input.is('b4') && this.match.finishWindow) {
      this.showOverlay(p1.config.borkalityTitle);
      this.match.p2.hp = 0;
    }

    if (p1.state.state === 'walk' && !this.input.is('moveLeft') && !this.input.is('moveRight')) p1.state.set('idle');
    p1.x = clamp(p1.x, 80, 1200);
    p2.x = clamp(p2.x, 80, 1200);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

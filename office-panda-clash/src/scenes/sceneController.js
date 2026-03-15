import { appState, subscribe } from '../core/store.js';
import { fighterRegistry } from '../data/fighters/registry.js';
import { stageRegistry } from '../data/stages/registry.js';

const sceneText = {
  mainMenu: 'MAIN MENU\nEnter - Start\nT - Training',
  fighterSelect: 'FIGHTER SELECT\n1-5 choose P1, Shift+1-5 choose P2\nEnter - Stage Select',
  stageSelect: 'STAGE SELECT\nZ/X/C choose stage\nEnter - Versus',
  versus: 'VERSUS SCREEN\nEnter - Battle',
  result: 'RESULT SCREEN\nEnter - Main Menu',
  training: 'TRAINING MODE\nEsc - Main Menu'
};

export class SceneController {
  constructor(renderer) {
    this.renderer = renderer;
    subscribe((state) => this.render(state.scene));
  }

  render(scene) {
    if (scene === 'battle') return;
    const p1 = fighterRegistry.find((f) => f.id === appState.p1)?.displayName;
    const p2 = fighterRegistry.find((f) => f.id === appState.p2)?.displayName;
    const stage = stageRegistry.find((s) => s.id === appState.stage)?.displayName;
    this.renderer.drawSceneCard(sceneText[scene], [`P1 ${p1}`, `P2 ${p2}`, `Stage ${stage}`]);
  }
}

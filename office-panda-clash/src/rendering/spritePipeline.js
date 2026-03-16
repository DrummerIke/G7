export class SpritePipeline {
  constructor() {
    this.fighterConfigs = new Map();
    this.stageConfigs = new Map();
  }

  async preloadFighter(fighterId, animationConfigPath, frameConfigPath) {
    const [anim, frame] = await Promise.all([
      fetch(`./${animationConfigPath}`).then((r) => r.json()),
      fetch(`./${frameConfigPath}`).then((r) => r.json())
    ]);
    this.validateFighterConfig(fighterId, anim, frame);
    this.fighterConfigs.set(fighterId, { anim, frame });
  }

  async preloadStage(stageId, stageConfigPath) {
    const config = await fetch(`./${stageConfigPath}`).then((r) => r.json());
    this.stageConfigs.set(stageId, config);
  }

  validateFighterConfig(fighterId, anim, frame) {
    const requiredStates = ['idle', 'walk', 'crouch', 'jump', 'hitstun', 'knockdown', 'getup'];
    const hasStates = requiredStates.every((key) => Boolean(anim.states?.[key]));
    if (anim.fighter !== fighterId || !anim.atlas || !frame.frameSize || !frame.pivot || !hasStates) {
      throw new Error(`Invalid animation/frame config for fighter ${fighterId}`);
    }
  }
}

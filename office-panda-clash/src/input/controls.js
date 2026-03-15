export const defaultControls = {
  moveLeft: 'KeyA', moveRight: 'KeyD', jump: 'KeyW', crouch: 'KeyS', block: 'ShiftLeft',
  jab: 'KeyJ', kick: 'KeyK', uppercut: 'KeyI', sweep: 'KeyU', throw: 'KeyP',
  dash: 'KeyH', dodge: 'KeyO', special: 'KeyL', b1: 'KeyB', b2: 'KeyO', b3: 'KeyR', b4: 'KeyK'
};

export class InputBuffer {
  constructor(controls = defaultControls) {
    this.controls = controls;
    this.pressed = new Set();
    window.addEventListener('keydown', (e) => this.pressed.add(e.code));
    window.addEventListener('keyup', (e) => this.pressed.delete(e.code));
  }

  is(action) {
    return this.pressed.has(this.controls[action]);
  }
}

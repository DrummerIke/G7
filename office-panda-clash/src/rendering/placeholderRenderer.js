import { HudRenderer } from '../ui/hud.js';

export class PlaceholderRenderer {
  constructor(root) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1280;
    this.canvas.height = 720;
    root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.hud = new HudRenderer();
    this.time = 0;
    this.cameraShake = 0;
    this.sparks = [];
  }

  update() {
    this.time += 1;
    this.cameraShake *= 0.88;
    this.sparks = this.sparks.filter((spark) => spark.life > 0);
    this.sparks.forEach((spark) => {
      spark.life -= 1;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.12;
      spark.size *= 0.98;
    });
  }

  triggerHitSpark(x, y, color = '#ffe082') {
    this.cameraShake = Math.min(16, this.cameraShake + 5);
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 6;
      this.sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1, life: 16 + Math.floor(Math.random() * 8), size: 2 + Math.random() * 4, color });
    }
  }

  drawStage(stage) {
    const { ctx } = this;
    const shakeX = (Math.random() - 0.5) * this.cameraShake;
    const shakeY = (Math.random() - 0.5) * this.cameraShake;

    ctx.save();
    ctx.translate(shakeX, shakeY);

    const sky = ctx.createLinearGradient(0, 0, 0, 720);
    sky.addColorStop(0, stage.palette.bg);
    sky.addColorStop(1, '#05070b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1280, 720);

    this.drawParallax(stage);
    this.drawFloor(stage);
    this.drawAmbientParticles(stage);

    ctx.restore();
  }

  drawParallax(stage) {
    const { ctx } = this;
    const shift = Math.sin(this.time * 0.004) * 10;

    ctx.fillStyle = addAlpha(stage.palette.fg, 0.12);
    for (let i = 0; i < 5; i += 1) {
      const h = 90 + i * 16;
      const y = 360 - i * 28;
      ctx.fillRect(120 * i + shift * (i + 1) * 0.2, y, 180, h);
    }

    ctx.fillStyle = addAlpha(stage.palette.fg, 0.22);
    for (let i = 0; i < 8; i += 1) {
      const y = 460 + Math.sin((this.time + i * 35) * 0.02) * 3;
      ctx.fillRect(i * 170 + shift * 0.7, y, 120, 20);
    }
  }

  drawFloor(stage) {
    const { ctx } = this;
    const floorGrad = ctx.createLinearGradient(0, stage.floorY, 0, 720);
    floorGrad.addColorStop(0, addAlpha(stage.palette.floor, 0.8));
    floorGrad.addColorStop(1, '#07090f');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, stage.floorY, 1280, 190);

    ctx.strokeStyle = addAlpha(stage.palette.fg, 0.2);
    for (let x = -40; x < 1320; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, stage.floorY);
      ctx.lineTo(x + 30, 720);
      ctx.stroke();
    }
  }

  drawAmbientParticles(stage) {
    const { ctx } = this;
    ctx.fillStyle = addAlpha(stage.palette.fg, 0.3);
    for (let i = 0; i < 30; i += 1) {
      const px = (i * 87 + this.time * (0.2 + (i % 3) * 0.12)) % 1280;
      const py = (i * 39 + Math.sin((this.time + i * 20) * 0.01) * 20 + 260) % 520;
      const radius = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    this.sparks.forEach((spark) => {
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawFighter(fighter) {
    const { ctx } = this;
    const crouchOffset = fighter.state.state === 'crouch' || fighter.state.state === 'blockLow' ? 28 : 0;
    const attackLean = fighter.state.state === 'attack' ? 12 : 0;
    const armSwing = fighter.state.state === 'attack' ? 18 : 0;

    ctx.save();
    ctx.translate(fighter.x, fighter.y + crouchOffset);
    ctx.scale(fighter.facing, 1);

    ctx.fillStyle = addAlpha('#000000', 0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyGradient = ctx.createLinearGradient(0, -190, 0, 0);
    bodyGradient.addColorStop(0, fighter.config.palette.accent);
    bodyGradient.addColorStop(1, fighter.config.palette.primary);
    ctx.fillStyle = bodyGradient;
    roundRect(ctx, -50 + attackLean, -158, 100, 148, 28);
    ctx.fill();

    ctx.fillStyle = '#f8f8f8';
    roundRect(ctx, -30 + attackLean, -142, 60, 62, 18);
    ctx.fill();

    // panda head + ears
    ctx.fillStyle = fighter.config.palette.accent;
    ctx.beginPath();
    ctx.arc(0 + attackLean * 0.4, -175, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-24 + attackLean * 0.4, -204, 15, 0, Math.PI * 2);
    ctx.arc(24 + attackLean * 0.4, -204, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(-10 + attackLean * 0.3, -178, 5, 0, Math.PI * 2);
    ctx.arc(10 + attackLean * 0.3, -178, 5, 0, Math.PI * 2);
    ctx.fill();

    // paws/arms
    ctx.fillStyle = fighter.config.palette.primary;
    roundRect(ctx, -74 + attackLean, -132, 26, 68, 14);
    roundRect(ctx, 48 + attackLean, -132, 26, 68, 14);
    ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(60 + attackLean + armSwing, -64, 14, 0, Math.PI * 2);
    ctx.arc(-60 + attackLean, -64, 14, 0, Math.PI * 2);
    ctx.fill();

    // panda legs
    ctx.fillStyle = '#141414';
    roundRect(ctx, -40, -22, 28, 42, 12);
    roundRect(ctx, 12, -22, 28, 42, 12);
    ctx.fill();

    if (fighter.state.state === 'attack') {
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(52, -118, 28, -0.9, 1.0);
      ctx.stroke();
    }

    if (fighter.state.state === 'victory') {
      ctx.fillStyle = '#7bffba';
      ctx.fillRect(-55, -220, 110, 8);
    }
    if (fighter.state.state === 'defeat') {
      ctx.fillStyle = '#ff5a82';
      ctx.fillRect(-55, -220, 110, 8);
    }

    if (fighter.stun > 0) {
      ctx.fillStyle = addAlpha('#ff335e', 0.65);
      ctx.fillRect(-52, -205, 104, 10);
    }

    ctx.restore();
  }

  drawHud(timer, hp1, hp2, rounds, overlay) {
    this.hud.draw(this.ctx, timer, hp1, hp2, rounds, overlay);
  }

  drawSceneCard(title, lines) {
    const { ctx } = this;
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, '#070c17');
    gradient.addColorStop(1, '#090b11');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = addAlpha('#7da8ff', 0.2);
    roundRect(ctx, 210, 110, 860, 510, 18);
    ctx.fill();

    ctx.fillStyle = '#f4f7ff';
    ctx.font = '700 38px Segoe UI';
    const split = title.split('\n');
    split.forEach((line, idx) => ctx.fillText(line, 260, 190 + idx * 46));

    ctx.fillStyle = '#aec2ff';
    ctx.font = '24px Segoe UI';
    lines.forEach((line, idx) => ctx.fillText(line, 260, 440 + idx * 36));
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function addAlpha(hexColor, alpha) {
  if (!hexColor.startsWith('#')) return hexColor;
  const value = hexColor.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

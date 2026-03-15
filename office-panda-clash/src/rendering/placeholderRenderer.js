export class PlaceholderRenderer {
  constructor(root) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1280;
    this.canvas.height = 720;
    root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  drawStage(stage) {
    const { ctx } = this;
    ctx.fillStyle = stage.palette.bg;
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = stage.palette.fg;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(0, 360, 1280, 140);
    ctx.globalAlpha = 1;
    ctx.fillStyle = stage.palette.floor;
    ctx.fillRect(0, stage.floorY, 1280, 190);
  }

  drawFighter(fighter) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(fighter.x, fighter.y);
    ctx.scale(fighter.facing, 1);

    ctx.fillStyle = fighter.config.palette.primary;
    roundRect(ctx, -45, -160, 90, 160, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, -33, -145, 66, 66, 18);
    ctx.fill();

    ctx.fillStyle = fighter.config.palette.accent;
    ctx.beginPath();
    ctx.arc(0, -175, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(0, -175, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHud(timer, hp1, hp2, rounds, overlay) {
    const { ctx } = this;
    ctx.fillStyle = '#111111';
    ctx.fillRect(40, 30, 500, 26);
    ctx.fillRect(740, 30, 500, 26);

    ctx.fillStyle = '#4dffb0';
    ctx.fillRect(42, 32, Math.max(0, (hp1 / 1500) * 496), 22);

    const hp2Width = Math.max(0, (hp2 / 1500) * 496);
    ctx.fillStyle = '#ff5a91';
    ctx.fillRect(742 + (496 - hp2Width), 32, hp2Width, 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px Segoe UI';
    ctx.fillText(`${Math.ceil(timer)}`, 615, 50);
    ctx.font = '18px Segoe UI';
    ctx.fillStyle = '#cfd8ff';
    ctx.fillText(`R:${rounds.p1}-${rounds.p2}`, 610, 80);

    if (overlay) {
      ctx.fillStyle = '#ffd166';
      ctx.font = '800 56px Segoe UI';
      ctx.fillText(overlay, 340, 270);
    }
  }

  drawSceneCard(title, lines) {
    const { ctx } = this;
    ctx.fillStyle = '#060b15';
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = '#f4f7ff';
    ctx.font = '700 38px Segoe UI';

    const split = title.split('\n');
    split.forEach((line, idx) => ctx.fillText(line, 300, 180 + idx * 44));

    ctx.fillStyle = '#aec2ff';
    ctx.font = '24px Segoe UI';
    lines.forEach((line, idx) => ctx.fillText(line, 300, 420 + idx * 32));
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

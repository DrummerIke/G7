export class HudRenderer {
  draw(ctx, timer, hp1, hp2, rounds, overlay) {
    ctx.fillStyle = rgba('#05070d', 0.75);
    roundedRect(ctx, 28, 20, 1225, 72, 14);
    ctx.fill();

    ctx.fillStyle = '#15181f';
    ctx.fillRect(40, 30, 500, 26);
    ctx.fillRect(740, 30, 500, 26);

    const hp1Grad = ctx.createLinearGradient(42, 0, 540, 0);
    hp1Grad.addColorStop(0, '#3bdba2');
    hp1Grad.addColorStop(1, '#77ffd0');
    ctx.fillStyle = hp1Grad;
    ctx.fillRect(42, 32, Math.max(0, (hp1 / 1500) * 496), 22);

    const hp2Width = Math.max(0, (hp2 / 1500) * 496);
    const hp2Grad = ctx.createLinearGradient(742, 0, 1240, 0);
    hp2Grad.addColorStop(0, '#ff8ab5');
    hp2Grad.addColorStop(1, '#ff4c82');
    ctx.fillStyle = hp2Grad;
    ctx.fillRect(742 + (496 - hp2Width), 32, hp2Width, 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 34px Segoe UI';
    ctx.fillText(`${Math.ceil(timer)}`, 615, 50);
    ctx.font = '18px Segoe UI';
    ctx.fillStyle = '#cfd8ff';
    ctx.fillText(`R:${rounds.p1}-${rounds.p2}`, 610, 80);

    if (overlay) {
      ctx.fillStyle = rgba('#ffd166', 0.15);
      roundedRect(ctx, 316, 190, 650, 112, 18);
      ctx.fill();
      ctx.fillStyle = '#ffd166';
      ctx.font = '800 56px Segoe UI';
      ctx.fillText(overlay, 340, 266);
    }
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function rgba(hexColor, alpha) {
  const value = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Draws text onto a <canvas> so it can't be selected or copied.
// Used for the employee ID on the Orientation screen and in the Handbook.
// Part of VIOLATION #2: forces users to memorize (or hand-copy) the ID.

function drawUncopyableText(canvas, text, options = {}) {
  const font = options.font || '700 17px "Segoe UI", system-ui, sans-serif';
  const color = options.color || "#3a2a00";
  const height = options.height || 26;
  const ratio = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");

  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width) + 4;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.scale(ratio, ratio);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 2, height / 2);
}

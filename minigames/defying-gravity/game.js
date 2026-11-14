"use strict";
(() => {
  const canvas = document.querySelector("#screen");
  const ctx = canvas.getContext("2d", { alpha: false });
  const overlay = document.querySelector("#overlay");
  const title = document.querySelector("#title");
  const message = document.querySelector("#message");
  const startButton = document.querySelector("#start");
  const scoreLabel = document.querySelector("#score-label");
  const W = canvas.width, H = canvas.height;
  const stars = Array.from({ length: 42 }, (_, i) => ({
    x: (i * 73 + 19) % W, y: (i * 47 + 11) % H,
    size: i % 7 === 0 ? 2 : 1, shade: i % 3 === 0 ? "#56d9e8" : "#8acceB"
  }));
  let state = "ready", astronautY = 84, velocity = 0, score = 0;
  let frame = 0, obstacles = [], lastTime = 0, animationId = 0, reported = false;

  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function drawAstronaut(x, y) {
    // Original block-built crew sprite: suit, reflective visor, pack, and tiny boots.
    rect(x - 9, y + 7, 5, 12, "#9b704c");
    rect(x - 8, y + 8, 3, 9, "#d6b77a");
    rect(x + 10, y + 8, 4, 10, "#9b704c");
    rect(x - 6, y + 8, 15, 15, "#f1e6cb");
    rect(x - 3, y + 11, 9, 8, "#56d9e8");
    rect(x - 1, y + 12, 6, 3, "#8acceB");
    rect(x - 5, y + 21, 5, 5, "#244d70");
    rect(x + 4, y + 21, 5, 5, "#244d70");
    rect(x - 5, y + 2, 13, 11, "#f1e6cb");
    rect(x - 3, y + 4, 9, 7, "#244d70");
    rect(x - 2, y + 5, 6, 4, "#56d9e8");
    rect(x + 1, y + 6, 3, 2, "#f1e6cb");
    rect(x - 1, y + 16, 4, 4, "#d6b77a");
    if (state === "playing" && frame % 12 < 6) {
      rect(x - 13, y + 12, 4, 3, "#d6b77a");
      rect(x - 17, y + 13, 4, 2, "#f1e6cb");
    }
  }
  function drawAsteroid(obstacle) {
    const x = Math.round(obstacle.x), gap = obstacle.gap, size = 5;
    for (let y = -size; y < obstacle.top; y += size) {
      const edge = (Math.floor((y + obstacle.seed) / size) % 3 === 0) ? 2 : 0;
      rect(x + edge, y, 22 - edge, size - 1, y % 2 ? "#9b704c" : "#b58a5d");
      rect(x + edge + 4, y + 1, 4, 2, "#d6b77a");
    }
    const bottom = obstacle.top + gap;
    for (let y = bottom; y < H + size; y += size) {
      const edge = (Math.floor((y + obstacle.seed) / size) % 3 === 0) ? 2 : 0;
      rect(x + edge, y, 22 - edge, size - 1, y % 2 ? "#9b704c" : "#b58a5d");
      rect(x + edge + 4, y + 1, 4, 2, "#d6b77a");
    }
  }
  function paint() {
    rect(0, 0, W, H, "#101a2c");
    // Pixel starfield, a distant striped planet, and a quiet station silhouette.
    stars.forEach((star, i) => rect((star.x - frame * (i % 3 + 1) / 5 + W) % W, star.y, star.size, star.size, star.shade));
    rect(246, 30, 2, 22, "#244d70"); rect(236, 37, 22, 8, "#426b78");
    rect(240, 33, 14, 14, "#8acceB"); rect(242, 35, 10, 4, "#56d9e8");
    rect(0, 160, W, 20, "#172b45"); rect(0, 160, W, 2, "#426b78");
    for (let x = 0; x < W; x += 16) rect((x - frame % 16 + W) % W, 170, 5, 2, "#244d70");
    obstacles.forEach(drawAsteroid);
    drawAstronaut(62, astronautY);
    rect(11, 9, 76, 17, "#172b45"); rect(13, 11, 72, 2, "#426b78");
    ctx.fillStyle = "#f1e6cb"; ctx.font = "bold 8px monospace"; ctx.fillText(`FLIGHT SCORE ${String(score).padStart(3, "0")}`, 16, 21);
    scoreLabel.textContent = `SCORE · ${String(score).padStart(3, "0")}`;
  }
  function reset() {
    state = "playing"; astronautY = 84; velocity = 0; score = 0; frame = 0;
    obstacles = []; reported = false; lastTime = 0;
    overlay.hidden = true;
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }
  function boost() {
    if (state === "ready") { reset(); velocity = -2.8; return; }
    if (state === "playing") velocity = -2.8;
  }
  function endGame() {
    if (state !== "playing") return;
    state = "over";
    title.innerHTML = "MISSION<br>DEBRIEF";
    message.innerHTML = `FLIGHT SCORE: ${score}<br>${score ? "Nice flying, astronaut!" : "Try again and find your rhythm."}`;
    startButton.textContent = "FLY AGAIN";
    overlay.hidden = false;
    if (!reported) {
      reported = true;
      // The parent campaign validates origin and converts the arcade score to its 0–100 record.
      window.parent.postMessage({ type: "defying-gravity-result", score }, window.location.origin);
    }
  }
  function update() {
    frame++;
    velocity = Math.min(3.1, velocity + .105);
    astronautY += velocity;
    if (frame % 82 === 1) {
      const gap = 62;
      const top = 27 + Math.random() * 65;
      obstacles.push({ x: W + 2, top, gap, seed: frame });
    }
    obstacles.forEach(obstacle => { obstacle.x -= 1.25; });
    obstacles = obstacles.filter(obstacle => obstacle.x > -24);
    obstacles.forEach(obstacle => {
      if (!obstacle.passed && obstacle.x + 22 < 62) { obstacle.passed = true; score++; }
      const overlapsX = 62 + 12 > obstacle.x && 62 - 8 < obstacle.x + 22;
      if (overlapsX && (astronautY + 25 > obstacle.top + obstacle.gap || astronautY + 3 < obstacle.top)) endGame();
    });
    if (astronautY < 0 || astronautY + 27 > 160) endGame();
  }
  function loop(now) {
    if (state !== "playing") { paint(); return; }
    if (!lastTime || now - lastTime >= 1000 / 30) {
      lastTime = now;
      update();
      paint();
    }
    if (state === "playing") animationId = requestAnimationFrame(loop);
  }
  startButton.addEventListener("click", () => { reset(); });
  canvas.addEventListener("pointerdown", event => { event.preventDefault(); boost(); });
  window.addEventListener("keydown", event => {
    if (["Space", "ArrowUp", "Enter"].includes(event.code)) { event.preventDefault(); boost(); }
  });
  paint();
})();

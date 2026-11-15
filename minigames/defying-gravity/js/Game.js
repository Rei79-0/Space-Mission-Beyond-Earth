/** Ties everything together: state, game loop, update and draw. */
class Game {
  constructor(canvas) {
    canvas.width = CONFIG.WIDTH;
    canvas.height = CONFIG.HEIGHT;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Sprites
    this.background = BackgroundSprite.create(CONFIG.WIDTH, CONFIG.HEIGHT);
    this.asteroidSprites = AsteroidSprite.createSet();

    // Objects
    this.astronaut = new Astronaut(AstronautSprite.create());
    this.columns = [];
    this.steam = new SteamSystem();
    this.ui = new UI();

    // State
    this.state = GameState.READY;
    this.paused = false;
    this.score = 0;
    this.coins = [];
    this.coinsCollected = 0;
    this.best = this.loadBest();
    this.deadAt = 0;
    this.stageStartedAt = 0;
    this.elapsedSeconds = 0;
    this.stageHistorySaved = false;
    this.returnTimer = null;
    this.bgOffset = 0;
    this.columnsSpawned = 0;
    this.lastTime = performance.now();

    this.input = new InputHandler(canvas, {
      onJump: () => this.jump(),
      onTogglePause: () => this.togglePause(),
      onPointer: (x, y) => this.handlePointer(x, y),
      onHidden: () => this.pauseIfPlaying()
    });

    this.loop = this.loop.bind(this);
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  // ---------- input actions ----------

  jump() {
    if (this.paused) { this.paused = false; return; }

    if (this.state === GameState.READY) {
      this.stageStartedAt = performance.now();
      this.elapsedSeconds = 0;
      this.state = GameState.PLAYING;
      this.astronaut.flap();
      this.steam.burst(this.astronaut);
    } else if (this.state === GameState.PLAYING) {
      this.astronaut.flap();
      this.steam.burst(this.astronaut);
    } else if (this.state === GameState.DEAD && performance.now() - this.deadAt > CONFIG.RETRY_DELAY_MS) {
      if (this.isCampaign()) this.returnToDashboard();
      else this.reset();
    }
  }

  isCampaign() {
    try { return !!JSON.parse(localStorage.getItem('beyondEarthCampaign') || 'null'); }
    catch (_) { return false; }
  }

  returnToDashboard() {
    if (this.returnTimer) clearTimeout(this.returnTimer);
    if (this.isCampaign()) localStorage.removeItem('beyondEarthCampaign');
    window.location.assign('../../index.html?returnToDashboard=1&stageReport=1');
  }

  togglePause() {
    if (this.paused) this.paused = false;
    else if (this.state === GameState.PLAYING) this.paused = true;
  }

  pauseIfPlaying() {
    if (this.state === GameState.PLAYING) this.paused = true;
  }

  handlePointer(x, y) {
    if (this.state === GameState.DEAD && this.isCampaign()) {
      if (performance.now() - this.deadAt > CONFIG.RETRY_DELAY_MS) this.returnToDashboard();
      return;
    }
    if (this.paused) {
      const action = UI.pauseActionAt(x, y);
      if (action === 'continue') this.paused = false;
      else if (action === 'restart') {
        this.reset();
        this.paused = false;
      } else if (action === 'main-menu') {
        window.location.assign('../../index.html?returnToDashboard=1');
      }
      return;
    }

    if (this.state === GameState.PLAYING && UI.isPauseButton(x, y)) {
      this.paused = true;
      return;
    }
    this.jump();
  }

  // ---------- game flow ----------

  reset() {
    this.astronaut.reset();
    this.columns = [];
    this.steam.clear();
    this.score = 0;
    this.coins = [];
    this.coinsCollected = 0;
    this.stageStartedAt = 0;
    this.elapsedSeconds = 0;
    this.stageHistorySaved = false;
    this.bgOffset = 0;
    this.columnsSpawned = 0;
    this.state = GameState.READY;
  }

  gameOver() {
    if (this.state === GameState.DEAD) return;
    this.state = GameState.DEAD;
    this.deadAt = performance.now();
    if (this.score > this.best) {
      this.best = this.score;
      this.saveBest();
    }

    if (!this.stageHistorySaved) {
      this.stageHistorySaved = true;
      const elapsedSeconds = this.elapsedSeconds;
      if (window.BeyondEarthHistory) {
        window.BeyondEarthHistory.record({
          key: 'defyingGravity',
          game: 'Minigame 1 — Defying Gravity',
          status: 'failed',
          outcome: 'Stage failed',
          score: this.score,
          highScore: this.best,
          elapsedSeconds,
          creditsEarned: this.coinsCollected * 5,
          details: { scoreAtFailure: this.score, bestScore: this.best, coinsCollected: this.coinsCollected, creditsPerCoin: 5 }
        });
      }
      // Every attempt returns to the dashboard after the result is shown.
      this.returnTimer = setTimeout(() => this.returnToDashboard(), 2200);
    }
  }

  loadBest() {
    try { return +localStorage.getItem(CONFIG.STORAGE_KEY) || 0; } catch (e) { return 0; }
  }

  saveBest() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, this.best); } catch (e) { /* ignore */ }
  }

  spawnColumnIfNeeded() {
    const last = this.columns[this.columns.length - 1];
    if (!last || last.x < CONFIG.WIDTH - CONFIG.COLUMN_SPACING) {
      const column = new AsteroidColumn(this.asteroidSprites, this.columnsSpawned++ % this.asteroidSprites.length);
      this.columns.push(column);
      // A collectible coin floats safely in the centre of each asteroid gap.
      this.coins.push({ x: column.x, y: column.gapY, collected: false, phase: Math.random() * Math.PI * 2 });
    }
  }

  // ---------- update / draw ----------

  update(dt) {
    if (this.paused) return;

    this.bgOffset = (this.bgOffset + dt * 0.4) % 6;
    this.steam.update(dt);

    if (this.state === GameState.READY) {
      this.astronaut.hover(performance.now());
      return;
    }
    if (this.state !== GameState.PLAYING) return;

    this.elapsedSeconds += dt * 16.67 / 1000;
    this.astronaut.update(dt);
    this.spawnColumnIfNeeded();

    for (const column of this.columns) {
      column.update(dt);
      if (column.hasPassed(this.astronaut.x)) {
        column.passed = true;
        this.score++;
      }
      if (column.collidesWith(this.astronaut)) return this.gameOver();
    }

    this.coins.forEach(coin => {
      if (coin.collected) return;
      coin.x -= CONFIG.SCROLL_SPEED * dt;
      coin.phase += dt * 0.08;
      const dx = coin.x - this.astronaut.x;
      const dy = coin.y - this.astronaut.y;
      if (Math.hypot(dx, dy) < 28) {
        coin.collected = true;
        this.coinsCollected += 1;
      }
    });
    this.coins = this.coins.filter(coin => !coin.collected && coin.x > -24);
    this.columns = this.columns.filter(c => !c.isOffscreen);
    if (this.astronaut.hitsFloor) this.gameOver();
  }

  draw() {
    const ctx = this.ctx;
    ctx.drawImage(this.background, -this.bgOffset, 0);
    ctx.drawImage(this.background, CONFIG.WIDTH - this.bgOffset, 0);

    this.columns.forEach(c => c.draw(ctx));
    this.coins.forEach(coin => {
      ctx.save(); ctx.translate(coin.x, coin.y + Math.sin(coin.phase) * 4);
      ctx.fillStyle = '#8b4b12'; ctx.fillRect(-10, -10, 20, 20);
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(-8, -10, 16, 20);
      ctx.fillStyle = '#fff2a6'; ctx.fillRect(-4, -7, 5, 14);
      ctx.fillStyle = '#d88a18'; ctx.fillRect(3, -5, 3, 10); ctx.restore();
    });
    this.steam.draw(ctx);
    this.astronaut.draw(ctx, this.state !== GameState.READY);
    this.ui.draw(ctx, this);
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 16.67, 2.5);
    this.lastTime = time;
    this.update(dt);
    this.draw();
    requestAnimationFrame(this.loop);
  }
}

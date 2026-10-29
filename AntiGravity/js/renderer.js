/**
 * Medieval Survivors - Canvas Renderer & Map Environment
 */
class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cameraX = 0;
    this.cameraY = 0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.tileSize = 128;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.generateTileCache();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Pre-render a set of varied medieval cobblestone & mossy stone slabs
  generateTileCache() {
    this.tileCanvas = document.createElement('canvas');
    this.tileCanvas.width = this.tileSize * 2;
    this.tileCanvas.height = this.tileSize * 2;
    const tctx = this.tileCanvas.getContext('2d');

    // Base dark gothic stone
    tctx.fillStyle = '#18141d';
    tctx.fillRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);

    // Stone flagstone bricks
    tctx.strokeStyle = '#0f0c13';
    tctx.lineWidth = 2;

    const brickW = 64;
    const brickH = 32;

    for (let y = 0; y < this.tileCanvas.height; y += brickH) {
      const rowOffset = (Math.floor(y / brickH) % 2) * (brickW / 2);
      for (let x = -rowOffset; x < this.tileCanvas.width; x += brickW) {
        // Individual stone color variance
        const tone = 22 + Math.floor(Math.sin(x * 12 + y * 7) * 5);
        tctx.fillStyle = `rgb(${tone}, ${tone - 4}, ${tone + 4})`;
        tctx.fillRect(x + 2, y + 2, brickW - 4, brickH - 4);
        tctx.strokeRect(x, y, brickW, brickH);

        // Moss / cracked details
        if (Math.sin(x * y) > 0.6) {
          tctx.fillStyle = 'rgba(46, 204, 113, 0.12)';
          tctx.fillRect(x + 4, y + 4, brickW - 8, brickH - 8);
        }
      }
    }
  }

  triggerShake(intensity = 6, duration = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  updateCamera(player, dt) {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
    }

    let shakeOffsetX = 0;
    let shakeOffsetY = 0;
    if (this.shakeDuration > 0) {
      shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
      shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
    }

    // Center camera on player
    this.cameraX = player.x - this.canvas.width / 2 + shakeOffsetX;
    this.cameraY = player.y - this.canvas.height / 2 + shakeOffsetY;
  }

  render(game) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Apply camera translation
    ctx.translate(-this.cameraX, -this.cameraY);

    // 1. Render Map Tiles
    this.renderMap(ctx);

    // 2. Render Weapons "Under" (e.g. Holy Aura)
    game.player.weapons.forEach(w => w.renderUnder(ctx, game.player));

    // 3. Render Ground Projectiles (e.g. Holy Fire burning pools)
    game.projectiles.forEach(p => {
      if (p.state === 'burning') p.render(ctx);
    });

    // 4. Render XP Gems
    game.gems.forEach(gem => gem.render(ctx));

    // 5. Render Treasure Chests
    game.chests.forEach(chest => chest.render(ctx));

    // 6. Render Enemies
    game.enemies.forEach(enemy => enemy.render(ctx));

    // 7. Render Enemy Projectiles
    game.enemyProjectiles.forEach(ep => ep.render(ctx));

    // 8. Render Player
    game.player.render(ctx);

    // 9. Render Flying Player Projectiles (Bolts, Axes, Flying Flasks)
    game.projectiles.forEach(p => {
      if (p.state !== 'burning') p.render(ctx);
    });

    // 10. Render Weapons "Over" (Spear thrust, Sword slash)
    game.player.weapons.forEach(w => w.renderOver(ctx, game.player));

    // 11. Render Particles
    game.particles.render(ctx);

    // 12. Render Floating Text Numbers
    game.floatingTexts.forEach(ft => ft.render(ctx));

    // Restore camera
    ctx.restore();

    // 13. Screen Post-processing & Offscreen Indicators
    this.renderBossIndicators(ctx, game);
    this.renderVignette(ctx);
  }

  renderMap(ctx) {
    const startX = Math.floor(this.cameraX / this.tileCanvas.width) * this.tileCanvas.width;
    const endX = this.cameraX + this.canvas.width;
    const startY = Math.floor(this.cameraY / this.tileCanvas.height) * this.tileCanvas.height;
    const endY = this.cameraY + this.canvas.height;

    for (let x = startX; x <= endX; x += this.tileCanvas.width) {
      for (let y = startY; y <= endY; y += this.tileCanvas.height) {
        ctx.drawImage(this.tileCanvas, x, y);
      }
    }
  }

  // Draw off-screen indicators for Mini-bosses so player knows which direction danger comes from
  renderBossIndicators(ctx, game) {
    const screenW = this.canvas.width;
    const screenH = this.canvas.height;
    const margin = 40;

    game.enemies.forEach(e => {
      if (!e.isBoss || !e.alive) return;

      const screenX = e.x - this.cameraX;
      const screenY = e.y - this.cameraY;

      // Check if offscreen
      const isOffscreen = screenX < 0 || screenX > screenW || screenY < 0 || screenY > screenH;
      if (isOffscreen) {
        // Clamp to screen edges
        const clampedX = Math.max(margin, Math.min(screenW - margin, screenX));
        const clampedY = Math.max(margin, Math.min(screenH - margin, screenY));

        const angle = Math.atan2(e.y - game.player.y, e.x - game.player.x);

        ctx.save();
        ctx.translate(clampedX, clampedY);
        ctx.rotate(angle);

        // Red skull pointer
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-10, -9);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-10, 9);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Label
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 12px Cinzel, Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(e.name, clampedX, clampedY - 14);
      }
    });
  }

  // Dark gothic atmosphere vignette + player torch glow
  renderVignette(ctx) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Torch radius centered on player's screen position
    const centerX = w / 2;
    const centerY = h / 2;

    const grad = ctx.createRadialGradient(centerX, centerY, 120, centerX, centerY, Math.max(w, h) * 0.75);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    grad.addColorStop(0.5, 'rgba(10, 8, 14, 0.45)');
    grad.addColorStop(1, 'rgba(4, 2, 8, 0.88)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.GameRenderer = GameRenderer;

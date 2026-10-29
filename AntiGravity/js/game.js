/**
 * Medieval Survivors - Core Game Engine
 */
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new MedievalSurvivors.GameRenderer(this.canvas);
    this.particles = new MedievalSurvivors.ParticleSystem();
    this.waveDirector = new MedievalSurvivors.WaveDirector();
    this.saveManager = window.MedievalSurvivors.saveManager;

    this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'LEVEL_UP', 'CHEST', 'GAME_OVER', 'VICTORY'
    this.selectedClassId = 'knight'; // Default class

    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.floatingTexts = [];

    this.gameTime = 0;
    this.lastTimestamp = 0;
    this.keys = {};

    this.ui = new MedievalSurvivors.UIController(this);
    this.bindInputs();
  }

  bindInputs() {
    window.addEventListener('pointermove', (e) => {
      // Only process mouse aim if enabled in settings
      const mouseAimEnabled = this.saveManager ? this.saveManager.data.settings.mouseAim : true;
      if (this.state === 'PLAYING' && this.player && this.renderer && mouseAimEnabled) {
        if (this.renderer.getMouseWorldPosition) {
          const mouseWorld = this.renderer.getMouseWorldPosition(e.clientX, e.clientY);
          if (mouseWorld) {
            this.player.facingAngle = Math.atan2(mouseWorld.y - this.player.y, mouseWorld.x - this.player.x);
            this.player.aimingWithMouse = true;
            if (Math.cos(this.player.facingAngle) > 0.1) this.player.facingDir = 1;
            else if (Math.cos(this.player.facingAngle) < -0.1) this.player.facingDir = -1;
          }
        } else {
          const mouseWorldX = e.clientX + this.renderer.cameraX;
          const mouseWorldY = e.clientY + this.renderer.cameraY;
          this.player.facingAngle = Math.atan2(mouseWorldY - this.player.y, mouseWorldX - this.player.x);
          this.player.aimingWithMouse = true;
          if (Math.cos(this.player.facingAngle) > 0.1) this.player.facingDir = 1;
          else if (Math.cos(this.player.facingAngle) < -0.1) this.player.facingDir = -1;
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (this.player) this.player.aimingWithMouse = false;
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING' || this.state === 'PAUSED') {
          this.togglePause();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Start background music / audio context on first user interaction
    const initAudio = () => {
      window.MedievalSurvivors.sound.init();
      window.removeEventListener('pointerdown', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
    window.addEventListener('pointerdown', initAudio);
    window.addEventListener('keydown', initAudio);
  }

  toggleMouseAim() {
    const isNowActive = !this.saveManager.data.settings.mouseAim;
    this.saveManager.data.settings.mouseAim = isNowActive;
    this.saveManager.save();
    if (!isNowActive && this.player) {
      this.player.aimingWithMouse = false;
    }
    return isNowActive;
  }

  start() {
    const classDef = window.MedievalSurvivors.classRegistry.getClass(this.selectedClassId);
    this.player = new MedievalSurvivors.Player(classDef, 0, 0);

    // Apply permanent meta-upgrades from the Forge!
    this.saveManager.applyToPlayer(this.player);

    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.floatingTexts = [];

    this.gameTime = 0;
    this.waveDirector.reset();
    this.state = 'PLAYING';

    // Start New 3D Run with Generative Procedural Map & Biome!
    if (this.renderer && this.renderer.startNewRun) {
      this.renderer.startNewRun(this);
    }

    this.ui.updateHUD(this.player, this.gameTime);
    this.ui.updateMouseAimButton();
    window.MedievalSurvivors.sound.startBgm();

    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.ui.showPauseModal();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.ui.hidePauseModal();
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  resume() {
    if (this.state !== 'GAME_OVER' && this.state !== 'VICTORY') {
      this.state = 'PLAYING';
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  addFloatingText(x, y, text, color, isCritical) {
    this.floatingTexts.push(new MedievalSurvivors.FloatingText(x, y, text, color, isCritical));
  }

  getInputDirection() {
    let dx = 0;
    let dy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;

    // Gamepad support
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (gamepads && gamepads[0]) {
      const gp = gamepads[0];
      const stickX = gp.axes[0];
      const stickY = gp.axes[1];
      if (Math.abs(stickX) > 0.2) dx = stickX;
      if (Math.abs(stickY) > 0.2) dy = stickY;
    }

    return { x: dx, y: dy };
  }

  loop(timestamp) {
    if (this.state !== 'PLAYING') return;

    let dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Cap delta time to prevent physics jumping when tab loses focus
    if (dt > 0.1) dt = 0.1;

    this.update(dt);
    this.renderer.render(this);

    if (this.state === 'PLAYING') {
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  triggerVictory() {
    this.state = 'VICTORY';
    const bonusGold = 500;
    this.player.gold += bonusGold;
    this.saveManager.addGold(this.player.gold);

    const totalDmg = this.player.weapons.reduce((sum, w) => sum + w.totalDamageDealt, 0);
    this.saveManager.recordRun({
      hero: this.player.classDef.name,
      timeSurvived: '15:00',
      timeSeconds: 900,
      level: this.player.level,
      kills: this.player.killCount,
      damage: totalDmg,
      goldEarned: this.player.gold,
      outcome: 'VITÓRIA'
    });

    this.renderer.triggerShake(16, 1.0);
    window.MedievalSurvivors.sound.playLevelUp();
    this.ui.showVictory(this.player, this.gameTime, bonusGold);
  }

  update(dt) {
    this.gameTime += dt;

    // 15-Minute Stage Limit (900 seconds)
    if (this.gameTime >= 900) {
      this.triggerVictory();
      return;
    }

    // 1. Update Player
    const inputDir = this.getInputDirection();
    this.player.update(dt, inputDir, this.enemies, this.projectiles, this.particles);

    // Camera follow
    this.renderer.updateCamera(this.player, dt);

    // 2. Wave Director & Boss Timers
    this.waveDirector.update(dt, this.player, this.enemies, (bossName) => {
      this.ui.showBossWarning(bossName);
      this.renderer.triggerShake(12, 0.6);
    });

    // 3. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const keep = this.projectiles[i].update(dt, this.enemies, this.particles);
      if (!keep) {
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Update Enemy Projectiles (with weapon parry/cancellation check!)
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const keep = this.enemyProjectiles[i].update(dt, this.player, this.particles, this.projectiles);
      if (!keep) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // 5. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.enemies, this.enemyProjectiles);

      if (!enemy.alive) {
        this.player.killCount++;
        this.particles.createBloodSparks(enemy.x, enemy.y, 8, enemy.color);

        // Spawn XP Gem
        this.gems.push(new MedievalSurvivors.XpGem(enemy.x, enemy.y, enemy.xpValue));

        // Gold Loot Chance
        let goldDrop = 0;
        if (enemy.isBoss) {
          goldDrop = enemy.bossTier === 3 ? 150 : (enemy.bossTier === 2 ? 80 : 40);
        } else if (Math.random() < 0.25) {
          goldDrop = Math.max(1, Math.round((1 + Math.floor(Math.random() * 3)) * (this.player.goldMultiplier || 1)));
        }

        if (goldDrop > 0) {
          this.player.gold += goldDrop;
          this.addFloatingText(enemy.x, enemy.y - 12, `+${goldDrop} 💰`, '#ffeaa7', false);
        }

        // Spawn Treasure Chest if Mini-Boss
        if (enemy.dropChest) {
          this.chests.push(new MedievalSurvivors.TreasureChest(enemy.x, enemy.y, enemy.bossTier));
          this.renderer.triggerShake(8, 0.4);
        }

        this.enemies.splice(i, 1);
      }
    }

    // 6. Update XP Gems
    let triggeredLevelUp = false;
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const status = this.gems[i].update(dt, this.player);
      if (status === 'LEVEL_UP') {
        triggeredLevelUp = true;
      }
      if (!this.gems[i].alive) {
        this.gems.splice(i, 1);
      }
    }

    // 7. Update Chests
    for (let i = this.chests.length - 1; i >= 0; i--) {
      const chestTier = this.chests[i].update(dt, this.player);
      if (chestTier !== null) {
        this.chests.splice(i, 1);
        this.state = 'CHEST';
        this.ui.showChestModal(this.player, chestTier);
        return;
      }
    }

    // 8. Update Particles & Floating Text
    this.particles.update(dt);
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const keep = this.floatingTexts[i].update(dt);
      if (!keep) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 9. Update UI HUD
    this.ui.updateHUD(this.player, this.gameTime);

    // 10. Check Player Death
    if (!this.player.alive) {
      this.state = 'GAME_OVER';
      this.renderer.triggerShake(14, 0.8);

      // Save gold and run to history
      this.saveManager.addGold(this.player.gold);
      const totalDmg = this.player.weapons.reduce((sum, w) => sum + w.totalDamageDealt, 0);
      const mins = Math.floor(this.gameTime / 60);
      const secs = Math.floor(this.gameTime % 60);
      this.saveManager.recordRun({
        hero: this.player.classDef.name,
        timeSurvived: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        timeSeconds: this.gameTime,
        level: this.player.level,
        kills: this.player.killCount,
        damage: totalDmg,
        goldEarned: this.player.gold,
        outcome: 'DERROTA'
      });

      this.ui.showGameOver(this.player, this.gameTime);
      return;
    }

    // 11. Check Level Up
    if (triggeredLevelUp) {
      this.state = 'LEVEL_UP';
      this.ui.showLevelUpModal(this.player);
    }
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.Game = Game;

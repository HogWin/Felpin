/**
 * Medieval Survivors - Core Game Engine
 */
class SpatialGrid {
  constructor(cellSize = 90) {
    this.cellSize = cellSize;
    this.invCellSize = 1 / cellSize;
    this.cells = new Map();
  }

  _getKey(cellX, cellY) {
    return (cellX << 16) ^ (cellY & 0xffff);
  }

  clear() {
    this.cells.clear();
  }

  insert(entity) {
    const cx = Math.floor(entity.x * this.invCellSize);
    const cy = Math.floor(entity.y * this.invCellSize);
    const key = this._getKey(cx, cy);
    let cell = this.cells.get(key);
    if (!cell) {
      cell = [];
      this.cells.set(key, cell);
    }
    cell.push(entity);
  }

  insertAll(entities) {
    for (let i = 0, len = entities.length; i < len; i++) {
      const e = entities[i];
      if (e && e.alive) {
        this.insert(e);
      }
    }
  }

  getNearby(x, y, radius = 90, outArr = []) {
    outArr.length = 0;
    const minCX = Math.floor((x - radius) * this.invCellSize);
    const maxCX = Math.floor((x + radius) * this.invCellSize);
    const minCY = Math.floor((y - radius) * this.invCellSize);
    const maxCY = Math.floor((y + radius) * this.invCellSize);

    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const key = this._getKey(cx, cy);
        const cell = this.cells.get(key);
        if (cell) {
          for (let i = 0, len = cell.length; i < len; i++) {
            outArr.push(cell[i]);
          }
        }
      }
    }
    return outArr;
  }
}

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
    this.allies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.floatingTexts = [];

    // High-performance 2D spatial grid for O(1) collision & proximity queries
    this.spatialGrid = new SpatialGrid(90);
    this._nearbyBuffer = [];

    this.gameTime = 0;
    this.lastTimestamp = 0;
    this.keys = {};

    // Track pointer screen position for continuous aiming
    this.lastPointerScreenX = window.innerWidth / 2;
    this.lastPointerScreenY = window.innerHeight / 2;

    this.ui = new MedievalSurvivors.UIController(this);
    this.bindInputs();
  }

  bindInputs() {
    window.addEventListener('pointermove', (e) => {
      this.lastPointerScreenX = e.clientX;
      this.lastPointerScreenY = e.clientY;

      const mouseAimEnabled = this.saveManager ? this.saveManager.data.settings.mouseAim : true;
      if (this.state === 'PLAYING' && this.player && mouseAimEnabled) {
        this.updateAimDirection();
      }
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
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

  updateAimDirection() {
    if (!this.player || !this.renderer) return;
    const mouseAimEnabled = this.saveManager ? this.saveManager.data.settings.mouseAim : true;
    if (!mouseAimEnabled) return;

    if (this.renderer.getMouseWorldPosition) {
      const mouseWorld = this.renderer.getMouseWorldPosition(this.lastPointerScreenX, this.lastPointerScreenY);
      if (mouseWorld) {
        this.player.facingAngle = Math.atan2(mouseWorld.y - this.player.y, mouseWorld.x - this.player.x);
        this.player.aimingWithMouse = true;
        if (Math.cos(this.player.facingAngle) > 0.05) this.player.facingDir = 1;
        else if (Math.cos(this.player.facingAngle) < -0.05) this.player.facingDir = -1;
      }
    } else {
      const mouseWorldX = this.lastPointerScreenX + this.renderer.cameraX;
      const mouseWorldY = this.lastPointerScreenY + this.renderer.cameraY;
      this.player.facingAngle = Math.atan2(mouseWorldY - this.player.y, mouseWorldX - this.player.x);
      this.player.aimingWithMouse = true;
      if (Math.cos(this.player.facingAngle) > 0.05) this.player.facingDir = 1;
      else if (Math.cos(this.player.facingAngle) < -0.05) this.player.facingDir = -1;
    }
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
    this.allies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.floatingTexts = [];

    // High-performance 2D spatial grid for O(1) collision & proximity queries
    this.spatialGrid = new SpatialGrid(90);
    this._nearbyBuffer = [];

    this.gameTime = 0;
    this.waveDirector.reset();
    this.state = 'PLAYING';

    // Start New 3D Run with Generative Procedural Map & Biome!
    if (this.renderer && this.renderer.startNewRun) {
      this.renderer.startNewRun(this);
    }

    this.ui.updateHUD(this.player, this.gameTime);
    this.ui.updateMouseAimButton();
    if (this.ui.onGameStart) this.ui.onGameStart();
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

  // Returns array of enemies within radius (O(1) spatial grid lookup)
  getNearbyEnemies(x, y, radius = 70, outArr = null) {
    return this.spatialGrid.getNearby(x, y, radius, outArr || this._nearbyBuffer);
  }

  // Merges distant, non-attracted XP gems into concentrated clusters when gem count is high
  consolidateGems() {
    if (this.gems.length <= 130 || !this.player) return;
    const playerX = this.player.x;
    const playerY = this.player.y;
    const minConsolidateDistSq = 320 * 320;

    const distantGems = [];
    const keptGems = [];

    for (let i = 0, len = this.gems.length; i < len; i++) {
      const g = this.gems[i];
      if (!g || !g.alive) continue;
      const dx = g.x - playerX;
      const dy = g.y - playerY;
      const distSq = dx * dx + dy * dy;

      if (!g.attracted && distSq >= minConsolidateDistSq && !g.isConcentrated) {
        distantGems.push(g);
      } else {
        keptGems.push(g);
      }
    }

    if (distantGems.length < 8) return;

    // Cluster distant gems by ~160px grid cells
    const clusterGrid = new Map();
    const cellSize = 160;
    for (let i = 0, len = distantGems.length; i < len; i++) {
      const g = distantGems[i];
      const cx = Math.floor(g.x / cellSize);
      const cy = Math.floor(g.y / cellSize);
      const key = `${cx},${cy}`;
      let cluster = clusterGrid.get(key);
      if (!cluster) {
        cluster = { xSum: 0, ySum: 0, totalVal: 0, count: 0 };
        clusterGrid.set(key, cluster);
      }
      cluster.xSum += g.x;
      cluster.ySum += g.y;
      cluster.totalVal += (g.value || 1);
      cluster.count++;
      g.alive = false;
    }

    for (const [, c] of clusterGrid) {
      const avgX = c.xSum / c.count;
      const avgY = c.ySum / c.count;
      keptGems.push(new MedievalSurvivors.XpGem(avgX, avgY, c.totalVal, true));
    }

    this.gems = keptGems;
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

    // Fast O(N) Spatial Partitioning for this frame
    this.spatialGrid.clear();
    this.spatialGrid.insertAll(this.enemies);

    // 1. Update Aim Direction (locks aim to mouse position continuously)
    this.updateAimDirection();

    // 2. Update Player
    const inputDir = this.getInputDirection();
    this.player.update(dt, inputDir, this.enemies, this.projectiles, this.particles);

    // Camera follow
    this.renderer.updateCamera(this.player, dt);

    // 3. Wave Director & Boss Timers
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

    // 3.5. Update Allies (Necromancer minions)
    for (let i = this.allies.length - 1; i >= 0; i--) {
      const keep = this.allies[i].update(dt, this.player, this.enemies, this.particles);
      if (!keep) {
        this.allies.splice(i, 1);
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
        if (this.player.onEnemyKilled) {
          this.player.onEnemyKilled(enemy, this);
        }
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

    // 6. Update XP Gems (with intelligent background clustering to avoid performance degradation)
    if (this.gems.length > 130) {
      this.consolidateGems();
    }
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
      const totalSecs = Math.floor(this.gameTime);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      const timeSurvived = hrs > 0
        ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      this.saveManager.recordRun({
        hero: this.player.classDef.name,
        timeSurvived: timeSurvived,
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

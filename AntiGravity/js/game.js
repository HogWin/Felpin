"use strict";
class SpatialGrid {
  constructor(cellSize = 90) {
    this.cellSize = cellSize;
    this.invCellSize = 1 / cellSize;
    this.cells = /* @__PURE__ */ new Map();
    this._cellPool = [];
    this._defaultBuffer = [];
  }
  _getKey(cellX, cellY) {
    return cellX << 16 ^ cellY & 65535;
  }
  clear() {
    for (const cell of this.cells.values()) {
      cell.length = 0;
      this._cellPool.push(cell);
    }
    this.cells.clear();
  }
  insert(entity) {
    const cx = Math.floor(entity.x * this.invCellSize);
    const cy = Math.floor(entity.y * this.invCellSize);
    const key = this._getKey(cx, cy);
    let cell = this.cells.get(key);
    if (!cell) {
      cell = this._cellPool.pop() || [];
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
  getNearby(x, y, radius = 90, outArr = null) {
    const arr = outArr || this._defaultBuffer;
    arr.length = 0;
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
            arr.push(cell[i]);
          }
        }
      }
    }
    return arr;
  }
  query(x, y, radius = 90, outArr = null) {
    return this.getNearby(x, y, radius, outArr);
  }
}
class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.renderer = new MedievalSurvivors.GameRenderer(this.canvas);
    this.particles = new MedievalSurvivors.ParticleSystem();
    this.waveDirector = new MedievalSurvivors.WaveDirector();
    this.arenaEventManager = new MedievalSurvivors.ArenaEventManager();
    this.saveManager = window.MedievalSurvivors.saveManager;
    this.hyperMode = this.saveManager && this.saveManager.data.settings.hyperMode || false;
    this.curseRank = this.saveManager && this.saveManager.data.settings.curseRank || 0;
    this.isRankedMode = this.saveManager && this.saveManager.data.settings.isRankedMode !== void 0 ? this.saveManager.data.settings.isRankedMode : true;
    if (this.saveManager && this.saveManager.data.settings.graphicsQuality && this.renderer && this.renderer.setGraphicsQuality) {
      this.renderer.setGraphicsQuality(this.saveManager.data.settings.graphicsQuality);
    }
    this.state = "MENU";
    this.selectedClassId = "knight";
    this.player = null;
    this.enemies = [];
    this.allies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.destructibles = [];
    this.collectibles = [];
    this.floatingTexts = [];
    this.floatingTextPool = new MedievalSurvivors.FloatingTextPool(160);
    this.frameCount = 0;
    this.hitStopTimer = 0;
    this.touchInput = { x: 0, y: 0 };
    this.spatialGrid = new SpatialGrid(90);
    this._nearbyBuffer = [];
    this.gameTime = 0;
    this.lastTimestamp = 0;
    this.keys = {};
    this.lastPointerScreenX = window.innerWidth / 2;
    this.lastPointerScreenY = window.innerHeight / 2;
    this.ui = new MedievalSurvivors.UIController(this);
    this.bindInputs();
  }
  bindInputs() {
    if (this._inputsBound) return;
    this._inputsBound = true;
    window.addEventListener("pointermove", (e) => {
      this.lastPointerScreenX = e.clientX;
      this.lastPointerScreenY = e.clientY;
      const mouseAimEnabled = this.saveManager ? this.saveManager.data.settings.mouseAim : true;
      if (this.state === "PLAYING" && this.player && mouseAimEnabled) {
        this.updateAimDirection();
      }
    });
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (e.code === "KeyP" || e.code === "Escape") {
        if (this.state === "PLAYING" || this.state === "PAUSED") {
          this.togglePause();
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
    window.addEventListener("contextmenu", (e) => {
      if (this.state === "PLAYING" || this.state === "PAUSED" || e.target && (e.target.id === "game-canvas" || e.target.id === "overlay-canvas" || e.target.closest("#game-container"))) {
        e.preventDefault();
        return false;
      }
    });
    const initAudio = () => {
      window.MedievalSurvivors.sound.init();
      window.removeEventListener("pointerdown", initAudio);
      window.removeEventListener("keydown", initAudio);
    };
    window.addEventListener("pointerdown", initAudio);
    window.addEventListener("keydown", initAudio);
    this.setupVirtualJoystick();
  }
  setupVirtualJoystick() {
    const joystick = document.getElementById("virtual-joystick");
    const stick = document.getElementById("joystick-stick");
    if (!joystick || !stick) return;
    let touchId = null;
    let startX = 0;
    let startY = 0;
    const maxRadius = 45;
    const handleStart = (clientX, clientY, identifier) => {
      touchId = identifier;
      const rect = joystick.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      handleMove(clientX, clientY);
    };
    const handleMove = (clientX, clientY) => {
      let dx = clientX - startX;
      let dy = clientY - startY;
      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius) {
        dx = dx / dist * maxRadius;
        dy = dy / dist * maxRadius;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      this.touchInput.x = dx / maxRadius;
      this.touchInput.y = dy / maxRadius;
      if (this.player && !this.saveManager.data.settings.mouseAim) {
        this.player.facingAngle = Math.atan2(this.touchInput.y, this.touchInput.x);
        if (Math.cos(this.player.facingAngle) > 0.05) this.player.facingDir = 1;
        else if (Math.cos(this.player.facingAngle) < -0.05) this.player.facingDir = -1;
      }
    };
    const handleEnd = () => {
      touchId = null;
      stick.style.transform = "translate(0px, 0px)";
      this.touchInput.x = 0;
      this.touchInput.y = 0;
    };
    joystick.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (touchId === null && e.changedTouches[0]) {
        const t = e.changedTouches[0];
        handleStart(t.clientX, t.clientY, t.identifier);
      }
    }, { passive: false });
    window.addEventListener("touchmove", (e) => {
      if (touchId !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            handleMove(t.clientX, t.clientY);
            break;
          }
        }
      }
    }, { passive: true });
    window.addEventListener("touchend", (e) => {
      if (touchId !== null) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            handleEnd();
            break;
          }
        }
      }
    });
    window.addEventListener("touchcancel", () => handleEnd());
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
  toggleAutoGold() {
    if (!this.saveManager) return false;
    const isNowActive = !this.saveManager.data.settings.autoGoldOnMax;
    this.saveManager.data.settings.autoGoldOnMax = isNowActive;
    this.saveManager.save();
    return isNowActive;
  }
  start() {
    const classDef = window.MedievalSurvivors.classRegistry.getClass(this.selectedClassId);
    this.player = new MedievalSurvivors.Player(classDef, 0, 0);
    this.saveManager.applyToPlayer(this.player);
    let goldMult = this.player.goldMultiplier || 1;
    if (this.hyperMode) {
      goldMult += 0.5;
    }
    if (this.curseRank > 0) {
      goldMult += this.curseRank * 0.2;
      this.player.critChance = (this.player.critChance || 0.05) + this.curseRank * 0.05;
    }
    this.player.goldMultiplier = goldMult;
    this.enemies = [];
    this.allies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.chests = [];
    this.destructibles = [];
    this.collectibles = [];
    this.floatingTexts = [];
    this.floatingTextPool = new MedievalSurvivors.FloatingTextPool(160);
    this.frameCount = 0;
    this.hitStopTimer = 0;
    this.touchInput = { x: 0, y: 0 };
    this.spatialGrid = new SpatialGrid(90);
    this._nearbyBuffer = [];
    this.gameTime = 0;
    this.waveDirector.reset();
    if (this.arenaEventManager) this.arenaEventManager.reset();
    if (window.MedievalSurvivors.sound) window.MedievalSurvivors.sound.setMusicIntensity(0, false);
    this.state = "PLAYING";
    this.spawnInitialDestructibles();
    if (this.renderer && this.renderer.startNewRun) {
      this.renderer.startNewRun(this);
    }
    this.ui.updateHUD(this.player, this.gameTime);
    this.ui.updateMouseAimButton();
    this.ui.updateAutoGoldButton();
    if (this.ui.onGameStart) this.ui.onGameStart();
    window.MedievalSurvivors.sound.startBgm();
    this.lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }
  togglePause() {
    if (this.state === "PLAYING") {
      this.state = "PAUSED";
      this.ui.showPauseModal();
    } else if (this.state === "PAUSED") {
      this.state = "PLAYING";
      this.ui.hidePauseModal();
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }
  resume() {
    if (this.state !== "GAME_OVER" && this.state !== "VICTORY") {
      this.state = "PLAYING";
      this.lastTimestamp = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }
  // Libera completamente todas as entidades, particulas e malhas 3D da run finalizada
  clearRunData() {
    if (this.renderer && this.renderer.clearMeshPools) {
      this.renderer.clearMeshPools();
    }
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e && e.destroy) e.destroy();
    }
    this.enemies.length = 0;
    this.allies.length = 0;
    this.projectiles.length = 0;
    this.enemyProjectiles.length = 0;
    this.gems.length = 0;
    this.chests.length = 0;
    this.destructibles.length = 0;
    this.collectibles.length = 0;
    this.floatingTexts.length = 0;
    if (this.spatialGrid) {
      this.spatialGrid.clear();
    }
    if (this.particles && this.particles.particles) {
      this.particles.particles.length = 0;
    }
    if (this.waveDirector) {
      this.waveDirector.reset();
    }
    if (this.arenaEventManager) {
      this.arenaEventManager.reset();
    }
    this.player = null;
    this.gameTime = 0;
  }
  quitToMenu() {
    if (this.player && this.saveManager) {
      if (this.player.gold > 0) {
        this.saveManager.addGold(this.player.gold);
      }
      if (this.saveManager.addEther && this.player.ether > 0) {
        this.saveManager.addEther(this.player.ether);
      }
      const totalDmg = this.player.weapons.reduce((sum, w) => sum + (w.totalDamageDealt || 0), 0);
      const totalSecs = Math.floor(this.gameTime || 0);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor(totalSecs % 3600 / 60);
      const secs = totalSecs % 60;
      const timeSurvived = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}` : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      this.saveManager.recordRun({
        hero: this.player.classDef && this.player.classDef.name || "Herói",
        timeSurvived,
        timeSeconds: this.gameTime || 0,
        level: this.player.level || 1,
        kills: this.player.killCount || 0,
        damage: totalDmg,
        goldEarned: this.player.gold || 0,
        etherEarned: this.player.ether || 0,
        outcome: "RETIRADA"
      });
      this.saveManager.save();
    }
    this.clearRunData();
    this.state = "MENU";
    if (window.MedievalSurvivors.sound) {
      window.MedievalSurvivors.sound.setMusicIntensity(0, false);
      if (window.MedievalSurvivors.sound.startLobbyMusic) {
        window.MedievalSurvivors.sound.startLobbyMusic();
      } else if (window.MedievalSurvivors.sound.stopBgm) {
        window.MedievalSurvivors.sound.stopBgm();
      }
    }
    if (this.ui) {
      this.ui.hideAllModals();
      this.ui.openMainMenu("play");
    }
  }
  addFloatingText(x, y, text, color, isCritical) {
    if (this.floatingTexts.length >= 28) {
      const old = this.floatingTexts.shift();
      if (old && this.floatingTextPool) {
        this.floatingTextPool.release(old);
      }
    }
    this.floatingTexts.push(this.floatingTextPool.acquire(x, y, text, color, isCritical));
  }
  triggerHitStop(duration = 0.045) {
    this.hitStopTimer = duration;
  }
  spawnInitialDestructibles() {
    this.destructibles = [];
    this.collectibles = [];
    const types = ["barrel", "crate", "sarcophagus"];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const ang = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 850;
      const x = Math.cos(ang) * dist;
      const y = Math.sin(ang) * dist;
      this.destructibles.push(new MedievalSurvivors.DestructibleObject(x, y, type));
    }
  }
  updateDestructibles(dt) {
    if (!this.destructibles) this.destructibles = [];
    this._destructibleTimer = (this._destructibleTimer || 0) + dt;
    if (this._destructibleTimer >= 22) {
      this._destructibleTimer = 0;
      if (this.destructibles.length < 4 && this.player) {
        const types = ["barrel", "crate", "sarcophagus"];
        const type = types[Math.floor(Math.random() * types.length)];
        const ang = Math.random() * Math.PI * 2;
        const dist = 320 + Math.random() * 450;
        const x = this.player.x + Math.cos(ang) * dist;
        const y = this.player.y + Math.sin(ang) * dist;
        this.destructibles.push(new MedievalSurvivors.DestructibleObject(x, y, type));
      }
    }
    const aura = this.player && this.player.weapons ? this.player.weapons.find((w) => w.id === "holy_aura" && w.level > 0) : null;
    const auraR = aura ? (aura.activeRadius || 70) * (this.player.effectiveAreaMultiplier || 1) : 0;
    const auraRSq = auraR * auraR;
    for (let i = this.destructibles.length - 1; i >= 0; i--) {
      const d = this.destructibles[i];
      d.update(dt);
      for (let pIdx = 0; pIdx < this.projectiles.length; pIdx++) {
        const p = this.projectiles[pIdx];
        if (!p || !p.alive) continue;
        const dx = p.x - d.x;
        const dy = p.y - d.y;
        const distSq = dx * dx + dy * dy;
        const hitR = (p.radius || 10) + d.radius;
        if (distSq <= hitR * hitR) {
          d.takeDamage(1, this);
          break;
        }
      }
      if (d.alive && aura && this.player) {
        const dx = this.player.x - d.x;
        const dy = this.player.y - d.y;
        if (dx * dx + dy * dy <= auraRSq) {
          d.takeDamage(1, this);
        }
      }
      if (d.alive && this.player) {
        for (let wIdx = 0; wIdx < this.player.weapons.length; wIdx++) {
          const w = this.player.weapons[wIdx];
          if (!w || w.level <= 0) continue;
          if (w.slashEffects && w.slashEffects.length > 0) {
            for (let sIdx = 0; sIdx < w.slashEffects.length; sIdx++) {
              const s = w.slashEffects[sIdx];
              const dx = d.x - this.player.x;
              const dy = d.y - this.player.y;
              const dist = Math.hypot(dx, dy);
              if (dist <= s.radius + d.radius) {
                const ang = Math.atan2(dy, dx);
                let diff = Math.abs(ang - s.angle);
                while (diff > Math.PI) diff = Math.abs(diff - 2 * Math.PI);
                const arcLimit = s.isEvolved ? Math.PI : Math.PI * 0.45;
                if (diff <= arcLimit) {
                  d.takeDamage(1, this);
                  break;
                }
              }
            }
          }
          if (d.alive && w.lashEffects && w.lashEffects.length > 0) {
            for (let lIdx = 0; lIdx < w.lashEffects.length; lIdx++) {
              const lash = w.lashEffects[lIdx];
              const dx = d.x - this.player.x;
              const dy = d.y - this.player.y;
              const dist = Math.hypot(dx, dy);
              if (dist <= lash.reach + d.radius) {
                const ang = Math.atan2(dy, dx);
                let diff = Math.abs(ang - lash.angle);
                while (diff > Math.PI) diff = Math.abs(diff - 2 * Math.PI);
                if (diff <= Math.PI * 0.35) {
                  d.takeDamage(1, this);
                  break;
                }
              }
            }
          }
          if (!d.alive) break;
        }
      }
      if (!d.alive) {
        this.destructibles.splice(i, 1);
      }
    }
  }
  // Returns array of enemies within radius (O(1) spatial grid lookup)
  getNearbyEnemies(x, y, radius = 70, outArr = null) {
    return this.spatialGrid.getNearby(x, y, radius, outArr || this._nearbyBuffer);
  }
  // Merges distant, non-attracted XP gems into concentrated clusters when gem count is high
  consolidateGems() {
    if (this.gems.length <= 75 || !this.player) return;
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
    const clusterGrid = /* @__PURE__ */ new Map();
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
      cluster.totalVal += g.value || 1;
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
    if (this.keys["KeyW"] || this.keys["ArrowUp"]) dy -= 1;
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) dy += 1;
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) dx -= 1;
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) dx += 1;
    if (this.touchInput.x !== 0 || this.touchInput.y !== 0) {
      dx = this.touchInput.x;
      dy = this.touchInput.y;
    }
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
    if (this.state !== "PLAYING") return;
    let dt = (timestamp - this.lastTimestamp) / 1e3;
    this.lastTimestamp = timestamp;
    if (dt > 0.1) dt = 0.1;
    this.update(dt);
    this.renderer.render(this);
    if (this.state === "PLAYING") {
      requestAnimationFrame((t) => this.loop(t));
    }
  }
  triggerVictory() {
    this.state = "VICTORY";
    const bonusGold = 150;
    this.player.gold += bonusGold;
    this.saveManager.addGold(this.player.gold);
    if (this.player.addEther) this.player.addEther(30, false);
    if (this.saveManager.addEther && this.player.ether) {
      this.saveManager.addEther(this.player.ether);
    }
    const totalDmg = this.player.weapons.reduce((sum, w) => sum + (w.totalDamageDealt || 0), 0);
    this.saveManager.recordRun({
      hero: this.player.classDef.name,
      timeSurvived: "10:00",
      timeSeconds: 600,
      level: this.player.level,
      kills: this.player.killCount,
      damage: totalDmg,
      goldEarned: this.player.gold,
      etherEarned: this.player.ether || 0,
      outcome: "VITÓRIA"
    });
    this.saveManager.save();
    this.renderer.triggerShake(16, 1);
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playVictory) {
      window.MedievalSurvivors.sound.playVictory();
    } else if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playLevelUp) {
      window.MedievalSurvivors.sound.playLevelUp();
    }
    if (this.saveManager) {
      this.saveManager.checkAchievements("run_victory", null, this);
    }
    this.submitRunToNeon();
    if (window.MedievalSurvivors.sound) {
      window.MedievalSurvivors.sound.setMusicIntensity(0, false);
      if (window.MedievalSurvivors.sound.startLobbyMusic) {
        window.MedievalSurvivors.sound.startLobbyMusic();
      }
    }
    this.ui.showVictory(this.player, this.gameTime, bonusGold);
  }
  update(dt) {
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      return;
    }
    this.frameCount++;
    this.gameTime += dt;
    if (this.gameTime >= 600) {
      this.gameTime = 600;
      this.triggerVictory();
      return;
    }
    if (this.gameTime >= 180 && this.saveManager) {
      if (this.curseRank >= 1) this.saveManager.checkAchievements("curse_survived_3min", null, this);
    }
    if (this.gameTime >= 300 && this.saveManager) {
      if (this.hyperMode) this.saveManager.checkAchievements("hyper_survived_5min", null, this);
      if (this.curseRank >= 5) this.saveManager.checkAchievements("curse_survived_5min", null, this);
    }
    this.spatialGrid.clear();
    this.spatialGrid.insertAll(this.enemies);
    this.updateAimDirection();
    const inputDir = this.getInputDirection();
    this.player.update(dt, inputDir, this.enemies, this.projectiles, this.particles);
    this.renderer.updateCamera(this.player, dt);
    this.waveDirector.update(dt, this.player, this.enemies, (bossName) => {
      this.ui.showBossWarning(bossName);
      this.renderer.triggerShake(12, 0.6);
    });
    if (this.arenaEventManager) {
      this.arenaEventManager.update(dt, this);
    }
    if (window.MedievalSurvivors.sound) {
      const timeFactor = Math.min(1, this.gameTime / 600);
      const enemyFactor = Math.min(1, this.enemies.length / 85);
      const intensity = Math.min(1, timeFactor * 0.65 + enemyFactor * 0.35);
      const isBossActive = this.enemies.some((e) => e.isBoss && e.alive);
      window.MedievalSurvivors.sound.setMusicIntensity(intensity, isBossActive);
    }
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const keep = this.projectiles[i].update(dt, this.enemies, this.particles);
      if (!keep) {
        this.projectiles.splice(i, 1);
      }
    }
    for (let i = this.allies.length - 1; i >= 0; i--) {
      const keep = this.allies[i].update(dt, this.player, this.enemies, this.particles);
      if (!keep) {
        this.allies.splice(i, 1);
      }
    }
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const keep = this.enemyProjectiles[i].update(dt, this.player, this.particles, this.projectiles);
      if (!keep) {
        this.enemyProjectiles.splice(i, 1);
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.enemies, this.enemyProjectiles);
      if (!enemy.alive) {
        this.player.killCount++;
        if (this.saveManager) {
          if (!this.saveManager.data.stats) this.saveManager.data.stats = {};
          this.saveManager.data.stats.totalEnemiesKilled = (this.saveManager.data.stats.totalEnemiesKilled || 0) + 1;
          this.saveManager.checkAchievements("enemy_killed", null, this);
          if (enemy.isBoss) {
            let bossKey = "";
            if (enemy.type === "boss_executioner" || enemy.type === "executioner") bossKey = "executioner";
            else if (enemy.type === "boss_golem" || enemy.type === "golem") bossKey = "golem";
            else if (enemy.type === "boss_baron" || enemy.type === "death_baron") bossKey = "death_baron";
            this.saveManager.data.stats.totalBossesKilled = (this.saveManager.data.stats.totalBossesKilled || 0) + 1;
            this.saveManager.checkAchievements("boss_killed", { type: bossKey }, this);
          }
        }
        if (this.player.onEnemyKilled) {
          this.player.onEnemyKilled(enemy, this);
        }
        this.particles.createBloodSparks(enemy.x, enemy.y, 8, enemy.color);
        this.gems.push(new MedievalSurvivors.XpGem(enemy.x, enemy.y, enemy.xpValue));
        let goldDrop = 0;
        if (enemy.isBoss) {
          goldDrop = enemy.bossTier === 3 ? 50 : enemy.bossTier === 2 ? 30 : 18;
        } else if (enemy.isChampion) {
          goldDrop = Math.max(1, Math.round(2 * (this.player.goldMultiplier || 1)));
        } else if (Math.random() < 0.08) {
          goldDrop = 1;
        }
        if (goldDrop > 0) {
          this.player.gold += goldDrop;
          this.addFloatingText(enemy.x, enemy.y - 12, `+${goldDrop} 💰`, "#ffeaa7", false);
        }
        let etherDrop = 0;
        if (enemy.isBoss) {
          etherDrop = enemy.bossTier === 3 ? 35 : enemy.bossTier === 2 ? 20 : 12;
        } else if (enemy.isChampion) {
          if (Math.random() < 0.7) {
            etherDrop = Math.max(1, Math.round(1 * (this.player.etherMultiplier || 1)));
          }
        } else if (Math.random() < 0.05) {
          etherDrop = 1;
        }
        if (etherDrop > 0) {
          const gained = this.player.addEther ? this.player.addEther(etherDrop, false) : etherDrop;
          this.addFloatingText(enemy.x, enemy.y - 24, `+${gained} 🔮`, "#bb86fc", false);
        }
        if (enemy.dropChest || enemy.isChampion) {
          const chestTier = enemy.isChampion ? 1 : enemy.bossTier || 1;
          this.chests.push(new MedievalSurvivors.TreasureChest(enemy.x, enemy.y, chestTier));
          this.renderer.triggerShake(8, 0.4);
        }
        if (this.renderer && this.renderer.destroyEnemyMesh) {
          this.renderer.destroyEnemyMesh(enemy.id);
        }
        if (enemy.destroy) {
          enemy.destroy();
        }
        this.enemies.splice(i, 1);
      }
    }
    if (this.gems.length > 75 && this.frameCount % 60 === 0) {
      this.consolidateGems();
    }
    let triggeredLevelUp = false;
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const status = this.gems[i].update(dt, this.player);
      if (status === "LEVEL_UP") {
        triggeredLevelUp = true;
      }
      if (!this.gems[i].alive) {
        this.gems.splice(i, 1);
      }
    }
    this.updateDestructibles(dt);
    if (this.collectibles) {
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const item = this.collectibles[i];
        item.update(dt, this.player, this);
        if (!item.alive) {
          this.collectibles.splice(i, 1);
        }
      }
    }
    for (let i = this.chests.length - 1; i >= 0; i--) {
      const chestTier = this.chests[i].update(dt, this.player);
      if (chestTier !== null) {
        this.chests.splice(i, 1);
        this.state = "CHEST";
        this.ui.showChestModal(this.player, chestTier);
        return;
      }
    }
    this.particles.update(dt);
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      const keep = ft.update(dt);
      if (!keep) {
        this.floatingTextPool.release(ft);
        this.floatingTexts.splice(i, 1);
      }
    }
    this.ui.updateHUD(this.player, this.gameTime);
    if (!this.player.alive) {
      this.state = "GAME_OVER";
      this.renderer.triggerShake(14, 0.8);
      this.saveManager.addGold(this.player.gold);
      if (this.saveManager.addEther && this.player.ether) {
        this.saveManager.addEther(this.player.ether);
      }
      const totalDmg = this.player.weapons.reduce((sum, w) => sum + w.totalDamageDealt, 0);
      const totalSecs = Math.floor(this.gameTime);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor(totalSecs % 3600 / 60);
      const secs = totalSecs % 60;
      const timeSurvived = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}` : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      this.saveManager.recordRun({
        hero: this.player.classDef.name,
        timeSurvived,
        timeSeconds: this.gameTime,
        level: this.player.level,
        kills: this.player.killCount,
        damage: totalDmg,
        goldEarned: this.player.gold,
        etherEarned: this.player.ether || 0,
        outcome: "DERROTA"
      });
      this.saveManager.save();
      this.submitRunToNeon();
      if (window.MedievalSurvivors.sound) {
        window.MedievalSurvivors.sound.setMusicIntensity(0, false);
        if (window.MedievalSurvivors.sound.startLobbyMusic) {
          window.MedievalSurvivors.sound.startLobbyMusic();
        } else if (window.MedievalSurvivors.sound.stopBgm) {
          window.MedievalSurvivors.sound.stopBgm();
        }
      }
      this.ui.showGameOver(this.player, this.gameTime);
      return;
    }
    if (triggeredLevelUp) {
      if (this.saveManager) {
        this.saveManager.checkAchievements("level_up", null, this);
      }
      this.state = "LEVEL_UP";
      this.ui.showLevelUpModal(this.player);
    }
  }
  submitRunToNeon() {
    if (!this.player) return;
    if (!this.isRankedMode) {
      console.log("[Leaderboard] Partida casual: pontuação não computada no ranking competitivo.");
      return;
    }
    try {
      const payload = {
        playerName: this.saveManager && this.saveManager.data.settings && this.saveManager.data.settings.playerName || "Guerreiro de Valoria",
        classId: this.player.classDef.id,
        timeSurvived: Math.floor(this.gameTime),
        level: this.player.level,
        kills: this.player.killCount,
        gold: this.player.gold,
        hyperMode: !!this.hyperMode,
        curseRank: this.curseRank || 0,
        isRanked: true
      };
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {
      });
    } catch (e) {
    }
  }
}
window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.Game = Game;
window.TheFallenKingdom = window.MedievalSurvivors;

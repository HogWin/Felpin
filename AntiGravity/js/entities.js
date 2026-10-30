/**
 * Medieval Survivors - Entities: Player, XP Gems, Chests, Floating Numbers, Particles
 */

// Player Entity
class Player {
  constructor(classDef, x = 0, y = 0) {
    this.classDef = classDef;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 21;
    this.facingAngle = 0;
    this.facingDir = 1; // 1 for right, -1 for left
    this.aimingWithMouse = true;
    this.walkCycle = 0;

    // Base stats from chosen class
    this.baseMaxHp = classDef.stats.maxHp;
    this.bonusMaxHp = 0;
    this.maxHp = this.baseMaxHp;
    this.hp = this.maxHp;

    this.baseArmor = classDef.stats.armor;
    this.bonusArmor = 0;

    this.baseMoveSpeed = classDef.stats.moveSpeed * 60; // Convert to pixels/sec
    this.speedMultiplier = 1.0;

    this.baseDamageMultiplier = classDef.stats.damageMultiplier;
    this.bonusDamageMultiplier = 0;

    this.baseAreaMultiplier = classDef.stats.areaMultiplier;
    this.bonusAreaMultiplier = 0;

    this.cooldownReduction = 0;

    this.basePickupRadius = classDef.stats.pickupRadius;
    this.magnetMultiplier = 1.0;

    this.baseHpRegen = classDef.stats.hpRegen;
    this.bonusHpRegen = 0;
    this.regenAccumulator = 0;

    // Bonus Projectiles & Reroll Charges
    this.metaBonusProjectiles = 0;
    this.runBonusProjectiles = 0;
    this.rerolls = 1;
    this.maxRerolls = 1;
    this.banishCharges = 2;
    this.bannedIds = new Set();

    // Progression
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = this.calculateXpForLevel(1);

    // Equipment
    this.weapons = [];
    this.passives = new Map(); // passive_id -> level

    // Combat state
    this.invulnerableTimer = 0;
    this.invulnerableDuration = 0.5;
    this.alive = true;
    this.killCount = 0;
    this.gold = 0;

    // Class perk traits
    this.shadowBurstTimer = 0;
    this.soulKillCount = 0;
    this.baseCritChance = classDef.id === 'assassin' ? 0.25 : 0.05;
    this.critMultiplier = classDef.id === 'assassin' ? 2.5 : 1.5;

    // Initialize starting weapon
    const startingWep = window.MedievalSurvivors.weapons.create(classDef.startingWeapon);
    if (startingWep) {
      startingWep.upgrade(); // Starts at level 1
      this.weapons.push(startingWep);
    }
  }

  get bonusProjectiles() {
    return (this.metaBonusProjectiles || 0) + (this.runBonusProjectiles || 0);
  }

  get effectiveArmor() {
    return this.baseArmor + this.bonusArmor;
  }

  get damageMultiplier() {
    let base = (this.baseDamageMultiplier || 1.0) * (1 + (this.bonusDamageMultiplier || 0));
    // Berserker perk: Fúria Sangrenta (Gains up to +65% damage when low HP)
    if (this.classDef.id === 'berserker') {
      const missing = 1 - Math.max(0, this.hp / this.maxHp);
      base *= (1 + missing * 0.65);
    }
    return base;
  }

  get effectiveDamageMultiplier() {
    return this.damageMultiplier;
  }

  get effectiveCooldownReduction() {
    let red = this.cooldownReduction || 0;
    // Berserker perk: Fúria Sangrenta (Gains up to +35% attack speed when low HP)
    if (this.classDef.id === 'berserker') {
      const missing = 1 - Math.max(0, this.hp / this.maxHp);
      red = Math.min(0.65, red + missing * 0.35);
    }
    return red;
  }

  get areaMultiplier() {
    return (this.baseAreaMultiplier || 1.0) * (1 + (this.bonusAreaMultiplier || 0));
  }

  get effectiveAreaMultiplier() {
    return this.areaMultiplier;
  }

  get effectiveMoveSpeed() {
    let speed = this.baseMoveSpeed * this.speedMultiplier;
    const game = window.MedievalSurvivors && window.MedievalSurvivors.game;
    if (game && game.hyperMode) {
      speed *= 1.25; // +25% velocidade no Modo Hiper!
    }
    if (this.shadowBurstTimer > 0) {
      speed *= 1.4; // Assassin speed surge on critical strikes
    }
    return speed;
  }

  get effectivePickupRadius() {
    return this.basePickupRadius * this.magnetMultiplier;
  }

  get effectiveHpRegen() {
    return this.baseHpRegen + this.bonusHpRegen;
  }

  calculateXpForLevel(lvl) {
    // Steeper mid/late game curve: rapid early level-ups, rewarding pacing throughout 15-minute run
    if (lvl <= 5) {
      return Math.floor(14 + lvl * 12);
    }
    return Math.floor(20 + Math.pow(lvl, 1.60) * 10);
  }

  addXp(amount) {
    const game = window.MedievalSurvivors && window.MedievalSurvivors.game;
    let earned = amount;
    if (game && game.hyperMode) {
      earned = Math.round(earned * 1.30); // +30% Ganho de XP em Modo Hiper!
    }
    this.xp += earned;
    this.totalGemsCollected = (this.totalGemsCollected || 0) + 1;
    if (game && game.saveManager) {
      game.saveManager.checkAchievements('gem_collected', null, game);
    }
    let leveledUp = false;

    while (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = this.calculateXpForLevel(this.level);
      leveledUp = true;
    }

    return leveledUp;
  }

  takeDamage(amount) {
    if (!this.alive || this.invulnerableTimer > 0) return 0;

    // Armor damage reduction: flat reduction, with a guaranteed minimum 25% of incoming damage piercing through
    const minDamage = Math.max(1, Math.round(amount * 0.25));
    const reduced = Math.max(minDamage, Math.round(amount - this.effectiveArmor));
    this.hp -= reduced;
    this.invulnerableTimer = this.invulnerableDuration;

    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playPlayerHurt) {
      window.MedievalSurvivors.sound.playPlayerHurt();
    }

    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer) {
      window.MedievalSurvivors.game.renderer.triggerDamageFlash(0.28);
      window.MedievalSurvivors.game.renderer.triggerShake(4, 0.18);
    }

    // Dark Knight perk: Retaliação de Espinhos
    if (this.classDef.id === 'dark_knight' && window.MedievalSurvivors.game) {
      this.triggerThornBurst(reduced, window.MedievalSurvivors.game);
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }

    return reduced;
  }

  triggerThornBurst(damageTaken, game) {
    if (!game || !game.enemies) return;
    const thornDamage = Math.round(25 + damageTaken * 1.5);
    const radius = 95;
    for (let i = 0, len = game.enemies.length; i < len; i++) {
      const e = game.enemies[i];
      if (!e.alive) continue;
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      if (dx * dx + dy * dy <= radius * radius) {
        const d = Math.hypot(dx, dy) || 1;
        e.takeDamage(thornDamage, dx / d, dy / d, 18);
      }
    }
    if (game.particles && game.particles.createExplosionWave) {
      game.particles.createExplosionWave(this.x, this.y, 45, '#e74c3c');
    }
    if (game.renderer && game.renderer.triggerShake) {
      game.renderer.triggerShake(6, 0.25);
    }
  }

  onCriticalHit() {
    this.shadowBurstTimer = 1.2;
  }

  onEnemyKilled(enemy, game) {
    if (this.classDef.id === 'necromancer') {
      this.soulKillCount = (this.soulKillCount || 0) + 1;
      if (this.soulKillCount >= 12) {
        this.soulKillCount = 0;
        this.summonAlliedSkeleton(game);
      }
    } else if (this.classDef.id === 'plague_alchemist' || (enemy && enemy.isPoisoned)) {
      if (game && game.particles && game.particles.createExplosionWave) {
        game.particles.createExplosionWave(enemy.x, enemy.y, 40, '#2ecc71');
      }
      if (game && game.enemies) {
        const poisonArea = 80;
        for (let i = 0, len = game.enemies.length; i < len; i++) {
          const other = game.enemies[i];
          if (!other.alive || other === enemy) continue;
          const dx = other.x - enemy.x;
          const dy = other.y - enemy.y;
          if (dx * dx + dy * dy <= poisonArea * poisonArea) {
            other.isPoisoned = true;
            other.takeDamage(28, dx / (Math.hypot(dx, dy) || 1), dy / (Math.hypot(dx, dy) || 1), 6);
          }
        }
      }
    }
  }

  summonAlliedSkeleton(game) {
    if (!game || !game.allies) return;
    const offsetAng = Math.random() * Math.PI * 2;
    const ax = this.x + Math.cos(offsetAng) * 35;
    const ay = this.y + Math.sin(offsetAng) * 35;
    const ally = new AlliedSkeleton(ax, ay, Math.round(36 * this.damageMultiplier));
    game.allies.push(ally);
    if (game.floatingTexts) {
      game.addFloatingText(this.x, this.y - 25, "PACTO DAS OSSADAS!", "#9b59b6", true);
    }
  }

  heal(amount) {
    if (!this.alive) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  update(dt, inputDir, enemies, projectiles, particles) {
    if (!this.alive) return;

    if (this.shadowBurstTimer > 0) {
      this.shadowBurstTimer -= dt;
    }

    // Movement
    const isMoving = inputDir.x !== 0 || inputDir.y !== 0;
    if (isMoving) {
      // Normalize
      const mag = Math.hypot(inputDir.x, inputDir.y) || 1;
      const speed = this.effectiveMoveSpeed;
      this.vx = (inputDir.x / mag) * speed;
      this.vy = (inputDir.y / mag) * speed;

      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (!this.aimingWithMouse) {
        this.facingAngle = Math.atan2(this.vy, this.vx);
      }
      if (Math.cos(this.facingAngle) > 0.1) this.facingDir = 1;
      else if (Math.cos(this.facingAngle) < -0.1) this.facingDir = -1;

      this.walkCycle += dt * 10;
    } else {
      this.vx = 0;
      this.vy = 0;
      if (Math.cos(this.facingAngle) > 0.1) this.facingDir = 1;
      else if (Math.cos(this.facingAngle) < -0.1) this.facingDir = -1;
    }

    // Bounded Square Arena Constraint: player stays firmly within the gothic fortress arena
    const arenaLimit = (window.MedievalSurvivors && window.MedievalSurvivors.ARENA_HALF_LIMIT) || 1525;
    this.x = Math.max(-arenaLimit, Math.min(arenaLimit, this.x));
    this.y = Math.max(-arenaLimit, Math.min(arenaLimit, this.y));

    // Health Regeneration
    if (this.effectiveHpRegen > 0 && this.hp < this.maxHp) {
      this.regenAccumulator += dt;
      if (this.regenAccumulator >= 1.0) {
        this.heal(this.effectiveHpRegen);
        this.regenAccumulator = 0;
      }
    }

    // Invulnerability frames
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Update weapons
    this.weapons.forEach(w => {
      w.update(dt, this, enemies, projectiles, particles);
    });
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Flashing when damaged
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 17, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Draw Player Character (flipped if facing left, slightly larger)
    ctx.save();
    ctx.scale(this.facingDir * 1.28, 1.28);

    const bob = Math.sin(this.walkCycle) * 2;

    // Cape
    ctx.fillStyle = this.classDef.accentColor || '#8b0000';
    ctx.beginPath();
    ctx.moveTo(-6, -2 + bob);
    ctx.lineTo(-15, 14 + bob);
    ctx.lineTo(2, 14 + bob);
    ctx.lineTo(4, 2 + bob);
    ctx.closePath();
    ctx.fill();

    // Body (Medieval Plate Armor / Tunica)
    ctx.fillStyle = '#4a5568'; // Steel
    ctx.fillRect(-8, -10 + bob, 16, 20);

    // Golden Armor Trim
    ctx.fillStyle = this.classDef.color || '#d4af37';
    ctx.fillRect(-8, -10 + bob, 16, 4);
    ctx.fillRect(-3, -6 + bob, 6, 16);

    // Helmet / Head
    ctx.fillStyle = '#718096'; // Polished steel helmet
    ctx.beginPath();
    ctx.arc(0, -16 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Helmet Visor Slit
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, -17 + bob, 6, 3);

    // Plume / Feather on helmet
    ctx.fillStyle = this.classDef.accentColor || '#e63946';
    ctx.beginPath();
    ctx.moveTo(-2, -24 + bob);
    ctx.lineTo(4, -28 + bob);
    ctx.lineTo(1, -22 + bob);
    ctx.closePath();
    ctx.fill();

    // Shield on left/back arm
    ctx.fillStyle = '#9b111e';
    ctx.beginPath();
    ctx.moveTo(-11, -8 + bob);
    ctx.lineTo(-5, -8 + bob);
    ctx.lineTo(-5, 4 + bob);
    ctx.lineTo(-8, 9 + bob);
    ctx.lineTo(-11, 4 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore(); // Restore facingDir flip

    // 2. Draw Directional Attack Indicator Arrow (Setinha de Direção)
    this.renderAimArrow(ctx);

    ctx.restore(); // Restore player translation
  }

  renderAimArrow(ctx) {
    ctx.save();
    ctx.rotate(this.facingAngle);

    // Subtle gentle breathing pulse (compact size)
    const pulse = Math.sin(Date.now() / 150) * 1.8;
    const arrowDist = 26 + pulse;

    // Glowing aim dash trajectory (shorter and cleaner)
    ctx.strokeStyle = 'rgba(240, 192, 90, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(arrowDist - 2, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Golden Directional Arrowhead (sleek, compact)
    ctx.translate(arrowDist, 0);
    ctx.shadowColor = '#f0c05a';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#f0c05a';

    ctx.beginPath();
    ctx.moveTo(7, 0);          // Tip
    ctx.lineTo(-5, -5);        // Top barb
    ctx.lineTo(-1.5, 0);       // Inner notch
    ctx.lineTo(-5, 5);         // Bottom barb
    ctx.closePath();
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(-1.5, -2);
    ctx.lineTo(0, 0);
    ctx.lineTo(-1.5, 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// XP Gem Entity (supports Concentrated XP clusters with numeric sum display)
class XpGem {
  constructor(x, y, value = 1, isConcentrated = false) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.isConcentrated = isConcentrated;
    this.radius = 7;
    this.alive = true;
    this.attracted = false;
    this.speed = 100;
    this.floatTimer = Math.random() * Math.PI * 2;
    this.updateVisualStyle();
  }

  updateVisualStyle() {
    if (this.isConcentrated) {
      this.color = this.value >= 100 ? '#e056fd' : '#ff9f43';
      this.radius = Math.min(18, 12 + Math.floor(Math.log10(Math.max(10, this.value)) * 2));
      return;
    }

    // Visual styles by tier
    if (this.value >= 100) {
      this.color = '#e056fd'; // Purple Relic Soul
      this.radius = 11;
    } else if (this.value >= 25) {
      this.color = '#f0c05a'; // Gold Soul
      this.radius = 9;
    } else if (this.value >= 5) {
      this.color = '#00d2d3'; // Cyan / Silver Soul
      this.radius = 8;
    } else {
      this.color = '#2ed573'; // Emerald Green Soul
      this.radius = 6;
    }
  }

  update(dt, player) {
    if (!this.alive) return null;
    this.floatTimer += dt * 3;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distSq = dx * dx + dy * dy;
    const pickupR = player.effectivePickupRadius;

    // Trigger attraction when inside player's pickup radius
    if (!this.attracted && distSq <= pickupR * pickupR) {
      this.attracted = true;
    }

    if (this.attracted) {
      const dist = Math.sqrt(distSq) || 1;
      this.speed += 850 * dt; // Accelerate towards player
      const moveDist = this.speed * dt;

      if (dist <= player.radius + this.radius || moveDist >= dist) {
        // Collected!
        this.alive = false;
        const leveledUp = player.addXp(this.value);
        window.MedievalSurvivors.sound.playGemPickup();
        return leveledUp ? 'LEVEL_UP' : 'COLLECTED';
      } else {
        this.x += (dx / dist) * moveDist;
        this.y += (dy / dist) * moveDist;
      }
    }

    return null;
  }

  render(ctx) {
    if (!this.alive) return;
    const bob = Math.sin(this.floatTimer) * 3;

    ctx.save();
    ctx.translate(this.x, this.y + bob);

    if (this.isConcentrated) {
      // Concentrated XP Cluster: Radiant Octagonal/Star Crystal + Sum Number
      const pulse = 1 + Math.sin(this.floatTimer * 1.5) * 0.1;
      const r = this.radius * pulse;

      // Outer aura ring
      ctx.fillStyle = 'rgba(255, 159, 67, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffeaa7';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
      ctx.stroke();

      // Main concentrated crystal body
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.15);
      ctx.lineTo(r * 0.85, -r * 0.4);
      ctx.lineTo(r * 0.85, r * 0.4);
      ctx.lineTo(0, r * 1.15);
      ctx.lineTo(-r * 0.85, r * 0.4);
      ctx.lineTo(-r * 0.85, -r * 0.4);
      ctx.closePath();
      ctx.fill();

      // Inner core shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Display the numeric sum of all XP in that region
      const label = `${this.value}`;
      ctx.font = 'bold 12px Cinzel, Georgia, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.strokeText(label, 0, -r - 9);
      ctx.fillStyle = '#ffeaa7';
      ctx.fillText(label, 0, -r - 9);

      ctx.restore();
      return;
    }

    // Standard Diamond gem shape (no shadowBlur for high FPS)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, 0);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius, 0);
    ctx.closePath();
    ctx.fill();

    // Inner bright shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -this.radius * 0.4);
    ctx.lineTo(this.radius * 0.4, 0);
    ctx.lineTo(0, this.radius * 0.4);
    ctx.lineTo(-this.radius * 0.4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// Treasure Chest Entity (Dropped by Mini-bosses)
class TreasureChest {
  constructor(x, y, tier = 1) {
    this.x = x;
    this.y = y;
    this.tier = tier; // 1 = Silver, 2 = Gold, 3 = Royal
    this.radius = 18;
    this.alive = true;
    this.pulse = 0;
  }

  update(dt, player) {
    if (!this.alive) return null;
    this.pulse += dt * 4;

    const dist = Math.hypot(player.x - this.x, player.y - this.y);
    if (dist <= player.radius + this.radius) {
      this.alive = false;
      window.MedievalSurvivors.sound.playChestOpen();
      return this.tier;
    }
    return null;
  }

  render(ctx) {
    if (!this.alive) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    // Glowing halo
    const glow = Math.sin(this.pulse) * 4 + 14;
    ctx.fillStyle = 'rgba(240, 192, 90, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, glow + 10, 0, Math.PI * 2);
    ctx.fill();

    // Chest Body
    ctx.fillStyle = '#5c3a21'; // Oak wood
    ctx.fillRect(-14, -8, 28, 20);

    // Metal Trim
    ctx.fillStyle = this.tier >= 2 ? '#f1c40f' : '#bdc3c7';
    ctx.fillRect(-14, -8, 28, 4);
    ctx.fillRect(-14, 8, 28, 4);
    ctx.fillRect(-4, -4, 8, 8); // Lock

    ctx.restore();
  }
}

// Floating Damage Numbers
class FloatingText {
  constructor(x, y, text, color = '#ffffff', isCritical = false) {
    this.reset(x, y, text, color, isCritical);
  }

  reset(x, y, text, color = '#ffffff', isCritical = false) {
    this.x = x + (Math.random() - 0.5) * 16;
    this.y = y - 10;
    this.text = text;
    this.color = color;
    this.isCritical = isCritical;
    this.life = 0.8;
    this.maxLife = 0.8;
    this.vy = -(60 + Math.random() * 30);
  }

  update(dt) {
    this.life -= dt;
    this.y += this.vy * dt;
    return this.life > 0;
  }

  render(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.font = this.isCritical ? 'bold 18px Cinzel, Georgia' : 'bold 13px Cinzel, Georgia';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Zero-allocation Object Pool for Floating Damage Texts
class FloatingTextPool {
  constructor(initialSize = 120) {
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new FloatingText(0, 0, ''));
    }
  }

  acquire(x, y, text, color = '#ffffff', isCritical = false) {
    const ft = this.pool.pop();
    if (!ft) {
      return new FloatingText(x, y, text, color, isCritical);
    }
    ft.reset(x, y, text, color, isCritical);
    return ft;
  }

  release(ft) {
    if (this.pool.length < 240) {
      this.pool.push(ft);
    }
  }
}

// Particle System (Directly hooked to WebGL 3D Point Particle engine for 60 FPS zero-allocation combat)
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createBloodSparks(x, y, count = 3, color = '#e63946') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xe63946, count, 35);
    }
  }

  createSpark(x, y, color = '#f39c12') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xf39c12, 1, 20);
    }
  }

  createExplosionWave(x, y, radius, color = '#e67e22') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xff6600, 16, radius * 1.5);
    }
  }

  update(dt) {
    // 3D WebGL particle simulation is handled inside GameRenderer.update3DParticles
  }

  render(ctx) {
    // Rendered via WebGL Three.js Points
  }
}

// Allied Skeleton Servant (Necromancer's Pact of Bones)
class AlliedSkeleton {
  constructor(x, y, damage = 35) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 145;
    this.damage = damage;
    this.alive = true;
    this.life = 20.0;
    this.maxLife = 20.0;
    this.target = null;
    this.attackCooldown = 0;
    this.facingAngle = 0;
    this.walkCycle = 0;
    this.isAlly = true;
  }

  update(dt, player, enemies, particles) {
    this.life -= dt;
    if (this.life <= 0) {
      this.alive = false;
      return false;
    }

    this.walkCycle += dt * 8;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    // Find nearest alive enemy
    if (!this.target || !this.target.alive) {
      let nearest = null;
      let minDistSq = 450 * 450;
      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dSq = (e.x - this.x) * (e.x - this.x) + (e.y - this.y) * (e.y - this.y);
        if (dSq < minDistSq) {
          minDistSq = dSq;
          nearest = e;
        }
      }
      this.target = nearest;
    }

    let targetX = player.x + 30;
    let targetY = player.y + 30;

    if (this.target && this.target.alive) {
      targetX = this.target.x;
      targetY = this.target.y;
    }

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist > 16) {
      const vx = (dx / dist) * this.speed;
      const vy = (dy / dist) * this.speed;
      this.x += vx * dt;
      this.y += vy * dt;
      this.facingAngle = Math.atan2(vy, vx);
    }

    // Strike enemy
    if (this.target && this.target.alive && dist <= this.radius + this.target.radius + 14) {
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 0.55;
        this.target.takeDamage(this.damage, dx / dist, dy / dist, 12);
        if (particles && particles.createBloodSparks) {
          particles.createBloodSparks(this.target.x, this.target.y, 4, '#9b59b6');
        }
      }
    }

    return true;
  }
}

// Destructible World Objects (Barrels, Crates, Sarcophagi)
class DestructibleObject {
  constructor(x, y, type = 'barrel') {
    this.x = x;
    this.y = y;
    this.type = type; // 'barrel', 'crate', 'sarcophagus'
    this.radius = type === 'sarcophagus' ? 22 : 16;
    this.hp = type === 'sarcophagus' ? 2 : 1;
    this.maxHp = this.hp;
    this.alive = true;
    this.hitFlash = 0;
  }

  takeDamage(amount, game) {
    if (!this.alive) return;
    this.hp -= amount;
    this.hitFlash = 0.15;
    if (this.hp <= 0) {
      this.destroy(game);
    }
  }

  destroy(game) {
    this.alive = false;
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playWoodHit) {
      window.MedievalSurvivors.sound.playWoodHit();
    } else if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playEnemyHit) {
      window.MedievalSurvivors.sound.playEnemyHit();
    }

    if (game && game.renderer && game.renderer.triggerShake) {
      game.renderer.triggerShake(4, 0.2);
    }

    if (game && game.particles && game.particles.createBloodSparks) {
      const color = this.type === 'sarcophagus' ? '#95a5a6' : '#8d6e63';
      game.particles.createBloodSparks(this.x, this.y, 14, color);
    }

    if (!game || !game.player) return;

    if (game.saveManager) {
      if (!game.saveManager.data.stats) game.saveManager.data.stats = {};
      game.saveManager.data.stats.totalDestructiblesSmashed = (game.saveManager.data.stats.totalDestructiblesSmashed || 0) + 1;
      game.saveManager.checkAchievements('destructible_smashed', null, game);
    }

    // Determine drop (Balanced sustain: 20% meat, 15% magnet, 15% blast, 50% gold)
    const roll = Math.random();
    if (roll < 0.20) {
      // 🍗 Roast Meat / Health Potion (Restores 20% max HP)
      const healAmount = Math.max(15, Math.round(game.player.maxHp * 0.20));
      game.player.heal(healAmount);
      game.addFloatingText(this.x, this.y - 12, `+${healAmount} HP 🍗`, '#2ecc71', true);
      if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playGemPickup) {
        window.MedievalSurvivors.sound.playGemPickup();
      }
    } else if (roll < 0.35) {
      // 🧲 Sacred Super Magnet (Vácuo de Almas)
      if (game.gems) {
        for (let i = 0, len = game.gems.length; i < len; i++) {
          game.gems[i].attracted = true;
          game.gems[i].speed = 650;
        }
      }
      game.addFloatingText(this.x, this.y - 15, `VÁCUO SAGRADO! 🧲`, '#3498db', true);
      if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playLevelUp) {
        window.MedievalSurvivors.sound.playLevelUp();
      }
    } else if (roll < 0.50) {
      // 💣 Holy Blast (Purificação dos Invasores)
      const blastRadius = 240;
      if (game.enemies) {
        for (let i = 0, len = game.enemies.length; i < len; i++) {
          const e = game.enemies[i];
          if (!e.alive) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          if (dx * dx + dy * dy <= blastRadius * blastRadius) {
            e.takeDamage(120, dx / (Math.hypot(dx, dy) || 1), dy / (Math.hypot(dx, dy) || 1), 22);
          }
        }
      }
      if (game.particles && game.particles.createExplosionWave) {
        game.particles.createExplosionWave(this.x, this.y, 75, '#f39c12');
      }
      game.addFloatingText(this.x, this.y - 15, `EXPLOSÃO SAGRADA! 💣`, '#e67e22', true);
    } else {
      // 💰 Gold Pouch (Moedas de Ouro)
      const goldAmt = Math.round((25 + Math.floor(Math.random() * 35)) * (game.player.goldMultiplier || 1));
      game.player.gold += goldAmt;
      game.addFloatingText(this.x, this.y - 12, `+${goldAmt} 💰`, '#ffeaa7', true);
      if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playGemPickup) {
        window.MedievalSurvivors.sound.playGemPickup();
      }
    }
  }

  update(dt) {
    if (this.hitFlash > 0) this.hitFlash -= dt;
  }
}

// ==================== ARENA DYNAMIC EVENTS ====================

/**
 * Sacred Sanctuary Zone (Círculo do Santuário Sagrado)
 * Spawns a glowing runic holy circle that demands player presence for 10 cumulative seconds.
 * Upon consecration, unleashes a divine shockwave wiping nearby enemies and awards a Golden Relic Chest!
 */
class SanctuaryZone {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 90;
    this.consecrateTime = 0;
    this.requiredTime = 10;
    this.alive = true;
    this.isConsecrated = false;
    this.playerInside = false;
    this.soundTimer = 0;
    this.despawnTimer = 75; // Fades if ignored for 75 seconds
  }

  update(dt, player, game) {
    if (!this.alive) return false;

    this.despawnTimer -= dt;
    if (this.despawnTimer <= 0) {
      this.alive = false;
      return false;
    }

    if (player && player.alive) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      this.playerInside = (dx * dx + dy * dy) <= (this.radius * this.radius);

      if (this.playerInside) {
        this.consecrateTime += dt;
        this.soundTimer -= dt;
        if (this.soundTimer <= 0) {
          if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSanctuaryActive) {
            window.MedievalSurvivors.sound.playSanctuaryActive();
          }
          this.soundTimer = 0.55;
        }

        // Emit holy upward sparkles
        if (game.particles && Math.random() < 0.4) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkDist = Math.random() * (this.radius * 0.8);
          game.particles.createBloodSparks(
            this.x + Math.cos(sparkAngle) * sparkDist,
            this.y + Math.sin(sparkAngle) * sparkDist,
            2,
            '#f1c40f'
          );
        }

        // Consecration achieved!
        if (this.consecrateTime >= this.requiredTime) {
          this.consecrate(game);
          return false;
        }
      }
    } else {
      this.playerInside = false;
    }

    return true;
  }

  consecrate(game) {
    this.alive = false;
    this.isConsecrated = true;

    // 1. Divine Shockwave - damages and knocks back all enemies in large 340px area
    const blastRadius = 340;
    const enemies = game.enemies || [];
    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive) continue;
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const distSq = dx * dx + dy * dy;
      if (distSq <= blastRadius * blastRadius) {
        const dist = Math.sqrt(distSq) || 1;
        e.takeDamage(420, dx / dist, dy / dist, 35);
      }
    }

    // 2. Guaranteed Golden Relic Chest
    if (game.chests) {
      const ChestClass = (window.MedievalSurvivors && window.MedievalSurvivors.TreasureChest) || TreasureChest;
      game.chests.push(new ChestClass(this.x, this.y, 3));
    }

    // 3. Audio & Juice
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSanctuaryComplete) {
      window.MedievalSurvivors.sound.playSanctuaryComplete();
    }
    if (game.renderer && game.renderer.triggerShake) {
      game.renderer.triggerShake(12, 0.65);
    }
    if (game.particles && game.particles.createExplosionWave) {
      game.particles.createExplosionWave(this.x, this.y, 110, '#f1c40f');
    }
    game.addFloatingText(this.x, this.y - 20, 'SANTUÁRIO CONSAGRADO! ✨', '#ffd700', true);

    // 4. UI Banner
    if (game.ui && game.ui.showEventBanner) {
      game.ui.showEventBanner(
        '✨ SANTUÁRIO SAGRADO CONSAGRADO!',
        'A glória dos ancestrais expurgou os invasores e revelou um Baú Real!',
        '#f1c40f'
      );
    }

    // 5. Achievement Check & Stat Tracking
    if (game.saveManager) {
      if (!game.saveManager.data.stats) game.saveManager.data.stats = {};
      game.saveManager.data.stats.totalSanctuariesConsecrated = (game.saveManager.data.stats.totalSanctuariesConsecrated || 0) + 1;
      game.saveManager.checkAchievements('sanctuary_consecrated', null, game);
    }
  }
}

/**
 * Celestial Strike (Chuva de Fogo Celestial)
 * Telegraphed environmental column of holy flame that detonates after a 1.35s warning.
 * Strategic hazard that deals 280 damage to hordes and minor burn (12 dmg) to player.
 */
class CelestialStrike {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 68;
    this.timer = 1.35;
    this.maxTimer = 1.35;
    this.detonated = false;
    this.alive = true;
    this.impactDuration = 0.50; // Visual pillar duration

    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playMeteorTelegraph) {
      window.MedievalSurvivors.sound.playMeteorTelegraph();
    }
  }

  update(dt, player, game) {
    if (!this.alive) return false;

    if (!this.detonated) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.detonate(player, game);
      }
    } else {
      this.impactDuration -= dt;
      if (this.impactDuration <= 0) {
        this.alive = false;
        return false;
      }
    }

    return true;
  }

  detonate(player, game) {
    this.detonated = true;

    // 1. Holy fire blast on nearby enemies
    const enemies = game.enemies || [];
    const rSq = (this.radius + 15) * (this.radius + 15);
    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive) continue;
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      if (dx * dx + dy * dy <= rSq) {
        const dist = Math.hypot(dx, dy) || 1;
        e.takeDamage(280, dx / dist, dy / dist, 24);
      }
    }

    // 2. Check player hit (minor damage, rewards awareness)
    if (player && player.alive) {
      const pdx = player.x - this.x;
      const pdy = player.y - this.y;
      if (pdx * pdx + pdy * pdy <= (this.radius + 10) * (this.radius + 10)) {
        player.takeDamage(12);
        if (game.renderer && game.renderer.triggerDamageFlash) {
          game.renderer.triggerDamageFlash(0.2);
        }
      }
    }

    // 3. Audio & Juice
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playMeteorImpact) {
      window.MedievalSurvivors.sound.playMeteorImpact();
    }
    if (game.renderer && game.renderer.triggerShake) {
      game.renderer.triggerShake(7, 0.35);
    }
    if (game.particles && game.particles.createExplosionWave) {
      game.particles.createExplosionWave(this.x, this.y, 60, '#e67e22');
    }
  }
}

/**
 * Arena Dynamic Event Manager
 * Coordinates in-run events (Flash Swarms, Sacred Sanctuaries, Celestial Storms)
 * on a balanced timeline, giving runs exciting variety, tension, and rewards!
 */
class ArenaEventManager {
  constructor() {
    this.sanctuaryZones = [];
    this.celestialStrikes = [];
    this.pendingStrikes = []; // Queued strikes for celestial storms
    this.eventTimeline = [
      { time: 135, type: 'swarm' },            // 2:15 - Swarm 1
      { time: 210, type: 'sanctuary' },        // 3:30 - Sanctuary 1
      { time: 270, type: 'celestial_storm' },  // 4:30 - Celestial Fire Storm (5 strikes)
      { time: 325, type: 'swarm' },            // 5:25 - Swarm 2
      { time: 420, type: 'sanctuary' },        // 7:00 - Sanctuary 2
      { time: 495, type: 'swarm' },            // 8:15 - Swarm 3 (Giant rush)
      { time: 570, type: 'celestial_storm' },  // 9:30 - Cataclysmic Celestial Storm (7 strikes)
      { time: 660, type: 'sanctuary' },        // 11:00 - Sanctuary 3
      { time: 730, type: 'swarm' }             // 12:10 - Final Horde Swarm
    ];
    this.nextEventIdx = 0;
    this.activeSanctuary = null;
  }

  reset() {
    this.sanctuaryZones = [];
    this.celestialStrikes = [];
    this.pendingStrikes = [];
    this.nextEventIdx = 0;
    this.activeSanctuary = null;
  }

  update(dt, game) {
    const t = game.gameTime;

    // 1. Check Event Timeline triggers
    while (this.nextEventIdx < this.eventTimeline.length) {
      const evt = this.eventTimeline[this.nextEventIdx];
      if (t >= evt.time) {
        this.nextEventIdx++;
        this.triggerEvent(evt.type, game);
      } else {
        break;
      }
    }

    // 2. Process Queued Celestial Storm Strikes
    for (let i = this.pendingStrikes.length - 1; i >= 0; i--) {
      const ps = this.pendingStrikes[i];
      ps.delay -= dt;
      if (ps.delay <= 0) {
        this.celestialStrikes.push(new CelestialStrike(ps.x, ps.y));
        this.pendingStrikes.splice(i, 1);
      }
    }

    // 3. Update Active Sanctuary Zones
    this.activeSanctuary = null;
    for (let i = this.sanctuaryZones.length - 1; i >= 0; i--) {
      const sz = this.sanctuaryZones[i];
      const keep = sz.update(dt, game.player, game);
      if (keep) {
        this.activeSanctuary = sz;
      } else {
        this.sanctuaryZones.splice(i, 1);
      }
    }

    // Update Sanctuary HUD Bar
    if (game.ui && game.ui.updateSanctuaryProgress) {
      if (this.activeSanctuary && this.activeSanctuary.playerInside) {
        game.ui.updateSanctuaryProgress(true, this.activeSanctuary.consecrateTime, this.activeSanctuary.requiredTime);
      } else {
        game.ui.updateSanctuaryProgress(false);
      }
    }

    // 4. Update Celestial Strikes
    for (let i = this.celestialStrikes.length - 1; i >= 0; i--) {
      const cs = this.celestialStrikes[i];
      const keep = cs.update(dt, game.player, game);
      if (!keep) {
        this.celestialStrikes.splice(i, 1);
      }
    }
  }

  triggerEvent(type, game) {
    if (type === 'swarm') {
      this.spawnFlashSwarm(game);
    } else if (type === 'sanctuary') {
      this.spawnSanctuary(game);
    } else if (type === 'celestial_storm') {
      this.triggerCelestialStorm(game);
    }
  }

  // Flash Swarm: Fast-moving horde crossing the arena in formation
  spawnFlashSwarm(game) {
    const player = game.player;
    if (!player) return;

    const count = 28;
    const spawnAngle = Math.random() * Math.PI * 2;
    const spawnDist = 520;
    const originX = player.x + Math.cos(spawnAngle) * spawnDist;
    const originY = player.y + Math.sin(spawnAngle) * spawnDist;

    // Rush direction towards player
    const targetAngle = Math.atan2(player.y - originY, player.x - originX);
    const scaling = 1.0 + (game.gameTime / 240);

    for (let i = 0; i < count; i++) {
      // Chevron / wedge formation
      const row = Math.floor(i / 5);
      const col = (i % 5) - 2;
      const offX = -Math.cos(targetAngle) * (row * 35) + -Math.sin(targetAngle) * (col * 30);
      const offY = -Math.sin(targetAngle) * (row * 35) + Math.cos(targetAngle) * (col * 30);

      const rat = new window.MedievalSurvivors.PlagueRatEnemy(originX + offX, originY + offY, scaling);
      rat.speed = 175; // Fast scurrying rush!
      rat.hp = Math.round(rat.hp * 0.85); // Slightly squishier to encourage satisfying AoE clears!
      rat.xpValue = 2; // Extra reward!
      game.enemies.push(rat);
    }

    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSwarmWarning) {
      window.MedievalSurvivors.sound.playSwarmWarning();
    }
    if (game.renderer && game.renderer.triggerShake) {
      game.renderer.triggerShake(7, 0.4);
    }
    if (game.ui && game.ui.showEventBanner) {
      game.ui.showEventBanner(
        '⚠️ ENXAME RELÂMPAGO!',
        'Uma debandada voraz de pragas cruza o campo de batalha!',
        '#e74c3c'
      );
    }

    setTimeout(() => {
      if (game && game.player && game.player.alive && game.saveManager) {
        game.saveManager.checkAchievements('swarm_survived', null, game);
      }
    }, 18000);
  }

  // Sacred Sanctuary Zone: Spawns near player and gives offscreen radar
  spawnSanctuary(game) {
    const player = game.player;
    if (!player) return;

    // Spawn 220-300px away in a random direction
    const angle = Math.random() * Math.PI * 2;
    const dist = 220 + Math.random() * 80;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;

    // Clamp inside arena
    const limit = ((window.MedievalSurvivors && window.MedievalSurvivors.ARENA_HALF_LIMIT) || 1525) - 100;
    const clampedX = Math.max(-limit, Math.min(limit, x));
    const clampedY = Math.max(-limit, Math.min(limit, y));

    this.sanctuaryZones.push(new SanctuaryZone(clampedX, clampedY));

    if (game.ui && game.ui.showEventBanner) {
      game.ui.showEventBanner(
        '✨ SANTUÁRIO SAGRADO SURGIU!',
        'Permaneça no círculo por 10s para consagrá-lo e obter um Baú Real!',
        '#f1c40f'
      );
    }
  }

  // Celestial Fire Storm: Multiple staggered strikes around the battlefield
  triggerCelestialStorm(game) {
    const player = game.player;
    if (!player) return;

    const strikeCount = 6;
    for (let i = 0; i < strikeCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const d = 50 + Math.random() * 260;
      this.pendingStrikes.push({
        x: player.x + Math.cos(ang) * d,
        y: player.y + Math.sin(ang) * d,
        delay: i * 0.85
      });
    }

    if (game.ui && game.ui.showEventBanner) {
      game.ui.showEventBanner(
        '⚡ CHUVA DE FOGO CELESTIAL!',
        'Colunas de fogo sagrado caem dos céus! Atraia os inimigos para o impacto!',
        '#e67e22'
      );
    }

    setTimeout(() => {
      if (game && game.player && game.player.alive && game.saveManager) {
        game.saveManager.checkAchievements('meteor_survived', null, game);
      }
    }, 9000);
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.Player = Player;
window.MedievalSurvivors.AlliedSkeleton = AlliedSkeleton;
window.MedievalSurvivors.XpGem = XpGem;
window.MedievalSurvivors.TreasureChest = TreasureChest;
window.MedievalSurvivors.FloatingText = FloatingText;
window.MedievalSurvivors.FloatingTextPool = FloatingTextPool;
window.MedievalSurvivors.ParticleSystem = ParticleSystem;
window.MedievalSurvivors.DestructibleObject = DestructibleObject;
window.MedievalSurvivors.SanctuaryZone = SanctuaryZone;
window.MedievalSurvivors.CelestialStrike = CelestialStrike;
window.MedievalSurvivors.ArenaEventManager = ArenaEventManager;

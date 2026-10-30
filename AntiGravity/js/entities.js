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
    return (this.baseDamageMultiplier || 1.0) * (1 + (this.bonusDamageMultiplier || 0));
  }

  get effectiveDamageMultiplier() {
    return this.damageMultiplier;
  }

  get areaMultiplier() {
    return (this.baseAreaMultiplier || 1.0) * (1 + (this.bonusAreaMultiplier || 0));
  }

  get effectiveAreaMultiplier() {
    return this.areaMultiplier;
  }

  get effectiveMoveSpeed() {
    return this.baseMoveSpeed * this.speedMultiplier;
  }

  get effectivePickupRadius() {
    return this.basePickupRadius * this.magnetMultiplier;
  }

  get effectiveHpRegen() {
    return this.baseHpRegen + this.bonusHpRegen;
  }

  calculateXpForLevel(lvl) {
    // Smooth RPG scaling curve
    return Math.floor(10 + Math.pow(lvl, 1.45) * 8);
  }

  addXp(amount) {
    this.xp += amount;
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

    // Armor damage reduction: flat reduction with minimum 1 damage
    const reduced = Math.max(1, amount - this.effectiveArmor);
    this.hp -= reduced;
    this.invulnerableTimer = this.invulnerableDuration;

    window.MedievalSurvivors.sound.playPlayerHurt();

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }

    return reduced;
  }

  heal(amount) {
    if (!this.alive) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  update(dt, inputDir, enemies, projectiles, particles) {
    if (!this.alive) return;

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

// Particle System (Optimized with pool cap & O(1) swap-and-pop)
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 180;
  }

  createBloodSparks(x, y, count = 3, color = '#e63946') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xe63946, count, 35);
    }
    if (this.particles.length >= this.maxParticles) return;
    const limit = Math.min(count, this.maxParticles - this.particles.length);
    for (let i = 0; i < limit; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        color: color,
        life: 0.3 + Math.random() * 0.15,
        maxLife: 0.45
      });
    }
  }

  createSpark(x, y, color = '#f39c12') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xf39c12, 1, 20);
    }
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 30,
      vy: -(30 + Math.random() * 40),
      size: 2,
      color: color,
      life: 0.35,
      maxLife: 0.35
    });
  }

  createExplosionWave(x, y, radius, color = '#e67e22') {
    if (window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer && window.MedievalSurvivors.game.renderer.spawn3DParticle) {
      window.MedievalSurvivors.game.renderer.spawn3DParticle(x, 10, y, 0xff6600, 16, radius * 1.5);
    }
    if (this.particles.length >= this.maxParticles) return;
    const count = 12;
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;
      const angle = (i / count) * Math.PI * 2;
      const speed = radius * 2.0;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3,
        color: color,
        life: 0.38,
        maxLife: 0.38
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }
  }

  render(ctx, camX = -Infinity, camY = -Infinity, camW = Infinity, camH = Infinity) {
    ctx.save();
    for (let i = 0, len = this.particles.length; i < len; i++) {
      const p = this.particles[i];
      if (p.x < camX || p.x > camX + camW || p.y < camY || p.y > camY + camH) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.restore();
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.Player = Player;
window.MedievalSurvivors.XpGem = XpGem;
window.MedievalSurvivors.TreasureChest = TreasureChest;
window.MedievalSurvivors.FloatingText = FloatingText;
window.MedievalSurvivors.ParticleSystem = ParticleSystem;

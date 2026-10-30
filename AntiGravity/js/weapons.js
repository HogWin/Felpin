function getNearbyEnemiesForCollision(x, y, radius, fallbackEnemies) {
  const game = window.MedievalSurvivors && window.MedievalSurvivors.game;
  if (game && game.getNearbyEnemies) {
    return game.getNearbyEnemies(x, y, radius);
  }
  return fallbackEnemies;
}

/**
 * Medieval Survivors - Weapons System
 * Manages all offensive weapons, projectiles, attack loops, and attribute progression.
 */

// Base Weapon Class
class BaseWeapon {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.description = config.description;
    this.level = 0;
    this.maxLevel = config.maxLevel || 8;
    this.timer = 0;
    this.baseCooldown = config.cooldown || 1.0;
    this.baseDamage = config.damage || 20;
    this.baseArea = config.area || 1.0;
    this.baseCount = config.count || 1;
    this.baseSpeed = config.speed || 1.0;
    this.levelsConfig = config.levelsConfig || [];
    this.totalDamageDealt = 0;
  }

  get cooldown() {
    return this.baseCooldown;
  }

  get damage() {
    return this.baseDamage;
  }

  get area() {
    return this.baseArea;
  }

  get count() {
    return this.baseCount;
  }

  upgrade() {
    if (this.level >= this.maxLevel) return;
    this.level++;
    const cfg = this.levelsConfig[this.level - 1];
    if (cfg) {
      if (cfg.damage !== undefined) this.baseDamage = cfg.damage;
      if (cfg.cooldown !== undefined) this.baseCooldown = cfg.cooldown;
      if (cfg.area !== undefined) this.baseArea = cfg.area;
      if (cfg.count !== undefined) this.baseCount = cfg.count;
      if (cfg.speed !== undefined) this.baseSpeed = cfg.speed;
    }
  }

  getNextLevelDiff() {
    if (this.level === 0) {
      return `Novo Armamento! Dano Base: ${this.baseDamage}`;
    }
    if (this.level >= this.maxLevel) {
      return "Nível Máximo Atingido!";
    }
    const nextCfg = this.levelsConfig[this.level];
    if (!nextCfg) return "Aumento substancial de todos os atributos.";
    return nextCfg.description || "Aprimora dano e eficiência.";
  }

  update(dt, player, enemies, projectiles, particles) {
    if (this.level <= 0) return;

    // Apply player's cooldown reduction
    const effectiveCooldown = Math.max(0.2, this.cooldown * (1 - player.cooldownReduction));
    this.timer += dt;

    if (this.timer >= effectiveCooldown) {
      this.timer = 0;
      this.attack(player, enemies, projectiles, particles);
    }
  }

  attack(player, enemies, projectiles, particles) {
    // Override in subclass
  }

  renderUnder(ctx, player) {}
  renderOver(ctx, player) {}
}

// 1. ESPADA LONGA REAL (Broadsword)
class BroadswordWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'broadsword',
      name: 'Espada Longa Real',
      icon: '⚔️',
      description: 'Lâmina forjada em aço nobre. Desfere arcos devastadores à frente, retalhando hordas de inimigos.',
      maxLevel: 8,
      damage: 32,
      cooldown: 1.25,
      area: 1.0,
      count: 1,
      levelsConfig: [
        { damage: 32, cooldown: 1.25, area: 1.0, count: 1, description: 'Lâmina de aço temperado com corte amplo.' },
        { damage: 45, area: 1.2, description: 'Dano: 32 ➔ 45 | +20% Raio de Golpe' },
        { count: 2, cooldown: 1.1, description: 'Golpe Duplo! Corta para frente e para trás | Recarga: 1.1s' },
        { damage: 65, area: 1.4, description: 'Dano: 45 ➔ 65 | +20% Raio de Golpe' },
        { count: 3, cooldown: 0.95, description: 'Golpe Triplo em leque! | Recarga: 0.95s' },
        { damage: 95, area: 1.6, description: 'Dano: 65 ➔ 95 | Lâmina Gigante' },
        { count: 4, cooldown: 0.8, description: 'Golpe Quádruplo 360° | Recarga: 0.8s' },
        { damage: 150, area: 1.9, cooldown: 0.65, description: 'EVOLUÇÃO: Lâmina do Monarca Sagrado (Dano 150, 360° contínuo)' }
      ]
    });
    this.slashEffects = [];
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playSwordSlash();

    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    // Balanced, realistic melee reach proportional to knight model & greatsword length
    const baseReach = 46 * effectiveArea;
    const facingAngle = player.facingAngle || 0;
    const totalCount = this.count + (player.bonusProjectiles || 0);

    const arcs = [];
    if (this.level >= 8) {
      // Evolved: Single 360° celestial blade storm
      arcs.push(facingAngle);
    } else if (totalCount === 1) {
      arcs.push(facingAngle);
    } else if (totalCount === 2) {
      // Dual Forward Cross-Slash (Golpe Duplo em X na direção do golpe)
      arcs.push(facingAngle - 0.28);
      arcs.push(facingAngle + 0.28);
    } else if (totalCount === 3) {
      arcs.push(facingAngle - 0.38);
      arcs.push(facingAngle);
      arcs.push(facingAngle + 0.38);
    } else {
      // 4 ou mais: Tempestade em cruz / círculo proporcional
      for (let i = 0; i < totalCount; i++) {
        arcs.push(facingAngle + (i * Math.PI * 2 / totalCount));
      }
    }

    const arcSpreadHalf = this.level >= 8 ? Math.PI : (Math.PI * 0.35);
    arcs.forEach(angle => {
      this.slashEffects.push({
        x: player.x,
        y: player.y,
        player: player,
        angle: angle,
        radius: baseReach,
        duration: 0.16,
        maxDuration: 0.16,
        isEvolved: this.level >= 8,
        color: this.level >= 8 ? '#f0c05a' : '#ffffff'
      });

      // Hit detection in conical slice
      for (let i = 0, len = enemies.length; i < len; i++) {
        const enemy = enemies[i];
        if (!enemy.alive) continue;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const maxDist = baseReach + enemy.radius;
        const distSq = dx * dx + dy * dy;

        if (distSq <= maxDist * maxDist) {
          const enemyAngle = Math.atan2(dy, dx);
          let diff = Math.abs(enemyAngle - angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

          if (diff <= arcSpreadHalf) {
            const dist = Math.sqrt(distSq) || 1;
            const dealt = enemy.takeDamage(effectiveDamage, dx / dist, dy / dist, 14);
            this.totalDamageDealt += dealt;
            particles.createBloodSparks(enemy.x, enemy.y, 3, '#e63946');
          }
        }
      }
    });
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    for (let i = this.slashEffects.length - 1; i >= 0; i--) {
      const s = this.slashEffects[i];
      s.duration -= dt;
      if (player) {
        s.x = player.x;
        s.y = player.y;
      }
      if (s.duration <= 0) {
        this.slashEffects.splice(i, 1);
      }
    }
  }

  renderOver(ctx, player) {
    this.slashEffects.forEach(effect => {
      const progress = 1 - (effect.duration / effect.maxDuration);
      const alpha = Math.sin(progress * Math.PI);
      ctx.save();
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.angle);

      ctx.beginPath();
      ctx.arc(0, 0, effect.radius, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.lineWidth = 14 * (1 - progress * 0.5);
      ctx.strokeStyle = effect.color;
      ctx.globalAlpha = alpha * 0.85;
      ctx.stroke();

      // Blade trail
      ctx.beginPath();
      ctx.arc(0, 0, effect.radius * 0.85, -Math.PI * 0.3, Math.PI * 0.3);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.restore();
    });
  }
}

// 2. BESTA DE BATALHA (Crossbow)
class CrossbowWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'crossbow',
      name: 'Besta de Precisão',
      icon: '🏹',
      description: 'Dispara virotes pontiagudos de alta velocidade contra os inimigos mais próximos com poder perfurante.',
      maxLevel: 8,
      damage: 28,
      cooldown: 0.9,
      count: 1,
      speed: 380,
      levelsConfig: [
        { damage: 28, cooldown: 0.9, count: 1, description: 'Dispara 1 virote com penetração.' },
        { count: 2, damage: 34, description: 'Disparo Duplo (2 virotes) | Dano: 34' },
        { cooldown: 0.75, description: 'Recarga Rápida: 0.9s ➔ 0.75s' },
        { count: 3, damage: 45, description: 'Disparo Triplo (3 virotes) | Dano: 45' },
        { damage: 60, speed: 480, description: 'Virotes Reforçados | Dano: 60 | +25% Vel. Projétil' },
        { count: 4, cooldown: 0.6, description: 'Saraivada Quádrupla (4 virotes) | Recarga: 0.6s' },
        { damage: 85, count: 5, description: 'Chuva de Virotes (5 disparos) | Dano: 85' },
        { damage: 130, count: 7, cooldown: 0.45, description: 'EVOLUÇÃO: Balista Flamejante (7 virotes perfurantes incendiários)' }
      ]
    });
    this.pierceCount = 2;
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playCrossbow();
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const baseAngle = player.facingAngle || 0;
    const spreadAngle = totalCount > 1 ? Math.min(0.75, (totalCount - 1) * 0.15) : 0;

    for (let i = 0; i < totalCount; i++) {
      let angle = baseAngle;
      if (totalCount > 1) {
        angle = baseAngle - spreadAngle / 2 + (spreadAngle * (i / (totalCount - 1)));
      }
      angle += (Math.random() - 0.5) * 0.04;

      projectiles.push(new CrossbowBolt({
        x: player.x,
        y: player.y,
        angle: angle,
        speed: this.speed || this.baseSpeed,
        damage: effectiveDamage,
        pierce: this.level >= 8 ? 6 : (this.level >= 4 ? 3 : 2),
        isEvolved: this.level >= 8,
        weapon: this
      }));
    }
  }
}

class CrossbowBolt {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.speed = cfg.speed;
    this.damage = cfg.damage;
    this.pierce = cfg.pierce;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.radius = 5;
    this.life = 2.0;
    this.hitEnemies = new Set();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.isEvolved && Math.random() < 0.25) {
      particles.createSpark(this.x, this.y, '#f39c12');
    }

    for (let i = 0, len = enemies.length; i < len; i++) {
      const enemy = enemies[i];
      if (!enemy.alive || this.hitEnemies.has(enemy.id)) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const r = this.radius + enemy.radius;
      if (dx * dx + dy * dy <= r * r) {
        this.hitEnemies.add(enemy.id);
        const dealt = enemy.takeDamage(this.damage, this.vx / this.speed, this.vy / this.speed, 8);
        this.weapon.totalDamageDealt += dealt;
        particles.createBloodSparks(this.x, this.y, 2, '#f0c05a');
        this.pierce--;
        if (this.pierce <= 0) break;
      }
    }

    return this.life > 0 && this.pierce > 0;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.isEvolved ? '#ff4500' : '#f0c05a';
    ctx.fillRect(-12, -2, 24, 4);

    // Arrow head
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(6, -4);
    ctx.lineTo(6, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// 3. FRASCO DE FOGO SAGRADO (Holy Fire Flask)
class HolyFireWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'holy_fire',
      name: 'Fogo Sagrado',
      icon: '🔥',
      description: 'Lança chamas alquímicas que estouram no solo em poças de fogo santo, calcinando grupos inteiros.',
      maxLevel: 8,
      damage: 16,
      cooldown: 2.8,
      area: 1.0,
      count: 1,
      levelsConfig: [
        { damage: 16, cooldown: 2.8, count: 1, area: 1.0, description: '1 poça de chamas ardentes por 3.5s.' },
        { count: 2, damage: 22, description: '2 Frascos por arremesso | Dano: 22' },
        { area: 1.3, description: '+30% Tamanho da Poça de Chamas' },
        { count: 3, damage: 32, description: '3 Frascos Arremessados | Dano: 32' },
        { cooldown: 2.1, description: 'Recarga Acelerada: 2.8s ➔ 2.1s' },
        { count: 4, area: 1.6, description: '4 Frascos em dispersão | +30% Área' },
        { damage: 50, cooldown: 1.6, description: 'Dano: 32 ➔ 50 | Recarga: 1.6s' },
        { damage: 85, count: 6, area: 2.0, description: 'EVOLUÇÃO: Tempestade de Fogo Divina (6 crateras flamejantes gigantes)' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playFireBurst();
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const baseAngle = player.facingAngle || 0;

    const living = enemies ? enemies.filter(e => e.alive) : [];
    living.sort((a, b) => {
      const d1 = (a.x - player.x) * (a.x - player.x) + (a.y - player.y) * (a.y - player.y);
      const d2 = (b.x - player.x) * (b.x - player.x) + (b.y - player.y) * (b.y - player.y);
      return d1 - d2;
    });

    for (let i = 0; i < totalCount; i++) {
      let targetX, targetY;
      if (living.length > 0) {
        const targetEnemy = living[i % living.length];
        const offsetAng = (i * 1.618) * Math.PI * 2;
        const offsetDist = living.length === 1 && totalCount > 1 ? (i * 20) : (Math.random() * 14);
        targetX = targetEnemy.x + Math.cos(offsetAng) * offsetDist;
        targetY = targetEnemy.y + Math.sin(offsetAng) * offsetDist;
      } else {
        const spread = totalCount > 1 ? (i - (totalCount - 1) / 2) * 0.35 : 0;
        const angle = baseAngle + spread + (Math.random() - 0.5) * 0.1;
        const dist = 120 + Math.random() * 80;
        targetX = player.x + Math.cos(angle) * dist;
        targetY = player.y + Math.sin(angle) * dist;
      }

      projectiles.push(new HolyFireFlask({
        startX: player.x,
        startY: player.y,
        targetX: targetX,
        targetY: targetY,
        damage: effectiveDamage,
        radius: 65 * effectiveArea,
        duration: this.level >= 8 ? 5.5 : 4.0,
        isEvolved: this.level >= 8,
        weapon: this
      }));
    }
  }
}

class HolyFireFlask {
  constructor(cfg) {
    this.startX = cfg.startX;
    this.startY = cfg.startY;
    this.x = cfg.startX;
    this.y = cfg.startY;
    this.targetX = cfg.targetX;
    this.targetY = cfg.targetY;
    this.damage = cfg.damage;
    this.radius = cfg.radius;
    this.duration = cfg.duration;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;

    this.state = 'flying'; // 'flying' or 'burning'
    this.flightProgress = 0;
    this.flightSpeed = 1.25;
    this.renderHeight = 10;
    this.burnTimer = this.duration;
    this.tickTimer = 0;
    this.tickRate = 0.28; // Ticks every 0.28 seconds
  }

  update(dt, enemies, particles) {
    if (this.state === 'flying') {
      this.flightProgress += this.flightSpeed * dt;
      if (this.flightProgress >= 1) {
        this.state = 'burning';
        this.flightProgress = 1;
        this.renderHeight = 0;
        this.x = this.targetX;
        this.y = this.targetY;
        window.MedievalSurvivors.sound.playFireBurst();
        particles.createExplosionWave(this.x, this.y, this.radius, this.isEvolved ? '#3498db' : '#e67e22');
      } else {
        const p = this.flightProgress;
        this.x = this.startX + (this.targetX - this.startX) * p;
        this.y = this.startY + (this.targetY - this.startY) * p;
        this.renderHeight = Math.sin(p * Math.PI) * 55;
        particles.createSpark(this.x, this.y, '#f39c12');
      }
      return true;
    }

    // Burning state
    this.burnTimer -= dt;
    this.tickTimer += dt;

    if (Math.random() < 0.2) {
      const rx = this.x + (Math.random() - 0.5) * this.radius * 1.4;
      const ry = this.y + (Math.random() - 0.5) * this.radius * 1.4;
      particles.createSpark(rx, ry, this.isEvolved ? '#00e5ff' : '#ff4500');
    }

    if (this.tickTimer >= this.tickRate) {
      this.tickTimer = 0;
      for (let i = 0, len = enemies.length; i < len; i++) {
        const enemy = enemies[i];
        if (!enemy.alive) continue;
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const r = this.radius + enemy.radius;
        if (dx * dx + dy * dy <= r * r) {
          const dealt = enemy.takeDamage(this.damage, 0, 0, 1);
          this.weapon.totalDamageDealt += dealt;
        }
      }
    }

    return this.burnTimer > 0;
  }

  render(ctx) {
    if (this.state === 'flying') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = '#ff6b00';
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff275';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Burning zone on the ground
      ctx.save();
      ctx.translate(this.x, this.y);

      ctx.fillStyle = this.isEvolved ? 'rgba(0, 229, 255, 0.25)' : 'rgba(230, 81, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner intense core
      ctx.fillStyle = this.isEvolved ? 'rgba(129, 212, 250, 0.45)' : 'rgba(255, 179, 0, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }
}

// 4. MACHADOS GIRATÓRIOS (Whirling Axes)
class WhirlingAxesWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'whirling_axes',
      name: 'Machados Vorazes',
      icon: '🪓',
      description: 'Arremessa machados de guerra duplos em parábolas que retalham todos os inimigos no caminho.',
      maxLevel: 8,
      damage: 38,
      cooldown: 1.8,
      count: 2,
      levelsConfig: [
        { damage: 38, count: 2, cooldown: 1.8, description: 'Lança 2 machados perfurantes em arco elevado.' },
        { count: 3, damage: 50, description: '3 Machados simultâneos | Dano: 50' },
        { cooldown: 1.4, description: 'Recarga Reduzida: 1.8s ➔ 1.4s' },
        { count: 4, damage: 68, description: '4 Machados | Dano: 68' },
        { area: 1.35, description: '+35% Tamanho dos Machados' },
        { count: 5, damage: 92, description: '5 Machados em vórtice | Dano: 92' },
        { cooldown: 1.0, count: 6, description: '6 Machados | Recarga: 1.0s' },
        { damage: 160, count: 8, cooldown: 0.8, description: 'EVOLUÇÃO: Turbilhão de Aço Carmesim (8 machados gigantes devastadores)' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playAxeThrow();
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const baseAngle = player.facingAngle || 0;
    const spreadAngle = Math.min(Math.PI * 1.4, Math.max(0.6, totalCount * 0.3));

    for (let i = 0; i < totalCount; i++) {
      let ang = baseAngle;
      if (totalCount > 1) {
        ang = baseAngle - spreadAngle / 2 + (spreadAngle * (i / (totalCount - 1)));
      }
      ang += (Math.random() - 0.5) * 0.12;
      const speed = 190 + Math.random() * 45;

      projectiles.push(new ThrownAxe({
        x: player.x,
        y: player.y,
        angle: ang,
        speed: speed,
        damage: effectiveDamage,
        size: 18 * effectiveArea,
        isEvolved: this.level >= 8,
        weapon: this
      }));
    }
  }
}

class ThrownAxe {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle || 0;
    this.speed = cfg.speed || 260;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.damage = cfg.damage;
    this.size = cfg.size;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.rotation = Math.random() * Math.PI * 2;
    this.spinSpeed = 16;
    this.life = 2.2;
    this.maxLife = 2.2;
    this.renderHeight = 10;
    this.hitCooldowns = new Map();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    const progress = 1 - Math.max(0, this.life / this.maxLife);
    this.renderHeight = Math.max(4, Math.sin(progress * Math.PI) * 36 + (1 - progress) * 8);

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.spinSpeed * dt;

    if (Math.random() < 0.25) {
      particles.createSpark(this.x, this.y, this.isEvolved ? '#e63946' : '#d8d8d8');
    }

    // Clean cooldowns
    for (const [id, time] of this.hitCooldowns) {
      if (time - dt <= 0) this.hitCooldowns.delete(id);
      else this.hitCooldowns.set(id, time - dt);
    }

    for (let i = 0, len = enemies.length; i < len; i++) {
      const enemy = enemies[i];
      if (!enemy.alive || this.hitCooldowns.has(enemy.id)) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const r = this.size + enemy.radius;
      if (dx * dx + dy * dy <= r * r) {
        this.hitCooldowns.set(enemy.id, 0.25);
        const dist = Math.hypot(dx, dy) || 1;
        const dealt = enemy.takeDamage(this.damage, dx / dist, dy / dist, 12);
        this.weapon.totalDamageDealt += dealt;
        particles.createBloodSparks(enemy.x, enemy.y, 3, '#f0c05a');
      }
    }

    return this.life > 0;
  }

  render(ctx) {
    const s = this.size;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 1. Rotational air-slash ring trail
    ctx.strokeStyle = this.isEvolved ? 'rgba(231, 76, 60, 0.4)' : 'rgba(220, 230, 240, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.95, 0, Math.PI * 1.4);
    ctx.stroke();

    // 2. Hardwood battle shaft with leather grip wraps
    ctx.fillStyle = this.isEvolved ? '#3b1212' : '#6e472b';
    ctx.fillRect(-s * 0.14, -s * 0.95, s * 0.28, s * 1.9);

    // Leather grip bands on lower shaft
    ctx.fillStyle = '#261710';
    ctx.fillRect(-s * 0.16, s * 0.2, s * 0.32, s * 0.12);
    ctx.fillRect(-s * 0.16, s * 0.45, s * 0.32, s * 0.12);

    // Golden/Iron Pommel & Top Spike
    ctx.fillStyle = this.isEvolved ? '#f1c40f' : '#d4af37';
    ctx.beginPath();
    ctx.arc(0, s * 0.95, s * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.isEvolved ? '#ff5252' : '#dfe6e9';
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.2);
    ctx.lineTo(-s * 0.15, -s * 0.9);
    ctx.lineTo(s * 0.15, -s * 0.9);
    ctx.closePath();
    ctx.fill();

    // 3. Twin Crescent War-Axe Blades (Left & Right)
    const headY = -s * 0.32;
    const drawBlade = (dir) => {
      ctx.save();
      ctx.scale(dir, 1);

      // Inner dark forged steel body
      ctx.fillStyle = this.isEvolved ? '#8b0000' : '#485460';
      ctx.beginPath();
      ctx.moveTo(s * 0.1, headY - s * 0.22);
      ctx.quadraticCurveTo(s * 0.65, headY - s * 0.55, s * 0.88, headY - s * 0.58);
      ctx.quadraticCurveTo(s * 1.08, headY, s * 0.88, headY + s * 0.58);
      ctx.quadraticCurveTo(s * 0.65, headY + s * 0.55, s * 0.1, headY + s * 0.22);
      ctx.closePath();
      ctx.fill();

      // Razor-sharp gleaming outer bevel edge
      ctx.fillStyle = this.isEvolved ? '#f1c40f' : '#ecf0f1';
      ctx.beginPath();
      ctx.moveTo(s * 0.72, headY - s * 0.52);
      ctx.quadraticCurveTo(s * 0.96, headY, s * 0.72, headY + s * 0.52);
      ctx.lineTo(s * 0.88, headY + s * 0.58);
      ctx.quadraticCurveTo(s * 1.12, headY, s * 0.88, headY - s * 0.58);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    drawBlade(1);
    drawBlade(-1);

    // Central iron collar & golden rivet
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(-s * 0.22, headY - s * 0.22, s * 0.44, s * 0.44);
    ctx.fillStyle = '#f0c05a';
    ctx.beginPath();
    ctx.arc(0, headY, s * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 5. AURA DOS SANTOS (Holy Radiance)
class HolyAuraWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'holy_aura',
      name: 'Aura dos Santos',
      icon: '✨',
      description: 'Irradia um campo sagrado contínuo ao redor do herói que vaporiza as forças das trevas e repele agressores.',
      maxLevel: 8,
      damage: 14,
      cooldown: 0.6,
      area: 1.0,
      levelsConfig: [
        { damage: 14, cooldown: 0.6, area: 1.0, description: 'Aura de pulsação sagrada a cada 0.6s.' },
        { damage: 20, area: 1.2, description: 'Dano: 14 ➔ 20 | +20% Raio da Aura' },
        { cooldown: 0.48, description: 'Pulso Mais Rápido: 0.6s ➔ 0.48s' },
        { damage: 32, area: 1.45, description: 'Dano: 20 ➔ 32 | +25% Raio' },
        { cooldown: 0.38, description: 'Pulso Mais Rápido: 0.48s ➔ 0.38s' },
        { damage: 48, area: 1.7, description: 'Dano: 32 ➔ 48 | Expansão Gigante' },
        { damage: 70, cooldown: 0.28, description: 'Dano: 48 ➔ 70 | Pulso a cada 0.28s' },
        { damage: 110, area: 2.2, cooldown: 0.22, description: 'EVOLUÇÃO: Santuário Imperial (Raio colossal, dano fulminante)' }
      ]
    });
    this.pulseAnim = 0;
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playAuraPulse();
    this.pulseAnim = 1.0;

    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const radius = 80 * this.area * player.areaMultiplier;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const enemy = enemies[i];
      if (!enemy.alive) continue;
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const maxD = radius + enemy.radius;
      const distSq = dx * dx + dy * dy;

      if (distSq <= maxD * maxD) {
        const dist = Math.sqrt(distSq) || 1;
        const dealt = enemy.takeDamage(effectiveDamage, dx / dist, dy / dist, 6);
        this.totalDamageDealt += dealt;
        particles.createSpark(enemy.x, enemy.y, '#f0c05a');
      }
    }

    // Bonus projectiles launch sacred light bolts from the aura
    const extraBolts = player.bonusProjectiles || 0;
    if (extraBolts > 0 && enemies.length > 0) {
      for (let b = 0; b < extraBolts; b++) {
        const randEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        if (randEnemy && randEnemy.alive) {
          const ang = Math.atan2(randEnemy.y - player.y, randEnemy.x - player.x);
          projectiles.push(new CrossbowBolt({
            x: player.x,
            y: player.y,
            angle: ang,
            speed: 550,
            damage: effectiveDamage,
            pierce: 2,
            isEvolved: true,
            weapon: this
          }));
        }
      }
    }
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    if (this.pulseAnim > 0) {
      this.pulseAnim -= dt * 2.5;
    }
  }

  renderUnder(ctx, player) {
    if (this.level <= 0) return;
    const radius = 80 * this.area * player.areaMultiplier;

    ctx.save();
    ctx.translate(player.x, player.y);

    // Subtle ambient glow
    ctx.fillStyle = this.level >= 8 ? 'rgba(240, 192, 90, 0.12)' : 'rgba(52, 152, 219, 0.10)';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Border ring
    ctx.strokeStyle = this.level >= 8 ? 'rgba(240, 192, 90, 0.4)' : 'rgba(100, 200, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Pulse shockwave
    if (this.pulseAnim > 0) {
      ctx.strokeStyle = this.level >= 8 ? '#f0c05a' : '#85c1e9';
      ctx.lineWidth = 4 * this.pulseAnim;
      ctx.globalAlpha = this.pulseAnim;
      ctx.beginPath();
      ctx.arc(0, 0, radius * (1.1 - this.pulseAnim * 0.1), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// 6. LANÇA DO GUARDIÃO REFORMULADA (Royal Halberd / Guardian Spear)
class GuardianSpearWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'guardian_spear',
      name: 'Lança do Guardião',
      icon: '🔱',
      description: 'Desfere estocadas imperiais velozes que disparam ondas perfurantes e causam dano crítico letal na ponta da lança.',
      maxLevel: 8,
      damage: 45,
      cooldown: 1.35,
      area: 1.0,
      count: 1,
      levelsConfig: [
        { damage: 45, cooldown: 1.35, area: 1.0, count: 1, description: 'Estocada imperial com Onda Perfurante e Crítico na ponta (1.5x).' },
        { damage: 64, area: 1.2, description: 'Dano: 45 ➔ 64 | +20% Alcance da Lança' },
        { count: 2, cooldown: 1.15, description: 'Estocada Dupla em Leque + Ondas Perfurantes!' },
        { damage: 90, area: 1.4, description: 'Dano: 64 ➔ 90 | +20% Alcance e Largura' },
        { count: 3, cooldown: 0.98, description: 'Falange Tripla (3 Lanças Simultâneas) | Recarga: 0.98s' },
        { damage: 125, area: 1.6, description: 'Dano: 90 ➔ 125 | Impacto Demolidor' },
        { count: 4, damage: 165, cooldown: 0.82, description: 'Falange Quádrupla Imperial | Dano: 165' },
        { damage: 245, area: 1.9, count: 5, cooldown: 0.65, description: 'EVOLUÇÃO: Lança Divina de Longinus (5 lanças sagradas + rajadas de relâmpago dourado)' }
      ]
    });
    this.thrustEffects = [];
  }

  attack(player, enemies, projectiles, particles) {
    if (window.MedievalSurvivors.sound.playSpearThrust) {
      window.MedievalSurvivors.sound.playSpearThrust();
    } else {
      window.MedievalSurvivors.sound.playSwordSlash();
    }

    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const reach = 185 * effectiveArea;
    const thickness = 30 * effectiveArea;
    const baseAngle = player.facingAngle || 0;
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const isEvolved = this.level >= 8;

    // Build tactical fan of spear thrusts centered on player's aim
    const directions = [];
    if (totalCount === 1) {
      directions.push(baseAngle);
    } else {
      const fanSpread = Math.min(Math.PI * 1.2, (totalCount - 1) * 0.28);
      for (let i = 0; i < totalCount; i++) {
        const offset = -fanSpread / 2 + (fanSpread * (i / (totalCount - 1)));
        directions.push(baseAngle + offset);
      }
    }

    directions.forEach(ang => {
      this.thrustEffects.push({
        x: player.x,
        y: player.y,
        angle: ang,
        reach: reach,
        thickness: thickness,
        duration: 0.24,
        maxDuration: 0.24,
        isEvolved: isEvolved
      });

      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const spearTipX = player.x + cosA * reach;
      const spearTipY = player.y + sinA * reach;

      // Launch piercing crescent shockwave from the spear tip
      projectiles.push(new SpearShockwave({
        x: player.x + cosA * (reach * 0.45),
        y: player.y + sinA * (reach * 0.45),
        angle: ang,
        speed: isEvolved ? 420 : 340,
        damage: Math.round(effectiveDamage * 0.65),
        radius: thickness * 0.65,
        pierce: isEvolved ? 8 : 4,
        isEvolved: isEvolved,
        weapon: this
      }));

      // Line hit detection with Tip Sweetspot (1.5x damage on outer 35% of spear!)
      for (let i = 0, len = enemies.length; i < len; i++) {
        const enemy = enemies[i];
        if (!enemy.alive) continue;
        const d = distToSegment(enemy.x, enemy.y, player.x, player.y, spearTipX, spearTipY);
        if (d <= enemy.radius + thickness / 2) {
          const distFromPlayer = Math.hypot(enemy.x - player.x, enemy.y - player.y);
          const isTipHit = distFromPlayer >= reach * 0.62;
          const finalDmg = isTipHit ? Math.round(effectiveDamage * 1.5) : effectiveDamage;
          const dealt = enemy.takeDamage(finalDmg, cosA, sinA, isTipHit ? 22 : 14);
          this.totalDamageDealt += dealt;
          particles.createBloodSparks(enemy.x, enemy.y, 3, isEvolved ? '#f1c40f' : '#00d2d3');
        }
      }
    });
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    for (let i = this.thrustEffects.length - 1; i >= 0; i--) {
      const eff = this.thrustEffects[i];
      // Follow player slightly during thrust
      eff.x = player.x;
      eff.y = player.y;
      eff.duration -= dt;
      if (eff.duration <= 0) {
        this.thrustEffects.splice(i, 1);
      }
    }
  }

  renderOver(ctx, player) {
    this.thrustEffects.forEach(eff => {
      const p = 1 - (eff.duration / eff.maxDuration);
      // Fast forward lunge in first 35% of animation, then hold & fade
      const lunge = p < 0.35 ? (0.35 + (p / 0.35) * 0.65) : 1.0;
      const alpha = p > 0.7 ? (1 - p) / 0.3 : 1.0;
      const r = eff.reach * lunge;
      const w = eff.thickness;

      ctx.save();
      ctx.translate(eff.x, eff.y);
      ctx.rotate(eff.angle);
      ctx.globalAlpha = Math.max(0, alpha);

      // 1. Sonic thrust cone wake
      ctx.fillStyle = eff.isEvolved ? 'rgba(241, 196, 15, 0.22)' : 'rgba(0, 210, 211, 0.20)';
      ctx.beginPath();
      ctx.moveTo(r * 0.25, -w * 0.45);
      ctx.lineTo(r * 1.05, 0);
      ctx.lineTo(r * 0.25, w * 0.45);
      ctx.closePath();
      ctx.fill();

      // 2. Royal Hardwood & Gold Shaft
      ctx.fillStyle = eff.isEvolved ? '#8b0000' : '#4a3219';
      ctx.fillRect(10, -w * 0.1, r * 0.68, w * 0.2);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(r * 0.35, -w * 0.11, r * 0.08, w * 0.22);

      // 3. Ornate Winged Crossguard below spearhead
      const guardX = r * 0.66;
      ctx.fillStyle = '#f0c05a';
      ctx.beginPath();
      ctx.moveTo(guardX - 6, 0);
      ctx.lineTo(guardX + 4, -w * 0.55);
      ctx.lineTo(guardX + 10, -w * 0.18);
      ctx.lineTo(guardX + 10, w * 0.18);
      ctx.lineTo(guardX + 4, w * 0.55);
      ctx.closePath();
      ctx.fill();

      // 4. Gleaming Diamond Halberd/Spear Blade
      ctx.fillStyle = eff.isEvolved ? '#ffd700' : '#00d2d3';
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(guardX + 4, -w * 0.36);
      ctx.lineTo(guardX - 4, 0);
      ctx.lineTo(guardX + 4, w * 0.36);
      ctx.closePath();
      ctx.fill();

      // Inner bright core ridge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(r * 0.98, 0);
      ctx.lineTo(guardX + 8, -w * 0.14);
      ctx.lineTo(guardX + 2, 0);
      ctx.lineTo(guardX + 8, w * 0.14);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }
}

class SpearShockwave {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.speed = cfg.speed;
    this.damage = cfg.damage;
    this.radius = cfg.radius || 18;
    this.pierce = cfg.pierce || 4;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.life = 0.55;
    this.maxLife = 0.55;
    this.renderHeight = 8;
    this.hitEnemies = new Set();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const enemy = enemies[i];
      if (!enemy.alive || this.hitEnemies.has(enemy.id)) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const r = this.radius + enemy.radius;
      if (dx * dx + dy * dy <= r * r) {
        this.hitEnemies.add(enemy.id);
        const dealt = enemy.takeDamage(this.damage, this.vx / this.speed, this.vy / this.speed, 10);
        this.weapon.totalDamageDealt += dealt;
        this.pierce--;
        if (this.pierce <= 0) break;
      }
    }

    return this.life > 0 && this.pierce > 0;
  }

  render(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = this.isEvolved ? '#ffd700' : '#00e5ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-this.radius * 0.4, 0, this.radius, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, 0, this.radius * 0.85, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();

    ctx.restore();
  }
}

// 7. ORBE ESPECTRAL (Spectral Orb - Necromancer)
class SpectralOrbWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'spectral_orb',
      name: 'Orbe Espectral',
      icon: '🔮',
      description: 'Esferas de almas aprisionadas que perseguem implacavelmente os inimigos mais próximos.',
      maxLevel: 8,
      damage: 28,
      cooldown: 1.15,
      area: 1.0,
      count: 1,
      speed: 190,
      levelsConfig: [
        { damage: 28, cooldown: 1.15, count: 1, description: 'Orbe místico que persegue alvos automaticamente.' },
        { damage: 38, count: 2, description: 'Dispara 2 Orbes Espectrais simultâneos.' },
        { damage: 48, cooldown: 1.0, description: 'Dano: 38 ➔ 48 | Recarga: 1.0s' },
        { count: 3, area: 1.25, description: 'Dispara 3 Orbes | +25% Raio de Impacto' },
        { damage: 65, cooldown: 0.85, description: 'Dano: 48 ➔ 65 | Recarga: 0.85s' },
        { count: 4, area: 1.45, description: 'Dispara 4 Orbes Espectrais' },
        { damage: 85, cooldown: 0.75, description: 'Dano: 65 ➔ 85 | Velocidade de Perseguição Aumentada' },
        { damage: 130, count: 5, cooldown: 0.6, description: 'EVOLUÇÃO: Lamento das Almas Eternas (5 Orbes Vorazes com perfuração e explosão espectral)' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    if (!enemies || enemies.length === 0) return;
    if (window.MedievalSurvivors.sound.playLaserShoot) {
      window.MedievalSurvivors.sound.playLaserShoot();
    }

    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const isEvo = this.level >= 8;

    for (let i = 0; i < totalCount; i++) {
      const startAngle = player.facingAngle + ((i - (totalCount - 1) / 2) * 0.4);
      projectiles.push(new SpectralOrb({
        x: player.x,
        y: player.y,
        angle: startAngle,
        speed: this.speed,
        damage: effectiveDamage,
        radius: 14 * (this.area * player.areaMultiplier),
        pierce: isEvo ? 3 : 1,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class SpectralOrb {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.speed = cfg.speed || 260;
    this.damage = cfg.damage;
    this.radius = cfg.radius || 14;
    this.pierce = cfg.pierce || 1;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.life = 3.0;
    this.maxLife = 3.0;
    this.renderHeight = 12;
    this.target = null;
    this.hitEnemies = new Set();
    this.isSpectralOrb = true;
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    if (this.life <= 0 || this.pierce <= 0) return false;

    // Homing steering logic
    if (!this.target || !this.target.alive) {
      let nearest = null;
      let nearDistSq = 450 * 450;
      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive || this.hitEnemies.has(e.id)) continue;
        const dSq = (e.x - this.x) * (e.x - this.x) + (e.y - this.y) * (e.y - this.y);
        if (dSq < nearDistSq) {
          nearDistSq = dSq;
          nearest = e;
        }
      }
      this.target = nearest;
    }

    if (this.target && this.target.alive) {
      const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.angle += diff * Math.min(1.0, 7.5 * dt);
    }

    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    // Hit detection
    for (let i = 0, len = enemies.length; i < len; i++) {
      const enemy = enemies[i];
      if (!enemy.alive || this.hitEnemies.has(enemy.id)) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const r = this.radius + enemy.radius;
      if (dx * dx + dy * dy <= r * r) {
        this.hitEnemies.add(enemy.id);
        const dealt = enemy.takeDamage(this.damage, Math.cos(this.angle), Math.sin(this.angle), 6);
        this.weapon.totalDamageDealt += dealt;
        this.pierce--;
        if (particles && particles.createBloodSparks) {
          particles.createBloodSparks(this.x, this.y, 6, this.isEvolved ? '#00e5ff' : '#a55eea');
        }
        if (this.pierce <= 0) return false;
      }
    }

    return true;
  }
}

// 8. ADAGAS GÊMEAS SOMBRIAS (Twin Daggers - Assassin)
class TwinDaggersWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'twin_daggers',
      name: 'Adagas Gêmeas Sombrias',
      icon: '🗡️',
      description: 'Lâminas relâmpago de alta velocidade e precisão cirúrgica. Alta cadência e multiplicador de acerto crítico.',
      maxLevel: 8,
      damage: 18,
      cooldown: 0.55,
      area: 1.0,
      count: 2,
      levelsConfig: [
        { damage: 18, cooldown: 0.55, count: 2, description: 'Golpes duplos rápidos com alta chance de crítico.' },
        { damage: 25, cooldown: 0.48, description: 'Dano: 18 ➔ 25 | Recarga: 0.48s' },
        { count: 3, area: 1.15, description: 'Ataque Triplo em corte veloz.' },
        { damage: 36, cooldown: 0.40, description: 'Dano: 25 ➔ 36 | Recarga: 0.40s' },
        { count: 4, cooldown: 0.35, description: 'Golpe Quádruplo em leque veloz.' },
        { damage: 52, area: 1.30, description: 'Dano: 36 ➔ 52 | +30% Área' },
        { count: 5, cooldown: 0.28, description: 'Golpe Quíntuplo | Recarga: 0.28s' },
        { damage: 85, count: 6, cooldown: 0.22, description: 'EVOLUÇÃO: Lâminas da Noite Eterna (Cortes fantasmas contínuos com 100% Crítico)' }
      ]
    });
    this.slashEffects = [];
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playSwordSlash();

    const isEvo = this.level >= 8;
    const baseCrit = isEvo ? 1.0 : (0.35 + (player.baseCritChance || 0));
    const isCrit = Math.random() < baseCrit;
    const critMult = isCrit ? (player.critMultiplier || 2.2) : 1.0;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier * critMult);
    const effectiveArea = this.area * player.areaMultiplier;
    const baseReach = 38 * effectiveArea;
    const facingAngle = player.facingAngle || 0;
    const totalCount = this.count + (player.bonusProjectiles || 0);

    if (isCrit && player.onCriticalHit) {
      player.onCriticalHit();
    }

    const arcs = [];
    for (let i = 0; i < totalCount; i++) {
      const offset = (i - (totalCount - 1) / 2) * 0.24;
      arcs.push(facingAngle + offset);
    }

    const arcSpreadHalf = Math.PI * 0.28;
    arcs.forEach(angle => {
      this.slashEffects.push({
        x: player.x,
        y: player.y,
        player: player,
        angle: angle,
        radius: baseReach,
        duration: 0.12,
        maxDuration: 0.12,
        isCritical: isCrit,
        isEvolved: isEvo,
        isDagger: true,
        color: isCrit ? '#ff4757' : '#ced6e0'
      });

      for (let i = 0, len = enemies.length; i < len; i++) {
        const enemy = enemies[i];
        if (!enemy.alive) continue;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const maxDist = baseReach + enemy.radius;
        const distSq = dx * dx + dy * dy;

        if (distSq <= maxDist * maxDist) {
          const enemyAngle = Math.atan2(dy, dx);
          let diff = Math.abs(enemyAngle - angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

          if (diff <= arcSpreadHalf) {
            const dist = Math.sqrt(distSq) || 1;
            const dealt = enemy.takeDamage(effectiveDamage, dx / dist, dy / dist, 8, isCrit);
            this.totalDamageDealt += dealt;
            if (particles && particles.createBloodSparks) {
              particles.createBloodSparks(enemy.x, enemy.y, isCrit ? 6 : 2, isCrit ? '#ff4757' : '#ffffff');
            }
          }
        }
      }
    });
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    for (let i = this.slashEffects.length - 1; i >= 0; i--) {
      const s = this.slashEffects[i];
      s.duration -= dt;
      if (player) {
        s.x = player.x;
        s.y = player.y;
      }
      if (s.duration <= 0) {
        this.slashEffects.splice(i, 1);
      }
    }
  }
}

// 9. MONTANTE DAS TREVAS (Dark Greatsword - Dark Knight)
class DarkGreatswordWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'dark_greatsword',
      name: 'Montante das Trevas',
      icon: '⚔️',
      description: 'Lâmina colossal forjada em obsidiana negra. Desfere ondas pesadas de impacto que esmagam os monstros ao redor.',
      maxLevel: 8,
      damage: 54,
      cooldown: 1.45,
      area: 1.25,
      count: 1,
      levelsConfig: [
        { damage: 54, cooldown: 1.45, count: 1, description: 'Impacto brutal e alcance estendido.' },
        { damage: 75, area: 1.4, description: 'Dano: 54 ➔ 75 | +15% Alcance' },
        { count: 2, cooldown: 1.3, description: 'Golpe Duplo em arco esmagador.' },
        { damage: 105, area: 1.6, description: 'Dano: 75 ➔ 105 | +20% Área' },
        { count: 3, cooldown: 1.15, description: 'Golpe Triplo devastador.' },
        { damage: 150, area: 1.85, description: 'Dano: 105 ➔ 150 | Grande Onda de Choque' },
        { count: 4, cooldown: 0.95, description: 'Tempestade Quádrupla de Ferro Negro' },
        { damage: 240, area: 2.1, cooldown: 0.75, description: 'EVOLUÇÃO: Devoradora de Reis (240 Dano, ondas carmesins 360° com atordoamento)' }
      ]
    });
    this.slashEffects = [];
  }

  attack(player, enemies, projectiles, particles) {
    window.MedievalSurvivors.sound.playSwordSlash();

    const isEvo = this.level >= 8;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const baseReach = 52 * effectiveArea;
    const facingAngle = player.facingAngle || 0;
    const totalCount = this.count + (player.bonusProjectiles || 0);

    const arcs = [];
    if (isEvo) {
      arcs.push(facingAngle);
    } else if (totalCount === 1) {
      arcs.push(facingAngle);
    } else if (totalCount === 2) {
      arcs.push(facingAngle - 0.32);
      arcs.push(facingAngle + 0.32);
    } else if (totalCount === 3) {
      arcs.push(facingAngle - 0.42);
      arcs.push(facingAngle);
      arcs.push(facingAngle + 0.42);
    } else {
      for (let i = 0; i < totalCount; i++) {
        arcs.push(facingAngle + (i * Math.PI * 2 / totalCount));
      }
    }

    const arcSpreadHalf = isEvo ? Math.PI : (Math.PI * 0.42);
    arcs.forEach(angle => {
      this.slashEffects.push({
        x: player.x,
        y: player.y,
        player: player,
        angle: angle,
        radius: baseReach,
        duration: 0.20,
        maxDuration: 0.20,
        isEvolved: isEvo,
        isDark: true,
        color: isEvo ? '#e74c3c' : '#2f3542'
      });

      for (let i = 0, len = enemies.length; i < len; i++) {
        const enemy = enemies[i];
        if (!enemy.alive) continue;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const maxDist = baseReach + enemy.radius;
        const distSq = dx * dx + dy * dy;

        if (distSq <= maxDist * maxDist) {
          const enemyAngle = Math.atan2(dy, dx);
          let diff = Math.abs(enemyAngle - angle);
          while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

          if (diff <= arcSpreadHalf) {
            const dist = Math.sqrt(distSq) || 1;
            const dealt = enemy.takeDamage(effectiveDamage, dx / dist, dy / dist, 24);
            this.totalDamageDealt += dealt;
            if (particles && particles.createBloodSparks) {
              particles.createBloodSparks(enemy.x, enemy.y, 5, '#e74c3c');
            }
          }
        }
      }
    });
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    for (let i = this.slashEffects.length - 1; i >= 0; i--) {
      const s = this.slashEffects[i];
      s.duration -= dt;
      if (player) {
        s.x = player.x;
        s.y = player.y;
      }
      if (s.duration <= 0) {
        this.slashEffects.splice(i, 1);
      }
    }
  }
}

// 10. FRASCO DE ÁCIDO PÚTRIDO (Plague Flask - Alchemist)
class PlagueFlaskWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'plague_flask',
      name: 'Frascos de Ácido Pútrido',
      icon: '🧪',
      description: 'Arremessa frascos alquímicos cheios de veneno cáustico que criam poças corrosivas no solo.',
      maxLevel: 8,
      damage: 16,
      cooldown: 1.35,
      area: 1.0,
      count: 1,
      speed: 340,
      levelsConfig: [
        { damage: 16, cooldown: 1.35, count: 1, description: 'Lança frasco de ácido que cria poça venenosa por 3s.' },
        { damage: 24, count: 2, description: 'Lança 2 Frascos de Ácido simultâneos.' },
        { damage: 32, area: 1.25, description: 'Dano: 24 ➔ 32 | +25% Área da Poça' },
        { count: 3, cooldown: 1.15, description: 'Lança 3 Frascos | Recarga: 1.15s' },
        { damage: 45, area: 1.45, description: 'Dano: 32 ➔ 45 | Poça Dura +1s' },
        { count: 4, cooldown: 0.95, description: 'Lança 4 Frascos em leque' },
        { damage: 62, area: 1.65, description: 'Dano: 45 ➔ 62 | Área Massiva de Corrosão' },
        { damage: 95, count: 5, cooldown: 0.75, description: 'EVOLUÇÃO: Elixir do Apocalipse (5 Frascos gigantes de veneno cáustico com lentidão severa)' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    if (window.MedievalSurvivors.sound.playPlagueSplash) {
      window.MedievalSurvivors.sound.playPlagueSplash();
    }

    // Trigger arm throw animation on player
    player.tossAnimTimer = 0.38;
    player.tossAnimMax = 0.38;

    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const poolRadius = 36 * effectiveArea;
    const totalCount = this.count + (player.bonusProjectiles || 0);
    const isEvo = this.level >= 8;

    const living = enemies ? enemies.filter(e => e.alive) : [];
    living.sort((a, b) => {
      const d1 = (a.x - player.x) * (a.x - player.x) + (a.y - player.y) * (a.y - player.y);
      const d2 = (b.x - player.x) * (b.x - player.x) + (b.y - player.y) * (b.y - player.y);
      return d1 - d2;
    });

    for (let i = 0; i < totalCount; i++) {
      let targetX, targetY;
      if (living.length > 0) {
        const targetEnemy = living[i % living.length];
        const offsetAng = (i * 1.618) * Math.PI * 2;
        const offsetDist = living.length === 1 && totalCount > 1 ? (i * 18) : (Math.random() * 12);
        targetX = targetEnemy.x + Math.cos(offsetAng) * offsetDist;
        targetY = targetEnemy.y + Math.sin(offsetAng) * offsetDist;
      } else {
        const spread = totalCount > 1 ? (i - (totalCount - 1) / 2) * 0.35 : 0;
        const ang = (player.facingAngle || 0) + spread;
        const dist = 140 + Math.random() * 60;
        targetX = player.x + Math.cos(ang) * dist;
        targetY = player.y + Math.sin(ang) * dist;
      }

      projectiles.push(new PlagueFlask({
        startX: player.x,
        startY: player.y,
        targetX: targetX,
        targetY: targetY,
        damage: effectiveDamage,
        poolRadius: poolRadius,
        duration: isEvo ? 4.8 : 3.4,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class PlagueFlask {
  constructor(cfg) {
    this.startX = cfg.startX;
    this.startY = cfg.startY;
    this.targetX = cfg.targetX;
    this.targetY = cfg.targetY;
    this.x = this.startX;
    this.y = this.startY;
    this.damage = cfg.damage;
    this.poolRadius = cfg.poolRadius;
    this.duration = cfg.duration;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.flightTime = 0.85; // Slowed down from 0.55s for graceful visible lob
    this.flightProgress = 0;
    this.state = 'flying';
    this.renderHeight = 10;
    this.tickTimer = 0;
    this.isPlague = true;
  }

  update(dt, enemies, particles) {
    if (this.state === 'flying') {
      this.flightProgress += dt / this.flightTime;
      if (this.flightProgress >= 1) {
        this.flightProgress = 1;
        this.state = 'burning';
        this.x = this.targetX;
        this.y = this.targetY;
        this.radius = this.poolRadius;
        this.renderHeight = 0;
        if (particles && particles.createExplosionWave) {
          particles.createExplosionWave(this.x, this.y, this.poolRadius * 0.7, '#2ed573');
        }
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playPlagueSplash) {
          window.MedievalSurvivors.sound.playPlagueSplash();
        }
      } else {
        const t = this.flightProgress;
        this.x = this.startX + (this.targetX - this.startX) * t;
        this.y = this.startY + (this.targetY - this.startY) * t;
        this.renderHeight = 10 + Math.sin(t * Math.PI) * 58;

        // Trailing toxic chemical vapor particles in 3D flight
        if (particles && Math.random() < 0.45 && window.MedievalSurvivors.game && window.MedievalSurvivors.game.renderer) {
          window.MedievalSurvivors.game.renderer.spawn3DParticle(
            this.x + (Math.random() - 0.5) * 6,
            this.renderHeight + (Math.random() - 0.5) * 4,
            this.y + (Math.random() - 0.5) * 6,
            this.isEvolved ? 0x00f2fe : 0x2ed573,
            9,
            5
          );
        }
      }
      return true;
    } else if (this.state === 'burning') {
      this.duration -= dt;
      if (this.duration <= 0) return false;

      this.tickTimer += dt;
      if (this.tickTimer >= 0.28) {
        this.tickTimer = 0;
        const tickDamage = Math.max(1, Math.round(this.damage * 0.45));
        for (let i = 0, len = enemies.length; i < len; i++) {
          const e = enemies[i];
          if (!e.alive) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          const r = this.poolRadius + e.radius;
          if (dx * dx + dy * dy <= r * r) {
            e.isPoisoned = true;
            const dealt = e.takeDamage(tickDamage, 0, 0, 0);
            this.weapon.totalDamageDealt += dealt;
          }
        }
      }
      return true;
    }
    return false;
  }
}

// ==========================================
// 11. MANGUAL DE FERRO CRAVADO (Iron Flail)
// ==========================================
class IronFlailWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'iron_flail',
      name: 'Mangual de Ferro Cravado',
      icon: '⛓️',
      description: 'Uma pesada esfera de ferro com espinhos ligada por correntes que orbita continuamente o guerreiro, triturando quem se aproximar.',
      maxLevel: 8,
      damage: 26,
      cooldown: 0.1,
      area: 1.0,
      count: 1,
      speed: 3.5,
      levelsConfig: [
        { damage: 26, count: 1, description: 'Esfera de ferro cravada que orbita o jogador causando dano de impacto contínuo.' },
        { damage: 34, speed: 4.2, description: 'Dano: 26 → 34 | +20% Velocidade de Rotação' },
        { count: 2, description: 'Ganha uma 2ª Esfera de Ferro no lado oposto!' },
        { damage: 48, area: 1.3, description: 'Dano: 34 → 48 | +30% Raio da Órbita' },
        { speed: 5.2, description: '+25% Velocidade de Rotação' },
        { count: 3, description: 'Ganha uma 3ª Esfera de Ferro formando barreira defensiva!' },
        { damage: 68, area: 1.5, description: 'Dano: 48 → 68 | +50% Raio da Órbita' },
        { damage: 105, count: 4, speed: 6.5, description: 'EVOLUÇÃO: Mangual do Juízo Divino! 4 Esferas com espinhos sagrados incandescentes.' }
      ]
    });
    this.orbiters = [];
  }

  update(dt, player, enemies, projectiles, particles) {
    if (this.level <= 0 || !player) return;
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const effectiveSpeed = this.baseSpeed * (isEvo ? 1.3 : 1.0);
    const targetCount = this.count + (player.bonusProjectiles || 0);

    while (this.orbiters.length < targetCount) {
      const idx = this.orbiters.length;
      const angle = (idx / targetCount) * Math.PI * 2;
      const orb = new FlailOrbiter({
        weapon: this,
        angle: angle,
        orbitRadius: 70 * effectiveArea,
        damage: effectiveDamage,
        rotSpeed: effectiveSpeed,
        isEvolved: isEvo
      });
      this.orbiters.push(orb);
      projectiles.push(orb);
    }

    for (let i = 0; i < this.orbiters.length; i++) {
      const orb = this.orbiters[i];
      orb.damage = effectiveDamage;
      orb.orbitRadius = 70 * effectiveArea;
      orb.rotSpeed = effectiveSpeed;
      orb.isEvolved = isEvo;
    }
  }
}

class FlailOrbiter {
  constructor(cfg) {
    this.weapon = cfg.weapon;
    this.angle = cfg.angle || 0;
    this.orbitRadius = cfg.orbitRadius || 70;
    this.damage = cfg.damage || 26;
    this.rotSpeed = cfg.rotSpeed || 3.5;
    this.isEvolved = cfg.isEvolved || false;
    this.x = 0;
    this.y = 0;
    this.radius = 16;
    this.hitCooldowns = new Map();
    this.alive = true;
    this.isFlail = true;
  }

  update(dt, enemies, particles) {
    if (!this.weapon || this.weapon.level <= 0) return false;
    const game = window.MedievalSurvivors.gameInstance;
    const player = game ? game.player : null;
    if (!player || !player.alive) return false;

    this.angle += this.rotSpeed * dt;
    this.x = player.x + Math.cos(this.angle) * this.orbitRadius;
    this.y = player.y + Math.sin(this.angle) * this.orbitRadius;

    for (const [e, timer] of this.hitCooldowns.entries()) {
      if (timer <= dt) this.hitCooldowns.delete(e);
      else this.hitCooldowns.set(e, timer - dt);
    }

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitCooldowns.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        const kbX = Math.cos(this.angle) * 16;
        const kbY = Math.sin(this.angle) * 16;
        const dealt = e.takeDamage(this.damage, kbX, kbY, 0.12);
        this.weapon.totalDamageDealt += dealt;
        this.hitCooldowns.set(e, 0.28);

        if (particles && particles.createBloodSparks) {
          particles.createBloodSparks(this.x, this.y, 6, this.isEvolved ? '#f1c40f' : '#bdc3c7');
        }
      }
    }
    return true;
  }
}

// ==========================================
// 12. BACAMARTE DE PÓLVORA NEGRA (Blunderbuss)
// ==========================================
class BlunderbussWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'blunderbuss',
      name: 'Bacamarte de Pólvora Negra',
      icon: '💥',
      description: 'Dispara uma violenta descarga de balotes e estilhaços incandescentes que varre grupos com enorme poder de recuo.',
      maxLevel: 8,
      damage: 18,
      cooldown: 1.6,
      area: 1.0,
      count: 6,
      speed: 420,
      levelsConfig: [
        { damage: 18, count: 6, cooldown: 1.6, description: 'Dispara 6 balotes de chumbo grosso em cone frontal com alto recuo.' },
        { damage: 24, count: 8, description: 'Dano: 18 → 24 | Balotes: 6 → 8' },
        { cooldown: 1.35, description: 'Recarga: 1.6s → 1.35s' },
        { damage: 32, count: 10, description: 'Dano: 24 → 32 | Balotes: 8 → 10' },
        { area: 1.3, cooldown: 1.15, description: '+30% Ângulo do Cone | Recarga: 1.15s' },
        { damage: 45, count: 13, description: 'Dano: 32 → 45 | Balotes: 10 → 13' },
        { damage: 60, count: 16, cooldown: 0.95, description: 'Dano: 45 → 60 | Balotes: 13 → 16 | Recarga: 0.95s' },
        { damage: 95, count: 22, cooldown: 0.75, description: 'EVOLUÇÃO: Dragão de Fogo! 22 projéteis de estilhaços perfurantes incendiários!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalPellets = this.count + (player.bonusProjectiles || 0) * 2;
    const baseAngle = player.facingAngle !== undefined ? player.facingAngle : 0;
    const spreadAngle = 0.65 * this.area * player.areaMultiplier;

    if (particles && particles.createExplosionWave) {
      particles.createExplosionWave(player.x + Math.cos(baseAngle) * 20, player.y + Math.sin(baseAngle) * 20, 25, '#ff793f');
    }

    for (let i = 0; i < totalPellets; i++) {
      const offset = (Math.random() - 0.5) * spreadAngle;
      const pelletAngle = baseAngle + offset;
      const speedVar = this.baseSpeed * (0.85 + Math.random() * 0.3);

      projectiles.push(new BlunderbussPellet({
        x: player.x + Math.cos(baseAngle) * 14,
        y: player.y + Math.sin(baseAngle) * 14,
        angle: pelletAngle,
        speed: speedVar,
        damage: effectiveDamage,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class BlunderbussPellet {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.speed = cfg.speed;
    this.damage = cfg.damage;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.radius = 7;
    this.life = 0.38;
    this.maxLife = 0.38;
    this.alive = true;
    this.isPellet = true;
    this.pierce = this.isEvolved ? 2 : 1;
    this.hitEnemies = new Set();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    if (this.life <= 0) return false;

    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitEnemies.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        this.hitEnemies.add(e);
        const kbX = Math.cos(this.angle) * 22;
        const kbY = Math.sin(this.angle) * 22;
        const dealt = e.takeDamage(this.damage, kbX, kbY, 0.15);
        this.weapon.totalDamageDealt += dealt;

        if (this.isEvolved) e.isBurning = true;

        this.pierce--;
        if (this.pierce <= 0) {
          this.alive = false;
          return false;
        }
      }
    }
    return true;
  }
}

// ==========================================
// 13. CHICOTE PENITENTE (Penitent Whip)
// ==========================================
class PenitentWhipWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'penitent_whip',
      name: 'Chicote Penitente',
      icon: '🩸',
      description: 'Açoita horizontalmente à esquerda e à direita com tiras farpadas banhadas em cinzas sagradas que causam sangramento.',
      maxLevel: 8,
      damage: 28,
      cooldown: 1.25,
      area: 1.0,
      count: 2,
      speed: 1.0,
      levelsConfig: [
        { damage: 28, cooldown: 1.25, description: 'Desfere duas chicotadas horizontais cortantes à esquerda e direita.' },
        { damage: 38, area: 1.2, description: 'Dano: 28 → 38 | +20% Alcance' },
        { cooldown: 1.05, description: 'Recarga: 1.25s → 1.05s' },
        { damage: 52, area: 1.35, description: 'Dano: 38 → 52 | +35% Alcance' },
        { cooldown: 0.88, description: 'Recarga: 1.05s → 0.88s' },
        { damage: 70, area: 1.5, description: 'Dano: 52 → 70 | +50% Alcance' },
        { damage: 95, cooldown: 0.72, description: 'Dano: 70 → 95 | Recarga: 0.72s' },
        { damage: 140, area: 1.75, cooldown: 0.58, description: 'EVOLUÇÃO: Chicote da Flagelação Carmesim! Açoites quádruplos que rasgam a alma!' }
      ]
    });
    this.lashEffects = [];
  }

  attack(player, enemies, projectiles, particles) {
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const reach = 85 * this.area * player.areaMultiplier;

    // Left and Right strikes (or 4 directions if evolved)
    const angles = isEvo ? [0, Math.PI, Math.PI * 0.5, -Math.PI * 0.5] : [0, Math.PI];

    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      const lash = {
        x: player.x,
        y: player.y,
        angle: angle,
        reach: reach,
        duration: 0.18,
        maxDuration: 0.18,
        isEvolved: isEvo,
        player: player
      };
      this.lashEffects.push(lash);

      // Hit detection in straight lash path
      const endX = player.x + Math.cos(angle) * reach;
      const endY = player.y + Math.sin(angle) * reach;

      for (let j = 0, len = enemies.length; j < len; j++) {
        const e = enemies[j];
        if (!e.alive) continue;
        const d = distToSegment(e.x, e.y, player.x, player.y, endX, endY);
        if (d <= 22 + e.radius) {
          const dealt = e.takeDamage(effectiveDamage, Math.cos(angle) * 12, Math.sin(angle) * 12, 0.1);
          this.totalDamageDealt += dealt;
          if (particles && particles.createBloodSparks) {
            particles.createBloodSparks(e.x, e.y, 7, isEvo ? '#e74c3c' : '#c0392b');
          }
        }
      }
    }
  }

  update(dt, player, enemies, projectiles, particles) {
    super.update(dt, player, enemies, projectiles, particles);
    for (let i = this.lashEffects.length - 1; i >= 0; i--) {
      const l = this.lashEffects[i];
      l.duration -= dt;
      if (player) {
        l.x = player.x;
        l.y = player.y;
      }
      if (l.duration <= 0) {
        this.lashEffects.splice(i, 1);
      }
    }
  }
}

// ==========================================
// 14. GLAIVE LUNAR CELESTIAL (Celestial Glaive)
// ==========================================
class CelestialGlaiveWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'celestial_glaive',
      name: 'Glaive Lunar Celestial',
      icon: '🌙',
      description: 'Arremessa uma lâmina lunar giratória que salta entre inimigos consecutivos, acelerando e ganhando poder a cada ricochete.',
      maxLevel: 8,
      damage: 32,
      cooldown: 1.4,
      area: 1.0,
      count: 1,
      speed: 310,
      levelsConfig: [
        { damage: 32, cooldown: 1.4, count: 1, description: 'Lança glaive lunar giratória que salta entre até 4 inimigos.' },
        { damage: 42, description: 'Dano: 32 → 42 | +1 Ricochete Adicional' },
        { count: 2, description: 'Lança 2 Glaives Lunares simultâneas!' },
        { damage: 56, cooldown: 1.2, description: 'Dano: 42 → 56 | Recarga: 1.2s' },
        { damage: 72, description: 'Dano: 56 → 72 | +2 Ricochetes' },
        { count: 3, description: 'Lança 3 Glaives Lunares simultâneas!' },
        { damage: 95, cooldown: 1.0, description: 'Dano: 72 → 95 | Recarga: 1.0s' },
        { damage: 145, count: 4, cooldown: 0.85, description: 'EVOLUÇÃO: Eclipse Astral! 4 Glaives cósmicas com até 9 ricochetes ultra velozes!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    if (enemies.length === 0) return;
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalGlaives = this.count + (player.bonusProjectiles || 0);
    const maxBounces = isEvo ? 9 : 4 + Math.floor(this.level / 2);

    for (let i = 0; i < totalGlaives; i++) {
      const randTarget = enemies[Math.floor(Math.random() * enemies.length)];
      if (!randTarget) continue;

      const angle = Math.atan2(randTarget.y - player.y, randTarget.x - player.x) + (i - (totalGlaives - 1) / 2) * 0.25;

      projectiles.push(new CelestialGlaive({
        x: player.x,
        y: player.y,
        angle: angle,
        damage: effectiveDamage,
        speed: this.baseSpeed,
        maxBounces: maxBounces,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class CelestialGlaive {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.damage = cfg.damage;
    this.speed = cfg.speed;
    this.maxBounces = cfg.maxBounces || 4;
    this.bouncesLeft = this.maxBounces;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.radius = 14;
    this.rotation = 0;
    this.alive = true;
    this.isGlaive = true;
    this.hitCooldowns = new Map();
  }

  update(dt, enemies, particles) {
    if (this.bouncesLeft <= 0) return false;

    this.rotation += dt * 18;
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    for (const [e, timer] of this.hitCooldowns.entries()) {
      if (timer <= dt) this.hitCooldowns.delete(e);
      else this.hitCooldowns.set(e, timer - dt);
    }

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitCooldowns.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 12, Math.sin(this.angle) * 12, 0.1);
        this.weapon.totalDamageDealt += dealt;
        this.hitCooldowns.set(e, 0.35);
        this.bouncesLeft--;

        if (particles && particles.createExplosionWave) {
          particles.createExplosionWave(this.x, this.y, 18, this.isEvolved ? '#70a1ff' : '#00d2d3');
        }

        // Find next nearest enemy to ricochet toward
        let nextTarget = null;
        let minDist = 260;
        for (let j = 0; j < len; j++) {
          const cand = enemies[j];
          if (cand !== e && cand.alive && !this.hitCooldowns.has(cand)) {
            const d = Math.hypot(cand.x - this.x, cand.y - this.y);
            if (d < minDist) {
              minDist = d;
              nextTarget = cand;
            }
          }
        }

        if (nextTarget) {
          this.angle = Math.atan2(nextTarget.y - this.y, nextTarget.x - this.x);
          this.speed *= 1.12; // Accelerate on bounce
        }

        if (this.bouncesLeft <= 0) {
          this.alive = false;
          return false;
        }
        break;
      }
    }
    return true;
  }
}

// ==========================================
// 15. MARTELO DO TROVÃO (Thunder Hammer)
// ==========================================
class ThunderHammerWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'thunder_hammer',
      name: 'Martelo do Trovão dos Anões',
      icon: '⚡',
      description: 'Invoca raios verticais devastadores dos céus sobre os maiores aglomerados de monstros, eletrocutando em cadeia.',
      maxLevel: 8,
      damage: 45,
      cooldown: 1.5,
      area: 1.0,
      count: 1,
      speed: 1.0,
      levelsConfig: [
        { damage: 45, cooldown: 1.5, count: 1, description: 'Faz cair 1 raio colossal dos céus causando impacto elétrico em área.' },
        { damage: 60, area: 1.25, description: 'Dano: 45 → 60 | +25% Raio do Impacto' },
        { count: 2, description: 'Invoca 2 Raios simultâneos!' },
        { damage: 80, cooldown: 1.25, description: 'Dano: 60 → 80 | Recarga: 1.25s' },
        { count: 3, area: 1.4, description: 'Invoca 3 Raios simultâneos | +40% Área' },
        { damage: 110, cooldown: 1.05, description: 'Dano: 80 → 110 | Recarga: 1.05s' },
        { count: 4, description: 'Invoca 4 Raios simultâneos!' },
        { damage: 175, count: 5, cooldown: 0.85, area: 1.65, description: 'EVOLUÇÃO: Ira de Thor! 5 Raios cósmicos que propagam arcos elétricos em cadeia!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    if (enemies.length === 0) return;
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const strikeRadius = 38 * this.area * player.areaMultiplier;
    const strikeCount = this.count + (player.bonusProjectiles || 0);

    for (let s = 0; s < strikeCount; s++) {
      const target = enemies[Math.floor(Math.random() * enemies.length)];
      if (!target) continue;

      const strikeX = target.x + (Math.random() - 0.5) * 20;
      const strikeY = target.y + (Math.random() - 0.5) * 20;

      projectiles.push(new ThunderStrike({
        x: strikeX,
        y: strikeY,
        radius: strikeRadius,
        damage: effectiveDamage,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class ThunderStrike {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.radius = cfg.radius || 38;
    this.damage = cfg.damage || 45;
    this.isEvolved = cfg.isEvolved || false;
    this.weapon = cfg.weapon;
    this.duration = 0.25;
    this.maxDuration = 0.25;
    this.hasDamaged = false;
    this.alive = true;
    this.isThunder = true;
  }

  update(dt, enemies, particles) {
    this.duration -= dt;
    if (!this.hasDamaged) {
      this.hasDamaged = true;

      if (particles && particles.createExplosionWave) {
        particles.createExplosionWave(this.x, this.y, this.radius, this.isEvolved ? '#f1c40f' : '#00d2d3');
      }

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        const dist = this.radius + e.radius;
        if (dx * dx + dy * dy <= dist * dist) {
          const dealt = e.takeDamage(this.damage, dx * 0.2, dy * 0.2, 0.2);
          this.weapon.totalDamageDealt += dealt;

          if (this.isEvolved) {
            // Chain lightning to one adjacent enemy
            for (let j = 0; j < len; j++) {
              const chainE = enemies[j];
              if (chainE !== e && chainE.alive && Math.hypot(chainE.x - e.x, chainE.y - e.y) < 110) {
                const chainDmg = Math.round(this.damage * 0.5);
                const chainDealt = chainE.takeDamage(chainDmg, 0, 0, 0.1);
                this.weapon.totalDamageDealt += chainDealt;
                break;
              }
            }
          }
        }
      }
    }
    return this.duration > 0;
  }
}

// ==========================================
// 16. ZARABATANA DA VÍBORA (Viper Blowpipe)
// ==========================================
class ViperBlowpipeWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'viper_blowpipe',
      name: 'Zarabatana da Víbora',
      icon: '🎋',
      description: 'Dispara rajadas rápidas de dardos envenenados perfurantes que retardam em 35% e corroem os sinais vitais dos monstros.',
      maxLevel: 8,
      damage: 15,
      cooldown: 0.85,
      area: 1.0,
      count: 2,
      speed: 420,
      levelsConfig: [
        { damage: 15, cooldown: 0.85, count: 2, description: 'Dispara 2 dardos perfurantes de neurotoxina que reduzem a velocidade do inimigo.' },
        { damage: 22, count: 3, description: 'Dano: 15 → 22 | Dardos: 2 → 3' },
        { cooldown: 0.72, description: 'Recarga: 0.85s → 0.72s' },
        { damage: 30, count: 4, description: 'Dano: 22 → 30 | Dardos: 3 → 4' },
        { cooldown: 0.6, description: 'Recarga: 0.72s → 0.6s' },
        { damage: 42, count: 5, description: 'Dano: 30 → 42 | Dardos: 4 → 5' },
        { damage: 55, cooldown: 0.48, count: 6, description: 'Dano: 42 → 55 | Dardos: 5 → 6 | Recarga: 0.48s' },
        { damage: 85, count: 8, cooldown: 0.38, description: 'EVOLUÇÃO: Peçonha das Mil Serpentes! Rajada de 8 dardos ultra perfurantes que paralisam inimigos!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalDarts = this.count + (player.bonusProjectiles || 0);
    const baseAngle = player.facingAngle !== undefined ? player.facingAngle : 0;

    for (let i = 0; i < totalDarts; i++) {
      const spread = (i - (totalDarts - 1) / 2) * 0.12;
      projectiles.push(new ViperDart({
        x: player.x,
        y: player.y,
        angle: baseAngle + spread,
        damage: effectiveDamage,
        speed: this.baseSpeed,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class ViperDart {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.damage = cfg.damage;
    this.speed = cfg.speed;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.radius = 8;
    this.life = 1.1;
    this.alive = true;
    this.isDart = true;
    this.pierce = this.isEvolved ? 6 : 3;
    this.hitEnemies = new Set();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    if (this.life <= 0) return false;

    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitEnemies.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        this.hitEnemies.add(e);
        e.isPoisoned = true;
        e.speedModifier = this.isEvolved ? 0.45 : 0.65; // Slow down enemy!

        const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 8, Math.sin(this.angle) * 8, 0.08);
        this.weapon.totalDamageDealt += dealt;

        this.pierce--;
        if (this.pierce <= 0) {
          this.alive = false;
          return false;
        }
      }
    }
    return true;
  }
}

// ==========================================
// 17. TOMO DOS SUSSURROS ARCANOS (Eldritch Tome)
// ==========================================
class EldritchTomeWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'eldritch_tome',
      name: 'Tomo dos Sussurros Arcanos',
      icon: '📖',
      description: 'Abre fendas gravitacionais no solo que sugam os monstros para o centro antes de colapsar em uma implosão cósmica.',
      maxLevel: 8,
      damage: 14,
      cooldown: 2.2,
      area: 1.0,
      count: 1,
      speed: 1.0,
      levelsConfig: [
        { damage: 14, cooldown: 2.2, count: 1, description: 'Cria 1 vórtex gravitacional por 2.5s que puxa monstros e causa dano de sucção contínuo.' },
        { damage: 20, area: 1.25, description: 'Dano: 14 → 20 | +25% Raio de Sucção' },
        { count: 2, description: 'Abre 2 Vórtex Gravitacionais simultâneos!' },
        { damage: 28, cooldown: 1.9, description: 'Dano: 20 → 28 | Recarga: 1.9s' },
        { area: 1.45, description: '+45% Força Gravitacional e Raio' },
        { count: 3, description: 'Abre 3 Vórtex Gravitacionais simultâneos!' },
        { damage: 42, cooldown: 1.6, description: 'Dano: 28 → 42 | Recarga: 1.6s' },
        { damage: 75, count: 4, area: 1.75, cooldown: 1.3, description: 'EVOLUÇÃO: Buraco Negro Astral! 4 Vórtex cósmicos com implosão devastadora final!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    if (!enemies || enemies.length === 0) return;
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const vortexRadius = 65 * this.area * player.areaMultiplier;
    const vortexCount = this.count + (player.bonusProjectiles || 0);

    const living = enemies.filter(e => e.alive);
    if (living.length === 0) return;
    living.sort((a, b) => {
      const d1 = (a.x - player.x) * (a.x - player.x) + (a.y - player.y) * (a.y - player.y);
      const d2 = (b.x - player.x) * (b.x - player.x) + (b.y - player.y) * (b.y - player.y);
      return d1 - d2;
    });

    for (let v = 0; v < vortexCount; v++) {
      const targetEnemy = living[v % living.length];
      if (!targetEnemy) continue;

      projectiles.push(new VoidVortex({
        x: randEnemy.x,
        y: randEnemy.y,
        radius: vortexRadius,
        damage: effectiveDamage,
        duration: isEvo ? 3.2 : 2.4,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class VoidVortex {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.radius = cfg.radius || 65;
    this.damage = cfg.damage || 14;
    this.duration = cfg.duration || 2.4;
    this.maxDuration = this.duration;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.tickTimer = 0;
    this.alive = true;
    this.isVortex = true;
  }

  update(dt, enemies, particles) {
    this.duration -= dt;
    if (this.duration <= 0) {
      // Final Implosion Nova
      const novaDamage = Math.round(this.damage * 3.5);
      if (particles && particles.createExplosionWave) {
        particles.createExplosionWave(this.x, this.y, this.radius * 1.3, this.isEvolved ? '#e056fd' : '#be2edd');
      }
      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        if (dx * dx + dy * dy <= this.radius * this.radius) {
          const dealt = e.takeDamage(novaDamage, dx * 0.3, dy * 0.3, 0.25);
          this.weapon.totalDamageDealt += dealt;
        }
      }
      return false;
    }

    // Pull enemies inward continuously
    const pullSpeed = 95 * dt;
    this.tickTimer += dt;
    const doTick = this.tickTimer >= 0.25;
    if (doTick) this.tickTimer = 0;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive) continue;
      const dx = this.x - e.x;
      const dy = this.y - e.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= this.radius + e.radius && dist > 4) {
        // Suction force
        e.x += (dx / dist) * pullSpeed;
        e.y += (dy / dist) * pullSpeed;

        if (doTick) {
          const dealt = e.takeDamage(this.damage, 0, 0, 0.05);
          this.weapon.totalDamageDealt += dealt;
        }
      }
    }
    return true;
  }
}

// ==========================================
// 18. LANÇA DE GELO GLACIAL (Frost Lance)
// ==========================================
class FrostLanceWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'frost_lance',
      name: 'Lança de Gelo Glacial',
      icon: '❄️',
      description: 'Dispara estacas de gelo cortante que perfuram e congelam os inimigos, estilhaçando-se ao derrotá-los.',
      maxLevel: 8,
      damage: 30,
      cooldown: 1.3,
      area: 1.0,
      count: 1,
      speed: 380,
      levelsConfig: [
        { damage: 30, cooldown: 1.3, count: 1, description: 'Dispara 1 estaca de gelo perfurante que congela inimigos por 1.2s.' },
        { damage: 40, description: 'Dano: 30 → 40 | +1 Inimigo Perfurado' },
        { count: 2, description: 'Dispara 2 Lanças de Gelo simultâneas!' },
        { damage: 54, cooldown: 1.1, description: 'Dano: 40 → 54 | Recarga: 1.1s' },
        { count: 3, description: 'Dispara 3 Lanças de Gelo em leque!' },
        { damage: 72, cooldown: 0.95, description: 'Dano: 54 → 72 | Recarga: 0.95s' },
        { count: 4, description: 'Dispara 4 Lanças de Gelo!' },
        { damage: 120, count: 5, cooldown: 0.75, description: 'EVOLUÇÃO: Zero Absoluto! 5 Lanças de gelo eterno que congelam e estilhaçam em cadeia!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalLances = this.count + (player.bonusProjectiles || 0);
    const baseAngle = player.facingAngle !== undefined ? player.facingAngle : 0;

    for (let i = 0; i < totalLances; i++) {
      const spread = (i - (totalLances - 1) / 2) * 0.16;
      projectiles.push(new FrostLance({
        x: player.x,
        y: player.y,
        angle: baseAngle + spread,
        damage: effectiveDamage,
        speed: this.baseSpeed,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class FrostLance {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.damage = cfg.damage;
    this.speed = cfg.speed;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.radius = 12;
    this.life = 1.3;
    this.alive = true;
    this.isIce = true;
    this.pierce = this.isEvolved ? 5 : 2;
    this.hitEnemies = new Set();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    if (this.life <= 0) return false;

    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitEnemies.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        this.hitEnemies.add(e);
        e.isFrozen = true;
        e.freezeTimer = this.isEvolved ? 2.0 : 1.2;

        const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 14, Math.sin(this.angle) * 14, 0.1);
        this.weapon.totalDamageDealt += dealt;

        if (particles && particles.createBloodSparks) {
          particles.createBloodSparks(this.x, this.y, 6, '#74b9ff');
        }

        this.pierce--;
        if (this.pierce <= 0) {
          this.alive = false;
          return false;
        }
      }
    }
    return true;
  }
}

// ==========================================
// 19. ESCUDO DA RETALIAÇÃO (Retribution Shield)
// ==========================================
class RetributionShieldWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'retribution_shield',
      name: 'Escudo da Retaliação Sagrada',
      icon: '🛡️',
      description: 'Invoca escudos de luz que orbitam o paladino, destruindo projéteis inimigos e golpeando monstros com dano sagrado.',
      maxLevel: 8,
      damage: 35,
      cooldown: 0.1,
      area: 1.0,
      count: 1,
      speed: 2.8,
      levelsConfig: [
        { damage: 35, count: 1, description: '1 Escudo Sagrado orbitante que anula projéteis inimigos e golpeia atacantes.' },
        { damage: 45, speed: 3.4, description: 'Dano: 35 → 45 | +20% Velocidade' },
        { count: 2, description: 'Invoca um 2º Escudo no lado oposto!' },
        { damage: 60, area: 1.25, description: 'Dano: 45 → 60 | +25% Raio de Proteção' },
        { count: 3, description: 'Invoca um 3º Escudo Sagrado!' },
        { damage: 80, speed: 4.2, description: 'Dano: 60 → 80 | +25% Velocidade' },
        { count: 4, description: 'Invoca um 4º Escudo formando barreira total!' },
        { damage: 130, count: 5, speed: 5.5, description: 'EVOLUÇÃO: Bastião dos Querubins! 5 Escudos dourados que refletem projéteis e emitem chamas!' }
      ]
    });
    this.shields = [];
  }

  update(dt, player, enemies, projectiles, particles) {
    if (this.level <= 0 || !player) return;
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const effectiveArea = this.area * player.areaMultiplier;
    const effectiveSpeed = this.baseSpeed * (isEvo ? 1.25 : 1.0);
    const targetCount = this.count + (player.bonusProjectiles || 0);

    while (this.shields.length < targetCount) {
      const idx = this.shields.length;
      const angle = (idx / targetCount) * Math.PI * 2;
      const s = new RetributionShieldOrbiter({
        weapon: this,
        angle: angle,
        orbitRadius: 52 * effectiveArea,
        damage: effectiveDamage,
        rotSpeed: effectiveSpeed,
        isEvolved: isEvo
      });
      this.shields.push(s);
      projectiles.push(s);
    }

    for (let i = 0; i < this.shields.length; i++) {
      const s = this.shields[i];
      s.damage = effectiveDamage;
      s.orbitRadius = 52 * effectiveArea;
      s.rotSpeed = effectiveSpeed;
      s.isEvolved = isEvo;
    }
  }
}

class RetributionShieldOrbiter {
  constructor(cfg) {
    this.weapon = cfg.weapon;
    this.angle = cfg.angle || 0;
    this.orbitRadius = cfg.orbitRadius || 52;
    this.damage = cfg.damage || 35;
    this.rotSpeed = cfg.rotSpeed || 2.8;
    this.isEvolved = cfg.isEvolved || false;
    this.x = 0;
    this.y = 0;
    this.radius = 16;
    this.hitCooldowns = new Map();
    this.alive = true;
    this.isShield = true;
  }

  update(dt, enemies, particles) {
    if (!this.weapon || this.weapon.level <= 0) return false;
    const game = window.MedievalSurvivors.gameInstance;
    const player = game ? game.player : null;
    if (!player || !player.alive) return false;

    this.angle += this.rotSpeed * dt;
    this.x = player.x + Math.cos(this.angle) * this.orbitRadius;
    this.y = player.y + Math.sin(this.angle) * this.orbitRadius;

    // Check & Destroy Enemy Projectiles (Parry Barrier)
    if (game && game.enemyProjectiles) {
      for (let i = game.enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = game.enemyProjectiles[i];
        if (!ep.alive) continue;
        const dx = ep.x - this.x;
        const dy = ep.y - this.y;
        if (dx * dx + dy * dy <= 22 * 22) {
          ep.alive = false;
          if (particles && particles.createExplosionWave) {
            particles.createExplosionWave(this.x, this.y, 20, '#f1c40f');
          }
        }
      }
    }

    for (const [e, timer] of this.hitCooldowns.entries()) {
      if (timer <= dt) this.hitCooldowns.delete(e);
      else this.hitCooldowns.set(e, timer - dt);
    }

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive || this.hitCooldowns.has(e)) continue;

      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const hitDist = this.radius + e.radius;
      if (dx * dx + dy * dy <= hitDist * hitDist) {
        const kbX = Math.cos(this.angle) * 18;
        const kbY = Math.sin(this.angle) * 18;
        const dealt = e.takeDamage(this.damage, kbX, kbY, 0.15);
        this.weapon.totalDamageDealt += dealt;
        this.hitCooldowns.set(e, 0.32);

        if (particles && particles.createBloodSparks) {
          particles.createBloodSparks(this.x, this.y, 6, '#f39c12');
        }
      }
    }
    return true;
  }
}

// ==========================================
// 20. CALDEIRÃO DE FOGO GREGO (Hellfire Cauldron)
// ==========================================
class HellfireCauldronWeapon extends BaseWeapon {
  constructor() {
    super({
      id: 'hellfire_cauldron',
      name: 'Caldeirão de Fogo Grego',
      icon: '🏺',
      description: 'Derruba ânforas de fogo grego instáveis enquanto você se desloca, criando uma muralha de chamas contínua na retaguarda.',
      maxLevel: 8,
      damage: 22,
      cooldown: 0.9,
      area: 1.0,
      count: 1,
      speed: 1.0,
      levelsConfig: [
        { damage: 22, cooldown: 0.9, count: 1, description: 'Deixa para trás ânforas que explodem criando poças de chamas vivas por 3.5s.' },
        { damage: 30, area: 1.25, description: 'Dano: 22 → 30 | +25% Raio das Chamas' },
        { cooldown: 0.75, description: 'Recarga: 0.9s → 0.75s' },
        { damage: 42, count: 2, description: 'Dano: 30 → 42 | Derruba 2 Ânforas simultâneas' },
        { cooldown: 0.62, description: 'Recarga: 0.75s → 0.62s' },
        { damage: 58, area: 1.45, description: 'Dano: 42 → 58 | +45% Área de Chamas' },
        { count: 3, cooldown: 0.52, description: 'Derruba 3 Ânforas simultâneas | Recarga: 0.52s' },
        { damage: 95, count: 4, cooldown: 0.42, area: 1.7, description: 'EVOLUÇÃO: Mar de Fogo Vulcânico! 4 Ânforas de fogo infernal azul com queima perene!' }
      ]
    });
  }

  attack(player, enemies, projectiles, particles) {
    const isEvo = this.level >= this.maxLevel;
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const poolRadius = 36 * this.area * player.areaMultiplier;
    const totalCauldrons = this.count + (player.bonusProjectiles || 0);

    for (let c = 0; c < totalCauldrons; c++) {
      const spreadX = (Math.random() - 0.5) * 25;
      const spreadY = (Math.random() - 0.5) * 25;

      projectiles.push(new HellfireCauldron({
        x: player.x - Math.cos(player.facingAngle || 0) * 12 + spreadX,
        y: player.y - Math.sin(player.facingAngle || 0) * 12 + spreadY,
        damage: effectiveDamage,
        poolRadius: poolRadius,
        duration: isEvo ? 5.2 : 3.6,
        isEvolved: isEvo,
        weapon: this
      }));
    }
  }
}

class HellfireCauldron {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.damage = cfg.damage;
    this.poolRadius = cfg.poolRadius;
    this.duration = cfg.duration;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.state = 'burning';
    this.radius = this.poolRadius;
    this.tickTimer = 0;
    this.alive = true;
    this.isHellfire = true;
  }

  update(dt, enemies, particles) {
    this.duration -= dt;
    if (this.duration <= 0) return false;

    this.tickTimer += dt;
    if (this.tickTimer >= 0.28) {
      this.tickTimer = 0;
      const tickDamage = Math.max(1, Math.round(this.damage * 0.4));
      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        const r = this.poolRadius + e.radius;
        if (dx * dx + dy * dy <= r * r) {
          e.isBurning = true;
          const dealt = e.takeDamage(tickDamage, 0, 0, 0);
          this.weapon.totalDamageDealt += dealt;
        }
      }
    }
    return true;
  }
}

// Utility: distance from point (px, py) to line segment (x1, y1) - (x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Weapon Factory / Registry
class WeaponRegistry {
  constructor() {
    this.factories = new Map();
    this.initFactories();
  }

  initFactories() {
    this.factories.set('broadsword', () => new BroadswordWeapon());
    this.factories.set('crossbow', () => new CrossbowWeapon());
    this.factories.set('holy_fire', () => new HolyFireWeapon());
    this.factories.set('whirling_axes', () => new WhirlingAxesWeapon());
    this.factories.set('holy_aura', () => new HolyAuraWeapon());
    this.factories.set('guardian_spear', () => new GuardianSpearWeapon());
    this.factories.set('spectral_orb', () => new SpectralOrbWeapon());
    this.factories.set('twin_daggers', () => new TwinDaggersWeapon());
    this.factories.set('dark_greatsword', () => new DarkGreatswordWeapon());
    this.factories.set('plague_flask', () => new PlagueFlaskWeapon());
    this.factories.set('iron_flail', () => new IronFlailWeapon());
    this.factories.set('blunderbuss', () => new BlunderbussWeapon());
    this.factories.set('penitent_whip', () => new PenitentWhipWeapon());
    this.factories.set('celestial_glaive', () => new CelestialGlaiveWeapon());
    this.factories.set('thunder_hammer', () => new ThunderHammerWeapon());
    this.factories.set('viper_blowpipe', () => new ViperBlowpipeWeapon());
    this.factories.set('eldritch_tome', () => new EldritchTomeWeapon());
    this.factories.set('frost_lance', () => new FrostLanceWeapon());
    this.factories.set('retribution_shield', () => new RetributionShieldWeapon());
    this.factories.set('hellfire_cauldron', () => new HellfireCauldronWeapon());

    // 10 Armas Supremas (Fusões Lendárias)
    this.factories.set('supreme_excalibur', () => new window.MedievalSurvivors.SupremeExcaliburWeapon());
    this.factories.set('supreme_artillery_cannon', () => new window.MedievalSurvivors.SupremeArtilleryCannonWeapon());
    this.factories.set('supreme_purgatory_fire', () => new window.MedievalSurvivors.SupremePurgatoryFireWeapon());
    this.factories.set('supreme_titan_storm', () => new window.MedievalSurvivors.SupremeTitanStormWeapon());
    this.factories.set('supreme_celestial_fortress', () => new window.MedievalSurvivors.SupremeCelestialFortressWeapon());
    this.factories.set('supreme_soul_singularity', () => new window.MedievalSurvivors.SupremeSoulSingularityWeapon());
    this.factories.set('supreme_blood_dance', () => new window.MedievalSurvivors.SupremeBloodDanceWeapon());
    this.factories.set('supreme_cataclysm_breaker', () => new window.MedievalSurvivors.SupremeCataclysmBreakerWeapon());
    this.factories.set('supreme_black_death', () => new window.MedievalSurvivors.SupremeBlackDeathWeapon());
    this.factories.set('supreme_stellar_frost', () => new window.MedievalSurvivors.SupremeStellarFrostWeapon());
  }

  create(id) {
    const factory = this.factories.get(id);
    return factory ? factory() : null;
  }

  getAllWeaponIds(includeSupreme = false) {
    const all = Array.from(this.factories.keys());
    if (includeSupreme) return all;
    return all.filter(id => !id.startsWith('supreme_'));
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.weapons = new WeaponRegistry();

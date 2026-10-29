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
    const baseReach = 95 * effectiveArea;
    const facingAngle = player.facingAngle || 0;
    const totalCount = this.count + (player.bonusProjectiles || 0);

    const arcs = [];
    if (totalCount === 1) {
      arcs.push(facingAngle);
    } else if (totalCount === 2) {
      arcs.push(facingAngle);
      arcs.push(facingAngle + Math.PI); // Costas
    } else if (totalCount === 3) {
      arcs.push(facingAngle - 0.45);
      arcs.push(facingAngle);
      arcs.push(facingAngle + 0.45);
    } else {
      // 4 ou mais: Círculo completo
      for (let i = 0; i < totalCount; i++) {
        arcs.push(facingAngle + (i * Math.PI * 2 / totalCount));
      }
    }

    const arcSpreadHalf = (Math.PI * 0.65) / 2;
    arcs.forEach(angle => {
      this.slashEffects.push({
        x: player.x,
        y: player.y,
        angle: angle,
        radius: baseReach,
        duration: 0.22,
        maxDuration: 0.22,
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
      this.slashEffects[i].duration -= dt;
      if (this.slashEffects[i].duration <= 0) {
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
      speed: 680,
      levelsConfig: [
        { damage: 28, cooldown: 0.9, count: 1, description: 'Dispara 1 virote com penetração.' },
        { count: 2, damage: 34, description: 'Disparo Duplo (2 virotes) | Dano: 34' },
        { cooldown: 0.75, description: 'Recarga Rápida: 0.9s ➔ 0.75s' },
        { count: 3, damage: 45, description: 'Disparo Triplo (3 virotes) | Dano: 45' },
        { damage: 60, speed: 850, description: 'Virotes Reforçados | Dano: 60 | +25% Vel. Projétil' },
        { count: 4, cooldown: 0.6, description: 'Saraivada Quádrupla (4 virotes) | Recarga: 0.6s' },
        { damage: 85, count: 5, description: 'Chuva de Virotes (5 disparos) | Dano: 85' },
        { damage: 130, count: 7, cooldown: 0.45, description: 'EVOLUÇÃO: Balista Flamejante (7 virotes perfurantes incendiários)' }
      ]
    });
    this.pierceCount = 2;
  }

  attack(player, enemies, projectiles, particles) {
    if (enemies.length === 0) return;

    // Filter alive enemies and sort by squared distance
    const targets = [];
    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive) continue;
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      targets.push({ enemy: e, distSq: dx * dx + dy * dy });
    }
    if (targets.length === 0) return;
    targets.sort((a, b) => a.distSq - b.distSq);

    window.MedievalSurvivors.sound.playCrossbow();
    const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
    const totalCount = this.count + (player.bonusProjectiles || 0);

    for (let i = 0; i < totalCount; i++) {
      // Pick nearest targets or fan out
      const target = targets[i % targets.length].enemy;
      const angle = Math.atan2(target.y - player.y, target.x - player.x) + (Math.random() - 0.5) * 0.15;

      projectiles.push(new CrossbowBolt({
        x: player.x,
        y: player.y,
        angle: angle,
        speed: this.baseSpeed,
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

    for (let i = 0; i < totalCount; i++) {
      // Pick random location around player or target enemies
      let targetX = player.x + (Math.random() - 0.5) * 380;
      let targetY = player.y + (Math.random() - 0.5) * 380;

      if (enemies.length > 0) {
        const randEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        if (randEnemy && randEnemy.alive) {
          targetX = randEnemy.x + (Math.random() - 0.5) * 50;
          targetY = randEnemy.y + (Math.random() - 0.5) * 50;
        }
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
    this.flightSpeed = 2.2;
    this.burnTimer = this.duration;
    this.tickTimer = 0;
    this.tickRate = 0.28; // Ticks every 0.28 seconds
  }

  update(dt, enemies, particles) {
    if (this.state === 'flying') {
      this.flightProgress += this.flightSpeed * dt;
      if (this.flightProgress >= 1) {
        this.state = 'burning';
        this.x = this.targetX;
        this.y = this.targetY;
        window.MedievalSurvivors.sound.playFireBurst();
        particles.createExplosionWave(this.x, this.y, this.radius, this.isEvolved ? '#3498db' : '#e67e22');
      } else {
        const p = this.flightProgress;
        this.x = this.startX + (this.targetX - this.startX) * p;
        // Arc trajectory
        const arcHeight = Math.sin(p * Math.PI) * 90;
        this.y = this.startY + (this.targetY - this.startY) * p - arcHeight;
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

    for (let i = 0; i < totalCount; i++) {
      const spreadX = (Math.random() - 0.5) * 340;
      const vy = -(390 + Math.random() * 120);

      projectiles.push(new ThrownAxe({
        x: player.x,
        y: player.y,
        vx: spreadX,
        vy: vy,
        gravity: 600,
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
    this.vx = cfg.vx;
    this.vy = cfg.vy;
    this.gravity = cfg.gravity;
    this.damage = cfg.damage;
    this.size = cfg.size;
    this.isEvolved = cfg.isEvolved;
    this.weapon = cfg.weapon;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = (this.vx >= 0 ? 1 : -1) * 15;
    this.life = 2.4;
    this.hitCooldowns = new Map();
  }

  update(dt, enemies, particles) {
    this.life -= dt;
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.spinSpeed * dt;

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
        const dealt = enemy.takeDamage(this.damage, this.vx > 0 ? 1 : -1, 0.2, 10);
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
        speed: isEvolved ? 640 : 500,
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
  }

  create(id) {
    const factory = this.factories.get(id);
    return factory ? factory() : null;
  }

  getAllWeaponIds() {
    return Array.from(this.factories.keys());
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.weapons = new WeaponRegistry();

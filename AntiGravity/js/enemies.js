/**
 * Medieval Survivors - Enemy & Mini-Boss Architecture
 * Manages diverse enemy variants, distinct behaviors, wave director, and timed mini-boss encounters.
 */

let enemyIdCounter = 1;

class BaseEnemy {
  constructor(config) {
    this.id = enemyIdCounter++;
    this.type = config.type || 'basic';
    this.name = config.name || 'Inimigo';
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.vx = 0;
    this.vy = 0;
    this.speed = config.speed || 60;
    this.maxHp = config.hp || 30;
    this.hp = this.maxHp;
    this.damage = config.damage || 10;
    this.radius = config.radius || 12;
    this.xpValue = config.xpValue || 1;
    this.color = config.color || '#e74c3c';
    this.alive = true;
    this.isBoss = config.isBoss || false;
    this.bossTier = config.bossTier || 1;
    this.walkCycle = Math.random() * Math.PI * 2;
    this.knockbackX = 0;
    this.knockbackY = 0;
    this.dropChest = config.dropChest || false;
  }

  takeDamage(amount, hitDirX = 0, hitDirY = 0, knockbackForce = 0) {
    if (!this.alive) return 0;
    const actualDamage = Math.max(1, amount);
    this.hp -= actualDamage;

    // Bosses have heavy knockback resistance
    const kbResistance = this.isBoss ? 0.15 : 1.0;
    this.knockbackX = hitDirX * knockbackForce * kbResistance * 25;
    this.knockbackY = hitDirY * knockbackForce * kbResistance * 25;

    // Spawn floating damage text
    if (window.MedievalSurvivors.game) {
      window.MedievalSurvivors.game.addFloatingText(
        this.x,
        this.y,
        actualDamage.toString(),
        this.isBoss ? '#f1c40f' : '#ffffff',
        this.isBoss
      );
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }

    return actualDamage;
  }

  update(dt, player, allEnemies, enemyProjectiles) {
    if (!this.alive) return;
    this.walkCycle += dt * 8;

    // Knockback decay
    this.knockbackX *= Math.pow(0.01, dt);
    this.knockbackY *= Math.pow(0.01, dt);

    // Vector towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    let moveX = (dx / dist) * this.speed;
    let moveY = (dy / dist) * this.speed;

    // Separation from nearby enemies using spatial grid / squared distance (O(1) cell lookup)
    if (!this.isBoss) {
      const game = window.MedievalSurvivors.game;
      const neighbors = (game && game.getNearbyEnemies) ? game.getNearbyEnemies(this.x, this.y) : allEnemies;
      for (let i = 0, len = neighbors.length; i < len; i++) {
        const other = neighbors[i];
        if (other === this || !other.alive) continue;
        const ox = this.x - other.x;
        const oy = this.y - other.y;
        const minDist = this.radius + other.radius;
        const dSq = ox * ox + oy * oy;
        if (dSq > 0 && dSq < minDist * minDist) {
          const d = Math.sqrt(dSq);
          const push = ((minDist - d) / minDist) * 45;
          moveX += (ox / d) * push;
          moveY += (oy / d) * push;
        }
      }
    }

    this.vx = moveX;
    this.vy = moveY;

    // Apply movement & knockback
    this.x += (moveX + this.knockbackX) * dt;
    this.y += (moveY + this.knockbackY) * dt;

    // Collision with player
    if (dist <= this.radius + player.radius) {
      player.takeDamage(this.damage);
    }
  }

  render(ctx) {
    if (!this.alive) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, this.radius * 0.9, this.radius * 0.85, this.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Determine facing direction (1 for right, -1 for left)
    const facingX = (this.vx > 0.05 ? 1 : (this.vx < -0.05 ? -1 : (this.facingDir || 1)));
    this.facingDir = facingX;

    ctx.save();
    ctx.scale(facingX * 1.28, 1.28);
    this.renderCustom(ctx);
    ctx.restore();

    // Boss Health Bar above head
    if (this.isBoss && this.hp > 0) {
      const barW = Math.max(70, this.radius * 2.2);
      const barH = 7;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(-barW / 2, -this.radius - 20, barW, barH);
      ctx.fillStyle = '#e74c3c';
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillRect(-barW / 2, -this.radius - 20, barW * pct, barH);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-barW / 2, -this.radius - 20, barW, barH);

      // Boss Name above bar
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 11px Cinzel, Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, 0, -this.radius - 24);
    }

    ctx.restore();
  }

  renderCustom(ctx) {
    // Default circle fallback
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 1. RATO DA PESTE (Plague Rat)
class PlagueRatEnemy extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'rat',
      name: 'Rato da Peste',
      x, y,
      hp: Math.round(18 * scaling),
      damage: 8,
      speed: 105,
      radius: 12,
      xpValue: 1,
      color: '#555555'
    });
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 2;
    // Tail with sinuous animation
    ctx.strokeStyle = '#8c7b75';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-9, bob + 1);
    const tailWiggle = Math.sin(this.walkCycle * 1.5) * 4;
    ctx.quadraticCurveTo(-15, bob - 5 + tailWiggle, -20, bob + 2 - tailWiggle);
    ctx.stroke();

    // Four scurrying paws
    ctx.fillStyle = '#ffb8b8';
    const legOffset1 = Math.sin(this.walkCycle) * 3;
    ctx.fillRect(-7 + legOffset1, 5 + bob, 3, 3);
    ctx.fillRect(4 - legOffset1, 5 + bob, 3, 3);

    // Furry hunchbacked rat body
    ctx.fillStyle = '#3a3028';
    ctx.beginPath();
    ctx.ellipse(-1, bob, 11, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Darker dorsal fur
    ctx.fillStyle = '#261f1a';
    ctx.beginPath();
    ctx.ellipse(-2, bob - 2, 8, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pointed muzzle / snout
    ctx.fillStyle = '#4a3f35';
    ctx.beginPath();
    ctx.moveTo(6, -4 + bob);
    ctx.lineTo(13, bob);
    ctx.lineTo(6, 4 + bob);
    ctx.closePath();
    ctx.fill();

    // Pink nose
    ctx.fillStyle = '#e84393';
    ctx.fillRect(12, bob - 1, 2, 2);

    // Whiskers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(11, bob - 1);
    ctx.lineTo(16, bob - 4);
    ctx.moveTo(11, bob + 1);
    ctx.lineTo(16, bob + 4);
    ctx.stroke();

    // Rounded Ears
    ctx.fillStyle = '#261f1a';
    ctx.beginPath();
    ctx.arc(3, -6 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffb8b8';
    ctx.beginPath();
    ctx.arc(3, -6 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Glowing green plague eyes
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(7, -3 + bob, 2.5, 2.5);
  }
}

// 2. ESQUELETO RENEGADO (Skeleton Footman)
class SkeletonEnemy extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'skeleton',
      name: 'Esqueleto Renegado',
      x, y,
      hp: Math.round(40 * scaling),
      damage: 12,
      speed: 72,
      radius: 16,
      xpValue: 5,
      color: '#ecf0f1'
    });
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 2;
    // Battered tattered battle surcoat
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(-6, 0 + bob);
    ctx.lineTo(6, 0 + bob);
    ctx.lineTo(8, 14 + bob);
    ctx.lineTo(3, 11 + bob);
    ctx.lineTo(0, 14 + bob);
    ctx.lineTo(-4, 11 + bob);
    ctx.lineTo(-7, 14 + bob);
    ctx.closePath();
    ctx.fill();

    // Ribcage & spine
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -4 + bob);
    ctx.lineTo(0, 8 + bob);
    ctx.moveTo(-5, -1 + bob);
    ctx.lineTo(5, -1 + bob);
    ctx.moveTo(-6, 2 + bob);
    ctx.lineTo(6, 2 + bob);
    ctx.moveTo(-4, 5 + bob);
    ctx.lineTo(4, 5 + bob);
    ctx.stroke();

    // Skull
    ctx.fillStyle = '#f5f6fa';
    ctx.beginPath();
    ctx.arc(0, -9 + bob, 7, 0, Math.PI * 2);
    ctx.fill();

    // Jawbone with teeth
    ctx.fillStyle = '#dcdde1';
    ctx.fillRect(-3, -3 + bob, 6, 3);
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-2, -3 + bob, 1, 2);
    ctx.fillRect(0, -3 + bob, 1, 2);
    ctx.fillRect(2, -3 + bob, 1, 2);

    // Deep eye sockets with glowing spectral cyan flames
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-4, -10 + bob, 3, 3);
    ctx.fillRect(1, -10 + bob, 3, 3);
    ctx.fillStyle = '#00d2d3';
    ctx.fillRect(-3, -9 + bob, 1.5, 1.5);
    ctx.fillRect(2, -9 + bob, 1.5, 1.5);

    // Left arm holding battered wooden shield with iron rim
    ctx.fillStyle = '#5c3a21';
    ctx.beginPath();
    ctx.arc(-9, 2 + bob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right arm holding rusted notched iron broadsword
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(6, -10 + bob, 3, 18);
    // Crossguard
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(4, -1 + bob, 7, 2);
  }
}

// 3. ALDEÃO AMALDIÇOADO (Possessed Villager / Zombie)
class CursedVillagerEnemy extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'villager',
      name: 'Aldeão Amaldiçoado',
      x, y,
      hp: Math.round(75 * scaling),
      damage: 16,
      speed: 55,
      radius: 19,
      xpValue: 5,
      color: '#27ae60'
    });
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 2.5;
    // Tattered ragged burlap tunic
    ctx.fillStyle = '#4b6584';
    ctx.fillRect(-8, -4 + bob, 16, 17);
    ctx.fillStyle = '#303952'; // Patches
    ctx.fillRect(-5, 2 + bob, 5, 5);

    // Leather rope belt with buckle
    ctx.fillStyle = '#84817a';
    ctx.fillRect(-8, 3 + bob, 16, 2.5);

    // Rotting hunched head
    ctx.fillStyle = '#44bd32'; // Gangrene green
    ctx.beginPath();
    ctx.arc(1, -12 + bob, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Wild unkempt greasy hair
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(-5, -18 + bob, 11, 4);
    ctx.fillRect(-6, -15 + bob, 3, 6);

    // Hollow eyes with crazed yellow glowing pupils
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-2, -13 + bob, 3, 3);
    ctx.fillRect(3, -13 + bob, 3, 3);
    ctx.fillStyle = '#fbc531';
    ctx.fillRect(-1, -12 + bob, 1.5, 1.5);
    ctx.fillRect(4, -12 + bob, 1.5, 1.5);

    // Snarling open rot mouth
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(0, -8 + bob, 5, 2.5);

    // Left arm outstretched forward like a zombie
    ctx.fillStyle = '#44bd32';
    ctx.fillRect(4, -3 + bob, 9, 3);
    // Clawed fingers
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(13, -4 + bob, 2, 5);

    // Right hand clutching burning wooden pitch torch!
    ctx.fillStyle = '#574b90'; // sleeve
    ctx.fillRect(-10, -2 + bob, 4, 8);
    // Torch stick
    ctx.fillStyle = '#784e2d';
    ctx.fillRect(-9, -16 + bob, 3, 20);

    // Dripping pitch cloth wrap
    ctx.fillStyle = '#2f3640';
    ctx.fillRect(-10, -17 + bob, 5, 5);

    // Dynamic animated flickering torch fire!
    const flameFlicker = Math.sin(Date.now() / 60) * 2;
    // Outer crimson/orange flame
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.arc(-7.5, -20 + bob + flameFlicker, 5, 0, Math.PI * 2);
    ctx.fill();
    // Mid vibrant fire
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(-7.5, -20 + bob + flameFlicker, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // White-hot core
    ctx.fillStyle = '#fff275';
    ctx.beginPath();
    ctx.arc(-7.5, -19 + bob + flameFlicker, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 4. CAVALEIRO NEGRO (Dark Armored Knight)
class DarkKnightEnemy extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'dark_knight',
      name: 'Cavaleiro Negro',
      x, y,
      hp: Math.round(180 * scaling),
      damage: 24,
      speed: 62,
      radius: 22,
      xpValue: 25,
      color: '#2c3e50'
    });
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 1.5;
    // Flowing dark crimson cape behind knight
    ctx.fillStyle = '#671318';
    ctx.beginPath();
    ctx.moveTo(-10, -6 + bob);
    ctx.lineTo(-20, 16 + bob);
    ctx.lineTo(-2, 16 + bob);
    ctx.lineTo(4, -4 + bob);
    ctx.closePath();
    ctx.fill();

    // Spiked heavy iron pauldrons (shoulders)
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(-11, -8 + bob, 22, 5);
    // Spikes
    ctx.beginPath();
    ctx.moveTo(-11, -8 + bob);
    ctx.lineTo(-14, -13 + bob);
    ctx.lineTo(-9, -8 + bob);
    ctx.moveTo(11, -8 + bob);
    ctx.lineTo(14, -13 + bob);
    ctx.lineTo(9, -8 + bob);
    ctx.fill();

    // Black plate breastplate
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(-9, -4 + bob, 18, 18);
    // Blood-red heraldic crest on chest
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-3, -2 + bob, 6, 12);
    ctx.fillRect(-6, 1 + bob, 12, 4);

    // Heavy Gothic Greathelm
    ctx.fillStyle = '#1e272e';
    ctx.beginPath();
    ctx.arc(0, -14 + bob, 9, 0, Math.PI * 2);
    ctx.fill();
    // Helmet crest / horns
    ctx.fillStyle = '#2f3640';
    ctx.beginPath();
    ctx.moveTo(-5, -22 + bob);
    ctx.lineTo(0, -17 + bob);
    ctx.lineTo(5, -22 + bob);
    ctx.lineTo(0, -25 + bob);
    ctx.closePath();
    ctx.fill();

    // Intense glowing crimson horizontal visor slit
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-5, -15 + bob, 10, 2.5);

    // Heavy Gothic Kite Shield with red trim
    ctx.fillStyle = '#1e272e';
    ctx.beginPath();
    ctx.moveTo(-15, -8 + bob);
    ctx.lineTo(-6, -8 + bob);
    ctx.lineTo(-6, 6 + bob);
    ctx.lineTo(-10, 14 + bob);
    ctx.lineTo(-15, 6 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Massive black steel broadsword
    ctx.fillStyle = '#57606f';
    ctx.fillRect(8, -18 + bob, 4, 30);
    ctx.fillStyle = '#d2dae2'; // Edge highlight
    ctx.fillRect(11, -18 + bob, 1, 30);
    ctx.fillStyle = '#c0392b'; // Crossguard
    ctx.fillRect(5, 0 + bob, 10, 3);
  }
}

// 5. BRUXA DA PESTE (Plague Witch - Ranged)
class WitchEnemy extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'witch',
      name: 'Bruxa da Peste',
      x, y,
      hp: Math.round(55 * scaling),
      damage: 10,
      speed: 58,
      radius: 16,
      xpValue: 25,
      color: '#8e44ad'
    });
    this.shootTimer = 2.0;
  }

  update(dt, player, allEnemies, enemyProjectiles) {
    super.update(dt, player, allEnemies, enemyProjectiles);
    if (!this.alive) return;

    // Shoots dark poison orbs every 3.5 seconds
    this.shootTimer -= dt;
    if (this.shootTimer <= 0) {
      this.shootTimer = 3.5;
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      enemyProjectiles.push(new EnemyProjectile({
        x: this.x,
        y: this.y,
        angle: angle,
        speed: 180,
        damage: 14,
        color: '#9b59b6'
      }));
    }
  }

  renderCustom(ctx) {
    // Levitating / hovering smoothly
    const hover = Math.sin(Date.now() / 240) * 4;
    // Mystical purple energy mist underneath
    ctx.fillStyle = 'rgba(155, 89, 182, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 14 + hover, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Deep purple layered velvet robes
    ctx.fillStyle = '#341f97';
    ctx.beginPath();
    ctx.moveTo(0, -14 + hover);
    ctx.lineTo(12, 13 + hover);
    ctx.lineTo(-12, 13 + hover);
    ctx.closePath();
    ctx.fill();

    // Golden runic trim on robe hem
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-11, 12 + hover);
    ctx.lineTo(11, 12 + hover);
    ctx.stroke();

    // Pale witch face
    ctx.fillStyle = '#dcdde1';
    ctx.beginPath();
    ctx.arc(0, -11 + hover, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pointed witch nose
    ctx.fillStyle = '#bdc3c7';
    ctx.beginPath();
    ctx.moveTo(0, -12 + hover);
    ctx.lineTo(4, -10 + hover);
    ctx.lineTo(0, -9 + hover);
    ctx.fill();

    // Glowing magical eyes
    ctx.fillStyle = '#9b59b6';
    ctx.fillRect(1, -12 + hover, 2, 2);

    // Classic wide-brimmed pointed witch hat
    ctx.fillStyle = '#1e272e';
    // Brim
    ctx.beginPath();
    ctx.ellipse(0, -14 + hover, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cone
    ctx.beginPath();
    ctx.moveTo(-7, -14 + hover);
    ctx.lineTo(7, -14 + hover);
    ctx.lineTo(-2, -30 + hover); // Crooked tip
    ctx.closePath();
    ctx.fill();
    // Gold buckle on hat band
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(-2, -17 + hover, 4, 3);

    // Gnarled staff with levitating glowing eldritch orb
    ctx.fillStyle = '#5c3a21'; // Wood staff
    ctx.fillRect(8, -12 + hover, 3, 24);
    // Levitating pulsating poison/dark orb
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.arc(9.5, -17 + hover, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(9, -18 + hover, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Enemy Projectile (for Witch / Bosses)
class EnemyProjectile {
  constructor(cfg) {
    this.x = cfg.x;
    this.y = cfg.y;
    this.angle = cfg.angle;
    this.speed = cfg.speed;
    this.damage = cfg.damage;
    this.color = cfg.color || '#e74c3c';
    this.radius = cfg.unblockable ? 8.5 : 7;
    this.life = 4.0;
    // Boss and Mini-Boss projectiles cannot be cancelled/deflected by player weapons!
    this.unblockable = Boolean(cfg.unblockable);
  }

  update(dt, player, particles, playerProjectiles = []) {
    this.life -= dt;
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    if (Math.random() < 0.18) {
      particles.createSpark(this.x, this.y, this.color);
    }

    // Weapon contact cancellation / parry (ONLY for non-boss projectiles)
    if (!this.unblockable && this.checkWeaponContact(player, playerProjectiles, particles)) {
      return false; // Cancelled by player weapon contact!
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const r = this.radius + player.radius;
    if (dx * dx + dy * dy <= r * r) {
      player.takeDamage(this.damage);
      return false; // Hit player and destroyed
    }

    return this.life > 0;
  }

  checkWeaponContact(player, playerProjectiles, particles) {
    if (!player || !player.weapons) return false;

    // 1. Check against active player weapons
    for (const w of player.weapons) {
      if (w.level <= 0) continue;

      // Holy Aura: continuous protective field around player
      if (w.id === 'holy_aura') {
        const auraRadius = 80 * w.area * player.areaMultiplier;
        const d = Math.hypot(this.x - player.x, this.y - player.y);
        if (d <= auraRadius + this.radius) {
          this.deflect(particles, "DISSIPADO!");
          return true;
        }
      }

      // Broadsword: slash arc collision
      if (w.id === 'broadsword' && w.slashEffects && w.slashEffects.length > 0) {
        for (const eff of w.slashEffects) {
          const dx = this.x - eff.x;
          const dy = this.y - eff.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= eff.radius + this.radius) {
            const pAngle = Math.atan2(dy, dx);
            let diff = Math.abs(pAngle - eff.angle);
            while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
            if (diff <= Math.PI * 0.4) {
              this.deflect(particles, "CORTADO!");
              return true;
            }
          }
        }
      }

      // Guardian Spear: thrust line collision
      if (w.id === 'guardian_spear' && w.thrustEffects && w.thrustEffects.length > 0) {
        for (const eff of w.thrustEffects) {
          const reach = eff.reach || 160;
          const thickness = eff.thickness || 30;
          const tipX = eff.x + Math.cos(eff.angle) * reach;
          const tipY = eff.y + Math.sin(eff.angle) * reach;
          const d = distToSegment(this.x, this.y, eff.x, eff.y, tipX, tipY);
          if (d <= this.radius + thickness / 2) {
            this.deflect(particles, "PERFURADO!");
            return true;
          }
        }
      }
    }

    // 2. Check against flying player projectiles (Axes, Bolts, Burning pools)
    if (playerProjectiles && playerProjectiles.length > 0) {
      for (const p of playerProjectiles) {
        if (p.state === 'burning') {
          // Holy Fire burning ground
          const d = Math.hypot(this.x - p.x, this.y - p.y);
          if (d <= p.radius + this.radius) {
            this.deflect(particles, "CALCINADO!");
            return true;
          }
        } else {
          // Thrown Axe, Bolts
          const d = Math.hypot(this.x - p.x, this.y - p.y);
          const contactRadius = (p.size || p.radius || 8) + this.radius;
          if (d <= contactRadius) {
            this.deflect(particles, "DEFLETIDO!");
            return true;
          }
        }
      }
    }

    return false;
  }

  deflect(particles, label) {
    window.MedievalSurvivors.sound.playEnemyHit();
    particles.createBloodSparks(this.x, this.y, 6, '#f0c05a');
    particles.createSpark(this.x, this.y, '#ffffff');
    if (window.MedievalSurvivors.game) {
      window.MedievalSurvivors.game.addFloatingText(this.x, this.y, label, '#00d2d3', false);
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.unblockable) {
      // Unblockable Boss / Mini-boss projectile visual (pulsing dark-core orb)
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 2.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ==================== MINI-BOSSES ====================

// MINI-BOSS 1: O Carrasco Carmesim (The Crimson Executioner - spawns at 1:00)
class ExecutionerBoss extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'boss_executioner',
      name: 'O Carrasco Carmesim',
      x, y,
      hp: Math.round(1400 * scaling),
      damage: 28,
      speed: 78,
      radius: 34,
      xpValue: 100,
      isBoss: true,
      bossTier: 1,
      dropChest: true
    });
    this.chargeCooldown = 4.0;
    this.isCharging = false;
    this.chargeDuration = 0;
    this.chargeDirX = 0;
    this.chargeDirY = 0;
  }

  update(dt, player, allEnemies, enemyProjectiles) {
    if (!this.alive) return;
    this.walkCycle += dt * 6;

    if (this.isCharging) {
      this.chargeDuration -= dt;
      this.x += this.chargeDirX * 240 * dt;
      this.y += this.chargeDirY * 240 * dt;

      // Heavy collision during charge
      const dist = Math.hypot(player.x - this.x, player.y - this.y);
      if (dist <= this.radius + player.radius) {
        player.takeDamage(this.damage * 1.5);
      }

      if (this.chargeDuration <= 0) {
        this.isCharging = false;
        this.chargeCooldown = 5.0;
      }
      return;
    }

    this.chargeCooldown -= dt;
    if (this.chargeCooldown <= 0) {
      // Wind up and charge towards player!
      this.isCharging = true;
      this.chargeDuration = 1.0;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const d = Math.hypot(dx, dy) || 1;
      this.chargeDirX = dx / d;
      this.chargeDirY = dy / d;
    }

    super.update(dt, player, allEnemies, enemyProjectiles);
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 3;
    // Heavy spiked iron chains around waist
    ctx.fillStyle = '#718093';
    ctx.fillRect(-18, 12 + bob, 36, 4);

    // Muscular dark leather torso
    ctx.fillStyle = '#1a0d0e';
    ctx.fillRect(-18, -10 + bob, 36, 26);
    // Leather harness straps
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, -10 + bob);
    ctx.lineTo(16, 12 + bob);
    ctx.moveTo(16, -10 + bob);
    ctx.lineTo(-16, 12 + bob);
    ctx.stroke();

    // Spiked iron bracers on arms
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(-23, -2 + bob, 6, 16);
    ctx.fillRect(17, -2 + bob, 6, 16);

    // Towering crimson executioner hood with deep shadow
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.arc(0, -18 + bob, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-16, -18 + bob);
    ctx.lineTo(16, -18 + bob);
    ctx.lineTo(12, -4 + bob);
    ctx.lineTo(-12, -4 + bob);
    ctx.closePath();
    ctx.fill();

    // Terrifying glowing infernal yellow eye slits in deep hood shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(-8, -21 + bob, 16, 6);
    ctx.fillStyle = '#f1c40f';
    ctx.shadowColor = '#f1c40f';
    ctx.shadowBlur = 10;
    ctx.fillRect(-6, -20 + bob, 4, 3.5);
    ctx.fillRect(2, -20 + bob, 4, 3.5);
    ctx.shadowBlur = 0;

    // Colossal executioner greataxe with double crescent blades & fresh blood!
    // Handle
    ctx.fillStyle = '#4b382a';
    ctx.fillRect(20, -32 + bob, 6, 56);
    // Steel Axe Blades
    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.arc(23, -22 + bob, 22, -Math.PI / 2, Math.PI / 2);
    ctx.arc(23, -22 + bob, 22, Math.PI / 2, 3 * Math.PI / 2);
    ctx.fill();
    // Blood drips on the blades
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(38, -22 + bob, 8, -Math.PI / 2, Math.PI / 2);
    ctx.arc(8, -22 + bob, 8, Math.PI / 2, 3 * Math.PI / 2);
    ctx.fill();
  }
}

// MINI-BOSS 2: Golem das Catacumbas (Stone Titan - spawns at 2:30)
class StoneGolemBoss extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'boss_golem',
      name: 'Golem das Catacumbas',
      x, y,
      hp: Math.round(3200 * scaling),
      damage: 35,
      speed: 48,
      radius: 44,
      xpValue: 100,
      isBoss: true,
      bossTier: 2,
      dropChest: true
    });
    this.stompTimer = 5.0;
  }

  update(dt, player, allEnemies, enemyProjectiles) {
    if (!this.alive) return;
    this.stompTimer -= dt;

    if (this.stompTimer <= 0) {
      this.stompTimer = 5.5;
      // Stomp shockwave: fire 8 radial stone shards (Unblockable Mini-Boss Projectiles!)
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        enemyProjectiles.push(new EnemyProjectile({
          x: this.x,
          y: this.y,
          angle: ang,
          speed: 160,
          damage: 18,
          color: '#7f8c8d',
          unblockable: true
        }));
      }
    }

    super.update(dt, player, allEnemies, enemyProjectiles);
  }

  renderCustom(ctx) {
    const bob = Math.sin(this.walkCycle) * 2;
    // Levitating orbital stone chunks
    const time = Date.now() / 600;
    for (let i = 0; i < 4; i++) {
      const angle = time + (i * Math.PI / 2);
      const orbitX = Math.cos(angle) * 44;
      const orbitY = Math.sin(angle) * 18 + bob;
      ctx.fillStyle = '#57606f';
      ctx.fillRect(orbitX - 4, orbitY - 4, 8, 8);
      ctx.strokeStyle = '#00d2d3';
      ctx.strokeRect(orbitX - 4, orbitY - 4, 8, 8);
    }

    // Heavy granite shoulders and torso blocks
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(-26, -18 + bob, 52, 42);

    // Glowing cyan runic glyphs carved deeply into the stone
    ctx.strokeStyle = '#00d2d3';
    ctx.shadowColor = '#00d2d3';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Ancient chest rune
    ctx.moveTo(0, -12 + bob);
    ctx.lineTo(0, 16 + bob);
    ctx.moveTo(-16, -2 + bob);
    ctx.lineTo(16, -2 + bob);
    ctx.moveTo(-10, 8 + bob);
    ctx.lineTo(10, 8 + bob);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Colossal Stone Brow & Head
    ctx.fillStyle = '#57606f';
    ctx.fillRect(-16, -32 + bob, 32, 18);
    // Glowing cyan visor/eyes
    ctx.fillStyle = '#00d2d3';
    ctx.shadowColor = '#00d2d3';
    ctx.shadowBlur = 10;
    ctx.fillRect(-10, -25 + bob, 6, 5);
    ctx.fillRect(4, -25 + bob, 6, 5);
    ctx.shadowBlur = 0;
  }
}

// MAJOR BOSS 3: Barão da Morte Von Kroll (Death Baron - spawns at 4:00)
class DeathBaronBoss extends BaseEnemy {
  constructor(x, y, scaling = 1.0) {
    super({
      type: 'boss_death_baron',
      name: 'Barão da Morte Von Kroll',
      x, y,
      hp: Math.round(6000 * scaling),
      damage: 42,
      speed: 68,
      radius: 46,
      xpValue: 100,
      isBoss: true,
      bossTier: 3,
      dropChest: true
    });
    this.spellTimer = 3.0;
  }

  update(dt, player, allEnemies, enemyProjectiles) {
    if (!this.alive) return;
    this.spellTimer -= dt;

    if (this.spellTimer <= 0) {
      this.spellTimer = 4.0;
      // Spiral dark magic volley (Unblockable Boss Projectiles!)
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 + (Date.now() / 1000);
        enemyProjectiles.push(new EnemyProjectile({
          x: this.x,
          y: this.y,
          angle: ang,
          speed: 175,
          damage: 22,
          color: '#e056fd',
          unblockable: true
        }));
      }
    }

    super.update(dt, player, allEnemies, enemyProjectiles);
  }

  renderCustom(ctx) {
    // Levitating hover
    const hover = Math.sin(Date.now() / 250) * 4;
    // Dark necrotic portal ring underneath
    ctx.strokeStyle = 'rgba(190, 46, 221, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 24 + hover, 28, 9, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Regal high-collared vampire lord cape
    ctx.fillStyle = '#130f40';
    ctx.beginPath();
    ctx.moveTo(0, -24 + hover);
    ctx.lineTo(24, 22 + hover);
    ctx.lineTo(-24, 22 + hover);
    ctx.closePath();
    ctx.fill();
    // Crimson velvet lining
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.moveTo(0, -20 + hover);
    ctx.lineTo(12, 20 + hover);
    ctx.lineTo(-12, 20 + hover);
    ctx.closePath();
    ctx.fill();

    // High pointed gothic vampire collar
    ctx.fillStyle = '#1e272e';
    ctx.beginPath();
    ctx.moveTo(-16, -10 + hover);
    ctx.lineTo(-22, -30 + hover);
    ctx.lineTo(0, -18 + hover);
    ctx.lineTo(22, -30 + hover);
    ctx.lineTo(16, -10 + hover);
    ctx.closePath();
    ctx.fill();

    // Pale royal face
    ctx.fillStyle = '#f5f6fa';
    ctx.beginPath();
    ctx.arc(0, -14 + hover, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing demonic violet eyes
    ctx.fillStyle = '#be2edd';
    ctx.shadowColor = '#be2edd';
    ctx.shadowBlur = 8;
    ctx.fillRect(-5, -16 + hover, 3, 3);
    ctx.fillRect(2, -16 + hover, 3, 3);
    ctx.shadowBlur = 0;

    // Golden Crown of Skulls with rubies
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(-11, -22 + hover);
    ctx.lineTo(-6, -34 + hover);
    ctx.lineTo(0, -24 + hover);
    ctx.lineTo(6, -34 + hover);
    ctx.lineTo(11, -22 + hover);
    ctx.closePath();
    ctx.fill();
    // Red rubies on crown
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-1, -28 + hover, 2.5, 2.5);

    // Scepter of Souls with floating purple flame orb
    ctx.fillStyle = '#f1c40f'; // Golden staff
    ctx.fillRect(18, -14 + hover, 4, 34);
    // Levitating soul orb
    ctx.fillStyle = '#be2edd';
    ctx.shadowColor = '#be2edd';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(20, -20 + hover, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Wave Spawner & Difficulty Director (10-Minute Run Pacing)
class WaveDirector {
  constructor() {
    this.gameTime = 0;
    this.spawnTimer = 0;
    this.maxActiveRegularEnemies = 160;
    this.bossEvents = [
      { time: 60, type: 'executioner', name: 'O Carrasco Carmesim', spawned: false },
      { time: 180, type: 'golem', name: 'Golem das Catacumbas', spawned: false },
      { time: 330, type: 'death_baron', name: 'Barão da Morte Von Kroll', spawned: false },
      { time: 480, type: 'death_baron', name: 'Barão da Morte Von Kroll', spawned: false }
    ];
  }

  reset() {
    this.gameTime = 0;
    this.spawnTimer = 0;
    this.bossEvents.forEach(b => b.spawned = false);
  }

  update(dt, player, enemies, onBossSpawn) {
    this.gameTime += dt;
    this.spawnTimer += dt;

    // Check boss schedule
    this.bossEvents.forEach(event => {
      if (!event.spawned && this.gameTime >= event.time) {
        event.spawned = true;
        this.spawnBoss(event.type, player, enemies, onBossSpawn);
      }
    });

    // Dynamic spawn rate scaled for 10-minute (600s) run
    const interval = Math.max(0.14, 0.72 - (this.gameTime / 450));

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      if (enemies.length >= this.maxActiveRegularEnemies) return;
      const count = 1 + Math.floor(this.gameTime / 65);
      for (let i = 0; i < count; i++) {
        if (enemies.length >= this.maxActiveRegularEnemies) break;
        this.spawnRegularEnemy(player, enemies);
      }
    }
  }

  spawnRegularEnemy(player, enemies) {
    // Spawn in a ring just off-screen
    const spawnDist = 650 + Math.random() * 150;
    const angle = Math.random() * Math.PI * 2;
    const x = player.x + Math.cos(angle) * spawnDist;
    const y = player.y + Math.sin(angle) * spawnDist;

    const t = this.gameTime;
    const hpScaling = 1.0 + (t / 180);

    // Enemy pool unlocked over time
    const pool = ['rat'];
    if (t > 20) pool.push('skeleton', 'skeleton');
    if (t > 45) pool.push('villager', 'villager');
    if (t > 75) pool.push('witch');
    if (t > 110) pool.push('dark_knight');

    const choice = pool[Math.floor(Math.random() * pool.length)];

    let enemy;
    switch (choice) {
      case 'rat': enemy = new PlagueRatEnemy(x, y, hpScaling); break;
      case 'skeleton': enemy = new SkeletonEnemy(x, y, hpScaling); break;
      case 'villager': enemy = new CursedVillagerEnemy(x, y, hpScaling); break;
      case 'witch': enemy = new WitchEnemy(x, y, hpScaling); break;
      case 'dark_knight': enemy = new DarkKnightEnemy(x, y, hpScaling); break;
      default: enemy = new PlagueRatEnemy(x, y, hpScaling); break;
    }

    enemies.push(enemy);
  }

  spawnBoss(type, player, enemies, onBossSpawn) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 600;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;
    const scaling = 1.0 + (this.gameTime / 240);

    let boss;
    let name = '';
    if (type === 'executioner') {
      boss = new ExecutionerBoss(x, y, scaling);
      name = 'O Carrasco Carmesim';
    } else if (type === 'golem') {
      boss = new StoneGolemBoss(x, y, scaling);
      name = 'Golem das Catacumbas';
    } else if (type === 'death_baron') {
      boss = new DeathBaronBoss(x, y, scaling);
      name = 'Barão da Morte Von Kroll';
    }

    if (boss) {
      enemies.push(boss);
      window.MedievalSurvivors.sound.playBossHorn();
      if (onBossSpawn) onBossSpawn(name);
    }
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.WaveDirector = WaveDirector;
window.MedievalSurvivors.EnemyProjectile = EnemyProjectile;

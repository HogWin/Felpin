/**
 * Medieval Survivors - Save & Meta-Progression System
 * Handles persistent gold, permanent stat and weapon upgrades, settings, and run history.
 */
class SaveManager {
  constructor() {
    this.storageKey = 'medieval_survivors_save_v1';
    this.data = this.getDefaultData();
    this.metaUpgradeDefinitions = this.initMetaDefinitions();
    this.load();
  }

  getDefaultData() {
    return {
      gold: 0,
      totalGoldEarned: 0,
      runsCompleted: 0,
      runsAttempted: 0,
      settings: {
        mouseAim: true,
        soundMuted: false,
        autoGoldOnMax: false
      },
      metaUpgrades: {
        health: 0,      // Max HP
        armor: 0,       // Flat Armor
        strength: 0,    // Global Damage %
        area: 0,        // Weapon Area %
        luck: 0,        // Crit & Gold Bonus %
        speed: 0,       // Movement Speed %
        projectiles: 0, // +1 Projectile / Strike Count
        reroll: 0,      // Permanent Reroll charges per run
        sword_boost: 0, // Broadsword Base Damage
        bow_boost: 0,   // Crossbow Base Damage
        fire_boost: 0   // Holy Fire Base Damage
      },
      history: []
    };
  }

  initMetaDefinitions() {
    return [
      {
        id: 'health',
        name: 'Vitalidade Ancestral',
        icon: '❤️',
        description: 'Aumenta a Vida Máxima permanente de todos os personagens.',
        statPerLevel: '+15 Max HP',
        maxLevel: 5,
        costs: [80, 180, 350, 650, 1200]
      },
      {
        id: 'armor',
        name: 'Armadura Forjada',
        icon: '🛡️',
        description: 'Concede redução de dano permanente contra todos os golpes inimigos.',
        statPerLevel: '+1 de Armadura',
        maxLevel: 5,
        costs: [100, 220, 420, 750, 1400]
      },
      {
        id: 'strength',
        name: 'Poder Titânico',
        icon: '🥊',
        description: 'Amplifica o poder de destruição de todas as armas.',
        statPerLevel: '+8% Dano Global',
        maxLevel: 5,
        costs: [120, 250, 480, 850, 1600]
      },
      {
        id: 'area',
        name: 'Alcance de Mestre',
        icon: '🚩',
        description: 'Estende a área de impacto, corte de espadas e raio de explosões.',
        statPerLevel: '+10% Área de Efeito',
        maxLevel: 5,
        costs: [90, 200, 380, 700, 1300]
      },
      {
        id: 'luck',
        name: 'Fortuna dos Deuses',
        icon: '🍀',
        description: 'Aumenta a probabilidade de acertos críticos e ganho de ouro.',
        statPerLevel: '+10% Crítico / +8% Ouro',
        maxLevel: 5,
        costs: [100, 220, 450, 800, 1500]
      },
      {
        id: 'speed',
        name: 'Passos Ligeiros',
        icon: '🥾',
        description: 'Permite mover-se mais rapidamente pelo campo de batalha.',
        statPerLevel: '+6% Velocidade',
        maxLevel: 5,
        costs: [75, 170, 320, 600, 1100]
      },
      {
        id: 'projectiles',
        name: 'Arsenal Multiplicado',
        icon: '☄️',
        description: 'Aumenta permanentemente a quantidade de projéteis e golpes de todas as armas.',
        statPerLevel: '+1 Projétil / Golpe',
        maxLevel: 2,
        costs: [250, 600]
      },
      {
        id: 'reroll',
        name: 'Dados do Destino',
        icon: '🎲',
        description: 'Concede cargas permanentes na run para trocar as opções de aprimoramento ao subir de nível.',
        statPerLevel: '+1 Carga de Reroll por Run',
        maxLevel: 5,
        costs: [60, 140, 260, 450, 750]
      },
      {
        id: 'sword_boost',
        name: 'Afiação da Espada Real',
        icon: '⚔️',
        description: 'Aumenta permanentemente o dano base inicial da Espada Longa.',
        statPerLevel: '+6 Dano Base na Espada',
        maxLevel: 5,
        costs: [110, 240, 460, 820, 1500]
      },
      {
        id: 'bow_boost',
        name: 'Tensão da Besta',
        icon: '🏹',
        description: 'Aumenta permanentemente o dano base inicial da Besta de Precisão.',
        statPerLevel: '+5 Dano Base na Besta',
        maxLevel: 5,
        costs: [110, 240, 460, 820, 1500]
      },
      {
        id: 'fire_boost',
        name: 'Chama Alquímica',
        icon: '🔥',
        description: 'Aumenta permanentemente o dano base das chamas do Fogo Sagrado.',
        statPerLevel: '+4 Dano Base nas Chamas',
        maxLevel: 5,
        costs: [110, 240, 460, 820, 1500]
      }
    ];
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = Object.assign(this.getDefaultData(), parsed);
        this.data.settings = Object.assign(this.getDefaultData().settings, parsed.settings || {});
        this.data.metaUpgrades = Object.assign(this.getDefaultData().metaUpgrades, parsed.metaUpgrades || {});
      }
    } catch (e) {
      console.warn('Erro ao carregar save:', e);
      this.data = this.getDefaultData();
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Erro ao salvar:', e);
    }
  }

  addGold(amount) {
    if (amount <= 0) return;
    this.data.gold += amount;
    this.data.totalGoldEarned += amount;
    this.save();
  }

  getGold() {
    return this.data.gold;
  }

  getUpgradeLevel(id) {
    return this.data.metaUpgrades[id] || 0;
  }

  getUpgradeCost(id) {
    const def = this.metaUpgradeDefinitions.find(d => d.id === id);
    if (!def) return Infinity;
    const currentLvl = this.getUpgradeLevel(id);
    if (currentLvl >= def.maxLevel) return null; // Maxed out
    return def.costs[currentLvl] || 9999;
  }

  purchaseUpgrade(id) {
    const cost = this.getUpgradeCost(id);
    if (cost === null || this.data.gold < cost) return false;

    this.data.gold -= cost;
    this.data.metaUpgrades[id] = (this.data.metaUpgrades[id] || 0) + 1;
    this.save();
    return true;
  }

  recordRun(run) {
    this.data.runsAttempted++;
    if (run.outcome === 'VITÓRIA') {
      this.data.runsCompleted++;
    }
    this.data.history.unshift({
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      hero: run.hero || 'Cavaleiro Real',
      timeSurvived: run.timeSurvived || '00:00',
      timeSeconds: run.timeSeconds || 0,
      level: run.level || 1,
      kills: run.kills || 0,
      damage: run.damage || 0,
      goldEarned: run.goldEarned || 0,
      outcome: run.outcome || 'DERROTA'
    });

    if (this.data.history.length > 25) {
      this.data.history.pop();
    }
    this.save();
  }

  applyToPlayer(player) {
    const up = this.data.metaUpgrades;

    // Health
    if (up.health > 0) {
      const bonus = up.health * 15;
      player.baseMaxHp += bonus;
      player.maxHp = player.baseMaxHp;
      player.hp = player.maxHp;
    }

    // Armor
    if (up.armor > 0) {
      player.baseArmor += up.armor * 1.0;
    }

    // Global Strength / Damage
    if (up.strength > 0) {
      player.baseDamageMultiplier += up.strength * 0.08;
    }

    // Weapon Area
    if (up.area > 0) {
      player.baseAreaMultiplier += up.area * 0.10;
    }

    // Luck / Crit / Gold
    if (up.luck > 0) {
      player.critChance = 0.05 + (up.luck * 0.10);
      player.goldMultiplier = 1.0 + (up.luck * 0.08);
    } else {
      player.critChance = 0.05;
      player.goldMultiplier = 1.0;
    }

    // Movement Speed
    if (up.speed > 0) {
      player.speedMultiplier += up.speed * 0.06;
    }

    // Permanent Bonus Projectiles
    player.metaBonusProjectiles = up.projectiles || 0;

    // Permanent Reroll charges per run (1 base + purchased permanent charges)
    player.rerolls = 1 + (up.reroll || 0);

    // Base Weapon Boosts
    player.weapons.forEach(w => {
      if (w.id === 'broadsword' && up.sword_boost > 0) {
        w.baseDamage += up.sword_boost * 6;
      } else if (w.id === 'crossbow' && up.bow_boost > 0) {
        w.baseDamage += up.bow_boost * 5;
      } else if (w.id === 'holy_fire' && up.fire_boost > 0) {
        w.baseDamage += up.fire_boost * 4;
      }
    });
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.saveManager = new SaveManager();

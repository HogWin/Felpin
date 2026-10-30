/**
 * Medieval Survivors - Save & Meta-Progression System
 * Handles persistent gold, permanent stat and weapon upgrades, settings, and run history.
 */
class SaveManager {
  constructor() {
    this.storageKey = 'medieval_survivors_save_v1';
    this.data = this.getDefaultData();
    this.metaUpgradeDefinitions = this.initMetaDefinitions();
    this.achievementDefinitions = this.initAchievementDefinitions();
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
        autoGoldOnMax: false,
        hyperMode: false,
        curseRank: 0,
        isRankedMode: true
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
      history: [],
      discoveredSynergies: [],
      unlockedAchievements: {},
      stats: {
        totalEnemiesKilled: 0,
        totalDestructiblesSmashed: 0,
        totalSanctuariesConsecrated: 0,
        totalBossesKilled: 0
      }
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

  initAchievementDefinitions() {
    return [
      {
        id: 'first_blood',
        name: 'Primeiro Sangue',
        icon: '🩸',
        description: 'Elimine seu primeiro inimigo na arena.',
        category: 'combat',
        reward: { gold: 50 },
        check: (game, trigger) => trigger === 'enemy_killed'
      },
      {
        id: 'executioner_slayer',
        name: 'O Fim do Carrasco',
        icon: '🪓',
        description: 'Derrote o Carrasco Carmesim despertado das catacumbas.',
        category: 'bosses',
        reward: { gold: 150 },
        check: (game, trigger, params) => trigger === 'boss_killed' && params && params.type === 'executioner'
      },
      {
        id: 'golem_crusher',
        name: 'Demolidor de Monólitos',
        icon: '🗿',
        description: 'Destrua o colossal Golem de Pedra das Catacumbas.',
        category: 'bosses',
        reward: { gold: 250 },
        check: (game, trigger, params) => trigger === 'boss_killed' && params && params.type === 'golem'
      },
      {
        id: 'baron_vanquisher',
        name: 'Fim da Tirania',
        icon: '👑',
        description: 'Elimine o temido Barão da Morte Von Kroll.',
        category: 'bosses',
        reward: { gold: 500 },
        check: (game, trigger, params) => trigger === 'boss_killed' && params && params.type === 'death_baron'
      },
      {
        id: 'sanctuary_consecration',
        name: 'Bênção dos Ancestrais',
        icon: '✨',
        description: 'Permaneça 10s no Santuário Sagrado e conclua a consagração divina.',
        category: 'exploration',
        reward: { gold: 150 },
        check: (game, trigger) => trigger === 'sanctuary_consecrated'
      },
      {
        id: 'swarm_survivor',
        name: 'Exterminador de Pragas',
        icon: '🐀',
        description: 'Sobreviva e dizime a investida veloz de um Enxame Relâmpago.',
        category: 'combat',
        reward: { gold: 120 },
        check: (game, trigger) => trigger === 'swarm_survived'
      },
      {
        id: 'meteor_walker',
        name: 'Andarilho do Firmamento',
        icon: '⚡',
        description: 'Sobreviva a uma tempestade de Fogo Celestial devastadora.',
        category: 'exploration',
        reward: { gold: 120 },
        check: (game, trigger) => trigger === 'meteor_survived'
      },
      {
        id: 'horde_100',
        name: 'Ceifador de Almas',
        icon: '💀',
        description: 'Elimine 100 monstros em uma única expedição.',
        category: 'combat',
        reward: { gold: 100 },
        target: 100,
        getProgress: (game) => ({ current: (game && game.player && game.player.killCount) || 0, max: 100 }),
        check: (game, trigger) => trigger === 'enemy_killed' && game && game.player && game.player.killCount >= 100
      },
      {
        id: 'horde_500',
        name: 'Flagelo das Trevas',
        icon: '⚔️',
        description: 'Elimine 500 monstros em uma única expedição.',
        category: 'combat',
        reward: { gold: 300 },
        target: 500,
        getProgress: (game) => ({ current: (game && game.player && game.player.killCount) || 0, max: 500 }),
        check: (game, trigger) => trigger === 'enemy_killed' && game && game.player && game.player.killCount >= 500
      },
      {
        id: 'horde_1000',
        name: 'A Morte Encarnada',
        icon: '☠️',
        description: 'Elimine 1.000 monstros em uma única expedição.',
        category: 'combat',
        reward: { gold: 600 },
        target: 1000,
        getProgress: (game) => ({ current: (game && game.player && game.player.killCount) || 0, max: 1000 }),
        check: (game, trigger) => trigger === 'enemy_killed' && game && game.player && game.player.killCount >= 1000
      },
      {
        id: 'level_10',
        name: 'Iniciado nas Lâminas',
        icon: '🌟',
        description: 'Alcance o Nível 10 em uma partida.',
        category: 'progression',
        reward: { gold: 80 },
        target: 10,
        getProgress: (game) => ({ current: (game && game.player && game.player.level) || 1, max: 10 }),
        check: (game, trigger) => trigger === 'level_up' && game && game.player && game.player.level >= 10
      },
      {
        id: 'level_25',
        name: 'Veterano de Guerra',
        icon: '🔥',
        description: 'Alcance o Nível 25 em uma partida.',
        category: 'progression',
        reward: { gold: 200 },
        target: 25,
        getProgress: (game) => ({ current: (game && game.player && game.player.level) || 1, max: 25 }),
        check: (game, trigger) => trigger === 'level_up' && game && game.player && game.player.level >= 25
      },
      {
        id: 'level_50',
        name: 'Avatar dos Deuses',
        icon: '⚜️',
        description: 'Alcance o Nível 50 em uma partida.',
        category: 'progression',
        reward: { gold: 500 },
        target: 50,
        getProgress: (game) => ({ current: (game && game.player && game.player.level) || 1, max: 50 }),
        check: (game, trigger) => trigger === 'level_up' && game && game.player && game.player.level >= 50
      },
      {
        id: 'armory_master',
        name: 'Arsenal Completo',
        icon: '🗡️',
        description: 'Equipe 6 armas simultaneamente no seu arsenal.',
        category: 'progression',
        reward: { gold: 180 },
        target: 6,
        getProgress: (game) => ({ current: (game && game.player && game.player.weapons && game.player.weapons.length) || 0, max: 6 }),
        check: (game, trigger) => trigger === 'weapon_acquired' && game && game.player && game.player.weapons.length >= 6
      },
      {
        id: 'synergy_born',
        name: 'Forja Mítica',
        icon: '🔮',
        description: 'Evolua qualquer arma para sua forma Mítica/Suprema através de uma Sinergia.',
        category: 'progression',
        reward: { gold: 350 },
        check: (game, trigger) => trigger === 'synergy_evolved'
      },
      {
        id: 'destructor_25',
        name: 'Expurgo de Relíquias',
        icon: '📦',
        description: 'Destrua 25 caixas, barris ou sarcófagos pelo campo de batalha.',
        category: 'exploration',
        reward: { gold: 120 },
        target: 25,
        getProgress: () => ({ current: (this.data && this.data.stats && this.data.stats.totalDestructiblesSmashed) || 0, max: 25 }),
        check: (game, trigger) => trigger === 'destructible_smashed' && this.data.stats.totalDestructiblesSmashed >= 25
      },
      {
        id: 'gold_hoarder_1000',
        name: 'Tesouro da Cidadela',
        icon: '💰',
        description: 'Acumule um total de 1.000 de Ouro entre suas expedições.',
        category: 'exploration',
        reward: { gold: 250 },
        target: 1000,
        getProgress: () => ({ current: (this.data && this.data.totalGoldEarned) || 0, max: 1000 }),
        check: (game, trigger) => this.data.totalGoldEarned >= 1000
      },
      {
        id: 'ultimate_victory',
        name: 'Libertador do Reino',
        icon: '🏆',
        description: 'Conquiste a vitória absoluta sobrevivendo aos 15 minutos de batalha.',
        category: 'progression',
        reward: { gold: 1000 },
        check: (game, trigger) => trigger === 'run_victory'
      },
      {
        id: 'hyper_survivor',
        name: 'Velocidade da Luz',
        icon: '⚡',
        description: 'Sobreviva 5 minutos de batalha no Modo Hiper.',
        category: 'combat',
        reward: { gold: 250 },
        check: (game, trigger) => trigger === 'hyper_survived_5min'
      },
      {
        id: 'curse_pact_5',
        name: 'Pacto com a Morte',
        icon: '💀',
        description: 'Inicie e sobreviva a 5 minutos sob a Maldição de Grau 5.',
        category: 'combat',
        reward: { gold: 400 },
        check: (game, trigger) => trigger === 'curse_survived_5min'
      },
      {
        id: 'unlock_ranger',
        name: 'Olhos de Falcão',
        icon: '🏹',
        description: 'Elimine 250 monstros com armas à distância em uma expedição (Desbloqueia a Arqueira das Sombras).',
        category: 'heroes',
        reward: { gold: 200 },
        target: 250,
        getProgress: (game) => ({ current: (game && game.player && game.player.killCount) || 0, max: 250 }),
        check: (game, trigger) => trigger === 'enemy_killed' && game && game.player && game.player.killCount >= 250
      },
      {
        id: 'unlock_pyromancer',
        name: 'Chama Arcana',
        icon: '🔥',
        description: 'Colete 350 gemas de experiência arcana em uma partida (Desbloqueia o Feiticeiro das Cinzas).',
        category: 'heroes',
        reward: { gold: 200 },
        target: 350,
        getProgress: (game) => ({ current: (game && game.player && game.player.totalGemsCollected) || 0, max: 350 }),
        check: (game, trigger) => trigger === 'gem_collected' && game && game.player && (game.player.totalGemsCollected || 0) >= 350
      },
      {
        id: 'unlock_necromancer',
        name: 'Pacto com as Sombras',
        icon: '💀',
        description: 'Sobreviva por pelo menos 3 minutos sob o efeito de Maldição (Desbloqueia o Necromante).',
        category: 'heroes',
        reward: { gold: 300 },
        check: (game, trigger) => trigger === 'curse_survived_3min'
      },
      {
        id: 'unlock_wep_daggers',
        name: 'Passos Ligeiros',
        icon: '🗡️',
        description: 'Adquira qualquer aprimoramento de velocidade permanente na Forja Real (Desbloqueia as Adagas Gêmeas).',
        category: 'progression',
        reward: { gold: 120 },
        check: () => this.getUpgradeLevel('speed') >= 1
      },
      {
        id: 'unlock_wep_spear',
        name: 'Muralha de Aço',
        icon: '🛡️',
        description: 'Adquira qualquer aprimoramento de armadura permanente na Forja Real (Desbloqueia a Lança Protetora).',
        category: 'progression',
        reward: { gold: 120 },
        check: () => this.getUpgradeLevel('armor') >= 1
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
        this.data.unlockedAchievements = Object.assign({}, parsed.unlockedAchievements || {});
        this.data.stats = Object.assign(this.getDefaultData().stats, parsed.stats || {});
      }
    } catch (e) {
      console.warn('Erro ao carregar save:', e);
      this.data = this.getDefaultData();
    }
  }

  isAchievementUnlocked(id) {
    if (!this.data.unlockedAchievements) this.data.unlockedAchievements = {};
    return Boolean(this.data.unlockedAchievements[id]);
  }

  unlockAchievement(id, game) {
    if (this.isAchievementUnlocked(id)) return false;
    const def = this.achievementDefinitions.find(a => a.id === id);
    if (!def) return false;

    // Record unlocked
    this.data.unlockedAchievements[id] = {
      unlockedAt: new Date().toISOString()
    };

    // Award Gold
    if (def.reward && def.reward.gold) {
      this.addGold(def.reward.gold);
      if (game && game.player) {
        game.player.gold += def.reward.gold;
      }
    }

    this.save();

    // Sound Fanfare
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playAchievementUnlock) {
      window.MedievalSurvivors.sound.playAchievementUnlock();
    }

    // UI Toast Notification
    if (window.MedievalSurvivors.ui && window.MedievalSurvivors.ui.showAchievementToast) {
      window.MedievalSurvivors.ui.showAchievementToast(def);
    } else if (game && game.ui && game.ui.showAchievementToast) {
      game.ui.showAchievementToast(def);
    }

    return true;
  }

  checkAchievements(triggerType, params, game) {
    if (!this.data.unlockedAchievements) this.data.unlockedAchievements = {};
    for (const def of this.achievementDefinitions) {
      if (!this.data.unlockedAchievements[def.id]) {
        try {
          if (def.check(game, triggerType, params)) {
            this.unlockAchievement(def.id, game);
          }
        } catch (e) {
          console.warn('Erro ao checar conquista:', def.id, e);
        }
      }
    }
  }

  getUnlockedAchievementsCount() {
    if (!this.data.unlockedAchievements) return 0;
    return Object.keys(this.data.unlockedAchievements).length;
  }

  hasAchievement(id) {
    return Boolean(this.data.unlockedAchievements && this.data.unlockedAchievements[id]);
  }

  isClassUnlocked(classId) {
    if (!classId || classId === 'knight') return true;
    if (this.data.unlockedClasses && this.data.unlockedClasses.includes(classId)) return true;
    if (!window.MedievalSurvivors.classRegistry) return true;
    const cls = window.MedievalSurvivors.classRegistry.getClass(classId);
    if (!cls || !cls.unlockAchievementId) return true;
    return this.hasAchievement(cls.unlockAchievementId);
  }

  getWeaponUnlockMap() {
    return {
      'whirling_axes': { achievementId: 'level_10', hint: 'Alcance Nível 10 em uma partida' },
      'guardian_spear': { achievementId: 'unlock_wep_spear', hint: 'Adquira upgrade de Armadura na Forja' },
      'spectral_orb': { achievementId: 'horde_100', hint: 'Elimine 100 monstros em uma expedição' },
      'twin_daggers': { achievementId: 'unlock_wep_daggers', hint: 'Adquira upgrade de Velocidade na Forja' },
      'dark_greatsword': { achievementId: 'executioner_slayer', hint: 'Derrote o Carrasco Carmesim' },
      'plague_flask': { achievementId: 'swarm_survivor', hint: 'Sobreviva a um Enxame Relâmpago' },
      'blunderbuss': { achievementId: 'destructor_25', hint: 'Destrua 25 caixas ou sarcófagos' },
      'penitent_whip': { achievementId: 'first_blood', hint: 'Elimine seu primeiro monstro' },
      'celestial_glaive': { achievementId: 'sanctuary_consecration', hint: 'Consagre 1 Santuário Divino' },
      'thunder_hammer': { achievementId: 'golem_crusher', hint: 'Destrua o Golem de Pedra' },
      'viper_blowpipe': { achievementId: 'meteor_walker', hint: 'Sobreviva a uma tempestade celestial' },
      'eldritch_tome': { achievementId: 'level_25', hint: 'Alcance Nível 25 em uma partida' },
      'frost_lance': { achievementId: 'hyper_survivor', hint: 'Sobreviva 5 min no Modo Hiper' },
      'retribution_shield': { achievementId: 'curse_pact_5', hint: 'Sobreviva 5 min em Maldição Grau 5' },
      'hellfire_cauldron': { achievementId: 'horde_500', hint: 'Elimine 500 monstros em uma partida' }
    };
  }

  getPassiveUnlockMap() {
    return {
      'passive_regen': { achievementId: 'first_blood', hint: 'Elimine seu primeiro monstro' },
      'passive_cooldown': { achievementId: 'level_10', hint: 'Alcance o Nível 10 em uma partida' },
      'passive_area': { achievementId: 'sanctuary_consecration', hint: 'Consagre 1 Santuário Divino' },
      'passive_projectiles': { achievementId: 'synergy_born', hint: 'Forje sua primeira Sinergia Suprema' }
    };
  }

  isWeaponUnlocked(weaponId) {
    const baseWeapons = ['broadsword', 'crossbow', 'holy_fire', 'holy_aura', 'iron_flail'];
    if (baseWeapons.includes(weaponId)) return true;
    const map = this.getWeaponUnlockMap();
    const entry = map[weaponId];
    if (!entry) return true;
    return this.hasAchievement(entry.achievementId);
  }

  isPassiveUnlocked(passiveId) {
    const basePassives = ['passive_armor', 'passive_speed', 'passive_maxhp', 'passive_magnet', 'passive_damage'];
    if (basePassives.includes(passiveId)) return true;
    const map = this.getPassiveUnlockMap();
    const entry = map[passiveId];
    if (!entry) return true;
    return this.hasAchievement(entry.achievementId);
  }

  getWeaponUnlockHint(weaponId) {
    const map = this.getWeaponUnlockMap();
    return map[weaponId] ? map[weaponId].hint : 'Desbloqueado';
  }

  getPassiveUnlockHint(passiveId) {
    const map = this.getPassiveUnlockMap();
    return map[passiveId] ? map[passiveId].hint : 'Desbloqueado';
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
    this.checkAchievements('gold_updated', null, window.MedievalSurvivors.game);
  }

  getGold() {
    return this.data.gold;
  }

  isSynergyDiscovered(id) {
    if (!this.data.discoveredSynergies) this.data.discoveredSynergies = [];
    return this.data.discoveredSynergies.includes(id);
  }

  discoverSynergy(id) {
    if (!this.data.discoveredSynergies) this.data.discoveredSynergies = [];
    if (!this.data.discoveredSynergies.includes(id)) {
      this.data.discoveredSynergies.push(id);
      this.save();
    }
  }

  getDiscoveredSynergiesCount() {
    return (this.data.discoveredSynergies || []).length;
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

  getTotalSpentGold() {
    let total = 0;
    for (const def of this.metaUpgradeDefinitions) {
      const lvl = this.getUpgradeLevel(def.id);
      for (let i = 0; i < lvl; i++) {
        total += def.costs[i] || 0;
      }
    }
    return total;
  }

  refundAllUpgrades() {
    const refund = this.getTotalSpentGold();
    if (refund <= 0) return 0;

    for (const def of this.metaUpgradeDefinitions) {
      this.data.metaUpgrades[def.id] = 0;
    }
    this.data.gold += refund;
    this.save();
    return refund;
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
    player.maxRerolls = player.rerolls;
    player.banishCharges = 2;
    player.bannedIds = new Set();

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

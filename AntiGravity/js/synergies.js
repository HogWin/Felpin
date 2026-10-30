/**
 * Medieval Survivors - Synergy & Supreme Weapons System
 * Manages Weapon Fusions (Supreme Weapons), Weapon+Passive Ascensions, and the Grimoire.
 */

window.MedievalSurvivors = window.MedievalSurvivors || {};

(function() {
  // Definition of all 10 Weapon + Weapon Supreme Fusions
  const WEAPON_FUSIONS = [
    {
      id: 'fusion_excalibur',
      supremeWeaponId: 'supreme_excalibur',
      name: 'Excalibur da Alvorada Divina',
      icon: '🗡️✨',
      type: 'weapon_fusion',
      item1: { id: 'broadsword', name: 'Espada Larga Real', icon: '⚔️', type: 'weapon', minLevel: 8 },
      item2: { id: 'guardian_spear', name: 'Lança dos Guardiões', icon: '🔱', type: 'weapon', minLevel: 8 },
      description: 'A lendária lâmina sagrada forjada pelos primeiros reis, empunhada junto à lança sagrada de luz.',
      effect: 'Desfere cortes colossais de luz dourada (raio 95, 120 de dano) acompanhados de 4 lanças cardeais de plasma sagrado que trespassam a tela inteira com repulsão massiva.',
      lore: 'Forjada no alvorecer do primeiro reino com o aço das estrelas cadentes.'
    },
    {
      id: 'fusion_artillery_cannon',
      supremeWeaponId: 'supreme_artillery_cannon',
      name: 'Canhão Balista Portátil',
      icon: '💥🎯',
      type: 'weapon_fusion',
      item1: { id: 'crossbow', name: 'Besta de Repetição', icon: '🏹', type: 'weapon', minLevel: 8 },
      item2: { id: 'blunderbuss', name: 'Bacamarte de Pólvora Negra', icon: '💥', type: 'weapon', minLevel: 8 },
      description: 'Engenharia militar anã avançada combinando o mecanismo de repetição da balista com chumbo explosivo.',
      effect: 'Dispara projéteis de artilharia pesados perfurantes que detonam em uma salva colossal de 18 estilhaços incandescentes em 360° ao contato com os alvos.',
      lore: 'Criado pelos mestres artilheiros de Karak para quebrar cercos de mil ogros.'
    },
    {
      id: 'fusion_purgatory_fire',
      supremeWeaponId: 'supreme_purgatory_fire',
      name: 'Conflagração do Purgatório',
      icon: '🔥☠️',
      type: 'weapon_fusion',
      item1: { id: 'holy_fire', name: 'Frascos de Fogo Sagrado', icon: '🧪', type: 'weapon', minLevel: 8 },
      item2: { id: 'hellfire_cauldron', name: 'Caldeirão de Fogo Grego', icon: '🏺', type: 'weapon', minLevel: 8 },
      description: 'A união profana das chamas celestes purificadoras com o fogo grego inextinguível do abismo.',
      effect: 'Erupções contínuas de magma bicolores (azul safira e ouro solar) que criam um mar perpétuo de labaredas com queima de 200% de dano contínuo.',
      lore: 'Um fogo que queima a carne, a armadura e o espírito simultaneamente.'
    },
    {
      id: 'fusion_titan_storm',
      supremeWeaponId: 'supreme_titan_storm',
      name: 'Tempestade dos Titãs de Aço',
      icon: '🌪️⛓️',
      type: 'weapon_fusion',
      item1: { id: 'whirling_axes', name: 'Machados de Arremesso', icon: '🪓', type: 'weapon', minLevel: 8 },
      item2: { id: 'iron_flail', name: 'Mangual de Ferro Cravado', icon: '⛓️', type: 'weapon', minLevel: 8 },
      description: 'O ápice da fúria bélica bárbara com correntes de ferro fundido interligadas a machados pesados.',
      effect: '4 manguais com machados orbitam em espiral e se projetam para fora em raio de 160 unidades em trajetória bumerangue com atordoamento.',
      lore: 'Nem muralhas de pedra resistem ao impacto do aço titânico em rotação.'
    },
    {
      id: 'fusion_celestial_fortress',
      supremeWeaponId: 'supreme_celestial_fortress',
      name: 'Fortaleza Celestial Invicta',
      icon: '🛡️☀️',
      type: 'weapon_fusion',
      item1: { id: 'holy_aura', name: 'Radiação da Alvorada', icon: '✨', type: 'weapon', minLevel: 8 },
      item2: { id: 'retribution_shield', name: 'Escudo da Retaliação', icon: '🛡️', type: 'weapon', minLevel: 8 },
      description: 'O paladino torna-se um bastião inexpugnável envolto por cúpulas prismáticas divinas.',
      effect: '5 escudos solares anulam 100% dos projéteis inimigos, emitem feixes de luz concentrados nos 6 inimigos mais próximos e curam o herói ao bloquear.',
      lore: 'Dizem que um único cavaleiro com esta bênção conteve um exército demoníaco por três dias.'
    },
    {
      id: 'fusion_soul_singularity',
      supremeWeaponId: 'supreme_soul_singularity',
      name: 'Singularidade das Almas Perdidas',
      icon: '🌌👻',
      type: 'weapon_fusion',
      item1: { id: 'spectral_orb', name: 'Orbe Espectral', icon: '🔮', type: 'weapon', minLevel: 8 },
      item2: { id: 'eldritch_tome', name: 'Tomo dos Sussurros Arcanos', icon: '📖', type: 'weapon', minLevel: 8 },
      description: 'Um portal direto para o vácuo astral que consome o espírito de todas as criaturas terrenas.',
      effect: 'Cria uma fenda gravitacional cósmica que suga tudo em 130 unidades. Cada monstro atraído libera cometas espirituais teleguiados, culminando em supernova.',
      lore: 'Os sussurros do tomo despertam as almas adormecidas para um frenesi faminto.'
    },
    {
      id: 'fusion_blood_dance',
      supremeWeaponId: 'supreme_blood_dance',
      name: 'Dança das Lâminas Sangrentas',
      icon: '🩸⚔️',
      type: 'weapon_fusion',
      item1: { id: 'twin_daggers', name: 'Adagas Gêmeas Sombrias', icon: '🗡️', type: 'weapon', minLevel: 8 },
      item2: { id: 'penitent_whip', name: 'Chicote Penitente', icon: '🩸', type: 'weapon', minLevel: 8 },
      description: 'Técnica proibida dos assassinos carmesins que transforma o campo em um redemoinho de navalhas.',
      effect: 'Redemoinho contínuo de lâminas e chicotes em estrela de 8 pontas (recarga 0.38s). Acertos críticos causam explosão de sangue e regeneram 1 HP.',
      lore: 'A cada passo da dança, dez gargantas são cortadas sem um único som.'
    },
    {
      id: 'fusion_cataclysm_breaker',
      supremeWeaponId: 'supreme_cataclysm_breaker',
      name: 'Destruidor do Cataclismo Abissal',
      icon: '⚡🌑',
      type: 'weapon_fusion',
      item1: { id: 'dark_greatsword', name: 'Espadão Negro do Caído', icon: '🗡️', type: 'weapon', minLevel: 8 },
      item2: { id: 'thunder_hammer', name: 'Martelo do Trovão', icon: '⚡', type: 'weapon', minLevel: 8 },
      description: 'O ferro de obsidiana forjado sob a queda de mil tempestades de relâmpagos abissais.',
      effect: 'Fissuras sísmicas partem o solo com magma negro enquanto 4 relâmpagos de plasma escuro caem simultaneamente, causando dano crítico massivo em chefes.',
      lore: 'O peso do cataclismo racha o próprio tecido da realidade.'
    },
    {
      id: 'fusion_black_death',
      supremeWeaponId: 'supreme_black_death',
      name: 'Peste Negra Contagiosa',
      icon: '☣️🐍',
      type: 'weapon_fusion',
      item1: { id: 'plague_flask', name: 'Frascos de Ácido Pútrido', icon: '🧪', type: 'weapon', minLevel: 8 },
      item2: { id: 'viper_blowpipe', name: 'Zarabatana da Víbora', icon: '🎋', type: 'weapon', minLevel: 8 },
      description: 'A mutação terminal do veneno de víbora com o ácido alquímico corrompido.',
      effect: 'Dispara agulhas de biotoxina viral que criam poças e névoas químicas. Monstros abatidos explodem transmitindo a peste para todos em 110 unidades.',
      lore: 'Nenhum antídoto conhecido pelo homem é capaz de deter a marcha da peste.'
    },
    {
      id: 'fusion_stellar_frost',
      supremeWeaponId: 'supreme_stellar_frost',
      name: 'Cometa da Geada Estelar',
      icon: '❄️🌙',
      type: 'weapon_fusion',
      item1: { id: 'celestial_glaive', name: 'Glaive Lunar Celestial', icon: '🌙', type: 'weapon', minLevel: 8 },
      item2: { id: 'frost_lance', name: 'Lança de Gelo Glacial', icon: '❄️', type: 'weapon', minLevel: 8 },
      description: 'Um fragmento estelar de gelo cósmico imbuído com as fases da lua prateada.',
      effect: 'Lança 3 glaives de gelo que saltam até 12 vezes entre monstros, congelando-os por 1.8s. Inimigos congelados explodem em 6 estilhaços de gelo ao morrer.',
      lore: 'O frio eterno do vazio interestelar condensado em lâminas de corte.'
    }
  ];

  // Definition of 20 Weapon + Passive Ascensions
  const WEAPON_PASSIVE_ASCENSIONS = [
    {
      id: 'asc_broadsword_damage',
      name: 'Lâmina do Julgamento do Rei',
      weaponId: 'broadsword',
      weaponName: 'Espada Larga Real',
      weaponIcon: '⚔️',
      passiveId: 'passive_damage',
      passiveName: 'Manopla de Titã',
      passiveIcon: '🥊',
      effect: '+100% Dano Crítico e ondas de lâmina dourada que trespassam obstáculos.'
    },
    {
      id: 'asc_crossbow_projectiles',
      name: 'Balista de Repetição Imperial',
      weaponId: 'crossbow',
      weaponName: 'Besta de Repetição',
      weaponIcon: '🏹',
      passiveId: 'passive_projectiles',
      passiveName: 'Anel da Multiplicação',
      passiveIcon: '💍',
      effect: 'Dispara +3 virotes pesados adicionais por rajada com 100% de perfuração.'
    },
    {
      id: 'asc_holy_fire_area',
      name: 'Conflagração Perpétua',
      weaponId: 'holy_fire',
      weaponName: 'Frascos de Fogo Sagrado',
      weaponIcon: '🧪',
      passiveId: 'passive_area',
      passiveName: 'Estandarte de Alcance',
      passiveIcon: '🚩',
      effect: 'Dobra o raio das chamas sagradas (+100% área) e dobra a duração no solo.'
    },
    {
      id: 'asc_whirling_axes_speed',
      name: 'Machados do Frenesi de Odin',
      weaponId: 'whirling_axes',
      weaponName: 'Machados de Arremesso',
      weaponIcon: '🪓',
      passiveId: 'passive_speed',
      passiveName: 'Botas Aladas',
      passiveIcon: '👢',
      effect: 'Machados giram com velocidade 2.5x maior e arrastam inimigos no caminho.'
    },
    {
      id: 'asc_holy_aura_regen',
      name: 'Sol da Ressurreição',
      weaponId: 'holy_aura',
      weaponName: 'Radiação da Alvorada',
      weaponIcon: '✨',
      passiveId: 'passive_regen',
      passiveName: 'Amuleto de Vitalidade',
      passiveIcon: '📿',
      effect: 'O pulso da aura restaura 2 HP para o jogador a cada monstro destruído.'
    },
    {
      id: 'asc_guardian_spear_armor',
      name: 'Baluarte dos Cem Bastiões',
      weaponId: 'guardian_spear',
      weaponName: 'Lança dos Guardiões',
      weaponIcon: '🔱',
      passiveId: 'passive_armor',
      passiveName: 'Armadura de Placas',
      passiveIcon: '🛡️',
      effect: 'Gera uma barreira protetora a cada estocada que absorve até 40 de dano.'
    },
    {
      id: 'asc_spectral_orb_cooldown',
      name: 'Chuva de Cometas Espirituais',
      weaponId: 'spectral_orb',
      weaponName: 'Orbe Espectral',
      weaponIcon: '🔮',
      passiveId: 'passive_cooldown',
      passiveName: 'Tomo da Aceleração',
      passiveIcon: '📖',
      effect: 'Dispara rajadas contínuas de orbes com -50% de tempo de recarga.'
    },
    {
      id: 'asc_twin_daggers_speed',
      name: 'Passos Sombrios Fantasmagóricos',
      weaponId: 'twin_daggers',
      weaponName: 'Adagas Gêmeas Sombrias',
      weaponIcon: '🗡️',
      passiveId: 'passive_speed',
      passiveName: 'Botas Aladas',
      passiveIcon: '👢',
      effect: 'Concede corrida fantasma (+60% velocidade) e invulnerabilidade momentânea ao matar.'
    },
    {
      id: 'asc_dark_greatsword_maxhp',
      name: 'Colosso da Ruína de Sangue',
      weaponId: 'dark_greatsword',
      weaponName: 'Espadão Negro do Caído',
      weaponIcon: '🗡️',
      passiveId: 'passive_maxhp',
      passiveName: 'Coração de Ferro',
      passiveIcon: '❤️',
      effect: 'O dano do espadão escala adicionalmente com 20% da Vida Máxima do herói.'
    },
    {
      id: 'asc_plague_flask_area',
      name: 'Oceano de Podridão Alquímica',
      weaponId: 'plague_flask',
      weaponName: 'Frascos de Ácido Pútrido',
      weaponIcon: '🧪',
      passiveId: 'passive_area',
      passiveName: 'Estandarte de Alcance',
      passiveIcon: '🚩',
      effect: 'Poças de ácido fundem-se em um mar cáustico cobrindo grande parte da arena.'
    },
    {
      id: 'asc_iron_flail_armor',
      name: 'Fortaleza de Espinhos de Ferro',
      weaponId: 'iron_flail',
      weaponName: 'Mangual de Ferro Cravado',
      weaponIcon: '⛓️',
      passiveId: 'passive_armor',
      passiveName: 'Armadura de Placas',
      passiveIcon: '🛡️',
      effect: 'Manguais ganham espinhos adicionais e refletem 100% do impacto recebido.'
    },
    {
      id: 'asc_blunderbuss_damage',
      name: 'Canhoneio Destruidor de Cidadelas',
      weaponId: 'blunderbuss',
      weaponName: 'Bacamarte de Pólvora Negra',
      weaponIcon: '💥',
      passiveId: 'passive_damage',
      passiveName: 'Manopla de Titã',
      passiveIcon: '🥊',
      effect: 'Balotes pesados trespassam armaduras ignorando completamente a defesa.'
    },
    {
      id: 'asc_penitent_whip_regen',
      name: 'Açoite da Absolvição Sanguínea',
      weaponId: 'penitent_whip',
      weaponName: 'Chicote Penitente',
      weaponIcon: '🩸',
      passiveId: 'passive_regen',
      passiveName: 'Amuleto de Vitalidade',
      passiveIcon: '📿',
      effect: 'Cada açoite que atingir 3 ou mais inimigos recupera 4 HP instantaneamente.'
    },
    {
      id: 'asc_celestial_glaive_cooldown',
      name: 'Dança Lunar Interminável',
      weaponId: 'celestial_glaive',
      weaponName: 'Glaive Lunar Celestial',
      weaponIcon: '🌙',
      passiveId: 'passive_cooldown',
      passiveName: 'Tomo da Aceleração',
      passiveIcon: '📖',
      effect: 'Glaives permanecem ativas em voo por tempo indeterminado enquanto houver alvos.'
    },
    {
      id: 'asc_thunder_hammer_area',
      name: 'Tempestade do Juízo Final',
      weaponId: 'thunder_hammer',
      weaponName: 'Martelo do Trovão',
      weaponIcon: '⚡',
      passiveId: 'passive_area',
      passiveName: 'Estandarte de Alcance',
      passiveIcon: '🚩',
      effect: 'Raios caem com o dobro da espessura causando terremoto na arena inteira.'
    },
    {
      id: 'asc_viper_blowpipe_magnet',
      name: 'Agulhas Extratoras de Almas',
      weaponId: 'viper_blowpipe',
      weaponName: 'Zarabatana da Víbora',
      weaponIcon: '🎋',
      passiveId: 'passive_magnet',
      passiveName: 'Ímã de Relíquias',
      passiveIcon: '🧲',
      effect: 'Inimigos mortos por veneno atraem todas as gemas de XP e moedas ao herói.'
    },
    {
      id: 'asc_eldritch_tome_magnet',
      name: 'Vórtice da Coleta Cósmica',
      weaponId: 'eldritch_tome',
      weaponName: 'Tomo dos Sussurros Arcanos',
      weaponIcon: '📖',
      passiveId: 'passive_magnet',
      passiveName: 'Ímã de Relíquias',
      passiveIcon: '🧲',
      effect: 'O centro gravitacional suga todas as gemas e baús do mapa para o herói.'
    },
    {
      id: 'asc_frost_lance_cooldown',
      name: 'Vento Glacial do Fimbulwinter',
      weaponId: 'frost_lance',
      weaponName: 'Lança de Gelo Glacial',
      weaponIcon: '❄️',
      passiveId: 'passive_cooldown',
      passiveName: 'Tomo da Aceleração',
      passiveIcon: '📖',
      effect: 'Lança estacas de gelo a cada 0.35s congelando permanentemente os alvos.'
    },
    {
      id: 'asc_retribution_shield_maxhp',
      name: 'Égide do Guardião Imortal',
      weaponId: 'retribution_shield',
      weaponName: 'Escudo da Retaliação',
      weaponIcon: '🛡️',
      passiveId: 'passive_maxhp',
      passiveName: 'Coração de Ferro',
      passiveIcon: '❤️',
      effect: 'Converte 15% da vida máxima em um escudo protetor renovável a cada 10s.'
    },
    {
      id: 'asc_hellfire_cauldron_speed',
      name: 'Trilha do Rastro Vulcânico',
      weaponId: 'hellfire_cauldron',
      weaponName: 'Caldeirão de Fogo Grego',
      weaponIcon: '🏺',
      passiveId: 'passive_speed',
      passiveName: 'Botas Aladas',
      passiveIcon: '👢',
      effect: 'Quanto mais rápido o herói corre, mais densa e ardente se torna a muralha de fogo.'
    }
  ];

  // ========================================================
  // IMPLEMENTATION OF THE 10 SUPREME WEAPONS
  // ========================================================

  // 1. Excalibur da Alvorada Divina
  class SupremeExcaliburWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_excalibur',
        name: 'Excalibur da Alvorada Divina',
        icon: '🗡️✨',
        description: 'A lâmina sagrada dos primeiros reis. Desfere cortes cósmicos dourados com estocadas cardeais.',
        maxLevel: 5,
        damage: 130,
        cooldown: 0.95,
        area: 1.6,
        count: 1,
        levelsConfig: [
          { damage: 130, cooldown: 0.95, description: 'Cortes divinos de raio 95 + 4 Lanças Sagradas cardeais.' },
          { damage: 165, area: 1.8, description: 'Dano: 130 → 165 | +20% Raio' },
          { cooldown: 0.82, description: 'Recarga: 0.95s → 0.82s' },
          { damage: 210, area: 2.1, description: 'Dano: 165 → 210 | +30% Raio' },
          { damage: 290, cooldown: 0.68, area: 2.5, description: 'PODER MÁXIMO: Cortes solares que purificam toda a tela!' }
        ]
      });
      this.slashEffects = [];
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const reach = 95 * this.area * player.areaMultiplier;
      const angle = player.facingAngle !== undefined ? player.facingAngle : 0;

      // Colossal Frontal Arc Slash
      const slash = {
        x: player.x,
        y: player.y,
        angle: angle,
        radius: reach,
        duration: 0.22,
        maxDuration: 0.22,
        isEvolved: true,
        isSupreme: true,
        player: player
      };
      this.slashEffects.push(slash);

      // Hit detection in massive front arc
      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= reach + e.radius) {
          const dealt = e.takeDamage(effectiveDamage, Math.cos(angle) * 32, Math.sin(angle) * 32, 0.25);
          this.totalDamageDealt += dealt;
        }
      }

      // 4 Cardinal Plasma Spears
      for (let c = 0; c < 4; c++) {
        const spearAngle = angle + (c * Math.PI * 0.5);
        projectiles.push(new SupremeSpearBolt({
          x: player.x,
          y: player.y,
          angle: spearAngle,
          damage: Math.round(effectiveDamage * 0.75),
          weapon: this
        }));
      }

      if (particles && particles.createExplosionWave) {
        particles.createExplosionWave(player.x, player.y, reach * 0.8, '#f1c40f');
      }
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
        if (s.duration <= 0) this.slashEffects.splice(i, 1);
      }
    }
  }

  class SupremeSpearBolt {
    constructor(cfg) {
      this.x = cfg.x;
      this.y = cfg.y;
      this.angle = cfg.angle;
      this.damage = cfg.damage;
      this.weapon = cfg.weapon;
      this.speed = 880;
      this.radius = 16;
      this.life = 0.9;
      this.alive = true;
      this.isSupremeSpear = true;
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
        if (dx * dx + dy * dy <= (this.radius + e.radius) * (this.radius + e.radius)) {
          this.hitEnemies.add(e);
          const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 24, Math.sin(this.angle) * 24, 0.18);
          this.weapon.totalDamageDealt += dealt;
        }
      }
      return true;
    }
  }

  // 2. Canhão Balista Portátil
  class SupremeArtilleryCannonWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_artillery_cannon',
        name: 'Canhão Balista Portátil',
        icon: '💥🎯',
        description: 'Dispara projéteis de artilharia anã que trespassam fileiras e explodem em 18 estilhaços incandescentes.',
        maxLevel: 5,
        damage: 150,
        cooldown: 1.15,
        area: 1.5,
        count: 1,
        levelsConfig: [
          { damage: 150, cooldown: 1.15, description: 'Canhoneio perfurante com detonação de 18 estilhaços em 360°.' },
          { damage: 190, area: 1.7, description: 'Dano: 150 → 190 | +20% Raio de Estilhaços' },
          { cooldown: 0.98, description: 'Recarga: 1.15s → 0.98s' },
          { damage: 245, area: 2.0, description: 'Dano: 190 → 245 | Salva de 24 Estilhaços' },
          { damage: 340, cooldown: 0.8, description: 'PODER MÁXIMO: Disparo duplo de canhões pesados devastadores!' }
        ]
      });
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const angle = player.facingAngle !== undefined ? player.facingAngle : 0;

      projectiles.push(new SupremeArtilleryShell({
        x: player.x,
        y: player.y,
        angle: angle,
        damage: effectiveDamage,
        area: this.area * player.areaMultiplier,
        weapon: this
      }));

      if (particles && particles.createExplosionWave) {
        particles.createExplosionWave(player.x, player.y, 35, '#e67e22');
      }
    }
  }

  class SupremeArtilleryShell {
    constructor(cfg) {
      this.x = cfg.x;
      this.y = cfg.y;
      this.angle = cfg.angle;
      this.damage = cfg.damage;
      this.area = cfg.area || 1.0;
      this.weapon = cfg.weapon;
      this.speed = 420;
      this.radius = 15;
      this.life = 0.85;
      this.alive = true;
      this.isArtillery = true;
      this.hitEnemies = new Set();
    }

    update(dt, enemies, particles) {
      this.life -= dt;
      if (this.life <= 0) {
        this.explode(enemies, particles);
        return false;
      }

      this.x += Math.cos(this.angle) * this.speed * dt;
      this.y += Math.sin(this.angle) * this.speed * dt;

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive || this.hitEnemies.has(e)) continue;

        const dx = e.x - this.x;
        const dy = e.y - this.y;
        if (dx * dx + dy * dy <= (this.radius + e.radius) * (this.radius + e.radius)) {
          this.hitEnemies.add(e);
          const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 30, Math.sin(this.angle) * 30, 0.2);
          this.weapon.totalDamageDealt += dealt;

          // Detonate shrapnel nova on first impact!
          this.explode(enemies, particles);
          return false;
        }
      }
      return true;
    }

    explode(enemies, particles) {
      const shrapnelCount = 18;
      const shrapnelDmg = Math.round(this.damage * 0.45);
      const blastRadius = 65 * this.area;

      if (particles && particles.createExplosionWave) {
        particles.createExplosionWave(this.x, this.y, blastRadius, '#e74c3c');
      }

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        if (dx * dx + dy * dy <= blastRadius * blastRadius) {
          const dealt = e.takeDamage(shrapnelDmg, dx * 0.25, dy * 0.25, 0.15);
          this.weapon.totalDamageDealt += dealt;
        }
      }
    }
  }

  // 3. Conflagração do Purgatório
  class SupremePurgatoryFireWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_purgatory_fire',
        name: 'Conflagração do Purgatório',
        icon: '🔥☠️',
        description: 'Chamas sagrado-infernais eternas que transformam o campo de batalha em um mar de lava.',
        maxLevel: 5,
        damage: 42,
        cooldown: 0.65,
        area: 1.6,
        count: 1,
        levelsConfig: [
          { damage: 42, cooldown: 0.65, description: 'Mar contínuo de chamas sagrado-infernais com 200% de queima.' },
          { damage: 56, area: 1.85, description: 'Dano: 42 → 56 | +25% Raio de Chamas' },
          { cooldown: 0.52, description: 'Recarga: 0.65s → 0.52s' },
          { damage: 75, area: 2.2, description: 'Dano: 56 → 75 | +35% Área' },
          { damage: 110, cooldown: 0.38, area: 2.7, description: 'PODER MÁXIMO: Inferno Perpétuo que incinera tudo sem cessar!' }
        ]
      });
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const poolRadius = 55 * this.area * player.areaMultiplier;

      // Drop 2 large purgatory magma pools
      for (let i = 0; i < 2; i++) {
        const offsetDist = i === 0 ? 0 : 35;
        const offsetAngle = Math.random() * Math.PI * 2;
        projectiles.push(new SupremePurgatoryPool({
          x: player.x + Math.cos(offsetAngle) * offsetDist,
          y: player.y + Math.sin(offsetAngle) * offsetDist,
          damage: effectiveDamage,
          radius: poolRadius,
          duration: 6.5,
          weapon: this
        }));
      }
    }
  }

  class SupremePurgatoryPool {
    constructor(cfg) {
      this.x = cfg.x;
      this.y = cfg.y;
      this.damage = cfg.damage;
      this.radius = cfg.radius;
      this.duration = cfg.duration;
      this.weapon = cfg.weapon;
      this.state = 'burning';
      this.tickTimer = 0;
      this.alive = true;
      this.isPurgatory = true;
      this.isHellfire = true;
    }

    update(dt, enemies, particles) {
      this.duration -= dt;
      if (this.duration <= 0) return false;

      this.tickTimer += dt;
      if (this.tickTimer >= 0.2) {
        this.tickTimer = 0;
        for (let i = 0, len = enemies.length; i < len; i++) {
          const e = enemies[i];
          if (!e.alive) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          if (dx * dx + dy * dy <= this.radius * this.radius) {
            e.isBurning = true;
            const dealt = e.takeDamage(this.damage, 0, 0, 0);
            this.weapon.totalDamageDealt += dealt;
          }
        }
      }
      return true;
    }
  }

  // 4. Tempestade dos Titãs de Aço
  class SupremeTitanStormWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_titan_storm',
        name: 'Tempestade dos Titãs de Aço',
        icon: '🌪️⛓️',
        description: 'Manguais e machados ligados por correntes que orbitam em espiral e se projetam em ondas bumerangue.',
        maxLevel: 5,
        damage: 110,
        cooldown: 0.1,
        area: 1.5,
        count: 4,
        speed: 6.0,
        levelsConfig: [
          { damage: 110, count: 4, description: '4 Manguais-Machados orbitantes com expansão espiral de longo alcance.' },
          { damage: 145, speed: 7.2, description: 'Dano: 110 → 145 | +20% Velocidade de Rotação' },
          { area: 1.8, description: '+30% Alcance da Espiral dos Titãs' },
          { damage: 195, count: 5, description: 'Dano: 145 → 195 | 5 Manguais-Machados' },
          { damage: 280, count: 6, speed: 9.0, description: 'PODER MÁXIMO: Furacão Sísmico de 6 armas titânicas!' }
        ]
      });
      this.orbiters = [];
    }

    update(dt, player, enemies, projectiles, particles) {
      if (this.level <= 0 || !player) return;
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const effectiveArea = this.area * player.areaMultiplier;
      const targetCount = this.count + (player.bonusProjectiles || 0);

      while (this.orbiters.length < targetCount) {
        const idx = this.orbiters.length;
        const angle = (idx / targetCount) * Math.PI * 2;
        const orb = new SupremeTitanOrbiter({
          weapon: this,
          angle: angle,
          baseRadius: 85 * effectiveArea,
          damage: effectiveDamage,
          rotSpeed: this.baseSpeed
        });
        this.orbiters.push(orb);
        projectiles.push(orb);
      }

      for (let i = 0; i < this.orbiters.length; i++) {
        const orb = this.orbiters[i];
        orb.damage = effectiveDamage;
        orb.baseRadius = 85 * effectiveArea;
        orb.rotSpeed = this.baseSpeed;
      }
    }
  }

  class SupremeTitanOrbiter {
    constructor(cfg) {
      this.weapon = cfg.weapon;
      this.angle = cfg.angle || 0;
      this.baseRadius = cfg.baseRadius || 85;
      this.damage = cfg.damage || 110;
      this.rotSpeed = cfg.rotSpeed || 6.0;
      this.time = 0;
      this.x = 0;
      this.y = 0;
      this.radius = 20;
      this.hitCooldowns = new Map();
      this.alive = true;
      this.isTitan = true;
      this.isFlail = true;
      this.isEvolved = true;
    }

    update(dt, enemies, particles) {
      if (!this.weapon || this.weapon.level <= 0) return false;
      const game = window.MedievalSurvivors.gameInstance;
      const player = game ? game.player : null;
      if (!player || !player.alive) return false;

      this.time += dt;
      this.angle += this.rotSpeed * dt;

      // Pulsing spiral orbit (85 -> 155 -> 85)
      const currentRadius = this.baseRadius + Math.sin(this.time * 2.8) * 45;
      this.x = player.x + Math.cos(this.angle) * currentRadius;
      this.y = player.y + Math.sin(this.angle) * currentRadius;

      for (const [e, timer] of this.hitCooldowns.entries()) {
        if (timer <= dt) this.hitCooldowns.delete(e);
        else this.hitCooldowns.set(e, timer - dt);
      }

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive || this.hitCooldowns.has(e)) continue;

        const dx = e.x - this.x;
        const dy = e.y - this.y;
        if (dx * dx + dy * dy <= (this.radius + e.radius) * (this.radius + e.radius)) {
          const kbX = Math.cos(this.angle) * 26;
          const kbY = Math.sin(this.angle) * 26;
          const dealt = e.takeDamage(this.damage, kbX, kbY, 0.2);
          this.weapon.totalDamageDealt += dealt;
          this.hitCooldowns.set(e, 0.22);

          if (particles && particles.createBloodSparks) {
            particles.createBloodSparks(this.x, this.y, 8, '#f39c12');
          }
        }
      }
      return true;
    }
  }

  // 5. Fortaleza Celestial Invicta
  class SupremeCelestialFortressWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_celestial_fortress',
        name: 'Fortaleza Celestial Invicta',
        icon: '🛡️☀️',
        description: 'Barreira de 5 escudos prismáticos que anulam projéteis e disparam feixes solares contínuos.',
        maxLevel: 5,
        damage: 85,
        cooldown: 0.1,
        area: 1.5,
        count: 5,
        speed: 4.0,
        levelsConfig: [
          { damage: 85, count: 5, description: '5 Escudos de luz solar que bloqueiam projéteis e disparam feixes radiantes.' },
          { damage: 110, description: 'Dano: 85 → 110 | +Feixes Solares adicionais' },
          { area: 1.8, description: '+30% Raio de Proteção da Cúpula' },
          { damage: 155, count: 6, description: 'Dano: 110 → 155 | 6 Escudos Celestes' },
          { damage: 220, count: 7, speed: 6.0, description: 'PODER MÁXIMO: Cúpula Solar Invulnerável com cura passiva!' }
        ]
      });
      this.shields = [];
      this.laserTimer = 0;
    }

    update(dt, player, enemies, projectiles, particles) {
      if (this.level <= 0 || !player) return;
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const effectiveArea = this.area * player.areaMultiplier;
      const targetCount = this.count + (player.bonusProjectiles || 0);

      while (this.shields.length < targetCount) {
        const idx = this.shields.length;
        const angle = (idx / targetCount) * Math.PI * 2;
        const s = new SupremeCelestialShieldOrbiter({
          weapon: this,
          angle: angle,
          orbitRadius: 65 * effectiveArea,
          damage: effectiveDamage,
          rotSpeed: this.baseSpeed
        });
        this.shields.push(s);
        projectiles.push(s);
      }

      for (let i = 0; i < this.shields.length; i++) {
        const s = this.shields[i];
        s.damage = effectiveDamage;
        s.orbitRadius = 65 * effectiveArea;
        s.rotSpeed = this.baseSpeed;
      }

      // Continuous Solar Lasers at closest enemies
      this.laserTimer += dt;
      if (this.laserTimer >= 0.35 && enemies.length > 0) {
        this.laserTimer = 0;
        const targets = enemies.slice(0, 4);
        for (let t = 0; t < targets.length; t++) {
          const target = targets[t];
          if (!target.alive) continue;
          const dealt = target.takeDamage(Math.round(effectiveDamage * 0.5), 0, 0, 0.05);
          this.totalDamageDealt += dealt;

          if (particles && particles.createExplosionWave) {
            particles.createExplosionWave(target.x, target.y, 16, '#f1c40f');
          }
        }
      }
    }
  }

  class SupremeCelestialShieldOrbiter {
    constructor(cfg) {
      this.weapon = cfg.weapon;
      this.angle = cfg.angle || 0;
      this.orbitRadius = cfg.orbitRadius || 65;
      this.damage = cfg.damage || 85;
      this.rotSpeed = cfg.rotSpeed || 4.0;
      this.x = 0;
      this.y = 0;
      this.radius = 18;
      this.hitCooldowns = new Map();
      this.alive = true;
      this.isShield = true;
      this.isSupremeShield = true;
      this.isEvolved = true;
    }

    update(dt, enemies, particles) {
      if (!this.weapon || this.weapon.level <= 0) return false;
      const game = window.MedievalSurvivors.gameInstance;
      const player = game ? game.player : null;
      if (!player || !player.alive) return false;

      this.angle += this.rotSpeed * dt;
      this.x = player.x + Math.cos(this.angle) * this.orbitRadius;
      this.y = player.y + Math.sin(this.angle) * this.orbitRadius;

      // Parry all enemy projectiles
      if (game && game.enemyProjectiles) {
        for (let i = game.enemyProjectiles.length - 1; i >= 0; i--) {
          const ep = game.enemyProjectiles[i];
          if (!ep.alive) continue;
          const dx = ep.x - this.x;
          const dy = ep.y - this.y;
          if (dx * dx + dy * dy <= 28 * 28) {
            ep.alive = false;
            // Heal player slightly on parry
            player.hp = Math.min(player.maxHp, player.hp + 2);
            if (particles && particles.createExplosionWave) {
              particles.createExplosionWave(this.x, this.y, 25, '#f1c40f');
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
        if (dx * dx + dy * dy <= (this.radius + e.radius) * (this.radius + e.radius)) {
          const dealt = e.takeDamage(this.damage, Math.cos(this.angle) * 20, Math.sin(this.angle) * 20, 0.15);
          this.weapon.totalDamageDealt += dealt;
          this.hitCooldowns.set(e, 0.25);
        }
      }
      return true;
    }
  }

  // 6. Singularidade das Almas Perdidas
  class SupremeSoulSingularityWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_soul_singularity',
        name: 'Singularidade das Almas Perdidas',
        icon: '🌌👻',
        description: 'Fenda cósmica que suga almas e dispara cometas espectrais teleguiados em cadeia.',
        maxLevel: 5,
        damage: 55,
        cooldown: 1.8,
        area: 1.6,
        count: 1,
        levelsConfig: [
          { damage: 55, cooldown: 1.8, description: 'Buraco negro cósmico de sucção + salva de cometas espectrais.' },
          { damage: 75, area: 1.9, description: 'Dano: 55 → 75 | +30% Raio de Sucção' },
          { cooldown: 1.45, description: 'Recarga: 1.8s → 1.45s' },
          { damage: 105, area: 2.3, description: 'Dano: 75 → 105 | Supernova de 350 Dano' },
          { damage: 160, cooldown: 1.1, description: 'PODER MÁXIMO: Singularidade Dupla com tempestade astral!' }
        ]
      });
    }

    attack(player, enemies, projectiles, particles) {
      if (enemies.length === 0) return;
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const randTarget = enemies[Math.floor(Math.random() * enemies.length)];
      if (!randTarget) return;

      projectiles.push(new SupremeSoulSingularityVortex({
        x: randTarget.x,
        y: randTarget.y,
        radius: 80 * this.area * player.areaMultiplier,
        damage: effectiveDamage,
        weapon: this
      }));
    }
  }

  class SupremeSoulSingularityVortex {
    constructor(cfg) {
      this.x = cfg.x;
      this.y = cfg.y;
      this.radius = cfg.radius;
      this.damage = cfg.damage;
      this.weapon = cfg.weapon;
      this.duration = 3.2;
      this.tickTimer = 0;
      this.alive = true;
      this.isVortex = true;
      this.isEvolved = true;
      this.isSupreme = true;
    }

    update(dt, enemies, particles) {
      this.duration -= dt;
      if (this.duration <= 0) {
        // Supernova Collapse
        const novaDmg = Math.round(this.damage * 4.5);
        if (particles && particles.createExplosionWave) {
          particles.createExplosionWave(this.x, this.y, this.radius * 1.5, '#bb86fc');
        }
        for (let i = 0, len = enemies.length; i < len; i++) {
          const e = enemies[i];
          if (!e.alive) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          if (dx * dx + dy * dy <= this.radius * this.radius) {
            const dealt = e.takeDamage(novaDmg, dx * 0.3, dy * 0.3, 0.3);
            this.weapon.totalDamageDealt += dealt;
          }
        }
        return false;
      }

      // Vacuum suction & soul comet spawn
      const pullSpeed = 130 * dt;
      this.tickTimer += dt;
      const doTick = this.tickTimer >= 0.22;
      if (doTick) this.tickTimer = 0;

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = this.x - e.x;
        const dy = this.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= this.radius + e.radius && dist > 5) {
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

  // 7. Dança das Lâminas Sangrentas
  class SupremeBloodDanceWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_blood_dance',
        name: 'Dança das Lâminas Sangrentas',
        icon: '🩸⚔️',
        description: 'Vórtice octogonal supersônico de lâminas carmesins e chicotes que drena a essência dos monstros.',
        maxLevel: 5,
        damage: 90,
        cooldown: 0.42,
        area: 1.5,
        count: 8,
        levelsConfig: [
          { damage: 90, cooldown: 0.42, description: 'Estrela de 8 Lâminas Carmesins a cada 0.42s com roubo de vida.' },
          { damage: 120, area: 1.8, description: 'Dano: 90 → 120 | +30% Alcance' },
          { cooldown: 0.34, description: 'Recarga: 0.42s → 0.34s' },
          { damage: 165, area: 2.2, description: 'Dano: 120 → 165 | +40% Alcance' },
          { damage: 240, cooldown: 0.25, description: 'PODER MÁXIMO: Frenesi sangrento sem limites!' }
        ]
      });
      this.slashEffects = [];
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const reach = 80 * this.area * player.areaMultiplier;

      // 8-directional blood lashes
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2 + (player.facingAngle || 0);
        this.slashEffects.push({
          x: player.x,
          y: player.y,
          angle: angle,
          reach: reach,
          radius: reach,
          duration: 0.16,
          maxDuration: 0.16,
          isEvolved: true,
          isSupreme: true,
          player: player
        });

        const endX = player.x + Math.cos(angle) * reach;
        const endY = player.y + Math.sin(angle) * reach;

        for (let j = 0, len = enemies.length; j < len; j++) {
          const e = enemies[j];
          if (!e.alive) continue;
          const d = distToSegment(e.x, e.y, player.x, player.y, endX, endY);
          if (d <= 24 + e.radius) {
            const dealt = e.takeDamage(effectiveDamage, Math.cos(angle) * 16, Math.sin(angle) * 16, 0.12);
            this.totalDamageDealt += dealt;

            // Life leech on critical strike
            if (Math.random() < (player.critChance || 0.1)) {
              player.hp = Math.min(player.maxHp, player.hp + 2);
            }
          }
        }
      }
    }

    update(dt, player, enemies, projectiles, particles) {
      super.update(dt, player, enemies, projectiles, particles);
      for (let i = this.slashEffects.length - 1; i >= 0; i--) {
        const l = this.slashEffects[i];
        l.duration -= dt;
        if (player) {
          l.x = player.x;
          l.y = player.y;
        }
        if (l.duration <= 0) this.slashEffects.splice(i, 1);
      }
    }
  }

  // 8. Destruidor do Cataclismo Abissal
  class SupremeCataclysmBreakerWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_cataclysm_breaker',
        name: 'Destruidor do Cataclismo Abissal',
        icon: '⚡🌑',
        description: 'Golpes telúricos abissais que partem a terra com magma negro enquanto relâmpagos escuros aniquilam os alvos.',
        maxLevel: 5,
        damage: 170,
        cooldown: 1.35,
        area: 1.6,
        count: 1,
        levelsConfig: [
          { damage: 170, cooldown: 1.35, description: 'Impacto sísmico abissal + 4 Relâmpagos de plasma sombrio.' },
          { damage: 220, area: 1.9, description: 'Dano: 170 → 220 | +30% Área Sísmica' },
          { cooldown: 1.15, description: 'Recarga: 1.35s → 1.15s' },
          { damage: 290, area: 2.3, description: 'Dano: 220 → 290 | 6 Relâmpagos Sombrios' },
          { damage: 410, cooldown: 0.9, description: 'PODER MÁXIMO: Cataclismo Cósmico Total!' }
        ]
      });
      this.slashEffects = [];
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const reach = 105 * this.area * player.areaMultiplier;
      const angle = player.facingAngle !== undefined ? player.facingAngle : 0;

      // Colossal dark slash wave
      this.slashEffects.push({
        x: player.x,
        y: player.y,
        angle: angle,
        radius: reach,
        duration: 0.25,
        maxDuration: 0.25,
        isEvolved: true,
        isSupreme: true,
        player: player
      });

      for (let i = 0, len = enemies.length; i < len; i++) {
        const e = enemies[i];
        if (!e.alive) continue;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        if (dx * dx + dy * dy <= reach * reach) {
          const dealt = e.takeDamage(effectiveDamage, Math.cos(angle) * 35, Math.sin(angle) * 35, 0.3);
          this.totalDamageDealt += dealt;
        }
      }

      // 4 Dark Thunder Strikes from heavens
      for (let t = 0; t < 4; t++) {
        const randE = enemies[Math.floor(Math.random() * enemies.length)];
        const strikeX = randE ? randE.x : player.x + (Math.random() - 0.5) * 180;
        const strikeY = randE ? randE.y : player.y + (Math.random() - 0.5) * 180;

        projectiles.push(new ThunderStrike({
          x: strikeX,
          y: strikeY,
          radius: 45 * this.area * player.areaMultiplier,
          damage: Math.round(effectiveDamage * 0.65),
          isEvolved: true,
          weapon: this
        }));
      }
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
        if (s.duration <= 0) this.slashEffects.splice(i, 1);
      }
    }
  }

  // 9. Peste Negra Contagiosa
  class SupremeBlackDeathWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_black_death',
        name: 'Peste Negra Contagiosa',
        icon: '☣️🐍',
        description: 'Biotoxina viral incontrolável que se propaga de monstro em monstro em efeito dominó.',
        maxLevel: 5,
        damage: 38,
        cooldown: 0.7,
        area: 1.5,
        count: 6,
        speed: 780,
        levelsConfig: [
          { damage: 38, cooldown: 0.7, count: 6, description: 'Rajada de 6 dardos biovirais que criam nuvens de peste transmissível.' },
          { damage: 52, count: 8, description: 'Dano: 38 → 52 | Dardos: 6 → 8' },
          { cooldown: 0.55, description: 'Recarga: 0.7s → 0.55s' },
          { damage: 72, area: 1.8, description: 'Dano: 52 → 72 | +30% Raio de Contágio' },
          { damage: 115, count: 12, cooldown: 0.4, description: 'PODER MÁXIMO: Apocalipse Viral Incessante!' }
        ]
      });
    }

    attack(player, enemies, projectiles, particles) {
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const totalDarts = this.count + (player.bonusProjectiles || 0);
      const baseAngle = player.facingAngle !== undefined ? player.facingAngle : 0;

      for (let i = 0; i < totalDarts; i++) {
        const spread = (i - (totalDarts - 1) / 2) * 0.14;
        projectiles.push(new ViperDart({
          x: player.x,
          y: player.y,
          angle: baseAngle + spread,
          damage: effectiveDamage,
          speed: this.baseSpeed,
          isEvolved: true,
          weapon: this
        }));
      }

      // Drop Caustic Plague Pool at player feet
      projectiles.push(new PlagueFlask({
        startX: player.x,
        startY: player.y,
        targetX: player.x + (Math.random() - 0.5) * 60,
        targetY: player.y + (Math.random() - 0.5) * 60,
        damage: Math.round(effectiveDamage * 1.2),
        poolRadius: 48 * this.area * player.areaMultiplier,
        duration: 5.0,
        isEvolved: true,
        weapon: this
      }));
    }
  }

  // 10. Cometa da Geada Estelar
  class SupremeStellarFrostWeapon extends BaseWeapon {
    constructor() {
      super({
        id: 'supreme_stellar_frost',
        name: 'Cometa da Geada Estelar',
        icon: '❄️🌙',
        description: 'Lâminas de gelo lunar cósmico que ricocheteiam até 12 vezes e congelam inimigos em estátuas de gelo.',
        maxLevel: 5,
        damage: 80,
        cooldown: 0.95,
        area: 1.5,
        count: 3,
        speed: 560,
        levelsConfig: [
          { damage: 80, count: 3, description: '3 Glaives de gelo estelar com até 12 ricochetes e congelamento total.' },
          { damage: 105, count: 4, description: 'Dano: 80 → 105 | Glaives: 3 → 4' },
          { cooldown: 0.8, description: 'Recarga: 0.95s → 0.8s' },
          { damage: 145, count: 5, description: 'Dano: 105 → 145 | Glaives: 4 → 5' },
          { damage: 210, count: 6, cooldown: 0.65, description: 'PODER MÁXIMO: Era Glacial Cósmica Permanente!' }
        ]
      });
    }

    attack(player, enemies, projectiles, particles) {
      if (enemies.length === 0) return;
      const effectiveDamage = Math.round(this.damage * player.damageMultiplier);
      const totalGlaives = this.count + (player.bonusProjectiles || 0);

      for (let i = 0; i < totalGlaives; i++) {
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        if (!target) continue;

        const angle = Math.atan2(target.y - player.y, target.x - player.x) + (i - (totalGlaives - 1) / 2) * 0.25;

        projectiles.push(new CelestialGlaive({
          x: player.x,
          y: player.y,
          angle: angle,
          damage: effectiveDamage,
          speed: this.baseSpeed,
          maxBounces: 12,
          isEvolved: true,
          weapon: this
        }));
      }
    }
  }

  // ========================================================
  // SYNERGY SYSTEM API
  // ========================================================
  const SynergySystem = {
    WEAPON_FUSIONS,
    WEAPON_PASSIVE_ASCENSIONS,

    getAllFusions() {
      return WEAPON_FUSIONS;
    },

    getAllAscensions() {
      return WEAPON_PASSIVE_ASCENSIONS;
    },

    getFusionById(id) {
      return WEAPON_FUSIONS.find(f => f.id === id || f.supremeWeaponId === id);
    },

    // Check if player has weapons ready to be fused
    getAvailableFusions(player) {
      if (!player || !player.weapons) return [];
      const weaponMap = new Map();
      player.weapons.forEach(w => weaponMap.set(w.id, w));

      const ready = [];
      for (let i = 0; i < WEAPON_FUSIONS.length; i++) {
        const fusion = WEAPON_FUSIONS[i];
        const w1 = weaponMap.get(fusion.item1.id);
        const w2 = weaponMap.get(fusion.item2.id);

        // Both weapons must be level 8 (max)
        if (w1 && w2 && w1.level >= fusion.item1.minLevel && w2.level >= fusion.item2.minLevel) {
          // Check if player doesn't already have this supreme weapon
          if (!weaponMap.has(fusion.supremeWeaponId)) {
            ready.push(fusion);
          }
        }
      }
      return ready;
    },

    // Check if player has weapon ready for passive ascension
    getAvailableAscensions(player) {
      if (!player || !player.weapons || !player.passives) return [];
      const ready = [];
      for (let i = 0; i < WEAPON_PASSIVE_ASCENSIONS.length; i++) {
        const asc = WEAPON_PASSIVE_ASCENSIONS[i];
        const wep = player.weapons.find(w => w.id === asc.weaponId);
        const hasPassive = player.passives.has(asc.passiveId);

        if (wep && wep.level >= 8 && hasPassive && !wep.hasAscended) {
          ready.push(asc);
        }
      }
      return ready;
    },

    // Execute the fusion: replaces both weapons with the Supreme Weapon!
    executeFusion(player, fusionId) {
      const fusion = this.getFusionById(fusionId);
      if (!fusion || !player) return null;

      // 1. Remove Component Weapons from player
      player.weapons = player.weapons.filter(w => w.id !== fusion.item1.id && w.id !== fusion.item2.id);

      // 2. Instantiate and add Supreme Weapon
      const supremeWep = window.MedievalSurvivors.weapons.create(fusion.supremeWeaponId);
      if (supremeWep) {
        supremeWep.upgrade(); // Start at Level 1 Supreme
        player.weapons.push(supremeWep);
      }

      // 3. Record discovery in save manager
      if (window.MedievalSurvivors.saveManager) {
        window.MedievalSurvivors.saveManager.discoverSynergy(fusion.id);
        window.MedievalSurvivors.saveManager.checkAchievements('synergy_born', null, window.MedievalSurvivors.game);
      }

      // 4. Play epic sound
      if (window.MedievalSurvivors.sound) {
        window.MedievalSurvivors.sound.playVictory();
      }

      return supremeWep;
    }
  };

  // Export to namespace
  window.MedievalSurvivors.synergies = SynergySystem;

  // Export Supreme Weapon Classes
  window.MedievalSurvivors.SupremeExcaliburWeapon = SupremeExcaliburWeapon;
  window.MedievalSurvivors.SupremeArtilleryCannonWeapon = SupremeArtilleryCannonWeapon;
  window.MedievalSurvivors.SupremePurgatoryFireWeapon = SupremePurgatoryFireWeapon;
  window.MedievalSurvivors.SupremeTitanStormWeapon = SupremeTitanStormWeapon;
  window.MedievalSurvivors.SupremeCelestialFortressWeapon = SupremeCelestialFortressWeapon;
  window.MedievalSurvivors.SupremeSoulSingularityWeapon = SupremeSoulSingularityWeapon;
  window.MedievalSurvivors.SupremeBloodDanceWeapon = SupremeBloodDanceWeapon;
  window.MedievalSurvivors.SupremeCataclysmBreakerWeapon = SupremeCataclysmBreakerWeapon;
  window.MedievalSurvivors.SupremeBlackDeathWeapon = SupremeBlackDeathWeapon;
  window.MedievalSurvivors.SupremeStellarFrostWeapon = SupremeStellarFrostWeapon;
})();


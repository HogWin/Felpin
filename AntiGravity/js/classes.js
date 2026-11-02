"use strict";
class ClassRegistry {
  constructor() {
    this.classes = /* @__PURE__ */ new Map();
    this.defaultClassId = "knight";
    this.initDefaultClasses();
  }
  registerClass(config) {
    if (!config.id) throw new Error("A classe precisa ter um 'id' exclusivo.");
    this.classes.set(config.id, {
      id: config.id,
      name: config.name || "Guerreiro Desconhecido",
      subtitle: config.subtitle || "Combatente Medieval",
      icon: window.MedievalIcons && window.MedievalIcons.get(config.id) || config.icon || "⚔️",
      description: config.description || "Um valente guerreiro pronto para a batalha.",
      unlocked: config.unlocked !== void 0 ? config.unlocked : false,
      unlockAchievementId: config.unlockAchievementId || null,
      unlockHint: config.unlockHint || "Desbloqueie através de feitos heróicos.",
      startingWeapon: config.startingWeapon || "broadsword",
      color: config.color || "#f0c05a",
      accentColor: config.accentColor || "#a81923",
      stats: {
        maxHp: config.stats?.maxHp ?? 120,
        armor: config.stats?.armor ?? 2,
        moveSpeed: config.stats?.moveSpeed ?? 3,
        damageMultiplier: config.stats?.damageMultiplier ?? 1.15,
        cooldownMultiplier: config.stats?.cooldownMultiplier ?? 1,
        areaMultiplier: config.stats?.areaMultiplier ?? 1.1,
        pickupRadius: config.stats?.pickupRadius ?? 85,
        hpRegen: config.stats?.hpRegen ?? 0.2
      },
      perkDesc: config.perkDesc || "Alta vitalidade e armadura pesada resistente."
    });
  }
  getClass(id) {
    return this.classes.get(id) || this.classes.get(this.defaultClassId);
  }
  getAllClasses() {
    return Array.from(this.classes.values());
  }
  initDefaultClasses() {
    this.registerClass({
      id: "knight",
      name: "Cavaleiro Real",
      subtitle: "Guardião da Cidadela",
      icon: "🛡️",
      description: "Treinado nas artes da espada e forjado em armadura pesada. Excelente sobrevivência e ataques devastadores em curta distância.",
      unlocked: true,
      unlockAchievementId: null,
      unlockHint: "Linhagem inicial de Valoria (Disponível desde o início)",
      startingWeapon: "broadsword",
      color: "#d4af37",
      accentColor: "#9b111e",
      stats: {
        maxHp: 120,
        armor: 2,
        moveSpeed: 3.1,
        damageMultiplier: 1.25,
        cooldownMultiplier: 1,
        areaMultiplier: 1.05,
        pickupRadius: 90,
        hpRegen: 0.3
      },
      perkDesc: "+20 Max HP, +2 Armadura, +5% Área e Dano com Espadas."
    });
    this.registerClass({
      id: "ranger",
      name: "Arqueira das Sombras",
      subtitle: "Patrulheira dos Bosques Malditos",
      icon: "🏹",
      description: "Ágil e veloz, desfere disparos precisos de longa distância antes que as hordas se aproximem.",
      unlocked: false,
      unlockAchievementId: "unlock_ranger",
      unlockHint: "Conquista [Olhos de Falcão]: Elimine 250 monstros com armas à distância",
      startingWeapon: "crossbow",
      color: "#2ecc71",
      accentColor: "#27ae60",
      stats: {
        maxHp: 90,
        armor: 0,
        moveSpeed: 3.25,
        // Reduzido de 3.8 para 3.25 para equilíbrio tático
        damageMultiplier: 1.05,
        cooldownMultiplier: 0.9,
        areaMultiplier: 1,
        pickupRadius: 110,
        hpRegen: 0.1
      },
      perkDesc: "+10% Vel. Movimento, -10% Cooldown, maior raio de coleta de XP."
    });
    this.registerClass({
      id: "pyromancer",
      name: "Feiticeiro das Cinzas",
      subtitle: "Mestre da Chama Purificadora",
      icon: "🔥",
      description: "Manipulador de elementos destrutivos. Sacrifica defesa física em prol de bombardeios incendiários de grande impacto.",
      unlocked: false,
      unlockAchievementId: "unlock_pyromancer",
      unlockHint: "Conquista [Chama Arcana]: Colete 350 gemas de experiência em uma partida",
      startingWeapon: "holy_fire",
      color: "#e67e22",
      accentColor: "#c0392b",
      stats: {
        maxHp: 80,
        armor: 0,
        moveSpeed: 3.2,
        damageMultiplier: 1.3,
        cooldownMultiplier: 0.85,
        areaMultiplier: 1.15,
        pickupRadius: 95,
        hpRegen: 0
      },
      perkDesc: "+30% Dano Mágico, +15% Área de Efeito, -15% Cooldown."
    });
    this.registerClass({
      id: "paladin",
      name: "Paladino da Alvorada",
      subtitle: "Campeão da Luz Sagrada",
      icon: "✨",
      description: "Canaliza poder divino em uma aura que vaporiza os mortos-vivos e abençoa a terra por onde caminha.",
      unlocked: false,
      unlockAchievementId: "sanctuary_consecration",
      unlockHint: "Conquista [Bênção dos Ancestrais]: Consagre 1 Santuário Divino na Arena",
      startingWeapon: "holy_aura",
      color: "#f39c12",
      accentColor: "#3498db",
      stats: {
        maxHp: 135,
        armor: 3,
        moveSpeed: 2.9,
        damageMultiplier: 1,
        cooldownMultiplier: 1.05,
        areaMultiplier: 1.1,
        pickupRadius: 100,
        hpRegen: 0.6
      },
      perkDesc: "+35 Max HP, +3 Armadura, +0.6 Regen/s, inicia com Aura Sagrada."
    });
    this.registerClass({
      id: "berserker",
      name: "Berserker do Norte",
      subtitle: "Colosso das Montanhas Geladas",
      icon: "🪓",
      description: "Guerreiro bárbaro implacável. Seus machados giratórios retalham à distância e sua fúria sangrenta o torna exponencialmente mais rápido e letal conforme perde vida.",
      unlocked: false,
      unlockAchievementId: "executioner_slayer",
      unlockHint: "Conquista [O Fim do Carrasco]: Derrote o Carrasco Carmesim nas catacumbas",
      startingWeapon: "whirling_axes",
      color: "#e67e22",
      accentColor: "#c0392b",
      stats: {
        maxHp: 140,
        armor: 0,
        moveSpeed: 3.3,
        damageMultiplier: 1.35,
        cooldownMultiplier: 0.95,
        areaMultiplier: 1.08,
        pickupRadius: 90,
        hpRegen: 0.1
      },
      perkDesc: "Fúria Sangrenta: Ganha até +60% Dano e +35% Cadência conforme sua vida cai."
    });
    this.registerClass({
      id: "necromancer",
      name: "Necromante das Catacumbas",
      subtitle: "Senhor das Almas Perdidas",
      icon: "💀",
      description: "Mestre das artes proibidas. Lança orbes de almas teleguiados e ergue os ossos dos inimigos caídos para lutarem ao seu lado como servos leais.",
      unlocked: false,
      unlockAchievementId: "unlock_necromancer",
      unlockHint: "Conquista [Pacto com as Sombras]: Sobreviva 3 minutos sob o efeito de Maldição",
      startingWeapon: "spectral_orb",
      color: "#9b59b6",
      accentColor: "#4834d4",
      stats: {
        maxHp: 85,
        armor: 0,
        moveSpeed: 3.1,
        damageMultiplier: 1.15,
        cooldownMultiplier: 0.85,
        areaMultiplier: 1.05,
        pickupRadius: 115,
        hpRegen: 0
      },
      perkDesc: "Pacto das Ossadas: A cada 12 monstros derrotados, invoca um Esqueleto Guardião aliado para lutar."
    });
    this.registerClass({
      id: "assassin",
      name: "Assassino Sombrio",
      subtitle: "Lâmina Fantasma das Catacumbas",
      icon: "🗡️",
      description: "Rápido como o vento e cirúrgico em cada golpe. Suas adagas gêmeas desferem acertos críticos devastadores que concedem rajadas de velocidade extrema.",
      unlocked: false,
      unlockAchievementId: "horde_500",
      unlockHint: "Conquista [Flagelo das Trevas]: Elimine 500 monstros em uma única partida",
      startingWeapon: "twin_daggers",
      color: "#2c3e50",
      accentColor: "#e74c3c",
      stats: {
        maxHp: 90,
        armor: 1,
        moveSpeed: 3.85,
        damageMultiplier: 1.1,
        cooldownMultiplier: 0.8,
        areaMultiplier: 0.95,
        pickupRadius: 95,
        hpRegen: 0.1
      },
      perkDesc: "Execução Sombria: +25% Chance Crítica inata (2.5x dano) e surto de velocidade ao acertar críticos."
    });
    this.registerClass({
      id: "dark_knight",
      name: "Cavaleiro Negro Caído",
      subtitle: "A Muralha de Espinhos Amaldiçoada",
      icon: "🖤",
      description: "Um campeão lendário corrompido pelas trevas. Sua armadura colossal resiste aos piores castigos e retalia contra qualquer inimigo tolo o suficiente para tocá-lo.",
      unlocked: false,
      unlockAchievementId: "golem_crusher",
      unlockHint: "Conquista [Demolidor de Monólitos]: Destrua o colossal Golem de Pedra",
      startingWeapon: "dark_greatsword",
      color: "#1a1a24",
      accentColor: "#e74c3c",
      stats: {
        maxHp: 160,
        armor: 5,
        moveSpeed: 2.75,
        damageMultiplier: 1.25,
        cooldownMultiplier: 1.1,
        areaMultiplier: 1.12,
        pickupRadius: 80,
        hpRegen: 0.4
      },
      perkDesc: "Retaliação de Espinhos: +5 Armadura base. Ao sofrer dano, explode estilhaços de ferro causando 150% de dano refletido em área."
    });
    this.registerClass({
      id: "plague_alchemist",
      name: "Alquimista da Peste",
      subtitle: "Doutor da Máscara de Corvo",
      icon: "🧪",
      description: "Especialista em alquimia negra e substâncias voláteis. Arremessa frascos de ácido corrosivo que criam poças venenosas e contaminam monstros em cadeia.",
      unlocked: false,
      unlockAchievementId: "destructor_25",
      unlockHint: "Conquista [Expurgo de Relíquias]: Destrua 25 caixas, sarcófagos ou vasos",
      startingWeapon: "plague_flask",
      color: "#27ae60",
      accentColor: "#2c3e50",
      stats: {
        maxHp: 105,
        armor: 1,
        moveSpeed: 2.7,
        damageMultiplier: 1.2,
        cooldownMultiplier: 0.95,
        areaMultiplier: 1.15,
        pickupRadius: 100,
        hpRegen: 0.2
      },
      perkDesc: "Contágio Corrosivo: Poças de ácido contínuo; monstros abatidos explodem espalhando ácido aos arredores."
    });
  }
}
window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.classRegistry = new ClassRegistry();

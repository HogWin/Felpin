/**
 * Medieval Survivors - Character Class System
 * Designed for easy extensibility: Registering a new class only takes a single data object.
 */
class ClassRegistry {
  constructor() {
    this.classes = new Map();
    this.defaultClassId = 'knight';
    this.initDefaultClasses();
  }

  registerClass(config) {
    if (!config.id) throw new Error("A classe precisa ter um 'id' exclusivo.");
    this.classes.set(config.id, {
      id: config.id,
      name: config.name || "Guerreiro Desconhecido",
      subtitle: config.subtitle || "Combatente Medieval",
      icon: config.icon || "⚔️",
      description: config.description || "Um valente guerreiro pronto para a batalha.",
      unlocked: config.unlocked !== undefined ? config.unlocked : false,
      startingWeapon: config.startingWeapon || 'broadsword',
      color: config.color || '#f0c05a',
      accentColor: config.accentColor || '#a81923',
      stats: {
        maxHp: config.stats?.maxHp ?? 120,
        armor: config.stats?.armor ?? 2,
        moveSpeed: config.stats?.moveSpeed ?? 3.0,
        damageMultiplier: config.stats?.damageMultiplier ?? 1.15,
        cooldownMultiplier: config.stats?.cooldownMultiplier ?? 1.0,
        areaMultiplier: config.stats?.areaMultiplier ?? 1.1,
        pickupRadius: config.stats?.pickupRadius ?? 85,
        hpRegen: config.stats?.hpRegen ?? 0.2,
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
    // CLASSE 1 (PADRÃO PRINCIPAL): Cavaleiro Real
    this.registerClass({
      id: 'knight',
      name: 'Cavaleiro Real',
      subtitle: 'Guardião da Cidadela',
      icon: '🛡️',
      description: 'Treinado nas artes da espada e forjado em armadura pesada. Excelente sobrevivência e ataques devastadores em curta distância.',
      unlocked: true,
      startingWeapon: 'broadsword',
      color: '#d4af37',
      accentColor: '#9b111e',
      stats: {
        maxHp: 120,
        armor: 2,
        moveSpeed: 3.1,
        damageMultiplier: 1.15,
        cooldownMultiplier: 1.0,
        areaMultiplier: 1.15,
        pickupRadius: 90,
        hpRegen: 0.3
      },
      perkDesc: '+20 Max HP, +2 Armadura, +15% Área e Dano com Espadas.'
    });

    // CLASSE 2 (FUTURA / EXPANSÍVEL): Arqueira da Floresta Sombria
    this.registerClass({
      id: 'ranger',
      name: 'Arqueira das Sombras',
      subtitle: 'Patrulheira dos Bosques Malditos',
      icon: '🏹',
      description: 'Ágil e veloz, desfere disparos precisos de longa distância antes que as hordas se aproximem.',
      unlocked: true, // Disponível para teste ou desbloqueio
      startingWeapon: 'crossbow',
      color: '#2ecc71',
      accentColor: '#27ae60',
      stats: {
        maxHp: 90,
        armor: 0,
        moveSpeed: 3.8,
        damageMultiplier: 1.05,
        cooldownMultiplier: 0.9,
        areaMultiplier: 1.0,
        pickupRadius: 110,
        hpRegen: 0.1
      },
      perkDesc: '+25% Vel. Movimento, -10% Cooldown, maior raio de coleta de XP.'
    });

    // CLASSE 3 (FUTURA / EXPANSÍVEL): Feiticeiro do Fogo Arcano
    this.registerClass({
      id: 'pyromancer',
      name: 'Feiticeiro das Cinzas',
      subtitle: 'Mestre da Chama Purificadora',
      icon: '🔥',
      description: 'Manipulador de elementos destrutivos. Sacrifica defesa física em prol de bombardeios incendiários de grande impacto.',
      unlocked: true,
      startingWeapon: 'holy_fire',
      color: '#e67e22',
      accentColor: '#c0392b',
      stats: {
        maxHp: 80,
        armor: 0,
        moveSpeed: 3.2,
        damageMultiplier: 1.3,
        cooldownMultiplier: 0.85,
        areaMultiplier: 1.35,
        pickupRadius: 95,
        hpRegen: 0.0
      },
      perkDesc: '+30% Dano Mágico, +35% Área de Efeito, -15% Cooldown.'
    });

    // CLASSE 4 (FUTURA / EXPANSÍVEL): Paladino da Alvorada
    this.registerClass({
      id: 'paladin',
      name: 'Paladino da Alvorada',
      subtitle: 'Campeão da Luz Sagrada',
      icon: '✨',
      description: 'Canaliza poder divino em uma aura que vaporiza os mortos-vivos e abençoa a terra por onde caminha.',
      unlocked: true,
      startingWeapon: 'holy_aura',
      color: '#f39c12',
      accentColor: '#3498db',
      stats: {
        maxHp: 135,
        armor: 3,
        moveSpeed: 2.9,
        damageMultiplier: 1.0,
        cooldownMultiplier: 1.05,
        areaMultiplier: 1.25,
        pickupRadius: 100,
        hpRegen: 0.6
      },
      perkDesc: '+35 Max HP, +3 Armadura, +0.6 Regen/s, inicia com Aura Sagrada.'
    });
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.classRegistry = new ClassRegistry();

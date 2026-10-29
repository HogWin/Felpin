/**
 * Medieval Survivors - Passive Stats Upgrade System
 * Enhances standard player statistics upon leveling up.
 */
class PassiveRegistry {
  constructor() {
    this.definitions = new Map();
    this.initPassives();
  }

  register(def) {
    this.definitions.set(def.id, def);
  }

  get(id) {
    return this.definitions.get(id);
  }

  getAll() {
    return Array.from(this.definitions.values());
  }

  initPassives() {
    // 1. Armadura de Placas
    this.register({
      id: 'passive_armor',
      name: 'Armadura de Placas',
      icon: '🛡️',
      maxLevel: 5,
      description: 'Reforça as proteções de aço temperado, reduzindo todo dano recebido.',
      getStatDesc: (lvl) => `Redução de dano: +${lvl} de armadura.`,
      getNextLevelDiff: (currentLvl) => {
        return `Armadura: +${currentLvl} ➔ +${currentLvl + 1}`;
      },
      apply: (player, lvl) => {
        player.bonusArmor = lvl * 1.5;
      }
    });

    // 2. Botas Aladas
    this.register({
      id: 'passive_speed',
      name: 'Botas Aladas',
      icon: '🥾',
      maxLevel: 5,
      description: 'Calçados abençoados que concedem passos leves e rápidos para escapar de cercos.',
      getStatDesc: (lvl) => `Velocidade de movimento: +${lvl * 10}%.`,
      getNextLevelDiff: (currentLvl) => {
        return `Velocidade: +${currentLvl * 10}% ➔ +${(currentLvl + 1) * 10}%`;
      },
      apply: (player, lvl) => {
        player.speedMultiplier = 1.0 + (lvl * 0.10);
      }
    });

    // 3. Coração de Ferro
    this.register({
      id: 'passive_maxhp',
      name: 'Coração de Ferro',
      icon: '❤️',
      maxLevel: 5,
      description: 'Aumenta a vitalidade máxima e restaura 25% de vida instantaneamente ao obter.',
      getStatDesc: (lvl) => `Vida máxima: +${lvl * 25} HP.`,
      getNextLevelDiff: (currentLvl) => {
        return `Max HP: +${currentLvl * 25} ➔ +${(currentLvl + 1) * 25}`;
      },
      apply: (player, lvl) => {
        const oldBonus = (lvl - 1) * 25;
        const newBonus = lvl * 25;
        player.bonusMaxHp = newBonus;
        player.maxHp = player.baseMaxHp + player.bonusMaxHp;
        // Restaura uma porção da vida no upgrade
        const heal = (player.maxHp * 0.25);
        player.hp = Math.min(player.maxHp, player.hp + heal);
      }
    });

    // 4. Ímã Arcano de Relíquias
    this.register({
      id: 'passive_magnet',
      name: 'Ímã de Relíquias',
      icon: '🧲',
      maxLevel: 5,
      description: 'Uma pedra magnética misteriosa que atrai orbes de XP caídos a distâncias muito maiores.',
      getStatDesc: (lvl) => `Raio de atração de XP: +${lvl * 35}%.`,
      getNextLevelDiff: (currentLvl) => {
        return `Raio de Coleta: +${currentLvl * 35}% ➔ +${(currentLvl + 1) * 35}%`;
      },
      apply: (player, lvl) => {
        player.magnetMultiplier = 1.0 + (lvl * 0.35);
      }
    });

    // 5. Amuleto de Vitalidade
    this.register({
      id: 'passive_regen',
      name: 'Amuleto de Vitalidade',
      icon: '🩸',
      maxLevel: 5,
      description: 'Canaliza pulsações revigorantes que restauram a vitalidade com o passar dos segundos.',
      getStatDesc: (lvl) => `Regeneração de Vida: +${(lvl * 0.5).toFixed(1)} HP/seg.`,
      getNextLevelDiff: (currentLvl) => {
        return `Regeneração: +${(currentLvl * 0.5).toFixed(1)} ➔ +${((currentLvl + 1) * 0.5).toFixed(1)} HP/s`;
      },
      apply: (player, lvl) => {
        player.bonusHpRegen = lvl * 0.5;
      }
    });

    // 6. Tomo da Aceleração
    this.register({
      id: 'passive_cooldown',
      name: 'Tomo da Aceleração',
      icon: '📖',
      maxLevel: 5,
      description: 'Manuscrito ancestral contendo técnicas de ataque rápido, reduzindo o tempo de recarga de todas as armas.',
      getStatDesc: (lvl) => `Recarga de armas: -${lvl * 8}%.`,
      getNextLevelDiff: (currentLvl) => {
        return `Tempo de Recarga: -${currentLvl * 8}% ➔ -${(currentLvl + 1) * 8}%`;
      },
      apply: (player, lvl) => {
        player.cooldownReduction = lvl * 0.08;
      }
    });

    // 7. Manopla de Poder Titânico
    this.register({
      id: 'passive_damage',
      name: 'Manopla de Titã',
      icon: '🥊',
      maxLevel: 5,
      description: 'Empunhadura pesada que amplifica a força de impacto de todos os ataques.',
      getStatDesc: (lvl) => `Dano global: +${lvl * 12}%.`,
      getNextLevelDiff: (currentLvl) => {
        return `Dano Global: +${currentLvl * 12}% ➔ +${(currentLvl + 1) * 12}%`;
      },
      apply: (player, lvl) => {
        player.bonusDamageMultiplier = lvl * 0.12;
      }
    });

    // 8. Estandarte de Alcance
    this.register({
      id: 'passive_area',
      name: 'Estandarte de Alcance',
      icon: '🚩',
      maxLevel: 5,
      description: 'Estende o raio de alcance, tamanho das lâminas e explosões de todas as armas.',
      getStatDesc: (lvl) => `Área de efeito: +${lvl * 15}%.`,
      getNextLevelDiff: (currentLvl) => {
        return `Área de Efeito: +${currentLvl * 15}% ➔ +${(currentLvl + 1) * 15}%`;
      },
      apply: (player, lvl) => {
        player.bonusAreaMultiplier = lvl * 0.15;
      }
    });
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.passives = new PassiveRegistry();

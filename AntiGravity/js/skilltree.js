/**
 * The Fallen Kingdom - Árvore de Habilidades & Talentos Ancestrais (Estilo PoE2)
 * Sistema de constelação passiva com nós menores, notáveis e pedras angulares (keystones).
 * Cada talento custa Ouro e concede bônus permanentes e acumulativos.
 */
(function() {
  'use strict';

  const BRANCH_DEFS = {
    vitality: {
      id: 'vitality',
      name: 'Ramo da Fortaleza',
      subtitle: 'Vitalidade Ancestral, Armadura & Regeneração',
      color: '#e74c3c',
      glow: 'rgba(231, 76, 60, 0.6)',
      icon: 'passive_armor'
    },
    carnage: {
      id: 'carnage',
      name: 'Ramo da Carnificina',
      subtitle: 'Dano Global, Acertos Críticos & Área de Corte',
      color: '#e67e22',
      glow: 'rgba(230, 126, 34, 0.6)',
      icon: 'weapon_broadsword'
    },
    agility: {
      id: 'agility',
      name: 'Ramo da Agilidade',
      subtitle: 'Velocidade de Movimento & Redução de Recarga',
      color: '#2ecc71',
      glow: 'rgba(46, 204, 113, 0.6)',
      icon: 'passive_speed'
    },
    arcane: {
      id: 'arcane',
      name: 'Ramo do Arcano',
      subtitle: 'Ímã de Coleta, Ouro Pilhado & Experiência',
      color: '#3498db',
      glow: 'rgba(52, 152, 219, 0.6)',
      icon: 'passive_magnet'
    }
  };

  const SKILL_TREE_NODES = [
    // ── ORIGEM CENTRAL ──────────────────────────────────────────
    {
      id: 'origin',
      name: 'A Centelha de Valoria',
      branch: 'center',
      tier: 'origin', // 'origin', 'minor', 'notable', 'keystone'
      x: 500,
      y: 500,
      cost: 0,
      reqBranchCount: 0,
      connects: [],
      stats: {},
      statText: 'Ponto focal de onde emanam todos os caminhos do Reino Esquecido.',
      description: 'O despertar do herói nas catacumbas sagradas.'
    },

    // ── RAMO DA FORTALEZA (NORTE - Vermelho / Carmesim) ─────────
    {
      id: 'vit_1',
      name: 'Vigor Inicial',
      branch: 'vitality',
      tier: 'minor',
      x: 500,
      y: 425,
      cost: 40,
      reqBranchCount: 0,
      connects: ['origin'],
      stats: { maxHp: 2 },
      statText: '+2 Vida Máxima',
      description: 'Reforça a resistência vital básica de seu combatente.'
    },
    {
      id: 'vit_2',
      name: 'Placas Forjadas',
      branch: 'vitality',
      tier: 'minor',
      x: 450,
      y: 360,
      cost: 55,
      reqBranchCount: 0,
      connects: ['vit_1'],
      stats: { armor: 0.5 },
      statText: '+0.5 de Armadura',
      description: 'Aço endurecido reduz danos sofridos de todos os monstros.'
    },
    {
      id: 'vit_3',
      name: 'Pele Escamosa',
      branch: 'vitality',
      tier: 'minor',
      x: 550,
      y: 360,
      cost: 55,
      reqBranchCount: 0,
      connects: ['vit_1'],
      stats: { maxHp: 3 },
      statText: '+3 Vida Máxima',
      description: 'Densidade muscular e couro tratado para suportar mais golpes.'
    },
    {
      id: 'vit_4',
      name: 'Coração Pulsante',
      branch: 'vitality',
      tier: 'minor',
      x: 420,
      y: 290,
      cost: 75,
      reqBranchCount: 0,
      connects: ['vit_2'],
      stats: { hpRegen: 0.2 },
      statText: '+0.2 HP/s Regeneração',
      description: 'Circulação sanguínea acelerada que cicatriza feridas com o tempo.'
    },
    {
      id: 'vit_5',
      name: 'Temperança Marcial',
      branch: 'vitality',
      tier: 'minor',
      x: 580,
      y: 290,
      cost: 75,
      reqBranchCount: 0,
      connects: ['vit_3'],
      stats: { armor: 0.8, maxHp: 2 },
      statText: '+0.8 Armadura & +2 Vida Máx',
      description: 'Treinamento defensivo que combina postura rígida com preparo físico.'
    },
    {
      id: 'vit_notable_1',
      name: 'Baluarte Inabalável',
      branch: 'vitality',
      tier: 'notable',
      x: 500,
      y: 220,
      cost: 260,
      reqBranchCount: 3,
      connects: ['vit_4', 'vit_5'],
      stats: { maxHp: 12, armor: 1.5, hpRegen: 0.4 },
      statText: '+12 Vida Máxima, +1.5 Armadura, +0.4 HP/s',
      description: 'Um escudo impenetrável que resiste mesmo às tempestades das catacumbas.'
    },
    {
      id: 'vit_6',
      name: 'Medula de Carvalho',
      branch: 'vitality',
      tier: 'minor',
      x: 450,
      y: 150,
      cost: 110,
      reqBranchCount: 0,
      connects: ['vit_notable_1'],
      stats: { maxHp: 4 },
      statText: '+4 Vida Máxima',
      description: 'Ossos fortalecidos com essência ancestral da floresta morta.'
    },
    {
      id: 'vit_7',
      name: 'Sangue Revigorado',
      branch: 'vitality',
      tier: 'minor',
      x: 550,
      y: 150,
      cost: 110,
      reqBranchCount: 0,
      connects: ['vit_notable_1'],
      stats: { hpRegen: 0.5 },
      statText: '+0.5 HP/s Regeneração',
      description: 'Purificação celular que fecha cortes profundos constantemente.'
    },
    {
      id: 'vit_keystone',
      name: 'Colosso Indomável',
      branch: 'vitality',
      tier: 'keystone',
      x: 500,
      y: 70,
      cost: 750,
      reqBranchCount: 5,
      connects: ['vit_6', 'vit_7'],
      stats: { maxHp: 30, armor: 3.0, hpRegen: 1.0, colossusPact: true },
      statText: '+30 Vida Máx, +3.0 Armadura, +1.0 HP/s & Pacto do Colosso',
      description: 'PEDRA ANGULAR: Você se torna uma fortaleza viva. Converte 50% de toda sua Armadura em Regeneração adicional permanente de Vida por segundo!'
    },

    // ── RAMO DA CARNIFICINA (LESTE - Laranja / Escarlate) ───────
    {
      id: 'car_1',
      name: 'Fio Navalha',
      branch: 'carnage',
      tier: 'minor',
      x: 575,
      y: 500,
      cost: 40,
      reqBranchCount: 0,
      connects: ['origin'],
      stats: { damageMult: 0.015 },
      statText: '+1.5% Dano Global',
      description: 'Lâminas mais afiadas e golpes desferidos com precisão letal.'
    },
    {
      id: 'car_2',
      name: 'Arco de Corte Amplo',
      branch: 'carnage',
      tier: 'minor',
      x: 640,
      y: 450,
      cost: 55,
      reqBranchCount: 0,
      connects: ['car_1'],
      stats: { areaMult: 0.02 },
      statText: '+2% Área de Efeito',
      description: 'Expande o alcance de corte e a amplitude dos golpes de todas as armas.'
    },
    {
      id: 'car_3',
      name: 'Olho do Predador',
      branch: 'carnage',
      tier: 'minor',
      x: 640,
      y: 550,
      cost: 55,
      reqBranchCount: 0,
      connects: ['car_1'],
      stats: { critChance: 0.01 },
      statText: '+1% Chance de Crítico',
      description: 'Encontra os pontos fracos na carcaça das aberrações.'
    },
    {
      id: 'car_4',
      name: 'Golpe Sísmico',
      branch: 'carnage',
      tier: 'minor',
      x: 710,
      y: 420,
      cost: 75,
      reqBranchCount: 0,
      connects: ['car_2'],
      stats: { damageMult: 0.025 },
      statText: '+2.5% Dano Global',
      description: 'Mais força aplicada no impacto de cada ataque e feitiço.'
    },
    {
      id: 'car_5',
      name: 'Cutilada Dilacerante',
      branch: 'carnage',
      tier: 'minor',
      x: 710,
      y: 580,
      cost: 75,
      reqBranchCount: 0,
      connects: ['car_3'],
      stats: { critDamage: 0.08 },
      statText: '+8% Dano Crítico',
      description: 'Acertos críticos rasgam tendões e causam ferimentos catastróficos.'
    },
    {
      id: 'car_notable_1',
      name: 'Carniceiro de Valoria',
      branch: 'carnage',
      tier: 'notable',
      x: 780,
      y: 500,
      cost: 260,
      reqBranchCount: 3,
      connects: ['car_4', 'car_5'],
      stats: { damageMult: 0.08, critChance: 0.03, areaMult: 0.05 },
      statText: '+8% Dano Global, +3% Crítico, +5% Área',
      description: 'Um veterano banhado em sangue que transforma qualquer arma em instrumento de extermínio em massa.'
    },
    {
      id: 'car_6',
      name: 'Sede Insaciável',
      branch: 'carnage',
      tier: 'minor',
      x: 850,
      y: 450,
      cost: 110,
      reqBranchCount: 0,
      connects: ['car_notable_1'],
      stats: { damageMult: 0.03 },
      statText: '+3% Dano Global',
      description: 'A sede de vingança potencializa cada feitiço, flecha e corte.'
    },
    {
      id: 'car_7',
      name: 'Fratura Óssea',
      branch: 'carnage',
      tier: 'minor',
      x: 850,
      y: 550,
      cost: 110,
      reqBranchCount: 0,
      connects: ['car_notable_1'],
      stats: { critChance: 0.02, critDamage: 0.10 },
      statText: '+2% Crítico & +10% Dano Crítico',
      description: 'Golpes que destroçam a couraça de chefes e esqueletos.'
    },
    {
      id: 'car_keystone',
      name: 'Avatar da Ruína',
      branch: 'carnage',
      tier: 'keystone',
      x: 930,
      y: 500,
      cost: 750,
      reqBranchCount: 5,
      connects: ['car_6', 'car_7'],
      stats: { damageMult: 0.15, critChance: 0.05, shockwaveOnCrit: true },
      statText: '+15% Dano, +5% Crítico & Onda de Choque Sísmica',
      description: 'PEDRA ANGULAR: Cada golpe crítico detona uma onda de choque sísmica em 360°, infligindo dano massivo em todos os monstros ao redor!'
    },

    // ── RAMO DA AGILIDADE (SUL - Verde / Esmeralda) ─────────────
    {
      id: 'agi_1',
      name: 'Passos Curtos',
      branch: 'agility',
      tier: 'minor',
      x: 500,
      y: 575,
      cost: 40,
      reqBranchCount: 0,
      connects: ['origin'],
      stats: { speedMult: 0.01 },
      statText: '+1% Velocidade de Movimento',
      description: 'Leveza nos pés para escapar de cerco sem perder o equilíbrio.'
    },
    {
      id: 'agi_2',
      name: 'Reflexos Apurados',
      branch: 'agility',
      tier: 'minor',
      x: 450,
      y: 640,
      cost: 55,
      reqBranchCount: 0,
      connects: ['agi_1'],
      stats: { speedMult: 0.015 },
      statText: '+1.5% Velocidade de Movimento',
      description: 'Percepção cinética para desviar de garras e flechas no escuro.'
    },
    {
      id: 'agi_3',
      name: 'Tensão Dinâmica',
      branch: 'agility',
      tier: 'minor',
      x: 550,
      y: 640,
      cost: 55,
      reqBranchCount: 0,
      connects: ['agi_1'],
      stats: { cooldownReduc: 0.015 },
      statText: '-1.5% Tempo de Recarga',
      description: 'Golpeia e recarrega armas ligeiramente mais rápido.'
    },
    {
      id: 'agi_4',
      name: 'Passada Fantasma',
      branch: 'agility',
      tier: 'minor',
      x: 420,
      y: 710,
      cost: 75,
      reqBranchCount: 0,
      connects: ['agi_2'],
      stats: { speedMult: 0.02 },
      statText: '+2% Velocidade de Movimento',
      description: 'Movimentos velozes que deixam as hordas para trás.'
    },
    {
      id: 'agi_5',
      name: 'Foco Veloz',
      branch: 'agility',
      tier: 'minor',
      x: 580,
      y: 710,
      cost: 75,
      reqBranchCount: 0,
      connects: ['agi_3'],
      stats: { cooldownReduc: 0.02 },
      statText: '-2% Tempo de Recarga',
      description: 'Ritmo acelerado no manuseio de arcos, adagas e cajados.'
    },
    {
      id: 'agi_notable_1',
      name: 'Vento das Sombras',
      branch: 'agility',
      tier: 'notable',
      x: 500,
      y: 780,
      cost: 260,
      reqBranchCount: 3,
      connects: ['agi_4', 'agi_5'],
      stats: { speedMult: 0.06, cooldownReduc: 0.04 },
      statText: '+6% Velocidade & -4% Tempo de Recarga',
      description: 'Você se move como uma sombra veloz, desferindo saraivadas contínuas.'
    },
    {
      id: 'agi_6',
      name: 'Giro Cadenciado',
      branch: 'agility',
      tier: 'minor',
      x: 450,
      y: 850,
      cost: 110,
      reqBranchCount: 0,
      connects: ['agi_notable_1'],
      stats: { speedMult: 0.025 },
      statText: '+2.5% Velocidade',
      description: 'Agilidade pura que permite transitar entre multidões sem ser tocado.'
    },
    {
      id: 'agi_7',
      name: 'Prontidão de Combate',
      branch: 'agility',
      tier: 'minor',
      x: 550,
      y: 850,
      cost: 110,
      reqBranchCount: 0,
      connects: ['agi_notable_1'],
      stats: { cooldownReduc: 0.03 },
      statText: '-3% Tempo de Recarga',
      description: 'Recuperação imediata após desferir ataques pesados.'
    },
    {
      id: 'agi_keystone',
      name: 'Chuva de Estilhaços',
      branch: 'agility',
      tier: 'keystone',
      x: 500,
      y: 930,
      cost: 750,
      reqBranchCount: 5,
      connects: ['agi_6', 'agi_7'],
      stats: { extraProjectiles: 1, speedMult: 0.05, cooldownReduc: 0.04 },
      statText: '+1 Projétil / Golpe Permanente, +5% Velocidade, -4% Recarga',
      description: 'PEDRA ANGULAR: Multiplica permanentemente o número de disparos e golpes de TODAS as suas armas (+1 Projétil/Golpe Adicional em todo o arsenal)!'
    },

    // ── RAMO DO ARCANO (OESTE - Azul / Safira) ──────────────────
    {
      id: 'arc_1',
      name: 'Atração Magnética',
      branch: 'arcane',
      tier: 'minor',
      x: 425,
      y: 500,
      cost: 40,
      reqBranchCount: 0,
      connects: ['origin'],
      stats: { magnetRadius: 0.03 },
      statText: '+3% Raio de Coleta',
      description: 'Aura arcana que puxa gemas e moedas a distâncias maiores.'
    },
    {
      id: 'arc_2',
      name: 'Olho Dourado',
      branch: 'arcane',
      tier: 'minor',
      x: 360,
      y: 450,
      cost: 55,
      reqBranchCount: 0,
      connects: ['arc_1'],
      stats: { goldMult: 0.02 },
      statText: '+2% Ouro Pilhado',
      description: 'Identifica tesouros ocultos nos corpos e relíquias quebradas.'
    },
    {
      id: 'arc_3',
      name: 'Absorção de Essência',
      branch: 'arcane',
      tier: 'minor',
      x: 360,
      y: 550,
      cost: 55,
      reqBranchCount: 0,
      connects: ['arc_1'],
      stats: { xpMult: 0.02 },
      statText: '+2% Experiência',
      description: 'Canaliza a energia mística liberada pela morte das feras.'
    },
    {
      id: 'arc_4',
      name: 'Vórtice Coletor',
      branch: 'arcane',
      tier: 'minor',
      x: 290,
      y: 420,
      cost: 75,
      reqBranchCount: 0,
      connects: ['arc_2'],
      stats: { magnetRadius: 0.05, goldMult: 0.03 },
      statText: '+5% Raio de Ímã & +3% Ouro',
      description: 'Redemoinho espectral que atrai espólios de guerra sem você precisar parar.'
    },
    {
      id: 'arc_5',
      name: 'Sabedoria Arcana',
      branch: 'arcane',
      tier: 'minor',
      x: 290,
      y: 580,
      cost: 75,
      reqBranchCount: 0,
      connects: ['arc_3'],
      stats: { xpMult: 0.04, damageMult: 0.015 },
      statText: '+4% XP & +1.5% Dano Global',
      description: 'Conhecimento dos antigos grimórios converte experiência em vigor ofensivo.'
    },
    {
      id: 'arc_notable_1',
      name: 'Alquimia dos Sábios',
      branch: 'arcane',
      tier: 'notable',
      x: 220,
      y: 500,
      cost: 260,
      reqBranchCount: 3,
      connects: ['arc_4', 'arc_5'],
      stats: { goldMult: 0.10, xpMult: 0.08, magnetRadius: 0.12, extraRerolls: 1 },
      statText: '+10% Ouro, +8% XP, +12% Ímã & +1 Reroll por run',
      description: 'Transforma matéria densa em ouro puro e concede uma visão superior do destino.'
    },
    {
      id: 'arc_6',
      name: 'Fluxo Estelar',
      branch: 'arcane',
      tier: 'minor',
      x: 150,
      y: 450,
      cost: 110,
      reqBranchCount: 0,
      connects: ['arc_notable_1'],
      stats: { xpMult: 0.05, magnetRadius: 0.06 },
      statText: '+5% XP & +6% Raio de Coleta',
      description: 'Gemas de alma são atraídas com velocidade supersônica.'
    },
    {
      id: 'arc_7',
      name: 'Transmutação Régia',
      branch: 'arcane',
      tier: 'minor',
      x: 150,
      y: 550,
      cost: 110,
      reqBranchCount: 0,
      connects: ['arc_notable_1'],
      stats: { goldMult: 0.08 },
      statText: '+8% Ouro Pilhado',
      description: 'Inimigos soltam moedas adicionais cunhadas pelo antigo império.'
    },
    {
      id: 'arc_keystone',
      name: 'Singularidade Cósmica',
      branch: 'arcane',
      tier: 'keystone',
      x: 70,
      y: 500,
      cost: 750,
      reqBranchCount: 5,
      connects: ['arc_6', 'arc_7'],
      stats: { goldMult: 0.20, xpMult: 0.15, cosmicGems: true },
      statText: '+20% Ouro, +15% XP & Centelha Cósmica em Gemas',
      description: 'PEDRA ANGULAR: Ao absorver gemas de XP, você tem 15% de chance de liberar uma Centelha Estelar explosiva que atordoa inimigos e concede +1 Ouro adicional!'
    }
  ];

  class SkillTreeEngine {
    constructor() {
      this.nodes = SKILL_TREE_NODES;
      this.branches = BRANCH_DEFS;
      this.nodeMap = new Map();
      this.nodes.forEach(n => this.nodeMap.set(n.id, n));
      this.buildAdjacency();
    }

    buildAdjacency() {
      this.adjacency = new Map();
      this.nodes.forEach(n => this.adjacency.set(n.id, new Set()));
      this.nodes.forEach(n => {
        if (n.connects) {
          n.connects.forEach(targetId => {
            if (this.nodeMap.has(targetId)) {
              this.adjacency.get(n.id).add(targetId);
              this.adjacency.get(targetId).add(n.id);
            }
          });
        }
      });
    }

    getNode(id) {
      return this.nodeMap.get(id);
    }

    getAllNodes() {
      return this.nodes;
    }

    /**
     * Retorna a contagem de nós desbloqueados em um ramo específico.
     */
    getBranchAllocatedCount(branchId, allocatedSet) {
      let count = 0;
      this.nodes.forEach(n => {
        if (n.branch === branchId && allocatedSet.has(n.id) && n.id !== 'origin') {
          count++;
        }
      });
      return count;
    }

    /**
     * Verifica se um nó pode ser desbloqueado:
     * 1. Não pode já estar desbloqueado.
     * 2. Deve ter pelo menos um vizinho já desbloqueado (ou ser 'origin').
     * 3. Deve atender ao reqBranchCount (se houver).
     */
    canUnlock(nodeId, allocatedSet) {
      if (allocatedSet.has(nodeId)) return false;
      const node = this.getNode(nodeId);
      if (!node) return false;

      // Verifica conexão com nó vizinho já alocado
      const neighbors = this.adjacency.get(nodeId);
      let hasAllocatedNeighbor = false;
      if (neighbors) {
        for (const neighborId of neighbors) {
          if (allocatedSet.has(neighborId)) {
            hasAllocatedNeighbor = true;
            break;
          }
        }
      }
      if (!hasAllocatedNeighbor && nodeId !== 'origin') return false;

      // Verifica exigência de número de nós no ramo (estilo Notáveis e Keystones de PoE2)
      if (node.reqBranchCount && node.reqBranchCount > 0) {
        const branchCount = this.getBranchAllocatedCount(node.branch, allocatedSet);
        if (branchCount < node.reqBranchCount) return false;
      }

      return true;
    }

    /**
     * Calcula a soma acumulada de todos os atributos dos nós alocados.
     */
    calculateCumulativeBonuses(allocatedArray) {
      const allocatedSet = new Set(allocatedArray || ['origin']);
      const bonuses = {
        maxHp: 0,
        armor: 0,
        damageMult: 0,
        areaMult: 0,
        critChance: 0,
        critDamage: 0,
        speedMult: 0,
        cooldownReduc: 0,
        magnetRadius: 0,
        goldMult: 0,
        xpMult: 0,
        hpRegen: 0,
        extraProjectiles: 0,
        extraRerolls: 0,
        colossusPact: false,
        shockwaveOnCrit: false,
        cosmicGems: false
      };

      allocatedSet.forEach(nodeId => {
        const node = this.getNode(nodeId);
        if (!node || !node.stats) return;
        const s = node.stats;
        if (s.maxHp) bonuses.maxHp += s.maxHp;
        if (s.armor) bonuses.armor += s.armor;
        if (s.damageMult) bonuses.damageMult += s.damageMult;
        if (s.areaMult) bonuses.areaMult += s.areaMult;
        if (s.critChance) bonuses.critChance += s.critChance;
        if (s.critDamage) bonuses.critDamage += s.critDamage;
        if (s.speedMult) bonuses.speedMult += s.speedMult;
        if (s.cooldownReduc) bonuses.cooldownReduc += s.cooldownReduc;
        if (s.magnetRadius) bonuses.magnetRadius += s.magnetRadius;
        if (s.goldMult) bonuses.goldMult += s.goldMult;
        if (s.xpMult) bonuses.xpMult += s.xpMult;
        if (s.hpRegen) bonuses.hpRegen += s.hpRegen;
        if (s.extraProjectiles) bonuses.extraProjectiles += s.extraProjectiles;
        if (s.extraRerolls) bonuses.extraRerolls += s.extraRerolls;
        if (s.colossusPact) bonuses.colossusPact = true;
        if (s.shockwaveOnCrit) bonuses.shockwaveOnCrit = true;
        if (s.cosmicGems) bonuses.cosmicGems = true;
      });

      return bonuses;
    }

    /**
     * Retorna a soma de ouro gasta em todos os nós alocados.
     */
    calculateTotalSpentGold(allocatedArray) {
      let total = 0;
      (allocatedArray || []).forEach(nodeId => {
        const node = this.getNode(nodeId);
        if (node && node.cost) {
          total += node.cost;
        }
      });
      return total;
    }
  }

  window.MedievalSurvivors = window.MedievalSurvivors || {};
  window.MedievalSurvivors.skillTreeEngine = new SkillTreeEngine();
  window.MedievalSurvivors.SKILL_TREE_NODES = SKILL_TREE_NODES;
  window.MedievalSurvivors.SKILL_TREE_BRANCHES = BRANCH_DEFS;
})();


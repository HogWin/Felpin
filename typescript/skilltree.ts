// @ts-nocheck
/**
 * The Fallen Kingdom - Árvores de Habilidades & Talentos Específicas por Personagem
 * Constelações épicas expandidas com nós notáveis, keystones legendárias, atributos específicos
 * de escalonamento por classe, custo gradual em Éter Ancestral e glifos/símbolos visuais.
 */
(function() {
  'use strict';

  const CLASS_SKILL_TREES = {
  "knight": {
    "id": "knight",
    "name": "Cavaleiro Real",
    "subtitle": "Bastião da Cidadela, Armadura Pesada & Maestria com Espadas",
    "icon": "🛡️",
    "color": "#f1c40f",
    "originId": "knight_orig",
    "branches": {
      "fortress": {
        "id": "fortress",
        "name": "Fortaleza de Aço",
        "color": "#e74c3c",
        "icon": "🛡️",
        "subtitle": "Armadura Pesada, Espinhos & Redução de Dano"
      },
      "blades": {
        "id": "blades",
        "name": "Esgrima Régia",
        "color": "#f39c12",
        "icon": "⚔️",
        "subtitle": "Dano de Espada, Amplitude de Corte & Crítico"
      },
      "vitality": {
        "id": "vitality",
        "name": "Sangue dos Reis",
        "color": "#c0392b",
        "icon": "❤️",
        "subtitle": "Vida Titânica, Regeneração & Segundo Fôlego"
      },
      "valor": {
        "id": "valor",
        "name": "Baluarte da Honra",
        "color": "#d35400",
        "icon": "👑",
        "subtitle": "Ímã de Ouro, Cooldown & Glória da Coroa"
      }
    },
    "nodes": [
      {
        "id": "knight_orig",
        "classId": "knight",
        "name": "Coração de Aço",
        "branch": "center",
        "tier": "origin",
        "x": 900,
        "y": 900,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "icon": "👑",
        "badge": "ORIGEM",
        "statText": "Centelha da Constelação de Cavaleiro Real",
        "description": "O juramento sagrado do Cavaleiro de Valoria: proteger os indefesos com escudo inquebrável e lâmina nobre."
      },
      {
        "id": "knight_fort_1",
        "classId": "knight",
        "name": "Placas Reforçadas",
        "branch": "fortress",
        "tier": "minor",
        "x": 900,
        "y": 780,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "armor": 1.5
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+1.5 Armadura",
        "description": "Forja básica de aço nobre para mitigar impactos."
      },
      {
        "id": "knight_fort_2",
        "classId": "knight",
        "name": "Malha Entrelaçada",
        "branch": "fortress",
        "tier": "minor",
        "x": 840,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_1"
        ],
        "stats": {
          "armor": 1,
          "maxHp": 20
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+1.0 Armadura, +20 HP Máximo",
        "description": "Malha fina de aço absorve ferimentos graves."
      },
      {
        "id": "knight_fort_3",
        "classId": "knight",
        "name": "Guarda Sagrada",
        "branch": "fortress",
        "tier": "minor",
        "x": 960,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_1"
        ],
        "stats": {
          "maxHp": 30,
          "hpRegen": 0.4
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+30 HP Máximo, +0.4 HP Regen/s",
        "description": "Fé ancestral concedendo resistência física."
      },
      {
        "id": "knight_fort_4",
        "classId": "knight",
        "name": "Carapaça Gótica",
        "branch": "fortress",
        "tier": "minor",
        "x": 800,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_2"
        ],
        "stats": {
          "armor": 2,
          "maxHp": 25
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+2.0 Armadura, +25 HP Máximo",
        "description": "Placas caneladas desenhadas para desviar estilhaços."
      },
      {
        "id": "knight_fort_5",
        "classId": "knight",
        "name": "Espinhos de Ferro",
        "branch": "fortress",
        "tier": "minor",
        "x": 1000,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_3"
        ],
        "stats": {
          "thornsReflection": 20,
          "armor": 1.5
        },
        "icon": "🌵",
        "badge": "RETALIAÇÃO",
        "statText": "+20 Retaliação de Espinhos, +1.5 Armadura",
        "description": "Cravos forjados que ferem monstros ao atacarem o cavaleiro."
      },
      {
        "id": "knight_fort_not",
        "classId": "knight",
        "name": "Bastião Impenetrável",
        "branch": "fortress",
        "tier": "notable",
        "x": 900,
        "y": 560,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "knight_fort_4",
          "knight_fort_5"
        ],
        "stats": {
          "armor": 4,
          "maxHp": 60,
          "thornsReflection": 25
        },
        "icon": "🛡️",
        "badge": "NOTÁVEL",
        "statText": "+4.0 Armadura, +60 HP Máx, +25 Espinhos",
        "description": "NOTÁVEL: Uma muralha viva capaz de suportar as investidas dos maiores colossos."
      },
      {
        "id": "knight_fort_6",
        "classId": "knight",
        "name": "Muralha dos Reis",
        "branch": "fortress",
        "tier": "minor",
        "x": 860,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_fort_not"
        ],
        "stats": {
          "armor": 3.5,
          "maxHp": 50
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+3.5 Armadura, +50 HP Máximo",
        "description": "Camada dupla de couraça dos campeões de Valoria."
      },
      {
        "id": "knight_fort_7",
        "classId": "knight",
        "name": "Armadura Punitiva",
        "branch": "fortress",
        "tier": "minor",
        "x": 940,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_fort_not"
        ],
        "stats": {
          "thornsReflection": 45,
          "armor": 2.5
        },
        "icon": "🌵",
        "badge": "RETALIAÇÃO",
        "statText": "+45 Retaliação de Espinhos, +2.5 Armadura",
        "description": "Contra-ataque cortante automático em cada golpe sofrido."
      },
      {
        "id": "knight_fort_key",
        "classId": "knight",
        "name": "Bastião Colossal",
        "branch": "fortress",
        "tier": "keystone",
        "x": 900,
        "y": 340,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "knight_fort_6",
          "knight_fort_7"
        ],
        "stats": {
          "armor": 8,
          "maxHp": 120,
          "colossusPact": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+8 Armadura, +120 HP, Pacto do Colosso",
        "description": "PEDRA ANGULAR: Converte 50% de toda a sua Armadura em regeneração contínua de HP por segundo!"
      },
      {
        "id": "knight_blad_1",
        "classId": "knight",
        "name": "Lâmina Afiada",
        "branch": "blades",
        "tier": "minor",
        "x": 1020,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "swordBoost": 0.12,
          "damageMult": 0.05
        },
        "icon": "⚔️",
        "badge": "ESGRIMA",
        "statText": "+12% Dano de Espadas, +5% Dano Geral",
        "description": "Afiação esmerilhada em pedra de amolar de alta qualidade."
      },
      {
        "id": "knight_blad_2",
        "classId": "knight",
        "name": "Arco Amplo",
        "branch": "blades",
        "tier": "minor",
        "x": 1100,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_blad_1"
        ],
        "stats": {
          "areaMult": 0.18
        },
        "icon": "💥",
        "badge": "AMPLITUDE",
        "statText": "+18% Área de Corte da Espada",
        "description": "Varredura circular que alcança hordas mais distantes."
      },
      {
        "id": "knight_blad_3",
        "classId": "knight",
        "name": "Peso do Aço",
        "branch": "blades",
        "tier": "minor",
        "x": 1100,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_blad_1"
        ],
        "stats": {
          "critChance": 0.06,
          "damageMult": 0.08
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+6% Chance Crítica, +8% Dano Geral",
        "description": "Golpes certeiros encontram as frestas nas carapaças inimigas."
      },
      {
        "id": "knight_blad_4",
        "classId": "knight",
        "name": "Fissura Cortante",
        "branch": "blades",
        "tier": "minor",
        "x": 1180,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_blad_2"
        ],
        "stats": {
          "areaMult": 0.22,
          "swordBoost": 0.15
        },
        "icon": "💥",
        "badge": "AMPLITUDE",
        "statText": "+22% Área de Corte, +15% Dano de Espadas",
        "description": "O peso da lâmina cria um vácuo destrutivo no ar."
      },
      {
        "id": "knight_blad_5",
        "classId": "knight",
        "name": "Golpe da Ruína",
        "branch": "blades",
        "tier": "minor",
        "x": 1180,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_blad_3"
        ],
        "stats": {
          "critChance": 0.08,
          "critDamage": 0.35
        },
        "icon": "🎯",
        "badge": "LETALIDADE",
        "statText": "+8% Chance Crítica, +35% Dano Crítico",
        "description": "Acertos críticos causam devastação avassaladora."
      },
      {
        "id": "knight_blad_not",
        "classId": "knight",
        "name": "Vendaval de Aço",
        "branch": "blades",
        "tier": "notable",
        "x": 1240,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "knight_blad_4",
          "knight_blad_5"
        ],
        "stats": {
          "areaMult": 0.3,
          "swordBoost": 0.25,
          "critChance": 0.1
        },
        "icon": "⚔️",
        "badge": "NOTÁVEL",
        "statText": "+30% Área, +25% Dano Espada, +10% Crítico",
        "description": "NOTÁVEL: Cada golpe de espada cria vórtices cortantes que fatiam hordas inteiras."
      },
      {
        "id": "knight_blad_6",
        "classId": "knight",
        "name": "Lacerador dos Caídos",
        "branch": "blades",
        "tier": "minor",
        "x": 1340,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_blad_not"
        ],
        "stats": {
          "swordBoost": 0.35,
          "areaMult": 0.2
        },
        "icon": "⚔️",
        "badge": "ESGRIMA",
        "statText": "+35% Dano de Espadas, +20% Área",
        "description": "Maestria nobre em desferir golpes limpos e fatais."
      },
      {
        "id": "knight_blad_7",
        "classId": "knight",
        "name": "Impacto Devastador",
        "branch": "blades",
        "tier": "minor",
        "x": 1340,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_blad_not"
        ],
        "stats": {
          "critChance": 0.12,
          "critDamage": 0.5
        },
        "icon": "🎯",
        "badge": "LETALIDADE",
        "statText": "+12% Chance Crítica, +50% Dano Crítico",
        "description": "Transfixa as carnes pútridas com precisão letal."
      },
      {
        "id": "knight_blad_key",
        "classId": "knight",
        "name": "Fenda Sísmica",
        "branch": "blades",
        "tier": "keystone",
        "x": 1460,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "knight_blad_6",
          "knight_blad_7"
        ],
        "stats": {
          "swordBoost": 0.5,
          "shockwaveOnCrit": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+50% Dano Espada, Ondas de Choque em Críticos",
        "description": "PEDRA ANGULAR: Todo golpe crítico com espada desencadeia uma fenda sísmica com ondas de choque devastadoras!"
      },
      {
        "id": "knight_vit_1",
        "classId": "knight",
        "name": "Sangue Nobre",
        "branch": "vitality",
        "tier": "minor",
        "x": 900,
        "y": 1020,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "maxHp": 30,
          "hpRegen": 0.4
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+30 HP Máximo, +0.4 HP Regen/s",
        "description": "Linhagem real de combatentes imunes à fadiga."
      },
      {
        "id": "knight_vit_2",
        "classId": "knight",
        "name": "Vigor Inquebrável",
        "branch": "vitality",
        "tier": "minor",
        "x": 840,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_vit_1"
        ],
        "stats": {
          "maxHp": 45
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+45 HP Máximo",
        "description": "Corpo esculpido para suportar ferimentos brutais."
      },
      {
        "id": "knight_vit_3",
        "classId": "knight",
        "name": "Regeneração Celular",
        "branch": "vitality",
        "tier": "minor",
        "x": 960,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_vit_1"
        ],
        "stats": {
          "hpRegen": 0.7
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+0.7 HP Regen/s",
        "description": "O sangue fecha cortes superficiais quase instantaneamente."
      },
      {
        "id": "knight_vit_4",
        "classId": "knight",
        "name": "Coração de Titã",
        "branch": "vitality",
        "tier": "minor",
        "x": 800,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_vit_2"
        ],
        "stats": {
          "maxHp": 65,
          "speedMult": 0.05
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+65 HP Máximo, +5% Velocidade",
        "description": "Músculos robustos bombeando energia vital constante."
      },
      {
        "id": "knight_vit_5",
        "classId": "knight",
        "name": "Fôlego Rápido",
        "branch": "vitality",
        "tier": "minor",
        "x": 1000,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_vit_3"
        ],
        "stats": {
          "hpRegen": 1.2,
          "maxHp": 25
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+1.2 HP Regen/s, +25 HP Máximo",
        "description": "Respiração rítmica marcial restaurando as forças."
      },
      {
        "id": "knight_vit_not",
        "classId": "knight",
        "name": "Reserva dos Reis",
        "branch": "vitality",
        "tier": "notable",
        "x": 900,
        "y": 1240,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "knight_vit_4",
          "knight_vit_5"
        ],
        "stats": {
          "maxHp": 110,
          "hpRegen": 1.8
        },
        "icon": "❤️",
        "badge": "NOTÁVEL",
        "statText": "+110 HP Máximo, +1.8 HP Regen/s",
        "description": "NOTÁVEL: Uma fonte inesgotável de vigor vital que mantém o guerreiro sempre de pé."
      },
      {
        "id": "knight_vit_6",
        "classId": "knight",
        "name": "Vitalidade Monolítica",
        "branch": "vitality",
        "tier": "minor",
        "x": 860,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_vit_not"
        ],
        "stats": {
          "maxHp": 140,
          "armor": 1.5
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+140 HP Máximo, +1.5 Armadura",
        "description": "Massa corporal densa e resistente a sangramentos."
      },
      {
        "id": "knight_vit_7",
        "classId": "knight",
        "name": "Regeneração Divina",
        "branch": "vitality",
        "tier": "minor",
        "x": 940,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_vit_not"
        ],
        "stats": {
          "hpRegen": 2.5,
          "maxHp": 60
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+2.5 HP Regen/s, +60 HP Máximo",
        "description": "Bênção viva que regenera ferimentos durante o próprio combate."
      },
      {
        "id": "knight_vit_key",
        "classId": "knight",
        "name": "Segundo Fôlego Régio",
        "branch": "vitality",
        "tier": "keystone",
        "x": 900,
        "y": 1460,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "knight_vit_6",
          "knight_vit_7"
        ],
        "stats": {
          "maxHp": 220,
          "hpRegen": 4
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+220 HP Máximo, +4.0 HP Regen/s",
        "description": "PEDRA ANGULAR: Saúde titanicamente inabalável capaz de regenerar mesmo sob chuvas incessantes de golpes!"
      },
      {
        "id": "knight_val_1",
        "classId": "knight",
        "name": "Vontade de Ferro",
        "branch": "valor",
        "tier": "minor",
        "x": 780,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "armor": 1,
          "damageMult": 0.06
        },
        "icon": "🛡️",
        "badge": "HONRA",
        "statText": "+1.0 Armadura, +6% Dano Geral",
        "description": "Determinação inabalável frente à escuridão."
      },
      {
        "id": "knight_val_2",
        "classId": "knight",
        "name": "Presença Magnética",
        "branch": "valor",
        "tier": "minor",
        "x": 700,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_val_1"
        ],
        "stats": {
          "magnetRadius": 0.3,
          "goldMult": 0.12
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+30% Raio de Ímã, +12% Ouro",
        "description": "A imponência régia atrai tesouros e gemas distantes."
      },
      {
        "id": "knight_val_3",
        "classId": "knight",
        "name": "Postura Marcial",
        "branch": "valor",
        "tier": "minor",
        "x": 700,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "knight_val_1"
        ],
        "stats": {
          "cooldownReduc": 0.08
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-8% Recarga de Armas",
        "description": "Economia de movimentos acelera os ataques sucessivos."
      },
      {
        "id": "knight_val_4",
        "classId": "knight",
        "name": "Atração Real",
        "branch": "valor",
        "tier": "minor",
        "x": 620,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_val_2"
        ],
        "stats": {
          "magnetRadius": 0.45,
          "xpMult": 0.15
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+45% Raio de Ímã, +15% XP",
        "description": "Atrai gemas de experiência com velocidade triplicada."
      },
      {
        "id": "knight_val_5",
        "classId": "knight",
        "name": "Aceleração Tática",
        "branch": "valor",
        "tier": "minor",
        "x": 620,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "knight_val_3"
        ],
        "stats": {
          "cooldownReduc": 0.12,
          "speedMult": 0.06
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-12% Recarga de Armas, +6% Velocidade",
        "description": "Passos firmes e postura ofensiva veloz."
      },
      {
        "id": "knight_val_not",
        "classId": "knight",
        "name": "Suserano de Valoria",
        "branch": "valor",
        "tier": "notable",
        "x": 560,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "knight_val_4",
          "knight_val_5"
        ],
        "stats": {
          "magnetRadius": 0.6,
          "cooldownReduc": 0.15,
          "goldMult": 0.25
        },
        "icon": "👑",
        "badge": "NOTÁVEL",
        "statText": "+60% Ímã, -15% Recarga, +25% Ouro",
        "description": "NOTÁVEL: Presença régia que comanda o ritmo do campo de batalha e recolhe os espólios da vitória."
      },
      {
        "id": "knight_val_6",
        "classId": "knight",
        "name": "Bastião das Bandeiras",
        "branch": "valor",
        "tier": "minor",
        "x": 460,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_val_not"
        ],
        "stats": {
          "armor": 3,
          "goldMult": 0.3,
          "xpMult": 0.2
        },
        "icon": "🛡️",
        "badge": "HONRA",
        "statText": "+3.0 Armadura, +30% Ouro, +20% XP",
        "description": "Estandartes de glória inspiram determinação e prosperidade."
      },
      {
        "id": "knight_val_7",
        "classId": "knight",
        "name": "Golpes Rápidos",
        "branch": "valor",
        "tier": "minor",
        "x": 460,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "knight_val_not"
        ],
        "stats": {
          "cooldownReduc": 0.18,
          "swordBoost": 0.2
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-18% Recarga de Armas, +20% Dano Espada",
        "description": "Cadência relâmpago de golpes que não dá trégua aos carniceiros."
      },
      {
        "id": "knight_val_key",
        "classId": "knight",
        "name": "Glória Eterna da Coroa",
        "branch": "valor",
        "tier": "keystone",
        "x": 340,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "knight_val_6",
          "knight_val_7"
        ],
        "stats": {
          "magnetRadius": 1,
          "cooldownReduc": 0.25,
          "goldMult": 0.5,
          "xpMult": 0.35
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+100% Ímã, -25% Recarga, +50% Ouro, +35% XP",
        "description": "PEDRA ANGULAR: A majestade da Coroa manifestada: atrai recursos da tela inteira e ataca em ritmo ininterrupto!"
      },
      {
        "id": "knight_bridge_NW",
        "classId": "knight",
        "name": "Guarda em Movimento",
        "branch": "fortress",
        "tier": "minor",
        "x": 740,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_2",
          "knight_val_2"
        ],
        "stats": {
          "armor": 1.5,
          "speedMult": 0.08
        },
        "icon": "🛡️",
        "badge": "SINERGIA",
        "statText": "+1.5 Armadura, +8% Velocidade",
        "description": "Ponte Marcial: Marcha com armadura pesada sem perder a agilidade."
      },
      {
        "id": "knight_bridge_NE",
        "classId": "knight",
        "name": "Fúria Defensiva",
        "branch": "blades",
        "tier": "minor",
        "x": 1060,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "knight_fort_3",
          "knight_blad_2"
        ],
        "stats": {
          "armor": 1.5,
          "swordBoost": 0.18
        },
        "icon": "⚔️",
        "badge": "SINERGIA",
        "statText": "+1.5 Armadura, +18% Dano Espadas",
        "description": "Ponte Marcial: O escudo protege enquanto a espada desfere golpes brutais."
      },
      {
        "id": "knight_bridge_SE",
        "classId": "knight",
        "name": "Golpes Vitalizantes",
        "branch": "vitality",
        "tier": "minor",
        "x": 1060,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "knight_blad_3",
          "knight_vit_3"
        ],
        "stats": {
          "maxHp": 45,
          "damageMult": 0.12
        },
        "icon": "❤️",
        "badge": "SINERGIA",
        "statText": "+45 HP Máximo, +12% Dano Geral",
        "description": "Ponte Marcial: A vitalidade nobre potencializa a força dos cortes."
      },
      {
        "id": "knight_bridge_SW",
        "classId": "knight",
        "name": "Vigor Inesgotável",
        "branch": "valor",
        "tier": "minor",
        "x": 740,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "knight_val_3",
          "knight_vit_2"
        ],
        "stats": {
          "hpRegen": 0.8,
          "magnetRadius": 0.35
        },
        "icon": "🌿",
        "badge": "SINERGIA",
        "statText": "+0.8 HP Regen/s, +35% Raio Ímã",
        "description": "Ponte Marcial: Resistência lendária que converte presença em poder."
      }
    ]
  },
  "ranger": {
    "id": "ranger",
    "name": "Arqueira das Sombras",
    "subtitle": "Balística Élfica, Perfuração de Projéteis & Precisão Letal",
    "icon": "🏹",
    "color": "#2ecc71",
    "originId": "ranger_orig",
    "branches": {
      "ballistics": {
        "id": "ballistics",
        "name": "Balística Élfica",
        "color": "#27ae60",
        "icon": "🏹",
        "subtitle": "Projéteis Extras, Perfuração & Velocidade de Disparo"
      },
      "marksmanship": {
        "id": "marksmanship",
        "name": "Precisão Letal",
        "color": "#e67e22",
        "icon": "🎯",
        "subtitle": "Chance Crítica, Dano Crítico & Sangramento"
      },
      "agility": {
        "id": "agility",
        "name": "Passo Fantasma",
        "color": "#1abc9c",
        "icon": "⚡",
        "subtitle": "Velocidade de Movimento, Wind Surge & Kiting"
      },
      "shadows": {
        "id": "shadows",
        "name": "Manto da Penumbra",
        "color": "#9b59b6",
        "icon": "🌑",
        "subtitle": "Ricochete Sombrio, Alcance & Execução"
      }
    },
    "nodes": [
      {
        "id": "ranger_orig",
        "classId": "ranger",
        "name": "Olho do Falcão",
        "branch": "center",
        "tier": "origin",
        "x": 900,
        "y": 900,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "icon": "🏹",
        "badge": "ORIGEM",
        "statText": "Centelha da Constelação da Arqueira",
        "description": "A bênção das florestas antigas: disparos que não erram e passos silenciosos nas trevas."
      },
      {
        "id": "ranger_bal_1",
        "classId": "ranger",
        "name": "Pontas Farpadas",
        "branch": "ballistics",
        "tier": "minor",
        "x": 900,
        "y": 780,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "bowPierce": 1,
          "damageMult": 0.06
        },
        "icon": "🏹",
        "badge": "PERFURAÇÃO",
        "statText": "+1 Perfuração de Flechas, +6% Dano",
        "description": "Flechas laminadas que atravessam os primeiros alvos."
      },
      {
        "id": "ranger_bal_2",
        "classId": "ranger",
        "name": "Corda de Tendão",
        "branch": "ballistics",
        "tier": "minor",
        "x": 840,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_1"
        ],
        "stats": {
          "cooldownReduc": 0.08,
          "bowPierce": 1
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-8% Recarga de Arco, +1 Perfuração",
        "description": "Tensão perfeita no arco aumenta a cadência dos tiros."
      },
      {
        "id": "ranger_bal_3",
        "classId": "ranger",
        "name": "Disparo Duplo",
        "branch": "ballistics",
        "tier": "minor",
        "x": 960,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_1"
        ],
        "stats": {
          "extraProjectiles": 1
        },
        "icon": "🏹",
        "badge": "MULTIDISPARO",
        "statText": "+1 Flecha Adicional",
        "description": "Nocka duas flechas simultaneamente em cada puxada."
      },
      {
        "id": "ranger_bal_4",
        "classId": "ranger",
        "name": "Haste de Ébano",
        "branch": "ballistics",
        "tier": "minor",
        "x": 800,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_2"
        ],
        "stats": {
          "bowPierce": 2,
          "damageMult": 0.12
        },
        "icon": "🏹",
        "badge": "PERFURAÇÃO",
        "statText": "+2 Perfuração de Flechas, +12% Dano",
        "description": "Madeira ultradensa perfura carapaças de ossos e ferro."
      },
      {
        "id": "ranger_bal_5",
        "classId": "ranger",
        "name": "Aljava de Prata",
        "branch": "ballistics",
        "tier": "minor",
        "x": 1000,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_3"
        ],
        "stats": {
          "extraProjectiles": 1,
          "cooldownReduc": 0.06
        },
        "icon": "🏹",
        "badge": "MULTIDISPARO",
        "statText": "+1 Flecha Adicional, -6% Recarga",
        "description": "Capacidade expandida para chuvas de flechas."
      },
      {
        "id": "ranger_bal_not",
        "classId": "ranger",
        "name": "Saraivada Imperial",
        "branch": "ballistics",
        "tier": "notable",
        "x": 900,
        "y": 560,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "ranger_bal_4",
          "ranger_bal_5"
        ],
        "stats": {
          "extraProjectiles": 1,
          "bowPierce": 2,
          "cooldownReduc": 0.12
        },
        "icon": "🏹",
        "badge": "NOTÁVEL",
        "statText": "+1 Flecha, +2 Perfuração, -12% Recarga",
        "description": "NOTÁVEL: O arco canta uma canção de morte, obscurecendo o céu com flechas."
      },
      {
        "id": "ranger_bal_6",
        "classId": "ranger",
        "name": "Disparo Penetrante",
        "branch": "ballistics",
        "tier": "minor",
        "x": 860,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_bal_not"
        ],
        "stats": {
          "bowPierce": 3,
          "damageMult": 0.2
        },
        "icon": "🏹",
        "badge": "PERFURAÇÃO",
        "statText": "+3 Perfuração de Flechas, +20% Dano",
        "description": "Força de tração monumental transfixa fileiras de monstros."
      },
      {
        "id": "ranger_bal_7",
        "classId": "ranger",
        "name": "Tempestade de Flechas",
        "branch": "ballistics",
        "tier": "minor",
        "x": 940,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_bal_not"
        ],
        "stats": {
          "extraProjectiles": 2
        },
        "icon": "🏹",
        "badge": "MULTIDISPARO",
        "statText": "+2 Flechas Adicionais por Disparo",
        "description": "Saturação de projéteis cobrindo todo o cone frontal."
      },
      {
        "id": "ranger_bal_key",
        "classId": "ranger",
        "name": "Chuva de Flechas Perfurantes",
        "branch": "ballistics",
        "tier": "keystone",
        "x": 900,
        "y": 340,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "ranger_bal_6",
          "ranger_bal_7"
        ],
        "stats": {
          "extraProjectiles": 2,
          "bowPierce": 6,
          "damageMult": 0.35
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+2 Flechas, +6 Perfuração, +35% Dano",
        "description": "PEDRA ANGULAR: Seus disparos atravessam hordas inteiras de ponta a ponta sem perder ímpeto!"
      },
      {
        "id": "ranger_mark_1",
        "classId": "ranger",
        "name": "Foco Letal",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1020,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "critChance": 0.08,
          "critDamage": 0.25
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+8% Chance Crítica, +25% Dano Crítico",
        "description": "Visão aguçada que localiza os pontos vitais dos carniceiros."
      },
      {
        "id": "ranger_mark_2",
        "classId": "ranger",
        "name": "Coração Aberto",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1100,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_mark_1"
        ],
        "stats": {
          "critChance": 0.08,
          "damageMult": 0.1
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+8% Chance Crítica, +10% Dano Geral",
        "description": "Golpes diretos no núcleo dos monstros."
      },
      {
        "id": "ranger_mark_3",
        "classId": "ranger",
        "name": "Hemorragia Profunda",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1100,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_mark_1"
        ],
        "stats": {
          "critDamage": 0.4
        },
        "icon": "💥",
        "badge": "LETALIDADE",
        "statText": "+40% Dano Crítico",
        "description": "Ferimentos rasgados que causam sangramentos atrozes."
      },
      {
        "id": "ranger_mark_4",
        "classId": "ranger",
        "name": "Mira Cirúrgica",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1180,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_mark_2"
        ],
        "stats": {
          "critChance": 0.1,
          "critDamage": 0.3
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+10% Chance Crítica, +30% Dano Crítico",
        "description": "Cálculo milimétrico mesmo em disparos em movimento."
      },
      {
        "id": "ranger_mark_5",
        "classId": "ranger",
        "name": "Ponta Oca",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1180,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_mark_3"
        ],
        "stats": {
          "critDamage": 0.5,
          "damageMult": 0.12
        },
        "icon": "💥",
        "badge": "LETALIDADE",
        "statText": "+50% Dano Crítico, +12% Dano Geral",
        "description": "A ponta deforma dentro do alvo multiplicando o dano."
      },
      {
        "id": "ranger_mark_not",
        "classId": "ranger",
        "name": "Disparo da Sentença",
        "branch": "marksmanship",
        "tier": "notable",
        "x": 1240,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "ranger_mark_4",
          "ranger_mark_5"
        ],
        "stats": {
          "critChance": 0.15,
          "critDamage": 0.6
        },
        "icon": "🎯",
        "badge": "NOTÁVEL",
        "statText": "+15% Chance Crítica, +60% Dano Crítico",
        "description": "NOTÁVEL: Cada tiro crítico soa como uma execução sumária."
      },
      {
        "id": "ranger_mark_6",
        "classId": "ranger",
        "name": "Olho do Assassino",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1340,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_mark_not"
        ],
        "stats": {
          "critChance": 0.15,
          "damageMult": 0.2
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+15% Chance Crítica, +20% Dano Geral",
        "description": "Identificação instantânea das fraquezas de chefes e elites."
      },
      {
        "id": "ranger_mark_7",
        "classId": "ranger",
        "name": "Crueldade Élfica",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1340,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_mark_not"
        ],
        "stats": {
          "critDamage": 0.8
        },
        "icon": "💥",
        "badge": "LETALIDADE",
        "statText": "+80% Dano Crítico",
        "description": "Críticos atingem proporções devastadoras."
      },
      {
        "id": "ranger_mark_key",
        "classId": "ranger",
        "name": "Olho do Vácuo",
        "branch": "marksmanship",
        "tier": "keystone",
        "x": 1460,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "ranger_mark_6",
          "ranger_mark_7"
        ],
        "stats": {
          "critChance": 0.25,
          "critDamage": 1.2
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+25% Crítico, +120% Dano Crítico",
        "description": "PEDRA ANGULAR: Seus acertos críticos atingem o ápice da letalidade, explodindo alvos fragilizados!"
      },
      {
        "id": "ranger_agi_1",
        "classId": "ranger",
        "name": "Passos Ligeiros",
        "branch": "agility",
        "tier": "minor",
        "x": 900,
        "y": 1020,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "speedMult": 0.1
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+10% Velocidade de Movimento",
        "description": "Botas de couro leve que voam sobre a terra ensanguentada."
      },
      {
        "id": "ranger_agi_2",
        "classId": "ranger",
        "name": "Esquiva Graciosa",
        "branch": "agility",
        "tier": "minor",
        "x": 840,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_agi_1"
        ],
        "stats": {
          "speedMult": 0.08,
          "maxHp": 20
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+8% Velocidade, +20 HP Máximo",
        "description": "Reflexos que evitam os cantos da arena."
      },
      {
        "id": "ranger_agi_3",
        "classId": "ranger",
        "name": "Giro do Vento",
        "branch": "agility",
        "tier": "minor",
        "x": 960,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_agi_1"
        ],
        "stats": {
          "speedMult": 0.08,
          "cooldownReduc": 0.08
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "+8% Velocidade, -8% Recarga",
        "description": "Disparar enquanto recua sem perder velocidade."
      },
      {
        "id": "ranger_agi_4",
        "classId": "ranger",
        "name": "Vento da Estepe",
        "branch": "agility",
        "tier": "minor",
        "x": 800,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_agi_2"
        ],
        "stats": {
          "speedMult": 0.12,
          "magnetRadius": 0.3
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+12% Velocidade, +30% Ímã",
        "description": "Criação de correntes de ar que atraem gemas em alta velocidade."
      },
      {
        "id": "ranger_agi_5",
        "classId": "ranger",
        "name": "Kiting Perfeito",
        "branch": "agility",
        "tier": "minor",
        "x": 1000,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_agi_3"
        ],
        "stats": {
          "speedMult": 0.12,
          "damageMult": 0.1
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+12% Velocidade, +10% Dano Geral",
        "description": "Manter distância ideal amplifica o dano infligido."
      },
      {
        "id": "ranger_agi_not",
        "classId": "ranger",
        "name": "Passo Fantasma",
        "branch": "agility",
        "tier": "notable",
        "x": 900,
        "y": 1240,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "ranger_agi_4",
          "ranger_agi_5"
        ],
        "stats": {
          "speedMult": 0.18,
          "cooldownReduc": 0.12,
          "magnetRadius": 0.4
        },
        "icon": "⚡",
        "badge": "NOTÁVEL",
        "statText": "+18% Velocidade, -12% Recarga, +40% Ímã",
        "description": "NOTÁVEL: Uma silhueta esquiva que desliza pelas hordas sem ser tocada."
      },
      {
        "id": "ranger_agi_6",
        "classId": "ranger",
        "name": "Brisa Intocável",
        "branch": "agility",
        "tier": "minor",
        "x": 860,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_agi_not"
        ],
        "stats": {
          "speedMult": 0.15,
          "maxHp": 35
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+15% Velocidade, +35 HP Máximo",
        "description": "Aceleração instantânea ao menor sinal de perigo."
      },
      {
        "id": "ranger_agi_7",
        "classId": "ranger",
        "name": "Corredor das Sombras",
        "branch": "agility",
        "tier": "minor",
        "x": 940,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_agi_not"
        ],
        "stats": {
          "speedMult": 0.15,
          "damageMult": 0.18
        },
        "icon": "⚡",
        "badge": "CELERIDADE",
        "statText": "+15% Velocidade, +18% Dano Geral",
        "description": "O impulso da corrida é transferido diretamente para as flechas."
      },
      {
        "id": "ranger_agi_key",
        "classId": "ranger",
        "name": "Passo Espectral do Vento",
        "branch": "agility",
        "tier": "keystone",
        "x": 900,
        "y": 1460,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "ranger_agi_6",
          "ranger_agi_7"
        ],
        "stats": {
          "speedMult": 0.3,
          "windSurge": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+30% Velocidade, Wind Surge",
        "description": "PEDRA ANGULAR: Converte 50% de todo o seu bônus de velocidade de movimento em DANO ADICIONAL nos projéteis!"
      },
      {
        "id": "ranger_sha_1",
        "classId": "ranger",
        "name": "Capa da Penumbra",
        "branch": "shadows",
        "tier": "minor",
        "x": 780,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "damageMult": 0.08,
          "areaMult": 0.1
        },
        "icon": "🌑",
        "badge": "SOMBRAS",
        "statText": "+8% Dano Geral, +10% Área",
        "description": "Tecido élfico camufla intenções e amplia a área de impacto."
      },
      {
        "id": "ranger_sha_2",
        "classId": "ranger",
        "name": "Extensão Noturna",
        "branch": "shadows",
        "tier": "minor",
        "x": 700,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sha_1"
        ],
        "stats": {
          "magnetRadius": 0.35,
          "xpMult": 0.12
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+35% Raio de Ímã, +12% XP",
        "description": "Sombras rasteiras colhem as gemas esquecidas."
      },
      {
        "id": "ranger_sha_3",
        "classId": "ranger",
        "name": "Glaives Fantasmagóricas",
        "branch": "shadows",
        "tier": "minor",
        "x": 700,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sha_1"
        ],
        "stats": {
          "damageMult": 0.12,
          "critChance": 0.05
        },
        "icon": "🗡️",
        "badge": "SOMBRAS",
        "statText": "+12% Dano Geral, +5% Crítico",
        "description": "Lâminas espectrais acompanham a trajetória dos disparos."
      },
      {
        "id": "ranger_sha_4",
        "classId": "ranger",
        "name": "Colheita de Almas",
        "branch": "shadows",
        "tier": "minor",
        "x": 620,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sha_2"
        ],
        "stats": {
          "xpMult": 0.2,
          "goldMult": 0.15
        },
        "icon": "💰",
        "badge": "RECURSOS",
        "statText": "+20% XP, +15% Ouro",
        "description": "Monstros abatidos no escuro cedem mais recursos."
      },
      {
        "id": "ranger_sha_5",
        "classId": "ranger",
        "name": "Veneno Sombrio",
        "branch": "shadows",
        "tier": "minor",
        "x": 620,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sha_3"
        ],
        "stats": {
          "damageMult": 0.18,
          "cooldownReduc": 0.08
        },
        "icon": "🧪",
        "badge": "DEBUFF",
        "statText": "+18% Dano Geral, -8% Recarga",
        "description": "Extrato de fungos das cavernas que corrói os alvos."
      },
      {
        "id": "ranger_sha_not",
        "classId": "ranger",
        "name": "Glaive da Penumbra",
        "branch": "shadows",
        "tier": "notable",
        "x": 560,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "ranger_sha_4",
          "ranger_sha_5"
        ],
        "stats": {
          "damageMult": 0.25,
          "critChance": 0.1,
          "extraProjectiles": 1
        },
        "icon": "🌑",
        "badge": "NOTÁVEL",
        "statText": "+25% Dano, +10% Crítico, +1 Projétil",
        "description": "NOTÁVEL: Disparos liberam foices espectrais adicionais na escuridão."
      },
      {
        "id": "ranger_sha_6",
        "classId": "ranger",
        "name": "Manto do Abismo",
        "branch": "shadows",
        "tier": "minor",
        "x": 460,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_sha_not"
        ],
        "stats": {
          "magnetRadius": 0.6,
          "xpMult": 0.25
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+60% Raio de Ímã, +25% XP",
        "description": "Vórtice sombrio que absorve gemas e ouro de longe."
      },
      {
        "id": "ranger_sha_7",
        "classId": "ranger",
        "name": "Lâmina da Meia-Noite",
        "branch": "shadows",
        "tier": "minor",
        "x": 460,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "ranger_sha_not"
        ],
        "stats": {
          "damageMult": 0.3,
          "critDamage": 0.4
        },
        "icon": "🗡️",
        "badge": "SOMBRAS",
        "statText": "+30% Dano Geral, +40% Dano Crítico",
        "description": "Golpes traiçoeiros que dilaceram chefes na penumbra."
      },
      {
        "id": "ranger_sha_key",
        "classId": "ranger",
        "name": "Ceifadora da Escuridão",
        "branch": "shadows",
        "tier": "keystone",
        "x": 340,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "ranger_sha_6",
          "ranger_sha_7"
        ],
        "stats": {
          "damageMult": 0.45,
          "extraProjectiles": 2,
          "critChance": 0.15
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+45% Dano, +2 Flechas, +15% Crítico",
        "description": "PEDRA ANGULAR: O Manto das Trevas se funde à arqueira, disparando rajadas contínuas de lâminas espectrais!"
      },
      {
        "id": "ranger_bridge_NW",
        "classId": "ranger",
        "name": "Tiro na Corrida",
        "branch": "ballistics",
        "tier": "minor",
        "x": 740,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_2",
          "ranger_sha_2"
        ],
        "stats": {
          "speedMult": 0.08,
          "bowPierce": 1
        },
        "icon": "🏹",
        "badge": "SINERGIA",
        "statText": "+8% Velocidade, +1 Perfuração",
        "description": "Ponte: Disparos perfurantes sem desacelerar a marcha."
      },
      {
        "id": "ranger_bridge_NE",
        "classId": "ranger",
        "name": "Flecha Perfurante Letal",
        "branch": "marksmanship",
        "tier": "minor",
        "x": 1060,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "ranger_bal_3",
          "ranger_mark_2"
        ],
        "stats": {
          "critChance": 0.08,
          "extraProjectiles": 1
        },
        "icon": "🎯",
        "badge": "SINERGIA",
        "statText": "+8% Chance Crítica, +1 Flecha",
        "description": "Ponte: Múltiplas flechas simultâneas com alta taxa de acerto crítico."
      },
      {
        "id": "ranger_bridge_SE",
        "classId": "ranger",
        "name": "Golpe Veloz Crítico",
        "branch": "agility",
        "tier": "minor",
        "x": 1060,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "ranger_mark_3",
          "ranger_agi_3"
        ],
        "stats": {
          "speedMult": 0.1,
          "critDamage": 0.35
        },
        "icon": "⚡",
        "badge": "SINERGIA",
        "statText": "+10% Velocidade, +35% Dano Crítico",
        "description": "Ponte: Velocidade aplicada diretamente à violência do impacto crítico."
      },
      {
        "id": "ranger_bridge_SW",
        "classId": "ranger",
        "name": "Passo nas Trevas",
        "branch": "shadows",
        "tier": "minor",
        "x": 740,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sha_3",
          "ranger_agi_2"
        ],
        "stats": {
          "speedMult": 0.08,
          "damageMult": 0.12
        },
        "icon": "🌑",
        "badge": "SINERGIA",
        "statText": "+8% Velocidade, +12% Dano Geral",
        "description": "Ponte: Deslocamento espectral pelas sombras da arena."
      }
    ]
  },
  "pyromancer": {
    "id": "pyromancer",
    "name": "Feiticeira das Cinzas",
    "subtitle": "Inferno Magmático, Explosões Arcanas & Renascimento da Fênix",
    "icon": "🔥",
    "color": "#e67e22",
    "originId": "pyromancer_orig",
    "branches": {
      "inferno": {
        "id": "inferno",
        "name": "Inferno Primordial",
        "color": "#d35400",
        "icon": "🔥",
        "subtitle": "Dano de Fogo, Área de Detonação & Purgatório"
      },
      "sorcery": {
        "id": "sorcery",
        "name": "Arcanismo Ígneo",
        "color": "#e74c3c",
        "icon": "🔮",
        "subtitle": "Bolas de Fogo Extras, Recarga Acelerada & Ignição"
      },
      "phoenix": {
        "id": "phoenix",
        "name": "Ascensão da Fênix",
        "color": "#f39c12",
        "icon": "🦅",
        "subtitle": "Renascimento em Chamas, Escudo de Brasas & Vigor"
      },
      "cataclysm": {
        "id": "cataclysm",
        "name": "Cataclismo Solar",
        "color": "#c0392b",
        "icon": "💥",
        "subtitle": "Explosões em Cadeia, Duração & Supernovas"
      }
    },
    "nodes": [
      {
        "id": "pyromancer_orig",
        "classId": "pyromancer",
        "name": "Coração de Magma",
        "branch": "center",
        "tier": "origin",
        "x": 900,
        "y": 900,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "icon": "🔥",
        "badge": "ORIGEM",
        "statText": "Centelha da Constelação da Piromante",
        "description": "A essência do fogo eterno: queimar o mal até não restar nada além de cinzas frias."
      },
      {
        "id": "pyro_inf_1",
        "classId": "pyromancer",
        "name": "Brasa Viva",
        "branch": "inferno",
        "tier": "minor",
        "x": 900,
        "y": 780,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "fireExplosion": 15,
          "damageMult": 0.08
        },
        "icon": "🔥",
        "badge": "FOGO",
        "statText": "+15 Raio de Explosão, +8% Dano",
        "description": "Chamas mais vorazes que expandem a detonação das labaredas."
      },
      {
        "id": "pyro_inf_2",
        "classId": "pyromancer",
        "name": "Onda de Calor",
        "branch": "inferno",
        "tier": "minor",
        "x": 840,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_1"
        ],
        "stats": {
          "areaMult": 0.15,
          "fireExplosion": 10
        },
        "icon": "💥",
        "badge": "ÁREA",
        "statText": "+15% Área Geral, +10 Raio de Fogo",
        "description": "Calor radiante que queima monstros adjacentes."
      },
      {
        "id": "pyro_inf_3",
        "classId": "pyromancer",
        "name": "Incêndio Voraz",
        "branch": "inferno",
        "tier": "minor",
        "x": 960,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_1"
        ],
        "stats": {
          "damageMult": 0.15
        },
        "icon": "🔥",
        "badge": "FOGO",
        "statText": "+15% Dano Geral das Chamas",
        "description": "Temperatura magmática que incinera carnes zumbis."
      },
      {
        "id": "pyro_inf_4",
        "classId": "pyromancer",
        "name": "Erupção Vulcânica",
        "branch": "inferno",
        "tier": "minor",
        "x": 800,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_2"
        ],
        "stats": {
          "fireExplosion": 25,
          "areaMult": 0.2
        },
        "icon": "💥",
        "badge": "ÁREA",
        "statText": "+25 Raio de Explosão, +20% Área",
        "description": "Cada explosão assemelha-se a uma fissura vulcânica."
      },
      {
        "id": "pyro_inf_5",
        "classId": "pyromancer",
        "name": "Combustão Espontânea",
        "branch": "inferno",
        "tier": "minor",
        "x": 1000,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_3"
        ],
        "stats": {
          "damageMult": 0.22,
          "critChance": 0.06
        },
        "icon": "🔥",
        "badge": "FOGO",
        "statText": "+22% Dano, +6% Chance Crítica",
        "description": "Monstros inflamam espontaneamente ao se aproximarem."
      },
      {
        "id": "pyro_inf_not",
        "classId": "pyromancer",
        "name": "Fornalha das Cinzas",
        "branch": "inferno",
        "tier": "notable",
        "x": 900,
        "y": 560,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pyro_inf_4",
          "pyro_inf_5"
        ],
        "stats": {
          "fireExplosion": 35,
          "areaMult": 0.28,
          "damageMult": 0.25
        },
        "icon": "🔥",
        "badge": "NOTÁVEL",
        "statText": "+35 Raio de Fogo, +28% Área, +25% Dano",
        "description": "NOTÁVEL: As labaredas cobrem quadrantes inteiros do campo de batalha com fogo líquido."
      },
      {
        "id": "pyro_inf_6",
        "classId": "pyromancer",
        "name": "Línguas do Inferno",
        "branch": "inferno",
        "tier": "minor",
        "x": 860,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_inf_not"
        ],
        "stats": {
          "fireExplosion": 30,
          "damageMult": 0.3
        },
        "icon": "🔥",
        "badge": "FOGO",
        "statText": "+30 Raio de Explosão, +30% Dano",
        "description": "Chamas inteligentes que buscam novos alvos ao redor."
      },
      {
        "id": "pyro_inf_7",
        "classId": "pyromancer",
        "name": "Magma Concentrado",
        "branch": "inferno",
        "tier": "minor",
        "x": 940,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_inf_not"
        ],
        "stats": {
          "areaMult": 0.35,
          "damageMult": 0.25
        },
        "icon": "💥",
        "badge": "ÁREA",
        "statText": "+35% Área, +25% Dano Geral",
        "description": "A densidade do fogo derrete escudos e armaduras pesadas."
      },
      {
        "id": "pyro_inf_key",
        "classId": "pyromancer",
        "name": "Purgatório de Cinzas",
        "branch": "inferno",
        "tier": "keystone",
        "x": 900,
        "y": 340,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pyro_inf_6",
          "pyro_inf_7"
        ],
        "stats": {
          "fireExplosion": 50,
          "damageMult": 0.5,
          "purgatoryFire": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+50 Raio Fogo, +50% Dano, Purgatório",
        "description": "PEDRA ANGULAR: Monstros mortos pelo fogo deixam poças de magma fervente que continuam incinerando inimigos!"
      },
      {
        "id": "pyro_sorc_1",
        "classId": "pyromancer",
        "name": "Canalização Ígnea",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1020,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "cooldownReduc": 0.08,
          "damageMult": 0.06
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-8% Recarga de Magias, +6% Dano",
        "description": "Fluxo arcano acelerado no cajado de cinzas."
      },
      {
        "id": "pyro_sorc_2",
        "classId": "pyromancer",
        "name": "Bolas de Fogo Gêmeas",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1100,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_sorc_1"
        ],
        "stats": {
          "extraProjectiles": 1
        },
        "icon": "🔮",
        "badge": "PROJÉTEIS",
        "statText": "+1 Bola de Fogo Adicional",
        "description": "Conjuração duplicada a cada lançamento do cajado."
      },
      {
        "id": "pyro_sorc_3",
        "classId": "pyromancer",
        "name": "Incandescência",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1100,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_sorc_1"
        ],
        "stats": {
          "cooldownReduc": 0.1,
          "speedMult": 0.05
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-10% Recarga de Magias, +5% Velocidade",
        "description": "Aceleração mágica contínua do lançamento de esferas."
      },
      {
        "id": "pyro_sorc_4",
        "classId": "pyromancer",
        "name": "Trindade Magmática",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1180,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_sorc_2"
        ],
        "stats": {
          "extraProjectiles": 1,
          "damageMult": 0.12
        },
        "icon": "🔮",
        "badge": "PROJÉTEIS",
        "statText": "+1 Bola de Fogo, +12% Dano",
        "description": "Três orbes incandescentes lançadas em leque."
      },
      {
        "id": "pyro_sorc_5",
        "classId": "pyromancer",
        "name": "Fluidez das Brasas",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1180,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_sorc_3"
        ],
        "stats": {
          "cooldownReduc": 0.14,
          "magnetRadius": 0.25
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-14% Recarga de Magias, +25% Ímã",
        "description": "O calor atrai as energias místicas do campo de batalha."
      },
      {
        "id": "pyro_sorc_not",
        "classId": "pyromancer",
        "name": "Convocação das Chamas",
        "branch": "sorcery",
        "tier": "notable",
        "x": 1240,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pyro_sorc_4",
          "pyro_sorc_5"
        ],
        "stats": {
          "extraProjectiles": 1,
          "cooldownReduc": 0.18,
          "damageMult": 0.2
        },
        "icon": "🔮",
        "badge": "NOTÁVEL",
        "statText": "+1 Projétil, -18% Recarga, +20% Dano",
        "description": "NOTÁVEL: Rajadas incessantes de fogo místico iluminam a escuridão da cidadela."
      },
      {
        "id": "pyro_sorc_6",
        "classId": "pyromancer",
        "name": "Chuva de Meteoros",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1340,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_sorc_not"
        ],
        "stats": {
          "extraProjectiles": 2
        },
        "icon": "🔮",
        "badge": "PROJÉTEIS",
        "statText": "+2 Bolas de Fogo Adicionais",
        "description": "Saturação arcana que oblitera enxames inteiros de esqueletos."
      },
      {
        "id": "pyro_sorc_7",
        "classId": "pyromancer",
        "name": "Velocidade da Luz",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1340,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_sorc_not"
        ],
        "stats": {
          "cooldownReduc": 0.2,
          "damageMult": 0.25
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-20% Recarga de Magias, +25% Dano",
        "description": "Lançamento quase instantâneo de magias de destruição."
      },
      {
        "id": "pyro_sorc_key",
        "classId": "pyromancer",
        "name": "Supernova Arcana",
        "branch": "sorcery",
        "tier": "keystone",
        "x": 1460,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pyro_sorc_6",
          "pyro_sorc_7"
        ],
        "stats": {
          "extraProjectiles": 2,
          "cooldownReduc": 0.25,
          "damageMult": 0.4
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+2 Projéteis, -25% Recarga, +40% Dano",
        "description": "PEDRA ANGULAR: Metralhadora arcana de fogo primordial em cascata incessante!"
      },
      {
        "id": "pyro_phoe_1",
        "classId": "pyromancer",
        "name": "Calor Protetor",
        "branch": "phoenix",
        "tier": "minor",
        "x": 900,
        "y": 1020,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "maxHp": 25,
          "hpRegen": 0.3
        },
        "icon": "❤️",
        "badge": "DEFESA",
        "statText": "+25 HP Máximo, +0.3 HP Regen/s",
        "description": "O calor do corpo cauteriza ferimentos leves."
      },
      {
        "id": "pyro_phoe_2",
        "classId": "pyromancer",
        "name": "Escudo de Brasas",
        "branch": "phoenix",
        "tier": "minor",
        "x": 840,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_phoe_1"
        ],
        "stats": {
          "armor": 1.5,
          "thornsReflection": 15
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+1.5 Armadura, +15 Espinhos de Fogo",
        "description": "Barreira de ar quente que queima quem toca na feiticeira."
      },
      {
        "id": "pyro_phoe_3",
        "classId": "pyromancer",
        "name": "Vigor Solar",
        "branch": "phoenix",
        "tier": "minor",
        "x": 960,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_phoe_1"
        ],
        "stats": {
          "maxHp": 40,
          "hpRegen": 0.6
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+40 HP Máximo, +0.6 HP Regen/s",
        "description": "Vitalidade alimentada pela combustão dos inimigos mortos."
      },
      {
        "id": "pyro_phoe_4",
        "classId": "pyromancer",
        "name": "Chama Regenerativa",
        "branch": "phoenix",
        "tier": "minor",
        "x": 800,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_phoe_2"
        ],
        "stats": {
          "hpRegen": 1.2,
          "maxHp": 30
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+1.2 HP Regen/s, +30 HP Máximo",
        "description": "Cicatrização acelerada durante o combate."
      },
      {
        "id": "pyro_phoe_5",
        "classId": "pyromancer",
        "name": "Aura do Pássaro de Fogo",
        "branch": "phoenix",
        "tier": "minor",
        "x": 1000,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_phoe_3"
        ],
        "stats": {
          "armor": 2.5,
          "speedMult": 0.08
        },
        "icon": "🦅",
        "badge": "AGILIDADE",
        "statText": "+2.5 Armadura, +8% Velocidade",
        "description": "Passos etéreos envoltos por penas de chama viva."
      },
      {
        "id": "pyro_phoe_not",
        "classId": "pyromancer",
        "name": "Coração da Fênix",
        "branch": "phoenix",
        "tier": "notable",
        "x": 900,
        "y": 1240,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pyro_phoe_4",
          "pyro_phoe_5"
        ],
        "stats": {
          "maxHp": 80,
          "hpRegen": 2,
          "armor": 3
        },
        "icon": "🦅",
        "badge": "NOTÁVEL",
        "statText": "+80 HP Máx, +2.0 HP Regen, +3.0 Armadura",
        "description": "NOTÁVEL: O sangue arde como o fogo de uma fênix imortal."
      },
      {
        "id": "pyro_phoe_6",
        "classId": "pyromancer",
        "name": "Plumagem de Fogo",
        "branch": "phoenix",
        "tier": "minor",
        "x": 860,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_phoe_not"
        ],
        "stats": {
          "maxHp": 100,
          "thornsReflection": 35
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+100 HP Máximo, +35 Espinhos",
        "description": "Retaliação flamejante violenta contra agressores."
      },
      {
        "id": "pyro_phoe_7",
        "classId": "pyromancer",
        "name": "Vida Incandescente",
        "branch": "phoenix",
        "tier": "minor",
        "x": 940,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_phoe_not"
        ],
        "stats": {
          "hpRegen": 3,
          "maxHp": 50
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+3.0 HP Regen/s, +50 HP Máximo",
        "description": "Recuperação de vitalidade mesmo sob os golpes mais pesados."
      },
      {
        "id": "pyro_phoe_key",
        "classId": "pyromancer",
        "name": "Renascimento da Fênix",
        "branch": "phoenix",
        "tier": "keystone",
        "x": 900,
        "y": 1460,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pyro_phoe_6",
          "pyro_phoe_7"
        ],
        "stats": {
          "maxHp": 150,
          "phoenixRebirth": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+150 HP Máx, Renascimento da Fênix",
        "description": "PEDRA ANGULAR: Ao sofrer dano fatal, libere uma supernova colossal que limpa a tela e ressuscite com 50% de HP!"
      },
      {
        "id": "pyro_cat_1",
        "classId": "pyromancer",
        "name": "Faíscas da Ruína",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 780,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "critChance": 0.06,
          "damageMult": 0.08
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+6% Chance Crítica, +8% Dano",
        "description": "Faíscas instáveis que detonam com força desmedida."
      },
      {
        "id": "pyro_cat_2",
        "classId": "pyromancer",
        "name": "Magnetismo Ígneo",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 700,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_cat_1"
        ],
        "stats": {
          "magnetRadius": 0.35,
          "goldMult": 0.15
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+35% Raio de Ímã, +15% Ouro",
        "description": "Cinzas magnetizadas atraem o ouro dos caídos."
      },
      {
        "id": "pyro_cat_3",
        "classId": "pyromancer",
        "name": "Estilhaços Quentes",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 700,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pyro_cat_1"
        ],
        "stats": {
          "critDamage": 0.35,
          "areaMult": 0.12
        },
        "icon": "💥",
        "badge": "CRÍTICO",
        "statText": "+35% Dano Crítico, +12% Área",
        "description": "Estilhaços incandescentes cortam as carnes próximas."
      },
      {
        "id": "pyro_cat_4",
        "classId": "pyromancer",
        "name": "Transmutação em Cinzas",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 620,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_cat_2"
        ],
        "stats": {
          "xpMult": 0.2,
          "goldMult": 0.2
        },
        "icon": "💰",
        "badge": "RECURSOS",
        "statText": "+20% XP, +20% Ouro",
        "description": "Monstros reduzidos a cinzas rendem gemas puras."
      },
      {
        "id": "pyro_cat_5",
        "classId": "pyromancer",
        "name": "Ignição Crítica",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 620,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pyro_cat_3"
        ],
        "stats": {
          "critChance": 0.1,
          "critDamage": 0.4
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+10% Chance Crítica, +40% Dano Crítico",
        "description": "Críticos flamejantes provocam explosões secundárias."
      },
      {
        "id": "pyro_cat_not",
        "classId": "pyromancer",
        "name": "Vórtice Incandescente",
        "branch": "cataclysm",
        "tier": "notable",
        "x": 560,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pyro_cat_4",
          "pyro_cat_5"
        ],
        "stats": {
          "critChance": 0.15,
          "critDamage": 0.6,
          "areaMult": 0.25
        },
        "icon": "💥",
        "badge": "NOTÁVEL",
        "statText": "+15% Crítico, +60% Dano Crítico, +25% Área",
        "description": "NOTÁVEL: As labaredas entram em colapso gravitacional antes de explodir."
      },
      {
        "id": "pyro_cat_6",
        "classId": "pyromancer",
        "name": "Fogo Branco",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 460,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_cat_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "critDamage": 0.5
        },
        "icon": "🔥",
        "badge": "FOGO",
        "statText": "+35% Dano, +50% Dano Crítico",
        "description": "Temperatura máxima onde o fogo atinge coloração branca pura."
      },
      {
        "id": "pyro_cat_7",
        "classId": "pyromancer",
        "name": "Magnetismo Cósmico",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 460,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pyro_cat_not"
        ],
        "stats": {
          "magnetRadius": 0.7,
          "xpMult": 0.3
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+70% Raio de Ímã, +30% XP",
        "description": "Puxa todas as gemas da arena na esteira das chamas."
      },
      {
        "id": "pyro_cat_key",
        "classId": "pyromancer",
        "name": "Cataclismo Solar",
        "branch": "cataclysm",
        "tier": "keystone",
        "x": 340,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pyro_cat_6",
          "pyro_cat_7"
        ],
        "stats": {
          "critChance": 0.2,
          "critDamage": 1,
          "areaMult": 0.4
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+20% Crítico, +100% Dano Crítico, +40% Área",
        "description": "PEDRA ANGULAR: O ápice do poder da feiticeira: críticos geram tempestades cósmicas de fogo destrutivo!"
      },
      {
        "id": "pyro_bridge_NW",
        "classId": "pyromancer",
        "name": "Explosão Veloz",
        "branch": "inferno",
        "tier": "minor",
        "x": 740,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_2",
          "pyro_cat_2"
        ],
        "stats": {
          "fireExplosion": 18,
          "speedMult": 0.08
        },
        "icon": "💥",
        "badge": "SINERGIA",
        "statText": "+18 Raio Fogo, +8% Velocidade",
        "description": "Ponte: A força das explosões impulsiona os passos da maga."
      },
      {
        "id": "pyro_bridge_NE",
        "classId": "pyromancer",
        "name": "Detonação Multi-Orbe",
        "branch": "sorcery",
        "tier": "minor",
        "x": 1060,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pyro_inf_3",
          "pyro_sorc_2"
        ],
        "stats": {
          "extraProjectiles": 1,
          "fireExplosion": 15
        },
        "icon": "🔮",
        "badge": "SINERGIA",
        "statText": "+1 Bola de Fogo, +15 Raio Fogo",
        "description": "Ponte: Cada orbe adicional mantém raio de explosão total."
      },
      {
        "id": "pyro_bridge_SE",
        "classId": "pyromancer",
        "name": "Brasa Curativa",
        "branch": "phoenix",
        "tier": "minor",
        "x": 1060,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pyro_sorc_3",
          "pyro_phoe_3"
        ],
        "stats": {
          "cooldownReduc": 0.1,
          "hpRegen": 0.8
        },
        "icon": "🌿",
        "badge": "SINERGIA",
        "statText": "-10% Recarga, +0.8 HP Regen/s",
        "description": "Ponte: Conjurações rápidas curam pequenas frações de vida."
      },
      {
        "id": "pyro_bridge_SW",
        "classId": "pyromancer",
        "name": "Retaliação Cataclísmica",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 740,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pyro_cat_3",
          "pyro_phoe_2"
        ],
        "stats": {
          "thornsReflection": 25,
          "damageMult": 0.15
        },
        "icon": "🔥",
        "badge": "SINERGIA",
        "statText": "+25 Espinhos Fogo, +15% Dano",
        "description": "Ponte: Qualquer toque de inimigo resulta em explosão vingativa."
      }
    ]
  },
  "paladin": {
    "id": "paladin",
    "name": "Paladino da Alvorada",
    "subtitle": "Auréola Seráfica, Martelo Sunbreaker & Retribuição Divina",
    "icon": "✨",
    "color": "#f1c40f",
    "originId": "paladin_orig",
    "branches": {
      "sanctity": {
        "id": "sanctity",
        "name": "Auréola Seráfica",
        "color": "#f39c12",
        "icon": "✨",
        "subtitle": "Raio de Consagração, Dano Sagrado & Relâmpagos"
      },
      "judgment": {
        "id": "judgment",
        "name": "Martelo da Alvorada",
        "color": "#e67e22",
        "icon": "🔨",
        "subtitle": "Concussão Esmagadora, Órbitas Solares & Retribuição"
      },
      "providence": {
        "id": "providence",
        "name": "Providência Divina",
        "color": "#2ecc71",
        "icon": "🕊️",
        "subtitle": "Regeneração em Área, Bênção & Barreira Sacra"
      },
      "crusader": {
        "id": "crusader",
        "name": "Armadura dos Santos",
        "color": "#3498db",
        "icon": "🛡️",
        "subtitle": "Armadura Pesada, Escudo Solar & Firmeza"
      }
    },
    "nodes": [
      {
        "id": "paladin_orig",
        "classId": "paladin",
        "name": "Luz Primordial",
        "branch": "center",
        "tier": "origin",
        "x": 900,
        "y": 900,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "icon": "✨",
        "badge": "ORIGEM",
        "statText": "Centelha da Constelação do Paladino",
        "description": "A bênção da Alvorada Eterna: iluminar as catacumbas e purificar toda corrupção profana."
      },
      {
        "id": "pal_sanc_1",
        "classId": "paladin",
        "name": "Fogo Sagrado",
        "branch": "sanctity",
        "tier": "minor",
        "x": 900,
        "y": 780,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "holyAuraBonus": 20,
          "damageMult": 0.08
        },
        "icon": "✨",
        "badge": "SAGRADO",
        "statText": "+20 Raio da Auréola, +8% Dano Sagrado",
        "description": "O círculo sagrado ao redor do paladino amplia seu alcance."
      },
      {
        "id": "pal_sanc_2",
        "classId": "paladin",
        "name": "Solo Consagrado",
        "branch": "sanctity",
        "tier": "minor",
        "x": 840,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_1"
        ],
        "stats": {
          "areaMult": 0.18,
          "holyAuraBonus": 15
        },
        "icon": "✨",
        "badge": "ÁREA",
        "statText": "+18% Área Geral, +15 Raio Auréola",
        "description": "Monstros que pisam na terra santa sofrem queimaduras divinas."
      },
      {
        "id": "pal_sanc_3",
        "classId": "paladin",
        "name": "Zelo Ardente",
        "branch": "sanctity",
        "tier": "minor",
        "x": 960,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "critChance": 0.05
        },
        "icon": "✨",
        "badge": "SAGRADO",
        "statText": "+15% Dano Sagrado, +5% Crítico",
        "description": "A fúria piedosa expurga abominações com rapidez."
      },
      {
        "id": "pal_sanc_4",
        "classId": "paladin",
        "name": "Purificação das Almas",
        "branch": "sanctity",
        "tier": "minor",
        "x": 800,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_2"
        ],
        "stats": {
          "holyAuraBonus": 30,
          "areaMult": 0.22
        },
        "icon": "✨",
        "badge": "ÁREA",
        "statText": "+30 Raio Auréola, +22% Área",
        "description": "Luz tão intensa que cega demônios e zumbis."
      },
      {
        "id": "pal_sanc_5",
        "classId": "paladin",
        "name": "Fagulha Celeste",
        "branch": "sanctity",
        "tier": "minor",
        "x": 1000,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_3"
        ],
        "stats": {
          "damageMult": 0.22,
          "cooldownReduc": 0.08
        },
        "icon": "⚡",
        "badge": "CADÊNCIA",
        "statText": "+22% Dano Sagrado, -8% Recarga",
        "description": "Relâmpagos de pureza que crepitam na orla da auréola."
      },
      {
        "id": "pal_sanc_not",
        "classId": "paladin",
        "name": "Resplendor dos Santos",
        "branch": "sanctity",
        "tier": "notable",
        "x": 900,
        "y": 560,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pal_sanc_4",
          "pal_sanc_5"
        ],
        "stats": {
          "holyAuraBonus": 45,
          "areaMult": 0.3,
          "damageMult": 0.25
        },
        "icon": "✨",
        "badge": "NOTÁVEL",
        "statText": "+45 Raio Auréola, +30% Área, +25% Dano",
        "description": "NOTÁVEL: A auréola sagrada se expande como um sol em miniatura ao redor do herói."
      },
      {
        "id": "pal_sanc_6",
        "classId": "paladin",
        "name": "Fogo da Inquisição",
        "branch": "sanctity",
        "tier": "minor",
        "x": 860,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_sanc_not"
        ],
        "stats": {
          "holyAuraBonus": 40,
          "damageMult": 0.3
        },
        "icon": "✨",
        "badge": "SAGRADO",
        "statText": "+40 Raio Auréola, +30% Dano",
        "description": "Purga instantânea contra enxames de esqueletos e espectros."
      },
      {
        "id": "pal_sanc_7",
        "classId": "paladin",
        "name": "Trovão Angelical",
        "branch": "sanctity",
        "tier": "minor",
        "x": 940,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_sanc_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "critChance": 0.1
        },
        "icon": "⚡",
        "badge": "CRÍTICO",
        "statText": "+35% Dano Sagrado, +10% Crítico",
        "description": "Trovões devocionais que quebram ossos e carapaças."
      },
      {
        "id": "pal_sanc_key",
        "classId": "paladin",
        "name": "Auréola Seráfica Celestial",
        "branch": "sanctity",
        "tier": "keystone",
        "x": 900,
        "y": 340,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pal_sanc_6",
          "pal_sanc_7"
        ],
        "stats": {
          "holyAuraBonus": 70,
          "celestialHalo": true,
          "damageMult": 0.45
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+70 Raio Auréola, Auréola Celestial, +45% Dano",
        "description": "PEDRA ANGULAR: O diâmetro da Auréola Sagrada dobra de tamanho e dispara raios divinos contínuos!"
      },
      {
        "id": "pal_judg_1",
        "classId": "paladin",
        "name": "Golpe Devocional",
        "branch": "judgment",
        "tier": "minor",
        "x": 1020,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "damageMult": 0.1,
          "areaMult": 0.1
        },
        "icon": "🔨",
        "badge": "MARTELO",
        "statText": "+10% Dano de Martelo, +10% Área",
        "description": "O peso do martelo Sunbreaker esmagando a impiedade."
      },
      {
        "id": "pal_judg_2",
        "classId": "paladin",
        "name": "Martelo Orbitante",
        "branch": "judgment",
        "tier": "minor",
        "x": 1100,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_judg_1"
        ],
        "stats": {
          "extraProjectiles": 1
        },
        "icon": "🔨",
        "badge": "MARTELO",
        "statText": "+1 Martelo Adicional por Ataque",
        "description": "Projeta um martelo sagrado adicional em trajetória orbital."
      },
      {
        "id": "pal_judg_3",
        "classId": "paladin",
        "name": "Impacto Sagrado",
        "branch": "judgment",
        "tier": "minor",
        "x": 1100,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_judg_1"
        ],
        "stats": {
          "critChance": 0.08,
          "critDamage": 0.3
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+8% Chance Crítica, +30% Dano Crítico",
        "description": "O impacto solar faz tremer a armadura dos chefes."
      },
      {
        "id": "pal_judg_4",
        "classId": "paladin",
        "name": "Dança Solar",
        "branch": "judgment",
        "tier": "minor",
        "x": 1180,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_judg_2"
        ],
        "stats": {
          "extraProjectiles": 1,
          "cooldownReduc": 0.08
        },
        "icon": "🔨",
        "badge": "MARTELO",
        "statText": "+1 Martelo Adicional, -8% Recarga",
        "description": "Múltiplos martelos reluzentes limpando o caminho."
      },
      {
        "id": "pal_judg_5",
        "classId": "paladin",
        "name": "Concussão Divina",
        "branch": "judgment",
        "tier": "minor",
        "x": 1180,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_judg_3"
        ],
        "stats": {
          "damageMult": 0.2,
          "areaMult": 0.18
        },
        "icon": "💥",
        "badge": "IMPACTO",
        "statText": "+20% Dano, +18% Área de Impacto",
        "description": "O estrondo do choque derruba monstros menores."
      },
      {
        "id": "pal_judg_not",
        "classId": "paladin",
        "name": "Julgamento do Alvorecer",
        "branch": "judgment",
        "tier": "notable",
        "x": 1240,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pal_judg_4",
          "pal_judg_5"
        ],
        "stats": {
          "extraProjectiles": 1,
          "damageMult": 0.25,
          "critChance": 0.1
        },
        "icon": "🔨",
        "badge": "NOTÁVEL",
        "statText": "+1 Martelo, +25% Dano, +10% Crítico",
        "description": "NOTÁVEL: Cada golpe de martelo ressoa como o sino de uma catedral divina."
      },
      {
        "id": "pal_judg_6",
        "classId": "paladin",
        "name": "Fúria do Solbreaker",
        "branch": "judgment",
        "tier": "minor",
        "x": 1340,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_judg_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "areaMult": 0.25
        },
        "icon": "🔨",
        "badge": "MARTELO",
        "statText": "+35% Dano de Martelo, +25% Área",
        "description": "Poder solar condensado na cabeça de aço do martelo."
      },
      {
        "id": "pal_judg_7",
        "classId": "paladin",
        "name": "Sentença Inapelável",
        "branch": "judgment",
        "tier": "minor",
        "x": 1340,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_judg_not"
        ],
        "stats": {
          "critDamage": 0.7,
          "critChance": 0.12
        },
        "icon": "🎯",
        "badge": "LETALIDADE",
        "statText": "+12% Crítico, +70% Dano Crítico",
        "description": "Esmaga crânios demoníacos com justiça celestial."
      },
      {
        "id": "pal_judg_key",
        "classId": "paladin",
        "name": "Martelo do Sol Nascente",
        "branch": "judgment",
        "tier": "keystone",
        "x": 1460,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pal_judg_6",
          "pal_judg_7"
        ],
        "stats": {
          "extraProjectiles": 2,
          "damageMult": 0.5,
          "holyRetribution": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+2 Martelos, +50% Dano, Retribuição",
        "description": "PEDRA ANGULAR: Martelos solares orbitam continuamente e invocam colunas celestiais em cada impacto!"
      },
      {
        "id": "pal_prov_1",
        "classId": "paladin",
        "name": "Bênção da Vida",
        "branch": "providence",
        "tier": "minor",
        "x": 900,
        "y": 1020,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "maxHp": 35,
          "hpRegen": 0.5
        },
        "icon": "❤️",
        "badge": "VITALIDADE",
        "statText": "+35 HP Máximo, +0.5 HP Regen/s",
        "description": "A graça da Providência regenerando o paladino."
      },
      {
        "id": "pal_prov_2",
        "classId": "paladin",
        "name": "Água Benta",
        "branch": "providence",
        "tier": "minor",
        "x": 840,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_prov_1"
        ],
        "stats": {
          "hpRegen": 0.8,
          "maxHp": 30
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+0.8 HP Regen/s, +30 HP Máximo",
        "description": "Unguento sagrado fecha feridas em plena batalha."
      },
      {
        "id": "pal_prov_3",
        "classId": "paladin",
        "name": "Baluarte da Graça",
        "branch": "providence",
        "tier": "minor",
        "x": 960,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_prov_1"
        ],
        "stats": {
          "armor": 1.5,
          "maxHp": 40
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+1.5 Armadura, +40 HP Máximo",
        "description": "A fé se solidifica em uma couraça impenetrável."
      },
      {
        "id": "pal_prov_4",
        "classId": "paladin",
        "name": "Santuário Vivo",
        "branch": "providence",
        "tier": "minor",
        "x": 800,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_prov_2"
        ],
        "stats": {
          "hpRegen": 1.4,
          "maxHp": 50
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+1.4 HP Regen/s, +50 HP Máximo",
        "description": "Presença divina que repele a morte e o cansaço."
      },
      {
        "id": "pal_prov_5",
        "classId": "paladin",
        "name": "Escudo Devoto",
        "branch": "providence",
        "tier": "minor",
        "x": 1000,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_prov_3"
        ],
        "stats": {
          "armor": 2.5,
          "speedMult": 0.06
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+2.5 Armadura, +6% Velocidade",
        "description": "Passos firmes sustentados pela convicção sacra."
      },
      {
        "id": "pal_prov_not",
        "classId": "paladin",
        "name": "Providência Inabalável",
        "branch": "providence",
        "tier": "notable",
        "x": 900,
        "y": 1240,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pal_prov_4",
          "pal_prov_5"
        ],
        "stats": {
          "maxHp": 100,
          "hpRegen": 2.2,
          "armor": 3.5
        },
        "icon": "🕊️",
        "badge": "NOTÁVEL",
        "statText": "+100 HP Máx, +2.2 HP Regen, +3.5 Armadura",
        "description": "NOTÁVEL: O guerreiro sagrado torna-se um bastião quase impossível de ser abatido."
      },
      {
        "id": "pal_prov_6",
        "classId": "paladin",
        "name": "Aura de Esperança",
        "branch": "providence",
        "tier": "minor",
        "x": 860,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_prov_not"
        ],
        "stats": {
          "hpRegen": 3,
          "maxHp": 80
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+3.0 HP Regen/s, +80 HP Máximo",
        "description": "Milagres de cura renovam o combatente continuamente."
      },
      {
        "id": "pal_prov_7",
        "classId": "paladin",
        "name": "Couraça de Querubim",
        "branch": "providence",
        "tier": "minor",
        "x": 940,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_prov_not"
        ],
        "stats": {
          "armor": 4.5,
          "maxHp": 100
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+4.5 Armadura, +100 HP Máximo",
        "description": "Asas celestiais intangíveis absorvem os maiores impactos."
      },
      {
        "id": "pal_prov_key",
        "classId": "paladin",
        "name": "Bênção da Alvorada Eterna",
        "branch": "providence",
        "tier": "keystone",
        "x": 900,
        "y": 1460,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pal_prov_6",
          "pal_prov_7"
        ],
        "stats": {
          "maxHp": 180,
          "hpRegen": 5,
          "armor": 6
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+180 HP, +5.0 HP Regen/s, +6 Armadura",
        "description": "PEDRA ANGULAR: O guerreiro é banhado pela luz eterna da Alvorada, tornando-se praticamente indestrutível!"
      },
      {
        "id": "pal_cru_1",
        "classId": "paladin",
        "name": "Capa do Cruzado",
        "branch": "crusader",
        "tier": "minor",
        "x": 780,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "armor": 1.5,
          "magnetRadius": 0.25
        },
        "icon": "🛡️",
        "badge": "CRUZADA",
        "statText": "+1.5 Armadura, +25% Raio de Ímã",
        "description": "O manto sagrado recolhe oferendas e ouro divino."
      },
      {
        "id": "pal_cru_2",
        "classId": "paladin",
        "name": "Dízimo da Glória",
        "branch": "crusader",
        "tier": "minor",
        "x": 700,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_cru_1"
        ],
        "stats": {
          "goldMult": 0.2,
          "xpMult": 0.15
        },
        "icon": "💰",
        "badge": "RECURSOS",
        "statText": "+20% Ouro, +15% XP",
        "description": "Inimigos purificados concedem o dobro de recompensas sacras."
      },
      {
        "id": "pal_cru_3",
        "classId": "paladin",
        "name": "Cadência do Julgamento",
        "branch": "crusader",
        "tier": "minor",
        "x": 700,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "pal_cru_1"
        ],
        "stats": {
          "cooldownReduc": 0.1,
          "damageMult": 0.08
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-10% Recarga de Armas, +8% Dano",
        "description": "Bater o martelo em uníssono com os hinos dos templos."
      },
      {
        "id": "pal_cru_4",
        "classId": "paladin",
        "name": "Ímã da Catedral",
        "branch": "crusader",
        "tier": "minor",
        "x": 620,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_cru_2"
        ],
        "stats": {
          "magnetRadius": 0.5,
          "goldMult": 0.25
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+50% Raio de Ímã, +25% Ouro",
        "description": "Atrai todas as gemas da tela para alimentar o Éter Ancestral."
      },
      {
        "id": "pal_cru_5",
        "classId": "paladin",
        "name": "Passo Inflexível",
        "branch": "crusader",
        "tier": "minor",
        "x": 620,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "pal_cru_3"
        ],
        "stats": {
          "cooldownReduc": 0.14,
          "armor": 2
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-14% Recarga, +2.0 Armadura",
        "description": "Avanço determinado que esmaga qualquer obstáculo."
      },
      {
        "id": "pal_cru_not",
        "classId": "paladin",
        "name": "Campeão da Fé",
        "branch": "crusader",
        "tier": "notable",
        "x": 560,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "pal_cru_4",
          "pal_cru_5"
        ],
        "stats": {
          "armor": 3.5,
          "cooldownReduc": 0.16,
          "magnetRadius": 0.65
        },
        "icon": "🛡️",
        "badge": "NOTÁVEL",
        "statText": "+3.5 Armadura, -16% Recarga, +65% Ímã",
        "description": "NOTÁVEL: O campeão escolhido pelos deuses ataca com cadência implacável e recolhe tudo ao redor."
      },
      {
        "id": "pal_cru_6",
        "classId": "paladin",
        "name": "Riqueza Sagrada",
        "branch": "crusader",
        "tier": "minor",
        "x": 460,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_cru_not"
        ],
        "stats": {
          "goldMult": 0.4,
          "xpMult": 0.3
        },
        "icon": "💰",
        "badge": "RECURSOS",
        "statText": "+40% Ouro, +30% XP",
        "description": "As bênçãos da vitória multiplicam as gemas de ascensão."
      },
      {
        "id": "pal_cru_7",
        "classId": "paladin",
        "name": "Ritmo Litúrgico",
        "branch": "crusader",
        "tier": "minor",
        "x": 460,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "pal_cru_not"
        ],
        "stats": {
          "cooldownReduc": 0.2,
          "damageMult": 0.25
        },
        "icon": "⏳",
        "badge": "CADÊNCIA",
        "statText": "-20% Recarga de Armas, +25% Dano",
        "description": "Golpes ininterruptos que não dão margem para reação das hordas."
      },
      {
        "id": "pal_cru_key",
        "classId": "paladin",
        "name": "Cruzada Imortal",
        "branch": "crusader",
        "tier": "keystone",
        "x": 340,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "pal_cru_6",
          "pal_cru_7"
        ],
        "stats": {
          "cooldownReduc": 0.28,
          "magnetRadius": 1,
          "goldMult": 0.6,
          "armor": 5
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "-28% Recarga, +100% Ímã, +60% Ouro, +5 Armadura",
        "description": "PEDRA ANGULAR: Comande o campo com autoridade sagrada máxima: ataque a cada instante e colete tudo instantaneamente!"
      },
      {
        "id": "pal_bridge_NW",
        "classId": "paladin",
        "name": "Auréola Rápida",
        "branch": "sanctity",
        "tier": "minor",
        "x": 740,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_2",
          "pal_cru_2"
        ],
        "stats": {
          "holyAuraBonus": 20,
          "speedMult": 0.08
        },
        "icon": "✨",
        "badge": "SINERGIA",
        "statText": "+20 Raio Auréola, +8% Velocidade",
        "description": "Ponte: Movimento sagrado célere sem perder a força do círculo."
      },
      {
        "id": "pal_bridge_NE",
        "classId": "paladin",
        "name": "Martelo Consagrado",
        "branch": "judgment",
        "tier": "minor",
        "x": 1060,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pal_sanc_3",
          "pal_judg_2"
        ],
        "stats": {
          "damageMult": 0.18,
          "extraProjectiles": 1
        },
        "icon": "🔨",
        "badge": "SINERGIA",
        "statText": "+18% Dano Sagrado, +1 Martelo",
        "description": "Ponte: A auréola imbui todos os martelos com fogo sagrado puro."
      },
      {
        "id": "pal_bridge_SE",
        "classId": "paladin",
        "name": "Impacto Restaurador",
        "branch": "providence",
        "tier": "minor",
        "x": 1060,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pal_judg_3",
          "pal_prov_3"
        ],
        "stats": {
          "maxHp": 50,
          "hpRegen": 0.8
        },
        "icon": "❤️",
        "badge": "SINERGIA",
        "statText": "+50 HP Máximo, +0.8 HP Regen/s",
        "description": "Ponte: Esmagar monstros restaura o fôlego e a saúde."
      },
      {
        "id": "pal_bridge_SW",
        "classId": "paladin",
        "name": "Armadura da Graça",
        "branch": "crusader",
        "tier": "minor",
        "x": 740,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "pal_cru_3",
          "pal_prov_2"
        ],
        "stats": {
          "armor": 2,
          "hpRegen": 0.8
        },
        "icon": "🛡️",
        "badge": "SINERGIA",
        "statText": "+2.0 Armadura, +0.8 HP Regen/s",
        "description": "Ponte: Couraça temperada com preces que se repara constantemente."
      }
    ]
  },
  "plague_alchemist": {
    "id": "plague_alchemist",
    "name": "Alquimista da Peste",
    "subtitle": "Miasma Corrosivo, Transmutação Proibida & Frascos Voláteis",
    "icon": "🧪",
    "color": "#8e44ad",
    "originId": "plague_alchemist_orig",
    "branches": {
      "miasma": {
        "id": "miasma",
        "name": "Miasma Corrosivo",
        "color": "#27ae60",
        "icon": "🧪",
        "subtitle": "Área de Veneno, Duração de Poças & Corrosão"
      },
      "volatiles": {
        "id": "volatiles",
        "name": "Frascos Voláteis",
        "color": "#9b59b6",
        "icon": "💣",
        "subtitle": "Frascos Extras, Velocidade de Arremesso & Detonação"
      },
      "transmutation": {
        "id": "transmutation",
        "name": "Grande Obra & Ouro",
        "color": "#f39c12",
        "icon": "💰",
        "subtitle": "Ouro e Éter de Inimigos Envenenados, Transmutação"
      },
      "apothecary": {
        "id": "apothecary",
        "name": "Elixires Proibidos",
        "color": "#c0392b",
        "icon": "🧬",
        "subtitle": "Regeneração Tóxica, Vida Alquímica & Peste Viral"
      }
    },
    "nodes": [
      {
        "id": "plague_alchemist_orig",
        "classId": "plague_alchemist",
        "name": "Frasco Primordial",
        "branch": "center",
        "tier": "origin",
        "x": 900,
        "y": 900,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "icon": "🧪",
        "badge": "ORIGEM",
        "statText": "Centelha da Constelação do Alquimista",
        "description": "O conhecimento herético proibido: dissolver carne e osso em ácidos pestilentos para criar ouro e vida."
      },
      {
        "id": "alch_mia_1",
        "classId": "plague_alchemist",
        "name": "Vapor Tóxico",
        "branch": "miasma",
        "tier": "minor",
        "x": 900,
        "y": 780,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "plagueAreaBonus": 15,
          "damageMult": 0.08
        },
        "icon": "🧪",
        "badge": "VENENO",
        "statText": "+15 Raio do Miasma, +8% Dano",
        "description": "Vapores sulfúricos que sufocam os pulmões de quem passar perto."
      },
      {
        "id": "alch_mia_2",
        "classId": "plague_alchemist",
        "name": "Ácido Concentrado",
        "branch": "miasma",
        "tier": "minor",
        "x": 840,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_mia_1"
        ],
        "stats": {
          "areaMult": 0.18,
          "plagueAreaBonus": 12
        },
        "icon": "🧪",
        "badge": "ÁREA",
        "statText": "+18% Área Geral, +12 Raio Miasma",
        "description": "As poças venenosas expandem-se rapidamente pelo calçamento."
      },
      {
        "id": "alch_mia_3",
        "classId": "plague_alchemist",
        "name": "Peste Pulmonar",
        "branch": "miasma",
        "tier": "minor",
        "x": 960,
        "y": 700,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_mia_1"
        ],
        "stats": {
          "damageMult": 0.15
        },
        "icon": "🧪",
        "badge": "VENENO",
        "statText": "+15% Dano Contínuo de Veneno",
        "description": "Toxina que decompõe tecidos musculares dos carniceiros."
      },
      {
        "id": "alch_mia_4",
        "classId": "plague_alchemist",
        "name": "Poça Sulfúrica",
        "branch": "miasma",
        "tier": "minor",
        "x": 800,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_mia_2"
        ],
        "stats": {
          "plagueAreaBonus": 25,
          "areaMult": 0.22
        },
        "icon": "🧪",
        "badge": "ÁREA",
        "statText": "+25 Raio Miasma, +22% Área",
        "description": "Lagos de ácido verde brilhante onde nenhum monstro sobrevive."
      },
      {
        "id": "alch_mia_5",
        "classId": "plague_alchemist",
        "name": "Contágio Necrótico",
        "branch": "miasma",
        "tier": "minor",
        "x": 1000,
        "y": 620,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_mia_3"
        ],
        "stats": {
          "damageMult": 0.22,
          "critChance": 0.06
        },
        "icon": "🧪",
        "badge": "VENENO",
        "statText": "+22% Dano, +6% Chance Crítica",
        "description": "Necrose avançada que enfraquece chefes e monstros de elite."
      },
      {
        "id": "alch_mia_not",
        "classId": "plague_alchemist",
        "name": "Mar de Podridão",
        "branch": "miasma",
        "tier": "notable",
        "x": 900,
        "y": 560,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "alch_mia_4",
          "alch_mia_5"
        ],
        "stats": {
          "plagueAreaBonus": 40,
          "areaMult": 0.3,
          "damageMult": 0.25
        },
        "icon": "🧪",
        "badge": "NOTÁVEL",
        "statText": "+40 Raio Miasma, +30% Área, +25% Dano",
        "description": "NOTÁVEL: As poças verdes tornam-se lagos cáusticos que cobrem quarteirões inteiros."
      },
      {
        "id": "alch_mia_6",
        "classId": "plague_alchemist",
        "name": "Gás Mostarda",
        "branch": "miasma",
        "tier": "minor",
        "x": 860,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_mia_not"
        ],
        "stats": {
          "plagueAreaBonus": 35,
          "damageMult": 0.3
        },
        "icon": "🧪",
        "badge": "VENENO",
        "statText": "+35 Raio Miasma, +30% Dano",
        "description": "Névoa amarela asfixiante que derrete armaduras inimigas."
      },
      {
        "id": "alch_mia_7",
        "classId": "plague_alchemist",
        "name": "Chuva de Toxinas",
        "branch": "miasma",
        "tier": "minor",
        "x": 940,
        "y": 460,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_mia_not"
        ],
        "stats": {
          "areaMult": 0.35,
          "damageMult": 0.25
        },
        "icon": "🧪",
        "badge": "ÁREA",
        "statText": "+35% Área Geral, +25% Dano",
        "description": "Micro-gotículas suspensas no ar envenenam a arena inteira."
      },
      {
        "id": "alch_mia_key",
        "classId": "plague_alchemist",
        "name": "Mar Cáustico",
        "branch": "miasma",
        "tier": "keystone",
        "x": 900,
        "y": 340,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "alch_mia_6",
          "alch_mia_7"
        ],
        "stats": {
          "plagueAreaBonus": 60,
          "causticSea": true,
          "damageMult": 0.45
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+60 Raio Miasma, Mar Cáustico, +45% Dano",
        "description": "PEDRA ANGULAR: As poças venenosas fundem-se em um dilúvio ácido permanente que cobre toda a tela!"
      },
      {
        "id": "alch_vol_1",
        "classId": "plague_alchemist",
        "name": "Frascos de Impacto",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1020,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "damageMult": 0.1,
          "cooldownReduc": 0.08
        },
        "icon": "💣",
        "badge": "FRASCOS",
        "statText": "+10% Dano de Frascos, -8% Recarga",
        "description": "Vidro temperado que estilhaça com violência contra os monstros."
      },
      {
        "id": "alch_vol_2",
        "classId": "plague_alchemist",
        "name": "Arremesso Duplo",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1100,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_vol_1"
        ],
        "stats": {
          "extraProjectiles": 1
        },
        "icon": "💣",
        "badge": "FRASCOS",
        "statText": "+1 Frasco Adicional por Arremesso",
        "description": "Dois frascos lançados em parábolas simétricas."
      },
      {
        "id": "alch_vol_3",
        "classId": "plague_alchemist",
        "name": "Estilhaços de Vidro",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1100,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_vol_1"
        ],
        "stats": {
          "critChance": 0.08,
          "critDamage": 0.3
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+8% Chance Crítica, +30% Dano Crítico",
        "description": "Cacos afiados embebidos em veneno cortam fundo."
      },
      {
        "id": "alch_vol_4",
        "classId": "plague_alchemist",
        "name": "Tríplice Miasma",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1180,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_vol_2"
        ],
        "stats": {
          "extraProjectiles": 1,
          "cooldownReduc": 0.08
        },
        "icon": "💣",
        "badge": "FRASCOS",
        "statText": "+1 Frasco Adicional, -8% Recarga",
        "description": "Três pontos de veneno criados a cada ciclo de arremesso."
      },
      {
        "id": "alch_vol_5",
        "classId": "plague_alchemist",
        "name": "Fórmula Explosiva",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1180,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_vol_3"
        ],
        "stats": {
          "damageMult": 0.2,
          "areaMult": 0.15
        },
        "icon": "💥",
        "badge": "EXPLOSÃO",
        "statText": "+20% Dano, +15% Área de Detonação",
        "description": "Detonação de fósforo que quebra formações cerradas."
      },
      {
        "id": "alch_vol_not",
        "classId": "plague_alchemist",
        "name": "Chuva de Vidro e Peste",
        "branch": "volatiles",
        "tier": "notable",
        "x": 1240,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "alch_vol_4",
          "alch_vol_5"
        ],
        "stats": {
          "extraProjectiles": 1,
          "damageMult": 0.25,
          "cooldownReduc": 0.15
        },
        "icon": "💣",
        "badge": "NOTÁVEL",
        "statText": "+1 Frasco, +25% Dano, -15% Recarga",
        "description": "NOTÁVEL: Bombardeio ininterrupto de veneno estilhaçante que sufoca a arena."
      },
      {
        "id": "alch_vol_6",
        "classId": "plague_alchemist",
        "name": "Quádruplo Lançamento",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1340,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_vol_not"
        ],
        "stats": {
          "extraProjectiles": 2
        },
        "icon": "💣",
        "badge": "FRASCOS",
        "statText": "+2 Frascos Adicionais",
        "description": "Uma saraivada de recipientes de vidro tóxico cobrindo 360 graus."
      },
      {
        "id": "alch_vol_7",
        "classId": "plague_alchemist",
        "name": "Reação em Cadeia",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1340,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_vol_not"
        ],
        "stats": {
          "critDamage": 0.7,
          "critChance": 0.12
        },
        "icon": "🎯",
        "badge": "CRÍTICO",
        "statText": "+12% Crítico, +70% Dano Crítico",
        "description": "Explosões consecutivas pulverizam ossos e carnes putrefatas."
      },
      {
        "id": "alch_vol_key",
        "classId": "plague_alchemist",
        "name": "Cataclismo Alquímico",
        "branch": "volatiles",
        "tier": "keystone",
        "x": 1460,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "alch_vol_6",
          "alch_vol_7"
        ],
        "stats": {
          "extraProjectiles": 2,
          "damageMult": 0.5,
          "cooldownReduc": 0.25
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+2 Frascos, -25% Recarga, +50% Dano",
        "description": "PEDRA ANGULAR: Metralhadora de frascos químicos que banha o campo em constante dilúvio corrosivo!"
      },
      {
        "id": "alch_tra_1",
        "classId": "plague_alchemist",
        "name": "Toque de Midas",
        "branch": "transmutation",
        "tier": "minor",
        "x": 900,
        "y": 1020,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "goldMult": 0.2,
          "magnetRadius": 0.25
        },
        "icon": "💰",
        "badge": "TRANSMUTAÇÃO",
        "statText": "+20% Ouro, +25% Raio de Ímã",
        "description": "Fórmula arcana que converte cinzas e ácidos em moedas de ouro."
      },
      {
        "id": "alch_tra_2",
        "classId": "plague_alchemist",
        "name": "Cristais de Éter",
        "branch": "transmutation",
        "tier": "minor",
        "x": 840,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_tra_1"
        ],
        "stats": {
          "xpMult": 0.2,
          "goldMult": 0.15
        },
        "icon": "🔮",
        "badge": "ÉTER",
        "statText": "+20% XP, +15% Ouro",
        "description": "Monstros envenenados liberam mais cristais de experiência pura."
      },
      {
        "id": "alch_tra_3",
        "classId": "plague_alchemist",
        "name": "Magnetismo Ácido",
        "branch": "transmutation",
        "tier": "minor",
        "x": 960,
        "y": 1100,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_tra_1"
        ],
        "stats": {
          "magnetRadius": 0.45,
          "speedMult": 0.05
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+45% Raio de Ímã, +5% Velocidade",
        "description": "Vapores químicos puxam gemas distantes como um vórtice."
      },
      {
        "id": "alch_tra_4",
        "classId": "plague_alchemist",
        "name": "Destilação de Riqueza",
        "branch": "transmutation",
        "tier": "minor",
        "x": 800,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_tra_2"
        ],
        "stats": {
          "goldMult": 0.35,
          "xpMult": 0.25
        },
        "icon": "💰",
        "badge": "TRANSMUTAÇÃO",
        "statText": "+35% Ouro, +25% XP",
        "description": "Refinamento proibido: cada abate enriquece as arcas do reino."
      },
      {
        "id": "alch_tra_5",
        "classId": "plague_alchemist",
        "name": "Atração Etérea",
        "branch": "transmutation",
        "tier": "minor",
        "x": 1000,
        "y": 1180,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_tra_3"
        ],
        "stats": {
          "magnetRadius": 0.6,
          "cooldownReduc": 0.08
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+60% Raio de Ímã, -8% Recarga",
        "description": "Acelera a absorção de poder místico do solo."
      },
      {
        "id": "alch_tra_not",
        "classId": "plague_alchemist",
        "name": "A Grande Obra",
        "branch": "transmutation",
        "tier": "notable",
        "x": 900,
        "y": 1240,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "alch_tra_4",
          "alch_tra_5"
        ],
        "stats": {
          "goldMult": 0.5,
          "xpMult": 0.35,
          "magnetRadius": 0.7
        },
        "icon": "💰",
        "badge": "NOTÁVEL",
        "statText": "+50% Ouro, +35% XP, +70% Ímã",
        "description": "NOTÁVEL: O ápice do conhecimento alquímico: transforma todo abate venenoso em riqueza absoluta."
      },
      {
        "id": "alch_tra_6",
        "classId": "plague_alchemist",
        "name": "Crisopeia Real",
        "branch": "transmutation",
        "tier": "minor",
        "x": 860,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_tra_not"
        ],
        "stats": {
          "goldMult": 0.6,
          "xpMult": 0.4
        },
        "icon": "💰",
        "badge": "TRANSMUTAÇÃO",
        "statText": "+60% Ouro, +40% XP",
        "description": "Transmuta metais vis em ouro ancestral refinado."
      },
      {
        "id": "alch_tra_7",
        "classId": "plague_alchemist",
        "name": "Vórtice Alquímico",
        "branch": "transmutation",
        "tier": "minor",
        "x": 940,
        "y": 1340,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_tra_not"
        ],
        "stats": {
          "magnetRadius": 1,
          "speedMult": 0.1
        },
        "icon": "🧲",
        "badge": "UTILIDADE",
        "statText": "+100% Raio de Ímã, +10% Velocidade",
        "description": "Recolhimento instantâneo de todas as gemas da partida."
      },
      {
        "id": "alch_tra_key",
        "classId": "plague_alchemist",
        "name": "Pedra Filosofal da Peste",
        "branch": "transmutation",
        "tier": "keystone",
        "x": 900,
        "y": 1460,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "alch_tra_6",
          "alch_tra_7"
        ],
        "stats": {
          "goldMult": 1,
          "xpMult": 0.6,
          "philosophersPlague": true
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+100% Ouro, +60% XP, Pedra Filosofal",
        "description": "PEDRA ANGULAR: Monstros mortos sob efeito de veneno possuem 35% de chance de dropar Éter e Ouro duplicados!"
      },
      {
        "id": "alch_apo_1",
        "classId": "plague_alchemist",
        "name": "Elixir Estimulante",
        "branch": "apothecary",
        "tier": "minor",
        "x": 780,
        "y": 900,
        "cost": 30,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "maxHp": 30,
          "speedMult": 0.08
        },
        "icon": "🧬",
        "badge": "ELIXIR",
        "statText": "+30 HP Máximo, +8% Velocidade",
        "description": "Dose controlada de veneno que aguça os sentidos e a velocidade."
      },
      {
        "id": "alch_apo_2",
        "classId": "plague_alchemist",
        "name": "Imunidade Toxicólogica",
        "branch": "apothecary",
        "tier": "minor",
        "x": 700,
        "y": 840,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_apo_1"
        ],
        "stats": {
          "armor": 1.5,
          "maxHp": 35
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+1.5 Armadura, +35 HP Máximo",
        "description": "Antídotos ingeridos reforçam a pele e os tecidos vitais."
      },
      {
        "id": "alch_apo_3",
        "classId": "plague_alchemist",
        "name": "Soro da Regeneração",
        "branch": "apothecary",
        "tier": "minor",
        "x": 700,
        "y": 960,
        "cost": 50,
        "reqBranchCount": 0,
        "connects": [
          "alch_apo_1"
        ],
        "stats": {
          "hpRegen": 0.8,
          "maxHp": 25
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+0.8 HP Regen/s, +25 HP Máximo",
        "description": "Bactérias benéficas reconstroem feridas durante a caminhada."
      },
      {
        "id": "alch_apo_4",
        "classId": "plague_alchemist",
        "name": "Sangue Acidificado",
        "branch": "apothecary",
        "tier": "minor",
        "x": 620,
        "y": 800,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_apo_2"
        ],
        "stats": {
          "thornsReflection": 25,
          "armor": 2
        },
        "icon": "🌵",
        "badge": "RETALIAÇÃO",
        "statText": "+25 Espinhos Ácidos, +2.0 Armadura",
        "description": "Monstros que golpeiam o alquimista são corroídos pelo sangue ácido."
      },
      {
        "id": "alch_apo_5",
        "classId": "plague_alchemist",
        "name": "Fórmula de Lázaro",
        "branch": "apothecary",
        "tier": "minor",
        "x": 620,
        "y": 1000,
        "cost": 80,
        "reqBranchCount": 0,
        "connects": [
          "alch_apo_3"
        ],
        "stats": {
          "hpRegen": 1.5,
          "maxHp": 50
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+1.5 HP Regen/s, +50 HP Máximo",
        "description": "Regeneração espantosa mesmo sob condições extremas de combate."
      },
      {
        "id": "alch_apo_not",
        "classId": "plague_alchemist",
        "name": "Apotecário da Meia-Noite",
        "branch": "apothecary",
        "tier": "notable",
        "x": 560,
        "y": 900,
        "cost": 160,
        "reqBranchCount": 2,
        "connects": [
          "alch_apo_4",
          "alch_apo_5"
        ],
        "stats": {
          "maxHp": 90,
          "hpRegen": 2.2,
          "armor": 3.5
        },
        "icon": "🧬",
        "badge": "NOTÁVEL",
        "statText": "+90 HP Máx, +2.2 HP Regen, +3.5 Armadura",
        "description": "NOTÁVEL: Uma constituição química mutante resistente a todos os flagelos da morte."
      },
      {
        "id": "alch_apo_6",
        "classId": "plague_alchemist",
        "name": "Mutação Quimérica",
        "branch": "apothecary",
        "tier": "minor",
        "x": 460,
        "y": 860,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_apo_not"
        ],
        "stats": {
          "armor": 4,
          "thornsReflection": 40
        },
        "icon": "🛡️",
        "badge": "DEFESA",
        "statText": "+4.0 Armadura, +40 Espinhos Ácidos",
        "description": "Pele quitinosa endurecida como o casco de escorpiões da peste."
      },
      {
        "id": "alch_apo_7",
        "classId": "plague_alchemist",
        "name": "Elixir da Vida Eterna",
        "branch": "apothecary",
        "tier": "minor",
        "x": 460,
        "y": 940,
        "cost": 260,
        "reqBranchCount": 3,
        "connects": [
          "alch_apo_not"
        ],
        "stats": {
          "hpRegen": 3.5,
          "maxHp": 100
        },
        "icon": "🌿",
        "badge": "REGENERAÇÃO",
        "statText": "+3.5 HP Regen/s, +100 HP Máximo",
        "description": "Fluxo incessante de cura biológica no sangue do herói."
      },
      {
        "id": "alch_apo_key",
        "classId": "plague_alchemist",
        "name": "Elixir da Imortalidade Tóxica",
        "branch": "apothecary",
        "tier": "keystone",
        "x": 340,
        "y": 900,
        "cost": 550,
        "reqBranchCount": 4,
        "connects": [
          "alch_apo_6",
          "alch_apo_7"
        ],
        "stats": {
          "maxHp": 180,
          "hpRegen": 5.5,
          "armor": 5
        },
        "icon": "👑",
        "badge": "KEYSTONE",
        "statText": "+180 HP, +5.5 HP Regen/s, +5 Armadura",
        "description": "PEDRA ANGULAR: O corpo atinge simbiose perfeita com as toxinas: regeneração e vitalidade perpétuas!"
      },
      {
        "id": "alch_bridge_NW",
        "classId": "plague_alchemist",
        "name": "Ácido Volátil",
        "branch": "miasma",
        "tier": "minor",
        "x": 740,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "alch_mia_2",
          "alch_vol_2"
        ],
        "stats": {
          "plagueAreaBonus": 20,
          "extraProjectiles": 1
        },
        "icon": "🧪",
        "badge": "SINERGIA",
        "statText": "+20 Raio Miasma, +1 Frasco",
        "description": "Ponte: Múltiplos frascos que espalham poças venenosas gigantescas."
      },
      {
        "id": "alch_bridge_NE",
        "classId": "plague_alchemist",
        "name": "Vidro Transmutado",
        "branch": "volatiles",
        "tier": "minor",
        "x": 1060,
        "y": 740,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "alch_vol_3",
          "alch_tra_2"
        ],
        "stats": {
          "goldMult": 0.25,
          "critChance": 0.08
        },
        "icon": "💰",
        "badge": "SINERGIA",
        "statText": "+25% Ouro, +8% Chance Crítica",
        "description": "Ponte: Críticos químicos convertem monstros diretamente em pepitas."
      },
      {
        "id": "alch_bridge_SE",
        "classId": "plague_alchemist",
        "name": "Soro Dourado",
        "branch": "transmutation",
        "tier": "minor",
        "x": 1060,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "alch_tra_3",
          "alch_apo_3"
        ],
        "stats": {
          "maxHp": 45,
          "magnetRadius": 0.4
        },
        "icon": "❤️",
        "badge": "SINERGIA",
        "statText": "+45 HP Máximo, +40% Raio Ímã",
        "description": "Ponte: Saúde sustentada pela rápida atração de tesouros."
      },
      {
        "id": "alch_bridge_SW",
        "classId": "plague_alchemist",
        "name": "Carapaça Ácida",
        "branch": "apothecary",
        "tier": "minor",
        "x": 740,
        "y": 1060,
        "cost": 95,
        "reqBranchCount": 0,
        "connects": [
          "alch_apo_2",
          "alch_mia_3"
        ],
        "stats": {
          "armor": 2,
          "damageMult": 0.15
        },
        "icon": "🛡️",
        "badge": "SINERGIA",
        "statText": "+2.0 Armadura, +15% Dano Veneno",
        "description": "Ponte: Couraça protetora que potencializa a densidade das toxinas."
      }
    ]
  }
};

  class SkillTreeEngine {
    constructor() {
      this.trees = CLASS_SKILL_TREES;
      this.nodeMap = new Map();
      this.adjacency = new Map();
      
      // Index all nodes across all class trees
      for (const [classId, tree] of Object.entries(this.trees)) {
        tree.nodes.forEach(node => {
          this.nodeMap.set(node.id, node);
        });
      }
      this.buildAdjacency();
    }

    buildAdjacency() {
      this.adjacency = new Map();
      this.nodeMap.forEach((node, id) => {
        this.adjacency.set(id, new Set());
      });
      this.nodeMap.forEach(node => {
        if (node.connects) {
          node.connects.forEach(targetId => {
            if (this.nodeMap.has(targetId)) {
              this.adjacency.get(node.id).add(targetId);
              this.adjacency.get(targetId).add(node.id);
            }
          });
        }
      });
    }

    getClassTree(classId = 'knight') {
      return this.trees[classId] || this.trees['knight'];
    }

    getAllClassTrees() {
      return this.trees;
    }

    getOriginNodeId(classId = 'knight') {
      const tree = this.getClassTree(classId);
      return tree.originId || (classId + '_orig');
    }

    getNode(nodeId, classId = null) {
      if (!nodeId) return null;
      return this.nodeMap.get(nodeId) || null;
    }

    getAllNodes(classId = 'knight') {
      const tree = this.getClassTree(classId);
      return tree ? tree.nodes : [];
    }

    getBranches(classId = 'knight') {
      const tree = this.getClassTree(classId);
      return tree ? tree.branches : {};
    }

    getBranchAllocatedCount(branchId, allocatedSet, classId = 'knight') {
      let count = 0;
      const nodes = this.getAllNodes(classId);
      nodes.forEach(n => {
        if (n.branch === branchId && allocatedSet.has(n.id) && n.tier !== 'origin') {
          count++;
        }
      });
      return count;
    }

    canUnlock(nodeId, allocatedSet, classId = 'knight') {
      if (allocatedSet.has(nodeId)) return false;
      const node = this.getNode(nodeId, classId);
      if (!node) return false;

      const originId = this.getOriginNodeId(classId);
      if (nodeId === originId) return true;

      // Check adjacency to an already allocated neighbor node
      const neighbors = this.adjacency.get(nodeId);
      let hasNeighbor = false;
      if (neighbors) {
        for (const nId of neighbors) {
          if (allocatedSet.has(nId)) {
            hasNeighbor = true;
            break;
          }
        }
      }
      if (!hasNeighbor) return false;

      // Check branch requirement count if defined
      if (node.reqBranchCount && node.reqBranchCount > 0) {
        const count = this.getBranchAllocatedCount(node.branch, allocatedSet, classId);
        if (count < node.reqBranchCount) return false;
      }

      return true;
    }

    calculateCumulativeBonuses(allocatedArray, classId = 'knight') {
      const allocatedSet = new Set(allocatedArray || []);
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
        // Class specialized stats
        swordBoost: 0,
        bowPierce: 0,
        fireExplosion: 0,
        holyAuraBonus: 0,
        plagueAreaBonus: 0,
        thornsReflection: 0,
        // Keystones
        colossusPact: false,
        shockwaveOnCrit: false,
        windSurge: false,
        purgatoryFire: false,
        phoenixRebirth: false,
        celestialHalo: false,
        holyRetribution: false,
        causticSea: false,
        philosophersPlague: false
      };

      allocatedSet.forEach(nodeId => {
        const node = this.getNode(nodeId, classId);
        if (!node || !node.stats) return;
        const s = node.stats;
        for (const [key, val] of Object.entries(s)) {
          if (typeof val === 'number') {
            bonuses[key] = (bonuses[key] || 0) + val;
          } else if (typeof val === 'boolean') {
            bonuses[key] = val;
          }
        }
      });

      return bonuses;
    }

    calculateTotalSpentGold(allocatedArray, classId = 'knight') {
      let total = 0;
      (allocatedArray || []).forEach(nodeId => {
        const node = this.getNode(nodeId, classId);
        if (node && node.cost) {
          total += node.cost;
        }
      });
      return total;
    }
  }

  window.MedievalSurvivors = window.MedievalSurvivors || {};
  window.MedievalSurvivors.skillTreeEngine = new SkillTreeEngine();
  window.MedievalSurvivors.CLASS_SKILL_TREES = CLASS_SKILL_TREES;
})();

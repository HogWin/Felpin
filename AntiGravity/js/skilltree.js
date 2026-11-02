/**
 * The Fallen Kingdom - Árvores de Habilidades & Talentos Específicas por Personagem
 * Cada classe possui sua própria constelação de talentos dedicada, com bônus e keystones cruciais.
 * Todas as árvores são acessíveis na mesma página através de botões de alternância.
 */
(function() {
  'use strict';

  const CLASS_SKILL_TREES = {
  "knight": {
    "id": "knight",
    "name": "Cavaleiro Real",
    "subtitle": "Bastião da Cidadela, Armadura & Maestria com Espadas",
    "icon": "🛡️",
    "color": "#f1c40f",
    "originId": "knight_orig",
    "branches": {
      "fortress": {
        "id": "fortress",
        "name": "Fortaleza de Aço",
        "color": "#e74c3c",
        "icon": "🛡️",
        "subtitle": "Armadura Pesada, Escudo & Redução de Dano"
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
      }
    },
    "nodes": [
      {
        "id": "knight_orig",
        "classId": "knight",
        "name": "Coração de Aço",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Cavaleiro Real",
        "description": "O juramento sagrado do Cavaleiro de Valoria: proteger os indefesos com escudo inquebrável e lâmina nobre."
      },
      {
        "id": "knight_fortress_1",
        "classId": "knight",
        "name": "Placas Reforçadas",
        "branch": "fortress",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "armor": 1.0
        },
        "statText": "+1 de Armadura",
        "description": "Forja de ferro nobre concede defesa física básica."
      },
      {
        "id": "knight_fortress_2",
        "classId": "knight",
        "name": "Malha Entrelaçada",
        "branch": "fortress",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_fortress_1"
        ],
        "stats": {
          "armor": 0.5,
          "maxHp": 10
        },
        "statText": "+0.5 Armadura, +10 HP Máximo",
        "description": "Reduz ferimentos e absorve o impacto de golpes de monstros."
      },
      {
        "id": "knight_fortress_3",
        "classId": "knight",
        "name": "Guarda Sagrada",
        "branch": "fortress",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_fortress_1"
        ],
        "stats": {
          "maxHp": 15,
          "hpRegen": 0.3
        },
        "statText": "+15 HP Máximo, +0.3 HP Regen/s",
        "description": "A fé dos ancestrais renova o fôlego do combatente."
      },
      {
        "id": "knight_fortress_not",
        "classId": "knight",
        "name": "Bastião Impenetrável",
        "branch": "fortress",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "knight_fortress_2",
          "knight_fortress_3"
        ],
        "stats": {
          "armor": 2.5,
          "maxHp": 25
        },
        "statText": "+2.5 Armadura, +25 HP Máximo",
        "description": "NOTÁVEL: Uma muralha viva capaz de suportar as investidas dos maiores colossos."
      },
      {
        "id": "knight_fortress_key",
        "classId": "knight",
        "name": "Fortaleza Imóvel",
        "branch": "fortress",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "knight_fortress_not"
        ],
        "stats": {
          "armor": 6.0,
          "maxHp": 60,
          "colossusPact": true
        },
        "statText": "+6 Armadura, +60 HP Máximo, Barreira Sacra",
        "description": "PEDRA ANGULAR: Reduz todo o dano físico sofrido em 35% e concede imunidade a atordoamento."
      },
      {
        "id": "knight_blades_1",
        "classId": "knight",
        "name": "Lâmina Afiada",
        "branch": "blades",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "damageMult": 0.08,
          "swordBoost": 0.1
        },
        "statText": "+8% Dano com Espadas",
        "description": "Afiação de elite amplia os arcos cortantes da espada."
      },
      {
        "id": "knight_blades_2",
        "classId": "knight",
        "name": "Arco Amplo",
        "branch": "blades",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_blades_1"
        ],
        "stats": {
          "areaMult": 0.15
        },
        "statText": "+15% Área de Corte da Espada",
        "description": "Varredura ampla decepa hordas inteiras à sua frente."
      },
      {
        "id": "knight_blades_3",
        "classId": "knight",
        "name": "Peso do Aço",
        "branch": "blades",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_blades_1"
        ],
        "stats": {
          "damageMult": 0.1,
          "critChance": 0.05
        },
        "statText": "+10% Dano Global, +5% Chance Crítica",
        "description": "Golpes pesados encontram as fraquezas dos monstros."
      },
      {
        "id": "knight_blades_not",
        "classId": "knight",
        "name": "Vendaval de Aço",
        "branch": "blades",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "knight_blades_2",
          "knight_blades_3"
        ],
        "stats": {
          "areaMult": 0.25,
          "damageMult": 0.2,
          "swordBoost": 0.2
        },
        "statText": "+25% Área e +20% Dano de Espadas",
        "description": "NOTÁVEL: Cada golpe de espada cria um vácuo mortal de cortes em cadeia."
      },
      {
        "id": "knight_blades_key",
        "classId": "knight",
        "name": "Corte do Juízo Real",
        "branch": "blades",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "knight_blades_not"
        ],
        "stats": {
          "critDamage": 0.4,
          "shockwaveOnCrit": true
        },
        "statText": "Ondas de Choque Sagradas & +40% Dano Crítico",
        "description": "PEDRA ANGULAR: Golpes de espada desferem ondas de choque sagradas que aniquilam monstros distantes."
      },
      {
        "id": "knight_vitality_1",
        "classId": "knight",
        "name": "Vigor Nobre",
        "branch": "vitality",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "knight_orig"
        ],
        "stats": {
          "maxHp": 15
        },
        "statText": "+15 HP Máximo",
        "description": "Linhagem real de guerreiros lendários."
      },
      {
        "id": "knight_vitality_2",
        "classId": "knight",
        "name": "Determinação",
        "branch": "vitality",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_vitality_1"
        ],
        "stats": {
          "hpRegen": 0.4
        },
        "statText": "+0.4 HP Regen/s",
        "description": "Regeneração celular constante mesmo no calor da batalha."
      },
      {
        "id": "knight_vitality_3",
        "classId": "knight",
        "name": "Vontade Inabalável",
        "branch": "vitality",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "knight_vitality_1"
        ],
        "stats": {
          "maxHp": 20,
          "speedMult": 0.05
        },
        "statText": "+20 HP Máximo, +5% Vel. Movimento",
        "description": "Determinação que impede o colapso nas horas mais sombrias."
      },
      {
        "id": "knight_vitality_not",
        "classId": "knight",
        "name": "Sangue dos Campeões",
        "branch": "vitality",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "knight_vitality_2",
          "knight_vitality_3"
        ],
        "stats": {
          "maxHp": 40,
          "hpRegen": 0.6
        },
        "statText": "+40 HP Máximo, +0.6 HP Regen/s",
        "description": "NOTÁVEL: Vitalidade lendária capaz de suportar as catacumbas mais profundas."
      },
      {
        "id": "knight_vitality_key",
        "classId": "knight",
        "name": "Segundo Fôlego",
        "branch": "vitality",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "knight_vitality_not"
        ],
        "stats": {
          "maxHp": 50,
          "secondWind": true
        },
        "statText": "Cura de Emergência de 50% HP & Vigor Eterno",
        "description": "PEDRA ANGULAR: Ao cair abaixo de 30% de vida, regenera 50% do HP instantaneamente (uma vez por run)."
      }
    ]
  },
  "ranger": {
    "id": "ranger",
    "name": "Arqueira das Sombras",
    "subtitle": "Patrulheira dos Bosques Malditos, Perfuração & Cadência",
    "icon": "🏹",
    "color": "#2ecc71",
    "originId": "ranger_orig",
    "branches": {
      "ballistics": {
        "id": "ballistics",
        "name": "Balística Sombria",
        "color": "#27ae60",
        "icon": "🎯",
        "subtitle": "Projéteis Múltiplos, Perfuração & Velocidade"
      },
      "sniping": {
        "id": "sniping",
        "name": "Pontaria Cirúrgica",
        "color": "#16a085",
        "icon": "🏹",
        "subtitle": "Acertos Críticos, Dano à Distância & Estilhaços"
      },
      "wind": {
        "id": "wind",
        "name": "Passos do Vento",
        "color": "#2ecc71",
        "icon": "💨",
        "subtitle": "Velocidade Tática, Esquiva & Coleta Sombria"
      }
    },
    "nodes": [
      {
        "id": "ranger_orig",
        "classId": "ranger",
        "name": "Olho de Falcão",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Arqueira das Sombras",
        "description": "Visão além do alcance: a Patrulheira das Sombras rastreia presas na escuridão sem jamais errar um disparo."
      },
      {
        "id": "ranger_ballistics_1",
        "classId": "ranger",
        "name": "Disparos Rápidos",
        "branch": "ballistics",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "cooldownReduc": 0.08
        },
        "statText": "-8% Tempo de Recarga da Besta",
        "description": "Mecanismo de repetição forjado pelos elfos silvestres."
      },
      {
        "id": "ranger_ballistics_2",
        "classId": "ranger",
        "name": "Flecha Transpassante",
        "branch": "ballistics",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_ballistics_1"
        ],
        "stats": {
          "bowPierce": 1,
          "damageMult": 0.05
        },
        "statText": "Projéteis perfuram +1 alvo adicional",
        "description": "Pontas de aço negro atravessam escudos e armaduras."
      },
      {
        "id": "ranger_ballistics_3",
        "classId": "ranger",
        "name": "Tensão do Arco",
        "branch": "ballistics",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_ballistics_1"
        ],
        "stats": {
          "damageMult": 0.08,
          "projSpeed": 0.15
        },
        "statText": "+15% Velocidade de Projétil, +8% Dano",
        "description": "Disparos supersônicos que não dão tempo de reação aos monstros."
      },
      {
        "id": "ranger_ballistics_not",
        "classId": "ranger",
        "name": "Chuva de Flechas",
        "branch": "ballistics",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "ranger_ballistics_2",
          "ranger_ballistics_3"
        ],
        "stats": {
          "extraProjectiles": 1
        },
        "statText": "+1 Projétil Adicional permanente",
        "description": "NOTÁVEL: Cada disparo dispara um dardo adicional em leque."
      },
      {
        "id": "ranger_ballistics_key",
        "classId": "ranger",
        "name": "Salva Infinita",
        "branch": "ballistics",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "ranger_ballistics_not"
        ],
        "stats": {
          "extraProjectiles": 2,
          "bowPierce": 3
        },
        "statText": "+2 Projéteis Adicionais & Perfuração Total",
        "description": "PEDRA ANGULAR: Dispara 2 projéteis extras que perfuram até 3 inimigos sem perder força."
      },
      {
        "id": "ranger_sniping_1",
        "classId": "ranger",
        "name": "Foco Mortal",
        "branch": "sniping",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "critChance": 0.06
        },
        "statText": "+6% Chance de Acerto Crítico",
        "description": "Cálculo milimétrico da trajetória do disparo."
      },
      {
        "id": "ranger_sniping_2",
        "classId": "ranger",
        "name": "Ponta Farpada",
        "branch": "sniping",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sniping_1"
        ],
        "stats": {
          "critDamage": 0.3
        },
        "statText": "+30% Dano de Acerto Crítico",
        "description": "Fisgas de metal dilaceram carne e ossos no impacto."
      },
      {
        "id": "ranger_sniping_3",
        "classId": "ranger",
        "name": "Alvo Marcado",
        "branch": "sniping",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_sniping_1"
        ],
        "stats": {
          "critChance": 0.08,
          "damageMult": 0.1
        },
        "statText": "+8% Chance Crítica, +10% Dano",
        "description": "Monstros marcados recebem dano devastador."
      },
      {
        "id": "ranger_sniping_not",
        "classId": "ranger",
        "name": "Tiro no Coração",
        "branch": "sniping",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "ranger_sniping_2",
          "ranger_sniping_3"
        ],
        "stats": {
          "critChance": 0.15,
          "critDamage": 0.45
        },
        "statText": "+15% Chance Crítica, +45% Dano Crítico",
        "description": "NOTÁVEL: Acertos críticos se tornam rotina letal no campo de batalha."
      },
      {
        "id": "ranger_sniping_key",
        "classId": "ranger",
        "name": "Balística Estilhaçante",
        "branch": "sniping",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "ranger_sniping_not"
        ],
        "stats": {
          "critDamage": 0.5,
          "shockwaveOnCrit": true
        },
        "statText": "Explosões de Estilhaços nos Críticos",
        "description": "PEDRA ANGULAR: Flechas críticas explodem em estilhaços perfurantes causando 120% dano em área."
      },
      {
        "id": "ranger_wind_1",
        "classId": "ranger",
        "name": "Passos Ligeiros",
        "branch": "wind",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "ranger_orig"
        ],
        "stats": {
          "speedMult": 0.08
        },
        "statText": "+8% Velocidade de Movimento",
        "description": "Passadas silenciosas como a brisa entre as árvores."
      },
      {
        "id": "ranger_wind_2",
        "classId": "ranger",
        "name": "Ímã Silvestre",
        "branch": "wind",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_wind_1"
        ],
        "stats": {
          "magnetRadius": 0.25
        },
        "statText": "+25% Raio de Coleta de XP",
        "description": "O vento atrai essências e almas caídas para o herói."
      },
      {
        "id": "ranger_wind_3",
        "classId": "ranger",
        "name": "Instinto Selvagem",
        "branch": "wind",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "ranger_wind_1"
        ],
        "stats": {
          "speedMult": 0.08,
          "cooldownReduc": 0.06
        },
        "statText": "+8% Velocidade, -6% Recarga",
        "description": "Reflexos aguçados de sobrevivente das florestas."
      },
      {
        "id": "ranger_wind_not",
        "classId": "ranger",
        "name": "Vento Veloz",
        "branch": "wind",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "ranger_wind_2",
          "ranger_wind_3"
        ],
        "stats": {
          "speedMult": 0.15,
          "xpMult": 0.15
        },
        "statText": "+15% Velocidade de Movimento, +15% XP",
        "description": "NOTÁVEL: Permite reposicionamento veloz constante no combate."
      },
      {
        "id": "ranger_wind_key",
        "classId": "ranger",
        "name": "Dança das Sombras",
        "branch": "wind",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "ranger_wind_not"
        ],
        "stats": {
          "speedMult": 0.2,
          "windSurge": true
        },
        "statText": "+20% Vel. Movimento & Surto Mortal",
        "description": "PEDRA ANGULAR: Concede velocidade contínua extrema; abater monstros ativa surto de +35% velocidade."
      }
    ]
  },
  "pyromancer": {
    "id": "pyromancer",
    "name": "Feiticeiro das Cinzas",
    "subtitle": "Mestre da Chama Purificadora, Bombardeios & Incineração",
    "icon": "🔥",
    "color": "#e67e22",
    "originId": "pyromancer_orig",
    "branches": {
      "cataclysm": {
        "id": "cataclysm",
        "name": "Cataclismo de Fogo",
        "color": "#d35400",
        "icon": "🌋",
        "subtitle": "Dano de Fogo, Área Gigantesca & Purgatório"
      },
      "haste": {
        "id": "haste",
        "name": "Haste Arcana",
        "color": "#e67e22",
        "icon": "⚡",
        "subtitle": "Redução Drástica de Recarga & Salvas de Magia"
      },
      "alchemy": {
        "id": "alchemy",
        "name": "Alquimia das Cinzas",
        "color": "#f39c12",
        "icon": "⚗️",
        "subtitle": "Ouro das Brasas, Absorção Espiritual & Renascimento"
      }
    },
    "nodes": [
      {
        "id": "pyromancer_orig",
        "classId": "pyromancer",
        "name": "Centelha Primordial",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Feiticeiro das Cinzas",
        "description": "O calor infinito da forja cósmica arde nas veias do Feiticeiro das Cinzas, aguardando o momento da erupção."
      },
      {
        "id": "pyromancer_cataclysm_1",
        "classId": "pyromancer",
        "name": "Cinzas Ardentes",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "damageMult": 0.1,
          "fireExplosion": 0.12
        },
        "statText": "+10% Dano de Fogo & Chamas",
        "description": "Chamas arcanas consomem matéria viva instantaneamente."
      },
      {
        "id": "pyromancer_cataclysm_2",
        "classId": "pyromancer",
        "name": "Labareda Expansiva",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_cataclysm_1"
        ],
        "stats": {
          "areaMult": 0.18
        },
        "statText": "+18% Área de Impacto do Fogo",
        "description": "Explosões maiores engolem mais monstros a cada frasco arremessado."
      },
      {
        "id": "pyromancer_cataclysm_3",
        "classId": "pyromancer",
        "name": "Calor Infernal",
        "branch": "cataclysm",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_cataclysm_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "burnDuration": 0.12
        },
        "statText": "+15% Dano de Fogo, +12% Duração",
        "description": "O solo permanece em brasa, incinerando quem ousar pisar."
      },
      {
        "id": "pyromancer_cataclysm_not",
        "classId": "pyromancer",
        "name": "Supernova Arcana",
        "branch": "cataclysm",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "pyromancer_cataclysm_2",
          "pyromancer_cataclysm_3"
        ],
        "stats": {
          "areaMult": 0.3,
          "damageMult": 0.25,
          "fireExplosion": 0.25
        },
        "statText": "+30% Área e +25% Dano de Fogo",
        "description": "NOTÁVEL: As poças e explosões de fogo dobram de tamanho e poder de destruição."
      },
      {
        "id": "pyromancer_cataclysm_key",
        "classId": "pyromancer",
        "name": "Fogo do Purgatório",
        "branch": "cataclysm",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "pyromancer_cataclysm_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "areaMult": 0.25,
          "purgatoryFire": true
        },
        "statText": "Poças de Fogo Eterno com Vórtice Gravitacional",
        "description": "PEDRA ANGULAR: Chamas purificadoras atraem inimigos para o vórtice e causam dano contínuo triplo."
      },
      {
        "id": "pyromancer_haste_1",
        "classId": "pyromancer",
        "name": "Canalização Veloz",
        "branch": "haste",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "cooldownReduc": 0.08
        },
        "statText": "-8% Tempo de Recarga Global",
        "description": "Gestos e encantamentos executados com fluidez sobrenatural."
      },
      {
        "id": "pyromancer_haste_2",
        "classId": "pyromancer",
        "name": "Ímpeto da Pira",
        "branch": "haste",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_haste_1"
        ],
        "stats": {
          "cooldownReduc": 0.08,
          "damageMult": 0.05
        },
        "statText": "-8% Recarga, +10% Vel. Ataque",
        "description": "Ritmo acelerado de conjuração contínua."
      },
      {
        "id": "pyromancer_haste_3",
        "classId": "pyromancer",
        "name": "Fluxo Ardente",
        "branch": "haste",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_haste_1"
        ],
        "stats": {
          "cooldownReduc": 0.1,
          "magnetRadius": 0.1
        },
        "statText": "-10% Recarga, +10% Raio de Coleta",
        "description": "A energia mágica reverbera ao redor do feiticeiro."
      },
      {
        "id": "pyromancer_haste_not",
        "classId": "pyromancer",
        "name": "Sobrecarga Mágica",
        "branch": "haste",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "pyromancer_haste_2",
          "pyromancer_haste_3"
        ],
        "stats": {
          "cooldownReduc": 0.16
        },
        "statText": "-16% Tempo de Recarga Global",
        "description": "NOTÁVEL: Magias e frascos são lançados em ritmo frenético incessante."
      },
      {
        "id": "pyromancer_haste_key",
        "classId": "pyromancer",
        "name": "Ignição em Cadeia",
        "branch": "haste",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "pyromancer_haste_not"
        ],
        "stats": {
          "cooldownReduc": 0.12,
          "chainIgnite": true
        },
        "statText": "Detonação de Cadáveres Incinerados",
        "description": "PEDRA ANGULAR: Monstros mortos por fogo explodem em uma reação em cadeia espalhando mais chamas."
      },
      {
        "id": "pyromancer_alchemy_1",
        "classId": "pyromancer",
        "name": "Brasas Áureas",
        "branch": "alchemy",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_orig"
        ],
        "stats": {
          "goldMult": 0.12
        },
        "statText": "+12% Ganho de Ouro",
        "description": "Transforma poeira de monstros em ouro puro."
      },
      {
        "id": "pyromancer_alchemy_2",
        "classId": "pyromancer",
        "name": "Chama Sábia",
        "branch": "alchemy",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_alchemy_1"
        ],
        "stats": {
          "xpMult": 0.12
        },
        "statText": "+12% Ganho de Experiência",
        "description": "Sabedoria ancestral extraída da queima das almas."
      },
      {
        "id": "pyromancer_alchemy_3",
        "classId": "pyromancer",
        "name": "Escudo Térmico",
        "branch": "alchemy",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "pyromancer_alchemy_1"
        ],
        "stats": {
          "maxHp": 15,
          "armor": 1.0
        },
        "statText": "+15 HP Máximo, +1 Armadura",
        "description": "Barreira de ar quente que desvia golpes inimigos."
      },
      {
        "id": "pyromancer_alchemy_not",
        "classId": "pyromancer",
        "name": "Transmutação Solar",
        "branch": "alchemy",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "pyromancer_alchemy_2",
          "pyromancer_alchemy_3"
        ],
        "stats": {
          "goldMult": 0.25,
          "xpMult": 0.18
        },
        "statText": "+25% Ouro, +18% XP",
        "description": "NOTÁVEL: Riqueza e experiência aceleradas em cada expedição."
      },
      {
        "id": "pyromancer_alchemy_key",
        "classId": "pyromancer",
        "name": "Fênix Imortal",
        "branch": "alchemy",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "pyromancer_alchemy_not"
        ],
        "stats": {
          "maxHp": 30,
          "phoenixRebirth": true
        },
        "statText": "Renascimento das Cinzas com 50% HP",
        "description": "PEDRA ANGULAR: Ao sofrer golpe fatal, aniquila monstros em 360° e renasce imediatamente com metade da vida."
      }
    ]
  },
  "paladin": {
    "id": "paladin",
    "name": "Paladino da Alvorada",
    "subtitle": "Campeão da Luz Sagrada, Aura Devastadora & Regeneração",
    "icon": "✨",
    "color": "#f39c12",
    "originId": "paladin_orig",
    "branches": {
      "radiance": {
        "id": "radiance",
        "name": "Aura da Santidade",
        "color": "#f1c40f",
        "icon": "✨",
        "subtitle": "Expansão da Aura, Dano Sagrado & Vaporização"
      },
      "grace": {
        "id": "grace",
        "name": "Graça da Vida",
        "color": "#2ecc71",
        "icon": "🕊️",
        "subtitle": "Regeneração Contínua de HP & Santificação"
      },
      "protection": {
        "id": "protection",
        "name": "Escudo dos Deuses",
        "color": "#3498db",
        "icon": "🛡️",
        "subtitle": "Armadura Divina, Retribuição & Resiliência"
      }
    },
    "nodes": [
      {
        "id": "paladin_orig",
        "classId": "paladin",
        "name": "Cálice da Alvorada",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Paladino da Alvorada",
        "description": "O receptáculo sagrado dos sacerdotes solares. A luz eterna emana do Paladino, purificando as trevas."
      },
      {
        "id": "paladin_radiance_1",
        "classId": "paladin",
        "name": "Expansão Sacra",
        "branch": "radiance",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "areaMult": 0.15,
          "holyAuraBonus": 0.12
        },
        "statText": "+15% Raio da Aura Sagrada",
        "description": "O halo luminoso do Paladino abrange uma área maior do solo sagrado."
      },
      {
        "id": "paladin_radiance_2",
        "classId": "paladin",
        "name": "Fervor da Fé",
        "branch": "radiance",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_radiance_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "holyAuraBonus": 0.15
        },
        "statText": "+15% Dano da Aura Sagrada",
        "description": "Luz penetrante quemina carne morta-viva em segundos."
      },
      {
        "id": "paladin_radiance_3",
        "classId": "paladin",
        "name": "Luz Purificadora",
        "branch": "radiance",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_radiance_1"
        ],
        "stats": {
          "areaMult": 0.18,
          "damageMult": 0.12
        },
        "statText": "+18% Raio, +12% Dano da Aura",
        "description": "Resplendor solar irresistível contra demônios e mortos."
      },
      {
        "id": "paladin_radiance_not",
        "classId": "paladin",
        "name": "Glória Divina",
        "branch": "radiance",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "paladin_radiance_2",
          "paladin_radiance_3"
        ],
        "stats": {
          "areaMult": 0.35,
          "damageMult": 0.3,
          "holyAuraBonus": 0.3
        },
        "statText": "+35% Raio e +30% Dano da Aura Sagrada",
        "description": "NOTÁVEL: A aura se torna um sol radiante cobrindo quase todo o campo de visão."
      },
      {
        "id": "paladin_radiance_key",
        "classId": "paladin",
        "name": "Halo Celestial",
        "branch": "radiance",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "paladin_radiance_not"
        ],
        "stats": {
          "holyAuraBonus": 0.4,
          "celestialHalo": true
        },
        "statText": "Aura Dissipa Projéteis & Dano Sagrado Duplo",
        "description": "PEDRA ANGULAR: Projéteis inimigos que entrarem na aura são desintegrados instantaneamente."
      },
      {
        "id": "paladin_grace_1",
        "classId": "paladin",
        "name": "Bênção Matinal",
        "branch": "grace",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "maxHp": 15,
          "hpRegen": 0.3
        },
        "statText": "+15 HP Máximo, +0.3 HP Regen/s",
        "description": "Cura constante alimentada pela luz da manhã."
      },
      {
        "id": "paladin_grace_2",
        "classId": "paladin",
        "name": "Oração Serena",
        "branch": "grace",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_grace_1"
        ],
        "stats": {
          "hpRegen": 0.5
        },
        "statText": "+0.5 HP Regen/s",
        "description": "Mesmo cercado por centenas de monstros, a vida se regenera."
      },
      {
        "id": "paladin_grace_3",
        "classId": "paladin",
        "name": "Sangue Santificado",
        "branch": "grace",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_grace_1"
        ],
        "stats": {
          "maxHp": 25,
          "hpRegen": 0.4
        },
        "statText": "+25 HP Máximo, +0.4 HP Regen/s",
        "description": "Corpo abençoado que não sucumbe ao veneno ou praga."
      },
      {
        "id": "paladin_grace_not",
        "classId": "paladin",
        "name": "Fonte da Imortalidade",
        "branch": "grace",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "paladin_grace_2",
          "paladin_grace_3"
        ],
        "stats": {
          "hpRegen": 1.0,
          "maxHp": 40
        },
        "statText": "+1.0 HP Regen/s, +40 HP Máximo",
        "description": "NOTÁVEL: Regeneração colossal de mais de 2.5 pontos de vida por segundo."
      },
      {
        "id": "paladin_grace_key",
        "classId": "paladin",
        "name": "Presença do Arcanjo",
        "branch": "grace",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "paladin_grace_not"
        ],
        "stats": {
          "hpRegen": 1.2,
          "archangelPulse": true
        },
        "statText": "Pulso de Cura & Dano Sagrado Global",
        "description": "PEDRA ANGULAR: A cada 6 segundos, libera um clarão sagrado que cura 10% do HP máximo e fere todos os monstros."
      },
      {
        "id": "paladin_protection_1",
        "classId": "paladin",
        "name": "Escudo de Luz",
        "branch": "protection",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "paladin_orig"
        ],
        "stats": {
          "armor": 1.5
        },
        "statText": "+1.5 Armadura",
        "description": "Energia etérea reforça a defesa do combatente sagrado."
      },
      {
        "id": "paladin_protection_2",
        "classId": "paladin",
        "name": "Armadura Solar",
        "branch": "protection",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_protection_1"
        ],
        "stats": {
          "armor": 1.5,
          "maxHp": 15
        },
        "statText": "+1.5 Armadura, +15 HP Máximo",
        "description": "Placas abençoadas que cegam quem as ataca."
      },
      {
        "id": "paladin_protection_3",
        "classId": "paladin",
        "name": "Retribuição Justa",
        "branch": "protection",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "paladin_protection_1"
        ],
        "stats": {
          "armor": 1.0,
          "damageMult": 0.1
        },
        "statText": "+1 Armadura, +10% Dano Refletido",
        "description": "O agressor sofre a punição de sua própria violência."
      },
      {
        "id": "paladin_protection_not",
        "classId": "paladin",
        "name": "Muralha do Templo",
        "branch": "protection",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "paladin_protection_2",
          "paladin_protection_3"
        ],
        "stats": {
          "armor": 3.5,
          "maxHp": 30
        },
        "statText": "+3.5 Armadura, +30 HP Máximo",
        "description": "NOTÁVEL: Defesa sólida como a catedral de pedra de Valoria."
      },
      {
        "id": "paladin_protection_key",
        "classId": "paladin",
        "name": "Vingança da Alvorada",
        "branch": "protection",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "paladin_protection_not"
        ],
        "stats": {
          "armor": 4.0,
          "holyRetribution": true
        },
        "statText": "Retaliação Sagrada de 250% Dano & Cegueira",
        "description": "PEDRA ANGULAR: Inimigos que tocam no Paladino recebem 250% de dano sagrado e ficam atordoados por 2s."
      }
    ]
  },
  "berserker": {
    "id": "berserker",
    "name": "Berserker do Norte",
    "subtitle": "Colosso das Montanhas Geladas, Fúria & Sangue",
    "icon": "🪓",
    "color": "#d35400",
    "originId": "berserker_orig",
    "branches": {
      "fury": {
        "id": "fury",
        "name": "Fúria Desenfreada",
        "color": "#c0392b",
        "icon": "🩸",
        "subtitle": "Bônus Brutal com Vida Baixa & Dano Crítico"
      },
      "axes": {
        "id": "axes",
        "name": "Tormenta de Machados",
        "color": "#e67e22",
        "icon": "🪓",
        "subtitle": "Machados Giratórios, Área Ampla & Vórtice"
      },
      "vitality": {
        "id": "vitality",
        "name": "Pele de Urso",
        "color": "#7f8c8d",
        "icon": "🐻",
        "subtitle": "Vitalidade Primitiva & Roubo de Vida"
      }
    },
    "nodes": [
      {
        "id": "berserker_orig",
        "classId": "berserker",
        "name": "Fúria Nórdica",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Berserker do Norte",
        "description": "Nas neves eternas, apenas a fúria mantém o sangue fluindo. Quanto mais ferido, mais letal o Berserker se torna."
      },
      {
        "id": "berserker_fury_1",
        "classId": "berserker",
        "name": "Fervor Selvagem",
        "branch": "fury",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "berserker_orig"
        ],
        "stats": {
          "damageMult": 0.1,
          "berserkFury": 0.1
        },
        "statText": "+10% Dano Global",
        "description": "Instinto sanguinário que amplifica a força bruta."
      },
      {
        "id": "berserker_fury_2",
        "classId": "berserker",
        "name": "Sangue Fervente",
        "branch": "fury",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_fury_1"
        ],
        "stats": {
          "damageMult": 0.12,
          "berserkFury": 0.15
        },
        "statText": "Ganha até +25% de dano conforme o HP cai",
        "description": "O sofrimento alimenta a tempestade de golpes do colosso."
      },
      {
        "id": "berserker_fury_3",
        "classId": "berserker",
        "name": "Ira Ancestral",
        "branch": "fury",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_fury_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "critChance": 0.08
        },
        "statText": "+15% Dano, +8% Chance Crítica",
        "description": "Grito de guerra que aterroriza os mortos-vivos."
      },
      {
        "id": "berserker_fury_not",
        "classId": "berserker",
        "name": "Frenesi Sangrento",
        "branch": "fury",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "berserker_fury_2",
          "berserker_fury_3"
        ],
        "stats": {
          "damageMult": 0.25,
          "critDamage": 0.35,
          "berserkFury": 0.3
        },
        "statText": "Ganha até +50% Dano e +30% Velocidade de Ataque",
        "description": "NOTÁVEL: Na beira da morte, seus machados se tornam um turbilhão ceifador."
      },
      {
        "id": "berserker_fury_key",
        "classId": "berserker",
        "name": "Berserk Colossal",
        "branch": "fury",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "berserker_fury_not"
        ],
        "stats": {
          "damageMult": 0.4,
          "colossalBerserk": true
        },
        "statText": "Dano Dobrado (+100%) Abaixo de 40% de Vida",
        "description": "PEDRA ANGULAR: Abaixo de 40% de HP, o dano dobra e a recarga é reduzida em 40%. Impossível de deter."
      },
      {
        "id": "berserker_axes_1",
        "classId": "berserker",
        "name": "Lâminas Pesadas",
        "branch": "axes",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "berserker_orig"
        ],
        "stats": {
          "damageMult": 0.12
        },
        "statText": "+12% Dano dos Machados Giratórios",
        "description": "Machados de duas mãos talhados em ferro bárbaro."
      },
      {
        "id": "berserker_axes_2",
        "classId": "berserker",
        "name": "Giro Amplo",
        "branch": "axes",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_axes_1"
        ],
        "stats": {
          "areaMult": 0.18
        },
        "statText": "+18% Área dos Machados",
        "description": "Voo circular que varre multidões inteiras."
      },
      {
        "id": "berserker_axes_3",
        "classId": "berserker",
        "name": "Vórtice Cortante",
        "branch": "axes",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_axes_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "areaMult": 0.1
        },
        "statText": "+15% Dano, +15% Velocidade de Giro",
        "description": "O ar sibila enquanto as lâminas giram no ar."
      },
      {
        "id": "berserker_axes_not",
        "classId": "berserker",
        "name": "Machados do Inverno",
        "branch": "axes",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "berserker_axes_2",
          "berserker_axes_3"
        ],
        "stats": {
          "areaMult": 0.3,
          "damageMult": 0.25
        },
        "statText": "+30% Área e +25% Dano dos Machados",
        "description": "NOTÁVEL: Os machados se tornam tempestades de ferro e gelo cortante."
      },
      {
        "id": "berserker_axes_key",
        "classId": "berserker",
        "name": "Tormenta de Sangue",
        "branch": "axes",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "berserker_axes_not"
        ],
        "stats": {
          "critChance": 0.2,
          "axeVortex": true
        },
        "statText": "Machados Puxam Inimigos & Crítico Garantido",
        "description": "PEDRA ANGULAR: Machados giratórios puxam monstros para o corte e causam acertos críticos automáticos."
      },
      {
        "id": "berserker_vitality_1",
        "classId": "berserker",
        "name": "Couro Bárbaro",
        "branch": "vitality",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "berserker_orig"
        ],
        "stats": {
          "maxHp": 20
        },
        "statText": "+20 HP Máximo",
        "description": "Resistência às nevascas e ferimentos mais brutais."
      },
      {
        "id": "berserker_vitality_2",
        "classId": "berserker",
        "name": "Ossos de Titã",
        "branch": "vitality",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_vitality_1"
        ],
        "stats": {
          "maxHp": 25,
          "armor": 1.0
        },
        "statText": "+25 HP Máximo, +1 Armadura",
        "description": "Estrutura óssea densa forjada no gelo."
      },
      {
        "id": "berserker_vitality_3",
        "classId": "berserker",
        "name": "Sede de Carnificina",
        "branch": "vitality",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "berserker_vitality_1"
        ],
        "stats": {
          "hpRegen": 0.3,
          "maxHp": 20
        },
        "statText": "+0.2 HP regenerado por inimigo abatido",
        "description": "Matar inimigos renova a energia e fecha feridas abertas."
      },
      {
        "id": "berserker_vitality_not",
        "classId": "berserker",
        "name": "Colosso dos Picos",
        "branch": "vitality",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "berserker_vitality_2",
          "berserker_vitality_3"
        ],
        "stats": {
          "maxHp": 50,
          "armor": 1.5
        },
        "statText": "+50 HP Máximo, +1.5 Armadura",
        "description": "NOTÁVEL: Estatura colossal com reservas infinitas de vitalidade."
      },
      {
        "id": "berserker_vitality_key",
        "classId": "berserker",
        "name": "Banquete Sangrento",
        "branch": "vitality",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "berserker_vitality_not"
        ],
        "stats": {
          "maxHp": 60,
          "bloodFeast": true
        },
        "statText": "Roubo de Vida Contínuo & Fúria Vampírica",
        "description": "PEDRA ANGULAR: Cada golpe acerta restaura vida e acumula velocidade de movimento temporária."
      }
    ]
  },
  "necromancer": {
    "id": "necromancer",
    "name": "Necromante das Catacumbas",
    "subtitle": "Senhor das Almas Perdidas, Exército Cadavérico & Orbes",
    "icon": "💀",
    "color": "#9b59b6",
    "originId": "necromancer_orig",
    "branches": {
      "legion": {
        "id": "legion",
        "name": "Legião das Ossadas",
        "color": "#8e44ad",
        "icon": "💀",
        "subtitle": "Limite de Servos Esqueletos & Dano dos Minions"
      },
      "spectral": {
        "id": "spectral",
        "name": "Artes Espectrais",
        "color": "#9b59b6",
        "icon": "🔮",
        "subtitle": "Dano de Orbes, Velocidade de Órbita & Almas"
      },
      "siphon": {
        "id": "siphon",
        "name": "Colheita da Morte",
        "color": "#4834d4",
        "icon": "🪦",
        "subtitle": "Ímã de Almas, Ouro Espiritual & Presença Fúnebre"
      }
    },
    "nodes": [
      {
        "id": "necromancer_orig",
        "classId": "necromancer",
        "name": "Trono de Ossos",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Necromante das Catacumbas",
        "description": "A morte não é o fim, mas sim um recomeço a serviço do Necromante. Os ossos dos mortos se curvam à sua vontade."
      },
      {
        "id": "necromancer_legion_1",
        "classId": "necromancer",
        "name": "Ossos Endurecidos",
        "branch": "legion",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_orig"
        ],
        "stats": {
          "minionHp": 0.18,
          "damageMult": 0.05
        },
        "statText": "+18% Vida dos Minions Invocados",
        "description": "Esqueletos reforçados com ferro e argamassa de sangue."
      },
      {
        "id": "necromancer_legion_2",
        "classId": "necromancer",
        "name": "Garras Fúnebres",
        "branch": "legion",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_legion_1"
        ],
        "stats": {
          "minionDamage": 0.2,
          "damageMult": 0.08
        },
        "statText": "+20% Dano de Ataque dos Servos",
        "description": "Garras espectrais que dilaceram a carne inimiga."
      },
      {
        "id": "necromancer_legion_3",
        "classId": "necromancer",
        "name": "Frenesi Necrótico",
        "branch": "legion",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_legion_1"
        ],
        "stats": {
          "minionSpeed": 0.25
        },
        "statText": "+25% Velocidade dos Servos Esqueletos",
        "description": "Minions correm ferozmente contra as ameaças mais próximas."
      },
      {
        "id": "necromancer_legion_not",
        "classId": "necromancer",
        "name": "Mestre da Horda",
        "branch": "legion",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "necromancer_legion_2",
          "necromancer_legion_3"
        ],
        "stats": {
          "minionCapBonus": 1,
          "minionDamage": 0.25
        },
        "statText": "+1 Servo Esqueleto Adicional no Limite Máximo",
        "description": "NOTÁVEL: Permite erguer mais um guerreiro esqueleto fiel permanente."
      },
      {
        "id": "necromancer_legion_key",
        "classId": "necromancer",
        "name": "Exército das Trevas",
        "branch": "legion",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "necromancer_legion_not"
        ],
        "stats": {
          "minionCapBonus": 2,
          "boneExplosion": true
        },
        "statText": "+2 Servos Esqueletos & Explosão de Ossos",
        "description": "PEDRA ANGULAR: Eleva o exército com +2 servos; ao expirar, esqueletos explodem em espinhos de ossos em área."
      },
      {
        "id": "necromancer_spectral_1",
        "classId": "necromancer",
        "name": "Orbe Fantasmagórico",
        "branch": "spectral",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_orig"
        ],
        "stats": {
          "damageMult": 0.12
        },
        "statText": "+12% Dano dos Orbes Espectrais",
        "description": "Chamas frias do além que atravessam os mortos."
      },
      {
        "id": "necromancer_spectral_2",
        "classId": "necromancer",
        "name": "Órbita Veloz",
        "branch": "spectral",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_spectral_1"
        ],
        "stats": {
          "areaMult": 0.1,
          "damageMult": 0.08
        },
        "statText": "+18% Velocidade de Rotação dos Orbes",
        "description": "Orbes giram em alta velocidade, criando uma barreira de almas."
      },
      {
        "id": "necromancer_spectral_3",
        "classId": "necromancer",
        "name": "Fagulha da Morte",
        "branch": "spectral",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_spectral_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "critChance": 0.08
        },
        "statText": "+15% Dano Sombrio, +8% Crítico",
        "description": "Energia escura que corrói o espírito dos inimigos."
      },
      {
        "id": "necromancer_spectral_not",
        "classId": "necromancer",
        "name": "Dança das Almas",
        "branch": "spectral",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "necromancer_spectral_2",
          "necromancer_spectral_3"
        ],
        "stats": {
          "extraProjectiles": 1,
          "damageMult": 0.2
        },
        "statText": "+30% Dano e +1 Orbe Espectral Adicional",
        "description": "NOTÁVEL: Mais um orbe espectral permanente orbitando o necromante."
      },
      {
        "id": "necromancer_spectral_key",
        "classId": "necromancer",
        "name": "Vórtice dos Condenados",
        "branch": "spectral",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "necromancer_spectral_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "spectralVortex": true
        },
        "statText": "Orbes Perfuram Alvos Infinitamente & Drenam Vida",
        "description": "PEDRA ANGULAR: Orbes espectrais trespassam multidões inteiras infinitamente e curam o herói a cada acerto."
      },
      {
        "id": "necromancer_siphon_1",
        "classId": "necromancer",
        "name": "Dreno de Almas",
        "branch": "siphon",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_orig"
        ],
        "stats": {
          "magnetRadius": 0.25
        },
        "statText": "+25% Raio de Coleta de Gemas de XP",
        "description": "A atração magnética das almas puxa gemas de longe."
      },
      {
        "id": "necromancer_siphon_2",
        "classId": "necromancer",
        "name": "Almas Aprisionadas",
        "branch": "siphon",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_siphon_1"
        ],
        "stats": {
          "goldMult": 0.15,
          "xpMult": 0.12
        },
        "statText": "+15% Ouro, +12% XP",
        "description": "Almas derrotadas revelam tesouros esquecidos."
      },
      {
        "id": "necromancer_siphon_3",
        "classId": "necromancer",
        "name": "Mortalha de Sombras",
        "branch": "siphon",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "necromancer_siphon_1"
        ],
        "stats": {
          "maxHp": 18,
          "hpRegen": 0.3
        },
        "statText": "+18 HP Máximo, +0.3 HP Regen/s",
        "description": "Emanação espectral que amortiza golpes físicos."
      },
      {
        "id": "necromancer_siphon_not",
        "classId": "necromancer",
        "name": "Ceifa Fúnebre",
        "branch": "siphon",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "necromancer_siphon_2",
          "necromancer_siphon_3"
        ],
        "stats": {
          "magnetRadius": 0.4,
          "goldMult": 0.2
        },
        "statText": "+40% Raio de Coleta, +20% Ouro",
        "description": "NOTÁVEL: Quase todo o ouro e gemas da tela são sugados diretamente ao herói."
      },
      {
        "id": "necromancer_siphon_key",
        "classId": "necromancer",
        "name": "Ceifador Supremo",
        "branch": "siphon",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "necromancer_siphon_not"
        ],
        "stats": {
          "magnetRadius": 0.5,
          "soulHarvester": true
        },
        "statText": "Atração de Almas Global & Dano por Gema Coletada",
        "description": "PEDRA ANGULAR: Coletar uma gema de alma atrai instantaneamente todas as gemas no raio de 350 unidades e concede bônus de dano."
      }
    ]
  },
  "assassin": {
    "id": "assassin",
    "name": "Assassino Sombrio",
    "subtitle": "Lâmina Fantasma das Catacumbas, Críticos & Evasão",
    "icon": "🗡️",
    "color": "#34495e",
    "originId": "assassin_orig",
    "branches": {
      "execution": {
        "id": "execution",
        "name": "Execução Mortal",
        "color": "#e74c3c",
        "icon": "🩸",
        "subtitle": "Chance Crítica Brutal, Multiplicador & Hemorragia"
      },
      "daggers": {
        "id": "daggers",
        "name": "Dança das Adagas",
        "color": "#c0392b",
        "icon": "🗡️",
        "subtitle": "Cadência de Adagas Gêmeas & Tempestade de Cortes"
      },
      "shadowstep": {
        "id": "shadowstep",
        "name": "Passo Fantasma",
        "color": "#2c3e50",
        "icon": "👤",
        "subtitle": "Velocidade Extrema, Evasão & Vulto das Sombras"
      }
    },
    "nodes": [
      {
        "id": "assassin_orig",
        "classId": "assassin",
        "name": "Lâmina Oculta",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Assassino Sombrio",
        "description": "O assassino nunca é visto antes do golpe final. Suas adagas gêmeas desferem o toque gélido da morte."
      },
      {
        "id": "assassin_execution_1",
        "classId": "assassin",
        "name": "Precisão Cirúrgica",
        "branch": "execution",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "assassin_orig"
        ],
        "stats": {
          "critChance": 0.1,
          "shadowCritBoost": 0.1
        },
        "statText": "+10% Chance de Acerto Crítico",
        "description": "Golpes direcionados à garganta e articulações frágeis."
      },
      {
        "id": "assassin_execution_2",
        "classId": "assassin",
        "name": "Lâmina Vorpal",
        "branch": "execution",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_execution_1"
        ],
        "stats": {
          "critDamage": 0.4
        },
        "statText": "+40% Multiplicador de Dano Crítico",
        "description": "Aço venenoso que multiplica exponencialmente a dor."
      },
      {
        "id": "assassin_execution_3",
        "classId": "assassin",
        "name": "Golpe Fatal",
        "branch": "execution",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_execution_1"
        ],
        "stats": {
          "critChance": 0.12,
          "damageMult": 0.15
        },
        "statText": "+12% Chance Crítica, +15% Dano",
        "description": "Monstros sentem a morte iminente a cada aproximação."
      },
      {
        "id": "assassin_execution_not",
        "classId": "assassin",
        "name": "Mestre do Assassinato",
        "branch": "execution",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "assassin_execution_2",
          "assassin_execution_3"
        ],
        "stats": {
          "critChance": 0.18,
          "critDamage": 0.6,
          "shadowCritBoost": 0.25
        },
        "statText": "+18% Chance Crítica, +60% Dano Crítico",
        "description": "NOTÁVEL: Praticamente todo golpe desferido se torna um acerto crítico fulminante."
      },
      {
        "id": "assassin_execution_key",
        "classId": "assassin",
        "name": "Carnificina Cirúrgica",
        "branch": "execution",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "assassin_execution_not"
        ],
        "stats": {
          "critDamage": 0.8,
          "surgicalCarnage": true
        },
        "statText": "Críticos Causam 3.5x Dano & Sangramento Severo",
        "description": "PEDRA ANGULAR: Acertos críticos infligem 350% de dano base e causam sangramento contínuo que drena alvos."
      },
      {
        "id": "assassin_daggers_1",
        "classId": "assassin",
        "name": "Corte Duplo",
        "branch": "daggers",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "assassin_orig"
        ],
        "stats": {
          "damageMult": 0.12
        },
        "statText": "+12% Dano com Adagas",
        "description": "Manuseio veloz com duas lâminas afiadas."
      },
      {
        "id": "assassin_daggers_2",
        "classId": "assassin",
        "name": "Rajada de Aço",
        "branch": "daggers",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_daggers_1"
        ],
        "stats": {
          "cooldownReduc": 0.12
        },
        "statText": "-12% Tempo de Recarga das Adagas",
        "description": "Sequência ininterrupta de golpes de curta distância."
      },
      {
        "id": "assassin_daggers_3",
        "classId": "assassin",
        "name": "Fio Sombrio",
        "branch": "daggers",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_daggers_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "areaMult": 0.12
        },
        "statText": "+15% Dano das Adagas, +12% Área",
        "description": "Arco de corte expandido atinge múltiplos alvos simultaneamente."
      },
      {
        "id": "assassin_daggers_not",
        "classId": "assassin",
        "name": "Tempestade de Lâminas",
        "branch": "daggers",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "assassin_daggers_2",
          "assassin_daggers_3"
        ],
        "stats": {
          "damageMult": 0.3,
          "cooldownReduc": 0.18
        },
        "statText": "+30% Dano, -18% Recarga das Adagas",
        "description": "NOTÁVEL: Uma espiral de aço que não dá trégua a nenhum monstro."
      },
      {
        "id": "assassin_daggers_key",
        "classId": "assassin",
        "name": "Adagas Fantasmas",
        "branch": "daggers",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "assassin_daggers_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "phantomDaggers": true
        },
        "statText": "Golpe Duplo Instantâneo em 360 Graus",
        "description": "PEDRA ANGULAR: Ataques com adagas disparam uma réplica fantasma instantânea em 360 graus ao redor do herói."
      },
      {
        "id": "assassin_shadowstep_1",
        "classId": "assassin",
        "name": "Passos Furtivos",
        "branch": "shadowstep",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "assassin_orig"
        ],
        "stats": {
          "speedMult": 0.1
        },
        "statText": "+10% Velocidade de Movimento",
        "description": "O Assassino se move mais rápido do que a vista alcança."
      },
      {
        "id": "assassin_shadowstep_2",
        "classId": "assassin",
        "name": "Reflexos Sombrios",
        "branch": "shadowstep",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_shadowstep_1"
        ],
        "stats": {
          "speedMult": 0.08,
          "maxHp": 15
        },
        "statText": "+8% Velocidade, +15 HP Máximo",
        "description": "Agilidade para escapar dos cercos mais apertados."
      },
      {
        "id": "assassin_shadowstep_3",
        "classId": "assassin",
        "name": "Rastro de Névoa",
        "branch": "shadowstep",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "assassin_shadowstep_1"
        ],
        "stats": {
          "cooldownReduc": 0.08,
          "magnetRadius": 0.1
        },
        "statText": "-8% Tempo de Recarga, +10% Coleta",
        "description": "Rastro etéreo que atrai os despojos dos mortos."
      },
      {
        "id": "assassin_shadowstep_not",
        "classId": "assassin",
        "name": "Vulto Fantasma",
        "branch": "shadowstep",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "assassin_shadowstep_2",
          "assassin_shadowstep_3"
        ],
        "stats": {
          "speedMult": 0.18,
          "damageMult": 0.15
        },
        "statText": "+18% Velocidade de Movimento, +15% Dano",
        "description": "NOTÁVEL: Movimentação tática fulminante para flanquear chefes."
      },
      {
        "id": "assassin_shadowstep_key",
        "classId": "assassin",
        "name": "Manto da Meia-Noite",
        "branch": "shadowstep",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "assassin_shadowstep_not"
        ],
        "stats": {
          "speedMult": 0.2,
          "midnightCloak": true
        },
        "statText": "Surto de +50% Velocidade e Imunidade ao Critar",
        "description": "PEDRA ANGULAR: Desferir um acerto crítico ativa 2s de velocidade extrema +50% e intangibilidade momentânea."
      }
    ]
  },
  "dark_knight": {
    "id": "dark_knight",
    "name": "Cavaleiro Negro Caído",
    "subtitle": "A Muralha de Espinhos Amaldiçoada, Armadura & Retaliação",
    "icon": "🖤",
    "color": "#1a1a24",
    "originId": "dark_knight_orig",
    "branches": {
      "thorns": {
        "id": "thorns",
        "name": "Fortaleza dos Espinhos",
        "color": "#e74c3c",
        "icon": "🦔",
        "subtitle": "Dano de Espinhos Colossal & Retaliação em Área"
      },
      "greatsword": {
        "id": "greatsword",
        "name": "Espadão das Sombras",
        "color": "#8e44ad",
        "icon": "⚔️",
        "subtitle": "Dano Massivo com Espadão Negro & Ruína"
      },
      "plates": {
        "id": "plates",
        "name": "Placas do Tártaro",
        "color": "#2c3e50",
        "icon": "🛡️",
        "subtitle": "Armadura Titânica, Vida Máxima & Resiliência"
      }
    },
    "nodes": [
      {
        "id": "dark_knight_orig",
        "classId": "dark_knight",
        "name": "Armadura Maldita",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Cavaleiro Negro Caído",
        "description": "Forjada no fogo negro do abismo. Cada golpe recebido alimenta os espinhos malévolos de sua carapaça."
      },
      {
        "id": "dark_knight_thorns_1",
        "classId": "dark_knight",
        "name": "Farpas de Ferro Negro",
        "branch": "thorns",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_orig"
        ],
        "stats": {
          "damageMult": 0.05,
          "thornsReflection": 0.5
        },
        "statText": "+50% Dano de Espinhos Refletido",
        "description": "Espinhos afiados retalham monstros que ousem encostar no cavaleiro."
      },
      {
        "id": "dark_knight_thorns_2",
        "classId": "dark_knight",
        "name": "Carapaça Maldita",
        "branch": "thorns",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_thorns_1"
        ],
        "stats": {
          "armor": 1.0,
          "thornsReflection": 0.8
        },
        "statText": "+80% Dano de Espinhos, +1 Armadura",
        "description": "Estilhaços negros saltam e perfuram quem desferir dano."
      },
      {
        "id": "dark_knight_thorns_3",
        "classId": "dark_knight",
        "name": "Vingança Sombria",
        "branch": "thorns",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_thorns_1"
        ],
        "stats": {
          "maxHp": 20,
          "thornsReflection": 1.0
        },
        "statText": "+100% Dano de Espinhos, +20 HP Máximo",
        "description": "Monstros morrem pela força de seus próprios ataques."
      },
      {
        "id": "dark_knight_thorns_not",
        "classId": "dark_knight",
        "name": "Cota de Espinhos Abissal",
        "branch": "thorns",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "dark_knight_thorns_2",
          "dark_knight_thorns_3"
        ],
        "stats": {
          "armor": 2.5,
          "thornsReflection": 1.5
        },
        "statText": "+150% Dano de Espinhos, +2.5 Armadura",
        "description": "NOTÁVEL: Inimigos comuns são aniquilados no instante em que tocam na armadura."
      },
      {
        "id": "dark_knight_thorns_key",
        "classId": "dark_knight",
        "name": "Retaliação Cataclísmica",
        "branch": "thorns",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "dark_knight_thorns_not"
        ],
        "stats": {
          "thornsReflection": 2.0,
          "cataclysmicThorns": true
        },
        "statText": "Explosão de Espinhos de 300% Dano em Toda a Tela",
        "description": "PEDRA ANGULAR: Ao sofrer qualquer dano, explode estilhaços abissais causando 300% de dano a TODOS os monstros próximos."
      },
      {
        "id": "dark_knight_greatsword_1",
        "classId": "dark_knight",
        "name": "Golpe Abissal",
        "branch": "greatsword",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_orig"
        ],
        "stats": {
          "damageMult": 0.12
        },
        "statText": "+12% Dano com Espadão Negro",
        "description": "Lâmina colossal pesada como o próprio túmulo."
      },
      {
        "id": "dark_knight_greatsword_2",
        "classId": "dark_knight",
        "name": "Fenda do Pesar",
        "branch": "greatsword",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_greatsword_1"
        ],
        "stats": {
          "areaMult": 0.18
        },
        "statText": "+18% Área do Espadão Negro",
        "description": "Cortes devastadores em semicírculo aberto."
      },
      {
        "id": "dark_knight_greatsword_3",
        "classId": "dark_knight",
        "name": "Peso dos Condenados",
        "branch": "greatsword",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_greatsword_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "critChance": 0.08
        },
        "statText": "+15% Dano, +8% Chance Crítica",
        "description": "Aço corrompido que estilhaça defesas e armaduras inimigas."
      },
      {
        "id": "dark_knight_greatsword_not",
        "classId": "dark_knight",
        "name": "Ruína das Trevas",
        "branch": "greatsword",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "dark_knight_greatsword_2",
          "dark_knight_greatsword_3"
        ],
        "stats": {
          "areaMult": 0.3,
          "damageMult": 0.25
        },
        "statText": "+30% Área e +25% Dano do Espadão",
        "description": "NOTÁVEL: O espadão varre metade da tela em arcos de escuridão pura."
      },
      {
        "id": "dark_knight_greatsword_key",
        "classId": "dark_knight",
        "name": "Lâmina do Pesar Eterno",
        "branch": "greatsword",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "dark_knight_greatsword_not"
        ],
        "stats": {
          "damageMult": 0.35,
          "sorrowBlade": true
        },
        "statText": "Dreno de Vida por Inimigo Golpeado com Espadão",
        "description": "PEDRA ANGULAR: Cada golpe do espadão regenera 1 HP por monstro atingido e estilhaça a armadura do alvo."
      },
      {
        "id": "dark_knight_plates_1",
        "classId": "dark_knight",
        "name": "Ferro Profano",
        "branch": "plates",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_orig"
        ],
        "stats": {
          "armor": 2.0
        },
        "statText": "+2 de Armadura",
        "description": "Camada densa de aço negro resistente ao calor e magia."
      },
      {
        "id": "dark_knight_plates_2",
        "classId": "dark_knight",
        "name": "Vigor Abissal",
        "branch": "plates",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_plates_1"
        ],
        "stats": {
          "maxHp": 30,
          "armor": 1.0
        },
        "statText": "+30 HP Máximo, +1 Armadura",
        "description": "Vitalidade corrompida mas infinitamente resistente."
      },
      {
        "id": "dark_knight_plates_3",
        "classId": "dark_knight",
        "name": "Resiliência Negra",
        "branch": "plates",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "dark_knight_plates_1"
        ],
        "stats": {
          "armor": 2.0,
          "maxHp": 20
        },
        "statText": "+2 Armadura, +20 HP Máximo",
        "description": "Golpes de monstros causam apenas arranhões leves."
      },
      {
        "id": "dark_knight_plates_not",
        "classId": "dark_knight",
        "name": "Titã das Catacumbas",
        "branch": "plates",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "dark_knight_plates_2",
          "dark_knight_plates_3"
        ],
        "stats": {
          "armor": 4.0,
          "maxHp": 50
        },
        "statText": "+4 Armadura, +50 HP Máximo",
        "description": "NOTÁVEL: O mais resistente e blindado guerreiro de todo o reino."
      },
      {
        "id": "dark_knight_plates_key",
        "classId": "dark_knight",
        "name": "Colosso Inabalável",
        "branch": "plates",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "dark_knight_plates_not"
        ],
        "stats": {
          "armor": 8.0,
          "maxHp": 100,
          "unshakeableColossus": true
        },
        "statText": "+8 Armadura, +100 HP Máximo & Firmeza Total",
        "description": "PEDRA ANGULAR: Concede defesa titânica incomparável e imunidade completa a qualquer empurrão de chefes."
      }
    ]
  },
  "plague_alchemist": {
    "id": "plague_alchemist",
    "name": "Alquimista da Peste",
    "subtitle": "Doutor da Máscara de Corvo, Ácido Cáustico & Epidemia",
    "icon": "🧪",
    "color": "#27ae60",
    "originId": "plague_alchemist_orig",
    "branches": {
      "caustic": {
        "id": "caustic",
        "name": "Poças Cáusticas",
        "color": "#2ecc71",
        "icon": "🧪",
        "subtitle": "Dano de Ácido, Área das Poças & Duração"
      },
      "epidemic": {
        "id": "epidemic",
        "name": "Epidemia & Praga",
        "color": "#16a085",
        "icon": "☣️",
        "subtitle": "Contágio em Cadeia, Explosões Virais & Peste"
      },
      "forbidden": {
        "id": "forbidden",
        "name": "Alquimia Proibida",
        "color": "#f39c12",
        "icon": "⚗️",
        "subtitle": "Transmutação de Ouro, Elixires & Recarga Rápida"
      }
    },
    "nodes": [
      {
        "id": "plague_alchemist_orig",
        "classId": "plague_alchemist",
        "name": "Frasco Primordial",
        "branch": "center",
        "tier": "origin",
        "x": 500,
        "y": 500,
        "cost": 0,
        "reqBranchCount": 0,
        "connects": [],
        "stats": {},
        "statText": "Centelha da Constelação de Alquimista da Peste",
        "description": "O conhecimento proibido das substâncias voláteis e miasmas venenosos que corrompem a matéria viva."
      },
      {
        "id": "plague_alchemist_caustic_1",
        "classId": "plague_alchemist",
        "name": "Ácido Volátil",
        "branch": "caustic",
        "tier": "minor",
        "x": 500,
        "y": 420,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "damageMult": 0.15,
          "plagueAreaBonus": 0.12
        },
        "statText": "+15% Dano das Poças de Veneno",
        "description": "Substância corrosiva que dissolve ossos e armaduras em segundos."
      },
      {
        "id": "plague_alchemist_caustic_2",
        "classId": "plague_alchemist",
        "name": "Pântano Tóxico",
        "branch": "caustic",
        "tier": "minor",
        "x": 440,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_caustic_1"
        ],
        "stats": {
          "areaMult": 0.18,
          "plagueAreaBonus": 0.18
        },
        "statText": "+18% Área das Poças de Ácido",
        "description": "Líquido verde borbulhante cobre uma vasta área no chão."
      },
      {
        "id": "plague_alchemist_caustic_3",
        "classId": "plague_alchemist",
        "name": "Peste Duradoura",
        "branch": "caustic",
        "tier": "minor",
        "x": 560,
        "y": 340,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_caustic_1"
        ],
        "stats": {
          "burnDuration": 0.25,
          "damageMult": 0.1
        },
        "statText": "+25% Duração do Ácido no Solo",
        "description": "O ácido queima no piso por mais tempo, garantindo dano contínuo."
      },
      {
        "id": "plague_alchemist_caustic_not",
        "classId": "plague_alchemist",
        "name": "Dilúvio Tóxico",
        "branch": "caustic",
        "tier": "notable",
        "x": 500,
        "y": 255,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "plague_alchemist_caustic_2",
          "plague_alchemist_caustic_3"
        ],
        "stats": {
          "areaMult": 0.35,
          "damageMult": 0.3,
          "plagueAreaBonus": 0.3
        },
        "statText": "+35% Área e +30% Dano do Ácido",
        "description": "NOTÁVEL: Poças colossais de ácido derretem qualquer monstro que as atravesse."
      },
      {
        "id": "plague_alchemist_caustic_key",
        "classId": "plague_alchemist",
        "name": "Mar de Podridão",
        "branch": "caustic",
        "tier": "keystone",
        "x": 500,
        "y": 150,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "plague_alchemist_caustic_not"
        ],
        "stats": {
          "damageMult": 0.4,
          "causticSea": true
        },
        "statText": "Ácido Reduz Vel. Inimiga em 45% & Dano Duplo",
        "description": "PEDRA ANGULAR: Monstros sobre o ácido sofrem lentidão extrema de 45% e sofrem dano de ácido dobrado."
      },
      {
        "id": "plague_alchemist_epidemic_1",
        "classId": "plague_alchemist",
        "name": "Miasma Infeccioso",
        "branch": "epidemic",
        "tier": "minor",
        "x": 580,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "damageMult": 0.12
        },
        "statText": "+12% Dano Contínuo por Segundo",
        "description": "Vapores que sufocam monstros ao redor do alquimista."
      },
      {
        "id": "plague_alchemist_epidemic_2",
        "classId": "plague_alchemist",
        "name": "Surto Viral",
        "branch": "epidemic",
        "tier": "minor",
        "x": 660,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_epidemic_1"
        ],
        "stats": {
          "areaMult": 0.18
        },
        "statText": "+18% Raio de Disseminação da Peste",
        "description": "A infecção se alastra rapidamente entre hordas aglomeradas."
      },
      {
        "id": "plague_alchemist_epidemic_3",
        "classId": "plague_alchemist",
        "name": "Toxicidade Aguda",
        "branch": "epidemic",
        "tier": "minor",
        "x": 660,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_epidemic_1"
        ],
        "stats": {
          "damageMult": 0.15,
          "critChance": 0.08
        },
        "statText": "+15% Dano de Veneno, +8% Crítico",
        "description": "Veneno letal que paralisa as reações dos monstros."
      },
      {
        "id": "plague_alchemist_epidemic_not",
        "classId": "plague_alchemist",
        "name": "Praga Devastadora",
        "branch": "epidemic",
        "tier": "notable",
        "x": 745,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "plague_alchemist_epidemic_2",
          "plague_alchemist_epidemic_3"
        ],
        "stats": {
          "areaMult": 0.35,
          "damageMult": 0.25
        },
        "statText": "+35% Área de Contágio & Explosões Virais",
        "description": "NOTÁVEL: Monstros infectados transmitem a peste instantaneamente ao morrer."
      },
      {
        "id": "plague_alchemist_epidemic_key",
        "classId": "plague_alchemist",
        "name": "Pandemia Cataclísmica",
        "branch": "epidemic",
        "tier": "keystone",
        "x": 850,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "plague_alchemist_epidemic_not"
        ],
        "stats": {
          "areaMult": 0.4,
          "cataclysmicPlague": true
        },
        "statText": "Monstros Infectados Explodem Espalhando Mais Ácido",
        "description": "PEDRA ANGULAR: Inimigos mortos por veneno explodem em nuvens de gás que infectam todos os monstros da tela."
      },
      {
        "id": "plague_alchemist_forbidden_1",
        "classId": "plague_alchemist",
        "name": "Transmutação Ácida",
        "branch": "forbidden",
        "tier": "minor",
        "x": 420,
        "y": 560,
        "cost": 45,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_orig"
        ],
        "stats": {
          "goldMult": 0.15
        },
        "statText": "+15% Ouro de Monstros Dissolvidos",
        "description": "O ácido dissolve armaduras em pepitas de ouro puro."
      },
      {
        "id": "plague_alchemist_forbidden_2",
        "classId": "plague_alchemist",
        "name": "Elixir da Máscara",
        "branch": "forbidden",
        "tier": "minor",
        "x": 340,
        "y": 500,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_forbidden_1"
        ],
        "stats": {
          "maxHp": 18,
          "hpRegen": 0.3
        },
        "statText": "+18 HP Máximo, +0.3 HP Regen/s",
        "description": "Filtros da máscara de corvo purificam os ares contaminados."
      },
      {
        "id": "plague_alchemist_forbidden_3",
        "classId": "plague_alchemist",
        "name": "Frascos Rápidos",
        "branch": "forbidden",
        "tier": "minor",
        "x": 340,
        "y": 620,
        "cost": 70,
        "reqBranchCount": 0,
        "connects": [
          "plague_alchemist_forbidden_1"
        ],
        "stats": {
          "cooldownReduc": 0.1
        },
        "statText": "-10% Tempo de Recarga Global",
        "description": "Arremesso veloz de recipientes de vidro explosivo."
      },
      {
        "id": "plague_alchemist_forbidden_not",
        "classId": "plague_alchemist",
        "name": "Grande Obra Alquímica",
        "branch": "forbidden",
        "tier": "notable",
        "x": 255,
        "y": 560,
        "cost": 180,
        "reqBranchCount": 2,
        "connects": [
          "plague_alchemist_forbidden_2",
          "plague_alchemist_forbidden_3"
        ],
        "stats": {
          "goldMult": 0.25,
          "cooldownReduc": 0.15
        },
        "statText": "+25% Ouro, -15% Tempo de Recarga",
        "description": "NOTÁVEL: Produção ininterrupta de frascos químicos e ganho de ouro acelerado."
      },
      {
        "id": "plague_alchemist_forbidden_key",
        "classId": "plague_alchemist",
        "name": "Pedra Filosofal da Peste",
        "branch": "forbidden",
        "tier": "keystone",
        "x": 150,
        "y": 560,
        "cost": 450,
        "reqBranchCount": 3,
        "connects": [
          "plague_alchemist_forbidden_not"
        ],
        "stats": {
          "goldMult": 0.35,
          "philosophersPlague": true
        },
        "statText": "Monstros Mortos Rendem Ouro & Frascos de Cura",
        "description": "PEDRA ANGULAR: Cada monstro dissolvido concede +1 ouro bônus e tem 25% de chance de dropar um frasco de cura ou gema de XP."
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
        berserkFury: 0,
        minionCapBonus: 0,
        shadowCritBoost: 0,
        thornsReflection: 0,
        plagueAreaBonus: 0,
        // Keystones
        colossusPact: false,
        secondWind: false,
        shockwaveOnCrit: false,
        windSurge: false,
        purgatoryFire: false,
        phoenixRebirth: false,
        celestialHalo: false,
        holyRetribution: false,
        colossalBerserk: false,
        bloodFeast: false,
        boneExplosion: false,
        spectralVortex: false,
        soulHarvester: false,
        surgicalCarnage: false,
        phantomDaggers: false,
        midnightCloak: false,
        cataclysmicThorns: false,
        sorrowBlade: false,
        unshakeableColossus: false,
        causticSea: false,
        cataclysmicPlague: false,
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

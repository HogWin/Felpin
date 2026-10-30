# ⚔️ The Fallen Kingdom (Medieval Roguelite 3D)

Um jogo completo no estilo **Vampire Survivors** ambientado em um cenário de fantasia medieval gótica, desenvolvido com **gráficos 3D em tempo real via Three.js / WebGL**, **mapa generativo procedural aleatório para cada run**, **modelos 3D estilizados e articulados para todos os heróis e inimigos**, iluminação dinâmica, física de projéteis e sintetizador de áudio via **Web Audio API** (100% autônomo, roda direto no navegador).

---

## 🌟 Novidades da Versão 3D & Mapa Procedural

1. **Gráficos 3D Completos (Three.js WebGL):**
   - Câmera isométrica fluida que segue o herói com vibração de impacto (*camera shake*).
   - Iluminação dinâmica com sombras suaves, nevoeiro gótico atmosférico e tocha acoplada ao herói com oscilação de chama real.
   - Projéteis, arcos de corte da espada, virotes de besta, machados giratórios, poças de fogo sagrado e anéis de aura divina renderizados em 3D.
   - Partículas 3D para faíscas de impacto, sangue, fogueiras e orbes de almas.

2. **Mapa Generativo Procedural Aleatório por Run:**
   - Cada partida gera um reino único com semente aleatória e biomas temáticos variados:
     * 🏰 **Ruínas de Valoria:** Pilares góticos caídos, arcos quebrados, braseiros de ferro fundido com chamas douradas e estátuas imperiais.
     * ⚰️ **Necrópole dos Reis Esquecidos:** Lápides esculpidas com cruzes, sarcófagos de pedra ancestral, pilares de cripta e braseiros de fogo espectral esmeralda.
     * 🌲 **Floresta Sombria de Morghul:** Árvores secas e retorcidas, círculos de pedras druídicas (menires), paliçadas de madeira e névoa profunda.
     * 🔥 **Fortaleza do Carrasco Carmesim:** Barricadas pontiagudas, obeliscos de obsidiana, piso de basalto em chamas e névoa vulcânica.
   - *Streaming* procedural infinito de *chunks* ao redor do jogador com preservação de santuário seguro no ponto inicial.
   - Braseiros com fontes de luz pontual 3D real que iluminam o chão e os inimigos em tempo real.

3. **Modelos 3D Articulados e Bem Trabalhados:**
   - **Heróis:**
     * **Cavaleiro Real (Knight):** Armadura de placas de aço, elmo com visor escuro e pluma vermelha imponente, capa ondulante, escudo brasonado e espada longa.
     * **Arqueira das Sombras (Ranger):** Capuz florestal com olhos esmeralda brilhantes, túnica de couro, aljava com flechas e besta mecânica.
     * **Feiticeiro das Cinzas (Pyromancer):** Mantos de mago com orla dourada, capuz arcano, olhos de brasa, cajado místico com cristal flutuante e orbe de chamas.
     * **Paladino da Alvorada (Paladin):** Armadura dourada cerimonial, auréola santa flutuante (halo), ombreiras aladas, martelo de guerra rúnico e escudo torre.
   - **Inimigos & Mini-Chefes:**
     * **Rato da Peste:** Corpo arqueado, cauda articulada oscilante, focinho, olhos rubros e 4 patas velozes.
     * **Esqueleto:** Crânio tridimensional com órbitas brilhantes, caixa torácica articulada, cimitarra enferrujada e broquel.
     * **Aldeão Amaldiçoado:** Postura corcunda assimétrica, túnica camponesa esfarrapada e forquilha afiada.
     * **Cavaleiro Negro:** Armadura pesada de obsidiana, elmo com chifres pontiagudos e visor vermelho demoníaco, empunhando espada colossal com runas violetas.
     * **Bruxa das Catacumbas:** Flutua pelo ar com túnicas ondulantes, chapéu pontudo clássico e cajado encimado por crânio espectral venenoso.
     * **Carrasco Carmesim (Mini-Chefe):** Brutamontes colossal com capuz de carrasco, avental ensanguentado, correntes de ferro nos punhos e machado de guerra gigante de duas lâminas.
     * **Golem de Pedra (Mini-Chefe):** Gigante monolítico de blocos de rocha e musgo, ombros flutuantes, núcleo rúnico ciano pulsante e punhos de pedra.
     * **Barão da Morte (Mini-Chefe):** Lorde lich real com asas esqueléticas, coroa gótica dourada, mantos imperiais flutuantes e foice necrótica.

---

## 🕹️ Como Jogar

Basta abrir o arquivo **[`index.html`](file:///c:/Users/felip/OneDrive/Documents/AntiGravity/index.html)** diretamente no seu navegador preferido (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera, Brave):
- Não requer instalação de pacotes, Node.js ou Python.
- Não necessita de servidor web; funciona perfeitamente abrindo diretamente pelo explorador de arquivos (`file:///`).

### 🎮 Controles & Interface
- **Mover o Personagem:** `W`, `A`, `S`, `D` ou **Setas do Teclado** (ou **Analógico de Controle / Gamepad**).
- **Mira & Direção do Ataque:** Uma **setinha dourada estilizada** orbita ao redor do herói indicando exatamente para onde ele está olhando e para onde os golpes (arcos de espada, estocadas de lança) serão desferidos. Você também pode apontar com o **Mouse** para mirar com precisão enquanto se move!
- **Ataque:** **100% Automático** baseado na direção apontada, tempo de recarga e alcance das armas equipadas.
- **Cronômetro:** Centralizado no topo da tela em destaque com moldura dourada gótica (`00:00`).
- **Barra de XP:** Posicionada na parte inferior da tela com gradiente esmeralda e contador numérico claro.
- **Pausar o Jogo:** Tecla `ESC` ou `P` (ou pelo botão no HUD superior).
- **Som / Música:** Botão no topo direito para Ligar/Desligar áudio a qualquer momento.

---

## 🛡️ Sistema de Classes (Extensível para Novas Classes)

O jogo utiliza um **Registro Central de Classes** (`ClassRegistry` em [`js/classes.js`](file:///c:/Users/felip/OneDrive/Documents/AntiGravity/js/classes.js)), permitindo que desenvolvedores criem e adicionem dezenas de novas classes com apenas um bloco de configuração.

### 1. Classe Padrão Inicial:
* **Cavaleiro Real (Sir Arthur):**
  * **Arma Inicial:** *Espada Longa Real* (golpes cortantes amplos).
  * **Atributos:** 120 HP, 2 de Armadura, velocidade balanceada (3.1), +15% de Dano Físico e +15% de Área de Golpe.
  * **Passiva Especial:** Alta resistência e sobrevivência em combate corpo a corpo.

### 2. Classes Extras Prontas no Sistema (Expansão):
* **Arqueira das Sombras:** Foco em velocidade (+25%), tiros precisos com *Besta*, raio de coleta aumentado e -10% de recarga.
* **Feiticeiro das Cinzas:** Bombardeio massivo com *Fogo Sagrado*, +30% Dano Mágico e +35% Área de Efeito.
* **Paladino da Alvorada:** Tanque sagrado com 135 HP, 3 de Armadura, regeneração natural e *Aura dos Santos*.

> 💡 **Como Adicionar Novas Classes Futuras:**
> Abra [`js/classes.js`](file:///c:/Users/felip/OneDrive/Documents/AntiGravity/js/classes.js) e adicione um novo registro no método `initDefaultClasses()`:
> ```javascript
> this.registerClass({
>   id: 'berserker',
>   name: 'Guerreiro Berserker',
>   subtitle: 'Fúria dos Bárbaros do Norte',
>   icon: '🪓',
>   startingWeapon: 'whirling_axes',
>   stats: { maxHp: 150, armor: 1, moveSpeed: 3.3, damageMultiplier: 1.25, ... }
> });
> ```

---

## 🔮 Sistema de Evolução por Níveis (XP)

1. **Orbes de Alma / Cristais de XP:**
   * 🟢 **Orbe de Bronze (1 XP):** Dropado por Ratos da Peste.
   * 🔷 **Orbe de Prata (5 XP):** Dropado por Esqueletos e Aldeões.
   * 🟡 **Orbe Dourado (25 XP):** Dropado por Bruxas e Cavaleiros Negros.
   * 🟣 **Alma Relíquia (100 XP):** Dropado por Mini-Chefes.
2. **Atração Magnética:** Os orbes no chão são puxados pelo magnetismo do jogador ao entrar no raio de coleta.
3. **Subida de Nível:**
   * Pausa o jogo instantaneamente com fanfarra sonora.
   * Exibe cartas de upgrade aleatórias entre novas armas, evolução de armas equipadas e melhorias de estatísticas passivas.

---

## 🗡️ Arsenal Medieval & Evolução de Atributos (Níveis 1 ao 8)

Cada arma possui até **8 níveis de evolução**, com mudanças drásticas em quantidade de projéteis, área, velocidade e dano:

| Arma | Ícone | Tipo de Ataque | Evolução Máxima (Nível 8) |
| :--- | :---: | :--- | :--- |
| **Espada Longa Real** | ⚔️ | Arcos cortantes frontais e traseiros | *Lâmina do Monarca Sagrado* (Cleave 360° contínuo com 150 de dano) |
| **Besta de Precisão** | 🏹 | Disparo perfurante nos alvos mais próximos | *Balista Flamejante* (7 virotes perfurantes incendiários) |
| **Fogo Sagrado** | 🧪 | Frascos que explodem em poças incendiárias | *Tempestade de Fogo Divina* (6 crateras de fogo santo em chamas) |
| **Machados Vorazes** | 🪓 | Arremesso em parábola perfurando hordas | *Turbilhão de Aço Carmesim* (8 machados gigantes) |
| **Aura dos Santos** | ✨ | Pulso de luz contínuo que afasta mortos-vivos | *Santuário Imperial* (Raio colossal com dano fulminante) |
| **Lança do Guardião** | 🔱 | Estocada frontal com enorme penetração | *Lança de Longinus* (240 de dano em cruz de 4 eixos) |

---

## 📈 Melhorias das Estatísticas Padrão (Itens Passivos)

Além das armas, você pode equipar até 6 itens passivos para aprimorar os atributos base do herói:

1. 🛡️ **Armadura de Placas:** +1.5 de redução de dano fixo por nível (até +7.5 de armadura).
2. 🥾 **Botas Aladas:** +10% de velocidade de movimento por nível (até +50%).
3. ❤️ **Coração de Ferro:** +25 de Vida Máxima e cura instantânea de 25% do HP a cada melhoria.
4. 🧲 **Ímã de Relíquias:** +35% no raio de atração magnética de orbes de XP por nível.
5. 🩸 **Amuleto de Vitalidade:** +0.5 HP/segundo de regeneração contínua.
6. 📖 **Tomo da Aceleração:** -8% no tempo de recarga de todas as armas por nível.
7. 🥊 **Manopla de Titã:** +12% de dano global acumulativo.
8. 🚩 **Estandarte de Alcance:** +15% na área e tamanho das lâminas, lanças e explosões.

---

## 💀 Inimigos e Mini-Chefes

### Hordas Regulares:
* **Ratos da Peste:** Pequenos e extremamente rápidos, atacam em enxames.
* **Esqueletos Renegados:** Infantaria morta-viva com marcha constante.
* **Aldeões Amaldiçoados:** Lentos porém resistentes, armados com tochas.
* **Cavaleiros Negros:** Portadores de grandes escudos e armaduras pesadas.
* **Bruxas da Peste:** Inimigos à distância que disparam orbes venenosos roxos.

### 🚨 Mini-Chefes e Grandes Chefes Temporizados:
* **Minuto 1:00 — O Carrasco Carmesim:**
  * Enorme machado carmesim, investidas em alta velocidade contra o herói.
  * *Recompensa:* Baú de Prata + Orbe Relíquia (100 XP).
* **Minuto 2:30 — Golem das Catacumbas:**
  * Titã de pedra ancestral que desfere pisões telúricos gerando ondas de choque em 8 direções.
  * *Recompensa:* Baú Dourado + Orbe Relíquia.
* **Minuto 4:00 — Barão da Morte Von Kroll:**
  * Senhor necromante com disparos mágicos em espiral contínua.
  * *Recompensa:* Baú Real Supremo com múltiplos aprimoramentos simultâneos.

---

## 🎵 Motor de Áudio Procedural (Web Audio API)

Desenvolvido em [`js/audio.js`](file:///c:/Users/felip/OneDrive/Documents/AntiGravity/js/audio.js):
- **Efeitos Sonoros Sintetizados:** Corte de espadas, disparo de bestas, quebra de frascos de fogo, zumbido de machados, chimes harmônicos pentatônicos ao coletar orbes de XP e trombetas de fanfarra ao subir de nível.
- **Berrante de Guerra (Boss Horn):** Alerta sonoro grave e estrondoso quando um chefe surge.
- **Trilha Sonora Dinâmica:** Tambores de guerra medievais e drones góticos sintetizados em tempo real, sem necessidade de arquivos MP3 pesados.

---

## 📁 Estrutura do Projeto

```
AntiGravity/
├── index.html          # Ponto de entrada com Canvas, HUD e Modais
├── README.md           # Documentação completa
├── css/
│   └── style.css       # Estilos góticos medievais, HUD, animações e responsividade
└── js/
    ├── audio.js        # Sintetizador de áudio Web Audio API (SFX e Tambores)
    ├── classes.js      # Registro e definições de Classes de Personagem
    ├── passives.js     # Sistema de melhoria dos atributos do personagem
    ├── weapons.js      # Armas, projéteis, áreas de efeito e evolução Nv 1-8
    ├── entities.js     # Jogador, Gemas de XP, Baús, Números Flutuantes e Partículas
    ├── enemies.js      # Inimigos, Mini-Chefes e Diretor de Ondas temporizadas
    ├── renderer.js     # Renderizador de chão de pedras, luz de tocha e câmera
    ├── ui.js           # Gerenciador de cartas de Level-Up, Baú, Pausa e Game Over
    └── game.js         # Loop principal (60 FPS), colisões e controle de estado
```

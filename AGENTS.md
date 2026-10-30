# The Fallen Kingdom
## Contexto, Regras e Configurações do Projeto para Antigravity IDE

Este arquivo serve como contexto mestre persistente para o **Antigravity IDE** e seus agentes em qualquer máquina ou ambiente de desenvolvimento.

---

### 1. Visão Geral do Projeto
- **Título**: The Fallen Kingdom
- **Gênero**: Roguelite de ação e sobrevivência medieval gótico isométrica (estilo *Vampire Survivors*).
- **Repositório Git**: `https://github.com/HogWin/Felpin.git` (Branch padrão: `main`).
- **Hospedagem & Deploy**: Vercel (`https://felpin.vercel.app/`).
- **Banco de Dados & Autenticação**: Neon Lakebase Postgres (Branch: `production`) + Neon Auth.

---

### 2. Regras e Restrições Absolutas do Projeto (NUNCA VIOLAR)
1. 🚫 **PROIBIDO DASH / ESQUIVA:** O usuário proibiu explicitamente sob qualquer circunstância a implementação de mecânica de Dash, Esquiva (Dodge) ou teletransporte rápido do jogador. O combate e a sobrevivência devem depender unicamente de posicionamento tático, velocidade de movimento base/passivas, controle de multidões e upgrades de armas.
2. 🛡️ **Tolerância a Falhas & Modo Offline (Guest Mode):** O jogo DEVE continuar perfeitamente jogável mesmo se o usuário estiver offline ou o backend estiver indisponível. O botão "Entrar como Visitante Anônimo" deve sempre salvar o progresso localmente no `localStorage`.
3. 🎨 **Gerenciamento de Modais e CSS Overlay:**
   - **NUNCA** coloque estilos inline `style="display: flex;"` ou `style="display: none;"` nos elementos `.modal-overlay` no HTML.
   - Todo modal deve ser exibido com `modal.classList.add('active')` e ocultado com `modal.classList.remove('active')`.
   - A classe `.modal-overlay` possui `z-index: 2000`, `opacity: 0` e `pointer-events: none` por padrão. A classe `.modal-overlay.active` aplica `display: flex !important; opacity: 1 !important; pointer-events: auto !important;`.
4. 🔄 **Invalidação de Cache nos Deploys:** Sempre que alterar qualquer arquivo CSS ou JS dentro de `AntiGravity/`, incremente a versão dos links e scripts em `AntiGravity/index.html` (`?v=21`, `?v=22`, etc.) para evitar que navegadores ou o edge da Vercel sirvam versões antigas em cache.

---

### 3. Arquitetura do Sistema e Estrutura de Arquivos

```
.
├── AntiGravity/                 # Frontend estático do jogo (servido na raiz)
│   ├── css/
│   │   └── style.css            # Tema gótico medieval, HUD, modais, ribbons, cards
│   ├── js/
│   │   ├── three.min.js         # Motor gráfico 3D Three.js
│   │   ├── audio.js             # Sintetizador Web Audio API procedural (sem MP3s externos)
│   │   ├── save.js              # Save local (localStorage), dados de configurações e meta-progresso
│   │   ├── classes.js           # 6 Classes: Cavaleiro, Arqueira, Maga, Paladino, Bárbaro, Necromante
│   │   ├── passives.js          # Passivas de atributos (Armadura, Ímã, Tomo Vazio, Espinafre, etc.)
│   │   ├── weapons.js           # Armas básicas, áreas de efeito, orbes, projéteis
│   │   ├── synergies.js         # Grimório com Fusões Supremas e Ascensões Divinas
│   │   ├── entities.js          # Player, Projectile, XpGem, TreasureChest, DestructibleObject, SpatialGrid
│   │   ├── enemies.js           # Bestiário de inimigos (Esqueletos, Zumbis, Orcs, etc.) e Chefes
│   │   ├── models3d.js          # Modelagem procedural de personagens 3D em Three.js
│   │   ├── map3d.js             # Geração procedural de biomas e piso 3D
│   │   ├── renderer.js          # Renderizador isométrico Three.js + 2D overlay canvas
│   │   ├── ui.js                # UIController, modais, abas de menu, autenticação, HUD
│   │   └── game.js              # Loop principal, estados (MENU, PLAYING, PAUSED, LEVEL_UP, CHEST, etc.)
│   └── index.html               # Entrypoint do client, modais góticos, container Three.js
├── api/
│   └── index.js                 # Handler serverless para a Vercel que direciona para server/server.js
├── server/
│   ├── server.js                # API Express 5 (endpoints /api/auth, /api/leaderboard, /api/cloud-save, /api/health)
│   ├── db.js                    # Pool do Neon Postgres com migrações automáticas de tabelas
│   ├── build.js                 # Script de verificação de sintaxe de todos os arquivos antes de deploy
│   └── test-neon.js             # Suite de testes E2E do Neon (Postgres, Auth, JWT JWKS, Hashing)
├── .agents/
│   └── skills/                  # Skills do Neon (Postgres, Auth, Functions, AI Gateway, etc.)
├── package.json                 # Dependências (@neondatabase/serverless, express, etc.)
├── vercel.json                  # Configurações de deploy (outputDirectory: "AntiGravity")
└── GEMINI.md                    # Este arquivo de contexto mestre
```

---

### 4. Integração com Neon Cloud
- **Organização Neon**: `org-polished-breeze-67994913`
- **Projeto Neon**: `plain-frog-69116023`
- **Branch**: `production`
- **Serviços provisionados**: `postgres,auth`
- **Variáveis de ambiente requeridas** (armazenadas em `.env.local` para desenvolvimento e configuradas nas Environment Variables da Vercel para produção):
  - `DATABASE_URL`: Connection string segura para o Postgres no Neon.
  - `NEON_AUTH_BASE_URL`: Endpoint de autenticação do Neon Auth.

**Tabelas gerenciadas automaticamente pelo `server/db.js`:**
1. `game_users`: Contas de jogadores com senhas criptografadas via algoritmo seguro de derivação de chaves (`scrypt`).
2. `leaderboard`: Placar de líderes com pontuações, tempo de sobrevivência, abates, classe e modo hiper/maldição.
3. `player_cloud_saves`: Backup e sincronização de saves em nuvem via coluna `data JSONB`.

---

### 5. Procedimento Padrão para Cada Atualização (Checklist do Agente)

Sempre que fizer alterações no projeto, siga obrigatoriamente estes passos antes de finalizar a tarefa:

1. **Validação de Sintaxe e Estrutura:**
   ```powershell
   npm run build
   ```
   Deve retornar `Build & Verification Complete: 0 ERRORS!`.

2. **Validação de Banco de Dados e Serviços:**
   ```powershell
   npm test
   ```
   Deve passar em todos os 8 testes da suíte (`8/8 passed`).

3. **Invalidação de Cache de Client (se alterou CSS ou JS em `AntiGravity/`):**
   - Atualize os parâmetros `?v=XX` de links CSS e `<script>` no arquivo [AntiGravity/index.html](file:///d:/Felipe/Felpin/AntiGravity/index.html).

4. **Publicação / Deploy Contínuo:**
   - Faça o commit das alterações com mensagens convencionais (`fix:`, `feat:`, `balance:`).
   - Envie para o GitHub:
     ```powershell
     git push origin main
     ```
   - O Vercel detectará o push na branch `main` e fará o build e deploy instantaneamente para `felpin.vercel.app`.


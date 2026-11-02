# Código-Fonte TypeScript — The Fallen Kingdom

Esta pasta contém as versões em **TypeScript (`.ts`)** dos 15 módulos do jogo, espelhando diretamente os arquivos JavaScript presentes em `AntiGravity/js/`.

---

## 📁 Correspondência 1-para-1 com os Arquivos do Jogo

| Arquivo TypeScript (`typescript/`) | Arquivo JavaScript Equivalente (`AntiGravity/js/`) | Responsabilidade |
|---|---|---|
| **`audio.ts`** | `audio.js` | Sintetizador procedural de efeitos e trilhas sonoras Web Audio API |
| **`classes.ts`** | `classes.js` | 9 Classes medievais, atributos básicos e passivas nativas |
| **`enemies.ts`** | `enemies.js` | Bestiário de hordas, monstros de elite e chefes com telegrafia |
| **`entities.ts`** | `entities.js` | Entidades em batalha, Projéteis, Gemas de XP, Baús e SpatialGrid |
| **`game.ts`** | `game.js` | Loop principal do motor, máquina de estados e captura de inputs |
| **`icons.ts`** | `icons.js` | Catálogo de ícones SVG góticos procedurais |
| **`map3d.ts`** | `map3d.js` | Geração procedural de biomas e piso 3D |
| **`models3d.ts`** | `models3d.js` | Modelagem procedural 3D de heróis, armas e chefes em Three.js |
| **`passives.ts`** | `passives.js` | Passivas de atributos (Armadura, Tomo, Ímã, Espinafre, etc.) |
| **`renderer.ts`** | `renderer.js` | Renderizador isométrico Three.js, overlay 2D e pooling de malhas |
| **`save.ts`** | `save.js` | Gerenciador de save local (`localStorage`), Forja e Conquistas |
| **`skilltree.ts`** | `skilltree.js` | Árvore de Talentos interativa em grafo SVG para as 9 classes |
| **`synergies.ts`** | `synergies.js` | Grimório com Fusões Supremas e Ascensões Divinas |
| **`ui.ts`** | `ui.js` | Gerenciador de HUD, modais góticos, abas do hub e autenticação |
| **`weapons.ts`** | `weapons.js` | Armas primárias, orbes, áreas de efeito e disparos |
| **`types.d.ts`** | — | Definições globais de interfaces e namespace `MedievalSurvivors` |


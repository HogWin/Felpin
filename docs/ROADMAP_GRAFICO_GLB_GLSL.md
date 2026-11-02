# 🗺️ Roteiro de Reformulação Gráfica (.GLB & Pipeline GLSL)
### *The Fallen Kingdom — Planejamento Mestre de Evolução Visual*

---

## 1. Visão Geral & Filosofia
Este documento norteia a substituição completa dos modelos geométricos primitivos do jogo por **modelos 3D estilizados profissionais (.GLB)**, com esqueleto de animação, proporções heróicas e arquitetura de materiais 100% preparada para Shaders GLSL na GPU.

### Pilares Inegociáveis:
1. **Performance Absoluta**: Modelos ultracompactos (30 KB a 70 KB), preservando 60 FPS com 500+ monstros na tela.
2. **Modo Offline & Zero CDNs**: Todos os assets residem na estrutura local do client, garantindo que o jogo funcione em qualquer rede.
3. **Caminho Aberto para GLSL**: Materiais configurados com pontos de injeção `onBeforeCompile`, permitindo plugar shaders de brilho, névoa e dissolver sem refazer modelos.

---

## 2. As 3 Fases de Execução

```
[ Fase 1: Personagens ] ──▶ [ Fase 2: Armas & Grimório ] ──▶ [ Fase 3: Ambiente & Iluminação ]
```

### Fase 1: Personagens (Heróis, Inimigos & Chefes)
* **Heróis (9 Classes)**: Rework anatômico completo, elmos detalhados, ombreiras heráldicas, capas com dobras e sockets nas mãos (`hand_r_socket`, `hand_l_socket`).
* **Hordas de Monstros**: Modelos expressivos de Esqueletos, Zumbis, Orcs e Fantasmas otimizados com `THREE.InstancedMesh` para desenho em lote (Single Draw Call).
* **Chefes & Elites**: Modelos imponentes (Golem de Pedra com veios de magma, Lich Soberano flutuante com manto imperial).
* **Gancho GLSL**: Uniforms `uHitFlash` (piscar de dano na GPU) e `uDissolveProgress` (desintegração em cinzas na morte).

### Fase 2: Armas, Projéteis e Grimório
* **Armas Primárias 3D**: Lâminas chanfradas, virotes ornamentais, machados de gume duplo e cajados arcanos.
* **Equipamento Dinâmico**: As armas trocam fisicamente na mão do herói em tempo real quando evoluem para Fusões Supremas no Grimório.
* **Object Pooling**: Reciclagem de geometrias na GPU sem recriação de buffers WebGL.
* **Gancho GLSL**: Rastro de corte (*Weapon Trail Shader*) e distorção de calor nas chamas.

### Fase 3: Ambiente, Cenário e Iluminação (A Maior Atenção)
* **Kit Modular de Cemitério e Masmorra**: Lajes de pedra rachadas com musgo, terra batida, colunas em ruínas, grades de ferro e lápides.
* **Iluminação Atmosférica**: Luz de luar gótico contrastando com luz quente pontual de tochas e fogueiras.
* **Destrutíveis Refinados**: Barris de carvalho com aros de ferro, urnas de sangue e baús de tesouro entalhados.
* **Gancho GLSL**: Névoa volumétrica rasteira no piso (*Ground Fog*) e pós-processamento de tela (*Bloom & Vignette*).


# Suíte de Testes Automatizados de QA — The Fallen Kingdom

Esta pasta reúne a infraestrutura de testes automatizados do projeto, simulando ações de jogadores, cliques caóticos e verificando estabilidade, memória e persistência.

---

## 📁 Estrutura de Arquivos

* **`qa_stress_suite.py`**: Suíte de testes automatizados com Chromium Headless (Playwright). Executa 10 cenários de estresse contínuo com monitoramento de console e `pageerror`.
* **`server.py`**: Servidor HTTP local com mock completo das APIs do Neon Cloud (`/api/health`, `/api/auth`, `/api/leaderboard`, `/api/cloud-save`) para testes sem dependência de rede externa.
* **`qa_report.json`**: Relatório da última execução com tempos de resposta, contagem de erros e status de cada teste.
* **`screenshots/`**: Capturas visuais automatizadas pós-teste para auditoria de interface e teardown de cenas.

---

## 🚀 Como Executar (Somente sob Ordem do Usuário)

```powershell
python qa/qa_stress_suite.py
```

---

## 🧪 Os 10 Cenários de Estresse Testados

1. **Carga Inicial & Integridade do DOM**: Inicialização do Canvas 3D (Three.js) e Canvas 2D Overlay.
2. **Autenticação Visitante (Guest Mode)**: Tolerância a falhas offline e gravação imediata no `localStorage`.
3. **Fuzzing de Navegação no Hub**: 25 trocas rápidas entre as 11 abas do menu principal.
4. **Controles da Árvore de Talentos**: Troca contínua entre as 9 classes e zoom do SVG.
5. **Inicialização de Batalha**: Instanciação do herói, armas primárias e transição de estado.
6. **Fuzzing de Inputs & Clique Direito**: Movimentação multidirecional, mira contínua e bloqueio do menu de contexto nativo.
7. **Race Condition de Pausa**: Spam rápido de tecla `Escape` e cliques simultâneos de `Resume`.
8. **Subidas de Nível Rápidas (Level-Up Fuzzing)**: Sorteio de cartas de upgrade sob rajada contínua de XP.
9. **Fluxo de Baús de Tesouro**: Drop, abertura, coleta e retorno seguro ao estado `PLAYING`.
10. **Auditoria de Memory Leaks & Teardown**: Limpeza de todas as entidades, malhas Three.js e retorno ao menu.

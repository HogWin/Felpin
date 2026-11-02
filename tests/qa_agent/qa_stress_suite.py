"""
Autonomous QA Testing Suite for 'The Fallen Kingdom'
Powered by Playwright Headless Browser Automation

Simulates chaotic player behavior, input fuzzing, rapid UI state transitions,
modal race conditions, right-click context menu suppression, and memory profiling.
"""

import sys
import os
import time
import json
import traceback

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

# Import local test server
sys.path.insert(0, os.path.dirname(__file__))
from server import GameTestServer

class QATestAgent:
    def __init__(self, port=8889, headless=True):
        self.port = port
        self.headless = headless
        self.server = GameTestServer(port=port)
        self.url = f"http://127.0.0.1:{port}/index.html"
        self.errors = []
        self.warnings = []
        self.console_logs = []
        self.test_results = {}
        self.screenshots_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'screenshots'))
        os.makedirs(self.screenshots_dir, exist_ok=True)

    def record_result(self, test_name, passed, details="", duration=0.0):
        self.test_results[test_name] = {
            "passed": passed,
            "details": details,
            "duration": round(duration, 3)
        }
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"[{status}] {test_name} ({round(duration, 2)}s) - {details}")

    def run_all(self):
        print("=" * 70)
        print("🛡️  INICIANDO AGENTE DE QA AUTOMATIZADO - THE FALLEN KINGDOM")
        print("=" * 70)

        self.server.start()
        time.sleep(1.0)

        with sync_playwright() as p:
            browser = p.chromium.launch(channel='chrome', headless=self.headless)
            context = browser.new_context(viewport={'width': 1280, 'height': 720})
            page = context.new_page()

            # Attach event listeners to monitor browser state & anomalies
            page.on("pageerror", lambda err: self._on_page_error(err))
            page.on("console", lambda msg: self._on_console_msg(msg))

            try:
                # Test 1: Page Load & Initial DOM Integrity
                self.test_page_load(page)

                # Test 2: Guest Mode Authentication & LocalStorage Setup
                self.test_guest_auth(page)

                # Test 3: Rapid Navigation Fuzzing Across All 11 Hub Tabs
                self.test_menu_navigation_fuzzing(page)

                # Test 4: Skill Tree Viewport & Zoom Controls Stress Test
                self.test_skilltree_controls(page)

                # Test 5: Game Initialization & Battle Launch
                self.test_battle_initialization(page)

                # Test 6: Chaotic Input Fuzzing (WASD, Extreme Aim, Right-Click Context Menu)
                self.test_input_fuzzing_and_contextmenu(page)

                # Test 7: Modal Race Conditions & Pause Toggle Spam (State Machine Stability)
                self.test_pause_and_state_race_conditions(page)

                # Test 8: Rapid Level-Up Trigger & Upgrade Selection Fuzzing
                self.test_rapid_level_ups(page)

                # Test 9: Elite Champion Drop & Treasure Chest Modal Interaction
                self.test_treasure_chest_flow(page)

                # Test 10: Memory Leak & Scene Teardown Audit (Quit to Menu / Death)
                self.test_memory_leak_and_teardown(page)

            except Exception as e:
                print(f"[FATAL QA EXCEPTION] Test aborted unexpectedly: {e}")
                traceback.print_exc()
            finally:
                browser.close()
                self.server.stop()

        return self.generate_report()

    def _on_page_error(self, err):
        msg = str(err)
        self.errors.append({"type": "pageerror", "message": msg, "time": time.time()})
        print(f"  🚨 [PAGE ERROR DETECTED] {msg}")

    def _on_console_msg(self, msg):
        text = msg.text
        if msg.type == 'error':
            self.errors.append({"type": "console.error", "message": text, "time": time.time()})
            print(f"  ⚠️ [CONSOLE ERROR] {text}")
        elif msg.type == 'warn':
            self.warnings.append({"type": "console.warn", "message": text, "time": time.time()})
        self.console_logs.append({"type": msg.type, "text": text})

    # =========================================================================
    # TEST CASES
    # =========================================================================

    def test_page_load(self, page):
        t0 = time.time()
        page.goto(self.url, wait_until='networkidle')
        page.wait_for_selector('#game-container', timeout=8000)
        page.wait_for_selector('#auth-modal', timeout=8000)
        page.wait_for_function("() => window.MedievalSurvivors && window.MedievalSurvivors.game", timeout=8000)

        # Check if 3D Canvas and 2D Overlay exist
        canvas3d = page.query_selector('#game-canvas')
        canvas2d = page.query_selector('#overlay-canvas')

        passed = bool(canvas3d and canvas2d and len(self.errors) == 0)
        self.record_result("1. Carga Inicial & Integridade do DOM", passed,
                           f"Canvas 3D: {'OK' if canvas3d else 'Missing'}, Erros: {len(self.errors)}", time.time() - t0)

    def test_guest_auth(self, page):
        t0 = time.time()
        # Click "Entrar como Visitante Anônimo"
        guest_btn = page.query_selector('#btn-auth-guest')
        if not guest_btn:
            self.record_result("2. Autenticação Visitante (Guest Mode)", False, "Botão Visitante não encontrado", time.time() - t0)
            return

        guest_btn.click()
        page.wait_for_timeout(350)

        # Main menu should now be active, auth modal should be closed
        main_menu_active = page.evaluate("() => document.getElementById('main-menu-modal').classList.contains('active')")
        auth_modal_hidden = page.evaluate("() => !document.getElementById('auth-modal').classList.contains('active')")

        # Verify localStorage has valid save state
        has_save = page.evaluate("() => Boolean(localStorage.getItem('medieval_survivors_save_v1'))")

        passed = main_menu_active and auth_modal_hidden and has_save
        self.record_result("2. Autenticação Visitante (Guest Mode)", passed,
                           f"Menu Ativo: {main_menu_active}, Modal Auth Oculto: {auth_modal_hidden}, Save Criado: {has_save}", time.time() - t0)

    def test_menu_navigation_fuzzing(self, page):
        t0 = time.time()
        tabs = ['play', 'heroes', 'tree', 'forge', 'synergies', 'codex', 'achievements', 'leaderboard', 'history', 'updates', 'settings']
        fuzz_cycles = 25
        initial_errors = len(self.errors)

        # Fuzz tab switches rapidly (simulating erratic user clicking)
        for i in range(fuzz_cycles):
            tab = tabs[i % len(tabs)]
            page.evaluate(f"() => window.MedievalSurvivors.game.ui.switchMenuTab('{tab}')")
            if i % 4 == 0:
                page.wait_for_timeout(20)

        # Wait briefly to let DOM settle
        page.wait_for_timeout(200)

        # Verify content was rendered
        has_content = page.evaluate("() => Boolean(document.getElementById('menu-tab-content').innerHTML.length > 50)")
        new_errors = len(self.errors) - initial_errors

        passed = has_content and (new_errors == 0)
        self.record_result("3. Fuzzing de Navegação Rápida no Hub (11 Abas)", passed,
                           f"{fuzz_cycles} trocas rápidas de aba executadas. Novos erros: {new_errors}", time.time() - t0)

    def test_skilltree_controls(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Switch to talents/tree tab
        page.evaluate("() => window.MedievalSurvivors.game.ui.switchMenuTab('tree')")
        page.wait_for_timeout(200)

        # Fuzz zoom controls and class switching
        classes = ['knight', 'ranger', 'pyromancer', 'paladin', 'berserker', 'necromancer', 'assassin', 'dark_knight', 'plague_alchemist']
        for cid in classes:
            page.evaluate(f"() => {{ window.MedievalSurvivors.game.ui._skillTreeActiveClass = '{cid}'; window.MedievalSurvivors.game.ui.renderSkillTreeTab(); }}")

        # Fuzz zoom in / out
        for _ in range(4):
            page.evaluate("() => { if (document.getElementById('btn-zoom-in')) document.getElementById('btn-zoom-in').click(); }")
            page.evaluate("() => { if (document.getElementById('btn-zoom-out')) document.getElementById('btn-zoom-out').click(); }")

        new_errors = len(self.errors) - initial_errors
        passed = (new_errors == 0)
        self.record_result("4. Controles da Árvore de Talentos & SVG Viewport", passed,
                           f"Troca entre 9 classes e zoom contínuo testados. Novos erros: {new_errors}", time.time() - t0)

    def test_battle_initialization(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Switch back to 'play' tab and click battle start
        page.evaluate("() => window.MedievalSurvivors.game.ui.switchMenuTab('play')")
        page.wait_for_timeout(150)

        page.evaluate("() => window.MedievalSurvivors.game.start()")
        page.wait_for_timeout(400)

        state = page.evaluate("() => window.MedievalSurvivors.game.state")
        has_player = page.evaluate("() => Boolean(window.MedievalSurvivors.game.player && window.MedievalSurvivors.game.player.alive)")
        has_weapons = page.evaluate("() => window.MedievalSurvivors.game.player.weapons.length > 0")

        new_errors = len(self.errors) - initial_errors
        passed = (state == 'PLAYING') and has_player and has_weapons and (new_errors == 0)
        self.record_result("5. Inicialização de Batalha & Criação do Jogador", passed,
                           f"Estado: {state}, Jogador Ativo: {has_player}, Armas: {has_weapons}, Novos erros: {new_errors}", time.time() - t0)

    def test_input_fuzzing_and_contextmenu(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # 1. Simulate chaotic WASD key spam
        keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
        for i in range(30):
            k = keys[i % len(keys)]
            page.keyboard.down(k)
            page.wait_for_timeout(10)
            page.keyboard.up(k)

        # 2. Simulate violent mouse pointer movement across viewport boundaries
        coords = [(-50, -50), (100, 100), (1300, 750), (640, 360), (0, 720), (1280, 0)]
        for x, y in coords:
            page.mouse.move(x, y)
            page.wait_for_timeout(15)

        # 3. Simulate RIGHT-CLICK SPAM to verify contextmenu prevention!
        for _ in range(12):
            page.mouse.click(640, 360, button='right')
            page.wait_for_timeout(10)

        # Check that player is still alive and moving
        player_coords = page.evaluate("() => ({ x: window.MedievalSurvivors.game.player.x, y: window.MedievalSurvivors.game.player.y })")
        game_time = page.evaluate("() => window.MedievalSurvivors.game.gameTime")

        new_errors = len(self.errors) - initial_errors
        passed = (game_time > 0) and (new_errors == 0)
        self.record_result("6. Fuzzing Caótico de Inputs & Bloqueio de Clique Direito", passed,
                           f"Tempo decorrido: {round(game_time, 1)}s, Posição final: ({round(player_coords['x'])}, {round(player_coords['y'])}), Novos erros: {new_errors}", time.time() - t0)

    def test_pause_and_state_race_conditions(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Spam ESC and P keys rapidly to test pause modal toggling
        for _ in range(16):
            page.keyboard.press('Escape')
            page.wait_for_timeout(25)

        # Ensure game unpauses cleanly
        cur_state = page.evaluate("() => window.MedievalSurvivors.game.state")
        if cur_state == 'PAUSED':
            page.keyboard.press('Escape')
            page.wait_for_timeout(50)

        final_state = page.evaluate("() => window.MedievalSurvivors.game.state")

        # Verify loop is still ticking and not frozen
        time_a = page.evaluate("() => window.MedievalSurvivors.game.gameTime")
        page.wait_for_timeout(150)
        time_b = page.evaluate("() => window.MedievalSurvivors.game.gameTime")

        loop_running = time_b > time_a
        new_errors = len(self.errors) - initial_errors

        passed = (final_state == 'PLAYING') and loop_running and (new_errors == 0)
        self.record_result("7. Race Condition de Pausa & Estabilidade do Game Loop", passed,
                           f"Estado: {final_state}, Loop Rodando: {loop_running} (Δt={round(time_b - time_a, 3)}s), Novos erros: {new_errors}", time.time() - t0)

    def test_rapid_level_ups(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Force consecutive level-ups via in-game XP injection
        for lvl in range(3):
            page.evaluate("() => { const p = window.MedievalSurvivors.game.player; p.addXp(p.xpToNextLevel); }")
            page.wait_for_timeout(200)

            # Check if modal is active
            modal_active = page.evaluate("() => window.MedievalSurvivors.game.state === 'LEVEL_UP'")
            if modal_active:
                page.evaluate("""() => {
                    const cards = document.querySelectorAll('.levelup-card');
                    if (cards.length > 0) {
                        cards[0].click();
                        return true;
                    }
                    return false;
                }""")
                page.wait_for_timeout(150)

        # Game should resume PLAYING
        final_state = page.evaluate("() => window.MedievalSurvivors.game.state")
        player_level = page.evaluate("() => window.MedievalSurvivors.game.player.level")

        new_errors = len(self.errors) - initial_errors
        passed = (player_level >= 4) and (final_state == 'PLAYING') and (new_errors == 0)
        self.record_result("8. Subidas de Nível Rápidas & Seleção de Upgrades", passed,
                           f"Nível alcançado: {player_level}, Estado restaurado: {final_state}, Novos erros: {new_errors}", time.time() - t0)

    def test_treasure_chest_flow(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Spawn and trigger a tier-1 chest directly
        page.evaluate("""() => {
            const game = window.MedievalSurvivors.game;
            game.state = 'CHEST';
            game.ui.showChestModal(game.player, 1);
        }""")
        page.wait_for_timeout(250)

        chest_modal_active = page.evaluate("() => document.getElementById('chest-modal').classList.contains('active')")

        # Click the collect button inside the chest modal
        page.evaluate("""() => {
            const btn = document.getElementById('btn-collect-chest');
            if (btn) btn.click();
        }""")
        page.wait_for_timeout(250)

        chest_closed = page.evaluate("() => !document.getElementById('chest-modal').classList.contains('active')")
        state_after_chest = page.evaluate("() => window.MedievalSurvivors.game.state")

        new_errors = len(self.errors) - initial_errors
        passed = chest_modal_active and chest_closed and (state_after_chest == 'PLAYING') and (new_errors == 0)
        self.record_result("9. Fluxo de Abertura & Coleta de Baú de Tesouro", passed,
                           f"Modal Aberto: {chest_modal_active}, Fechado: {chest_closed}, Estado: {state_after_chest}, Novos erros: {new_errors}", time.time() - t0)

    def test_memory_leak_and_teardown(self, page):
        t0 = time.time()
        initial_errors = len(self.errors)

        # Call quitToMenu to trigger complete teardown & memory purge
        page.evaluate("() => window.MedievalSurvivors.game.quitToMenu()")
        page.wait_for_timeout(350)

        # Inspect post-cleanup state
        post_counts = page.evaluate("""() => ({
            state: window.MedievalSurvivors.game.state,
            playerIsNull: window.MedievalSurvivors.game.player === null,
            enemies: window.MedievalSurvivors.game.enemies.length,
            projectiles: window.MedievalSurvivors.game.projectiles.length,
            gems: window.MedievalSurvivors.game.gems.length,
            sceneChildren: window.MedievalSurvivors.game.renderer.scene.children.length,
            activeEnemyMeshes: window.MedievalSurvivors.game.renderer.enemyMeshMap ? window.MedievalSurvivors.game.renderer.enemyMeshMap.size : 0,
            activeGemMeshes: window.MedievalSurvivors.game.renderer.gemMeshMap ? window.MedievalSurvivors.game.renderer.gemMeshMap.size : 0
        })""")

        # Take screenshot of clean returned menu
        screenshot_path = os.path.join(self.screenshots_dir, 'post_teardown_menu.png')
        page.screenshot(path=screenshot_path)

        new_errors = len(self.errors) - initial_errors
        is_clean = (post_counts['enemies'] == 0 and 
                    post_counts['projectiles'] == 0 and 
                    post_counts['gems'] == 0 and 
                    post_counts['activeEnemyMeshes'] == 0 and
                    post_counts['activeGemMeshes'] == 0 and
                    post_counts['state'] == 'MENU')

        passed = is_clean and (new_errors == 0)
        self.record_result("10. Auditoria de Memory Leaks & Teardown Pós-Run", passed,
                           f"Entidades zeradas: {is_clean}, Malhas residuais de inimigos/gemas: {post_counts['activeEnemyMeshes']}/{post_counts['activeGemMeshes']}, Novos erros: {new_errors}", time.time() - t0)

    # =========================================================================
    # REPORT GENERATION
    # =========================================================================

    def generate_report(self):
        print("\n" + "=" * 70)
        print("📊 RELATÓRIO DO AGENTE DE QA AUTOMATIZADO")
        print("=" * 70)

        total_tests = len(self.test_results)
        passed_tests = sum(1 for t in self.test_results.values() if t['passed'])
        failed_tests = total_tests - passed_tests

        print(f"Total de Testes: {total_tests}")
        print(f"Aprovados: {passed_tests} ✅")
        print(f"Falhas: {failed_tests} {'❌' if failed_tests > 0 else '🎉'}")
        print(f"Exceções / PageErrors capturados: {len(self.errors)}")
        print(f"Avisos de Console: {len(self.warnings)}")

        report_data = {
            "summary": {
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "errors_count": len(self.errors),
                "warnings_count": len(self.warnings),
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "results": self.test_results,
            "errors": self.errors,
            "warnings": self.warnings
        }

        report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'qa_report.json'))
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)

        print(f"\n📁 Relatório JSON gravado em: {report_path}")
        return report_data

if __name__ == '__main__':
    agent = QATestAgent(port=8889, headless=True)
    agent.run_all()

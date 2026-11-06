/**
 * Medieval Survivors - UI Controller & Modal System
 * Handles all HUD updates, modals, and the Main Menu with tabs.
 */
class UIController {
  constructor(game) {
    this.game = game;

    // HUD Elements
    this.xpFill = document.getElementById('xp-fill');
    this.xpText = document.getElementById('xp-text');
    this.levelBadge = document.getElementById('level-badge');
    this.timerText = document.getElementById('timer-text');
    this.killsText = document.getElementById('kills-text');
    this.goldText = document.getElementById('gold-text');
    this.etherText = document.getElementById('ether-text');
    this.hpFill = document.getElementById('hp-fill');
    this.hpText = document.getElementById('hp-text');
    this.weaponSlotsContainer = document.getElementById('weapon-slots');
    this.passiveSlotsContainer = document.getElementById('passive-slots');
    this.bossWarning = document.getElementById('boss-warning');
    this.bossNameElem = document.getElementById('boss-name');

    // Modals
    this.levelUpModal = document.getElementById('level-up-modal');
    this.levelUpCards = document.getElementById('level-up-cards');
    this.chestModal = document.getElementById('chest-modal');
    this.chestRewards = document.getElementById('chest-rewards');
    this.gameOverModal = document.getElementById('game-over-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.victoryModal = document.getElementById('victory-modal');
    this.bloodAltarModal = document.getElementById('blood-altar-modal');
    this.bloodPactCards = document.getElementById('blood-pact-cards');
    this.bloodAltarCostText = document.getElementById('blood-altar-cost-text');
    this.btnRefuseBloodPact = document.getElementById('btn-refuse-blood-pact');
    this.mainMenuModal = document.getElementById('main-menu-modal');
    this.authModal = document.getElementById('auth-modal');
    this.menuTabContent = document.getElementById('menu-tab-content');

    // Track selected class in menu
    this._menuSelectedClass = game.selectedClassId || 'knight';
    this._authMode = 'login'; // 'login' or 'register'

    this.bindEvents();
    this.bindAuthEvents();
  }

  bindEvents() {
    // Blood Altar refuse button
    if (this.btnRefuseBloodPact) {
      this.btnRefuseBloodPact.addEventListener('click', () => {
        if (this.bloodAltarModal) this.bloodAltarModal.classList.remove('active');
        if (this.game && this.game.resume) {
          this.game.resume();
        } else if (this.game) {
          this.game.state = 'PLAYING';
        }
      });
    }

    // Sound toggle button
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = window.MedievalSurvivors.sound.toggleMute();
        soundBtn.innerHTML = isMuted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
      });
    }

    // Auto-Gold toggle button (HUD)
    const autoGoldBtn = document.getElementById('btn-auto-gold-hud');
    if (autoGoldBtn) {
      autoGoldBtn.addEventListener('click', () => {
        this.game.toggleAutoGold();
        this.updateAutoGoldButton();
        if (this.currentMenuTab === 'settings') {
          this.renderSettingsTab();
        }
      });
      this.updateAutoGoldButton();
    }

    // Mouse aim toggle button (HUD)
    const mouseAimBtn = document.getElementById('btn-mouse-aim');
    if (mouseAimBtn) {
      mouseAimBtn.addEventListener('click', () => {
        this.game.toggleMouseAim();
        this.updateMouseAimButton();
      });
    }

    // Main Menu button (HUD)
    const mainMenuBtn = document.getElementById('btn-main-menu');
    if (mainMenuBtn) {
      mainMenuBtn.addEventListener('click', () => {
        if (this.game.state === 'PLAYING') {
          this.game.state = 'PAUSED';
        }
        this.openMainMenu('play');
      });
    }

    // Pause button
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.game.togglePause();
      });
    }

    // Resume button
    const resumeBtn = document.getElementById('btn-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.game.togglePause();
      });
    }

    // Restart buttons (all elements with btn-restart class)
    document.querySelectorAll('.btn-restart').forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideAllModals();
        if (this.game && this.game.clearRunData) {
          this.game.clearRunData();
        }
        this.game.selectedClassId = this._menuSelectedClass;
        this.game.start();
      });
    });

    // Chest collect button
    const chestBtn = document.getElementById('btn-collect-chest');
    if (chestBtn) {
      chestBtn.addEventListener('click', () => {
        this.chestModal.classList.remove('active');
        this.game.resume();
      });
    }

    // Menu Music Toggle Button (Lobby)
    const menuMusicBtn = document.getElementById('btn-menu-music-toggle');
    if (menuMusicBtn) {
      menuMusicBtn.addEventListener('click', () => {
        if (window.MedievalSurvivors && window.MedievalSurvivors.sound) {
          window.MedievalSurvivors.sound.toggleLobbyMusic();
          this.updateMenuMusicButton();
          if (this.currentMenuTab === 'settings') {
            this.renderSettingsTab();
          }
        }
      });
      this.updateMenuMusicButton();
    }

    // Game Over → Forge button
    const gameoverForgeBtn = document.getElementById('btn-gameover-forge');
    if (gameoverForgeBtn) {
      gameoverForgeBtn.addEventListener('click', () => {
        this.gameOverModal.classList.remove('active');
        if (this.game && this.game.clearRunData) {
          this.game.clearRunData();
        }
        this.openMainMenu('forge');
      });
    }

    // Game Over → Menu button
    const gameoverMenuBtn = document.getElementById('btn-gameover-menu');
    if (gameoverMenuBtn) {
      gameoverMenuBtn.addEventListener('click', () => {
        this.gameOverModal.classList.remove('active');
        if (this.game && this.game.clearRunData) {
          this.game.clearRunData();
        }
        this.openMainMenu('play');
      });
    }

    // Victory → Forge button
    const victoryForgeBtn = document.getElementById('btn-victory-forge');
    if (victoryForgeBtn) {
      victoryForgeBtn.addEventListener('click', () => {
        this.victoryModal.classList.remove('active');
        if (this.game && this.game.clearRunData) {
          this.game.clearRunData();
        }
        this.openMainMenu('forge');
      });
    }

    // Victory → Menu button
    const victoryMenuBtn = document.getElementById('btn-victory-menu');
    if (victoryMenuBtn) {
      victoryMenuBtn.addEventListener('click', () => {
        this.victoryModal.classList.remove('active');
        if (this.game && this.game.clearRunData) {
          this.game.clearRunData();
        }
        this.openMainMenu('play');
      });
    }

    // Pause → Synergies Modal
    const pauseSynBtn = document.getElementById('btn-pause-synergies');
    if (pauseSynBtn) {
      pauseSynBtn.addEventListener('click', () => {
        this.openSynergiesModal();
      });
    }

    // Pause -> Retornar ao Menu (Encerra a partida e volta ao menu principal)
    const pauseQuitBtn = document.getElementById('btn-pause-quit');
    if (pauseQuitBtn) {
      pauseQuitBtn.addEventListener('click', () => {
        this.pauseModal.classList.remove('active');
        this.game.quitToMenu();
      });
    }

    // Close Synergies Modal
    const closeSynBtn = document.getElementById('btn-close-synergies');
    if (closeSynBtn) {
      closeSynBtn.addEventListener('click', () => {
        this.closeSynergiesModal();
      });
    }

    // Tab buttons in Main Menu
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchMenuTab(tab);
      });
    });
  }

  // ──────────────────────────────────────────────────────────────
  //  NEON AUTHENTICATION SYSTEM (LOGIN & CADASTRO)
  // ──────────────────────────────────────────────────────────────
  bindAuthEvents() {
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const displayGroup = document.getElementById('auth-display-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const submitText = document.getElementById('auth-submit-text');
    const btnGuest = document.getElementById('btn-auth-guest');
    const btnSwitchUser = document.getElementById('btn-switch-user');

    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        this._authMode = 'login';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        if (displayGroup) displayGroup.style.display = 'none';
        if (submitText) submitText.textContent = 'ADENTRAR O REINO';
        this.clearAuthMessage();
      });

      tabRegister.addEventListener('click', () => {
        this._authMode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        if (displayGroup) displayGroup.style.display = 'block';
        if (submitText) submitText.textContent = 'CONSAGRAR CONTA';
        this.clearAuthMessage();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleAuthSubmit());
    }

    // Support enter key on input fields
    ['auth-username', 'auth-password', 'auth-display-name'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleAuthSubmit();
          }
        });
      }
    });

    if (btnGuest) {
      btnGuest.addEventListener('click', () => {
        const guestUser = {
          id: 'guest_' + Date.now(),
          username: 'visitante',
          displayName: 'Visitante de Valoria',
          isGuest: true
        };
        localStorage.setItem('ms_auth_user', JSON.stringify(guestUser));
        if (this.game && this.game.saveManager) {
          this.game.saveManager.save();
        }
        this.hideAuthModal();
        this.updateUserBadge(guestUser);
        this.openMainMenu('play');
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSanctuaryActive) {
          window.MedievalSurvivors.sound.playSanctuaryActive();
        }
      });
    }

    if (btnSwitchUser) {
      btnSwitchUser.addEventListener('click', () => {
        localStorage.removeItem('ms_auth_user');
        this.closeMainMenu();
        this.showAuthModal();
      });
    }
  }

  initAuth() {
    const saved = localStorage.getItem('ms_auth_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.hideAuthModal();
        this.updateUserBadge(user);
        this.openMainMenu('play');
        return;
      } catch (e) {
        localStorage.removeItem('ms_auth_user');
      }
    }
    this.showAuthModal();
  }

  showAuthModal() {
    this.hideAllModals();
    if (this.authModal) {
      this.authModal.classList.add('active');
    }
  }

  hideAuthModal() {
    if (this.authModal) {
      this.authModal.classList.remove('active');
    }
  }

  closeMainMenu() {
    if (this.mainMenuModal) {
      this.mainMenuModal.classList.remove('active');
    }
  }

  updateUserBadge(user) {
    const badge = document.getElementById('menu-user-badge');
    if (!badge) return;
    const name = (user && (user.displayName || user.username)) || 'Visitante';
    badge.textContent = `👤 ${name}`;

    // Update settings player name
    if (this.game && this.game.saveManager && this.game.saveManager.data.settings) {
      this.game.saveManager.data.settings.playerName = name;
    }
  }

  setAuthMessage(text, isError = true) {
    const box = document.getElementById('auth-msg-box');
    if (!box) return;
    box.textContent = text;
    box.className = `auth-msg-box ${isError ? 'error' : 'success'}`;
    box.style.display = 'block';
  }

  clearAuthMessage() {
    const box = document.getElementById('auth-msg-box');
    if (box) {
      box.textContent = '';
      box.style.display = 'none';
    }
  }

  async handleAuthSubmit() {
    const userEl = document.getElementById('auth-username');
    const passEl = document.getElementById('auth-password');
    const displayEl = document.getElementById('auth-display-name');
    const submitBtn = document.getElementById('auth-submit-btn');

    const username = userEl ? userEl.value.trim() : '';
    const password = passEl ? passEl.value.trim() : '';
    const displayName = displayEl ? displayEl.value.trim() : '';

    if (!username || username.length < 3) {
      this.setAuthMessage('O nome de usuário deve ter pelo menos 3 caracteres.', true);
      return;
    }
    if (!password || password.length < 4) {
      this.setAuthMessage('A palavra-passe deve ter pelo menos 4 caracteres.', true);
      return;
    }

    const endpoint = this._authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = { username, password };
    if (this._authMode === 'register' && displayName) {
      body.displayName = displayName;
    }

    if (submitBtn) submitBtn.disabled = true;
    this.setAuthMessage('Consultando portões de Valoria...', false);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!data.success) {
        this.setAuthMessage(data.error || 'Falha ao autenticar.', true);
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      this.setAuthMessage(data.message || 'Portões abertos!', false);
      const user = data.user;
      localStorage.setItem('ms_auth_user', JSON.stringify(user));

      if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSanctuaryComplete) {
        window.MedievalSurvivors.sound.playSanctuaryComplete();
      }

      setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;
        this.hideAuthModal();
        this.updateUserBadge(user);
        this.openMainMenu('play');
      }, 550);
    } catch (err) {
      this.setAuthMessage('Servidor de autenticação offline. Você pode entrar como Visitante.', true);
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // ──────────────────────────────────────────────────────────────
  //  MOUSE AIM BUTTON
  // ──────────────────────────────────────────────────────────────
  updateMouseAimButton(forceState) {
    const btn = document.getElementById('btn-mouse-aim');
    if (!btn) return;
    const isActive = forceState !== undefined
      ? forceState
      : (this.game.saveManager ? this.game.saveManager.data.settings.mouseAim : true);
    btn.textContent = isActive ? '🎯 Mira: Mouse' : '🎯 Mira: Teclado';
  }

  updateAutoGoldButton(forceState) {
    const btn = document.getElementById('btn-auto-gold-hud');
    if (!btn) return;
    const isActive = forceState !== undefined
      ? forceState
      : (this.game.saveManager ? !!this.game.saveManager.data.settings.autoGoldOnMax : false);
    btn.textContent = isActive ? '💰 Auto-Ouro: Ligado' : '💰 Auto-Ouro: Deslig.';
    if (isActive) {
      btn.classList.add('active');
      btn.title = 'Auto-Ouro Ativo: Coleta ouro automaticamente ao subir de nível com tudo maximizado';
    } else {
      btn.classList.remove('active');
      btn.title = 'Auto-Ouro Desligado: Abre modal de nível para escolha manual';
    }
  }

  updateMenuMusicButton() {
    const btn = document.getElementById('btn-menu-music-toggle');
    if (!btn) return;
    const sound = window.MedievalSurvivors && window.MedievalSurvivors.sound;
    const isMuted = sound ? (sound.lobbyMuted || sound.muted) : false;
    const icon = document.getElementById('menu-music-icon');
    const text = document.getElementById('menu-music-text');
    if (icon) icon.textContent = isMuted ? '🔇' : '🎵';
    if (text) text.textContent = isMuted ? 'Música: Deslig.' : 'Música: Ligada';
    if (isMuted) {
      btn.classList.add('muted');
      btn.title = 'Música do Menu Silenciada (Clique para reativar)';
    } else {
      btn.classList.remove('muted');
      btn.title = 'Música do Menu Ativa (Clique para silenciar)';
    }
  }

  // ──────────────────────────────────────────────────────────────
  //  HUD UPDATES
  // ──────────────────────────────────────────────────────────────
  updateHUD(player, gameTime) {
    if (!player) return;

    // XP Bar (update only on change)
    const xpPercent = Math.min(100, Math.floor((player.xp / player.xpToNextLevel) * 100));
    if (this._lastXpPercent !== xpPercent) {
      this.xpFill.style.width = `${xpPercent}%`;
      this._lastXpPercent = xpPercent;
    }
    const xpText = `${player.xp} / ${player.xpToNextLevel} XP`;
    if (this._lastXpText !== xpText) {
      this.xpText.textContent = xpText;
      this._lastXpText = xpText;
    }
    if (this._lastLevel !== player.level) {
      this.levelBadge.textContent = `NÍVEL ${player.level}`;
      this._lastLevel = player.level;
    }

    // HP Bar (update only on change)
    const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    if (this._lastHpPercent !== hpPercent) {
      this.hpFill.style.width = `${hpPercent}%`;
      this._lastHpPercent = hpPercent;
    }
    const ceilHp = Math.ceil(player.hp);
    if (this._lastCeilHp !== ceilHp || this._lastMaxHp !== player.maxHp) {
      this.hpText.textContent = `${ceilHp} / ${player.maxHp} HP`;
      this._lastCeilHp = ceilHp;
      this._lastMaxHp = player.maxHp;
    }

    // Timer → MM:SS (throttled to 1Hz update)
    const totalSecs = Math.floor(gameTime);
    if (this._lastTotalSecs !== totalSecs) {
      this._lastTotalSecs = totalSecs;
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      this.timerText.textContent = hrs > 0
        ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Kills (update only on change)
    if (this._lastKills !== player.killCount) {
      this.killsText.textContent = player.killCount;
      this._lastKills = player.killCount;
    }

    // Gold (update only on change)
    if (this.goldText && this._lastGold !== player.gold) {
      this.goldText.textContent = player.gold;
      this._lastGold = player.gold;
    }

    // Éter Ancestral (update only on change)
    if (this.etherText && this._lastEther !== (player.ether || 0)) {
      this.etherText.textContent = player.ether || 0;
      this._lastEther = player.ether || 0;
    }

    // Equipment Slots (rebuilt only when items or levels mutate)
    this.updateEquipmentSlots(player);

    // Active Battle Modifiers Badges (Hyper Mode & Curse)
    this.updateHUDModifiers(this.game);
  }

  updateHUDModifiers(game) {
    if (!game) return;
    const container = document.getElementById('top-modifiers-container');
    if (!container) return;
    const sig = `${game.hyperMode ? 1 : 0}-${game.curseRank}`;
    if (this._lastModifiersSig === sig) return;
    this._lastModifiersSig = sig;

    let html = '';
    // Regra: Não exibir insígnia de Modo Competitivo durante a partida para manter a HUD limpa e focada
    if (game.hyperMode) {
      html += `<span class="modifier-hud-pill hyper-pill">⚡ HIPER (+50% 💰 / +30% 💎)</span>`;
    }
    if (game.curseRank > 0) {
      html += `<span class="modifier-hud-pill curse-pill">💀 MALDIÇÃO ${game.curseRank} (+${game.curseRank * 20}% 💰)</span>`;
    }
    container.innerHTML = html;
  }

  getCurseDescription(rank) {
    switch (rank) {
      case 0: return 'Nenhuma maldição ativa. Inimigos possuem velocidade, vida e dano normais.';
      case 1: return 'Pacto de Sangue I: Monstros +12% Vida & Dano, projéteis +8% rápidos (+20% Ouro).';
      case 2: return 'Pacto de Sangue II: Monstros +24% Vida & Dano, projéteis +16% rápidos (+40% Ouro).';
      case 3: return 'Pacto das Sombras III: Monstros +36% Vida & Dano, projéteis +24% rápidos (+60% Ouro).';
      case 4: return 'Pacto do Pesadelo IV: Monstros +48% Vida & Dano, projéteis +32% rápidos (+80% Ouro).';
      case 5: return 'Pacto Infernal V: Monstros +60% Vida & Dano, projéteis +40% rápidos (+100% Ouro / +25% Crítico).';
      default: return '';
    }
  }

  onGameStart() {
    const hint = document.getElementById('controls-hint');
    if (hint) {
      hint.classList.remove('fade-out');
      clearTimeout(this._hintTimeout);
      this._hintTimeout = setTimeout(() => {
        hint.classList.add('fade-out');
      }, 7000);
    }
  }

  updateEquipmentSlots(player) {
    let sig = '';
    for (let i = 0; i < player.weapons.length; i++) {
      const w = player.weapons[i];
      sig += `${w.id}:${w.level}:${w.isEvolved ? 1 : 0};`;
    }
    sig += '|';
    for (const [id, lvl] of player.passives.entries()) {
      sig += `${id}:${lvl};`;
    }
    if (this._lastEquipSig === sig) return;
    this._lastEquipSig = sig;

    // Weapons slots (up to 6)
    this.weaponSlotsContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'item-slot';
      if (player.weapons[i]) {
        slot.classList.add('active');
        if (player.weapons[i].isEvolved) {
          slot.classList.add('evolved');
        }
        const lvlStr = player.weapons[i].isEvolved ? 'EVO' : (player.weapons[i].level >= player.weapons[i].maxLevel ? 'MAX' : 'Nv.' + player.weapons[i].level);
        slot.innerHTML = `
          <span class="slot-icon">${player.weapons[i].icon}</span>
          <span class="slot-lvl">${lvlStr}</span>
        `;
        slot.title = `${player.weapons[i].name} (${player.weapons[i].isEvolved ? 'Evoluída' : 'Nv. ' + player.weapons[i].level})`;
      }
      this.weaponSlotsContainer.appendChild(slot);
    }

    // Passives slots (up to 6)
    this.passiveSlotsContainer.innerHTML = '';
    const passiveList = Array.from(player.passives.entries());
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'item-slot';
      if (passiveList[i]) {
        const [passiveId, lvl] = passiveList[i];
        const def = window.MedievalSurvivors.passives.get(passiveId);
        if (def) {
          slot.classList.add('active');
          slot.innerHTML = `
            <span class="slot-icon">${def.icon}</span>
            <span class="slot-lvl">${lvl >= def.maxLevel ? 'MAX' : 'Nv.' + lvl}</span>
          `;
          slot.title = `${def.name} (Nv. ${lvl})`;
        }
      }
      this.passiveSlotsContainer.appendChild(slot);
    }
  }

  // ──────────────────────────────────────────────────────────────
  //  BOSS WARNING
  // ──────────────────────────────────────────────────────────────
  showBossWarning(bossName) {
    this.bossNameElem.textContent = bossName;
    this.bossWarning.style.display = 'flex';
    setTimeout(() => {
      this.bossWarning.style.display = 'none';
    }, 4500);
  }

  showEventBanner(title, subtitle, color = '#f1c40f') {
    const banner = document.getElementById('arena-event-banner');
    if (!banner) return;
    const titleEl = document.getElementById('event-banner-title');
    const subEl = document.getElementById('event-banner-subtitle');
    if (titleEl) {
      titleEl.textContent = title;
      titleEl.style.color = color;
      titleEl.style.textShadow = `0 0 15px ${color}`;
    }
    if (subEl) {
      subEl.textContent = subtitle;
    }
    banner.style.borderColor = color;
    banner.style.boxShadow = `0 0 35px ${color}88, inset 0 0 20px ${color}33`;
    banner.style.display = 'flex';

    if (this._eventBannerTimeout) clearTimeout(this._eventBannerTimeout);
    this._eventBannerTimeout = setTimeout(() => {
      banner.style.display = 'none';
    }, 4500);
  }

  updateSanctuaryProgress(active, current = 0, max = 10) {
    const hud = document.getElementById('sanctuary-hud-progress');
    if (!hud) return;
    if (!active) {
      hud.style.display = 'none';
      return;
    }
    hud.style.display = 'flex';
    const fill = document.getElementById('sanctuary-fill');
    const txt = document.getElementById('sanctuary-text');
    const pct = Math.min(100, Math.max(0, (current / max) * 100));
    if (fill) fill.style.width = `${pct}%`;
    if (txt) txt.textContent = `Consagrando Santuário... ${current.toFixed(1)}s / ${max.toFixed(0)}s`;
  }

  showAchievementToast(achievement) {
    if (!this._toastContainer) {
      this._toastContainer = document.getElementById('achievement-toast-container');
      if (!this._toastContainer) {
        this._toastContainer = document.createElement('div');
        this._toastContainer.id = 'achievement-toast-container';
        this._toastContainer.className = 'achievement-toast-container';
        document.body.appendChild(this._toastContainer);
      }
    }

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-emblem-wrap">
        <span class="toast-emblem">${achievement.icon || '🏆'}</span>
      </div>
      <div class="toast-content">
        <div class="toast-ribbon">
          <span class="toast-tag">🏆 CONQUISTA DESBLOQUEADA!</span>
          ${achievement.reward && achievement.reward.gold ? `<span class="toast-gold">+${achievement.reward.gold} 💰</span>` : ''}
        </div>
        <div class="toast-title">${achievement.name}</div>
        <div class="toast-desc">${achievement.description}</div>
      </div>
    `;

    this._toastContainer.appendChild(toast);

    // Auto-dismiss after 4.5 seconds with graceful slide up & fade
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }, 4500);
  }

  // ──────────────────────────────────────────────────────────────
  //  LEVEL UP MODAL
  // ──────────────────────────────────────────────────────────────
  showLevelUpModal(player) {
    this.levelUpCards.innerHTML = '';
    const options = this.generateUpgradeOptions(player);

    // Auto-Ouro: quando todas as armas/passivas já estiverem no máximo e autoGoldOnMax estiver ligado
    const isAutoGold = this.game.saveManager && this.game.saveManager.data.settings.autoGoldOnMax;
    if (isAutoGold && options.length === 1 && options[0].type === 'gold_bag') {
      options[0].apply();
      this.levelUpModal.classList.remove('active');
      this.game.resume();
      return;
    }

    window.MedievalSurvivors.sound.playLevelUp();

    options.forEach(opt => {
      const card = document.createElement('div');
      let badgeClass = opt.currentLevel === 0 ? 'badge-new' : 'badge-upgrade';
      let badgeText = opt.currentLevel === 0 ? 'NOVO' : `NÍVEL ${opt.currentLevel + 1}`;
      let cardClass = 'card-option';

      if (opt.isSupreme) {
        badgeClass = 'badge-supreme';
        badgeText = '👑 FUSÃO SUPREMA!';
        cardClass += ' card-supreme';
      } else if (opt.isAscension) {
        badgeClass = 'badge-ascension';
        badgeText = '✨ ASCENSÃO DIVINA!';
        cardClass += ' card-ascension';
      }

      card.className = cardClass;

      const banishBtnHTML = (player.banishCharges > 0 && opt.type !== 'heal' && !opt.isSupreme)
        ? `<button class="card-banish-btn" title="Banir este item pelo restante da run">🚫 Banir (${player.banishCharges})</button>`
        : '';

      card.innerHTML = `
        ${banishBtnHTML}
        <span class="card-badge ${badgeClass}">${badgeText}</span>
        <div class="card-icon">${opt.icon}</div>
        <div class="card-name">${opt.name}</div>
        <div class="card-level">${opt.isSupreme ? '✨ Fusão Mítica de Armas' : (opt.isAscension ? '✨ Despertar de Sinergia' : (opt.currentLevel === 0 ? 'Adquirir Armamento/Poder' : `Nv. ${opt.currentLevel} ➔ ${opt.currentLevel + 1}`))}</div>
        <div class="card-desc">${opt.description}</div>
        <div class="card-stats">${opt.diff}</div>
      `;

      if (player.banishCharges > 0 && opt.type !== 'heal' && !opt.isSupreme) {
        const banishBtn = card.querySelector('.card-banish-btn');
        if (banishBtn) {
          banishBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            player.banishCharges--;
            if (!player.bannedIds) player.bannedIds = new Set();
            player.bannedIds.add(opt.id);
            if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playWoodHit) {
              window.MedievalSurvivors.sound.playWoodHit();
            }
            this.showLevelUpModal(player);
          });
        }
      }

      card.addEventListener('click', () => {
        opt.apply();
        this.levelUpModal.classList.remove('active');
        this.game.resume();
      });

      this.levelUpCards.appendChild(card);
    });

    // Update and wire Reroll Button
    const rerollBtn = document.getElementById('btn-reroll-levelup');
    const rerollCount = document.getElementById('reroll-count-val');
    if (rerollCount) rerollCount.textContent = player.rerolls || 0;
    if (rerollBtn) {
      rerollBtn.disabled = (player.rerolls || 0) <= 0;
      rerollBtn.style.opacity = (player.rerolls || 0) > 0 ? '1' : '0.5';
      rerollBtn.onclick = () => {
        if ((player.rerolls || 0) > 0) {
          player.rerolls--;
          if (rerollCount) rerollCount.textContent = player.rerolls;
          window.MedievalSurvivors.sound.playGemPickup();
          this.showLevelUpModal(player);
        }
      };
    }

    // Update and wire Skip Button
    const skipBtn = document.getElementById('btn-skip-levelup');
    if (skipBtn) {
      skipBtn.onclick = () => {
        player.heal(player.maxHp * 0.25);
        player.gold += 35;
        this.game.addFloatingText(player.x, player.y - 15, '+35 💰 & +25% HP', '#2ecc71', true);
        window.MedievalSurvivors.sound.playGemPickup();
        this.levelUpModal.classList.remove('active');
        this.game.resume();
      };
    }

    this.levelUpModal.classList.add('active');
  }

  generateUpgradeOptions(player) {
    const options = [];

    // 0. Check for Supreme Weapon Fusions (Both weapons at Level 8)
    if (window.MedievalSurvivors.synergies) {
      const fusions = window.MedievalSurvivors.synergies.getAvailableFusions(player);
      fusions.forEach(fusion => {
        options.push({
          type: 'supreme_fusion',
          id: fusion.id,
          name: fusion.name,
          icon: fusion.icon,
          currentLevel: 8,
          isSupreme: true,
          description: fusion.description,
          diff: `FUSÃO SUPREMA! Funde ${fusion.item1.name} (Nv. 8) + ${fusion.item2.name} (Nv. 8) em uma ARMA SUPREMA! Libera 1 slot de arma!`,
          apply: () => {
            window.MedievalSurvivors.synergies.executeFusion(player, fusion.id);
          }
        });
      });

      // Check for Weapon + Passive Ascensions
      const ascensions = window.MedievalSurvivors.synergies.getAvailableAscensions(player);
      ascensions.forEach(asc => {
        options.push({
          type: 'weapon_ascension',
          id: asc.id,
          name: asc.name,
          icon: '✨ ' + asc.weaponIcon,
          currentLevel: 8,
          isAscension: true,
          description: `Despertar Sagrado: ${asc.weaponName} + ${asc.passiveName}!`,
          diff: asc.effect,
          apply: () => {
            const wep = player.weapons.find(w => w.id === asc.weaponId);
            if (wep) {
              wep.hasAscended = true;
              wep.baseDamage = Math.round(wep.baseDamage * 1.45);
              wep.baseArea = wep.baseArea * 1.35;
              if (window.MedievalSurvivors.saveManager) {
                window.MedievalSurvivors.saveManager.discoverSynergy(asc.id);
              }
            }
          }
        });
      });
    }

    // 1. Existing weapon upgrades
    player.weapons.forEach(w => {
      if (w.level < w.maxLevel) {
        options.push({
          type: 'weapon_upgrade',
          id: w.id,
          name: w.name,
          icon: w.icon,
          currentLevel: w.level,
          description: w.description,
          diff: w.getNextLevelDiff(),
          apply: () => { w.upgrade(); }
        });
      }
    });

    // 2. New weapons (if slots available < 6)
    if (player.weapons.length < 6) {
      const allWeaponIds = window.MedievalSurvivors.weapons.getAllWeaponIds();
      const currentIds = new Set(player.weapons.map(w => w.id));

      allWeaponIds.forEach(wid => {
        if (!currentIds.has(wid)) {
          if (window.MedievalSurvivors.saveManager && !window.MedievalSurvivors.saveManager.isWeaponUnlocked(wid)) {
            return; // Locked behind achievement!
          }
          const sample = window.MedievalSurvivors.weapons.create(wid);
          if (sample) {
            options.push({
              type: 'weapon_new',
              id: wid,
              name: sample.name,
              icon: sample.icon,
              currentLevel: 0,
              description: sample.description,
              diff: `Novo Armamento! Dano Base: ${sample.damage}`,
              apply: () => {
                const newWep = window.MedievalSurvivors.weapons.create(wid);
                newWep.upgrade();
                player.weapons.push(newWep);
                if (window.MedievalSurvivors.saveManager) {
                  window.MedievalSurvivors.saveManager.checkAchievements('weapon_acquired', null, this.game);
                }
              }
            });
          }
        }
      });
    }

    // 3. Existing passive upgrades
    player.passives.forEach((lvl, pid) => {
      const def = window.MedievalSurvivors.passives.get(pid);
      if (def && lvl < def.maxLevel) {
        options.push({
          type: 'passive_upgrade',
          id: pid,
          name: def.name,
          icon: def.icon,
          currentLevel: lvl,
          description: def.description,
          diff: def.getNextLevelDiff(lvl),
          apply: () => {
            const nextLvl = lvl + 1;
            player.passives.set(pid, nextLvl);
            def.apply(player, nextLvl);
          }
        });
      }
    });

    // 4. New passives (if slots available < 6)
    if (player.passives.size < 6) {
      const allPassives = window.MedievalSurvivors.passives.getAll();
      allPassives.forEach(def => {
        if (!player.passives.has(def.id)) {
          if (window.MedievalSurvivors.saveManager && !window.MedievalSurvivors.saveManager.isPassiveUnlocked(def.id)) {
            return; // Locked behind achievement!
          }
          options.push({
            type: 'passive_new',
            id: def.id,
            name: def.name,
            icon: def.icon,
            currentLevel: 0,
            description: def.description,
            diff: def.getNextLevelDiff(0),
            apply: () => {
              player.passives.set(def.id, 1);
              def.apply(player, 1);
            }
          });
        }
      });
    }

    // Filter out banned options
    const filteredOptions = options.filter(opt => !player.bannedIds || !player.bannedIds.has(opt.id));

    // If everything maxed or banned, grant a banquet reward
    if (filteredOptions.length === 0) {
      return [{
        type: 'gold_bag',
        name: 'Tesouro Imperial dos Ancestrais',
        icon: '💰',
        currentLevel: 0,
        description: 'Todo o seu arsenal já atingiu o poder máximo! O avanço de nível é convertido diretamente em ouro e vigor.',
        diff: '+100 💰 Moedas de Ouro & +50% Vida',
        apply: () => {
          player.heal(player.maxHp * 0.5);
          player.gold += 100;
          this.game.addFloatingText(player.x, player.y - 15, '+100 💰 & +50% HP', '#f1c40f', true);
          if (window.MedievalSurvivors.sound) window.MedievalSurvivors.sound.playGemPickup();
        }
      }];
    }

    const supremeOptions = filteredOptions.filter(o => o.isSupreme || o.isAscension);
    const standardOptions = filteredOptions.filter(o => !o.isSupreme && !o.isAscension);
    shuffleArray(standardOptions);
    const result = supremeOptions.concat(standardOptions);
    return result.slice(0, 3);
  }

  // ──────────────────────────────────────────────────────────────
  //  CHEST MODAL
  // ──────────────────────────────────────────────────────────────
  showChestModal(player, tier) {
    this.chestRewards.innerHTML = '';
    const rewardCount = tier === 3 ? 5 : (tier === 2 ? 3 : 1);

    const subtitle = this.chestModal ? this.chestModal.querySelector('.modal-subtitle') : null;
    if (subtitle) {
      subtitle.textContent = tier === 1
        ? 'Você derrotou um guerreiro de elite e saqueou seu baú do tesouro:'
        : 'Você derrotou um poderoso lorde das trevas e saqueou seu tesouro régio:';
    }

    for (let i = 0; i < rewardCount; i++) {
      // 1. Armas atualmente possuídas que ainda podem receber upgrade
      const availableWeapons = (player.weapons || []).filter(w => w.level < w.maxLevel);

      // 2. Passivas atualmente possuídas que ainda podem receber upgrade
      const availablePassives = [];
      if (player.passives && window.MedievalSurvivors.passives) {
        player.passives.forEach((lvl, pid) => {
          const def = window.MedievalSurvivors.passives.get(pid);
          if (def && lvl < def.maxLevel) {
            availablePassives.push({ id: pid, def, currentLvl: lvl });
          }
        });
      }

      // 3. Pool de upgrades restrito exclusivamente a armas e passivas que o herói já possui
      const candidates = [];
      availableWeapons.forEach(w => candidates.push({ type: 'weapon', item: w }));
      availablePassives.forEach(p => candidates.push({ type: 'passive', item: p }));

      if (candidates.length > 0) {
        const choice = candidates[Math.floor(Math.random() * candidates.length)];

        if (choice.type === 'weapon') {
          const wep = choice.item;
          wep.upgrade();
          const cfg = wep.levelsConfig && wep.levelsConfig[wep.level - 1];
          const diffText = (cfg && cfg.description) || (wep.level >= wep.maxLevel ? 'Nível Máximo Atingido!' : 'Aprimora dano e eficiência.');

          const row = document.createElement('div');
          row.className = 'reward-row';
          row.innerHTML = `
            <div class="reward-icon">${wep.icon || '⚔️'}</div>
            <div class="reward-info">
              <h4>${wep.name} Aprimorado!</h4>
              <p>Novo Nível: ${wep.level} - ${diffText}</p>
            </div>
          `;
          this.chestRewards.appendChild(row);
        } else {
          const { id, def, currentLvl } = choice.item;
          const nextLvl = currentLvl + 1;
          const diffText = def.getNextLevelDiff ? def.getNextLevelDiff(currentLvl) : `Nível ${nextLvl}`;
          player.passives.set(id, nextLvl);
          if (def.apply) {
            def.apply(player, nextLvl);
          }

          const row = document.createElement('div');
          row.className = 'reward-row';
          row.innerHTML = `
            <div class="reward-icon">${def.icon || '✨'}</div>
            <div class="reward-info">
              <h4>${def.name} Aprimorada!</h4>
              <p>Novo Nível: ${nextLvl} - ${diffText}</p>
            </div>
          `;
          this.chestRewards.appendChild(row);
        }
      } else {
        // Recompensa alternativa caso todas as armas e passivas possuídas já estejam no nível máximo
        player.heal(player.maxHp * 0.3);
        player.gold += 100;
        const row = document.createElement('div');
        row.className = 'reward-row';
        row.innerHTML = `
          <div class="reward-icon">💰</div>
          <div class="reward-info">
            <h4>Tesouro de Ouro & Vitalidade!</h4>
            <p>+100 Ouro e +30% Vida Restaurada.</p>
          </div>
        `;
        this.chestRewards.appendChild(row);
      }
    }

    if (this.updateEquipmentSlots) {
      this.updateEquipmentSlots(player);
    }

    this.chestModal.classList.add('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  BLOOD ALTAR MODAL (PACTOS CARMESINS)
  // ──────────────────────────────────────────────────────────────
  showBloodAltarModal(player, altar, game) {
    if (!this.bloodAltarModal || !this.bloodPactCards) return;
    game.state = 'PAUSED';

    const costHp = Math.max(1, Math.floor(player.hp * 0.35));
    if (this.bloodAltarCostText) {
      this.bloodAltarCostText.textContent = `-${costHp} HP (35% da sua Vida Atual)`;
    }

    this.bloodPactCards.innerHTML = '';

    const pacts = [
      {
        id: 'cataclysm',
        badge: 'ANIMA CARMESIM',
        icon: '🩸',
        title: 'Cataclisma Carmesim',
        desc: 'Libera uma colossal onda de choque abissal que oblitera todos os monstros na tela, gera +15 Éter Ancestral e gera +35 Gemas de Sangue no chão.',
        action: () => {
          if (game.renderer && game.renderer.triggerShake) game.renderer.triggerShake(12, 0.6);
          if (game.renderer && game.renderer.triggerDamageFlash) game.renderer.triggerDamageFlash(0.4);

          let kills = 0;
          for (let i = 0; i < game.enemies.length; i++) {
            const e = game.enemies[i];
            if (!e.alive) continue;
            if (!e.isBoss) {
              e.takeDamage(99999, 0, 0, 0);
              kills++;
            } else {
              e.takeDamage(Math.round(e.maxHp * 0.25), 0, 0, 0);
            }
          }

          if (player.addEther) player.addEther(15, true);
          for (let g = 0; g < 35; g++) {
            const ang = Math.random() * Math.PI * 2;
            const rad = 25 + Math.random() * 95;
            game.gems.push(new window.MedievalSurvivors.XpGem(player.x + Math.cos(ang) * rad, player.y + Math.sin(ang) * rad, 3));
          }

          game.addFloatingText(player.x, player.y - 45, '💥 CATACLISMA CARMESIM!', '#ff1744', true);
        }
      },
      {
        id: 'forge',
        badge: 'FORJA DE SANGUE',
        icon: '⚔️',
        title: 'Forja do Sangue Nobre',
        desc: 'O sangue derramado alimenta instantaneamente uma arma equipada (+1 Grau Imediato) e concede +100 Ouro Real.',
        action: () => {
          const upgradeables = player.weapons.filter(w => w.level < w.maxLevel);
          if (upgradeables.length > 0) {
            const chosen = upgradeables[Math.floor(Math.random() * upgradeables.length)];
            chosen.upgrade();
            game.addFloatingText(player.x, player.y - 40, `✨ ${chosen.name} Aprimorada!`, '#f1c40f', true);
          }
          player.gold = (player.gold || 0) + 35;
          if (game.saveManager) game.saveManager.addGold(35);
          game.addFloatingText(player.x, player.y - 20, '+35 💰 Ouro Real', '#ffd700', false);
        }
      },
      {
        id: 'might',
        badge: 'PODER PROIBIDO',
        icon: '💀',
        title: 'Poder Titânico Eterno',
        desc: 'Pacto de sangue vitalício: concede permanentemente +15% de Dano Global e +10% de Raio de Efeito até o final desta expedição.',
        action: () => {
          player.bonusDamageMultiplier = (player.bonusDamageMultiplier || 0) + 0.15;
          player.bonusAreaMultiplier = (player.bonusAreaMultiplier || 0) + 0.10;
          game.addFloatingText(player.x, player.y - 40, '+15% Dano & +10% Área!', '#e056fd', true);
        }
      }
    ];

    pacts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'blood-pact-card';
      card.innerHTML = `
        <div class="blood-pact-icon">${p.icon}</div>
        <div class="blood-pact-info">
          <span class="blood-pact-badge">${p.badge}</span>
          <h4 class="blood-pact-title">${p.title}</h4>
          <p class="blood-pact-desc">${p.desc}</p>
        </div>
      `;

      card.onclick = () => {
        // Sacrifice current HP
        player.hp -= costHp;
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playPlayerDamage) {
          window.MedievalSurvivors.sound.playPlayerDamage();
        }
        if (game.particles && game.particles.createBloodSparks) {
          game.particles.createBloodSparks(player.x, player.y, 40, '#c0392b');
        }
        game.addFloatingText(player.x, player.y - 25, `-${costHp} HP (Sacrifício)`, '#ff3333', true);

        // Execute pact
        p.action();

        if (game.saveManager) {
          if (!game.saveManager.data.stats) game.saveManager.data.stats = {};
          game.saveManager.data.stats.totalBloodPactsSealed = (game.saveManager.data.stats.totalBloodPactsSealed || 0) + 1;
        }

        // Update HUD & close
        this.updateHUD(player, game.gameTime);
        this.bloodAltarModal.classList.remove('active');

        // Mark altar as consumed
        if (altar) {
          altar.used = true;
          altar.alive = false;
        }

        if (game && game.resume) {
          game.resume();
        } else if (game) {
          game.state = 'PLAYING';
        }
      };

      this.bloodPactCards.appendChild(card);
    });

    this.bloodAltarModal.classList.add('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  GAME OVER MODAL
  // ──────────────────────────────────────────────────────────────
  renderWeaponBreakdown(containerEl, player, gameTime) {
    if (!containerEl || !player || !player.weapons) return;
    const totalDmg = player.weapons.reduce((sum, w) => sum + (w.totalDamageDealt || 0), 0) || 1;
    const timeSafe = Math.max(1, gameTime);

    containerEl.innerHTML = player.weapons.map(w => {
      const dmg = w.totalDamageDealt || 0;
      const pct = Math.min(100, Math.round((dmg / totalDmg) * 100));
      const dps = (dmg / timeSafe).toFixed(1);
      const isMax = w.level >= w.maxLevel;
      const lvlLabel = w.hasAscended ? '✨ Ascensão' : (isMax ? 'Nv. MAX' : `Nv. ${w.level}`);

      return `
      <div style="background:rgba(0,0,0,0.22); padding:4px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); box-sizing:border-box;">
        <div style="display:flex; justify-content:space-between; margin-bottom:2px; font-size:0.78rem; align-items:center;">
          <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${w.icon} <strong>${w.name}</strong> <span style="color:#d4af37; font-size:0.72rem;">(${lvlLabel})</span>:</span>
          <span style="color:#f7d774; font-weight:700; font-size:0.76rem; white-space:nowrap; margin-left:4px;">${dmg.toLocaleString()} <span style="color:#00e5ff; font-size:0.70rem;">(${dps} DPS | ${pct}%)</span></span>
        </div>
        <div style="width:100%; height:5px; background:#120c18; border-radius:3px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #d35400, #f1c40f); border-radius:3px;"></div>
        </div>
      </div>
      `;
    }).join('');
  }

  showGameOver(player, gameTime) {
    const mins = Math.floor(gameTime / 60);
    const secs = Math.floor(gameTime % 60);
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    document.getElementById('stat-time').textContent = timeStr;
    document.getElementById('stat-level').textContent = player.level;
    document.getElementById('stat-kills').textContent = player.killCount;

    const statGold = document.getElementById('stat-gold');
    if (statGold) statGold.textContent = `+${player.gold} 💰`;
    const statEther = document.getElementById('stat-ether');
    if (statEther) statEther.textContent = `+${player.ether || 0} 🔮`;

    // Weapon DPS breakdown with visual progress bars
    const breakdown = document.getElementById('weapon-breakdown');
    this.renderWeaponBreakdown(breakdown, player, gameTime);

    this.gameOverModal.classList.add('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  VICTORY MODAL
  // ──────────────────────────────────────────────────────────────
  showVictory(player, gameTime, bonusGold) {
    const killsEl = document.getElementById('victory-kills');
    const goldEl = document.getElementById('victory-gold');
    if (killsEl) killsEl.textContent = player.killCount;
    if (goldEl) goldEl.textContent = `${player.gold} 💰`;
    const vicEther = document.getElementById('victory-ether');
    if (vicEther) vicEther.textContent = `+${player.ether || 0} 🔮`;

    const victoryBreakdown = document.getElementById('victory-weapon-breakdown');
    this.renderWeaponBreakdown(victoryBreakdown, player, gameTime);

    this.victoryModal.classList.add('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  PAUSE MODAL
  // ──────────────────────────────────────────────────────────────
  showPauseModal() {
    this.pauseModal.classList.add('active');
  }

  hidePauseModal() {
    this.pauseModal.classList.remove('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  MAIN MENU
  // ──────────────────────────────────────────────────────────────
  openMainMenu(tab) {
    this.game.state = 'MENU';
    if (this.game && this.game.clearRunData) {
      this.game.clearRunData();
    }
    this._menuSelectedClass = this.game.selectedClassId || 'knight';
    this.updateMenuGoldDisplay();
    this.hideAllModals();
    this.mainMenuModal.classList.add('active');
    this.updateMenuMusicButton();
    this.switchMenuTab(tab || 'play');
    if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.startLobbyMusic) {
      window.MedievalSurvivors.sound.startLobbyMusic();
    }
  }

  updateMenuGoldDisplay() {
    const el = document.getElementById('menu-gold-val');
    if (el && this.game.saveManager) {
      el.textContent = this.game.saveManager.getGold().toLocaleString();
    }
    const etherEl = document.getElementById('menu-ether-val');
    if (etherEl && this.game.saveManager) {
      etherEl.textContent = (this.game.saveManager.getEther ? this.game.saveManager.getEther() : 0).toLocaleString();
    }
  }

  switchMenuTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Render the tab content
    switch (tabName) {
      case 'play':      this.renderPlayTab();      break;
      case 'heroes':    this.renderHeroesTab();    break;
      case 'tree':      this.renderSkillTreeTab(); break;
      case 'forge':     this.renderForgeTab();     break;
      case 'synergies': this.renderSynergiesTab(); break;
      case 'codex':     this.renderCodexTab();     break;
      case 'achievements': this.renderAchievementsTab(); break;
      case 'leaderboard':  this.renderLeaderboardTab();  break;
      case 'history':   this.renderHistoryTab();   break;
      case 'updates':   this.renderUpdatesTab();   break;
      case 'settings':  this.renderSettingsTab();  break;
      default:          this.renderPlayTab();
    }
  }

  // ── TAB: Iniciar Batalha ────────────────────────────────────
  renderPlayTab() {
    const cls = window.MedievalSurvivors.classRegistry.getClass(this._menuSelectedClass);
    if (!cls) return;

    const hpPercent = Math.min(100, (cls.stats.maxHp / 160) * 100);
    const armorPercent = Math.min(100, (cls.stats.armor / 6) * 100);
    const speedPercent = Math.min(100, (cls.stats.moveSpeed / 1.6) * 100);
    const dmgPercent = Math.min(100, (cls.stats.damageMultiplier / 1.5) * 100);

    const startingWep = window.MedievalSurvivors.weapons.create(cls.startingWeapon);

    this.menuTabContent.innerHTML = `
      <div class="battle-prep-container">
        <!-- Hero Spotlight Card -->
        <div class="hero-spotlight-card">
          <!-- Top Row: Class Avatar on Pedestal (Left) + Class Title/Identity (Right) filling the empty space -->
          <div class="hero-header-row">
            <div class="pedestal-wrap">
              <div class="pedestal-aura"></div>
              <div class="pedestal-avatar">${cls.icon}</div>
            </div>
            <div class="hero-identity-wrap">
              <div class="hero-role-badge">⚜️ COMBATENTE SELECIONADO</div>
              <h2 class="hero-title">${cls.name}</h2>
              <div class="hero-subtitle">${cls.subtitle}</div>
              <p class="hero-desc">${cls.description}</p>
            </div>
          </div>

          <div class="hero-details-wrap">

            <!-- Stat Meters -->
            <div class="hero-stat-meters">
              <div class="meter-box">
                <div class="meter-label"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.95rem;">${window.MedievalIcons.get('hud_hp')}</span> Vida Máxima</span> <strong>${cls.stats.maxHp} HP</strong></div>
                <div class="meter-track"><div class="meter-fill hp-meter" style="width:${hpPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.95rem;">${window.MedievalIcons.get('passive_armor')}</span> Armadura</span> <strong>${cls.stats.armor} Pontos</strong></div>
                <div class="meter-track"><div class="meter-fill armor-meter" style="width:${armorPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.95rem;">${window.MedievalIcons.get('passive_speed')}</span> Agilidade</span> <strong>${(cls.stats.moveSpeed * 100).toFixed(0)} Vel.</strong></div>
                <div class="meter-track"><div class="meter-fill speed-meter" style="width:${speedPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.95rem;">${window.MedievalIcons.get('weapon_broadsword')}</span> Dano Base</span> <strong>+${((cls.stats.damageMultiplier - 1) * 100).toFixed(0)}%</strong></div>
                <div class="meter-track"><div class="meter-fill dmg-meter" style="width:${dmgPercent}%;"></div></div>
              </div>
            </div>

            <!-- Perk & Starting Weapon -->
            <div class="hero-specials-grid">
              <div class="special-pill">
                <span class="pill-icon">✨</span>
                <div>
                  <div class="pill-title">BÊNÇÃO HEROICA:</div>
                  <div class="pill-desc">${cls.perkDesc}</div>
                </div>
              </div>

              ${startingWep ? `
              <div class="special-pill">
                <span class="pill-icon">${startingWep.icon}</span>
                <div>
                  <div class="pill-title">ARMA INICIAL: ${startingWep.name}</div>
                  <div class="pill-desc">${startingWep.description}</div>
                </div>
              </div>
              ` : ''}
            </div>
            <!-- Seletor de Regime da Expedição (Competitivo vs Livre) -->
            <div class="game-mode-selector-panel">
              <div class="mode-panel-header">
                <div>
                  <span class="mod-icon">🏆</span>
                  <span>REGIME DA EXPEDIÇÃO</span>
                </div>
                <span class="mode-info-tag ${this.game.isRankedMode ? 'ranked-tag' : 'casual-tag'}">
                  ${this.game.isRankedMode ? '👑 RANQUEADO OFICIAL' : '🌱 EXPEDIÇÃO LIVRE'}
                </span>
              </div>
              <div class="mode-cards-row">
                <div class="mode-choice-card ${this.game.isRankedMode ? 'active' : ''}" id="mode-opt-ranked">
                  <div class="mode-choice-radio">
                    <span class="radio-dot"></span>
                  </div>
                  <div class="mode-choice-content">
                    <div class="mode-choice-title">👑 Modo Competitivo (Ranqueado)</div>
                    <div class="mode-choice-desc">Somente partidas neste modo computam e gravam sua pontuação, tempo e abates no Placar Mundial Neon!</div>
                    <span class="mode-status-tag ranked">🏆 Valida Ranking Oficial</span>
                  </div>
                </div>
                <div class="mode-choice-card ${!this.game.isRankedMode ? 'active' : ''}" id="mode-opt-casual">
                  <div class="mode-choice-radio">
                    <span class="radio-dot"></span>
                  </div>
                  <div class="mode-choice-content">
                    <div class="mode-choice-title">🗡️ Expedição Livre (Casual)</div>
                    <div class="mode-choice-desc">Modo descompromissado para testes e diversão. Ouro e Conquistas salvam, mas o Placar Mundial não é computado.</div>
                    <span class="mode-status-tag casual">🌱 Modo Treino & Lazer</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Battle Modifiers Panel (Modo Hiper & Pacto de Maldição) -->
            <div class="modifiers-selection-panel">
              <div class="modifiers-panel-header">
                <span class="mod-icon">📜</span>
                <span>PACTOS DE BATALHA & MODIFICADORES</span>
              </div>

              <div class="modifiers-row">
                <!-- Modo Hiper Toggle -->
                <div class="modifier-box ${this.game.hyperMode ? 'active' : ''}" id="mod-toggle-hyper" title="Alternar Modo Hiper">
                  <div class="mod-top">
                    <span class="mod-tag ${this.game.hyperMode ? 'on' : 'off'}">${this.game.hyperMode ? '⚡ ATIVADO' : 'DESATIVADO'}</span>
                    <span class="mod-title">MODO HIPER</span>
                  </div>
                  <p class="mod-desc">Ritmo acelerado: +25% velocidade do herói, +35% velocidade dos monstros e hordas 50% mais densas.</p>
                  <div class="mod-rewards">
                    <span class="reward-pill gold">💰 +50% Ouro</span>
                    <span class="reward-pill xp">💎 +30% XP</span>
                  </div>
                </div>

                <!-- Pacto de Maldição Stepper -->
                <div class="modifier-box curse-box ${this.game.curseRank > 0 ? 'active' : ''}" id="mod-box-curse">
                  <div class="mod-top">
                    <span class="mod-tag curse-tag ${this.game.curseRank > 0 ? 'on' : 'off'}">${this.game.curseRank === 0 ? 'DESATIVADO' : `💀 GRAU ${this.game.curseRank}`}</span>
                    <span class="mod-title">PACTO DE MALDIÇÃO</span>
                  </div>
                  <p class="mod-desc">${this.getCurseDescription(this.game.curseRank)}</p>
                  <div class="curse-stepper-controls">
                    <button class="btn-stepper" id="btn-curse-dec" ${this.game.curseRank === 0 ? 'disabled' : ''}>◀</button>
                    <span class="curse-stepper-value">${this.game.curseRank === 0 ? 'Sem Maldição' : `Grau ${this.game.curseRank} / 5`}</span>
                    <button class="btn-stepper" id="btn-curse-inc" ${this.game.curseRank >= 5 ? 'disabled' : ''}>▶</button>
                  </div>
                  <div class="mod-rewards">
                    <span class="reward-pill gold">💰 +${this.game.curseRank * 20}% Ouro</span>
                    <span class="reward-pill luck">🍀 +${this.game.curseRank * 5}% Crítico</span>
                  </div>
                </div>
              </div>

              <!-- Modifiers Summary Ribbon -->
              <div class="modifiers-summary-ribbon">
                <span class="sum-label">Bônus da Expedição:</span>
                <span class="sum-item gold">💰 +${(this.game.hyperMode ? 50 : 0) + (this.game.curseRank * 20)}% Ouro</span>
                <span class="sum-item xp">💎 +${this.game.hyperMode ? 30 : 0}% XP</span>
                <span class="sum-item tempo">⚡ Ritmo: ${this.game.hyperMode ? 'Frenético (Hiper)' : 'Padrão'}</span>
              </div>
            </div>

            <!-- Action CTA Buttons -->
            <div class="prep-actions-row">
              <button class="btn-primary btn-epic-start" id="btn-start-battle">
                ⚔️ INICIAR BATALHA REAL
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Mode Selector Handlers
    const optRanked = document.getElementById('mode-opt-ranked');
    const optCasual = document.getElementById('mode-opt-casual');

    if (optRanked) {
      optRanked.addEventListener('click', () => {
        this.game.isRankedMode = true;
        if (this.game.saveManager) {
          this.game.saveManager.data.settings.isRankedMode = true;
          this.game.saveManager.save();
        }
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSanctuaryActive) {
          window.MedievalSurvivors.sound.playSanctuaryActive();
        }
        this.renderPlayTab();
      });
    }

    if (optCasual) {
      optCasual.addEventListener('click', () => {
        this.game.isRankedMode = false;
        if (this.game.saveManager) {
          this.game.saveManager.data.settings.isRankedMode = false;
          this.game.saveManager.save();
        }
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playWoodHit) {
          window.MedievalSurvivors.sound.playWoodHit();
        }
        this.renderPlayTab();
      });
    }

    // Battle Modifiers Event Handlers
    document.getElementById('mod-toggle-hyper').addEventListener('click', () => {
      this.game.hyperMode = !this.game.hyperMode;
      if (this.game.saveManager) {
        this.game.saveManager.data.settings.hyperMode = this.game.hyperMode;
        this.game.saveManager.save();
      }
      if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playSwordSlash) {
        window.MedievalSurvivors.sound.playSwordSlash();
      }
      this.renderPlayTab();
    });

    document.getElementById('btn-curse-dec').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.game.curseRank > 0) {
        this.game.curseRank--;
        if (this.game.saveManager) {
          this.game.saveManager.data.settings.curseRank = this.game.curseRank;
          this.game.saveManager.save();
        }
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playWoodHit) {
          window.MedievalSurvivors.sound.playWoodHit();
        }
        this.renderPlayTab();
      }
    });

    document.getElementById('btn-curse-inc').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.game.curseRank < 5) {
        this.game.curseRank++;
        if (this.game.saveManager) {
          this.game.saveManager.data.settings.curseRank = this.game.curseRank;
          this.game.saveManager.save();
        }
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playBossHorn) {
          window.MedievalSurvivors.sound.playBossHorn();
        }
        this.renderPlayTab();
      }
    });

    document.getElementById('btn-start-battle').addEventListener('click', () => {
      this.game.selectedClassId = this._menuSelectedClass;
      this.hideAllModals();
      this.game.start();
    });


  }

  // ── TAB: Combatentes ────────────────────────────────────────
  renderHeroesTab() {
    const sm = window.MedievalSurvivors.saveManager;
    const classes = window.MedievalSurvivors.classRegistry.getAllClasses();
    if (!classes.some(c => c.id === this._menuSelectedClass)) {
      this._menuSelectedClass = 'knight';
      if (this.game) this.game.selectedClassId = 'knight';
    }

    this.menuTabContent.innerHTML = `
      <div class="heroes-header-banner">
        <h3>🛡️ GUILDA DOS CAMPEÕES DE VALORIA</h3>
        <p>Desbloqueie combatentes lendários através de Conquistas e escolha seu campeão para descer às Catacumbas.</p>
      </div>

      <div class="codex-grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:18px;">
        ${classes.map(c => {
          const isUnlocked = sm ? sm.isClassUnlocked(c.id) : true;
          const isSelected = c.id === this._menuSelectedClass;
          const w = window.MedievalSurvivors.weapons.create(c.startingWeapon);

          let progressHtml = '';
          if (!isUnlocked && c.unlockAchievementId && sm) {
            const achDef = sm.achievementDefinitions.find(a => a.id === c.unlockAchievementId);
            if (achDef && achDef.getProgress) {
              const prog = achDef.getProgress(this.game);
              if (prog && prog.max) {
                const current = Math.min(prog.max, prog.current || 0);
                const barPct = Math.round((current / prog.max) * 100);
                progressHtml = `
                  <div class="achievement-progress-wrap" style="margin-top:6px;">
                    <div class="progress-bar-mini">
                      <div class="progress-fill-mini" style="width: ${barPct}%;"></div>
                    </div>
                    <span class="progress-txt-mini" style="font-size:0.7rem; color:#aaa;">${current} / ${prog.max} (${barPct}%)</span>
                  </div>
                `;
              }
            }
          }

          return `
          <div class="hero-select-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}"
               data-classid="${c.id}" data-unlocked="${isUnlocked}">
            ${isSelected ? `<div class="selected-ribbon">👑 ATIVO</div>` : (!isUnlocked ? `<div class="locked-ribbon">🔒 BLOQUEADO</div>` : '')}
            <div class="hero-card-avatar" style="${!isUnlocked ? 'filter: grayscale(0.6) brightness(0.7);' : ''}">${c.icon}</div>
            <h3 class="hero-card-title">${c.name}</h3>
            <div class="hero-card-sub">${c.subtitle}</div>

            ${!isUnlocked ? `
              <div class="hero-unlock-requirement-box">
                <div class="unlock-box-title">📜 REQUISITO DE CONQUISTA</div>
                <div class="unlock-box-desc">${c.unlockHint}</div>
                ${progressHtml}
              </div>
            ` : `
              <div class="hero-card-stats-box">
                <div class="stat-line"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.9rem;">${window.MedievalIcons.get('hud_hp')}</span> Vida Máxima:</span> <strong>${c.stats.maxHp}</strong></div>
                <div class="stat-line"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.9rem;">${window.MedievalIcons.get('passive_armor')}</span> Armadura:</span> <strong>${c.stats.armor}</strong></div>
                <div class="stat-line"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.9rem;">${window.MedievalIcons.get('passive_speed')}</span> Velocidade:</span> <strong>${(c.stats.moveSpeed * 100).toFixed(0)}</strong></div>
                <div class="stat-line"><span style="display:inline-flex; align-items:center; gap:5px;"><span style="font-size:0.9rem;">${window.MedievalIcons.get('weapon_broadsword')}</span> Dano Base:</span> <strong>+${((c.stats.damageMultiplier - 1) * 100).toFixed(0)}%</strong></div>
              </div>

              <div class="hero-card-perk">
                <strong>Bênção:</strong> ${c.perkDesc}
              </div>
            `}

            ${w ? `
            <div class="hero-card-wep" style="display:flex; align-items:center; gap:6px;">
              <span>Arma:</span> <span style="font-size:1.1rem; display:inline-flex;">${w.icon}</span> <strong>${w.name}</strong>
            </div>
            ` : ''}

            <button class="btn-primary btn-hero-select ${isSelected ? 'active-hero-btn' : (!isUnlocked ? 'btn-hero-locked' : '')}" ${!isUnlocked ? 'disabled' : ''}>
              ${!isUnlocked ? 'Bloqueado por Conquista' : (isSelected ? 'Combatente Selecionado' : 'Escolher Combatente')}
            </button>

            ${c.id === 'knight' ? `
            <a href="knight_showcase.html" target="_blank" class="btn-royal btn-sm"
               style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; text-decoration:none; padding:6px 10px; font-size:0.78rem; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.35); border-radius:4px;"
               onclick="event.stopPropagation();">
              <span>🔍 Ver Modelo 3D 360° ↗</span>
            </a>` : ''}
            ${(c.id === 'archer' || c.id === 'ranger') ? `
            <a href="archer_showcase.html" target="_blank" class="btn-royal btn-sm"
               style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; text-decoration:none; padding:6px 10px; font-size:0.78rem; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.35); border-radius:4px;"
               onclick="event.stopPropagation();">
              <span>🔍 Ver Modelo 3D 360° ↗</span>
            </a>` : ''}
            ${(c.id === 'alchemist' || c.id === 'plague_alchemist') ? `
            <a href="alchemist_showcase.html" target="_blank" class="btn-royal btn-sm"
               style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; text-decoration:none; padding:6px 10px; font-size:0.78rem; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.35); border-radius:4px;"
               onclick="event.stopPropagation();">
              <span>🔍 Ver Modelo 3D 360° ↗</span>
            </a>` : ''}
            ${c.id === 'pyromancer' ? `
            <a href="pyromancer_showcase.html" target="_blank" class="btn-royal btn-sm"
               style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; text-decoration:none; padding:6px 10px; font-size:0.78rem; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.35); border-radius:4px;"
               onclick="event.stopPropagation();">
              <span>🔍 Ver Modelo 3D 360° ↗</span>
            </a>` : ''}
            ${c.id === 'paladin' ? `
            <a href="paladin_showcase.html" target="_blank" class="btn-royal btn-sm"
               style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; text-decoration:none; padding:6px 10px; font-size:0.78rem; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.35); border-radius:4px;"
               onclick="event.stopPropagation();">
              <span>🔍 Ver Modelo 3D 360° ↗</span>
            </a>` : ''}
          </div>
          `;
        }).join('')}
      </div>
    `;

    this.menuTabContent.querySelectorAll('.hero-select-card').forEach(card => {
      const cid = card.getAttribute('data-classid');
      const isUnlocked = card.getAttribute('data-unlocked') === 'true';
      if (isUnlocked) {
        card.addEventListener('click', () => {
          this._menuSelectedClass = cid;
          this.game.selectedClassId = cid;
          window.MedievalSurvivors.sound.playSwordSlash();
          this.renderHeroesTab();
        });
      }
    });
  }

  // ── TAB: Forja ───────────────────────────────────────────────
  renderForgeTab() {
    const sm = this.game.saveManager;
    const upgrades = sm.metaUpgradeDefinitions;
    const totalSpent = sm.getTotalSpentGold();

    this.menuTabContent.innerHTML = `
      <div class="forge-header-banner">
        <h3>🔨 FORJA REAL DOS ANCESTRAIS</h3>
        <p>Invoque as chamas arcanas para fundir seu ouro em bênçãos de combate eternas.</p>
        <div class="forge-top-actions">
          <div class="forge-balance-pill">
            <span>Ouro Disponível:</span>
            <strong>${sm.getGold().toLocaleString()}</strong>
            <span>💰</span>
          </div>
          <button class="btn-refund-gold" id="btn-refund-forge" ${totalSpent <= 0 ? 'disabled' : ''}>
            🔄 Reembolsar Ouro (${totalSpent.toLocaleString()} 💰 gastos)
          </button>
        </div>
      </div>
      <div class="forge-grid" id="forge-grid-inner"></div>
    `;

    const refundBtn = document.getElementById('btn-refund-forge');
    if (refundBtn) {
      refundBtn.addEventListener('click', () => {
        const refunded = sm.refundAllUpgrades();
        if (refunded > 0) {
          if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playGemPickup) {
            window.MedievalSurvivors.sound.playGemPickup();
          }
          this.updateMenuGoldDisplay();
          this.renderForgeTab();
        }
      });
    }

    const grid = document.getElementById('forge-grid-inner');
    if (!grid) return;

    upgrades.forEach(def => {
      const currentLvl = sm.getUpgradeLevel(def.id);
      const cost = sm.getUpgradeCost(def.id);
      const isMaxed = currentLvl >= def.maxLevel;
      const canAfford = !isMaxed && sm.getGold() >= cost;

      // Build visual pips
      let pipsHTML = '<div class="forge-pips">';
      for (let p = 0; p < def.maxLevel; p++) {
        pipsHTML += `<span class="pip ${p < currentLvl ? 'filled' : ''}"></span>`;
      }
      pipsHTML += '</div>';

      const card = document.createElement('div');
      card.className = `forge-card ${isMaxed ? 'maxed' : ''}`;
      card.innerHTML = `
        <div class="forge-card-top">
          <div class="forge-icon-wrap">${def.icon}</div>
          <div class="forge-card-titles">
            <h4 class="forge-card-name">${def.name}</h4>
            <div class="forge-card-tier">Grau ${currentLvl} de ${def.maxLevel}</div>
            ${pipsHTML}
          </div>
        </div>
        <p class="forge-card-desc">${def.description}</p>
        <div class="forge-stat-badge">${def.statPerLevel} por grau</div>

        <button class="btn-primary forge-buy-btn ${isMaxed ? 'btn-maxed' : (canAfford ? 'btn-can-buy' : 'btn-disabled')}" data-id="${def.id}">
          ${isMaxed ? '✅ MÁXIMO FORJADO' : `${cost} 💰`}
        </button>
      `;

      if (!isMaxed) {
        const buyBtn = card.querySelector('.forge-buy-btn');
        buyBtn.addEventListener('click', () => {
          const success = sm.purchaseUpgrade(def.id);
          if (success) {
            window.MedievalSurvivors.sound.playLevelUp();
            this.updateMenuGoldDisplay();
            this.renderForgeTab();
          } else {
            buyBtn.textContent = '❌ Ouro Insuficiente!';
            setTimeout(() => {
              buyBtn.textContent = `${sm.getUpgradeCost(def.id)} 💰`;
            }, 1200);
          }
        });
      }

      grid.appendChild(card);
    });
  }

  // ── TAB: Árvore de Habilidades & Talentos ────────────────
  renderSkillTreeTab() {
    const sm = this.game.saveManager;
    const engine = window.MedievalSurvivors.skillTreeEngine;
    if (!engine) return;

    if (!this._skillTreeActiveClass) {
      this._skillTreeActiveClass = this.game.selectedClassId || 'knight';
    }
    const activeClass = this._skillTreeActiveClass;
    const tree = engine.getClassTree(activeClass);
    const originId = engine.getOriginNodeId(activeClass);

    if (!this._skillTreeSelectedNode || !engine.getNode(this._skillTreeSelectedNode, activeClass)) {
      this._skillTreeSelectedNode = originId;
    }
    if (this._skillTreeZoom === undefined) {
      this._skillTreeZoom = 1.0;
    }
    if (!this._skillTreeCenter) {
      this._skillTreeCenter = { x: 900, y: 900 };
    }

    const classRegistry = window.MedievalSurvivors.classRegistry;
    const allClasses = classRegistry ? classRegistry.getAllClasses() : [
      { id: 'knight', name: 'Cavaleiro Real', icon: '🛡️' }
    ];

    const allocatedArray = sm.getSkillTreeAllocated(activeClass);
    const allocatedSet = new Set(allocatedArray);
    const totalSpent = sm.getSkillTreeSpentGold(activeClass);
    const allNodes = engine.getAllNodes(activeClass);
    const selectedNode = engine.getNode(this._skillTreeSelectedNode, activeClass) || engine.getNode(originId, activeClass);
    const branches = engine.getBranches(activeClass);

    const bonuses = engine.calculateCumulativeBonuses(allocatedArray, activeClass);

    this.menuTabContent.innerHTML = `
      <div class="skill-tree-tab-wrap">
        <div class="skill-tree-header-banner">
          <div class="tree-header-titles">
            <h3>🕸️ ${tree.name.toUpperCase()}</h3>
            <p>${tree.subtitle}</p>
          </div>
          <div class="tree-header-actions">
            <div class="tree-pill-stat">
              <span>Éter Disponível:</span>
              <strong style="color: #c084fc;">${(sm.getEther ? sm.getEther() : 0).toLocaleString()} 🔮</strong>
            </div>
            <div class="tree-pill-stat">
              <span>Talentos de ${tree.name}:</span>
              <strong class="text-emerald">${allocatedArray.length} / ${allNodes.length}</strong>
            </div>
            <div class="tree-pill-stat">
              <span>Éter Investido:</span>
              <strong style="color: #c084fc;">${totalSpent.toLocaleString()} 🔮</strong>
            </div>
            <button class="btn-royal btn-refund-gold" id="btn-refund-tree" ${totalSpent <= 0 ? 'disabled' : ''} style="border-color: #9333ea; color: #e9d5ff;">
              🔄 Reembolsar Classe (${totalSpent.toLocaleString()} 🔮)
            </button>
            <button class="btn-royal btn-tree-summary" id="btn-toggle-tree-summary">
              📜 Bênçãos da Classe
            </button>
          </div>
        </div>

        <!-- Class Selector Ribbon -->
        <div class="skill-tree-class-selector">
          ${allClasses.map(c => {
            const isAct = c.id === activeClass;
            const allocCount = sm.getSkillTreeAllocated(c.id).length;
            const totalCount = engine.getAllNodes(c.id).length;
            return `
              <button class="tree-class-btn ${isAct ? 'active' : ''}" data-class-id="${c.id}" title="${c.subtitle}">
                <span>${c.icon || '⚔️'}</span>
                <span>${c.name}</span>
                <span class="tree-class-badge">${allocCount}/${totalCount}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div class="skill-tree-main-layout">
          <!-- Interactive SVG Viewport -->
          <div class="talent-tree-viewport" id="talent-tree-viewport">
            <!-- Viewport Controls -->
            <div class="talent-tree-controls">
              <button class="tree-ctrl-btn" id="btn-zoom-in" title="Aproximar Zoom">➕</button>
              <button class="tree-ctrl-btn" id="btn-zoom-out" title="Afastar Zoom">➖</button>
              <button class="tree-ctrl-btn" id="btn-zoom-reset" title="Centralizar Origem">🎯</button>
            </div>

            <!-- SVG Constellation Map (1800x1800) -->
            <svg id="talent-tree-svg" class="talent-tree-svg" viewBox="200 200 1400 1400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-node-avail" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <!-- Galaxy/Constellation Background Elements Centered at (900, 900) -->
              <g class="tree-constellation-bg">
                <circle cx="900" cy="900" r="760" fill="none" stroke="rgba(241,196,15,0.06)" stroke-width="2" stroke-dasharray="10 8"/>
                <circle cx="900" cy="900" r="540" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5" stroke-dasharray="6 6"/>
                <circle cx="900" cy="900" r="340" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
                <circle cx="900" cy="900" r="160" fill="none" stroke="rgba(241,196,15,0.08)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <line x1="900" y1="40" x2="900" y2="1760" stroke="rgba(255,255,255,0.03)" stroke-width="1.5"/>
                <line x1="40" y1="900" x2="1760" y2="900" stroke="rgba(255,255,255,0.03)" stroke-width="1.5"/>
                <line x1="280" y1="280" x2="1520" y2="1520" stroke="rgba(255,255,255,0.02)" stroke-width="1" stroke-dasharray="8 8"/>
                <line x1="1520" y1="280" x2="280" y2="1520" stroke="rgba(255,255,255,0.02)" stroke-width="1" stroke-dasharray="8 8"/>
              </g>

              <!-- Constellation Lines (Edges) -->
              <g class="tree-edges-layer" id="tree-edges-group"></g>

              <!-- Constellation Nodes Layer -->
              <g class="tree-nodes-layer" id="tree-nodes-group"></g>
            </svg>
          </div>

          <!-- Talent Inspector Panel (Sidebar Card) -->
          <div class="talent-inspector-panel" id="talent-inspector-card"></div>
        </div>

        <!-- Collapsible Summary Drawer -->
        <div class="tree-summary-drawer" id="tree-summary-drawer" style="display: ${this._skillTreeShowSummary ? 'block' : 'none'};">
          <div class="drawer-header">
            <h4>📜 BÊNÇÃOS ATIVAS: ${tree.name.toUpperCase()}</h4>
            <button class="drawer-close-btn" id="btn-close-summary">✖</button>
          </div>
          <div class="summary-stats-grid">
            <div class="summary-stat-box"><span class="lbl">Vida Máxima:</span><strong class="val text-gold">+${bonuses.maxHp} HP</strong></div>
            <div class="summary-stat-box"><span class="lbl">Armadura:</span><strong class="val text-gold">+${bonuses.armor.toFixed(1)}</strong></div>
            <div class="summary-stat-box"><span class="lbl">Dano Global:</span><strong class="val text-gold">+${(bonuses.damageMult * 100).toFixed(1)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Área de Efeito:</span><strong class="val text-gold">+${(bonuses.areaMult * 100).toFixed(0)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Chance Crítica:</span><strong class="val text-gold">+${(bonuses.critChance * 100).toFixed(1)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Dano Crítico:</span><strong class="val text-gold">+${(bonuses.critDamage * 100).toFixed(0)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Velocidade:</span><strong class="val text-gold">+${(bonuses.speedMult * 100).toFixed(1)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Redução Recarga:</span><strong class="val text-gold">-${(bonuses.cooldownReduc * 100).toFixed(1)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Raio de Ímã:</span><strong class="val text-gold">+${(bonuses.magnetRadius * 100).toFixed(0)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Ouro Pilhado:</span><strong class="val text-gold">+${(bonuses.goldMult * 100).toFixed(0)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Experiência:</span><strong class="val text-gold">+${(bonuses.xpMult * 100).toFixed(0)}%</strong></div>
            <div class="summary-stat-box"><span class="lbl">Regeneração:</span><strong class="val text-gold">+${bonuses.hpRegen.toFixed(1)} HP/s</strong></div>
            <div class="summary-stat-box"><span class="lbl">Projéteis Extras:</span><strong class="val text-gold">+${bonuses.extraProjectiles}</strong></div>
            <div class="summary-stat-box"><span class="lbl">Cargas Reroll:</span><strong class="val text-gold">+${bonuses.extraRerolls}</strong></div>
            ${bonuses.swordBoost ? `<div class="summary-stat-box"><span class="lbl">Dano de Espada:</span><strong class="val text-gold">+${(bonuses.swordBoost * 100).toFixed(0)}%</strong></div>` : ''}
            ${bonuses.bowPierce ? `<div class="summary-stat-box"><span class="lbl">Perfuração Flechas:</span><strong class="val text-gold">+${bonuses.bowPierce}</strong></div>` : ''}
            ${bonuses.fireExplosion ? `<div class="summary-stat-box"><span class="lbl">Explosão Ígnea:</span><strong class="val text-gold">+${(bonuses.fireExplosion * 100).toFixed(0)}%</strong></div>` : ''}
            ${bonuses.holyAuraBonus ? `<div class="summary-stat-box"><span class="lbl">Aura Sagrada:</span><strong class="val text-gold">+${(bonuses.holyAuraBonus * 100).toFixed(0)}%</strong></div>` : ''}
            ${bonuses.plagueAreaBonus ? `<div class="summary-stat-box"><span class="lbl">Área Pútrida:</span><strong class="val text-gold">+${(bonuses.plagueAreaBonus * 100).toFixed(0)}%</strong></div>` : ''}
            ${bonuses.thornsReflection ? `<div class="summary-stat-box"><span class="lbl">Espinhos Refletidos:</span><strong class="val text-gold">+${(bonuses.thornsReflection * 100).toFixed(0)}%</strong></div>` : ''}
            ${bonuses.phoenixRebirth ? `<div class="summary-stat-box"><span class="lbl">Renascer da Fênix:</span><strong class="val text-gold">ATIVO 🔥</strong></div>` : ''}
          </div>
        </div>
      </div>
    `;

    // ── Helper to render the Inspector Card ───────────────────
    const renderInspector = (nodeId) => {
      this._skillTreeSelectedNode = nodeId;
      const node = engine.getNode(nodeId, activeClass) || engine.getNode(originId, activeClass);
      const card = document.getElementById('talent-inspector-card');
      if (!card) return;

      const isAllocated = allocatedSet.has(node.id);
      const canUnlock = engine.canUnlock(node.id, allocatedSet, activeClass);
      const curEther = sm.getEther ? sm.getEther() : 0;
      const canAfford = curEther >= node.cost;
      const branchInfo = branches[node.branch] || { name: 'Núcleo da Classe', color: tree.color || '#f1c40f', icon: 'spark' };

      let tierBadge = '';
      if (node.tier === 'origin') tierBadge = '<span class="badge-origin">CENTRO ANCESTRAL</span>';
      else if (node.tier === 'minor') tierBadge = '<span class="badge-minor">PASSIVA MENOR</span>';
      else if (node.tier === 'notable') tierBadge = '<span class="badge-notable">⭐ TALENTO NOTÁVEL</span>';
      else if (node.tier === 'keystone') tierBadge = '<span class="badge-keystone">👑 PEDRA ANGULAR (KEYSTONE)</span>';

      let reqBranchText = '';
      if (node.reqBranchCount && node.reqBranchCount > 0) {
        const curCount = engine.getBranchAllocatedCount(node.branch, allocatedSet, activeClass);
        const met = curCount >= node.reqBranchCount;
        reqBranchText = `<div class="inspect-req-line ${met ? 'req-met' : 'req-missing'}">
          ${met ? '✅' : '⚠️'} Requer ${node.reqBranchCount} talentos neste ramo (Atual: ${curCount}/${node.reqBranchCount})
        </div>`;
      }

      let btnHTML = '';
      if (node.tier === 'origin' || isAllocated) {
        btnHTML = `<button class="btn-primary btn-talent-action btn-allocated" disabled>✅ TALENTO JÁ ATIVADO</button>`;
      } else if (canUnlock && canAfford) {
        btnHTML = `<button class="btn-primary btn-talent-action btn-can-buy" id="btn-buy-talent" style="background: linear-gradient(135deg, #7c3aed, #9333ea); border-color: #c084fc;">🔮 ATIVAR TALENTO (${node.cost} 🔮 ÉTER)</button>`;
      } else if (canUnlock && !canAfford) {
        btnHTML = `<button class="btn-primary btn-talent-action btn-no-gold" disabled>❌ ÉTER INSUFICIENTE (${node.cost} 🔮)</button>`;
      } else {
        btnHTML = `<button class="btn-primary btn-talent-action btn-locked" disabled>🔒 CAMINHO BLOQUEADO</button>`;
      }

      card.innerHTML = `
        <div class="inspect-header" style="border-left: 4px solid ${branchInfo.color};">
          <div class="inspect-branch-tag" style="color: ${branchInfo.color};">${branchInfo.name}</div>
          ${tierBadge}
          <h4 class="inspect-name"><span class="inspect-title-icon" style="margin-right: 6px; font-size: 1.25rem;">${node.icon || '✦'}</span>${node.name}</h4>
        </div>

        <div class="inspect-stat-highlight">
          <span class="inspect-stat-icon">${node.icon || '✨'}</span>
          <span class="inspect-stat-val">${node.statText}</span>
        </div>

        <p class="inspect-desc">${node.description}</p>

        <div class="inspect-requirements">
          <div class="inspect-req-title">CONDIÇÕES DE DESBLOQUEIO:</div>
          <div class="inspect-req-line ${isAllocated || canUnlock ? 'req-met' : 'req-missing'}">
            ${isAllocated || canUnlock ? '✅' : '❌'} Conectado a um nó já ativo
          </div>
          ${reqBranchText}
          ${node.cost > 0 ? `
          <div class="inspect-cost-pill">
            <span>Custo em Éter Ancestral:</span>
            <strong style="color: #c084fc;">${node.cost} 🔮</strong>
          </div>
          ` : ''}
        </div>

        <div class="inspect-action-wrap">
          ${btnHTML}
        </div>
      `;

      const buyBtn = document.getElementById('btn-buy-talent');
      if (buyBtn) {
        buyBtn.addEventListener('click', () => {
          const success = sm.purchaseSkillTreeNode(node.id, activeClass);
          if (success) {
            if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playLevelUp) {
              window.MedievalSurvivors.sound.playLevelUp();
            }
            this.updateMenuGoldDisplay();
            this.renderSkillTreeTab();
          }
        });
      }

      // Highlight selected node on SVG
      document.querySelectorAll('#tree-nodes-group .tree-node').forEach(el => {
        el.classList.toggle('node-selected', el.getAttribute('data-id') === node.id);
      });
    };

    // ── Build SVG Edges & Nodes ──────────────────────────────
    const edgesGroup = document.getElementById('tree-edges-group');
    const nodesGroup = document.getElementById('tree-nodes-group');
    const drawnEdges = new Set();

    allNodes.forEach(node => {
      (node.connects || []).forEach(targetId => {
        const targetNode = engine.getNode(targetId, activeClass);
        if (!targetNode) return;
        const edgeKey = [node.id, targetId].sort().join('--');
        if (drawnEdges.has(edgeKey)) return;
        drawnEdges.add(edgeKey);

        const nodeAllocated = allocatedSet.has(node.id);
        const targetAllocated = allocatedSet.has(targetId);
        const bothAllocated = nodeAllocated && targetAllocated;
        const isPathAvailable = (nodeAllocated && engine.canUnlock(targetId, allocatedSet, activeClass)) ||
                                (targetAllocated && engine.canUnlock(node.id, allocatedSet, activeClass));

        let edgeClass = 'tree-edge-locked';
        let strokeColor = 'rgba(255, 255, 255, 0.08)';
        let strokeWidth = '2';
        let dashArray = 'none';

        if (bothAllocated) {
          edgeClass = 'tree-edge-allocated';
          strokeColor = tree.color || '#f1c40f';
          strokeWidth = '3.5';
        } else if (isPathAvailable) {
          edgeClass = 'tree-edge-available';
          strokeColor = '#3498db';
          strokeWidth = '2.5';
          dashArray = '6 4';
        }

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', targetNode.x);
        line.setAttribute('y2', targetNode.y);
        line.setAttribute('class', `tree-edge ${edgeClass}`);
        line.setAttribute('stroke', strokeColor);
        line.setAttribute('stroke-width', strokeWidth);
        if (dashArray !== 'none') line.setAttribute('stroke-dasharray', dashArray);
        if (bothAllocated) line.setAttribute('filter', 'url(#glow-gold)');
        edgesGroup.appendChild(line);
      });
    });

    allNodes.forEach(node => {
      const isAllocated = allocatedSet.has(node.id);
      const canUnlock = engine.canUnlock(node.id, allocatedSet, activeClass);
      const isSelected = node.id === this._skillTreeSelectedNode;
      const branchInfo = branches[node.branch] || { color: tree.color || '#f1c40f' };

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      let statusClass = isAllocated ? 'node-allocated' : (canUnlock ? 'node-available' : 'node-locked');
      if (isSelected) statusClass += ' node-selected';
      g.setAttribute('class', `tree-node node-${node.tier} ${statusClass}`);
      g.setAttribute('data-id', node.id);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      const nodeGlyph = node.icon || '✦';

      if (node.tier === 'origin') {
        // Origin Node: Grand Sun with pulsing aura and royal class icon
        g.innerHTML = `
          <circle r="42" fill="rgba(241,196,15,0.18)" class="pulse-aura" />
          <circle r="32" fill="#1b1202" stroke="${tree.color || '#f1c40f'}" stroke-width="3.5" filter="url(#glow-gold)" />
          <circle r="22" fill="${tree.color || '#f39c12'}" opacity="0.3" />
          <text text-anchor="middle" dominant-baseline="central" font-size="20" y="1" pointer-events="none">${nodeGlyph}</text>
        `;
      } else if (node.tier === 'minor') {
        // Minor Node: Glowing Gem Jewel with descriptive symbol
        const fillCol = isAllocated ? (branchInfo.color || '#f1c40f') : (canUnlock ? '#1a2a3a' : '#14121b');
        const strokeCol = isAllocated ? '#ffffff' : (canUnlock ? '#3498db' : '#3d374d');
        g.innerHTML = `
          <circle r="19" fill="${fillCol}" stroke="${strokeCol}" stroke-width="${isAllocated ? '2.5' : '1.5'}" filter="${isAllocated ? 'url(#glow-gold)' : (canUnlock ? 'url(#glow-node-avail)' : 'none')}" class="node-body" />
          <text text-anchor="middle" dominant-baseline="central" font-size="12" y="1" pointer-events="none" opacity="${isAllocated ? '1' : (canUnlock ? '0.9' : '0.45')}">${nodeGlyph}</text>
        `;
      } else if (node.tier === 'notable') {
        // Notable Node: Diamond Medallion with Outer Ring and prominent icon
        const fillCol = isAllocated ? (branchInfo.color || '#f1c40f') : (canUnlock ? '#2a1f10' : '#14121b');
        const strokeCol = isAllocated ? '#ffd700' : (canUnlock ? '#f39c12' : '#4d4233');
        g.innerHTML = `
          <circle r="27" fill="none" stroke="${strokeCol}" stroke-width="1.5" stroke-dasharray="5 3" opacity="${isAllocated ? '0.9' : '0.5'}" />
          <polygon points="0,-21 21,0 0,21 -21,0" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2.5" filter="${isAllocated ? 'url(#glow-gold)' : (canUnlock ? 'url(#glow-cyan)' : 'none')}" class="node-body" />
          <text text-anchor="middle" dominant-baseline="central" font-size="15" y="1" pointer-events="none" opacity="${isAllocated ? '1' : (canUnlock ? '0.95' : '0.5')}">${nodeGlyph}</text>
        `;
      } else if (node.tier === 'keystone') {
        // Keystone: Grand Celestial 8-Pointed Star and large symbol
        const fillCol = isAllocated ? (branchInfo.color || '#e74c3c') : (canUnlock ? '#2c1010' : '#14121b');
        const strokeCol = isAllocated ? '#ffd700' : (canUnlock ? '#e74c3c' : '#4d3333');
        g.innerHTML = `
          <circle r="36" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="6 4" class="keystone-ring" />
          <circle r="28" fill="${fillCol}" stroke="${strokeCol}" stroke-width="3" filter="url(#glow-gold)" class="node-body" />
          <polygon points="0,-24 7,-7 24,0 7,7 0,24 -7,7 -24,0 -7,-7" fill="${fillCol}" stroke="${strokeCol}" stroke-width="1.5" opacity="0.35" />
          <text text-anchor="middle" dominant-baseline="central" font-size="20" y="1" pointer-events="none" opacity="${isAllocated ? '1' : (canUnlock ? '0.95' : '0.5')}">${nodeGlyph}</text>
        `;
      }

      g.addEventListener('click', (e) => {
        e.stopPropagation();
        renderInspector(node.id);
      });

      nodesGroup.appendChild(g);
    });

    // Initial Inspector Card Render
    renderInspector(this._skillTreeSelectedNode);

    // ── Interactive Viewport Pan & Zoom Handling ──────────────
    const svg = document.getElementById('talent-tree-svg');
    const viewport = document.getElementById('talent-tree-viewport');
    let isDragging = false;
    let startX = 0, startY = 0;
    let viewBox = { x: 200, y: 200, w: 1400, h: 1400 };

    const updateViewBox = () => {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    };

    // Mouse wheel zoom
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.88 : 1.14;
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const svgX = viewBox.x + (mouseX / rect.width) * viewBox.w;
      const svgY = viewBox.y + (mouseY / rect.height) * viewBox.h;

      const newW = Math.max(400, Math.min(2400, viewBox.w * zoomFactor));
      const newH = Math.max(400, Math.min(2400, viewBox.h * zoomFactor));

      viewBox.x = svgX - (mouseX / rect.width) * newW;
      viewBox.y = svgY - (mouseY / rect.height) * newH;
      viewBox.w = newW;
      viewBox.h = newH;
      updateViewBox();
    }, { passive: false });

    // Drag to pan
    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.talent-tree-controls')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - startX) * (viewBox.w / viewport.clientWidth);
      const dy = (e.clientY - startY) * (viewBox.h / viewport.clientHeight);
      viewBox.x -= dx;
      viewBox.y -= dy;
      startX = e.clientX;
      startY = e.clientY;
      updateViewBox();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = 'grab';
      }
    });

    // Touch Support for Mobile
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = (e.touches[0].clientX - startX) * (viewBox.w / viewport.clientWidth);
      const dy = (e.touches[0].clientY - startY) * (viewBox.h / viewport.clientHeight);
      viewBox.x -= dx;
      viewBox.y -= dy;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      updateViewBox();
    }, { passive: true });

    viewport.addEventListener('touchend', () => { isDragging = false; });

    // Zoom Buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      const zoomFactor = 0.82;
      const newW = Math.max(400, viewBox.w * zoomFactor);
      const newH = Math.max(400, viewBox.h * zoomFactor);
      viewBox.x += (viewBox.w - newW) / 2;
      viewBox.y += (viewBox.h - newH) / 2;
      viewBox.w = newW;
      viewBox.h = newH;
      updateViewBox();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      const zoomFactor = 1.22;
      const newW = Math.min(2400, viewBox.w * zoomFactor);
      const newH = Math.min(2400, viewBox.h * zoomFactor);
      viewBox.x += (viewBox.w - newW) / 2;
      viewBox.y += (viewBox.h - newH) / 2;
      viewBox.w = newW;
      viewBox.h = newH;
      updateViewBox();
    });

    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
      viewBox = { x: 200, y: 200, w: 1400, h: 1400 };
      updateViewBox();
    });

    // Class selector buttons
    document.querySelectorAll('.tree-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-class-id');
        if (cid && cid !== this._skillTreeActiveClass) {
          this._skillTreeActiveClass = cid;
          this._skillTreeSelectedNode = engine.getOriginNodeId(cid);
          this._skillTreeCenter = { x: 900, y: 900 };
          this.renderSkillTreeTab();
        }
      });
    });

    // ── Refund Action ─────────────────────────────────────────
    const refundBtn = document.getElementById('btn-refund-tree');
    if (refundBtn) {
      refundBtn.addEventListener('click', () => {
        if (confirm(`Deseja reembolsar todos os talentos de ${tree.name} e recuperar ${totalSpent.toLocaleString()} 🔮 de Éter Ancestral?`)) {
          const refunded = sm.refundSkillTree(activeClass);
          if (refunded > 0) {
            if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playGemPickup) {
              window.MedievalSurvivors.sound.playGemPickup();
            }
            this.updateMenuGoldDisplay();
            this.renderSkillTreeTab();
          }
        }
      });
    }

    // ── Summary Drawer Toggle ─────────────────────────────────
    const toggleSummaryBtn = document.getElementById('btn-toggle-tree-summary');
    const closeSummaryBtn = document.getElementById('btn-close-summary');
    const drawer = document.getElementById('tree-summary-drawer');

    if (toggleSummaryBtn && drawer) {
      toggleSummaryBtn.addEventListener('click', () => {
        this._skillTreeShowSummary = !this._skillTreeShowSummary;
        drawer.style.display = this._skillTreeShowSummary ? 'block' : 'none';
      });
    }
    if (closeSummaryBtn && drawer) {
      closeSummaryBtn.addEventListener('click', () => {
        this._skillTreeShowSummary = false;
        drawer.style.display = 'none';
      });
    }
  }


  // ── TAB: Grimório de Sinergias & Alquimia ─────────────────────
  renderSynergiesTab() {
    this.menuTabContent.innerHTML = `
      <div class="synergies-tab-wrap">
        <div class="synergies-header-banner">
          <h3>✨ GRIMÓRIO DE SINERGIAS & ALQUIMIA REAL ✨</h3>
          <p>Descubra combinações lendárias de armas e bênçãos passivas no nível máximo para forjar Armas Supremas!</p>
          <div class="synergies-meta-bar" id="synergies-meta-stats"></div>
        </div>

        <div class="synergy-filter-pills">
          <button class="filter-pill active" data-filter="all">Todas as Sinergias (30)</button>
          <button class="filter-pill" data-filter="fusions">⚔️ Fusões de Armas (10 Supremas)</button>
          <button class="filter-pill" data-filter="ascensions">🔮 Ascensões (20 Arma + Passiva)</button>
        </div>

        <div class="synergies-catalog-grid" id="synergies-catalog-grid"></div>
      </div>
    `;

    const grid = document.getElementById('synergies-catalog-grid');
    const statsBar = document.getElementById('synergies-meta-stats');
    this._currentSynergyFilter = this._currentSynergyFilter || 'all';

    const filterBtns = this.menuTabContent.querySelectorAll('.filter-pill');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === this._currentSynergyFilter);
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._currentSynergyFilter = btn.getAttribute('data-filter');
        this.renderSynergiesGrid(grid, statsBar, this._currentSynergyFilter);
      });
    });

    this.renderSynergiesGrid(grid, statsBar, this._currentSynergyFilter);
  }

  renderSynergiesGrid(container, statsBar, filter = 'all') {
    if (!container || !window.MedievalSurvivors.synergies) return;
    const sm = this.game.saveManager;
    const syn = window.MedievalSurvivors.synergies;
    const fusions = syn.getAllFusions();
    const ascensions = syn.getAllAscensions();

    let items = [];
    if (filter === 'all' || filter === 'fusions') {
      items = items.concat(fusions.map(f => ({ ...f, kind: 'fusion' })));
    }
    if (filter === 'all' || filter === 'ascensions') {
      items = items.concat(ascensions.map(a => ({ ...a, kind: 'ascension' })));
    }

    const totalCount = fusions.length + ascensions.length;
    let discoveredCount = 0;
    fusions.forEach(f => { if (sm.isSynergyDiscovered(f.id)) discoveredCount++; });
    ascensions.forEach(a => { if (sm.isSynergyDiscovered(a.id)) discoveredCount++; });

    if (statsBar) {
      const pct = Math.round((discoveredCount / totalCount) * 100);
      statsBar.innerHTML = `
        <div class="synergy-progress-wrap">
          <div class="synergy-progress-text">
            <span>Sinergias Descobertas: <strong>${discoveredCount} / ${totalCount} (${pct}%)</strong></span>
          </div>
          <div class="synergy-progress-bar"><div class="synergy-progress-fill" style="width:${pct}%;"></div></div>
        </div>
      `;
    }

    container.innerHTML = items.map(item => {
      const isDiscovered = sm.isSynergyDiscovered(item.id);
      if (item.kind === 'fusion') {
        return `
          <div class="synergy-card ${isDiscovered ? 'discovered' : 'locked'}">
            <div class="synergy-card-badge ${isDiscovered ? 'badge-supreme-card' : 'badge-locked-card'}">
              ${isDiscovered ? '👑 FUSÃO SUPREMA' : '🔒 FUSÃO DESCONHECIDA'}
            </div>

            <!-- Fusion Equation Row -->
            <div class="synergy-equation">
              <div class="eq-item">
                <span class="eq-icon">${item.item1.icon}</span>
                <span class="eq-name">${item.item1.name}</span>
                <span class="eq-lvl">Nv. 8</span>
              </div>
              <span class="eq-plus">+</span>
              <div class="eq-item">
                <span class="eq-icon">${item.item2.icon}</span>
                <span class="eq-name">${item.item2.name}</span>
                <span class="eq-lvl">Nv. 8</span>
              </div>
              <span class="eq-arrow">➔</span>
              <div class="eq-result">
                <span class="eq-res-icon">${item.icon}</span>
                <span class="eq-res-name">${item.name}</span>
              </div>
            </div>

            <div class="synergy-card-body">
              <h4 class="synergy-res-title">${item.icon} ${item.name}</h4>
              <p class="synergy-res-desc">${isDiscovered ? item.effect : 'Funda ambos os armamentos no nível 8 durante a batalha para desvendar este poder supremo!'}</p>
              ${isDiscovered ? `<div class="synergy-res-lore">📜 "${item.lore}"</div>` : ''}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="synergy-card ascension-card ${isDiscovered ? 'discovered' : 'locked'}">
            <div class="synergy-card-badge ${isDiscovered ? 'badge-ascension-card' : 'badge-locked-card'}">
              ${isDiscovered ? '✨ ASCENSÃO DIVINA' : '🔒 ASCENSÃO OCULTA'}
            </div>

            <!-- Ascension Equation Row -->
            <div class="synergy-equation">
              <div class="eq-item">
                <span class="eq-icon">${item.weaponIcon}</span>
                <span class="eq-name">${item.weaponName}</span>
                <span class="eq-lvl">Nv. 8</span>
              </div>
              <span class="eq-plus">+</span>
              <div class="eq-item">
                <span class="eq-icon">${item.passiveIcon}</span>
                <span class="eq-name">${item.passiveName}</span>
                <span class="eq-lvl">Passiva</span>
              </div>
              <span class="eq-arrow">➔</span>
              <div class="eq-result">
                <span class="eq-res-icon">✨</span>
                <span class="eq-res-name">${item.name}</span>
              </div>
            </div>

            <div class="synergy-card-body">
              <h4 class="synergy-res-title">${item.name}</h4>
              <p class="synergy-res-desc">${isDiscovered ? item.effect : 'Maximize esta arma enquanto possui a bênção passiva para desbloquear o despertar de sinergia!'}</p>
            </div>
          </div>
        `;
      }
    }).join('');
  }

  openSynergiesModal(filter = 'all') {
    const modal = document.getElementById('synergies-modal');
    if (!modal) return;
    const grid = document.getElementById('synergies-grid-content');
    const badge = document.getElementById('synergy-stats-badge');

    const filterBtns = modal.querySelectorAll('.filter-pill');
    let currentFilter = filter;

    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
      btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        this.renderSynergiesGrid(grid, badge, currentFilter);
      };
    });

    this.renderSynergiesGrid(grid, badge, currentFilter);
    modal.classList.add('active');
  }

  closeSynergiesModal() {
    const modal = document.getElementById('synergies-modal');
    if (modal) modal.classList.remove('active');
  }

  // ── TAB: Códice & Bestiário ──────────────────────────────────
  renderCodexTab() {
    this.menuTabContent.innerHTML = `
      <div style="display:flex; gap:10px; justify-content:center; margin-bottom:18px; flex-wrap:wrap;">
        <button class="tab-btn codex-sub active" data-codex="enemies">👹 Inimigos</button>
        <button class="tab-btn codex-sub" data-codex="weapons">⚔️ Armas</button>
        <button class="tab-btn codex-sub" data-codex="passives">✨ Passivas</button>
        <button class="tab-btn codex-sub" data-codex="classes">🛡️ Classes</button>
      </div>
      <div id="codex-sub-content"></div>
    `;

    this.menuTabContent.querySelectorAll('.codex-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        this.menuTabContent.querySelectorAll('.codex-sub').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._renderCodexSub(btn.getAttribute('data-codex'));
      });
    });

    this._renderCodexSub('enemies');
  }

  _renderCodexSub(subTab) {
    const container = document.getElementById('codex-sub-content');
    if (!container) return;

    switch (subTab) {
      case 'enemies':   container.innerHTML = this._codexEnemiesHTML();   break;
      case 'weapons':   container.innerHTML = this._codexWeaponsHTML();   break;
      case 'passives':  container.innerHTML = this._codexPassivesHTML();  break;
      case 'classes':   container.innerHTML = this._codexClassesHTML();   break;
    }
  }

  _codexEnemiesHTML() {
    const I = window.MedievalIcons || { get: () => '' };
    const enemies = [
      { id: 'rat', icon: I.get('enemy_rat'), name: 'Rato da Peste', type: 'Enxame', hp: '15-30', dmg: '6-9', desc: 'Roedores pestilentos e rápidos. Atacam em enxames contínuos ao anoitecer.' },
      { id: 'skeleton', icon: I.get('enemy_skeleton'), name: 'Esqueleto Renegado', type: 'Horda', hp: '35-55', dmg: '10-14', desc: 'Combatentes mortos-vivos ressuscitados das catacumbas com lâminas antigas.' },
      { id: 'villager', icon: I.get('enemy_villager'), name: 'Aldeão Amaldiçoado', type: 'Corrompido', hp: '45-70', dmg: '12-16', desc: 'Camponeses possuídos por forças das trevas, empunhando forquilhas enferrujadas.' },
      { id: 'dark_knight', icon: I.get('enemy_dark_knight'), name: 'Cavaleiro Negro', type: 'Elite Pesado', hp: '140-220', dmg: '22-30', desc: 'Guerreiro de armadura negra impenetrável. Resiste a repelimento e golpeia com brutalidade.' },
      { id: 'witch', icon: I.get('enemy_witch'), name: 'Bruxa da Peste', type: 'Conjuradora', hp: '70-110', dmg: '16-24', desc: 'Mística nefasta que lança frascos venenosos e maldições à distância.' },
      { id: 'bat', icon: I.get('enemy_bat'), name: 'Morcego das Cavernas', type: 'Aéreo Veloz', hp: '20-35', dmg: '7-10', desc: 'Voa em rasantes erráticos que desafiam a pontaria do herói.' },
      { id: 'guard', icon: I.get('enemy_guard'), name: 'Guarda Corrompido', type: 'Defensivo', hp: '90-130', dmg: '14-20', desc: 'Antigo sentinela real com elmo de grade de ferro e passadas cadenciadas.' },
      { id: 'boss_executioner', icon: I.get('enemy_boss_executioner'), name: 'O Carrasco Carmesim', type: 'Chefe Brutal', hp: '800+', dmg: '35+', desc: 'Lorde com capuz carmesim e cutelo colossal. Derrubá-lo rende baús régios de armas.' },
      { id: 'boss_golem', icon: I.get('enemy_boss_golem'), name: 'Golem das Catacumbas', type: 'Chefe Colosso', hp: '1500+', dmg: '45+', desc: 'Monólito ancestral de rocha maciça e runas luminosas. Imune a atordoamento.' },
      { id: 'boss_death_baron', icon: I.get('enemy_boss_death_baron'), name: 'Barão da Morte Von Kroll', type: 'Lorde Supremo', hp: '2500+', dmg: '60+', desc: 'Suserano das trevas que comanda as hordas fúnebres de Valoria com magia de sangue.' }
    ];

    const hpIcon = I.get('hud_hp');
    const dmgIcon = I.get('weapon_broadsword');

    return `
      <div class="codex-grid">
        ${enemies.map(e => `
          <div class="codex-card" style="text-align:left;">
            <div class="codex-header">
              <span class="codex-avatar">${e.icon}</span>
              <div class="codex-title-wrap">
                <div class="codex-title">${e.name}</div>
                <div class="codex-statline">
                  <span style="color:#00d2d3; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${e.type}</span> &bull; 
                  <span style="display:inline-flex; align-items:center; gap:3px;"><span style="font-size:0.85rem;">${hpIcon}</span> ${e.hp}</span> &bull; 
                  <span style="display:inline-flex; align-items:center; gap:3px;"><span style="font-size:0.85rem;">${dmgIcon}</span> ${e.dmg}</span>
                </div>
              </div>
            </div>
            <p class="codex-desc">${e.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  _codexWeaponsHTML() {
    const sm = window.MedievalSurvivors.saveManager;
    const weaponIds = window.MedievalSurvivors.weapons.getAllWeaponIds();
    const cards = weaponIds.map(wid => {
      const w = window.MedievalSurvivors.weapons.create(wid);
      if (!w) return '';
      const isUnlocked = sm ? sm.isWeaponUnlocked(wid) : true;
      const unlockHint = sm ? sm.getWeaponUnlockHint(wid) : '';

      return `
        <div class="codex-card ${!isUnlocked ? 'locked' : ''}" style="text-align:left;">
          <div class="codex-header">
            <span class="codex-avatar" style="${!isUnlocked ? 'filter:grayscale(0.6);' : ''}">${w.icon}</span>
            <div class="codex-title-wrap">
              <div class="codex-title" style="color:${isUnlocked ? '#f0c05a' : '#ff7675'}; display:flex; align-items:center; gap:6px;">
                <span>${w.name}</span> <span style="font-size:0.9rem; display:inline-flex;">${!isUnlocked ? window.MedievalIcons.get('hud_lock') : window.MedievalIcons.get('hud_check')}</span>
              </div>
              <div class="codex-statline">Dano: ${w.damage} &nbsp;|&nbsp; Máx Nível: ${w.maxLevel}</div>
            </div>
          </div>
          <p class="codex-desc">${w.description}</p>
          ${!isUnlocked ? `
            <div class="codex-lock-tag">
              <span style="font-size:0.9rem; display:inline-flex;">${window.MedievalIcons.get('hud_lock')}</span> Requer Conquista: ${unlockHint}
            </div>
          ` : ''}
        </div>
      `;
    });

    return `<div class="codex-grid">${cards.join('')}</div>`;
  }

  _codexPassivesHTML() {
    const sm = window.MedievalSurvivors.saveManager;
    const passives = window.MedievalSurvivors.passives.getAll();
    return `
      <div class="codex-grid">
        ${passives.map(p => {
          const isUnlocked = sm ? sm.isPassiveUnlocked(p.id) : true;
          const unlockHint = sm ? sm.getPassiveUnlockHint(p.id) : '';

          return `
          <div class="codex-card ${!isUnlocked ? 'locked' : ''}" style="text-align:left;">
            <div class="codex-header">
              <span class="codex-avatar" style="${!isUnlocked ? 'filter:grayscale(0.6);' : ''}">${p.icon}</span>
              <div class="codex-title-wrap">
                <div class="codex-title" style="color:${isUnlocked ? '#f0c05a' : '#ff7675'}; display:flex; align-items:center; gap:6px;">
                  <span>${p.name}</span> <span style="font-size:0.9rem; display:inline-flex;">${!isUnlocked ? window.MedievalIcons.get('hud_lock') : window.MedievalIcons.get('hud_check')}</span>
                </div>
                <div class="codex-statline">Máx Nível: ${p.maxLevel}</div>
              </div>
            </div>
            <p class="codex-desc">${p.description}</p>
            ${!isUnlocked ? `
              <div class="codex-lock-tag">
                <span style="font-size:0.9rem; display:inline-flex;">${window.MedievalIcons.get('hud_lock')}</span> Requer Conquista: ${unlockHint}
              </div>
            ` : ''}
          </div>
          `;
        }).join('')}
      </div>
    `;
  }

  _codexClassesHTML() {
    const sm = window.MedievalSurvivors.saveManager;
    const classes = window.MedievalSurvivors.classRegistry.getAllClasses();
    return `
      <div class="codex-grid">
        ${classes.map(c => {
          const isUnlocked = sm ? sm.isClassUnlocked(c.id) : true;
          return `
          <div class="codex-card ${!isUnlocked ? 'locked' : ''}" style="text-align:left;">
            <div class="codex-header">
              <span class="codex-avatar" style="${!isUnlocked ? 'filter:grayscale(0.6);' : ''}">${c.icon}</span>
              <div class="codex-title-wrap">
                <div class="codex-title" style="color:${isUnlocked ? '#f0c05a' : '#ff7675'}; display:flex; align-items:center; gap:6px;">
                  <span>${c.name}</span> <span style="font-size:0.9rem; display:inline-flex;">${!isUnlocked ? window.MedievalIcons.get('hud_lock') : window.MedievalIcons.get('hud_check')}</span>
                </div>
                <div class="codex-statline">${c.subtitle}</div>
              </div>
            </div>
            <p class="codex-desc" style="margin-bottom:4px;">${c.description}</p>
            ${!isUnlocked ? `
              <div class="codex-lock-tag">
                <span style="font-size:0.9rem; display:inline-flex;">${window.MedievalIcons.get('hud_lock')}</span> Requisito: ${c.unlockHint}
              </div>
            ` : `
              <div class="codex-perk-box">
                <strong style="font-family:'Cinzel', serif; letter-spacing:0.5px; color:#f0c05a;">Perk:</strong> ${c.perkDesc}
              </div>
            `}
            <div class="codex-stats-grid">
              <div><span style="font-size:0.9rem;">${window.MedievalIcons.get('hud_hp')}</span> ${c.stats.maxHp} Max HP</div>
              <div><span style="font-size:0.9rem;">${window.MedievalIcons.get('passive_armor')}</span> ${c.stats.armor} Armadura</div>
              <div><span style="font-size:0.9rem;">${window.MedievalIcons.get('passive_speed')}</span> ${(c.stats.moveSpeed * 100).toFixed(0)} Velocidade</div>
              <div><span style="font-size:0.9rem;">${window.MedievalIcons.get('weapon_broadsword')}</span> +${((c.stats.damageMultiplier - 1) * 100).toFixed(0)}% Dano</div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ── TAB: Histórico ───────────────────────────────────────────
  renderHistoryTab() {
    const sm = this.game.saveManager;
    const history = sm.data.history;
    const total = sm.data.runsAttempted;
    const wins = sm.data.runsCompleted;

    let tableRows = history.length === 0
      ? `<tr><td colspan="8" style="text-align:center; color:#666; padding:20px;">Nenhuma run registrada ainda. Entre em batalha!</td></tr>`
      : history.map(run => `
          <tr>
            <td>${run.date}</td>
            <td>${run.hero}</td>
            <td><span class="badge-${run.outcome === 'VITÓRIA' ? 'victory' : 'defeat'}">${run.outcome}</span></td>
            <td>${run.timeSurvived}</td>
            <td>${run.level}</td>
            <td>${run.kills}</td>
            <td style="color:#ffeaa7;">+${run.goldEarned} 💰</td>
            <td style="color:#e0b0ff;">+${run.etherEarned || 0} 🔮</td>
          </tr>
        `).join('');

    this.menuTabContent.innerHTML = `
      <div style="display:flex; gap:16px; justify-content:center; margin-bottom:20px; flex-wrap:wrap;">
        <div class="stat-box" style="min-width:110px; text-align:center;">
          <span class="title">Runs Totais</span>
          <span class="val">${total}</span>
        </div>
        <div class="stat-box" style="min-width:110px; text-align:center;">
          <span class="title">Vitórias</span>
          <span class="val" style="color:#2ecc71;">${wins}</span>
        </div>
        <div class="stat-box" style="min-width:110px; text-align:center;">
          <span class="title">Taxa de Vitória</span>
          <span class="val">${total > 0 ? ((wins / total) * 100).toFixed(1) : 0}%</span>
        </div>
        <div class="stat-box" style="min-width:110px; text-align:center;">
          <span class="title">Ouro Total</span>
          <span class="val" style="color:#ffeaa7;">${sm.data.totalGoldEarned.toLocaleString()} 💰</span>
        </div>
        <div class="stat-box" style="min-width:110px; text-align:center;">
          <span class="title">Éter Total</span>
          <span class="val" style="color:#e0b0ff;">${(sm.data.totalEtherEarned || 0).toLocaleString()} 🔮</span>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="history-table" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th>Data</th>
              <th>Herói</th>
              <th>Resultado</th>
              <th>Tempo</th>
              <th>Nível</th>
              <th>Abates</th>
              <th>Ouro</th>
              <th>Éter</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // ── TAB: Conquistas ──────────────────────────────────────────
  renderAchievementsTab(filter = 'all') {
    this._achievementsFilter = filter;
    const sm = this.game.saveManager;
    const all = sm.achievementDefinitions || [];
    const unlockedMap = sm.data.unlockedAchievements || {};
    const unlockedCount = Object.keys(unlockedMap).length;
    const totalCount = all.length;
    const pct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    let filtered = all;
    if (filter === 'completed') {
      filtered = all.filter(a => unlockedMap[a.id]);
    } else if (filter === 'locked') {
      filtered = all.filter(a => !unlockedMap[a.id]);
    }

    // Total gold claimed from achievements
    const goldClaimed = all
      .filter(a => unlockedMap[a.id])
      .reduce((sum, a) => sum + ((a.reward && a.reward.gold) || 0), 0);

    this.menuTabContent.innerHTML = `
      <div class="achievements-header-banner">
        <div class="achievements-banner-left">
          <div class="trophy-icon">🏆</div>
          <div>
            <h3>SALÃO DAS CONQUISTAS ANCESTRAIS</h3>
            <p>Supere desafios colossais, expurgue as hordas e reivindique glória e ouro para a Cidadela.</p>
          </div>
        </div>
        <div class="achievements-banner-stats">
          <div class="stat-badge">
            <span class="stat-num">${unlockedCount} / ${totalCount}</span>
            <span class="stat-lbl">Desbloqueadas (${pct}%)</span>
          </div>
          <div class="stat-badge gold-badge">
            <span class="stat-num">+${goldClaimed.toLocaleString()} 💰</span>
            <span class="stat-lbl">Ouro Reivindicado</span>
          </div>
        </div>
      </div>

      <!-- Overall Completion Bar -->
      <div class="achievements-overall-bar">
        <div class="achievements-bar-fill" style="width: ${pct}%;"></div>
      </div>

      <!-- Filter Controls -->
      <div class="achievements-filter-bar">
        <button class="filter-chip ${filter === 'all' ? 'active' : ''}" data-filter="all">
          Todas (${totalCount})
        </button>
        <button class="filter-chip ${filter === 'completed' ? 'active' : ''}" data-filter="completed">
          ✅ Concluídas (${unlockedCount})
        </button>
        <button class="filter-chip ${filter === 'locked' ? 'active' : ''}" data-filter="locked">
          🔒 Bloqueadas (${totalCount - unlockedCount})
        </button>
      </div>

      <!-- Achievements Grid -->
      <div class="achievements-grid">
        ${filtered.map(a => {
          const isUnlocked = Boolean(unlockedMap[a.id]);
          const unlockInfo = unlockedMap[a.id];
          let dateStr = '';
          if (unlockInfo && unlockInfo.unlockedAt) {
            try {
              dateStr = new Date(unlockInfo.unlockedAt).toLocaleDateString('pt-BR');
            } catch (e) {}
          }

          let progressHtml = '';
          if (!isUnlocked && a.getProgress) {
            const prog = a.getProgress(this.game);
            if (prog && prog.max) {
              const current = Math.min(prog.max, prog.current);
              const barPct = Math.round((current / prog.max) * 100);
              progressHtml = `
                <div class="achievement-progress-wrap">
                  <div class="progress-bar-mini">
                    <div class="progress-fill-mini" style="width: ${barPct}%;"></div>
                  </div>
                  <span class="progress-txt-mini">${current} / ${prog.max}</span>
                </div>
              `;
            }
          }

          return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="achievement-card-icon">
                ${isUnlocked ? a.icon : window.MedievalIcons.get('hud_lock')}
              </div>
              <div class="achievement-card-info">
                <div class="achievement-card-header">
                  <h4 class="achievement-card-title">${a.name}</h4>
                  ${a.reward && a.reward.gold ? `
                    <span class="achievement-reward-tag ${isUnlocked ? 'claimed' : 'unclaimed'}" style="display:inline-flex; align-items:center; gap:4px;">
                      +${a.reward.gold} <span style="font-size:0.95rem; display:inline-flex;">${window.MedievalIcons.get('hud_gold')}</span>
                    </span>
                  ` : ''}
                </div>
                <p class="achievement-card-desc">${a.description}</p>
                ${progressHtml}
                <div class="achievement-card-footer">
                  ${isUnlocked
                    ? `<span class="achievement-status-done">⚜️ Concluída ${dateStr ? `em ${dateStr}` : ''}</span>`
                    : `<span class="achievement-status-lock">Desafio Pendente</span>`
                  }
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind filter buttons
    const filterBtns = this.menuTabContent.querySelectorAll('.filter-chip');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const f = e.currentTarget.getAttribute('data-filter');
        this.renderAchievementsTab(f);
      });
    });
  }

  // ── TAB: Placar Global Neon ──────────────────────────────────
  renderLeaderboardTab() {
    this.menuTabContent.innerHTML = `
      <div class="leaderboard-tab-view" style="max-width: 820px; margin: 0 auto; padding: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(241,196,15,0.3); padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-family: Cinzel, Georgia, serif; color: #f1c40f; margin: 0; font-size: 1.3rem;">👑 Salão dos Heróis • Modo Competitivo Oficial</h2>
            <p style="margin: 4px 0 0; color: #a4b0be; font-size: 0.85rem;">Apenas partidas disputadas no <strong>Modo Competitivo</strong> são imortalizadas no Neon Lakebase Postgres</p>
          </div>
          <div id="neon-live-badge" style="background: rgba(46, 213, 115, 0.15); border: 1px solid #2ed573; color: #2ed573; padding: 6px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #2ed573; box-shadow: 0 0 8px #2ed573;"></span>
            Neon Cloud: Conectado
          </div>
        </div>

        <div id="neon-leaderboard-container">
          <div style="text-align: center; padding: 40px; color: #bdc3c7;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">⏳</div>
            Consultando registros no Neon Postgres...
          </div>
        </div>
      </div>
    `;

    fetch('/api/leaderboard?limit=15')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('neon-leaderboard-container');
        if (!container) return;

        if (!data.success || !data.scores || data.scores.length === 0) {
          container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: rgba(0,0,0,0.3); border: 1px dashed rgba(241,196,15,0.4); border-radius: 8px; color: #bdc3c7;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🛡️</div>
              Nenhuma crônica registrada no reino ainda.<br>
              Complete uma batalha para imortalizar seu nome no banco de dados Neon!
            </div>
          `;
          return;
        }

        const rows = data.scores.map((s, idx) => {
          const rankColor = idx === 0 ? '#f1c40f' : (idx === 1 ? '#dfe4ea' : (idx === 2 ? '#e17055' : '#a4b0be'));
          const rankIcon = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
          const mins = Math.floor(s.time_survived_seconds / 60);
          const secs = s.time_survived_seconds % 60;
          const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          const isHyper = s.hyper_mode ? `<span style="background: rgba(231,76,60,0.25); border: 1px solid #e74c3c; color: #ff7675; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; margin-right: 4px;">⚡ Hiper</span>` : '';
          const curseBadge = s.curse_rank > 0 ? `<span style="background: rgba(142,68,173,0.25); border: 1px solid #9b59b6; color: #d980fa; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem;">💀 P${s.curse_rank}</span>` : '';

          const safeName = String(s.player_name).replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeClass = String(s.class_id).toUpperCase();

          return `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
              <td style="padding: 10px 8px; font-weight: bold; color: ${rankColor}; text-align: center; font-size: 1rem;">${rankIcon}</td>
              <td style="padding: 10px 8px; font-weight: bold; color: #ffffff;">${safeName}</td>
              <td style="padding: 10px 8px; color: #ced6e0; font-size: 0.85rem;">${safeClass}</td>
              <td style="padding: 10px 8px; font-weight: bold; color: #2ed573;"><span style="font-size:0.9rem; vertical-align:middle; display:inline-flex;">${window.MedievalIcons.get('hud_timer')}</span> ${timeStr}</td>
              <td style="padding: 10px 8px; color: #eccc68;">Nvl ${s.level}</td>
              <td style="padding: 10px 8px; color: #ff6b81;"><span style="font-size:0.9rem; vertical-align:middle; display:inline-flex;">${window.MedievalIcons.get('hud_skull')}</span> ${s.kills}</td>
              <td style="padding: 10px 8px; color: #ffa502;"><span style="font-size:0.9rem; vertical-align:middle; display:inline-flex;">${window.MedievalIcons.get('hud_gold')}</span> ${s.gold}</td>
              <td style="padding: 10px 8px;">${isHyper} ${curseBadge}</td>
            </tr>
          `;
        }).join('');

        container.innerHTML = `
          <div style="overflow-x: auto; background: rgba(0,0,0,0.35); border: 1px solid rgba(241,196,15,0.25); border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(241,196,15,0.4); color: #f1c40f; font-family: Cinzel, Georgia, serif; font-size: 0.82rem; background: rgba(0,0,0,0.3);">
                  <th style="padding: 10px 8px; text-align: center; width: 50px;">Pos</th>
                  <th style="padding: 10px 8px;">Combatente</th>
                  <th style="padding: 10px 8px;">Classe</th>
                  <th style="padding: 10px 8px;">Tempo</th>
                  <th style="padding: 10px 8px;">Nível</th>
                  <th style="padding: 10px 8px;">Abates</th>
                  <th style="padding: 10px 8px;">Ouro</th>
                  <th style="padding: 10px 8px;">Modificadores</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        `;
      })
      .catch(err => {
        const container = document.getElementById('neon-leaderboard-container');
        const badge = document.getElementById('neon-live-badge');
        if (badge) {
          badge.style.borderColor = '#e74c3c';
          badge.style.color = '#e74c3c';
          badge.style.background = 'rgba(231,76,60,0.15)';
          badge.innerHTML = '⚠️ Neon Cloud: Local/Offline';
        }
        if (container) {
          container.innerHTML = `
            <div style="text-align: center; padding: 30px; background: rgba(231,76,60,0.1); border: 1px dashed rgba(231,76,60,0.4); border-radius: 8px; color: #ff7675;">
              Não foi possível sincronizar o placar online com o Neon neste momento.<br>
              Inicie o servidor local com <code>npm start</code> para sincronização instantânea.
            </div>
          `;
        }
      });
  }

  // ── TAB: Opções ──────────────────────────────────────────────
  renderSettingsTab() {
    const sm = this.game.saveManager;
    const mouseAimActive = sm ? sm.data.settings.mouseAim : true;
    const soundMuted = sm ? sm.data.settings.soundMuted : false;
    const graphicsQuality = sm && sm.data.settings.graphicsQuality ? sm.data.settings.graphicsQuality : 'alta';
    const sound = window.MedievalSurvivors && window.MedievalSurvivors.sound;
    const currentVolume = sound ? Math.round(sound.getMasterVolume() * 100) : (sm && sm.data.settings.soundVolume !== undefined ? sm.data.settings.soundVolume : 80);

    this.menuTabContent.innerHTML = `
      <div style="max-width:540px; margin:0 auto; display:flex; flex-direction:column; gap:18px; padding:10px 0;">

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">🎯 Controle de Mira</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Usar mouse para direcionar ataques do personagem (movimentação não altera o alvo).</div>
          </div>
          <button class="btn-primary" id="settings-mouse-aim-btn" style="min-width:150px;">
            ${mouseAimActive ? '🖱️ Mouse: Ativo' : '⌨️ Teclado: Ativo'}
          </button>
        </div>

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">💰 Auto-Ouro (Arsenal Máximo)</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Coletar ouro automaticamente ao subir de nível quando todas as armas e passivas atingirem nível máximo.</div>
          </div>
          <button class="btn-primary" id="settings-auto-gold-btn" style="min-width:150px;">
            ${(sm && sm.data.settings.autoGoldOnMax) ? '💰 Auto-Ouro: Ativo' : '💰 Auto-Ouro: Inativo'}
          </button>
        </div>

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">⚡ Otimização Gráfica</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Alternar entre Alta Resolução e Desempenho Ultra Fluido (60 FPS).</div>
          </div>
          <button class="btn-primary" id="settings-graphics-btn" style="min-width:150px;">
            ${graphicsQuality === 'alta' ? '💎 Alta Qualidade' : '🚀 60 FPS Rápido'}
          </button>
        </div>

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">🎵 Música do Menu / Lobby</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Silenciar ou reativar a trilha sonora medieval procedural do menu e lobby.</div>
          </div>
          <button class="btn-primary" id="settings-menu-music-btn" style="min-width:150px;">
            ${(window.MedievalSurvivors && window.MedievalSurvivors.sound && (window.MedievalSurvivors.sound.lobbyMuted || window.MedievalSurvivors.sound.muted)) ? '🔇 Música: Deslig.' : '🎵 Música: Ligada'}
          </button>
        </div>

        <div class="forge-card" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; color:#f0c05a;">🎚️ Volume Geral do Som</div>
              <div style="font-size:0.82rem; color:#aaa; margin-top:2px;">Regular a intensidade do volume de efeitos sonoros, magias e música.</div>
            </div>
            <span id="settings-volume-value" style="font-family:'Cinzel', serif; font-size:1.1rem; font-weight:700; color:#ffd700; min-width:52px; text-align:right;">${currentVolume}%</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; width:100%; margin-top:4px;">
            <span style="font-size:1rem; color:#888;">🔈</span>
            <input type="range" id="settings-volume-slider" min="0" max="100" value="${currentVolume}" class="medieval-slider" style="flex:1;" />
            <span style="font-size:1.1rem; color:#f1c40f;">🔊</span>
          </div>
        </div>

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">🔊 Áudio e Efeitos</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Alternar efeitos sonoros medievais e sintetizador de áudio.</div>
          </div>
          <button class="btn-primary" id="settings-sound-btn" style="min-width:150px;">
            ${soundMuted ? '🔇 Som: Deslig.' : '🔊 Som: Ligado'}
          </button>
        </div>

        <div class="forge-card" style="border-color:#8e3030;">
          <div style="font-weight:700; color:#e74c3c; margin-bottom:10px;">⚠️ Zona de Perigo</div>
          <p style="font-size:0.83rem; color:#aaa; margin-bottom:16px;">Apagar todo o progresso, ouro acumulado e melhorias da Forja. Esta ação é irreversível!</p>
          <button class="btn-primary" id="settings-reset-btn" style="background:linear-gradient(180deg,#8e3030,#4a1010); width:100%;">🗑️ Resetar Todo o Progresso</button>
        </div>
      </div>
    `;

    document.getElementById('settings-mouse-aim-btn').addEventListener('click', () => {
      this.game.toggleMouseAim();
      this.updateMouseAimButton();
      this.renderSettingsTab();
    });

    const autoGoldSetBtn = document.getElementById('settings-auto-gold-btn');
    if (autoGoldSetBtn) {
      autoGoldSetBtn.addEventListener('click', () => {
        this.game.toggleAutoGold();
        this.updateAutoGoldButton();
        this.renderSettingsTab();
      });
    }

    document.getElementById('settings-graphics-btn').addEventListener('click', () => {
      const nextQuality = graphicsQuality === 'alta' ? 'desempenho' : 'alta';
      if (sm) {
        sm.data.settings.graphicsQuality = nextQuality;
        sm.save();
      }
      if (this.game.renderer && this.game.renderer.setGraphicsQuality) {
        this.game.renderer.setGraphicsQuality(nextQuality);
      } else if (this.game.renderer && this.game.renderer.renderer) {
        this.game.renderer.renderer.setPixelRatio(nextQuality === 'alta' ? Math.min(window.devicePixelRatio || 1, 1.15) : 1.0);
      }
      this.renderSettingsTab();
    });

    const menuMusicSetBtn = document.getElementById('settings-menu-music-btn');
    if (menuMusicSetBtn) {
      menuMusicSetBtn.addEventListener('click', () => {
        if (window.MedievalSurvivors && window.MedievalSurvivors.sound) {
          window.MedievalSurvivors.sound.toggleLobbyMusic();
          this.updateMenuMusicButton();
          this.renderSettingsTab();
        }
      });
    }

    const volumeSlider = document.getElementById('settings-volume-slider');
    const volumeValue = document.getElementById('settings-volume-value');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (volumeValue) {
          volumeValue.textContent = val === 0 ? '0% (Mudo)' : `${val}%`;
        }
        if (window.MedievalSurvivors && window.MedievalSurvivors.sound) {
          window.MedievalSurvivors.sound.setMasterVolume(val);
        }
        if (sm) {
          sm.data.settings.soundVolume = val;
          sm.save();
        }
      });
    }

    document.getElementById('settings-sound-btn').addEventListener('click', () => {
      const isMuted = window.MedievalSurvivors.sound.toggleMute();
      if (sm) {
        sm.data.settings.soundMuted = isMuted;
        sm.save();
      }
      const hudSoundBtn = document.getElementById('btn-sound-toggle');
      if (hudSoundBtn) hudSoundBtn.innerHTML = isMuted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
      this.updateMenuMusicButton();
      this.renderSettingsTab();
    });

    document.getElementById('settings-reset-btn').addEventListener('click', () => {
      if (confirm('Tem certeza? Todo o ouro, upgrades da Forja e histórico serão perdidos!')) {
        if (sm) {
          sm.data = sm.getDefaultData();
          sm.save();
          this.updateMenuGoldDisplay();
          this.renderSettingsTab();
          alert('Save resetado com sucesso. Que sua nova jornada seja gloriosa!');
        }
      }
    });
  }

  // ── TAB: Atualizações & Crônicas de Versão ───────────────────
  renderUpdatesTab() {
    this._currentUpdatesFilter = this._currentUpdatesFilter || 'all';

    const updatesData = [
      {
        version: 'v2.4.3',
        eraName: 'Labirinto de Valoria: Física e Colisão Sólida de Cenário & Destrutíveis',
        date: '6 de Novembro de 2026',
        isLatest: true,
        summary: 'Elevação tática e mecânica do campo de batalha: estruturas arquitetônicas 3D (pilares, fontes góticas, mausoléus imperiais, árvores secas, arcos memoriais, santuários de beira de estrada e altares) e objetos destrutíveis (barris, caixas e sarcófagos) agora possuem física e corpos de colisão sólidos! O jogador não mais atravessa o mundo como um fantasma, transformando a navegação em uma experiência desafiadora e tensa de sobrevivência onde chokepoints e cantos podem ser fatais.',
        categories: [
          {
            type: 'feature',
            badge: 'FÍSICA DE CENÁRIO',
            title: 'Colisão Sólida e Deslizamento Físico de Obstáculos',
            desc: 'O herói colide de forma tangencial suave contra todos os elementos arquitetônicos e decorativos do mapa 3D gerados proceduralmente (com passagens reais sob arcadas e entre colunas de colunatas). Kiting cego e fugas em linha reta agora exigem atenção máxima ao terreno para não ser encurralado pela horda!'
          },
          {
            type: 'balance',
            badge: 'TÁTICA ROGUELITE',
            title: 'Bloqueio Físico por Barris e Esmagamento de Chefes',
            desc: 'Barris, caixas de munição e sarcófagos impedem a passagem do jogador enquanto intactos, forçando o uso de ataques e projéteis para abrir rotas de fuga. Em contrapartida, Chefes colossais (O Carrasco, O Golem de Ferro e o Barão da Morte) esmagam barris e caixas sob seus passos com estrondo e estilhaços!'
          }
        ]
      },
      {
        version: 'v2.4.2',
        eraName: 'Luz & Chamas: Reworks Visuais 3D da Piromante e do Paladino',
        date: '6 de Novembro de 2026',
        isLatest: false,
        summary: 'Reformulação monumental em alta fidelidade gráfica 3D da Feiticeira das Cinzas (Piromante) e do Paladino da Alvorada: anatomia escultural refinada, novas vestes e armaduras de placas góticas, animações fluidas de conjuração e golpe devocional, novos efeitos de auréola solar, brasas e chamas orbitantes, além dos novos Showcases 3D interativos dedicados!',
        categories: [
          {
            type: 'feature',
            badge: 'REWORK VISUAL 3D',
            title: 'Feiticeira das Cinzas (Piromante) em Alta Fidelidade',
            desc: 'Modelagem 3D completa com corpete em ampulheta de couro e seda escarlate, manto talar com forro âmbar em 8 faces, capuz pontiagudo com bico curvo sombreado, olhos incandescentes de brasa, frascos alquímicos de fogo no cinto, labareda de fogo viva flutuante na palma e o cajado das cinzas em madeira petrificada segurando o coração de magma pulsante.'
          },
          {
            type: 'feature',
            badge: 'REWORK VISUAL 3D',
            title: 'Paladino da Alvorada em Alta Fidelidade',
            desc: 'Armadura monumental de placas de aço polido com orlas de ouro antigo, gorjal canelado, Brasão da Cruz Solar em alto relevo com safira lapidada, elmo cruzado fechado com visor cruciforme brilhante, auréola seráfica solar com raios pontiagudos e motes de luz sagrada orbitantes, escudo torre curvo Aegis of the Dawn com a Grande Cruz e martelo relicário Sunbreaker com núcleo solar pulsante.'
          },
          {
            type: 'feature',
            badge: 'SHOWCASE 3D',
            title: 'Dois Novos Showcases 3D Interativos',
            desc: 'Aplicativos 3D dedicados para inspeção livre dos dois heróis com rotação orbital 360°, controles de câmera com presets de foco, modos de animação exclusivos (Julgamento Divino, Marcha Cruzada, Oração, Incineração, Marcha Mística), áudio sintetizado procedural e iluminação cinematográfica de catedral e forja.'
          }
        ]
      },
      {
        version: 'v2.4.0',
        eraName: 'O Reino Renascido: Grande Rework Visual 3D do Cenário, Ruínas & Biomas',
        date: '6 de Novembro de 2026',
        isLatest: false,
        summary: 'Reformulação monumental do ambiente 3D procedural e arquitetura gótica de Valoria: novo relevo tátil com mapa de Bump procedural em 1024x1024; pavimentação de alta fidelidade com lajotas de pedra desgastadas, micro-fissuras, musgo e roseta central de catedral; distribuição densa de mais de 420 estruturas e escombros pelo mapa em grade de 16 setores geográficos (eliminando toda sensação de vazio); monumentos arquitetônicos imponentes (Arcos Góticos com pontas lavradas e lanternas penduradas, Colunatas em Ruínas com dentilos, Paredes de Nave de Catedral com janelas ogivais de traceria e vitrais radiantes cobalto/rubi, Mausoléus com sarcófago interno e tocheiros, Fontes Antigas com spouts de leão e jatos de água, Forcas com gaiolas de gibbet oscilantes ao vento, Círculos Megalíticos com runas druídicas pulsantes e Santuários de Estrada com velas de cera acesas); Praça Central da Cidadela com plataforma octogonal, estrela dourada de 8 pontas, 4 monumentos guardiões com braseiros cerimoniais e estandartes heráldicos reais com física de vento; além de névoa rasteira volumétrica animada e o novo Showcase 3D Interativo do Mapa!',
        categories: [
          {
            type: 'feature',
            badge: 'CENÁRIO 3D',
            title: 'Monumentos & Arquitetura Gótica Imponente',
            desc: 'Implementação de marcos monumentais proceduralmente esculpidos em Three.js: Arcos Góticos ogivais com lanternas de ferro, Colunatas imperiais sobre estilóbatas com entablamento de dentilos, Paredes de Catedral com vitrais góticos coloridos e arcobotantes, Mausoléus com sarcófagos visíveis e tocheiros, e Fontes octogonais com spouts de leão e cascatas d\'água.'
          },
          {
            type: 'feature',
            badge: 'CINEMÁTICA',
            title: 'Animações Ambientais & Cinemática de Vento',
            desc: 'O mundo agora ganha vida: chamas de tochas e braseiros tremulam organicamente em tempo real, estandartes heráldicos ondulam com física senoidal de vento, a gaiola de gibbet da forca balança na brisa, fontes d\'água ondulam e runas druídicas respiram com pulso etéreo.'
          },
          {
            type: 'feature',
            badge: 'AMBIENTAÇÃO',
            title: 'Praça Central da Cidadela & Santuário',
            desc: 'A área de início agora é uma praça fortificada monumental: tablado octogonal elevado com embutimento de ouro, selo de obsidiana com estrela dourada de 8 pontas, 4 pilares guardiões com braseiros de bronze, bancos de pedra com descansos de braço e estandartes heráldicos esvoaçantes.'
          },
          {
            type: 'improvement',
            badge: 'DENSIDADE',
            title: 'Preenchimento Denso Anti-Vazio & Frustum Culling',
            desc: 'Aumento colossal de ~70 props para mais de 420 elementos distribuídos em 16 setores geográficos (marcos, médios e micro-detalhes como escombros, tambores caídos e memoriais), mantendo 60 FPS cravados via matrizes congeladas e distância de renderização dinâmica de 750 unidades.'
          },
          {
            type: 'feature',
            badge: 'PAVIMENTO',
            title: 'Piso de Catedral em 1024x1024 & Bump Map Tátil',
            desc: 'Nova textura procedural com mapa de relevo Bump Map dedicado: ranhuras profundas de argamassa, chanfros elevados nas lajotas, fraturas naturais e roseta gótica sombreada, complementada por camadas de névoa rasteira com ondulação suave.'
          },
          {
            type: 'feature',
            badge: 'SHOWCASE 3D',
            title: 'Showcase 3D Interativo de Mapas & Biomas',
            desc: 'Visualizador 3D dedicado com câmera orbital 360°, voo livre WASD, alternador ao vivo entre os 4 biomas (Ruínas, Necrópole, Floresta e Fortaleza Carmesim), modos de iluminação e inspetor de landmarks.'
          }
        ]
      },
      {
        version: 'v2.3.0',
        eraName: 'O Boticário da Morte: Rework Visual 3D do Alquimista da Peste',
        date: '3 de Novembro de 2026',
        isLatest: false,
        summary: 'Rework visual completo em Three.js procedural do Alquimista da Peste (Dr. Corvus Maledictus): modelagem PBR de alta fidelidade com sobretudo de médico em couro encerado, bandoleira com frascos de ácido esmeralda, máscara de corvo em marfim antigo com filtros de purificação em latão, óculos herméticos com lentes esmeralda luminescentes, chapéu clássico de abas largas, alambique portátil com caldeira de cobre e tubos de condensação nas costas, incensário pendurado na cintura e o novo Frasco de Vitríolo Pútrido com gaiola protetora e emissão ativa de vapores tóxicos volumétricos.',
        categories: [
          {
            type: 'feature',
            badge: 'VISUAL 3D',
            title: 'Escultura Anatômica de Boticário Sombrio',
            desc: 'Substituição da antiga geometria rudimentar por uma escultura anatômica gótica detalhada com materiais PBR: couro encerado negro, túnica de linho, fivelas de latão envelhecido e luvas cirúrgicas com punhos dobrados.'
          },
          {
            type: 'feature',
            badge: 'EQUIPAMENTO',
            title: 'Alambique Portátil & Máscara de Corvo em Marfim',
            desc: 'Mochila com caldeira de destilação de cobre, aros de aço, manômetro a vapor e chaminé com emissão de vapores. A máscara possui bico anatômico curvo com válvulas de latão e óculos com correias de fixação.'
          },
          {
            type: 'improvement',
            badge: 'CINEMÁTICA',
            title: 'Cinemática de Marcha & Vapores Tóxicos',
            desc: 'Sincronização de braços independentes na marcha, oscilação do casaco fendido e 5 partículas esmeralda de miasma com movimentação senoidal e rotação suave em tempo real.'
          },
          {
            type: 'feature',
            badge: 'SHOWCASE 3D',
            title: 'Showcase 3D Interativo do Alquimista',
            desc: 'Aplicativo WebGL 3D dedicado com câmera orbital 360°, modos de iluminação (Miasma, Laboratório Noturno, Meia-noite Gótica, Caldeirão), presets de câmera e seletores de animação (Idle, Marcha, Arremesso de Vitríolo).'
          }
        ]
      },
      {
        version: 'v2.2.0',
        eraName: 'A Caçadora das Sombras: Rework Visual 3D da Arqueira',
        date: '3 de Novembro de 2026',
        isLatest: false,
        summary: 'Rework visual completo em Three.js procedural da Arqueira (Lady Vespera), elevando a heroína ao padrão de modelagem anatômica de elite do Cavaleiro: silhueta atlética estilizada, capuz com bico de falcão, olhos esmeralda luminescentes, trança prateada, capa esvoaçante com broche de safira/esmeralda, aljava detalhada com 6 flechas tridimensionais e o Valorian Mechanical Repeater — uma balestra de repetição com roldanas de latão, estribo e alavanca articulada. Inclui sincronização cinemática de disparo com a locomoção e o novo Showcase 3D interativo com controles orbitais de 360°!',
        categories: [
          {
            type: 'feature',
            badge: 'VISUAL 3D',
            title: 'Escultura Procedural de Alta Fidelidade',
            desc: 'Modelagem 3D procedural completa com materiais PBR: corpete de couro duplo com costuras em ouro, túnica verde floresta em veludo sombrio, cinto duplo tático com fivela de esmeralda, braçadeiras de tiro e ombreiras sobrepostas.'
          },
          {
            type: 'feature',
            badge: 'BALESTRA 3D',
            title: 'Valorian Mechanical Repeater Arbalest',
            desc: 'Substituição da antiga arma simples por uma balestra mecânica pesada com arco recurvo laminado, sistema de polias de latão polido, trilho de disparo com seta entalhada, estribo de armar e coronha de nogueira negra.'
          },
          {
            type: 'improvement',
            badge: 'CINEMÁTICA',
            title: 'Sincronização de Disparo & Locomoção Independente',
            desc: 'Integração de timer cinemático no motor de armas: animação de visada de precisão, recuo de disparo e rearme sem interromper a passada tática dos membros inferiores.'
          },
          {
            type: 'feature',
            badge: 'SHOWCASE 3D',
            title: 'Showcase 3D Interativo da Arqueira',
            desc: 'Aplicativo WebGL 3D dedicado com câmera orbital 360°, modos de iluminação (Luz do Dia, Meia-noite Gótica, Chama do Caldeirão, Místico Esmeralda), presets de câmera e seletores de animação (Idle, Marcha Tática, Disparo de Precisão).'
          }
        ]
      },
      {
        version: 'v2.1.1',
        eraName: 'Hotfix de Sincronização de Combate & Locomoção',
        date: '2 de Novembro de 2026',
        isLatest: false,
        summary: 'Hotfix cinemático refinando a sincronia entre a animação de ataque com a espada e a locomoção do guerreiro: sistema de combo duplo alternado (corte diagonal e talho transversal), postura de guarda firme com o escudo e torção anatômica do tronco em marcha.',
        categories: [
          {
            type: 'improvement',
            badge: 'CINEMÁTICA',
            title: 'Sincronização de Ataque com a Espada',
            desc: 'Integração direta entre o timer dos arcos de corte (Espada Longa Real e Montante das Trevas) e o modelo 3D do herói com windup, impacto frontal devastador e recuperação suave, operando com independência das pernas durante a corrida.'
          },
          {
            type: 'improvement',
            badge: 'LOCOMOÇÃO',
            title: 'Postura de Guarda & Torção Anatômica',
            desc: 'O escudo passa a ser empunhado em guarda tática firme amortecendo os passos da marcha, a espada oscila com a inércia do movimento e o peitoral/bacia realizam torção de passada eliminando a rigidez anterior.'
          }
        ]
      },
      {
        version: 'v2.1.0',
        eraName: 'A Alvorada dos Heróis: Rework Visual 3D do Cavaleiro',
        date: '2 de Novembro de 2026',
        isLatest: false,
        summary: 'Grande marco de reformulação visual do reino: rework completo da geometria, anatomia e heráldica do Cavaleiro Real, arsenal com espada de aço valiriano e escudo reforçado com umbo, suporte para iluminação facetada e pavimentação da transição para GLB e Shaders GLSL.',
        categories: [
          {
            type: 'feature',
            badge: 'VISUAL 3D',
            title: 'Rework Completo do Cavaleiro de Valoria',
            desc: 'Substituição da antiga geometria simples por escultura anatômica em V, elmo Armet facetado com visor de 4 fendas de ventilação, crista com pluma de guerra escarlate articulada, ombreiras triplas sobrepostas, gorjal e escarpes reforçados.'
          },
          {
            type: 'feature',
            badge: 'ARSENAL HEROICO',
            title: 'Espada de Aço Valiriano & Kite Shield Nobre',
            desc: 'Nova espada longa com sulco central (fuller), guarda em asas de águia e pomo cravado com rubi lapidado; Escudo naval azul-cobalto chanfrado com relevo da Cruz de Valoria e umbo central cônico.'
          },
          {
            type: 'improvement',
            badge: 'SHOWCASE & ROADMAP',
            title: 'Showcase 3D Interativo & Arquitetura Gráfica',
            desc: 'Lançamento do visualizador 3D dedicado de modelos com rotação 360°, animações de guarda, marcha e golpe valiriano, câmeras de foco e modos de iluminação (Sol, Tocha e Luar).'
          }
        ]
      },
      {
        version: 'v1.7.2',
        eraName: 'Hotfix de Neutralização de Menu Contextual',
        date: '2 de Novembro de 2026',
        isLatest: false,
        summary: 'Hotfix de correção de usabilidade bloqueando a abertura acidental do menu de contexto nativo do navegador ao clicar com o botão direito durante a partida.',
        categories: [
          {
            type: 'improvement',
            badge: 'USABILIDADE',
            title: 'Bloqueio do Menu de Contexto do Navegador',
            desc: 'Desativação completa do evento contextmenu nativo no canvas e no contêiner do jogo durante o combate, impedindo o surgimento involuntário de opções como definir papel de parede, salvar imagem ou inspecionar elemento ao clicar com o botão direito.'
          }
        ]
      },
      {
        version: 'v1.7.1',
        eraName: 'Hotfix de Otimização & Harmonia de Área',
        date: '2 de Novembro de 2026',
        isLatest: false,
        summary: 'Hotfix emergencial com otimizações profundas de renderização e CPU contra lag de hordas, rebalanceamento e redução no scaling de efeito em área de todas as armas, ajuste no Montante das Trevas, controle deslizante de volume master e refinamento no Auto-Ouro.',
        categories: [
          {
            type: 'improvement',
            badge: 'PERFORMANCE',
            title: 'Otimização Anti-Lag & Instanciação Preguiçosa 3D',
            desc: 'Malhas de monstros e gemas agora só são instanciadas no Three.js quando entram no campo de visão real, e ricochetes de Glaives usam SpatialGrid O(1). O agrupamento de gemas e os textos flutuantes agora operam com batching sem travamentos de Garbage Collector.'
          },
          {
            type: 'balance',
            badge: 'EQUILÍBRIO',
            title: 'Rebalanceamento Geral de Efeito em Área (AoE)',
            desc: 'Redução do scaling de área da Aura Sagrada (raio base 38 com teto protetor), Frascos de Fogo/Peste, Vórtices e Martelos. A passiva Estandarte de Alcance foi ajustada para +8%/lvl e a Forja para +5%/lvl para evitar poluição visual de tela.'
          },
          {
            type: 'balance',
            badge: 'EQUILÍBRIO',
            title: 'Ajuste Visual & Alcance do Montante das Trevas',
            desc: 'Redução de 35% no alcance base do corte e atenuação no raio das Fendas Abissais e do corte de 360° da evolução Devoradora de Reis, garantindo proporções justas e visibilidade tática no combate corporal.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Barra Deslizante de Volume Master nas Opções',
            desc: 'Slider medieval contínuo de 0 a 100% adicionado na aba de Opções com barramento master de áudio Web Audio API e persistência no SaveManager.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Integração de HUD do Botão Auto-Ouro',
            desc: 'Atalho no HUD e sincronização na aba Opções para conversão automática de gemas em moedas ao maximizar todas as armas e passivas.'
          },
          {
            type: 'balance',
            badge: 'EQUILÍBRIO',
            title: 'Taxa Reduzida de Campeões de Elite',
            desc: 'Probabilidade de spawn de monstros com aura dourada ajustada para 1.2%, com teto rígido de até 2 campeões ativos na arena.'
          }
        ]
      },
      {
        version: 'v1.7.0',
        eraName: 'Sinfonia de Valoria & Vitória das Catacumbas',
        date: '1 de Novembro de 2026',
        isLatest: false,
        summary: 'Trilha sonora medieval procedural para o lobby com controle de áudio, baús de campeões de elite com upgrade de arma/passiva, vitória aos 10 minutos, persistência de éter e otimização total de memória.',
        categories: [
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Música Procedural do Lobby & Botão de Silenciar',
            desc: 'Composição de taverna medieval (Balada de Valoria) gerada proceduralmente via Web Audio API, com controle de áudio persistente no cabeçalho e na aba Opções.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Baús de Campeões de Elite (Aura Dourada)',
            desc: 'Inimigos com aura dourada (isChampion) agora derrubam com 100% de chance um baú concedendo 1 upgrade aleatório exclusivamente para armas ou passivas que o herói já possui.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Encerramento & Vitória aos 10 Minutos (600s)',
            desc: 'A partida agora encerra oficialmente aos 10:00 com tela de Vitória Gloriosa, bônus de ouro real e confronto supremo com o Barão da Morte Von Kroll aos 8 minutos.'
          },
          {
            type: 'improvement',
            badge: 'MELHORIA',
            title: 'Persistência & Contabilização de Éter Ancestral',
            desc: 'Implementação de addEther e getEther no SaveManager, corrigindo o acúmulo de Éter pós-run e sincronizando em tempo real com o cabeçalho e a Árvore de Talentos.'
          },
          {
            type: 'improvement',
            badge: 'MELHORIA',
            title: 'Otimização Extrema de Memória & Limpeza Pós-Run',
            desc: 'Descarte imediato de malhas 3D de monstros eliminados, pooling de grid espacial para evitar alocações de GC, perseguição homing direta e purge total de memória ao voltar ao menu.'
          },
          {
            type: 'visual',
            badge: 'VISUAL',
            title: 'Interface Compacta em Tela Única & Códice Polido',
            desc: 'Telas de Fim de Jogo e Vitória ajustadas para caber em telas menores sem rolagem, além da padronização tipográfica e visual do Códice de Inimigos, Armas, Passivas e Classes.'
          }
        ]
      },
      {
        version: 'v1.6.0',
        eraName: 'Era da Constelação Talentos',
        date: '31 de Outubro de 2026',
        isLatest: false,
        summary: 'Chegada da grande Árvore de Talentos interativa estilo Path of Exile 2, sistema de constelação ancestral com 4 ramos e bênçãos supremas (Keystones).',
        categories: [
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Árvore de Habilidades & Talentos',
            desc: 'Mais de 40 nós interativos divididos em 4 ramos cardinais (Fortaleza, Carnificina, Agilidade e Arcano). Cada nó custa Ouro e concede aprimoramentos passivos incrementais permanentes (+1% Velocidade, +2 HP, +1.5% Dano, etc.).'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Pedras Angulares (Keystones Supremos)',
            desc: '4 grandes habilidades de topo de ramo: <strong>Colosso Indomável</strong> (converte 50% da armadura em regeneração contínua de vida), <strong>Avatar da Ruína</strong> (golpes críticos detonam ondas de choque sísmicas em 360°), <strong>Chuva de Estilhaços</strong> (+1 projétil/golpe em todas as armas) e <strong>Singularidade Cósmica</strong> (gemas de XP geram centelhas cósmicas com dano e bônus de ouro).'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Nódulos Notáveis com Pré-requisitos',
            desc: 'Talentos intermediários que exigem nós alocados no ramo correspondente (ex: Baluarte Inabalável, Carniceiro de Valoria, Vento das Sombras e Alquimia dos Sábios).'
          },
          {
            type: 'improvement',
            badge: 'MELHORIA',
            title: 'Reembolso Total Livre (Respec 100%)',
            desc: 'Troque e experimente especializações quando desejar com o botão de reembolso total gratuito, recuperando 100% de todo o ouro investido na árvore.'
          },
          {
            type: 'visual',
            badge: 'VISUAL',
            title: 'Mapa Vetorial Tátil & Painel Inspetor',
            desc: 'Navegação com Arrastar/Pan e Zoom no mapa celeste, conexões brilhantes e gaveta lateral de inspeção detalhada com som ambiente.'
          }
        ]
      },
      {
        version: 'v1.5.0',
        eraName: 'Ritos Carmesins & Noite das Catacumbas',
        date: 'Outubro de 2026',
        isLatest: false,
        summary: 'Pactos nos Altares de Sangue, Desafio Diário mutável e atmosfera visual dinâmica com ciclo de luz e sombra.',
        categories: [
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Altares de Sangue (Pactos Carmesins)',
            desc: 'Altares misteriosos despontam nas profundezas aos 2:45, 5:45 e 8:30. Sacrifique 35% de sua vida atual em troca de Forja Instantânea, Cataclisma Sanguíneo ou Poder Ofensivo Permanente.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Desafio Diário & Sementes Rotativas',
            desc: 'Expedição especial com modificadores mutáveis a cada 24 horas e bonificação expressiva de +500 Ouro para os combatentes que triunfarem.'
          },
          {
            type: 'visual',
            badge: 'VISUAL',
            title: 'Ciclo Dinâmico de Luz e Sombra',
            desc: 'A catacumba escurece progressivamente ao longo dos 10 minutos de sobrevivência, a tocha do herói ganha tremulação de calor vivo e vinhetas dramáticas.'
          }
        ]
      },
      {
        version: 'v1.4.0',
        eraName: 'Heráldica Vetorial & Otimizações Extremas',
        date: 'Outubro de 2026',
        isLatest: false,
        summary: 'Remoção de emojis e introdução de mais de 80 símbolos vetoriais SVG góticos exclusivos, com otimização massiva de áudio e física.',
        categories: [
          {
            type: 'visual',
            badge: 'VISUAL',
            title: 'Motor de Ícones Vetoriais SVG Únicos',
            desc: 'Substituição completa de todos os emojis genéricos de sistema por ícones vetoriais artesanais desenhados especificamente para as 20 armas, 9 classes, 9 passivas e 12 inimigos.'
          },
          {
            type: 'performance',
            badge: 'PERFORMANCE',
            title: 'Pente Fino no WebAudio & Colisão',
            desc: 'Throttling inteligente de golpes para evitar estalos sonoros em multidões e agrupamento dinâmico de gemas de alma distantes mantendo 60 FPS estáveis.'
          }
        ]
      },
      {
        version: 'v1.3.0',
        eraName: 'Forja Mítica & Sinergias Supremas',
        date: 'Outubro de 2026',
        isLatest: false,
        summary: 'Grimório com 30 combinações de armas e passivas máximas, além da Forja Ancestral clássica.',
        categories: [
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Grimório de Sinergias (30 Evoluções)',
            desc: '10 Fusões Supremas de Armas no Nível 8 e 20 Ascensões Divinas de Arma + Passiva correspondente.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Forja Ancestral dos Campeões',
            desc: 'Upgrades clássicos com ouro para Vitalidade, Armadura, Dano, Área, Sorte, Velocidade, Projéteis e Rerolls.'
          }
        ]
      },
      {
        version: 'v1.2.0',
        eraName: 'Portões de Valoria & Nuvem Neon Lakebase',
        date: 'Outubro de 2026',
        isLatest: false,
        summary: 'Integração completa com banco de dados Neon Postgres na nuvem, autenticação segura e ranking global.',
        categories: [
          {
            type: 'online',
            badge: 'ONLINE',
            title: 'Autenticação & Saves em Nuvem Neon',
            desc: 'Criação de contas seguras com criptografia scrypt e sincronização contínua de progresso com Lakebase Postgres.'
          },
          {
            type: 'online',
            badge: 'ONLINE',
            title: 'Placar de Líderes Global',
            desc: 'Ranking em tempo real com abates, sobrevivência, modo hiper e pontuação ranqueada.'
          },
          {
            type: 'improvement',
            badge: 'MELHORIA',
            title: 'Modo Visitante 100% Offline',
            desc: 'Tolerância total a falhas de rede — o jogo pode ser desfrutado integralmente offline com save no localStorage.'
          }
        ]
      },
      {
        version: 'v1.1.0',
        eraName: 'Regime Ranqueado Oficial & Modo Hiper',
        date: 'Outubro de 2026',
        isLatest: false,
        summary: 'Regime de expedições ranqueadas, contratos de maldição e Modo Hiper acelerado.',
        categories: [
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Regime Ranqueado Oficial vs Livre',
            desc: 'Modo competitivo com validação estrita de pontuação no Placar de Líderes ou modo casual de exploração.'
          },
          {
            type: 'feature',
            badge: 'NOVO',
            title: 'Contratos de Maldição (Graus 1 a 5) & Modo Hiper',
            desc: 'Multiplicadores hardcore de velocidade e perigo com bonificações exponenciais de ouro e renome.'
          }
        ]
      }
    ];

    const currentFilter = this._currentUpdatesFilter;

    this.menuTabContent.innerHTML = `
      <div class="updates-tab-wrap">
        <div class="updates-header-banner">
          <div class="updates-header-titles">
            <div class="updates-title-badge">📜 DECRETOS REAIS & HISTÓRICO DE VALORIA</div>
            <h3>CRÔNICAS DE ATUALIZAÇÕES & EXPANSÕES</h3>
            <p>Acompanhe a evolução de Valoria — novas mecânicas, balanceamentos, classes e melhorias contínuas forjadas no reino.</p>
            <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:8px;">
              <a href="paladin_showcase.html" target="_blank" class="btn-royal" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:6px 12px; font-size:0.80rem; background:rgba(250,204,21,0.18); border:1px solid rgba(250,204,21,0.5); border-radius:5px;">
                <span>✨ 3D Showcase: Paladino da Alvorada ↗</span>
              </a>
              <a href="pyromancer_showcase.html" target="_blank" class="btn-royal" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:6px 12px; font-size:0.80rem; background:rgba(249,115,22,0.18); border:1px solid rgba(249,115,22,0.5); border-radius:5px;">
                <span>🔥 3D Showcase: Feiticeira das Cinzas ↗</span>
              </a>
              <a href="map_showcase.html" target="_blank" class="btn-royal" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; padding:6px 12px; font-size:0.80rem; background:rgba(212,175,55,0.18); border:1px solid rgba(212,175,55,0.5); border-radius:5px;">
                <span>🏛️ 3D Showcase: Cenário & Monumentos ↗</span>
              </a>
            </div>
          </div>
          <div class="updates-meta-pills">
            <div class="update-meta-pill">
              <span>Versão Atual:</span>
              <strong class="text-gold">v2.4.3 (Labirinto de Valoria: Física e Colisão Sólida de Cenário)</strong>
            </div>
            <div class="update-meta-pill">
              <span>Serviços:</span>
              <strong class="text-emerald">Neon Lakebase 🟢</strong>
            </div>
            <div class="update-meta-pill">
              <span>Publicações:</span>
              <strong>${updatesData.length} Versões</strong>
            </div>
          </div>
        </div>

        <div class="updates-filter-pills">
          <button class="filter-pill ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">📜 Todas as Atualizações (${updatesData.length})</button>
          <button class="filter-pill ${currentFilter === 'feature' ? 'active' : ''}" data-filter="feature">✨ Novas Mecânicas</button>
          <button class="filter-pill ${currentFilter === 'improvement' ? 'active' : ''}" data-filter="improvement">⚡ Melhorias & Balanceamento</button>
        </div>

        <div class="updates-timeline" id="updates-timeline-cards"></div>

        <!-- Roadmap & Next Horizons Box -->
        <div class="update-roadmap-box">
          <div class="roadmap-header">
            <span class="roadmap-icon">🔮</span>
            <div>
              <h4 class="roadmap-title">HORIZONTES FUTUROS DE VALORIA</h4>
              <p class="roadmap-sub">Prévia dos próximos decretos e expansões em desenvolvimento pelos mestres forjadores:</p>
            </div>
          </div>
          <div class="roadmap-grid">
            <div class="roadmap-item">
              <span class="rm-tag">EM BREVE</span>
              <strong>Árvore de Especializações de Classes</strong>
              <p>Habilidades ativas exclusivas e talentos específicos para Cavaleiro, Necromante, Maga e demais combatentes.</p>
            </div>
            <div class="roadmap-item">
              <span class="rm-tag">EM BREVE</span>
              <strong>Novos Chefes das Profundezas</strong>
              <p>Senhores das Catacumbas com padrões de ataque multifásicos e ataques de área devastadores.</p>
            </div>
            <div class="roadmap-item">
              <span class="rm-tag">EM DESENVOLVIMENTO</span>
              <strong>Modo Abissal Sem Fim</strong>
              <p>Sobrevivência infinita com escalonamento de hordas e espólios de ouro colossais.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Filter Buttons logic
    const filterBtns = this.menuTabContent.querySelectorAll('.updates-filter-pills .filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this._currentUpdatesFilter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.MedievalSurvivors.sound && window.MedievalSurvivors.sound.playWoodHit) {
          window.MedievalSurvivors.sound.playWoodHit();
        }
        renderTimeline();
      });
    });

    // Render Timeline cards based on filter
    const container = document.getElementById('updates-timeline-cards');
    const renderTimeline = () => {
      container.innerHTML = '';
      const filter = this._currentUpdatesFilter;

      updatesData.forEach(release => {
        let filteredCats = release.categories;
        if (filter === 'feature') {
          filteredCats = release.categories.filter(c => c.type === 'feature');
        } else if (filter === 'improvement') {
          filteredCats = release.categories.filter(c => c.type === 'improvement' || c.type === 'performance' || c.type === 'visual');
        }

        if (filteredCats.length === 0) return;

        const card = document.createElement('div');
        card.className = `update-release-card ${release.isLatest ? 'latest-release-card' : ''}`;

        let itemsHtml = filteredCats.map(item => {
          let badgeClass = 'badge-update-novo';
          if (item.type === 'improvement') badgeClass = 'badge-update-melhoria';
          else if (item.type === 'visual') badgeClass = 'badge-update-visual';
          else if (item.type === 'performance') badgeClass = 'badge-update-perf';
          else if (item.type === 'online') badgeClass = 'badge-update-online';

          return `
            <div class="update-item-row">
              <div class="update-item-badge-wrap">
                <span class="update-tag ${badgeClass}">${item.badge}</span>
              </div>
              <div class="update-item-text">
                <h5 class="update-item-title">${item.title}</h5>
                <p class="update-item-desc">${item.desc}</p>
              </div>
            </div>
          `;
        }).join('');

        card.innerHTML = `
          <div class="update-release-header">
            <div class="release-tag-group">
              <span class="version-badge ${release.isLatest ? 'badge-gold' : ''}">${release.version}</span>
              <h4 class="release-era-title">${release.eraName}</h4>
              ${release.isLatest ? '<span class="status-pill-latest">✨ VERSÃO ATUAL</span>' : ''}
            </div>
            <div class="release-date-pill">📅 ${release.date}</div>
          </div>
          <p class="release-summary">${release.summary}</p>
          <div class="update-items-list">
            ${itemsHtml}
          </div>
        `;

        container.appendChild(card);
      });
    };

    renderTimeline();
  }


  // ──────────────────────────────────────────────────────────────
  //  HIDE ALL MODALS
  // ──────────────────────────────────────────────────────────────
  hideAllModals() {
    [
      this.levelUpModal,
      this.chestModal,
      this.gameOverModal,
      this.pauseModal,
      this.victoryModal,
      this.mainMenuModal,
      this.authModal
    ].forEach(m => {
      if (m) {
        m.classList.remove('active');
        m.style.display = '';
      }
    });
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.UIController = UIController;

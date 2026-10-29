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
    this.mainMenuModal = document.getElementById('main-menu-modal');
    this.menuTabContent = document.getElementById('menu-tab-content');

    // Track selected class in menu
    this._menuSelectedClass = game.selectedClassId || 'knight';

    this.bindEvents();
  }

  bindEvents() {
    // Sound toggle button
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = window.MedievalSurvivors.sound.toggleMute();
        soundBtn.innerHTML = isMuted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
      });
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

    // Game Over → Forge button
    const gameoverForgeBtn = document.getElementById('btn-gameover-forge');
    if (gameoverForgeBtn) {
      gameoverForgeBtn.addEventListener('click', () => {
        this.gameOverModal.classList.remove('active');
        this.openMainMenu('forge');
      });
    }

    // Victory → Forge button
    const victoryForgeBtn = document.getElementById('btn-victory-forge');
    if (victoryForgeBtn) {
      victoryForgeBtn.addEventListener('click', () => {
        this.victoryModal.classList.remove('active');
        this.openMainMenu('forge');
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

  // ──────────────────────────────────────────────────────────────
  //  HUD UPDATES
  // ──────────────────────────────────────────────────────────────
  updateHUD(player, gameTime) {
    if (!player) return;

    // XP Bar
    const xpPercent = Math.min(100, Math.floor((player.xp / player.xpToNextLevel) * 100));
    this.xpFill.style.width = `${xpPercent}%`;
    this.xpText.textContent = `${player.xp} / ${player.xpToNextLevel} XP`;
    this.levelBadge.textContent = `NÍVEL ${player.level}`;

    // HP Bar
    const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    this.hpFill.style.width = `${hpPercent}%`;
    this.hpText.textContent = `${Math.ceil(player.hp)} / ${player.maxHp} HP`;

    // Timer → "MM:SS / 15:00"
    const elapsed = Math.min(gameTime, 900);
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    this.timerText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} / 15:00`;

    // Kills
    this.killsText.textContent = player.killCount;

    // Gold
    if (this.goldText) {
      this.goldText.textContent = player.gold;
    }

    // Equipment Slots
    this.updateEquipmentSlots(player);
  }

  updateEquipmentSlots(player) {
    // Weapons slots (up to 6)
    this.weaponSlotsContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'item-slot';
      if (player.weapons[i]) {
        slot.classList.add('active');
        slot.innerHTML = `
          <span class="slot-icon">${player.weapons[i].icon}</span>
          <span class="slot-lvl">${player.weapons[i].level >= player.weapons[i].maxLevel ? 'MAX' : 'Nv.' + player.weapons[i].level}</span>
        `;
        slot.title = `${player.weapons[i].name} (Nv. ${player.weapons[i].level})`;
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

  // ──────────────────────────────────────────────────────────────
  //  LEVEL UP MODAL
  // ──────────────────────────────────────────────────────────────
  showLevelUpModal(player) {
    window.MedievalSurvivors.sound.playLevelUp();
    this.levelUpCards.innerHTML = '';

    const options = this.generateUpgradeOptions(player);

    options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'card-option';

      const isNew = opt.currentLevel === 0;
      const badgeClass = isNew ? 'badge-new' : 'badge-upgrade';
      const badgeText = isNew ? 'NOVO' : `NÍVEL ${opt.currentLevel + 1}`;

      card.innerHTML = `
        <span class="card-badge ${badgeClass}">${badgeText}</span>
        <div class="card-icon">${opt.icon}</div>
        <div class="card-name">${opt.name}</div>
        <div class="card-level">${isNew ? 'Adquirir Armamento/Poder' : `Nv. ${opt.currentLevel} ➔ ${opt.currentLevel + 1}`}</div>
        <div class="card-desc">${opt.description}</div>
        <div class="card-stats">${opt.diff}</div>
      `;

      card.addEventListener('click', () => {
        opt.apply();
        this.levelUpModal.classList.remove('active');
        this.game.resume();
      });

      this.levelUpCards.appendChild(card);
    });

    this.levelUpModal.classList.add('active');
  }

  generateUpgradeOptions(player) {
    const options = [];

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

    // If everything maxed, grant a banquet reward
    if (options.length === 0) {
      return [{
        type: 'heal',
        name: 'Banquete do Cavaleiro',
        icon: '🍗',
        currentLevel: 0,
        description: 'Recupera 50% da vida máxima e concede 50 moedas de ouro.',
        diff: '+50% HP Restauração',
        apply: () => {
          player.heal(player.maxHp * 0.5);
          player.gold += 50;
        }
      }];
    }

    shuffleArray(options);
    return options.slice(0, 3);
  }

  // ──────────────────────────────────────────────────────────────
  //  CHEST MODAL
  // ──────────────────────────────────────────────────────────────
  showChestModal(player, tier) {
    this.chestRewards.innerHTML = '';
    const rewardCount = tier === 3 ? 5 : (tier === 2 ? 3 : 1);

    const upgradeables = player.weapons.filter(w => w.level < w.maxLevel);

    for (let i = 0; i < rewardCount; i++) {
      if (upgradeables.length > 0) {
        const wep = upgradeables[Math.floor(Math.random() * upgradeables.length)];
        wep.upgrade();

        const row = document.createElement('div');
        row.className = 'reward-row';
        row.innerHTML = `
          <div class="reward-icon">${wep.icon}</div>
          <div class="reward-info">
            <h4>${wep.name} Aprimorado!</h4>
            <p>Novo Nível: ${wep.level} - ${wep.getNextLevelDiff()}</p>
          </div>
        `;
        this.chestRewards.appendChild(row);
      } else {
        // Gold / Heal reward
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

    this.chestModal.classList.add('active');
  }

  // ──────────────────────────────────────────────────────────────
  //  GAME OVER MODAL
  // ──────────────────────────────────────────────────────────────
  showGameOver(player, gameTime) {
    const mins = Math.floor(gameTime / 60);
    const secs = Math.floor(gameTime % 60);
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    document.getElementById('stat-time').textContent = timeStr;
    document.getElementById('stat-level').textContent = player.level;
    document.getElementById('stat-kills').textContent = player.killCount;

    const statGold = document.getElementById('stat-gold');
    if (statGold) statGold.textContent = `+${player.gold} 💰`;

    // Weapon DPS breakdown
    const breakdown = document.getElementById('weapon-breakdown');
    if (breakdown) {
      const totalDmg = player.weapons.reduce((sum, w) => sum + (w.totalDamageDealt || 0), 0);
      breakdown.innerHTML = player.weapons.map(w => `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.85rem;">
          <span>${w.icon} ${w.name} (Nv. ${w.level}):</span>
          <span style="color:#f0c05a; font-weight:700;">${(w.totalDamageDealt || 0).toLocaleString()} dano</span>
        </div>
      `).join('');
    }

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
    this._menuSelectedClass = this.game.selectedClassId || 'knight';
    this.updateMenuGoldDisplay();
    this.hideAllModals();
    this.mainMenuModal.classList.add('active');
    this.switchMenuTab(tab || 'play');
  }

  updateMenuGoldDisplay() {
    const el = document.getElementById('menu-gold-val');
    if (el && this.game.saveManager) {
      el.textContent = this.game.saveManager.getGold().toLocaleString();
    }
  }

  switchMenuTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    // Render the tab content
    switch (tabName) {
      case 'play':     this.renderPlayTab();     break;
      case 'heroes':   this.renderHeroesTab();   break;
      case 'forge':    this.renderForgeTab();     break;
      case 'codex':    this.renderCodexTab();     break;
      case 'history':  this.renderHistoryTab();   break;
      case 'settings': this.renderSettingsTab();  break;
      default:         this.renderPlayTab();
    }
  }

  // ── TAB: Iniciar Batalha ────────────────────────────────────
  renderPlayTab() {
    const cls = window.MedievalSurvivors.classRegistry.getClass(this._menuSelectedClass);
    if (!cls) return;

    this.menuTabContent.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:24px; padding:20px 0;">
        <div class="codex-card" style="max-width:420px; width:100%; text-align:center; padding:28px 24px;">
          <div style="font-size:4rem; margin-bottom:12px;">${cls.icon}</div>
          <h2 style="color:#f0c05a; margin:0 0 4px;">${cls.name}</h2>
          <div style="color:#aaa; font-size:0.9rem; margin-bottom:16px;">${cls.subtitle}</div>
          <p style="font-size:0.92rem; line-height:1.6; color:#ddd; margin-bottom:16px;">${cls.description}</p>
          <div class="forge-grid" style="grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
            <div class="stat-box"><span class="title">Vida Máxima</span><span class="val">${cls.stats.maxHp} HP</span></div>
            <div class="stat-box"><span class="title">Armadura</span><span class="val">${cls.stats.armor}</span></div>
            <div class="stat-box"><span class="title">Velocidade</span><span class="val">${(cls.stats.moveSpeed * 100).toFixed(0)}</span></div>
            <div class="stat-box"><span class="title">Dano Base</span><span class="val">+${((cls.stats.damageMultiplier - 1) * 100).toFixed(0)}%</span></div>
          </div>
          <div style="font-size:0.85rem; color:#f0c05a; background:rgba(0,0,0,0.35); border-radius:8px; padding:10px; margin-bottom:20px;">
            <strong>Perk:</strong> ${cls.perkDesc}
          </div>
          <button class="btn-primary" id="btn-start-battle" style="width:100%; font-size:1.05rem; padding:14px;">⚔️ Iniciar Batalha!</button>
          <button class="btn-primary" style="width:100%; font-size:0.9rem; padding:10px; margin-top:10px; background:linear-gradient(180deg,#2c3e50,#1a252f);" id="btn-go-heroes">🛡️ Trocar Combatente</button>
        </div>
      </div>
    `;

    document.getElementById('btn-start-battle').addEventListener('click', () => {
      this.game.selectedClassId = this._menuSelectedClass;
      this.hideAllModals();
      this.game.start();
    });

    document.getElementById('btn-go-heroes').addEventListener('click', () => {
      this.switchMenuTab('heroes');
    });
  }

  // ── TAB: Combatentes ────────────────────────────────────────
  renderHeroesTab() {
    const classes = window.MedievalSurvivors.classRegistry.getAllClasses();

    this.menuTabContent.innerHTML = `
      <div class="codex-grid" style="grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap:16px;">
        ${classes.map(c => `
          <div class="codex-card class-menu-card ${c.id === this._menuSelectedClass ? 'selected' : ''} ${!c.unlocked ? 'locked' : ''}"
               data-classid="${c.id}" style="cursor:pointer; text-align:center; padding:22px 16px;">
            <div style="font-size:3rem; margin-bottom:8px;">${c.icon}</div>
            <h3 style="color:#f0c05a; margin:0 0 4px; font-size:1rem;">${c.name}</h3>
            <div style="color:#aaa; font-size:0.82rem; margin-bottom:12px;">${c.subtitle}</div>
            <div style="font-size:0.8rem; color:#ccc; line-height:1.5;">
              <div>❤️ ${c.stats.maxHp} HP &nbsp;|&nbsp; 🛡️ ${c.stats.armor} Armad.</div>
              <div>⚡ ${(cls => (cls.stats.moveSpeed * 100).toFixed(0))(c)} Vel.</div>
            </div>
            <div style="margin-top:12px;">
              ${c.unlocked
                ? `<button class="btn-primary" style="font-size:0.82rem; padding:7px 14px;">${c.id === this._menuSelectedClass ? '✅ Selecionado' : 'Selecionar'}</button>`
                : `<button class="btn-primary" style="font-size:0.82rem; padding:7px 14px; opacity:0.5; cursor:not-allowed;">🔒 Bloqueado</button>`}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.menuTabContent.querySelectorAll('.class-menu-card').forEach(card => {
      const cid = card.getAttribute('data-classid');
      const cls = window.MedievalSurvivors.classRegistry.getClass(cid);
      if (cls && cls.unlocked) {
        card.addEventListener('click', () => {
          this._menuSelectedClass = cid;
          this.game.selectedClassId = cid;
          this.renderHeroesTab();
        });
      }
    });
  }

  // ── TAB: Forja ───────────────────────────────────────────────
  renderForgeTab() {
    const sm = this.game.saveManager;
    const upgrades = sm.metaUpgradeDefinitions;

    this.menuTabContent.innerHTML = `
      <div style="margin-bottom:16px; text-align:center; color:#aaa; font-size:0.9rem;">
        Gaste o ouro acumulado em melhorias permanentes que persistem entre todas as partidas.
      </div>
      <div class="forge-grid" id="forge-grid-inner"></div>
    `;

    const grid = document.getElementById('forge-grid-inner');
    if (!grid) return;

    upgrades.forEach(def => {
      const currentLvl = sm.getUpgradeLevel(def.id);
      const cost = sm.getUpgradeCost(def.id);
      const isMaxed = currentLvl >= def.maxLevel;
      const canAfford = !isMaxed && sm.getGold() >= cost;

      const card = document.createElement('div');
      card.className = 'forge-card';
      card.innerHTML = `
        <div class="forge-card-icon">${def.icon}</div>
        <div class="forge-card-name">${def.name}</div>
        <div class="forge-card-level">Nível ${currentLvl} / ${def.maxLevel}</div>
        <div class="forge-card-desc">${def.description}</div>
        <div class="forge-card-stat">${def.statPerLevel}</div>
        <button class="btn-primary forge-buy-btn" data-id="${def.id}"
          style="${isMaxed ? 'background:linear-gradient(180deg,#2d5a2d,#1a3a1a); opacity:0.7; cursor:not-allowed;' :
            canAfford ? '' : 'opacity:0.5; cursor:not-allowed;'}">
          ${isMaxed ? '✅ MÁXIMO' : `🔨 ${cost} 💰`}
        </button>
      `;

      if (!isMaxed) {
        const buyBtn = card.querySelector('.forge-buy-btn');
        buyBtn.addEventListener('click', () => {
          const success = sm.purchaseUpgrade(def.id);
          if (success) {
            this.updateMenuGoldDisplay();
            this.renderForgeTab();
          } else {
            buyBtn.style.animation = 'none';
            buyBtn.textContent = '❌ Ouro insuficiente';
            setTimeout(() => {
              buyBtn.textContent = `🔨 ${sm.getUpgradeCost(def.id)} 💰`;
            }, 1200);
          }
        });
      }

      grid.appendChild(card);
    });
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
    const enemies = [
      { icon: '💀', name: 'Zumbi Camponês', type: 'Básico', hp: '30-50', dmg: '8-10', desc: 'A mais comum ameaça. Avança lentamente mas em grandes hordas perigosas.' },
      { icon: '🧟', name: 'Arqueiro Cadáver', type: 'Básico', hp: '25-40', dmg: '6 (Projétil)', desc: 'Mantém distância e lança flechas podres. Projéteis podem ser cancelados por suas armas.' },
      { icon: '👹', name: 'Ogro das Trevas', type: 'Elite', hp: '120-180', dmg: '18-25', desc: 'Colosso lento que causa tremores ao andar. Alta resistência a knockback.' },
      { icon: '🧙', name: 'Mago Negro', type: 'Elite', hp: '80-110', dmg: '15 (Projétil)', desc: 'Lança bolas de energia sombria. Seus projéteis são deflectidos por armas activas.' },
      { icon: '🐺', name: 'Lobo Fantasma', type: 'Rápido', hp: '45-65', dmg: '12-16', desc: 'Extremamente veloz. Ziguezagueia ao aproximar-se, difícil de rastrear.' },
      { icon: '🦇', name: 'Morcego das Cavernas', type: 'Rápido', hp: '20-35', dmg: '7-10', desc: 'Ataca em voos rasantes. Pequeno mas numeroso ao amanhecer.' },
      { icon: '🪖', name: 'Guarda Corrompido', type: 'Armado', hp: '90-130', dmg: '14-20', desc: 'Antigo soldado ressuscitado. Avança em formação e resiste melhor a dano.' },
      { icon: '👑', name: 'Carrasco Carmesim', type: 'Mini-Chefe', hp: '500+', dmg: '30+', desc: 'Mini-chefe frequente. Derrubá-lo garante um baú de recompensas de armas.' },
      { icon: '🐉', name: 'Dragão das Ruínas', type: 'Chefe Final', hp: '2000+', dmg: '50+', desc: 'O mais temido dos bosses. Aparece no final e dissolve exércitos inteiros.' },
      { icon: '💀', name: 'Lich Ancestral', type: 'Chefe', hp: '1200+', dmg: '40+', desc: 'Senhor dos mortos-vivos. Convoca reforços e lança projéteis de morte massivos.' },
    ];

    return `
      <div class="codex-grid">
        ${enemies.map(e => `
          <div class="codex-card" style="text-align:left;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
              <span style="font-size:2.2rem;">${e.icon}</span>
              <div>
                <div style="font-weight:700; color:#f0c05a; font-size:0.95rem;">${e.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">${e.type} &nbsp;|&nbsp; ❤️ ${e.hp} &nbsp;|&nbsp; ⚔️ ${e.dmg}</div>
              </div>
            </div>
            <p style="font-size:0.82rem; color:#ccc; margin:0; line-height:1.5;">${e.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  _codexWeaponsHTML() {
    const weaponIds = window.MedievalSurvivors.weapons.getAllWeaponIds();
    const cards = weaponIds.map(wid => {
      const w = window.MedievalSurvivors.weapons.create(wid);
      if (!w) return '';
      return `
        <div class="codex-card" style="text-align:left;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
            <span style="font-size:2.2rem;">${w.icon}</span>
            <div>
              <div style="font-weight:700; color:#f0c05a;">${w.name}</div>
              <div style="font-size:0.75rem; color:#aaa;">Dano: ${w.damage} &nbsp;|&nbsp; Máx Nível: ${w.maxLevel}</div>
            </div>
          </div>
          <p style="font-size:0.82rem; color:#ccc; margin:0; line-height:1.5;">${w.description}</p>
        </div>
      `;
    });

    return `<div class="codex-grid">${cards.join('')}</div>`;
  }

  _codexPassivesHTML() {
    const passives = window.MedievalSurvivors.passives.getAll();
    return `
      <div class="codex-grid">
        ${passives.map(p => `
          <div class="codex-card" style="text-align:left;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
              <span style="font-size:2.2rem;">${p.icon}</span>
              <div>
                <div style="font-weight:700; color:#f0c05a;">${p.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">Máx Nível: ${p.maxLevel}</div>
              </div>
            </div>
            <p style="font-size:0.82rem; color:#ccc; margin:0; line-height:1.5;">${p.description}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  _codexClassesHTML() {
    const classes = window.MedievalSurvivors.classRegistry.getAllClasses();
    return `
      <div class="codex-grid">
        ${classes.map(c => `
          <div class="codex-card" style="text-align:left; ${!c.unlocked ? 'opacity:0.55;' : ''}">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
              <span style="font-size:2.4rem;">${c.icon}</span>
              <div>
                <div style="font-weight:700; color:#f0c05a;">${c.name}</div>
                <div style="font-size:0.75rem; color:#aaa;">${c.subtitle} ${!c.unlocked ? '🔒' : ''}</div>
              </div>
            </div>
            <p style="font-size:0.82rem; color:#ccc; margin:0 0 8px; line-height:1.5;">${c.description}</p>
            <div style="font-size:0.8rem; color:#f0c05a; background:rgba(0,0,0,0.3); border-radius:6px; padding:8px;">
              <strong>Perk:</strong> ${c.perkDesc}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:10px; font-size:0.78rem; color:#ccc;">
              <div>❤️ ${c.stats.maxHp} Max HP</div>
              <div>🛡️ ${c.stats.armor} Armadura</div>
              <div>⚡ ${(c.stats.moveSpeed * 100).toFixed(0)} Velocidade</div>
              <div>⚔️ +${((c.stats.damageMultiplier - 1) * 100).toFixed(0)}% Dano</div>
            </div>
          </div>
        `).join('')}
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
      ? `<tr><td colspan="7" style="text-align:center; color:#666; padding:20px;">Nenhuma run registrada ainda. Entre em batalha!</td></tr>`
      : history.map(run => `
          <tr>
            <td>${run.date}</td>
            <td>${run.hero}</td>
            <td><span class="badge-${run.outcome === 'VITÓRIA' ? 'victory' : 'defeat'}">${run.outcome}</span></td>
            <td>${run.timeSurvived}</td>
            <td>${run.level}</td>
            <td>${run.kills}</td>
            <td style="color:#ffeaa7;">+${run.goldEarned} 💰</td>
          </tr>
        `).join('');

    this.menuTabContent.innerHTML = `
      <div style="display:flex; gap:20px; justify-content:center; margin-bottom:20px; flex-wrap:wrap;">
        <div class="stat-box" style="min-width:120px; text-align:center;">
          <span class="title">Runs Totais</span>
          <span class="val">${total}</span>
        </div>
        <div class="stat-box" style="min-width:120px; text-align:center;">
          <span class="title">Vitórias</span>
          <span class="val" style="color:#2ecc71;">${wins}</span>
        </div>
        <div class="stat-box" style="min-width:120px; text-align:center;">
          <span class="title">Taxa de Vitória</span>
          <span class="val">${total > 0 ? ((wins / total) * 100).toFixed(1) : 0}%</span>
        </div>
        <div class="stat-box" style="min-width:120px; text-align:center;">
          <span class="title">Ouro Total</span>
          <span class="val" style="color:#ffeaa7;">${sm.data.totalGoldEarned.toLocaleString()} 💰</span>
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
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  // ── TAB: Opções ──────────────────────────────────────────────
  renderSettingsTab() {
    const sm = this.game.saveManager;
    const mouseAimActive = sm ? sm.data.settings.mouseAim : true;
    const soundMuted = sm ? sm.data.settings.soundMuted : false;

    this.menuTabContent.innerHTML = `
      <div style="max-width:480px; margin:0 auto; display:flex; flex-direction:column; gap:18px; padding:10px 0;">

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">🎯 Controle de Mira</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Usar mouse para direcionar ataques do personagem.</div>
          </div>
          <button class="btn-primary" id="settings-mouse-aim-btn" style="min-width:140px;">
            ${mouseAimActive ? '🖱️ Mouse: Ativo' : '⌨️ Teclado: Ativo'}
          </button>
        </div>

        <div class="forge-card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#f0c05a;">🔊 Som e Música</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Alternar efeitos sonoros e música de fundo.</div>
          </div>
          <button class="btn-primary" id="settings-sound-btn" style="min-width:140px;">
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

    document.getElementById('settings-sound-btn').addEventListener('click', () => {
      const isMuted = window.MedievalSurvivors.sound.toggleMute();
      if (sm) {
        sm.data.settings.soundMuted = isMuted;
        sm.save();
      }
      const hudSoundBtn = document.getElementById('btn-sound-toggle');
      if (hudSoundBtn) hudSoundBtn.innerHTML = isMuted ? '🔇 Som: Desligado' : '🔊 Som: Ligado';
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
      this.mainMenuModal
    ].forEach(m => { if (m) m.classList.remove('active'); });
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

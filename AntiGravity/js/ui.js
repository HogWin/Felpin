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

    // Pause → Synergies Modal
    const pauseSynBtn = document.getElementById('btn-pause-synergies');
    if (pauseSynBtn) {
      pauseSynBtn.addEventListener('click', () => {
        this.openSynergiesModal();
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
    window.MedievalSurvivors.sound.playLevelUp();
    this.levelUpCards.innerHTML = '';

    const options = this.generateUpgradeOptions(player);

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
      <div style="margin-bottom:8px; background:rgba(0,0,0,0.22); padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:0.86rem; align-items:center;">
          <span>${w.icon} <strong>${w.name}</strong> <span style="color:#d4af37; font-size:0.75rem;">(${lvlLabel})</span>:</span>
          <span style="color:#f7d774; font-weight:700;">${dmg.toLocaleString()} dano <span style="color:#00e5ff; font-size:0.78rem;">(${dps} DPS | ${pct}%)</span></span>
        </div>
        <div style="width:100%; height:7px; background:#120c18; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #d35400, #f1c40f); border-radius:4px;"></div>
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
      case 'play':      this.renderPlayTab();      break;
      case 'heroes':    this.renderHeroesTab();    break;
      case 'forge':     this.renderForgeTab();     break;
      case 'synergies': this.renderSynergiesTab(); break;
      case 'codex':     this.renderCodexTab();     break;
      case 'achievements': this.renderAchievementsTab(); break;
      case 'history':   this.renderHistoryTab();   break;
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
          <div class="pedestal-wrap">
            <div class="pedestal-aura"></div>
            <div class="pedestal-avatar">${cls.icon}</div>
          </div>

          <div class="hero-details-wrap">
            <div class="hero-role-badge">⚜️ COMBATENTE SELECIONADO</div>
            <h2 class="hero-title">${cls.name}</h2>
            <div class="hero-subtitle">${cls.subtitle}</div>
            <p class="hero-desc">${cls.description}</p>

            <!-- Stat Meters -->
            <div class="hero-stat-meters">
              <div class="meter-box">
                <div class="meter-label"><span>❤️ Vida Máxima</span> <strong>${cls.stats.maxHp} HP</strong></div>
                <div class="meter-track"><div class="meter-fill hp-meter" style="width:${hpPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span>🛡️ Armadura</span> <strong>${cls.stats.armor} Pontos</strong></div>
                <div class="meter-track"><div class="meter-fill armor-meter" style="width:${armorPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span>⚡ Agilidade</span> <strong>${(cls.stats.moveSpeed * 100).toFixed(0)} Vel.</strong></div>
                <div class="meter-track"><div class="meter-fill speed-meter" style="width:${speedPercent}%;"></div></div>
              </div>
              <div class="meter-box">
                <div class="meter-label"><span>⚔️ Dano Base</span> <strong>+${((cls.stats.damageMultiplier - 1) * 100).toFixed(0)}%</strong></div>
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
              <button class="btn-primary btn-secondary-hub" id="btn-go-heroes">
                🛡️ Trocar Classe
              </button>
              <button class="btn-primary btn-secondary-hub" id="btn-go-forge">
                🔨 Forja Real
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

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

    document.getElementById('btn-go-heroes').addEventListener('click', () => {
      this.switchMenuTab('heroes');
    });

    document.getElementById('btn-go-forge').addEventListener('click', () => {
      this.switchMenuTab('forge');
    });
  }

  // ── TAB: Combatentes ────────────────────────────────────────
  renderHeroesTab() {
    const classes = window.MedievalSurvivors.classRegistry.getAllClasses();

    this.menuTabContent.innerHTML = `
      <div class="heroes-header-banner">
        <h3>🛡️ GUILDA DOS CAMPEÕES DE VALORIA</h3>
        <p>Escolha o combatente para liderar sua investida contra o cataclisma das catacumbas.</p>
      </div>

      <div class="codex-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:18px;">
        ${classes.map(c => {
          const isSelected = c.id === this._menuSelectedClass;
          const w = window.MedievalSurvivors.weapons.create(c.startingWeapon);
          return `
          <div class="hero-select-card ${isSelected ? 'selected' : ''} ${!c.unlocked ? 'locked' : ''}"
               data-classid="${c.id}">
            ${isSelected ? `<div class="selected-ribbon">👑 ATIVO</div>` : ''}
            <div class="hero-card-avatar">${c.icon}</div>
            <h3 class="hero-card-title">${c.name}</h3>
            <div class="hero-card-sub">${c.subtitle}</div>

            <div class="hero-card-stats-box">
              <div class="stat-line"><span>❤️ Vida Máxima:</span> <strong>${c.stats.maxHp}</strong></div>
              <div class="stat-line"><span>🛡️ Armadura:</span> <strong>${c.stats.armor}</strong></div>
              <div class="stat-line"><span>⚡ Velocidade:</span> <strong>${(c.stats.moveSpeed * 100).toFixed(0)}</strong></div>
              <div class="stat-line"><span>⚔️ Dano Base:</span> <strong>+${((c.stats.damageMultiplier - 1) * 100).toFixed(0)}%</strong></div>
            </div>

            <div class="hero-card-perk">
              <strong>Bênção:</strong> ${c.perkDesc}
            </div>

            ${w ? `
            <div class="hero-card-wep">
              <span>Arma:</span> <strong>${w.icon} ${w.name}</strong>
            </div>
            ` : ''}

            <button class="btn-primary btn-hero-select ${isSelected ? 'active-hero-btn' : ''}">
              ${isSelected ? '✅ Combatente Selecionado' : '⚔️ Escolher Combatente'}
            </button>
          </div>
          `;
        }).join('')}
      </div>
    `;

    this.menuTabContent.querySelectorAll('.hero-select-card').forEach(card => {
      const cid = card.getAttribute('data-classid');
      const cls = window.MedievalSurvivors.classRegistry.getClass(cid);
      if (cls && cls.unlocked) {
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
          ${isMaxed ? '✅ MÁXIMO FORJADO' : `🔨 Aprimorar (${cost} 💰)`}
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
              buyBtn.textContent = `🔨 Aprimorar (${sm.getUpgradeCost(def.id)} 💰)`;
            }, 1200);
          }
        });
      }

      grid.appendChild(card);
    });
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
                ${isUnlocked ? a.icon : '🔒'}
              </div>
              <div class="achievement-card-info">
                <div class="achievement-card-header">
                  <h4 class="achievement-card-title">${a.name}</h4>
                  ${a.reward && a.reward.gold ? `
                    <span class="achievement-reward-tag ${isUnlocked ? 'claimed' : 'unclaimed'}">
                      +${a.reward.gold} 💰
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

  // ── TAB: Opções ──────────────────────────────────────────────
  renderSettingsTab() {
    const sm = this.game.saveManager;
    const mouseAimActive = sm ? sm.data.settings.mouseAim : true;
    const soundMuted = sm ? sm.data.settings.soundMuted : false;
    const graphicsQuality = sm && sm.data.settings.graphicsQuality ? sm.data.settings.graphicsQuality : 'alta';

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
            <div style="font-weight:700; color:#f0c05a;">⚡ Otimização Gráfica</div>
            <div style="font-size:0.82rem; color:#aaa; margin-top:4px;">Alternar entre Alta Resolução e Desempenho Ultra Fluido (60 FPS).</div>
          </div>
          <button class="btn-primary" id="settings-graphics-btn" style="min-width:150px;">
            ${graphicsQuality === 'alta' ? '💎 Alta Qualidade' : '🚀 60 FPS Rápido'}
          </button>
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

    document.getElementById('settings-graphics-btn').addEventListener('click', () => {
      const nextQuality = graphicsQuality === 'alta' ? 'desempenho' : 'alta';
      if (sm) {
        sm.data.settings.graphicsQuality = nextQuality;
        sm.save();
      }
      if (this.game.renderer && this.game.renderer.renderer) {
        this.game.renderer.renderer.setPixelRatio(nextQuality === 'alta' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1.0);
      }
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

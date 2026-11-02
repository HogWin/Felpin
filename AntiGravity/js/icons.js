/**
 * The Fallen Kingdom - Gothic Vector Iconography & Symbol Engine
 * Replaces generic OS emojis with handcrafted, thematic, dark medieval vector symbols.
 */

(function(window) {
  'use strict';

  window.MedievalSurvivors = window.MedievalSurvivors || {};

  const SVG_DEFS = {
    // ==========================================
    // 1. CLASSES & PERSONAGENS (HERO MODELS)
    // ==========================================
    class_knight: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-knight" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldHelm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff0aa"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#7a5509"/>
          </linearGradient>
          <linearGradient id="crestRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff4d4d"/>
            <stop offset="100%" stop-color="#800000"/>
          </linearGradient>
        </defs>
        <!-- Plume / Crista de Guerra Imperial -->
        <path d="M32 4 C28 12, 18 10, 16 18 C22 17, 26 15, 32 15 C38 15, 42 17, 48 18 C46 10, 36 12, 32 4 Z" fill="url(#crestRed)" stroke="#3a0202" stroke-width="1.5"/>
        <path d="M32 6 C30 11, 24 12, 22 16 C27 15, 30 13, 32 13 C34 13, 37 15, 42 16 C40 12, 34 11, 32 6 Z" fill="#ff7675"/>
        <!-- Great Helm Dome -->
        <path d="M19 22 C19 15, 45 15, 45 22 L46 36 C46 47, 39 53, 32 58 C25 53, 18 47, 18 36 Z" fill="url(#goldHelm)" stroke="#4a3b00" stroke-width="2"/>
        <!-- Brow Reinforcement Band -->
        <path d="M18 27 L46 27 L45 32 L19 32 Z" fill="#b8860b" stroke="#3a2f00" stroke-width="1.2"/>
        <!-- Central Ridge -->
        <line x1="32" y1="16" x2="32" y2="57" stroke="#4a3b00" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Crusader T-Visor / Fenda de Visão -->
        <path d="M22 34 L42 34 L42 37 L34 37 L34 50 L30 50 L30 37 L22 37 Z" fill="#120c02" stroke="#d4af37" stroke-width="1"/>
        <!-- Breathing Vent Holes -->
        <circle cx="25" cy="43" r="1.5" fill="#120c02"/>
        <circle cx="25" cy="48" r="1.5" fill="#120c02"/>
        <circle cx="39" cy="43" r="1.5" fill="#120c02"/>
        <circle cx="39" cy="48" r="1.5" fill="#120c02"/>
        <circle cx="21" cy="29.5" r="1.2" fill="#fff" opacity="0.8"/>
        <circle cx="43" cy="29.5" r="1.2" fill="#fff" opacity="0.8"/>
      </svg>
    `,

    class_ranger: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-ranger" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="woodBow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6ab04c"/>
            <stop offset="50%" stop-color="#218c74"/>
            <stop offset="100%" stop-color="#0b382c"/>
          </linearGradient>
        </defs>
        <!-- Ranger Hood Silhouette -->
        <path d="M32 7 C22 7, 16 16, 17 28 C17 38, 22 46, 32 50 C42 46, 47 38, 47 28 C48 16, 42 7, 32 7 Z" fill="#1e372f" stroke="#0f1d18" stroke-width="1.5"/>
        <path d="M24 23 C27 20, 37 20, 40 23 C42 32, 38 41, 32 44 C26 41, 22 32, 24 23 Z" fill="#0d1612"/>
        <!-- Piercing Emerald Eyes -->
        <polygon points="26,29 29,29 28,31 25,31" fill="#2ed573"/>
        <polygon points="35,29 38,29 39,31 36,31" fill="#2ed573"/>
        <!-- Recurve Bow -->
        <path d="M12 12 Q 22 32 12 52" fill="none" stroke="url(#woodBow)" stroke-width="4" stroke-linecap="round"/>
        <line x1="12" y1="13" x2="32" y2="32" stroke="#dcdde1" stroke-width="1.2"/>
        <line x1="32" y1="32" x2="12" y2="51" stroke="#dcdde1" stroke-width="1.2"/>
        <line x1="12" y1="32" x2="54" y2="32" stroke="#f1f2f6" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Arrowhead (Obsidian Razor) -->
        <polygon points="58,32 50,28 52,32 50,36" fill="#2ed573" stroke="#10ac84" stroke-width="1"/>
        <path d="M18 29 L14 26 L12 32 L14 38 L18 35 Z" fill="#2ecc71"/>
      </svg>
    `,

    class_pyromancer: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-pyromancer" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#b71540"/>
            <stop offset="40%" stop-color="#e55039"/>
            <stop offset="75%" stop-color="#fa983a"/>
            <stop offset="100%" stop-color="#f6e58d"/>
          </linearGradient>
        </defs>
        <!-- Arcane Flame Burst Outer -->
        <path d="M32 4 C37 14, 46 17, 44 28 C52 23, 56 34, 52 44 C48 54, 40 59, 32 60 C24 59, 16 54, 12 44 C8 34, 12 23, 20 28 C18 17, 27 14, 32 4 Z" fill="url(#fireGrad)" stroke="#4b0908" stroke-width="1.5"/>
        <path d="M32 18 C35 24, 40 27, 39 34 C44 31, 46 38, 44 44 C41 50, 37 53, 32 54 C27 53, 23 50, 20 44 C18 38, 20 31, 25 34 C24 27, 29 24, 32 18 Z" fill="#ffffff" opacity="0.9"/>
        <!-- Occult Arcane Rune in Core -->
        <polygon points="32,26 37,36 27,36" fill="none" stroke="#eb2f06" stroke-width="2"/>
        <polygon points="32,42 37,32 27,32" fill="none" stroke="#eb2f06" stroke-width="2"/>
        <circle cx="32" cy="34" r="2.5" fill="#f8c291"/>
      </svg>
    `,

    class_paladin: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-paladin" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="holySun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff9d2"/>
            <stop offset="50%" stop-color="#f1c40f"/>
            <stop offset="100%" stop-color="#b7791f"/>
          </linearGradient>
          <linearGradient id="silverPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="60%" stop-color="#bdc3c7"/>
            <stop offset="100%" stop-color="#7f8c8d"/>
          </linearGradient>
        </defs>
        <!-- Radiant Solar Halo Beams -->
        <path d="M32 6 L35 15 L43 8 L40 18 L50 14 L44 23 L55 23 L47 30 L58 32 L47 34 L55 41 L44 41 L50 50 L40 46 L43 56 L35 49 L32 58 L29 49 L21 56 L24 46 L14 50 L20 41 L9 41 L17 34 L6 32 L17 30 L9 23 L20 23 L14 14 L24 18 L21 8 L29 15 Z" fill="url(#holySun)" opacity="0.75"/>
        <!-- Holy Tower Kite Shield -->
        <path d="M20 18 L44 18 C44 34, 40 48, 32 54 C24 48, 20 34, 20 18 Z" fill="url(#silverPlate)" stroke="#2c3e50" stroke-width="2"/>
        <path d="M22 20 L42 20 C42 33, 38 45, 32 50 C26 45, 22 33, 22 20 Z" fill="none" stroke="#d4af37" stroke-width="1.8"/>
        <!-- Consecrated Cross Pattee -->
        <path d="M32 24 L34 30 L40 28 L37 34 L43 36 L37 38 L40 44 L34 42 L32 48 L30 42 L24 44 L27 38 L21 36 L27 34 L24 28 L30 30 Z" fill="#c0392b" stroke="#781005" stroke-width="1.2"/>
        <circle cx="32" cy="36" r="2.5" fill="#f1c40f"/>
      </svg>
    `,

    class_berserker: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-berserker" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ironAxe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#95a5a6"/>
            <stop offset="50%" stop-color="#4a5568"/>
            <stop offset="100%" stop-color="#1a202c"/>
          </linearGradient>
        </defs>
        <!-- Crossed Great Axes Shafts -->
        <line x1="12" y1="52" x2="52" y2="12" stroke="#8c531b" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="52" y1="52" x2="12" y2="12" stroke="#6d3f13" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Left Axe Double Crescent Blades -->
        <path d="M16 16 C8 10, 8 26, 18 28 L24 22 L18 16 Z" fill="url(#ironAxe)" stroke="#000" stroke-width="1.5"/>
        <path d="M22 10 C28 4, 34 16, 26 24 L20 18 L22 10 Z" fill="url(#ironAxe)" stroke="#000" stroke-width="1.5"/>
        <!-- Right Axe Double Crescent Blades -->
        <path d="M48 16 C56 10, 56 26, 46 28 L40 22 L46 16 Z" fill="url(#ironAxe)" stroke="#000" stroke-width="1.5"/>
        <path d="M42 10 C36 4, 30 16, 38 24 L44 18 L42 10 Z" fill="url(#ironAxe)" stroke="#000" stroke-width="1.5"/>
        <!-- Central Horned Skull Crest -->
        <path d="M24 30 C24 24, 40 24, 40 30 C40 38, 38 44, 32 46 C26 44, 24 38, 24 30 Z" fill="#e2e8f0" stroke="#2d3748" stroke-width="2"/>
        <path d="M25 28 C20 22, 14 26, 16 32 C20 31, 23 30, 25 30 Z" fill="#cbd5e0" stroke="#4a5568" stroke-width="1.2"/>
        <path d="M39 28 C44 22, 50 26, 48 32 C44 31, 41 30, 39 30 Z" fill="#cbd5e0" stroke="#4a5568" stroke-width="1.2"/>
        <!-- Blood Frenzy Glowing Eyes -->
        <circle cx="28" cy="33" r="2.2" fill="#e53e3e"/>
        <circle cx="36" cy="33" r="2.2" fill="#e53e3e"/>
      </svg>
    `,

    class_necromancer: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-necromancer" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 6 C18 6, 12 18, 14 36 C15 48, 22 58, 32 60 C42 58, 49 48, 50 36 C52 18, 46 6, 32 6 Z" fill="#13091f" stroke="#3b1764" stroke-width="2"/>
        <path d="M22 14 C16 8, 10 10, 8 16 C12 16, 16 15, 20 18 Z" fill="#d1ccc0" stroke="#574b90" stroke-width="1"/>
        <path d="M42 14 C48 8, 54 10, 56 16 C52 16, 48 15, 44 18 Z" fill="#d1ccc0" stroke="#574b90" stroke-width="1"/>
        <path d="M23 26 C23 20, 41 20, 41 26 C41 35, 38 44, 32 46 C26 44, 23 35, 23 26 Z" fill="#e4e7eb" stroke="#2c2c54" stroke-width="1.8"/>
        <ellipse cx="28" cy="28" rx="3.5" ry="4" fill="#0d0417"/>
        <ellipse cx="36" cy="28" rx="3.5" ry="4" fill="#0d0417"/>
        <circle cx="28" cy="28" r="1.8" fill="#2ed573"/>
        <circle cx="36" cy="28" r="1.8" fill="#2ed573"/>
        <polygon points="32,34 30,37 34,37" fill="#0d0417"/>
        <circle cx="32" cy="53" r="3" fill="#2ed573" opacity="0.8"/>
      </svg>
    `,

    class_assassin: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-assassin" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4 C24 12, 14 20, 16 38 C18 48, 24 56, 32 60 C40 56, 46 48, 48 38 C50 20, 40 12, 32 4 Z" fill="#1b1c24" stroke="#0e0f14" stroke-width="2"/>
        <path d="M22 28 C26 25, 38 25, 42 28 L40 42 C36 46, 28 46, 24 42 Z" fill="#090a0d"/>
        <polygon points="23,28 30,30 29,32 22,30" fill="#e74c3c"/>
        <polygon points="41,28 34,30 35,32 42,30" fill="#e74c3c"/>
        <path d="M8 18 Q 14 30 20 44 L16 46 Q 10 32 6 22 Z" fill="#95a5a6" stroke="#111" stroke-width="1.2"/>
        <path d="M56 18 Q 50 30 44 44 L48 46 Q 54 32 58 22 Z" fill="#95a5a6" stroke="#111" stroke-width="1.2"/>
        <circle cx="20" cy="45" r="1.8" fill="#e74c3c"/>
        <circle cx="44" cy="45" r="1.8" fill="#e74c3c"/>
      </svg>
    `,

    class_dark_knight: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-dark-knight" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 18 C18 8, 46 8, 46 18 L48 38 C48 50, 40 56, 32 60 C24 56, 16 50, 16 38 Z" fill="#111417" stroke="#990000" stroke-width="2.2"/>
        <polygon points="16,20 6,10 16,14" fill="#2d3436" stroke="#990000" stroke-width="1.2"/>
        <polygon points="48,20 58,10 48,14" fill="#2d3436" stroke="#990000" stroke-width="1.2"/>
        <line x1="32" y1="12" x2="32" y2="58" stroke="#990000" stroke-width="2"/>
        <polygon points="22,30 42,30 40,33 34,33 32,46 30,33 24,33" fill="#ff4757"/>
      </svg>
    `,

    class_plague_alchemist: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-plague-alchemist" xmlns="http://www.w3.org/2000/svg">
        <!-- Plague Doctor Beak Mask -->
        <ellipse cx="32" cy="18" rx="20" ry="6" fill="#1e272e" stroke="#27ae60" stroke-width="2"/>
        <polygon points="22,18 42,18 38,6 26,6" fill="#2f3542" stroke="#27ae60" stroke-width="1.5"/>
        <circle cx="26" cy="28" r="5" fill="#27ae60" stroke="#f1c40f" stroke-width="1.5"/>
        <circle cx="38" cy="28" r="5" fill="#27ae60" stroke="#f1c40f" stroke-width="1.5"/>
        <circle cx="26" cy="28" r="2" fill="#fff"/>
        <circle cx="38" cy="28" r="2" fill="#fff"/>
        <!-- Curved Raven Beak -->
        <path d="M28 32 C30 46, 32 54, 32 58 C32 54, 34 46, 36 32 Z" fill="#f5f6fa" stroke="#2f3542" stroke-width="2"/>
      </svg>
    `,

    // ==========================================
    // 2. ARMAS (20 WEAPON MODELS)
    // ==========================================
    weapon_broadsword: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-broadsword" xmlns="http://www.w3.org/2000/svg">
        <polygon points="56,8 54,16 26,44 20,38 48,10" fill="#ecf0f1" stroke="#2c3e50" stroke-width="1.8"/>
        <line x1="53" y1="11" x2="25" y2="39" stroke="#576574" stroke-width="1.5" stroke-linecap="round"/>
        <polygon points="17,35 30,48 26,52 13,39" fill="#f5cd79" stroke="#533c06" stroke-width="1.5"/>
        <line x1="18" y1="44" x2="10" y2="52" stroke="#592512" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="8" cy="54" r="4.2" fill="#d4af37" stroke="#533c06" stroke-width="1.5"/>
        <circle cx="8" cy="54" r="1.8" fill="#e74c3c"/>
      </svg>
    `,

    weapon_crossbow: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-crossbow" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 52 L36 28 L40 32 L16 56 Z" fill="#592512" stroke="#2c140a" stroke-width="1.5"/>
        <path d="M22 16 Q 36 30 50 16" fill="none" stroke="#718093" stroke-width="5" stroke-linecap="round"/>
        <line x1="22" y1="16" x2="34" y2="34" stroke="#dcdde1" stroke-width="1.5"/>
        <line x1="50" y1="16" x2="34" y2="34" stroke="#dcdde1" stroke-width="1.5"/>
        <line x1="26" y1="42" x2="52" y2="16" stroke="#2f3640" stroke-width="2.5"/>
        <polygon points="56,12 48,16 52,20" fill="#e74c3c" stroke="#800" stroke-width="1"/>
      </svg>
    `,

    weapon_holy_fire: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-holy-fire" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 16 L36 16 L36 24 L48 44 C51 49, 47 56, 40 56 L24 56 C17 56, 13 49, 16 44 L28 24 Z" fill="rgba(255,255,255,0.15)" stroke="#f5cd79" stroke-width="2"/>
        <path d="M19 46 C17 52, 21 54, 25 54 L39 54 C43 54, 47 52, 45 46 L36 32 C34 30, 30 30, 28 32 Z" fill="#e74c3c"/>
        <line x1="32" y1="38" x2="32" y2="48" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="27" y1="42" x2="37" y2="42" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
        <rect x="27" y="10" width="10" height="6" fill="#8c531b" stroke="#3d1e03" stroke-width="1.2" rx="1"/>
        <circle cx="32" cy="6" r="2" fill="#f1c40f"/>
      </svg>
    `,

    weapon_holy_aura: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-holy-aura" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#f9ca24" stroke-width="1.8" stroke-dasharray="4 3"/>
        <circle cx="32" cy="32" r="21" fill="none" stroke="#f6e58d" stroke-width="1.5"/>
        <polygon points="32,8 35,26 53,20 38,32 53,44 35,38 32,56 29,38 11,44 26,32 11,20 29,26" fill="#f5cd79" stroke="#f0932b" stroke-width="1.2"/>
        <circle cx="32" cy="32" r="8" fill="#ffffff" stroke="#f9ca24" stroke-width="2"/>
        <circle cx="32" cy="32" r="4" fill="#f0932b"/>
      </svg>
    `,

    weapon_whirling_axes: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-whirling-axes" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8 A 24 24 0 0 1 56 32" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="6 3" stroke-linecap="round"/>
        <path d="M32 56 A 24 24 0 0 1 8 32" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="6 3" stroke-linecap="round"/>
        <line x1="16" y1="48" x2="48" y2="16" stroke="#795548" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M40 8 C54 6, 58 24, 46 32 L38 24 Z" fill="#95a5a6" stroke="#2c3e50" stroke-width="2"/>
        <polygon points="34,20 28,14 36,12" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1.2"/>
        <circle cx="39" cy="19" r="2.5" fill="#d4af37"/>
      </svg>
    `,

    weapon_spectral_orb: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-spectral-orb" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="#7ed6df" stroke-width="1.5" transform="rotate(-25 32 32)"/>
        <ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="#e056fd" stroke-width="1.5" transform="rotate(35 32 32)"/>
        <circle cx="32" cy="32" r="14" fill="#8854d0" stroke="#ffffff" stroke-width="2"/>
        <circle cx="28" cy="28" r="4.5" fill="#ffffff" opacity="0.8"/>
      </svg>
    `,

    weapon_twin_daggers: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-twin-daggers" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,12 24,20 48,48 44,52 16,30" fill="#dfe6e9" stroke="#2d3436" stroke-width="1.5"/>
        <polygon points="52,12 40,20 16,48 20,52 48,30" fill="#b2bec3" stroke="#2d3436" stroke-width="1.5"/>
        <line x1="16" y1="16" x2="42" y2="44" stroke="#d63031" stroke-width="1.5"/>
        <line x1="48" y1="16" x2="22" y2="44" stroke="#d63031" stroke-width="1.5"/>
        <circle cx="49" cy="53" r="3.5" fill="#e17055"/>
        <circle cx="15" cy="53" r="3.5" fill="#e17055"/>
      </svg>
    `,

    weapon_dark_greatsword: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-dark-greatsword" xmlns="http://www.w3.org/2000/svg">
        <polygon points="58,6 54,16 50,14 46,24 42,22 24,44 18,38 24,28 22,24 32,20 30,16" fill="#2d3436" stroke="#d63031" stroke-width="1.8"/>
        <line x1="50" y1="12" x2="26" y2="38" stroke="#ff7675" stroke-width="2" stroke-dasharray="3 2"/>
        <path d="M14 36 L24 46 L20 50 L10 40 Z" fill="#636e72" stroke="#d63031" stroke-width="1.5"/>
        <line x1="16" y1="45" x2="8" y2="53" stroke="#2c0c0c" stroke-width="5" stroke-linecap="round"/>
        <circle cx="6" cy="55" r="4" fill="#d63031" stroke="#000" stroke-width="1.5"/>
      </svg>
    `,

    weapon_guardian_spear: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-guardian-spear" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="54" x2="48" y2="16" stroke="#8c531b" stroke-width="4" stroke-linecap="round"/>
        <path d="M44 20 L58 6 L44 10 L48 24 Z" fill="#ecf0f1" stroke="#2c3e50" stroke-width="1.8"/>
        <path d="M42 22 L30 26 L36 30 L26 34 L38 32 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
      </svg>
    `,

    weapon_blunderbuss: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-blunderbuss" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 50 C8 52, 14 42, 22 36 L28 42 Z" fill="#5d4037" stroke="#3e2723" stroke-width="1.5"/>
        <polygon points="24,34 50,14 54,20 46,26 28,40" fill="#d4af37" stroke="#8d6e63" stroke-width="1.8"/>
        <ellipse cx="52" cy="17" rx="4" ry="7" fill="#2c3e50" stroke="#f1c40f" stroke-width="1.5" transform="rotate(-40 52 17)"/>
        <circle cx="28" cy="34" r="2.5" fill="#bdc3c7"/>
      </svg>
    `,

    weapon_hellfire_cauldron: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hellfire-cauldron" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 26 L48 26 C48 44, 42 52, 32 52 C22 52, 16 44, 16 26 Z" fill="#2f3542" stroke="#1e272e" stroke-width="2"/>
        <ellipse cx="32" cy="26" rx="17" ry="5" fill="#57606f" stroke="#1e272e" stroke-width="1.5"/>
        <line x1="20" y1="50" x2="16" y2="58" stroke="#1e272e" stroke-width="3" stroke-linecap="round"/>
        <line x1="44" y1="50" x2="48" y2="58" stroke="#1e272e" stroke-width="3" stroke-linecap="round"/>
        <path d="M24 23 C22 14, 28 8, 32 6 C34 12, 40 14, 38 23 Z" fill="#2ed573" stroke="#7bed9f" stroke-width="1"/>
      </svg>
    `,

    weapon_iron_flail: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-iron-flail" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="52" x2="30" y2="34" stroke="#795548" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="34" cy="30" r="3" fill="none" stroke="#718093" stroke-width="2"/>
        <circle cx="40" cy="22" r="3" fill="none" stroke="#718093" stroke-width="2"/>
        <circle cx="50" cy="14" r="9" fill="#2f3640" stroke="#718093" stroke-width="1.8"/>
        <polygon points="50,3 48,6 52,6" fill="#f5f6fa"/>
        <polygon points="61,14 58,12 58,16" fill="#f5f6fa"/>
        <polygon points="50,25 48,22 52,22" fill="#f5f6fa"/>
      </svg>
    `,

    weapon_retribution_shield: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-retribution-shield" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 14 L48 14 C48 36, 40 50, 32 56 C24 50, 16 36, 16 14 Z" fill="#2c3e50" stroke="#f1c40f" stroke-width="2.5"/>
        <polygon points="32,24 37,36 32,44 27,36" fill="#e74c3c" stroke="#c0392b" stroke-width="1.2"/>
        <circle cx="32" cy="35" r="4.5" fill="#f39c12"/>
      </svg>
    `,

    weapon_eldritch_tome: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-eldritch-tome" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 12 L44 12 C48 12, 52 16, 52 20 L52 52 C52 52, 46 50, 42 50 L14 50 Z" fill="#2c0438" stroke="#8854d0" stroke-width="2"/>
        <path d="M22 31 C26 23, 38 23, 42 31 C38 39, 26 39, 22 31 Z" fill="#f5f6fa" stroke="#38ada9" stroke-width="1.8"/>
        <ellipse cx="32" cy="31" rx="3.5" ry="5.5" fill="#be2edd"/>
      </svg>
    `,

    weapon_penitent_whip: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-penitent-whip" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="52" x2="22" y2="42" stroke="#5d4037" stroke-width="5" stroke-linecap="round"/>
        <path d="M22 42 C 34 32, 26 18, 40 18 C 54 18, 52 38, 44 42 C 36 46, 38 56, 50 56" fill="none" stroke="#800000" stroke-width="3" stroke-linecap="round"/>
        <polygon points="34,26 38,24 35,22" fill="#bdc3c7"/>
        <polygon points="46,20 48,16 43,18" fill="#bdc3c7"/>
      </svg>
    `,

    weapon_thunder_hammer: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-thunder-hammer" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="52" x2="42" y2="24" stroke="#4a3728" stroke-width="5" stroke-linecap="round"/>
        <polygon points="36,14 48,8 56,16 44,22" fill="#718093" stroke="#2f3640" stroke-width="2"/>
        <path d="M44 11 L48 16 L44 18 L50 24" fill="none" stroke="#00d2d3" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,

    weapon_plague_flask: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-plague-flask" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 14 L36 14 L36 22 L46 44 C48 49, 44 56, 38 56 L26 56 C20 56, 16 49, 18 44 L28 22 Z" fill="rgba(39, 174, 96, 0.2)" stroke="#27ae60" stroke-width="2"/>
        <path d="M20 44 C22 52, 26 54, 32 54 C38 54, 42 52, 44 44 L36 34 L28 34 Z" fill="#2ecc71"/>
        <circle cx="28" cy="46" r="2.5" fill="#ffffff" opacity="0.8"/>
      </svg>
    `,

    weapon_viper_blowpipe: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-viper-blowpipe" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="52" x2="52" y2="12" stroke="#10ac84" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M16 48 Q 24 38 28 36 Q 36 32 40 24" fill="none" stroke="#1dd1a1" stroke-width="2"/>
        <line x1="52" y1="12" x2="60" y2="4" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,

    weapon_celestial_glaive: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-celestial-glaive" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="52" x2="40" y2="24" stroke="#485460" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M34 30 C 48 24, 60 10, 56 6 C 46 16, 36 18, 30 24 Z" fill="#4bcffa" stroke="#0fbcf9" stroke-width="1.8"/>
        <circle cx="46" cy="14" r="2.5" fill="#ffffff"/>
      </svg>
    `,

    weapon_frost_lance: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-frost-lance" xmlns="http://www.w3.org/2000/svg">
        <polygon points="58,6 44,22 40,36 36,40 22,44 6,58 20,42 24,38 38,24" fill="#00d2d3" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="58" y1="6" x2="6" y2="58" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    `,

    // ==========================================
    // 3. FUSÕES E ASCENSÕES SUPREMAS
    // ==========================================
    synergy_divine_crusader: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="27" fill="none" stroke="#f1c40f" stroke-width="2" stroke-dasharray="6 3"/>
        <line x1="32" y1="8" x2="32" y2="56" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <line x1="18" y1="24" x2="46" y2="24" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/>
        <circle cx="32" cy="24" r="4" fill="#e74c3c"/>
      </svg>
    `,

    synergy_ballistic_storm: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 50 L50 14" stroke="#e67e22" stroke-width="4" stroke-linecap="round"/>
        <polygon points="56,8 44,14 50,20" fill="#f39c12"/>
        <polygon points="48,16 36,22 42,28" fill="#e74c3c"/>
      </svg>
    `,

    synergy_purgatory_flame: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 36 C16 52, 48 52, 48 36 Z" fill="#c0392b" stroke="#781005" stroke-width="2"/>
        <path d="M32 8 C38 18, 48 20, 44 34 C36 34, 34 26, 32 20 C30 26, 28 34, 20 34 C16 20, 26 18, 32 8 Z" fill="#f39c12" stroke="#f1c40f" stroke-width="1.5"/>
      </svg>
    `,

    synergy_bloodstorm_reaper: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 24 C28 8, 52 14, 52 32 C52 48, 28 54, 12 38" fill="none" stroke="#c0392b" stroke-width="3.5" stroke-linecap="round"/>
        <polygon points="54,26 48,34 56,34" fill="#e74c3c"/>
      </svg>
    `,

    synergy_solar_judgment: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="24" fill="none" stroke="#f1c40f" stroke-width="3"/>
        <path d="M32 14 L36 28 L50 32 L36 36 L32 50 L28 36 L14 32 L28 28 Z" fill="#ffffff" stroke="#f39c12" stroke-width="1.5"/>
      </svg>
    `,

    synergy_abyssal_grimoire: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="14" width="32" height="38" rx="3" fill="#2c003e" stroke="#be2edd" stroke-width="2.5"/>
        <circle cx="32" cy="33" r="7" fill="#130f40" stroke="#be2edd" stroke-width="2"/>
        <circle cx="32" cy="33" r="3" fill="#00d2d3"/>
      </svg>
    `,

    synergy_bloodseeker_dance: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 50 Q 32 10 50 50" fill="none" stroke="#e74c3c" stroke-width="3"/>
        <polygon points="48,16 38,24 44,28" fill="#c0392b"/>
      </svg>
    `,

    synergy_cataclysm_wrath: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <line x1="16" y1="48" x2="48" y2="16" stroke="#2c3e50" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M30 14 L38 22 L32 26 L42 34" fill="none" stroke="#f39c12" stroke-width="3"/>
      </svg>
    `,

    synergy_toxic_apocalypse: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="22" fill="#1b2a1a" stroke="#2ed573" stroke-width="2.5"/>
        <circle cx="26" cy="28" r="3" fill="#2ed573"/>
        <circle cx="38" cy="28" r="3" fill="#2ed573"/>
      </svg>
    `,

    synergy_cosmic_frost_tempest: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-synergy" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,6 36,24 54,24 40,34 46,52 32,42 18,52 24,34 10,24 28,24" fill="#00d2d3" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    `,

    // ==========================================
    // 4. MELHORIAS E PASSIVAS
    // ==========================================
    passive_armor: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-armor" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10 L42 10 L48 20 L44 48 C44 54, 38 58, 32 58 C26 58, 20 54, 20 48 L16 20 Z" fill="#718093" stroke="#2f3640" stroke-width="2"/>
        <line x1="32" y1="12" x2="32" y2="56" stroke="#2f3640" stroke-width="2"/>
        <path d="M22 26 C28 30, 36 30, 42 26" fill="none" stroke="#bdc3c7" stroke-width="1.5"/>
      </svg>
    `,

    passive_speed: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boots" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 16 L34 16 L34 36 L48 44 C50 46, 50 50, 46 52 L22 52 C20 52, 20 44, 22 36 Z" fill="#573818" stroke="#2a1705" stroke-width="2"/>
        <path d="M22 22 C14 16, 12 28, 10 34 C16 32, 20 30, 24 30 Z" fill="#f1c40f" stroke="#b7791f" stroke-width="1.2"/>
      </svg>
    `,

    passive_maxhp: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-hp" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 56 C16 44, 8 32, 8 20 C8 12, 14 6, 22 6 C28 6, 31 10, 32 12 C33 10, 36 6, 42 6 C50 6, 56 12, 56 20 C56 32, 48 44, 32 56 Z" fill="#c0392b" stroke="#781005" stroke-width="2"/>
        <path d="M22 10 C18 10, 14 14, 14 18" fill="none" stroke="#ff7675" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,

    passive_magnet: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-magnet" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 42 L18 24 C18 14, 46 14, 46 24 L46 42 L38 42 L38 24 C38 20, 26 20, 26 24 L26 42 Z" fill="#eb4d4b" stroke="#30336b" stroke-width="2"/>
        <rect x="18" y="36" width="8" height="8" fill="#dcdde1" stroke="#30336b" stroke-width="1.2"/>
        <rect x="38" y="36" width="8" height="8" fill="#dcdde1" stroke="#30336b" stroke-width="1.2"/>
        <polygon points="32,54 36,60 32,62 28,60" fill="#6ab04c"/>
      </svg>
    `,

    passive_regen: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-spinach" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 18 L42 18 L46 30 L38 56 L26 56 L18 30 Z" fill="#990000" stroke="#f5cd79" stroke-width="2"/>
        <polygon points="32,24 38,36 32,48 26,36" fill="#f5cd79"/>
      </svg>
    `,

    passive_cooldown: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hollow-tome" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,12 46,12 36,32 46,52 18,52 28,32" fill="none" stroke="#00d2d3" stroke-width="2.5"/>
        <polygon points="23,16 41,16 32,30" fill="#00d2d3" opacity="0.6"/>
        <polygon points="32,34 38,48 26,48" fill="#54a0ff"/>
      </svg>
    `,

    passive_damage: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-damage" xmlns="http://www.w3.org/2000/svg">
        <!-- Armored Spiked Gauntlet of Titan Power -->
        <path d="M20 52 L20 32 L26 18 L38 18 L44 32 L44 52 Z" fill="#718093" stroke="#2c3e50" stroke-width="2"/>
        <line x1="26" y1="28" x2="38" y2="28" stroke="#f1c40f" stroke-width="2.5"/>
        <polygon points="24,20 28,12 32,20" fill="#f5cd79"/>
        <polygon points="32,20 36,12 40,20" fill="#f5cd79"/>
      </svg>
    `,

    passive_area: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-area" xmlns="http://www.w3.org/2000/svg">
        <!-- War Standard / Imperial Banner of Reach -->
        <line x1="18" y1="10" x2="18" y2="54" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
        <polygon points="18,12 48,22 18,34" fill="#e74c3c" stroke="#c0392b" stroke-width="1.8"/>
        <polygon points="18,10 22,6 18,4 14,6" fill="#f1c40f"/>
        <circle cx="28" cy="22" r="3" fill="#f1c40f"/>
      </svg>
    `,

    passive_projectiles: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-projectiles" xmlns="http://www.w3.org/2000/svg">
        <!-- Triple Prismatic Arcane Shards -->
        <polygon points="32,10 38,26 32,38 26,26" fill="#45aaf2" stroke="#2d98da" stroke-width="1.5"/>
        <polygon points="16,24 22,38 16,48 10,38" fill="#a55eea" stroke="#8854d0" stroke-width="1.5"/>
        <polygon points="48,24 54,38 48,48 42,38" fill="#2ed573" stroke="#26de81" stroke-width="1.5"/>
      </svg>
    `,

    passive_spinach: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-spinach" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 18 L42 18 L46 30 L38 56 L26 56 L18 30 Z" fill="#990000" stroke="#f5cd79" stroke-width="2"/>
        <polygon points="32,24 38,36 32,48 26,36" fill="#f5cd79"/>
      </svg>
    `,

    passive_boots: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boots" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 16 L34 16 L34 36 L48 44 C50 46, 50 50, 46 52 L22 52 C20 52, 20 44, 22 36 Z" fill="#573818" stroke="#2a1705" stroke-width="2"/>
        <path d="M22 22 C14 16, 12 28, 10 34 C16 32, 20 30, 24 30 Z" fill="#f1c40f" stroke="#b7791f" stroke-width="1.2"/>
      </svg>
    `,

    passive_crown: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-crown" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 44 L16 22 L26 32 L32 14 L38 32 L48 22 L52 44 Z" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>
        <rect x="12" y="44" width="40" height="8" rx="2" fill="#d4af37" stroke="#7a5509" stroke-width="1.5"/>
        <circle cx="32" cy="48" r="2.5" fill="#e74c3c"/>
        <circle cx="20" cy="48" r="2" fill="#2ecc71"/>
        <circle cx="44" cy="48" r="2" fill="#2ecc71"/>
      </svg>
    `,

    passive_candelabrador: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-candelabrador" xmlns="http://www.w3.org/2000/svg">
        <line x1="32" y1="20" x2="32" y2="52" stroke="#2c3e50" stroke-width="3"/>
        <path d="M18 28 C18 40, 32 40, 32 40 C32 40, 46 40, 46 28" fill="none" stroke="#2c3e50" stroke-width="2.5"/>
        <line x1="22" y1="52" x2="42" y2="52" stroke="#2c3e50" stroke-width="3" stroke-linecap="round"/>
        <rect x="16" y="24" width="4" height="8" fill="#f5f6fa"/>
        <rect x="30" y="16" width="4" height="8" fill="#f5f6fa"/>
        <rect x="44" y="24" width="4" height="8" fill="#f5f6fa"/>
        <path d="M18 18 C19 22, 17 23, 18 24 C19 23, 17 22, 18 18 Z" fill="#f39c12"/>
        <path d="M32 10 C33 14, 31 15, 32 16 C33 15, 31 14, 32 10 Z" fill="#f39c12"/>
        <path d="M46 18 C47 22, 45 23, 46 24 C47 23, 45 22, 46 18 Z" fill="#f39c12"/>
      </svg>
    `,

    passive_duplicator: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-duplicator" xmlns="http://www.w3.org/2000/svg">
        <polygon points="26,12 36,24 26,38 16,24" fill="#a55eea" stroke="#4b6584" stroke-width="1.5"/>
        <polygon points="38,24 48,36 38,50 28,36" fill="#45aaf2" stroke="#4b6584" stroke-width="1.5"/>
        <line x1="16" y1="24" x2="48" y2="36" stroke="#ffffff" stroke-width="1.8"/>
      </svg>
    `,

    passive_clover: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-clover" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 32 C26 22, 18 26, 22 32 C18 38, 26 42, 32 32 Z" fill="#2ed573" stroke="#26de81" stroke-width="1.5"/>
        <path d="M32 32 C38 22, 46 26, 42 32 C46 38, 38 42, 32 32 Z" fill="#2ed573" stroke="#26de81" stroke-width="1.5"/>
        <path d="M32 32 C22 26, 26 18, 32 22 C38 18, 42 26, 32 32 Z" fill="#2ed573" stroke="#26de81" stroke-width="1.5"/>
        <path d="M32 32 C22 38, 26 46, 32 42 C38 46, 42 38, 32 32 Z" fill="#2ed573" stroke="#26de81" stroke-width="1.5"/>
        <circle cx="32" cy="32" r="3" fill="#f1c40f"/>
      </svg>
    `,

    passive_revive: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-revive" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="22" rx="7" ry="10" fill="none" stroke="#f1c40f" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="54" stroke="#f1c40f" stroke-width="4" stroke-linecap="round"/>
        <line x1="20" y1="38" x2="44" y2="38" stroke="#f1c40f" stroke-width="4" stroke-linecap="round"/>
        <circle cx="32" cy="22" r="3" fill="#ffffff"/>
      </svg>
    `,

    passive_curse: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-curse" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 28 C22 18, 42 18, 42 28 C42 42, 36 50, 32 52 C28 50, 22 42, 22 28 Z" fill="#2c0c0c" stroke="#e74c3c" stroke-width="2"/>
        <path d="M22 24 C14 14, 8 20, 10 26 C16 26, 20 24, 22 24 Z" fill="#e74c3c"/>
        <path d="M42 24 C50 14, 56 20, 54 26 C48 26, 44 24, 42 24 Z" fill="#e74c3c"/>
        <polygon points="26,28 30,30 28,32" fill="#ff7675"/>
        <polygon points="38,28 34,30 36,32" fill="#ff7675"/>
      </svg>
    `,

    passive_hyper: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hyper" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="24" fill="none" stroke="#00cec9" stroke-width="2.5" stroke-dasharray="8 4"/>
        <polygon points="32,10 40,28 34,28 42,50 24,34 30,34" fill="#00cec9" stroke="#ffffff" stroke-width="1.2"/>
      </svg>
    `,

    // Meta-upgrades specifics
    meta_reroll: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-reroll" xmlns="http://www.w3.org/2000/svg">
        <!-- Runic Dice of Destiny -->
        <rect x="16" y="16" width="32" height="32" rx="6" fill="#2c3e50" stroke="#f1c40f" stroke-width="2"/>
        <circle cx="24" cy="24" r="3" fill="#f1c40f"/>
        <circle cx="40" cy="24" r="3" fill="#f1c40f"/>
        <circle cx="32" cy="32" r="3" fill="#ffffff"/>
        <circle cx="24" cy="40" r="3" fill="#f1c40f"/>
        <circle cx="40" cy="40" r="3" fill="#f1c40f"/>
      </svg>
    `,

    // ==========================================
    // 5. INIMIGOS E BESTIÁRIO (ENEMIES & BOSSES)
    // ==========================================
    enemy_rat: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 42 C14 36, 18 24, 28 20 C38 16, 46 22, 54 32 C56 36, 48 42, 40 44 Z" fill="#4b4b4b" stroke="#1e272e" stroke-width="1.5"/>
        <polygon points="54,32 58,34 52,36" fill="#e84118"/>
        <circle cx="44" cy="27" r="2.2" fill="#e74c3c"/>
        <path d="M18 42 Q 10 40 8 48 Q 6 56 12 54" fill="none" stroke="#e84118" stroke-width="2" stroke-linecap="round"/>
        <polygon points="28,20 26,10 33,17" fill="#c23616"/>
      </svg>
    `,

    enemy_skeleton: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 28 C20 16, 44 16, 44 28 C44 38, 40 42, 38 46 L26 46 C24 42, 20 38, 20 28 Z" fill="#f5f6fa" stroke="#2f3640" stroke-width="2"/>
        <ellipse cx="27" cy="28" rx="4" ry="4.5" fill="#1e272e"/>
        <ellipse cx="37" cy="28" rx="4" ry="4.5" fill="#1e272e"/>
        <polygon points="32,34 30,38 34,38" fill="#1e272e"/>
        <line x1="28" y1="42" x2="36" y2="42" stroke="#1e272e" stroke-width="1.5"/>
      </svg>
    `,

    enemy_villager: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <line x1="16" y1="12" x2="16" y2="52" stroke="#795548" stroke-width="3" stroke-linecap="round"/>
        <path d="M10 14 L10 26 C10 30, 22 30, 22 26 L22 14" fill="none" stroke="#95a5a6" stroke-width="2"/>
        <line x1="16" y1="12" x2="16" y2="28" stroke="#95a5a6" stroke-width="2"/>
        <path d="M30 20 C30 14, 46 14, 48 24 C50 36, 44 46, 34 46 Z" fill="#636e72" stroke="#2d3436" stroke-width="2"/>
        <circle cx="40" cy="26" r="2.5" fill="#ffffff" stroke="#d63031" stroke-width="1"/>
      </svg>
    `,

    enemy_dark_knight: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 20 C18 10, 46 10, 46 20 L48 38 C48 50, 40 56, 32 60 C24 56, 16 50, 16 38 Z" fill="#1e272e" stroke="#c0392b" stroke-width="2"/>
        <polygon points="16,22 8,14 18,16" fill="#2f3640" stroke="#c0392b" stroke-width="1.2"/>
        <polygon points="48,22 56,14 46,16" fill="#2f3640" stroke="#c0392b" stroke-width="1.2"/>
        <path d="M22 30 L42 30 L40 33 L34 33 L32 46 L30 33 L24 33 Z" fill="#ff4757"/>
      </svg>
    `,

    enemy_witch: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,6 20,32 44,32" fill="#2c003e" stroke="#574b90" stroke-width="2"/>
        <ellipse cx="32" cy="32" rx="20" ry="5" fill="#13091f" stroke="#574b90" stroke-width="1.5"/>
        <rect x="28" y="27" width="8" height="5" fill="#f1c40f"/>
        <path d="M26 36 C28 42, 42 42, 38 48 C34 52, 28 50, 24 44 Z" fill="#4cd137"/>
        <circle cx="33" cy="39" r="2" fill="#8c7ae6"/>
      </svg>
    `,

    enemy_boss_executioner: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boss" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18 C20 8, 44 8, 44 18 L46 44 C46 54, 40 58, 32 60 C24 58, 18 54, 18 44 Z" fill="#800000" stroke="#2c0505" stroke-width="2"/>
        <polygon points="25,28 30,28 29,31 24,31" fill="#000000"/>
        <polygon points="39,28 34,28 35,31 40,31" fill="#000000"/>
        <polygon points="6,12 18,8 24,24 10,26" fill="#718093" stroke="#2c3e50" stroke-width="1.8"/>
      </svg>
    `,

    enemy_boss_golem: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boss" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,12 44,12 50,30 46,54 18,54 14,30" fill="#4b6584" stroke="#1e272e" stroke-width="2.5"/>
        <path d="M20 12 L30 26 L26 34 L32 46" fill="none" stroke="#00d2d3" stroke-width="2.5"/>
        <rect x="22" y="26" width="6" height="4" fill="#00d2d3"/>
        <rect x="36" y="26" width="6" height="4" fill="#00d2d3"/>
      </svg>
    `,

    enemy_boss_death_baron: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boss" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 24 L22 36 L16 56 L32 58 L48 56 L42 36 L54 24 L40 28 L32 38 L24 28 Z" fill="#2c003e" stroke="#800000" stroke-width="2"/>
        <path d="M24 20 C24 12, 40 12, 40 20 C40 30, 36 36, 32 38 C28 36, 24 30, 24 20 Z" fill="#f5f6fa" stroke="#13091f" stroke-width="1.8"/>
        <polygon points="28,32 30,36 31,32" fill="#ffffff"/>
        <polygon points="36,32 34,36 33,32" fill="#ffffff"/>
        <polygon points="24,14 28,10 32,13 36,10 40,14" fill="#f1c40f" stroke="#b7791f" stroke-width="1.2"/>
      </svg>
    `,

    enemy_bat: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 34 C26 24, 10 20, 6 30 C12 36, 16 46, 26 40 L32 44 L38 40 C48 46, 52 36, 58 30 C54 20, 38 24, 32 34 Z" fill="#2f3542" stroke="#1e272e" stroke-width="2"/>
        <polygon points="29,28 27,20 31,24" fill="#e74c3c"/>
        <polygon points="35,28 37,20 33,24" fill="#e74c3c"/>
      </svg>
    `,

    enemy_guard: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-enemy" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="24" rx="20" ry="7" fill="#57606f" stroke="#2f3640" stroke-width="2"/>
        <path d="M20 24 C20 14, 44 14, 44 24 L42 42 C42 48, 22 48, 22 42 Z" fill="#2f3542" stroke="#1e272e" stroke-width="1.8"/>
        <line x1="26" y1="32" x2="38" y2="32" stroke="#e67e22" stroke-width="2"/>
      </svg>
    `,

    enemy_dragon: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boss" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 36 C10 26, 18 16, 30 14 C44 12, 54 22, 52 36 C42 36, 36 44, 26 44 C18 44, 14 40, 14 36 Z" fill="#781005" stroke="#3a0202" stroke-width="2"/>
        <path d="M26 14 C24 4, 14 6, 12 12" fill="none" stroke="#2c0505" stroke-width="3" stroke-linecap="round"/>
        <polygon points="36,24 42,22 40,26" fill="#f1c40f"/>
        <path d="M52 36 L62 32 L58 40 L64 44 L54 42 Z" fill="#e67e22" stroke="#f39c12" stroke-width="1.2"/>
      </svg>
    `,

    enemy_lich: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-boss" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 28 C20 16, 44 16, 44 28 C44 42, 38 48, 32 50 C26 48, 20 42, 20 28 Z" fill="#dcdde1" stroke="#2f3640" stroke-width="2"/>
        <ellipse cx="27" cy="30" rx="3.5" ry="4" fill="#00d2d3"/>
        <ellipse cx="37" cy="30" rx="3.5" ry="4" fill="#00d2d3"/>
        <polygon points="18,18 24,8 28,16 32,6 36,16 40,8 46,18" fill="#f1c40f" stroke="#7a5509" stroke-width="1.5"/>
      </svg>
    `,

    // ==========================================
    // 6. HUD, SISTEMA & SÍMBOLOS GERAIS
    // ==========================================
    hud_hp: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-hp" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 56 C16 44, 8 32, 8 20 C8 12, 14 6, 22 6 C28 6, 31 10, 32 12 C33 10, 36 6, 42 6 C50 6, 56 12, 56 20 C56 32, 48 44, 32 56 Z" fill="#c0392b" stroke="#781005" stroke-width="2"/>
        <path d="M22 10 C18 10, 14 14, 14 18" fill="none" stroke="#ff7675" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,

    hud_skull: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-skull" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="12" x2="52" y2="52" stroke="#718093" stroke-width="3" stroke-linecap="round"/>
        <line x1="52" y1="12" x2="12" y2="52" stroke="#718093" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 26 C22 16, 42 16, 42 26 C42 36, 38 40, 36 44 L28 44 C26 40, 22 36, 22 26 Z" fill="#f5f6fa" stroke="#2f3640" stroke-width="2"/>
        <circle cx="28" cy="27" r="3" fill="#1e272e"/>
        <circle cx="36" cy="27" r="3" fill="#1e272e"/>
        <line x1="30" y1="41" x2="34" y2="41" stroke="#1e272e" stroke-width="1.5"/>
      </svg>
    `,

    hud_timer: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-timer" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,10 44,10 36,32 44,54 20,54 28,32" fill="none" stroke="#d4af37" stroke-width="2.5"/>
        <line x1="16" y1="10" x2="48" y2="10" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
        <line x1="16" y1="54" x2="48" y2="54" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
        <polygon points="26,14 38,14 32,26" fill="#f39c12"/>
        <polygon points="32,38 36,50 28,50" fill="#f1c40f"/>
      </svg>
    `,

    hud_gold: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-gold" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="24" fill="#f1c40f" stroke="#b7791f" stroke-width="3"/>
        <circle cx="32" cy="32" r="19" fill="#f39c12" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 2"/>
        <polygon points="32,18 40,24 38,38 32,44 26,38 24,24" fill="#ffffff" opacity="0.9"/>
      </svg>
    `,

    hud_rank: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-rank" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,8 52,18 46,46 32,56 18,46 12,18" fill="#2c3e50" stroke="#f1c40f" stroke-width="2.5"/>
        <polygon points="32,24 35,32 43,32 37,37 39,45 32,40 25,45 27,37 21,32 29,32" fill="#f1c40f"/>
      </svg>
    `,

    hud_chest: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-chest" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28 C12 20, 52 20, 52 28 L52 50 L12 50 Z" fill="#5d4037" stroke="#2c140a" stroke-width="2"/>
        <line x1="12" y1="30" x2="52" y2="30" stroke="#f1c40f" stroke-width="3"/>
        <line x1="24" y1="20" x2="24" y2="50" stroke="#f1c40f" stroke-width="2"/>
        <line x1="40" y1="20" x2="40" y2="50" stroke="#f1c40f" stroke-width="2"/>
        <rect x="29" y="28" width="6" height="8" rx="1.5" fill="#f1c40f" stroke="#7a5509" stroke-width="1.2"/>
      </svg>
    `,

    hud_lock: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-lock" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 28 L22 20 C22 12, 42 12, 42 20 L42 28" fill="none" stroke="#bdc3c7" stroke-width="5" stroke-linecap="round"/>
        <rect x="16" y="28" width="32" height="26" rx="4" fill="#2d3436" stroke="#f1c40f" stroke-width="2"/>
        <circle cx="32" cy="38" r="3" fill="#f1c40f"/>
        <polygon points="31,38 33,38 34,46 30,46" fill="#f1c40f"/>
      </svg>
    `,

    hud_check: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-check" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="24" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
        <polyline points="20,32 28,40 44,22" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,

    hud_level: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-hud-level" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,6 38,22 54,22 41,32 46,48 32,38 18,48 23,32 10,22 26,22" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>
        <circle cx="32" cy="27" r="4" fill="#ffffff" opacity="0.8"/>
      </svg>
    `,

    hud_destructible: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-destructible" xmlns="http://www.w3.org/2000/svg">
        <!-- Ancient Urn / Sarcophagus Urn -->
        <path d="M24 16 L40 16 L44 26 L46 44 C46 52, 40 56, 32 56 C24 56, 18 52, 18 44 L20 26 Z" fill="#8c531b" stroke="#3e2723" stroke-width="2"/>
        <ellipse cx="32" cy="16" rx="10" ry="4" fill="#d7a15c" stroke="#3e2723" stroke-width="1.5"/>
        <line x1="26" y1="34" x2="38" y2="34" stroke="#f1c40f" stroke-width="2"/>
      </svg>
    `,

    hud_blood_altar: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-blood-altar" xmlns="http://www.w3.org/2000/svg">
        <polygon points="18,54 46,54 42,42 22,42" fill="#2d3436" stroke="#c0392b" stroke-width="2"/>
        <rect x="22" y="24" width="20" height="18" fill="#1e272e" stroke="#c0392b" stroke-width="2"/>
        <path d="M16 24 L48 24 C48 30, 42 34, 32 34 C22 34, 16 30, 16 24 Z" fill="#781005" stroke="#e74c3c" stroke-width="1.5"/>
        <circle cx="32" cy="14" r="6" fill="#e74c3c" stroke="#ff7675" stroke-width="1.5"/>
        <path d="M32 8 C30 14, 28 16, 26 18 C30 18, 34 18, 38 18 C36 16, 34 14, 32 8 Z" fill="#ff4757"/>
      </svg>
    `,

    hud_calendar: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-calendar" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="16" width="36" height="36" rx="4" fill="#2c3e50" stroke="#d4af37" stroke-width="2"/>
        <rect x="14" y="16" width="36" height="10" fill="#9b111e"/>
        <line x1="22" y1="10" x2="22" y2="18" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
        <line x1="42" y1="10" x2="42" y2="18" stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
        <polygon points="32,32 36,44 28,44" fill="#f1c40f"/>
      </svg>
    `,
    hud_tree: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-tree" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="12" r="5" fill="#f1c40f" stroke="#d4af37" stroke-width="1.5"/>
        <circle cx="16" cy="28" r="4" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
        <circle cx="48" cy="28" r="4" fill="#3498db" stroke="#2980b9" stroke-width="1.5"/>
        <circle cx="22" cy="46" r="4" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/>
        <circle cx="42" cy="46" r="4" fill="#9b59b6" stroke="#8e44ad" stroke-width="1.5"/>
        <line x1="32" y1="12" x2="16" y2="28" stroke="#f1c40f" stroke-width="2" opacity="0.8"/>
        <line x1="32" y1="12" x2="48" y2="28" stroke="#f1c40f" stroke-width="2" opacity="0.8"/>
        <line x1="16" y1="28" x2="22" y2="46" stroke="#f1c40f" stroke-width="2" opacity="0.8"/>
        <line x1="48" y1="28" x2="42" y2="46" stroke="#f1c40f" stroke-width="2" opacity="0.8"/>
        <line x1="22" y1="46" x2="32" y2="58" stroke="#d4af37" stroke-width="2.5"/>
        <line x1="42" y1="46" x2="32" y2="58" stroke="#d4af37" stroke-width="2.5"/>
        <circle cx="32" cy="58" r="3" fill="#e67e22"/>
      </svg>
    `,

    hud_keystone: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-keystone" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,4 42,14 56,14 56,28 64,32 56,36 56,50 42,50 32,60 22,50 8,50 8,36 0,32 8,28 8,14 22,14" fill="#2c2416" stroke="#f1c40f" stroke-width="2.5"/>
        <circle cx="32" cy="32" r="16" fill="#1a1005" stroke="#d4af37" stroke-width="2"/>
        <circle cx="32" cy="32" r="10" fill="#f39c12"/>
        <polygon points="32,20 35,29 44,32 35,35 32,44 29,35 20,32 29,29" fill="#ffffff" opacity="0.9"/>
      </svg>
    `,

    hud_notable: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-notable" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,8 54,32 32,56 10,32" fill="#22172b" stroke="#9b59b6" stroke-width="2.5"/>
        <circle cx="32" cy="32" r="12" fill="#3d1f54" stroke="#e056fd" stroke-width="1.8"/>
        <polygon points="32,22 35,30 42,32 35,34 32,42 29,34 22,32 29,30" fill="#f5cd79"/>
      </svg>
    `,

    hud_spark: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-spark" xmlns="http://www.w3.org/2000/svg">
        <path d="M32,4 Q32,32 4,32 Q32,32 32,60 Q32,32 60,32 Q32,32 32,4 Z" fill="#f1c40f" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="32" cy="32" r="5" fill="#ffffff"/>
      </svg>
    `,

    hud_updates: `
      <svg viewBox="0 0 64 64" class="gothic-svg icon-updates" xmlns="http://www.w3.org/2000/svg">
        <path d="M14,10 C14,6 18,6 24,6 L48,6 C52,6 54,8 54,12 L54,48 C54,54 50,56 44,56 L18,56 C14,56 12,52 12,48 L12,12 C12,10 13,10 14,10 Z" fill="#241c12" stroke="#d4af37" stroke-width="2"/>
        <line x1="20" y1="15" x2="44" y2="15" stroke="#f1c40f" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="20" y1="23" x2="40" y2="23" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
        <line x1="20" y1="31" x2="42" y2="31" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
        <line x1="20" y1="39" x2="32" y2="39" stroke="#d4af37" stroke-width="2" stroke-linecap="round"/>
        <circle cx="44" cy="45" r="7" fill="#b33939" stroke="#ff5252" stroke-width="1.5"/>
        <polygon points="44,41 45.5,44 48.5,45 45.5,46 44,49 42.5,46 39.5,45 42.5,44" fill="#f1c40f"/>
      </svg>
    `
  };

  // Canonical mapping dictionary from names, ids, or old emojis to new SVG keys
  const ALIAS_MAP = {
    // Classes
    'knight': 'class_knight',
    'ranger': 'class_ranger',
    'pyromancer': 'class_pyromancer',
    'paladin': 'class_paladin',
    'berserker': 'class_berserker',
    'necromancer': 'class_necromancer',
    'assassin': 'class_assassin',
    'dark_knight': 'class_dark_knight',
    'plague_alchemist': 'class_plague_alchemist',

    // Weapons
    'broadsword': 'weapon_broadsword',
    'crossbow': 'weapon_crossbow',
    'holy_fire': 'weapon_holy_fire',
    'holy_aura': 'weapon_holy_aura',
    'whirling_axes': 'weapon_whirling_axes',
    'spectral_orb': 'weapon_spectral_orb',
    'twin_daggers': 'weapon_twin_daggers',
    'dark_greatsword': 'weapon_dark_greatsword',
    'guardian_spear': 'weapon_guardian_spear',
    'blunderbuss': 'weapon_blunderbuss',
    'hellfire_cauldron': 'weapon_hellfire_cauldron',
    'iron_flail': 'weapon_iron_flail',
    'retribution_shield': 'weapon_retribution_shield',
    'eldritch_tome': 'weapon_eldritch_tome',
    'penitent_whip': 'weapon_penitent_whip',
    'thunder_hammer': 'weapon_thunder_hammer',
    'plague_flask': 'weapon_plague_flask',
    'viper_blowpipe': 'weapon_viper_blowpipe',
    'celestial_glaive': 'weapon_celestial_glaive',
    'frost_lance': 'weapon_frost_lance',

    // Synergies / Fusions
    'divine_crusader': 'synergy_divine_crusader',
    'ballistic_storm': 'synergy_ballistic_storm',
    'purgatory_flame': 'synergy_purgatory_flame',
    'bloodstorm_reaper': 'synergy_bloodstorm_reaper',
    'solar_judgment': 'synergy_solar_judgment',
    'abyssal_grimoire': 'synergy_abyssal_grimoire',
    'bloodseeker_dance': 'synergy_bloodseeker_dance',
    'cataclysm_wrath': 'synergy_cataclysm_wrath',
    'toxic_apocalypse': 'synergy_toxic_apocalypse',
    'cosmic_frost_tempest': 'synergy_cosmic_frost_tempest',

    // Passives
    'armor': 'passive_armor',
    'passive_armor': 'passive_armor',
    'speed': 'passive_speed',
    'passive_speed': 'passive_speed',
    'health': 'passive_maxhp',
    'passive_maxhp': 'passive_maxhp',
    'magnet': 'passive_magnet',
    'passive_magnet': 'passive_magnet',
    'regen': 'passive_regen',
    'passive_regen': 'passive_regen',
    'cooldown': 'passive_cooldown',
    'passive_cooldown': 'passive_cooldown',
    'damage': 'passive_damage',
    'strength': 'passive_damage',
    'passive_damage': 'passive_damage',
    'area': 'passive_area',
    'passive_area': 'passive_area',
    'projectiles': 'passive_projectiles',
    'passive_projectiles': 'passive_projectiles',
    'spinach': 'passive_spinach',
    'boots': 'passive_boots',
    'crown': 'passive_crown',
    'candelabrador': 'passive_candelabrador',
    'duplicator': 'passive_duplicator',
    'clover': 'passive_clover',
    'luck': 'passive_clover',
    'revive': 'passive_revive',
    'curse': 'passive_curse',
    'hyper': 'passive_hyper',
    'reroll': 'meta_reroll',

    // Upgrades boost weapons
    'sword_boost': 'weapon_broadsword',
    'bow_boost': 'weapon_crossbow',
    'fire_boost': 'weapon_holy_fire',

    // Enemies & Bosses
    'rat': 'enemy_rat',
    'skeleton': 'enemy_skeleton',
    'villager': 'enemy_villager',
    'dark_knight_enemy': 'enemy_dark_knight',
    'witch': 'enemy_witch',
    'boss_executioner': 'enemy_boss_executioner',
    'executioner': 'enemy_boss_executioner',
    'boss_golem': 'enemy_boss_golem',
    'golem': 'enemy_boss_golem',
    'boss_death_baron': 'enemy_boss_death_baron',
    'death_baron': 'enemy_boss_death_baron',
    'bat': 'enemy_bat',
    'guard': 'enemy_guard',
    'dragon': 'enemy_dragon',
    'lich': 'enemy_lich',

    // Achievements
    'first_blood': 'weapon_twin_daggers',
    'executioner_slayer': 'weapon_whirling_axes',
    'golem_crusher': 'enemy_boss_golem',
    'baron_vanquisher': 'enemy_boss_death_baron',
    'sanctuary_consecration': 'weapon_holy_aura',
    'swarm_survivor': 'enemy_rat',
    'meteor_walker': 'weapon_thunder_hammer',
    'horde_100': 'hud_skull',
    'horde_500': 'weapon_broadsword',
    'horde_1000': 'hud_skull',
    'level_10': 'hud_level',
    'level_25': 'weapon_holy_fire',
    'destructor_25': 'hud_destructible',
    'speed_demon': 'passive_speed',
    'rich_mercenary': 'hud_gold',

    // HUD & System
    'hp': 'hud_hp',
    'skull': 'hud_skull',
    'kill': 'hud_skull',
    'timer': 'hud_timer',
    'gold': 'hud_gold',
    'rank': 'hud_rank',
    'chest': 'hud_chest',
    'lock': 'hud_lock',
    'check': 'hud_check',
    'level': 'hud_level',
    'blood_altar': 'hud_blood_altar',
    'altar': 'hud_blood_altar',
    'daily': 'hud_calendar',
    'calendar': 'hud_calendar',
    'tree': 'hud_tree',
    'talents': 'hud_tree',
    'skill_tree': 'hud_tree',
    'keystone': 'hud_keystone',
    'notable': 'hud_notable',
    'spark': 'hud_spark',
    'updates': 'hud_updates',
    'patch_notes': 'hud_updates',
    'changelog': 'hud_updates'
  };

  const MedievalIcons = {
    /**
     * Retrieves an SVG symbol string by key or alias.
     * If already an SVG string, returns it cleanly.
     */
    get(key, fallback = '') {
      if (!key) return fallback;
      const str = String(key).trim();
      if (str.startsWith('<svg')) return str;

      const direct = SVG_DEFS[str];
      if (direct) return direct.trim();

      const aliasKey = ALIAS_MAP[str.toLowerCase()];
      if (aliasKey && SVG_DEFS[aliasKey]) {
        return SVG_DEFS[aliasKey].trim();
      }

      // Check if it's an enemy, weapon, or passive id without prefix
      for (const prefix of ['weapon_', 'passive_', 'class_', 'enemy_', 'synergy_', 'hud_']) {
        if (SVG_DEFS[prefix + str]) {
          return SVG_DEFS[prefix + str].trim();
        }
      }

      return fallback || SVG_DEFS['weapon_broadsword'].trim();
    },

    /**
     * Renders icon in an accessible wrapper with custom sizing.
     */
    render(key, className = '', style = '') {
      const svg = this.get(key);
      return `<span class="game-icon-wrap ${className}" style="${style}">${svg}</span>`;
    },

    has(key) {
      if (!key) return false;
      const str = String(key).toLowerCase().trim();
      return !!(SVG_DEFS[str] || ALIAS_MAP[str]);
    }
  };

  window.MedievalSurvivors.Icons = MedievalIcons;
  window.MedievalIcons = MedievalIcons;

})(window);

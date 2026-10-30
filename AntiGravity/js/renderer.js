/**
 * Medieval Survivors - 3D WebGL Game Renderer (Three.js)
 * Full 3D Isometric Engine with Dynamic Lighting, Procedural Generative Maps, and 3D Characters.
 */

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.overlayCanvas = document.getElementById('overlay-canvas');
    if (!this.overlayCanvas) {
      this.overlayCanvas = document.createElement('canvas');
      this.overlayCanvas.id = 'overlay-canvas';
      this.overlayCanvas.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2;';
      this.canvas.parentNode.insertBefore(this.overlayCanvas, this.canvas.nextSibling);
    }
    this.ctx = this.overlayCanvas.getContext('2d');

    const THREE = window.THREE;
    this.THREE = THREE;

    // 1. Setup Three.js Scene, Camera, and WebGL Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 10, 2500);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 2. Camera setup: Isometric angled top-down
    this.camElevation = 320;
    this.camDistance = 210;
    this.camX = 0;
    this.camY = 0;
    this.targetCamX = 0;
    this.targetCamY = 0;

    // Camera shake
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    // 3. Dynamic Scene Lighting
    this.ambientLight = new THREE.AmbientLight(0x3d354a, 0.7);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x9fa8da, 0.85);
    this.dirLight.position.set(150, 400, 200);
    this.scene.add(this.dirLight);

    // Player Torchlight (Flickering golden point light attached to hero)
    this.playerLight = new THREE.PointLight(0xffb74d, 1.4, 220, 1.6);
    this.playerLight.position.set(0, 20, 0);
    this.scene.add(this.playerLight);

    // 4. Fog
    this.scene.fog = new THREE.FogExp2(0x090710, 0.0016);

    // 5. Generative 3D Map
    this.map3D = new window.MedievalSurvivors.GenerativeMap3D(this.scene);

    // 6. Object Tracking Maps for 3D meshes
    this.playerMesh = null;
    this.currentPlayerClass = null;
    this.enemyMeshMap = new Map(); // enemyId -> THREE.Group
    this.allyMeshMap = new Map();  // ally -> THREE.Group
    this.gemMeshMap = new Map();   // gem -> THREE.Group
    this.chestMeshMap = new Map(); // chest -> THREE.Group
    this.projectileMeshMap = new Map(); // projectile -> THREE.Group
    this.holyAuraMesh = null;
    this.holyFirePoolsMap = new Map();

    // 7. Raycaster for Mouse Aim in 3D ground plane
    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.planeIntersection = new THREE.Vector3();

    // 8. 3D Particles
    this.init3DParticles();

    // Bind resize
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.overlayCanvas.width = w;
    this.overlayCanvas.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.buildVignetteCache();
  }

  buildVignetteCache() {
    const w = this.overlayCanvas.width;
    const h = this.overlayCanvas.height;
    const grad = this.ctx.createRadialGradient(w / 2, h / 2, 140, w / 2, h / 2, Math.max(w, h) * 0.72);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
    grad.addColorStop(0.55, 'rgba(6, 4, 10, 0.35)');
    grad.addColorStop(1, 'rgba(3, 2, 6, 0.82)');
    this.vignetteGradient = grad;
  }

  // Called when starting a new run to generate a fresh random procedural map & biome
  startNewRun(game) {
    // Generate new random map with unique biome & seed
    const runInfo = this.map3D.generateNewRun();
    const biome = runInfo.biome;

    // Apply biome lighting and fog
    this.scene.fog.color.setHex(biome.fogColor);
    this.scene.fog.density = biome.fogDensity;
    this.ambientLight.color.setHex(biome.ambientColor);
    this.dirLight.color.setHex(biome.dirLightColor);
    this.dirLight.intensity = biome.dirLightIntensity;

    // Clear old tracked meshes
    this.clearMeshPools();

    // Create fresh Player 3D Mesh
    this.initPlayer3D(game.player);

    // Announce current realm in UI
    this.showRealmBanner(biome, runInfo.seed);

    return runInfo;
  }

  showRealmBanner(biome, seed) {
    let banner = document.getElementById('realm-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'realm-banner';
      banner.style.cssText = `
        position: absolute;
        top: 85px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(180deg, rgba(22, 16, 32, 0.95), rgba(10, 7, 16, 0.95));
        border: 2px solid #f0c05a;
        box-shadow: 0 0 25px rgba(240, 192, 90, 0.4), inset 0 0 15px rgba(0,0,0,0.8);
        border-radius: 8px;
        padding: 12px 28px;
        text-align: center;
        z-index: 100;
        pointer-events: none;
        transition: opacity 1.2s ease, transform 1.2s ease;
      `;
      const container = document.getElementById('game-container') || document.body;
      container.appendChild(banner);
    }

    banner.innerHTML = `
      <div style="font-size: 0.85rem; color: #f0c05a; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
        ${biome.icon} REINO GERADO ALEATORIAMENTE
      </div>
      <div style="font-size: 1.4rem; color: #fff; font-weight: 900; margin: 3px 0; font-family: 'Cinzel', serif; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
        ${biome.name}
      </div>
      <div style="font-size: 0.82rem; color: #b8a68d; font-style: italic;">
        ${biome.subtitle} • Semente: #${seed}
      </div>
    `;

    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';

    // Fade out after 5.5 seconds
    if (this._bannerTimeout) clearTimeout(this._bannerTimeout);
    this._bannerTimeout = setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(-15px)';
    }, 5500);
  }

  clearMeshPools() {
    for (let [, mesh] of this.enemyMeshMap) this.scene.remove(mesh);
    this.enemyMeshMap.clear();

    for (let [, mesh] of this.allyMeshMap) this.scene.remove(mesh);
    this.allyMeshMap.clear();

    for (let [, mesh] of this.gemMeshMap) this.scene.remove(mesh);
    this.gemMeshMap.clear();

    for (let [, mesh] of this.chestMeshMap) this.scene.remove(mesh);
    this.chestMeshMap.clear();

    for (let [, mesh] of this.projectileMeshMap) this.scene.remove(mesh);
    this.projectileMeshMap.clear();

    for (let [, mesh] of this.holyFirePoolsMap) this.scene.remove(mesh);
    this.holyFirePoolsMap.clear();

    if (this.holyAuraMesh) {
      this.scene.remove(this.holyAuraMesh);
      this.holyAuraMesh = null;
    }

    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
      this.playerMesh = null;
    }
  }

  initPlayer3D(player) {
    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
    }
    const classId = player.classDef ? player.classDef.id : 'knight';
    this.currentPlayerClass = classId;
    this.playerMesh = window.MedievalSurvivors.models3d.createPlayerModel(classId);
    this.scene.add(this.playerMesh);
  }

  triggerShake(intensity = 6, duration = 0.25) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  // 3D Particles system (hit sparks, embers, soul dust)
  init3DParticles() {
    const THREE = this.THREE;
    this.maxParticles = 600;
    this.particlePositions = new Float32Array(this.maxParticles * 3);
    this.particleColors = new Float32Array(this.maxParticles * 3);
    this.particleSizes = new Float32Array(this.maxParticles);
    this.particlesData = [];

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    // Circle texture for smooth particles
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pctx = pCanvas.getContext('2d');
    const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pctx.fillStyle = grad;
    pctx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 6,
      map: pTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particleSystem);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particlesData.push({
        alive: false,
        vx: 0, vy: 0, vz: 0,
        life: 0, maxLife: 1
      });
      this.particlePositions[i * 3] = 0;
      this.particlePositions[i * 3 + 1] = -1000;
      this.particlePositions[i * 3 + 2] = 0;
    }
  }

  spawn3DParticle(x, y, z, colorHex, count = 1, speed = 25) {
    const THREE = this.THREE;
    const color = new THREE.Color(colorHex);

    for (let c = 0; c < count; c++) {
      // Find inactive particle slot
      let slot = -1;
      for (let i = 0; i < this.maxParticles; i++) {
        if (!this.particlesData[i].alive) {
          slot = i;
          break;
        }
      }
      if (slot === -1) slot = Math.floor(Math.random() * this.maxParticles);

      const p = this.particlesData[slot];
      p.alive = true;
      p.life = 0;
      p.maxLife = 0.35 + Math.random() * 0.45;

      const angle = Math.random() * Math.PI * 2;
      const spd = speed * (0.4 + Math.random() * 0.9);
      p.vx = Math.cos(angle) * spd;
      p.vy = 12 + Math.random() * 20;
      p.vz = Math.sin(angle) * spd;

      const i3 = slot * 3;
      this.particlePositions[i3] = x;
      this.particlePositions[i3 + 1] = y;
      this.particlePositions[i3 + 2] = z;

      this.particleColors[i3] = color.r;
      this.particleColors[i3 + 1] = color.g;
      this.particleColors[i3 + 2] = color.b;
    }
  }

  update3DParticles(dt) {
    let needsUpdate = false;
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particlesData[i];
      if (!p.alive) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.alive = false;
        this.particlePositions[i * 3 + 1] = -1000;
        needsUpdate = true;
        continue;
      }

      // Physics
      p.vy -= 40 * dt; // gravity
      this.particlePositions[i * 3] += p.vx * dt;
      this.particlePositions[i * 3 + 1] += p.vy * dt;
      this.particlePositions[i * 3 + 2] += p.vz * dt;
      needsUpdate = true;
    }

    if (needsUpdate) {
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
      this.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
  }

  // Accurate 3D Ground Plane Mouse Raycasting
  getMouseWorldPosition(screenX, screenY) {
    this.mouseNDC.x = (screenX / window.innerWidth) * 2 - 1;
    this.mouseNDC.y = -(screenY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);

    const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersection);
    if (hit) {
      return { x: hit.x, y: hit.z };
    }
    return null;
  }

  // Camera compatibility properties for 2D scripts
  get cameraX() {
    return this.camX - this.canvas.width / 2;
  }
  get cameraY() {
    return this.camY - this.canvas.height / 2;
  }

  updateCamera(player, dt) {
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
    }

    let shakeX = 0;
    let shakeZ = 0;
    if (this.shakeDuration > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2.2;
      shakeZ = (Math.random() - 0.5) * this.shakeIntensity * 2.2;
    }

    // Smooth camera tracking
    this.targetCamX = player.x;
    this.targetCamY = player.y;

    this.camX += (this.targetCamX - this.camX) * Math.min(1, dt * 8);
    this.camY += (this.targetCamY - this.camY) * Math.min(1, dt * 8);

    const cx = this.camX + shakeX;
    const cz = this.camY + shakeZ;

    // Position camera at isometric angle above and behind player
    this.camera.position.set(cx, this.camElevation, cz + this.camDistance);
    this.camera.lookAt(cx, 0, cz);

    // Update player torchlight position
    this.playerLight.position.set(player.x, 18, player.y);
    this.playerLight.intensity = 1.35 + Math.sin(Date.now() / 90) * 0.18;
  }

  // Main Render Frame
  render(game) {
    const player = game.player;
    if (!player) return;

    const dt = 0.016; // approximate delta

    // 1. Update 3D Camera
    this.updateCamera(player, dt);

    // 2. Update Generative Map Chunks around Player
    this.map3D.update(player.x, player.y);

    // 3. Update Player 3D Mesh
    this.updatePlayerMesh(player, dt);

    // 4. Update Enemy 3D Meshes
    this.updateEnemies(game.enemies, dt);

    // 4.5. Update Allied Minion 3D Meshes (Necromancer minions)
    this.updateAllies(game.allies, dt);

    // 5. Update XP Gems 3D Meshes
    this.updateGems(game.gems, dt);

    // 6. Update Chests 3D Meshes
    this.updateChests(game.chests, dt);

    // 7. Update Projectiles & Weapon Visuals (Bolts, Axes, Flasks, Aura, Slashes)
    this.updateProjectiles(game, dt);

    // 8. Update 3D Particles
    this.update3DParticles(dt);

    // 9. Render Three.js 3D Scene
    this.renderer.render(this.scene, this.camera);

    // 10. Render 2D Overlay (Floating Damage Numbers, Boss Indicators, Atmospheric Vignette)
    this.renderOverlay(game);
  }

  updatePlayerMesh(player, dt) {
    if (!this.playerMesh || (player.classDef && player.classDef.id !== this.currentPlayerClass)) {
      this.initPlayer3D(player);
    }
    this.playerMesh.position.set(player.x, 0, player.y);
    if (this.playerMesh.updateVisuals) {
      this.playerMesh.updateVisuals(dt, player);
    }
  }

  updateEnemies(enemies, dt) {
    const activeEnemyIds = new Set();

    for (let i = 0, len = enemies.length; i < len; i++) {
      const e = enemies[i];
      if (!e.alive) continue;

      activeEnemyIds.add(e.id);
      let mesh = this.enemyMeshMap.get(e.id);

      if (!mesh) {
        mesh = window.MedievalSurvivors.models3d.createEnemyModel(e);
        this.scene.add(mesh);
        this.enemyMeshMap.set(e.id, mesh);
      }

      mesh.position.set(e.x, 0, e.y);
      if (mesh.updateVisuals) {
        mesh.updateVisuals(dt, e);
      }
    }

    // Clean up dead/despawned enemies
    for (const [id, mesh] of this.enemyMeshMap.entries()) {
      if (!activeEnemyIds.has(id)) {
        // Spawn death blood/soul particles at enemy position
        this.spawn3DParticle(mesh.position.x, 10, mesh.position.z, 0xa81923, 6, 30);
        this.scene.remove(mesh);
        this.enemyMeshMap.delete(id);
      }
    }
  }

  updateAllies(allies, dt) {
    if (!allies) return;
    const activeAllies = new Set();

    for (let i = 0, len = allies.length; i < len; i++) {
      const a = allies[i];
      if (!a.alive) continue;

      activeAllies.add(a);
      let mesh = this.allyMeshMap.get(a);

      if (!mesh) {
        mesh = window.MedievalSurvivors.models3d.createAlliedMinionModel();
        this.scene.add(mesh);
        this.allyMeshMap.set(a, mesh);
      }

      mesh.position.set(a.x, 0, a.y);
      if (mesh.anim && mesh.anim.update) {
        mesh.anim.update(dt, a.speed);
      }
    }

    // Clean up expired allies
    for (const [a, mesh] of this.allyMeshMap.entries()) {
      if (!activeAllies.has(a)) {
        this.spawn3DParticle(mesh.position.x, 10, mesh.position.z, 0x9b59b6, 6, 25);
        this.scene.remove(mesh);
        this.allyMeshMap.delete(a);
      }
    }
  }

  updateGems(gems, dt) {
    const activeGems = new Set(gems);

    for (let i = 0, len = gems.length; i < len; i++) {
      const gem = gems[i];
      let mesh = this.gemMeshMap.get(gem);

      if (!mesh) {
        mesh = window.MedievalSurvivors.models3d.createGemModel(gem.value || 1);
        this.scene.add(mesh);
        this.gemMeshMap.set(gem, mesh);
      }

      mesh.position.set(gem.x, 0, gem.y);
      if (mesh.updateVisuals) {
        mesh.updateVisuals(dt);
      }
    }

    // Remove collected gems
    for (const [gem, mesh] of this.gemMeshMap.entries()) {
      if (!activeGems.has(gem)) {
        // Golden sparkling collection particle
        this.spawn3DParticle(mesh.position.x, 12, mesh.position.z, 0xf0c05a, 5, 20);
        this.scene.remove(mesh);
        this.gemMeshMap.delete(gem);
      }
    }
  }

  updateChests(chests, dt) {
    const activeChests = new Set(chests);

    for (let i = 0, len = chests.length; i < len; i++) {
      const chest = chests[i];
      let mesh = this.chestMeshMap.get(chest);

      if (!mesh) {
        mesh = window.MedievalSurvivors.models3d.createChestModel();
        this.scene.add(mesh);
        this.chestMeshMap.set(chest, mesh);
      }

      mesh.position.set(chest.x, 0, chest.y);
      if (mesh.updateVisuals) {
        mesh.updateVisuals(dt);
      }
    }

    for (const [chest, mesh] of this.chestMeshMap.entries()) {
      if (!activeChests.has(chest)) {
        this.scene.remove(mesh);
        this.chestMeshMap.delete(chest);
      }
    }
  }

  updateProjectiles(game, dt) {
    const activeProjectiles = new Set();

    // 1. Holy Aura Weapon
    const auraWep = game.player.weapons.find(w => w.id === 'holy_aura');
    if (auraWep && auraWep.level > 0) {
      if (!this.holyAuraMesh) {
        this.holyAuraMesh = window.MedievalSurvivors.models3d.createHolyAuraRingMesh(auraWep.activeRadius || 70, auraWep.level >= 8);
        this.scene.add(this.holyAuraMesh);
      }
      this.holyAuraMesh.position.set(game.player.x, 0, game.player.y);
      if (this.holyAuraMesh.updateVisuals) {
        this.holyAuraMesh.updateVisuals(dt, auraWep.activeRadius);
      }
    } else if (this.holyAuraMesh) {
      this.scene.remove(this.holyAuraMesh);
      this.holyAuraMesh = null;
    }

    // 2. Flying Player Projectiles (Crossbow bolts, Whirling Axes, Flying Holy Flasks)
    for (let i = 0, len = game.projectiles.length; i < len; i++) {
      const p = game.projectiles[i];
      if (!p.alive && p.state !== 'burning') continue;

      activeProjectiles.add(p);

      if (p.state === 'burning') {
        let poolMesh = this.holyFirePoolsMap.get(p);
        if (!poolMesh) {
          if (p.isPurgatory) {
            poolMesh = window.MedievalSurvivors.models3d.createPurgatoryFireMesh(p.radius || 55);
          } else if (p.isPlague) {
            poolMesh = window.MedievalSurvivors.models3d.createPlaguePuddleMesh(p.radius || 40, p.isEvolved);
          } else if (p.isHellfire) {
            poolMesh = window.MedievalSurvivors.models3d.createHellfireCauldronMesh(p.radius || 36, p.isEvolved);
          } else {
            poolMesh = window.MedievalSurvivors.models3d.createHolyFirePoolMesh(p.radius || 40, p.isEvolved);
          }
          this.scene.add(poolMesh);
          this.holyFirePoolsMap.set(p, poolMesh);
        }
        poolMesh.position.set(p.x, 0, p.y);
        if (poolMesh.updateVisuals) poolMesh.updateVisuals(dt);
        continue;
      }

      let pMesh = this.projectileMeshMap.get(p);
      if (!pMesh) {
        if (p.constructor && p.constructor.name === 'CrossbowBolt') {
          pMesh = window.MedievalSurvivors.models3d.createCrossbowBoltMesh(p.isEvolved);
        } else if (p.constructor && p.constructor.name === 'ThrownAxe') {
          pMesh = window.MedievalSurvivors.models3d.createThrownAxeMesh(p.isEvolved);
        } else if (p.constructor && p.constructor.name === 'SpearShockwave') {
          pMesh = window.MedievalSurvivors.models3d.createSpearShockwaveMesh(p.isEvolved);
        } else if (p.constructor && p.constructor.name === 'SpectralOrb') {
          pMesh = window.MedievalSurvivors.models3d.createSpectralOrbMesh(p.isEvolved);
        } else if (p.isArtillery) {
          pMesh = window.MedievalSurvivors.models3d.createArtilleryShellMesh();
        } else if (p.isSupremeSpear) {
          pMesh = window.MedievalSurvivors.models3d.createSupremeSpearMesh();
        } else if (p.isFlail) {
          pMesh = window.MedievalSurvivors.models3d.createFlailMesh(p.isEvolved);
        } else if (p.isPellet) {
          pMesh = window.MedievalSurvivors.models3d.createPelletMesh(p.isEvolved);
        } else if (p.isGlaive) {
          pMesh = window.MedievalSurvivors.models3d.createCelestialGlaiveMesh(p.isEvolved);
        } else if (p.isThunder) {
          pMesh = window.MedievalSurvivors.models3d.createThunderStrikeMesh(p.isEvolved);
        } else if (p.isDart) {
          pMesh = window.MedievalSurvivors.models3d.createViperDartMesh(p.isEvolved);
        } else if (p.isVortex) {
          pMesh = window.MedievalSurvivors.models3d.createVoidVortexMesh(p.radius, p.isEvolved);
        } else if (p.isIce) {
          pMesh = window.MedievalSurvivors.models3d.createFrostLanceMesh(p.isEvolved);
        } else if (p.isShield) {
          pMesh = window.MedievalSurvivors.models3d.createRetributionShieldMesh(p.isEvolved);
        } else if (p.isPlague || (p.constructor && p.constructor.name === 'PlagueFlask')) {
          pMesh = window.MedievalSurvivors.models3d.createPlagueFlaskMesh(p.isEvolved);
        } else {
          pMesh = window.MedievalSurvivors.models3d.createHolyFireFlaskMesh(p.isEvolved);
        }
        this.scene.add(pMesh);
        this.projectileMeshMap.set(p, pMesh);
      }

      const h = p.renderHeight !== undefined ? p.renderHeight : (p.isVortex ? 0.3 : (p.isThunder ? 0 : 10));
      pMesh.position.set(p.x, h, p.y);

      // 3D Realistic Weapon Orientation & Spinning
      if (p.isFlail) {
        pMesh.rotation.y += dt * 6;
        pMesh.rotation.z += dt * 4;
      } else if (p.isGlaive) {
        pMesh.rotation.y += dt * 22;
      } else if (p.isShield) {
        pMesh.rotation.y = -p.angle + Math.PI / 2;
      } else if (p.isVortex) {
        pMesh.rotation.y += dt * 3.5;
      } else if (p.constructor && p.constructor.name === 'ThrownAxe') {
        pMesh.rotation.y = -p.angle + Math.PI / 2;
        pMesh.rotation.x = p.rotation || 0;
        pMesh.rotation.z = Math.sin(p.rotation || 0) * 0.4;
      } else if (p.isPlague || (p.constructor && p.constructor.name === 'PlagueFlask')) {
        pMesh.rotation.x = (p.flightProgress || 0) * Math.PI * 6;
        pMesh.rotation.y += dt * 8;
        pMesh.rotation.z = Math.sin((p.flightProgress || 0) * Math.PI * 3) * 0.75;
      } else if (p.constructor && p.constructor.name === 'HolyFireFlask') {
        pMesh.rotation.x = (p.flightProgress || 0) * Math.PI * 5;
        pMesh.rotation.y += dt * 6;
        pMesh.rotation.z = (p.flightProgress || 0) * Math.PI * 3;
      } else if (p.constructor && p.constructor.name === 'SpectralOrb') {
        pMesh.rotation.y += dt * 3;
        pMesh.rotation.z += dt * 2;
      } else if (p.angle !== undefined) {
        pMesh.rotation.y = -p.angle + Math.PI / 2;
      } else if (p.rotation !== undefined) {
        pMesh.rotation.y = p.rotation;
        pMesh.rotation.z = p.rotation * 2;
      }
    }

    // 3. Enemy Projectiles
    for (let i = 0, len = game.enemyProjectiles.length; i < len; i++) {
      const ep = game.enemyProjectiles[i];
      if (!ep.alive) continue;

      activeProjectiles.add(ep);
      let epMesh = this.projectileMeshMap.get(ep);
      if (!epMesh) {
        epMesh = window.MedievalSurvivors.models3d.createEnemyProjectileMesh(ep.type || 'dark');
        this.scene.add(epMesh);
        this.projectileMeshMap.set(ep, epMesh);
      }
      epMesh.position.set(ep.x, 8, ep.y);
    }

    // 4. Slashes & Lashes (Broadsword, Twin Daggers, Dark Greatsword, Penitent Whip, Supremes)
    const slashWeapons = ['broadsword', 'twin_daggers', 'dark_greatsword', 'penitent_whip', 'supreme_excalibur', 'supreme_blood_dance', 'supreme_cataclysm_breaker'];
    for (let wIdx = 0; wIdx < slashWeapons.length; wIdx++) {
      const wepId = slashWeapons[wIdx];
      const wep = game.player.weapons.find(w => w.id === wepId);
      const effectsList = wep ? (wep.slashEffects || wep.lashEffects) : null;
      if (effectsList) {
        for (let i = 0; i < effectsList.length; i++) {
          const slash = effectsList[i];
          if (slash.duration > 0) {
            activeProjectiles.add(slash);
            let sMesh = this.projectileMeshMap.get(slash);
            if (!sMesh) {
              if (slash.isSupreme) {
                sMesh = window.MedievalSurvivors.models3d.createSupremeSlashMesh();
              } else if (wepId === 'twin_daggers') {
                sMesh = window.MedievalSurvivors.models3d.createDaggerSlashMesh(slash.isEvolved);
              } else if (wepId === 'dark_greatsword') {
                sMesh = window.MedievalSurvivors.models3d.createDarkSlashMesh(slash.isEvolved);
              } else if (wepId === 'penitent_whip') {
                sMesh = window.MedievalSurvivors.models3d.createWhipLashMesh(slash.isEvolved);
              } else {
                sMesh = window.MedievalSurvivors.models3d.createSwordSlashMesh(slash.isEvolved);
              }
              this.scene.add(sMesh);
              this.projectileMeshMap.set(slash, sMesh);
            }
            // Follow player position so slash stays firmly anchored to the hero!
            const posX = slash.player ? slash.player.x : slash.x;
            const posZ = slash.player ? slash.player.y : slash.y;
            sMesh.position.set(posX, 8, posZ);
            sMesh.rotation.y = -slash.angle + Math.PI / 2;
            const prog = 1 - (slash.duration / (slash.maxDuration || 0.16));
            const s = (slash.radius / 38) * (0.8 + prog * 0.25);
            sMesh.scale.set(s, s, s);

            const fade = Math.max(0, 1 - prog);
            sMesh.traverse(child => {
              if (child.isMesh && child.material) {
                if (child._baseOpacity === undefined) child._baseOpacity = child.material.opacity;
                child.material.opacity = child._baseOpacity * fade;
              }
            });
          }
        }
      }
    }

    // 5. Spear Thrusts (Guardian Spear)
    const spearWep = game.player.weapons.find(w => w.id === 'guardian_spear');
    if (spearWep && spearWep.thrustEffects) {
      for (let i = 0; i < spearWep.thrustEffects.length; i++) {
        const thrust = spearWep.thrustEffects[i];
        if (thrust.duration > 0) {
          activeProjectiles.add(thrust);
          let tMesh = this.projectileMeshMap.get(thrust);
          if (!tMesh) {
            tMesh = window.MedievalSurvivors.models3d.createSpearThrustMesh(thrust.isEvolved);
            this.scene.add(tMesh);
            this.projectileMeshMap.set(thrust, tMesh);
          }
          const posX = thrust.player ? thrust.player.x : thrust.x;
          const posZ = thrust.player ? thrust.player.y : thrust.y;
          tMesh.position.set(posX, 11, posZ);
          tMesh.rotation.y = -thrust.angle + Math.PI / 2;
          const progress = 1 - (thrust.duration / (thrust.maxDuration || 0.24));
          const forwardReach = Math.sin(progress * Math.PI) * (thrust.reach * 0.55);
          tMesh.translateZ(forwardReach);
        }
      }
    }

    // Clean up finished projectiles
    for (const [p, mesh] of this.projectileMeshMap.entries()) {
      if (!activeProjectiles.has(p)) {
        this.scene.remove(mesh);
        this.projectileMeshMap.delete(p);
      }
    }

    for (const [p, poolMesh] of this.holyFirePoolsMap.entries()) {
      if (!activeProjectiles.has(p)) {
        this.scene.remove(poolMesh);
        this.holyFirePoolsMap.delete(p);
      }
    }
  }

  // 2D Overlay Rendering (Crisp Damage Numbers, Offscreen Boss Markers, Vignette)
  renderOverlay(game) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

    const w = this.overlayCanvas.width;
    const h = this.overlayCanvas.height;

    // Helper: Project 3D world coord to 2D screen space
    const project3D = (worldX, worldZ, offsetY = 14) => {
      const vec = new this.THREE.Vector3(worldX, offsetY, worldZ);
      vec.project(this.camera);
      const sx = (vec.x * 0.5 + 0.5) * w;
      const sy = (-(vec.y * 0.5) + 0.5) * h;
      return { x: sx, y: sy, onScreen: vec.z < 1.0 };
    };

    // 1. Floating Damage Numbers
    for (let i = 0, len = game.floatingTexts.length; i < len; i++) {
      const ft = game.floatingTexts[i];
      const screenPos = project3D(ft.x, ft.y);
      if (screenPos.onScreen) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, ft.life));
        ctx.fillStyle = ft.color || '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = ft.isCritical ? 'bold 18px Cinzel, Georgia' : 'bold 14px Cinzel, Georgia';
        ctx.textAlign = 'center';
        ctx.strokeText(ft.text, screenPos.x, screenPos.y - (1 - ft.life) * 20);
        ctx.fillText(ft.text, screenPos.x, screenPos.y - (1 - ft.life) * 20);
        ctx.restore();
      }
    }

    // 2. Offscreen Boss Indicators (Red Skulls pointing towards boss danger)
    const margin = 45;
    for (let i = 0, len = game.enemies.length; i < len; i++) {
      const e = game.enemies[i];
      if (!e.isBoss || !e.alive) continue;

      const screenPos = project3D(e.x, e.y);
      const isOffscreen = screenPos.x < 0 || screenPos.x > w || screenPos.y < 0 || screenPos.y > h;

      if (isOffscreen) {
        const clampedX = Math.max(margin, Math.min(w - margin, screenPos.x));
        const clampedY = Math.max(margin, Math.min(h - margin, screenPos.y));
        const angle = Math.atan2(e.y - game.player.y, e.x - game.player.x);

        ctx.save();
        ctx.translate(clampedX, clampedY);
        ctx.rotate(angle);

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-10, -9);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-10, 9);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 12px Cinzel, Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(e.name, clampedX, clampedY - 14);
      }
    }

    // 3. Dark Gothic Vignette
    if (!this.vignetteGradient) this.buildVignetteCache();
    ctx.fillStyle = this.vignetteGradient;
    ctx.fillRect(0, 0, w, h);
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.GameRenderer = GameRenderer;

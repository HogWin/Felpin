/**
 * The Fallen Kingdom - Generative 3D Map & Procedural Environment System
 * Complete Gothic Medieval Realm Overhaul: High-Fidelity Architectural Ruins,
 * Dense Prop Scatter, Monumental Landmarks, High-Res Flagstone Pavement & Atmospheric Depth.
 */

window.MedievalSurvivors = window.MedievalSurvivors || {};

(function() {
  'use strict';

  const THREE = window.THREE;

  // Biome Presets for Procedural Generation with Expanded Gothic Prop Palettes
  const BIOMES = [
    {
      id: 'ruins',
      name: 'Ruínas de Valoria',
      subtitle: 'Antiga Cidadela dos Reis Caídos',
      icon: '🏛️',
      fogColor: 0x181324,
      fogDensity: 0.00065,
      ambientColor: 0x5a526c,
      dirLightColor: 0xc8d2ff,
      dirLightIntensity: 0.65,
      groundTones: ['#282236', '#342b44', '#1e1a2b', '#3e3450'],
      mortarColor: '#120f1b',
      landmarkProps: ['gothic_arch', 'colonnade', 'cathedral_wall', 'imperial_mausoleum', 'ancient_fountain'],
      mediumProps: ['pillar', 'broken_pillar', 'brazier', 'sarcophagus', 'wayside_shrine', 'battlefield_memorial', 'street_lamp'],
      clutterProps: ['rubble_pile', 'fallen_pillar', 'bone_pile', 'banner_post', 'tombstone']
    },
    {
      id: 'necropolis',
      name: 'Necrópole Imperial',
      subtitle: 'Catacumbas Antigas e Mausoléus Profanados',
      icon: '💀',
      fogColor: 0x06120e,
      fogDensity: 0.0008,
      ambientColor: 0x142620,
      dirLightColor: 0x6ca39a,
      dirLightIntensity: 0.32,
      groundTones: ['#0b1614', '#10201d', '#07100e', '#162824'],
      mortarColor: '#040b09',
      landmarkProps: ['imperial_mausoleum', 'graveyard_plot', 'cathedral_wall', 'gothic_arch'],
      mediumProps: ['tombstone', 'sarcophagus', 'brazier_green', 'crypt_pillar', 'gargoyle_pedestal', 'street_lamp_green', 'wayside_shrine'],
      clutterProps: ['bone_pile', 'rubble_pile', 'tombstone', 'ground_mist']
    },
    {
      id: 'forest',
      name: 'Floresta das Sombras',
      subtitle: 'Bosque Amaldiçoado pela Névoa Eterna',
      icon: '🌲',
      fogColor: 0x071107,
      fogDensity: 0.0008,
      ambientColor: 0x162615,
      dirLightColor: 0x769b78,
      dirLightIntensity: 0.30,
      groundTones: ['#0c170b', '#112210', '#071107', '#172b16'],
      mortarColor: '#040b04',
      landmarkProps: ['megalith_circle', 'colonnade', 'ancient_fountain', 'gothic_arch'],
      mediumProps: ['dead_tree', 'stone_menhir', 'fence', 'brazier', 'wayside_shrine', 'barricade', 'street_lamp'],
      clutterProps: ['rubble_pile', 'fallen_pillar', 'ground_mist', 'bone_pile']
    },
    {
      id: 'crimson',
      name: 'Fortaleza do Carrasco Carmesim',
      subtitle: 'Bastião das Sombras e Cinzas',
      icon: '🏰',
      fogColor: 0x271216,
      fogDensity: 0.0007,
      ambientColor: 0x66363c,
      dirLightColor: 0xffc2b0,
      dirLightIntensity: 0.65,
      groundTones: ['#321b1f', '#422429', '#241316', '#4e2c32'],
      mortarColor: '#170a0d',
      landmarkProps: ['gallows_gibbet', 'cathedral_wall', 'colonnade', 'gothic_arch'],
      mediumProps: ['barricade', 'brazier_red', 'altar_blood', 'bone_pile', 'crypt_pillar', 'gargoyle_pedestal', 'battlefield_memorial'],
      clutterProps: ['rubble_pile', 'banner_post', 'fallen_pillar', 'bone_pile']
    }
  ];

  // Seeded Pseudo-Random Number Generator (Mulberry32)
  function createPRNG(seed) {
    let s = seed >>> 0;
    return function() {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Global Arena Limits for Entities & Enemies
  window.MedievalSurvivors.ARENA_HALF_SIZE = 1550;
  window.MedievalSurvivors.ARENA_HALF_LIMIT = 1525;
  window.MedievalSurvivors.ARENA_HALF_LIMIT_ENEMY = 1540;

  class GenerativeMap3D {
    constructor(scene) {
      this.scene = scene;
      this.arenaSize = 3200; // Grand square arena: 3200x3200 units
      this.halfSize = 1600;
      this.arenaGroup = null;
      this.currentBiome = null;
      this.seed = 12345;
      this.prng = createPRNG(this.seed);
      this.activeTorches = [];
      this.animatedProps = [];
      this.obstacles = [];
      this._time = 0;

      // Shared Prop Geometries & Materials for high-performance instancing / cloning
      this.initSharedResources();
    }

    initSharedResources() {
      this.materials = {
        stone: new THREE.MeshStandardMaterial({ color: 0x515862, roughness: 0.85, metalness: 0.1 }),
        darkStone: new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.8 }),
        darkGothicStone: new THREE.MeshStandardMaterial({ color: 0x1b1d24, roughness: 0.75, metalness: 0.15 }),
        blackObsidian: new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.7, roughness: 0.35 }),
        gildedTrim: new THREE.MeshStandardMaterial({
          color: 0xb58b2a, metalness: 0.85, roughness: 0.3,
          emissive: 0x241804, emissiveIntensity: 0.15
        }),
        darkIron: new THREE.MeshStandardMaterial({ color: 0x1c1e22, metalness: 0.85, roughness: 0.35 }),
        iron: new THREE.MeshStandardMaterial({ color: 0x282c32, metalness: 0.8, roughness: 0.35 }),
        mossStone: new THREE.MeshStandardMaterial({ color: 0x2d3a2c, roughness: 0.9 }),
        bloodStone: new THREE.MeshStandardMaterial({ color: 0x3d1419, roughness: 0.75 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.85 }),
        charredWood: new THREE.MeshStandardMaterial({ color: 0x1e1512, roughness: 0.9 }),
        bone: new THREE.MeshStandardMaterial({ color: 0xd8cca8, roughness: 0.7 }),
        marbleWhite: new THREE.MeshStandardMaterial({ color: 0xa8a29a, roughness: 0.65 }),
        candleWax: new THREE.MeshStandardMaterial({ color: 0xdecba4, roughness: 0.55 }),
        candleFlame: new THREE.MeshBasicMaterial({ color: 0xffaa33 }),
        bannerRed: new THREE.MeshStandardMaterial({ color: 0x781218, roughness: 0.85, side: THREE.DoubleSide }),
        bannerBlue: new THREE.MeshStandardMaterial({ color: 0x162547, roughness: 0.85, side: THREE.DoubleSide }),
        bannerGold: new THREE.MeshStandardMaterial({ color: 0xc49a29, roughness: 0.75, side: THREE.DoubleSide }),
        bronze: new THREE.MeshStandardMaterial({ color: 0x6e5033, metalness: 0.75, roughness: 0.4 }),
        waterDark: new THREE.MeshStandardMaterial({ color: 0x08151f, roughness: 0.15, metalness: 0.85 }),
        waterBlood: new THREE.MeshStandardMaterial({ color: 0x28060a, roughness: 0.2, metalness: 0.75 }),
        fireGold: new THREE.MeshBasicMaterial({ color: 0xff7700 }),
        fireGreen: new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
        fireRed: new THREE.MeshBasicMaterial({ color: 0xff2222 }),
        runeGlowGreen: new THREE.MeshBasicMaterial({ color: 0x00e676, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
        runeGlowRed: new THREE.MeshBasicMaterial({ color: 0xff3344, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
        mistMat: new THREE.MeshBasicMaterial({
          color: 0x9f9ab5,
          transparent: true,
          opacity: 0.15,
          depthWrite: false,
          side: THREE.DoubleSide
        }),
        stainedGlassBlue: new THREE.MeshStandardMaterial({
          color: 0x1b4b9b,
          emissive: 0x0c2550,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          metalness: 0.1,
          transparent: true,
          opacity: 0.78,
          side: THREE.DoubleSide
        }),
        stainedGlassRed: new THREE.MeshStandardMaterial({
          color: 0x9b1b2b,
          emissive: 0x500c15,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          metalness: 0.1,
          transparent: true,
          opacity: 0.78,
          side: THREE.DoubleSide
        }),
        waterStreamMat: new THREE.MeshBasicMaterial({
          color: 0x6cd9ec,
          transparent: true,
          opacity: 0.6
        })
      };
    }

    // High-Definition Procedural Normal/Bump Relief Texture (1024x1024)
    createProceduralBumpTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Mortar channels (deep recessed black)
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, 1024, 1024);

      const rows = 12;
      const cols = 12;
      const tileW = 1024 / cols;
      const tileH = 1024 / rows;

      for (let r = 0; r < rows; r++) {
        const offsetX = (r % 2 === 1) ? tileW * 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          const x = c * tileW + offsetX + 3.5;
          const y = r * tileH + 3.5;
          const w = tileW - 7;
          const h = tileH - 7;

          // Neutral raised stone body
          ctx.fillStyle = '#9e9e9e';
          ctx.fillRect(x, y, w, h);

          // Weathered micro-grain relief
          ctx.fillStyle = '#828282';
          for (let s = 0; s < 5; s++) {
            const sx = x + 6 + ((s * 29) % (w - 12));
            const sy = y + 6 + ((s * 23) % (h - 12));
            ctx.fillRect(sx, sy, 4, 3);
          }

          // Top/Left raised bevel edge (brighter = higher relief)
          ctx.strokeStyle = '#e8e8e8';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.stroke();

          // Bottom/Right recessed shadow bevel (darker = lower relief)
          ctx.strokeStyle = '#323232';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.stroke();

          // Hairline cut fractures (recessed cuts)
          if ((c + r * 3) % 7 === 0) {
            ctx.strokeStyle = '#181818';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, y + 4);
            ctx.lineTo(x + w * 0.55, y + h * 0.45);
            ctx.lineTo(x + w * 0.75, y + h - 4);
            ctx.stroke();
          }
        }
      }

      // Cathedral rosette relief grooves
      ctx.strokeStyle = '#484848';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(512, 512, 320, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(512, 512, 180, 0, Math.PI * 2);
      ctx.stroke();

      const bumpTex = new THREE.CanvasTexture(canvas);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.repeat.set(16, 16);
      return bumpTex;
    }

    // High-Definition Procedural Gothic Cathedral Flagstone Floor Texture (1024x1024)
    createProceduralGroundTexture(biome) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      const tones = (biome && biome.groundTones && biome.groundTones.length)
        ? biome.groundTones
        : ['#282236', '#342b44', '#1e1a2b', '#3e3450'];
      const mortar = (biome && biome.mortarColor) || '#120f1b';

      // Deep dark base mortar fill
      ctx.fillStyle = mortar;
      ctx.fillRect(0, 0, 1024, 1024);

      // 12x12 Staggered medieval cathedral flagstone courses
      const rows = 12;
      const cols = 12;
      const tileW = 1024 / cols;
      const tileH = 1024 / rows;

      for (let r = 0; r < rows; r++) {
        const offsetX = (r % 2 === 1) ? tileW * 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          const x = c * tileW + offsetX + 3.5;
          const y = r * tileH + 3.5;
          const w = tileW - 7;
          const h = tileH - 7;

          const toneIndex = Math.abs(c * 17 + r * 23) % tones.length;
          ctx.fillStyle = tones[toneIndex];
          ctx.fillRect(x, y, w, h);

          // Subtle weathered stone grain texture
          const innerTone = tones[(toneIndex + 1) % tones.length];
          ctx.fillStyle = innerTone;
          ctx.fillRect(x + 5, y + 5, w - 10, h - 10);

          // Weathering speckles & micro-grain
          ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
          for (let s = 0; s < 4; s++) {
            const sx = x + 8 + ((s * 31) % (w - 16));
            const sy = y + 8 + ((s * 19) % (h - 16));
            ctx.fillRect(sx, sy, 3, 2);
          }

          // Top/Left stone bevel highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.065)';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.stroke();

          // Deep dark bottom/right shadow mortar line
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.72)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.stroke();

          // Fine hairline fracture on random stones
          if ((c + r * 3) % 7 === 0) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.38)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, y + 4);
            ctx.lineTo(x + w * 0.55, y + h * 0.45);
            ctx.lineTo(x + w * 0.75, y + h - 4);
            ctx.stroke();
          }

          // Subtle moss / lichen stain along crevices
          if ((c * 5 + r * 7) % 9 === 0) {
            ctx.fillStyle = 'rgba(34, 52, 28, 0.22)';
            ctx.fillRect(x + 2, y + 2, w * 0.35, 4);
            ctx.fillRect(x + 2, y + 2, 4, h * 0.35);
          }
        }
      }

      // Cathedral Quadrant Cross & Rosette Watermark across the center
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.045)';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(512, 512, 320, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(512, 512, 180, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric Vignette for deep medieval gothic depth
      const vignette = ctx.createRadialGradient(512, 512, 200, 512, 512, 512);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 1024, 1024);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(16, 16);
      return texture;
    }

    // Generate a fresh bounded procedural arena when a new run starts!
    generateNewRun() {
      // Clean up previous arena and lights
      this.clear();

      // Pick random seed and biome
      this.seed = Math.floor(Math.random() * 999999) + 1;
      this.prng = createPRNG(this.seed);

      const biomeIndex = Math.floor(this.prng() * BIOMES.length);
      this.currentBiome = BIOMES[biomeIndex];

      // Generate procedural ground texture dynamically for this biome
      this.groundTexture = this.createProceduralGroundTexture(this.currentBiome);
      this.groundBumpTexture = this.createProceduralBumpTexture();
      this.groundMaterial = new THREE.MeshStandardMaterial({
        map: this.groundTexture,
        bumpMap: this.groundBumpTexture,
        bumpScale: 1.35,
        roughness: 0.82,
        metalness: 0.12
      });

      // Build the complete bounded square arena
      this.buildBoundedArena();

      return {
        biome: this.currentBiome,
        seed: this.seed,
        arenaSize: this.arenaSize
      };
    }

    // Freezes object matrices to skip matrixWorld re-calculations in Three.js
    freezeMatrix(obj) {
      if (!obj) return;
      obj.matrixAutoUpdate = false;
      obj.updateMatrix();
      for (let i = 0, len = obj.children.length; i < len; i++) {
        this.freezeMatrix(obj.children[i]);
      }
    }

    buildBoundedArena() {
      this.arenaGroup = new THREE.Group();
      const rng = this.prng;
      const hs = this.halfSize; // 1600

      // 1. Single unified SQUARE ground floor with detailed flagstone texture
      const groundGeo = new THREE.PlaneGeometry(this.arenaSize, this.arenaSize, 1, 1);
      groundGeo.rotateX(-Math.PI / 2);
      const groundMesh = new THREE.Mesh(groundGeo, this.groundMaterial);
      groundMesh.position.set(0, 0, 0);
      this.freezeMatrix(groundMesh);
      this.arenaGroup.add(groundMesh);

      // Outer darkened perimeter abyss plane
      const abyssGeo = new THREE.PlaneGeometry(this.arenaSize + 1400, this.arenaSize + 1400, 1, 1);
      abyssGeo.rotateX(-Math.PI / 2);
      const abyssMat = new THREE.MeshBasicMaterial({ color: 0x030205 });
      const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
      abyssMesh.position.set(0, -0.6, 0);
      this.freezeMatrix(abyssMesh);
      this.arenaGroup.add(abyssMesh);

      // 2. High-Performance Perimeter Walls grouped into 4 cardinal sides
      this.wallNorth = new THREE.Group();
      this.wallSouth = new THREE.Group();
      this.wallWest = new THREE.Group();
      this.wallEast = new THREE.Group();
      this.towers = [];
      this.interiorProps = [];
      this.animatedProps = [];
      this.obstacles = [];

      const step = 50;
      const count = Math.floor((this.arenaSize) / step);

      for (let i = 0; i <= count; i++) {
        const offset = -hs + (i * step);

        // North Wall (Z = -hs)
        const wallN = this.createBoundaryWallPiece(this.currentBiome.id, 0, rng);
        if (wallN) {
          wallN.position.set(offset, 0, -hs);
          wallN.rotation.y = 0;
          this.freezeMatrix(wallN);
          this.wallNorth.add(wallN);
        }

        // South Wall (Z = +hs)
        const wallS = this.createBoundaryWallPiece(this.currentBiome.id, Math.PI, rng);
        if (wallS) {
          wallS.position.set(offset, 0, hs);
          wallS.rotation.y = Math.PI;
          this.freezeMatrix(wallS);
          this.wallSouth.add(wallS);
        }

        // West Wall (X = -hs)
        const wallW = this.createBoundaryWallPiece(this.currentBiome.id, -Math.PI / 2, rng);
        if (wallW) {
          wallW.position.set(-hs, 0, offset);
          wallW.rotation.y = Math.PI / 2;
          this.freezeMatrix(wallW);
          this.wallWest.add(wallW);
        }

        // East Wall (X = +hs)
        const wallE = this.createBoundaryWallPiece(this.currentBiome.id, Math.PI / 2, rng);
        if (wallE) {
          wallE.position.set(hs, 0, offset);
          wallE.rotation.y = -Math.PI / 2;
          this.freezeMatrix(wallE);
          this.wallEast.add(wallE);
        }
      }

      this.freezeMatrix(this.wallNorth);
      this.freezeMatrix(this.wallSouth);
      this.freezeMatrix(this.wallWest);
      this.freezeMatrix(this.wallEast);

      this.wallNorth.visible = false;
      this.wallSouth.visible = false;
      this.wallWest.visible = false;
      this.wallEast.visible = false;

      this.arenaGroup.add(this.wallNorth);
      this.arenaGroup.add(this.wallSouth);
      this.arenaGroup.add(this.wallWest);
      this.arenaGroup.add(this.wallEast);

      // 4 Grand Bastion Corner Towers
      const corners = [
        [-hs, -hs],
        [hs, -hs],
        [-hs, hs],
        [hs, hs]
      ];
      corners.forEach(([cx, cz]) => {
        const tower = this.createCornerTower(rng);
        tower.position.set(cx, 0, cz);
        this.freezeMatrix(tower);
        tower.visible = false;
        this.towers.push(tower);
        this.arenaGroup.add(tower);
      });

      // 3. GRAND CITADEL PLAZA (Overhauled Central Sanctuary Courtyard)
      this.buildCentralPlaza(rng);

      // 4. SECTOR-BASED PROCEDURAL GENERATION (Ensures dense, balanced distribution)
      // 16 geographic sectors across the 3200x3200 arena
      const sectorCols = 4;
      const sectorRows = 4;
      const sectorWidth = (this.arenaSize - 260) / sectorCols;
      const sectorHeight = (this.arenaSize - 260) / sectorRows;
      const startX = -hs + 130;
      const startZ = -hs + 130;

      for (let sc = 0; sc < sectorCols; sc++) {
        for (let sr = 0; sr < sectorRows; sr++) {
          const minX = startX + sc * sectorWidth;
          const maxX = minX + sectorWidth;
          const minZ = startZ + sr * sectorHeight;
          const maxZ = minZ + sectorHeight;

          // Skip spawning heavy landmarks directly in the central spawn plaza (|x| < 140 && |z| < 140)
          const isCenterSector = (sc === 1 || sc === 2) && (sr === 1 || sr === 2);

          // A. 1 Major Landmark per sector
          const landmarkType = this.currentBiome.landmarkProps[Math.floor(rng() * this.currentBiome.landmarkProps.length)];
          let lx = minX + (0.25 + rng() * 0.5) * sectorWidth;
          let lz = minZ + (0.25 + rng() * 0.5) * sectorHeight;

          if (isCenterSector && Math.abs(lx) < 160 && Math.abs(lz) < 160) {
            lx += (lx >= 0 ? 170 : -170);
            lz += (lz >= 0 ? 170 : -170);
          }

          const landmark = this.createProp(landmarkType, rng);
          if (landmark) {
            landmark.position.set(lx, 0, lz);
            landmark.rotation.y = Math.floor(rng() * 4) * (Math.PI / 2) + (rng() - 0.5) * 0.15;
            this.freezeMatrix(landmark);
            this.interiorProps.push(landmark);
            this.arenaGroup.add(landmark);

            this.registerObstacleColliders(landmarkType, lx, lz, landmark.rotation.y, 1.0);

            if (landmark._light && this.activeTorches.length < 2) {
              this.activeTorches.push(landmark._light);
            }
          }

          // B. 6 to 9 Medium Props per sector
          const mediumCount = 6 + Math.floor(rng() * 4);
          for (let m = 0; m < mediumCount; m++) {
            const medType = this.currentBiome.mediumProps[Math.floor(rng() * this.currentBiome.mediumProps.length)];
            let mx = minX + (0.1 + rng() * 0.8) * sectorWidth;
            let mz = minZ + (0.1 + rng() * 0.8) * sectorHeight;

            if (Math.abs(mx) < 140 && Math.abs(mz) < 140) {
              mx += (mx >= 0 ? 160 : -160);
              mz += (mz >= 0 ? 160 : -160);
            }

            const medProp = this.createProp(medType, rng);
            if (medProp) {
              medProp.position.set(mx, 0, mz);
              medProp.rotation.y = rng() * Math.PI * 2;
              const sc = 0.9 + rng() * 0.25;
              medProp.scale.set(sc, sc, sc);
              this.freezeMatrix(medProp);
              this.interiorProps.push(medProp);
              this.arenaGroup.add(medProp);

              this.registerObstacleColliders(medType, mx, mz, medProp.rotation.y, sc);

              if (medProp._light && this.activeTorches.length < 2) {
                this.activeTorches.push(medProp._light);
              }
            }
          }

          // C. 12 to 16 Dense Micro-Props & Clutter per sector
          const clutterCount = 12 + Math.floor(rng() * 5);
          for (let c = 0; c < clutterCount; c++) {
            const clutType = this.currentBiome.clutterProps[Math.floor(rng() * this.currentBiome.clutterProps.length)];
            let cx = minX + rng() * sectorWidth;
            let cz = minZ + rng() * sectorHeight;

            if (Math.abs(cx) < 120 && Math.abs(cz) < 120) {
              cx += (cx >= 0 ? 140 : -140);
              cz += (cz >= 0 ? 140 : -140);
            }

            const clutProp = this.createProp(clutType, rng);
            if (clutProp) {
              clutProp.position.set(cx, 0, cz);
              clutProp.rotation.y = rng() * Math.PI * 2;
              const sc = 0.8 + rng() * 0.4;
              clutProp.scale.set(sc, sc, sc);
              this.freezeMatrix(clutProp);
              this.interiorProps.push(clutProp);
              this.arenaGroup.add(clutProp);
            }
          }
        }
      }

      this.scene.add(this.arenaGroup);
    }

    // Grand Central Citadel Plaza (Replaces empty spawn center)
    buildCentralPlaza(rng) {
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const goldMat = this.materials.gildedTrim;
      const ironMat = this.materials.darkIron;

      // 1. Raised Octagonal Central Platform (y = 0.6)
      const daisGeo = new THREE.CylinderGeometry(78, 84, 1.4, 8);
      const dais = new THREE.Mesh(daisGeo, stoneMat);
      dais.position.y = 0.7;
      this.freezeMatrix(dais);
      this.interiorProps.push(dais);
      this.arenaGroup.add(dais);

      // 2. Beveled Inner Stone Ring with Golden Inlay
      const ringGeo = new THREE.RingGeometry(48, 54, 8);
      ringGeo.rotateX(-Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.position.y = 1.45;
      this.freezeMatrix(ring);
      this.interiorProps.push(ring);
      this.arenaGroup.add(ring);

      // 3. Central Royal Seal Medallion with 8-Pointed Star
      const sealGeo = new THREE.CircleGeometry(24, 8);
      sealGeo.rotateX(-Math.PI / 2);
      const seal = new THREE.Mesh(sealGeo, this.materials.blackObsidian);
      seal.position.y = 1.46;
      this.freezeMatrix(seal);
      this.interiorProps.push(seal);
      this.arenaGroup.add(seal);

      // 8-Pointed Gilded Star Inlay
      for (let s = 0; s < 4; s++) {
        const ray = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 38), goldMat);
        ray.position.y = 1.48;
        ray.rotation.y = (s / 4) * Math.PI;
        this.freezeMatrix(ray);
        this.interiorProps.push(ray);
        this.arenaGroup.add(ray);
      }

      // 4. Four Guardian Pillar Monuments with Ceremonial Braziers at diagonals
      const guardianOffsets = [
        [-90, -90], [90, -90], [-90, 90], [90, 90]
      ];
      guardianOffsets.forEach(([gx, gz], idx) => {
        const monument = new THREE.Group();
        monument.position.set(gx, 0, gz);

        // Base Plinth
        const base = new THREE.Mesh(new THREE.BoxGeometry(16, 4, 16), stoneMat);
        base.position.y = 2;
        monument.add(base);

        // Shaft
        const shaft = new THREE.Mesh(new THREE.BoxGeometry(11, 24, 11), trimMat);
        shaft.position.y = 16;
        monument.add(shaft);

        // Capital
        const capital = new THREE.Mesh(new THREE.BoxGeometry(15, 3, 15), stoneMat);
        capital.position.y = 29.5;
        monument.add(capital);

        // Ceremonial Brazier on top
        const brazier = this.createBrazier('gold', rng);
        brazier.position.y = 31;
        monument.add(brazier);

        this.freezeMatrix(monument);
        this.interiorProps.push(monument);
        this.arenaGroup.add(monument);
        this.obstacles.push({ x: gx, y: gz, radius: 14, type: 'plaza_guardian' });

        if (brazier._light && this.activeTorches.length < 2) {
          this.activeTorches.push(brazier._light);
        }
      });

      // 5. Four Stone Benches around Plaza with Carved Armrests
      const benchOffsets = [
        [0, -68, 0], [0, 68, Math.PI], [-68, 0, Math.PI / 2], [68, 0, -Math.PI / 2]
      ];
      benchOffsets.forEach(([bx, bz, rotY]) => {
        const bench = new THREE.Group();
        bench.position.set(bx, 1.4, bz);
        bench.rotation.y = rotY;

        const seat = new THREE.Mesh(new THREE.BoxGeometry(24, 2.2, 8.0), trimMat);
        seat.position.y = 3.5;
        bench.add(seat);

        // Armrests
        [-11.5, 11.5].forEach(ax => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.8, 8.4), stoneMat);
          arm.position.set(ax, 5.0, 0);
          bench.add(arm);
        });

        [-8.0, 8.0].forEach(lx => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 7.0), stoneMat);
          leg.position.set(lx, 1.75, 0);
          bench.add(leg);
        });

        this.freezeMatrix(bench);
        this.interiorProps.push(bench);
        this.arenaGroup.add(bench);
        this.obstacles.push({ x: bx, y: bz, radius: 12, type: 'plaza_bench' });
      });

      // 6. Four Heraldic Banners flanking Plaza approaches
      const bannerOffsets = [
        [-108, 0, 0], [108, 0, Math.PI], [0, -108, -Math.PI / 2], [0, 108, Math.PI / 2]
      ];
      bannerOffsets.forEach(([px, pz, rotY]) => {
        const banner = this.createHeraldicBannerPost(rng, this.currentBiome.id);
        banner.position.set(px, 0, pz);
        banner.rotation.y = rotY;
        this.freezeMatrix(banner);
        this.interiorProps.push(banner);
        this.arenaGroup.add(banner);
        this.obstacles.push({ x: px, y: pz, radius: 7, type: 'plaza_banner' });
      });
    }

    // Dynamic Frustum & Distance Culling: maintains 60 FPS across 400+ props!
    update(playerX = 0, playerZ = 0, dt = 0.016) {
      if (!this.arenaGroup) return;

      this._time += (dt || 0.016);

      // 1. Boundary walls visibility (only rendered when player approaches arena limits)
      if (this.wallNorth) this.wallNorth.visible = (playerZ <= -920);
      if (this.wallSouth) this.wallSouth.visible = (playerZ >= 920);
      if (this.wallWest) this.wallWest.visible = (playerX <= -920);
      if (this.wallEast) this.wallEast.visible = (playerX >= 920);

      // 2. Corner towers visibility (within 950 units)
      if (this.towers) {
        for (let i = 0, len = this.towers.length; i < len; i++) {
          const t = this.towers[i];
          const dx = t.position.x - playerX;
          const dz = t.position.z - playerZ;
          t.visible = (dx * dx + dz * dz) <= (950 * 950);
        }
      }

      // 3. Interior props distance culling (camera view frustum is ~600, limit 750)
      if (this.interiorProps) {
        const maxDistSq = 750 * 750;
        for (let i = 0, len = this.interiorProps.length; i < len; i++) {
          const p = this.interiorProps[i];
          const dx = p.position.x - playerX;
          const dz = p.position.z - playerZ;
          p.visible = (dx * dx + dz * dz) <= maxDistSq;
        }
      }

      // 4. Subtle environmental animations (Mist, Flames, Banners, Wind, Runes)
      if (this.animatedProps && this.animatedProps.length > 0) {
        const t = this._time;
        for (let a = 0, alen = this.animatedProps.length; a < alen; a++) {
          const ap = this.animatedProps[a];
          if (!ap.visible) continue;

          // Mist patches
          if (ap.isMist) {
            ap.rotation.y += 0.0015;
            ap.position.y = ap._baseY + Math.sin(t * 1.5 + ap._phase) * 0.25;
          }

          // Flames (braziers, sconces, lanterns, candles)
          if (ap.isFlame && ap._flameMesh) {
            const f = Math.sin(t * 15 + ap._phase) * 0.15 + Math.cos(t * 24 + ap._phase * 1.5) * 0.08;
            ap._flameMesh.scale.y = 1.0 + f;
            ap._flameMesh.scale.x = 1.0 - f * 0.35;
            ap._flameMesh.scale.z = 1.0 - f * 0.35;
            if (ap._light && ap._light.light) {
              ap._light.light.intensity = ap._light.baseIntensity * (0.88 + f * 0.8);
            }
          }

          // Heraldic banners & pennants (dynamic cloth wind kinematics)
          if (ap.isBanner && ap._clothMesh) {
            ap._clothMesh.rotation.y = Math.sin(t * 2.8 + ap._phase) * 0.16;
            ap._clothMesh.rotation.z = Math.sin(t * 3.6 + ap._phase) * 0.07;
          }

          // Swinging gibbet cage or hanging lanterns
          if (ap.isGibbet && ap._swingObj) {
            ap._swingObj.rotation.z = Math.sin(t * 1.6 + ap._phase) * 0.08;
            ap._swingObj.rotation.x = Math.cos(t * 1.2 + ap._phase) * 0.05;
          }

          // Pulsing druidic runes
          if (ap.isRunic && ap._runeMesh && ap._runeMesh.material) {
            ap._runeMesh.material.opacity = 0.55 + Math.sin(t * 2.5 + ap._phase) * 0.35;
          }

          // Water ripple
          if (ap.isWater && ap._waterMesh) {
            ap._waterMesh.rotation.z += 0.002;
          }
        }
      }
    }

    // Registers physical 2D/3D collision footprints for solid map props
    registerObstacleColliders(type, x, z, rotY = 0, scale = 1.0) {
      if (!this.obstacles) this.obstacles = [];
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);

      switch (type) {
        // --- 1. Landmark Structures ---
        case 'gothic_arch': {
          // 2 solid piers at local x = -20 and +20, rotated by rotY
          // Allows player to walk cleanly through the center opening!
          const r = 9 * scale;
          this.obstacles.push(
            { x: x - 20 * cos * scale, y: z + 20 * sin * scale, radius: r, type: 'arch_pier' },
            { x: x + 20 * cos * scale, y: z - 20 * sin * scale, radius: r, type: 'arch_pier' }
          );
          break;
        }
        case 'colonnade': {
          // 3 standing fluted columns at local x = -24, 0, 24
          const r = 8.5 * scale;
          this.obstacles.push(
            { x: x - 24 * cos * scale, y: z + 24 * sin * scale, radius: r, type: 'colonnade_col' },
            { x: x, y: z, radius: r, type: 'colonnade_col' },
            { x: x + 24 * cos * scale, y: z - 24 * sin * scale, radius: r, type: 'colonnade_col' }
          );
          break;
        }
        case 'cathedral_wall': {
          // 3 wall collider segments along length
          const r = 11 * scale;
          this.obstacles.push(
            { x: x - 18 * cos * scale, y: z + 18 * sin * scale, radius: r, type: 'cathedral_wall' },
            { x: x, y: z, radius: r, type: 'cathedral_wall' },
            { x: x + 18 * cos * scale, y: z - 18 * sin * scale, radius: r, type: 'cathedral_wall' }
          );
          break;
        }
        case 'imperial_mausoleum': {
          // Grand crypt chapel
          this.obstacles.push({ x, y: z, radius: 26 * scale, type: 'mausoleum' });
          break;
        }
        case 'ancient_fountain': {
          // Octagonal stone basin
          this.obstacles.push({ x, y: z, radius: 24 * scale, type: 'fountain' });
          break;
        }
        case 'gallows_gibbet': {
          // Raised timber scaffold
          this.obstacles.push({ x, y: z, radius: 18 * scale, type: 'gallows' });
          break;
        }
        case 'megalith_circle': {
          // Central sacrificial altar slab
          this.obstacles.push({ x, y: z, radius: 12 * scale, type: 'megalith_altar' });
          // 5 standing menhirs around the ring
          for (let i = 0; i < 5; i++) {
            const ang = rotY + (i / 5) * Math.PI * 2;
            const dist = 30 * scale;
            this.obstacles.push({
              x: x + Math.cos(ang) * dist,
              y: z + Math.sin(ang) * dist,
              radius: 7 * scale,
              type: 'megalith_stone'
            });
          }
          break;
        }
        case 'graveyard_plot': {
          // Enclosed stone curb and graves
          this.obstacles.push({ x, y: z, radius: 20 * scale, type: 'graveyard_plot' });
          break;
        }

        // --- 2. Medium Architectural & Environmental Props ---
        case 'pillar':
        case 'broken_pillar':
        case 'crypt_pillar': {
          this.obstacles.push({ x, y: z, radius: 11 * scale, type: 'pillar' });
          break;
        }
        case 'sarcophagus': {
          this.obstacles.push({ x, y: z, radius: 15 * scale, type: 'sarcophagus' });
          break;
        }
        case 'dead_tree': {
          this.obstacles.push({ x, y: z, radius: 12 * scale, type: 'dead_tree' });
          break;
        }
        case 'stone_menhir': {
          this.obstacles.push({ x, y: z, radius: 13 * scale, type: 'menhir' });
          break;
        }
        case 'gargoyle_pedestal': {
          this.obstacles.push({ x, y: z, radius: 13 * scale, type: 'gargoyle_pedestal' });
          break;
        }
        case 'wayside_shrine': {
          this.obstacles.push({ x, y: z, radius: 14 * scale, type: 'wayside_shrine' });
          break;
        }
        case 'battlefield_memorial': {
          this.obstacles.push({ x, y: z, radius: 13 * scale, type: 'battlefield_memorial' });
          break;
        }
        case 'brazier':
        case 'brazier_green':
        case 'brazier_red': {
          this.obstacles.push({ x, y: z, radius: 10 * scale, type: 'brazier' });
          break;
        }
        case 'street_lamp':
        case 'street_lamp_green': {
          this.obstacles.push({ x, y: z, radius: 9 * scale, type: 'street_lamp' });
          break;
        }
        case 'tombstone': {
          this.obstacles.push({ x, y: z, radius: 9 * scale, type: 'tombstone' });
          break;
        }
        case 'barricade':
        case 'fence': {
          this.obstacles.push({ x, y: z, radius: 15 * scale, type: 'fence' });
          break;
        }
        case 'altar_blood': {
          this.obstacles.push({ x, y: z, radius: 17 * scale, type: 'altar' });
          break;
        }
        case 'banner_post': {
          this.obstacles.push({ x, y: z, radius: 8 * scale, type: 'banner_post' });
          break;
        }

        // Clutter props (rubble_pile, bone_pile, ground_mist, fallen_pillar) are non-blocking ground scatter
        default:
          break;
      }
    }

    // Prop Dispatcher
    createProp(type, rng) {
      let prop = null;
      switch (type) {
        // Landmarks
        case 'gothic_arch':
          prop = this.createGothicArchway(rng); break;
        case 'colonnade':
          prop = this.createColonnadeRuin(rng); break;
        case 'cathedral_wall':
          prop = this.createCathedralWallRuin(rng); break;
        case 'imperial_mausoleum':
          prop = this.createImperialMausoleum(rng); break;
        case 'ancient_fountain':
          prop = this.createAncientFountain(rng); break;
        case 'gallows_gibbet':
          prop = this.createGallowsAndGibbet(rng); break;
        case 'megalith_circle':
          prop = this.createCursedMegalithCircle(rng); break;
        case 'graveyard_plot':
          prop = this.createGraveyardPlot(rng); break;

        // Medium Props
        case 'pillar':
          prop = this.createPillar(false); break;
        case 'broken_pillar':
          prop = this.createPillar(true); break;
        case 'brazier':
          prop = this.createBrazier('gold', rng); break;
        case 'brazier_green':
          prop = this.createBrazier('green', rng); break;
        case 'brazier_red':
          prop = this.createBrazier('red', rng); break;
        case 'tombstone':
          prop = this.createTombstone(rng); break;
        case 'sarcophagus':
          prop = this.createSarcophagus(); break;
        case 'dead_tree':
          prop = this.createDeadTree(rng); break;
        case 'stone_menhir':
          prop = this.createStoneMenhir(rng); break;
        case 'fence':
          prop = this.createFence(); break;
        case 'barricade':
          prop = this.createBarricade(); break;
        case 'crypt_pillar':
          prop = this.createCryptPillar(); break;
        case 'gargoyle_pedestal':
          prop = this.createGargoylePedestal(rng); break;
        case 'wayside_shrine':
          prop = this.createWaysideShrine(rng); break;
        case 'battlefield_memorial':
          prop = this.createBattlefieldMemorial(rng); break;
        case 'street_lamp':
          prop = this.createWroughtIronStreetLamp(rng, 'gold'); break;
        case 'street_lamp_green':
          prop = this.createWroughtIronStreetLamp(rng, 'green'); break;
        case 'altar_blood':
          prop = this.createAltarOfRitual(rng, 'blood'); break;

        // Micro-Props & Clutter
        case 'rubble_pile':
          prop = this.createRubblePile(rng); break;
        case 'fallen_pillar':
          prop = this.createFallenPillar(rng); break;
        case 'bone_pile':
          prop = this.createBonePile(rng); break;
        case 'banner_post':
          prop = this.createHeraldicBannerPost(rng, this.currentBiome ? this.currentBiome.id : 'ruins'); break;
        case 'ground_mist':
          prop = this.createGroundMistPatch(rng); break;

        default:
          prop = this.createPillar(true); break;
      }

      if (prop) {
        prop._propType = type;
      }
      return prop;
    }

    // =========================================================================
    // 1. MAJOR ARCHITECTURAL LANDMARKS
    // =========================================================================

    // 1.1 Monumental Gothic Archway
    createGothicArchway(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // Two Clustered Column Piers with Moulded Bases
      [-20, 20].forEach(px => {
        // Stepped Foundation & Plinth
        const base = new THREE.Mesh(new THREE.BoxGeometry(13, 3.5, 13), stoneMat);
        base.position.set(px, 1.75, 0);
        group.add(base);

        const subBase = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2.5, 10.5), trimMat);
        subBase.position.set(px, 4.5, 0);
        group.add(subBase);

        // Clustered Shafts (Center column + 4 flanking colonnettes)
        const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.2, 36, 10), trimMat);
        mainShaft.position.set(px, 23.5, 0);
        group.add(mainShaft);

        [-3.2, 3.2].forEach(ox => {
          const colonnette = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 36, 8), stoneMat);
          colonnette.position.set(px + ox, 23.5, 0);
          group.add(colonnette);
        });

        // Moulded Capital with Abacus
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 4.0, 5.0, 10), stoneMat);
        capital.position.set(px, 44.0, 0);
        group.add(capital);

        const abacus = new THREE.Mesh(new THREE.BoxGeometry(12, 2.2, 12), trimMat);
        abacus.position.set(px, 47.0, 0);
        group.add(abacus);
      });

      // Pointed Gothic Arch Ribs with Chamfered Mouldings
      const archL = new THREE.Mesh(new THREE.BoxGeometry(4.8, 24, 5.2), stoneMat);
      archL.position.set(-11, 54, 0);
      archL.rotation.z = -0.55;
      group.add(archL);

      const archR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 24, 5.2), stoneMat);
      archR.position.set(11, 54, 0);
      archR.rotation.z = 0.55;
      group.add(archR);

      // Trefoil Cusps under Arch Peak
      [-5.5, 5.5].forEach(cx => {
        const cusp = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.5, 6), trimMat);
        cusp.position.set(cx, 53, 0);
        cusp.rotation.x = Math.PI / 2;
        group.add(cusp);
      });

      // Keystone Cross at Arch Vertex
      const keystone = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.5, 6.2), trimMat);
      keystone.position.set(0, 64, 0);
      group.add(keystone);

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.0, 1.6), this.materials.gildedTrim);
      crossV.position.set(0, 64, 2.8);
      group.add(crossV);

      // Weathered Masonry Spandrels
      const spandrel = new THREE.Mesh(new THREE.BoxGeometry(22, 7.5, 4.2), stoneMat);
      spandrel.position.set(0, 60, 0);
      group.add(spandrel);

      // Hanging Iron Lantern in Archway (Animated Wind Swing & Flame)
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(0, 54, 0);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 4), ironMat);
      chain.position.y = -5;
      lanternGroup.add(chain);

      const lanternCage = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 1.8, 5.0, 6), ironMat);
      lanternCage.position.y = -11.5;
      lanternGroup.add(lanternCage);

      const lanternFlame = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 0), this.materials.fireGold);
      lanternFlame.position.y = -11.5;
      lanternGroup.add(lanternFlame);

      group.add(lanternGroup);

      group.isGibbet = true;
      group._swingObj = lanternGroup;
      group.isFlame = true;
      group._flameMesh = lanternFlame;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 1.2 Ruined Classical Colonnade
    createColonnadeRuin(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // Elevated Stepped Stylobate
      const stylobate = new THREE.Mesh(new THREE.BoxGeometry(68, 3.2, 20), stoneMat);
      stylobate.position.y = 1.6;
      group.add(stylobate);

      const stylobateStep = new THREE.Mesh(new THREE.BoxGeometry(64, 2.2, 16), trimMat);
      stylobateStep.position.y = 4.2;
      group.add(stylobateStep);

      // 3 Standing Fluted Columns
      const colX = [-24, 0, 24];
      colX.forEach((cx, idx) => {
        const height = (idx === 2) ? 22 : 38;

        const base = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.2, 3.5, 12), stoneMat);
        base.position.set(cx, 6.8, 0);
        group.add(base);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, height, 12), trimMat);
        shaft.position.set(cx, 6.8 + height / 2, 0);
        group.add(shaft);

        if (idx !== 2) {
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 3.6, 4.0, 12), stoneMat);
          cap.position.set(cx, 6.8 + height + 2.0, 0);
          group.add(cap);

          const abacus = new THREE.Mesh(new THREE.BoxGeometry(9.0, 2.0, 9.0), stoneMat);
          abacus.position.set(cx, 6.8 + height + 4.5, 0);
          group.add(abacus);
        } else {
          // Fractured top on the 3rd column
          const fracture = new THREE.Mesh(new THREE.ConeGeometry(3.6, 5.0, 6), trimMat);
          fracture.position.set(cx, 6.8 + height + 2.2, 0);
          fracture.rotation.z = 0.35;
          group.add(fracture);
        }
      });

      // Architrave Beam connecting first two columns with Dentils
      const beam = new THREE.Mesh(new THREE.BoxGeometry(36, 4.8, 7.0), stoneMat);
      beam.position.set(-12, 51.5, 0);
      group.add(beam);

      for (let d = -26; d <= 2; d += 4.5) {
        const dentil = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.2), trimMat);
        dentil.position.set(d, 49.0, 3.6);
        group.add(dentil);
      }

      // Fallen Column Drum near 3rd column
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 8.5, 12), trimMat);
      drum.position.set(22, 7.0, 6.5);
      drum.rotation.z = Math.PI / 2;
      drum.rotation.y = 0.45;
      group.add(drum);

      return group;
    }

    // 1.3 Collapsed Cathedral Wall Ruin with Lancet Window & Stained Glass
    createCathedralWallRuin(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // Heavy Wall Foundation
      const base = new THREE.Mesh(new THREE.BoxGeometry(56, 4.5, 13), stoneMat);
      base.position.y = 2.25;
      group.add(base);

      // Left Wall Pier
      const wallL = new THREE.Mesh(new THREE.BoxGeometry(18, 42, 9), stoneMat);
      wallL.position.set(-18, 24, 0);
      group.add(wallL);

      // Right Wall Pier (Crumbling lower)
      const wallR = new THREE.Mesh(new THREE.BoxGeometry(16, 28, 9), stoneMat);
      wallR.position.set(19, 17, 0);
      group.add(wallR);

      // Stepped External Flying Buttress on Left Pier
      const buttress = new THREE.Mesh(new THREE.BoxGeometry(6.5, 34, 9), trimMat);
      buttress.position.set(-26, 18, 5.5);
      group.add(buttress);

      const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(3.2, 9.0, 4), trimMat);
      pinnacle.position.set(-26, 39, 5.5);
      pinnacle.rotation.y = Math.PI / 4;
      group.add(pinnacle);

      // Lancet Window Frame Molding in center opening
      const sill = new THREE.Mesh(new THREE.BoxGeometry(20, 3.5, 8.5), trimMat);
      sill.position.set(0, 13, 0);
      group.add(sill);

      // Pointed Arch Architrave atop Window
      const archL = new THREE.Mesh(new THREE.BoxGeometry(3.8, 16, 6.5), trimMat);
      archL.position.set(-5.0, 33, 0);
      archL.rotation.z = -0.45;
      group.add(archL);

      const archR = new THREE.Mesh(new THREE.BoxGeometry(3.8, 16, 6.5), trimMat);
      archR.position.set(5.0, 33, 0);
      archR.rotation.z = 0.45;
      group.add(archR);

      // Stone Mullion in Window Center
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(1.6, 20, 2.8), trimMat);
      mullion.position.set(0, 23, 0);
      group.add(mullion);

      // Glowing Stained Glass Shards in Lancet Window
      const glassL = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 16), this.materials.stainedGlassBlue);
      glassL.position.set(-4.5, 24, 0);
      group.add(glassL);

      const glassR = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 12), this.materials.stainedGlassRed);
      glassR.position.set(4.5, 22, 0);
      group.add(glassR);

      // Iron Sconce on Wall Pier (Animated Flame)
      const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.8, 3.5), this.materials.darkIron);
      sconceArm.position.set(-15, 24, 5.2);
      group.add(sconceArm);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4.2, 5), this.materials.fireGold);
      flame.position.set(-15, 27.5, 6.2);
      group.add(flame);

      group.isFlame = true;
      group._flameMesh = flame;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 1.4 Imperial Crypt Mausoleum (Miniature Chapel Tomb)
    createImperialMausoleum(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // 1. Granite Stepped Foundation
      const foundation = new THREE.Mesh(new THREE.BoxGeometry(38, 3.5, 48), stoneMat);
      foundation.position.y = 1.75;
      group.add(foundation);

      const step = new THREE.Mesh(new THREE.BoxGeometry(20, 1.8, 8), trimMat);
      step.position.set(0, 0.9, 26);
      group.add(step);

      // 2. Main Crypt Chamber Walls
      const walls = new THREE.Mesh(new THREE.BoxGeometry(30, 24, 40), stoneMat);
      walls.position.y = 15.5;
      group.add(walls);

      // 3. Four Corner Pilasters with Pinnacle Spires
      const corners = [[-15, -20], [15, -20], [-15, 20], [15, 20]];
      corners.forEach(([cx, cz]) => {
        const pilaster = new THREE.Mesh(new THREE.BoxGeometry(4.8, 28, 4.8), trimMat);
        pilaster.position.set(cx, 17.5, cz);
        group.add(pilaster);

        const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8.5, 4), trimMat);
        pinnacle.position.set(cx, 35.5, cz);
        pinnacle.rotation.y = Math.PI / 4;
        group.add(pinnacle);
      });

      // 4. Gabled Stone Roof with Cornice Moulding
      const roofL = new THREE.Mesh(new THREE.BoxGeometry(20, 2.8, 42), trimMat);
      roofL.position.set(-8, 30.5, 0);
      roofL.rotation.z = 0.55;
      group.add(roofL);

      const roofR = new THREE.Mesh(new THREE.BoxGeometry(20, 2.8, 42), trimMat);
      roofR.position.set(8, 30.5, 0);
      roofR.rotation.z = -0.55;
      group.add(roofR);

      // Stone Cross Finial on Gable Peak
      const crossPost = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.5, 1.4), this.materials.gildedTrim);
      crossPost.position.set(0, 39.5, 19);
      group.add(crossPost);
      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.4, 1.4), this.materials.gildedTrim);
      crossBar.position.set(0, 40.5, 19);
      group.add(crossBar);

      // 5. Arched Crypt Portal with Iron Grate Portcullis
      const archPortal = new THREE.Mesh(new THREE.BoxGeometry(13, 17, 3.0), this.materials.blackObsidian);
      archPortal.position.set(0, 12, 20.5);
      group.add(archPortal);

      // Visible Sarcophagus inside crypt chamber
      const cryptSarcophagus = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.0, 12.0), this.materials.marbleWhite);
      cryptSarcophagus.position.set(0, 5.5, 14);
      group.add(cryptSarcophagus);

      // Iron Portcullis Bars
      [-4.0, -1.3, 1.3, 4.0].forEach(bx => {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 16, 4), ironMat);
        bar.position.set(bx, 11.5, 21.2);
        group.add(bar);
      });

      // Dual Entrance Torch Sconces (Animated Flames)
      [-10, 10].forEach(sx => {
        const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 2.5), ironMat);
        sconce.position.set(sx, 14, 21.5);
        group.add(sconce);

        const flame = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.5, 5), this.materials.fireGold);
        flame.position.set(sx, 17, 22.5);
        group.add(flame);
      });

      return group;
    }

    // 1.5 Ancient Gothic Fountain with Water Ripples & Lion Spouts
    createAncientFountain(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const bronzeMat = this.materials.bronze;

      // Octagonal Stepped Basin Foundation
      const base = new THREE.Mesh(new THREE.CylinderGeometry(22, 24, 2.8, 8), stoneMat);
      base.position.y = 1.4;
      group.add(base);

      // Basin Moulded Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(21, 21, 4.8, 8), trimMat);
      rim.position.y = 5.0;
      group.add(rim);

      // Reflective Water Surface
      const isCrimson = this.currentBiome && this.currentBiome.id === 'crimson';
      const waterMat = isCrimson ? this.materials.waterBlood : this.materials.waterDark;
      const water = new THREE.Mesh(new THREE.CircleGeometry(19, 12), waterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.y = 6.4;
      group.add(water);

      // Central Fluted Pedestal
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 6.5, 15, 8), stoneMat);
      pedestal.position.y = 12;
      group.add(pedestal);

      // Upper Small Basin
      const upperBasin = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 5.5, 3.8, 8), trimMat);
      upperBasin.position.y = 19.5;
      group.add(upperBasin);

      // Sculpted Bronze Lion Spouts with Falling Water Streams
      for (let s = 0; s < 4; s++) {
        const ang = (s / 4) * Math.PI * 2;
        const spout = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 3.0), bronzeMat);
        spout.position.set(Math.cos(ang) * 8.5, 19.5, Math.sin(ang) * 8.5);
        spout.rotation.y = -ang;
        group.add(spout);

        // Falling water stream jet
        const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 12, 5), this.materials.waterStreamMat);
        stream.position.set(Math.cos(ang) * 9.5, 13, Math.sin(ang) * 9.5);
        group.add(stream);
      }

      // Spire Finial atop Fountain
      const finial = new THREE.Mesh(new THREE.ConeGeometry(2.6, 7.5, 6), trimMat);
      finial.position.y = 25;
      group.add(finial);

      group.isWater = true;
      group._waterMesh = water;
      this.animatedProps.push(group);

      return group;
    }

    // 1.6 Executioner's Gallows & Hanging Gibbet Cage (Wind Sway)
    createGallowsAndGibbet(rng) {
      const group = new THREE.Group();
      const woodMat = this.materials.wood;
      const charredMat = this.materials.charredWood;
      const ironMat = this.materials.darkIron;

      // Raised Timber Scaffold Platform
      const scaffold = new THREE.Mesh(new THREE.BoxGeometry(28, 4.0, 28), woodMat);
      scaffold.position.y = 2.0;
      group.add(scaffold);

      // 4 Scaffold Legs
      const corners = [[-12, -12], [12, -12], [-12, 12], [12, 12]];
      corners.forEach(([cx, cz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.0, 3.0), charredMat);
        leg.position.set(cx, 2.0, cz);
        group.add(leg);
      });

      // Upright Heavy Timber Post
      const post = new THREE.Mesh(new THREE.BoxGeometry(3.5, 36, 3.5), charredMat);
      post.position.set(-9, 22, -9);
      group.add(post);

      // Diagonal Knee Brace
      const brace = new THREE.Mesh(new THREE.BoxGeometry(2.6, 13, 2.6), woodMat);
      brace.position.set(-5.0, 31, -9);
      brace.rotation.z = -0.78;
      group.add(brace);

      // Overhead Gallows Beam
      const arm = new THREE.Mesh(new THREE.BoxGeometry(24, 3.2, 3.2), charredMat);
      arm.position.set(2.5, 39, -9);
      group.add(arm);

      // Hanging Iron Chain & Spherical Gibbet Cage (Wind Sway kinematics)
      const gibbetGroup = new THREE.Group();
      gibbetGroup.position.set(11, 39, -9);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 14, 4), ironMat);
      chain.position.y = -7;
      gibbetGroup.add(chain);

      const cageGeo = new THREE.SphereGeometry(3.8, 8, 6);
      const cageMesh = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({
        color: 0x1b1c20, wireframe: true, metalness: 0.85, roughness: 0.35
      }));
      cageMesh.position.y = -17;
      gibbetGroup.add(cageMesh);

      // Ancient Skull inside cage
      const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), this.materials.bone);
      skull.position.y = -17;
      gibbetGroup.add(skull);

      group.add(gibbetGroup);

      group.isGibbet = true;
      group._swingObj = gibbetGroup;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 1.7 Cursed Druidic Megalith Circle (Pulsing Runes)
    createCursedMegalithCircle(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.mossStone;
      const runeMat = (this.currentBiome && this.currentBiome.id === 'crimson')
        ? this.materials.runeGlowRed
        : this.materials.runeGlowGreen;

      // Central Sacrificial Altar Slab
      const altar = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 11.5, 2.8, 8), stoneMat);
      altar.position.y = 1.4;
      group.add(altar);

      // Glowing Runic Inscription Ring on Altar
      const runeRing = new THREE.Mesh(new THREE.RingGeometry(4.5, 8.0, 8), runeMat);
      runeRing.rotation.x = -Math.PI / 2;
      runeRing.position.y = 2.85;
      group.add(runeRing);

      // 5 Upright Hexagonal Menhirs in a circle with Runes
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const rad = 30 + (rng() - 0.5) * 4;
        const menhir = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 5.2, 28, 6), stoneMat);
        menhir.position.set(Math.cos(ang) * rad, 14, Math.sin(ang) * rad);
        menhir.rotation.y = ang + (rng() - 0.5) * 0.4;
        menhir.rotation.z = (rng() - 0.5) * 0.16;
        group.add(menhir);
      }

      group.isRunic = true;
      group._runeMesh = runeRing;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 1.8 Enclosed Cemetery Graveyard Plot
    createGraveyardPlot(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // Perimeter Stone Curb (Width 40, Depth 30)
      const curbGeo = new THREE.BoxGeometry(42, 2.0, 32);
      const curb = new THREE.Mesh(curbGeo, stoneMat);
      curb.position.y = 1.0;
      group.add(curb);

      // Raised Dirt Bed inside
      const dirt = new THREE.Mesh(new THREE.BoxGeometry(38, 2.4, 28), this.materials.darkStone);
      dirt.position.y = 1.2;
      group.add(dirt);

      // 4 Corner Stone Piers with Pyramid Caps
      const corners = [[-20, -15], [20, -15], [-20, 15], [20, 15]];
      corners.forEach(([cx, cz]) => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(3.5, 10, 3.5), trimMat);
        pier.position.set(cx, 5.0, cz);
        group.add(pier);

        const cap = new THREE.Mesh(new THREE.ConeGeometry(2.5, 3.2, 4), trimMat);
        cap.position.set(cx, 11.5, cz);
        cap.rotation.y = Math.PI / 4;
        group.add(cap);
      });

      // Iron Railings connecting piers
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(38, 0.6, 0.6), ironMat);
      rail1.position.set(0, 7.5, -15);
      group.add(rail1);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(38, 0.6, 0.6), ironMat);
      rail2.position.set(0, 7.5, 15);
      group.add(rail2);

      // 2 Weathered Celtic Tombstones inside the plot
      const t1 = this.createTombstone(rng);
      t1.position.set(-9, 0, -3);
      group.add(t1);

      const t2 = this.createTombstone(rng);
      t2.position.set(9, 0, 4);
      group.add(t2);

      return group;
    }

    // =========================================================================
    // 2. MEDIUM PROPS & THEMATIC SET PIECES
    // =========================================================================

    // 2.1 Stone Wayside Shrine with Niche & Votive Candles
    createWaysideShrine(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // Stepped Plinth
      const base = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2.5, 7.5), stoneMat);
      base.position.y = 1.25;
      group.add(base);

      // Tapered Pillar Shaft
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(6.5, 16, 5.5), trimMat);
      shaft.position.y = 10.5;
      group.add(shaft);

      // Gothic Gabled Tabernacle Box
      const shrineBox = new THREE.Mesh(new THREE.BoxGeometry(8.5, 11, 7.0), stoneMat);
      shrineBox.position.y = 23.5;
      group.add(shrineBox);

      // Gabled Roof
      const roof = new THREE.Mesh(new THREE.ConeGeometry(6.5, 7.5, 4), trimMat);
      roof.position.y = 31.5;
      roof.rotation.y = Math.PI / 4;
      group.add(roof);

      // Recessed Niche
      const niche = new THREE.Mesh(new THREE.BoxGeometry(4.5, 7.0, 2.0), this.materials.blackObsidian);
      niche.position.set(0, 23.5, 2.8);
      group.add(niche);

      // Bronze Statuette inside
      const statuette = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 5.0, 6), this.materials.bronze);
      statuette.position.set(0, 23, 2.8);
      group.add(statuette);

      // Cluster of 3 Votive Wax Candles with Flickering Flames
      let leadFlame = null;
      [-2.0, 0, 2.0].forEach((cx, idx) => {
        const ch = 1.4 + (idx % 2) * 0.8;
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, ch, 6), this.materials.candleWax);
        candle.position.set(cx, 18.5 + ch / 2, 3.2);
        group.add(candle);

        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.1, 5), this.materials.candleFlame);
        flame.position.set(cx, 18.5 + ch + 0.55, 3.2);
        group.add(flame);
        if (idx === 1) leadFlame = flame;
      });

      if (leadFlame) {
        group.isFlame = true;
        group._flameMesh = leadFlame;
        group._phase = rng() * Math.PI * 2;
        this.animatedProps.push(group);
      }

      return group;
    }

    // 2.2 Battlefield Memorial (Kite Shield, Broadsword & Fluttering Pennant)
    createBattlefieldMemorial(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkStone;
      const ironMat = this.materials.iron;
      const woodMat = this.materials.wood;

      // Stone & Gravel Mound
      const mound = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 12, 2.5, 8), stoneMat);
      mound.position.y = 1.25;
      group.add(mound);

      // Heavy Chivalric Kite Shield planted upright
      const shield = new THREE.Mesh(new THREE.BoxGeometry(6.5, 10.5, 0.9), this.materials.bannerRed);
      shield.position.set(0, 5.5, 0);
      shield.rotation.y = (rng() - 0.5) * 0.35;
      shield.rotation.x = 0.12;
      group.add(shield);

      const shieldBoss = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.8, 6), this.materials.gildedTrim);
      shieldBoss.position.set(0, 6.0, 0.7);
      shieldBoss.rotation.x = Math.PI / 2;
      group.add(shieldBoss);

      // Crossed Steel-Tipped Spear with Fluttering Pennant
      const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 22, 6), woodMat);
      spear.position.set(-2.5, 9, 0);
      spear.rotation.z = -0.45;
      group.add(spear);

      const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.5, 4), ironMat);
      spearTip.position.set(-6.8, 17.5, 0);
      spearTip.rotation.z = -0.45;
      group.add(spearTip);

      const pennant = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 2.5), this.materials.bannerGold);
      pennant.position.set(-8.5, 16.5, 0);
      group.add(pennant);

      // Broadsword stuck in stone
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.9, 14, 0.3), ironMat);
      sword.position.set(3.2, 7.5, 0);
      sword.rotation.z = 0.35;
      group.add(sword);

      const crossguard = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.8), this.materials.gildedTrim);
      crossguard.position.set(5.2, 12.5, 0);
      crossguard.rotation.z = 0.35;
      group.add(crossguard);

      group.isBanner = true;
      group._clothMesh = pennant;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 2.3 Wrought-Iron Gothic Street Lamp (Animated Flame)
    createWroughtIronStreetLamp(rng, colorType = 'gold') {
      const group = new THREE.Group();
      const ironMat = this.materials.darkIron;
      const stoneMat = this.materials.darkGothicStone;

      // Octagonal Stone Base Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 5.2, 3.5, 8), stoneMat);
      plinth.position.y = 1.75;
      group.add(plinth);

      // Fluted Wrought-Iron Lamppost
      const post = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.6, 28, 8), ironMat);
      post.position.y = 17.5;
      group.add(post);

      // Scrollwork Bracket Arm
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.0, 1.0), ironMat);
      bracket.position.set(2.8, 30.5, 0);
      group.add(bracket);

      // Hexagonal Glass Lantern
      let fireMat = this.materials.fireGold;
      let lightHex = 0xff9922;
      if (colorType === 'green') {
        fireMat = this.materials.fireGreen;
        lightHex = 0x00ff88;
      }

      const lanternFrame = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 1.8, 4.5, 6), ironMat);
      lanternFrame.position.set(5.5, 27.5, 0);
      group.add(lanternFrame);

      const lanternFlame = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 0), fireMat);
      lanternFlame.position.set(5.5, 27.5, 0);
      group.add(lanternFlame);

      // Peaked Lantern Bonnet
      const bonnet = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3.0, 6), ironMat);
      bonnet.position.set(5.5, 30.5, 0);
      group.add(bonnet);

      group.isFlame = true;
      group._flameMesh = lanternFlame;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 2.4 Stone Altar of Ritual with Candles
    createAltarOfRitual(rng, type = 'gold') {
      const group = new THREE.Group();
      const stoneMat = (type === 'blood') ? this.materials.bloodStone : this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // Two-Tier Stepped Dais
      const step1 = new THREE.Mesh(new THREE.BoxGeometry(22, 2.0, 16), stoneMat);
      step1.position.y = 1.0;
      group.add(step1);

      const step2 = new THREE.Mesh(new THREE.BoxGeometry(18, 1.8, 12), trimMat);
      step2.position.y = 2.8;
      group.add(step2);

      // Heavy Altar Slab
      const table = new THREE.Mesh(new THREE.BoxGeometry(14, 5.5, 8.5), stoneMat);
      table.position.y = 6.4;
      group.add(table);

      // Draped Altar Cloth
      const clothMat = (type === 'blood') ? this.materials.bannerRed : this.materials.bannerGold;
      const cloth = new THREE.Mesh(new THREE.BoxGeometry(14.4, 1.2, 9.0), clothMat);
      cloth.position.y = 9.2;
      group.add(cloth);

      // Two Brass Candelabras with Lit Wax Candles
      [-5.5, 5.5].forEach(cx => {
        const candelabra = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.2, 4.0, 6), this.materials.bronze);
        candelabra.position.set(cx, 11.5, 0);
        group.add(candelabra);

        [-1.2, 0, 1.2].forEach(cz => {
          const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 6), this.materials.candleWax);
          candle.position.set(cx, 14.5, cz);
          group.add(candle);

          const flame = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.2, 5), this.materials.candleFlame);
          flame.position.set(cx, 16.0, cz);
          group.add(flame);
        });
      });

      // Central Ritual Skull
      const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), this.materials.bone);
      skull.position.set(0, 11.0, 0);
      group.add(skull);

      return group;
    }

    // 2.5 Heraldic Banner Post
    createHeraldicBannerPost(rng, biomeId) {
      const group = new THREE.Group();
      const ironMat = this.materials.darkIron;
      const stoneMat = this.materials.darkGothicStone;

      // Carved Stone Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.5, 6.5), stoneMat);
      base.position.y = 1.75;
      group.add(base);

      // Iron Standard Post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 32, 6), ironMat);
      post.position.y = 17.5;
      group.add(post);

      // Crossbar
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 11, 6), ironMat);
      bar.position.set(0, 31, 0);
      bar.rotation.z = Math.PI / 2;
      group.add(bar);

      // Spearhead Finial
      const spearhead = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.0, 4), this.materials.gildedTrim);
      spearhead.position.set(0, 35, 0);
      group.add(spearhead);

      // Hanging Split-Tail Gonfalon Fabric
      let bannerMat = this.materials.bannerRed;
      if (biomeId === 'ruins') bannerMat = this.materials.bannerBlue;
      else if (biomeId === 'necropolis') bannerMat = this.materials.bannerGold;

      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 18, 2, 3), bannerMat);
      cloth.position.set(0, 21.5, 0.3);
      group.add(cloth);

      group.isBanner = true;
      group._clothMesh = cloth;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // =========================================================================
    // 3. MICRO-PROPS & GROUND CLUTTER (ANTI-EMPTY DETAIL SCATTER)
    // =========================================================================

    // 3.1 Rubble and Masonry Debris Pile
    createRubblePile(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // 8 to 12 scattered stone blocks of varying shapes and rotations
      const count = 7 + Math.floor(rng() * 5);
      for (let i = 0; i < count; i++) {
        const sx = 2.0 + rng() * 3.5;
        const sy = 1.2 + rng() * 2.5;
        const sz = 2.0 + rng() * 3.5;
        const mat = (i % 2 === 0) ? stoneMat : trimMat;
        const block = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);

        const dist = rng() * 6.5;
        const ang = rng() * Math.PI * 2;
        block.position.set(Math.cos(ang) * dist, sy / 2, Math.sin(ang) * dist);
        block.rotation.set(rng() * 0.4, rng() * Math.PI, rng() * 0.4);
        group.add(block);
      }

      return group;
    }

    // 3.2 Fallen Horizontal Column Drums
    createFallenPillar(rng) {
      const group = new THREE.Group();
      const trimMat = this.materials.stone;
      const stoneMat = this.materials.darkGothicStone;

      // Main fallen drum
      const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 11, 8), trimMat);
      drum1.position.set(0, 3.5, 0);
      drum1.rotation.z = Math.PI / 2;
      drum1.rotation.y = (rng() - 0.5) * 0.8;
      group.add(drum1);

      // Secondary fractured segment
      const drum2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 6, 8), stoneMat);
      drum2.position.set(9.5, 3.2, 3.5);
      drum2.rotation.z = Math.PI / 2;
      drum2.rotation.y = (rng() - 0.5) * 1.2;
      group.add(drum2);

      // Chipped stone fragments
      for (let f = 0; f < 3; f++) {
        const frag = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), trimMat);
        frag.position.set(-6 + f * 5, 1.0, 4 + (rng() - 0.5) * 4);
        group.add(frag);
      }

      return group;
    }

    // 3.3 Low-Lying Atmospheric Ground Mist Patch
    createGroundMistPatch(rng) {
      const group = new THREE.Group();
      const mistMat = this.materials.mistMat;

      // Soft semi-transparent horizontal disc hovering just above flagstones
      const rad = 24 + rng() * 16;
      const disc = new THREE.Mesh(new THREE.CircleGeometry(rad, 12), mistMat);
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = 0.8 + rng() * 0.6;
      group.add(disc);

      group.isMist = true;
      group._baseY = disc.position.y;
      group._phase = rng() * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // =========================================================================
    // 4. REFINED CLASSIC PROPS (Pillars, Braziers, Sarcophagi, Trees, etc.)
    // =========================================================================

    // 4.1 Gothic Pillar
    createPillar(broken = false) {
      const group = new THREE.Group();
      const height = broken ? 18 : 46;
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // Stepped Plinth Base
      const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), stoneMat);
      plinth1.position.y = 1.5;
      group.add(plinth1);

      const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 2.5, 11.5), trimMat);
      plinth2.position.y = 4.2;
      group.add(plinth2);

      // Ribbed Column Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, height, 12), trimMat);
      shaft.position.y = 5.5 + height / 2;
      group.add(shaft);

      // Iron Reinforcing Band
      const band1 = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 1.4, 12), ironMat);
      band1.position.y = 14;
      group.add(band1);

      if (!broken) {
        const band2 = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 1.4, 12), ironMat);
        band2.position.y = 32;
        group.add(band2);

        // Capital
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 4.6, 5, 8), stoneMat);
        capital.position.y = 5.5 + height + 2.5;
        group.add(capital);

        const abacus = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 16), stoneMat);
        abacus.position.y = 5.5 + height + 6.5;
        group.add(abacus);

        // Torch Sconce
        const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4, 3.5), ironMat);
        sconceArm.position.set(0, 22, 5.8);
        group.add(sconceArm);
        const flame = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.5, 6), this.materials.fireGold);
        flame.position.set(0, 25.5, 7.2);
        group.add(flame);
      } else {
        // Fractured Jagged Top
        const fracture = new THREE.Mesh(new THREE.ConeGeometry(4.5, 5, 5), trimMat);
        fracture.position.set(0, 5.5 + height + 1.5, 0);
        fracture.rotation.z = 0.4;
        group.add(fracture);

        // Fallen Chunks
        const chunk1 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.2), trimMat);
        chunk1.position.set(7, 2.5, 4);
        group.add(chunk1);
      }

      return group;
    }

    // 4.2 Ceremonial Gothic Brazier
    createBrazier(colorType = 'gold', rng) {
      const group = new THREE.Group();
      const ironMat = this.materials.darkIron;
      const stoneMat = this.materials.darkGothicStone;

      // Stone Hearth Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 11, 2.5, 12), stoneMat);
      plinth.position.y = 1.25;
      group.add(plinth);

      // Tripod Legs
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12, 1.6), ironMat);
        const ang = (i / 3) * Math.PI * 2;
        leg.position.set(Math.cos(ang) * 4.5, 6, Math.sin(ang) * 4.5);
        leg.rotation.y = -ang;
        leg.rotation.z = 0.25;
        group.add(leg);
      }

      // Central Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.8, 11, 8), ironMat);
      shaft.position.y = 6.5;
      group.add(shaft);

      // Spiked Cauldron Basin
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 5.5, 6.0, 8), ironMat);
      bowl.position.y = 14;
      group.add(bowl);

      // Spikes on rim
      const spikeGeo = new THREE.ConeGeometry(0.8, 3.2, 4);
      for (let s = 0; s < 8; s++) {
        const sang = (s / 8) * Math.PI * 2;
        const spike = new THREE.Mesh(spikeGeo, ironMat);
        spike.position.set(Math.cos(sang) * 9.2, 18, Math.sin(sang) * 9.2);
        group.add(spike);
      }

      let fireMat = this.materials.fireGold;
      let lightHex = 0xff8822;
      if (colorType === 'green') {
        fireMat = this.materials.fireGreen;
        lightHex = 0x00ff88;
      } else if (colorType === 'red') {
        fireMat = this.materials.fireRed;
        lightHex = 0xff3322;
      }

      // Glowing Embers
      const emberBed = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5, 5.0, 1.5, 8),
        new THREE.MeshBasicMaterial({ color: lightHex, transparent: true, opacity: 0.85 })
      );
      emberBed.position.y = 16.5;
      group.add(emberBed);

      // Flame
      const flameCore = new THREE.Mesh(new THREE.ConeGeometry(3.6, 8.5, 6), fireMat);
      flameCore.position.y = 19.5;
      group.add(flameCore);

      const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(5.6, 11.5, 6), fireMat);
      flameOuter.position.y = 20;
      flameOuter.rotation.y = 0.5;
      group.add(flameOuter);

      if (this.activeTorches.length < 2) {
        const light = new THREE.PointLight(lightHex, 1.2, 140, 1.6);
        light.position.y = 19;
        group.add(light);

        group._light = {
          light: light,
          baseIntensity: 1.2,
          phase: (rng ? rng() : Math.random()) * Math.PI * 2
        };
      }

      group.isFlame = true;
      group._flameMesh = flameCore;
      group._phase = (rng ? rng() : Math.random()) * Math.PI * 2;
      this.animatedProps.push(group);

      return group;
    }

    // 4.3 Celtic High Cross Tombstone
    createTombstone(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      const base1 = new THREE.Mesh(new THREE.BoxGeometry(11, 2.5, 7), stoneMat);
      base1.position.y = 1.25;
      group.add(base1);
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 2, 5.5), trimMat);
      base2.position.y = 3.25;
      group.add(base2);

      const shaft = new THREE.Mesh(new THREE.BoxGeometry(3.8, 19, 2.4), trimMat);
      shaft.position.y = 13;
      group.add(shaft);

      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(13, 3.6, 2.4), trimMat);
      crossBar.position.y = 16;
      group.add(crossBar);

      const nimbus = new THREE.Mesh(new THREE.RingGeometry(3.8, 5.8, 16), trimMat);
      nimbus.position.set(0, 16, 1.3);
      group.add(nimbus);

      const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), this.materials.bone);
      skull.position.set(0, 16, 1.8);
      group.add(skull);

      group.rotation.z = (rng() - 0.5) * 0.22;
      group.rotation.x = (rng() - 0.5) * 0.18;
      return group;
    }

    // 4.4 Sarcophagus with Knight-King Effigy
    createSarcophagus() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const goldMat = this.materials.gildedTrim;
      const ironMat = this.materials.darkIron;

      const footing = new THREE.Mesh(new THREE.BoxGeometry(18, 2.5, 34), stoneMat);
      footing.position.y = 1.25;
      group.add(footing);

      const base = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 31.5), trimMat);
      base.position.y = 3.75;
      group.add(base);

      const casket = new THREE.Mesh(new THREE.BoxGeometry(14, 7.5, 29), trimMat);
      casket.position.y = 7.5;
      group.add(casket);

      const lid = new THREE.Mesh(new THREE.BoxGeometry(15.8, 3.2, 31), stoneMat);
      lid.position.y = 12.8;
      group.add(lid);

      // Knight Effigy
      const helm = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.8, 5.5), ironMat);
      helm.position.set(0, 15.6, -10.5);
      group.add(helm);

      const crownBand = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.2, 5.8), goldMat);
      crownBand.position.set(0, 16.5, -10.5);
      group.add(crownBand);

      const chest = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.4, 8.5), trimMat);
      chest.position.set(0, 15.2, -3.5);
      group.add(chest);

      const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 17), goldMat);
      swordBlade.position.set(0, 15.6, 2.5);
      group.add(swordBlade);

      const crossguard = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.2, 1.6), goldMat);
      crossguard.position.set(0, 15.6, -5.5);
      group.add(crossguard);

      return group;
    }

    // 4.5 Gnarled Ancient Dead Tree
    createDeadTree(rng) {
      const group = new THREE.Group();
      const woodMat = this.materials.wood;

      const roots = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 8.5, 8, 8), woodMat);
      roots.position.y = 4;
      group.add(roots);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 5.5, 28, 8), woodMat);
      trunk.position.y = 18;
      trunk.rotation.z = (rng() - 0.5) * 0.18;
      group.add(trunk);

      const branchAngles = [0, 1.1, 2.2, 3.14, 4.2, 5.3];
      for (let b = 0; b < branchAngles.length; b++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 2.0, 16, 5), woodMat);
        const ang = branchAngles[b];
        branch.position.set(Math.cos(ang) * 2, 22 + (b * 2.2), Math.sin(ang) * 2);
        branch.rotation.y = ang;
        branch.rotation.z = 0.65;
        group.add(branch);
      }

      // Hanging Chain Lantern
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 4), this.materials.darkIron);
      chain.position.set(9, 23, 0);
      group.add(chain);

      const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), this.materials.fireGold);
      lantern.position.set(9, 18, 0);
      group.add(lantern);

      return group;
    }

    // 4.6 Druidic Stone Menhir
    createStoneMenhir(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.mossStone;

      const menhir = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 7.5, 30, 6), stoneMat);
      menhir.position.y = 15;
      menhir.rotation.y = rng() * Math.PI;
      group.add(menhir);

      const runes = new THREE.Mesh(
        new THREE.RingGeometry(2, 5, 6),
        this.materials.runeGlowGreen
      );
      runes.position.set(0, 16, 4.2);
      group.add(runes);

      return group;
    }

    // 4.7 Fortified Spiked War Barricade
    createBarricade() {
      const group = new THREE.Group();
      const woodMat = this.materials.wood;
      const ironMat = this.materials.darkIron;

      const beam = new THREE.Mesh(new THREE.BoxGeometry(28, 3.2, 3.2), woodMat);
      beam.position.y = 5.5;
      group.add(beam);

      for (let s of [-11, 11]) {
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 13, 2.4), woodMat);
        leg1.position.set(s, 5, 0);
        leg1.rotation.x = 0.55;
        group.add(leg1);

        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 13, 2.4), woodMat);
        leg2.position.set(s, 5, 0);
        leg2.rotation.x = -0.55;
        group.add(leg2);
      }

      for (let s = -2; s <= 2; s++) {
        const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.8, 15, 6), woodMat);
        stake.position.set(s * 5.8, 6, 0);
        stake.rotation.x = 0.85;
        group.add(stake);

        const tip = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.5, 6), ironMat);
        tip.position.set(s * 5.8, 11.5, 4.5);
        tip.rotation.x = 0.85;
        group.add(tip);
      }

      return group;
    }

    // 4.8 Wrought-Iron Cemetery Railing
    createFence() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const ironMat = this.materials.darkIron;

      const curb = new THREE.Mesh(new THREE.BoxGeometry(26, 2, 4), stoneMat);
      curb.position.y = 1;
      group.add(curb);

      for (let p of [-12, 12]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), stoneMat);
        post.position.set(p, 6, 0);
        group.add(post);

        const cap = new THREE.Mesh(new THREE.ConeGeometry(2.5, 3, 4), stoneMat);
        cap.position.set(p, 13, 0);
        cap.rotation.y = Math.PI / 4;
        group.add(cap);
      }

      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 0.8), ironMat);
      rail1.position.set(0, 4.5, 0);
      group.add(rail1);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 0.8), ironMat);
      rail2.position.set(0, 9.5, 0);
      group.add(rail2);

      const finialGeo = new THREE.ConeGeometry(0.8, 2.2, 4);
      for (let i = -2.5; i <= 2.5; i += 1.0) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 9.5, 4), ironMat);
        bar.position.set(i * 3.8, 7, 0);
        group.add(bar);

        const finial = new THREE.Mesh(finialGeo, ironMat);
        finial.position.set(i * 3.8, 12.5, 0);
        group.add(finial);
      }

      return group;
    }

    // 4.9 Ossuary Bone Pile
    createBonePile(rng) {
      const group = new THREE.Group();
      const mound = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 2.8, 8), this.materials.darkGothicStone);
      mound.position.y = 1.4;
      group.add(mound);

      const boneMat = this.materials.bone;
      for (let i = 0; i < 7; i++) {
        const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0), boneMat);
        const ang = (i / 7) * Math.PI * 2 + (rng() * 0.4);
        const rad = 2 + rng() * 7;
        skull.position.set(Math.cos(ang) * rad, 2.5 + rng() * 2.5, Math.sin(ang) * rad);
        skull.rotation.set(rng() * 0.5, rng() * Math.PI, rng() * 0.5);
        group.add(skull);
      }

      const femurGeo = new THREE.CylinderGeometry(0.5, 0.5, 11, 4);
      const femur1 = new THREE.Mesh(femurGeo, boneMat);
      femur1.position.set(0, 3.2, 0);
      femur1.rotation.set(Math.PI / 2, 0.4, 0.7);
      group.add(femur1);
      const femur2 = new THREE.Mesh(femurGeo, boneMat);
      femur2.position.set(0, 3.2, 0);
      femur2.rotation.set(Math.PI / 2, -0.4, -0.7);
      group.add(femur2);

      return group;
    }

    // 4.10 Crypt Obelisk Pillar
    createCryptPillar() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const goldMat = this.materials.gildedTrim;

      const base1 = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 16), stoneMat);
      base1.position.y = 1.25;
      group.add(base1);
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.5, 12), stoneMat);
      base2.position.y = 3.75;
      group.add(base2);

      const obelisk = new THREE.Mesh(new THREE.BoxGeometry(8, 36, 8), stoneMat);
      obelisk.position.y = 23;
      group.add(obelisk);

      const runeBand = new THREE.Mesh(new THREE.BoxGeometry(8.4, 3.5, 8.4), goldMat);
      runeBand.position.y = 24;
      group.add(runeBand);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(5.8, 9, 4), stoneMat);
      cap.position.y = 45;
      cap.rotation.y = Math.PI / 4;
      group.add(cap);

      return group;
    }

    // 4.11 Horned Gargoyle Pedestal
    createGargoylePedestal(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const gargMat = this.materials.blackObsidian;

      const base = new THREE.Mesh(new THREE.CylinderGeometry(9, 11, 3, 8), stoneMat);
      base.position.y = 1.5;
      group.add(base);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(6, 7.5, 18, 8), stoneMat);
      shaft.position.y = 12;
      group.add(shaft);

      const abacus = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 14), this.materials.stone);
      abacus.position.y = 22;
      group.add(abacus);

      const gargGroup = new THREE.Group();
      gargGroup.position.set(0, 23.5, 0);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(6, 6.5, 6), gargMat);
      torso.position.y = 3.5;
      gargGroup.add(torso);

      const head = new THREE.Mesh(new THREE.ConeGeometry(2.6, 5, 5), gargMat);
      head.position.set(0, 7.5, 2);
      head.rotation.x = 0.5;
      gargGroup.add(head);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.45, 4, 4), this.materials.fireRed);
      eyeL.position.set(-1.1, 8.2, 3.6);
      gargGroup.add(eyeL);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.45, 4, 4), this.materials.fireRed);
      eyeR.position.set(1.1, 8.2, 3.6);
      gargGroup.add(eyeR);

      const wingGeo = new THREE.BoxGeometry(0.6, 11, 7);
      const wingL = new THREE.Mesh(wingGeo, gargMat);
      wingL.position.set(-4.5, 7, -2);
      wingL.rotation.set(0.3, -0.6, 0.4);
      gargGroup.add(wingL);

      const wingR = new THREE.Mesh(wingGeo, gargMat);
      wingR.position.set(4.5, 7, -2);
      wingR.rotation.set(0.3, 0.6, -0.4);
      gargGroup.add(wingR);

      group.add(gargGroup);
      return group;
    }

    // 4.12 Bastion Corner Tower
    createCornerTower(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      const talus = new THREE.Mesh(new THREE.BoxGeometry(40, 10, 40), stoneMat);
      talus.position.y = 5;
      group.add(talus);

      const body = new THREE.Mesh(new THREE.BoxGeometry(34, 42, 34), stoneMat);
      body.position.y = 31;
      group.add(body);

      const gallery = new THREE.Mesh(new THREE.BoxGeometry(42, 8, 42), trimMat);
      gallery.position.y = 56;
      group.add(gallery);

      const spire = new THREE.Mesh(new THREE.ConeGeometry(11, 36, 4), stoneMat);
      spire.position.y = 78;
      spire.rotation.y = Math.PI / 4;
      group.add(spire);

      return group;
    }

    // 4.13 Boundary Curtain Wall Piece
    createBoundaryWallPiece(biomeId, angle, rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 32, 10), stoneMat);
      wall.position.y = 16;
      group.add(wall);

      const base = new THREE.Mesh(new THREE.BoxGeometry(52, 4, 13), trimMat);
      base.position.y = 2;
      group.add(base);

      // Pointed blind arches in wall face
      for (let a = -1; a <= 1; a += 2) {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 2.5), this.materials.blackObsidian);
        arch.position.set(a * 14, 15, 4.5);
        group.add(arch);

        const archTop = new THREE.Mesh(new THREE.ConeGeometry(5, 6, 4), this.materials.blackObsidian);
        archTop.rotation.y = Math.PI / 4;
        archTop.position.set(a * 14, 25, 4.5);
        group.add(archTop);
      }

      const walkway = new THREE.Mesh(new THREE.BoxGeometry(50, 3.5, 12), trimMat);
      walkway.position.y = 33.5;
      group.add(walkway);

      return group;
    }

    clear() {
      if (this.arenaGroup) {
        this.scene.remove(this.arenaGroup);
        this.arenaGroup = null;
      }
      if (this.groundTexture) {
        this.groundTexture.dispose();
        this.groundTexture = null;
      }
      if (this.groundBumpTexture) {
        this.groundBumpTexture.dispose();
        this.groundBumpTexture = null;
      }
      if (this.groundMaterial) {
        this.groundMaterial.dispose();
        this.groundMaterial = null;
      }
      this.wallNorth = null;
      this.wallSouth = null;
      this.wallWest = null;
      this.wallEast = null;
      this.towers = [];
      this.interiorProps = [];
      this.animatedProps = [];
      this.obstacles = [];
      this.activeTorches = [];
      this.obstacles = [];
    }
  }

  window.MedievalSurvivors.GenerativeMap3D = GenerativeMap3D;
})();

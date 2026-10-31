/**
 * Medieval Survivors - Generative 3D Map & Procedural Environment System
 * Creates a unique procedural realm, biome, terrain, and interactive 3D prop scatter for each run.
 */

window.MedievalSurvivors = window.MedievalSurvivors || {};

(function() {
  const THREE = window.THREE;

  // Biome Presets for Procedural Generation
  const BIOMES = [
    {
      id: 'ruins',
      name: 'Ruínas de Valoria',
      subtitle: 'Antiga Cidadela dos Reis Caídos',
      icon: '🏛️',
      fogColor: 0x1f1a2c,
      fogDensity: 0.00065,
      ambientColor: 0x6a627c,
      dirLightColor: 0xc4ceff,
      dirLightIntensity: 0.65,
      groundTones: ['#322b40', '#3d344d', '#282233', '#493e5c'],
      accentProps: ['pillar', 'broken_pillar', 'brazier', 'tombstone', 'bone_pile', 'crypt_pillar', 'gargoyle_pedestal']
    },
    {
      id: 'necropolis',
      name: 'Necrópole Imperial',
      subtitle: 'Catacumbas Antigas e Mausoléus Profanados',
      icon: '💀',
      fogColor: 0x07110e,
      fogDensity: 0.0008,
      ambientColor: 0x162420,
      dirLightColor: 0x6ca39a,
      dirLightIntensity: 0.30,
      groundTones: ['#0d1715', '#12201d', '#091210', '#172925'],
      accentProps: ['tombstone', 'sarcophagus', 'brazier_green', 'bone_pile', 'crypt_pillar', 'gargoyle_pedestal']
    },
    {
      id: 'forest',
      name: 'Floresta das Sombras',
      subtitle: 'Bosque Amaldiçoado pela Névoa Eterna',
      icon: '🌲',
      fogColor: 0x081008,
      fogDensity: 0.0008,
      ambientColor: 0x182417,
      dirLightColor: 0x769978,
      dirLightIntensity: 0.30,
      groundTones: ['#0e170d', '#132012', '#091108', '#182917'],
      accentProps: ['dead_tree', 'stone_menhir', 'fence', 'brazier', 'stump']
    },
    {
      id: 'crimson',
      name: 'Fortaleza do Carrasco Carmesim',
      subtitle: 'Bastião das Sombras e Cinzas',
      icon: '🏰',
      fogColor: 0x2b1519,
      fogDensity: 0.0007,
      ambientColor: 0x6e3d43,
      dirLightColor: 0xffc4b3,
      dirLightIntensity: 0.65,
      groundTones: ['#3b2327', '#4a2c31', '#2f1c1f', '#59353b'],
      accentProps: ['spiked_barricade', 'brazier_red', 'bone_pile', 'crypt_pillar', 'gargoyle_pedestal']
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
      this.arenaSize = 3200; // Grand square arena: 3200x3200 units (~5x previous area)
      this.halfSize = 1600;
      this.arenaGroup = null;
      this.currentBiome = null;
      this.seed = 12345;
      this.prng = createPRNG(this.seed);
      this.activeTorches = [];

      // Shared Prop Geometries & Materials for high-performance instancing / cloning
      this.initSharedResources();
    }

    initSharedResources() {
      this.materials = {
        stone: new THREE.MeshStandardMaterial({ color: 0x4d535b, roughness: 0.85, metalness: 0.1 }),
        darkStone: new THREE.MeshStandardMaterial({ color: 0x24282f, roughness: 0.8 }),
        darkGothicStone: new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.75, metalness: 0.15 }),
        blackObsidian: new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.7, roughness: 0.35 }),
        gildedTrim: new THREE.MeshStandardMaterial({ color: 0xb58b2a, metalness: 0.85, roughness: 0.3, emissive: 0x241804, emissiveIntensity: 0.15 }),
        darkIron: new THREE.MeshStandardMaterial({ color: 0x1c1e22, metalness: 0.85, roughness: 0.35 }),
        mossStone: new THREE.MeshStandardMaterial({ color: 0x2c382b, roughness: 0.9 }),
        bloodStone: new THREE.MeshStandardMaterial({ color: 0x3d1419, roughness: 0.75 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.85 }),
        iron: new THREE.MeshStandardMaterial({ color: 0x23272b, metalness: 0.8, roughness: 0.35 }),
        fireGold: new THREE.MeshBasicMaterial({ color: 0xff7700 }),
        fireGreen: new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
        fireRed: new THREE.MeshBasicMaterial({ color: 0xff2222 }),
        bone: new THREE.MeshStandardMaterial({ color: 0xd8cca8, roughness: 0.7 })
      };
    }

    // Procedural Gothic Cathedral Flagstone Floor Texture Generator
    createProceduralGroundTexture(biome) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const tones = (biome && biome.groundTones && biome.groundTones.length)
        ? biome.groundTones
        : ['#221d2b', '#2c2538', '#191520', '#342c42'];

      // Deep dark base mortar fill
      ctx.fillStyle = tones[2] || '#15111c';
      ctx.fillRect(0, 0, 512, 512);

      // Staggered medieval cathedral flagstone courses
      const rows = 8;
      const cols = 8;
      const tileW = 512 / cols;
      const tileH = 512 / rows;

      for (let r = 0; r < rows; r++) {
        const offsetX = (r % 2 === 1) ? tileW * 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          const x = c * tileW + offsetX + 2.5;
          const y = r * tileH + 2.5;
          const w = tileW - 5;
          const h = tileH - 5;

          const toneIndex = Math.abs(c * 11 + r * 17) % tones.length;
          ctx.fillStyle = tones[toneIndex];
          ctx.fillRect(x, y, w, h);

          // Subtle weathered stone grain texture
          const innerTone = tones[(toneIndex + 1) % tones.length];
          ctx.fillStyle = innerTone;
          ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

          // Top/Left stone bevel highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.055)';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(x, y, w, h);

          // Deep dark bottom/right shadow mortar line
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          ctx.moveTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.stroke();
        }
      }

      // Cathedral Quadrant Cross watermarks across the 512x512 tile
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.025)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(256, 256, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric Vignette for deep medieval gothic depth
      const vignette = ctx.createRadialGradient(256, 256, 100, 256, 256, 256);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(32, 32);
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
      this.groundMaterial = new THREE.MeshStandardMaterial({
        map: this.groundTexture,
        roughness: 0.85,
        metalness: 0.1
      });

      // Build the complete bounded square arena (zero chunk allocation during gameplay!)
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

      // Outer darkened perimeter abyss plane (outside the fortress walls)
      const abyssGeo = new THREE.PlaneGeometry(this.arenaSize + 1400, this.arenaSize + 1400, 1, 1);
      abyssGeo.rotateX(-Math.PI / 2);
      const abyssMat = new THREE.MeshBasicMaterial({ color: 0x030205 });
      const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
      abyssMesh.position.set(0, -0.6, 0);
      this.freezeMatrix(abyssMesh);
      this.arenaGroup.add(abyssMesh);

      // 2. High-Performance Perimeter Walls grouped into 4 cardinal sides for instant distance culling
      this.wallNorth = new THREE.Group();
      this.wallSouth = new THREE.Group();
      this.wallWest = new THREE.Group();
      this.wallEast = new THREE.Group();
      this.towers = [];
      this.interiorProps = [];

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

      // Initialize walls hidden; dynamic update will show only nearby wall sections
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

      // 3. Central Sanctuary Courtyard (Braziers around start area)
      const sanctuaryCorners = [
        [-120, -120], [120, -120], [-120, 120], [120, 120]
      ];
      sanctuaryCorners.forEach(([bx, bz]) => {
        const brazier = this.createBrazier('gold', rng);
        brazier.position.set(bx, 0, bz);
        this.freezeMatrix(brazier);
        this.interiorProps.push(brazier);
        this.arenaGroup.add(brazier);
        if (brazier._light && this.activeTorches.length < 2) {
          this.activeTorches.push(brazier._light);
        }
      });

      // 4. Randomized Thematic Interior Props scattered throughout the arena
      const propCount = 65 + Math.floor(rng() * 15);
      for (let i = 0; i < propCount; i++) {
        const propType = this.currentBiome.accentProps[Math.floor(rng() * this.currentBiome.accentProps.length)];

        // Random coordinates avoiding center sanctuary (|x| < 140 && |z| < 140) and keeping away from walls
        let px = (rng() * 2 - 1) * (hs - 130);
        let pz = (rng() * 2 - 1) * (hs - 130);

        if (Math.abs(px) < 140 && Math.abs(pz) < 140) {
          px += (px >= 0 ? 180 : -180);
          pz += (pz >= 0 ? 180 : -180);
        }

        const prop = this.createProp(propType, rng);
        if (prop) {
          prop.position.set(px, 0, pz);
          prop.rotation.y = rng() * Math.PI * 2;
          const sc = 0.85 + rng() * 0.4;
          prop.scale.set(sc, sc, sc);
          this.freezeMatrix(prop);
          this.interiorProps.push(prop);
          this.arenaGroup.add(prop);

          if (prop._light && this.activeTorches.length < 2) {
            this.activeTorches.push(prop._light);
          }
        }
      }

      this.scene.add(this.arenaGroup);
    }

    // Dynamic Frustum & Distance Culling: eliminates up to 3,000 draw calls per frame!
    update(playerX = 0, playerZ = 0) {
      if (!this.arenaGroup) return;

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

      // 3. Interior props distance culling (camera view frustum is ~600)
      if (this.interiorProps) {
        const maxDistSq = 720 * 720;
        for (let i = 0, len = this.interiorProps.length; i < len; i++) {
          const p = this.interiorProps[i];
          const dx = p.position.x - playerX;
          const dz = p.position.z - playerZ;
          p.visible = (dx * dx + dz * dz) <= maxDistSq;
        }
      }
    }

    createCornerTower(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // 1. Sloped Battered Fortress Base
      const talus = new THREE.Mesh(new THREE.BoxGeometry(40, 10, 40), stoneMat);
      talus.position.y = 5;
      group.add(talus);

      // 2. Main Citadel Tower Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(34, 42, 34), stoneMat);
      body.position.y = 31;
      group.add(body);

      // Corner Pilasters (Reinforcing Bevels)
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(4, 44, 4), trimMat);
      p1.position.set(-17, 31, -17);
      group.add(p1);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(4, 44, 4), trimMat);
      p2.position.set(17, 31, -17);
      group.add(p2);
      const p3 = new THREE.Mesh(new THREE.BoxGeometry(4, 44, 4), trimMat);
      p3.position.set(-17, 31, 17);
      group.add(p3);
      const p4 = new THREE.Mesh(new THREE.BoxGeometry(4, 44, 4), trimMat);
      p4.position.set(17, 31, 17);
      group.add(p4);

      // 3. Machicolated Corbel Gallery
      const gallery = new THREE.Mesh(new THREE.BoxGeometry(42, 8, 42), trimMat);
      gallery.position.y = 56;
      group.add(gallery);

      // 4. Crenellated Merlons (8 battlements around roof)
      const merlonGeo = new THREE.BoxGeometry(6, 6, 3);
      for (let s = -1; s <= 1; s += 2) {
        const mN = new THREE.Mesh(merlonGeo, stoneMat);
        mN.position.set(s * 14, 63, -20);
        group.add(mN);
        const mS = new THREE.Mesh(merlonGeo, stoneMat);
        mS.position.set(s * 14, 63, 20);
        group.add(mS);
        const mW = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 6), stoneMat);
        mW.position.set(-20, 63, s * 14);
        group.add(mW);
        const mE = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 6), stoneMat);
        mE.position.set(20, 63, s * 14);
        group.add(mE);
      }

      // 5. Grand Gothic High Spire
      const spire = new THREE.Mesh(new THREE.ConeGeometry(11, 36, 4), stoneMat);
      spire.position.y = 78;
      spire.rotation.y = Math.PI / 4;
      group.add(spire);

      // Iron Cross Finial atop Spire
      const finialShaft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 6, 0.8), ironMat);
      finialShaft.position.y = 98;
      group.add(finialShaft);
      const finialBar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.8, 0.8), ironMat);
      finialBar.position.y = 99;
      group.add(finialBar);

      return group;
    }

    createBoundaryWallPiece(biomeId, angle, rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // Heavy Curtain Wall Slab
      const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 32, 10), stoneMat);
      wall.position.y = 16;
      group.add(wall);

      // Stepped Foundation Plinth
      const base = new THREE.Mesh(new THREE.BoxGeometry(52, 4, 13), trimMat);
      base.position.y = 2;
      group.add(base);

      // Recessed Gothic Pointed Blind Arches in wall face
      for (let a = -1; a <= 1; a += 2) {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 2.5), this.materials.blackObsidian);
        arch.position.set(a * 14, 15, 4.5);
        group.add(arch);

        const archTop = new THREE.Mesh(new THREE.ConeGeometry(5, 6, 4), this.materials.blackObsidian);
        archTop.rotation.y = Math.PI / 4;
        archTop.position.set(a * 14, 25, 4.5);
        group.add(archTop);
      }

      // Wall-Walk Battlements (Crenels and Merlons)
      const walkway = new THREE.Mesh(new THREE.BoxGeometry(50, 3.5, 12), trimMat);
      walkway.position.y = 33.5;
      group.add(walkway);

      const m1 = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 4), stoneMat);
      m1.position.set(-15, 38, 4);
      group.add(m1);
      const m2 = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 4), stoneMat);
      m2.position.set(15, 38, 4);
      group.add(m2);

      // Iron Torch Sconce on Wall
      const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4, 3), this.materials.darkIron);
      sconceArm.position.set(0, 20, 5.5);
      group.add(sconceArm);
      const sconceFlame = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.2, 5), this.materials.fireGold);
      sconceFlame.position.set(0, 23.5, 6.8);
      group.add(sconceFlame);

      return group;
    }

    createProp(type, rng) {
      switch (type) {
        case 'pillar':
          return this.createPillar(false);
        case 'broken_pillar':
          return this.createPillar(true);
        case 'brazier':
          return this.createBrazier('gold', rng);
        case 'brazier_green':
          return this.createBrazier('green', rng);
        case 'brazier_red':
          return this.createBrazier('red', rng);
        case 'tombstone':
          return this.createTombstone(rng);
        case 'sarcophagus':
          return this.createSarcophagus();
        case 'dead_tree':
          return this.createDeadTree(rng);
        case 'stone_menhir':
          return this.createStoneMenhir(rng);
        case 'fence':
          return this.createFence();
        case 'barricade':
          return this.createBarricade();
        case 'bone_pile':
          return this.createBonePile(rng);
        case 'crypt_pillar':
          return this.createCryptPillar();
        case 'gargoyle_pedestal':
          return this.createGargoylePedestal(rng);
        case 'blood_runes':
          return this.createBloodRunes();
        default:
          return this.createPillar(true);
      }
    }

    createBonePile(rng) {
      const group = new THREE.Group();
      const mound = new THREE.Mesh(new THREE.CylinderGeometry(12, 16, 2.8, 8), this.materials.darkGothicStone);
      mound.position.y = 1.4;
      group.add(mound);

      // Sculpted Skulls & Crossed Leg Bones
      const boneMat = this.materials.bone;
      for (let i = 0; i < 7; i++) {
        const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0), boneMat);
        const ang = (i / 7) * Math.PI * 2 + (rng() * 0.4);
        const rad = 2 + rng() * 7;
        skull.position.set(Math.cos(ang) * rad, 2.5 + rng() * 2.5, Math.sin(ang) * rad);
        skull.rotation.set(rng() * 0.5, rng() * Math.PI, rng() * 0.5);
        group.add(skull);
      }

      // Crossed Femur Bones
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

    createCryptPillar() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const goldMat = this.materials.gildedTrim;
      const ironMat = this.materials.darkIron;

      // 3-tier stepped square plinth
      const base1 = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 16), stoneMat);
      base1.position.y = 1.25;
      group.add(base1);
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(12, 2.5, 12), stoneMat);
      base2.position.y = 3.75;
      group.add(base2);

      // 4 Corner Iron Buttress Struts
      const strutGeo = new THREE.BoxGeometry(2, 6, 2);
      const corners = [[-6, -6], [6, -6], [-6, 6], [6, 6]];
      corners.forEach(([cx, cz]) => {
        const strut = new THREE.Mesh(strutGeo, ironMat);
        strut.position.set(cx, 6, cz);
        group.add(strut);
      });

      // Tapered Grand Obelisk Shaft
      const obelisk = new THREE.Mesh(new THREE.BoxGeometry(8, 36, 8), stoneMat);
      obelisk.position.y = 23;
      group.add(obelisk);

      // Engraved Gilded Runes Band
      const runeBand = new THREE.Mesh(new THREE.BoxGeometry(8.4, 3.5, 8.4), goldMat);
      runeBand.position.y = 24;
      group.add(runeBand);

      // Pointed Pyramidion Spire
      const cap = new THREE.Mesh(new THREE.ConeGeometry(5.8, 9, 4), stoneMat);
      cap.position.y = 45;
      cap.rotation.y = Math.PI / 4;
      group.add(cap);

      return group;
    }

    createGargoylePedestal(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const gargMat = this.materials.blackObsidian;

      // Stepped Octagonal Altar Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(9, 11, 3, 8), stoneMat);
      base.position.y = 1.5;
      group.add(base);

      // Pillar Shaft with Carved Cornice
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(6, 7.5, 18, 8), stoneMat);
      shaft.position.y = 12;
      group.add(shaft);

      const abacus = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 14), this.materials.stone);
      abacus.position.y = 22;
      group.add(abacus);

      // Sculpted Crouched Horned Gargoyle
      const gargGroup = new THREE.Group();
      gargGroup.position.set(0, 23.5, 0);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(6, 6.5, 6), gargMat);
      torso.position.y = 3.5;
      gargGroup.add(torso);

      // Horned Head
      const head = new THREE.Mesh(new THREE.ConeGeometry(2.6, 5, 5), gargMat);
      head.position.set(0, 7.5, 2);
      head.rotation.x = 0.5;
      gargGroup.add(head);

      // Glowing Ruby Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.45, 4, 4), this.materials.fireRed);
      eyeL.position.set(-1.1, 8.2, 3.6);
      gargGroup.add(eyeL);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.45, 4, 4), this.materials.fireRed);
      eyeR.position.set(1.1, 8.2, 3.6);
      gargGroup.add(eyeR);

      // 2 Majestic Bat Wings Swept Back
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

    createBloodRunes() {
      // Converted to an ancient dark carved stone relief slab
      const group = new THREE.Group();
      const slab = new THREE.Mesh(
        new THREE.CylinderGeometry(11, 13, 1.2, 8),
        this.materials.darkGothicStone
      );
      slab.position.y = 0.6;
      group.add(slab);

      const trim = new THREE.Mesh(
        new THREE.RingGeometry(8.5, 11, 8),
        this.materials.stone
      );
      trim.rotation.x = -Math.PI / 2;
      trim.position.y = 1.22;
      group.add(trim);

      return group;
    }

    // 1. Ancient Cathedral Stone Pillar
    createPillar(broken = false) {
      const group = new THREE.Group();
      const height = broken ? 18 : 46;
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const ironMat = this.materials.darkIron;

      // 1. Stepped Plinth Base
      const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 14), stoneMat);
      plinth1.position.y = 1.5;
      group.add(plinth1);

      const plinth2 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 2.5, 11.5), trimMat);
      plinth2.position.y = 4.2;
      group.add(plinth2);

      // 2. Ribbed Fluted Column Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.8, height, 12), trimMat);
      shaft.position.y = 5.5 + height / 2;
      group.add(shaft);

      // 3. Forged Iron Reinforcing Bands with Rivets
      const band1 = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 1.4, 12), ironMat);
      band1.position.y = 14;
      group.add(band1);

      if (!broken) {
        const band2 = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 1.4, 12), ironMat);
        band2.position.y = 32;
        group.add(band2);

        // 4. Corinthian Gothic Capital
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 4.6, 5, 8), stoneMat);
        capital.position.y = 5.5 + height + 2.5;
        group.add(capital);

        const abacus = new THREE.Mesh(new THREE.BoxGeometry(16, 3, 16), stoneMat);
        abacus.position.y = 5.5 + height + 6.5;
        group.add(abacus);

        // 4 Corner Pinnacle Finials
        const finialGeo = new THREE.ConeGeometry(1.5, 4.5, 4);
        const finialCorners = [[-6.8, -6.8], [6.8, -6.8], [-6.8, 6.8], [6.8, 6.8]];
        finialCorners.forEach(([fx, fz]) => {
          const finial = new THREE.Mesh(finialGeo, trimMat);
          finial.position.set(fx, 5.5 + height + 9, fz);
          group.add(finial);
        });

        // Torch Sconce projecting from pillar
        const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4, 3.5), ironMat);
        sconceArm.position.set(0, 22, 5.8);
        group.add(sconceArm);
        const flame = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.5, 6), this.materials.fireGold);
        sconceFlame: flame.position.set(0, 25.5, 7.2);
        group.add(flame);
      } else {
        // Jagged broken fracture top
        const fracture = new THREE.Mesh(new THREE.ConeGeometry(4.5, 5, 5), trimMat);
        fracture.position.set(0, 5.5 + height + 1.5, 0);
        fracture.rotation.z = 0.4;
        group.add(fracture);

        // Fallen Chunks of Masonry
        const chunkGeo = new THREE.DodecahedronGeometry(3.2);
        const chunk1 = new THREE.Mesh(chunkGeo, trimMat);
        chunk1.position.set(7, 2.5, 4);
        chunk1.rotation.set(0.4, 0.8, 0.2);
        group.add(chunk1);

        const chunk2 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), stoneMat);
        chunk2.position.set(-6, 2, 5);
        chunk2.rotation.set(0.7, 0.2, 0.5);
        group.add(chunk2);
      }

      return group;
    }

    // 2. Burning Ceremonial Gothic Brazier
    createBrazier(colorType = 'gold', rng) {
      const group = new THREE.Group();
      const ironMat = this.materials.darkIron;
      const stoneMat = this.materials.darkGothicStone;

      // 1. Circular Carved Stone Hearth Plinth
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 11, 2.5, 12), stoneMat);
      plinth.position.y = 1.25;
      group.add(plinth);

      // 2. Forged Dragon Talon Tripod Legs (3 Curved Struts)
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12, 1.6), ironMat);
        const ang = (i / 3) * Math.PI * 2;
        leg.position.set(Math.cos(ang) * 4.5, 6, Math.sin(ang) * 4.5);
        leg.rotation.y = -ang;
        leg.rotation.z = 0.25;
        group.add(leg);
      }

      // 3. Central Fluted Iron Pedestal
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.8, 11, 8), ironMat);
      shaft.position.y = 6.5;
      group.add(shaft);

      // 4. Heavy Spiked Iron Cauldron Basin
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 5.5, 6.0, 8), ironMat);
      bowl.position.y = 14;
      group.add(bowl);

      // 8 Spiked Iron Teeth on rim
      const spikeGeo = new THREE.ConeGeometry(0.8, 3.2, 4);
      for (let s = 0; s < 8; s++) {
        const sang = (s / 8) * Math.PI * 2;
        const spike = new THREE.Mesh(spikeGeo, ironMat);
        spike.position.set(Math.cos(sang) * 9.2, 18, Math.sin(sang) * 9.2);
        group.add(spike);
      }

      // Fire flame mesh
      let fireMat = this.materials.fireGold;
      let lightHex = 0xff8822;
      if (colorType === 'green') {
        fireMat = this.materials.fireGreen;
        lightHex = 0x00ff88;
      } else if (colorType === 'red') {
        fireMat = this.materials.fireRed;
        lightHex = 0xff3322;
      }

      // Glowing Hot Embers Bed Layer
      const emberBed = new THREE.Mesh(
        new THREE.CylinderGeometry(7.5, 5.0, 1.5, 8),
        new THREE.MeshBasicMaterial({ color: lightHex, transparent: true, opacity: 0.85 })
      );
      emberBed.position.y = 16.5;
      group.add(emberBed);

      // Two Forged Iron Ring Handles on Cauldron Sides
      const ringHandleGeo = new THREE.TorusGeometry(2.4, 0.6, 6, 12);
      for (let s of [-9.8, 9.8]) {
        const handle = new THREE.Mesh(ringHandleGeo, ironMat);
        handle.position.set(s, 15, 0);
        handle.rotation.y = Math.PI / 2;
        group.add(handle);
      }

      // Volumetric Core Flame + Outer Translucent Flame
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

      return group;
    }

    // 3. Ornate Celtic High Cross Tombstone
    createTombstone(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;

      // 2-Tier Stepped Base
      const base1 = new THREE.Mesh(new THREE.BoxGeometry(11, 2.5, 7), stoneMat);
      base1.position.y = 1.25;
      group.add(base1);
      const base2 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 2, 5.5), trimMat);
      base2.position.y = 3.25;
      group.add(base2);

      // Tapered Celtic Cross Vertical Shaft
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(3.8, 19, 2.4), trimMat);
      shaft.position.y = 13;
      group.add(shaft);

      // Horizontal Cross Bar
      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(13, 3.6, 2.4), trimMat);
      crossBar.position.y = 16;
      group.add(crossBar);

      // Pierced Celtic Nimbus Ring
      const nimbus = new THREE.Mesh(
        new THREE.RingGeometry(3.8, 5.8, 16),
        trimMat
      );
      nimbus.position.set(0, 16, 1.3);
      group.add(nimbus);

      // Carved Skull Relief in Center
      const skull = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), this.materials.bone);
      skull.position.set(0, 16, 1.8);
      group.add(skull);

      // Tilt slightly for ancient weathering
      group.rotation.z = (rng() - 0.5) * 0.22;
      group.rotation.x = (rng() - 0.5) * 0.18;

      return group;
    }

    // 4. Imperial Knight-King Crypt Sarcophagus with Effigy & Heraldry
    createSarcophagus() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const trimMat = this.materials.stone;
      const goldMat = this.materials.gildedTrim;
      const ironMat = this.materials.darkIron;

      // 1. Tier 1 Flared Granite Footing
      const footing = new THREE.Mesh(new THREE.BoxGeometry(18, 2.5, 34), stoneMat);
      footing.position.y = 1.25;
      group.add(footing);

      // 2. Stepped Plinth Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 31.5), trimMat);
      base.position.y = 3.75;
      group.add(base);

      // 4 Heavy Forged Iron Corner Clamps
      const clampGeo = new THREE.BoxGeometry(2.2, 7.5, 2.2);
      const corners = [[-7.5, -15], [7.5, -15], [-7.5, 15], [7.5, 15]];
      corners.forEach(([cx, cz]) => {
        const clamp = new THREE.Mesh(clampGeo, ironMat);
        clamp.position.set(cx, 7.5, cz);
        group.add(clamp);
      });

      // 3. Casket Vault Body
      const casket = new THREE.Mesh(new THREE.BoxGeometry(14, 7.5, 29), trimMat);
      casket.position.y = 7.5;
      group.add(casket);

      // 4 Gothic Blind Arcades on Casket Sides
      const sideArcade = new THREE.Mesh(new THREE.BoxGeometry(14.6, 4.8, 24), stoneMat);
      sideArcade.position.y = 7.5;
      group.add(sideArcade);

      // 4. Heavy Carved Sarcophagus Lid with Moldings
      const lid = new THREE.Mesh(new THREE.BoxGeometry(15.8, 3.2, 31), stoneMat);
      lid.position.y = 12.8;
      group.add(lid);

      // Gilded Trim Inlay Around Lid Rim
      const lidTrim = new THREE.Mesh(new THREE.BoxGeometry(16.2, 1.2, 31.4), goldMat);
      lidTrim.position.y = 13.8;
      group.add(lidTrim);

      // 5. Knight-King Reclining Effigy Sculpted in High Relief
      // Crusader Great Helm headpiece with golden crown band
      const helm = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.8, 5.5), ironMat);
      helm.position.set(0, 15.6, -10.5);
      group.add(helm);

      const crownBand = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.2, 5.8), goldMat);
      crownBand.position.set(0, 16.5, -10.5);
      group.add(crownBand);

      // Cuirass Breastplate Torso
      const chest = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.4, 8.5), trimMat);
      chest.position.set(0, 15.2, -3.5);
      group.add(chest);

      // Crossed Gauntlets holding Longsword
      const gauntlets = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.2, 2.6), ironMat);
      gauntlets.position.set(0, 15.5, -2);
      group.add(gauntlets);

      // Stone Longsword in Repose
      const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 17), goldMat);
      swordBlade.position.set(0, 15.6, 2.5);
      group.add(swordBlade);

      const crossguard = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.2, 1.6), goldMat);
      crossguard.position.set(0, 15.6, -5.5);
      group.add(crossguard);

      const pommel = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.2, 6), goldMat);
      pommel.position.set(0, 15.6, -7.0);
      group.add(pommel);

      // Heraldic Kite Shield with Lion Rampant Crest at feet
      const shield = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.0, 8.5), ironMat);
      shield.position.set(0, 15.2, 10.5);
      group.add(shield);

      const shieldBoss = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.8, 4), goldMat);
      shieldBoss.position.set(0, 16.5, 10.5);
      group.add(shieldBoss);

      return group;
    }

    // 5. Gnarled Ancient Dead Oak
    createDeadTree(rng) {
      const group = new THREE.Group();
      const woodMat = this.materials.wood;

      // Massive Flared Root Base
      const roots = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 8.5, 8, 8), woodMat);
      roots.position.y = 4;
      group.add(roots);

      // Gnarled Main Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 5.5, 28, 8), woodMat);
      trunk.position.y = 18;
      trunk.rotation.z = (rng() - 0.5) * 0.18;
      group.add(trunk);

      // 6 Gnarled Branches Arching Outward
      const branchAngles = [0, 1.1, 2.2, 3.14, 4.2, 5.3];
      for (let b = 0; b < branchAngles.length; b++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 2.0, 16, 5), woodMat);
        const ang = branchAngles[b];
        branch.position.set(Math.cos(ang) * 2, 22 + (b * 2.2), Math.sin(ang) * 2);
        branch.rotation.y = ang;
        branch.rotation.z = 0.65;
        group.add(branch);
      }

      // Hanging Chain Lantern on one major bough
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8, 4), this.materials.darkIron);
      chain.position.set(9, 23, 0);
      group.add(chain);

      const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), this.materials.fireGold);
      lantern.position.set(9, 18, 0);
      group.add(lantern);

      return group;
    }

    // 6. Druidic Megalith Monolith (Menhir)
    createStoneMenhir(rng) {
      const group = new THREE.Group();
      const stoneMat = this.materials.mossStone;

      // Heavy Chiseled Hexagonal Menhir
      const menhir = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 7.5, 30, 6), stoneMat);
      menhir.position.y = 15;
      menhir.rotation.y = rng() * Math.PI;
      group.add(menhir);

      // Glowing Runic Engraving band
      const runes = new THREE.Mesh(
        new THREE.RingGeometry(2, 5, 6),
        new THREE.MeshBasicMaterial({ color: 0x00e676, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      runes.position.set(0, 16, 4.2);
      group.add(runes);

      return group;
    }

    // 7. Heavy Fortified Spiked War Barricade
    createBarricade() {
      const group = new THREE.Group();
      const woodMat = this.materials.wood;
      const ironMat = this.materials.darkIron;

      // Heavy Squared Timber Beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(28, 3.2, 3.2), woodMat);
      beam.position.y = 5.5;
      group.add(beam);

      // 2 Crossed Timber Trestles with Iron Bolts
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

      // 5 Sharpened Steel-Tipped Stakes
      for (let s = -2; s <= 2; s++) {
        const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.8, 15, 6), woodMat);
        stake.position.set(s * 5.8, 6, 0);
        stake.rotation.x = 0.85;
        group.add(stake);

        // Steel tip
        const tip = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.5, 6), ironMat);
        tip.position.set(s * 5.8, 11.5, 4.5);
        tip.rotation.x = 0.85;
        group.add(tip);
      }

      // Heavy Iron War Trophy Shield Mounted on Front
      const trophyShield = new THREE.Mesh(new THREE.BoxGeometry(6.5, 8.5, 1.2), ironMat);
      trophyShield.position.set(0, 5.5, 3.2);
      trophyShield.rotation.x = 0.15;
      group.add(trophyShield);

      const trophyBoss = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.0, 6), this.materials.gildedTrim);
      trophyBoss.position.set(0, 5.5, 4.2);
      trophyBoss.rotation.x = Math.PI / 2;
      group.add(trophyBoss);

      return group;
    }

    // 8. Wrought-Iron Gothic Cemetery Railing
    createFence() {
      const group = new THREE.Group();
      const stoneMat = this.materials.darkGothicStone;
      const ironMat = this.materials.darkIron;

      // Stone Curb Plinth
      const curb = new THREE.Mesh(new THREE.BoxGeometry(26, 2, 4), stoneMat);
      curb.position.y = 1;
      group.add(curb);

      // 2 Stone Posts with Pyramid Caps
      for (let p of [-12, 12]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), stoneMat);
        post.position.set(p, 6, 0);
        group.add(post);

        const cap = new THREE.Mesh(new THREE.ConeGeometry(2.5, 3, 4), stoneMat);
        cap.position.set(p, 13, 0);
        cap.rotation.y = Math.PI / 4;
        group.add(cap);
      }

      // 2 Horizontal Wrought-Iron Rails
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 0.8), ironMat);
      rail1.position.set(0, 4.5, 0);
      group.add(rail1);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 0.8), ironMat);
      rail2.position.set(0, 9.5, 0);
      group.add(rail2);

      // 6 Vertical Pickets with Spear Finials
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

    clear() {
      if (this.arenaGroup) {
        this.scene.remove(this.arenaGroup);
        this.arenaGroup = null;
      }
      if (this.groundTexture) {
        this.groundTexture.dispose();
        this.groundTexture = null;
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
      this.activeTorches = [];
    }
  }

  window.MedievalSurvivors.GenerativeMap3D = GenerativeMap3D;
})();


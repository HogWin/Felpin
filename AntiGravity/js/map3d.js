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
      fogColor: 0x090710,
      fogDensity: 0.0011,
      ambientColor: 0x3d354a,
      dirLightColor: 0x9fa8da,
      dirLightIntensity: 0.85,
      groundTones: ['#1d1926', '#262033', '#16131c', '#332b45'],
      accentProps: ['pillar', 'broken_pillar', 'brazier', 'arch', 'statue']
    },
    {
      id: 'necropolis',
      name: 'Necrópole dos Reis Esquecidos',
      subtitle: 'Catacumbas e Criptas Ancestrais',
      icon: '⚰️',
      fogColor: 0x051210,
      fogDensity: 0.0012,
      ambientColor: 0x243e38,
      dirLightColor: 0x80cbc4,
      dirLightIntensity: 0.75,
      groundTones: ['#121d1b', '#192825', '#0f1715', '#243b37'],
      accentProps: ['tombstone', 'sarcophagus', 'brazier_green', 'bone_pile', 'crypt_pillar']
    },
    {
      id: 'forest',
      name: 'Floresta Sombria de Morghul',
      subtitle: 'Bosque Amaldiçoado pela Peste',
      icon: '🌲',
      fogColor: 0x0a140a,
      fogDensity: 0.0011,
      ambientColor: 0x273b28,
      dirLightColor: 0xa5d6a7,
      dirLightIntensity: 0.8,
      groundTones: ['#152014', '#1f2e1e', '#111910', '#2d422c'],
      accentProps: ['dead_tree', 'stone_menhir', 'fence', 'brazier', 'stump']
    },
    {
      id: 'crimson',
      name: 'Fortaleza do Carrasco Carmesim',
      subtitle: 'Bastião das Sombras e Cinzas',
      icon: '🏰',
      fogColor: 0x140507,
      fogDensity: 0.0011,
      ambientColor: 0x4a2024,
      dirLightColor: 0xffab91,
      dirLightIntensity: 0.9,
      groundTones: ['#241215', '#33191e', '#1a0d0f', '#422127'],
      accentProps: ['spiked_barricade', 'brazier_red', 'pillar', 'broken_pillar', 'iron_maiden']
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
        stone: new THREE.MeshStandardMaterial({ color: 0x545b63, roughness: 0.85, metalness: 0.1 }),
        darkStone: new THREE.MeshStandardMaterial({ color: 0x2e3238, roughness: 0.8 }),
        mossStone: new THREE.MeshStandardMaterial({ color: 0x3d473b, roughness: 0.9 }),
        wood: new THREE.MeshStandardMaterial({ color: 0x422d1b, roughness: 0.85 }),
        iron: new THREE.MeshStandardMaterial({ color: 0x23272b, metalness: 0.8, roughness: 0.35 }),
        fireGold: new THREE.MeshBasicMaterial({ color: 0xff7700 }),
        fireGreen: new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
        fireRed: new THREE.MeshBasicMaterial({ color: 0xff2222 }),
        bone: new THREE.MeshStandardMaterial({ color: 0xd8cca8, roughness: 0.7 })
      };
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

    buildBoundedArena() {
      this.arenaGroup = new THREE.Group();
      const rng = this.prng;
      const hs = this.halfSize; // 1600

      // 1. Single unified SQUARE ground floor with detailed flagstone texture
      const groundGeo = new THREE.PlaneGeometry(this.arenaSize, this.arenaSize, 1, 1);
      groundGeo.rotateX(-Math.PI / 2);
      const groundMesh = new THREE.Mesh(groundGeo, this.groundMaterial);
      groundMesh.position.set(0, 0, 0);
      this.arenaGroup.add(groundMesh);

      // Outer darkened perimeter abyss plane (outside the fortress walls)
      const abyssGeo = new THREE.PlaneGeometry(this.arenaSize + 1400, this.arenaSize + 1400, 1, 1);
      abyssGeo.rotateX(-Math.PI / 2);
      const abyssMat = new THREE.MeshBasicMaterial({ color: 0x030205 });
      const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat);
      abyssMesh.position.set(0, -0.6, 0);
      this.arenaGroup.add(abyssMesh);

      // 2. High-Performance Perimeter Walls on the 4 Edges of the Square
      const step = 50;
      const count = Math.floor((this.arenaSize) / step);

      for (let i = 0; i <= count; i++) {
        const offset = -hs + (i * step);

        // North Wall (Z = -hs)
        const wallN = this.createBoundaryWallPiece(this.currentBiome.id, 0, rng);
        if (wallN) {
          wallN.position.set(offset, 0, -hs);
          wallN.rotation.y = 0;
          this.arenaGroup.add(wallN);
        }

        // South Wall (Z = +hs)
        const wallS = this.createBoundaryWallPiece(this.currentBiome.id, Math.PI, rng);
        if (wallS) {
          wallS.position.set(offset, 0, hs);
          wallS.rotation.y = Math.PI;
          this.arenaGroup.add(wallS);
        }

        // West Wall (X = -hs)
        const wallW = this.createBoundaryWallPiece(this.currentBiome.id, -Math.PI / 2, rng);
        if (wallW) {
          wallW.position.set(-hs, 0, offset);
          wallW.rotation.y = Math.PI / 2;
          this.arenaGroup.add(wallW);
        }

        // East Wall (X = +hs)
        const wallE = this.createBoundaryWallPiece(this.currentBiome.id, Math.PI / 2, rng);
        if (wallE) {
          wallE.position.set(hs, 0, offset);
          wallE.rotation.y = -Math.PI / 2;
          this.arenaGroup.add(wallE);
        }
      }

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
        this.arenaGroup.add(tower);
      });

      // 3. Central Sanctuary Courtyard (Braziers around start area)
      const sanctuaryCorners = [
        [-120, -120], [120, -120], [-120, 120], [120, 120]
      ];
      sanctuaryCorners.forEach(([bx, bz]) => {
        const brazier = this.createBrazier('gold', rng);
        brazier.position.set(bx, 0, bz);
        this.arenaGroup.add(brazier);
        if (brazier._light && this.activeTorches.length < 2) {
          this.activeTorches.push(brazier._light);
        }
      });

      // 4. Randomized Thematic Interior Props scattered throughout the vast square arena
      const propCount = 75 + Math.floor(rng() * 15);
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
          this.arenaGroup.add(prop);

          if (prop._light && this.activeTorches.length < 2) {
            this.activeTorches.push(prop._light);
          }
        }
      }

      this.scene.add(this.arenaGroup);
    }

    createCornerTower(rng) {
      const group = new THREE.Group();
      // Octagonal/square heavy bastion base
      const base = new THREE.Mesh(new THREE.BoxGeometry(32, 48, 32), this.materials.darkStone);
      base.position.y = 24;
      group.add(base);

      // Tower upper battlements
      const top = new THREE.Mesh(new THREE.BoxGeometry(36, 12, 36), this.materials.stone);
      top.position.y = 54;
      group.add(top);

      // Corner pinnacle spire
      const spire = new THREE.Mesh(new THREE.ConeGeometry(9, 26, 4), this.materials.darkStone);
      spire.position.y = 73;
      spire.rotation.y = Math.PI / 4;
      group.add(spire);

      return group;
    }

    createBoundaryWallPiece(biomeId, angle, rng) {
      const group = new THREE.Group();

      if (biomeId === 'forest') {
        // Ancient dead giant oak barrier with druidic menhir
        const tree = this.createDeadTree(rng);
        tree.scale.set(1.5, 1.8, 1.5);
        group.add(tree);
        const menhir = this.createStoneMenhir(rng);
        menhir.position.set(18, 0, 0);
        group.add(menhir);
      } else if (biomeId === 'crimson') {
        // Spiked gothic fortress barricade with obsidian pillar
        const barricade = this.createBarricade();
        barricade.scale.set(1.4, 1.4, 1.4);
        group.add(barricade);

        const pillar = this.createPillar(false);
        pillar.position.set(18, 0, 0);
        group.add(pillar);
      } else if (biomeId === 'necropolis') {
        // High crypt stone wall with sarcophagus & cross
        const slab = new THREE.Mesh(new THREE.BoxGeometry(34, 28, 6), this.materials.darkStone);
        slab.position.y = 14;
        group.add(slab);

        const battlement = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 7), this.materials.stone);
        battlement.position.set(0, 30, 0);
        group.add(battlement);

        const cross = new THREE.Mesh(new THREE.BoxGeometry(2, 9, 1), this.materials.mossStone);
        cross.position.set(0, 18, 3.2);
        group.add(cross);
      } else {
        // Ruínas de Valoria: Colossal fortress battlements & arches
        const wall = new THREE.Mesh(new THREE.BoxGeometry(38, 30, 7), this.materials.stone);
        wall.position.y = 15;
        group.add(wall);

        const crenel1 = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 8), this.materials.darkStone);
        crenel1.position.set(-12, 32, 0);
        group.add(crenel1);

        const crenel2 = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 8), this.materials.darkStone);
        crenel2.position.set(12, 32, 0);
        group.add(crenel2);
      }

      return group;
    }

    createProceduralGroundTexture(biome) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const tones = biome.groundTones;

      // Base background
      ctx.fillStyle = tones[0];
      ctx.fillRect(0, 0, 512, 512);

      // Procedural flagstones & cobblestone grid
      const brickW = 64;
      const brickH = 32;
      ctx.lineWidth = 2.5;

      for (let y = 0; y < 512; y += brickH) {
        const offset = (Math.floor(y / brickH) % 2) * (brickW / 2);
        for (let x = -offset; x < 512; x += brickW) {
          const toneIdx = Math.floor(Math.random() * tones.length);
          ctx.fillStyle = tones[toneIdx];
          ctx.fillRect(x + 2, y + 2, brickW - 4, brickH - 4);

          // Dark mortar joint
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.strokeRect(x + 1, y + 1, brickW - 2, brickH - 2);

          // Cracked details or mossy accents
          if (Math.random() > 0.65) {
            ctx.fillStyle = (biome.id === 'forest') ? 'rgba(46, 204, 113, 0.18)' : 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(x + 4, y + 4, brickW - 8, brickH - 8);
          }
        }
      }

      // Add noise grain
      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(36, 36);
      return texture;
    }

    // Real-time update for torch flames and braziers (0 chunk allocations during gameplay!)
    update(playerX, playerZ) {
      const time = Date.now() / 150;
      for (let i = 0; i < this.activeTorches.length; i++) {
        const t = this.activeTorches[i];
        if (t && t.light) {
          t.light.intensity = t.baseIntensity + Math.sin(time + t.phase) * 0.25 + (Math.random() - 0.5) * 0.12;
        }
      }
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
        case 'spiked_barricade':
          return this.createBarricade();
        default:
          return this.createPillar(true);
      }
    }

    // 1. Ancient Stone Pillar
    createPillar(broken = false) {
      const group = new THREE.Group();
      const height = broken ? 14 : 36;

      const base = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 10), this.materials.stone);
      base.position.y = 2;
      group.add(base);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, height, 8), this.materials.stone);
      shaft.position.y = 2 + height / 2;
      group.add(shaft);

      if (!broken) {
        const capital = new THREE.Mesh(new THREE.BoxGeometry(11, 4, 11), this.materials.stone);
        capital.position.y = height + 4;
        group.add(capital);
      } else {
        // Fallen broken chunk beside it
        const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5), this.materials.stone);
        rubble.position.set(6, 3, 2);
        group.add(rubble);
      }

      return group;
    }

    // 2. Burning Gothic Brazier with PointLight
    createBrazier(colorType = 'gold', rng) {
      const group = new THREE.Group();
      const mat = this.materials.iron;

      // Stand tripod & bowl
      const base = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 6, 2, 6), mat);
      base.position.y = 1;
      group.add(base);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 12, 6), mat);
      shaft.position.y = 7;
      group.add(shaft);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 3.5, 4.5, 8), mat);
      bowl.position.y = 14;
      group.add(bowl);

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

      const flame = new THREE.Mesh(new THREE.ConeGeometry(3.8, 8, 6), fireMat);
      flame.position.y = 18;
      group.add(flame);

      // Real 3D PointLight - keep maximum 2 active across scene to avoid GPU lighting shader bottlenecks
      if (this.activeTorches.length < 2) {
        const light = new THREE.PointLight(lightHex, 1.1, 120, 1.6);
        light.position.y = 18;
        group.add(light);

        group._light = {
          light: light,
          baseIntensity: 1.1,
          phase: (rng ? rng() : Math.random()) * Math.PI * 2
        };
      }

      return group;
    }

    // 3. Ornate Tombstone with Gothic Cross
    createTombstone(rng) {
      const group = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(7, 12, 2.2), this.materials.darkStone);
      slab.position.y = 6;
      group.add(slab);

      const topCurve = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2.2, 8), this.materials.darkStone);
      topCurve.rotation.z = Math.PI / 2;
      topCurve.position.y = 12;
      group.add(topCurve);

      // Cross engraving
      const cross = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 0.4), this.materials.mossStone);
      cross.position.set(0, 8, 1.2);
      group.add(cross);

      // Tilt slightly for ancient weathering
      group.rotation.z = (rng() - 0.5) * 0.25;
      group.rotation.x = (rng() - 0.5) * 0.2;

      return group;
    }

    // 4. Stone Sarcophagus
    createSarcophagus() {
      const group = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 22), this.materials.darkStone);
      base.position.y = 3;
      group.add(base);

      const lid = new THREE.Mesh(new THREE.BoxGeometry(11, 3, 23), this.materials.stone);
      lid.position.y = 7.5;
      lid.rotation.y = 0.08; // slightly askew
      group.add(lid);

      return group;
    }

    // 5. Twisted Dead Tree
    createDeadTree(rng) {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 5, 28, 6), this.materials.wood);
      trunk.position.y = 14;
      trunk.rotation.z = (rng() - 0.5) * 0.15;
      group.add(trunk);

      // Gnarled branches
      for (let b = 0; b < 4; b++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.8, 14, 5), this.materials.wood);
        branch.position.set(0, 20 + b * 2, 0);
        branch.rotation.z = 0.6 * ((b % 2 === 0) ? 1 : -1);
        branch.rotation.y = (b * Math.PI) / 2;
        group.add(branch);
      }

      return group;
    }

    // 6. Druidic Standing Stone (Menhir)
    createStoneMenhir(rng) {
      const group = new THREE.Group();
      const menhir = new THREE.Mesh(new THREE.ConeGeometry(5, 26, 5), this.materials.mossStone);
      menhir.position.y = 13;
      menhir.rotation.y = rng() * Math.PI;
      group.add(menhir);
      return group;
    }

    // 7. Spiked Wooden Barricade
    createBarricade() {
      const group = new THREE.Group();
      const beam = new THREE.Mesh(new THREE.BoxGeometry(26, 2.5, 2.5), this.materials.wood);
      beam.position.y = 5;
      group.add(beam);

      for (let s = -2; s <= 2; s++) {
        const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.4, 14, 4), this.materials.wood);
        spike.position.set(s * 5.5, 5, 0);
        spike.rotation.x = Math.PI / 4;
        group.add(spike);
      }
      return group;
    }

    // 8. Broken Wooden Fence
    createFence() {
      const group = new THREE.Group();
      const post1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 10, 5), this.materials.wood);
      post1.position.set(-10, 5, 0);
      group.add(post1);
      const post2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 10, 5), this.materials.wood);
      post2.position.set(10, 5, 0);
      group.add(post2);

      const plank = new THREE.Mesh(new THREE.BoxGeometry(22, 1.8, 0.8), this.materials.wood);
      plank.position.set(0, 6, 0);
      plank.rotation.z = -0.08;
      group.add(plank);

      return group;
    }

    clear() {
      if (this.arenaGroup) {
        this.scene.remove(this.arenaGroup);
        this.arenaGroup = null;
      }
      this.activeTorches = [];
    }
  }

  window.MedievalSurvivors.GenerativeMap3D = GenerativeMap3D;
})();


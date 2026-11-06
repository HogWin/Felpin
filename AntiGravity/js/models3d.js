/**
 * Medieval Survivors - 3D Models & Procedural Mesh Architecture (Three.js)
 * High-detail procedural low-poly & stylized 3D models with articulated limbs and animations.
 */

window.MedievalSurvivors = window.MedievalSurvivors || {};

(function() {
  const THREE = window.THREE;

  // Shared Materials Palette with stylized gothic/medieval tones
  const materials = {
    steel: new THREE.MeshStandardMaterial({ color: 0x9cb0bf, metalness: 0.55, roughness: 0.35, emissive: 0x141820, emissiveIntensity: 0.15 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x3d4757, metalness: 0.45, roughness: 0.45, emissive: 0x181e28, emissiveIntensity: 0.18 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xe5a93b, metalness: 0.70, roughness: 0.32, emissive: 0x4d3400, emissiveIntensity: 0.28 }),
    royalRed: new THREE.MeshStandardMaterial({ color: 0xaa1c29, roughness: 0.6, emissive: 0x30060a, emissiveIntensity: 0.2 }),
    crimsonCloth: new THREE.MeshStandardMaterial({ color: 0x9b111e, roughness: 0.7, emissive: 0x2e0508, emissiveIntensity: 0.2, side: THREE.DoubleSide }),
    rangerGreen: new THREE.MeshStandardMaterial({ color: 0x2e7d44, roughness: 0.65, emissive: 0x0a2812, emissiveIntensity: 0.2 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x6e4a32, roughness: 0.75, emissive: 0x22130a, emissiveIntensity: 0.15 }),
    darkCloth: new THREE.MeshStandardMaterial({ color: 0x30283d, roughness: 0.7, emissive: 0x161020, emissiveIntensity: 0.2, side: THREE.DoubleSide }),
    pyroOrange: new THREE.MeshStandardMaterial({ color: 0xd34213, roughness: 0.6, emissive: 0x3d1000, emissiveIntensity: 0.25 }),
    flameGlow: new THREE.MeshBasicMaterial({ color: 0xff6600 }),
    paladinGold: new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.70, roughness: 0.28, emissive: 0x5a3e00, emissiveIntensity: 0.35 }),
    holyGlow: new THREE.MeshBasicMaterial({ color: 0xffea79, transparent: true, opacity: 0.85 }),
    bone: new THREE.MeshStandardMaterial({ color: 0xeae3d2, roughness: 0.55, emissive: 0x2b2822, emissiveIntensity: 0.18 }),
    boneDark: new THREE.MeshStandardMaterial({ color: 0xb5ac9a, roughness: 0.6, emissive: 0x22201b, emissiveIntensity: 0.16 }),
    ratFur: new THREE.MeshStandardMaterial({ color: 0x5a483e, roughness: 0.8, emissive: 0x1c1410, emissiveIntensity: 0.15 }),
    diseasedSkin: new THREE.MeshStandardMaterial({ color: 0x668038, roughness: 0.7, emissive: 0x1c280e, emissiveIntensity: 0.2 }),
    glowingRed: new THREE.MeshBasicMaterial({ color: 0xff1744 }),
    glowingCyan: new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    glowingViolet: new THREE.MeshBasicMaterial({ color: 0xbb86fc }),
    glowingGreen: new THREE.MeshBasicMaterial({ color: 0x00e676 }),
    peasantClothes: new THREE.MeshStandardMaterial({ color: 0x7a6550, roughness: 0.8, emissive: 0x231b14, emissiveIntensity: 0.18 }),
    skinPale: new THREE.MeshStandardMaterial({ color: 0xd4c6af, roughness: 0.6, emissive: 0x2e2920, emissiveIntensity: 0.15 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x5c4228, roughness: 0.8, emissive: 0x1c1208, emissiveIntensity: 0.15 }),
    stoneGrey: new THREE.MeshStandardMaterial({ color: 0x6b7278, roughness: 0.75, emissive: 0x1c2024, emissiveIntensity: 0.15 }),
    stoneMoss: new THREE.MeshStandardMaterial({ color: 0x56634d, roughness: 0.8, emissive: 0x182014, emissiveIntensity: 0.15 }),
    blackObsidian: new THREE.MeshStandardMaterial({ color: 0x25272e, metalness: 0.5, roughness: 0.4, emissive: 0x101115, emissiveIntensity: 0.2 }),
    magmaBasalt: new THREE.MeshStandardMaterial({ color: 0x36323c, roughness: 0.8, metalness: 0.15, emissive: 0x181014, emissiveIntensity: 0.22 }),
    magmaVein: new THREE.MeshStandardMaterial({ color: 0xff3b00, emissive: 0xff5500, emissiveIntensity: 1.6, roughness: 0.25 }),
    magmaCore: new THREE.MeshBasicMaterial({ color: 0xff6a00 }),
    imperialPurple: new THREE.MeshStandardMaterial({ color: 0x381254, roughness: 0.65, emissive: 0x1c0530, emissiveIntensity: 0.35, side: THREE.DoubleSide }),
    imperialGold: new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.75, roughness: 0.26, emissive: 0x5a3e00, emissiveIntensity: 0.4 }),
    amethystGem: new THREE.MeshStandardMaterial({ color: 0x8e44ad, metalness: 0.5, roughness: 0.2, emissive: 0x732d91, emissiveIntensity: 0.7 }),
    orcSkin: new THREE.MeshStandardMaterial({ color: 0x3c6633, roughness: 0.68, emissive: 0x152810, emissiveIntensity: 0.2 }),
    orcTusk: new THREE.MeshStandardMaterial({ color: 0xf7f2e4, roughness: 0.4, emissive: 0x333026, emissiveIntensity: 0.15 }),
    zombieSkin: new THREE.MeshStandardMaterial({ color: 0x637a56, roughness: 0.75, emissive: 0x1e2b19, emissiveIntensity: 0.2 }),
    spectralShroud: new THREE.MeshStandardMaterial({ color: 0x266470, transparent: true, opacity: 0.86, roughness: 0.4, emissive: 0x0f3e48, emissiveIntensity: 0.48, side: THREE.DoubleSide }),
    spectralGlow: new THREE.MeshBasicMaterial({ color: 0x00ffcc }),
    hitFlash: new THREE.MeshBasicMaterial({ color: 0xff3333 })
  };

  for (const k in materials) {
    if (materials[k]) materials[k]._isShared = true;
  }

  // Pre-compiled shared unit geometries and materials to avoid GC thrashing and GPU buffer leaks
  const unitCircleGeo = new THREE.CircleGeometry(1, 14);
  unitCircleGeo.rotateX(-Math.PI / 2);
  unitCircleGeo._isShared = true;

  const sharedShadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
  sharedShadowMat._isShared = true;

  const unitRingGeo = new THREE.RingGeometry(0.85, 1.0, 22);
  unitRingGeo.rotateX(-Math.PI / 2);
  unitRingGeo._isShared = true;

  const unitRingBossGeo = new THREE.RingGeometry(0.85, 1.0, 32);
  unitRingBossGeo.rotateX(-Math.PI / 2);
  unitRingBossGeo._isShared = true;

  const unitDiscGeo = new THREE.CircleGeometry(0.85, 16);
  unitDiscGeo.rotateX(-Math.PI / 2);
  unitDiscGeo._isShared = true;

  const unitDiscBossGeo = new THREE.CircleGeometry(0.85, 24);
  unitDiscBossGeo.rotateX(-Math.PI / 2);
  unitDiscBossGeo._isShared = true;

  const threatRingMatRegular = new THREE.MeshBasicMaterial({ color: 0xff3838, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  threatRingMatRegular._isShared = true;

  const threatRingMatElite = new THREE.MeshBasicMaterial({ color: 0xffa502, transparent: true, opacity: 0.88, side: THREE.DoubleSide });
  threatRingMatElite._isShared = true;

  const threatRingMatBoss = new THREE.MeshBasicMaterial({ color: 0xff1744, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
  threatRingMatBoss._isShared = true;

  const threatFillMatRegular = new THREE.MeshBasicMaterial({ color: 0x990000, transparent: true, opacity: 0.14, side: THREE.DoubleSide });
  threatFillMatRegular._isShared = true;

  const threatFillMatElite = new THREE.MeshBasicMaterial({ color: 0xd35400, transparent: true, opacity: 0.20, side: THREE.DoubleSide });
  threatFillMatElite._isShared = true;

  const threatFillMatBoss = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  threatFillMatBoss._isShared = true;

  // Shared XP Gem geometries and materials
  const sharedGemGeos = {
    purple: new THREE.DodecahedronGeometry(5),
    gold: new THREE.OctahedronGeometry(4.2),
    silver: new THREE.OctahedronGeometry(3.6),
    bronze: new THREE.OctahedronGeometry(3.0)
  };
  sharedGemGeos.purple._isShared = true;
  sharedGemGeos.gold._isShared = true;
  sharedGemGeos.silver._isShared = true;
  sharedGemGeos.bronze._isShared = true;

  const sharedGemMats = {
    purple: materials.glowingViolet,
    gold: new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xb8860b, emissiveIntensity: 0.8, roughness: 0.2 }),
    silver: new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x007799, emissiveIntensity: 0.8, roughness: 0.2 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x38ef7d, emissive: 0x117733, emissiveIntensity: 0.7, roughness: 0.3 })
  };
  sharedGemMats.purple._isShared = true;
  sharedGemMats.gold._isShared = true;
  sharedGemMats.silver._isShared = true;
  sharedGemMats.bronze._isShared = true;

  // =========================================================================
  // GLSL SHADER HOOKS: GPU Hit Flash & Death Dissolve Progress
  // =========================================================================
  let _glslHookCounter = 0;
  function applyGLSLHooks(mat) {
    if (!mat) return mat;
    mat.userData = mat.userData || {};
    if (!mat.userData.uHitFlash) mat.userData.uHitFlash = { value: 0.0 };
    if (!mat.userData.uDissolveProgress) mat.userData.uDissolveProgress = { value: 0.0 };
    if (!mat.userData.uTime) mat.userData.uTime = { value: 0.0 };

    // Unique program cache key per material instance to prevent uniform cross-contamination
    const hookId = ++_glslHookCounter;
    mat.customProgramCacheKey = function() {
      return 'glsl_hook_inst_' + hookId;
    };

    const oldOnBeforeCompile = mat.onBeforeCompile;
    mat.onBeforeCompile = function(shader, renderer) {
      if (oldOnBeforeCompile) oldOnBeforeCompile(shader, renderer);

      shader.uniforms.uHitFlash = mat.userData.uHitFlash;
      shader.uniforms.uDissolveProgress = mat.userData.uDissolveProgress;
      shader.uniforms.uTime = mat.userData.uTime;

      // Pass world position from vertex shader to fragment shader
      shader.vertexShader = 'varying vec3 vGpuWorldPos;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `void main() {
        vGpuWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
      );

      // Fragment shader: GPU Hit Flash & Death Dissolve
      shader.fragmentShader = `uniform float uHitFlash;\nuniform float uDissolveProgress;\nuniform float uTime;\nvarying vec3 vGpuWorldPos;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>

        // --- GLSL DISSOLVE EFFECT ON DEATH (Ash/Ember Disintegration) ---
        if (uDissolveProgress > 0.03) {
          float n1 = fract(sin(dot(vGpuWorldPos.xz * 0.14, vec2(12.9898, 78.233))) * 43758.5453);
          float n2 = fract(sin(dot(vGpuWorldPos.yx * 0.20, vec2(93.9898, 67.345))) * 24634.6345);
          float noise = (n1 + n2) * 0.5;
          float threshold = uDissolveProgress * 1.25;
          float edge = threshold - noise;
          if (edge > 0.10) {
            discard;
          } else if (edge > 0.0) {
            // Radiant golden-orange ember edge, never black
            vec3 ember = mix(vec3(1.2, 0.65, 0.15) * 2.2, vec3(0.9, 0.3, 0.05), edge / 0.10);
            gl_FragColor.rgb = ember;
          }
        }

        // --- GLSL GPU HIT FLASH ---
        if (uHitFlash > 0.001) {
          vec3 flashColor = vec3(1.0, 0.35, 0.35);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, flashColor, clamp(uHitFlash * 0.85, 0.0, 0.85));
        }`
      );
    };
    return mat;
  }

  // Flashable material creator equipped with GLSL GPU hooks
  function createFlashable(baseMat) {
    if (!baseMat) return baseMat;
    const m = baseMat.clone ? baseMat.clone() : baseMat;
    return applyGLSLHooks(m);
  }

  // ==========================================
  // 1. PLAYER 3D MODELS
  // ==========================================
  function createPlayerModel(classId) {
    const root = new THREE.Group();
    const anim = {
      limbs: [],
      leftLeg: null,
      rightLeg: null,
      leftArm: null,
      rightArm: null,
      cape: null,
      weapon: null,
      head: null,
      torso: null,
      aimArrow: null,
      materials: []
    };

    // Sub-hierarchy root to allow flipping / scale
    const bodyRoot = new THREE.Group();
    root.add(bodyRoot);

    // Aim Indicator Rune (2D Floor disc + 2D flat directional chevron arrow)
    const aimGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(13, 14.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf0c05a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    aimGroup.add(ringMesh);

    // 2D Flat directional chevron arrow shape lying flat on the floor (y = 0.08)
    const arrowShape = new THREE.Shape();
    // Tip pointing forward along +X (at facingAngle = 0)
    arrowShape.moveTo(25.0, 0);       // Arrow tip forward (+X)
    arrowShape.lineTo(17.5, -4.0);    // Top fin
    arrowShape.lineTo(19.0, -1.4);    // Inner notch
    arrowShape.lineTo(13.5, -1.4);    // Back shaft top
    arrowShape.lineTo(13.5, 1.4);     // Back shaft bottom
    arrowShape.lineTo(19.0, 1.4);     // Inner notch
    arrowShape.lineTo(17.5, 4.0);     // Bottom fin
    arrowShape.closePath();

    const arrowGeo = new THREE.ShapeGeometry(arrowShape);
    arrowGeo.rotateX(-Math.PI / 2); // Lay flat on the ground plane (2D)
    arrowGeo.translate(0, 0.08, 0);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xf1c40f,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    aimGroup.add(arrowMesh);

    root.add(aimGroup);
    anim.aimArrow = aimGroup;

    // Build specific class models
    if (classId === 'ranger') {
      buildRangerModel(bodyRoot, anim);
    } else if (classId === 'pyromancer') {
      buildPyromancerModel(bodyRoot, anim);
    } else if (classId === 'paladin') {
      buildPaladinModel(bodyRoot, anim);
    } else if (classId === 'berserker') {
      buildBerserkerModel(bodyRoot, anim);
    } else if (classId === 'necromancer') {
      buildNecromancerModel(bodyRoot, anim);
    } else if (classId === 'assassin') {
      buildAssassinModel(bodyRoot, anim);
    } else if (classId === 'dark_knight') {
      buildDarkKnightPlayerModel(bodyRoot, anim);
    } else if (classId === 'plague_alchemist') {
      buildPlagueAlchemistModel(bodyRoot, anim);
    } else {
      buildKnightModel(bodyRoot, anim);
    }

    // Base contact shadow
    const shadowGeo = new THREE.CircleGeometry(14, 20);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.y = 0.15;
    root.add(shadow);

    // Indicador visual de Hitbox do Personagem no chao (Raio 21 exato)
    const hitboxGroup = new THREE.Group();
    hitboxGroup.position.y = 0.22;

    const hitboxRingGeo = new THREE.RingGeometry(19.8, 21.6, 36);
    hitboxRingGeo.rotateX(-Math.PI / 2);
    const hitboxRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const hitboxRing = new THREE.Mesh(hitboxRingGeo, hitboxRingMat);
    hitboxGroup.add(hitboxRing);

    const hitboxFillGeo = new THREE.CircleGeometry(19.8, 24);
    hitboxFillGeo.rotateX(-Math.PI / 2);
    const hitboxFillMat = new THREE.MeshBasicMaterial({
      color: 0x00d2d3,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const hitboxFill = new THREE.Mesh(hitboxFillGeo, hitboxFillMat);
    hitboxGroup.add(hitboxFill);

    // 4 Marcadores táticos cardeais no anel de hitbox
    const tickGeo = new THREE.BoxGeometry(1.6, 0.4, 4.5);
    const tickMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      const tick = new THREE.Mesh(tickGeo, tickMat);
      const angle = (tIdx * Math.PI) / 2;
      tick.position.set(Math.cos(angle) * 20.7, 0.05, Math.sin(angle) * 20.7);
      tick.rotation.y = -angle;
      hitboxGroup.add(tick);
    }
    root.add(hitboxGroup);

    // Update animation hook
    root.updateVisuals = function(dt, player) {
      const isMoving = Math.hypot(player.vx, player.vy) > 10;
      const walk = player.walkCycle || 0;

      // Pulse and update hitbox ring
      if (player.invulnerableTimer > 0) {
        hitboxRingMat.color.setHex(0xff4757);
        hitboxFillMat.color.setHex(0xff4757);
        hitboxRingMat.opacity = Math.floor(Date.now() / 100) % 2 === 0 ? 0.95 : 0.3;
      } else {
        hitboxRingMat.color.setHex(0x00f2fe);
        hitboxFillMat.color.setHex(0x00d2d3);
        hitboxRingMat.opacity = 0.75 + Math.sin(Date.now() / 350) * 0.15;
      }

      // Rotate root to face direction
      bodyRoot.rotation.y = -player.facingAngle + Math.PI / 2;

      // Aim arrow stays on ground pointing at player's facing angle
      aimGroup.rotation.y = -player.facingAngle;

      // 1. Locomocao & Sincronizacao de Passos dos Herois (Cavaleiro, Arqueira, Alquimista & Piromante)
      const inSwordSlash = player.swordAttackTimer > 0;
      const inShootAnim = player.shootAnimTimer > 0;
      const inToss = player.tossAnimTimer > 0;
      const inCastAnim = (player.castAnimTimer || 0) > 0;

      if (isMoving) {
        if (anim.isPyromancer) {
          const legSwing = Math.sin(walk) * 0.28;
          if (anim.leftLeg) anim.leftLeg.rotation.x = legSwing;
          if (anim.rightLeg) anim.rightLeg.rotation.x = -legSwing;
          bodyRoot.position.y = Math.abs(Math.sin(walk * 2)) * 0.9;

          if (anim.robe) {
            anim.robe.rotation.z = Math.sin(walk) * 0.06;
            anim.robe.rotation.y = -Math.sin(walk) * 0.05;
            anim.robe.rotation.x = 0.06 + Math.abs(Math.sin(walk)) * 0.03;
          }
        } else {
          const legSwing = Math.sin(walk) * 0.72;
          if (anim.leftLeg) anim.leftLeg.rotation.x = legSwing;
          if (anim.rightLeg) anim.rightLeg.rotation.x = -legSwing;
          bodyRoot.position.y = Math.abs(Math.sin(walk * 2)) * 1.6;
        }

        // Torcao de marcha do torso
        if (anim.torso && !inSwordSlash && !inShootAnim && !inCastAnim) {
          anim.torso.rotation.y = Math.sin(walk) * 0.12;
          anim.torso.rotation.z = Math.cos(walk) * 0.04;
        }

        // Braco Esquerdo - Apoio da Besta (Arqueira), Frasco (Alquimista), Labareda (Piromante), Escudo Torre (Paladino) ou Escudo (Cavaleiro)
        if (anim.leftArm && !inShootAnim && !inCastAnim) {
          if (anim.isRanger) {
            anim.leftArm.rotation.x = 0.65 + Math.sin(walk) * 0.08;
            anim.leftArm.rotation.y = 0.38;
            anim.leftArm.rotation.z = -0.15;
          } else if (anim.isAlchemist) {
            anim.leftArm.rotation.x = 0.35 + Math.sin(walk) * 0.15;
            anim.leftArm.rotation.y = 0.22;
            anim.leftArm.rotation.z = -0.18;
          } else if (anim.isPyromancer) {
            anim.leftArm.rotation.x = -0.35 + Math.sin(walk) * 0.15;
            anim.leftArm.rotation.y = 0.30;
            anim.leftArm.rotation.z = -0.20;
          } else if (anim.isPaladin) {
            anim.leftArm.rotation.x = 0.28 - Math.sin(walk) * 0.25;
            anim.leftArm.rotation.y = 0.38;
            anim.leftArm.rotation.z = -0.15;
          } else {
            anim.leftArm.rotation.x = 0.22 + Math.sin(walk) * 0.12;
            anim.leftArm.rotation.y = 0.32;
            anim.leftArm.rotation.z = -0.10;
          }
        }

        // Braco Direito - Empunhadura de Disparo, Cajado, Martelo Relicário, Espada ou Frasco
        if (anim.rightArm && !inSwordSlash && !inShootAnim && !inToss && !inCastAnim) {
          if (anim.isRanger) {
            anim.rightArm.rotation.x = -0.55 + Math.sin(walk) * 0.12;
            anim.rightArm.rotation.y = -0.22;
            anim.rightArm.rotation.z = 0.10 + Math.cos(walk) * 0.05;
          } else if (anim.isAlchemist) {
            anim.rightArm.rotation.x = -0.42 + Math.sin(walk) * 0.14;
            anim.rightArm.rotation.y = -0.15;
            anim.rightArm.rotation.z = 0.12 + Math.cos(walk) * 0.06;
          } else if (anim.isPyromancer) {
            anim.rightArm.rotation.x = -0.28 - Math.sin(walk) * 0.22;
            anim.rightArm.rotation.y = -0.18;
            anim.rightArm.rotation.z = 0.15;
          } else if (anim.isPaladin) {
            anim.rightArm.rotation.x = -0.35 + Math.sin(walk) * 0.35;
            anim.rightArm.rotation.y = -0.20;
            anim.rightArm.rotation.z = 0.14;
          } else {
            anim.rightArm.rotation.x = -0.26 + Math.sin(walk) * 0.16;
            anim.rightArm.rotation.y = -0.18;
            anim.rightArm.rotation.z = 0.12 + Math.cos(walk) * 0.06;
          }
        }

        // Tabardo do Paladino
        if (anim.tabard) {
          anim.tabard.rotation.x = 0.12 + Math.abs(Math.sin(walk)) * 0.08;
        }

        // Capa - Esvoaçamento aerodinâmico na corrida
        if (anim.cape && !inSwordSlash && !inShootAnim && !inCastAnim) {
          anim.cape.rotation.x = 0.42 + Math.sin(walk * 2) * 0.16;
          anim.cape.rotation.z = Math.sin(walk) * 0.10;
        }
      } else {
        if (anim.isPyromancer) {
          if (anim.leftLeg) anim.leftLeg.rotation.x = -0.12;
          if (anim.rightLeg) anim.rightLeg.rotation.x = 0.18;
          if (anim.robe) {
            anim.robe.rotation.x = 0;
            anim.robe.rotation.y = 0;
            anim.robe.rotation.z = 0;
          }
        } else {
          if (anim.leftLeg) anim.leftLeg.rotation.x = 0;
          if (anim.rightLeg) anim.rightLeg.rotation.x = 0;
        }

        // Respiracao Heroica Idle
        const breath = Math.sin(Date.now() / 420);
        bodyRoot.position.y = breath * 0.45;

        if (anim.torso && !inSwordSlash && !inShootAnim && !inCastAnim) {
          anim.torso.rotation.y = 0;
          anim.torso.rotation.z = 0;
          anim.torso.rotation.x = breath * 0.012;
        }
        if (anim.leftArm && !inShootAnim && !inCastAnim) {
          if (anim.isRanger) {
            anim.leftArm.rotation.x = 0.58 + breath * 0.015;
            anim.leftArm.rotation.y = 0.32;
            anim.leftArm.rotation.z = -0.12;
          } else if (anim.isAlchemist) {
            anim.leftArm.rotation.x = 0.28 + breath * 0.02;
            anim.leftArm.rotation.y = 0.20;
            anim.leftArm.rotation.z = -0.15;
          } else if (anim.isPyromancer) {
            anim.leftArm.rotation.x = -0.45 + breath * 0.05;
            anim.leftArm.rotation.y = 0.35;
            anim.leftArm.rotation.z = -0.25;
          } else if (anim.isPaladin) {
            anim.leftArm.rotation.x = 0.28 + breath * 0.02;
            anim.leftArm.rotation.y = 0.42;
            anim.leftArm.rotation.z = -0.15;
          } else {
            anim.leftArm.rotation.x = 0.14 + breath * 0.02;
            anim.leftArm.rotation.y = 0.25;
            anim.leftArm.rotation.z = -0.05;
          }
        }
        if (anim.rightArm && !inSwordSlash && !inShootAnim && !inToss && !inCastAnim) {
          if (anim.isRanger) {
            anim.rightArm.rotation.x = -0.48 + breath * 0.02;
            anim.rightArm.rotation.y = -0.18;
            anim.rightArm.rotation.z = 0.08;
          } else if (anim.isAlchemist) {
            anim.rightArm.rotation.x = -0.36 + breath * 0.025;
            anim.rightArm.rotation.y = -0.12;
            anim.rightArm.rotation.z = 0.10;
          } else if (anim.isPyromancer) {
            anim.rightArm.rotation.x = -0.20 + breath * 0.04;
            anim.rightArm.rotation.y = -0.15;
            anim.rightArm.rotation.z = 0.15;
          } else if (anim.isPaladin) {
            anim.rightArm.rotation.x = -0.32 + breath * 0.02;
            anim.rightArm.rotation.y = -0.22;
            anim.rightArm.rotation.z = 0.14;
          } else {
            anim.rightArm.rotation.x = -0.18 + breath * 0.03;
            anim.rightArm.rotation.y = -0.12;
            anim.rightArm.rotation.z = 0.10;
          }
        }
        if (anim.tabard) {
          anim.tabard.rotation.x = breath * 0.02;
        }
        if (anim.cape && !inSwordSlash && !inShootAnim && !inCastAnim) {
          anim.cape.rotation.x = 0.08 + Math.sin(Date.now() / 320) * 0.04;
          anim.cape.rotation.z = Math.cos(Date.now() / 400) * 0.02;
        }
      }

      // 2. Animacao de Ataque Sincronizada com a Espada (Golpe Cortante & Talho Devastador)
      if (inSwordSlash) {
        player.swordAttackTimer -= dt;
        const maxT = player.swordAttackMax || 0.28;
        const progress = 1 - Math.max(0, player.swordAttackTimer / maxT);
        const combo = (player.swordAttackCombo || 1) % 2;

        if (anim.rightArm) {
          if (combo === 1) {
            // COMBO A: Corte Diagonal Descendente (Alto-Direita -> Baixo-Esquerda)
            if (progress < 0.22) {
              // Windup: Espada ergue alto e recua acumulando inercia
              const p = progress / 0.22;
              anim.rightArm.rotation.x = -0.26 - p * 1.35;
              anim.rightArm.rotation.y = -0.18 + p * 0.70;
              anim.rightArm.rotation.z = 0.12 + p * 0.45;
              if (anim.torso) anim.torso.rotation.y = -0.32 * p;
            } else if (progress < 0.62) {
              // Cleave Impact: Arco devastador descendo e cortando pela frente
              const p = (progress - 0.22) / 0.40;
              const ease = Math.sin(p * Math.PI * 0.5);
              anim.rightArm.rotation.x = -1.61 + 3.12 * ease;
              anim.rightArm.rotation.y = 0.52 - 1.45 * ease;
              anim.rightArm.rotation.z = 0.57 - 1.05 * ease;
              if (anim.torso) anim.torso.rotation.y = -0.32 + 0.68 * ease;
              if (anim.cape) anim.cape.rotation.x = 0.25 + 0.35 * ease;
            } else {
              // Follow-through & Recovery suave para a guarda
              const p = (progress - 0.62) / 0.38;
              anim.rightArm.rotation.x = 1.51 - 1.77 * p;
              anim.rightArm.rotation.y = -0.93 + 0.75 * p;
              anim.rightArm.rotation.z = -0.48 + 0.60 * p;
              if (anim.torso) anim.torso.rotation.y = 0.36 * (1 - p);
            }
          } else {
            // COMBO B: Talho Transversal Horizontal (Varredura de Lamina Esquerda -> Direita)
            if (progress < 0.22) {
              const p = progress / 0.22;
              anim.rightArm.rotation.x = -0.26 - p * 0.65;
              anim.rightArm.rotation.y = -0.18 - p * 0.85;
              anim.rightArm.rotation.z = 0.12 - p * 0.40;
              if (anim.torso) anim.torso.rotation.y = 0.35 * p;
            } else if (progress < 0.62) {
              const p = (progress - 0.22) / 0.40;
              const ease = Math.sin(p * Math.PI * 0.5);
              anim.rightArm.rotation.x = -0.91 + 1.82 * ease;
              anim.rightArm.rotation.y = -1.03 + 2.10 * ease;
              anim.rightArm.rotation.z = -0.28 + 0.75 * ease;
              if (anim.torso) anim.torso.rotation.y = 0.35 - 0.70 * ease;
              if (anim.cape) anim.cape.rotation.x = 0.25 + 0.35 * ease;
            } else {
              const p = (progress - 0.62) / 0.38;
              anim.rightArm.rotation.x = 0.91 - 1.17 * p;
              anim.rightArm.rotation.y = 1.07 - 1.25 * p;
              anim.rightArm.rotation.z = 0.47 - 0.35 * p;
              if (anim.torso) anim.torso.rotation.y = -0.35 * (1 - p);
            }
          }
        }
      }

      // 2.2 Animacao de Disparo de Precisao da Besta (Mira Tática, Recuo e Recarga Expressa)
      if (inShootAnim) {
        player.shootAnimTimer -= dt;
        const maxT = player.shootAnimMax || 0.24;
        const progress = 1 - Math.max(0, player.shootAnimTimer / maxT);

        if (anim.rightArm) {
          if (progress < 0.28) {
            // Windup: Elevação rápida da besta alinhando a mira com os olhos
            const p = progress / 0.28;
            anim.rightArm.rotation.x = -0.48 - p * 0.85;
            anim.rightArm.rotation.y = -0.18 - p * 0.22;
            anim.rightArm.rotation.z = 0.08 + p * 0.12;
            if (anim.leftArm) {
              anim.leftArm.rotation.x = 0.58 + p * 0.35;
              anim.leftArm.rotation.y = 0.32 + p * 0.20;
            }
            if (anim.torso) anim.torso.rotation.y = -0.18 * p;
          } else if (progress < 0.60) {
            // Recoil & Release: O virote dispara! Recuo cinético para trás e leve elevação
            const p = (progress - 0.28) / 0.32;
            const ease = Math.sin(p * Math.PI);
            anim.rightArm.rotation.x = -1.33 + 0.32 * ease;
            anim.rightArm.rotation.y = -0.40 - 0.10 * ease;
            anim.rightArm.rotation.z = 0.20 - 0.08 * ease;
            if (anim.leftArm) {
              anim.leftArm.rotation.x = 0.93 - 0.18 * ease;
            }
            if (anim.torso) anim.torso.rotation.y = -0.18 - 0.08 * ease;
            if (anim.cape) anim.cape.rotation.x = 0.20 + 0.25 * ease;
          } else {
            // Recovery: Alavanca de engatilhamento e retorno fluido à mira de espreita
            const p = (progress - 0.60) / 0.40;
            anim.rightArm.rotation.x = -1.33 * (1 - p) + (-0.48) * p;
            anim.rightArm.rotation.y = -0.40 * (1 - p) + (-0.18) * p;
            anim.rightArm.rotation.z = 0.20 * (1 - p) + 0.08 * p;
            if (anim.leftArm) {
              anim.leftArm.rotation.x = 0.93 * (1 - p) + 0.58 * p;
              anim.leftArm.rotation.y = 0.52 * (1 - p) + 0.32 * p;
            }
            if (anim.torso) anim.torso.rotation.y = -0.18 * (1 - p);
          }
        }
      }

            // 2.5 Efeitos Sombrios da Arqueira (Floating Shadow Wisps & Void Flame)
      if (anim.shadowWisps && anim.shadowWisps.length > 0) {
        const timeSec = Date.now() * 0.003;
        for (let i = 0; i < anim.shadowWisps.length; i++) {
          const w = anim.shadowWisps[i];
          w.mesh.position.y = w.baseY + Math.sin(timeSec * 2.5 + w.phase) * 0.35;
          w.mesh.position.x = w.baseX + Math.cos(timeSec * 1.8 + w.phase) * 0.25;
          w.mesh.rotation.y += 0.03;
          w.mesh.rotation.z += 0.02;
          const pulse = w.baseScale * (1 + 0.22 * Math.sin(timeSec * 3.2 + w.phase));
          w.mesh.scale.set(pulse, pulse * 1.25, pulse);
        }
      }
      // 2.8 Vapores Tóxicos do Alquimista (Floating Miasma Puffs)
      if (anim.miasmaPuffs && anim.miasmaPuffs.length > 0) {
        const timeSec = Date.now() * 0.003;
        for (let i = 0; i < anim.miasmaPuffs.length; i++) {
          const p = anim.miasmaPuffs[i];
          p.mesh.position.y = p.baseY + Math.sin(timeSec * 2.2 + p.phase) * 0.45;
          p.mesh.position.x = p.baseX + Math.cos(timeSec * 1.6 + p.phase) * 0.30;
          p.mesh.rotation.y += 0.025;
          p.mesh.rotation.z += 0.02;
          const s = p.baseScale * (1 + 0.28 * Math.sin(timeSec * 3.0 + p.phase));
          p.mesh.scale.set(s, s * 1.15, s);
        }
      }

      // 3. Dynamic Overhand Throw Animation (Alchemist flask toss & projectile attacks)
      if (inToss) {
        player.tossAnimTimer -= dt;
        const maxT = player.tossAnimMax || 0.38;
        const progress = 1 - Math.max(0, player.tossAnimTimer / maxT);

        if (progress < 0.38) {
          // FASE 1: WINDUP / PREPARAÇÃO (0.00 -> 0.38) - Braço carrega para trás e cotovelo flexiona
          const p = progress / 0.38;
          const easeIn = p * p;

          if (anim.rightArm) {
            anim.rightArm.rotation.x = -0.36 + easeIn * 1.35;
            anim.rightArm.rotation.y = -0.12 - easeIn * 0.25;
            anim.rightArm.rotation.z = 0.10 + easeIn * 0.35;
          }
          if (anim.rightElbow) {
            anim.rightElbow.rotation.x = -easeIn * 1.25;
          }
          if (anim.torso) {
            anim.torso.rotation.y = easeIn * 0.32;
            anim.torso.rotation.x = -easeIn * 0.08;
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = 0.28 - easeIn * 1.10;
            anim.leftArm.rotation.y = 0.20 + easeIn * 0.25;
          }
          if (anim.weapon) {
            anim.weapon.scale.set(1, 1, 1);
          }
        } else if (progress < 0.65) {
          // FASE 2: RELEASE / ARREMESSO EXPLOSIVO (0.38 -> 0.65) - Chicoteamento vigoroso à frente
          const p = (progress - 0.38) / 0.27;
          const easeOut = 1 - Math.pow(1 - p, 3);

          if (anim.rightArm) {
            anim.rightArm.rotation.x = 0.99 - easeOut * 2.45;
            anim.rightArm.rotation.y = -0.37 + easeOut * 0.52;
            anim.rightArm.rotation.z = 0.45 - easeOut * 0.55;
          }
          if (anim.rightElbow) {
            anim.rightElbow.rotation.x = -1.25 + easeOut * 1.15;
          }
          if (anim.torso) {
            anim.torso.rotation.y = 0.32 - easeOut * 0.68;
            anim.torso.rotation.x = -0.08 + easeOut * 0.20;
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = -0.82 + easeOut * 1.20;
            anim.leftArm.rotation.y = 0.45 - easeOut * 0.25;
          }
          if (anim.weapon) {
            const s = p < 0.45 ? 1.0 : Math.max(0, 1.0 - (p - 0.45) / 0.15);
            anim.weapon.scale.set(s, s, s);
          }
        } else {
          // FASE 3: FOLLOW-THROUGH & SACAR NOVO FRASCO (0.65 -> 1.00)
          const p = (progress - 0.65) / 0.35;
          const easeOut = 1 - Math.pow(1 - p, 2);

          if (anim.rightArm) {
            anim.rightArm.rotation.x = -1.46 + easeOut * 1.10;
            anim.rightArm.rotation.y = 0.15 - easeOut * 0.27;
            anim.rightArm.rotation.z = -0.10 + easeOut * 0.20;
          }
          if (anim.rightElbow) {
            anim.rightElbow.rotation.x = -0.10 * (1 - easeOut);
          }
          if (anim.torso) {
            anim.torso.rotation.y = -0.36 * (1 - easeOut);
            anim.torso.rotation.x = 0.12 * (1 - easeOut);
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = 0.38 - easeOut * 0.10;
            anim.leftArm.rotation.y = 0.20;
          }
          if (anim.weapon) {
            const s = p < 0.35 ? 0 : Math.min(1.0, (p - 0.35) / 0.45);
            anim.weapon.scale.set(s, s, s);
          }
        }
      } else if (anim.weapon && anim.weapon.scale.x !== 1) {
        anim.weapon.scale.set(1, 1, 1);
        if (anim.rightElbow && anim.rightElbow.rotation.x !== 0) anim.rightElbow.rotation.x = 0;
      }

      // 4. Dynamic Cast Animation (Pyromancer solar flame burst & spell invocation)
      if (inCastAnim) {
        player.castAnimTimer -= dt;
        const maxT = player.castAnimMax || 0.35;
        const progress = 1 - Math.max(0, player.castAnimTimer / maxT);

        if (progress < 0.35) {
          // Fase 1: Windup & Erguimento de Cajado
          const p = progress / 0.35;
          const easeIn = p * p;
          if (anim.rightArm) {
            anim.rightArm.rotation.x = -0.20 - easeIn * 1.45;
            anim.rightArm.rotation.y = -0.15 + easeIn * 0.35;
            anim.rightArm.rotation.z = 0.15 + easeIn * 0.40;
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = -0.45 + easeIn * 0.80;
            anim.leftArm.rotation.y = 0.35 - easeIn * 0.20;
            anim.leftArm.rotation.z = -0.25;
          }
          if (anim.torso) {
            anim.torso.rotation.x = -easeIn * 0.18;
            anim.torso.rotation.y = -easeIn * 0.25;
          }
          if (anim.cape) {
            anim.cape.rotation.x = 0.25 + easeIn * 0.30;
          }
        } else if (progress < 0.65) {
          // Fase 2: Liberação Ígnea & Apontamento do Cajado
          const p = (progress - 0.35) / 0.30;
          const easeOut = 1 - Math.pow(1 - p, 3);
          if (anim.rightArm) {
            anim.rightArm.rotation.x = -1.65 + easeOut * 1.85;
            anim.rightArm.rotation.y = 0.20 - easeOut * 0.35;
            anim.rightArm.rotation.z = 0.55 - easeOut * 0.40;
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = 0.35 - easeOut * 0.80;
            anim.leftArm.rotation.y = 0.15 + easeOut * 0.20;
          }
          if (anim.torso) {
            anim.torso.rotation.x = -0.18 + easeOut * 0.28;
            anim.torso.rotation.y = -0.25 + easeOut * 0.35;
          }
          if (anim.cape) {
            anim.cape.rotation.x = 0.55 - easeOut * 0.35;
          }
        } else {
          // Fase 3: Retorno suave
          const p = (progress - 0.65) / 0.35;
          const ease = 1 - Math.pow(1 - p, 2);
          if (anim.rightArm) {
            anim.rightArm.rotation.x = 0.20 * (1 - ease) + (-0.20) * ease;
            anim.rightArm.rotation.y = -0.15;
            anim.rightArm.rotation.z = 0.15;
          }
          if (anim.leftArm) {
            anim.leftArm.rotation.x = -0.45;
            anim.leftArm.rotation.y = 0.35;
            anim.leftArm.rotation.z = -0.25;
          }
          if (anim.torso) {
            anim.torso.rotation.x = 0.10 * (1 - ease);
            anim.torso.rotation.y = 0.10 * (1 - ease);
          }
          if (anim.cape) {
            anim.cape.rotation.x = 0.20 + (1 - ease) * 0.15;
          }
        }
      }

      // 5. Partículas & Cinemática Contínua de Piromancia (Labareda Viva, Orbe Solar & Brasas)
      if (anim.isPyromancer) {
        const timeSec = Date.now() * 0.001;
        if (anim.fireParticles && anim.fireParticles.length > 0) {
          for (let i = 0; i < anim.fireParticles.length; i++) {
            const p = anim.fireParticles[i];
            if (p._sparkAngle !== undefined) {
              p._sparkAngle += dt * 3.5;
              p.position.set(
                Math.cos(p._sparkAngle) * p._sparkRadius,
                Math.sin(p._sparkAngle * 2) * 0.4,
                Math.sin(p._sparkAngle) * p._sparkRadius
              );
            } else if (p._emberAngle !== undefined) {
              p._emberAngle += dt * 2.8;
              p.position.set(
                Math.cos(p._emberAngle) * p._emberRadius,
                18.2 + Math.sin(p._emberAngle * 1.5) * 0.6,
                Math.sin(p._emberAngle) * p._emberRadius
              );
            }
          }
        }
        if (anim.staffFlame) anim.staffFlame.rotation.y += dt * 2.0;
        if (anim.staffHalo) {
          anim.staffHalo.rotation.x += dt * 1.5;
          anim.staffHalo.rotation.z += dt * 1.2;
        }
        if (anim.fireAura) {
          anim.fireAura.rotation.y += dt * 2.5;
          const auraPulse = 1.0 + Math.sin(timeSec * 6) * 0.12;
          anim.fireAura.scale.set(auraPulse, auraPulse * 1.1, auraPulse);
        }
      }

      // 6. Cinemática & Partículas do Paladino da Alvorada (Auréola Solar, Motes Sagrados & Núcleo)
      if (anim.isPaladin) {
        const timeSec = Date.now() * 0.001;
        if (anim.halo) {
          anim.halo.rotation.y += dt * 0.8;
        }
        if (anim.holyMotes && anim.holyMotes.length > 0) {
          for (let i = 0; i < anim.holyMotes.length; i++) {
            const m = anim.holyMotes[i];
            m._moteAngle += dt * 2.2;
            m.position.set(
              Math.cos(m._moteAngle) * m._moteRadius,
              Math.sin(m._moteAngle * 3) * 0.6,
              Math.sin(m._moteAngle) * m._moteRadius
            );
          }
        }
        if (anim.hammerCore) {
          anim.hammerCore.rotation.y += dt * 1.5;
          anim.hammerCore.rotation.x += dt * 0.8;
          const pulse = 1.0 + Math.sin(timeSec * 5.0) * 0.15;
          anim.hammerCore.scale.set(pulse, pulse, pulse);
        }
      }

      // Flash on hit / invulnerability
      const isFlashing = player.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0;
      for (let i = 0; i < anim.materials.length; i++) {
        const mat = anim.materials[i];
        if (isFlashing) {
          mat.emissive.setHex(0xff3333);
          mat.emissiveIntensity = 0.8;
        } else {
          mat.emissive.setHex(mat._origEmissive || 0x000000);
          mat.emissiveIntensity = mat._origEmissiveInt || 0;
        }
      }
    };

    return root;
  }

  // 1.1 CAVALEIRO REAL (Knight Model - Grand Champion Visual Rework)
  function buildKnightModel(group, anim) {
    // Shaders / Materials com iluminacao PBR refinada, flatShading heroico e suporte para GLSL
    const steelMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x8a99ad,
      metalness: 0.88,
      roughness: 0.28,
      flatShading: true
    }));
    const darkSteelMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x222933,
      metalness: 0.92,
      roughness: 0.38,
      flatShading: true
    }));
    const goldMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.22,
      metalness: 0.95,
      roughness: 0.20,
      flatShading: true
    }));
    const royalRedMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.75,
      flatShading: true
    }));
    const capeMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.82,
      side: THREE.DoubleSide
    }));
    const leatherMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x45230e,
      roughness: 0.80
    }));
    const bladeMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x94a3b8,
      emissiveIntensity: 0.18,
      metalness: 0.98,
      roughness: 0.12,
      flatShading: true
    }));
    const shieldCobaltMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.45,
      roughness: 0.40,
      flatShading: true
    }));
    const rubyGemMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.65,
      metalness: 0.6,
      roughness: 0.1
    }));

    anim.materials.push(steelMat, darkSteelMat, goldMat, royalRedMat, capeMat, leatherMat, bladeMat, shieldCobaltMat, rubyGemMat);

    // =========================================================================
    // 1. TORSO & PEITORAL ANATOMICO EM V
    // =========================================================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 14.5;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Peitoral Muscular com Corte Angular de 8 Faces
    const chestGeo = new THREE.CylinderGeometry(5.8, 4.4, 9.5, 8);
    const chestMesh = new THREE.Mesh(chestGeo, steelMat);
    torsoGroup.add(chestMesh);

    // Gorjal (Protecao de Garganta em Placas Sobrepostas)
    const gorgetGeo = new THREE.CylinderGeometry(4.6, 5.2, 2.0, 8);
    gorgetGeo.translate(0, 4.8, 0);
    torsoGroup.add(new THREE.Mesh(gorgetGeo, darkSteelMat));

    // Brasao Heraldico Real de Valoria em Alto Relevo Dourado
    const crestGroup = new THREE.Group();
    crestGroup.position.set(0, 0.8, 4.3);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.2, 0.6), goldMat);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.6, 0.6), goldMat);
    crossH.position.y = 1.0;
    const diamondCrest = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), rubyGemMat);
    diamondCrest.position.set(0, 1.0, 0.4);
    crestGroup.add(crossV, crossH, diamondCrest);
    torsoGroup.add(crestGroup);

    // Cinto Tatico de Cavaleiro com Fivela de Ouro & Bolsa de Alquimia
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(4.65, 4.75, 1.8, 12), leatherMat);
    belt.position.y = -4.5;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 1.0), goldMat);
    buckle.position.set(0, -4.5, 4.5);
    const beltPouch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 1.5), leatherMat);
    beltPouch.position.set(3.8, -4.5, 1.6);
    beltPouch.rotation.y = -0.4;
    torsoGroup.add(belt, buckle, beltPouch);

    // Escarcelas Frontais Articuladas (Tassets)
    [-2.6, 2.6].forEach(x => {
      const tassetGroup = new THREE.Group();
      tassetGroup.position.set(x, -6.8, 3.2);
      tassetGroup.rotation.x = 0.18;
      const tassetPlate = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.5, 0.8), steelMat);
      const tassetTrim = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.0, 0.9), goldMat);
      tassetTrim.position.y = -1.8;
      tassetGroup.add(tassetPlate, tassetTrim);
      torsoGroup.add(tassetGroup);
    });

    // =========================================================================
    // 2. ELMO REAL FECHADO COM CRISTA & PLUMA DE GUERRA
    // =========================================================================
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.0;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    // Armet / Grande Elmo Facetado
    const helmGeo = new THREE.CylinderGeometry(3.7, 3.3, 6.2, 8);
    const helmMesh = new THREE.Mesh(helmGeo, steelMat);
    headGroup.add(helmMesh);

    // Crista Central Reforcada do Elmo
    const combGeo = new THREE.BoxGeometry(0.8, 7.6, 7.0);
    combGeo.translate(0, 3.4, 0);
    headGroup.add(new THREE.Mesh(combGeo, goldMat));

    // Viseira Angular Frontal (Visor Faceplate)
    const visorPlate = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.5, 3.2, 5), darkSteelMat);
    visorPlate.rotation.y = Math.PI;
    visorPlate.position.set(0, 0.2, 0.8);
    headGroup.add(visorPlate);

    // Fenda de Visao Estreita Horizontal (Slit)
    const slit = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.65, 1.2), new THREE.MeshBasicMaterial({ color: 0x05080d }));
    slit.position.set(0, 0.6, 3.7);
    headGroup.add(slit);

    // Pluma Majestosa Escalonada de Crina de Guerra Carmesim
    const plumeGroup = new THREE.Group();
    plumeGroup.position.set(0, 6.8, -1.8);
    const plumeSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.6, 1.6, 6), goldMat);
    plumeGroup.add(plumeSocket);

    const feather1 = new THREE.Mesh(new THREE.ConeGeometry(2.0, 7.5, 6), royalRedMat);
    feather1.rotation.x = -0.45;
    feather1.position.set(0, 3.8, -1.2);
    const feather2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.5, 6), royalRedMat);
    feather2.rotation.x = -0.65;
    feather2.position.set(0, 4.8, -3.2);
    plumeGroup.add(feather1, feather2);
    headGroup.add(plumeGroup);

    // =========================================================================
    // 3. CAPA EPICA COM DOBRAS GEOMETRICAS & BROCHES DE OURO
    // =========================================================================
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 5.2, -3.8);
    const capeGeo = new THREE.PlaneGeometry(10.5, 17.5, 4, 4);
    capeGeo.translate(0, -8.5, 0);
    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeMesh.rotation.x = 0.16;
    capeGroup.add(capeMesh);
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // Broches de Ombro de Rubi e Ouro
    [-4.6, 4.6].forEach(x => {
      const brooch = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 8), goldMat);
      brooch.position.set(x, 5.0, -1.8);
      const ruby = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), rubyGemMat);
      ruby.position.set(x, 5.0, -0.8);
      torsoGroup.add(brooch, ruby);
    });

    // =========================================================================
    // 4. BRACO ESQUERDO, OMBREIRA TRIPLA & ESCUDO KITE HEROICO
    // =========================================================================
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6.8, 3.8, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    // Ombreira Imperial Tripla (Tiered Pauldron)
    const pauldronMain = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.4, 3.6, 6), steelMat);
    pauldronMain.rotation.z = Math.PI / 6;
    const pauldronTrim = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.6, 1.0, 6), goldMat);
    pauldronTrim.rotation.z = Math.PI / 6;
    pauldronTrim.position.y = 1.4;
    leftArmGroup.add(pauldronMain, pauldronTrim);

    // Bracadeira e Cotoveleira (Couter)
    const armGeo = new THREE.CylinderGeometry(1.5, 1.3, 7.2, 6);
    armGeo.translate(0, -3.6, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, steelMat));
    const couter = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), darkSteelMat);
    couter.position.set(-0.8, -4.0, 0);
    leftArmGroup.add(couter);

    // Escudo Kite de Cavalaria de Valoria (Kite Shield)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-2.4, -4.2, 2.2);
    shieldGroup.rotation.y = 0.35;

    const shieldBodyGeo = new THREE.CylinderGeometry(3.6, 1.2, 11.5, 5);
    shieldBodyGeo.scale(1, 1, 0.28);
    const shieldBody = new THREE.Mesh(shieldBodyGeo, shieldCobaltMat);
    shieldBody.rotation.y = Math.PI;

    const shieldBorderGeo = new THREE.CylinderGeometry(3.9, 1.4, 11.8, 5);
    shieldBorderGeo.scale(1, 1, 0.22);
    const shieldBorder = new THREE.Mesh(shieldBorderGeo, goldMat);
    shieldBorder.rotation.y = Math.PI;

    const umbo = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), steelMat);
    umbo.position.set(0, 1.5, 1.1);
    const shieldCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 0.3), goldMat);
    shieldCrossV.position.set(0, 0.8, 0.95);
    const shieldCrossH = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.3), goldMat);
    shieldCrossH.position.set(0, 2.0, 0.95);

    shieldGroup.add(shieldBody, shieldBorder, umbo, shieldCrossV, shieldCrossH);
    leftArmGroup.add(shieldGroup);

    // =========================================================================
    // 5. BRACO DIREITO, MANOPLA & GRANDE ESPADA DE ACO VALIRIANO
    // =========================================================================
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6.8, 3.8, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rPauldronMain = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.4, 3.6, 6), steelMat);
    rPauldronMain.rotation.z = -Math.PI / 6;
    const rPauldronTrim = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.6, 1.0, 6), goldMat);
    rPauldronTrim.rotation.z = -Math.PI / 6;
    rPauldronTrim.position.y = 1.4;
    rightArmGroup.add(rPauldronMain, rPauldronTrim);

    const rArm = new THREE.Mesh(armGeo, steelMat);
    const rCouter = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), darkSteelMat);
    rCouter.position.set(0.8, -4.0, 0);
    rightArmGroup.add(rArm, rCouter);

    // Montante de Aco Valiriano com Fio Duplo e Canaleta Central
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -6.5, 2.4);
    swordGroup.rotation.x = Math.PI / 4.2;

    const bladeGeo = new THREE.BoxGeometry(1.5, 19.5, 0.45);
    bladeGeo.translate(0, 9.75, 0);
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);

    const fullerGeo = new THREE.BoxGeometry(0.35, 14.5, 0.52);
    fullerGeo.translate(0, 8.5, 0);
    const fullerMesh = new THREE.Mesh(fullerGeo, darkSteelMat);

    const guardGeo = new THREE.BoxGeometry(7.2, 1.2, 1.4);
    const guardMesh = new THREE.Mesh(guardGeo, goldMat);

    const hiltGeo = new THREE.CylinderGeometry(0.7, 0.7, 4.2, 8);
    hiltGeo.translate(0, -2.4, 0);
    const hiltMesh = new THREE.Mesh(hiltGeo, leatherMat);

    const pommelGeo = new THREE.DodecahedronGeometry(1.3, 0);
    pommelGeo.translate(0, -5.0, 0);
    const pommelMesh = new THREE.Mesh(pommelGeo, goldMat);
    const pommelRuby = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), rubyGemMat);
    pommelRuby.position.set(0, -5.0, 0);

    swordGroup.add(bladeMesh, fullerMesh, guardMesh, hiltMesh, pommelMesh, pommelRuby);
    rightArmGroup.add(swordGroup);
    anim.weapon = swordGroup;

    // =========================================================================
    // 6. PERNAS, JOELHEIRAS ARTICULADAS & ESCARPES DE ACO
    // =========================================================================
    [-3.2, 3.2].forEach((x, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(x, 8.5, 0);

      const cuisseGeo = new THREE.CylinderGeometry(1.9, 1.7, 5.0, 6);
      cuisseGeo.translate(0, -2.5, 0);
      legGroup.add(new THREE.Mesh(cuisseGeo, darkSteelMat));

      const poleynGeo = new THREE.ConeGeometry(1.2, 1.8, 5);
      poleynGeo.rotateX(Math.PI / 2);
      poleynGeo.translate(0, -5.0, 1.4);
      legGroup.add(new THREE.Mesh(poleynGeo, goldMat));

      const greaveGeo = new THREE.CylinderGeometry(1.7, 1.4, 5.5, 6);
      greaveGeo.translate(0, -7.5, 0);
      legGroup.add(new THREE.Mesh(greaveGeo, steelMat));

      const sabatonGeo = new THREE.BoxGeometry(2.4, 1.6, 4.5);
      sabatonGeo.translate(0, -9.8, 1.1);
      legGroup.add(new THREE.Mesh(sabatonGeo, steelMat));

      group.add(legGroup);
      if (idx === 0) anim.leftLeg = legGroup;
      else anim.rightLeg = legGroup;
    });
  }

  // 1.2 ARQUEIRA DAS SOMBRAS (Lady Vespera - Grand Huntress Visual Rework v2.2.0)
  function buildRangerModel(group, anim) {
    anim.isRanger = true;
    anim.shadowWisps = [];

    // =========================================================================
    // PALETA GÓTICA SOMBRIA & AMETISTA ESPECTRAL (SHADOW ASSASSIN PALETTE)
    // =========================================================================
    const shadowClothMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x0c0915,       // Meia-noite abissal com matiz violeta profundo
      roughness: 0.82,
      side: THREE.DoubleSide,
      flatShading: true
    }));
    const obsidianLeatherMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x14101c,       // Couro de assassina curtido em sombras
      roughness: 0.72,
      flatShading: true
    }));
    const deepVioletMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x24143a,       // Seda violeta espectral para forro interno
      roughness: 0.76,
      side: THREE.DoubleSide,
      flatShading: true
    }));
    const blackenedSteelMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x181c24,       // Aço negro fosco
      metalness: 0.92,
      roughness: 0.32,
      flatShading: true
    }));
    const darkSilverMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x6b7280,       // Prata sombreada envelhecida para fivelas e ornamentos
      metalness: 0.88,
      roughness: 0.28,
      flatShading: true
    }));
    const cursedAmethystMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xa855f7,       // Ametista amaldiçoada luminescente
      emissive: 0x7e22ce,
      emissiveIntensity: 0.90,
      metalness: 0.40,
      roughness: 0.15
    }));
    const paleSkinMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xe0d0c2,       // Tez feminina porcelana gótica suave
      roughness: 0.55,
      flatShading: true
    }));
    const darkLipsMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x541c30,       // Lábios delicados em tom ameixa escuro
      roughness: 0.50,
      flatShading: true
    }));
    const ravenHairMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x0a0712,       // Cabelo ébano/corvo com brilho sutil
      roughness: 0.40,
      flatShading: true
    }));
    const ebonyWoodMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x161118,       // Nogueira negra carbonizada
      roughness: 0.82,
      flatShading: true
    }));
    const shadowFeatherMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x22182e,       // Penugem de corvo das setas
      roughness: 0.65
    }));
    const voidAuraMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.60
    });
    const eyeGlowMat = materials.glowingViolet || new THREE.MeshBasicMaterial({ color: 0xc084fc });

    anim.materials.push(
      shadowClothMat, obsidianLeatherMat, deepVioletMat, blackenedSteelMat,
      darkSilverMat, cursedAmethystMat, paleSkinMat, darkLipsMat,
      ravenHairMat, ebonyWoodMat, shadowFeatherMat, voidAuraMat
    );

    // =========================================================================
    // 1. TORSO, CORPETE DE ASSASSINA & CINTO TÁTICO
    // =========================================================================
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 14.2;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Peitoral com Silhueta Feminina em Ampulheta Esguia
    const chestGeo = new THREE.CylinderGeometry(4.4, 3.2, 9.2, 10);
    const chestMesh = new THREE.Mesh(chestGeo, shadowClothMat);
    torsoGroup.add(chestMesh);

    // Busto Feminino Sutil e Curvatura Esculpida
    const bustGeo = new THREE.CylinderGeometry(4.65, 4.3, 3.6, 10);
    bustGeo.translate(0, 1.2, 0.4);
    torsoGroup.add(new THREE.Mesh(bustGeo, shadowClothMat));

    // Corpete de Couro de Obsidiana com Recorte Anatômico
    const corsetGeo = new THREE.CylinderGeometry(4.7, 3.4, 5.8, 10);
    corsetGeo.translate(0, -0.6, 0.1);
    const corsetMesh = new THREE.Mesh(corsetGeo, obsidianLeatherMat);
    torsoGroup.add(corsetMesh);

    // Amarração Frontal em Fios de Prata Sombreada
    for (let cIdx = 0; cIdx < 4; cIdx++) {
      const laceH = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.3), darkSilverMat);
      laceH.position.set(0, -2.0 + cIdx * 1.25, 2.9);
      torsoGroup.add(laceH);
    }

    // Broche Amaldiçoado no Decote (Gema de Ametista Espectral)
    const chestGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), cursedAmethystMat);
    chestGem.position.set(0, 3.2, 2.85);
    const chestTrim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.2, 6, 8), darkSilverMat);
    chestTrim.position.set(0, 3.2, 2.75);
    torsoGroup.add(chestGem, chestTrim);

    // Cinto Tático Duplo com Fivela Ornamental de Prata & Ametista
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.8, 1.8, 12), obsidianLeatherMat);
    belt.position.y = -3.8;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.8), darkSilverMat);
    buckle.position.set(0, -3.8, 3.2);
    const buckleGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), cursedAmethystMat);
    buckleGem.position.set(0, -3.8, 3.6);
    torsoGroup.add(belt, buckle, buckleGem);

    // Bolsas Táticas de Veneno e Cordas nos Flancos
    const pouchGroup = new THREE.Group();
    pouchGroup.position.set(3.4, -4.0, 0.8);
    pouchGroup.rotation.y = -0.3;
    const pouchMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.4, 1.5), obsidianLeatherMat);
    const pouchFlap = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.1, 1.6), shadowClothMat);
    pouchFlap.position.set(0, 0.8, 0.05);
    pouchGroup.add(pouchMesh, pouchFlap);
    torsoGroup.add(pouchGroup);

    // Frascos de Veneno Espectral (Amaldiçoados) no Cinto Esquerdo
    const vialGroup = new THREE.Group();
    vialGroup.position.set(-3.4, -4.0, 0.8);
    vialGroup.rotation.y = 0.3;
    const vial1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 6), cursedAmethystMat);
    const vialCap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 6), darkSilverMat);
    vialCap1.position.y = 0.85;
    vialGroup.add(vial1, vialCap1);
    torsoGroup.add(vialGroup);

    // Saia de Combate em 4 Abas Fendidas em Seda Sombria
    [-1.7, 1.7].forEach(x => {
      // Abas Frontais
      const skirtF = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.4, 0.7), shadowClothMat);
      skirtF.position.set(x, -6.2, 2.3);
      skirtF.rotation.x = 0.16;
      skirtF.rotation.y = x > 0 ? -0.12 : 0.12;
      const skirtFTrim = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 0.8), deepVioletMat);
      skirtFTrim.position.y = -1.9;
      skirtF.add(skirtFTrim);
      torsoGroup.add(skirtF);

      // Abas Traseiras
      const skirtB = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.6, 0.7), obsidianLeatherMat);
      skirtB.position.set(x, -6.3, -2.3);
      skirtB.rotation.x = -0.16;
      skirtB.rotation.y = x > 0 ? 0.12 : -0.12;
      torsoGroup.add(skirtB);
    });

    // =========================================================================
    // 2. CABEÇA FEMININA REALISTA & CAPUZ SOMBRIO ORGÂNICO (SHADOW COWL)
    // =========================================================================
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.4;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    // Pescoço Esguio Feminino em Tom Porcelana
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.2, 2.6, 12), paleSkinMat);
    neck.position.set(0, -1.8, 0.2);
    headGroup.add(neck);

    // Gargantilha de Veludo Sombrio com Pingente de Ametista
    const choker = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.25, 0.65, 12), shadowClothMat);
    choker.position.set(0, -1.8, 0.2);
    const chokerPendant = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), cursedAmethystMat);
    chokerPendant.position.set(0, -1.8, 1.5);
    headGroup.add(choker, chokerPendant);

    // Crânio & Maçãs do Rosto Femininas Esculpidas
    const craniumGeo = new THREE.SphereGeometry(2.1, 14, 12);
    craniumGeo.scale(0.92, 1.05, 0.98);
    const cranium = new THREE.Mesh(craniumGeo, paleSkinMat);
    cranium.position.set(0, 0.2, 0.2);
    headGroup.add(cranium);

    // Queixo Delicado & Mandíbula Tapered Suave
    const jawGeo = new THREE.CylinderGeometry(1.85, 1.0, 2.2, 10);
    jawGeo.translate(0, -0.7, 0.35);
    const jawMesh = new THREE.Mesh(jawGeo, paleSkinMat);
    headGroup.add(jawMesh);

    // Nariz Fino Feminino
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 4), paleSkinMat);
    nose.position.set(0, 0.15, 2.25);
    nose.rotation.x = -0.32;
    headGroup.add(nose);

    // Lábios Femininos Esculpidos em Tom Ameixa Sombrio
    const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.35), darkLipsMat);
    upperLip.position.set(0, -0.62, 2.05);
    const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.24, 0.38), darkLipsMat);
    lowerLip.position.set(0, -0.84, 2.02);
    headGroup.add(upperLip, lowerLip);

    // Olhos Amendoados Femininos com Eyeliner Gótico e Pupilas Luminescentes
    [-0.92, 0.92].forEach(x => {
      // Eyeliner / Sombra Gótica
      const eyeShadow = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.32), shadowClothMat);
      eyeShadow.position.set(x, 0.50, 1.96);
      headGroup.add(eyeShadow);

      // Pupila / Íris de Ametista Luminescente (Olhar Hipnótico de Rastreadora)
      const iris = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.36), eyeGlowMat);
      iris.position.set(x, 0.50, 1.98);
      headGroup.add(iris);

      // Sobrancelha Arqueada Delicada
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.22), ravenHairMat);
      brow.position.set(x, 0.82, 2.02);
      brow.rotation.z = x > 0 ? -0.15 : 0.15;
      headGroup.add(brow);
    });

    // ── CABELO ÉBANO FEMININO REALISTA (RAVEN SILK HAIR) ──────────────────────
    // Base do Cabelo Sob o Capuz (Volume Superior)
    const hairCrownGeo = new THREE.SphereGeometry(2.35, 12, 10);
    hairCrownGeo.scale(1.0, 1.05, 1.02);
    const hairCrown = new THREE.Mesh(hairCrownGeo, ravenHairMat);
    hairCrown.position.set(0, 0.4, 0.0);
    headGroup.add(hairCrown);

    // Franja Lateral Elegante que emoldura a testa
    const bangs = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.45), ravenHairMat);
    bangs.position.set(-0.55, 0.85, 1.8);
    bangs.rotation.z = -0.22;
    bangs.rotation.y = 0.15;
    headGroup.add(bangs);

    // Mechas Longas Laterais (Enquadrando Maçãs do Rosto e Descendo pelo Pescoço)
    [-1.75, 1.75].forEach(x => {
      const tress = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.18, 5.6, 8), ravenHairMat);
      tress.position.set(x, -1.6, 1.25);
      tress.rotation.z = x > 0 ? -0.12 : 0.12;
      // Anel / Presilha de Prata na Mecha
      const clasp = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.45, 8), darkSilverMat);
      clasp.position.set(x, -0.4, 1.25);
      headGroup.add(tress, clasp);
    });

    // Massa de Cabelo Traseira Ondulada Descendo pelas Costas
    const backHairGeo = new THREE.CylinderGeometry(1.5, 2.2, 6.0, 10);
    backHairGeo.scale(1.15, 1.0, 0.65);
    const backHair = new THREE.Mesh(backHairGeo, ravenHairMat);
    backHair.position.set(0, -1.6, -1.2);
    headGroup.add(backHair);

    // ── CAPUZ SOMBRIO ORGÂNICO (ORGANIC SHADOW COWL & MANTLE) ─────────────────
    // Cúpula Curva Suave do Capuz (Sem pontas ou cones rígidos)
    const cowlDomeGeo = new THREE.SphereGeometry(2.85, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const cowlDome = new THREE.Mesh(cowlDomeGeo, shadowClothMat);
    cowlDome.position.set(0, 0.6, -0.2);
    cowlDome.rotation.x = -0.12;
    headGroup.add(cowlDome);

    // Forro Interno Escuro (Cria Sombra Natural ao Redor do Rosto)
    const cowlInnerGeo = new THREE.SphereGeometry(2.78, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const cowlInner = new THREE.Mesh(cowlInnerGeo, deepVioletMat);
    cowlInner.position.set(0, 0.58, -0.18);
    cowlInner.rotation.x = -0.12;
    headGroup.add(cowlInner);

    // Borda Arqueada do Capuz (Torus) emoldurando a face de forma orgânica
    const cowlArchGeo = new THREE.TorusGeometry(2.65, 0.32, 8, 14, Math.PI * 1.15);
    const cowlArch = new THREE.Mesh(cowlArchGeo, shadowClothMat);
    cowlArch.position.set(0, 0.75, 0.6);
    cowlArch.rotation.x = 0.38;
    cowlArch.rotation.z = Math.PI * 0.925;
    headGroup.add(cowlArch);

    // Friso em Prata Sombreada no Bico Superior do Capuz
    const cowlTrim = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.4), darkSilverMat);
    cowlTrim.position.set(0, 2.1, 1.45);
    headGroup.add(cowlTrim);

    // Manto Caído sobre os Ombros (Transição Suave para a Capa)
    const cowlMantleGeo = new THREE.CylinderGeometry(2.7, 4.3, 3.0, 12, 1, true);
    const cowlMantle = new THREE.Mesh(cowlMantleGeo, shadowClothMat);
    cowlMantle.position.set(0, -1.2, -0.2);
    headGroup.add(cowlMantle);

    // =========================================================================
    // 3. CAPA NOTURNA ESVOAÇANTE COM BROCHE AMALDIÇOADO
    // =========================================================================
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 4.6, -2.8);
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // Broche de Ombro com Brasão em Prata e Gema Violeta
    const capeBrooch = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), cursedAmethystMat);
    capeBrooch.position.set(0, 0.3, 0.35);
    const broochFrame = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.22, 6, 8), darkSilverMat);
    broochFrame.position.set(0, 0.3, 0.3);
    capeGroup.add(capeBrooch, broochFrame);

    // Camada Superior da Capa
    const capeTop = new THREE.Mesh(new THREE.BoxGeometry(7.2, 8.5, 0.45), shadowClothMat);
    capeTop.position.set(0, -4.2, 0);
    capeTop.rotation.x = 0.12;
    capeGroup.add(capeTop);

    // Forro Violeta Interior da Capa
    const capeLining = new THREE.Mesh(new THREE.BoxGeometry(6.8, 8.0, 0.2), deepVioletMat);
    capeLining.position.set(0, -4.2, 0.25);
    capeLining.rotation.x = 0.12;
    capeGroup.add(capeLining);

    // Camada Inferior Esfarrapada / Esvoaçante
    const capeBottom = new THREE.Mesh(new THREE.BoxGeometry(8.2, 11.5, 0.35), shadowClothMat);
    capeBottom.position.set(0, -10.0, 0.6);
    capeBottom.rotation.x = 0.18;
    capeGroup.add(capeBottom);

    // =========================================================================
    // 4. ALJAVA ARTESANAL TRANSVERSAL & 6 VIROTES DE SOMBRA
    // =========================================================================
    const quiverGroup = new THREE.Group();
    quiverGroup.position.set(-1.8, 2.4, -3.2);
    quiverGroup.rotation.set(-0.25, 0.20, 0.48);
    torsoGroup.add(quiverGroup);

    // Corpo Cilíndrico da Aljava em Couro de Obsidiana
    const quiverBody = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.25, 12.0, 8), obsidianLeatherMat);
    quiverGroup.add(quiverBody);

    // Anéis de Reforço em Prata Escura
    [-3.8, 0, 3.8].forEach(y => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.6, 8), darkSilverMat);
      ring.position.y = y;
      quiverGroup.add(ring);
    });

    // Correia Diagonal de Suporte Cruzando o Peito
    const quiverStrap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 14.5, 0.4), obsidianLeatherMat);
    quiverStrap.position.set(0.6, 0.2, 0);
    quiverStrap.rotation.set(-0.25, 0.1, 0.48);
    torsoGroup.add(quiverStrap);

    // 6 Flechas / Virotes de Sombra Tridimensionais
    const arrowOffsets = [
      [-0.5, 0.4, 6.8], [0.5, 0.4, 7.2], [0, 0.6, 7.6],
      [-0.5, -0.4, 7.0], [0.5, -0.4, 7.4], [0, -0.6, 7.9]
    ];
    arrowOffsets.forEach(([ox, oz, h], aIdx) => {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 5.0, 6), ebonyWoodMat);
      shaft.position.set(ox, h, oz);
      quiverGroup.add(shaft);

      // Penas de Corvo da Flecha
      const fletch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.8), shadowFeatherMat);
      fletch.position.set(ox, h + 1.8, oz);
      quiverGroup.add(fletch);

      // Ponta de Sombra Encantada com Brilho Violeta
      const broadhead = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.0, 4), cursedAmethystMat);
      broadhead.position.set(ox, h + 2.8, oz);
      quiverGroup.add(broadhead);
    });

    // =========================================================================
    // 5. BRAÇO ESQUERDO, OMBREIRA ESCAMADA & GUARDA DIANTEIRA
    // =========================================================================
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-5.6, 4.4, 0.2);
    torsoGroup.add(leftShoulder);
    anim.leftArm = leftShoulder;

    // Ombreira Escamada de Espreita em Placas Negras Sobrepostas
    const lPauldron = new THREE.Mesh(new THREE.SphereGeometry(2.3, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.65), blackenedSteelMat);
    lPauldron.position.set(-0.2, 1.2, 0);
    lPauldron.rotation.z = -0.35;
    const lPauldronTrim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.22, 6, 8), darkSilverMat);
    lPauldronTrim.position.set(-0.2, 0.8, 0);
    lPauldronTrim.rotation.x = Math.PI / 2;
    leftShoulder.add(lPauldron, lPauldronTrim);

    // Braço Superior
    const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.25, 5.2, 8), shadowClothMat);
    lUpperArm.position.y = -2.6;
    leftShoulder.add(lUpperArm);

    // Cotovelo
    const lElbow = new THREE.Group();
    lElbow.position.y = -5.2;
    leftShoulder.add(lElbow);

    // Braçadeira de Tiro em Couro de Obsidiana com Protetor de Corda
    const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.1, 5.0, 8), obsidianLeatherMat);
    lForearm.position.y = -2.5;
    const lVambracePlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.0, 1.8), blackenedSteelMat);
    lVambracePlate.position.set(-0.7, -2.5, 0);
    lElbow.add(lForearm, lVambracePlate);

    // Mão Esquerda (Luva de Couro Fino)
    const lHand = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, 1.3), obsidianLeatherMat);
    lHand.position.set(0, -5.4, 0);
    lElbow.add(lHand);

    // Socket de Ancoragem para Mão Esquerda
    const handLSocket = new THREE.Group();
    handLSocket.position.set(0, -5.6, 0);
    lElbow.add(handLSocket);
    anim.handL_socket = handLSocket;

    // =========================================================================
    // 6. BRAÇO DIREITO & A BESTA MECÂNICA DE VALORIA (SHADOW REPEATER ARBALEST)
    // =========================================================================
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(5.6, 4.4, 0.2);
    torsoGroup.add(rightShoulder);
    anim.rightArm = rightShoulder;

    // Ombreira Direita Compacta
    const rPauldron = new THREE.Mesh(new THREE.SphereGeometry(2.1, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.65), blackenedSteelMat);
    rPauldron.position.set(0.2, 1.2, 0);
    rPauldron.rotation.z = 0.35;
    const rPauldronTrim = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.20, 6, 8), darkSilverMat);
    rPauldronTrim.position.set(0.2, 0.8, 0);
    rPauldronTrim.rotation.x = Math.PI / 2;
    rightShoulder.add(rPauldron, rPauldronTrim);

    // Braço Superior Direito
    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.25, 5.2, 8), shadowClothMat);
    rUpperArm.position.y = -2.6;
    rightShoulder.add(rUpperArm);

    // Cotovelo Direito
    const rElbow = new THREE.Group();
    rElbow.position.y = -5.2;
    rightShoulder.add(rElbow);

    // Antebraço Direito
    const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.1, 5.0, 8), obsidianLeatherMat);
    rForearm.position.y = -2.5;
    rElbow.add(rForearm);

    // Mão Direita (Empunhando o Disparador)
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, 1.3), obsidianLeatherMat);
    rHand.position.set(0, -5.4, 0);
    rElbow.add(rHand);

    // Socket de Ancoragem para Mão Direita
    const handRSocket = new THREE.Group();
    handRSocket.position.set(0, -5.6, 0);
    rElbow.add(handRSocket);
    anim.handR_socket = handRSocket;

    // ── VALORIAN SHADOW REPEATER ARBALEST (BALESTRA MECÂNICA SOMBRIA 3D) ─────
    const crossbowGroup = new THREE.Group();
    crossbowGroup.position.set(0, 0, 1.8);
    crossbowGroup.rotation.set(0.25, -0.15, -0.10);
    handRSocket.add(crossbowGroup);
    anim.weapon = crossbowGroup;

    // Coronha em Nogueira Negra Carbonizada
    const stock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 15.5), ebonyWoodMat);
    stock.position.set(0, 0, 1.5);
    crossbowGroup.add(stock);

    // Trilho Superior de Disparo com Canal Rúnico Violeta
    const flightTrack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 13.5), blackenedSteelMat);
    flightTrack.position.set(0, 1.25, 3.2);
    const runeChamber = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 11.5), cursedAmethystMat);
    runeChamber.position.set(0, 1.45, 3.2);
    crossbowGroup.add(flightTrack, runeChamber);

    // Caixa Mecânica da Culatra & Trava de Disparo
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.6, 4.4), blackenedSteelMat);
    receiver.position.set(0, 0.4, -1.0);
    const cockingLever = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 3.6, 6), darkSilverMat);
    cockingLever.position.set(1.4, 1.2, -1.0);
    cockingLever.rotation.z = -0.55;
    crossbowGroup.add(receiver, cockingLever);

    // Arco Recurvo Duplo em Aço Negro
    const bowLimbsGroup = new THREE.Group();
    bowLimbsGroup.position.set(0, 0.8, 8.2);
    crossbowGroup.add(bowLimbsGroup);

    // Braço Esquerdo do Arco
    const limbL = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.9, 0.8), blackenedSteelMat);
    limbL.position.set(-3.2, 0, -0.6);
    limbL.rotation.y = 0.28;
    const tipL = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 0.6), blackenedSteelMat);
    tipL.position.set(-6.2, 0, -1.8);
    tipL.rotation.y = -0.42;

    // Braço Direito do Arco
    const limbR = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.9, 0.8), blackenedSteelMat);
    limbR.position.set(3.2, 0, -0.6);
    limbR.rotation.y = -0.28;
    const tipR = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 0.6), blackenedSteelMat);
    tipR.position.set(6.2, 0, -1.8);
    tipR.rotation.y = 0.42;

    // Polias Mecânicas (Cams) em Prata Escura
    const pulleyL = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 10), darkSilverMat);
    pulleyL.position.set(-7.5, 0, -2.6);
    pulleyL.rotation.x = Math.PI / 2;
    const pulleyR = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.45, 10), darkSilverMat);
    pulleyR.position.set(7.5, 0, -2.6);
    pulleyR.rotation.x = Math.PI / 2;
    bowLimbsGroup.add(limbL, tipL, limbR, tipR, pulleyL, pulleyR);

    // Estribo Frontal de Apoio
    const stirrup = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.28, 6, 8), darkSilverMat);
    stirrup.position.set(0, 0, 10.0);
    stirrup.rotation.x = Math.PI / 2;
    crossbowGroup.add(stirrup);

    // Corda Dupla Tensionada em Fio Negro
    const bowString = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 14.8, 6), darkSilverMat);
    bowString.position.set(0, 0.8, 5.6);
    bowString.rotation.z = Math.PI / 2;
    crossbowGroup.add(bowString);

    // Virote de Sombra Carregado no Trilho com Ponta Violeta
    const loadedBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.8, 6), ebonyWoodMat);
    loadedBolt.position.set(0, 1.45, 4.8);
    loadedBolt.rotation.x = Math.PI / 2;
    const loadedHead = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.2, 4), cursedAmethystMat);
    loadedHead.position.set(0, 1.45, 8.8);
    loadedHead.rotation.x = Math.PI / 2;
    crossbowGroup.add(loadedBolt, loadedHead);

    // =========================================================================
    // 7. PERNAS, GREVAS DE OBSIDIANA & BOTAS ALTAS DE ASSASSINA
    // =========================================================================
    // Perna Esquerda
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-2.4, 9.8, 0);
    group.add(leftLeg);
    anim.leftLeg = leftLeg;

    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.4, 5.6, 8), obsidianLeatherMat);
    lThigh.position.y = -2.6;
    leftLeg.add(lThigh);

    const lKnee = new THREE.Group();
    lKnee.position.y = -5.4;
    leftLeg.add(lKnee);

    const lCalf = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.25, 5.4, 8), shadowClothMat);
    lCalf.position.y = -2.6;
    const lGreave = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.6, 1.4), obsidianLeatherMat);
    lGreave.position.set(0, -2.6, 0.6);
    const lGreavePlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.5), blackenedSteelMat);
    lGreavePlate.position.set(0, -1.8, 0.65);
    lKnee.add(lCalf, lGreave, lGreavePlate);

    const lFoot = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 3.6), obsidianLeatherMat);
    lFoot.position.set(0, -5.5, 0.8);
    lKnee.add(lFoot);

    // Perna Direita
    const rightLeg = new THREE.Group();
    rightLeg.position.set(2.4, 9.8, 0);
    group.add(rightLeg);
    anim.rightLeg = rightLeg;

    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.4, 5.6, 8), obsidianLeatherMat);
    rThigh.position.y = -2.6;
    rightLeg.add(rThigh);

    const rKnee = new THREE.Group();
    rKnee.position.y = -5.4;
    rightLeg.add(rKnee);

    const rCalf = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.25, 5.4, 8), shadowClothMat);
    rCalf.position.y = -2.6;
    const rGreave = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.6, 1.4), obsidianLeatherMat);
    rGreave.position.set(0, -2.6, 0.6);
    const rGreavePlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.5), blackenedSteelMat);
    rGreavePlate.position.set(0, -1.8, 0.65);
    rKnee.add(rCalf, rGreave, rGreavePlate);

    const rFoot = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 3.6), obsidianLeatherMat);
    rFoot.position.set(0, -5.5, 0.8);
    rKnee.add(rFoot);

    // =========================================================================
    // 8. EFEITOS SOMBRIOS: PARTÍCULAS / LABAREDAS DE SOMBRA (SHADOW WISPS)
    // =========================================================================
    const wispPositions = [
      { x: -2.8, y: 7.2, z: 0.5, scale: 0.55, phase: 0 },
      { x: 2.8, y: 7.6, z: 0.5, scale: 0.60, phase: 1.8 },
      { x: -3.6, y: 3.2, z: -1.2, scale: 0.48, phase: 3.1 },
      { x: 3.6, y: 3.4, z: -1.2, scale: 0.52, phase: 4.4 },
      { x: 0.0, y: 9.8, z: -1.8, scale: 0.65, phase: 2.3 },
      { x: 0.0, y: 1.8, z: 9.6, scale: 0.45, phase: 5.2 } // ponta da balestra
    ];

    wispPositions.forEach(cfg => {
      const wGeo = new THREE.OctahedronGeometry(cfg.scale, 0);
      const wMesh = new THREE.Mesh(wGeo, voidAuraMat);
      wMesh.position.set(cfg.x, cfg.y, cfg.z);
      torsoGroup.add(wMesh);
      anim.shadowWisps.push({
        mesh: wMesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        baseScale: cfg.scale,
        phase: cfg.phase
      });
    });

    return group;
  }

  // =========================================================================
  // 1.3 FEITICEIRO DAS CINZAS (Pyromancer Rework Model - Alta Fidelidade 3D)
  // =========================================================================
  function buildPyromancerModel(group, anim) {
    anim.isPyromancer = true;
    anim.fireParticles = [];

    // Materiais PBR Especiais de Piromancia Medieval Gótica
    const crimsonSilkMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x821111,
      roughness: 0.70,
      side: THREE.DoubleSide,
      flatShading: true
    }));
    const charcoalClothMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x151216,
      roughness: 0.84,
      side: THREE.DoubleSide,
      flatShading: true
    }));
    const moltenAmberMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xbd5a16,
      roughness: 0.65,
      side: THREE.DoubleSide,
      flatShading: true
    }));
    const scorchedLeatherMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x24140e,
      roughness: 0.78,
      flatShading: true
    }));
    const darkBronzeMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x6e4624,
      metalness: 0.86,
      roughness: 0.34,
      flatShading: true
    }));
    const ashwoodMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x1f1a18,
      roughness: 0.85,
      flatShading: true
    }));
    const flameCoreMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff3300,
      emissiveIntensity: 1.8,
      roughness: 0.15
    }));
    const fireAuraMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff7700,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.85
    }));
    const emberGlowMat = createFlashable(new THREE.MeshBasicMaterial({
      color: 0xff7700
    }));
    const runeGoldMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.22,
      flatShading: true
    }));
    const amberGlassMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    }));
    const skinPaleMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xdecbbe,
      roughness: 0.60
    }));

    anim.materials.push(
      crimsonSilkMat, charcoalClothMat, moltenAmberMat, scorchedLeatherMat,
      darkBronzeMat, ashwoodMat, flameCoreMat, fireAuraMat, runeGoldMat, amberGlassMat, skinPaleMat
    );

    // 1. TORSO, CORSELETE DE COURO & ESTOLA CLERICAL RÚNICA
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 13.5;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Corpete Anatômico em Ampulheta com Proteção de Couro Tratado
    const chestGeo = new THREE.CylinderGeometry(4.2, 3.4, 7.8, 8);
    const chestMesh = new THREE.Mesh(chestGeo, scorchedLeatherMat);
    torsoGroup.add(chestMesh);

    // Corpete Interno de Seda Escarlate
    const underVestGeo = new THREE.CylinderGeometry(4.0, 3.2, 7.2, 8);
    const underVest = new THREE.Mesh(underVestGeo, crimsonSilkMat);
    underVest.position.z = 0.2;
    torsoGroup.add(underVest);

    // Amarrações Frontais Cruzadas de Ouro Velho no Corselete
    [-1.2, 0.4, 2.0].forEach(yPos => {
      const cord1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.4), runeGoldMat);
      cord1.position.set(0, yPos, 2.2);
      cord1.rotation.z = 0.25;
      const cord2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.4), runeGoldMat);
      cord2.position.set(0, yPos, 2.2);
      cord2.rotation.z = -0.25;
      torsoGroup.add(cord1, cord2);
    });

    // Estola Clerical Mística com Símbolos de Fogo descendo pelo peito
    const stoleL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 9.5, 0.45), moltenAmberMat);
    stoleL.position.set(-1.6, -1.2, 2.0);
    stoleL.rotation.z = -0.06;
    const stoleR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 9.5, 0.45), moltenAmberMat);
    stoleR.position.set(1.6, -1.2, 2.0);
    stoleR.rotation.z = 0.06;
    torsoGroup.add(stoleL, stoleR);

    // Amuleto Solar de Rubi & Bronze no Peitoral
    const brooch = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.4, 8), darkBronzeMat);
    brooch.rotation.x = Math.PI / 2;
    brooch.position.set(0, 3.2, 2.1);
    const rubyCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), flameCoreMat);
    rubyCore.position.set(0, 3.2, 2.4);
    torsoGroup.add(brooch, rubyCore);

    // Cinto Largo com Fivela de Latão & Frascos de Fogo Grego
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 1.6, 10), scorchedLeatherMat);
    belt.position.y = -3.8;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.7), darkBronzeMat);
    buckle.position.set(0, -3.8, 2.3);
    torsoGroup.add(belt, buckle);

    // 3 Frascos de Alquimia Ígnea presos ao cinto
    const flaskOffsets = [[-2.4, -4.2, 1.8], [2.2, -4.2, 1.9], [3.2, -4.2, 0.8]];
    flaskOffsets.forEach(([fx, fy, fz]) => {
      const flaskHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.7, 6), scorchedLeatherMat);
      flaskHolder.position.set(fx, fy, fz);
      const flaskBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.40, 2.0, 8), amberGlassMat);
      flaskBottle.position.set(fx, fy - 0.2, fz);
      const flaskLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.4, 6), flameCoreMat);
      flaskLiquid.position.set(fx, fy - 0.4, fz);
      const flaskCork = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.45, 6), scorchedLeatherMat);
      flaskCork.position.set(fx, fy + 0.9, fz);
      torsoGroup.add(flaskHolder, flaskBottle, flaskLiquid, flaskCork);
    });

    // Bolsa de Pós e Enxofre na Cintura
    const sulfurPouch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 1.6), scorchedLeatherMat);
    sulfurPouch.position.set(-3.2, -4.2, 0.8);
    sulfurPouch.rotation.y = 0.45;
    torsoGroup.add(sulfurPouch);

    // 2. MANTO LONGO & SAIA DRAPEADA EM CAMADAS COM FORRO ÂMBAR
    const robeBaseGroup = new THREE.Group();
    robeBaseGroup.position.set(0, -4.2, 0);
    torsoGroup.add(robeBaseGroup);

    // Saia Cone de 8 Faces (Manto Carmesim)
    anim.robe = robeBaseGroup;
    const robeGeo = new THREE.CylinderGeometry(3.6, 7.6, 15.5, 8, 1, true);
    robeGeo.translate(0, -7.5, 0);
    const robeMesh = new THREE.Mesh(robeGeo, crimsonSilkMat);
    robeBaseGroup.add(robeMesh);

    // Forro Interno Âmbar Visível na Fenda da Saia
    const innerLiningGeo = new THREE.CylinderGeometry(3.5, 7.4, 15.3, 8, 1, true);
    innerLiningGeo.translate(0, -7.5, 0);
    const innerLiningMesh = new THREE.Mesh(innerLiningGeo, moltenAmberMat);
    innerLiningMesh.scale.set(0.98, 1, 0.98);
    robeBaseGroup.add(innerLiningMesh);

    // Sobretúnica de Cinzas Fatiada em 4 Abas Góticas de Combate
    [-1.8, 1.8].forEach((x, i) => {
      const flapF = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9.5, 0.4), charcoalClothMat);
      flapF.position.set(x, -5.5, 2.4);
      flapF.rotation.x = 0.12;
      flapF.rotation.y = (i === 0 ? 0.10 : -0.10);
      robeBaseGroup.add(flapF);

      const flapB = new THREE.Mesh(new THREE.BoxGeometry(3.4, 10.5, 0.4), charcoalClothMat);
      flapB.position.set(x, -5.8, -2.4);
      flapB.rotation.x = -0.15;
      flapB.rotation.y = (i === 0 ? -0.12 : 0.12);
      robeBaseGroup.add(flapB);
    });

    // Barrado Dourado Bordado na Borda da Sobretúnica
    const hemTrimF = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.6, 0.5), runeGoldMat);
    hemTrimF.position.set(0, -9.8, 2.8);
    robeBaseGroup.add(hemTrimF);

    // 3. CAPUZ PONTIEAGUDO GÓTICO, ROSTO SOMBREADO & OLHOS DE BRASA
    const headGroup = new THREE.Group();
    headGroup.position.y = 6.2;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    // Rosto Feminino Sombreado
    const faceGeo = new THREE.CylinderGeometry(2.0, 1.7, 4.4, 6);
    const faceMesh = new THREE.Mesh(faceGeo, skinPaleMat);
    faceMesh.position.set(0, 0, 0.3);
    headGroup.add(faceMesh);

    // Queixo e Lábios Delicados
    const chinGeo = new THREE.ConeGeometry(1.2, 1.6, 5);
    chinGeo.rotateX(Math.PI);
    chinGeo.translate(0, -2.4, 0.8);
    headGroup.add(new THREE.Mesh(chinGeo, skinPaleMat));

    // Cabelos Negros com Mechas Escorrendo pela Frente
    [-1.4, 1.4].forEach(hx => {
      const hairBraid = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 6.2, 5), charcoalClothMat);
      hairBraid.position.set(hx, -2.2, 1.4);
      hairBraid.rotation.z = (hx < 0 ? -0.12 : 0.12);
      headGroup.add(hairBraid);
    });

    // Capuz Pontiagudo de Feiticeira
    const hoodBaseGeo = new THREE.CylinderGeometry(3.2, 3.8, 5.4, 8);
    const hoodBase = new THREE.Mesh(hoodBaseGeo, charcoalClothMat);
    hoodBase.position.set(0, 0.6, -0.4);
    headGroup.add(hoodBase);

    const hoodTipGeo = new THREE.ConeGeometry(3.0, 8.5, 6);
    hoodTipGeo.rotateX(-0.55);
    hoodTipGeo.translate(0, 4.2, -2.5);
    const hoodTip = new THREE.Mesh(hoodTipGeo, charcoalClothMat);
    headGroup.add(hoodTip);

    const hoodBrimGeo = new THREE.CylinderGeometry(3.4, 3.6, 1.4, 8);
    hoodBrimGeo.rotateX(0.28);
    const hoodBrim = new THREE.Mesh(hoodBrimGeo, crimsonSilkMat);
    hoodBrim.position.set(0, 2.2, 1.4);
    headGroup.add(hoodBrim);

    // Olhos de Brasa Incandescente
    const eyeGeo = new THREE.OctahedronGeometry(0.42, 0);
    const eyeL = new THREE.Mesh(eyeGeo, emberGlowMat);
    eyeL.position.set(-1.0, 0.3, 2.1);
    const eyeR = new THREE.Mesh(eyeGeo, emberGlowMat);
    eyeR.position.set(1.0, 0.3, 2.1);
    headGroup.add(eyeL, eyeR);

    // 4. CAPA DAS CINZAS COM DOBRAS GEOMÉTRICAS & BROCHES DE LABAREDA
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 4.2, -2.8);
    const capeGeo = new THREE.PlaneGeometry(9.5, 18.5, 3, 4);
    capeGeo.translate(0, -8.5, 0);
    const capeMesh = new THREE.Mesh(capeGeo, crimsonSilkMat);
    capeMesh.rotation.x = 0.15;
    capeGroup.add(capeMesh);

    const capeInnerGeo = new THREE.PlaneGeometry(9.2, 18.2, 3, 4);
    capeInnerGeo.translate(0, -8.5, 0.05);
    const capeInnerMesh = new THREE.Mesh(capeInnerGeo, moltenAmberMat);
    capeInnerMesh.rotation.x = 0.15;
    capeGroup.add(capeInnerMesh);

    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // Ombreiras Góticas em Bronze Forjado
    [-3.8, 3.8].forEach(ox => {
      const pauldron = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.8, 5), darkBronzeMat);
      pauldron.position.set(ox, 4.2, 0);
      pauldron.rotation.z = (ox < 0 ? Math.PI / 4.5 : -Math.PI / 4.5);
      pauldron.rotation.x = 0.2;
      torsoGroup.add(pauldron);
    });

    // 5. BRAÇO ESQUERDO & LABAREDA DE FOGO VIVO FLUTUANTE NA PALMA
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-4.8, 3.0, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const lSleeveGeo = new THREE.CylinderGeometry(1.8, 2.4, 4.2, 6);
    lSleeveGeo.translate(0, -2.1, 0);
    leftArmGroup.add(new THREE.Mesh(lSleeveGeo, crimsonSilkMat));

    const lForearmGeo = new THREE.CylinderGeometry(1.4, 1.2, 4.4, 6);
    lForearmGeo.translate(0, -5.2, 0);
    leftArmGroup.add(new THREE.Mesh(lForearmGeo, darkBronzeMat));

    const lHand = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.6), skinPaleMat);
    lHand.position.set(0, -7.8, 0.4);
    leftArmGroup.add(lHand);

    // LABAREDA ARCANA FLUTUANTE SOBRE A PALMA
    const fireAuraGroup = new THREE.Group();
    fireAuraGroup.position.set(0, -8.8, 0.8);
    leftArmGroup.add(fireAuraGroup);
    anim.fireAura = fireAuraGroup;

    const fireCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), flameCoreMat);
    const fireSpire = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.4, 5), fireAuraMat);
    fireSpire.position.y = 0.8;
    const fireBase = new THREE.Mesh(new THREE.TetrahedronGeometry(0.85, 0), fireAuraMat);
    fireBase.position.y = -0.4;
    fireAuraGroup.add(fireCore, fireSpire, fireBase);

    // Pequenas brasas orbitantes ao redor da chama da mão
    for (let i = 0; i < 4; i++) {
      const spark = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), emberGlowMat);
      const angle = (i * Math.PI) / 2;
      spark.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 0.4, Math.sin(angle) * 1.6);
      spark._sparkAngle = angle;
      spark._sparkRadius = 1.6;
      fireAuraGroup.add(spark);
      anim.fireParticles.push(spark);
    }

    // 6. BRAÇO DIREITO & CAJADO DAS CINZAS COM NÚCLEO SOLAR
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(4.8, 3.0, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rSleeveGeo = new THREE.CylinderGeometry(1.8, 2.4, 4.2, 6);
    rSleeveGeo.translate(0, -2.1, 0);
    rightArmGroup.add(new THREE.Mesh(rSleeveGeo, crimsonSilkMat));

    const rForearmGeo = new THREE.CylinderGeometry(1.4, 1.2, 4.4, 6);
    rForearmGeo.translate(0, -5.2, 0);
    rightArmGroup.add(new THREE.Mesh(rForearmGeo, darkBronzeMat));

    const rHand = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.6), skinPaleMat);
    rHand.position.set(0, -7.8, 0.4);
    rightArmGroup.add(rHand);

    // CAJADO ÍGNEO DAS CINZAS (Ashwood Flame Staff)
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -7.8, 0.6);
    staffGroup.rotation.x = Math.PI / 12;
    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;

    const staffShaftGeo = new THREE.CylinderGeometry(0.55, 0.70, 28, 7);
    const staffShaft = new THREE.Mesh(staffShaftGeo, ashwoodMat);
    staffShaft.position.y = 2.0;
    staffGroup.add(staffShaft);

    [-8, -2, 5, 11].forEach(sy => {
      const staffRing = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.6, 6), darkBronzeMat);
      staffRing.position.y = sy;
      staffGroup.add(staffRing);
    });

    const staffBaseTip = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 6), darkBronzeMat);
    staffBaseTip.position.y = -12.5;
    staffBaseTip.rotation.x = Math.PI;
    staffGroup.add(staffBaseTip);

    const headSocket = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 2.5, 6), darkBronzeMat);
    headSocket.position.y = 15.5;
    staffGroup.add(headSocket);

    for (let cIdx = 0; cIdx < 4; cIdx++) {
      const clawAngle = (cIdx * Math.PI) / 2;
      const clawGeo = new THREE.BoxGeometry(0.45, 3.8, 0.6);
      clawGeo.translate(0, 1.9, 0);
      const claw = new THREE.Mesh(clawGeo, darkBronzeMat);
      claw.position.set(Math.cos(clawAngle) * 1.3, 16.2, Math.sin(clawAngle) * 1.3);
      claw.rotation.y = -clawAngle;
      claw.rotation.z = Math.cos(clawAngle) * 0.28;
      claw.rotation.x = Math.sin(clawAngle) * 0.28;
      staffGroup.add(claw);
    }

    const orbCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 1), flameCoreMat);
    orbCore.position.y = 18.2;
    staffGroup.add(orbCore);
    anim.staffFlame = orbCore;

    const orbHalo = new THREE.Mesh(new THREE.DodecahedronGeometry(2.1, 0), fireAuraMat);
    orbHalo.position.y = 18.2;
    staffGroup.add(orbHalo);
    anim.staffHalo = orbHalo;

    for (let i = 0; i < 5; i++) {
      const ember = new THREE.Mesh(new THREE.TetrahedronGeometry(0.35, 0), emberGlowMat);
      const angle = (i * Math.PI * 2) / 5;
      ember.position.set(Math.cos(angle) * 2.6, 18.2 + Math.sin(angle) * 0.6, Math.sin(angle) * 2.6);
      ember._emberAngle = angle;
      ember._emberRadius = 2.6;
      staffGroup.add(ember);
      anim.fireParticles.push(ember);
    }

    // 7. PERNAS & BOTAS DE VELUDO E COURO TRATADO
    [-1.6, 1.6].forEach((x, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(x, 8.5, 0);

      const thighGeo = new THREE.CylinderGeometry(1.2, 1.0, 5.0, 6);
      thighGeo.translate(0, -2.5, 0);
      legGroup.add(new THREE.Mesh(thighGeo, charcoalClothMat));

      const bootGeo = new THREE.CylinderGeometry(1.2, 1.0, 5.2, 6);
      bootGeo.translate(0, -6.8, 0);
      legGroup.add(new THREE.Mesh(bootGeo, scorchedLeatherMat));

      const shoeGeo = new THREE.BoxGeometry(1.6, 1.4, 2.6);
      shoeGeo.translate(0, -8.8, 0.5);
      legGroup.add(new THREE.Mesh(shoeGeo, scorchedLeatherMat));

      group.add(legGroup);
      if (idx === 0) anim.leftLeg = legGroup;
      else anim.rightLeg = legGroup;
    });
  }

  // =========================================================================
  // 1.4 PALADINO DA ALVORADA (Paladin Rework Model - Alta Fidelidade 3D)
  // =========================================================================
  function buildPaladinModel(group, anim) {
    anim.isPaladin = true;
    anim.holyMotes = [];

    // Materiais PBR Especiais de Cruzado e Luz Divina
    const holyGoldMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.28,
      metalness: 0.94,
      roughness: 0.18,
      flatShading: true
    }));

    const brightSteelMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.26,
      flatShading: true
    }));

    const darkSteelMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.92,
      roughness: 0.38,
      flatShading: true
    }));

    const ultramarineMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.72,
      side: THREE.DoubleSide,
      flatShading: true
    }));

    const holyWhiteMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.78,
      side: THREE.DoubleSide,
      flatShading: true
    }));

    const purityParchmentMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.85,
      side: THREE.DoubleSide
    }));

    const waxSealMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.55,
      flatShading: true
    }));

    const leatherMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x3b2111,
      roughness: 0.80,
      flatShading: true
    }));

    const holyGlowMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 1.8,
      roughness: 0.15
    }));

    const sapphireMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.3,
      roughness: 0.1,
      flatShading: true
    }));

    const capeMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.82,
      side: THREE.DoubleSide
    }));

    const capeLiningMat = createFlashable(new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.75,
      side: THREE.DoubleSide
    }));

    anim.materials.push(
      holyGoldMat, brightSteelMat, darkSteelMat, ultramarineMat, holyWhiteMat,
      purityParchmentMat, waxSealMat, leatherMat, holyGlowMat, sapphireMat, capeMat
    );

    // 1. TORSO, PEITORAL ANATÔMICO & TABARDO BICOLOR
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Peitoral de Placas de Aço Consagrado (Corte Angular de 8 Faces)
    const chestGeo = new THREE.CylinderGeometry(5.8, 4.4, 9.8, 8);
    const chestMesh = new THREE.Mesh(chestGeo, brightSteelMat);
    torsoGroup.add(chestMesh);

    // Gorjal canelado no pescoço
    const gorgetGeo = new THREE.CylinderGeometry(4.4, 5.0, 2.2, 8);
    gorgetGeo.translate(0, 5.0, 0);
    torsoGroup.add(new THREE.Mesh(gorgetGeo, darkSteelMat));

    // Borda em Ouro Biselado contornando o peitoral
    const trimGeo = new THREE.BoxGeometry(6.2, 1.2, 0.6);
    const trimMesh = new THREE.Mesh(trimGeo, holyGoldMat);
    trimMesh.position.set(0, 3.8, 4.4);
    torsoGroup.add(trimMesh);

    // Grande Brasão da Cruz Solar em Alto Relevo Dourado
    const crestGroup = new THREE.Group();
    crestGroup.position.set(0, 1.2, 4.5);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7.5, 0.6), holyGoldMat);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.5, 0.6), holyGoldMat);
    crossH.position.y = 1.2;
    const sunburst = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), sapphireMat);
    sunburst.position.set(0, 1.2, 0.45);
    crestGroup.add(crossV, crossH, sunburst);
    torsoGroup.add(crestGroup);

    // Cinto Clerical de Couro Sagrado com Fivela Relicário de Ouro
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(4.7, 4.8, 1.8, 10), leatherMat);
    belt.position.y = -4.6;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 1.2), holyGoldMat);
    buckle.position.set(0, -4.6, 4.5);
    torsoGroup.add(belt, buckle);

    // 3 Selos de Pureza pendurados no cinto
    const sealOffsets = [[-3.4, -4.8, 2.8], [3.2, -4.8, 3.0], [4.2, -4.8, 1.2]];
    sealOffsets.forEach(([sx, sy, sz], idx) => {
      const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.35, 8), waxSealMat);
      wax.rotation.x = Math.PI / 2;
      wax.position.set(sx, sy, sz);
      const parchment = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.2 + (idx * 0.4), 0.15), purityParchmentMat);
      parchment.position.set(sx, sy - 2.2, sz - 0.1);
      parchment.rotation.z = (idx === 0 ? 0.08 : -0.06);
      torsoGroup.add(wax, parchment);
    });

    // TABARDO SAGRADO (Bicolor)
    const tabardGroup = new THREE.Group();
    tabardGroup.position.set(0, -4.8, 0);
    torsoGroup.add(tabardGroup);
    anim.tabard = tabardGroup;

    const tabardFL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 9.5, 0.4), holyWhiteMat);
    tabardFL.position.set(-1.25, -4.2, 4.4);
    tabardFL.rotation.x = 0.08;
    const tabardFR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 9.5, 0.4), ultramarineMat);
    tabardFR.position.set(1.25, -4.2, 4.4);
    tabardFR.rotation.x = 0.08;
    const tabardTrimF = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.8, 0.5), holyGoldMat);
    tabardTrimF.position.set(0, -8.6, 4.7);

    const tabardBL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 10.0, 0.4), holyWhiteMat);
    tabardBL.position.set(-1.25, -4.4, -4.4);
    tabardBL.rotation.x = -0.08;
    const tabardBR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 10.0, 0.4), ultramarineMat);
    tabardBR.position.set(1.25, -4.4, -4.4);
    tabardBR.rotation.x = -0.08;

    tabardGroup.add(tabardFL, tabardFR, tabardTrimF, tabardBL, tabardBR);

    // 2. CAPACETE CRUZADO FECHADO & VISOR EM CRUZ
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.2;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const helmDome = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.2, 7.2, 8), brightSteelMat);
    headGroup.add(helmDome);

    const bevor = new THREE.Mesh(new THREE.ConeGeometry(3.8, 3.2, 8), darkSteelMat);
    bevor.rotation.x = Math.PI;
    bevor.position.set(0, -2.6, 0.6);
    headGroup.add(bevor);

    const crestRidge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 7.0), holyGoldMat);
    crestRidge.position.set(0, 4.0, 0);
    headGroup.add(crestRidge);

    // Visor em Cruz Dourada com Brilho
    const visorGroup = new THREE.Group();
    visorGroup.position.set(0, 0.5, 3.8);
    const visorV = new THREE.Mesh(new THREE.BoxGeometry(0.7, 5.2, 0.5), holyGlowMat);
    const visorH = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.7, 0.5), holyGlowMat);
    visorH.position.y = 0.6;
    const visorFrameV = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.6, 0.3), holyGoldMat);
    const visorFrameH = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.6, 0.3), holyGoldMat);
    visorFrameH.position.y = 0.6;
    visorGroup.add(visorFrameV, visorFrameH, visorV, visorH);
    headGroup.add(visorGroup);

    // 3. AURÉOLA SERÁFICA SOLAR COM 8 RAIOS
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 7.5, -0.5);
    headGroup.add(haloGroup);
    anim.halo = haloGroup;

    const haloRing = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.45, 8, 24), holyGoldMat);
    haloRing.rotation.x = Math.PI / 2;
    haloGroup.add(haloRing);

    const haloInner = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.25, 6, 20), holyGlowMat);
    haloInner.rotation.x = Math.PI / 2;
    haloGroup.add(haloInner);

    for (let rIdx = 0; rIdx < 8; rIdx++) {
      const rayAngle = (rIdx * Math.PI * 2) / 8;
      const rayGeo = new THREE.ConeGeometry(0.65, 2.8, 4);
      const ray = new THREE.Mesh(rayGeo, holyGoldMat);
      ray.position.set(Math.cos(rayAngle) * 6.5, 0, Math.sin(rayAngle) * 6.5);
      ray.rotation.z = -rayAngle + Math.PI / 2;
      ray.rotation.x = Math.PI / 2;
      haloGroup.add(ray);
    }

    for (let m = 0; m < 6; m++) {
      const mote = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), holyGlowMat);
      const ang = (m * Math.PI * 2) / 6;
      mote.position.set(Math.cos(ang) * 4.8, Math.sin(ang * 2) * 0.4, Math.sin(ang) * 4.8);
      mote._moteAngle = ang;
      mote._moteRadius = 4.8;
      haloGroup.add(mote);
      anim.holyMotes.push(mote);
    }

    // 4. OMBREIRAS DE ASAS CELESTIAIS
    [-6.5, 6.5].forEach((ox) => {
      const pauldronGroup = new THREE.Group();
      pauldronGroup.position.set(ox, 4.4, 0);

      [0, -1.2, -2.4].forEach((ly, lIdx) => {
        const bladeGeo = new THREE.CylinderGeometry(2.8 - (lIdx * 0.3), 3.4 - (lIdx * 0.3), 2.2, 6);
        const pBlade = new THREE.Mesh(bladeGeo, brightSteelMat);
        pBlade.position.y = ly;
        pauldronGroup.add(pBlade);
      });

      const pSpine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.6, 5.0), holyGoldMat);
      pSpine.position.set(ox > 0 ? 0.6 : -0.6, -0.6, 0);
      pauldronGroup.add(pSpine);

      pauldronGroup.rotation.z = (ox > 0 ? -0.25 : 0.25);
      torsoGroup.add(pauldronGroup);
    });

    // 5. CAPA CERIMONIAL REAL
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 4.4, -4.4);
    const capeGeo = new THREE.PlaneGeometry(11.5, 20.0, 3, 4);
    capeGeo.translate(0, -9.5, 0);
    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeMesh.rotation.x = 0.16;
    capeGroup.add(capeMesh);

    const capeLiningGeo = new THREE.PlaneGeometry(11.2, 19.8, 3, 4);
    capeLiningGeo.translate(0, -9.5, 0.05);
    const capeLining = new THREE.Mesh(capeLiningGeo, capeLiningMat);
    capeLining.rotation.x = 0.16;
    capeGroup.add(capeLining);

    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // 6. BRAÇO ESQUERDO & ESCUDO TORRE AEGIS OF THE DAWN
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6.2, 3.2, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const armGeo = new THREE.CylinderGeometry(1.8, 1.4, 7.5, 6);
    armGeo.translate(0, -3.7, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, brightSteelMat));

    const gauntlet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 2.2), darkSteelMat);
    gauntlet.position.set(0, -7.6, 0.4);
    leftArmGroup.add(gauntlet);

    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-2.2, -4.8, 4.2);
    shieldGroup.rotation.y = -Math.PI / 10;
    leftArmGroup.add(shieldGroup);
    anim.shield = shieldGroup;

    const shieldGeo = new THREE.BoxGeometry(9.6, 17.5, 1.4);
    const shieldMesh = new THREE.Mesh(shieldGeo, ultramarineMat);
    shieldGroup.add(shieldMesh);

    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(10.2, 1.2, 1.6), holyGoldMat);
    borderTop.position.y = 8.4;
    const borderBot = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 1.6), holyGoldMat);
    borderBot.position.y = -8.4;
    shieldGroup.add(borderTop, borderBot);

    const sCrossV = new THREE.Mesh(new THREE.BoxGeometry(2.2, 14.5, 0.8), holyGoldMat);
    sCrossV.position.z = 1.0;
    const sCrossH = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.2, 0.8), holyGoldMat);
    sCrossH.position.set(0, 3.2, 1.0);
    shieldGroup.add(sCrossV, sCrossH);

    const sUmbo = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), sapphireMat);
    sUmbo.position.set(0, 3.2, 1.6);
    shieldGroup.add(sUmbo);

    // 7. BRAÇO DIREITO & MARTELO RELICÁRIO SUNBREAKER
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6.2, 3.2, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rArm = new THREE.Mesh(armGeo, brightSteelMat);
    rightArmGroup.add(rArm);

    const rGauntlet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 2.2), darkSteelMat);
    rGauntlet.position.set(0, -7.6, 0.4);
    rightArmGroup.add(rGauntlet);

    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(0, -7.6, 0.8);
    hammerGroup.rotation.x = Math.PI / 10;
    rightArmGroup.add(hammerGroup);
    anim.weapon = hammerGroup;

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 24, 8), darkSteelMat);
    shaft.position.y = 2.0;
    hammerGroup.add(shaft);

    [-8, -2, 4, 10].forEach(hy => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 8), holyGoldMat);
      ring.position.y = hy;
      hammerGroup.add(ring);
    });

    const baseTip = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.5, 6), holyGoldMat);
    baseTip.position.y = -10.5;
    baseTip.rotation.x = Math.PI;
    hammerGroup.add(baseTip);

    const hammerHeadGroup = new THREE.Group();
    hammerHeadGroup.position.y = 12.8;
    hammerGroup.add(hammerHeadGroup);

    const maceBlock = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.6, 5.8), brightSteelMat);
    hammerHeadGroup.add(maceBlock);

    const spikeBeak = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.8, 4), holyGoldMat);
    spikeBeak.rotation.x = -Math.PI / 2;
    spikeBeak.position.set(0, 0, -4.2);
    hammerHeadGroup.add(spikeBeak);

    const impactFace = new THREE.Mesh(new THREE.BoxGeometry(4.6, 5.0, 1.2), holyGoldMat);
    impactFace.position.set(0, 0, 3.4);
    hammerHeadGroup.add(impactFace);

    const holyCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), holyGlowMat);
    holyCore.position.set(0, 0, 0);
    hammerHeadGroup.add(holyCore);
    anim.hammerCore = holyCore;

    // 8. PERNAS, GREVAS & SABATONS ESPOROADOS
    [-2.8, 2.8].forEach((x, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(x, 9.5, 0);

      const cuisse = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 6.0, 6), darkSteelMat);
      cuisse.position.y = -3.0;
      legGroup.add(cuisse);

      const poleyn = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.4), holyGoldMat);
      poleyn.position.set(0, -6.0, 1.4);
      legGroup.add(poleyn);

      const greave = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 6.2, 6), brightSteelMat);
      greave.position.y = -9.0;
      legGroup.add(greave);

      const sabaton = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 4.2), brightSteelMat);
      sabaton.position.set(0, -12.0, 1.0);
      const spur = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 4), holyGoldMat);
      spur.rotation.x = -Math.PI / 2;
      spur.position.set(0, -12.0, -1.6);
      legGroup.add(sabaton, spur);

      group.add(legGroup);
      if (idx === 0) anim.leftLeg = legGroup;
      else anim.rightLeg = legGroup;
    });
  }

  // 1.5 BERSERKER DO NORTE (Berserker Model)
  function buildBerserkerModel(group, anim) {
    const leatherMat = createFlashable(materials.leather);
    const steelMat = createFlashable(materials.steel);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const furMat = createFlashable(materials.ratFur);
    const skinMat = createFlashable(materials.skinPale);
    const warpaintMat = materials.glowingRed;
    anim.materials.push(leatherMat, steelMat, darkSteelMat, furMat, skinMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    const chestGeo = new THREE.BoxGeometry(10.5, 11, 7.5);
    torsoGroup.add(new THREE.Mesh(chestGeo, skinMat));

    const strapGeo = new THREE.BoxGeometry(11, 2.2, 7.8);
    strapGeo.rotateZ(0.5);
    torsoGroup.add(new THREE.Mesh(strapGeo, leatherMat));
    const strap2Geo = new THREE.BoxGeometry(11, 2.2, 7.8);
    strap2Geo.rotateZ(-0.5);
    torsoGroup.add(new THREE.Mesh(strap2Geo, leatherMat));

    const beltGeo = new THREE.BoxGeometry(11.2, 2.6, 8);
    beltGeo.translate(0, -5, 0);
    torsoGroup.add(new THREE.Mesh(beltGeo, darkSteelMat));

    const furPauldronGeo = new THREE.BoxGeometry(4.8, 3.8, 5.2);
    const furL = new THREE.Mesh(furPauldronGeo, furMat);
    furL.position.set(-6.5, 5, 0);
    torsoGroup.add(furL);
    const furR = new THREE.Mesh(furPauldronGeo, furMat);
    furR.position.set(6.5, 5, 0);
    torsoGroup.add(furR);

    const headGroup = new THREE.Group();
    headGroup.position.y = 8;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const headGeo = new THREE.BoxGeometry(6.4, 7, 6.6);
    headGroup.add(new THREE.Mesh(headGeo, skinMat));

    const paintGeo = new THREE.BoxGeometry(6.5, 1.4, 0.4);
    paintGeo.translate(0, 0.5, 3.4);
    headGroup.add(new THREE.Mesh(paintGeo, warpaintMat));

    const capGeo = new THREE.CylinderGeometry(3.6, 3.8, 2.5, 8);
    capGeo.translate(0, 4, 0);
    headGroup.add(new THREE.Mesh(capGeo, darkSteelMat));

    const hornGeo = new THREE.ConeGeometry(1.2, 5, 5);
    hornGeo.rotateZ(-Math.PI / 3);
    hornGeo.translate(-4.5, 4.5, 0);
    headGroup.add(new THREE.Mesh(hornGeo, materials.bone));

    const hornRGeo = new THREE.ConeGeometry(1.2, 5, 5);
    hornRGeo.rotateZ(Math.PI / 3);
    hornRGeo.translate(4.5, 4.5, 0);
    headGroup.add(new THREE.Mesh(hornRGeo, materials.bone));

    const beardGeo = new THREE.ConeGeometry(2.8, 4.5, 4);
    beardGeo.rotateX(0.4);
    beardGeo.translate(0, -3.2, 2.8);
    headGroup.add(new THREE.Mesh(beardGeo, furMat));

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6.6, 4, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const armGeo = new THREE.CylinderGeometry(1.6, 1.4, 7.5, 6);
    armGeo.translate(0, -3.7, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, skinMat));

    const axeLGroup = new THREE.Group();
    axeLGroup.position.set(0, -6, 2);
    axeLGroup.rotation.x = Math.PI / 4;
    const haftL = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 14, 5), materials.wood);
    axeLGroup.add(haftL);
    const bladeL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 0.5), steelMat);
    bladeL.position.set(2, 4, 0);
    axeLGroup.add(bladeL);
    leftArmGroup.add(axeLGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6.6, 4, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rArm = new THREE.Mesh(armGeo, skinMat);
    rightArmGroup.add(rArm);

    const axeRGroup = new THREE.Group();
    axeRGroup.position.set(0, -6, 2);
    axeRGroup.rotation.x = Math.PI / 4;
    const haftR = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 14, 5), materials.wood);
    axeRGroup.add(haftR);
    const bladeR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 6, 0.5), steelMat);
    bladeR.position.set(-2, 4, 0);
    axeRGroup.add(bladeR);
    rightArmGroup.add(axeRGroup);
    anim.weapon = axeRGroup;

    const legGeo = new THREE.CylinderGeometry(1.7, 1.5, 9, 6);
    legGeo.translate(0, -4.5, 0);
    const legL = new THREE.Group();
    legL.position.set(-3, 9, 0);
    legL.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(3, 9, 0);
    legR.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legR);
    anim.rightLeg = legR;
  }

  // 1.6 NECROMANTE DAS CATACUMBAS (Necromancer Model)
  function buildNecromancerModel(group, anim) {
    const clothMat = createFlashable(materials.darkCloth);
    const boneMat = createFlashable(materials.bone);
    const soulMat = materials.glowingViolet;
    const eyeMat = materials.glowingCyan;
    anim.materials.push(clothMat, boneMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Flowing dark purple/black robe torso
    const chestGeo = new THREE.BoxGeometry(9, 12, 6.8);
    torsoGroup.add(new THREE.Mesh(chestGeo, clothMat));

    // Bone ribcage ornament over robe
    for (let r = -2; r <= 1; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(7 - Math.abs(r) * 0.8, 0.7, 7.2), boneMat);
      rib.position.y = r * 1.8;
      torsoGroup.add(rib);
    }

    // Hood & Ethereal Visage
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const hoodGeo = new THREE.BoxGeometry(7, 7.5, 7.5);
    headGroup.add(new THREE.Mesh(hoodGeo, clothMat));

    // Deep shadow face
    const shadowFace = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 1), materials.blackObsidian);
    shadowFace.position.set(0, 0, 3.4);
    headGroup.add(shadowFace);

    // Glowing cyan eye slits
    const eyeGeo = new THREE.BoxGeometry(0.8, 0.4, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.2, 0.3, 3.9);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.2, 0.3, 3.9);
    headGroup.add(eyeR);

    // Horned skull ornament on hood
    const smallSkull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), boneMat);
    smallSkull.position.set(0, 4.2, 3.2);
    headGroup.add(smallSkull);

    // Left Arm (Casting spectral energy)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5.8, 4, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const sleeveGeo = new THREE.CylinderGeometry(1.8, 2.5, 8, 6);
    sleeveGeo.translate(0, -4, 0);
    leftArmGroup.add(new THREE.Mesh(sleeveGeo, clothMat));

    const soulGlowHand = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), soulMat);
    soulGlowHand.position.set(0, -8, 1);
    leftArmGroup.add(soulGlowHand);

    // Right Arm (Bone Staff with floating soul skull)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5.8, 4, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rSleeve = new THREE.Mesh(sleeveGeo, clothMat);
    rightArmGroup.add(rSleeve);

    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -6, 2);
    staffGroup.rotation.x = Math.PI / 6;

    // Bone Staff Shaft
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 22, 6), boneMat);
    staffGroup.add(staffShaft);

    // Scepter Head: Horned Skull + Floating Soul Orb
    const scepterSkull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), boneMat);
    scepterSkull.position.y = 11;
    staffGroup.add(scepterSkull);

    const scepterSoul = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), soulMat);
    scepterSoul.position.y = 14;
    staffGroup.add(scepterSoul);

    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;

    // Robe Skirt & Legs
    const robeSkirtGeo = new THREE.CylinderGeometry(4.8, 7, 10, 8);
    robeSkirtGeo.translate(0, -5, 0);
    const robeSkirt = new THREE.Mesh(robeSkirtGeo, clothMat);
    torsoGroup.add(robeSkirt);

    const legGeo = new THREE.CylinderGeometry(1.2, 1, 8, 5);
    legGeo.translate(0, -4, 0);
    const legL = new THREE.Group();
    legL.position.set(-2.5, 8, 0);
    legL.add(new THREE.Mesh(legGeo, boneMat));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(2.5, 8, 0);
    legR.add(new THREE.Mesh(legGeo, boneMat));
    group.add(legR);
    anim.rightLeg = legR;
  }

  // 1.7 ASSASSINO SOMBRIO (Assassin Model)
  function buildAssassinModel(group, anim) {
    const darkMat = createFlashable(materials.blackObsidian);
    const leatherMat = createFlashable(materials.leather);
    const redMat = createFlashable(materials.royalRed);
    const steelMat = createFlashable(materials.steel);
    const eyeMat = materials.glowingCyan;
    anim.materials.push(darkMat, leatherMat, redMat, steelMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Slim, aerodynamic leather tunic
    const chestGeo = new THREE.BoxGeometry(8.5, 10.5, 6);
    torsoGroup.add(new THREE.Mesh(chestGeo, darkMat));

    // Crimson ninja sash around waist with trailing ribbons
    const sashGeo = new THREE.BoxGeometry(8.8, 2.2, 6.4);
    sashGeo.translate(0, -4.5, 0);
    torsoGroup.add(new THREE.Mesh(sashGeo, redMat));

    const ribbonGeo = new THREE.PlaneGeometry(3, 12);
    ribbonGeo.translate(0, -6, -3.3);
    const ribbon = new THREE.Mesh(ribbonGeo, redMat);
    torsoGroup.add(ribbon);

    // Cowl & Shadow Mask
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const cowlGeo = new THREE.BoxGeometry(6, 6.5, 6.5);
    headGroup.add(new THREE.Mesh(cowlGeo, darkMat));

    // Piercing eyes in shadows
    const eyeGeo = new THREE.BoxGeometry(0.7, 0.3, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 0.2, 3.3);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 0.2, 3.3);
    headGroup.add(eyeR);

    // Left Arm & Reverse Grip Stiletto
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5.6, 3.5, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const armGeo = new THREE.CylinderGeometry(1.2, 1.1, 6.5, 6);
    armGeo.translate(0, -3.2, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, darkMat));

    const daggerLGroup = new THREE.Group();
    daggerLGroup.position.set(0, -5.5, 1.5);
    daggerLGroup.rotation.x = Math.PI * 0.85; // Reverse icepick grip
    const dBladeL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.3), steelMat);
    dBladeL.position.y = 4;
    daggerLGroup.add(dBladeL);
    const dGuardL = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 0.8), redMat);
    daggerLGroup.add(dGuardL);
    leftArmGroup.add(daggerLGroup);

    // Right Arm & Reverse Grip Stiletto
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5.6, 3.5, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rArm = new THREE.Mesh(armGeo, darkMat);
    rightArmGroup.add(rArm);

    const daggerRGroup = new THREE.Group();
    daggerRGroup.position.set(0, -5.5, 1.5);
    daggerRGroup.rotation.x = Math.PI * 0.85;
    const dBladeR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.3), steelMat);
    dBladeR.position.y = 4;
    daggerRGroup.add(dBladeR);
    const dGuardR = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 0.8), redMat);
    daggerRGroup.add(dGuardR);
    rightArmGroup.add(daggerRGroup);
    anim.weapon = daggerRGroup;

    // Legs
    const legGeo = new THREE.CylinderGeometry(1.3, 1.1, 8.5, 6);
    legGeo.translate(0, -4.2, 0);
    const legL = new THREE.Group();
    legL.position.set(-2.5, 8.5, 0);
    legL.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(2.5, 8.5, 0);
    legR.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legR);
    anim.rightLeg = legR;
  }

  // 1.8 CAVALEIRO NEGRO CAÍDO (Dark Knight Model)
  function buildDarkKnightPlayerModel(group, anim) {
    const blackMat = createFlashable(materials.blackObsidian);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const glowRed = materials.glowingRed;
    const capeMat = createFlashable(materials.crimsonCloth);
    anim.materials.push(blackMat, darkSteelMat, capeMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Heavy Spiked Dark Breastplate
    const chestGeo = new THREE.BoxGeometry(11, 12, 8);
    torsoGroup.add(new THREE.Mesh(chestGeo, blackMat));

    // Chest spikes
    for (let s of [-3, 3]) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3, 4), darkSteelMat);
      spike.rotation.x = Math.PI / 2;
      spike.position.set(s, 2, 4.5);
      torsoGroup.add(spike);
    }

    // Spiked Pauldrons
    const pauldronGeo = new THREE.BoxGeometry(5.2, 4.5, 5.5);
    const pL = new THREE.Mesh(pauldronGeo, blackMat);
    pL.position.set(-7, 5, 0);
    torsoGroup.add(pL);
    const spikeL = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.5, 4), darkSteelMat);
    spikeL.position.set(-7.5, 8, 0);
    torsoGroup.add(spikeL);

    const pR = new THREE.Mesh(pauldronGeo, blackMat);
    pR.position.set(7, 5, 0);
    torsoGroup.add(pR);
    const spikeR = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.5, 4), darkSteelMat);
    spikeR.position.set(7.5, 8, 0);
    torsoGroup.add(spikeR);

    // Horned Dread Helm
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const helmGeo = new THREE.BoxGeometry(7, 8, 7.5);
    headGroup.add(new THREE.Mesh(helmGeo, blackMat));

    // Horizontal Glowing Crimson Visor
    const visorGeo = new THREE.BoxGeometry(5.6, 1, 0.4);
    visorGeo.translate(0, 0.4, 3.9);
    headGroup.add(new THREE.Mesh(visorGeo, glowRed));

    // Menacing Side Helm Horns
    const hornGeo = new THREE.ConeGeometry(1.2, 6, 4);
    hornGeo.rotateZ(-0.6);
    hornGeo.translate(-4.5, 4, 0);
    headGroup.add(new THREE.Mesh(hornGeo, darkSteelMat));
    const hornRGeo = new THREE.ConeGeometry(1.2, 6, 4);
    hornRGeo.rotateZ(0.6);
    hornRGeo.translate(4.5, 4, 0);
    headGroup.add(new THREE.Mesh(hornRGeo, darkSteelMat));

    // Jagged Tattered Cape
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 5, -4.2);
    const capeGeo = new THREE.PlaneGeometry(10, 17, 3, 3);
    capeGeo.translate(0, -8.5, 0);
    capeGroup.add(new THREE.Mesh(capeGeo, capeMat));
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // Left Arm (Heavy Spiked Gauntlet)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-7, 3.5, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const armGeo = new THREE.CylinderGeometry(1.7, 1.5, 7.5, 6);
    armGeo.translate(0, -3.7, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, blackMat));

    // Right Arm & Massive Dark Greatsword
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(7, 3.5, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rArm = new THREE.Mesh(armGeo, blackMat);
    rightArmGroup.add(rArm);

    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -6, 2);
    swordGroup.rotation.x = Math.PI / 4;

    // Dark Greatsword Blade
    const bladeGeo = new THREE.BoxGeometry(2.4, 22, 0.8);
    bladeGeo.translate(0, 11, 0);
    swordGroup.add(new THREE.Mesh(bladeGeo, darkSteelMat));

    // Runic glowing red line in center
    const runeGeo = new THREE.BoxGeometry(0.8, 16, 0.9);
    runeGeo.translate(0, 10, 0);
    swordGroup.add(new THREE.Mesh(runeGeo, glowRed));

    // Spiked Crossguard
    const guardGeo = new THREE.BoxGeometry(8, 1.4, 1.8);
    swordGroup.add(new THREE.Mesh(guardGeo, blackMat));

    // Grip & Pommel
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5, 5), materials.leather);
    hilt.position.y = -2.8;
    swordGroup.add(hilt);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(1.4, 6, 6), darkSteelMat);
    pommel.position.y = -5.6;
    swordGroup.add(pommel);

    rightArmGroup.add(swordGroup);
    anim.weapon = swordGroup;

    // Heavy Plated Sabatons / Legs
    const legGeo = new THREE.CylinderGeometry(1.8, 1.6, 9.5, 6);
    legGeo.translate(0, -4.7, 0);
    const legL = new THREE.Group();
    legL.position.set(-3.2, 9, 0);
    legL.add(new THREE.Mesh(legGeo, blackMat));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(3.2, 9, 0);
    legR.add(new THREE.Mesh(legGeo, blackMat));
    group.add(legR);
    anim.rightLeg = legR;
  }

  // 1.9 ALQUIMISTA DA PESTE (Plague Alchemist Model)
    function buildPlagueAlchemistModel(group, anim) {
  anim.isAlchemist = true;
  anim.materials = [];
  anim.miasmaPuffs = [];

  // =========================================================================
  // PALETA PBR GÓTICA: APOTHECARY OF DEATH (PESTE & ALQUIMIA NEGRA)
  // =========================================================================
  const waxCoatMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x121417,       // Couro encerado negro de médico da peste
    roughness: 0.48,
    metalness: 0.12,
    flatShading: true
  }));
  const darkTunicMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x1e2229,       // Túnica de linho escuro sob o sobretudo
    roughness: 0.78,
    flatShading: true
  }));
  const heavyLeatherMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x2b1c14,       // Couro curtido rústico de correias e coldres
    roughness: 0.72,
    flatShading: true
  }));
  const agedBrassMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0xb38622,       // Latão e cobre envelhecidos de alambique e fivelas
    metalness: 0.88,
    roughness: 0.32,
    emissive: 0x2b1f06,
    emissiveIntensity: 0.18,
    flatShading: true
  }));
  const blackenedSteelMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x181a1e,       // Aço forjado escuro para rebites e ferragens
    metalness: 0.92,
    roughness: 0.30,
    flatShading: true
  }));
  const ivoryBeakMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0xd8cca8,       // Osso envelhecido trabalhado da máscara de corvo
    roughness: 0.52,
    flatShading: true
  }));
  const plagueAcidMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x10b981,       // Ácido cáustico esmeralda luminescente
    emissive: 0x059669,
    emissiveIntensity: 0.95,
    metalness: 0.20,
    roughness: 0.10
  }));
  const alchemicalGlassMat = createFlashable(new THREE.MeshStandardMaterial({
    color: 0x6ee7b7,       // Vidro borossilicato translúcido
    roughness: 0.15,
    metalness: 0.10,
    transparent: true,
    opacity: 0.65
  }));
  const miasmaVaporMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,       // Vapor tóxico esmeralda/verde-peste
    transparent: true,
    opacity: 0.55
  });
  const goggleLensMat = materials.glowingGreen || new THREE.MeshBasicMaterial({ color: 0x10b981 });

  anim.materials.push(
    waxCoatMat, darkTunicMat, heavyLeatherMat, agedBrassMat,
    blackenedSteelMat, ivoryBeakMat, plagueAcidMat, alchemicalGlassMat, miasmaVaporMat
  );

  // =========================================================================
  // 1. TORSO, SOBRETUDO DE COURO ENCERADO & BANDOLEIRA DUPLA DE REAGENTES
  // =========================================================================
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 14.5;
  group.add(torsoGroup);
  anim.torso = torsoGroup;

  // Peitoral do sobretudo encerado
  const coatChestGeo = new THREE.CylinderGeometry(5.2, 4.4, 9.4, 8);
  const coatChest = new THREE.Mesh(coatChestGeo, waxCoatMat);
  torsoGroup.add(coatChest);

  // Lapelas duplas do casaco de médico (abotoamento duplo)
  const lapelL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.8, 0.4), darkTunicMat);
  lapelL.position.set(-1.6, 0.6, 2.5);
  lapelL.rotation.y = -0.15;
  const lapelR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.8, 0.4), darkTunicMat);
  lapelR.position.set(1.6, 0.6, 2.5);
  lapelR.rotation.y = 0.15;
  torsoGroup.add(lapelL, lapelR);

  // Botões de latão envelhecido
  for (let bY = -1.8; bY <= 2.6; bY += 1.4) {
    [-1.2, 1.2].forEach(bX => {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 6), agedBrassMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(bX, bY, 2.7);
      torsoGroup.add(btn);
    });
  }

  // Bandoleira Alquímica Cruzada com Fivelas de Latão
  const bandolier = new THREE.Mesh(new THREE.BoxGeometry(1.4, 14.2, 0.45), heavyLeatherMat);
  bandolier.position.set(0, 0.2, 0.5);
  bandolier.rotation.set(0.12, -0.15, -0.65);
  torsoGroup.add(bandolier);

  // 4 Frascos de Poção Ácida Presos na Bandoleira
  const vialPositions = [
    [-2.2, 2.2, 2.6], [-0.8, 0.8, 2.8], [0.8, -0.6, 2.7], [2.2, -2.0, 2.4]
  ];
  vialPositions.forEach(([vx, vy, vz], idx) => {
    const vialHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 6), heavyLeatherMat);
    vialHolder.position.set(vx, vy, vz);
    vialHolder.rotation.z = 0.65;

    const vialTube = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 2.4, 8), alchemicalGlassMat);
    vialTube.position.set(vx, vy, vz);
    vialTube.rotation.z = 0.65;

    const vialFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.7, 6), plagueAcidMat);
    vialFluid.position.set(vx, vy - 0.2, vz);
    vialFluid.rotation.z = 0.65;

    const vialCork = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.5, 6), heavyLeatherMat);
    vialCork.position.set(vx - 0.7 * 0.65, vy + 0.7 * 0.65, vz);
    vialCork.rotation.z = 0.65;

    torsoGroup.add(vialHolder, vialTube, vialFluid, vialCork);
  });

  // Cinto Tático de Couro com Bolsa de Ingredientes & Incensário Pendurado
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, 1.8, 10), heavyLeatherMat);
  belt.position.y = -4.2;
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.9, 0.8), agedBrassMat);
  buckle.position.set(0, -4.2, 3.6);
  torsoGroup.add(belt, buckle);

  // Bolsa de Filtros e Ervas Medicinais na Cintura
  const herbPouch = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.0, 1.8), heavyLeatherMat);
  herbPouch.position.set(3.8, -4.2, 1.2);
  herbPouch.rotation.y = -0.35;
  const pouchClasp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.4), agedBrassMat);
  pouchClasp.position.set(3.8, -4.2, 2.2);
  torsoGroup.add(herbPouch, pouchClasp);

  // Incensário / Queimador Alquímico Pendurado por Corrente de Latão
  const censerChain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 4), agedBrassMat);
  censerChain.position.set(-3.6, -5.2, 1.2);
  const censerPot = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), agedBrassMat);
  censerPot.position.set(-3.6, -7.0, 1.2);
  const censerSmoke = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), miasmaVaporMat);
  censerSmoke.position.set(-3.6, -6.4, 1.2);
  torsoGroup.add(censerChain, censerPot, censerSmoke);

  // Saia Longa do Sobretudo Fendida (Permite Corrida & Dinâmica Tática)
  [-1.8, 1.8].forEach(x => {
    // Abas Frontais
    const skirtF = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.8, 0.8), waxCoatMat);
    skirtF.position.set(x, -6.8, 2.2);
    skirtF.rotation.x = 0.14;
    skirtF.rotation.y = x > 0 ? -0.10 : 0.10;
    // Abas Traseiras
    const skirtB = new THREE.Mesh(new THREE.BoxGeometry(3.8, 6.2, 0.8), waxCoatMat);
    skirtB.position.set(x, -7.0, -2.2);
    skirtB.rotation.x = -0.16;
    skirtB.rotation.y = x > 0 ? 0.10 : -0.10;
    torsoGroup.add(skirtF, skirtB);
  });

  // =========================================================================
  // 2. RETORTO ALQUÍMICO & APARELHO DE DESTILAÇÃO NAS COSTAS (ALEMBIC PACK)
  // =========================================================================
  const alembicGroup = new THREE.Group();
  alembicGroup.position.set(0, 1.2, -3.2);
  torsoGroup.add(alembicGroup);

  // Tanque Principal da Caldeira em Cobre/Latão Envelhecido
  const boilerTank = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 6.5, 8), agedBrassMat);
  boilerTank.rotation.x = Math.PI / 2;
  alembicGroup.add(boilerTank);

  // Aros de Reforço em Aço Escuro
  [-2.2, 2.2].forEach(z => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.22, 6, 8), blackenedSteelMat);
    ring.position.y = z;
    boilerTank.add(ring);
  });

  // Manômetro de Pressão a Vapor
  const gaugeBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.4, 8), agedBrassMat);
  gaugeBezel.position.set(1.8, 1.6, -0.6);
  gaugeBezel.rotation.z = -0.4;
  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.7, 8), ivoryBeakMat);
  gaugeFace.position.set(1.8, 1.85, -0.6);
  gaugeFace.rotation.x = -Math.PI / 2;
  alembicGroup.add(gaugeBezel, gaugeFace);

  // Serpentina de Destilação em Vidro com Ácido Verde Correndo Dentro
  const glassBulb = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), alchemicalGlassMat);
  glassBulb.position.set(-1.8, -1.2, -0.6);
  const bulbFluid = new THREE.Mesh(new THREE.SphereGeometry(1.0, 6, 6), plagueAcidMat);
  bulbFluid.position.set(-1.8, -1.2, -0.6);
  alembicGroup.add(glassBulb, bulbFluid);

  // Tubo de Exaustão de Vapores Tóxicos
  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 3.8, 6), agedBrassMat);
  chimney.position.set(-1.2, 3.8, -0.4);
  chimney.rotation.z = 0.18;
  const chimneyCap = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.8, 6), blackenedSteelMat);
  chimneyCap.position.set(-1.4, 5.8, -0.4);
  alembicGroup.add(chimney, chimneyCap);

  // =========================================================================
  // 3. CABEÇA: MÁSCARA DE CORVO ANATÔMICA, ÓCULOS DE LATÃO & CHAPÉU DE ABAS
  // =========================================================================
  const headGroup = new THREE.Group();
  headGroup.position.y = 7.6;
  torsoGroup.add(headGroup);
  anim.head = headGroup;

  // Capuz de Couro Encerado Cobrindo Cabeça e Pescoço
  const hoodCowlGeo = new THREE.SphereGeometry(3.1, 12, 10);
  hoodCowlGeo.scale(0.92, 1.05, 1.0);
  const hoodCowl = new THREE.Mesh(hoodCowlGeo, waxCoatMat);
  headGroup.add(hoodCowl);

  // Máscara Facial com Seam de Costura Central
  const maskFace = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.0, 3.4, 8), heavyLeatherMat);
  maskFace.position.set(0, -0.4, 1.2);
  headGroup.add(maskFace);

  // Bico Curvo de Corvo em Osso Envelhecido (Plague Doctor Beak)
  // Construído com curvatura aerodinâmica realista e orifícios de ventilação
  const beakBase = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.2, 6), ivoryBeakMat);
  beakBase.position.set(0, -0.6, 3.2);
  beakBase.rotation.x = Math.PI / 2.1;
  const beakTip = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4.4, 5), ivoryBeakMat);
  beakTip.position.set(0, -1.8, 5.6);
  beakTip.rotation.x = Math.PI / 1.75;
  headGroup.add(beakBase, beakTip);

  // Válvulas / Orifícios de Purificação com Ervas no Bico
  [-0.65, 0.65].forEach(bX => {
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 6), agedBrassMat);
    vent.position.set(bX, -0.8, 3.2);
    vent.rotation.z = bX > 0 ? -0.4 : 0.4;
    headGroup.add(vent);
  });

  // Óculos Herméticos de Proteção Alquímica (Heavy Brass Goggles)
  [-1.25, 1.25].forEach(gX => {
    const goggleBezel = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.8, 8), agedBrassMat);
    goggleBezel.rotation.x = Math.PI / 2;
    goggleBezel.position.set(gX, 0.6, 2.6);

    const goggleLens = new THREE.Mesh(new THREE.CircleGeometry(0.82, 8), goggleLensMat);
    goggleLens.position.set(gX, 0.6, 3.05);

    // Correia lateral dos óculos contornando a cabeça
    const goggleStrap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 2.4), heavyLeatherMat);
    goggleStrap.position.set(gX > 0 ? 2.5 : -2.5, 0.6, 0.8);

    headGroup.add(goggleBezel, goggleLens, goggleStrap);
  });

  // Ponte Central dos Óculos em Latão
  const goggleBridge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.4), agedBrassMat);
  goggleBridge.position.set(0, 0.6, 2.8);
  headGroup.add(goggleBridge);

  // Chapéu Tradicional de Médico da Peste com Abas Largas Circulares
  const hatGroup = new THREE.Group();
  hatGroup.position.set(0, 2.6, 0);
  hatGroup.rotation.x = -0.08;
  headGroup.add(hatGroup);

  // Aba Larga com Leve Curvatura Frontal e Traseira
  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7.4, 0.45, 12), heavyLeatherMat);
  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 3.4, 8), heavyLeatherMat);
  hatCrown.position.y = 1.8;

  // Faixa do Chapéu com Fivela de Latão e Mini Caveira de Corvo
  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(3.85, 3.85, 0.65, 8), darkTunicMat);
  hatBand.position.y = 0.5;
  const hatBuckle = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.4), agedBrassMat);
  hatBuckle.position.set(0, 0.5, 3.85);
  hatGroup.add(hatBrim, hatCrown, hatBand, hatBuckle);

  // =========================================================================
  // 4. BRAÇO ESQUERDO: LUVA CIRÚRGICA & APOIO TÁTICO
  // =========================================================================
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-5.6, 4.4, 0);
  torsoGroup.add(leftShoulder);
  anim.leftArm = leftShoulder;

  // Manga de Couro Encerado
  const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.35, 5.2, 8), waxCoatMat);
  lUpperArm.position.y = -2.6;
  leftShoulder.add(lUpperArm);

  const lElbow = new THREE.Group();
  lElbow.position.y = -5.2;
  leftShoulder.add(lElbow);
  anim.leftElbow = lElbow;

  // Luva Cirúrgica Alta com Punho Dobrado em Couro Rústico
  const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 4.8, 8), heavyLeatherMat);
  lForearm.position.y = -2.4;
  const lGloveCuff = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.5, 1.4, 8), heavyLeatherMat);
  lGloveCuff.position.y = -0.5;
  lElbow.add(lForearm, lGloveCuff);

  const lHand = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, 1.3), heavyLeatherMat);
  lHand.position.set(0, -5.2, 0);
  lElbow.add(lHand);

  // Socket para Mão Esquerda
  const handLSocket = new THREE.Group();
  handLSocket.position.set(0, -5.4, 0);
  lElbow.add(handLSocket);
  anim.handL_socket = handLSocket;

  // =========================================================================
  // 5. BRAÇO DIREITO & O FRASCO DE ÁCIDO CORROSIVO (PLAGUE VITRIOL FLASK)
  // =========================================================================
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(5.6, 4.4, 0);
  torsoGroup.add(rightShoulder);
  anim.rightArm = rightShoulder;

  const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.35, 5.2, 8), waxCoatMat);
  rUpperArm.position.y = -2.6;
  rightShoulder.add(rUpperArm);

  const rElbow = new THREE.Group();
  rElbow.position.y = -5.2;
  rightShoulder.add(rElbow);
  anim.rightElbow = rElbow;

  const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 4.8, 8), heavyLeatherMat);
  rForearm.position.y = -2.4;
  const rGloveCuff = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.5, 1.4, 8), heavyLeatherMat);
  rGloveCuff.position.y = -0.5;
  rElbow.add(rForearm, rGloveCuff);

  const rHand = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, 1.3), heavyLeatherMat);
  rHand.position.set(0, -5.2, 0);
  rElbow.add(rHand);

  // Socket para Mão Direita
  const handRSocket = new THREE.Group();
  handRSocket.position.set(0, -5.4, 0);
  rElbow.add(handRSocket);
  anim.handR_socket = handRSocket;

  // ── FRASCO DE ÁCIDO CORROSIVO 3D (ORNATE PLAGUE MORTAR FLASK) ─────────────
  const flaskGroup = new THREE.Group();
  flaskGroup.position.set(0, 0, 1.2);
  flaskGroup.rotation.set(0.18, -0.12, 0);
  handRSocket.add(flaskGroup);
  anim.weapon = flaskGroup;

  // Bulbo Esférico de Vidro Reforçado
  const flaskGlobe = new THREE.Mesh(new THREE.SphereGeometry(2.3, 10, 10), alchemicalGlassMat);
  flaskGroup.add(flaskGlobe);

  // Núcleo Fluido de Ácido Tóxico Luminescente
  const acidCore = new THREE.Mesh(new THREE.SphereGeometry(1.75, 8, 8), plagueAcidMat);
  flaskGroup.add(acidCore);

  // Gaiola de Proteção em Latão com Escalas de Medição
  for (let rAng = 0; rAng < Math.PI; rAng += Math.PI / 3) {
    const cageRing = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.14, 6, 10), agedBrassMat);
    cageRing.rotation.y = rAng;
    flaskGroup.add(cageRing);
  }

  // Gargalo do Frasco com Rolha de Cortiça e Pavio Químico
  const flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 2.2, 8), agedBrassMat);
  flaskNeck.position.y = 2.4;
  const corkStopper = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.65, 1.2, 6), heavyLeatherMat);
  corkStopper.position.y = 3.6;
  const fuseSpark = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), plagueAcidMat);
  fuseSpark.position.y = 4.4;
  flaskGroup.add(flaskNeck, corkStopper, fuseSpark);

  // =========================================================================
  // 6. PERNAS, CALÇAS ENCERADAS & BOTAS DE COURO COM FIVELAS
  // =========================================================================
  const legGeo = new THREE.CylinderGeometry(1.6, 1.35, 5.6, 8);
  const bootGeo = new THREE.CylinderGeometry(1.5, 1.3, 5.2, 8);
  const footGeo = new THREE.BoxGeometry(1.7, 1.4, 3.8);

  // Perna Esquerda
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-2.4, 9.6, 0);
  group.add(leftLeg);
  anim.leftLeg = leftLeg;

  const lThigh = new THREE.Mesh(legGeo, waxCoatMat);
  lThigh.position.y = -2.6;
  leftLeg.add(lThigh);

  const lKnee = new THREE.Group();
  lKnee.position.y = -5.4;
  leftLeg.add(lKnee);

  const lCalf = new THREE.Mesh(bootGeo, heavyLeatherMat);
  lCalf.position.y = -2.6;
  const lFoot = new THREE.Mesh(footGeo, heavyLeatherMat);
  lFoot.position.set(0, -5.4, 0.8);
  const lBootBuckle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.4), agedBrassMat);
  lBootBuckle.position.set(0, -3.2, 1.4);
  lKnee.add(lCalf, lFoot, lBootBuckle);

  // Perna Direita
  const rightLeg = new THREE.Group();
  rightLeg.position.set(2.4, 9.6, 0);
  group.add(rightLeg);
  anim.rightLeg = rightLeg;

  const rThigh = new THREE.Mesh(legGeo, waxCoatMat);
  rThigh.position.y = -2.6;
  rightLeg.add(rThigh);

  const rKnee = new THREE.Group();
  rKnee.position.y = -5.4;
  rightLeg.add(rKnee);

  const rCalf = new THREE.Mesh(bootGeo, heavyLeatherMat);
  rCalf.position.y = -2.6;
  const rFoot = new THREE.Mesh(footGeo, heavyLeatherMat);
  rFoot.position.set(0, -5.4, 0.8);
  const rBootBuckle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.4), agedBrassMat);
  rBootBuckle.position.set(0, -3.2, 1.4);
  rKnee.add(rCalf, rFoot, rBootBuckle);

  // =========================================================================
  // 7. EFEITOS DE VAPOR TÓXICO / MIASMA DO DESTILADOR (MIASMA PUFFS)
  // =========================================================================
  const puffConfigs = [
    { x: -1.4, y: 7.5, z: -3.8, scale: 0.65, phase: 0 },
    { x: -1.6, y: 8.8, z: -4.0, scale: 0.85, phase: 1.5 },
    { x: -1.2, y: 10.2, z: -4.2, scale: 1.05, phase: 3.0 },
    { x: -3.6, y: -6.2, z: 1.2, scale: 0.45, phase: 2.1 }, // incensário
    { x: 5.6, y: -1.2, z: 2.4, scale: 0.40, phase: 4.2 }   // frasco
  ];

  puffConfigs.forEach(cfg => {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(cfg.scale, 0), miasmaVaporMat);
    puff.position.set(cfg.x, cfg.y, cfg.z);
    torsoGroup.add(puff);
    anim.miasmaPuffs.push({
      mesh: puff,
      baseX: cfg.x,
      baseY: cfg.y,
      baseZ: cfg.z,
      baseScale: cfg.scale,
      phase: cfg.phase
    });
  });

  return group;
}

  // ==========================================
  // 2. ENEMY 3D MODELS & ANIMATIONS
  // ==========================================
  function createEnemyModel(enemy) {
    const root = new THREE.Group();
    const anim = {
      materials: [],
      limbs: [],
      wings: null,
      head: null,
      isBoss: enemy.isBoss,
      uHitFlash: { value: 0.0 },
      uDissolveProgress: { value: 0.0 },
      uTime: { value: 0.0 }
    };

    let type = enemy.type;
    if (type === 'zombie') type = 'villager';
    if (type === 'orc') type = 'dark_knight';
    if (type === 'ghost' || type === 'specter') type = 'witch';
    if (type === 'golem') type = 'boss_golem';
    if (type === 'death_baron' || type === 'lich' || type === 'baron') type = 'boss_death_baron';

    if (type === 'rat') {
      buildPlagueRatModel(root, anim);
    } else if (type === 'skeleton') {
      buildSkeletonModel(root, anim);
    } else if (type === 'villager') {
      buildCursedVillagerModel(root, anim);
    } else if (type === 'dark_knight') {
      buildDarkKnightModel(root, anim);
    } else if (type === 'witch') {
      buildWitchModel(root, anim);
    } else if (type === 'boss_executioner') {
      buildExecutionerBossModel(root, anim);
    } else if (type === 'boss_golem') {
      buildStoneGolemBossModel(root, anim);
    } else if (type === 'boss_baron' || type === 'boss_death_baron') {
      buildDeathBaronBossModel(root, anim);
    } else {
      // Fallback stylized skeleton
      buildSkeletonModel(root, anim);
    }

    // Connect GLSL uniforms to all instantiated materials (GPU Hit Flash & Ash Dissolve)
    root.traverse(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          if (m && m.userData && m.userData.uHitFlash) {
            m.userData.uHitFlash = anim.uHitFlash;
            m.userData.uDissolveProgress = anim.uDissolveProgress;
            m.userData.uTime = anim.uTime;
          }
        });
      }
    });

    // 1. Sombra de contato sob o inimigo (Zero-allocation shared unit geometry)
    const sRadius = (enemy.radius || 12) * 0.75;
    const shadow = new THREE.Mesh(unitCircleGeo, sharedShadowMat);
    shadow.scale.set(sRadius, 1, sRadius);
    shadow.position.y = 0.12;
    root.add(shadow);

    // 2. Indicador visual de Hitbox Vermelha no chão para TODOS os inimigos (raio exato de colisão)
    const attackR = Math.max(6, enemy.radius || 14);
    const isBoss = !!enemy.isBoss;
    const isChampion = !!enemy.isChampion;
    const threatGroup = new THREE.Group();
    threatGroup.position.y = 0.16;

    let ringMat = threatRingMatRegular;
    let fillMat = threatFillMatRegular;
    if (isBoss) {
      ringMat = threatRingMatBoss;
      fillMat = threatFillMatBoss;
    } else if (isChampion) {
      ringMat = threatRingMatElite;
      fillMat = threatFillMatElite;
    }

    const threatRing = new THREE.Mesh(isBoss ? unitRingBossGeo : unitRingGeo, ringMat);
    threatRing.scale.set(attackR, 1, attackR);
    threatGroup.add(threatRing);

    const threatFill = new THREE.Mesh(isBoss ? unitDiscBossGeo : unitDiscGeo, fillMat);
    threatFill.scale.set(attackR, 1, attackR);
    threatGroup.add(threatFill);

    let bossOuterRing = null;
    if (isBoss) {
      bossOuterRing = new THREE.Mesh(unitRingBossGeo, threatRingMatBoss);
      bossOuterRing.scale.set(attackR * 1.25, 1, attackR * 1.25);
      threatGroup.add(bossOuterRing);
    }
    root.add(threatGroup);

    // Elite Champion: Radiant golden runic crown hovering above head
    if (isChampion) {
      const championHalo = new THREE.Mesh(unitRingGeo, threatRingMatElite);
      championHalo.position.y = 20;
      championHalo.rotation.x = Math.PI / 2;
      championHalo.scale.set(7.5, 7.5, 7.5);
      root.add(championHalo);
    }

    // Collect all render meshes for zero-allocation hit flashing (ignoring shadows and threat indicators)
    anim.flashMeshes = [];
    root.traverse(child => {
      if (child.isMesh && child !== shadow && (!threatGroup || !threatGroup.children.includes(child))) {
        child._origMat = child.material;
        anim.flashMeshes.push(child);
      }
    });

    // GLSL Dissolve Hook method called on death
    root.setDissolveProgress = function(progress) {
      anim.uDissolveProgress.value = Math.max(0.0, Math.min(1.0, progress));
    };

    // Update Hook
    root.updateVisuals = function(dt, enemyObj) {
      const walk = enemyObj.walkCycle || 0;
      const angle = Math.atan2(enemyObj.vy, enemyObj.vx);

      // Rotate towards movement direction smoothly
      root.rotation.y = -angle + Math.PI / 2;

      // Limb swing animations
      if (anim.limbs && anim.limbs.length >= 2) {
        const swing = Math.sin(walk) * 0.7;
        for (let i = 0; i < anim.limbs.length; i++) {
          const l = anim.limbs[i];
          if (l.isLeg) {
            l.mesh.rotation.x = (i % 2 === 0 ? swing : -swing);
          } else if (l.isArm) {
            l.mesh.rotation.x = (i % 2 === 0 ? -swing * 0.7 : swing * 0.7);
          } else if (l.isTail) {
            l.mesh.rotation.y = Math.sin(walk * 1.5) * 0.5;
          }
        }
      }

      // Floating bob for witches and Death Baron
      if (anim.isHovering) {
        root.position.y = 4 + Math.sin(walk) * 2.2;
      }

      // Hitbox visual synchronization & boss danger pulsing
      const currentR = Math.max(6, enemyObj.radius || 14);
      if (threatRing) threatRing.scale.set(currentR, 1, currentR);
      if (threatFill) threatFill.scale.set(currentR, 1, currentR);
      const curSRadius = currentR * 0.75;
      shadow.scale.set(curSRadius, 1, curSRadius);

      if (bossOuterRing) {
        const pulse = 1.0 + Math.sin(Date.now() / 200) * 0.08;
        bossOuterRing.scale.set(currentR * 1.25 * pulse, 1, currentR * 1.25 * pulse);
      }

      // GPU GLSL Hit Flash Hook (Hardware uniform transition, zero material swapping)
      const isDamaged = (enemyObj.hp < enemyObj._lastHp);
      enemyObj._lastHp = enemyObj.hp;
      if (isDamaged) {
        anim.uHitFlash.value = 1.0;
      }

      if (anim.uHitFlash.value > 0.0) {
        anim.uHitFlash.value = Math.max(0.0, anim.uHitFlash.value - dt * 8.0);
      }
      anim.uTime.value += dt;

      // Call customized boss visuals (Magma veins pulsing, royal mantle waving, soul wisps)
      if (anim.updateBossVisuals) {
        anim.updateBossVisuals(dt, enemyObj);
      }
    };

    // Scale enemy 3D model up substantially for high visibility, presence, and clarity
    let enemyScale = enemy.isBoss ? 1.45 : 1.40;
    if (enemy.isChampion) {
      enemyScale *= 1.25;
    }
    root.scale.set(enemyScale, enemyScale, enemyScale);

    return root;
  }

  // 2.1 RATO DA PESTE (Plague Rat)
  function buildPlagueRatModel(group, anim) {
    const furMat = createFlashable(materials.ratFur);
    const skinMat = createFlashable(materials.diseasedSkin);
    const eyeMat = materials.glowingRed;
    anim.materials.push(furMat, skinMat);

    // Body
    const bodyGeo = new THREE.ConeGeometry(3.5, 11, 6);
    bodyGeo.rotateX(Math.PI / 2);
    bodyGeo.translate(0, 3, 0);
    const body = new THREE.Mesh(bodyGeo, furMat);
    group.add(body);

    // Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 5), skinMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 2.5, 6.5);
    group.add(snout);

    // Glowing red eyes
    const eyeGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 3.4, 5.2);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 3.4, 5.2);
    group.add(eyeR);

    // Swishing Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 3, -5.5);
    const tailGeo = new THREE.CylinderGeometry(0.4, 0.2, 9, 4);
    tailGeo.rotateX(-0.4);
    tailGeo.translate(0, 0, -4.5);
    const tailMesh = new THREE.Mesh(tailGeo, skinMat);
    tailGroup.add(tailMesh);
    group.add(tailGroup);
    anim.limbs.push({ mesh: tailGroup, isTail: true });

    // 4 Scurrying Paws
    const pawGeo = new THREE.CylinderGeometry(0.5, 0.4, 3, 4);
    pawGeo.translate(0, -1.5, 0);
    const offsets = [
      { x: -2.2, z: 3 },
      { x: 2.2, z: 3 },
      { x: -2.2, z: -3 },
      { x: 2.2, z: -3 }
    ];
    offsets.forEach((off, idx) => {
      const legG = new THREE.Group();
      legG.position.set(off.x, 2.5, off.z);
      legG.add(new THREE.Mesh(pawGeo, skinMat));
      group.add(legG);
      anim.limbs.push({ mesh: legG, isLeg: true });
    });
  }

  // 2.2 ESQUELETO GUERREIRO (Skeleton)
  function buildSkeletonModel(group, anim) {
    const boneMat = createFlashable(materials.bone);
    const steelMat = createFlashable(materials.steel);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const woodMat = createFlashable(materials.wood);
    const eyeMat = materials.glowingCyan;
    anim.materials.push(boneMat, steelMat, darkSteelMat, woodMat);

    // Torso / Ribcage
    const torso = new THREE.Group();
    torso.position.y = 12;
    group.add(torso);

    // Spine & Pelvis
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 9, 6), boneMat);
    torso.add(spine);
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 3.2), boneMat);
    pelvis.position.y = -4.5;
    torso.add(pelvis);

    // 5 Anatomical Ribs & Clavicles
    for (let r = -2; r <= 2; r++) {
      const ribW = 6.4 - Math.abs(r) * 0.9;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(ribW, 0.75, 4.2), boneMat);
      rib.position.y = r * 1.6;
      torso.add(rib);
    }
    const clavicles = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.8, 1.2), boneMat);
    clavicles.position.set(0, 4.2, 0.5);
    torso.add(clavicles);

    // Cracked Skull with Sunken Glowing Cyan Eye Sockets
    const headG = new THREE.Group();
    headG.position.y = 7.0;
    torso.add(headG);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.4, 4.6), boneMat);
    headG.add(skull);
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 2.6), boneMat);
    jaw.position.set(0, -2.4, 1.0);
    headG.add(jaw);

    // Glowing cyan soulfire eye sockets
    const eyeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.4);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.15, 0.3, 2.35);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.15, 0.3, 2.35);
    headG.add(eyeR);

    // Right Arm: Chipped Medieval Broadsword
    const rArmG = new THREE.Group();
    rArmG.position.set(4.4, 2.8, 0);
    torso.add(rArmG);
    const armBoneGeo = new THREE.CylinderGeometry(0.5, 0.4, 7.5, 4);
    armBoneGeo.translate(0, -3.75, 0);
    rArmG.add(new THREE.Mesh(armBoneGeo, boneMat));

    const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 12, 0.35), steelMat);
    swordBlade.position.set(0, -5.5, 3.2);
    swordBlade.rotation.x = Math.PI / 3;
    rArmG.add(swordBlade);
    const crossguard = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.8), darkSteelMat);
    crossguard.position.set(0, -0.6, 0.5);
    crossguard.rotation.x = Math.PI / 3;
    rArmG.add(crossguard);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Left Arm: Spiked Iron-Rimmed Wooden Buckler
    const lArmG = new THREE.Group();
    lArmG.position.set(-4.4, 2.8, 0);
    torso.add(lArmG);
    lArmG.add(new THREE.Mesh(armBoneGeo, boneMat));

    const bucklerWood = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.7, 8), woodMat);
    bucklerWood.rotation.x = Math.PI / 2;
    bucklerWood.position.set(-1.2, -4.2, 1.8);
    lArmG.add(bucklerWood);

    const bucklerRim = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.4, 6, 12), steelMat);
    bucklerRim.position.set(-1.2, -4.2, 2.2);
    lArmG.add(bucklerRim);

    const bucklerSpike = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 6), steelMat);
    bucklerSpike.rotation.x = Math.PI / 2;
    bucklerSpike.position.set(-1.2, -4.2, 2.8);
    lArmG.add(bucklerSpike);

    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Skeletal Legs with Knee Joints
    const legBoneGeo = new THREE.CylinderGeometry(0.6, 0.5, 9, 4);
    legBoneGeo.translate(0, -4.5, 0);

    const legL = new THREE.Group();
    legL.position.set(-2.0, 7.5, 0);
    legL.add(new THREE.Mesh(legBoneGeo, boneMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(2.0, 7.5, 0);
    legR.add(new THREE.Mesh(legBoneGeo, boneMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.3 ZUMBI PUTREFEITO (Cursed Villager / Zombie)
  function buildCursedVillagerModel(group, anim) {
    const clothMat = createFlashable(materials.peasantClothes);
    const zombieSkinMat = createFlashable(materials.zombieSkin);
    const darkClothMat = createFlashable(materials.darkCloth);
    const woodMat = createFlashable(materials.wood);
    const steelMat = createFlashable(materials.steel);
    anim.materials.push(clothMat, zombieSkinMat, darkClothMat, woodMat, steelMat);

    const torso = new THREE.Group();
    torso.position.y = 12;
    torso.rotation.x = 0.28; // Decayed forward hunched posture
    group.add(torso);

    // Tattered Peasant Tunic with Torn Edge
    const chest = new THREE.Mesh(new THREE.BoxGeometry(8.6, 10.5, 5.4), clothMat);
    torso.add(chest);

    const tunicHem = new THREE.Mesh(new THREE.BoxGeometry(9.2, 2.2, 5.8), darkClothMat);
    tunicHem.position.y = -5.2;
    torso.add(tunicHem);

    // Crooked Rotting Zombie Head with Sunken Eye Sockets
    const head = new THREE.Mesh(new THREE.BoxGeometry(4.8, 5.4, 4.8), zombieSkinMat);
    head.position.set(0.6, 7.4, 1.2);
    head.rotation.z = 0.22;
    head.rotation.y = 0.15;
    torso.add(head);

    // Sunken blind zombie eye
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.5, 4, 4), materials.skinPale);
    eyeL.position.set(-0.8, 7.8, 3.6);
    torso.add(eyeL);

    // Grasping Rotting Claw Arms
    const rArmG = new THREE.Group();
    rArmG.position.set(5.2, 3.2, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(1.3, 1.0, 7.5, 5);
    armGeo.translate(0, -3.75, 0);
    rArmG.add(new THREE.Mesh(armGeo, zombieSkinMat));

    // Rusted Pitchfork / Farm Scythe
    const forkShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 19, 5), woodMat);
    forkShaft.position.set(0, -2, 5.5);
    forkShaft.rotation.x = Math.PI / 4;
    rArmG.add(forkShaft);
    const tines = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.2, 0.5), steelMat);
    tines.position.set(0, 5.5, 12);
    rArmG.add(tines);
    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Outstretched Left Claw Arm
    const lArmG = new THREE.Group();
    lArmG.position.set(-5.2, 3.2, 0);
    lArmG.rotation.x = -0.55; // Reaching forward to grab
    lArmG.add(new THREE.Mesh(armGeo, zombieSkinMat));
    const clawHand = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.2), zombieSkinMat);
    clawHand.position.set(0, -7.5, 0);
    lArmG.add(clawHand);
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Shambling Decayed Legs
    const legGeo = new THREE.CylinderGeometry(1.5, 1.2, 8.5, 5);
    legGeo.translate(0, -4.25, 0);

    const legL = new THREE.Group();
    legL.position.set(-2.6, 7.5, 0);
    legL.add(new THREE.Mesh(legGeo, clothMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(2.6, 7.5, 0);
    legR.add(new THREE.Mesh(legGeo, clothMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.4 ORC GUERREIRO DAS SOMBRAS (Dark Knight / Orc Brute)
  function buildDarkKnightModel(group, anim) {
    const orcSkinMat = createFlashable(materials.orcSkin);
    const orcTuskMat = createFlashable(materials.orcTusk);
    const leatherMat = createFlashable(materials.leather);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const steelMat = createFlashable(materials.steel);
    const redGlow = materials.glowingRed;
    anim.materials.push(orcSkinMat, orcTuskMat, leatherMat, darkSteelMat, steelMat);

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    // Broad Muscular Brute Torso
    const chest = new THREE.Mesh(new THREE.BoxGeometry(12, 13.5, 8.5), orcSkinMat);
    torso.add(chest);

    // Studded Hardened Leather War Harness
    const harness = new THREE.Mesh(new THREE.BoxGeometry(12.6, 5, 9.0), leatherMat);
    harness.position.y = 1.5;
    torso.add(harness);

    // Heavy Orc Head & Jaw with Protruding Tusks
    const headG = new THREE.Group();
    headG.position.y = 9.5;
    torso.add(headG);

    const head = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.8, 7.2), orcSkinMat);
    headG.add(head);

    // Horned Iron Skullcap Helm
    const helm = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 7.6), darkSteelMat);
    helm.position.y = 2.4;
    headG.add(helm);

    // Protruding Upward Curved Tusks
    const tuskL = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.0, 5), orcTuskMat);
    tuskL.position.set(-2.2, -2.6, 3.8);
    tuskL.rotation.x = -Math.PI / 4;
    headG.add(tuskL);

    const tuskR = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.0, 5), orcTuskMat);
    tuskR.position.set(2.2, -2.6, 3.8);
    tuskR.rotation.x = -Math.PI / 4;
    headG.add(tuskR);

    // Red Menacing Visor Slit / Eyes
    const visor = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.0, 0.4), redGlow);
    visor.position.set(0, 0.6, 3.75);
    headG.add(visor);

    // Horns on Helm
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(1.3, 5.2, 4), darkSteelMat);
    hornL.rotation.z = -0.75;
    hornL.position.set(-4.2, 3.6, 0);
    headG.add(hornL);
    const hornR = new THREE.Mesh(new THREE.ConeGeometry(1.3, 5.2, 4), darkSteelMat);
    hornR.rotation.z = 0.75;
    hornR.position.set(4.2, 3.6, 0);
    headG.add(hornR);

    // Spiked Pauldrons
    const pL = new THREE.Mesh(new THREE.ConeGeometry(3.8, 5.5, 4), darkSteelMat);
    pL.position.set(-8.0, 4.5, 0);
    torso.add(pL);
    const pR = new THREE.Mesh(new THREE.ConeGeometry(3.8, 5.5, 4), darkSteelMat);
    pR.position.set(8.0, 4.5, 0);
    torso.add(pR);

    // Jagged Serrated Battleaxe / Cleaver
    const rArmG = new THREE.Group();
    rArmG.position.set(7.5, 3.5, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(2.0, 1.7, 8.5, 6);
    armGeo.translate(0, -4.25, 0);
    rArmG.add(new THREE.Mesh(armGeo, orcSkinMat));

    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 22, 6), materials.wood);
    axeShaft.position.set(0, -5, 5);
    axeShaft.rotation.x = Math.PI / 3.4;
    rArmG.add(axeShaft);

    const cleaverBlade = new THREE.Mesh(new THREE.BoxGeometry(4.2, 10, 0.8), darkSteelMat);
    cleaverBlade.position.set(0, 3.5, 10.5);
    cleaverBlade.rotation.x = Math.PI / 3.4;
    rArmG.add(cleaverBlade);

    const cuttingEdge = new THREE.Mesh(new THREE.BoxGeometry(1.2, 10, 0.9), steelMat);
    cuttingEdge.position.set(2.2, 3.5, 10.5);
    cuttingEdge.rotation.x = Math.PI / 3.4;
    rArmG.add(cuttingEdge);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Left Arm
    const lArmG = new THREE.Group();
    lArmG.position.set(-7.5, 3.5, 0);
    lArmG.add(new THREE.Mesh(armGeo, orcSkinMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Stomping Armored Legs
    const legGeo = new THREE.CylinderGeometry(2.2, 1.9, 10.5, 6);
    legGeo.translate(0, -5.25, 0);

    const legL = new THREE.Group();
    legL.position.set(-3.8, 10, 0);
    legL.add(new THREE.Mesh(legGeo, darkSteelMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(3.8, 10, 0);
    legR.add(new THREE.Mesh(legGeo, darkSteelMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.5 FANTASMA ESPECTRAL (Witch / Spectral Ghost)
  function buildWitchModel(group, anim) {
    anim.isHovering = true;
    const spectralMat = createFlashable(materials.spectralShroud);
    const darkVoidMat = createFlashable(materials.darkCloth);
    const glowMat = materials.spectralGlow;
    const darkSteelMat = createFlashable(materials.darkSteel);
    anim.materials.push(spectralMat, darkVoidMat, darkSteelMat);

    const torso = new THREE.Group();
    torso.position.y = 10;
    group.add(torso);

    // Ethereal Floating Shroud Body (Flowing downwards into a phantom tail)
    const shroudGeo = new THREE.ConeGeometry(5.8, 15, 8);
    const shroud = new THREE.Mesh(shroudGeo, spectralMat);
    shroud.position.y = -2.5;
    torso.add(shroud);

    // Whispering Spectral Tail Curving Backwards
    const tailGeo = new THREE.ConeGeometry(3.8, 9, 6);
    tailGeo.rotateX(0.45);
    tailGeo.translate(0, -9.5, -3.2);
    const tailMesh = new THREE.Mesh(tailGeo, spectralMat);
    torso.add(tailMesh);

    // Deep Shadowy Hood Cowl
    const headG = new THREE.Group();
    headG.position.y = 6.8;
    torso.add(headG);

    const hood = new THREE.Mesh(new THREE.ConeGeometry(4.2, 8, 8), spectralMat);
    hood.position.set(0, 3.8, -0.6);
    hood.rotation.x = -0.22;
    headG.add(hood);

    // Faceless Void inside hood
    const voidFace = new THREE.Mesh(new THREE.SphereGeometry(2.6, 6, 6), darkVoidMat);
    voidFace.position.set(0, 0, 0.4);
    headG.add(voidFace);

    // Piercing Spectral Soul Eyes
    const eyeGeo = new THREE.SphereGeometry(0.55, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, glowMat);
    eyeL.position.set(-1.05, 0.2, 2.5);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, glowMat);
    eyeR.position.set(1.05, 0.2, 2.5);
    headG.add(eyeR);

    // Floating Spectral Lantern in right arm
    const rArmG = new THREE.Group();
    rArmG.position.set(4.8, 2, 0);
    torso.add(rArmG);

    // Ghostly draped arm shroud
    const armShroud = new THREE.Mesh(new THREE.ConeGeometry(1.6, 7, 5), spectralMat);
    armShroud.position.set(0, -3.5, 0);
    rArmG.add(armShroud);

    // Iron Lantern Frame & Soul Flame
    const lanternFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.6, 2.4), darkSteelMat);
    lanternFrame.position.set(0, -6.5, 2.2);
    rArmG.add(lanternFrame);

    const soulFlame = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1), glowMat);
    soulFlame.position.set(0, -6.5, 2.2);
    rArmG.add(soulFlame);

    anim.limbs.push({ mesh: rArmG, isArm: true });
  }

  // 2.6 MINI-BOSS: CARRASCO CARMESIM (Executioner Boss)
  function buildExecutionerBossModel(group, anim) {
    const scale = 2.4;
    group.scale.set(scale, scale, scale);

    const skinMat = createFlashable(materials.skinPale);
    const hoodMat = createFlashable(materials.darkSteel);
    const apronMat = createFlashable(materials.royalRed);
    const steelMat = createFlashable(materials.steel);
    anim.materials.push(skinMat, hoodMat, apronMat, steelMat);

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    // Muscular Brute Torso
    const chest = new THREE.Mesh(new THREE.BoxGeometry(13, 13, 9), skinMat);
    torso.add(chest);

    // Bloodied butcher's apron
    const apron = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 1.2), apronMat);
    apron.position.set(0, -3, 4.6);
    torso.add(apron);

    // Executioner Leather Hood
    const headG = new THREE.Group();
    headG.position.y = 9;
    torso.add(headG);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(7, 8, 7.5), hoodMat);
    headG.add(hood);

    // Glowing White/Red Eye Slits
    const eyeGeo = new THREE.BoxGeometry(1.2, 0.6, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, materials.glowingRed);
    eyeL.position.set(-1.6, 0.5, 3.8);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, materials.glowingRed);
    eyeR.position.set(1.6, 0.5, 3.8);
    headG.add(eyeR);

    // Massive Colossal Executioner Axe
    const rArmG = new THREE.Group();
    rArmG.position.set(8.5, 3, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(2.4, 2.1, 9, 6);
    armGeo.translate(0, -4.5, 0);
    rArmG.add(new THREE.Mesh(armGeo, skinMat));

    // Giant double-headed axe
    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 28, 6), materials.wood);
    axeShaft.position.set(0, -3, 6);
    axeShaft.rotation.x = Math.PI / 3;
    rArmG.add(axeShaft);

    // Double axe blades with blood stains
    const bladeGeo = new THREE.BoxGeometry(10, 8, 0.8);
    bladeGeo.translate(0, 9, 6);
    const bladeMesh = new THREE.Mesh(bladeGeo, steelMat);
    bladeMesh.rotation.x = Math.PI / 3;
    rArmG.add(bladeMesh);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Left Arm with Iron Chains
    const lArmG = new THREE.Group();
    lArmG.position.set(-8.5, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, skinMat));
    // Chains wrapped around wrist
    const chain = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.6, 6, 12), materials.darkSteel);
    chain.position.set(0, -7, 0);
    lArmG.add(chain);
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Massive Stomping Legs
    const legGeo = new THREE.CylinderGeometry(2.5, 2.2, 10, 6);
    legGeo.translate(0, -5, 0);

    const legL = new THREE.Group();
    legL.position.set(-4, 10, 0);
    legL.add(new THREE.Mesh(legGeo, materials.leather));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(4, 10, 0);
    legR.add(new THREE.Mesh(legGeo, materials.leather));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.7 MINI-BOSS: GOLEM DE PEDRA COM VEIOS DE MAGMA (Stone Golem Boss)
  function buildStoneGolemBossModel(group, anim) {
    const scale = 2.85;
    group.scale.set(scale, scale, scale);

    const basaltMat = createFlashable(materials.magmaBasalt);
    const stoneMat = createFlashable(materials.stoneGrey);
    const magmaVeinMat = createFlashable(materials.magmaVein);
    const magmaCoreMat = materials.magmaCore;
    anim.materials.push(basaltMat, stoneMat, magmaVeinMat);
    anim.magmaVeinMat = magmaVeinMat;

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    // Segmented Volcanic Basalt Chest
    const chest = new THREE.Mesh(new THREE.DodecahedronGeometry(8.5, 0), basaltMat);
    torso.add(chest);

    // Incandescent Magma Veins crossing chest
    const vein1 = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 8.8), magmaVeinMat);
    vein1.rotation.z = 0.35;
    vein1.rotation.y = 0.25;
    torso.add(vein1);

    const vein2 = new THREE.Mesh(new THREE.BoxGeometry(10, 1.0, 9.0), magmaVeinMat);
    vein2.rotation.z = -0.42;
    vein2.rotation.y = -0.3;
    torso.add(vein2);

    // Glowing Molten Core in hollowed stone ribcage
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(4.2), magmaCoreMat);
    core.position.set(0, 0, 4.2);
    torso.add(core);
    anim.magmaCore = core;

    // Monolithic Volcanic Basalt Head
    const headG = new THREE.Group();
    headG.position.y = 9.8;
    torso.add(headG);

    const head = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.5, 6.5), basaltMat);
    headG.add(head);

    // Basalt Horns / Jagged Crags on head
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 4), basaltMat);
    hornL.position.set(-3.2, 4.5, 0);
    hornL.rotation.z = -0.4;
    headG.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 4), basaltMat);
    hornR.position.set(3.2, 4.5, 0);
    hornR.rotation.z = 0.4;
    headG.add(hornR);

    // Glowing Magma Eye Slits
    const eyeBar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.2, 0.6), magmaVeinMat);
    eyeBar.position.set(0, 0.5, 3.4);
    headG.add(eyeBar);

    // Massive Floating Basalt Boulder Shoulders with Magma Seams
    const pL = new THREE.Group();
    pL.position.set(-10.5, 6.5, 0);
    pL.add(new THREE.Mesh(new THREE.DodecahedronGeometry(4.8, 0), basaltMat));
    const pLVein = new THREE.Mesh(new THREE.RingGeometry(3.2, 4.2, 8), magmaVeinMat);
    pLVein.rotation.y = Math.PI / 2;
    pL.add(pLVein);
    torso.add(pL);

    const pR = new THREE.Group();
    pR.position.set(10.5, 6.5, 0);
    pR.add(new THREE.Mesh(new THREE.DodecahedronGeometry(4.8, 0), basaltMat));
    const pRVein = new THREE.Mesh(new THREE.RingGeometry(3.2, 4.2, 8), magmaVeinMat);
    pRVein.rotation.y = Math.PI / 2;
    pR.add(pRVein);
    torso.add(pR);

    // Colossal Spiked Magma Fists
    const fistGeo = new THREE.BoxGeometry(5.8, 8, 5.8);
    const rArmG = new THREE.Group();
    rArmG.position.set(11, 0, 0);
    rArmG.add(new THREE.Mesh(fistGeo, basaltMat));
    // Magma fissure down right arm
    const rFissure = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.5, 6.2), magmaVeinMat);
    rArmG.add(rFissure);
    // Volcanic basalt spikes on knuckles
    const rSpike = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.8, 4), basaltMat);
    rSpike.rotation.x = Math.PI / 2;
    rSpike.position.set(0, -2, 3.5);
    rArmG.add(rSpike);
    torso.add(rArmG);
    anim.limbs.push({ mesh: rArmG, isArm: true });

    const lArmG = new THREE.Group();
    lArmG.position.set(-11, 0, 0);
    lArmG.add(new THREE.Mesh(fistGeo, basaltMat));
    const lFissure = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.5, 6.2), magmaVeinMat);
    lArmG.add(lFissure);
    const lSpike = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.8, 4), basaltMat);
    lSpike.rotation.x = Math.PI / 2;
    lSpike.position.set(0, -2, 3.5);
    lArmG.add(lSpike);
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Volcanic Basalt Pillar Legs with Glowing Magma Joints
    const legGeo = new THREE.CylinderGeometry(3.4, 3.8, 10.5, 6);
    legGeo.translate(0, -5.25, 0);

    const legL = new THREE.Group();
    legL.position.set(-4.8, 10, 0);
    legL.add(new THREE.Mesh(legGeo, basaltMat));
    const legLJoint = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 1.2, 6), magmaVeinMat);
    legLJoint.position.set(0, -5.25, 0);
    legL.add(legLJoint);
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(4.8, 10, 0);
    legR.add(new THREE.Mesh(legGeo, basaltMat));
    const legRJoint = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 1.2, 6), magmaVeinMat);
    legRJoint.position.set(0, -5.25, 0);
    legR.add(legRJoint);
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });

    // Pulsing magma animation
    anim.updateBossVisuals = function(dt) {
      const pulse = 1.0 + Math.sin(Date.now() / 220) * 0.45;
      if (magmaVeinMat) magmaVeinMat.emissiveIntensity = 1.2 * pulse;
      if (anim.magmaCore) {
        const cPulse = 1.0 + Math.sin(Date.now() / 150) * 0.15;
        anim.magmaCore.scale.set(cPulse, cPulse, cPulse);
      }
    };
  }

  // 2.8 MINI-BOSS: LICH SOBERANO FLUTUANTE COM MANTO IMPERIAL (Death Baron Boss)
  function buildDeathBaronBossModel(group, anim) {
    anim.isHovering = true;
    const scale = 2.65;
    group.scale.set(scale, scale, scale);

    const purpleVelvet = createFlashable(materials.imperialPurple);
    const goldMat = createFlashable(materials.imperialGold);
    const boneMat = createFlashable(materials.bone);
    const purpleGlow = materials.glowingViolet;
    const amethystMat = materials.amethystGem;
    anim.materials.push(purpleVelvet, goldMat, boneMat);

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    // High Arched Gothic Imperial Collar standing upright behind skull
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 4.2, 8, 8, 1, true, -Math.PI * 0.75, Math.PI * 1.5), purpleVelvet);
    collar.position.set(0, 7.5, -1.2);
    torso.add(collar);
    const collarTrim = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.4, 6, 12, Math.PI * 1.5), goldMat);
    collarTrim.position.set(0, 11.5, -1.2);
    collarTrim.rotation.x = Math.PI / 2;
    torso.add(collarTrim);

    // Multi-tiered Sweeping Imperial Purple Velvet Mantle
    const mantleGeo = new THREE.CylinderGeometry(4.2, 9.8, 19, 10);
    const mantle = new THREE.Mesh(mantleGeo, purpleVelvet);
    mantle.position.y = -4.5;
    torso.add(mantle);
    anim.mantle = mantle;

    // Gilded Imperial Gold Hem & Filigree Band
    const mantleHem = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 10.0, 1.8, 10), goldMat);
    mantleHem.position.y = -13.5;
    torso.add(mantleHem);

    // Floating Skeletal Ribs forming a cage around the glowing phylactery
    for (let i = -1; i <= 2; i++) {
      const ribL = new THREE.Mesh(new THREE.TorusGeometry(3.2 - Math.abs(i) * 0.3, 0.45, 6, 12, Math.PI * 0.8), boneMat);
      ribL.position.set(0, i * 2.2, 1.0);
      ribL.rotation.y = -Math.PI * 0.4;
      torso.add(ribL);

      const ribR = new THREE.Mesh(new THREE.TorusGeometry(3.2 - Math.abs(i) * 0.3, 0.45, 6, 12, Math.PI * 0.8), boneMat);
      ribR.position.set(0, i * 2.2, 1.0);
      ribR.rotation.y = Math.PI * 0.4;
      torso.add(ribR);
    }

    // Burning Violet Necrotic Soul Phylactery in chest cavity
    const phylactery = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), purpleGlow);
    phylactery.position.set(0, 2, 0.8);
    torso.add(phylactery);
    anim.phylactery = phylactery;

    // Crowned Imperial Skull
    const headG = new THREE.Group();
    headG.position.y = 8.8;
    torso.add(headG);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.6, 5.2, 4.8), boneMat);
    headG.add(skull);

    // Gothic Imperial Crown of Spires with Amethyst Gems
    const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.4, 1.2, 8), goldMat);
    crownBase.position.y = 3.2;
    headG.add(crownBase);

    for (let s = 0; s < 6; s++) {
      const spireAngle = (s / 6) * Math.PI * 2;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4.2, 4), goldMat);
      spire.position.set(Math.cos(spireAngle) * 3.2, 5.2, Math.sin(spireAngle) * 3.2);
      headG.add(spire);

      // Embedded Amethyst Gem on each spire
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), amethystMat);
      gem.position.set(Math.cos(spireAngle) * 3.5, 4.2, Math.sin(spireAngle) * 3.5);
      headG.add(gem);
    }

    // Deep Glowing Violet Soulfire Eyes
    const eyeGeo = new THREE.SphereGeometry(0.75, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeL.position.set(-1.25, 0.6, 2.5);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeR.position.set(1.25, 0.6, 2.5);
    headG.add(eyeR);

    // Imperial Necrotic Scythe / Scepter
    const rArmG = new THREE.Group();
    rArmG.position.set(6.8, 3, 0);
    torso.add(rArmG);

    const scytheShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 32, 6), materials.darkSteel);
    scytheShaft.position.set(0, -3, 4.5);
    scytheShaft.rotation.x = Math.PI / 4;
    rArmG.add(scytheShaft);

    // Silk wrapping on handle
    const scytheWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 8, 6), purpleVelvet);
    scytheWrap.position.set(0, -3, 4.5);
    scytheWrap.rotation.x = Math.PI / 4;
    rArmG.add(scytheWrap);

    // Huge curved Damascus scythe blade
    const scytheBlade = new THREE.Mesh(new THREE.BoxGeometry(16, 2.8, 0.5), materials.darkSteel);
    scytheBlade.position.set(-7, 11, 12);
    scytheBlade.rotation.z = 0.45;
    rArmG.add(scytheBlade);

    // Glowing Violet Rune Gem on Scythe
    const scytheGem = new THREE.Mesh(new THREE.OctahedronGeometry(2.2), purpleGlow);
    scytheGem.position.set(0, 11, 12);
    rArmG.add(scytheGem);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Orbiting Spectral Soul Wisps
    anim.soulWisps = [];
    for (let w = 0; w < 3; w++) {
      const wisp = new THREE.Mesh(new THREE.SphereGeometry(1.0, 6, 6), purpleGlow);
      torso.add(wisp);
      anim.soulWisps.push({ mesh: wisp, angle: (w / 3) * Math.PI * 2, height: (w - 1) * 4 });
    }

    // Dynamic undulation of royal mantle and orbiting soul wisps
    anim.updateBossVisuals = function(dt) {
      const t = Date.now() / 300;
      if (anim.mantle) anim.mantle.rotation.z = Math.sin(t) * 0.08;
      if (anim.phylactery) {
        const pPulse = 1.0 + Math.sin(Date.now() / 180) * 0.18;
        anim.phylactery.scale.set(pPulse, pPulse, pPulse);
      }
      if (anim.soulWisps) {
        anim.soulWisps.forEach((sw, idx) => {
          sw.angle += dt * (1.8 + idx * 0.4);
          sw.mesh.position.set(
            Math.cos(sw.angle) * 11,
            sw.height + Math.sin(sw.angle * 2) * 2,
            Math.sin(sw.angle) * 11
          );
        });
      }
    };
  }

  // =========================================================================
  // 2.9 THREE.InstancedMesh HORDE GEOMETRIES & MATERIALS (Single Draw Call)
  // =========================================================================
  function mergeColoredGeometries(list) {
    let totalVerts = 0, totalIndices = 0;
    list.forEach(({ geo }) => {
      totalVerts += geo.attributes.position.count;
      if (geo.index) totalIndices += geo.index.count;
    });
    const pos = new Float32Array(totalVerts * 3);
    const norm = new Float32Array(totalVerts * 3);
    const col = new Float32Array(totalVerts * 3);
    const ind = totalIndices > 0 ? new Uint32Array(totalIndices) : null;
    let vOffset = 0, iOffset = 0;

    list.forEach(({ geo, matrix, colorHex }) => {
      const count = geo.attributes.position.count;
      const p = geo.attributes.position;
      const n = geo.attributes.normal;
      const c = new THREE.Color(colorHex);
      const v = new THREE.Vector3();
      const nm = new THREE.Matrix3().getNormalMatrix(matrix);

      for (let i = 0; i < count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(matrix);
        pos[(vOffset + i) * 3] = v.x;
        pos[(vOffset + i) * 3 + 1] = v.y;
        pos[(vOffset + i) * 3 + 2] = v.z;

        if (n) {
          v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize();
          norm[(vOffset + i) * 3] = v.x;
          norm[(vOffset + i) * 3 + 1] = v.y;
          norm[(vOffset + i) * 3 + 2] = v.z;
        }

        col[(vOffset + i) * 3] = c.r;
        col[(vOffset + i) * 3 + 1] = c.g;
        col[(vOffset + i) * 3 + 2] = c.b;
      }

      if (ind && geo.index) {
        for (let i = 0; i < geo.index.count; i++) {
          ind[iOffset + i] = geo.index.getX(i) + vOffset;
        }
        iOffset += geo.index.count;
      }
      vOffset += count;
    });

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    merged.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    merged.setAttribute('color', new THREE.BufferAttribute(col, 3));
    if (ind) merged.setIndex(new THREE.BufferAttribute(ind, 1));
    merged.computeBoundingSphere();
    merged._isShared = true;
    return merged;
  }

  // Cached compound horde geometries
  const hordeGeometries = {};
  const hordeMaterials = {};

  function createHordeCompoundGeometry(type) {
    if (type === 'zombie') type = 'villager';
    if (type === 'orc') type = 'dark_knight';
    if (type === 'ghost' || type === 'specter') type = 'witch';

    if (hordeGeometries[type]) return hordeGeometries[type];

    let geo = null;
    if (type === 'skeleton') {
      const list = [
        // Spine & Pelvis
        { geo: new THREE.CylinderGeometry(0.7, 0.7, 9, 6), matrix: new THREE.Matrix4().makeTranslation(0, 12, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(5.2, 1.8, 3.2), matrix: new THREE.Matrix4().makeTranslation(0, 7.5, 0), colorHex: 0xeae3d2 },
        // Anatomical Ribs & Clavicles
        { geo: new THREE.BoxGeometry(6.4, 0.75, 4.2), matrix: new THREE.Matrix4().makeTranslation(0, 13.5, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(5.8, 0.75, 3.8), matrix: new THREE.Matrix4().makeTranslation(0, 11.5, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(5.0, 0.75, 3.4), matrix: new THREE.Matrix4().makeTranslation(0, 9.5, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(7.8, 0.75, 1.2), matrix: new THREE.Matrix4().makeTranslation(0, 14.8, 0.5), colorHex: 0xeae3d2 },
        // Cracked Skull & Jaw
        { geo: new THREE.BoxGeometry(4.4, 4.4, 4.6), matrix: new THREE.Matrix4().makeTranslation(0, 19, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(3.4, 1.4, 2.8), matrix: new THREE.Matrix4().makeTranslation(0, 16.6, 0.8), colorHex: 0xeae3d2 },
        // Glowing Cyan Soulfire Eye Sockets
        { geo: new THREE.BoxGeometry(0.75, 0.75, 0.4), matrix: new THREE.Matrix4().makeTranslation(-1.15, 19.3, 2.35), colorHex: 0x00f2fe },
        { geo: new THREE.BoxGeometry(0.75, 0.75, 0.4), matrix: new THREE.Matrix4().makeTranslation(1.15, 19.3, 2.35), colorHex: 0x00f2fe },
        // Right Arm & Chipped Medieval Broadsword
        { geo: new THREE.CylinderGeometry(0.5, 0.4, 7.5, 4), matrix: new THREE.Matrix4().makeTranslation(4.6, 12, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.BoxGeometry(1.2, 12, 0.35), matrix: new THREE.Matrix4().makeTranslation(5.2, 10, 2.5), colorHex: 0x9cb0bf },
        { geo: new THREE.BoxGeometry(3.8, 0.8, 0.8), matrix: new THREE.Matrix4().makeTranslation(5.2, 14.5, 2.5), colorHex: 0x3d4757 },
        // Left Arm & Spiked Iron-Rimmed Wooden Buckler
        { geo: new THREE.CylinderGeometry(0.5, 0.4, 7.5, 4), matrix: new THREE.Matrix4().makeTranslation(-4.6, 12, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.CylinderGeometry(3.6, 3.6, 0.7, 8), matrix: new THREE.Matrix4().makeTranslation(-5.2, 10.5, 2.0).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2)), colorHex: 0x5c4228 },
        { geo: new THREE.ConeGeometry(0.75, 2.2, 5), matrix: new THREE.Matrix4().makeTranslation(-5.2, 10.5, 3.2).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2)), colorHex: 0x9cb0bf },
        // Skeletal Leg Femurs
        { geo: new THREE.CylinderGeometry(0.55, 0.45, 8.5, 4), matrix: new THREE.Matrix4().makeTranslation(-2.2, 3.8, 0), colorHex: 0xeae3d2 },
        { geo: new THREE.CylinderGeometry(0.55, 0.45, 8.5, 4), matrix: new THREE.Matrix4().makeTranslation(2.2, 3.8, 0), colorHex: 0xeae3d2 }
      ];
      geo = mergeColoredGeometries(list);
    } else if (type === 'villager') {
      const list = [
        // Hunched Decaying Peasant Torso & Tunic
        { geo: new THREE.BoxGeometry(8.6, 10.5, 5.4), matrix: new THREE.Matrix4().makeTranslation(0, 12, 0).multiply(new THREE.Matrix4().makeRotationX(0.25)), colorHex: 0x7a6550 },
        { geo: new THREE.BoxGeometry(9.0, 2.2, 5.8), matrix: new THREE.Matrix4().makeTranslation(0, 6.8, -0.6), colorHex: 0x30283d },
        // Crooked Rotting Zombie Head with Jaw
        { geo: new THREE.BoxGeometry(4.8, 5.4, 4.8), matrix: new THREE.Matrix4().makeTranslation(0.6, 19.4, 1.2).multiply(new THREE.Matrix4().makeRotationZ(0.2)), colorHex: 0x637a56 },
        { geo: new THREE.SphereGeometry(0.55, 4, 4), matrix: new THREE.Matrix4().makeTranslation(-0.8, 19.8, 3.6), colorHex: 0xd4c6af },
        // Left Outstretched Reaching Rotting Claw Arm
        { geo: new THREE.CylinderGeometry(1.3, 1.0, 7.5, 5), matrix: new THREE.Matrix4().makeTranslation(-5.2, 12, 1.5).multiply(new THREE.Matrix4().makeRotationX(-0.5)), colorHex: 0x637a56 },
        { geo: new THREE.BoxGeometry(1.5, 2.0, 1.2), matrix: new THREE.Matrix4().makeTranslation(-5.2, 8.5, 4.5), colorHex: 0x637a56 },
        // Right Arm holding Rusted Farm Scythe / Cleaver
        { geo: new THREE.CylinderGeometry(1.3, 1.0, 7.5, 5), matrix: new THREE.Matrix4().makeTranslation(5.2, 11, 0), colorHex: 0x637a56 },
        { geo: new THREE.CylinderGeometry(0.5, 0.5, 19, 5), matrix: new THREE.Matrix4().makeTranslation(5.2, 10, 4).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 4)), colorHex: 0x5c4228 },
        { geo: new THREE.BoxGeometry(3.6, 4.0, 0.6), matrix: new THREE.Matrix4().makeTranslation(5.2, 16.5, 9.5), colorHex: 0x3d4757 },
        // Shambling Decayed Legs
        { geo: new THREE.CylinderGeometry(1.4, 1.1, 8.5, 5), matrix: new THREE.Matrix4().makeTranslation(-2.6, 4.2, 0), colorHex: 0x7a6550 },
        { geo: new THREE.CylinderGeometry(1.4, 1.1, 8.5, 5), matrix: new THREE.Matrix4().makeTranslation(2.6, 4.2, 0), colorHex: 0x7a6550 }
      ];
      geo = mergeColoredGeometries(list);
    } else if (type === 'dark_knight') {
      const list = [
        // Heavy Muscular Swamp-Orc Brute Torso
        { geo: new THREE.BoxGeometry(12, 13.5, 8.5), matrix: new THREE.Matrix4().makeTranslation(0, 15, 0), colorHex: 0x3c6633 },
        // Studded Hardened Leather War Harness
        { geo: new THREE.BoxGeometry(12.6, 5, 9.0), matrix: new THREE.Matrix4().makeTranslation(0, 16.5, 0), colorHex: 0x6e4a32 },
        // Heavy Orc Head & Menacing Visor Slit
        { geo: new THREE.BoxGeometry(6.8, 6.8, 7.2), matrix: new THREE.Matrix4().makeTranslation(0, 24.5, 0), colorHex: 0x3c6633 },
        { geo: new THREE.BoxGeometry(7.2, 4.2, 7.6), matrix: new THREE.Matrix4().makeTranslation(0, 26.5, 0), colorHex: 0x3d4757 },
        // Protruding Upward Curved Tusks
        { geo: new THREE.ConeGeometry(0.7, 3.0, 5), matrix: new THREE.Matrix4().makeTranslation(-2.2, 22.2, 3.8).multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 4)), colorHex: 0xf7f2e4 },
        { geo: new THREE.ConeGeometry(0.7, 3.0, 5), matrix: new THREE.Matrix4().makeTranslation(2.2, 22.2, 3.8).multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 4)), colorHex: 0xf7f2e4 },
        // Crimson Glowing War Visor
        { geo: new THREE.BoxGeometry(5.2, 1.0, 0.4), matrix: new THREE.Matrix4().makeTranslation(0, 25.1, 3.75), colorHex: 0xff1744 },
        // Spiked Heavy Pauldrons
        { geo: new THREE.ConeGeometry(3.8, 5.5, 4), matrix: new THREE.Matrix4().makeTranslation(-8.0, 19.5, 0), colorHex: 0x3d4757 },
        { geo: new THREE.ConeGeometry(3.8, 5.5, 4), matrix: new THREE.Matrix4().makeTranslation(8.0, 19.5, 0), colorHex: 0x3d4757 },
        // Colossal Serrated Battleaxe (Shaft, Blade, Polished Razor Cutting Edge)
        { geo: new THREE.CylinderGeometry(0.8, 0.8, 22, 6), matrix: new THREE.Matrix4().makeTranslation(8, 12, 4).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 3.4)), colorHex: 0x5c4228 },
        { geo: new THREE.BoxGeometry(4.2, 10, 0.8), matrix: new THREE.Matrix4().makeTranslation(8, 18.5, 8.5), colorHex: 0x3d4757 },
        { geo: new THREE.BoxGeometry(1.2, 10, 0.9), matrix: new THREE.Matrix4().makeTranslation(10.2, 18.5, 8.5), colorHex: 0x9cb0bf },
        // Heavy Armored Stomping Legs
        { geo: new THREE.CylinderGeometry(2.2, 1.9, 10.5, 6), matrix: new THREE.Matrix4().makeTranslation(-3.8, 5.25, 0), colorHex: 0x3d4757 },
        { geo: new THREE.CylinderGeometry(2.2, 1.9, 10.5, 6), matrix: new THREE.Matrix4().makeTranslation(3.8, 5.25, 0), colorHex: 0x3d4757 }
      ];
      geo = mergeColoredGeometries(list);
    } else if (type === 'witch') {
      const list = [
        // Ethereal Floating Spectral Robe (Flowing down into phantom shroud)
        { geo: new THREE.ConeGeometry(5.8, 15, 8), matrix: new THREE.Matrix4().makeTranslation(0, 11.5, 0), colorHex: 0x266470 },
        // Whispering Spectral Tail Curving Backwards
        { geo: new THREE.ConeGeometry(3.8, 9, 6), matrix: new THREE.Matrix4().makeTranslation(0, 4.0, -3.2).multiply(new THREE.Matrix4().makeRotationX(0.45)), colorHex: 0x266470 },
        // Deep Shadowy Hood Cowl
        { geo: new THREE.ConeGeometry(4.2, 8, 8), matrix: new THREE.Matrix4().makeTranslation(0, 24.6, -0.6).multiply(new THREE.Matrix4().makeRotationX(-0.22)), colorHex: 0x266470 },
        // Faceless Void inside cowl
        { geo: new THREE.SphereGeometry(2.6, 6, 6), matrix: new THREE.Matrix4().makeTranslation(0, 20.8, 0.4), colorHex: 0x161020 },
        // Piercing Spectral Soulfire Eyes
        { geo: new THREE.SphereGeometry(0.55, 4, 4), matrix: new THREE.Matrix4().makeTranslation(-1.05, 21, 2.5), colorHex: 0x00ffcc },
        { geo: new THREE.SphereGeometry(0.55, 4, 4), matrix: new THREE.Matrix4().makeTranslation(1.05, 21, 2.5), colorHex: 0x00ffcc },
        // Outstretched Ghostly Hand holding Hovering Mystical Soul Wisp Orb
        { geo: new THREE.BoxGeometry(2.4, 3.6, 2.4), matrix: new THREE.Matrix4().makeTranslation(5, 14, 2.2), colorHex: 0x266470 },
        { geo: new THREE.DodecahedronGeometry(1.6), matrix: new THREE.Matrix4().makeTranslation(5, 15, 3.8), colorHex: 0x00e5ff }
      ];
      geo = mergeColoredGeometries(list);
    } else {
      geo = createHordeCompoundGeometry('skeleton');
    }

    hordeGeometries[type] = geo;
    return geo;
  }

  function getHordeMaterial(type) {
    if (type === 'zombie') type = 'villager';
    if (type === 'orc') type = 'dark_knight';
    if (type === 'ghost' || type === 'specter') type = 'witch';

    if (hordeMaterials[type]) return hordeMaterials[type];
    const isSpectral = (type === 'witch');
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.55,
      metalness: 0.10,
      emissive: new THREE.Color(0x3e404c),
      emissiveIntensity: 0.45,
      transparent: isSpectral,
      opacity: isSpectral ? 0.88 : 1.0,
      side: THREE.DoubleSide
    });
    mat._isShared = true;
    hordeMaterials[type] = mat;
    return mat;
  }

  // ==========================================
  // 3. 3D ITEMS: XP GEMS & CHESTS
  // ==========================================
  function createGemModel(xpValue) {
    const root = new THREE.Group();
    let geo, mat;

    if (xpValue >= 100) {
      geo = sharedGemGeos.purple;
      mat = sharedGemMats.purple;
    } else if (xpValue >= 25) {
      geo = sharedGemGeos.gold;
      mat = sharedGemMats.gold;
    } else if (xpValue >= 5) {
      geo = sharedGemGeos.silver;
      mat = sharedGemMats.silver;
    } else {
      geo = sharedGemGeos.bronze;
      mat = sharedGemMats.bronze;
    }

    const mesh = new THREE.Mesh(geo, mat);
    root.add(mesh);
    root.position.y = 8;

    root._animTimer = Math.random() * Math.PI * 2;
    root.updateVisuals = function(dt) {
      mesh.rotation.y += dt * 3.0;
      mesh.rotation.x += dt * 1.5;
      root._animTimer += dt * 3.5;
      root.position.y = 7.5 + Math.sin(root._animTimer) * 1.8;
    };

    return root;
  }

  function createChestModel() {
    const root = new THREE.Group();
    const woodMat = materials.wood;
    const goldMat = materials.gold;
    const ironMat = materials.darkSteel;

    // Base Box
    const base = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 11), woodMat);
    base.position.y = 4.5;
    root.add(base);

    // Iron corner bands
    const band1 = new THREE.Mesh(new THREE.BoxGeometry(16.5, 9.2, 1.5), ironMat);
    band1.position.set(0, 4.5, -4);
    root.add(band1);
    const band2 = new THREE.Mesh(new THREE.BoxGeometry(16.5, 9.2, 1.5), ironMat);
    band2.position.set(0, 4.5, 4);
    root.add(band2);

    // Rounded Lid with hinge
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 9, -5.5);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.6, 16.2, 12, 1, false, 0, Math.PI), woodMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 0, 5.5);
    lidGroup.add(lid);
    root.add(lidGroup);

    // Golden lock
    const lock = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 1.2), goldMat);
    lock.position.set(0, 7.5, 5.8);
    root.add(lock);

    // Pulsing aura on ground
    const auraGeo = new THREE.RingGeometry(10, 18, 16);
    auraGeo.rotateX(-Math.PI / 2);
    const aura = new THREE.Mesh(auraGeo, materials.holyGlow);
    root.add(aura);

    root.updateVisuals = function(dt) {
      aura.rotation.y += dt * 1.5;
      const pulse = 1 + Math.sin(Date.now() / 200) * 0.15;
      aura.scale.set(pulse, pulse, 1);
    };

    return root;
  }

  function createDestructibleModel(type) {
    const root = new THREE.Group();
    const woodMat = materials.wood;
    const ironMat = materials.darkSteel;
    const goldMat = materials.gold;
    const stoneMat = materials.blackObsidian || materials.stoneGrey;

    if (type === 'crate') {
      // 1. Heavy Royal Reinforced Armory Crate
      const box = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 14), woodMat);
      box.position.y = 7;
      root.add(box);

      // Top lid frame & plank lines
      const lidFrame = new THREE.Mesh(new THREE.BoxGeometry(14.6, 1.5, 14.6), ironMat);
      lidFrame.position.y = 13.6;
      root.add(lidFrame);

      const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(14.6, 1.5, 14.6), ironMat);
      baseFrame.position.y = 0.8;
      root.add(baseFrame);

      // 4 Heavy Iron Corner Posts
      const postGeo = new THREE.BoxGeometry(1.8, 14.2, 1.8);
      const corners = [[-6.8, -6.8], [6.8, -6.8], [-6.8, 6.8], [6.8, 6.8]];
      corners.forEach(([cx, cz]) => {
        const post = new THREE.Mesh(postGeo, ironMat);
        post.position.set(cx, 7, cz);
        root.add(post);
      });

      // Diagonal Iron Straps (X-brace on front & back)
      const strapGeo = new THREE.BoxGeometry(1.2, 16.5, 0.4);
      const strap1 = new THREE.Mesh(strapGeo, ironMat);
      strap1.position.set(0, 7, 7.2);
      strap1.rotation.z = 0.785;
      root.add(strap1);

      const strap2 = new THREE.Mesh(strapGeo, ironMat);
      strap2.position.set(0, 7, 7.2);
      strap2.rotation.z = -0.785;
      root.add(strap2);

      // Royal Gold Wax Seal / Lock
      const lock = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.6, 6), goldMat);
      lock.rotation.x = Math.PI / 2;
      lock.position.set(0, 7, 7.4);
      root.add(lock);

    } else if (type === 'sarcophagus') {
      // 2. Sculpted Crypt Tomb with Effigy
      const base = new THREE.Mesh(new THREE.BoxGeometry(15, 6, 28), stoneMat);
      base.position.y = 3;
      root.add(base);

      const casket = new THREE.Mesh(new THREE.BoxGeometry(13.5, 6, 26.5), materials.stoneGrey);
      casket.position.y = 7;
      root.add(casket);

      const lid = new THREE.Mesh(new THREE.BoxGeometry(14.5, 2.5, 27.5), stoneMat);
      lid.position.y = 11;
      root.add(lid);

      // Engraved Gilded Cross
      const crossShaft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 16), goldMat);
      crossShaft.position.set(0, 12.4, 0);
      root.add(crossShaft);

      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 2.4), goldMat);
      crossBar.position.set(0, 12.4, -3);
      root.add(crossBar);

      // Crusader Great Helm carving at the head
      const helmRelief = new THREE.Mesh(new THREE.BoxGeometry(5, 2.2, 5), goldMat);
      helmRelief.position.set(0, 12.8, -9);
      root.add(helmRelief);

    } else {
      // 3. Bulging Medieval Oak Wine & Black Powder Cask Barrel
      const botCylinder = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 6.2, 5, 12), woodMat);
      botCylinder.position.y = 2.5;
      root.add(botCylinder);

      const midCylinder = new THREE.Mesh(new THREE.CylinderGeometry(8.0, 7.2, 6, 12), woodMat);
      midCylinder.position.y = 8;
      root.add(midCylinder);

      const topCylinder = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 8.0, 5, 12), woodMat);
      topCylinder.position.y = 13.5;
      root.add(topCylinder);

      // 4 Heavy Forged Iron Hoops
      const hoopGeo1 = new THREE.CylinderGeometry(6.4, 6.4, 1.2, 12, 1, true);
      const hoop1 = new THREE.Mesh(hoopGeo1, ironMat);
      hoop1.position.y = 14.5;
      root.add(hoop1);

      const hoopGeo2 = new THREE.CylinderGeometry(7.7, 7.7, 1.2, 12, 1, true);
      const hoop2 = new THREE.Mesh(hoopGeo2, ironMat);
      hoop2.position.y = 10.5;
      root.add(hoop2);

      const hoopGeo3 = new THREE.CylinderGeometry(7.7, 7.7, 1.2, 12, 1, true);
      const hoop3 = new THREE.Mesh(hoopGeo3, ironMat);
      hoop3.position.y = 5.5;
      root.add(hoop3);

      const hoopGeo4 = new THREE.CylinderGeometry(6.4, 6.4, 1.2, 12, 1, true);
      const hoop4 = new THREE.Mesh(hoopGeo4, ironMat);
      hoop4.position.y = 1.5;
      root.add(hoop4);

      // Spigot / Bung Valve
      const bung = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 6), ironMat);
      bung.rotation.x = Math.PI / 2;
      bung.position.set(0, 8, 8.2);
      root.add(bung);
    }

    return root;
  }

  function createBloodAltarModel() {
    const root = new THREE.Group();
    const stoneMat = materials.blackObsidian || materials.stoneGrey;
    const bloodMat = materials.glowingRed;
    const goldMat = materials.gold;

    // 1. Octagonal Tiered Stone Pedestal
    const basePillar = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 5, 8), stoneMat);
    basePillar.position.y = 2.5;
    root.add(basePillar);

    const midPillar = new THREE.Mesh(new THREE.CylinderGeometry(10, 13, 8, 8), stoneMat);
    midPillar.position.y = 9;
    root.add(midPillar);

    const topPillar = new THREE.Mesh(new THREE.CylinderGeometry(13, 9, 3, 8), stoneMat);
    topPillar.position.y = 14.5;
    root.add(topPillar);

    // 2. Ornate Blood Chalice
    const chalice = new THREE.Mesh(new THREE.CylinderGeometry(8, 4, 6, 8, 1, true), goldMat);
    chalice.position.y = 19;
    root.add(chalice);

    // 3. Boiling Blood Liquid Core
    const liquid = new THREE.Mesh(new THREE.CircleGeometry(7.2, 12), bloodMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 21;
    root.add(liquid);

    // 4. Floating Mystic Blood Crystal / Core
    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(4.5, 0), bloodMat);
    orb.position.y = 30;
    root.add(orb);

    // 5. Pulsing Ground Rune Circle
    const groundRuneGeo = new THREE.RingGeometry(18, 38, 24);
    groundRuneGeo.rotateX(-Math.PI / 2);
    const groundRune = new THREE.Mesh(groundRuneGeo, new THREE.MeshBasicMaterial({ color: 0x990000, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    groundRune.position.y = 0.4;
    root.add(groundRune);

    root.updateVisuals = function(dt) {
      orb.rotation.y += dt * 2.2;
      orb.rotation.z += dt * 1.1;
      const bob = Math.sin(Date.now() * 0.005) * 2.5;
      orb.position.y = 30 + bob;

      groundRune.rotation.y += dt * 0.5;
      const pulse = 1.0 + Math.sin(Date.now() * 0.007) * 0.08;
      groundRune.scale.set(pulse, pulse, 1);
    };

    return root;
  }

  // ==========================================
  // 4. 3D PROJECTILES & WEAPON EFFECTS
  // ==========================================
  function createCrossbowBoltMesh(isEvolved) {
    const root = new THREE.Group();

    // Reinforced Heavy Iron / Molten Shaft (ampliado para alta visibilidade)
    const shaftMat = isEvolved ? materials.darkSteel : materials.wood;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 22, 6), shaftMat);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);

    // Sharp Steel / Molten Arrowhead
    const tipMat = isEvolved ? materials.glowingRed : materials.steel;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(2.6, 7.5, 6), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 12.5;
    root.add(tip);

    // 4 Aerodynamic Fletching Fins
    const fletchMat = isEvolved ? materials.royalRed : materials.crimsonCloth;
    const fletch1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 5.5), fletchMat);
    fletch1.position.z = -9;
    root.add(fletch1);
    const fletch2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 5.5), fletchMat);
    fletch2.position.z = -9;
    root.add(fletch2);

    // 3D Luminous Speed Tracer Streak & Energy Wake
    const tracerGeo = new THREE.ConeGeometry(2.6, 32, 6);
    tracerGeo.rotateX(-Math.PI / 2);
    tracerGeo.translate(0, 0, -22);
    const tracerMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff4500 : 0x00e5ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const tracer = new THREE.Mesh(tracerGeo, tracerMat);
    root.add(tracer);

    root.updateVisuals = function(dt, p) {
      if (tracer) {
        tracer.scale.z = 1.0 + Math.sin(Date.now() * 0.025) * 0.22;
      }
    };

    return root;
  }

  function createThrownAxeMesh(isEvolved) {
    const root = new THREE.Group();

    // Curved wooden haft (ampliado e nítido)
    const handleMat = isEvolved ? materials.blackObsidian : materials.wood;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 22, 6), handleMat);
    root.add(handle);

    // Dual bearded battleaxe blades
    const bladeMat = isEvolved ? materials.royalRed : materials.steel;
    const bladeGeo = new THREE.BoxGeometry(12, 10, 1.4);
    const bladeL = new THREE.Mesh(bladeGeo, bladeMat);
    bladeL.position.set(-6.5, 5.0, 0);
    root.add(bladeL);

    const bladeR = new THREE.Mesh(bladeGeo, bladeMat);
    bladeR.position.set(6.5, 5.0, 0);
    root.add(bladeR);

    // Beveled sharp cutting edges
    const edgeMat = isEvolved ? materials.glowingRed : materials.steel;
    const edgeL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11, 0.6), edgeMat);
    edgeL.position.set(-12.8, 5.0, 0);
    root.add(edgeL);

    const edgeR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11, 0.6), edgeMat);
    edgeR.position.set(12.8, 5.0, 0);
    root.add(edgeR);

    // Center ornate brass collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 5.0, 6), materials.gold);
    collar.position.set(0, 5.0, 0);
    root.add(collar);

    // Luminous Whirling Wind Trail Disc
    const trailGeo = new THREE.RingGeometry(9, 15, 20);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff3838 : 0xbdc581,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const trailMesh = new THREE.Mesh(trailGeo, trailMat);
    trailMesh.position.y = 5.0;
    root.add(trailMesh);

    root.updateVisuals = function(dt, p) {
      if (trailMesh) {
        trailMesh.rotation.z += dt * 24;
        const s = 1.0 + Math.sin(Date.now() * 0.02) * 0.15;
        trailMesh.scale.set(s, s, 1);
      }
    };

    return root;
  }

  function createHolyFireFlaskMesh(isEvolved) {
    const root = new THREE.Group();

    // Large alembic glass vial with liquid core (ampliado para alta legibilidade)
    const glassMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0xffa502,
      transparent: true,
      opacity: 0.8
    });
    const vial = new THREE.Mesh(new THREE.SphereGeometry(6.0, 12, 12), glassMat);
    vial.position.y = 4.0;
    root.add(vial);

    // Incandescent inner holy fire core
    const coreMat = isEvolved ? materials.glowingCyan : materials.flameGlow;
    const core = new THREE.Mesh(new THREE.SphereGeometry(4.5, 10, 10), coreMat);
    core.position.y = 4.0;
    root.add(core);

    // Flask neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 4.8, 8), glassMat);
    neck.position.y = 8.5;
    root.add(neck);

    // Cork stopper
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 2.2, 6), materials.wood);
    cork.position.y = 11.0;
    root.add(cork);

    // Radiant outer flame halo
    const haloMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00d2d3 : 0xff4757,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(7.6, 8, 8), haloMat);
    halo.position.y = 4.0;
    root.add(halo);

    root.updateVisuals = function(dt, p) {
      if (halo) {
        halo.rotation.x += dt * 4;
        halo.rotation.y += dt * 5;
        const s = 1.0 + Math.sin(Date.now() * 0.02) * 0.15;
        halo.scale.set(s, s, s);
      }
    };

    return root;
  }

  function createHolyFirePoolMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 40;

    // Glowing holy consecrated seal on ground
    const ringGeo = new THREE.RingGeometry(r * 0.25, r, 28);
    ringGeo.rotateX(-Math.PI / 2);
    const ringColor = isEvolved ? 0x00d2d3 : 0xff5500;
    const ringMat = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.5;
    root.add(ring);

    // Inner bright core disc
    const coreGeo = new THREE.CircleGeometry(r * 0.5, 20);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: isEvolved ? 0x54a0ff : 0xffcc00, transparent: true, opacity: 0.85 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.6;
    root.add(core);

    // Volumetric 3D Animated Dancing Flames (3 to 5 flame cones)
    const flameMat = isEvolved ? materials.glowingCyan : materials.flameGlow;
    const flames = [];
    const flameCount = 4;
    for (let i = 0; i < flameCount; i++) {
      const fAngle = (i / flameCount) * Math.PI * 2;
      const fDist = r * 0.35;
      const fMesh = new THREE.Mesh(new THREE.ConeGeometry(3.5, 12, 5), flameMat);
      fMesh.position.set(Math.cos(fAngle) * fDist, 6, Math.sin(fAngle) * fDist);
      root.add(fMesh);
      flames.push({ mesh: fMesh, phase: i * 1.5 });
    }

    // Center major flame spout
    const centerFlame = new THREE.Mesh(new THREE.ConeGeometry(4.5, 16, 6), isEvolved ? materials.holyGlow : materials.glowingRed);
    centerFlame.position.y = 8;
    root.add(centerFlame);
    flames.push({ mesh: centerFlame, phase: 0 });

    root.updateVisuals = function(dt) {
      ring.rotation.y += dt * 1.5;
      const time = Date.now() / 100;
      core.scale.setScalar(0.9 + Math.sin(time) * 0.18);

      for (let i = 0; i < flames.length; i++) {
        const f = flames[i];
        const scaleY = 0.8 + Math.sin(time + f.phase) * 0.35;
        f.mesh.scale.set(1, scaleY, 1);
        f.mesh.rotation.y += dt * 2.5;
      }
    };

    return root;
  }

  function createHolyAuraRingMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 52;

    // 1. Soft 2D Area of Effect Disc (flat on the ground plane)
    const discGeo = new THREE.CircleGeometry(r, 48);
    discGeo.rotateX(-Math.PI / 2);
    const discColor = isEvolved ? 0xffd700 : 0x4aa3df;
    const discMat = new THREE.MeshBasicMaterial({
      color: discColor,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.05;
    root.add(disc);

    // 2. Outer 2D Area Boundary Ring (crisp 2D damage perimeter)
    const outerGeo = new THREE.RingGeometry(r * 0.965, r, 64);
    outerGeo.rotateX(-Math.PI / 2);
    const outerColor = isEvolved ? 0xffea79 : 0x70c5ff;
    const outerMat = new THREE.MeshBasicMaterial({
      color: outerColor,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.position.y = 0.07;
    root.add(outer);

    // 3. Inner 2D Concentric Rune Ring
    const innerGeo = new THREE.RingGeometry(r * 0.48, r * 0.52, 40);
    innerGeo.rotateX(-Math.PI / 2);
    const innerColor = isEvolved ? 0xffd700 : 0xa0e0ff;
    const innerMat = new THREE.MeshBasicMaterial({
      color: innerColor,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.08;
    root.add(inner);

    // 4. Dynamic 2D Pulse Shockwave Ring (expands flat on ground when damage pulses)
    const pulseGeo = new THREE.RingGeometry(r * 0.92, r, 54);
    pulseGeo.rotateX(-Math.PI / 2);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffffff : 0xe0f7fa,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.position.y = 0.09;
    root.add(pulse);

    root.updateVisuals = function(dt, currentRadius, pulseAnim = 0) {
      const curR = currentRadius || r;
      const scale = curR / r;
      disc.scale.set(scale, 1, scale);
      outer.scale.set(scale, 1, scale);
      inner.scale.set(scale, 1, scale);

      // Rotate strictly in the 2D horizontal ground plane (around Y axis only)
      outer.rotation.y += dt * 0.35;
      inner.rotation.y -= dt * 0.65;

      // 2D Attack Shockwave Pulse
      if (pulseAnim > 0) {
        pulse.material.opacity = Math.max(0, Math.min(0.9, pulseAnim * 0.9));
        const pWave = 0.88 + (1 - pulseAnim) * 0.12;
        pulse.scale.set(scale * pWave, 1, scale * pWave);
      } else {
        pulse.material.opacity = 0;
      }
    };

    return root;
  }

  function createSwordSlashMesh(isEvolved) {
    const root = new THREE.Group();

    if (isEvolved) {
      // 360° Holy Blade Storm (Lâmina do Monarca Sagrado)
      // Radiant golden ring of sacred blades centered on the hero
      const ringGeo = new THREE.RingGeometry(8, 42, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffea88,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 8;
      root.add(ring);

      const edgeGeo = new THREE.RingGeometry(38, 43, 36);
      edgeGeo.rotateX(-Math.PI / 2);
      const edge = new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }));
      edge.position.y = 8.2;
      root.add(edge);
    } else {
      // Sweeping 3D crescent blade slash wave - tightly anchored to hero hands/sword
      const arcHalf = Math.PI * 0.32; // ~115° natural sword sweep
      const thetaStart = -Math.PI / 2 - arcHalf; // Centered forward toward +Z
      const thetaLength = arcHalf * 2;

      // Inner blade energy body (starts at radius 6, extends to 36)
      const arcGeo = new THREE.RingGeometry(6, 36, 28, 1, thetaStart, thetaLength);
      arcGeo.rotateX(-Math.PI / 2);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0xfffae8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.position.y = 8;
      root.add(arc);

      // Luminous cutting razor edge (radii 33 to 38)
      const edgeGeo = new THREE.RingGeometry(33, 38, 28, 1, thetaStart, thetaLength);
      edgeGeo.rotateX(-Math.PI / 2);
      const edge = new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({
        color: 0xf0c05a,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }));
      edge.position.y = 8.2;
      root.add(edge);
    }

    return root;
  }

  function createSpearShockwaveMesh(isEvolved) {
    const root = new THREE.Group();

    // Radiant vertical/horizontal sonic crescent wave centered toward +Z
    const arcHalf = Math.PI * 0.25;
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;

    const waveGeo = new THREE.RingGeometry(6, 26, 24, 1, thetaStart, thetaLength);
    waveGeo.rotateX(-Math.PI / 2);
    const waveMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffd700 : 0x00e5ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.position.y = 8;
    root.add(wave);

    const crestGeo = new THREE.RingGeometry(22, 27, 24, 1, thetaStart, thetaLength);
    crestGeo.rotateX(-Math.PI / 2);
    const crest = new THREE.Mesh(crestGeo, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    }));
    crest.position.y = 8.2;
    root.add(crest);

    root.updateVisuals = function(dt, p) {
      if (p && p.maxLife) {
        const prog = 1 - (p.life / p.maxLife);
        const s = 0.85 + prog * 0.6;
        root.scale.set(s, s, s);
      }
    };

    return root;
  }

  function createSpearThrustMesh(isEvolved) {
    const root = new THREE.Group();

    // Royal Hardwood / Gold Shaft
    const shaftMat = isEvolved ? materials.royalRed : materials.wood;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 44, 6), shaftMat);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);

    // Winged Golden Crossguard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 2), materials.gold);
    guard.position.z = 18;
    root.add(guard);

    // Gleaming Diamond Halberd / Spearhead
    const spearheadMat = isEvolved ? materials.paladinGold : materials.gold;
    const spearhead = new THREE.Mesh(new THREE.ConeGeometry(2.8, 14, 4), spearheadMat);
    spearhead.rotation.x = Math.PI / 2;
    spearhead.position.z = 28;
    root.add(spearhead);

    return root;
  }

  // 9. Enemy & Boss Projectiles (Distinct 3D models with energetic cores & animations)
  function createEnemyProjectileMesh(type, unblockable) {
    const root = new THREE.Group();

    if (type === 'stone_shard') {
      // Pedregulho pontiagudo multifacetado com veios de magma do Golem
      const rockGeo = new THREE.DodecahedronGeometry(5.2, 0);
      const rockMat = new THREE.MeshLambertMaterial({
        color: 0x474b52,
        roughness: 0.85
      });
      root.add(new THREE.Mesh(rockGeo, rockMat));

      const magmaGeo = new THREE.DodecahedronGeometry(5.4, 0);
      const magmaMat = new THREE.MeshBasicMaterial({
        color: unblockable ? 0xff3838 : 0xff793f,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(magmaGeo, magmaMat));

      // Fragmentos de rochas menores orbitando
      for (let i = 0; i < 3; i++) {
        const miniGeo = new THREE.TetrahedronGeometry(1.6, 0);
        const miniMat = new THREE.MeshLambertMaterial({ color: 0x2f3542 });
        const mini = new THREE.Mesh(miniGeo, miniMat);
        const a = (i / 3) * Math.PI * 2;
        mini.position.set(Math.cos(a) * 7.5, Math.sin(a) * 2.5, Math.sin(a) * 7.5);
        root.add(mini);
      }
    } else if (type === 'death_orb') {
      // Orbe de Vácuo Necrótico com Halo Pulsante e Anel de Runas do Barão da Morte
      const coreGeo = new THREE.SphereGeometry(4.8, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x130024,
        transparent: true,
        opacity: 0.95
      });
      root.add(new THREE.Mesh(coreGeo, coreMat));

      const haloGeo = new THREE.SphereGeometry(6.4, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: unblockable ? 0xff0055 : 0xbe2edd,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(haloGeo, haloMat));

      const runeGeo = new THREE.RingGeometry(7.2, 9.4, 18);
      runeGeo.rotateX(-Math.PI * 0.35);
      const runeMat = new THREE.MeshBasicMaterial({
        color: 0xe056fd,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const runeMesh = new THREE.Mesh(runeGeo, runeMat);
      root.runeRing = runeMesh;
      root.add(runeMesh);
    } else if (type === 'blood_cleave') {
      // Onda cortante carmesim em foice giratória do Carrasco
      const bladeGeo = new THREE.RingGeometry(4, 14, 20, 1, -Math.PI * 0.35, Math.PI * 0.7);
      bladeGeo.rotateX(-Math.PI / 2);
      const bladeMat = new THREE.MeshBasicMaterial({
        color: 0x800000,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      root.add(new THREE.Mesh(bladeGeo, bladeMat));

      const edgeGeo = new THREE.RingGeometry(12, 15.5, 20, 1, -Math.PI * 0.35, Math.PI * 0.7);
      edgeGeo.rotateX(-Math.PI / 2);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: 0xff0044,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(edgeGeo, edgeMat));
    } else if (type === 'poison') {
      // Globo tóxico esmeralda borbulhante da Bruxa
      const coreGeo = new THREE.SphereGeometry(4.2, 14, 14);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x2ed573,
        transparent: true,
        opacity: 0.9
      });
      root.add(new THREE.Mesh(coreGeo, coreMat));

      const shellGeo = new THREE.DodecahedronGeometry(5.8, 1);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0x7bed9f,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(shellGeo, shellMat));
    } else {
      // Projétil sombrio padrão
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(4.0, 12, 12), materials.glowingViolet);
      root.add(sphere);

      const aura = new THREE.Mesh(new THREE.SphereGeometry(5.4, 12, 12), new THREE.MeshBasicMaterial({
        color: 0x9b59b6,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      }));
      root.add(aura);
    }

    return root;
  }

  function createSpectralOrbMesh(isEvolved) {
    const root = new THREE.Group();

    // Group for all animated floating elements
    const orbGroup = new THREE.Group();
    orbGroup.position.y = 8;
    root.add(orbGroup);

    // 1. Núcleo de Alma Pulsante (Luminous Soul Core)
    const coreMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0xd288ff,
      transparent: true,
      opacity: 0.95
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(4.8, 14, 14), coreMat);
    orbGroup.add(core);

    // 2. Concha Etérea de Cristal Fantasmagórico (Ethereal Outer Shell)
    const shellMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00e5ff : 0xbb86fc,
      transparent: true,
      opacity: 0.42,
      wireframe: true
    });
    const shell = new THREE.Mesh(new THREE.DodecahedronGeometry(6.6, 1), shellMat);
    orbGroup.add(shell);

    // 3. Anéis Giroscópicos Rúnicos de Almas (Gyroscopic Orbiting Runic Rings)
    const ringMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x70a1ff : 0xbe2edd,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.4, 6, 24), ringMat);
    orbGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.35, 6, 24), ringMat);
    ring2.rotation.x = Math.PI / 2;
    orbGroup.add(ring2);

    // 4. Espíritos/Wisps Orbitais Dançantes (3 a 4 Satélites de Almas)
    const wispCount = isEvolved ? 4 : 3;
    const wisps = [];
    const wispMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffffff : 0xff79cd,
      transparent: true,
      opacity: 0.90
    });
    const wispGeo = new THREE.SphereGeometry(1.6, 8, 8);

    for (let w = 0; w < wispCount; w++) {
      const wMesh = new THREE.Mesh(wispGeo, wispMat);
      orbGroup.add(wMesh);
      wisps.push(wMesh);
    }

    // 5. Rastro de Cometa Fantasmagórico (Ghostly Ectoplasm Trail)
    const trailCount = 3;
    const trails = [];
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00d2d3 : 0x8854d0,
      transparent: true,
      opacity: 0.35
    });

    for (let t = 0; t < trailCount; t++) {
      const tRad = 3.6 * (1 - t * 0.25);
      const tMesh = new THREE.Mesh(new THREE.SphereGeometry(tRad, 8, 8), trailMat);
      root.add(tMesh);
      trails.push(tMesh);
    }

    let animTime = Math.random() * 10;

    // Procedural Animation Loop
    root.updateVisuals = function(dt, projectile) {
      animTime += dt;

      // Vertical sinusoidal ghost bobbing
      orbGroup.position.y = 8 + Math.sin(animTime * 7.5) * 2.2;

      // Core pulsating breathing
      const pulse = 1.0 + Math.sin(animTime * 9.0) * 0.18;
      core.scale.set(pulse, pulse, pulse);

      // Ethereal shell counter-rotation
      shell.rotation.y -= dt * 3.2;
      shell.rotation.x += dt * 2.1;

      // Gyroscopic rings spinning
      ring1.rotation.x += dt * 4.5;
      ring1.rotation.y += dt * 3.0;
      ring2.rotation.z += dt * 4.0;
      ring2.rotation.y -= dt * 2.5;

      // Orbiting soul wisps
      for (let i = 0; i < wisps.length; i++) {
        const offset = (i / wisps.length) * Math.PI * 2;
        const wSpeed = 5.2 + i * 0.4;
        const orbitR = 10.5 + Math.sin(animTime * 4 + i) * 1.5;
        const wAngle = animTime * wSpeed + offset;
        const wY = Math.sin(animTime * 5 + offset) * 4.5;
        wisps[i].position.set(
          Math.cos(wAngle) * orbitR,
          wY,
          Math.sin(wAngle) * orbitR
        );
        const wPulse = 0.85 + Math.sin(animTime * 12 + i) * 0.25;
        wisps[i].scale.set(wPulse, wPulse, wPulse);
      }

      // Trailing comet segments behind projectile movement vector
      const moveAngle = projectile && projectile.angle !== undefined ? projectile.angle : 0;
      const cosA = Math.cos(moveAngle);
      const sinA = Math.sin(moveAngle);

      for (let t = 0; t < trails.length; t++) {
        const distBack = (t + 1) * 7.5;
        const wobble = Math.sin(animTime * 14 - t * 0.8) * 2.0;
        trails[t].position.set(
          -cosA * distBack - sinA * wobble,
          8 + Math.sin(animTime * 7.5 - t * 0.5) * 1.8,
          -sinA * distBack + cosA * wobble
        );
        const trailFade = Math.max(0.05, 0.45 - t * 0.12);
        trails[t].material.opacity = trailFade;
      }
    };

    return root;
  }

  function createPlagueFlaskMesh(isEvolved) {
    const root = new THREE.Group();

    // Large glass alembic globe (ampliado para alta visibilidade)
    const glassMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0x2ed573,
      transparent: true,
      opacity: 0.78
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(6.8, 14, 14), glassMat);
    globe.position.y = 5.0;
    root.add(globe);

    // Highly luminous caustic acid interior fluid
    const fluidMat = isEvolved ? materials.glowingCyan : materials.glowingGreen;
    const fluid = new THREE.Mesh(new THREE.SphereGeometry(5.2, 12, 12), fluidMat);
    fluid.position.y = 4.6;
    root.add(fluid);

    // Reinforced chemist vial neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 5.2, 8), glassMat);
    neck.position.y = 9.8;
    root.add(neck);

    // Heavy brass band collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.2, 8), materials.gold);
    collar.position.y = 8.5;
    root.add(collar);

    // Cork stopper on top
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 2.5, 6), materials.wood);
    cork.position.y = 12.5;
    root.add(cork);

    // Toxic mist vapor halo surrounding the flying flask
    const haloMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00d2d3 : 0x10ac84,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(8.5, 8, 8), haloMat);
    halo.position.y = 5.0;
    root.add(halo);

    root.updateVisuals = function(dt, p) {
      if (halo) {
        halo.rotation.x += dt * 4;
        halo.rotation.y += dt * 6;
        const s = 1.0 + Math.sin(Date.now() * 0.02) * 0.15;
        halo.scale.set(s, s, s);
      }
    };

    return root;
  }

  function createPlaguePuddleMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 40;
    const poolGeo = new THREE.RingGeometry(1, r, 28);
    poolGeo.rotateX(-Math.PI / 2);
    const poolColor = isEvolved ? 0x00b894 : 0x27ae60;
    const poolMat = new THREE.MeshBasicMaterial({ color: poolColor, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.y = 0.35;
    root.add(pool);

    // Luminous corrosive perimeter ring
    const borderGeo = new THREE.RingGeometry(r - 3.0, r + 1.0, 28);
    borderGeo.rotateX(-Math.PI / 2);
    const borderMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0x2ed573,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = 0.38;
    root.add(border);

    // Dynamic animated toxic bubbles that actively rise, pulse and pop in 3D
    const bubbles = [];
    const bubbleMat = isEvolved ? materials.glowingCyan : materials.glowingGreen;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + (i * 0.4);
      const dist = r * (0.28 + (i % 3) * 0.22);
      const bMesh = new THREE.Mesh(new THREE.SphereGeometry(3.2, 8, 8), bubbleMat);
      bMesh.position.set(Math.cos(angle) * dist, 0.8, Math.sin(angle) * dist);
      bMesh._baseY = 0.8;
      bMesh._phase = i * 1.15;
      root.add(bMesh);
      bubbles.push(bMesh);
    }

    // Active animation hook called each frame by renderer
    root.updateVisuals = function(dt) {
      const now = Date.now() / 220;
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        const cycle = Math.sin(now + b._phase);
        const scale = 0.5 + Math.max(0, cycle) * 0.9;
        b.scale.set(scale, scale, scale);
        b.position.y = b._baseY + Math.max(0, cycle) * 3.0;
      }
      border.rotation.y += dt * 0.6;
    };

    return root;
  }

  // 10. Colossal Dark Greatsword Slash Mesh (Massive obsidian cleave with dark void edge & demonic teeth)
  function createDarkSlashMesh(isEvolved) {
    const root = new THREE.Group();
    const arcRadius = 48;
    const arcHalf = isEvolved ? Math.PI : (Math.PI * 0.38);
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;

    // 1. Núcleo interno de obsidiana negra profunda
    const coreGeo = new THREE.RingGeometry(isEvolved ? 12 : 8, arcRadius * 0.86, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x220205 : 0x0c0618,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    root.add(new THREE.Mesh(coreGeo, coreMat));

    // 2. Gume afiado luminoso abissal / carmesim
    const edgeGeo = new THREE.RingGeometry(arcRadius * 0.76, arcRadius, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    edgeGeo.rotateX(-Math.PI / 2);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff0044 : 0x9b59b6,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(edgeGeo, edgeMat));

    // 3. Fio externo ultra-cortante (brilho puro no perímetro)
    const rimGeo = new THREE.RingGeometry(arcRadius * 0.94, arcRadius * 1.04, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    rimGeo.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffffff : 0xdfb0ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(rimGeo, rimMat));

    // 4. Espinhos serrilhados de obsidiana na silhueta da lâmina
    const spikeGeo = new THREE.ConeGeometry(1.8, 8, 4);
    spikeGeo.rotateX(Math.PI / 2);
    const spikeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff1744 : 0x6c5ce7,
      transparent: true,
      opacity: 0.9
    });

    const spikeAngles = isEvolved 
      ? [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75]
      : [-arcHalf * 0.55, 0, arcHalf * 0.55];

    for (let k = 0; k < spikeAngles.length; k++) {
      const a = spikeAngles[k];
      const sm = new THREE.Mesh(spikeGeo, spikeMat);
      sm.position.set(Math.sin(a) * (arcRadius * 0.94), 0.2, Math.cos(a) * (arcRadius * 0.94));
      sm.rotation.y = a;
      root.add(sm);
    }

    return root;
  }

  // Abyssal Fissure Mesh (Jagged ground fissure with obsidian spikes & void rift)
  function createAbyssalFissureMesh(isEvolved) {
    const root = new THREE.Group();

    // 1. Fenda no solo (Base escura alargada)
    const riftGeo = new THREE.PlaneGeometry(16, 28);
    riftGeo.rotateX(-Math.PI / 2);
    const riftMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x220000 : 0x0e071c,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    root.add(new THREE.Mesh(riftGeo, riftMat));

    // 2. Núcleo incandescente de energia abissal na fenda
    const energyGeo = new THREE.PlaneGeometry(6, 24);
    energyGeo.rotateX(-Math.PI / 2);
    const energyMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff1744 : 0x9b59b6,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const energyMesh = new THREE.Mesh(energyGeo, energyMat);
    energyMesh.position.y = 0.2;
    root.add(energyMesh);

    // 3. Espinhos pontiagudos de obsidiana emergindo da terra
    const spikeGeo = new THREE.ConeGeometry(1.6, 6.5, 4);
    const spikeMat = new THREE.MeshLambertMaterial({
      color: isEvolved ? 0x3d0000 : 0x1a1128,
      emissive: isEvolved ? 0xaa0022 : 0x4a148c,
      emissiveIntensity: 0.5
    });

    const positions = [
      { x: -3.5, z: -7, h: 5.0, rotZ: -0.2 },
      { x: 3.2, z: -2, h: 6.8, rotZ: 0.25 },
      { x: -2.8, z: 4, h: 5.5, rotZ: -0.18 },
      { x: 2.5, z: 9, h: 4.5, rotZ: 0.15 }
    ];

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const sm = new THREE.Mesh(spikeGeo, spikeMat);
      sm.scale.set(1, p.h / 6.5, 1);
      sm.position.set(p.x, p.h * 0.45, p.z);
      sm.rotation.z = p.rotZ;
      root.add(sm);
    }

    return root;
  }

  function createDaggerSlashMesh(isEvolved) {
    const root = new THREE.Group();
    const arcRadius = 32;
    const bladeGeo = new THREE.RingGeometry(4, arcRadius, 20, 1, -Math.PI * 0.3, Math.PI * 0.6);
    bladeGeo.rotateX(-Math.PI / 2);
    const bladeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff7675 : 0x74b9ff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    root.add(bladeMesh);
    return root;
  }

  // 11. Flail Mesh
  function createFlailMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = isEvolved ? materials.gold : materials.darkSteel;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(5.2, 8, 8), mat);
    root.add(ball);

    // Iron spikes around ball
    const spikeGeo = new THREE.ConeGeometry(1.2, 4.5, 4);
    spikeGeo.translate(0, 5, 0);
    for (let i = 0; i < 6; i++) {
      const sp = new THREE.Mesh(spikeGeo, isEvolved ? materials.glowingCyan : materials.steel);
      sp.rotation.z = (i / 6) * Math.PI * 2;
      root.add(sp);
    }
    return root;
  }

  // 12. Blunderbuss Pellet Mesh (ampliado e incandescente)
  function createPelletMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = isEvolved ? materials.glowingRed : materials.flameGlow;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(4.6, 8, 8), mat);
    root.add(sphere);

    // Trailing fiery propellant wake
    const trailGeo = new THREE.ConeGeometry(2.4, 14, 5);
    trailGeo.rotateX(-Math.PI / 2);
    trailGeo.translate(0, 0, -8);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff4757 : 0xffa502,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(trailGeo, trailMat));
    return root;
  }

  // Floor Collectible Model Generator (Meat, Gold, Magnet, Rosary, Hourglass, Shield)
  function createFloorCollectibleModel(type = 'gold') {
    const root = new THREE.Group();
    const discGeo = new THREE.RingGeometry(2, 9, 16);
    discGeo.rotateX(-Math.PI / 2);

    if (type === 'meat') {
      const meatMat = new THREE.MeshStandardMaterial({ color: 0x8d381e, roughness: 0.65 });
      const boneMat = materials.bone;
      const roast = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 9, 8), meatMat);
      roast.rotation.z = Math.PI / 3;
      root.add(roast);
      const bone = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14, 6), boneMat);
      bone.rotation.z = Math.PI / 3;
      root.add(bone);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0xff7043, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
      disc.position.y = -4;
      root.add(disc);
    } else if (type === 'magnet') {
      const redMat = materials.royalRed;
      const metalMat = materials.steel;
      const uGroup = new THREE.Group();
      const leftBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 7, 2.5), redMat);
      leftBar.position.x = -3.5;
      const rightBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 7, 2.5), redMat);
      rightBar.position.x = 3.5;
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2.5, 2.5), redMat);
      topBar.position.y = 3.5;
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.6), metalMat);
      tipL.position.set(-3.5, -4, 0);
      const tipR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.6), metalMat);
      tipR.position.set(3.5, -4, 0);
      uGroup.add(leftBar, rightBar, topBar, tipL, tipR);
      root.add(uGroup);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0x42a5f5, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -5;
      root.add(disc);
    } else if (type === 'rosary') {
      const crossMat = materials.gold;
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 10, 2), crossMat);
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(7, 2.2, 2), crossMat);
      hBar.position.y = 1.8;
      const halo = new THREE.Mesh(new THREE.RingGeometry(3.5, 4.8, 16), materials.holyGlow);
      halo.position.y = 1.8;
      root.add(vBar, hBar, halo);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === 'hourglass') {
      const frameMat = materials.gold;
      const glassMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.75 });
      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1.2, 8), frameMat);
      topCap.position.y = 5;
      const botCap = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 1.2, 8), frameMat);
      botCap.position.y = -5;
      const topBulb = new THREE.Mesh(new THREE.ConeGeometry(3.2, 5, 8), glassMat);
      topBulb.position.y = 2.4;
      topBulb.rotation.x = Math.PI;
      const botBulb = new THREE.Mesh(new THREE.ConeGeometry(3.2, 5, 8), glassMat);
      botBulb.position.y = -2.4;
      root.add(topCap, botCap, topBulb, botBulb);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === 'shield') {
      const shieldMat = materials.darkSteel;
      const goldTrim = materials.gold;
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(7.5, 9.5, 1.8), shieldMat);
      const border = new THREE.Mesh(new THREE.BoxGeometry(8.2, 10.2, 1.2), goldTrim);
      border.position.z = -0.4;
      const boss = new THREE.Mesh(new THREE.OctahedronGeometry(2.4, 0), goldTrim);
      boss.position.z = 1.2;
      root.add(sMesh, border, boss);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0x90caf9, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === 'ether') {
      const etherMat = new THREE.MeshBasicMaterial({
        color: 0xbb86fc,
        transparent: true,
        opacity: 0.95
      });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(4.0, 0), etherMat);
      crystal.position.y = 1.5;

      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), coreMat);
      crystal.add(core);

      const wispMat = new THREE.MeshBasicMaterial({ color: 0xe056fd, transparent: true, opacity: 0.85 });
      const wisp = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6), wispMat);
      wisp.position.set(3.8, 0, 0);
      crystal.add(wisp);

      root.add(crystal);

      const etherDisc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({
        color: 0x9b59b6,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide
      }));
      etherDisc.position.y = -4;
      root.add(etherDisc);
    } else {
      const goldMat = materials.gold;
      const pouch = new THREE.Mesh(new THREE.DodecahedronGeometry(4.5, 0), goldMat);
      pouch.position.y = 0.5;
      const tie = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.8, 6, 12), materials.royalRed);
      tie.rotation.x = Math.PI / 2;
      tie.position.y = 3.0;
      root.add(pouch, tie);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -4;
      root.add(disc);
    }

    return root;
  }

  // 13. Penitent Whip Lash Mesh (Authentic narrow, long razor whip snap)
  function createWhipLashMesh(isEvolved) {
    const root = new THREE.Group();
    // Amplitude estreita de estalo linear (~18° de cada lado)
    const arcHalf = Math.PI * 0.10;
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;

    const lashGeo = new THREE.RingGeometry(4, 38, 24, 1, thetaStart, thetaLength);
    lashGeo.rotateX(-Math.PI / 2);
    const lashMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff0055 : 0xc0392b,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    root.add(new THREE.Mesh(lashGeo, lashMat));

    // Borda farpada afiada e ponta de estalo
    const edgeGeo = new THREE.RingGeometry(34, 40, 24, 1, thetaStart, thetaLength);
    edgeGeo.rotateX(-Math.PI / 2);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffffff : 0xff7675,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    root.add(new THREE.Mesh(edgeGeo, edgeMat));

    // Espinha central luminosa linear (corda do chicote em estalo)
    const spineGeo = new THREE.BoxGeometry(1.4, 0.4, 38);
    spineGeo.translate(0, 0, 19);
    const spineMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffffff : 0xfbc531,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(spineGeo, spineMat));

    return root;
  }

  // 14. Celestial Glaive Mesh (ampliado e luminoso)
  function createCelestialGlaiveMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0x4facfe,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    // 3 curved crescent blades at 120 degrees (ampliadas para 22 de raio)
    for (let i = 0; i < 3; i++) {
      const bladeGeo = new THREE.RingGeometry(4, 22, 12, 1, -0.45, 0.9);
      bladeGeo.rotateX(-Math.PI / 2);
      const blade = new THREE.Mesh(bladeGeo, mat);
      blade.rotation.y = (i / 3) * Math.PI * 2;
      root.add(blade);
    }
    return root;
  }

  // 15. Thunder Strike Mesh
  function createThunderStrikeMesh(isEvolved) {
    const root = new THREE.Group();
    const boltMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xfff200 : 0x00d2d3,
      transparent: true,
      opacity: 0.92
    });
    // Vertical lightning column
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.6, 75, 5), boltMat);
    bolt.position.y = 37.5;
    root.add(bolt);

    // Ground electric ring
    const ringGeo = new THREE.RingGeometry(2, 38, 20);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, boltMat);
    ring.position.y = 0.5;
    root.add(ring);
    return root;
  }

  // 16. Viper Dart Mesh (ampliado com rastro de peçonha)
  function createViperDartMesh(isEvolved) {
    const root = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 22, 5), materials.wood);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);

    const tipMat = isEvolved ? materials.glowingGreen : materials.diseasedSkin;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(2.4, 7.5, 5), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 13.0;
    root.add(tip);

    // Luminous venom trail
    const trailGeo = new THREE.ConeGeometry(2.0, 24, 5);
    trailGeo.rotateX(-Math.PI / 2);
    trailGeo.translate(0, 0, -16);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x00f2fe : 0x2ed573,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(trailGeo, trailMat));
    return root;
  }

  // 17. Void Vortex Mesh
  function createVoidVortexMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 65;
    const sealGeo = new THREE.RingGeometry(3, r, 24);
    sealGeo.rotateX(-Math.PI / 2);
    const sealMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x9b59b6 : 0x8e44ad,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.y = 0.4;
    root.add(seal);

    // Occult void core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x110022 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), coreMat);
    core.position.y = 3;
    root.add(core);
    return root;
  }

  // 18. Frost Lance Mesh (estaca maciça de gelo translúcido brilhante)
  function createFrostLanceMesh(isEvolved) {
    const root = new THREE.Group();
    const iceMat = new THREE.MeshStandardMaterial({
      color: isEvolved ? 0xa0e7e5 : 0x74b9ff,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const lance = new THREE.Mesh(new THREE.ConeGeometry(5.2, 38, 6), iceMat);
    lance.rotation.x = Math.PI / 2;
    root.add(lance);

    // Frost aura glow
    const tipGlowMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xdff9fb : 0x81ecec,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const tipGlow = new THREE.Mesh(new THREE.ConeGeometry(3.0, 16, 6), tipGlowMat);
    tipGlow.rotation.x = Math.PI / 2;
    tipGlow.position.z = 12;
    root.add(tipGlow);

    return root;
  }

  // 19. Retribution Shield Mesh
  function createRetributionShieldMesh(isEvolved) {
    const root = new THREE.Group();
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(7.5, 11, 1.2), isEvolved ? materials.paladinGold : materials.gold);
    root.add(shieldPlate);

    const rim = new THREE.Mesh(new THREE.BoxGeometry(8.2, 11.6, 0.8), materials.steel);
    root.add(rim);

    // Glowing holy cross
    const cross = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 1.5), materials.holyGlow);
    root.add(cross);
    return root;
  }

  // 20. Hellfire Cauldron / Wall Mesh
  function createHellfireCauldronMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 36;
    const fireGeo = new THREE.RingGeometry(2, r, 20);
    fireGeo.rotateX(-Math.PI / 2);
    const fireMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0x0984e3 : 0xe17055,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.position.y = 0.4;
    root.add(fire);
    return root;
  }

  // SUPREME WEAPON 3D MESH BUILDERS
  function createSupremeSlashMesh() {
    const root = new THREE.Group();
    const bladeGeo = new THREE.RingGeometry(8, 55, 24, 1, -Math.PI * 0.42, Math.PI * 0.84);
    bladeGeo.rotateX(-Math.PI / 2);
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0xffd32a,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(bladeGeo, bladeMat));

    // Outer plasma rim
    const rimGeo = new THREE.RingGeometry(50, 58, 24, 1, -Math.PI * 0.42, Math.PI * 0.84);
    rimGeo.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x0be881,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(rimGeo, rimMat));
    return root;
  }

  function createArtilleryShellMesh() {
    const root = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 11, 8), materials.darkSteel);
    body.rotation.x = Math.PI / 2;
    root.add(body);

    const head = new THREE.Mesh(new THREE.ConeGeometry(2.8, 6, 8), materials.gold);
    head.rotation.x = Math.PI / 2;
    head.position.z = 7;
    root.add(head);
    return root;
  }

  function createPurgatoryFireMesh(radius) {
    const root = new THREE.Group();
    const r = radius || 55;
    const ringGeo = new THREE.RingGeometry(3, r, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38ada9,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(ringGeo, ringMat));

    const coreGeo = new THREE.RingGeometry(1, r * 0.6, 18);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf6b93b,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.2;
    root.add(core);
    return root;
  }

  function createSupremeSpearMesh() {
    const root = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 38, 6), materials.holyGlow);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);

    const head = new THREE.Mesh(new THREE.ConeGeometry(2.5, 12, 5), materials.gold);
    head.rotation.x = Math.PI / 2;
    head.position.z = 24;
    root.add(head);
    return root;
  }

  function createAlliedMinionModel() {
    const root = new THREE.Group();
    const anim = {
      materials: [],
      limbs: [],
      update: function(dt, speed) {
        const t = performance.now() * 0.008;
        if (speed > 0.1) {
          for (let l of this.limbs) {
            if (l.isArm) l.mesh.rotation.x = Math.sin(t) * 0.45;
            if (l.isLeg) l.mesh.rotation.x = Math.cos(t) * 0.55;
          }
        }
      }
    };
    buildSkeletonModel(root, anim);

    // Give minion a purple soul summon ring under feet to distinguish from enemy skeletons
    const auraGeo = new THREE.RingGeometry(6, 9, 16);
    auraGeo.rotateX(-Math.PI / 2);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0x9b59b6, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.position.y = 0.5;
    root.add(aura);

    root.anim = anim;
    return root;
  }

  // 3D Visual Mesh for Sacred Sanctuary Zone
  function createSanctuaryZoneMesh(radius = 90) {
    const root = new THREE.Group();
    const r = radius || 90;

    // 1. Glowing golden runic outer ring on the ground
    const outerGeo = new THREE.RingGeometry(r * 0.90, r, 36);
    outerGeo.rotateX(-Math.PI / 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerGeo, outerMat);
    outerRing.position.y = 0.4;
    root.add(outerRing);

    // 2. Translucent golden ground seal disc
    const discGeo = new THREE.CircleGeometry(r * 0.88, 32);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xf1c40f,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.35;
    root.add(disc);

    // 3. Inner rotating runic star ring
    const innerGeo = new THREE.RingGeometry(r * 0.40, r * 0.50, 24);
    innerGeo.rotateX(-Math.PI / 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffea79,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    innerRing.position.y = 0.5;
    root.add(innerRing);

    // 4. Consecration progress ring (starts small, expands to r)
    const progGeo = new THREE.RingGeometry(0.1, r * 0.88, 32);
    progGeo.rotateX(-Math.PI / 2);
    const progMat = new THREE.MeshBasicMaterial({
      color: 0xfffa65,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const progRing = new THREE.Mesh(progGeo, progMat);
    progRing.position.y = 0.45;
    progRing.scale.set(0.01, 1, 0.01);
    root.add(progRing);

    // 5. Vertical ethereal light beam reaching into the sky
    const beamGeo = new THREE.CylinderGeometry(r * 0.70, r * 0.85, 420, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 210;
    root.add(beam);

    root.updateVisuals = function(dt, consecrateProgress = 0, playerInside = false) {
      outerRing.rotation.y += dt * 0.35;
      innerRing.rotation.y -= dt * 0.75;

      // Pulse brightness
      const pulse = Math.sin(Date.now() * 0.004) * 0.12;
      outerMat.opacity = playerInside ? 0.90 + pulse : 0.65 + pulse;
      beamMat.opacity = playerInside ? 0.42 + pulse : 0.22 + pulse;
      discMat.opacity = playerInside ? 0.35 : 0.18;

      // Progress scale
      const progScale = Math.max(0.01, Math.min(1.0, consecrateProgress));
      progRing.scale.set(progScale, 1, progScale);
      progRing.visible = consecrateProgress > 0.01;
    };

    return root;
  }

  // 3D Visual Mesh for Celestial Strike Telegraph Decal
  function createCelestialStrikeTelegraphMesh(radius = 68) {
    const root = new THREE.Group();
    const r = radius || 68;

    // 1. Red-orange fiery hazard perimeter ring
    const ringGeo = new THREE.RingGeometry(r * 0.90, r, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff3838,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.45;
    root.add(ring);

    // 2. Shrinking / expanding countdown circle
    const countGeo = new THREE.CircleGeometry(r * 0.88, 32);
    countGeo.rotateX(-Math.PI / 2);
    const countMat = new THREE.MeshBasicMaterial({
      color: 0xff793f,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const countCircle = new THREE.Mesh(countGeo, countMat);
    countCircle.position.y = 0.4;
    root.add(countCircle);

    root.updateVisuals = function(progress01) {
      const p = Math.max(0, Math.min(1, progress01));
      const flash = Math.sin(Date.now() * (0.01 + p * 0.02)) > 0 ? 0.95 : 0.60;
      ringMat.opacity = flash;
      countCircle.scale.set(p, 1, p);
    };

    return root;
  }

  // 3D Visual Mesh for Celestial Strike Impact Column of Holy Fire
  function createCelestialStrikeImpactMesh(radius = 68) {
    const root = new THREE.Group();
    const r = radius || 68;

    // 1. Ground scorched blast circle
    const blastGeo = new THREE.CircleGeometry(r, 24);
    blastGeo.rotateX(-Math.PI / 2);
    const blastMat = new THREE.MeshBasicMaterial({
      color: 0xfffa65,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const blastDisc = new THREE.Mesh(blastGeo, blastMat);
    blastDisc.position.y = 0.5;
    root.add(blastDisc);

    // 2. Towering Celestial Flame Pillar
    const pillarGeo = new THREE.CylinderGeometry(r * 0.75, r * 1.1, 460, 24, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xffd32a,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 230;
    root.add(pillar);

    // Inner bright core
    const coreGeo = new THREE.CylinderGeometry(r * 0.35, r * 0.45, 480, 16, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 240;
    root.add(core);

    root.updateVisuals = function(dt, lifePct01) {
      const alpha = Math.max(0, Math.min(1, lifePct01));
      blastMat.opacity = alpha * 0.85;
      pillarMat.opacity = alpha * 0.90;
      coreMat.opacity = alpha * 0.95;
      pillar.rotation.y += dt * 3;
      core.rotation.y -= dt * 4;
      const s = 1.0 + (1.0 - alpha) * 0.35;
      pillar.scale.set(s, 1, s);
    };

    return root;
  }

  // Export to namespace
  window.MedievalSurvivors.models3d = {
    createPlayerModel,
    createEnemyModel,
    createAlliedMinionModel,
    createGemModel,
    createChestModel,
    createDestructibleModel,
    createFloorCollectibleModel,
    createBloodAltarModel,
    createSanctuaryZoneMesh,
    createCelestialStrikeTelegraphMesh,
    createCelestialStrikeImpactMesh,
    createCrossbowBoltMesh,
    createThrownAxeMesh,
    createHolyFireFlaskMesh,
    createHolyFirePoolMesh,
    createHolyAuraRingMesh,
    createSwordSlashMesh,
    createDarkSlashMesh,
    createAbyssalFissureMesh,
    createDaggerSlashMesh,
    createSpectralOrbMesh,
    createPlagueFlaskMesh,
    createPlaguePuddleMesh,
    createFlailMesh,
    createPelletMesh,
    createWhipLashMesh,
    createCelestialGlaiveMesh,
    createThunderStrikeMesh,
    createViperDartMesh,
    createVoidVortexMesh,
    createFrostLanceMesh,
    createRetributionShieldMesh,
    createHellfireCauldronMesh,
    createSpearThrustMesh,
    createSpearShockwaveMesh,
    createSupremeSlashMesh,
    createArtilleryShellMesh,
    createPurgatoryFireMesh,
    createSupremeSpearMesh,
    createEnemyProjectileMesh,
    createHordeCompoundGeometry,
    getHordeMaterial,
    applyGLSLHooks,
    materials
  };
})();


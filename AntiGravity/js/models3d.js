/**
 * Medieval Survivors - 3D Models & Procedural Mesh Architecture (Three.js)
 * High-detail procedural low-poly & stylized 3D models with articulated limbs and animations.
 */

window.MedievalSurvivors = window.MedievalSurvivors || {};

(function() {
  const THREE = window.THREE;

  // Shared Materials Palette with stylized gothic/medieval tones
  const materials = {
    steel: new THREE.MeshStandardMaterial({ color: 0x8a9ba8, metalness: 0.85, roughness: 0.25 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.9, roughness: 0.3 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xe5a93b, metalness: 0.88, roughness: 0.28, emissive: 0x3d2800, emissiveIntensity: 0.2 }),
    royalRed: new THREE.MeshStandardMaterial({ color: 0x9b111e, roughness: 0.6 }),
    crimsonCloth: new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.7, side: THREE.DoubleSide }),
    rangerGreen: new THREE.MeshStandardMaterial({ color: 0x226b38, roughness: 0.65 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.75 }),
    darkCloth: new THREE.MeshStandardMaterial({ color: 0x1f192b, roughness: 0.7, side: THREE.DoubleSide }),
    pyroOrange: new THREE.MeshStandardMaterial({ color: 0xbf360c, roughness: 0.6 }),
    flameGlow: new THREE.MeshBasicMaterial({ color: 0xff6600 }),
    paladinGold: new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.8, roughness: 0.25 }),
    holyGlow: new THREE.MeshBasicMaterial({ color: 0xffea79, transparent: true, opacity: 0.85 }),
    bone: new THREE.MeshStandardMaterial({ color: 0xe2d9c8, roughness: 0.55 }),
    boneDark: new THREE.MeshStandardMaterial({ color: 0xa89f8d, roughness: 0.6 }),
    ratFur: new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.85 }),
    diseasedSkin: new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 0.7 }),
    glowingRed: new THREE.MeshBasicMaterial({ color: 0xff1744 }),
    glowingCyan: new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    glowingViolet: new THREE.MeshBasicMaterial({ color: 0xbb86fc }),
    glowingGreen: new THREE.MeshBasicMaterial({ color: 0x00e676 }),
    peasantClothes: new THREE.MeshStandardMaterial({ color: 0x6d5945, roughness: 0.8 }),
    skinPale: new THREE.MeshStandardMaterial({ color: 0xc8b89e, roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x4e3620, roughness: 0.8 }),
    stoneGrey: new THREE.MeshStandardMaterial({ color: 0x595e63, roughness: 0.75 }),
    stoneMoss: new THREE.MeshStandardMaterial({ color: 0x4a5542, roughness: 0.8 }),
    blackObsidian: new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 0.8, roughness: 0.35 }),
    hitFlash: new THREE.MeshBasicMaterial({ color: 0xff3333 })
  };

  // Shared material system prevents memory fragmentation and eliminates GPU shader compilation stalls
  function createFlashable(baseMat) {
    return baseMat;
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

    // Aim Indicator Rune (Floor disc + directional 3D arrow)
    const aimGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(18, 21, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf0c05a, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    aimGroup.add(ringMesh);

    // Arrow pointer
    const arrowGeo = new THREE.ConeGeometry(4, 12, 4);
    arrowGeo.rotateX(Math.PI / 2);
    arrowGeo.translate(0, 0.5, 26);
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0x996515, emissiveIntensity: 0.6 });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    aimGroup.add(arrowMesh);

    // Aim dashed line
    const dashGeo = new THREE.BoxGeometry(1.2, 0.2, 14);
    dashGeo.translate(0, 0.5, 12);
    const dashMesh = new THREE.Mesh(dashGeo, arrowMat);
    aimGroup.add(dashMesh);

    root.add(aimGroup);
    anim.aimArrow = aimGroup;

    // Build specific class models
    if (classId === 'ranger') {
      buildRangerModel(bodyRoot, anim);
    } else if (classId === 'pyromancer') {
      buildPyromancerModel(bodyRoot, anim);
    } else if (classId === 'paladin') {
      buildPaladinModel(bodyRoot, anim);
    } else {
      buildKnightModel(bodyRoot, anim);
    }

    // Shadow blob
    const shadowGeo = new THREE.CircleGeometry(12, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.y = 0.2;
    root.add(shadow);

    // Update animation hook
    root.updateVisuals = function(dt, player) {
      const isMoving = Math.hypot(player.vx, player.vy) > 10;
      const walk = player.walkCycle || 0;

      // Rotate root to face direction
      bodyRoot.rotation.y = -player.facingAngle + Math.PI / 2;

      // Aim arrow stays on ground pointing at player's facing angle
      aimGroup.rotation.y = -player.facingAngle + Math.PI / 2;

      // Leg swing & arm swing
      if (isMoving) {
        const swing = Math.sin(walk) * 0.65;
        if (anim.leftLeg) anim.leftLeg.rotation.x = swing;
        if (anim.rightLeg) anim.rightLeg.rotation.x = -swing;
        if (anim.leftArm) anim.leftArm.rotation.x = -swing * 0.7;
        if (anim.rightArm) anim.rightArm.rotation.x = swing * 0.7;
        bodyRoot.position.y = Math.abs(Math.sin(walk * 2)) * 1.8;
      } else {
        if (anim.leftLeg) anim.leftLeg.rotation.x = 0;
        if (anim.rightLeg) anim.rightLeg.rotation.x = 0;
        if (anim.leftArm) anim.leftArm.rotation.x = 0;
        if (anim.rightArm) anim.rightArm.rotation.x = 0;
        bodyRoot.position.y = Math.sin(Date.now() / 400) * 0.6;
      }

      // Cape flutter
      if (anim.cape) {
        anim.cape.rotation.x = isMoving ? 0.35 + Math.sin(walk * 2) * 0.15 : 0.08 + Math.sin(Date.now() / 300) * 0.04;
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

  // 1.1 CAVALEIRO REAL (Knight Model)
  function buildKnightModel(group, anim) {
    const steelMat = createFlashable(materials.steel);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const goldMat = createFlashable(materials.gold);
    const redMat = createFlashable(materials.royalRed);
    const capeMat = createFlashable(materials.crimsonCloth);
    anim.materials.push(steelMat, darkSteelMat, goldMat, redMat, capeMat);

    // Torso / Breastplate
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    const chestGeo = new THREE.BoxGeometry(10, 11, 7);
    const chestMesh = new THREE.Mesh(chestGeo, steelMat);
    torsoGroup.add(chestMesh);

    // Golden cross emblem on chest
    const crossVGeo = new THREE.BoxGeometry(2, 7, 0.4);
    crossVGeo.translate(0, 0, 3.6);
    torsoGroup.add(new THREE.Mesh(crossVGeo, goldMat));
    const crossHGeo = new THREE.BoxGeometry(6, 2, 0.4);
    crossHGeo.translate(0, 1, 3.6);
    torsoGroup.add(new THREE.Mesh(crossHGeo, goldMat));

    // Waist belt & Tassets
    const beltGeo = new THREE.BoxGeometry(10.6, 2.2, 7.6);
    beltGeo.translate(0, -5, 0);
    torsoGroup.add(new THREE.Mesh(beltGeo, goldMat));

    const tassetGeo = new THREE.BoxGeometry(3.5, 4.5, 1.2);
    const tassetL = new THREE.Mesh(tassetGeo, steelMat);
    tassetL.position.set(-3, -7, 3.2);
    torsoGroup.add(tassetL);
    const tassetR = new THREE.Mesh(tassetGeo, steelMat);
    tassetR.position.set(3, -7, 3.2);
    torsoGroup.add(tassetR);

    // Head & Helmet
    const headGroup = new THREE.Group();
    headGroup.position.y = 8;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const helmGeo = new THREE.BoxGeometry(6.5, 7.5, 6.8);
    const helmMesh = new THREE.Mesh(helmGeo, steelMat);
    headGroup.add(helmMesh);

    // Helmet visor slit
    const visorGeo = new THREE.BoxGeometry(5.2, 1.2, 0.6);
    visorGeo.translate(0, 0.4, 3.5);
    headGroup.add(new THREE.Mesh(visorGeo, darkSteelMat));

    // Golden helm crest / trim
    const crestGeo = new THREE.BoxGeometry(1.4, 3, 7.2);
    crestGeo.translate(0, 4.2, 0);
    headGroup.add(new THREE.Mesh(crestGeo, goldMat));

    // Majestic Red Feathered Plume
    const plumeGeo = new THREE.ConeGeometry(2.4, 8, 5);
    plumeGeo.rotateX(-0.3);
    plumeGeo.translate(0, 8.5, -2);
    headGroup.add(new THREE.Mesh(plumeGeo, redMat));

    // Flowing Cape
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 5, -3.6);
    const capeGeo = new THREE.PlaneGeometry(9, 16, 3, 3);
    capeGeo.translate(0, -8, 0);
    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeGroup.add(capeMesh);
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;

    // Left Arm & Shield
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6.5, 4, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const pauldronGeo = new THREE.BoxGeometry(3.6, 3.6, 4.2);
    leftArmGroup.add(new THREE.Mesh(pauldronGeo, steelMat));
    const armGeo = new THREE.CylinderGeometry(1.4, 1.3, 7, 6);
    armGeo.translate(0, -3.5, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, steelMat));

    // Shield (Heater shield)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-2, -4, 2);
    shieldGroup.rotation.y = 0.4;
    const shieldPlateGeo = new THREE.BoxGeometry(7, 10, 0.8);
    const shieldPlate = new THREE.Mesh(shieldPlateGeo, redMat);
    shieldGroup.add(shieldPlate);
    const shieldBorderGeo = new THREE.BoxGeometry(7.6, 10.6, 0.6);
    shieldGroup.add(new THREE.Mesh(shieldBorderGeo, goldMat));
    leftArmGroup.add(shieldGroup);

    // Right Arm & Broadsword
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6.5, 4, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const rPauldron = new THREE.Mesh(pauldronGeo, steelMat);
    rightArmGroup.add(rPauldron);
    const rArm = new THREE.Mesh(armGeo, steelMat);
    rightArmGroup.add(rArm);

    // 3D Broadsword held in hand
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -6, 2);
    swordGroup.rotation.x = Math.PI / 4;

    const bladeGeo = new THREE.BoxGeometry(1.6, 17, 0.5);
    bladeGeo.translate(0, 8.5, 0);
    swordGroup.add(new THREE.Mesh(bladeGeo, steelMat));

    const crossguardGeo = new THREE.BoxGeometry(6, 1, 1.2);
    swordGroup.add(new THREE.Mesh(crossguardGeo, goldMat));

    const hiltGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.5, 5);
    hiltGeo.translate(0, -2, 0);
    swordGroup.add(new THREE.Mesh(hiltGeo, materials.leather));

    const pommelGeo = new THREE.SphereGeometry(1.1, 6, 6);
    pommelGeo.translate(0, -4, 0);
    swordGroup.add(new THREE.Mesh(pommelGeo, goldMat));

    rightArmGroup.add(swordGroup);
    anim.weapon = swordGroup;

    // Legs
    const legGeo = new THREE.CylinderGeometry(1.6, 1.4, 9, 6);
    legGeo.translate(0, -4.5, 0);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-3, 9, 0);
    leftLegGroup.add(new THREE.Mesh(legGeo, steelMat));
    group.add(leftLegGroup);
    anim.leftLeg = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(3, 9, 0);
    rightLegGroup.add(new THREE.Mesh(legGeo, steelMat));
    group.add(rightLegGroup);
    anim.rightLeg = rightLegGroup;
  }

  // 1.2 ARQUEIRA DAS SOMBRAS (Ranger Model)
  function buildRangerModel(group, anim) {
    const greenMat = createFlashable(materials.rangerGreen);
    const leatherMat = createFlashable(materials.leather);
    const woodMat = createFlashable(materials.wood);
    const steelMat = createFlashable(materials.steel);
    const eyeMat = materials.glowingGreen;
    anim.materials.push(greenMat, leatherMat, woodMat, steelMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 14;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Tunic & Brigandine
    const tunicGeo = new THREE.BoxGeometry(8, 10, 5.5);
    torsoGroup.add(new THREE.Mesh(tunicGeo, greenMat));

    const beltGeo = new THREE.BoxGeometry(8.5, 2, 6);
    beltGeo.translate(0, -3.5, 0);
    torsoGroup.add(new THREE.Mesh(beltGeo, leatherMat));

    // Quiver on back with arrows
    const quiverGroup = new THREE.Group();
    quiverGroup.position.set(2, 1, -3.5);
    quiverGroup.rotation.z = -0.3;
    const quiverGeo = new THREE.CylinderGeometry(1.6, 1.2, 9, 6);
    quiverGroup.add(new THREE.Mesh(quiverGeo, leatherMat));
    // Arrow ends
    for (let i = 0; i < 3; i++) {
      const arrowStick = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 4), woodMat);
      arrowStick.position.set((i - 1) * 0.7, 5, 0);
      quiverGroup.add(arrowStick);
    }
    torsoGroup.add(quiverGroup);

    // Hood / Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const hoodGeo = new THREE.ConeGeometry(4.2, 7.5, 6);
    hoodGeo.translate(0, 1.5, -0.5);
    headGroup.add(new THREE.Mesh(hoodGeo, greenMat));

    // Glowing ranger eyes inside dark shadow
    const eyeGeo = new THREE.BoxGeometry(0.8, 0.4, 0.2);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.2, 0.5, 2.5);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.2, 0.5, 2.5);
    headGroup.add(eyeR);

    // Crossbow in hands
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5.5, 3, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const armGeo = new THREE.CylinderGeometry(1.2, 1.1, 6.5, 6);
    armGeo.translate(0, -3.2, 0);
    rightArmGroup.add(new THREE.Mesh(armGeo, greenMat));

    // 3D Crossbow
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, -5, 4);
    bowGroup.rotation.x = Math.PI / 2;

    const stockGeo = new THREE.BoxGeometry(1.4, 11, 1.6);
    bowGroup.add(new THREE.Mesh(stockGeo, woodMat));

    const bowArcGeo = new THREE.BoxGeometry(11, 1.2, 1.2);
    bowArcGeo.translate(0, 4.5, 0);
    bowGroup.add(new THREE.Mesh(bowArcGeo, steelMat));

    rightArmGroup.add(bowGroup);
    anim.weapon = bowGroup;

    // Left Arm holding crossbow front
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5.5, 3, 0);
    leftArmGroup.rotation.x = Math.PI / 4;
    leftArmGroup.rotation.y = -0.4;
    leftArmGroup.add(new THREE.Mesh(armGeo, greenMat));
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    // Legs
    const legGeo = new THREE.CylinderGeometry(1.4, 1.2, 9, 6);
    legGeo.translate(0, -4.5, 0);
    const legL = new THREE.Group();
    legL.position.set(-2.5, 9, 0);
    legL.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(2.5, 9, 0);
    legR.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legR);
    anim.rightLeg = legR;
  }

  // 1.3 FEITICEIRO DAS CINZAS (Pyromancer Model)
  function buildPyromancerModel(group, anim) {
    const robeMat = createFlashable(materials.pyroOrange);
    const darkMat = createFlashable(materials.darkCloth);
    const goldMat = createFlashable(materials.gold);
    const woodMat = createFlashable(materials.wood);
    const flameMat = materials.flameGlow;
    anim.materials.push(robeMat, darkMat, goldMat, woodMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 13;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Robes
    const robeGeo = new THREE.CylinderGeometry(3.5, 6.5, 15, 8);
    robeGeo.translate(0, -4, 0);
    torsoGroup.add(new THREE.Mesh(robeGeo, robeMat));

    // Wizard cowl & Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 7;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const cowlGeo = new THREE.ConeGeometry(4, 9, 6);
    cowlGeo.rotateX(-0.25);
    headGroup.add(new THREE.Mesh(cowlGeo, darkMat));

    // Glowing fiery eyes
    const eyeGeo = new THREE.SphereGeometry(0.6, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, flameMat);
    eyeL.position.set(-1.2, -0.5, 2.5);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, flameMat);
    eyeR.position.set(1.2, -0.5, 2.5);
    headGroup.add(eyeR);

    // Left hand with floating flame orb
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5, 2, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const sleeveGeo = new THREE.CylinderGeometry(1.6, 2.4, 7, 6);
    sleeveGeo.translate(0, -3.5, 0);
    leftArmGroup.add(new THREE.Mesh(sleeveGeo, robeMat));

    const fireOrb = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), flameMat);
    fireOrb.position.set(0, -7, 2);
    leftArmGroup.add(fireOrb);

    // Right hand with Arcane Staff
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5, 2, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    rightArmGroup.add(new THREE.Mesh(sleeveGeo, robeMat));

    // Staff
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -4, 3);
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 24, 6), woodMat);
    staffGroup.add(staffShaft);

    // Crystal headpiece
    const staffCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.2), flameMat);
    staffCrystal.position.y = 12;
    staffGroup.add(staffCrystal);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.4, 6, 12), goldMat);
    ring.position.y = 12;
    staffGroup.add(ring);

    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;
  }

  // 1.4 PALADINO DA ALVORADA (Paladin Model)
  function buildPaladinModel(group, anim) {
    const goldPlate = createFlashable(materials.paladinGold);
    const whiteSteel = createFlashable(materials.steel);
    const haloMat = materials.holyGlow;
    const blueMat = createFlashable(new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.5 }));
    anim.materials.push(goldPlate, whiteSteel, blueMat);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;

    // Gilded plate armor
    const chest = new THREE.Mesh(new THREE.BoxGeometry(11, 12, 7.5), goldPlate);
    torsoGroup.add(chest);

    // Holy Halo floating above head
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;

    const helm = new THREE.Mesh(new THREE.BoxGeometry(6.8, 8, 7), whiteSteel);
    headGroup.add(helm);

    const haloGeo = new THREE.TorusGeometry(5, 0.6, 8, 20);
    haloGeo.rotateX(Math.PI / 2);
    haloGeo.translate(0, 7.5, 0);
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    headGroup.add(haloMesh);

    // Pauldrons (Lion winged shoulders)
    const pauldronGeo = new THREE.BoxGeometry(5, 4.5, 5);
    const pauldronL = new THREE.Mesh(pauldronGeo, goldPlate);
    pauldronL.position.set(-7, 4, 0);
    torsoGroup.add(pauldronL);
    const pauldronR = new THREE.Mesh(pauldronGeo, goldPlate);
    pauldronR.position.set(7, 4, 0);
    torsoGroup.add(pauldronR);

    // Right Arm with Warhammer
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(7, 2, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    const maceShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 16, 6), materials.darkSteel);
    maceShaft.position.set(0, -4, 3);
    maceShaft.rotation.x = Math.PI / 4;
    rightArmGroup.add(maceShaft);

    const maceHead = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 4.5), goldPlate);
    maceHead.position.set(0, 2, 9);
    rightArmGroup.add(maceHead);

    // Left Arm with Tower Shield
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-7, 2, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    const shieldGeo = new THREE.BoxGeometry(8, 14, 1.2);
    const shield = new THREE.Mesh(shieldGeo, goldPlate);
    shield.position.set(-2, -4, 3);
    leftArmGroup.add(shield);

    const blueCross = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 0.6), blueMat);
    blueCross.position.set(-2, -3, 3.8);
    leftArmGroup.add(blueCross);

    // Legs
    const legGeo = new THREE.CylinderGeometry(1.8, 1.5, 9.5, 6);
    legGeo.translate(0, -4.7, 0);
    const legL = new THREE.Group();
    legL.position.set(-3.2, 9, 0);
    legL.add(new THREE.Mesh(legGeo, goldPlate));
    group.add(legL);
    anim.leftLeg = legL;

    const legR = new THREE.Group();
    legR.position.set(3.2, 9, 0);
    legR.add(new THREE.Mesh(legGeo, goldPlate));
    group.add(legR);
    anim.rightLeg = legR;
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
      isBoss: enemy.isBoss
    };

    const type = enemy.type;

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
    } else if (type === 'boss_baron') {
      buildDeathBaronBossModel(root, anim);
    } else {
      // Fallback stylized skeleton
      buildSkeletonModel(root, anim);
    }

    // Shadow disc under enemy
    const sRadius = enemy.radius ? enemy.radius * 0.85 : 10;
    const shadowGeo = new THREE.CircleGeometry(sRadius, 12);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.y = 0.2;
    root.add(shadow);

    // Collect all render meshes for zero-allocation hit flashing
    anim.flashMeshes = [];
    root.traverse(child => {
      if (child.isMesh && child !== shadow) {
        child._origMat = child.material;
        anim.flashMeshes.push(child);
      }
    });

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

      // Damage Flash (when damaged, flashes bright red)
      const isDamaged = (enemyObj.hp < enemyObj._lastHp);
      enemyObj._lastHp = enemyObj.hp;
      if (isDamaged) {
        anim.flashTimer = 0.10;
      }
      if (anim.flashTimer > 0) {
        anim.flashTimer -= dt;
        for (let i = 0; i < anim.flashMeshes.length; i++) {
          anim.flashMeshes[i].material = materials.hitFlash;
        }
        anim.wasFlashing = true;
      } else if (anim.wasFlashing) {
        for (let i = 0; i < anim.flashMeshes.length; i++) {
          anim.flashMeshes[i].material = anim.flashMeshes[i]._origMat;
        }
        anim.wasFlashing = false;
      }
    };

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

  // 2.2 ESQUELETO (Skeleton)
  function buildSkeletonModel(group, anim) {
    const boneMat = createFlashable(materials.bone);
    const steelMat = createFlashable(materials.steel);
    const woodMat = createFlashable(materials.wood);
    const eyeMat = materials.glowingCyan;
    anim.materials.push(boneMat, steelMat, woodMat);

    // Torso / Ribcage
    const torso = new THREE.Group();
    torso.position.y = 12;
    group.add(torso);

    // Spine & Ribs
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 9, 5), boneMat);
    torso.add(spine);

    for (let r = -2; r <= 2; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(6 - Math.abs(r) * 0.8, 0.8, 4), boneMat);
      rib.position.y = r * 1.5;
      torso.add(rib);
    }

    // Skull
    const headG = new THREE.Group();
    headG.position.y = 6.5;
    torso.add(headG);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 4.5), boneMat);
    headG.add(skull);

    // Glowing cyan eye sockets
    const eyeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 0.2, 2.3);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 0.2, 2.3);
    headG.add(eyeR);

    // Rusty Scimitar in right arm
    const rArmG = new THREE.Group();
    rArmG.position.set(4, 2.5, 0);
    torso.add(rArmG);
    const armBoneGeo = new THREE.CylinderGeometry(0.5, 0.4, 7, 4);
    armBoneGeo.translate(0, -3.5, 0);
    rArmG.add(new THREE.Mesh(armBoneGeo, boneMat));

    const sword = new THREE.Mesh(new THREE.BoxGeometry(1, 11, 0.3), steelMat);
    sword.position.set(0, -5, 3);
    sword.rotation.x = Math.PI / 3;
    rArmG.add(sword);
    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Wooden Buckler in left arm
    const lArmG = new THREE.Group();
    lArmG.position.set(-4, 2.5, 0);
    torso.add(lArmG);
    lArmG.add(new THREE.Mesh(armBoneGeo, boneMat));

    const buckler = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.6, 8), woodMat);
    buckler.rotation.x = Math.PI / 2;
    buckler.position.set(-1, -4, 1.5);
    lArmG.add(buckler);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Legs
    const legBoneGeo = new THREE.CylinderGeometry(0.6, 0.5, 8.5, 4);
    legBoneGeo.translate(0, -4.2, 0);

    const legL = new THREE.Group();
    legL.position.set(-1.8, 8, 0);
    legL.add(new THREE.Mesh(legBoneGeo, boneMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(1.8, 8, 0);
    legR.add(new THREE.Mesh(legBoneGeo, boneMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.3 ALDEÃO AMALDIÇOADO (Cursed Villager)
  function buildCursedVillagerModel(group, anim) {
    const clothMat = createFlashable(materials.peasantClothes);
    const skinMat = createFlashable(materials.skinPale);
    const woodMat = createFlashable(materials.wood);
    const steelMat = createFlashable(materials.steel);
    anim.materials.push(clothMat, skinMat, woodMat, steelMat);

    const torso = new THREE.Group();
    torso.position.y = 12;
    torso.rotation.x = 0.25; // Hunched back
    group.add(torso);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(8, 10, 5), clothMat);
    torso.add(chest);

    // Crooked Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 4.5), skinMat);
    head.position.set(0.5, 7, 1);
    head.rotation.z = 0.2;
    torso.add(head);

    // Shambling Pitchfork in arms
    const rArmG = new THREE.Group();
    rArmG.position.set(5, 3, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(1.2, 1.0, 7, 5);
    armGeo.translate(0, -3.5, 0);
    rArmG.add(new THREE.Mesh(armGeo, skinMat));

    // Pitchfork
    const forkShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 18, 5), woodMat);
    forkShaft.position.set(0, -2, 5);
    forkShaft.rotation.x = Math.PI / 4;
    rArmG.add(forkShaft);
    const tines = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4, 0.4), steelMat);
    tines.position.set(0, 5, 11);
    rArmG.add(tines);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Left Arm
    const lArmG = new THREE.Group();
    lArmG.position.set(-5, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, skinMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Shambling Legs
    const legGeo = new THREE.CylinderGeometry(1.4, 1.2, 8, 5);
    legGeo.translate(0, -4, 0);

    const legL = new THREE.Group();
    legL.position.set(-2.5, 8, 0);
    legL.add(new THREE.Mesh(legGeo, clothMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(2.5, 8, 0);
    legR.add(new THREE.Mesh(legGeo, clothMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.4 CAVALEIRO NEGRO (Dark Knight)
  function buildDarkKnightModel(group, anim) {
    const obsMat = createFlashable(materials.blackObsidian);
    const redGlow = materials.glowingRed;
    const darkSteel = createFlashable(materials.darkSteel);
    anim.materials.push(obsMat, darkSteel);

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(11, 13, 8), obsMat);
    torso.add(chest);

    // Horned Greathelm
    const headG = new THREE.Group();
    headG.position.y = 9;
    torso.add(headG);
    const helm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.5, 7), obsMat);
    headG.add(helm);

    // Menacing red visor slit
    const visor = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 0.4), redGlow);
    visor.position.set(0, 0.5, 3.6);
    headG.add(visor);

    // Horns
    const hornGeo = new THREE.ConeGeometry(1.2, 5, 4);
    const hornL = new THREE.Mesh(hornGeo, obsMat);
    hornL.rotation.z = -0.7;
    hornL.position.set(-4, 3, 0);
    headG.add(hornL);
    const hornR = new THREE.Mesh(hornGeo, obsMat);
    hornR.rotation.z = 0.7;
    hornR.position.set(4, 3, 0);
    headG.add(hornR);

    // Spiked Pauldrons
    const pauldronGeo = new THREE.ConeGeometry(3.5, 5, 4);
    const pL = new THREE.Mesh(pauldronGeo, obsMat);
    pL.position.set(-7.5, 4, 0);
    torso.add(pL);
    const pR = new THREE.Mesh(pauldronGeo, obsMat);
    pR.position.set(7.5, 4, 0);
    torso.add(pR);

    // Dark Greatsword
    const rArmG = new THREE.Group();
    rArmG.position.set(7, 3, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(1.8, 1.6, 8, 6);
    armGeo.translate(0, -4, 0);
    rArmG.add(new THREE.Mesh(armGeo, obsMat));

    const sword = new THREE.Mesh(new THREE.BoxGeometry(2.2, 22, 0.8), darkSteel);
    sword.position.set(0, -6, 5);
    sword.rotation.x = Math.PI / 3.5;
    rArmG.add(sword);

    // Dark rune glow along sword
    const swordRune = new THREE.Mesh(new THREE.BoxGeometry(0.6, 16, 0.9), materials.glowingViolet);
    swordRune.position.set(0, -5, 5);
    swordRune.rotation.x = Math.PI / 3.5;
    rArmG.add(swordRune);

    anim.limbs.push({ mesh: rArmG, isArm: true });

    // Left Arm
    const lArmG = new THREE.Group();
    lArmG.position.set(-7, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, obsMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Stomping Armored Legs
    const legGeo = new THREE.CylinderGeometry(2.0, 1.7, 10, 6);
    legGeo.translate(0, -5, 0);

    const legL = new THREE.Group();
    legL.position.set(-3.5, 10, 0);
    legL.add(new THREE.Mesh(legGeo, obsMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(3.5, 10, 0);
    legR.add(new THREE.Mesh(legGeo, obsMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.5 BRUXA DAS CATACUMBAS (Witch)
  function buildWitchModel(group, anim) {
    anim.isHovering = true;
    const robeMat = createFlashable(materials.darkCloth);
    const skinMat = createFlashable(materials.skinPale);
    const glowMat = materials.glowingGreen;
    anim.materials.push(robeMat, skinMat);

    const torso = new THREE.Group();
    torso.position.y = 10;
    group.add(torso);

    // Floating bell robe
    const robe = new THREE.Mesh(new THREE.ConeGeometry(5.5, 14, 8), robeMat);
    robe.position.y = -2;
    torso.add(robe);

    // Head & Pointed Witch Hat
    const headG = new THREE.Group();
    headG.position.y = 6.5;
    torso.add(headG);
    const head = new THREE.Mesh(new THREE.SphereGeometry(3, 6, 6), skinMat);
    headG.add(head);

    // Witch Hat
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.5, 0.4, 12), robeMat);
    brim.position.y = 2;
    headG.add(brim);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 9, 8), robeMat);
    cone.position.set(0, 6.5, -0.8);
    cone.rotation.x = -0.3;
    headG.add(cone);

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, glowMat);
    eyeL.position.set(-1.1, 0, 2.7);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, glowMat);
    eyeR.position.set(1.1, 0, 2.7);
    headG.add(eyeR);

    // Staff with glowing poison skull
    const rArmG = new THREE.Group();
    rArmG.position.set(4.5, 2, 0);
    torso.add(rArmG);
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 20, 5), materials.wood);
    staff.position.set(0, -2, 3);
    rArmG.add(staff);

    const poisonSkull = new THREE.Mesh(new THREE.SphereGeometry(1.8, 6, 6), glowMat);
    poisonSkull.position.set(0, 9, 3);
    rArmG.add(poisonSkull);

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

  // 2.7 MINI-BOSS: GOLEM DE PEDRA (Stone Golem Boss)
  function buildStoneGolemBossModel(group, anim) {
    const scale = 2.7;
    group.scale.set(scale, scale, scale);

    const stoneMat = createFlashable(materials.stoneGrey);
    const mossMat = createFlashable(materials.stoneMoss);
    const runeGlow = materials.glowingCyan;
    anim.materials.push(stoneMat, mossMat);

    const torso = new THREE.Group();
    torso.position.y = 15;
    group.add(torso);

    // Segmented boulder torso
    const chest = new THREE.Mesh(new THREE.DodecahedronGeometry(8), stoneMat);
    torso.add(chest);

    // Glowing runic core in center
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(3.5), runeGlow);
    core.position.z = 5;
    torso.add(core);

    // Stone Monolith Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), stoneMat);
    head.position.y = 9;
    torso.add(head);

    // Glowing cyan runic eye bar
    const eyeBar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.6), runeGlow);
    eyeBar.position.set(0, 9.5, 3.2);
    torso.add(eyeBar);

    // Floating Boulder Shoulders
    const pL = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2), mossMat);
    pL.position.set(-9.5, 6, 0);
    torso.add(pL);
    const pR = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2), mossMat);
    pR.position.set(9.5, 6, 0);
    torso.add(pR);

    // Giant Stone Fists
    const fistGeo = new THREE.BoxGeometry(5, 7, 5);
    const rArmG = new THREE.Group();
    rArmG.position.set(10, 0, 0);
    rArmG.add(new THREE.Mesh(fistGeo, stoneMat));
    torso.add(rArmG);
    anim.limbs.push({ mesh: rArmG, isArm: true });

    const lArmG = new THREE.Group();
    lArmG.position.set(-10, 0, 0);
    lArmG.add(new THREE.Mesh(fistGeo, stoneMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });

    // Massive Stone Pillar Legs
    const legGeo = new THREE.CylinderGeometry(3.2, 3.5, 10, 6);
    legGeo.translate(0, -5, 0);

    const legL = new THREE.Group();
    legL.position.set(-4.5, 10, 0);
    legL.add(new THREE.Mesh(legGeo, stoneMat));
    group.add(legL);
    anim.limbs.push({ mesh: legL, isLeg: true });

    const legR = new THREE.Group();
    legR.position.set(4.5, 10, 0);
    legR.add(new THREE.Mesh(legGeo, stoneMat));
    group.add(legR);
    anim.limbs.push({ mesh: legR, isLeg: true });
  }

  // 2.8 MINI-BOSS: BARÃO DA MORTE (Death Baron Boss)
  function buildDeathBaronBossModel(group, anim) {
    anim.isHovering = true;
    const scale = 2.5;
    group.scale.set(scale, scale, scale);

    const robeMat = createFlashable(materials.darkCloth);
    const goldMat = createFlashable(materials.gold);
    const boneMat = createFlashable(materials.bone);
    const purpleGlow = materials.glowingViolet;
    anim.materials.push(robeMat, goldMat, boneMat);

    const torso = new THREE.Group();
    torso.position.y = 14;
    group.add(torso);

    // Cascading Royal Undead Robes
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(4, 9, 18, 8), robeMat);
    robe.position.y = -4;
    torso.add(robe);

    // Floating Skeletal Wings / Ribs on back
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 0.6), boneMat);
    wingL.position.set(-10, 4, -4);
    wingL.rotation.z = 0.5;
    wingL.rotation.y = 0.3;
    torso.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 0.6), boneMat);
    wingR.position.set(10, 4, -4);
    wingR.rotation.z = -0.5;
    wingR.rotation.y = -0.3;
    torso.add(wingR);

    // Crowned Skull
    const headG = new THREE.Group();
    headG.position.y = 8;
    torso.add(headG);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 4.5), boneMat);
    headG.add(skull);

    // Gothic Crown of Spires
    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.6, 4.5, 6), goldMat);
    crown.position.y = 4.2;
    headG.add(crown);

    // Glowing Violet Spectral Eyes
    const eyeGeo = new THREE.SphereGeometry(0.7, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeL.position.set(-1.2, 0.5, 2.4);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeR.position.set(1.2, 0.5, 2.4);
    headG.add(eyeR);

    // Ornate Necrotic Scythe
    const rArmG = new THREE.Group();
    rArmG.position.set(6, 2, 0);
    torso.add(rArmG);

    const scytheShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 30, 6), materials.darkSteel);
    scytheShaft.position.set(0, -2, 4);
    scytheShaft.rotation.x = Math.PI / 4;
    rArmG.add(scytheShaft);

    // Curved scythe blade
    const scytheBlade = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 0.5), materials.darkSteel);
    scytheBlade.position.set(-6, 10, 11);
    scytheBlade.rotation.z = 0.4;
    rArmG.add(scytheBlade);

    // Glowing death skull on scythe
    const deathGem = new THREE.Mesh(new THREE.OctahedronGeometry(2), purpleGlow);
    deathGem.position.set(0, 10, 11);
    rArmG.add(deathGem);

    anim.limbs.push({ mesh: rArmG, isArm: true });
  }

  // ==========================================
  // 3. 3D ITEMS: XP GEMS & CHESTS
  // ==========================================
  function createGemModel(xpValue) {
    const root = new THREE.Group();
    let geo, mat;

    if (xpValue >= 100) {
      // Purple Relic
      geo = new THREE.DodecahedronGeometry(5);
      mat = materials.glowingViolet;
    } else if (xpValue >= 25) {
      // Gold Gem
      geo = new THREE.OctahedronGeometry(4.2);
      mat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xb8860b, emissiveIntensity: 0.8, roughness: 0.2 });
    } else if (xpValue >= 5) {
      // Silver / Cyan Gem
      geo = new THREE.OctahedronGeometry(3.6);
      mat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x007799, emissiveIntensity: 0.8, roughness: 0.2 });
    } else {
      // Bronze / Green Gem
      geo = new THREE.OctahedronGeometry(3.0);
      mat = new THREE.MeshStandardMaterial({ color: 0x38ef7d, emissive: 0x117733, emissiveIntensity: 0.7, roughness: 0.3 });
    }

    const mesh = new THREE.Mesh(geo, mat);
    root.add(mesh);
    root.position.y = 8;

    root.updateVisuals = function(dt) {
      mesh.rotation.y += dt * 3.0;
      mesh.rotation.x += dt * 1.5;
      root.position.y = 7 + Math.sin(Date.now() / 250) * 2;
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
      aura.rotation.z += dt * 1.5;
      const pulse = 1 + Math.sin(Date.now() / 200) * 0.15;
      aura.scale.set(pulse, pulse, 1);
    };

    return root;
  }

  // ==========================================
  // 4. 3D PROJECTILES & WEAPON EFFECTS
  // ==========================================
  function createCrossbowBoltMesh(isEvolved) {
    const root = new THREE.Group();

    // Wooden / Iron Shaft
    const shaftMat = isEvolved ? materials.darkSteel : materials.wood;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 14, 5), shaftMat);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);

    // Sharp Steel / Molten Arrowhead
    const tipMat = isEvolved ? materials.glowingRed : materials.steel;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 5), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 8.5;
    root.add(tip);

    // 4 Aerodynamic Fletching Fins
    const fletchMat = isEvolved ? materials.royalRed : materials.crimsonCloth;
    const fletch1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 3.5), fletchMat);
    fletch1.position.z = -6;
    root.add(fletch1);
    const fletch2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 3.5), fletchMat);
    fletch2.position.z = -6;
    root.add(fletch2);

    // 3D Luminous Speed Tracer Streak
    const tracerGeo = new THREE.ConeGeometry(1.2, 18, 5);
    tracerGeo.rotateX(-Math.PI / 2);
    tracerGeo.translate(0, 0, -14);
    const tracerMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xff4500 : 0x00e5ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const tracer = new THREE.Mesh(tracerGeo, tracerMat);
    root.add(tracer);

    return root;
  }

  function createThrownAxeMesh(isEvolved) {
    const root = new THREE.Group();

    // Curved wooden haft with leather grip wraps
    const handleMat = isEvolved ? materials.blackObsidian : materials.wood;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 16, 6), handleMat);
    root.add(handle);

    // Dual bearded battleaxe blades
    const bladeMat = isEvolved ? materials.royalRed : materials.steel;
    const bladeGeo = new THREE.BoxGeometry(8, 7, 0.8);
    const bladeL = new THREE.Mesh(bladeGeo, bladeMat);
    bladeL.position.set(-4.5, 3.5, 0);
    root.add(bladeL);

    const bladeR = new THREE.Mesh(bladeGeo, bladeMat);
    bladeR.position.set(4.5, 3.5, 0);
    root.add(bladeR);

    // Beveled sharp cutting edges
    const edgeMat = isEvolved ? materials.glowingRed : materials.steel;
    const edgeL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7.8, 0.4), edgeMat);
    edgeL.position.set(-8.6, 3.5, 0);
    root.add(edgeL);

    const edgeR = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7.8, 0.4), edgeMat);
    edgeR.position.set(8.6, 3.5, 0);
    root.add(edgeR);

    // Center ornate brass collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.5, 6), materials.gold);
    collar.position.set(0, 3.5, 0);
    root.add(collar);

    return root;
  }

  function createHolyFireFlaskMesh(isEvolved) {
    const root = new THREE.Group();

    // Rounded alembic glass vial
    const vialMat = isEvolved ? materials.glowingCyan : materials.flameGlow;
    const vial = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), vialMat);
    vial.position.y = 1.5;
    root.add(vial);

    // Flask neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 3, 6), vialMat);
    neck.position.y = 4.2;
    root.add(neck);

    // Cork stopper
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 1.5, 5), materials.wood);
    cork.position.y = 5.8;
    root.add(cork);

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
      ring.rotation.z += dt * 1.5;
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
    const r = radius || 70;

    // Glowing holy seal disc on ground
    const discGeo = new THREE.RingGeometry(r * 0.85, r, 32);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 0xffd700 : 0xf1c40f,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.6;
    root.add(disc);

    // Inner rotating runes
    const innerGeo = new THREE.RingGeometry(r * 0.4, r * 0.5, 20);
    innerGeo.rotateX(-Math.PI / 2);
    const inner = new THREE.Mesh(innerGeo, new THREE.MeshBasicMaterial({
      color: 0xffea79,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    }));
    inner.position.y = 0.7;
    root.add(inner);

    // 4 Orbiting 3D Sacred Light Crystals around the hero
    const crystalsGroup = new THREE.Group();
    root.add(crystalsGroup);
    const crystals = [];
    const crystalGeo = new THREE.OctahedronGeometry(3.5, 0);
    const crystalMat = new THREE.MeshBasicMaterial({ color: isEvolved ? 0xffffff : 0xffea79 });

    const crystalCount = isEvolved ? 6 : 4;
    for (let i = 0; i < crystalCount; i++) {
      const cMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalsGroup.add(cMesh);
      crystals.push(cMesh);
    }

    root.updateVisuals = function(dt, currentRadius) {
      const curR = currentRadius || r;
      const scale = curR / r;
      disc.scale.set(scale, scale, scale);
      inner.scale.set(scale, scale, scale);
      disc.rotation.z += dt * 1.2;
      inner.rotation.z -= dt * 2.0;

      // Orbiting 3D sacred crystals
      crystalsGroup.rotation.y += dt * 2.4;
      const orbitR = curR * 0.72;
      for (let i = 0; i < crystals.length; i++) {
        const ang = (i / crystals.length) * Math.PI * 2;
        crystals[i].position.set(Math.cos(ang) * orbitR, 14 + Math.sin(Date.now() / 200 + i) * 2, Math.sin(ang) * orbitR);
        crystals[i].rotation.x += dt * 3;
        crystals[i].rotation.y += dt * 3;
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

  function createEnemyProjectileMesh(type) {
    const root = new THREE.Group();
    let mat = materials.glowingRed;
    if (type === 'poison') mat = materials.glowingGreen;
    if (type === 'dark') mat = materials.glowingViolet;

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(3.5, 8, 8), mat);
    sphere.position.y = 8;
    root.add(sphere);

    return root;
  }

  // Export to namespace
  window.MedievalSurvivors.models3d = {
    createPlayerModel,
    createEnemyModel,
    createGemModel,
    createChestModel,
    createCrossbowBoltMesh,
    createThrownAxeMesh,
    createHolyFireFlaskMesh,
    createHolyFirePoolMesh,
    createHolyAuraRingMesh,
    createSwordSlashMesh,
    createSpearThrustMesh,
    createSpearShockwaveMesh,
    createEnemyProjectileMesh,
    materials
  };
})();


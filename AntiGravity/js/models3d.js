"use strict";
window.MedievalSurvivors = window.MedievalSurvivors || {};
(function() {
  const THREE = window.THREE;
  const materials = {
    steel: new THREE.MeshStandardMaterial({ color: 9083816, metalness: 0.85, roughness: 0.25 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 2963272, metalness: 0.9, roughness: 0.3 }),
    gold: new THREE.MeshStandardMaterial({ color: 15051067, metalness: 0.88, roughness: 0.28, emissive: 4007936, emissiveIntensity: 0.2 }),
    royalRed: new THREE.MeshStandardMaterial({ color: 10162462, roughness: 0.6 }),
    crimsonCloth: new THREE.MeshStandardMaterial({ color: 9109504, roughness: 0.7, side: THREE.DoubleSide }),
    rangerGreen: new THREE.MeshStandardMaterial({ color: 2255672, roughness: 0.65 }),
    leather: new THREE.MeshStandardMaterial({ color: 5913896, roughness: 0.75 }),
    darkCloth: new THREE.MeshStandardMaterial({ color: 2038059, roughness: 0.7, side: THREE.DoubleSide }),
    pyroOrange: new THREE.MeshStandardMaterial({ color: 12531212, roughness: 0.6 }),
    flameGlow: new THREE.MeshBasicMaterial({ color: 16737792 }),
    paladinGold: new THREE.MeshStandardMaterial({ color: 15844367, metalness: 0.8, roughness: 0.25 }),
    holyGlow: new THREE.MeshBasicMaterial({ color: 16771705, transparent: true, opacity: 0.85 }),
    bone: new THREE.MeshStandardMaterial({ color: 14866888, roughness: 0.55 }),
    boneDark: new THREE.MeshStandardMaterial({ color: 11050893, roughness: 0.6 }),
    ratFur: new THREE.MeshStandardMaterial({ color: 4864818, roughness: 0.85 }),
    diseasedSkin: new THREE.MeshStandardMaterial({ color: 5597999, roughness: 0.7 }),
    glowingRed: new THREE.MeshBasicMaterial({ color: 16717636 }),
    glowingCyan: new THREE.MeshBasicMaterial({ color: 58879 }),
    glowingViolet: new THREE.MeshBasicMaterial({ color: 12289788 }),
    glowingGreen: new THREE.MeshBasicMaterial({ color: 58998 }),
    peasantClothes: new THREE.MeshStandardMaterial({ color: 7166277, roughness: 0.8 }),
    skinPale: new THREE.MeshStandardMaterial({ color: 13154462, roughness: 0.6 }),
    wood: new THREE.MeshStandardMaterial({ color: 5125664, roughness: 0.8 }),
    stoneGrey: new THREE.MeshStandardMaterial({ color: 5856867, roughness: 0.75 }),
    stoneMoss: new THREE.MeshStandardMaterial({ color: 4871490, roughness: 0.8 }),
    blackObsidian: new THREE.MeshStandardMaterial({ color: 1381914, metalness: 0.8, roughness: 0.35 }),
    hitFlash: new THREE.MeshBasicMaterial({ color: 16724787 })
  };
  for (const k in materials) {
    if (materials[k]) materials[k]._isShared = true;
  }
  const unitCircleGeo = new THREE.CircleGeometry(1, 14);
  unitCircleGeo.rotateX(-Math.PI / 2);
  unitCircleGeo._isShared = true;
  const sharedShadowMat = new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.4 });
  sharedShadowMat._isShared = true;
  const unitRingGeo = new THREE.RingGeometry(0.85, 1, 22);
  unitRingGeo.rotateX(-Math.PI / 2);
  unitRingGeo._isShared = true;
  const unitRingBossGeo = new THREE.RingGeometry(0.85, 1, 32);
  unitRingBossGeo.rotateX(-Math.PI / 2);
  unitRingBossGeo._isShared = true;
  const unitDiscGeo = new THREE.CircleGeometry(0.85, 16);
  unitDiscGeo.rotateX(-Math.PI / 2);
  unitDiscGeo._isShared = true;
  const unitDiscBossGeo = new THREE.CircleGeometry(0.85, 24);
  unitDiscBossGeo.rotateX(-Math.PI / 2);
  unitDiscBossGeo._isShared = true;
  const threatRingMatRegular = new THREE.MeshBasicMaterial({ color: 16726072, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  threatRingMatRegular._isShared = true;
  const threatRingMatElite = new THREE.MeshBasicMaterial({ color: 16753922, transparent: true, opacity: 0.88, side: THREE.DoubleSide });
  threatRingMatElite._isShared = true;
  const threatRingMatBoss = new THREE.MeshBasicMaterial({ color: 16717636, transparent: true, opacity: 0.95, side: THREE.DoubleSide });
  threatRingMatBoss._isShared = true;
  const threatFillMatRegular = new THREE.MeshBasicMaterial({ color: 10027008, transparent: true, opacity: 0.14, side: THREE.DoubleSide });
  threatFillMatRegular._isShared = true;
  const threatFillMatElite = new THREE.MeshBasicMaterial({ color: 13849600, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
  threatFillMatElite._isShared = true;
  const threatFillMatBoss = new THREE.MeshBasicMaterial({ color: 16711680, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  threatFillMatBoss._isShared = true;
  const sharedGemGeos = {
    purple: new THREE.DodecahedronGeometry(5),
    gold: new THREE.OctahedronGeometry(4.2),
    silver: new THREE.OctahedronGeometry(3.6),
    bronze: new THREE.OctahedronGeometry(3)
  };
  sharedGemGeos.purple._isShared = true;
  sharedGemGeos.gold._isShared = true;
  sharedGemGeos.silver._isShared = true;
  sharedGemGeos.bronze._isShared = true;
  const sharedGemMats = {
    purple: materials.glowingViolet,
    gold: new THREE.MeshStandardMaterial({ color: 16766720, emissive: 12092939, emissiveIntensity: 0.8, roughness: 0.2 }),
    silver: new THREE.MeshStandardMaterial({ color: 58879, emissive: 30617, emissiveIntensity: 0.8, roughness: 0.2 }),
    bronze: new THREE.MeshStandardMaterial({ color: 3731325, emissive: 1144627, emissiveIntensity: 0.7, roughness: 0.3 })
  };
  sharedGemMats.purple._isShared = true;
  sharedGemMats.gold._isShared = true;
  sharedGemMats.silver._isShared = true;
  sharedGemMats.bronze._isShared = true;
  function createFlashable(baseMat) {
    return baseMat;
  }
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
    const bodyRoot = new THREE.Group();
    root.add(bodyRoot);
    const aimGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(13, 14.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 15777882, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    aimGroup.add(ringMesh);
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(25, 0);
    arrowShape.lineTo(17.5, -4);
    arrowShape.lineTo(19, -1.4);
    arrowShape.lineTo(13.5, -1.4);
    arrowShape.lineTo(13.5, 1.4);
    arrowShape.lineTo(19, 1.4);
    arrowShape.lineTo(17.5, 4);
    arrowShape.closePath();
    const arrowGeo = new THREE.ShapeGeometry(arrowShape);
    arrowGeo.rotateX(-Math.PI / 2);
    arrowGeo.translate(0, 0.08, 0);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 15844367,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    aimGroup.add(arrowMesh);
    root.add(aimGroup);
    anim.aimArrow = aimGroup;
    if (classId === "ranger") {
      buildRangerModel(bodyRoot, anim);
    } else if (classId === "pyromancer") {
      buildPyromancerModel(bodyRoot, anim);
    } else if (classId === "paladin") {
      buildPaladinModel(bodyRoot, anim);
    } else if (classId === "berserker") {
      buildBerserkerModel(bodyRoot, anim);
    } else if (classId === "necromancer") {
      buildNecromancerModel(bodyRoot, anim);
    } else if (classId === "assassin") {
      buildAssassinModel(bodyRoot, anim);
    } else if (classId === "dark_knight") {
      buildDarkKnightPlayerModel(bodyRoot, anim);
    } else if (classId === "plague_alchemist") {
      buildPlagueAlchemistModel(bodyRoot, anim);
    } else {
      buildKnightModel(bodyRoot, anim);
    }
    const shadowGeo = new THREE.CircleGeometry(14, 20);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.4 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.y = 0.15;
    root.add(shadow);
    const hitboxGroup = new THREE.Group();
    hitboxGroup.position.y = 0.22;
    const hitboxRingGeo = new THREE.RingGeometry(19.8, 21.6, 36);
    hitboxRingGeo.rotateX(-Math.PI / 2);
    const hitboxRingMat = new THREE.MeshBasicMaterial({
      color: 62206,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const hitboxRing = new THREE.Mesh(hitboxRingGeo, hitboxRingMat);
    hitboxGroup.add(hitboxRing);
    const hitboxFillGeo = new THREE.CircleGeometry(19.8, 24);
    hitboxFillGeo.rotateX(-Math.PI / 2);
    const hitboxFillMat = new THREE.MeshBasicMaterial({
      color: 53971,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const hitboxFill = new THREE.Mesh(hitboxFillGeo, hitboxFillMat);
    hitboxGroup.add(hitboxFill);
    const tickGeo = new THREE.BoxGeometry(1.6, 0.4, 4.5);
    const tickMat = new THREE.MeshBasicMaterial({ color: 16777215 });
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      const tick = new THREE.Mesh(tickGeo, tickMat);
      const angle = tIdx * Math.PI / 2;
      tick.position.set(Math.cos(angle) * 20.7, 0.05, Math.sin(angle) * 20.7);
      tick.rotation.y = -angle;
      hitboxGroup.add(tick);
    }
    root.add(hitboxGroup);
    root.updateVisuals = function(dt, player) {
      const isMoving = Math.hypot(player.vx, player.vy) > 10;
      const walk = player.walkCycle || 0;
      if (player.invulnerableTimer > 0) {
        hitboxRingMat.color.setHex(16729943);
        hitboxFillMat.color.setHex(16729943);
        hitboxRingMat.opacity = Math.floor(Date.now() / 100) % 2 === 0 ? 0.95 : 0.3;
      } else {
        hitboxRingMat.color.setHex(62206);
        hitboxFillMat.color.setHex(53971);
        hitboxRingMat.opacity = 0.75 + Math.sin(Date.now() / 350) * 0.15;
      }
      bodyRoot.rotation.y = -player.facingAngle + Math.PI / 2;
      aimGroup.rotation.y = -player.facingAngle;
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
      if (player.tossAnimTimer > 0) {
        player.tossAnimTimer -= dt;
        const maxT = player.tossAnimMax || 0.38;
        const progress = 1 - Math.max(0, player.tossAnimTimer / maxT);
        if (anim.rightArm) {
          if (progress < 0.35) {
            const p = progress / 0.35;
            anim.rightArm.rotation.x = -p * 1.5;
            anim.rightArm.rotation.z = 0.35 * p;
          } else {
            const p = (progress - 0.35) / 0.65;
            anim.rightArm.rotation.x = -1.5 + Math.sin(p * Math.PI) * 2.8;
            anim.rightArm.rotation.z = -0.25 * (1 - p);
          }
        }
        if (anim.weapon) {
          const scale = progress < 0.35 ? 1 : progress < 0.7 ? 0.2 : (progress - 0.7) / 0.3;
          anim.weapon.scale.set(scale, scale, scale);
        }
      } else if (anim.weapon && anim.weapon.scale.x !== 1) {
        anim.weapon.scale.set(1, 1, 1);
      }
      if (anim.cape) {
        anim.cape.rotation.x = isMoving ? 0.35 + Math.sin(walk * 2) * 0.15 : 0.08 + Math.sin(Date.now() / 300) * 0.04;
      }
      const isFlashing = player.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0;
      for (let i = 0; i < anim.materials.length; i++) {
        const mat = anim.materials[i];
        if (isFlashing) {
          mat.emissive.setHex(16724787);
          mat.emissiveIntensity = 0.8;
        } else {
          mat.emissive.setHex(mat._origEmissive || 0);
          mat.emissiveIntensity = mat._origEmissiveInt || 0;
        }
      }
    };
    return root;
  }
  function buildKnightModel(group, anim) {
    const steelMat = createFlashable(materials.steel);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const goldMat = createFlashable(materials.gold);
    const redMat = createFlashable(materials.royalRed);
    const capeMat = createFlashable(materials.crimsonCloth);
    anim.materials.push(steelMat, darkSteelMat, goldMat, redMat, capeMat);
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;
    const chestGeo = new THREE.BoxGeometry(10, 11, 7);
    const chestMesh = new THREE.Mesh(chestGeo, steelMat);
    torsoGroup.add(chestMesh);
    const crossVGeo = new THREE.BoxGeometry(2, 7, 0.4);
    crossVGeo.translate(0, 0, 3.6);
    torsoGroup.add(new THREE.Mesh(crossVGeo, goldMat));
    const crossHGeo = new THREE.BoxGeometry(6, 2, 0.4);
    crossHGeo.translate(0, 1, 3.6);
    torsoGroup.add(new THREE.Mesh(crossHGeo, goldMat));
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
    const headGroup = new THREE.Group();
    headGroup.position.y = 8;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const helmGeo = new THREE.BoxGeometry(6.5, 7.5, 6.8);
    const helmMesh = new THREE.Mesh(helmGeo, steelMat);
    headGroup.add(helmMesh);
    const visorGeo = new THREE.BoxGeometry(5.2, 1.2, 0.6);
    visorGeo.translate(0, 0.4, 3.5);
    headGroup.add(new THREE.Mesh(visorGeo, darkSteelMat));
    const crestGeo = new THREE.BoxGeometry(1.4, 3, 7.2);
    crestGeo.translate(0, 4.2, 0);
    headGroup.add(new THREE.Mesh(crestGeo, goldMat));
    const plumeGeo = new THREE.ConeGeometry(2.4, 8, 5);
    plumeGeo.rotateX(-0.3);
    plumeGeo.translate(0, 8.5, -2);
    headGroup.add(new THREE.Mesh(plumeGeo, redMat));
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 5, -3.6);
    const capeGeo = new THREE.PlaneGeometry(9, 16, 3, 3);
    capeGeo.translate(0, -8, 0);
    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeGroup.add(capeMesh);
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6.5, 4, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;
    const pauldronGeo = new THREE.BoxGeometry(3.6, 3.6, 4.2);
    leftArmGroup.add(new THREE.Mesh(pauldronGeo, steelMat));
    const armGeo = new THREE.CylinderGeometry(1.4, 1.3, 7, 6);
    armGeo.translate(0, -3.5, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, steelMat));
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-2, -4, 2);
    shieldGroup.rotation.y = 0.4;
    const shieldPlateGeo = new THREE.BoxGeometry(7, 10, 0.8);
    const shieldPlate = new THREE.Mesh(shieldPlateGeo, redMat);
    shieldGroup.add(shieldPlate);
    const shieldBorderGeo = new THREE.BoxGeometry(7.6, 10.6, 0.6);
    shieldGroup.add(new THREE.Mesh(shieldBorderGeo, goldMat));
    leftArmGroup.add(shieldGroup);
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6.5, 4, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    const rPauldron = new THREE.Mesh(pauldronGeo, steelMat);
    rightArmGroup.add(rPauldron);
    const rArm = new THREE.Mesh(armGeo, steelMat);
    rightArmGroup.add(rArm);
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
  function buildRangerModel(group, anim) {
    const greenMat = createFlashable(materials.rangerGreen);
    const darkClothMat = createFlashable(materials.darkCloth);
    const leatherMat = createFlashable(materials.leather);
    const goldMat = createFlashable(materials.gold);
    const steelMat = createFlashable(materials.steel);
    const darkSteelMat = createFlashable(materials.darkSteel);
    const woodMat = createFlashable(materials.wood);
    const eyeMat = materials.glowingGreen;
    const skinMat = createFlashable(materials.skinPale);
    const featherMat = createFlashable(new THREE.MeshStandardMaterial({ color: 14678523, roughness: 0.4 }));
    const silverHairMat = createFlashable(new THREE.MeshStandardMaterial({ color: 14474721, roughness: 0.5 }));
    anim.materials.push(greenMat, darkClothMat, leatherMat, goldMat, steelMat, darkSteelMat, woodMat, skinMat, featherMat, silverHairMat);
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 14;
    group.add(torsoGroup);
    anim.torso = torsoGroup;
    const tunic = new THREE.Mesh(new THREE.BoxGeometry(7, 9.5, 5), greenMat);
    torsoGroup.add(tunic);
    const corset = new THREE.Mesh(new THREE.BoxGeometry(7.3, 6.2, 5.3), leatherMat);
    corset.position.y = -0.6;
    torsoGroup.add(corset);
    for (let cIdx = 0; cIdx < 3; cIdx++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.3), goldMat);
      lace.position.set(0, -1.8 + cIdx * 1.4, 2.75);
      torsoGroup.add(lace);
    }
    const belt = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2, 5.5), leatherMat);
    belt.position.y = -3.8;
    torsoGroup.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(2, 2.2, 0.6), goldMat);
    buckle.position.set(0, -3.8, 2.85);
    torsoGroup.add(buckle);
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.6), leatherMat);
    pouch.position.set(3.8, -4, 0.8);
    torsoGroup.add(pouch);
    const pouchClasp = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.4), goldMat);
    pouchClasp.position.set(3.8, -4, 1.7);
    torsoGroup.add(pouchClasp);
    const skirtL = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.8, 5.1), darkClothMat);
    skirtL.position.set(-1.9, -6, 0);
    torsoGroup.add(skirtL);
    const skirtR = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.8, 5.1), darkClothMat);
    skirtR.position.set(1.9, -6, 0);
    torsoGroup.add(skirtR);
    const pauldronL = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 4.2), darkSteelMat);
    pauldronL.position.set(-4.4, 4.2, 0);
    pauldronL.rotation.z = -0.25;
    torsoGroup.add(pauldronL);
    const pauldronR = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 4.2), darkSteelMat);
    pauldronR.position.set(4.4, 4.2, 0);
    pauldronR.rotation.z = 0.25;
    torsoGroup.add(pauldronR);
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 4.4, -2.6);
    const brooch = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 8), goldMat);
    brooch.rotation.x = Math.PI / 2;
    capeGroup.add(brooch);
    const capeMesh = new THREE.Mesh(new THREE.BoxGeometry(6.6, 13.5, 0.6), darkClothMat);
    capeMesh.position.set(0, -6.5, -0.2);
    capeMesh.rotation.x = 0.08;
    capeGroup.add(capeMesh);
    const capeTrim = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.2, 0.7), greenMat);
    capeTrim.position.set(0, -12.8, -0.2);
    capeGroup.add(capeTrim);
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;
    const quiverGroup = new THREE.Group();
    quiverGroup.position.set(2.4, 1.8, -3.2);
    quiverGroup.rotation.z = -0.38;
    quiverGroup.rotation.y = 0.15;
    const quiverBody = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.3, 10.5, 8), leatherMat);
    quiverGroup.add(quiverBody);
    const quiverRimTop = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 8), darkSteelMat);
    quiverRimTop.position.y = 4.8;
    quiverGroup.add(quiverRimTop);
    const quiverRimBottom = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 1, 8), goldMat);
    quiverRimBottom.position.y = -4.8;
    quiverGroup.add(quiverRimBottom);
    for (let fIdx = 0; fIdx < 5; fIdx++) {
      const arrowStick = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6.5, 4), woodMat);
      const angle = fIdx / 5 * Math.PI * 2;
      const rad = 0.85;
      arrowStick.position.set(Math.cos(angle) * rad, 6.5, Math.sin(angle) * rad);
      quiverGroup.add(arrowStick);
      const fletch = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 0.15), fIdx === 0 ? eyeMat : featherMat);
      fletch.position.set(Math.cos(angle) * rad, 8.8, Math.sin(angle) * rad);
      fletch.rotation.y = angle;
      quiverGroup.add(fletch);
    }
    const harness = new THREE.Mesh(new THREE.BoxGeometry(1.4, 11.5, 5.4), leatherMat);
    harness.position.set(0.6, 0.5, 0);
    harness.rotation.z = -0.42;
    torsoGroup.add(harness);
    torsoGroup.add(quiverGroup);
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.8;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const face = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4, 3.6), skinMat);
    face.position.set(0, 0, 0.2);
    headGroup.add(face);
    const mask = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2, 1.4), darkClothMat);
    mask.position.set(0, -0.9, 1.6);
    headGroup.add(mask);
    const cowlBack = new THREE.Mesh(new THREE.ConeGeometry(4.4, 7.8, 6), greenMat);
    cowlBack.position.set(0, 1.6, -0.6);
    cowlBack.rotation.x = -0.2;
    headGroup.add(cowlBack);
    const hoodPeak = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.4, 4.8), darkClothMat);
    hoodPeak.position.set(0, 1.8, 0.6);
    hoodPeak.rotation.x = 0.15;
    headGroup.add(hoodPeak);
    const hairStrand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.2, 0.8), silverHairMat);
    hairStrand.position.set(-2, -1, 1.4);
    hairStrand.rotation.z = 0.15;
    headGroup.add(hairStrand);
    const eyeGeo = new THREE.BoxGeometry(0.9, 0.45, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.15, 0.6, 2.05);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.15, 0.6, 2.05);
    headGroup.add(eyeR);
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5.2, 3.2, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.1, 4.5, 6), greenMat);
    sleeveR.position.set(0, -2, 0);
    rightArmGroup.add(sleeveR);
    const vambraceR = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.15, 3.6, 6), leatherMat);
    vambraceR.position.set(0, -4.6, 0);
    rightArmGroup.add(vambraceR);
    const bracerPlateR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 1.6), darkSteelMat);
    bracerPlateR.position.set(0.9, -4.6, 0);
    rightArmGroup.add(bracerPlateR);
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, -6, 4.5);
    bowGroup.rotation.x = Math.PI / 2;
    const stock = new THREE.Mesh(new THREE.BoxGeometry(1.5, 12.5, 1.8), woodMat);
    bowGroup.add(stock);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 11.5, 0.4), steelMat);
    rail.position.set(0, 0, 1);
    bowGroup.add(rail);
    const limbMat = darkSteelMat;
    const limbLeft = new THREE.Mesh(new THREE.BoxGeometry(6, 1.3, 1.2), limbMat);
    limbLeft.position.set(-3.2, 5, 0.2);
    limbLeft.rotation.z = -0.15;
    bowGroup.add(limbLeft);
    const limbRight = new THREE.Mesh(new THREE.BoxGeometry(6, 1.3, 1.2), limbMat);
    limbRight.position.set(3.2, 5, 0.2);
    limbRight.rotation.z = 0.15;
    bowGroup.add(limbRight);
    const tipL = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 6), goldMat);
    tipL.position.set(-6.1, 4.6, 0.2);
    bowGroup.add(tipL);
    const tipR = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 6), goldMat);
    tipR.position.set(6.1, 4.6, 0.2);
    bowGroup.add(tipR);
    const stirrup = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.35, 6, 10), steelMat);
    stirrup.position.set(0, 7, 0);
    bowGroup.add(stirrup);
    const loadedBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8.5, 5), steelMat);
    loadedBolt.position.set(0, 2.5, 1.2);
    loadedBolt.rotation.x = Math.PI / 2;
    bowGroup.add(loadedBolt);
    const boltTipGlow = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 5), eyeMat);
    boltTipGlow.position.set(0, 6.8, 1.2);
    boltTipGlow.rotation.x = -Math.PI / 2;
    bowGroup.add(boltTipGlow);
    rightArmGroup.add(bowGroup);
    anim.weapon = bowGroup;
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5.2, 3.2, 0);
    leftArmGroup.rotation.x = Math.PI / 4;
    leftArmGroup.rotation.y = -0.35;
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.1, 4.5, 6), greenMat);
    sleeveL.position.set(0, -2, 0);
    leftArmGroup.add(sleeveL);
    const vambraceL = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.15, 3.6, 6), leatherMat);
    vambraceL.position.set(0, -4.6, 0);
    leftArmGroup.add(vambraceL);
    const gloveL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2, 1.6), darkClothMat);
    gloveL.position.set(0, -6.6, 0);
    leftArmGroup.add(gloveL);
    const legGeo = new THREE.CylinderGeometry(1.3, 1.1, 5, 6);
    legGeo.translate(0, -2.5, 0);
    const legL = new THREE.Group();
    legL.position.set(-2.2, 9.2, 0);
    legL.add(new THREE.Mesh(legGeo, darkClothMat));
    const bootL = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 5.5, 6), leatherMat);
    bootL.position.set(0, -6.5, 0.2);
    legL.add(bootL);
    const toeL = new THREE.Mesh(new THREE.BoxGeometry(2, 1.4, 3), darkSteelMat);
    toeL.position.set(0, -8.6, 1);
    legL.add(toeL);
    group.add(legL);
    anim.leftLeg = legL;
    const legR = new THREE.Group();
    legR.position.set(2.2, 9.2, 0);
    legR.add(new THREE.Mesh(legGeo, darkClothMat));
    const bootR = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 5.5, 6), leatherMat);
    bootR.position.set(0, -6.5, 0.2);
    legR.add(bootR);
    const toeR = new THREE.Mesh(new THREE.BoxGeometry(2, 1.4, 3), darkSteelMat);
    toeR.position.set(0, -8.6, 1);
    legR.add(toeR);
    const bootSheath = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 1), leatherMat);
    bootSheath.position.set(1.4, -6, 0.2);
    legR.add(bootSheath);
    const daggerHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.4, 4), goldMat);
    daggerHilt.position.set(1.4, -4, 0.2);
    legR.add(daggerHilt);
    group.add(legR);
    anim.rightLeg = legR;
  }
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
    const robeGeo = new THREE.CylinderGeometry(3.5, 6.5, 15, 8);
    robeGeo.translate(0, -4, 0);
    torsoGroup.add(new THREE.Mesh(robeGeo, robeMat));
    const headGroup = new THREE.Group();
    headGroup.position.y = 7;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const cowlGeo = new THREE.ConeGeometry(4, 9, 6);
    cowlGeo.rotateX(-0.25);
    headGroup.add(new THREE.Mesh(cowlGeo, darkMat));
    const eyeGeo = new THREE.SphereGeometry(0.6, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, flameMat);
    eyeL.position.set(-1.2, -0.5, 2.5);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, flameMat);
    eyeR.position.set(1.2, -0.5, 2.5);
    headGroup.add(eyeR);
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
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5, 2, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    rightArmGroup.add(new THREE.Mesh(sleeveGeo, robeMat));
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -4, 3);
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 24, 6), woodMat);
    staffGroup.add(staffShaft);
    const staffCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(2.2), flameMat);
    staffCrystal.position.y = 12;
    staffGroup.add(staffCrystal);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.4, 6, 12), goldMat);
    ring.position.y = 12;
    staffGroup.add(ring);
    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;
  }
  function buildPaladinModel(group, anim) {
    const goldPlate = createFlashable(materials.paladinGold);
    const whiteSteel = createFlashable(materials.steel);
    const haloMat = materials.holyGlow;
    const blueMat = createFlashable(new THREE.MeshStandardMaterial({ color: 1668818, roughness: 0.5 }));
    anim.materials.push(goldPlate, whiteSteel, blueMat);
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;
    const chest = new THREE.Mesh(new THREE.BoxGeometry(11, 12, 7.5), goldPlate);
    torsoGroup.add(chest);
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
    const pauldronGeo = new THREE.BoxGeometry(5, 4.5, 5);
    const pauldronL = new THREE.Mesh(pauldronGeo, goldPlate);
    pauldronL.position.set(-7, 4, 0);
    torsoGroup.add(pauldronL);
    const pauldronR = new THREE.Mesh(pauldronGeo, goldPlate);
    pauldronR.position.set(7, 4, 0);
    torsoGroup.add(pauldronR);
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
    const chestGeo = new THREE.BoxGeometry(9, 12, 6.8);
    torsoGroup.add(new THREE.Mesh(chestGeo, clothMat));
    for (let r = -2; r <= 1; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(7 - Math.abs(r) * 0.8, 0.7, 7.2), boneMat);
      rib.position.y = r * 1.8;
      torsoGroup.add(rib);
    }
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const hoodGeo = new THREE.BoxGeometry(7, 7.5, 7.5);
    headGroup.add(new THREE.Mesh(hoodGeo, clothMat));
    const shadowFace = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 1), materials.blackObsidian);
    shadowFace.position.set(0, 0, 3.4);
    headGroup.add(shadowFace);
    const eyeGeo = new THREE.BoxGeometry(0.8, 0.4, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.2, 0.3, 3.9);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.2, 0.3, 3.9);
    headGroup.add(eyeR);
    const smallSkull = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), boneMat);
    smallSkull.position.set(0, 4.2, 3.2);
    headGroup.add(smallSkull);
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
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(5.8, 4, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    const rSleeve = new THREE.Mesh(sleeveGeo, clothMat);
    rightArmGroup.add(rSleeve);
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -6, 2);
    staffGroup.rotation.x = Math.PI / 6;
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 22, 6), boneMat);
    staffGroup.add(staffShaft);
    const scepterSkull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), boneMat);
    scepterSkull.position.y = 11;
    staffGroup.add(scepterSkull);
    const scepterSoul = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), soulMat);
    scepterSoul.position.y = 14;
    staffGroup.add(scepterSoul);
    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;
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
    const chestGeo = new THREE.BoxGeometry(8.5, 10.5, 6);
    torsoGroup.add(new THREE.Mesh(chestGeo, darkMat));
    const sashGeo = new THREE.BoxGeometry(8.8, 2.2, 6.4);
    sashGeo.translate(0, -4.5, 0);
    torsoGroup.add(new THREE.Mesh(sashGeo, redMat));
    const ribbonGeo = new THREE.PlaneGeometry(3, 12);
    ribbonGeo.translate(0, -6, -3.3);
    const ribbon = new THREE.Mesh(ribbonGeo, redMat);
    torsoGroup.add(ribbon);
    const headGroup = new THREE.Group();
    headGroup.position.y = 7.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const cowlGeo = new THREE.BoxGeometry(6, 6.5, 6.5);
    headGroup.add(new THREE.Mesh(cowlGeo, darkMat));
    const eyeGeo = new THREE.BoxGeometry(0.7, 0.3, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 0.2, 3.3);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 0.2, 3.3);
    headGroup.add(eyeR);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-5.6, 3.5, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;
    const armGeo = new THREE.CylinderGeometry(1.2, 1.1, 6.5, 6);
    armGeo.translate(0, -3.2, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, darkMat));
    const daggerLGroup = new THREE.Group();
    daggerLGroup.position.set(0, -5.5, 1.5);
    daggerLGroup.rotation.x = Math.PI * 0.85;
    const dBladeL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.3), steelMat);
    dBladeL.position.y = 4;
    daggerLGroup.add(dBladeL);
    const dGuardL = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 0.8), redMat);
    daggerLGroup.add(dGuardL);
    leftArmGroup.add(daggerLGroup);
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
    const chestGeo = new THREE.BoxGeometry(11, 12, 8);
    torsoGroup.add(new THREE.Mesh(chestGeo, blackMat));
    for (let s of [-3, 3]) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3, 4), darkSteelMat);
      spike.rotation.x = Math.PI / 2;
      spike.position.set(s, 2, 4.5);
      torsoGroup.add(spike);
    }
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
    const headGroup = new THREE.Group();
    headGroup.position.y = 8.5;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const helmGeo = new THREE.BoxGeometry(7, 8, 7.5);
    headGroup.add(new THREE.Mesh(helmGeo, blackMat));
    const visorGeo = new THREE.BoxGeometry(5.6, 1, 0.4);
    visorGeo.translate(0, 0.4, 3.9);
    headGroup.add(new THREE.Mesh(visorGeo, glowRed));
    const hornGeo = new THREE.ConeGeometry(1.2, 6, 4);
    hornGeo.rotateZ(-0.6);
    hornGeo.translate(-4.5, 4, 0);
    headGroup.add(new THREE.Mesh(hornGeo, darkSteelMat));
    const hornRGeo = new THREE.ConeGeometry(1.2, 6, 4);
    hornRGeo.rotateZ(0.6);
    hornRGeo.translate(4.5, 4, 0);
    headGroup.add(new THREE.Mesh(hornRGeo, darkSteelMat));
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 5, -4.2);
    const capeGeo = new THREE.PlaneGeometry(10, 17, 3, 3);
    capeGeo.translate(0, -8.5, 0);
    capeGroup.add(new THREE.Mesh(capeGeo, capeMat));
    torsoGroup.add(capeGroup);
    anim.cape = capeGroup;
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-7, 3.5, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;
    const armGeo = new THREE.CylinderGeometry(1.7, 1.5, 7.5, 6);
    armGeo.translate(0, -3.7, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, blackMat));
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(7, 3.5, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    const rArm = new THREE.Mesh(armGeo, blackMat);
    rightArmGroup.add(rArm);
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -6, 2);
    swordGroup.rotation.x = Math.PI / 4;
    const bladeGeo = new THREE.BoxGeometry(2.4, 22, 0.8);
    bladeGeo.translate(0, 11, 0);
    swordGroup.add(new THREE.Mesh(bladeGeo, darkSteelMat));
    const runeGeo = new THREE.BoxGeometry(0.8, 16, 0.9);
    runeGeo.translate(0, 10, 0);
    swordGroup.add(new THREE.Mesh(runeGeo, glowRed));
    const guardGeo = new THREE.BoxGeometry(8, 1.4, 1.8);
    swordGroup.add(new THREE.Mesh(guardGeo, blackMat));
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5, 5), materials.leather);
    hilt.position.y = -2.8;
    swordGroup.add(hilt);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(1.4, 6, 6), darkSteelMat);
    pommel.position.y = -5.6;
    swordGroup.add(pommel);
    rightArmGroup.add(swordGroup);
    anim.weapon = swordGroup;
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
  function buildPlagueAlchemistModel(group, anim) {
    const leatherMat = createFlashable(materials.leather);
    const darkMat = createFlashable(materials.darkCloth);
    const boneMat = createFlashable(materials.bone);
    const greenMat = materials.glowingGreen;
    const glassMat = new THREE.MeshBasicMaterial({ color: 5635959, transparent: true, opacity: 0.75 });
    anim.materials.push(leatherMat, darkMat, boneMat);
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 15;
    group.add(torsoGroup);
    anim.torso = torsoGroup;
    const coatGeo = new THREE.BoxGeometry(9.5, 12, 7);
    torsoGroup.add(new THREE.Mesh(coatGeo, darkMat));
    const bandolier = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 7.4), leatherMat);
    bandolier.rotation.z = 0.45;
    torsoGroup.add(bandolier);
    for (let v of [-2, 0, 2]) {
      const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.5, 5), greenMat);
      vial.position.set(v * 1.8, v * 0.8, 3.8);
      torsoGroup.add(vial);
    }
    const headGroup = new THREE.Group();
    headGroup.position.y = 8;
    torsoGroup.add(headGroup);
    anim.head = headGroup;
    const headGeo = new THREE.BoxGeometry(6, 6.5, 6.5);
    headGroup.add(new THREE.Mesh(headGeo, darkMat));
    const beakGeo = new THREE.ConeGeometry(2.2, 8, 5);
    beakGeo.rotateX(Math.PI / 2.2);
    beakGeo.translate(0, -1, 6.5);
    headGroup.add(new THREE.Mesh(beakGeo, boneMat));
    for (let g of [-1.5, 1.5]) {
      const goggle = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 6), materials.gold);
      goggle.rotation.x = Math.PI / 2;
      goggle.position.set(g, 1, 3.5);
      headGroup.add(goggle);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.9, 6), greenMat);
      lens.position.set(g, 1, 4);
      headGroup.add(lens);
    }
    const brimGeo = new THREE.CylinderGeometry(7.5, 7.5, 0.6, 12);
    brimGeo.translate(0, 3.5, 0);
    headGroup.add(new THREE.Mesh(brimGeo, leatherMat));
    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 3.5, 8), leatherMat);
    hatCrown.position.y = 5.2;
    headGroup.add(hatCrown);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-6, 3.5, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;
    const armGeo = new THREE.CylinderGeometry(1.4, 1.3, 7, 6);
    armGeo.translate(0, -3.5, 0);
    leftArmGroup.add(new THREE.Mesh(armGeo, darkMat));
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(6, 3.5, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;
    const rArm = new THREE.Mesh(armGeo, darkMat);
    rightArmGroup.add(rArm);
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(0, -6, 2);
    const flaskGlobe = new THREE.Mesh(new THREE.SphereGeometry(2.4, 8, 8), glassMat);
    flaskGroup.add(flaskGlobe);
    const flaskCore = new THREE.Mesh(new THREE.SphereGeometry(1.6, 6, 6), greenMat);
    flaskGroup.add(flaskCore);
    const flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.2, 6), materials.wood);
    flaskNeck.position.y = 2.4;
    flaskGroup.add(flaskNeck);
    rightArmGroup.add(flaskGroup);
    anim.weapon = flaskGroup;
    const skirtGeo = new THREE.CylinderGeometry(5.2, 7.5, 9, 8);
    skirtGeo.translate(0, -4.5, 0);
    torsoGroup.add(new THREE.Mesh(skirtGeo, darkMat));
    const legGeo = new THREE.CylinderGeometry(1.4, 1.2, 8.5, 6);
    legGeo.translate(0, -4.2, 0);
    const legL = new THREE.Group();
    legL.position.set(-2.6, 8.5, 0);
    legL.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legL);
    anim.leftLeg = legL;
    const legR = new THREE.Group();
    legR.position.set(2.6, 8.5, 0);
    legR.add(new THREE.Mesh(legGeo, leatherMat));
    group.add(legR);
    anim.rightLeg = legR;
  }
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
    if (type === "rat") {
      buildPlagueRatModel(root, anim);
    } else if (type === "skeleton") {
      buildSkeletonModel(root, anim);
    } else if (type === "villager") {
      buildCursedVillagerModel(root, anim);
    } else if (type === "dark_knight") {
      buildDarkKnightModel(root, anim);
    } else if (type === "witch") {
      buildWitchModel(root, anim);
    } else if (type === "boss_executioner") {
      buildExecutionerBossModel(root, anim);
    } else if (type === "boss_golem") {
      buildStoneGolemBossModel(root, anim);
    } else if (type === "boss_baron" || type === "boss_death_baron") {
      buildDeathBaronBossModel(root, anim);
    } else {
      buildSkeletonModel(root, anim);
    }
    const sRadius = (enemy.radius || 12) * 0.75;
    const shadow = new THREE.Mesh(unitCircleGeo, sharedShadowMat);
    shadow.scale.set(sRadius, 1, sRadius);
    shadow.position.y = 0.12;
    root.add(shadow);
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
    anim.flashMeshes = [];
    root.traverse((child) => {
      if (child.isMesh && child !== shadow && (!threatGroup || !threatGroup.children.includes(child))) {
        child._origMat = child.material;
        anim.flashMeshes.push(child);
      }
    });
    root.updateVisuals = function(dt, enemyObj) {
      const walk = enemyObj.walkCycle || 0;
      const angle = Math.atan2(enemyObj.vy, enemyObj.vx);
      root.rotation.y = -angle + Math.PI / 2;
      if (anim.limbs && anim.limbs.length >= 2) {
        const swing = Math.sin(walk) * 0.7;
        for (let i = 0; i < anim.limbs.length; i++) {
          const l = anim.limbs[i];
          if (l.isLeg) {
            l.mesh.rotation.x = i % 2 === 0 ? swing : -swing;
          } else if (l.isArm) {
            l.mesh.rotation.x = i % 2 === 0 ? -swing * 0.7 : swing * 0.7;
          } else if (l.isTail) {
            l.mesh.rotation.y = Math.sin(walk * 1.5) * 0.5;
          }
        }
      }
      if (anim.isHovering) {
        root.position.y = 4 + Math.sin(walk) * 2.2;
      }
      const currentR = Math.max(6, enemyObj.radius || 14);
      if (threatRing) threatRing.scale.set(currentR, 1, currentR);
      if (threatFill) threatFill.scale.set(currentR, 1, currentR);
      const curSRadius = currentR * 0.75;
      shadow.scale.set(curSRadius, 1, curSRadius);
      if (bossOuterRing) {
        const pulse = 1 + Math.sin(Date.now() / 200) * 0.08;
        bossOuterRing.scale.set(currentR * 1.25 * pulse, 1, currentR * 1.25 * pulse);
      }
      const isDamaged = enemyObj.hp < enemyObj._lastHp;
      enemyObj._lastHp = enemyObj.hp;
      if (isDamaged) {
        anim.flashTimer = 0.1;
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
    let enemyScale = enemy.isBoss ? 1.45 : 1.4;
    if (enemy.isChampion) {
      enemyScale *= 1.25;
    }
    root.scale.set(enemyScale, enemyScale, enemyScale);
    return root;
  }
  function buildPlagueRatModel(group, anim) {
    const furMat = createFlashable(materials.ratFur);
    const skinMat = createFlashable(materials.diseasedSkin);
    const eyeMat = materials.glowingRed;
    anim.materials.push(furMat, skinMat);
    const bodyGeo = new THREE.ConeGeometry(3.5, 11, 6);
    bodyGeo.rotateX(Math.PI / 2);
    bodyGeo.translate(0, 3, 0);
    const body = new THREE.Mesh(bodyGeo, furMat);
    group.add(body);
    const snout = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 5), skinMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 2.5, 6.5);
    group.add(snout);
    const eyeGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 3.4, 5.2);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 3.4, 5.2);
    group.add(eyeR);
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 3, -5.5);
    const tailGeo = new THREE.CylinderGeometry(0.4, 0.2, 9, 4);
    tailGeo.rotateX(-0.4);
    tailGeo.translate(0, 0, -4.5);
    const tailMesh = new THREE.Mesh(tailGeo, skinMat);
    tailGroup.add(tailMesh);
    group.add(tailGroup);
    anim.limbs.push({ mesh: tailGroup, isTail: true });
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
  function buildSkeletonModel(group, anim) {
    const boneMat = createFlashable(materials.bone);
    const steelMat = createFlashable(materials.steel);
    const woodMat = createFlashable(materials.wood);
    const eyeMat = materials.glowingCyan;
    anim.materials.push(boneMat, steelMat, woodMat);
    const torso = new THREE.Group();
    torso.position.y = 12;
    group.add(torso);
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 9, 5), boneMat);
    torso.add(spine);
    for (let r = -2; r <= 2; r++) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(6 - Math.abs(r) * 0.8, 0.8, 4), boneMat);
      rib.position.y = r * 1.5;
      torso.add(rib);
    }
    const headG = new THREE.Group();
    headG.position.y = 6.5;
    torso.add(headG);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 4.5), boneMat);
    headG.add(skull);
    const eyeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.1, 0.2, 2.3);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.1, 0.2, 2.3);
    headG.add(eyeR);
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
    const lArmG = new THREE.Group();
    lArmG.position.set(-4, 2.5, 0);
    torso.add(lArmG);
    lArmG.add(new THREE.Mesh(armBoneGeo, boneMat));
    const buckler = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.6, 8), woodMat);
    buckler.rotation.x = Math.PI / 2;
    buckler.position.set(-1, -4, 1.5);
    lArmG.add(buckler);
    anim.limbs.push({ mesh: lArmG, isArm: true });
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
  function buildCursedVillagerModel(group, anim) {
    const clothMat = createFlashable(materials.peasantClothes);
    const skinMat = createFlashable(materials.skinPale);
    const woodMat = createFlashable(materials.wood);
    const steelMat = createFlashable(materials.steel);
    anim.materials.push(clothMat, skinMat, woodMat, steelMat);
    const torso = new THREE.Group();
    torso.position.y = 12;
    torso.rotation.x = 0.25;
    group.add(torso);
    const chest = new THREE.Mesh(new THREE.BoxGeometry(8, 10, 5), clothMat);
    torso.add(chest);
    const head = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 4.5), skinMat);
    head.position.set(0.5, 7, 1);
    head.rotation.z = 0.2;
    torso.add(head);
    const rArmG = new THREE.Group();
    rArmG.position.set(5, 3, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(1.2, 1, 7, 5);
    armGeo.translate(0, -3.5, 0);
    rArmG.add(new THREE.Mesh(armGeo, skinMat));
    const forkShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 18, 5), woodMat);
    forkShaft.position.set(0, -2, 5);
    forkShaft.rotation.x = Math.PI / 4;
    rArmG.add(forkShaft);
    const tines = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4, 0.4), steelMat);
    tines.position.set(0, 5, 11);
    rArmG.add(tines);
    anim.limbs.push({ mesh: rArmG, isArm: true });
    const lArmG = new THREE.Group();
    lArmG.position.set(-5, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, skinMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });
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
    const headG = new THREE.Group();
    headG.position.y = 9;
    torso.add(headG);
    const helm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.5, 7), obsMat);
    headG.add(helm);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 0.4), redGlow);
    visor.position.set(0, 0.5, 3.6);
    headG.add(visor);
    const hornGeo = new THREE.ConeGeometry(1.2, 5, 4);
    const hornL = new THREE.Mesh(hornGeo, obsMat);
    hornL.rotation.z = -0.7;
    hornL.position.set(-4, 3, 0);
    headG.add(hornL);
    const hornR = new THREE.Mesh(hornGeo, obsMat);
    hornR.rotation.z = 0.7;
    hornR.position.set(4, 3, 0);
    headG.add(hornR);
    const pauldronGeo = new THREE.ConeGeometry(3.5, 5, 4);
    const pL = new THREE.Mesh(pauldronGeo, obsMat);
    pL.position.set(-7.5, 4, 0);
    torso.add(pL);
    const pR = new THREE.Mesh(pauldronGeo, obsMat);
    pR.position.set(7.5, 4, 0);
    torso.add(pR);
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
    const swordRune = new THREE.Mesh(new THREE.BoxGeometry(0.6, 16, 0.9), materials.glowingViolet);
    swordRune.position.set(0, -5, 5);
    swordRune.rotation.x = Math.PI / 3.5;
    rArmG.add(swordRune);
    anim.limbs.push({ mesh: rArmG, isArm: true });
    const lArmG = new THREE.Group();
    lArmG.position.set(-7, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, obsMat));
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });
    const legGeo = new THREE.CylinderGeometry(2, 1.7, 10, 6);
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
  function buildWitchModel(group, anim) {
    anim.isHovering = true;
    const robeMat = createFlashable(materials.darkCloth);
    const skinMat = createFlashable(materials.skinPale);
    const glowMat = materials.glowingGreen;
    anim.materials.push(robeMat, skinMat);
    const torso = new THREE.Group();
    torso.position.y = 10;
    group.add(torso);
    const robe = new THREE.Mesh(new THREE.ConeGeometry(5.5, 14, 8), robeMat);
    robe.position.y = -2;
    torso.add(robe);
    const headG = new THREE.Group();
    headG.position.y = 6.5;
    torso.add(headG);
    const head = new THREE.Mesh(new THREE.SphereGeometry(3, 6, 6), skinMat);
    headG.add(head);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.5, 0.4, 12), robeMat);
    brim.position.y = 2;
    headG.add(brim);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 9, 8), robeMat);
    cone.position.set(0, 6.5, -0.8);
    cone.rotation.x = -0.3;
    headG.add(cone);
    const eyeGeo = new THREE.SphereGeometry(0.5, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, glowMat);
    eyeL.position.set(-1.1, 0, 2.7);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, glowMat);
    eyeR.position.set(1.1, 0, 2.7);
    headG.add(eyeR);
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
    const chest = new THREE.Mesh(new THREE.BoxGeometry(13, 13, 9), skinMat);
    torso.add(chest);
    const apron = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 1.2), apronMat);
    apron.position.set(0, -3, 4.6);
    torso.add(apron);
    const headG = new THREE.Group();
    headG.position.y = 9;
    torso.add(headG);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(7, 8, 7.5), hoodMat);
    headG.add(hood);
    const eyeGeo = new THREE.BoxGeometry(1.2, 0.6, 0.3);
    const eyeL = new THREE.Mesh(eyeGeo, materials.glowingRed);
    eyeL.position.set(-1.6, 0.5, 3.8);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, materials.glowingRed);
    eyeR.position.set(1.6, 0.5, 3.8);
    headG.add(eyeR);
    const rArmG = new THREE.Group();
    rArmG.position.set(8.5, 3, 0);
    torso.add(rArmG);
    const armGeo = new THREE.CylinderGeometry(2.4, 2.1, 9, 6);
    armGeo.translate(0, -4.5, 0);
    rArmG.add(new THREE.Mesh(armGeo, skinMat));
    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 28, 6), materials.wood);
    axeShaft.position.set(0, -3, 6);
    axeShaft.rotation.x = Math.PI / 3;
    rArmG.add(axeShaft);
    const bladeGeo = new THREE.BoxGeometry(10, 8, 0.8);
    bladeGeo.translate(0, 9, 6);
    const bladeMesh = new THREE.Mesh(bladeGeo, steelMat);
    bladeMesh.rotation.x = Math.PI / 3;
    rArmG.add(bladeMesh);
    anim.limbs.push({ mesh: rArmG, isArm: true });
    const lArmG = new THREE.Group();
    lArmG.position.set(-8.5, 3, 0);
    lArmG.add(new THREE.Mesh(armGeo, skinMat));
    const chain = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.6, 6, 12), materials.darkSteel);
    chain.position.set(0, -7, 0);
    lArmG.add(chain);
    torso.add(lArmG);
    anim.limbs.push({ mesh: lArmG, isArm: true });
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
    const chest = new THREE.Mesh(new THREE.DodecahedronGeometry(8), stoneMat);
    torso.add(chest);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(3.5), runeGlow);
    core.position.z = 5;
    torso.add(core);
    const head = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), stoneMat);
    head.position.y = 9;
    torso.add(head);
    const eyeBar = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.6), runeGlow);
    eyeBar.position.set(0, 9.5, 3.2);
    torso.add(eyeBar);
    const pL = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2), mossMat);
    pL.position.set(-9.5, 6, 0);
    torso.add(pL);
    const pR = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2), mossMat);
    pR.position.set(9.5, 6, 0);
    torso.add(pR);
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
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(4, 9, 18, 8), robeMat);
    robe.position.y = -4;
    torso.add(robe);
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
    const headG = new THREE.Group();
    headG.position.y = 8;
    torso.add(headG);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5, 4.5), boneMat);
    headG.add(skull);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.6, 4.5, 6), goldMat);
    crown.position.y = 4.2;
    headG.add(crown);
    const eyeGeo = new THREE.SphereGeometry(0.7, 4, 4);
    const eyeL = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeL.position.set(-1.2, 0.5, 2.4);
    headG.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, purpleGlow);
    eyeR.position.set(1.2, 0.5, 2.4);
    headG.add(eyeR);
    const rArmG = new THREE.Group();
    rArmG.position.set(6, 2, 0);
    torso.add(rArmG);
    const scytheShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 30, 6), materials.darkSteel);
    scytheShaft.position.set(0, -2, 4);
    scytheShaft.rotation.x = Math.PI / 4;
    rArmG.add(scytheShaft);
    const scytheBlade = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 0.5), materials.darkSteel);
    scytheBlade.position.set(-6, 10, 11);
    scytheBlade.rotation.z = 0.4;
    rArmG.add(scytheBlade);
    const deathGem = new THREE.Mesh(new THREE.OctahedronGeometry(2), purpleGlow);
    deathGem.position.set(0, 10, 11);
    rArmG.add(deathGem);
    anim.limbs.push({ mesh: rArmG, isArm: true });
  }
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
      mesh.rotation.y += dt * 3;
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
    const base = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 11), woodMat);
    base.position.y = 4.5;
    root.add(base);
    const band1 = new THREE.Mesh(new THREE.BoxGeometry(16.5, 9.2, 1.5), ironMat);
    band1.position.set(0, 4.5, -4);
    root.add(band1);
    const band2 = new THREE.Mesh(new THREE.BoxGeometry(16.5, 9.2, 1.5), ironMat);
    band2.position.set(0, 4.5, 4);
    root.add(band2);
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 9, -5.5);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.6, 16.2, 12, 1, false, 0, Math.PI), woodMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 0, 5.5);
    lidGroup.add(lid);
    root.add(lidGroup);
    const lock = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 1.2), goldMat);
    lock.position.set(0, 7.5, 5.8);
    root.add(lock);
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
    if (type === "crate") {
      const box = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 14), woodMat);
      box.position.y = 7;
      root.add(box);
      const lidFrame = new THREE.Mesh(new THREE.BoxGeometry(14.6, 1.5, 14.6), ironMat);
      lidFrame.position.y = 13.6;
      root.add(lidFrame);
      const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(14.6, 1.5, 14.6), ironMat);
      baseFrame.position.y = 0.8;
      root.add(baseFrame);
      const postGeo = new THREE.BoxGeometry(1.8, 14.2, 1.8);
      const corners = [[-6.8, -6.8], [6.8, -6.8], [-6.8, 6.8], [6.8, 6.8]];
      corners.forEach(([cx, cz]) => {
        const post = new THREE.Mesh(postGeo, ironMat);
        post.position.set(cx, 7, cz);
        root.add(post);
      });
      const strapGeo = new THREE.BoxGeometry(1.2, 16.5, 0.4);
      const strap1 = new THREE.Mesh(strapGeo, ironMat);
      strap1.position.set(0, 7, 7.2);
      strap1.rotation.z = 0.785;
      root.add(strap1);
      const strap2 = new THREE.Mesh(strapGeo, ironMat);
      strap2.position.set(0, 7, 7.2);
      strap2.rotation.z = -0.785;
      root.add(strap2);
      const lock = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.6, 6), goldMat);
      lock.rotation.x = Math.PI / 2;
      lock.position.set(0, 7, 7.4);
      root.add(lock);
    } else if (type === "sarcophagus") {
      const base = new THREE.Mesh(new THREE.BoxGeometry(15, 6, 28), stoneMat);
      base.position.y = 3;
      root.add(base);
      const casket = new THREE.Mesh(new THREE.BoxGeometry(13.5, 6, 26.5), materials.stoneGrey);
      casket.position.y = 7;
      root.add(casket);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(14.5, 2.5, 27.5), stoneMat);
      lid.position.y = 11;
      root.add(lid);
      const crossShaft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 16), goldMat);
      crossShaft.position.set(0, 12.4, 0);
      root.add(crossShaft);
      const crossBar = new THREE.Mesh(new THREE.BoxGeometry(8, 0.8, 2.4), goldMat);
      crossBar.position.set(0, 12.4, -3);
      root.add(crossBar);
      const helmRelief = new THREE.Mesh(new THREE.BoxGeometry(5, 2.2, 5), goldMat);
      helmRelief.position.set(0, 12.8, -9);
      root.add(helmRelief);
    } else {
      const botCylinder = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 6.2, 5, 12), woodMat);
      botCylinder.position.y = 2.5;
      root.add(botCylinder);
      const midCylinder = new THREE.Mesh(new THREE.CylinderGeometry(8, 7.2, 6, 12), woodMat);
      midCylinder.position.y = 8;
      root.add(midCylinder);
      const topCylinder = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 8, 5, 12), woodMat);
      topCylinder.position.y = 13.5;
      root.add(topCylinder);
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
    const basePillar = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 5, 8), stoneMat);
    basePillar.position.y = 2.5;
    root.add(basePillar);
    const midPillar = new THREE.Mesh(new THREE.CylinderGeometry(10, 13, 8, 8), stoneMat);
    midPillar.position.y = 9;
    root.add(midPillar);
    const topPillar = new THREE.Mesh(new THREE.CylinderGeometry(13, 9, 3, 8), stoneMat);
    topPillar.position.y = 14.5;
    root.add(topPillar);
    const chalice = new THREE.Mesh(new THREE.CylinderGeometry(8, 4, 6, 8, 1, true), goldMat);
    chalice.position.y = 19;
    root.add(chalice);
    const liquid = new THREE.Mesh(new THREE.CircleGeometry(7.2, 12), bloodMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 21;
    root.add(liquid);
    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(4.5, 0), bloodMat);
    orb.position.y = 30;
    root.add(orb);
    const groundRuneGeo = new THREE.RingGeometry(18, 38, 24);
    groundRuneGeo.rotateX(-Math.PI / 2);
    const groundRune = new THREE.Mesh(groundRuneGeo, new THREE.MeshBasicMaterial({ color: 10027008, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    groundRune.position.y = 0.4;
    root.add(groundRune);
    root.updateVisuals = function(dt) {
      orb.rotation.y += dt * 2.2;
      orb.rotation.z += dt * 1.1;
      const bob = Math.sin(Date.now() * 5e-3) * 2.5;
      orb.position.y = 30 + bob;
      groundRune.rotation.y += dt * 0.5;
      const pulse = 1 + Math.sin(Date.now() * 7e-3) * 0.08;
      groundRune.scale.set(pulse, pulse, 1);
    };
    return root;
  }
  function createCrossbowBoltMesh(isEvolved) {
    const root = new THREE.Group();
    const shaftMat = isEvolved ? materials.darkSteel : materials.wood;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 22, 6), shaftMat);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);
    const tipMat = isEvolved ? materials.glowingRed : materials.steel;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(2.6, 7.5, 6), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 12.5;
    root.add(tip);
    const fletchMat = isEvolved ? materials.royalRed : materials.crimsonCloth;
    const fletch1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 5.5), fletchMat);
    fletch1.position.z = -9;
    root.add(fletch1);
    const fletch2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.5, 5.5), fletchMat);
    fletch2.position.z = -9;
    root.add(fletch2);
    const tracerGeo = new THREE.ConeGeometry(2.6, 32, 6);
    tracerGeo.rotateX(-Math.PI / 2);
    tracerGeo.translate(0, 0, -22);
    const tracerMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16729344 : 58879,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const tracer = new THREE.Mesh(tracerGeo, tracerMat);
    root.add(tracer);
    root.updateVisuals = function(dt, p) {
      if (tracer) {
        tracer.scale.z = 1 + Math.sin(Date.now() * 0.025) * 0.22;
      }
    };
    return root;
  }
  function createThrownAxeMesh(isEvolved) {
    const root = new THREE.Group();
    const handleMat = isEvolved ? materials.blackObsidian : materials.wood;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 22, 6), handleMat);
    root.add(handle);
    const bladeMat = isEvolved ? materials.royalRed : materials.steel;
    const bladeGeo = new THREE.BoxGeometry(12, 10, 1.4);
    const bladeL = new THREE.Mesh(bladeGeo, bladeMat);
    bladeL.position.set(-6.5, 5, 0);
    root.add(bladeL);
    const bladeR = new THREE.Mesh(bladeGeo, bladeMat);
    bladeR.position.set(6.5, 5, 0);
    root.add(bladeR);
    const edgeMat = isEvolved ? materials.glowingRed : materials.steel;
    const edgeL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11, 0.6), edgeMat);
    edgeL.position.set(-12.8, 5, 0);
    root.add(edgeL);
    const edgeR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11, 0.6), edgeMat);
    edgeR.position.set(12.8, 5, 0);
    root.add(edgeR);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 5, 6), materials.gold);
    collar.position.set(0, 5, 0);
    root.add(collar);
    const trailGeo = new THREE.RingGeometry(9, 15, 20);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16726072 : 12436865,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const trailMesh = new THREE.Mesh(trailGeo, trailMat);
    trailMesh.position.y = 5;
    root.add(trailMesh);
    root.updateVisuals = function(dt, p) {
      if (trailMesh) {
        trailMesh.rotation.z += dt * 24;
        const s = 1 + Math.sin(Date.now() * 0.02) * 0.15;
        trailMesh.scale.set(s, s, 1);
      }
    };
    return root;
  }
  function createHolyFireFlaskMesh(isEvolved) {
    const root = new THREE.Group();
    const glassMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 16753922,
      transparent: true,
      opacity: 0.8
    });
    const vial = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 12), glassMat);
    vial.position.y = 4;
    root.add(vial);
    const coreMat = isEvolved ? materials.glowingCyan : materials.flameGlow;
    const core = new THREE.Mesh(new THREE.SphereGeometry(4.5, 10, 10), coreMat);
    core.position.y = 4;
    root.add(core);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 4.8, 8), glassMat);
    neck.position.y = 8.5;
    root.add(neck);
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 2.2, 6), materials.wood);
    cork.position.y = 11;
    root.add(cork);
    const haloMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 53971 : 16729943,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(7.6, 8, 8), haloMat);
    halo.position.y = 4;
    root.add(halo);
    root.updateVisuals = function(dt, p) {
      if (halo) {
        halo.rotation.x += dt * 4;
        halo.rotation.y += dt * 5;
        const s = 1 + Math.sin(Date.now() * 0.02) * 0.15;
        halo.scale.set(s, s, s);
      }
    };
    return root;
  }
  function createHolyFirePoolMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 40;
    const ringGeo = new THREE.RingGeometry(r * 0.25, r, 28);
    ringGeo.rotateX(-Math.PI / 2);
    const ringColor = isEvolved ? 53971 : 16733440;
    const ringMat = new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.5;
    root.add(ring);
    const coreGeo = new THREE.CircleGeometry(r * 0.5, 20);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: isEvolved ? 5546239 : 16763904, transparent: true, opacity: 0.85 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.6;
    root.add(core);
    const flameMat = isEvolved ? materials.glowingCyan : materials.flameGlow;
    const flames = [];
    const flameCount = 4;
    for (let i = 0; i < flameCount; i++) {
      const fAngle = i / flameCount * Math.PI * 2;
      const fDist = r * 0.35;
      const fMesh = new THREE.Mesh(new THREE.ConeGeometry(3.5, 12, 5), flameMat);
      fMesh.position.set(Math.cos(fAngle) * fDist, 6, Math.sin(fAngle) * fDist);
      root.add(fMesh);
      flames.push({ mesh: fMesh, phase: i * 1.5 });
    }
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
    const discGeo = new THREE.CircleGeometry(r, 48);
    discGeo.rotateX(-Math.PI / 2);
    const discColor = isEvolved ? 16766720 : 4891615;
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
    const outerGeo = new THREE.RingGeometry(r * 0.965, r, 64);
    outerGeo.rotateX(-Math.PI / 2);
    const outerColor = isEvolved ? 16771705 : 7390719;
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
    const innerGeo = new THREE.RingGeometry(r * 0.48, r * 0.52, 40);
    innerGeo.rotateX(-Math.PI / 2);
    const innerColor = isEvolved ? 16766720 : 10543359;
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
    const pulseGeo = new THREE.RingGeometry(r * 0.92, r, 54);
    pulseGeo.rotateX(-Math.PI / 2);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16777215 : 14743546,
      transparent: true,
      opacity: 0,
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
      outer.rotation.y += dt * 0.35;
      inner.rotation.y -= dt * 0.65;
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
      const ringGeo = new THREE.RingGeometry(8, 42, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 16771720,
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
        color: 16766720,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }));
      edge.position.y = 8.2;
      root.add(edge);
    } else {
      const arcHalf = Math.PI * 0.32;
      const thetaStart = -Math.PI / 2 - arcHalf;
      const thetaLength = arcHalf * 2;
      const arcGeo = new THREE.RingGeometry(6, 36, 28, 1, thetaStart, thetaLength);
      arcGeo.rotateX(-Math.PI / 2);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 16775912,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.position.y = 8;
      root.add(arc);
      const edgeGeo = new THREE.RingGeometry(33, 38, 28, 1, thetaStart, thetaLength);
      edgeGeo.rotateX(-Math.PI / 2);
      const edge = new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({
        color: 15777882,
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
    const arcHalf = Math.PI * 0.25;
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;
    const waveGeo = new THREE.RingGeometry(6, 26, 24, 1, thetaStart, thetaLength);
    waveGeo.rotateX(-Math.PI / 2);
    const waveMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16766720 : 58879,
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
      color: 16777215,
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
        const prog = 1 - p.life / p.maxLife;
        const s = 0.85 + prog * 0.6;
        root.scale.set(s, s, s);
      }
    };
    return root;
  }
  function createSpearThrustMesh(isEvolved) {
    const root = new THREE.Group();
    const shaftMat = isEvolved ? materials.royalRed : materials.wood;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 44, 6), shaftMat);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 2), materials.gold);
    guard.position.z = 18;
    root.add(guard);
    const spearheadMat = isEvolved ? materials.paladinGold : materials.gold;
    const spearhead = new THREE.Mesh(new THREE.ConeGeometry(2.8, 14, 4), spearheadMat);
    spearhead.rotation.x = Math.PI / 2;
    spearhead.position.z = 28;
    root.add(spearhead);
    return root;
  }
  function createEnemyProjectileMesh(type, unblockable) {
    const root = new THREE.Group();
    if (type === "stone_shard") {
      const rockGeo = new THREE.DodecahedronGeometry(5.2, 0);
      const rockMat = new THREE.MeshLambertMaterial({
        color: 4672338,
        roughness: 0.85
      });
      root.add(new THREE.Mesh(rockGeo, rockMat));
      const magmaGeo = new THREE.DodecahedronGeometry(5.4, 0);
      const magmaMat = new THREE.MeshBasicMaterial({
        color: unblockable ? 16726072 : 16742719,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(magmaGeo, magmaMat));
      for (let i = 0; i < 3; i++) {
        const miniGeo = new THREE.TetrahedronGeometry(1.6, 0);
        const miniMat = new THREE.MeshLambertMaterial({ color: 3093826 });
        const mini = new THREE.Mesh(miniGeo, miniMat);
        const a = i / 3 * Math.PI * 2;
        mini.position.set(Math.cos(a) * 7.5, Math.sin(a) * 2.5, Math.sin(a) * 7.5);
        root.add(mini);
      }
    } else if (type === "death_orb") {
      const coreGeo = new THREE.SphereGeometry(4.8, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 1245220,
        transparent: true,
        opacity: 0.95
      });
      root.add(new THREE.Mesh(coreGeo, coreMat));
      const haloGeo = new THREE.SphereGeometry(6.4, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: unblockable ? 16711765 : 12463837,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(haloGeo, haloMat));
      const runeGeo = new THREE.RingGeometry(7.2, 9.4, 18);
      runeGeo.rotateX(-Math.PI * 0.35);
      const runeMat = new THREE.MeshBasicMaterial({
        color: 14702333,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const runeMesh = new THREE.Mesh(runeGeo, runeMat);
      root.runeRing = runeMesh;
      root.add(runeMesh);
    } else if (type === "blood_cleave") {
      const bladeGeo = new THREE.RingGeometry(4, 14, 20, 1, -Math.PI * 0.35, Math.PI * 0.7);
      bladeGeo.rotateX(-Math.PI / 2);
      const bladeMat = new THREE.MeshBasicMaterial({
        color: 8388608,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      root.add(new THREE.Mesh(bladeGeo, bladeMat));
      const edgeGeo = new THREE.RingGeometry(12, 15.5, 20, 1, -Math.PI * 0.35, Math.PI * 0.7);
      edgeGeo.rotateX(-Math.PI / 2);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: 16711748,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(edgeGeo, edgeMat));
    } else if (type === "poison") {
      const coreGeo = new THREE.SphereGeometry(4.2, 14, 14);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 3069299,
        transparent: true,
        opacity: 0.9
      });
      root.add(new THREE.Mesh(coreGeo, coreMat));
      const shellGeo = new THREE.DodecahedronGeometry(5.8, 1);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 8121759,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      root.add(new THREE.Mesh(shellGeo, shellMat));
    } else {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 12), materials.glowingViolet);
      root.add(sphere);
      const aura = new THREE.Mesh(new THREE.SphereGeometry(5.4, 12, 12), new THREE.MeshBasicMaterial({
        color: 10181046,
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
    const orbGroup = new THREE.Group();
    orbGroup.position.y = 8;
    root.add(orbGroup);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 13797631,
      transparent: true,
      opacity: 0.95
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(4.8, 14, 14), coreMat);
    orbGroup.add(core);
    const shellMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 58879 : 12289788,
      transparent: true,
      opacity: 0.42,
      wireframe: true
    });
    const shell = new THREE.Mesh(new THREE.DodecahedronGeometry(6.6, 1), shellMat);
    orbGroup.add(shell);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 7381503 : 12463837,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.4, 6, 24), ringMat);
    orbGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.35, 6, 24), ringMat);
    ring2.rotation.x = Math.PI / 2;
    orbGroup.add(ring2);
    const wispCount = isEvolved ? 4 : 3;
    const wisps = [];
    const wispMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16777215 : 16742861,
      transparent: true,
      opacity: 0.9
    });
    const wispGeo = new THREE.SphereGeometry(1.6, 8, 8);
    for (let w = 0; w < wispCount; w++) {
      const wMesh = new THREE.Mesh(wispGeo, wispMat);
      orbGroup.add(wMesh);
      wisps.push(wMesh);
    }
    const trailCount = 3;
    const trails = [];
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 53971 : 8934608,
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
    root.updateVisuals = function(dt, projectile) {
      animTime += dt;
      orbGroup.position.y = 8 + Math.sin(animTime * 7.5) * 2.2;
      const pulse = 1 + Math.sin(animTime * 9) * 0.18;
      core.scale.set(pulse, pulse, pulse);
      shell.rotation.y -= dt * 3.2;
      shell.rotation.x += dt * 2.1;
      ring1.rotation.x += dt * 4.5;
      ring1.rotation.y += dt * 3;
      ring2.rotation.z += dt * 4;
      ring2.rotation.y -= dt * 2.5;
      for (let i = 0; i < wisps.length; i++) {
        const offset = i / wisps.length * Math.PI * 2;
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
      const moveAngle = projectile && projectile.angle !== void 0 ? projectile.angle : 0;
      const cosA = Math.cos(moveAngle);
      const sinA = Math.sin(moveAngle);
      for (let t = 0; t < trails.length; t++) {
        const distBack = (t + 1) * 7.5;
        const wobble = Math.sin(animTime * 14 - t * 0.8) * 2;
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
    const glassMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 3069299,
      transparent: true,
      opacity: 0.78
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(6.8, 14, 14), glassMat);
    globe.position.y = 5;
    root.add(globe);
    const fluidMat = isEvolved ? materials.glowingCyan : materials.glowingGreen;
    const fluid = new THREE.Mesh(new THREE.SphereGeometry(5.2, 12, 12), fluidMat);
    fluid.position.y = 4.6;
    root.add(fluid);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.4, 5.2, 8), glassMat);
    neck.position.y = 9.8;
    root.add(neck);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.2, 8), materials.gold);
    collar.position.y = 8.5;
    root.add(collar);
    const cork = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 2.5, 6), materials.wood);
    cork.position.y = 12.5;
    root.add(cork);
    const haloMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 53971 : 1092740,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(8.5, 8, 8), haloMat);
    halo.position.y = 5;
    root.add(halo);
    root.updateVisuals = function(dt, p) {
      if (halo) {
        halo.rotation.x += dt * 4;
        halo.rotation.y += dt * 6;
        const s = 1 + Math.sin(Date.now() * 0.02) * 0.15;
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
    const poolColor = isEvolved ? 47252 : 2600544;
    const poolMat = new THREE.MeshBasicMaterial({ color: poolColor, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.y = 0.35;
    root.add(pool);
    const borderGeo = new THREE.RingGeometry(r - 3, r + 1, 28);
    borderGeo.rotateX(-Math.PI / 2);
    const borderMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 3069299,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = 0.38;
    root.add(border);
    const bubbles = [];
    const bubbleMat = isEvolved ? materials.glowingCyan : materials.glowingGreen;
    for (let i = 0; i < 6; i++) {
      const angle = i / 6 * Math.PI * 2 + i * 0.4;
      const dist = r * (0.28 + i % 3 * 0.22);
      const bMesh = new THREE.Mesh(new THREE.SphereGeometry(3.2, 8, 8), bubbleMat);
      bMesh.position.set(Math.cos(angle) * dist, 0.8, Math.sin(angle) * dist);
      bMesh._baseY = 0.8;
      bMesh._phase = i * 1.15;
      root.add(bMesh);
      bubbles.push(bMesh);
    }
    root.updateVisuals = function(dt) {
      const now = Date.now() / 220;
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        const cycle = Math.sin(now + b._phase);
        const scale = 0.5 + Math.max(0, cycle) * 0.9;
        b.scale.set(scale, scale, scale);
        b.position.y = b._baseY + Math.max(0, cycle) * 3;
      }
      border.rotation.y += dt * 0.6;
    };
    return root;
  }
  function createDarkSlashMesh(isEvolved) {
    const root = new THREE.Group();
    const arcRadius = 48;
    const arcHalf = isEvolved ? Math.PI : Math.PI * 0.38;
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;
    const coreGeo = new THREE.RingGeometry(isEvolved ? 12 : 8, arcRadius * 0.86, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 2228741 : 787992,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    root.add(new THREE.Mesh(coreGeo, coreMat));
    const edgeGeo = new THREE.RingGeometry(arcRadius * 0.76, arcRadius, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    edgeGeo.rotateX(-Math.PI / 2);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16711748 : 10181046,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(edgeGeo, edgeMat));
    const rimGeo = new THREE.RingGeometry(arcRadius * 0.94, arcRadius * 1.04, isEvolved ? 36 : 28, 1, thetaStart, thetaLength);
    rimGeo.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16777215 : 14659839,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(rimGeo, rimMat));
    const spikeGeo = new THREE.ConeGeometry(1.8, 8, 4);
    spikeGeo.rotateX(Math.PI / 2);
    const spikeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16717636 : 7101671,
      transparent: true,
      opacity: 0.9
    });
    const spikeAngles = isEvolved ? [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75] : [-arcHalf * 0.55, 0, arcHalf * 0.55];
    for (let k = 0; k < spikeAngles.length; k++) {
      const a = spikeAngles[k];
      const sm = new THREE.Mesh(spikeGeo, spikeMat);
      sm.position.set(Math.sin(a) * (arcRadius * 0.94), 0.2, Math.cos(a) * (arcRadius * 0.94));
      sm.rotation.y = a;
      root.add(sm);
    }
    return root;
  }
  function createAbyssalFissureMesh(isEvolved) {
    const root = new THREE.Group();
    const riftGeo = new THREE.PlaneGeometry(16, 28);
    riftGeo.rotateX(-Math.PI / 2);
    const riftMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 2228224 : 919324,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    root.add(new THREE.Mesh(riftGeo, riftMat));
    const energyGeo = new THREE.PlaneGeometry(6, 24);
    energyGeo.rotateX(-Math.PI / 2);
    const energyMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16717636 : 10181046,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const energyMesh = new THREE.Mesh(energyGeo, energyMat);
    energyMesh.position.y = 0.2;
    root.add(energyMesh);
    const spikeGeo = new THREE.ConeGeometry(1.6, 6.5, 4);
    const spikeMat = new THREE.MeshLambertMaterial({
      color: isEvolved ? 3997696 : 1708328,
      emissive: isEvolved ? 11141154 : 4854924,
      emissiveIntensity: 0.5
    });
    const positions = [
      { x: -3.5, z: -7, h: 5, rotZ: -0.2 },
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
      color: isEvolved ? 16742005 : 7649791,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    root.add(bladeMesh);
    return root;
  }
  function createFlailMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = isEvolved ? materials.gold : materials.darkSteel;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(5.2, 8, 8), mat);
    root.add(ball);
    const spikeGeo = new THREE.ConeGeometry(1.2, 4.5, 4);
    spikeGeo.translate(0, 5, 0);
    for (let i = 0; i < 6; i++) {
      const sp = new THREE.Mesh(spikeGeo, isEvolved ? materials.glowingCyan : materials.steel);
      sp.rotation.z = i / 6 * Math.PI * 2;
      root.add(sp);
    }
    return root;
  }
  function createPelletMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = isEvolved ? materials.glowingRed : materials.flameGlow;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(4.6, 8, 8), mat);
    root.add(sphere);
    const trailGeo = new THREE.ConeGeometry(2.4, 14, 5);
    trailGeo.rotateX(-Math.PI / 2);
    trailGeo.translate(0, 0, -8);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16729943 : 16753922,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(trailGeo, trailMat));
    return root;
  }
  function createFloorCollectibleModel(type = "gold") {
    const root = new THREE.Group();
    const discGeo = new THREE.RingGeometry(2, 9, 16);
    discGeo.rotateX(-Math.PI / 2);
    if (type === "meat") {
      const meatMat = new THREE.MeshStandardMaterial({ color: 9254942, roughness: 0.65 });
      const boneMat = materials.bone;
      const roast = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 9, 8), meatMat);
      roast.rotation.z = Math.PI / 3;
      root.add(roast);
      const bone = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14, 6), boneMat);
      bone.rotation.z = Math.PI / 3;
      root.add(bone);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 16740419, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
      disc.position.y = -4;
      root.add(disc);
    } else if (type === "magnet") {
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
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 4367861, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -5;
      root.add(disc);
    } else if (type === "rosary") {
      const crossMat = materials.gold;
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 10, 2), crossMat);
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(7, 2.2, 2), crossMat);
      hBar.position.y = 1.8;
      const halo = new THREE.Mesh(new THREE.RingGeometry(3.5, 4.8, 16), materials.holyGlow);
      halo.position.y = 1.8;
      root.add(vBar, hBar, halo);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 16771584, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === "hourglass") {
      const frameMat = materials.gold;
      const glassMat = new THREE.MeshBasicMaterial({ color: 58879, transparent: true, opacity: 0.75 });
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
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 58879, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === "shield") {
      const shieldMat = materials.darkSteel;
      const goldTrim = materials.gold;
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(7.5, 9.5, 1.8), shieldMat);
      const border = new THREE.Mesh(new THREE.BoxGeometry(8.2, 10.2, 1.2), goldTrim);
      border.position.z = -0.4;
      const boss = new THREE.Mesh(new THREE.OctahedronGeometry(2.4, 0), goldTrim);
      boss.position.z = 1.2;
      root.add(sMesh, border, boss);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 9489145, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
      disc.position.y = -5.5;
      root.add(disc);
    } else if (type === "ether") {
      const etherMat = new THREE.MeshBasicMaterial({
        color: 12289788,
        transparent: true,
        opacity: 0.95
      });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), etherMat);
      crystal.position.y = 1.5;
      const coreMat = new THREE.MeshBasicMaterial({ color: 16777215 });
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.8, 0), coreMat);
      crystal.add(core);
      const wispMat = new THREE.MeshBasicMaterial({ color: 14702333, transparent: true, opacity: 0.85 });
      const wisp = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6), wispMat);
      wisp.position.set(3.8, 0, 0);
      crystal.add(wisp);
      root.add(crystal);
      const etherDisc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({
        color: 10181046,
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
      tie.position.y = 3;
      root.add(pouch, tie);
      const disc = new THREE.Mesh(discGeo, new THREE.MeshBasicMaterial({ color: 16766720, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      disc.position.y = -4;
      root.add(disc);
    }
    return root;
  }
  function createWhipLashMesh(isEvolved) {
    const root = new THREE.Group();
    const arcHalf = Math.PI * 0.1;
    const thetaStart = -Math.PI / 2 - arcHalf;
    const thetaLength = arcHalf * 2;
    const lashGeo = new THREE.RingGeometry(4, 38, 24, 1, thetaStart, thetaLength);
    lashGeo.rotateX(-Math.PI / 2);
    const lashMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16711765 : 12597547,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    root.add(new THREE.Mesh(lashGeo, lashMat));
    const edgeGeo = new THREE.RingGeometry(34, 40, 24, 1, thetaStart, thetaLength);
    edgeGeo.rotateX(-Math.PI / 2);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16777215 : 16742005,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    root.add(new THREE.Mesh(edgeGeo, edgeMat));
    const spineGeo = new THREE.BoxGeometry(1.4, 0.4, 38);
    spineGeo.translate(0, 0, 19);
    const spineMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16777215 : 16500017,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(spineGeo, spineMat));
    return root;
  }
  function createCelestialGlaiveMesh(isEvolved) {
    const root = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 5221630,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    for (let i = 0; i < 3; i++) {
      const bladeGeo = new THREE.RingGeometry(4, 22, 12, 1, -0.45, 0.9);
      bladeGeo.rotateX(-Math.PI / 2);
      const blade = new THREE.Mesh(bladeGeo, mat);
      blade.rotation.y = i / 3 * Math.PI * 2;
      root.add(blade);
    }
    return root;
  }
  function createThunderStrikeMesh(isEvolved) {
    const root = new THREE.Group();
    const boltMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 16773632 : 53971,
      transparent: true,
      opacity: 0.92
    });
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.6, 75, 5), boltMat);
    bolt.position.y = 37.5;
    root.add(bolt);
    const ringGeo = new THREE.RingGeometry(2, 38, 20);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, boltMat);
    ring.position.y = 0.5;
    root.add(ring);
    return root;
  }
  function createViperDartMesh(isEvolved) {
    const root = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 22, 5), materials.wood);
    shaft.rotation.x = Math.PI / 2;
    root.add(shaft);
    const tipMat = isEvolved ? materials.glowingGreen : materials.diseasedSkin;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(2.4, 7.5, 5), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 13;
    root.add(tip);
    const trailGeo = new THREE.ConeGeometry(2, 24, 5);
    trailGeo.rotateX(-Math.PI / 2);
    trailGeo.translate(0, 0, -16);
    const trailMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 62206 : 3069299,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(trailGeo, trailMat));
    return root;
  }
  function createVoidVortexMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 65;
    const sealGeo = new THREE.RingGeometry(3, r, 24);
    sealGeo.rotateX(-Math.PI / 2);
    const sealMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 10181046 : 9323693,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.y = 0.4;
    root.add(seal);
    const coreMat = new THREE.MeshBasicMaterial({ color: 1114146 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), coreMat);
    core.position.y = 3;
    root.add(core);
    return root;
  }
  function createFrostLanceMesh(isEvolved) {
    const root = new THREE.Group();
    const iceMat = new THREE.MeshStandardMaterial({
      color: isEvolved ? 10545125 : 7649791,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const lance = new THREE.Mesh(new THREE.ConeGeometry(5.2, 38, 6), iceMat);
    lance.rotation.x = Math.PI / 2;
    root.add(lance);
    const tipGlowMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 14678523 : 8514796,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const tipGlow = new THREE.Mesh(new THREE.ConeGeometry(3, 16, 6), tipGlowMat);
    tipGlow.rotation.x = Math.PI / 2;
    tipGlow.position.z = 12;
    root.add(tipGlow);
    return root;
  }
  function createRetributionShieldMesh(isEvolved) {
    const root = new THREE.Group();
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(7.5, 11, 1.2), isEvolved ? materials.paladinGold : materials.gold);
    root.add(shieldPlate);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(8.2, 11.6, 0.8), materials.steel);
    root.add(rim);
    const cross = new THREE.Mesh(new THREE.BoxGeometry(2, 7, 1.5), materials.holyGlow);
    root.add(cross);
    return root;
  }
  function createHellfireCauldronMesh(radius, isEvolved) {
    const root = new THREE.Group();
    const r = radius || 36;
    const fireGeo = new THREE.RingGeometry(2, r, 20);
    fireGeo.rotateX(-Math.PI / 2);
    const fireMat = new THREE.MeshBasicMaterial({
      color: isEvolved ? 623843 : 14774357,
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
  function createSupremeSlashMesh() {
    const root = new THREE.Group();
    const bladeGeo = new THREE.RingGeometry(8, 55, 24, 1, -Math.PI * 0.42, Math.PI * 0.84);
    bladeGeo.rotateX(-Math.PI / 2);
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 16765738,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(bladeGeo, bladeMat));
    const rimGeo = new THREE.RingGeometry(50, 58, 24, 1, -Math.PI * 0.42, Math.PI * 0.84);
    rimGeo.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 780417,
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
      color: 3714473,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.Mesh(ringGeo, ringMat));
    const coreGeo = new THREE.RingGeometry(1, r * 0.6, 18);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 16169275,
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
        const t = performance.now() * 8e-3;
        if (speed > 0.1) {
          for (let l of this.limbs) {
            if (l.isArm) l.mesh.rotation.x = Math.sin(t) * 0.45;
            if (l.isLeg) l.mesh.rotation.x = Math.cos(t) * 0.55;
          }
        }
      }
    };
    buildSkeletonModel(root, anim);
    const auraGeo = new THREE.RingGeometry(6, 9, 16);
    auraGeo.rotateX(-Math.PI / 2);
    const auraMat = new THREE.MeshBasicMaterial({ color: 10181046, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.position.y = 0.5;
    root.add(aura);
    root.anim = anim;
    return root;
  }
  function createSanctuaryZoneMesh(radius = 90) {
    const root = new THREE.Group();
    const r = radius || 90;
    const outerGeo = new THREE.RingGeometry(r * 0.9, r, 36);
    outerGeo.rotateX(-Math.PI / 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 16766720,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerGeo, outerMat);
    outerRing.position.y = 0.4;
    root.add(outerRing);
    const discGeo = new THREE.CircleGeometry(r * 0.88, 32);
    discGeo.rotateX(-Math.PI / 2);
    const discMat = new THREE.MeshBasicMaterial({
      color: 15844367,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.35;
    root.add(disc);
    const innerGeo = new THREE.RingGeometry(r * 0.4, r * 0.5, 24);
    innerGeo.rotateX(-Math.PI / 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 16771705,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    innerRing.position.y = 0.5;
    root.add(innerRing);
    const progGeo = new THREE.RingGeometry(0.1, r * 0.88, 32);
    progGeo.rotateX(-Math.PI / 2);
    const progMat = new THREE.MeshBasicMaterial({
      color: 16775781,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const progRing = new THREE.Mesh(progGeo, progMat);
    progRing.position.y = 0.45;
    progRing.scale.set(0.01, 1, 0.01);
    root.add(progRing);
    const beamGeo = new THREE.CylinderGeometry(r * 0.7, r * 0.85, 420, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 16766720,
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
      const pulse = Math.sin(Date.now() * 4e-3) * 0.12;
      outerMat.opacity = playerInside ? 0.9 + pulse : 0.65 + pulse;
      beamMat.opacity = playerInside ? 0.42 + pulse : 0.22 + pulse;
      discMat.opacity = playerInside ? 0.35 : 0.18;
      const progScale = Math.max(0.01, Math.min(1, consecrateProgress));
      progRing.scale.set(progScale, 1, progScale);
      progRing.visible = consecrateProgress > 0.01;
    };
    return root;
  }
  function createCelestialStrikeTelegraphMesh(radius = 68) {
    const root = new THREE.Group();
    const r = radius || 68;
    const ringGeo = new THREE.RingGeometry(r * 0.9, r, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 16726072,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.45;
    root.add(ring);
    const countGeo = new THREE.CircleGeometry(r * 0.88, 32);
    countGeo.rotateX(-Math.PI / 2);
    const countMat = new THREE.MeshBasicMaterial({
      color: 16742719,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const countCircle = new THREE.Mesh(countGeo, countMat);
    countCircle.position.y = 0.4;
    root.add(countCircle);
    root.updateVisuals = function(progress01) {
      const p = Math.max(0, Math.min(1, progress01));
      const flash = Math.sin(Date.now() * (0.01 + p * 0.02)) > 0 ? 0.95 : 0.6;
      ringMat.opacity = flash;
      countCircle.scale.set(p, 1, p);
    };
    return root;
  }
  function createCelestialStrikeImpactMesh(radius = 68) {
    const root = new THREE.Group();
    const r = radius || 68;
    const blastGeo = new THREE.CircleGeometry(r, 24);
    blastGeo.rotateX(-Math.PI / 2);
    const blastMat = new THREE.MeshBasicMaterial({
      color: 16775781,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const blastDisc = new THREE.Mesh(blastGeo, blastMat);
    blastDisc.position.y = 0.5;
    root.add(blastDisc);
    const pillarGeo = new THREE.CylinderGeometry(r * 0.75, r * 1.1, 460, 24, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 16765738,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 230;
    root.add(pillar);
    const coreGeo = new THREE.CylinderGeometry(r * 0.35, r * 0.45, 480, 16, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 16777215,
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
      pillarMat.opacity = alpha * 0.9;
      coreMat.opacity = alpha * 0.95;
      pillar.rotation.y += dt * 3;
      core.rotation.y -= dt * 4;
      const s = 1 + (1 - alpha) * 0.35;
      pillar.scale.set(s, 1, s);
    };
    return root;
  }
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
    materials
  };
})();

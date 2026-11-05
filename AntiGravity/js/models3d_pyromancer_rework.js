/**
 * The Fallen Kingdom - Rework da Piromante (Maga do Fogo Arcana)
 * Modelo 3D Esculpido com Proporções Heroicas, Manto Medieval e Cajado das Cinzas
 * Armazenado para integração futura.
 */

(function() {
  'use strict';

  function createFlashable(baseMat) {
    return baseMat;
  }

  // =========================================================================
  // PIROMANTE DAS CHAMAS ETERNAS (Pyromancer - Ignis Flame Sorceress Rework)
  // =========================================================================
  function buildPyromancerReworkModel(group, anim) {
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

    // =========================================================================
    // 1. TORSO, CORSELETE DE COURO & ESTOLA CLERICAL RÚNICA
    // =========================================================================
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
    flaskOffsets.forEach(([fx, fy, fz], idx) => {
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

    // =========================================================================
    // 2. MANTO LONGO & SAIA DRAPEADA EM CAMADAS COM FORRO ÂMBAR
    // =========================================================================
    const robeBaseGroup = new THREE.Group();
    robeBaseGroup.position.set(0, -4.2, 0);
    torsoGroup.add(robeBaseGroup);

    // Saia Cone de 8 Faces (Manto Carmesim)
    const robeGeo = new THREE.CylinderGeometry(3.6, 6.6, 15.5, 8, 1, true);
    robeGeo.translate(0, -7.5, 0);
    const robeMesh = new THREE.Mesh(robeGeo, crimsonSilkMat);
    robeBaseGroup.add(robeMesh);

    // Forro Interno Âmbar Visível na Fenda da Saia
    const innerLiningGeo = new THREE.CylinderGeometry(3.5, 6.4, 15.3, 8, 1, true);
    innerLiningGeo.translate(0, -7.5, 0);
    const innerLiningMesh = new THREE.Mesh(innerLiningGeo, moltenAmberMat);
    innerLiningMesh.scale.set(0.98, 1, 0.98);
    robeBaseGroup.add(innerLiningMesh);

    // Sobretúnica de Cinzas Fatiada em 4 Abas Góticas de Combate
    [-1.8, 1.8].forEach((x, i) => {
      // Aba Frontal
      const flapF = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9.5, 0.4), charcoalClothMat);
      flapF.position.set(x, -5.5, 2.4);
      flapF.rotation.x = 0.12;
      flapF.rotation.y = (i === 0 ? 0.10 : -0.10);
      robeBaseGroup.add(flapF);

      // Aba Traseira
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

    // =========================================================================
    // 3. CAPUZ PONTIEAGUDO GÓTICO, ROSTO SOMBREADO & OLHOS DE BRASA
    // =========================================================================
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

    // Capuz Pontiagudo de Feiticeira (Mage Hood - Corte Gótico em Bico Curvo)
    const hoodBaseGeo = new THREE.CylinderGeometry(3.2, 3.8, 5.4, 8);
    const hoodBase = new THREE.Mesh(hoodBaseGeo, charcoalClothMat);
    hoodBase.position.set(0, 0.6, -0.4);
    headGroup.add(hoodBase);

    // Ponta Superior Curvada do Capuz para Trás
    const hoodTipGeo = new THREE.ConeGeometry(3.0, 8.5, 6);
    hoodTipGeo.rotateX(-0.55);
    hoodTipGeo.translate(0, 4.2, -2.5);
    const hoodTip = new THREE.Mesh(hoodTipGeo, charcoalClothMat);
    headGroup.add(hoodTip);

    // Aba Frontal do Capuz Sombreado sobre os Olhos
    const hoodBrimGeo = new THREE.CylinderGeometry(3.4, 3.6, 1.4, 8);
    hoodBrimGeo.rotateX(0.28);
    const hoodBrim = new THREE.Mesh(hoodBrimGeo, crimsonSilkMat);
    hoodBrim.position.set(0, 2.2, 1.4);
    headGroup.add(hoodBrim);

    // Olhos de Brasa Incandescente (Glowing Fire Eyes)
    const eyeGeo = new THREE.OctahedronGeometry(0.42, 0);
    const eyeL = new THREE.Mesh(eyeGeo, emberGlowMat);
    eyeL.position.set(-1.0, 0.3, 2.1);
    const eyeR = new THREE.Mesh(eyeGeo, emberGlowMat);
    eyeR.position.set(1.0, 0.3, 2.1);
    headGroup.add(eyeL, eyeR);

    // =========================================================================
    // 4. CAPA DAS CINZAS COM DOBRAS GEOMÉTRICAS & BROCHES DE LABAREDA
    // =========================================================================
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 4.2, -2.8);
    const capeGeo = new THREE.PlaneGeometry(9.5, 18.5, 3, 4);
    capeGeo.translate(0, -8.5, 0);
    const capeMesh = new THREE.Mesh(capeGeo, crimsonSilkMat);
    capeMesh.rotation.x = 0.15;
    capeGroup.add(capeMesh);

    // Forro Interno Âmbar da Capa
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

    // =========================================================================
    // 5. BRAÇO ESQUERDO & LABAREDA DE FOGO VIVO FLUTUANTE NA PALMA
    // =========================================================================
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-4.8, 3.0, 0);
    torsoGroup.add(leftArmGroup);
    anim.leftArm = leftArmGroup;

    // Manga Bufante de Seda Escarlate
    const lSleeveGeo = new THREE.CylinderGeometry(1.8, 2.4, 4.2, 6);
    lSleeveGeo.translate(0, -2.1, 0);
    leftArmGroup.add(new THREE.Mesh(lSleeveGeo, crimsonSilkMat));

    // Antebraço e Bracelete Protetor de Bronze
    const lForearmGeo = new THREE.CylinderGeometry(1.4, 1.2, 4.4, 6);
    lForearmGeo.translate(0, -5.2, 0);
    leftArmGroup.add(new THREE.Mesh(lForearmGeo, darkBronzeMat));

    // Mão Aberta Feminina com Palma Erguida
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

    // =========================================================================
    // 6. BRAÇO DIREITO & CAJADO DAS CINZAS COM NÚCLEO SOLAR (ASHWOOD STAFF)
    // =========================================================================
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(4.8, 3.0, 0);
    torsoGroup.add(rightArmGroup);
    anim.rightArm = rightArmGroup;

    // Manga Bufante Direita
    const rSleeveGeo = new THREE.CylinderGeometry(1.8, 2.4, 4.2, 6);
    rSleeveGeo.translate(0, -2.1, 0);
    rightArmGroup.add(new THREE.Mesh(rSleeveGeo, crimsonSilkMat));

    // Antebraço Direito e Bracelete de Bronze
    const rForearmGeo = new THREE.CylinderGeometry(1.4, 1.2, 4.4, 6);
    rForearmGeo.translate(0, -5.2, 0);
    rightArmGroup.add(new THREE.Mesh(rForearmGeo, darkBronzeMat));

    // Mão Segurando o Cajado
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.6), skinPaleMat);
    rHand.position.set(0, -7.8, 0.4);
    rightArmGroup.add(rHand);

    // CAJADO ÍGNEO DAS CINZAS (Ashwood Flame Staff)
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0, -7.8, 0.6);
    staffGroup.rotation.x = Math.PI / 12;
    rightArmGroup.add(staffGroup);
    anim.weapon = staffGroup;

    // Haste de Madeira Petrificada Escura
    const staffShaftGeo = new THREE.CylinderGeometry(0.55, 0.70, 28, 7);
    const staffShaft = new THREE.Mesh(staffShaftGeo, ashwoodMat);
    staffShaft.position.y = 2.0;
    staffGroup.add(staffShaft);

    // Anéis de Bronze e Ouro Reforçando o Cabo
    [-8, -2, 5, 11].forEach(sy => {
      const staffRing = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.6, 6), darkBronzeMat);
      staffRing.position.y = sy;
      staffGroup.add(staffRing);
    });

    // Ponteira Inferior de Bronze (Pára-Golpes no Chão)
    const staffBaseTip = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.2, 6), darkBronzeMat);
    staffBaseTip.position.y = -12.5;
    staffBaseTip.rotation.x = Math.PI;
    staffGroup.add(staffBaseTip);

    // GAIOLA / PINÁCULO GÓTICO EM FORMA DE GARRAS DE DRAGÃO NO TOPO DO CAJADO
    const headSocket = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 2.5, 6), darkBronzeMat);
    headSocket.position.y = 15.5;
    staffGroup.add(headSocket);

    // 4 Garras Retorcidas Segurando a Esfera de Magma
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

    // CORAÇÃO DE MAGMA INCANDESCENTE (Pulsing Flame Orb)
    const orbCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 1), flameCoreMat);
    orbCore.position.y = 18.2;
    staffGroup.add(orbCore);
    anim.staffFlame = orbCore;

    // Auréola Solar Exterior
    const orbHalo = new THREE.Mesh(new THREE.DodecahedronGeometry(2.1, 0), fireAuraMat);
    orbHalo.position.y = 18.2;
    staffGroup.add(orbHalo);
    anim.staffHalo = orbHalo;

    // Brasas orbitando o topo do cajado
    for (let i = 0; i < 5; i++) {
      const ember = new THREE.Mesh(new THREE.TetrahedronGeometry(0.35, 0), emberGlowMat);
      const angle = (i * Math.PI * 2) / 5;
      ember.position.set(Math.cos(angle) * 2.6, 18.2 + Math.sin(angle) * 0.6, Math.sin(angle) * 2.6);
      ember._emberAngle = angle;
      ember._emberRadius = 2.6;
      staffGroup.add(ember);
      anim.fireParticles.push(ember);
    }

    // =========================================================================
    // 7. PERNAS & BOTAS DE VELUDO E COURO TRATADO
    // =========================================================================
    [-2.0, 2.0].forEach((x, idx) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(x, 8.5, 0);

      // Coxa coberta pelo manto
      const thighGeo = new THREE.CylinderGeometry(1.6, 1.4, 5.0, 6);
      thighGeo.translate(0, -2.5, 0);
      legGroup.add(new THREE.Mesh(thighGeo, charcoalClothMat));

      // Bota Medieval de Couro Negro e Fivelas de Bronze
      const bootGeo = new THREE.CylinderGeometry(1.5, 1.2, 5.5, 6);
      bootGeo.translate(0, -7.5, 0);
      legGroup.add(new THREE.Mesh(bootGeo, scorchedLeatherMat));

      const shoeGeo = new THREE.BoxGeometry(2.0, 1.5, 3.8);
      shoeGeo.translate(0, -9.8, 0.8);
      legGroup.add(new THREE.Mesh(shoeGeo, scorchedLeatherMat));

      group.add(legGroup);
      if (idx === 0) anim.leftLeg = legGroup;
      else anim.rightLeg = legGroup;
    });
  }


  // Exporta no namespace para acesso sob demanda ou testes
  if (!window.MedievalSurvivors) window.MedievalSurvivors = {};
  if (!window.MedievalSurvivors.modelsRework) window.MedievalSurvivors.modelsRework = {};
  window.MedievalSurvivors.modelsRework.buildPyromancerReworkModel = buildPyromancerReworkModel;
})();

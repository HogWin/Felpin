/**
 * Medieval Survivors - Audio Synthesizer Engine
 * Pure Web Audio API - Zero external dependencies, runs anywhere.
 * Adaptive Multi-Layer Procedural Soundtrack & Dynamic SFX Engine.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.gemCombo = 0;
    this.lastGemTime = 0;
    this.bgmTimer = null;
    this.bgmStep = 0;

    // Adaptive Layered Music State
    this.musicIntensity = 0.0;
    this.isBossMusic = false;
    this.musicMasterGain = null;
    this.masterGainNode = null;
    this.sfxMasterGain = null;
    this.layerGains = {
      drone: null,
      arp: null,
      drums: null,
      climax: null
    };

    // Master Volume level (0.0 to 1.0, default 0.8)
    try {
      const storedVol = localStorage.getItem('medieval_master_volume');
      this.masterVolume = storedVol !== null ? parseInt(storedVol, 10) / 100 : 0.8;
    } catch (e) {
      this.masterVolume = 0.8;
    }

    // Lobby / Main Menu Music State
    this.lobbyPlaying = false;
    this.lobbyTimer = null;
    this.lobbyStep = 0;
    this.lobbyMasterGain = null;
    try {
      this.lobbyMuted = localStorage.getItem('medieval_lobby_music_muted') === 'true';
    } catch (e) {
      this.lobbyMuted = false;
    }
  }

  get sfxDestination() {
    return this.sfxMasterGain || (this.masterGainNode || (this.ctx ? this.ctx.destination : null));
  }

  setMasterVolume(val) {
    const norm = typeof val === 'number' ? Math.max(0, Math.min(1, val > 1 ? val / 100 : val)) : 0.8;
    this.masterVolume = norm;
    try {
      localStorage.setItem('medieval_master_volume', Math.round(norm * 100).toString());
    } catch (e) {}

    if (this.masterGainNode && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGainNode.gain.cancelScheduledValues(t);
      this.masterGainNode.gain.setValueAtTime(this.muted ? 0.0 : this.masterVolume, t);
    }
  }

  getMasterVolume() {
    return this.masterVolume !== undefined ? this.masterVolume : 0.8;
  }

  initMasterNodes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (!this.masterGainNode) {
      this.masterGainNode = this.ctx.createGain();
      const vol = this.muted ? 0.0 : this.masterVolume;
      this.masterGainNode.gain.setValueAtTime(vol, t);
      this.masterGainNode.connect(this.ctx.destination);
    }
    if (!this.sfxMasterGain) {
      this.sfxMasterGain = this.ctx.createGain();
      this.sfxMasterGain.gain.setValueAtTime(1.0, t);
      this.sfxMasterGain.connect(this.masterGainNode);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initCachedNoiseBuffers();
        this.initMasterNodes();
        this.initMusicBuses();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pre-generate static noise buffers once to eliminate GC pauses & buffer allocations during combat
  initCachedNoiseBuffers() {
    if (!this.ctx) return;
    const sr = this.ctx.sampleRate;

    // 1. Sword slash noise buffer (0.15s)
    const slashLen = Math.floor(sr * 0.15);
    this._slashNoiseBuffer = this.ctx.createBuffer(1, slashLen, sr);
    const slashData = this._slashNoiseBuffer.getChannelData(0);
    for (let i = 0; i < slashLen; i++) {
      slashData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (slashLen * 0.3));
    }

    // 2. Axe swoosh noise buffer (0.22s)
    const axeLen = Math.floor(sr * 0.22);
    this._axeNoiseBuffer = this.ctx.createBuffer(1, axeLen, sr);
    const axeData = this._axeNoiseBuffer.getChannelData(0);
    for (let i = 0; i < axeLen; i++) {
      const env = Math.sin((i / axeLen) * Math.PI);
      axeData[i] = (Math.random() * 2 - 1) * env * 0.7;
    }

    // 3. Explosion / crackle noise buffer (0.30s)
    const expLen = Math.floor(sr * 0.30);
    this._crackleNoiseBuffer = this.ctx.createBuffer(1, expLen, sr);
    const expData = this._crackleNoiseBuffer.getChannelData(0);
    for (let i = 0; i < expLen; i++) {
      expData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (expLen * 0.4));
    }

    // 4. Plague acid noise buffer (0.35s)
    const plagueLen = Math.floor(sr * 0.35);
    this._plagueNoiseBuffer = this.ctx.createBuffer(1, plagueLen, sr);
    const plagueData = this._plagueNoiseBuffer.getChannelData(0);
    for (let i = 0; i < plagueLen; i++) {
      plagueData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (plagueLen * 0.55));
    }
  }

  initMusicBuses() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    this.initMasterNodes();

    // Master music bus (Combat)
    this.musicMasterGain = this.ctx.createGain();
    this.musicMasterGain.gain.setValueAtTime(0.55, t);
    this.musicMasterGain.connect(this.masterGainNode);

    // Master lobby music bus (Peaceful Tavern / Grand Castle Hub)
    this.lobbyMasterGain = this.ctx.createGain();
    this.lobbyMasterGain.gain.setValueAtTime(this.lobbyMuted ? 0.0 : 0.48, t);
    this.lobbyMasterGain.connect(this.masterGainNode);

    // 4 Dynamic Adaptive Music Layers
    this.layerGains.drone = this.ctx.createGain();
    this.layerGains.drone.gain.setValueAtTime(0.75, t);
    this.layerGains.drone.connect(this.musicMasterGain);

    this.layerGains.arp = this.ctx.createGain();
    this.layerGains.arp.gain.setValueAtTime(0.0, t);
    this.layerGains.arp.connect(this.musicMasterGain);

    this.layerGains.drums = this.ctx.createGain();
    this.layerGains.drums.gain.setValueAtTime(0.0, t);
    this.layerGains.drums.connect(this.musicMasterGain);

    this.layerGains.climax = this.ctx.createGain();
    this.layerGains.climax.gain.setValueAtTime(0.0, t);
    this.layerGains.climax.connect(this.musicMasterGain);
  }

  // Subtle pitch variance to prevent audio fatigue and make hits feel organic
  getPitchVariation(freq, maxPct = 0.04) {
    return freq * (1 + (Math.random() * 2 - 1) * maxPct);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGainNode && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGainNode.gain.cancelScheduledValues(t);
      this.masterGainNode.gain.setValueAtTime(this.muted ? 0.0 : this.masterVolume, t);
    }
    if (this.muted) {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmPlaying = false;
      }
      if (this.lobbyTimer) {
        clearInterval(this.lobbyTimer);
        this.lobbyPlaying = false;
      }
    } else {
      const isPlaying = window.MedievalSurvivors && window.MedievalSurvivors.game && window.MedievalSurvivors.game.state === 'PLAYING';
      if (isPlaying) {
        if (!this.bgmPlaying) this.startBgm();
      } else {
        if (!this.lobbyPlaying && !this.lobbyMuted) this.startLobbyMusic();
      }
    }
    return this.muted;
  }

  // Dynamically fades adaptive music layers according to run progression and frenzy
  setMusicIntensity(intensity, isBossAlive = false) {
    this.musicIntensity = Math.max(0, Math.min(1, intensity));
    this.isBossMusic = Boolean(isBossAlive);
    if (!this.ctx || !this.layerGains.drone || this.muted) return;

    const t = this.ctx.currentTime;
    const rampTime = 0.45; // Smooth 450ms crossfade to prevent pops

    // Layer 0: Medieval Drone / Gothic Strings Pad (Continuous atmospheric backdrop)
    const droneVol = 0.72 + this.musicIntensity * 0.16;
    this.layerGains.drone.gain.cancelScheduledValues(t);
    this.layerGains.drone.gain.linearRampToValueAtTime(droneVol, t + rampTime);

    // Layer 1: Medieval Dorian Arpeggio / Lute (Fades in when intensity > 0.22)
    let arpVol = 0.0;
    if (this.musicIntensity > 0.22) {
      arpVol = Math.min(0.85, (this.musicIntensity - 0.22) / 0.35 * 0.85);
    }
    this.layerGains.arp.gain.cancelScheduledValues(t);
    this.layerGains.arp.gain.linearRampToValueAtTime(arpVol, t + rampTime);

    // Layer 2: War Drums & Percussion (Fades in when intensity > 0.45)
    let drumsVol = 0.0;
    if (this.musicIntensity > 0.45) {
      drumsVol = Math.min(0.95, (this.musicIntensity - 0.45) / 0.35 * 0.95);
    }
    this.layerGains.drums.gain.cancelScheduledValues(t);
    this.layerGains.drums.gain.linearRampToValueAtTime(drumsVol, t + rampTime);

    // Layer 3: Boss War Climax & Brass Staccato (Triggers during Bosses or Frenzy > 0.85)
    let climaxVol = 0.0;
    if (this.isBossMusic) {
      climaxVol = 0.95;
    } else if (this.musicIntensity >= 0.82) {
      climaxVol = ((this.musicIntensity - 0.82) / 0.18) * 0.80;
    }
    this.layerGains.climax.gain.cancelScheduledValues(t);
    this.layerGains.climax.gain.linearRampToValueAtTime(climaxVol, t + rampTime);
  }

  // --- Sound Effects ---

  // Sword slash sweep
  playSwordSlash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._slashNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(this.getPitchVariation(800), t);
    filter.frequency.exponentialRampToValueAtTime(this.getPitchVariation(2500), t + 0.08);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.15);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // Heavy visceral slam & whoosh of the Dark Greatsword
  playDarkGreatswordSlash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub-bass heavy impact thump
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(32, t + 0.22);
    subGain.gain.setValueAtTime(0.48, t);
    subGain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.22);

    // Deep metallic blade whoosh
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._slashNoiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.getPitchVariation(550), t);
    filter.frequency.exponentialRampToValueAtTime(180, t + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.42, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Crossbow bolt shoot
  playCrossbow() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(this.getPitchVariation(650), t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Throwing Axe heavy spinning air-slice
  playAxeThrow() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Air-cutting rotational swoosh (cached noise buffer)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._axeNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(this.getPitchVariation(380), t);
    filter.frequency.exponentialRampToValueAtTime(this.getPitchVariation(1150), t + 0.09);
    filter.frequency.exponentialRampToValueAtTime(280, t + 0.22);
    filter.Q.setValueAtTime(2.2, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 2. Deep metallic blade hum
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(this.getPitchVariation(260), t);
    osc.frequency.exponentialRampToValueAtTime(115, t + 0.19);

    oscGain.gain.setValueAtTime(0.18, t);
    oscGain.gain.exponentialRampToValueAtTime(0.005, t + 0.19);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  // Guardian Spear metallic thrust & shockwave
  playSpearThrust() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.getPitchVariation(720), t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.14);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Reroll dice sound
  playReroll() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [440, 554.37, 659.25];
    freqs.forEach((f, idx) => {
      const t = this.ctx.currentTime + idx * 0.045;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.getPitchVariation(f, 0.02), t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  // Holy Fire / Molotov burst
  playFireBurst() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Sub rumble
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.getPitchVariation(120), t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);

    oscGain.gain.setValueAtTime(0.4, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);

    // Crackle noise (cached buffer)
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._crackleNoiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Frasco da Peste: Estilhaço de vidro cáustico e borbulhar de ácido
  playPlagueSplash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Estilhaço de vidro
    const glassOsc = this.ctx.createOscillator();
    const glassGain = this.ctx.createGain();
    glassOsc.type = 'triangle';
    glassOsc.frequency.setValueAtTime(this.getPitchVariation(1450), t);
    glassOsc.frequency.exponentialRampToValueAtTime(320, t + 0.12);
    glassGain.gain.setValueAtTime(0.26, t);
    glassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    glassOsc.connect(glassGain);
    glassGain.connect(this.ctx.destination);
    glassOsc.start(t);
    glassOsc.stop(t + 0.12);

    // 2. Ruído de ácido borbulhante e corrosão ácida
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._plagueNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.exponentialRampToValueAtTime(190, t + 0.32);
    filter.Q.setValueAtTime(3.8, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.32, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, t + 0.32);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 3. Borbulhar grave (gurgle alquímico)
    const bubbleOsc = this.ctx.createOscillator();
    const bubbleGain = this.ctx.createGain();
    bubbleOsc.type = 'sine';
    bubbleOsc.frequency.setValueAtTime(this.getPitchVariation(260), t);
    bubbleOsc.frequency.exponentialRampToValueAtTime(95, t + 0.22);
    bubbleGain.gain.setValueAtTime(0.18, t);
    bubbleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    bubbleOsc.connect(bubbleGain);
    bubbleGain.connect(this.ctx.destination);
    bubbleOsc.start(t);
    bubbleOsc.stop(t + 0.22);
  }

  // Aura pulse
  playAuraPulse() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(550, t + 0.15);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Wood hit / Destructible smash
  playWoodHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(this.getPitchVariation(190), t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.11);

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  // XP Gem Pickup - scales pitch with combo
  playGemPickup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = Date.now();
    if (now - this.lastGemTime < 500) {
      this.gemCombo = Math.min(this.gemCombo + 1, 15);
    } else {
      this.gemCombo = 0;
    }
    this.lastGemTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pentatonic scale base pitches
    const baseFreq = 523.25; // C5
    const semitones = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
    const pitchFactor = Math.pow(2, (semitones[this.gemCombo % semitones.length] || 0) / 12);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * pitchFactor, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * pitchFactor * 1.25, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Level Up Medieval Fanfare
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 293.66, d: 0.15, offset: 0 },    // D4
      { f: 369.99, d: 0.15, offset: 0.15 }, // F#4
      { f: 440.00, d: 0.18, offset: 0.30 }, // A4
      { f: 587.33, d: 0.45, offset: 0.48 }  // D5
    ];

    notes.forEach(n => {
      const t = this.ctx.currentTime + n.offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxDestination);

      osc.start(t);
      osc.stop(t + n.d);
    });
  }

  // Chest Open Jingle
  playChestOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const arpeggio = [329.63, 440, 554.37, 659.25, 880];
    arpeggio.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxDestination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Player hurt (armor clash)
  playPlayerHurt() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(this.getPitchVariation(140), t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxDestination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Enemy hit / hurt (throttled to 25 hits/sec to prevent audio node buffer exhaustion)
  playEnemyHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (now - (this._lastEnemyHitTime || 0) < 40) return;
    this._lastEnemyHitTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(this.getPitchVariation(220), t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxDestination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Boss Alert - Epic War Horn
  playBossHorn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(110, t); // A2
    osc1.frequency.linearRampToValueAtTime(130.81, t + 0.6); // C3
    osc1.frequency.exponentialRampToValueAtTime(110, t + 1.8);

    osc2.frequency.setValueAtTime(164.81, t); // E3
    osc2.frequency.linearRampToValueAtTime(196, t + 0.6); // G3
    osc2.frequency.exponentialRampToValueAtTime(164.81, t + 1.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.linearRampToValueAtTime(900, t + 0.6);
    filter.frequency.exponentialRampToValueAtTime(300, t + 1.8);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxDestination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.8);
    osc2.stop(t + 1.8);
  }

  // Victory Royal Hymn
  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      [220, 277.18, 329.63, 440],       // A major
      [246.94, 293.66, 369.99, 493.88], // B minor
      [277.18, 329.63, 415.30, 554.37], // C# minor
      [293.66, 369.99, 440.00, 587.33]  // D major triumph
    ];

    chords.forEach((chord, cIdx) => {
      const t = this.ctx.currentTime + cIdx * 0.45;
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain);
        gain.connect(this.sfxDestination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    });
  }

  // Achievement Unlock Fanfare
  playAchievementUnlock() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 293.66, t: 0.00, d: 0.16 }, // D4
      { f: 369.99, t: 0.09, d: 0.16 }, // F#4
      { f: 440.00, t: 0.18, d: 0.18 }, // A4
      { f: 554.37, t: 0.27, d: 0.20 }, // C#5
      { f: 587.33, t: 0.36, d: 0.45 }, // D5
      { f: 880.00, t: 0.45, d: 0.65 }  // A5 royal shimmer
    ];

    notes.forEach(n => {
      const t = this.ctx.currentTime + n.t;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxDestination);

      osc.start(t);
      osc.stop(t + n.d);
    });

    // Sub sparkle
    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    const chimeTime = this.ctx.currentTime + 0.45;
    chime.type = 'sine';
    chime.frequency.setValueAtTime(1174.66, chimeTime); // D6
    chimeGain.gain.setValueAtTime(0.20, chimeTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.8);
    chime.connect(chimeGain);
    chimeGain.connect(this.sfxDestination);
    chime.start(chimeTime);
    chime.stop(chimeTime + 0.8);
  }

  // Dynamic Event SFX: Flash Swarm Warning Horn
  playSwarmWarning() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(146.83, t); // D3
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.9);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.linearRampToValueAtTime(950, t + 0.3);
    filter.frequency.linearRampToValueAtTime(250, t + 0.9);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxDestination);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  // Dynamic Event SFX: Sacred Sanctuary Zone Presence Hum
  playSanctuaryActive() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(587.33, t + 0.18);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxDestination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Dynamic Event SFX: Sacred Sanctuary Consecration Triumph Shockwave
  playSanctuaryComplete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub detonation
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.75);
    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    subOsc.connect(subGain);
    subGain.connect(this.sfxDestination);
    subOsc.start(t);
    subOsc.stop(t + 0.75);

    // Holy Chimes
    const holyNotes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    holyNotes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + idx * 0.08);
      gain.gain.setValueAtTime(0.24, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.65);
      osc.connect(gain);
      gain.connect(this.sfxDestination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.65);
    });
  }

  // Dynamic Event SFX: Celestial Meteor Telegraph Hiss
  playMeteorTelegraph() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.35);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxDestination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Dynamic Event SFX: Celestial Meteor Ground Impact & Shockwave
  playMeteorImpact() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub Boom
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(140, t);
    boom.frequency.exponentialRampToValueAtTime(25, t + 0.45);
    boomGain.gain.setValueAtTime(0.5, t);
    boomGain.gain.exponentialRampToValueAtTime(0.005, t + 0.45);
    boom.connect(boomGain);
    boomGain.connect(this.sfxDestination);
    boom.start(t);
    boom.stop(t + 0.45);

    // Fire explosion crackle
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._crackleNoiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxDestination);
    noise.start(t);
  }

  // ==========================================
  // PROCEDURAL LOBBY MUSIC: Balada de Valoria
  // ==========================================
  stopLobbyMusic() {
    if (this.lobbyTimer) {
      clearInterval(this.lobbyTimer);
      this.lobbyTimer = null;
    }
    this.lobbyPlaying = false;
    if (this.lobbyMasterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.lobbyMasterGain.gain.cancelScheduledValues(t);
      this.lobbyMasterGain.gain.linearRampToValueAtTime(0.001, t + 0.35);
    }
  }

  toggleLobbyMusic() {
    this.lobbyMuted = !this.lobbyMuted;
    try {
      localStorage.setItem('medieval_lobby_music_muted', this.lobbyMuted ? 'true' : 'false');
    } catch (e) {}

    if (this.lobbyMuted) {
      this.stopLobbyMusic();
      if (this.lobbyMasterGain && this.ctx) {
        this.lobbyMasterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      }
    } else {
      if (!this.muted) {
        if (this.lobbyMasterGain && this.ctx) {
          this.lobbyMasterGain.gain.setValueAtTime(0.48, this.ctx.currentTime);
        }
        this.startLobbyMusic();
      }
    }
    return this.lobbyMuted;
  }

  startLobbyMusic() {
    if (this.lobbyPlaying || this.muted || this.lobbyMuted) return;
    this.init();
    if (!this.ctx) return;

    // Garante que o combate BGM esta encerrado
    if (this.bgmPlaying) {
      this.stopBgm();
    }

    if (this.lobbyMasterGain) {
      const t = this.ctx.currentTime;
      this.lobbyMasterGain.gain.cancelScheduledValues(t);
      this.lobbyMasterGain.gain.setValueAtTime(0.001, t);
      this.lobbyMasterGain.gain.linearRampToValueAtTime(0.48, t + 0.8);
    }

    this.lobbyPlaying = true;
    this.lobbyStep = 0;

    // Balada Medieval Acustica: ~80 BPM (compasso suave com intervalo de 375ms por semi-colcheia)
    const stepInterval = 375;

    // Progressao Modal Medieval: Am -> Fmaj7 -> Dm -> Em/E7 (Taberna Real & Santuario)
    const chords = [
      {
        root: 110.00, // A2 (La)
        bell: 880.00, // A5
        lute: [220.00, 261.63, 329.63, 440.00, 523.25, 440.00, 329.63, 261.63] // A3, C4, E4, A4, C5, A4, E4, C4
      },
      {
        root: 87.31,  // F2 (Fa)
        bell: 698.46, // F5
        lute: [174.61, 220.00, 261.63, 329.63, 349.23, 329.63, 261.63, 220.00] // F3, A3, C4, E4, F4, E4, C4, A3
      },
      {
        root: 73.42,  // D2 (Re)
        bell: 587.33, // D5
        lute: [146.83, 174.61, 220.00, 293.66, 349.23, 293.66, 220.00, 174.61] // D3, F3, A3, D4, F4, D4, A3, F3
      },
      {
        root: 82.41,  // E2 (Mi)
        bell: 659.25, // E5
        lute: [164.81, 196.00, 246.94, 329.63, 392.00, 329.63, 246.94, 196.00] // E3, G3, B3, E4, G4, E4, B3, G3
      }
    ];

    this.lobbyTimer = setInterval(() => {
      if (this.muted || !this.lobbyPlaying || !this.ctx) return;

      const t = this.ctx.currentTime;
      const step = this.lobbyStep % 16;
      const barIndex = Math.floor(this.lobbyStep / 16);
      const chord = chords[barIndex % chords.length];

      // 1. Violoncelo / Viol Barroco (Pad acustico suave acionado no inicio de cada compasso)
      if (step === 0) {
        this.playLobbyCelloPad(t, chord.root, 0.32, 5.8);
        this.playLobbyBell(t, chord.bell, 0.14);
      }

      // 2. Harpa Celtica / Alaude Dedilhado (Arpejos sincopados)
      if (step % 2 === 0 || step === 7 || step === 15) {
        const noteIdx = (Math.floor(step / 2) + barIndex) % chord.lute.length;
        const freq = chord.lute[noteIdx];
        const isAccent = (step === 0 || step === 8);
        this.playLobbyLute(t, freq, isAccent ? 0.22 : 0.16, isAccent ? 0.65 : 0.45);
      }

      // 3. Suspiro acustico da taberna / Lareira acolhedora
      if (step === 4 || step === 12) {
        this.playLobbyAmbience(t, 0.04);
      }

      this.lobbyStep++;
    }, stepInterval);
  }

  // Instrumento 1: Alaude Medieval / Harpa dedilhada
  playLobbyLute(t, freq, volume, decay) {
    if (!this.lobbyMasterGain || !this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, t);

    // Brilho acustico de corda de nylon
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(500, t + decay);
    filter.Q.setValueAtTime(2.2, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.lobbyMasterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + decay);
    osc2.stop(t + decay);
  }

  // Instrumento 2: Violoncelo / Viol com arco
  playLobbyCelloPad(t, freq, volume, duration) {
    if (!this.lobbyMasterGain || !this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, t);

    // Detune sutil para calor de cordas de orquestra
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.004, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, t);
    filter.frequency.linearRampToValueAtTime(320, t + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(200, t + duration);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 1.2);
    gain.gain.setValueAtTime(volume * 0.85, t + duration - 1.2);
    gain.gain.linearRampToValueAtTime(0.001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.lobbyMasterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Instrumento 3: Sino de Santuario / Harmonica de Cristal
  playLobbyBell(t, freq, volume) {
    if (!this.lobbyMasterGain || !this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    // Parcial inarmonico de campana medieval
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.lobbyMasterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.8);
    osc2.stop(t + 2.8);
  }

  // Instrumento 4: Calor de Taberna e Lareira
  playLobbyAmbience(t, volume) {
    if (!this.lobbyMasterGain || !this.ctx || !this._crackleNoiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._crackleNoiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.lobbyMasterGain);

    noise.start(t);
  }

  // --- Procedural Adaptive Layered Soundtrack Engine ---
  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.bgmPlaying = false;
    if (this.musicMasterGain && this.ctx) {
      this.musicMasterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    }
  }

  startBgm() {
    // Interrompe suavemente a musica do lobby ao entrar em combate
    if (this.lobbyPlaying) {
      this.stopLobbyMusic();
    }
    if (this.musicMasterGain && this.ctx && !this.muted) {
      this.musicMasterGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    }
    if (this.bgmPlaying || this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    this.bgmStep = 0;
    const isHyper = window.MedievalSurvivors && window.MedievalSurvivors.game && window.MedievalSurvivors.game.hyperMode;
    const beatInterval = isHyper ? 190 : 240; // ~158 BPM em Modo Hiper vs ~125 BPM Normal

    // Scale root progression across 16-step cycles (D minor gothic progression)
    // D2, F2, G2, A2, Bb2, A2, G2, D2
    const roots = [73.42, 87.31, 98.00, 110.00, 116.54, 110.00, 98.00, 73.42];

    // Dorian arpeggio note pools (D3, F3, G3, A3, C4, D4)
    const arpNotes = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66];

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.bgmPlaying || !this.ctx) return;

      const t = this.ctx.currentTime;
      const step = this.bgmStep % 16;
      const barIndex = Math.floor(this.bgmStep / 16);
      const root = roots[barIndex % roots.length];

      // LAYER 0: Drone / Gothic String Pad (Triggers on step 0 of each 16-step cycle)
      if (step === 0) {
        this.playDroneNote(t, root, 0.45, (beatInterval * 16) / 1000);
      }

      // LAYER 1: Medieval Dorian Arpeggio / Lute (Syncopated medieval plucking)
      if (this.musicIntensity > 0.20 && (step % 2 === 0 || step === 7 || step === 15)) {
        const noteIdx = (step + barIndex * 2) % arpNotes.length;
        const noteFreq = arpNotes[noteIdx];
        this.playArpNote(t, noteFreq, 0.22, 0.18);
      }

      // LAYER 2: War Drums & Driving Percussion
      if (this.musicIntensity > 0.40) {
        // Kick on downbeats
        if (step === 0 || step === 8) {
          this.playDrumNote(t, 65, 0.32, 0.22);
        } else if (step === 4 || step === 12) {
          // Snare / War Rim on backbeats
          this.playWarSnare(t, 115, 0.24, 0.16);
        } else if (step === 6 || step === 14) {
          // Tom accents
          this.playDrumNote(t, 85, 0.18, 0.14);
        }

        // Shaker / Chain rattle on every 2nd step
        if (step % 2 === 1) {
          this.playPercShaker(t, 0.08);
        }
      }

      // LAYER 3: Boss War Horn & Brass Staccato (Epic Battle March)
      if (this.isBossMusic || this.musicIntensity >= 0.82) {
        if (step === 0 || step === 3 || step === 6 || step === 8 || step === 11 || step === 14) {
          this.playBrassStaccato(t, root * 2, 0.26, 0.19);
        }
      }

      this.bgmStep++;
    }, beatInterval);
  }

  // Layer 0: Continuous atmospheric pad
  playDroneNote(t, freq, volume, duration) {
    if (!this.layerGains.drone) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, t);

    // Warm fifth overtone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.8);
    gain.gain.linearRampToValueAtTime(0.001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.layerGains.drone);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Layer 1: Plucked Medieval Lute / Harp Arpeggio
  playArpNote(t, freq, volume, decay) {
    if (!this.layerGains.arp) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + decay);
    filter.Q.setValueAtTime(2.2, t);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.layerGains.arp);

    osc.start(t);
    osc.stop(t + decay);
  }

  // Layer 2: Deep War Drum (Kick)
  playDrumNote(t, freq, volume, decay) {
    if (!this.layerGains.drums) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + decay);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.connect(gain);
    gain.connect(this.layerGains.drums);

    osc.start(t);
    osc.stop(t + decay);
  }

  // Layer 2: War Snare / Tom rim
  playWarSnare(t, freq, volume, decay) {
    if (!this.layerGains.drums) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + decay);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.connect(gain);
    gain.connect(this.layerGains.drums);

    osc.start(t);
    osc.stop(t + decay);
  }

  // Layer 2: Ghost shaker / Tambourine noise
  playPercShaker(t, volume) {
    if (!this.layerGains.drums || !this._slashNoiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._slashNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.layerGains.drums);

    noise.start(t);
    noise.stop(t + 0.06);
  }

  // Layer 3: Climax Battle Horn / Brass Staccato
  playBrassStaccato(t, freq, volume, decay) {
    if (!this.layerGains.climax) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, t);

    // Perfect fifth for brass punch
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.05);
    filter.frequency.exponentialRampToValueAtTime(350, t + decay);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.layerGains.climax);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + decay);
    osc2.stop(t + decay);
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.sound = new SoundEngine();

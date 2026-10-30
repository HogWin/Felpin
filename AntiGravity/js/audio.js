/**
 * Medieval Survivors - Audio Synthesizer Engine
 * Pure Web Audio API - Zero external dependencies, runs anywhere.
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
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initCachedNoiseBuffers();
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

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmPlaying = false;
    } else if (!this.muted && !this.bgmPlaying) {
      this.startBgm();
    }
    return this.muted;
  }

  // --- Sound Effects ---

  // Sword slash sweep
  playSwordSlash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Cached noise buffer for swoosh
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._slashNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(2500, t + 0.08);
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

  // Crossbow bolt shoot
  playCrossbow() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, t);
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
    filter.frequency.setValueAtTime(380, t);
    filter.frequency.exponentialRampToValueAtTime(1150, t + 0.09);
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
    osc.frequency.setValueAtTime(260, t);
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
    osc.frequency.setValueAtTime(720, t);
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
      osc.frequency.setValueAtTime(f, t);
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
    osc.frequency.setValueAtTime(120, t);
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

    // 1. Estilhaço de vidro (Impacto vítreo)
    const glassOsc = this.ctx.createOscillator();
    const glassGain = this.ctx.createGain();
    glassOsc.type = 'triangle';
    glassOsc.frequency.setValueAtTime(1450, t);
    glassOsc.frequency.exponentialRampToValueAtTime(320, t + 0.12);
    glassGain.gain.setValueAtTime(0.26, t);
    glassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    glassOsc.connect(glassGain);
    glassGain.connect(this.ctx.destination);
    glassOsc.start(t);
    glassOsc.stop(t + 0.12);

    // 2. Ruído de ácido borbulhante e corrosão ácida (cached buffer)
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
    bubbleOsc.frequency.setValueAtTime(260, t);
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
      gain.connect(this.ctx.destination);

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
      gain.connect(this.ctx.destination);

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
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Enemy hit / hurt
  playEnemyHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

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
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.8);
    osc2.stop(t + 1.8);
  }

  // --- Procedural Ambient Battle Drum & Medieval Drone ---
  startBgm() {
    if (this.bgmPlaying || this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    this.bgmStep = 0;
    const beatInterval = 480; // ~125 BPM

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.bgmPlaying) return;

      const t = this.ctx.currentTime;
      const step = this.bgmStep % 16;

      // Heavy War Drum on steps 0, 4, 8, 12, and ghost notes
      if (step === 0 || step === 8) {
        this.playDrumNote(t, 65, 0.28, 0.25);
      } else if (step === 4 || step === 12) {
        this.playDrumNote(t, 90, 0.22, 0.18);
      } else if (step === 6 || step === 14) {
        this.playDrumNote(t, 55, 0.14, 0.15);
      }

      // Medieval Drone chord shift every 16 steps
      if (step === 0) {
        const chordRoots = [73.42, 65.41, 82.41, 73.42]; // D2, C2, E2, D2
        const root = chordRoots[Math.floor(this.bgmStep / 16) % chordRoots.length];
        this.playDroneNote(t, root, 0.08, beatInterval * 16 / 1000);
      }

      this.bgmStep++;
    }, beatInterval);
  }

  playDrumNote(t, freq, volume, decay) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + decay);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + decay);
  }

  playDroneNote(t, freq, volume, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(volume, t + 1.0);
    gain.gain.linearRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }
}

window.MedievalSurvivors = window.MedievalSurvivors || {};
window.MedievalSurvivors.sound = new SoundEngine();

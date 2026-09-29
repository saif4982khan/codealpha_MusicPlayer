// Web Audio API & Playback Engine for Saif Music Player

export type ToneStyle = 'synthwave' | 'lofi' | 'pop' | 'ambient' | 'acoustic' | 'rnb';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private isAudioElementSource: boolean = false;
  private isSynthesizing: boolean = false;
  private synthInterval: number | null = null;
  private currentStyle: ToneStyle = 'synthwave';
  private currentVolume: number = 0.8;
  private currentSpeed: number = 1.0;
  private stepCounter: number = 0;

  // Frequencies for 5-band EQ
  private eqFrequencies = [60, 230, 910, 3600, 14000];

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.preload = 'auto';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Create Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

      // Create 5-band EQ
      this.eqFilters = this.eqFrequencies.map((freq, index) => {
        const filter = this.ctx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === this.eqFrequencies.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.0;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Chain EQ filters: filter[0] -> filter[1] -> ... -> filter[4]
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }

      // Connect last EQ filter to Analyser, then Analyser to Master Gain, then to Destination
      const lastFilter = this.eqFilters[this.eqFilters.length - 1];
      lastFilter.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as any);
    }
  }

  public getTimeDomainData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array as any);
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  public setPlaybackSpeed(speed: number) {
    this.currentSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }

  public setEQGains(gains: number[]) {
    this.initContext();
    if (this.ctx) {
      gains.forEach((gain, index) => {
        if (this.eqFilters[index]) {
          this.eqFilters[index].gain.setTargetAtTime(gain, this.ctx!.currentTime, 0.05);
        }
      });
    }
  }

  public playUrl(url: string) {
    this.stopSynth();
    this.initContext();
    if (this.audioElement) {
      this.audioElement.src = url;
      this.audioElement.playbackRate = this.currentSpeed;
      this.audioElement.volume = this.currentVolume;
      return this.audioElement.play().catch(() => {
        // Fallback to generative tone if remote audio is blocked by CORS/network
        this.playTone(this.currentStyle);
      });
    }
  }

  public playTone(style: ToneStyle = 'synthwave') {
    this.initContext();
    this.currentStyle = style;
    this.isSynthesizing = true;
    this.startSynthLoop();
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
  }

  public resume() {
    this.initContext();
    if (this.isAudioElementSource && this.audioElement) {
      this.audioElement.play();
    } else {
      this.isSynthesizing = true;
      this.startSynthLoop();
    }
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopSynth();
  }

  public crossfadeTo(nextToneStyle: ToneStyle, durationSec: number = 2) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Fade out
    this.masterGain.gain.linearRampToValueAtTime(0.01, now + durationSec / 2);
    setTimeout(() => {
      this.currentStyle = nextToneStyle;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, this.ctx.currentTime + durationSec / 2);
      }
    }, (durationSec / 2) * 1000);
  }

  private stopSynth() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Real-time musical synthesizer creating rhythmic chords, basslines, and beats
  private startSynthLoop() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
    }

    // Set musical chords based on style
    const chordProgressions: Record<ToneStyle, number[][]> = {
      synthwave: [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      lofi: [
        [261.63, 311.13, 392.00, 466.16], // Cm7
        [233.08, 293.66, 349.23, 415.30], // Bb7
        [207.65, 261.63, 311.13, 369.99], // Abmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      pop: [
        [261.63, 329.63, 392.00],         // C
        [196.00, 246.94, 293.66],         // G
        [220.00, 261.63, 329.63],         // Am
        [174.61, 220.00, 261.63],         // F
      ],
      ambient: [
        [130.81, 196.00, 261.63, 329.63], // C ambient
        [146.83, 220.00, 293.66, 349.23], // Dm ambient
        [110.00, 164.81, 220.00, 261.63], // Am ambient
        [174.61, 261.63, 329.63, 392.00], // F ambient
      ],
      acoustic: [
        [196.00, 246.94, 293.66, 392.00], // G
        [164.81, 220.00, 261.63, 329.63], // Em
        [261.63, 329.63, 392.00, 523.25], // C
        [293.66, 369.99, 440.00, 587.33], // D
      ],
      rnb: [
        [293.66, 349.23, 440.00, 523.25], // Dm9
        [261.63, 329.63, 392.00, 493.88], // Cmaj9
        [246.94, 311.13, 369.99, 440.00], // Bm7b5
        [220.00, 277.18, 329.63, 392.00], // A7#9
      ]
    };

    const intervalMs = Math.round(250 / this.currentSpeed); // 120-140 BPM equivalent 16th/8th notes

    this.synthInterval = window.setInterval(() => {
      if (!this.isSynthesizing || !this.ctx) return;
      const progression = chordProgressions[this.currentStyle] || chordProgressions.synthwave;
      const chordIndex = Math.floor(this.stepCounter / 8) % progression.length;
      const currentChord = progression[chordIndex];
      const stepInMeasure = this.stepCounter % 8;

      this.triggerMusicalStep(currentChord, stepInMeasure, this.currentStyle);
      this.stepCounter++;
    }, intervalMs);
  }

  private triggerMusicalStep(chord: number[], step: number, style: ToneStyle) {
    if (!this.ctx || !this.eqFilters[0]) return;
    const now = this.ctx.currentTime;
    const inputNode = this.eqFilters[0];

    // 1. Kick on steps 0 and 4
    if (step === 0 || step === 4) {
      this.playKick(now, inputNode);
    }

    // 2. Snare / Clap on step 4 or 6
    if (step === 4 || (style === 'rnb' && step === 6)) {
      this.playSnare(now, inputNode);
    }

    // 3. Hi-hat on even steps or syncopated
    if (step % 2 === 0 || (style === 'synthwave' && step % 1 === 0)) {
      this.playHiHat(now, inputNode, step === 2 || step === 6);
    }

    // 4. Bass note on steps 0, 3, 5
    if (step === 0 || step === 3 || step === 6) {
      const rootFreq = chord[0] / 2; // Sub octave
      this.playBass(rootFreq, now, inputNode, style);
    }

    // 5. Arpeggio / Pad chord notes
    if (step % 2 === 0 || style === 'lofi') {
      const noteIndex = step % chord.length;
      const noteFreq = chord[noteIndex];
      this.playLeadNote(noteFreq, now, inputNode, style);
    }
  }

  private playKick(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.35);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  private playSnare(time: number, dest: AudioNode) {
    if (!this.ctx) return;
    // Noise buffer
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + 0.16);
  }

  private playHiHat(time: number, dest: AudioNode, isAccent: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);

    const gain = this.ctx.createGain();
    const vol = isAccent ? 0.08 : 0.04;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playBass(freq: number, time: number, dest: AudioNode, style: ToneStyle) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = style === 'synthwave' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(style === 'synthwave' ? 400 : 250, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.42);
  }

  private playLeadNote(freq: number, time: number, dest: AudioNode, style: ToneStyle) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = style === 'ambient' ? 'sine' : style === 'lofi' ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.72);
  }
}

export const audioEngine = new AudioEngine();

// Sound service for CDD Gacha 2
// Plays authentic audio files with fallback Web Audio synthesized SFX

class SoundService {
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Loaded lazily on first user interaction
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public initBGM(src: string = '/assets/audio/blades_of_the_astral_gate.mp3') {
    if (typeof window === 'undefined') return;
    try {
      if (!this.bgm) {
        this.bgm = new Audio(src);
        this.bgm.loop = true;
        this.bgm.volume = this.isMuted ? 0 : this.volume * 0.4;
      }
    } catch {
      // Audio instantiation restricted
    }
  }

  public playBGM() {
    if (!this.bgm) {
      this.initBGM();
    }
    if (this.bgm && !this.isMuted) {
      this.bgm.play().catch(() => {
        // Autoplay policy may restrict before interaction
      });
    }
  }

  public pauseBGM() {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgm) {
      this.bgm.volume = this.isMuted ? 0 : this.volume * 0.4;
      if (this.isMuted) {
        this.bgm.pause();
      } else {
        this.bgm.play().catch(() => {});
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.bgm) {
      this.bgm.volume = this.isMuted ? 0 : this.volume * 0.4;
    }
  }

  public playSFX(name: string) {
    if (this.isMuted) return;

    // Map named sound effects to available files
    const sfxMap: Record<string, string> = {
      click: '/assets/audio/blip1.wav',
      coin: '/assets/audio/coin1.wav',
      gacha_pull: '/assets/audio/powerup1.wav',
      gacha_reveal: '/assets/audio/powerup7.wav',
      attack: '/assets/audio/laser2.wav',
      skill: '/assets/audio/rayo_necrotico.mp3',
      hurt: '/assets/audio/hurt1.wav',
      victory: '/assets/audio/powerup5.wav',
      defeat: '/assets/audio/hurt3.wav',
      baron: '/assets/audio/baron_intro.wav',
      lockpick: '/assets/audio/blip3.wav',
      upgrade: '/assets/audio/powerup2.wav',
    };

    const path = sfxMap[name] || `/assets/audio/${name}`;
    try {
      const audio = new Audio(path);
      audio.volume = this.volume;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          this.playSynthesizedFallback(name);
        });
      }
    } catch {
      this.playSynthesizedFallback(name);
    }
  }

  private playSynthesizedFallback(type: string) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.15 * this.volume, now);

      if (type === 'coin' || type === 'victory') {
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'attack') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'hurt') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // blip/click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio context disabled
    }
  }
}

export const sound = new SoundService();

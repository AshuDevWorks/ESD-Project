class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const time = this.ctx.currentTime;
    
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time + (index * 0.06));
      
      gain.gain.setValueAtTime(0.0, time + (index * 0.06));
      gain.gain.linearRampToValueAtTime(0.06, time + (index * 0.06) + 0.02);
      gain.gain.linearRampToValueAtTime(0.001, time + (index * 0.06) + 0.15);
      
      osc.start(time + (index * 0.06));
      osc.stop(time + (index * 0.06) + 0.2);
    });
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playScan() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 2.0);
    
    gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.8);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const time = this.ctx.currentTime;
    
    const notes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time + (index * 0.08));
      
      gain.gain.setValueAtTime(0.0, time + (index * 0.08));
      gain.gain.linearRampToValueAtTime(0.07, time + (index * 0.08) + 0.02);
      gain.gain.linearRampToValueAtTime(0.001, time + (index * 0.08) + 0.25);
      
      osc.start(time + (index * 0.08));
      osc.stop(time + (index * 0.08) + 0.35);
    });
  }
}

export const synth = new SoundSynth();

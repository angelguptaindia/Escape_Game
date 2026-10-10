// Web Audio API Audio Synthesizer for Escape Room Game

class SoundController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isAmbientMuted = false;
        this.ambientGain = null;
        this.sfxGain = null;
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.noiseNode = null;
        this.isAmbientPlaying = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            // Master SFX Gain
            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.5;
            this.sfxGain.connect(this.ctx.destination);

            // Ambient Gain
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = 0.25;
            this.ambientGain.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Toggle All Mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.isMuted ? 0 : 0.5;
        }
        if (this.ambientGain) {
            this.ambientGain.gain.value = (this.isMuted || this.isAmbientMuted) ? 0 : 0.25;
        }
        return this.isMuted;
    }

    // Toggle Ambient Only
    toggleAmbient() {
        this.isAmbientMuted = !this.isAmbientMuted;
        if (this.ambientGain) {
            this.ambientGain.gain.value = (this.isMuted || this.isAmbientMuted) ? 0 : 0.25;
        }
        return !this.isAmbientMuted;
    }

    // Start Eerie Ambient Drone (Industrial Hum & Whisper Wind)
    startAmbient() {
        this.init();
        if (this.isAmbientPlaying) return;
        this.isAmbientPlaying = true;

        try {
            // Low Drone Oscillator 1 (Sub-bass)
            this.ambientOsc1 = this.ctx.createOscillator();
            this.ambientOsc1.type = 'sawtooth';
            this.ambientOsc1.frequency.setValueAtTime(45, this.ctx.currentTime); // F1 pitch

            // Low Pass Filter for Drone
            const filter1 = this.ctx.createBiquadFilter();
            filter1.type = 'lowpass';
            filter1.frequency.setValueAtTime(120, this.ctx.currentTime);

            // LFO for filter modulation (breathing horror ambient)
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // Slow 0.15Hz sweep
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(40, this.ctx.currentTime);
            lfo.connect(filter1.frequency);
            lfo.start();

            this.ambientOsc1.connect(filter1);
            filter1.connect(this.ambientGain);
            this.ambientOsc1.start();

            // High Wind / Light Buzzing Noise
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            this.noiseNode = this.ctx.createBufferSource();
            this.noiseNode.buffer = noiseBuffer;
            this.noiseNode.loop = true;

            const bandpass = this.ctx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime(320, this.ctx.currentTime);
            bandpass.Q.setValueAtTime(5.0, this.ctx.currentTime);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

            this.noiseNode.connect(bandpass);
            bandpass.connect(noiseGain);
            noiseGain.connect(this.ambientGain);
            this.noiseNode.start();

        } catch (e) {
            console.warn("Audio Context Ambient Error:", e);
        }
    }

    // Keypad Click Sound
    playKeyClick() {
        this.init();
        if (this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Correct Consonant Sound (Green Reveal)
    playCorrect() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        
        // Two-tone rising chime
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.2, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.25);
        });
    }

    // Wrong Consonant Alarm / Error Buzz
    playWrong() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // Hint Override Zap Sound
    playHint() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // Door Unlock Screech & Heavy Hydraulic Hiss
    playDoorUnlock() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;

        // Sub Bass Boom
        const boomOsc = this.ctx.createOscillator();
        const boomGain = this.ctx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(150, now);
        boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
        boomGain.gain.setValueAtTime(0.7, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        boomOsc.connect(boomGain);
        boomGain.connect(this.sfxGain);
        boomOsc.start(now);
        boomOsc.stop(now + 0.85);

        // Metallic Screech
        const screechOsc = this.ctx.createOscillator();
        const screechGain = this.ctx.createGain();
        screechOsc.type = 'sawtooth';
        screechOsc.frequency.setValueAtTime(440, now + 0.2);
        screechOsc.frequency.exponentialRampToValueAtTime(120, now + 0.9);

        screechGain.gain.setValueAtTime(0.3, now + 0.2);
        screechGain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

        screechOsc.connect(screechGain);
        screechGain.connect(this.sfxGain);
        screechOsc.start(now + 0.2);
        screechOsc.stop(now + 0.95);
    }

    // Fatal Lockdown / Poison Gas Purge Siren & Hiss
    playGameOver() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;

        // Alarm Siren Osc
        const sirenOsc = this.ctx.createOscillator();
        const sirenGain = this.ctx.createGain();
        sirenOsc.type = 'sawtooth';

        // Oscillate pitch up and down (700Hz <-> 400Hz)
        sirenOsc.frequency.setValueAtTime(700, now);
        sirenOsc.frequency.linearRampToValueAtTime(350, now + 0.4);
        sirenOsc.frequency.linearRampToValueAtTime(700, now + 0.8);
        sirenOsc.frequency.linearRampToValueAtTime(350, now + 1.2);

        sirenGain.gain.setValueAtTime(0.4, now);
        sirenGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

        sirenOsc.connect(sirenGain);
        sirenGain.connect(this.sfxGain);

        sirenOsc.start(now);
        sirenOsc.stop(now + 1.5);

        // Poison Gas Hiss (White Noise)
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const gasNode = this.ctx.createBufferSource();
        gasNode.buffer = noiseBuffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);

        const gasGain = this.ctx.createGain();
        gasGain.gain.setValueAtTime(0.4, now);
        gasGain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

        gasNode.connect(filter);
        filter.connect(gasGain);
        gasGain.connect(this.sfxGain);

        gasNode.start(now);
        gasNode.stop(now + 2.0);
    }
}

const audio = new SoundController();

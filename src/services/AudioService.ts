let audioContext: AudioContext | null = null;
const STORAGE_KEY = 'cs2memo:sfxEnabled';
let enabled = true;

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) enabled = saved === '1';
} catch { }

function getContext(): AudioContext {
    if (!audioContext) {
        const anyWindow = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
        const Ctx = (anyWindow.AudioContext ?? anyWindow.webkitAudioContext)!;
        audioContext = new Ctx();
    }
    return audioContext;
}

function playTone(frequency: number, durationMs: number, options?: { type?: OscillatorType; gain?: number; attackMs?: number; releaseMs?: number }) {
    if (!enabled) return;
    const ctx = getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const type = options?.type ?? 'sine';
    const baseGain = options?.gain ?? 0.03;
    const attack = (options?.attackMs ?? 8) / 1000;
    const release = (options?.releaseMs ?? 50) / 1000;

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(baseGain, now + attack);
    gain.gain.setValueAtTime(baseGain, now + durationMs / 1000);
    gain.gain.linearRampToValueAtTime(0, now + durationMs / 1000 + release);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000 + release + 0.02);
}

function sequence(steps: Array<{ delayMs: number; fn: () => void }>) {
    if (!enabled) return;
    let total = 0;
    for (const step of steps) {
        total += step.delayMs;
        setTimeout(step.fn, total);
    }
}

export const AudioService = {
    isEnabled() { return enabled; },
    setEnabled(v: boolean) {
        enabled = v;
        try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch { }
        if (enabled) {
            try { getContext().resume(); } catch { }
        }
    },
    resume() {
        try {
            const ctx = getContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch { }
    },
    playClick() {
        playTone(320, 60, { type: 'triangle', gain: 0.02 });
    },
    playFlip() {
        playTone(420, 70, { type: 'square', gain: 0.02 });
    },
    playMatch() {
        sequence([
            { delayMs: 0, fn: () => playTone(440, 90, { type: 'sine', gain: 0.03 }) },
            { delayMs: 60, fn: () => playTone(660, 110, { type: 'sine', gain: 0.03 }) },
        ]);
    },
    playMismatch() {
        sequence([
            { delayMs: 0, fn: () => playTone(180, 80, { type: 'sawtooth', gain: 0.025 }) },
            { delayMs: 50, fn: () => playTone(140, 120, { type: 'sawtooth', gain: 0.02 }) },
        ]);
    },
    playPause(paused: boolean) {
        if (paused) {
            playTone(220, 90, { type: 'sine', gain: 0.025 });
        } else {
            playTone(420, 90, { type: 'sine', gain: 0.025 });
        }
    },
    playWin() {
        sequence([
            { delayMs: 0, fn: () => playTone(523.25, 120, { type: 'triangle', gain: 0.03 }) }, // C5
            { delayMs: 90, fn: () => playTone(659.25, 130, { type: 'triangle', gain: 0.03 }) }, // E5
            { delayMs: 100, fn: () => playTone(783.99, 200, { type: 'triangle', gain: 0.03 }) }, // G5
        ]);
    },
    playNewGame() {
        sequence([
            { delayMs: 0, fn: () => playTone(300, 60, { type: 'square', gain: 0.02 }) },
            { delayMs: 70, fn: () => playTone(450, 80, { type: 'square', gain: 0.02 }) },
        ]);
    },
};



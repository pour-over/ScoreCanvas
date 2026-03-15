/**
 * Web Audio synth for auditioning music assets.
 * Generates soft, filtered tones that convey the *character* of each asset
 * category without being annoying on laptop speakers.
 */

// ─── Note frequency map ─────────────────────────────────────────────────────

const NOTE_FREQ: Record<string, number> = {
  C: 261.63, "C#": 277.18, Db: 277.18,
  D: 293.66, "D#": 311.13, Eb: 311.13,
  E: 329.63,
  F: 349.23, "F#": 369.99, Gb: 369.99,
  G: 392.0, "G#": 415.3, Ab: 415.3,
  A: 440.0, "A#": 466.16, Bb: 466.16,
  B: 493.88,
};

function parseRoot(key: string): number {
  // Handle keys like "Dm", "F#m", "Bbm", "Am", "A"
  const match = key.match(/^([A-G][#b]?)/);
  if (!match) return 261.63; // default C4
  return NOTE_FREQ[match[1]] ?? 261.63;
}

function minorThird(root: number): number { return root * Math.pow(2, 3 / 12); }
function perfectFifth(root: number): number { return root * Math.pow(2, 7 / 12); }
function octaveDown(f: number): number { return f / 2; }

// ─── Audio context singleton ────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: OscillatorNode[] = [];
let activeTimeouts: number[] = [];
let isPlaying = false;
let currentAssetId: string | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

// ─── Soft filtered oscillator builder ───────────────────────────────────────

function createVoice(
  ac: AudioContext,
  freq: number,
  type: OscillatorType,
  filterFreq: number,
  _gainVal: number,
  dest: AudioNode,
): { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } {
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = 1.0;

  const gain = ac.createGain();
  gain.gain.value = 0;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  return { osc, gain, filter };
}

// ─── Category-specific generators ───────────────────────────────────────────

function playIntro(ac: AudioContext, root: number, _bpm: number) {
  const dest = getMaster();
  const dur = 3.0;
  const now = ac.currentTime;

  // Slow pad swell: root + fifth, triangle wave, very filtered
  const v1 = createVoice(ac, octaveDown(root), "triangle", 600, 0, dest);
  const v2 = createVoice(ac, octaveDown(perfectFifth(root)), "triangle", 500, 0, dest);
  const v3 = createVoice(ac, octaveDown(minorThird(root)), "sine", 400, 0, dest);

  // Swell in
  [v1, v2, v3].forEach((v, i) => {
    v.gain.gain.setValueAtTime(0, now);
    v.gain.gain.linearRampToValueAtTime(0.15 - i * 0.03, now + dur * 0.6);
    v.gain.gain.linearRampToValueAtTime(0, now + dur);
    v.filter.frequency.linearRampToValueAtTime(900 + i * 100, now + dur * 0.5);
    v.filter.frequency.linearRampToValueAtTime(300, now + dur);
    v.osc.start(now);
    v.osc.stop(now + dur);
    activeNodes.push(v.osc);
  });
}

function playLoop(ac: AudioContext, root: number, bpm: number) {
  const dest = getMaster();
  const now = ac.currentTime;
  const beatDur = 60 / bpm;
  const totalBeats = 8;
  const dur = beatDur * totalBeats;

  // Rhythmic arpeggio: root, minor third, fifth — soft triangle pulses
  const notes = [octaveDown(root), octaveDown(minorThird(root)), octaveDown(perfectFifth(root)), octaveDown(root) * 2];

  for (let beat = 0; beat < totalBeats; beat++) {
    const noteFreq = notes[beat % notes.length];
    const startTime = now + beat * beatDur;

    const v = createVoice(ac, noteFreq, "triangle", 700, 0, dest);
    v.gain.gain.setValueAtTime(0, startTime);
    v.gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
    v.gain.gain.exponentialRampToValueAtTime(0.001, startTime + beatDur * 0.8);
    v.filter.frequency.setValueAtTime(900, startTime);
    v.filter.frequency.exponentialRampToValueAtTime(400, startTime + beatDur * 0.6);
    v.osc.start(startTime);
    v.osc.stop(startTime + beatDur * 0.9);
    activeNodes.push(v.osc);
  }

  // Sustain pad underneath
  const pad = createVoice(ac, octaveDown(root), "sine", 350, 0, dest);
  pad.gain.gain.setValueAtTime(0, now);
  pad.gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
  pad.gain.gain.setValueAtTime(0.06, now + dur - 0.5);
  pad.gain.gain.linearRampToValueAtTime(0, now + dur);
  pad.osc.start(now);
  pad.osc.stop(now + dur);
  activeNodes.push(pad.osc);
}

function playTransition(ac: AudioContext, root: number, _bpm: number) {
  const dest = getMaster();
  const now = ac.currentTime;
  const dur = 1.5;

  // Quick sweep: sine with rising filter
  const v = createVoice(ac, octaveDown(root), "sine", 200, 0, dest);
  v.gain.gain.setValueAtTime(0, now);
  v.gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
  v.gain.gain.linearRampToValueAtTime(0, now + dur);
  v.filter.frequency.exponentialRampToValueAtTime(2000, now + dur * 0.7);
  v.filter.frequency.linearRampToValueAtTime(200, now + dur);
  v.osc.frequency.linearRampToValueAtTime(root, now + dur * 0.5);
  v.osc.start(now);
  v.osc.stop(now + dur);
  activeNodes.push(v.osc);

  // Second voice — fifth, delayed
  const v2 = createVoice(ac, octaveDown(perfectFifth(root)), "triangle", 300, 0, dest);
  v2.gain.gain.setValueAtTime(0, now + 0.1);
  v2.gain.gain.linearRampToValueAtTime(0.1, now + 0.15);
  v2.gain.gain.linearRampToValueAtTime(0, now + dur);
  v2.osc.start(now + 0.1);
  v2.osc.stop(now + dur);
  activeNodes.push(v2.osc);
}

function playStinger(ac: AudioContext, root: number, _bpm: number) {
  const dest = getMaster();
  const now = ac.currentTime;
  const dur = 0.8;

  // Punchy hit: fast attack, immediate decay
  const v1 = createVoice(ac, root, "triangle", 1200, 0, dest);
  v1.gain.gain.setValueAtTime(0, now);
  v1.gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
  v1.gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  v1.filter.frequency.setValueAtTime(1500, now);
  v1.filter.frequency.exponentialRampToValueAtTime(300, now + dur * 0.5);
  v1.osc.start(now);
  v1.osc.stop(now + dur);
  activeNodes.push(v1.osc);

  // Octave above for brightness
  const v2 = createVoice(ac, root * 2, "sine", 1000, 0, dest);
  v2.gain.gain.setValueAtTime(0, now);
  v2.gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
  v2.gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.4);
  v2.osc.start(now);
  v2.osc.stop(now + dur * 0.5);
  activeNodes.push(v2.osc);
}

function playEnding(ac: AudioContext, root: number, _bpm: number) {
  const dest = getMaster();
  const now = ac.currentTime;
  const dur = 4.0;

  // Resolving chord: root + third + fifth, slow fade
  const freqs = [octaveDown(root), octaveDown(minorThird(root)) * 1.0595, octaveDown(perfectFifth(root))]; // major third for resolution
  freqs.forEach((f, i) => {
    const v = createVoice(ac, f, "triangle", 500, 0, dest);
    v.gain.gain.setValueAtTime(0, now);
    v.gain.gain.linearRampToValueAtTime(0.1 - i * 0.02, now + 0.3);
    v.gain.gain.setValueAtTime(0.1 - i * 0.02, now + dur * 0.5);
    v.gain.gain.linearRampToValueAtTime(0, now + dur);
    v.osc.start(now);
    v.osc.stop(now + dur);
    activeNodes.push(v.osc);
  });
}

function playAmbient(ac: AudioContext, root: number, _bpm: number) {
  const dest = getMaster();
  const now = ac.currentTime;
  const dur = 5.0;

  // Deep drone: very low, very filtered
  const droneFreq = octaveDown(octaveDown(root));
  const v = createVoice(ac, droneFreq, "triangle", 250, 0, dest);
  v.gain.gain.setValueAtTime(0, now);
  v.gain.gain.linearRampToValueAtTime(0.08, now + 1.5);
  v.gain.gain.setValueAtTime(0.08, now + dur - 2);
  v.gain.gain.linearRampToValueAtTime(0, now + dur);
  // Slow filter movement
  v.filter.frequency.setValueAtTime(200, now);
  v.filter.frequency.linearRampToValueAtTime(400, now + dur * 0.5);
  v.filter.frequency.linearRampToValueAtTime(200, now + dur);
  v.osc.start(now);
  v.osc.stop(now + dur);
  activeNodes.push(v.osc);

  // Subtle high shimmer
  const v2 = createVoice(ac, perfectFifth(root), "sine", 300, 0, dest);
  v2.gain.gain.setValueAtTime(0, now + 0.5);
  v2.gain.gain.linearRampToValueAtTime(0.03, now + 2);
  v2.gain.gain.linearRampToValueAtTime(0, now + dur);
  v2.osc.start(now + 0.5);
  v2.osc.stop(now + dur);
  activeNodes.push(v2.osc);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export type AssetCategory = "intro" | "loop" | "ending" | "transition" | "stinger" | "layer" | "ambient";

export interface AuditionParams {
  id: string;
  category: AssetCategory;
  key: string;
  bpm: number;
}

export function stopAudition() {
  activeNodes.forEach((osc) => {
    try { osc.stop(); } catch { /* already stopped */ }
  });
  activeNodes = [];
  activeTimeouts.forEach((t) => clearTimeout(t));
  activeTimeouts = [];
  isPlaying = false;
  currentAssetId = null;
}

export function auditionAsset(params: AuditionParams): boolean {
  const ac = getCtx();

  // Toggle off if same asset
  if (isPlaying && currentAssetId === params.id) {
    stopAudition();
    return false;
  }

  // Stop previous
  stopAudition();

  const root = parseRoot(params.key);

  const generators: Record<AssetCategory, (ac: AudioContext, root: number, bpm: number) => void> = {
    intro: playIntro,
    loop: playLoop,
    ending: playEnding,
    transition: playTransition,
    stinger: playStinger,
    layer: playAmbient,
    ambient: playAmbient,
  };

  generators[params.category](ac, root, params.bpm || 120);

  isPlaying = true;
  currentAssetId = params.id;

  // Auto-stop after max duration
  const durations: Record<AssetCategory, number> = {
    intro: 3200,
    loop: ((60 / (params.bpm || 120)) * 8 + 0.5) * 1000,
    ending: 4200,
    transition: 1700,
    stinger: 1000,
    layer: 5200,
    ambient: 5200,
  };

  const timeout = window.setTimeout(() => {
    isPlaying = false;
    currentAssetId = null;
  }, durations[params.category]);
  activeTimeouts.push(timeout);

  return true;
}

export function getPlayingAssetId(): string | null {
  return currentAssetId;
}

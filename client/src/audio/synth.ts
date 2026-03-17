/**
 * Web Audio engine for Score Canvas.
 * Plays real MP3 files. Transition mode plays first 10s + last 10s with crossfades.
 * Default volume: 60%.
 */

// ─── Audio context singleton ────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeSources: AudioBufferSourceNode[] = [];
let activeFileGains: GainNode[] = [];
let activeTimeouts: number[] = [];
let isPlaying = false;
let currentAssetId: string | null = null;
let volumeLevel = 0.6; // default 60%

// Audio buffer cache to avoid re-fetching
const bufferCache = new Map<string, AudioBuffer>();

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = volumeLevel;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

// ─── Volume control ─────────────────────────────────────────────────────────

export function setVolume(v: number) {
  volumeLevel = Math.max(0, Math.min(1, v));
  if (masterGain) {
    masterGain.gain.value = volumeLevel;
  }
}

export function getVolume(): number {
  return volumeLevel;
}

// ─── MP3 file playback ──────────────────────────────────────────────────────

async function loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
  if (bufferCache.has(url)) return bufferCache.get(url)!;
  try {
    const ac = getCtx();
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const arrayBuf = await resp.arrayBuffer();
    const audioBuf = await ac.decodeAudioData(arrayBuf);
    bufferCache.set(url, audioBuf);
    return audioBuf;
  } catch {
    return null;
  }
}

interface FilePlaybackOptions {
  /** "full" plays entire file; "transition" plays first 10s + last 10s with fades */
  mode?: "full" | "transition";
}

async function playAudioFile(
  audioFile: string,
  opts: FilePlaybackOptions = {},
): Promise<number | null> {
  const url = `/audio/${audioFile}`;
  const buffer = await loadAudioBuffer(url);
  if (!buffer) return null;

  const ac = getCtx();
  const master = getMaster();
  const mode = opts.mode ?? "full";
  const now = ac.currentTime;
  const fadeDur = 1.5;

  const source = ac.createBufferSource();
  source.buffer = buffer;
  const fileGain = ac.createGain();
  source.connect(fileGain);
  fileGain.connect(master);

  activeSources.push(source);
  activeFileGains.push(fileGain);

  if (mode === "transition" && buffer.duration > 22) {
    // Play first 10s (fade in 0.5s, fade out last 1.5s), gap, then last 10s (fade in 1.5s, fade out last 1s)
    const firstDur = 10;
    const lastDur = 10;
    const gapDur = 0.3;

    // First segment
    fileGain.gain.setValueAtTime(0, now);
    fileGain.gain.linearRampToValueAtTime(1, now + 0.5);
    fileGain.gain.setValueAtTime(1, now + firstDur - fadeDur);
    fileGain.gain.linearRampToValueAtTime(0, now + firstDur);
    source.start(now, 0, firstDur);

    // Second segment (last 10 seconds)
    const source2 = ac.createBufferSource();
    source2.buffer = buffer;
    const fileGain2 = ac.createGain();
    source2.connect(fileGain2);
    fileGain2.connect(master);
    activeSources.push(source2);
    activeFileGains.push(fileGain2);

    const seg2Start = now + firstDur + gapDur;
    const offset2 = Math.max(0, buffer.duration - lastDur);
    fileGain2.gain.setValueAtTime(0, seg2Start);
    fileGain2.gain.linearRampToValueAtTime(1, seg2Start + fadeDur);
    fileGain2.gain.setValueAtTime(1, seg2Start + lastDur - 1);
    fileGain2.gain.linearRampToValueAtTime(0, seg2Start + lastDur);
    source2.start(seg2Start, offset2, lastDur);

    return (firstDur + gapDur + lastDur) * 1000;
  } else {
    // Full playback with gentle fade in/out
    fileGain.gain.setValueAtTime(0, now);
    fileGain.gain.linearRampToValueAtTime(1, now + Math.min(0.3, buffer.duration * 0.1));
    if (buffer.duration > 1) {
      fileGain.gain.setValueAtTime(1, now + buffer.duration - Math.min(fadeDur, buffer.duration * 0.2));
      fileGain.gain.linearRampToValueAtTime(0, now + buffer.duration);
    }
    source.start(now);
    return buffer.duration * 1000;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export type AssetCategory = "intro" | "loop" | "ending" | "transition" | "stinger" | "layer" | "ambient";

export interface AuditionParams {
  id: string;
  category: AssetCategory;
  key: string;
  bpm: number;
  audioFile?: string;
  /** "full" plays entire file; "transition" plays first/last 10s with fades */
  playbackMode?: "full" | "transition";
}

export function stopAudition() {
  activeSources.forEach((src) => {
    try { src.stop(); } catch { /* already stopped */ }
  });
  activeSources = [];
  activeFileGains = [];
  activeTimeouts.forEach((t) => clearTimeout(t));
  activeTimeouts = [];
  isPlaying = false;
  currentAssetId = null;
}

export async function auditionAsset(params: AuditionParams): Promise<boolean> {
  getCtx();

  // Toggle off if same asset
  if (isPlaying && currentAssetId === params.id) {
    stopAudition();
    return false;
  }

  // Stop previous
  stopAudition();

  isPlaying = true;
  currentAssetId = params.id;

  if (!params.audioFile) {
    // No audio file assigned — nothing to play
    isPlaying = false;
    currentAssetId = null;
    return false;
  }

  const durationMs = await playAudioFile(params.audioFile, {
    mode: params.playbackMode ?? "full",
  });

  if (durationMs !== null) {
    const timeout = window.setTimeout(() => {
      isPlaying = false;
      currentAssetId = null;
    }, durationMs + 200);
    activeTimeouts.push(timeout);
    return true;
  }

  // File failed to load
  isPlaying = false;
  currentAssetId = null;
  return false;
}

export function getPlayingAssetId(): string | null {
  return currentAssetId;
}

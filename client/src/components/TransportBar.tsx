import { useState, useEffect } from "react";
import type { Node } from "@xyflow/react";

// ─── Sprite definitions ──────────────────────────────────────────────────────

type SpriteFrame = string[][];

const JOURNEY_SPRITES: Record<string, SpriteFrame> = {
  run1: [
    ["", "", "r", "r", "", ""],
    ["", "r", "r", "r", "r", ""],
    ["", "", "w", "w", "", ""],
    ["", "w", "w", "w", "", ""],
    ["", "", "w", "", "", ""],
    ["", "w", "", "w", "", ""],
  ],
  run2: [
    ["", "", "r", "r", "", ""],
    ["", "r", "r", "r", "r", ""],
    ["", "", "w", "w", "", ""],
    ["", "w", "w", "w", "", ""],
    ["", "", "w", "", "", ""],
    ["", "", "w", "w", "", ""],
  ],
};

const BLOODBORNE_SPRITES: Record<string, SpriteFrame> = {
  run1: [
    ["", "p", "p", "p", "", ""],
    ["", "p", "g", "p", "", ""],
    ["", "", "p", "", "", ""],
    ["", "b", "b", "b", "", ""],
    ["", "b", "b", "b", "", ""],
    ["", "", "b", "", "b", ""],
  ],
  run2: [
    ["", "p", "p", "p", "", ""],
    ["", "p", "g", "p", "", ""],
    ["", "", "p", "", "", ""],
    ["", "b", "b", "b", "", ""],
    ["", "b", "b", "b", "", ""],
    ["", "", "b", "b", "", ""],
  ],
};

const COLOR_MAP: Record<string, string> = {
  r: "#e94560", w: "#e0d6c8", y: "#fbbf24",
  p: "#f0abfc", g: "#4ade80", b: "#93c5fd", t: "#facc15", c: "#c084fc",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface TransportBarProps {
  sequencePlaying: boolean;
  sequenceNodeId: string | null;
  sequenceNodeIndex: number;
  sequenceTotalNodes: number;
  sequenceQuickMode: boolean;
  sequenceOrder: Node[];
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaySequence: () => void;
  onStopAll: () => void;
  onSkipNext: () => void;
  onToggleQuickMode: () => void;
  onRewind: (targetIndex: number) => void;
  projectId: string;
}

// ─── Helper: type icon / color ───────────────────────────────────────────────

function typeIcon(t: string) {
  if (t === "transition") return "→";
  if (t === "stinger") return "◆";
  if (t === "event") return "★";
  if (t === "parameter") return "◎";
  return "♪";
}

function typeColor(t: string) {
  if (t === "transition") return "text-red-400";
  if (t === "stinger") return "text-orange-400";
  if (t === "event") return "text-cyan-400";
  if (t === "parameter") return "text-purple-400";
  return "text-green-300";
}

// ─── Mini Sprite Scene ───────────────────────────────────────────────────────

function MiniSprite({ progress, isJourney, playing }: { progress: number; isJourney: boolean; playing: boolean }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => setFrame((f) => (f + 1) % 2), 220);
    return () => clearInterval(interval);
  }, [playing]);

  const sprites = isJourney ? JOURNEY_SPRITES : BLOODBORNE_SPRITES;
  const spriteData = frame % 2 === 0 ? sprites.run1 : sprites.run2;
  const px = 2;

  if (!playing) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.35 }}>
      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: isJourney ? "#d4a76a33" : "#6b728033" }} />

      {/* Tiny background elements */}
      {[15, 55, 95, 140, 185, 230, 270].map((x, i) => (
        <div key={i} className="absolute" style={{
          left: x, bottom: 2,
          width: i % 2 === 0 ? 3 : 1,
          height: i % 2 === 0 ? 2 : 3,
          background: isJourney ? "#d4a76a22" : "#6b728022",
          borderRadius: i % 2 === 0 ? "1px 1px 0 0" : 0,
        }} />
      ))}

      {/* Character */}
      <div
        className="absolute transition-all duration-500 ease-out"
        style={{
          left: `${6 + progress * 85}%`,
          bottom: 3,
          transform: "translateX(-50%)",
        }}
      >
        <div style={{ imageRendering: "pixelated" as const }}>
          {spriteData.map((row, ri) => (
            <div key={ri} className="flex">
              {row.map((pixel, ci) => (
                <div key={ci} style={{
                  width: px, height: px,
                  background: pixel ? COLOR_MAP[pixel] ?? "transparent" : "transparent",
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Transport Bar ───────────────────────────────────────────────────────────

export function TransportBar({
  sequencePlaying,
  sequenceNodeId,
  sequenceNodeIndex,
  sequenceTotalNodes,
  sequenceQuickMode,
  sequenceOrder,
  volume,
  onVolumeChange,
  onPlaySequence,
  onStopAll,
  onSkipNext,
  onToggleQuickMode,
  onRewind,
  projectId,
}: TransportBarProps) {
  const [minimized, setMinimized] = useState(false);
  const [spriteVisible, setSpriteVisible] = useState(true);
  const isJourney = projectId === "journey-2";

  const currentNode = sequenceOrder[sequenceNodeIndex];
  const nextNode = sequenceOrder[sequenceNodeIndex + 1];
  const afterNext = sequenceOrder[sequenceNodeIndex + 2];

  const currentLabel = currentNode ? (currentNode.data as Record<string, unknown>).label as string : "";
  const currentType = currentNode?.type ?? "musicState";
  const nextLabel = nextNode ? (nextNode.data as Record<string, unknown>).label as string : null;
  const nextType = nextNode?.type ?? "musicState";
  const afterLabel = afterNext ? (afterNext.data as Record<string, unknown>).label as string : null;
  const afterType = afterNext?.type ?? "musicState";

  // Upcoming message
  let upcomingMsg = "";
  if (nextType === "transition") upcomingMsg = "Coming up to transition!";
  else if (nextType === "event") upcomingMsg = "Event cue incoming!";
  else if (nextLabel) upcomingMsg = `Up next: ${nextLabel}`;

  const progress = sequenceTotalNodes > 0 ? sequenceNodeIndex / sequenceTotalNodes : 0;

  // Minimized: just a thin bar with play button and minimize toggle
  if (minimized) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#0d0d1a]/95 border border-canvas-accent backdrop-blur-sm shadow-2xl">
        {/* Play/Stop */}
        <button onClick={onPlaySequence} className={`w-6 h-6 flex items-center justify-center rounded ${
          sequencePlaying ? "text-red-400" : "text-green-400"
        }`}>
          {sequencePlaying ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="1" width="8" height="8" rx="1" /></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="1,0 10,5 1,10" /></svg>
          )}
        </button>

        {sequencePlaying && (
          <span className="text-[9px] font-mono text-green-300 truncate max-w-[120px]">
            ♪ {currentLabel}
          </span>
        )}

        {/* Progress dots (compact) */}
        {sequencePlaying && sequenceTotalNodes > 0 && (
          <div className="flex gap-px items-center">
            {sequenceOrder.map((_, idx) => (
              <div key={idx} className="rounded-full" style={{
                width: idx === sequenceNodeIndex ? 4 : 2,
                height: idx === sequenceNodeIndex ? 4 : 2,
                background: idx === sequenceNodeIndex ? "#4ade80" : idx < sequenceNodeIndex ? "#4ade8066" : "#3a3a5c",
              }} />
            ))}
          </div>
        )}

        <button onClick={() => setMinimized(false)} className="text-canvas-muted hover:text-canvas-text text-[10px] ml-1" title="Expand transport">
          ▲
        </button>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl bg-[#0a0a18]/95 border border-canvas-accent/60 backdrop-blur-md shadow-2xl overflow-hidden" style={{ minWidth: 600, maxWidth: 820 }}>
      {/* Mini sprite scene — subtle, behind everything */}
      {spriteVisible && (
        <MiniSprite progress={progress} isJourney={isJourney} playing={sequencePlaying} />
      )}

      {/* Main transport row */}
      <div className="relative z-10 flex items-center gap-1 px-2 py-1.5">

        {/* ── Left: Playback controls ── */}
        <div className="flex items-center gap-1">
          {/* Play / Stop Sequence */}
          <button
            onClick={onPlaySequence}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
              sequencePlaying
                ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                : "bg-green-900/30 text-green-400 border-green-500/40 hover:bg-green-500/20"
            }`}
            title={sequencePlaying ? "Stop sequence" : "Play sequence"}
          >
            {sequencePlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="2" width="8" height="8" rx="1" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><polygon points="2,0 12,6 2,12" /></svg>
            )}
          </button>

          {/* Skip Next */}
          <button
            onClick={onSkipNext}
            disabled={!sequencePlaying || sequenceNodeIndex >= sequenceTotalNodes - 1}
            className={`w-7 h-8 flex items-center justify-center rounded-lg border transition-all ${
              sequencePlaying && sequenceNodeIndex < sequenceTotalNodes - 1
                ? "text-canvas-text border-canvas-accent/40 hover:bg-canvas-accent/20"
                : "text-canvas-muted/30 border-canvas-accent/20 cursor-not-allowed"
            }`}
            title="Skip to next node"
          >
            <svg width="12" height="10" viewBox="0 0 14 10" fill="currentColor">
              <polygon points="0,0 8,5 0,10" />
              <rect x="9" y="0" width="2.5" height="10" rx="0.5" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-canvas-accent/30 mx-0.5" />

          {/* Volume */}
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-canvas-muted flex-shrink-0">
              <path d="M8 1.5l-4 3H1v7h3l4 3V1.5z"/>
              {volume > 0 && <path d="M11 4.5c1.2 1.2 1.2 5.8 0 7" fill="none" stroke="currentColor" strokeWidth="1.5"/>}
              {volume > 0.5 && <path d="M13 2.5c2 2.5 2 8.5 0 11" fill="none" stroke="currentColor" strokeWidth="1.5"/>}
            </svg>
            <input
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={onVolumeChange}
              className="w-14 h-1 accent-canvas-highlight cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
            <span className="text-[8px] font-mono text-canvas-muted/60 w-6 text-right">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-canvas-accent/30 mx-1" />

        {/* ── Center: Now Playing info ── */}
        <div className="flex-1 min-w-0">
          {sequencePlaying && sequenceNodeId ? (
            <div className="flex flex-col gap-0.5">
              {/* Track name + counter */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className={`text-[11px] font-bold truncate ${typeColor(currentType)}`}>
                  {typeIcon(currentType)} {currentLabel}
                </span>
                {upcomingMsg && (
                  <span className="text-[8px] text-amber-400/70 font-mono italic truncate hidden sm:inline">
                    {upcomingMsg}
                  </span>
                )}
                <span className="text-[9px] text-canvas-muted font-mono ml-auto flex-shrink-0">
                  {sequenceNodeIndex + 1}/{sequenceTotalNodes}
                </span>
              </div>

              {/* Sequence path + rewind dots */}
              <div className="flex items-center gap-1">
                {/* Compact path */}
                <div className="flex items-center gap-0.5 text-[8px] font-mono truncate">
                  <span className={`font-bold ${typeColor(currentType)}`}>{typeIcon(currentType)} {currentLabel}</span>
                  {nextLabel && (
                    <>
                      <span className="text-canvas-muted/50 mx-px">→</span>
                      <span className={typeColor(nextType)}>{typeIcon(nextType)} {nextLabel}</span>
                    </>
                  )}
                  {afterLabel && (
                    <>
                      <span className="text-canvas-muted/50 mx-px">→</span>
                      <span className={`${typeColor(afterType)} opacity-50`}>{typeIcon(afterType)} {afterLabel}</span>
                    </>
                  )}
                </div>

                {/* Rewind dots */}
                <div className="flex items-center gap-px ml-auto flex-shrink-0">
                  {sequenceOrder.map((nd, idx) => {
                    const isCurrent = idx === sequenceNodeIndex;
                    const isPast = idx < sequenceNodeIndex;
                    const nType = nd?.type ?? "musicState";
                    return (
                      <button
                        key={idx}
                        onClick={() => onRewind(idx)}
                        title={(nd?.data as Record<string, unknown>)?.label as string ?? `Node ${idx + 1}`}
                        className="hover:scale-150 transition-transform"
                      >
                        <div style={{
                          width: isCurrent ? 6 : nType === "transition" ? 4 : 3,
                          height: isCurrent ? 6 : nType === "transition" ? 2 : 3,
                          borderRadius: nType === "transition" ? 1 : 999,
                          background: isCurrent ? "#4ade80" : isPast ? "#4ade8055" : "#3a3a5c",
                          boxShadow: isCurrent ? "0 0 4px #4ade80" : "none",
                        }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-canvas-muted/50 font-mono text-center py-1">
              Ready — press play to start sequence
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-canvas-accent/30 mx-1" />

        {/* ── Right: Mode toggle + sprite toggle + Stop All + minimize ── */}
        <div className="flex items-center gap-1">
          {/* Transitions Only / Full Score toggle */}
          <button
            onClick={onToggleQuickMode}
            className={`px-1.5 py-1 text-[9px] font-semibold rounded-md border transition-colors whitespace-nowrap ${
              sequenceQuickMode
                ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
                : "bg-amber-900/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
            }`}
            title={sequenceQuickMode ? "Transitions Only: plays ins/outs (~20s per node)" : "Full Score: plays entire file per node"}
          >
            {sequenceQuickMode ? "Transitions Only" : "Full Score"}
          </button>

          {/* Sprite toggle */}
          <button
            onClick={() => setSpriteVisible((v) => !v)}
            className={`w-6 h-6 flex items-center justify-center rounded text-[10px] transition-colors ${
              spriteVisible ? "text-canvas-muted/60 hover:text-canvas-text" : "text-canvas-muted/20 hover:text-canvas-muted/40"
            }`}
            title={spriteVisible ? "Hide sprite" : "Show sprite"}
          >
            🎮
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-canvas-accent/20 mx-0.5" />

          {/* Stop All (panic) */}
          <button
            onClick={onStopAll}
            className="px-2 py-1 text-[9px] font-bold rounded-md bg-red-950/40 text-red-400/80 border border-red-500/25 hover:bg-red-500/25 hover:text-red-300 transition-colors whitespace-nowrap"
            title="Stop all audio immediately"
          >
            ⏹ Stop All
          </button>

          {/* Minimize */}
          <button
            onClick={() => setMinimized(true)}
            className="w-5 h-5 flex items-center justify-center text-canvas-muted/40 hover:text-canvas-muted text-[9px] transition-colors"
            title="Minimize transport"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Progress bar at very bottom */}
      {sequencePlaying && (
        <div className="h-0.5 bg-canvas-accent/10">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((sequenceNodeIndex + 1) / Math.max(sequenceTotalNodes, 1)) * 100}%`,
              background: `linear-gradient(90deg, ${isJourney ? "#e94560" : "#c084fc"}, ${isJourney ? "#fbbf24" : "#f0abfc"})`,
            }}
          />
        </div>
      )}
    </div>
  );
}

import { useState, type DragEvent } from "react";
import type { MusicAsset } from "../data/projects";
import { auditionAsset, stopAudition, type AssetCategory } from "../audio/synth";

interface AssetBrowserProps {
  assets: MusicAsset[];
}

const categoryIcons: Record<string, string> = {
  intro: "I", loop: "L", ending: "E", transition: "T", stinger: "S", layer: "A", ambient: "A",
};
const categoryColors: Record<string, string> = {
  intro: "#4ecdc4", loop: "#e94560", ending: "#f59e0b", transition: "#818cf8", stinger: "#f97316", layer: "#a855f7", ambient: "#a855f7",
};

export function AssetBrowser({ assets }: AssetBrowserProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const grouped = assets.reduce<Record<string, MusicAsset[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});

  const order = ["intro", "loop", "transition", "stinger", "ending", "layer", "ambient"];
  const sorted = order.filter((c) => grouped[c]);

  const handlePlay = (asset: MusicAsset) => {
    const started = auditionAsset({
      id: asset.id,
      category: asset.category as AssetCategory,
      key: asset.key,
      bpm: asset.bpm,
    });
    setPlayingId(started ? asset.id : null);
    if (started) {
      // Auto-clear playing state
      const durations: Record<string, number> = {
        intro: 3200, loop: ((60 / (asset.bpm || 120)) * 8 + 0.5) * 1000,
        ending: 4200, transition: 1700, stinger: 1000, layer: 5200, ambient: 5200,
      };
      setTimeout(() => setPlayingId((curr) => curr === asset.id ? null : curr), durations[asset.category]);
    }
  };

  const handleStop = () => {
    stopAudition();
    setPlayingId(null);
  };

  const onDragStart = (e: DragEvent, asset: MusicAsset) => {
    e.dataTransfer.setData("application/scorecanvas-asset", JSON.stringify(asset));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-1 mb-1">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-canvas-muted">Music Assets</h2>
        {playingId && (
          <button onClick={handleStop} className="text-[9px] font-mono text-canvas-highlight hover:text-white transition-colors">
            STOP
          </button>
        )}
      </div>
      {sorted.map((cat) => (
        <div key={cat}>
          <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
            <div
              className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center text-white"
              style={{ background: categoryColors[cat] }}
            >
              {categoryIcons[cat]}
            </div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-canvas-muted/60">
              {cat === "layer" || cat === "ambient" ? "Ambient / Layer" : cat + "s"}
            </span>
            <span className="text-[9px] text-canvas-muted/40">{grouped[cat].length}</span>
          </div>
          {grouped[cat].map((asset) => {
            const isActive = playingId === asset.id;
            return (
              <div
                key={asset.id}
                className={`group flex items-center gap-1 px-1.5 py-1 rounded cursor-grab active:cursor-grabbing transition-colors ${
                  isActive ? "bg-canvas-highlight/15" : "hover:bg-canvas-accent/40"
                }`}
                draggable
                onDragStart={(e) => onDragStart(e, asset)}
              >
                <button
                  onClick={() => isActive ? handleStop() : handlePlay(asset)}
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-canvas-highlight text-white" : "bg-canvas-bg text-canvas-muted hover:text-canvas-text"
                  }`}
                >
                  {isActive ? (
                    <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="1" width="2.5" height="6" fill="currentColor"/><rect x="4.5" y="1" width="2.5" height="6" fill="currentColor"/></svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="1,0 8,4 1,8" fill="currentColor"/></svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-canvas-text truncate">{asset.filename}</div>
                  <div className="flex items-center gap-2 text-[9px] text-canvas-muted">
                    <span>{asset.duration}</span>
                    {asset.bpm > 0 && <span>{asset.bpm} BPM</span>}
                    {asset.key !== "-" && <span>{asset.key}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

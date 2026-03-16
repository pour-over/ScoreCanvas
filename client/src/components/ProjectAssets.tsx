import { useState, type DragEvent } from "react";
import type { GameLevel, MusicAsset } from "../data/projects";
import { auditionAsset, stopAudition, type AssetCategory } from "../audio/synth";

interface ProjectAssetsProps {
  levels: GameLevel[];
  projectName: string;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  intro: "#4ecdc4", loop: "#e94560", ending: "#f59e0b", transition: "#818cf8", stinger: "#f97316", layer: "#a855f7", ambient: "#a855f7",
};

export function ProjectAssets({ levels, projectName, onClose }: ProjectAssetsProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Flatten all assets with level info
  const allAssets = levels.flatMap((lvl) =>
    lvl.assets.map((a) => ({ ...a, levelName: lvl.name, levelId: lvl.id }))
  );

  const filtered = allAssets.filter((a) => {
    const matchesText = !filter || a.filename.toLowerCase().includes(filter.toLowerCase()) || a.levelName.toLowerCase().includes(filter.toLowerCase());
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchesText && matchesCat;
  });

  const categories = ["all", "intro", "loop", "transition", "stinger", "ending", "layer", "ambient"];

  const handlePlay = (asset: MusicAsset) => {
    const started = auditionAsset({ id: asset.id, category: asset.category as AssetCategory, key: asset.key, bpm: asset.bpm });
    setPlayingId(started ? asset.id : null);
    if (started) {
      const durations: Record<string, number> = {
        intro: 3200, loop: ((60 / (asset.bpm || 120)) * 8 + 0.5) * 1000,
        ending: 4200, transition: 1700, stinger: 1000, layer: 5200, ambient: 5200,
      };
      setTimeout(() => setPlayingId((curr) => curr === asset.id ? null : curr), durations[asset.category]);
    }
  };

  const handleStop = () => { stopAudition(); setPlayingId(null); };

  const onDragStart = (e: DragEvent, asset: MusicAsset) => {
    e.dataTransfer.setData("application/scorecanvas-asset", JSON.stringify(asset));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0d0d1a] border border-canvas-accent rounded-xl shadow-2xl w-[800px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-canvas-accent">
          <div>
            <h2 className="text-sm font-bold text-canvas-text">Project Music Assets</h2>
            <p className="text-[10px] text-canvas-muted font-mono mt-0.5">{projectName} — {allAssets.length} total assets across {levels.length} levels</p>
          </div>
          <div className="flex items-center gap-3">
            {playingId && (
              <button onClick={handleStop} className="text-[10px] font-mono text-canvas-highlight hover:text-white px-2 py-1 rounded bg-canvas-highlight/10">
                STOP PLAYBACK
              </button>
            )}
            <button onClick={onClose} className="text-canvas-muted hover:text-canvas-text text-lg leading-none">&times;</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-canvas-accent/50">
          <input
            type="text"
            placeholder="Search assets..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-canvas-bg border border-canvas-accent rounded px-2 py-1 text-xs text-canvas-text placeholder:text-canvas-muted/50 w-48 focus:outline-none focus:border-canvas-highlight/50"
          />
          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[9px] font-mono uppercase px-2 py-1 rounded transition-colors ${
                  categoryFilter === cat
                    ? "bg-canvas-highlight/20 text-canvas-highlight border border-canvas-highlight/30"
                    : "text-canvas-muted hover:text-canvas-text border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-[10px] text-canvas-muted font-mono">{filtered.length} shown</span>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-[#0d0d1a]">
              <tr className="text-canvas-muted font-mono uppercase text-[9px] tracking-wider border-b border-canvas-accent/50">
                <th className="text-left px-5 py-2 w-8"></th>
                <th className="text-left px-2 py-2">Filename</th>
                <th className="text-left px-2 py-2 w-20">Level</th>
                <th className="text-left px-2 py-2 w-16">Type</th>
                <th className="text-left px-2 py-2 w-12">Dur</th>
                <th className="text-left px-2 py-2 w-14">BPM</th>
                <th className="text-left px-2 py-2 w-10">Key</th>
                <th className="text-left px-2 py-2 w-12">Stems</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const isActive = playingId === asset.id;
                return (
                  <tr
                    key={asset.id}
                    className={`border-b border-canvas-accent/20 cursor-grab active:cursor-grabbing transition-colors ${
                      isActive ? "bg-canvas-highlight/10" : "hover:bg-canvas-accent/20"
                    }`}
                    draggable
                    onDragStart={(e) => onDragStart(e, asset)}
                  >
                    <td className="px-5 py-1.5">
                      <button
                        onClick={() => isActive ? handleStop() : handlePlay(asset)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isActive ? "bg-canvas-highlight text-white" : "bg-canvas-bg text-canvas-muted hover:text-canvas-text"
                        }`}
                      >
                        {isActive ? (
                          <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="1" width="2.5" height="6" fill="currentColor"/><rect x="4.5" y="1" width="2.5" height="6" fill="currentColor"/></svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="1,0 8,4 1,8" fill="currentColor"/></svg>
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 font-mono text-canvas-text">{asset.filename}</td>
                    <td className="px-2 py-1.5 text-canvas-muted">{asset.levelName}</td>
                    <td className="px-2 py-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white" style={{ background: categoryColors[asset.category] }}>
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-canvas-muted font-mono">{asset.duration}</td>
                    <td className="px-2 py-1.5 text-canvas-muted font-mono">{asset.bpm > 0 ? asset.bpm : "—"}</td>
                    <td className="px-2 py-1.5 text-canvas-muted font-mono">{asset.key}</td>
                    <td className="px-2 py-1.5 text-canvas-muted font-mono">{asset.stems.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import type { MusicAsset } from "../data/levels";

interface AssetBrowserProps {
  assets: MusicAsset[];
}

const categoryIcons: Record<string, string> = {
  intro: "I",
  loop: "L",
  ending: "E",
  transition: "T",
  stinger: "S",
  layer: "A",
  ambient: "A",
};

const categoryColors: Record<string, string> = {
  intro: "#4ecdc4",
  loop: "#e94560",
  ending: "#f59e0b",
  transition: "#818cf8",
  stinger: "#f97316",
  layer: "#a855f7",
  ambient: "#a855f7",
};

export function AssetBrowser({ assets }: AssetBrowserProps) {
  const grouped = assets.reduce<Record<string, MusicAsset[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});

  const order = ["intro", "loop", "transition", "stinger", "ending", "layer", "ambient"];
  const sorted = order.filter((c) => grouped[c]);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[10px] font-mono uppercase tracking-widest text-canvas-muted px-1 mb-1">Music Assets</h2>
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
          {grouped[cat].map((asset) => (
            <div
              key={asset.id}
              className="group px-2 py-1 rounded hover:bg-canvas-accent/40 cursor-default transition-colors"
            >
              <div className="text-[10px] font-mono text-canvas-text truncate">{asset.filename}</div>
              <div className="flex items-center gap-2 text-[9px] text-canvas-muted">
                <span>{asset.duration}</span>
                {asset.bpm > 0 && <span>{asset.bpm} BPM</span>}
                {asset.key !== "-" && <span>{asset.key}</span>}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">{asset.stems.length} stems</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

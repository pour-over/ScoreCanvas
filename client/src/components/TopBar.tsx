interface TopBarProps {
  projectName: string;
  levelName: string;
  levelSubtitle: string;
  nodeCount: number;
  edgeCount: number;
  assetCount: number;
  onOpenProjectAssets: () => void;
  onOpenExport: () => void;
}

const integrations = [
  { abbr: "Ww", name: "Wwise", color: "bg-orange-600/20 text-orange-400 border-orange-500/30 hover:bg-orange-600/30" },
  { abbr: "UE", name: "Unreal", color: "bg-slate-600/20 text-slate-300 border-slate-500/30 hover:bg-slate-600/30" },
  { abbr: "P4", name: "Perforce", color: "bg-teal-600/20 text-teal-400 border-teal-500/30 hover:bg-teal-600/30" },
  { abbr: "Jira", name: "JIRA", color: "bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30" },
];

export function TopBar({
  projectName,
  levelName,
  levelSubtitle,
  nodeCount,
  edgeCount,
  assetCount,
  onOpenProjectAssets,
  onOpenExport,
}: TopBarProps) {
  return (
    <header className="h-11 bg-[#0d0d1a] border-b border-canvas-accent flex items-center px-4 gap-4 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-canvas-highlight flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
            <path d="M2 4h3v6H2zM6 2h2v10H6zM9 5h3v5H9z" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
        <span className="text-sm font-bold text-canvas-text tracking-tight">{projectName}</span>
      </div>
      <div className="w-px h-5 bg-canvas-accent" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-canvas-text">{levelName}</span>
        <span className="text-xs text-canvas-muted italic">{levelSubtitle}</span>
      </div>
      <div className="w-px h-5 bg-canvas-accent" />
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenProjectAssets}
          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-canvas-accent/60 text-canvas-text border border-canvas-accent hover:bg-canvas-accent transition-colors"
        >
          Project Assets
        </button>
        <button
          onClick={onOpenExport}
          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-canvas-highlight/80 text-white border border-canvas-highlight hover:bg-canvas-highlight transition-colors"
        >
          Export Template
        </button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        {integrations.map((tool) => (
          <button
            key={tool.abbr}
            title={`Sync with ${tool.name}`}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-colors cursor-pointer ${tool.color}`}
          >
            <span className="font-mono">{tool.abbr}</span>
            <span className="ml-1 font-normal opacity-70">{tool.name}</span>
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-canvas-accent" />
      <div className="flex items-center gap-4 text-[11px] font-mono text-canvas-muted">
        <span><span className="text-canvas-text font-bold">{nodeCount}</span> nodes</span>
        <span><span className="text-canvas-text font-bold">{edgeCount}</span> edges</span>
        <span><span className="text-canvas-text font-bold">{assetCount}</span> assets</span>
      </div>
      <div className="w-px h-5 bg-canvas-accent" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-canvas-muted">Live</span>
      </div>
    </header>
  );
}

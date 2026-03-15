interface TopBarProps {
  projectName: string;
  levelName: string;
  levelSubtitle: string;
  nodeCount: number;
  edgeCount: number;
  assetCount: number;
}

export function TopBar({ projectName, levelName, levelSubtitle, nodeCount, edgeCount, assetCount }: TopBarProps) {
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
      <div className="flex-1" />
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

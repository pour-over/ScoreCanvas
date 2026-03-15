import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { useViewMode } from "../context/ViewModeContext";

interface MusicStateData {
  [key: string]: unknown;
  label: string;
  intensity: number;
  looping: boolean;
  stems: string[];
  asset?: string;
  directorNote?: string;
}

type MusicStateNode = Node<MusicStateData, "musicState">;

export function MusicStateNode({ data }: NodeProps<MusicStateNode>) {
  const { mode } = useViewMode();
  const simple = mode === "simple";

  return (
    <div className={`bg-canvas-surface border-2 border-canvas-accent rounded-lg shadow-lg shadow-blue-900/10 ${simple ? "px-3 py-2 min-w-[120px]" : "px-4 py-3 min-w-[180px]"}`}>
      <Handle type="target" position={Position.Left} className="!bg-canvas-highlight !w-3 !h-3" />
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-canvas-highlight" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-xs font-mono text-canvas-muted uppercase tracking-wider">Music State</span>
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
      {!simple && (
        <>
          {data.asset && (
            <div className="text-[10px] font-mono text-canvas-muted mt-0.5 truncate max-w-[200px]">{data.asset}</div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <div className="text-[10px] text-canvas-muted">INT</div>
            <div className="flex-1 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${data.intensity}%`,
                  background: data.intensity > 75 ? "#e94560" : data.intensity > 45 ? "#f59e0b" : "#4ecdc4",
                }}
              />
            </div>
            <div className="text-[10px] text-canvas-muted w-5 text-right">{data.intensity}</div>
          </div>
          {data.stems.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {data.stems.slice(0, 4).map((s) => (
                <span key={s} className="text-[9px] font-mono bg-canvas-bg text-canvas-muted px-1.5 py-0.5 rounded">{s}</span>
              ))}
              {data.stems.length > 4 && (
                <span className="text-[9px] font-mono text-canvas-muted px-1 py-0.5">+{data.stems.length - 4}</span>
              )}
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            {data.looping && (
              <span className="text-[10px] text-canvas-highlight font-mono font-bold">LOOP</span>
            )}
            {!data.looping && (
              <span className="text-[10px] text-[#4ecdc4] font-mono font-bold">ONE-SHOT</span>
            )}
          </div>
          {data.directorNote && (
            <div className="mt-2 border-t border-canvas-accent/50 pt-1.5">
              <div className="text-[9px] font-mono text-amber-400/70 uppercase tracking-wider mb-0.5">Director Note</div>
              <div className="text-[10px] text-amber-200/80 leading-tight italic">{data.directorNote}</div>
            </div>
          )}
        </>
      )}
      <Handle type="source" position={Position.Right} className="!bg-canvas-highlight !w-3 !h-3" />
    </div>
  );
}

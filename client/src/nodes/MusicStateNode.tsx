import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

interface MusicStateData {
  label: string;
  intensity: number;
  looping: boolean;
  stems: string[];
  asset?: string;
}

type MusicStateNode = Node<MusicStateData, "musicState">;

export function MusicStateNode({ data }: NodeProps<MusicStateNode>) {
  return (
    <div className="bg-canvas-surface border-2 border-canvas-accent rounded-lg px-4 py-3 min-w-[180px] shadow-lg shadow-blue-900/10">
      <Handle type="target" position={Position.Left} className="!bg-canvas-highlight !w-3 !h-3" />
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-canvas-highlight"><rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor"/></svg>
        <span className="text-xs font-mono text-canvas-muted uppercase tracking-wider">Music State</span>
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
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
      <Handle type="source" position={Position.Right} className="!bg-canvas-highlight !w-3 !h-3" />
    </div>
  );
}

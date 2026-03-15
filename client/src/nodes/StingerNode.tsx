import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

interface StingerData {
  [key: string]: unknown;
  label: string;
  trigger: string;
  asset: string;
  priority: "low" | "medium" | "high" | "critical";
  directorNote?: string;
}

type StingerNode = Node<StingerData, "stinger">;

const priorityColors: Record<string, string> = {
  low: "#6b7280",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export function StingerNode({ data }: NodeProps<StingerNode>) {
  const color = priorityColors[data.priority] ?? "#6b7280";
  return (
    <div className="bg-[#2a1a1e] border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg" style={{ borderColor: color }}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3" style={{ background: color }} />
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ color }}><polygon points="5,0 10,10 0,10" fill="currentColor"/></svg>
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color }}>Stinger</span>
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
      <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[10px]">
        <span className="text-canvas-muted">Trigger:</span>
        <span className="text-canvas-text font-mono">{data.trigger}</span>
        <span className="text-canvas-muted">Asset:</span>
        <span className="text-canvas-text font-mono truncate">{data.asset}</span>
        <span className="text-canvas-muted">Priority:</span>
        <span className="font-mono font-bold uppercase" style={{ color }}>{data.priority}</span>
      </div>
      {data.directorNote && (
        <div className="mt-2 border-t border-canvas-accent/50 pt-1.5">
          <div className="text-[9px] font-mono text-amber-400/70 uppercase tracking-wider mb-0.5">Director Note</div>
          <div className="text-[10px] text-amber-200/80 leading-tight italic">{data.directorNote}</div>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" style={{ background: color }} />
    </div>
  );
}

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

interface EventData {
  [key: string]: unknown;
  label: string;
  eventType: "cinematic" | "igc" | "button_press" | "checkpoint" | "scripted_sequence" | "qte";
  blueprintRef: string;
  description: string;
  directorNote?: string;
}

type EventNode = Node<EventData, "event">;

const eventTypeConfig: Record<string, { color: string; icon: string; label: string }> = {
  cinematic: { color: "#e94560", icon: "▶", label: "CINEMATIC" },
  igc: { color: "#f59e0b", icon: "◆", label: "IGC" },
  button_press: { color: "#22d3ee", icon: "⊙", label: "BUTTON PRESS" },
  checkpoint: { color: "#4ade80", icon: "⚑", label: "CHECKPOINT" },
  scripted_sequence: { color: "#c084fc", icon: "▣", label: "SCRIPTED SEQ" },
  qte: { color: "#fb923c", icon: "⚡", label: "QTE" },
};

export function EventNode({ data }: NodeProps<EventNode>) {
  const config = eventTypeConfig[data.eventType] ?? eventTypeConfig.cinematic;
  return (
    <div className="bg-[#1a1520] border-2 rounded-lg px-4 py-3 min-w-[180px] shadow-lg" style={{ borderColor: config.color }}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3" style={{ background: config.color }} />
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs" style={{ color: config.color }}>{config.icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: config.color }}>{config.label}</span>
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
      {data.blueprintRef && (
        <div className="text-[10px] font-mono text-canvas-muted mt-0.5 truncate max-w-[200px]">
          BP: {data.blueprintRef}
        </div>
      )}
      <div className="mt-1.5 text-[10px] text-canvas-muted leading-tight">{data.description}</div>
      {data.directorNote && (
        <div className="mt-2 border-t border-canvas-accent/50 pt-1.5">
          <div className="text-[9px] font-mono text-amber-400/70 uppercase tracking-wider mb-0.5">Director Note</div>
          <div className="text-[10px] text-amber-200/80 leading-tight italic">{data.directorNote}</div>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!w-3 !h-3" style={{ background: config.color }} />
    </div>
  );
}

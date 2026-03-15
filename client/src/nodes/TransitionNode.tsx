import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { TransitionData } from "../types";

type TransitionNode = Node<TransitionData, "transition">;

export function TransitionNode({ data }: NodeProps<TransitionNode>) {
  return (
    <div className="bg-canvas-accent border-2 border-canvas-highlight rounded-md px-3 py-2 min-w-[140px] shadow-lg">
      <Handle type="target" position={Position.Left} className="!bg-canvas-text !w-2.5 !h-2.5" />
      <div className="text-xs font-mono text-canvas-muted uppercase tracking-wider mb-1">
        Transition
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-canvas-muted">
        <span>Sync:</span>
        <span className="text-canvas-text">{data.syncPoint}</span>
        <span>Fade:</span>
        <span className="text-canvas-text">{data.fadeType}</span>
        <span>Duration:</span>
        <span className="text-canvas-text">{data.duration}ms</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-canvas-text !w-2.5 !h-2.5" />
    </div>
  );
}

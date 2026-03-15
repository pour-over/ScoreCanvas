import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

interface ParameterData {
  label: string;
  paramName: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  description: string;
}

type ParameterNode = Node<ParameterData, "parameter">;

export function ParameterNode({ data }: NodeProps<ParameterNode>) {
  const pct = ((data.defaultValue - data.minValue) / (data.maxValue - data.minValue)) * 100;
  return (
    <div className="bg-[#1a1a3e] border-2 border-[#a855f7] rounded-lg px-4 py-3 min-w-[180px] shadow-lg shadow-purple-900/20">
      <Handle type="target" position={Position.Left} className="!bg-[#a855f7] !w-3 !h-3" />
      <div className="flex items-center gap-1.5 mb-1">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#a855f7]"><circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="5" cy="5" r="2" fill="currentColor"/></svg>
        <span className="text-xs font-mono text-[#a855f7] uppercase tracking-wider">RTPC</span>
      </div>
      <div className="text-sm font-semibold text-canvas-text">{data.label}</div>
      <div className="text-[10px] font-mono text-canvas-muted mt-0.5">{data.paramName}</div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-canvas-muted">
        <span>{data.minValue}</span>
        <div className="flex-1 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div className="h-full bg-[#a855f7] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span>{data.maxValue}</span>
      </div>
      <div className="mt-1.5 text-[10px] text-canvas-muted leading-tight">{data.description}</div>
      <Handle type="source" position={Position.Right} className="!bg-[#a855f7] !w-3 !h-3" />
    </div>
  );
}

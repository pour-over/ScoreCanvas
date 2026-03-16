import { useCallback, useRef, useEffect, useState, type DragEvent } from "react";
import { useViewMode } from "../context/ViewModeContext";
import { auditionAsset, stopAudition, type AssetCategory } from "../audio/synth";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../nodes";
import type { GameLevel } from "../data/levels";

const defaultNodeData: Record<string, Record<string, unknown>> = {
  musicState: { label: "New State", intensity: 50, looping: true, stems: [], asset: "" },
  transition: { label: "New Transition", duration: 500, syncPoint: "next-bar", fadeType: "crossfade" },
  parameter: { label: "NewParam", paramName: "RTPC_NewParam", minValue: 0, maxValue: 100, defaultValue: 50, description: "Description…" },
  stinger: { label: "New Stinger", trigger: "OnEvent", asset: "", priority: "medium" },
  event: { label: "New Event", eventType: "cinematic", blueprintRef: "", description: "Description…" },
};

let nodeId = 100;
const getId = () => `node_${++nodeId}`;

// ─── Auto-layout: BFS left-to-right columns ────────────────────────────────
function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;

  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  nodes.forEach((n) => { outgoing.set(n.id, []); incoming.set(n.id, []); });
  edges.forEach((e) => {
    outgoing.get(e.source)?.push(e.target);
    incoming.get(e.target)?.push(e.source);
  });

  // BFS from roots (no incoming edges)
  const depth = new Map<string, number>();
  const visited = new Set<string>();
  const roots = nodes.filter((n) => (incoming.get(n.id)?.length ?? 0) === 0);
  if (roots.length === 0) roots.push(nodes[0]);

  const queue: { id: string; d: number }[] = roots.map((r) => ({ id: r.id, d: 0 }));
  while (queue.length > 0) {
    const { id, d } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    depth.set(id, d);
    for (const tgt of outgoing.get(id) ?? []) {
      if (!visited.has(tgt)) {
        queue.push({ id: tgt, d: d + 1 });
      }
    }
  }

  // Disconnected nodes go to column 0
  nodes.forEach((n) => { if (!depth.has(n.id)) depth.set(n.id, 0); });

  // Group by column
  const columns = new Map<number, Node[]>();
  nodes.forEach((n) => {
    const col = depth.get(n.id) ?? 0;
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col)!.push(n);
  });

  const COL_WIDTH = 340;
  const ROW_HEIGHT = 220;

  return nodes.map((n) => {
    const col = depth.get(n.id) ?? 0;
    const colNodes = columns.get(col) ?? [n];
    const row = colNodes.indexOf(n);
    const yOffset = -(colNodes.length - 1) * ROW_HEIGHT / 2;
    return {
      ...n,
      position: {
        x: 80 + col * COL_WIDTH,
        y: 480 + yOffset + row * ROW_HEIGHT,
      },
    };
  });
}

interface CanvasProps {
  level: GameLevel;
}

export function Canvas({ level }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(level.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(level.edges);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const { mode, toggle: toggleViewMode } = useViewMode();

  useEffect(() => {
    setNodes(level.nodes);
    setEdges(level.edges);
    setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 50);
  }, [level.id, level.nodes, level.edges, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      // Handle asset drops onto nodes
      const assetData = event.dataTransfer.getData("application/scorecanvas-asset");
      if (assetData) {
        const target = (event.target as HTMLElement).closest(".react-flow__node");
        if (target) {
          const nodeId = target.getAttribute("data-id");
          if (nodeId) {
            const asset = JSON.parse(assetData);
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId && n.type === "musicState"
                  ? { ...n, data: { ...n.data, asset: asset.filename } }
                  : n
              )
            );
          }
        }
        return;
      }

      // Handle node palette drops
      const type = event.dataTransfer.getData("application/scorecanvas-node");
      if (!type || !defaultNodeData[type]) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = { id: getId(), type, position, data: { ...defaultNodeData[type] } };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const handleCleanUp = useCallback(() => {
    setNodes((nds) => autoLayout(nds, edges));
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [setNodes, edges, fitView]);

  // ─── Play Sequence: walk graph and audition each node ──────────────────────
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const [sequenceNodeId, setSequenceNodeId] = useState<string | null>(null);
  const sequenceAbort = useRef(false);

  const handlePlaySequence = useCallback(() => {
    if (sequencePlaying) {
      sequenceAbort.current = true;
      stopAudition();
      setSequencePlaying(false);
      setSequenceNodeId(null);
      return;
    }

    // Build adjacency from edges
    const outgoing = new Map<string, string[]>();
    nodes.forEach((n) => outgoing.set(n.id, []));
    edges.forEach((e) => {
      if (outgoing.has(e.source)) outgoing.get(e.source)!.push(e.target);
    });
    const incomingCount = new Map<string, number>();
    nodes.forEach((n) => incomingCount.set(n.id, 0));
    edges.forEach((e) => incomingCount.set(e.target, (incomingCount.get(e.target) ?? 0) + 1));

    // BFS order — roots first, then follow edges
    const visited = new Set<string>();
    const order: Node[] = [];
    const roots = nodes.filter((n) => (incomingCount.get(n.id) ?? 0) === 0);
    if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0]);

    const queue = [...roots];
    while (queue.length > 0) {
      const n = queue.shift()!;
      if (visited.has(n.id)) continue;
      visited.add(n.id);
      order.push(n);
      for (const targetId of outgoing.get(n.id) ?? []) {
        const target = nodes.find((nn) => nn.id === targetId);
        if (target && !visited.has(target.id)) queue.push(target);
      }
    }
    // Add any disconnected nodes
    nodes.forEach((n) => { if (!visited.has(n.id)) order.push(n); });

    // Map node type → synth category + duration
    function nodeToAudition(n: Node): { category: AssetCategory; durationMs: number } {
      const d = n.data as Record<string, unknown>;
      switch (n.type) {
        case "musicState": {
          const looping = d.looping as boolean;
          return looping
            ? { category: "loop", durationMs: 3500 }
            : { category: "intro", durationMs: 2500 };
        }
        case "transition":
          return { category: "transition", durationMs: 1800 };
        case "stinger":
          return { category: "stinger", durationMs: 1200 };
        case "parameter":
          return { category: "ambient", durationMs: 2500 };
        case "event": {
          const et = d.eventType as string;
          return et === "cinematic" || et === "igc"
            ? { category: "intro", durationMs: 2500 }
            : { category: "stinger", durationMs: 1200 };
        }
        default:
          return { category: "loop", durationMs: 2000 };
      }
    }

    sequenceAbort.current = false;
    setSequencePlaying(true);

    // Play nodes one at a time
    let i = 0;
    function playNext() {
      if (sequenceAbort.current || i >= order.length) {
        setSequencePlaying(false);
        setSequenceNodeId(null);
        return;
      }
      const n = order[i];
      const { category, durationMs } = nodeToAudition(n);
      setSequenceNodeId(n.id);
      auditionAsset({ id: n.id, category, key: "Dm", bpm: 120 });
      i++;
      setTimeout(playNext, durationMs + 300); // 300ms gap between nodes
    }
    playNext();
  }, [sequencePlaying, nodes, edges]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        defaultEdgeOptions={{ animated: true, style: { stroke: "#3a3a5c", strokeWidth: 2 } }}
        className="bg-canvas-bg"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e1e3a" />
        <Controls className="!bg-[#0d0d1a] !border-canvas-accent !rounded-lg !shadow-xl [&>button]:!bg-[#0d0d1a] [&>button]:!border-canvas-accent [&>button]:!text-canvas-muted [&>button:hover]:!text-canvas-text" />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={handlePlaySequence}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors backdrop-blur-sm shadow-lg flex items-center gap-1.5 ${
                sequencePlaying
                  ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 animate-pulse"
                  : "bg-green-900/30 text-green-400 border-green-500/40 hover:bg-green-500/20 hover:border-green-400/60"
              }`}
            >
              {sequencePlaying ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="1" width="8" height="8" rx="1" /></svg>
                  Stop Sequence
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="1,0 10,5 1,10" /></svg>
                  Play Sequence
                </>
              )}
            </button>
            <button
              onClick={toggleViewMode}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors backdrop-blur-sm shadow-lg ${
                mode === "simple"
                  ? "bg-canvas-highlight/20 text-canvas-highlight border-canvas-highlight/50 hover:bg-canvas-highlight/30"
                  : "bg-[#0d0d1a]/90 text-canvas-muted border-canvas-accent hover:text-canvas-text hover:border-canvas-highlight/50"
              }`}
            >
              {mode === "simple" ? "Detailed" : "Simple"} Mode
            </button>
            <button
              onClick={handleCleanUp}
              className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#0d0d1a]/90 text-canvas-muted border border-canvas-accent hover:text-canvas-text hover:border-canvas-highlight/50 transition-colors backdrop-blur-sm shadow-lg"
            >
              Clean Up View
            </button>
          </div>
          {sequenceNodeId && (
            <div className="mt-2 text-right">
              <span className="px-2 py-1 text-[10px] font-mono bg-green-900/40 text-green-300 border border-green-500/30 rounded-md backdrop-blur-sm">
                Now playing: {nodes.find((n) => n.id === sequenceNodeId)?.data?.label as string ?? sequenceNodeId}
              </span>
            </div>
          )}
        </Panel>
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "parameter") return "#a855f7";
            if (n.type === "stinger") return "#f97316";
            if (n.type === "transition") return "#e94560";
            if (n.type === "event") return "#e94560";
            return "#0f3460";
          }}
          maskColor="rgba(13, 13, 26, 0.85)"
          className="!bg-[#0d0d1a] !border-canvas-accent !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}

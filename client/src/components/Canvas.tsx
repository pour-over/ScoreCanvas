import { useCallback, useRef, useEffect, type DragEvent } from "react";
import { useViewMode } from "../context/ViewModeContext";
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

  // Build adjacency
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  nodes.forEach((n) => { outgoing.set(n.id, []); incoming.set(n.id, []); });
  edges.forEach((e) => {
    outgoing.get(e.source)?.push(e.target);
    incoming.get(e.source); // ensure exists
    incoming.get(e.target)?.push(e.source);
  });

  // BFS from roots to assign depth (column)
  const depth = new Map<string, number>();
  const roots = nodes.filter((n) => (incoming.get(n.id)?.length ?? 0) === 0);
  // If no roots (circular), just pick first node
  if (roots.length === 0) roots.push(nodes[0]);

  const queue: { id: string; d: number }[] = roots.map((r) => ({ id: r.id, d: 0 }));
  while (queue.length > 0) {
    const { id, d } = queue.shift()!;
    if (depth.has(id) && depth.get(id)! >= d) continue;
    depth.set(id, d);
    for (const tgt of outgoing.get(id) ?? []) {
      if (!depth.has(tgt) || depth.get(tgt)! < d + 1) {
        queue.push({ id: tgt, d: d + 1 });
      }
    }
  }

  // Assign unvisited nodes (disconnected) to column 0
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
  const PAD_X = 80;
  const PAD_Y = 80;

  const positioned = nodes.map((n) => {
    const col = depth.get(n.id) ?? 0;
    const colNodes = columns.get(col) ?? [n];
    const row = colNodes.indexOf(n);
    const totalRows = colNodes.length;
    // Center vertically
    const yOffset = -(totalRows - 1) * ROW_HEIGHT / 2;
    return {
      ...n,
      position: {
        x: PAD_X + col * COL_WIDTH,
        y: PAD_Y + 400 + yOffset + row * ROW_HEIGHT,
      },
    };
  });

  return positioned;
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

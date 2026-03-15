import { useCallback, useRef, useEffect, type DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
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

interface CanvasProps {
  level: GameLevel;
}

export function Canvas({ level }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(level.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(level.edges);
  const { screenToFlowPosition, fitView } = useReactFlow();

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

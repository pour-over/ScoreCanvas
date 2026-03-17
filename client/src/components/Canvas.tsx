import { useCallback, useRef, useEffect, useState, type DragEvent } from "react";
import { useViewMode } from "../context/ViewModeContext";
import { auditionAsset, stopAudition, setVolume, getVolume, type AssetCategory } from "../audio/synth";
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
import type { GameLevel } from "../data/projects";
// Pixel sprite is rendered inline on the canvas during sequence playback

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
  projectId: string;
}

export function Canvas({ level, projectId }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(level.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(level.edges);
  const { screenToFlowPosition, flowToScreenPosition, fitView } = useReactFlow();
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

  // ─── Undo stack for asset drops ──────────────────────────────────────────
  const [undoToast, setUndoToast] = useState<{ nodeId: string; nodeName: string; prevAsset: string; newAsset: string } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    const { nodeId, prevAsset } = undoToast;
    setNodes((nds) =>
      nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, asset: prevAsset } } : n)
    );
    setUndoToast(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  }, [undoToast, setNodes]);

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
            // Find the node and save previous asset for undo
            const targetNode = nodes.find((n) => n.id === nodeId);
            if (targetNode) {
              const prevAsset = (targetNode.data as Record<string, unknown>).asset as string ?? "";
              const nodeName = (targetNode.data as Record<string, unknown>).label as string ?? nodeId;
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === nodeId
                    ? { ...n, data: { ...n.data, asset: asset.filename } }
                    : n
                )
              );
              // Show undo toast
              if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
              setUndoToast({ nodeId, nodeName, prevAsset, newAsset: asset.filename });
              undoTimerRef.current = window.setTimeout(() => setUndoToast(null), 8000);
            }
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
    [screenToFlowPosition, setNodes, nodes]
  );

  const handleCleanUp = useCallback(() => {
    setNodes((nds) => autoLayout(nds, edges));
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [setNodes, edges, fitView]);

  // ─── Volume control ────────────────────────────────────────────────────────
  const [volume, setVolumeState] = useState(getVolume());
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    setVolume(v);
  }, []);

  // ─── Play Sequence: walk graph and audition each node ──────────────────────
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const [sequenceNodeId, setSequenceNodeId] = useState<string | null>(null);
  const [, setSequenceNodeType] = useState<string | null>(null);
  const [sequenceNodeIndex, setSequenceNodeIndex] = useState(0);
  const [sequenceTotalNodes, setSequenceTotalNodes] = useState(0);
  const [sequenceQuickMode, setSequenceQuickMode] = useState(false);
  const sequenceAbort = useRef(false);
  const sequenceOrderRef = useRef<Node[]>([]);

  // Rewind: jump back to a specific node index in the sequence
  const handleSequenceRewind = useCallback((targetIndex: number) => {
    if (!sequencePlaying || targetIndex < 0 || targetIndex >= sequenceOrderRef.current.length) return;
    // Stop current playback, restart from targetIndex
    stopAudition();
    const playOrder = sequenceOrderRef.current;
    const n = playOrder[targetIndex];
    setSequenceNodeId(n.id);
    setSequenceNodeType(n.type ?? null);
    setSequenceNodeIndex(targetIndex);

    // Find audio for this node
    const d = n.data as Record<string, unknown>;
    const assetRef = d.asset as string | undefined;
    let audioFile: string | undefined;
    if (n.type === "transition") {
      audioFile = "transition_sweep.mp3";
    } else if (assetRef && level?.assets) {
      const matched = level.assets.find((a: { filename?: string; id: string; audioFile?: string }) => a.filename === assetRef || a.id === assetRef);
      if (matched?.audioFile) audioFile = matched.audioFile;
    }
    if (!audioFile && level?.assets) {
      const amb = level.assets.find((a: { audioFile?: string; category?: string }) => a.audioFile && (a.category === "ambient" || a.category === "layer" || a.category === "loop"));
      if (amb?.audioFile) audioFile = amb.audioFile;
      else {
        const any = level.assets.find((a: { audioFile?: string; category?: string }) => a.audioFile && a.category !== "transition" && a.category !== "stinger");
        if (any?.audioFile) audioFile = any.audioFile;
      }
    }

    const category: AssetCategory = n.type === "transition" ? "transition" : "loop";
    auditionAsset({ id: n.id, category, key: "Dm", bpm: 120, audioFile, playbackMode: "full" }).then((durationMs) => {
      let i = targetIndex + 1;
      function playNext() {
        if (sequenceAbort.current || i >= playOrder.length) {
          setSequencePlaying(false);
          setSequenceNodeId(null);
          setSequenceNodeType(null);
          setSequenceNodeIndex(0);
          setSequenceTotalNodes(0);
          return;
        }
        const nn = playOrder[i];
        const dd = nn.data as Record<string, unknown>;
        const ar = dd.asset as string | undefined;
        let af: string | undefined;
        if (nn.type === "transition") af = "transition_sweep.mp3";
        else if (ar && level?.assets) {
          const m = level.assets.find((a: { filename?: string; id: string; audioFile?: string }) => a.filename === ar || a.id === ar);
          if (m?.audioFile) af = m.audioFile;
        }
        if (!af && level?.assets) {
          const f = level.assets.find((a: { audioFile?: string; category?: string }) => a.audioFile && a.category !== "transition");
          if (f?.audioFile) af = f.audioFile;
        }
        setSequenceNodeId(nn.id);
        setSequenceNodeType(nn.type ?? null);
        setSequenceNodeIndex(i);
        const cat: AssetCategory = nn.type === "transition" ? "transition" : "loop";
        auditionAsset({ id: nn.id, category: cat, key: "Dm", bpm: 120, audioFile: af, playbackMode: "full" }).then((dur) => {
          i++;
          setTimeout(playNext, (dur > 0 ? dur : 1000) + 300);
        });
      }
      setTimeout(playNext, (durationMs > 0 ? durationMs : 1000) + 300);
    });
  }, [sequencePlaying, level]);

  const handlePlaySequence = useCallback(() => {
    if (sequencePlaying) {
      sequenceAbort.current = true;
      stopAudition();
      setSequencePlaying(false);
      setSequenceNodeId(null);
      setSequenceNodeType(null);
      setSequenceNodeIndex(0);
      setSequenceTotalNodes(0);
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

    // Resolve audio file for a node
    function findAudioFile(n: Node): string | undefined {
      const d = n.data as Record<string, unknown>;
      // Music states / stingers have an asset reference
      const assetRef = d.asset as string | undefined;
      if (assetRef && level?.assets) {
        const matched = level.assets.find((a) => a.filename === assetRef || a.id === assetRef);
        if (matched?.audioFile) return matched.audioFile;
      }
      // Events (cinematics, IGCs) — find connected musicState's audio
      if (n.type === "event" || n.type === "parameter") {
        // Look at edges from/to this node, find a musicState neighbor
        const connectedIds = edges
          .filter((e) => e.source === n.id || e.target === n.id)
          .map((e) => e.source === n.id ? e.target : e.source);
        for (const cid of connectedIds) {
          const neighbor = nodes.find((nn) => nn.id === cid && nn.type === "musicState");
          if (neighbor) {
            const nd = neighbor.data as Record<string, unknown>;
            const nAsset = nd.asset as string | undefined;
            if (nAsset && level?.assets) {
              const m = level.assets.find((a) => a.filename === nAsset || a.id === nAsset);
              if (m?.audioFile) return m.audioFile;
            }
          }
        }
        // Fallback: prioritize ambient/loop/layer assets
        if (level?.assets?.length) {
          const ambient = level.assets.find((a) => a.audioFile && (a.category === "ambient" || a.category === "layer" || a.category === "loop"));
          if (ambient?.audioFile) return ambient.audioFile;
          const any = level.assets.find((a) => a.audioFile && a.category !== "transition" && a.category !== "stinger");
          if (any?.audioFile) return any.audioFile;
        }
      }
      return undefined;
    }

    // Filter: skip stingers from the playback order
    const playOrder = order.filter((n) => n.type !== "stinger");

    sequenceAbort.current = false;
    setSequencePlaying(true);
    setSequenceTotalNodes(playOrder.length);
    sequenceOrderRef.current = playOrder;

    // Play nodes one at a time — full file duration, then move on
    let i = 0;
    async function playNext() {
      if (sequenceAbort.current || i >= playOrder.length) {
        setSequencePlaying(false);
        setSequenceNodeId(null);
        setSequenceNodeType(null);
        setSequenceNodeIndex(0);
        setSequenceTotalNodes(0);
        return;
      }
      const n = playOrder[i];
      const audioFile = n.type === "transition" ? "transition_sweep.mp3" : findAudioFile(n);
      const category: AssetCategory = n.type === "transition" ? "transition" : "loop";

      setSequenceNodeId(n.id);
      setSequenceNodeType(n.type ?? null);
      setSequenceNodeIndex(i);

      // Quick mode: transition preview (first/last 10s = ~20s), Full mode: entire file
      const isQuick = sequenceQuickMode;
      const actualDurationMs = await auditionAsset({
        id: n.id,
        category,
        key: "Dm",
        bpm: 120,
        audioFile,
        playbackMode: isQuick && n.type !== "transition" ? "transition" : "full",
      });

      i++;
      // In quick mode, cap at 20s per node; in full mode play entire file
      const maxMs = isQuick ? Math.min(actualDurationMs, 20500) : actualDurationMs;
      const waitMs = maxMs > 0 ? maxMs + 300 : 1000;
      setTimeout(playNext, waitMs);
    }
    playNext();
  }, [sequencePlaying, nodes, edges, level]);

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
          <div className="flex gap-2 items-center">
            {/* Volume control */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0d0d1a]/90 border border-canvas-accent backdrop-blur-sm shadow-lg">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-canvas-muted">
                <path d="M8 1.5l-4 3H1v7h3l4 3V1.5z"/>
                {volume > 0 && <path d="M11 4.5c1.2 1.2 1.2 5.8 0 7" fill="none" stroke="currentColor" strokeWidth="1.5"/>}
                {volume > 0.5 && <path d="M13 2.5c2 2.5 2 8.5 0 11" fill="none" stroke="currentColor" strokeWidth="1.5"/>}
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-canvas-highlight cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
              <span className="text-[9px] font-mono text-canvas-muted w-7 text-right">{Math.round(volume * 100)}%</span>
            </div>

            {/* Play Sequence */}
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
                  Stop
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="1,0 10,5 1,10" /></svg>
                  Play Sequence
                </>
              )}
            </button>

            {/* Transition Check / Full toggle */}
            <button
              onClick={() => setSequenceQuickMode((q) => !q)}
              className={`px-2 py-1.5 text-[10px] font-semibold rounded-lg border transition-colors backdrop-blur-sm shadow-lg ${
                sequenceQuickMode
                  ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20"
                  : "bg-amber-900/30 text-amber-400 border-amber-500/40 hover:bg-amber-500/20"
              }`}
              title={sequenceQuickMode ? "Transition Check: plays ins/outs of every change (~20s per node)" : "Full Score: plays entire file per node"}
            >
              {sequenceQuickMode ? "Trans Check" : "Full Score"}
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
          {sequencePlaying && sequenceNodeId && (() => {
            const order = sequenceOrderRef.current;
            const currentNode = order[sequenceNodeIndex];
            const nextNode = order[sequenceNodeIndex + 1];
            const afterNext = order[sequenceNodeIndex + 2];
            const currentLabel = (currentNode?.data as Record<string, unknown>)?.label as string ?? "...";
            const currentType = currentNode?.type ?? "musicState";
            const nextLabel = nextNode ? (nextNode.data as Record<string, unknown>).label as string : null;
            const nextType = nextNode?.type ?? "musicState";
            const afterLabel = afterNext ? (afterNext.data as Record<string, unknown>).label as string : null;
            const afterType = afterNext?.type ?? "musicState";

            // Icon per type
            const typeIcon = (t: string) => {
              if (t === "transition") return "→";
              if (t === "stinger") return "◆";
              if (t === "event") return "★";
              if (t === "parameter") return "◎";
              return "♪";
            };
            const typeColor = (t: string) => {
              if (t === "transition") return "text-red-400";
              if (t === "stinger") return "text-orange-400";
              if (t === "event") return "text-cyan-400";
              if (t === "parameter") return "text-purple-400";
              return "text-green-300";
            };

            // Upcoming message
            let upcomingMsg = "";
            if (nextType === "transition") upcomingMsg = "Coming up to transition!";
            else if (nextType === "event") upcomingMsg = "Event cue incoming!";
            else if (nextType === "stinger") upcomingMsg = "Stinger hit next!";
            else if (nextLabel) upcomingMsg = `Up next: ${nextLabel}`;

            return (
              <div className="mt-2 px-3 py-2 rounded-lg bg-[#0d0d1a]/95 border border-canvas-accent backdrop-blur-sm shadow-xl" style={{ minWidth: 280 }}>
                {/* Now Playing header */}
                <div className="text-[8px] font-mono text-green-500/70 uppercase tracking-widest mb-1">Now Playing</div>

                {/* Current track */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className={`text-[12px] font-bold ${typeColor(currentType)}`}>
                    {typeIcon(currentType)} {currentLabel}
                  </span>
                  <span className="text-[9px] text-canvas-muted font-mono ml-auto">
                    {sequenceNodeIndex + 1}/{sequenceTotalNodes}
                  </span>
                </div>

                {/* Upcoming message */}
                {upcomingMsg && (
                  <div className="text-[9px] text-amber-400/80 font-mono italic mb-1.5">
                    {upcomingMsg}
                  </div>
                )}

                {/* Sequence path: current → next → after */}
                <div className="flex items-center gap-1 text-[9px] font-mono flex-wrap">
                  <span className={`font-bold ${typeColor(currentType)}`}>{typeIcon(currentType)} {currentLabel}</span>
                  {nextLabel && (
                    <>
                      <span className="text-canvas-muted mx-0.5">→</span>
                      <span className={typeColor(nextType)}>
                        {nextType === "stinger" ? "◆ " : nextType === "transition" ? "→ " : typeIcon(nextType) + " "}
                        {nextLabel}
                      </span>
                    </>
                  )}
                  {afterLabel && (
                    <>
                      <span className="text-canvas-muted mx-0.5">→</span>
                      <span className={`${typeColor(afterType)} opacity-60`}>
                        {afterType === "stinger" ? "◆ " : afterType === "transition" ? "→ " : typeIcon(afterType) + " "}
                        {afterLabel}
                      </span>
                    </>
                  )}
                </div>

                {/* Rewind dots */}
                <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-canvas-accent/30">
                  {order.map((_, idx) => {
                    const isCurrent = idx === sequenceNodeIndex;
                    const isPast = idx < sequenceNodeIndex;
                    const nType = order[idx]?.type ?? "musicState";
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSequenceRewind(idx)}
                        title={(order[idx]?.data as Record<string, unknown>)?.label as string ?? `Node ${idx + 1}`}
                      >
                        <div
                          className="rounded-full transition-all"
                          style={{
                            width: isCurrent ? 8 : nType === "transition" ? 6 : 5,
                            height: isCurrent ? 8 : nType === "transition" ? 3 : 5,
                            borderRadius: nType === "transition" ? 2 : 999,
                            background: isCurrent ? "#4ade80" : isPast ? "#4ade8066" : "#3a3a5c",
                            boxShadow: isCurrent ? "0 0 6px #4ade80" : "none",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
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
        {/* Pixel sprite running along node paths — big, flashy, animated */}
        {sequencePlaying && sequenceNodeId && (() => {
          const currentNode = nodes.find((n) => n.id === sequenceNodeId);
          if (!currentNode) return null;
          const screenPos = flowToScreenPosition({ x: currentNode.position.x, y: currentNode.position.y });
          const wrapperRect = reactFlowWrapper.current?.getBoundingClientRect();
          if (!wrapperRect) return null;
          const relX = screenPos.x - wrapperRect.left;
          const relY = screenPos.y - wrapperRect.top - 50;
          const isJourney = projectId === "journey-2";
          const px = 4; // bigger pixels
          const nodeType = currentNode.type ?? "musicState";

          // Alternating dance frames based on time
          const t = Date.now();
          const danceBeat = Math.floor(t / 400) % 4;
          const bobY = Math.sin(t / 300) * 3;
          const isEmoting = Math.floor(t / 3000) % 5 === 0; // emote every ~15s

          // Journey: scarf figure, Bloodborne: cat in pajamas
          const frames = isJourney ? [
            // Normal run / dance frames
            [["","","r","r","r","",""],["","r","r","r","r","r",""],["","","","w","","",""],["","","w","w","w","",""],["","","","w","","",""],["","","w","","w","",""],["","w","","","","w",""]],
            [["","r","r","r","","",""],["r","r","r","r","r","",""],["","","w","w","","",""],["","w","w","w","","",""],["","","w","","","",""],["","","w","w","","",""],["","w","","","w","",""]],
            // Dance!
            [["","","","r","r","r",""],["","","r","r","r","r",""],["","","","w","","",""],["","","w","w","w","",""],["","","","w","","",""],["","w","","","","w",""],["w","","","","","","w"]],
            // Emote — arms up
            [["r","r","r","r","r","r","r"],["","","r","r","r","",""],["y","","","w","","","y"],["","y","w","w","w","y",""],["","","","w","","",""],["","","w","","w","",""],["","w","","","","w",""]],
          ] : [
            [["","","p","p","p","",""],["","","p","g","p","",""],["","","","p","","",""],["","","b","b","b","",""],["","","b","b","b","",""],["","","","b","","",""],["","","b","","b","",""]],
            [["","p","p","p","","",""],["","p","g","p","","",""],["","","p","","","",""],["","b","b","b","","",""],["","b","b","b","","",""],["","","b","","","",""],["","","b","b","","",""]],
            [["","","","p","p","p",""],["","","","p","g","p",""],["","","","","p","",""],["","","","b","b","b",""],["","","","b","b","b",""],["","","b","","","b",""],["","b","","","","","b"]],
            [["c","","p","p","p","","c"],["","c","p","g","p","c",""],["","","","p","","",""],["","t","b","b","b","t",""],["","","b","b","b","",""],["","","","b","","",""],["","","b","","b","",""]],
          ];
          const frameIdx = isEmoting ? 3 : danceBeat % 3;
          const sprite = frames[frameIdx];
          const colorMap: Record<string, string> = {
            r: "#e94560", w: "#e0d6c8", y: "#fbbf24",
            p: "#f0abfc", g: "#4ade80", b: "#93c5fd", t: "#facc15", c: "#c084fc",
          };

          // Flash color based on node type
          const glowColor = nodeType === "transition" ? "#e94560"
            : nodeType === "event" ? "#22d3ee"
            : nodeType === "parameter" ? "#a855f7"
            : isJourney ? "#fbbf24" : "#c084fc";

          return (
            <div
              className="absolute z-50 pointer-events-none transition-all duration-700 ease-in-out"
              style={{ left: relX, top: relY + bobY }}
            >
              {/* Pulsing glow ring */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full animate-ping"
                style={{ width: 20, height: 6, background: `${glowColor}33` }} />
              {/* Glow under sprite */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full blur-md"
                style={{ width: 24, height: 8, background: `${glowColor}66` }} />
              {/* Sprite label */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-mono font-bold"
                style={{ color: glowColor, textShadow: `0 0 6px ${glowColor}` }}>
                {isEmoting ? (isJourney ? "♪ VIBING ♪" : "♪ PURRING ♪") : ""}
              </div>
              {/* Sprite */}
              <div style={{ imageRendering: "pixelated" as const, filter: `drop-shadow(0 0 4px ${glowColor}88)` }}>
                {sprite.map((row, ri) => (
                  <div key={ri} className="flex">
                    {row.map((pixel, ci) => (
                      <div key={ci} style={{
                        width: px, height: px,
                        background: pixel ? colorMap[pixel] ?? "transparent" : "transparent",
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              {/* Sparkle particles when emoting */}
              {isEmoting && [0, 1, 2, 3].map((i) => (
                <div key={`sparkle-${i}`} className="absolute rounded-full animate-bounce"
                  style={{
                    width: 3, height: 3,
                    left: 4 + i * 7 + Math.sin(t / 200 + i) * 4,
                    top: -8 + Math.cos(t / 300 + i * 2) * 6,
                    background: glowColor,
                    opacity: 0.7,
                    animationDelay: `${i * 0.15}s`,
                  }} />
              ))}
            </div>
          );
        })()}

        {/* Undo toast for asset replacement */}
        {undoToast && (
          <Panel position="bottom-center">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0d0d1a]/95 border border-canvas-accent rounded-lg backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-2">
              <span className="text-[11px] text-canvas-text">
                <span className="text-canvas-highlight font-semibold">{undoToast.newAsset}</span>
                {" → "}
                <span className="text-canvas-muted">{undoToast.nodeName}</span>
              </span>
              <button
                onClick={handleUndo}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-900/30 border border-amber-500/40 rounded hover:bg-amber-500/20 transition-colors"
              >
                Undo
              </button>
              <button
                onClick={() => { setUndoToast(null); if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }}
                className="text-canvas-muted hover:text-canvas-text text-xs"
              >
                ✕
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

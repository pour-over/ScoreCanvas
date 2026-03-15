import type { DragEvent } from "react";
import type { GameLevel } from "../data/levels";
import { LevelBrowser } from "./LevelBrowser";
import { AssetBrowser } from "./AssetBrowser";

const nodeTemplates = [
  { type: "musicState", label: "Music State", description: "Playback state (Explore, Combat…)" },
  { type: "transition", label: "Transition", description: "Rule for moving between states" },
  { type: "parameter", label: "Parameter", description: "RTPC / game-driven value" },
  { type: "stinger", label: "Stinger", description: "One-shot triggered event" },
  { type: "event", label: "Game Event", description: "Cinematic, IGC, Button Press…" },
];

interface SidebarProps {
  levels: GameLevel[];
  selectedLevelId: string;
  onSelectLevel: (id: string) => void;
  currentLevel: GameLevel;
}

export function Sidebar({ levels, selectedLevelId, onSelectLevel, currentLevel }: SidebarProps) {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/scorecanvas-node", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 bg-[#0d0d1a] border-r border-canvas-accent flex flex-col shrink-0 overflow-hidden">
      {/* Level Browser */}
      <div className="px-3 pt-3 pb-2 overflow-y-auto max-h-[280px]">
        <LevelBrowser levels={levels} selectedId={selectedLevelId} onSelect={onSelectLevel} />
      </div>

      <div className="mx-3 border-t border-canvas-accent" />

      {/* Node Palette */}
      <div className="px-3 py-2">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-canvas-muted px-1 mb-2">Add Nodes</h2>
        <div className="grid grid-cols-2 gap-1.5">
          {nodeTemplates.map((tpl) => (
            <div
              key={tpl.type}
              className="bg-canvas-bg border border-canvas-accent rounded px-2 py-1.5 cursor-grab active:cursor-grabbing hover:border-canvas-highlight/50 transition-colors"
              draggable
              onDragStart={(e) => onDragStart(e, tpl.type)}
            >
              <div className="text-[10px] font-medium text-canvas-text">{tpl.label}</div>
              <div className="text-[9px] text-canvas-muted leading-tight">{tpl.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-canvas-accent" />

      {/* Asset Browser */}
      <div className="px-3 py-2 overflow-y-auto flex-1">
        <AssetBrowser assets={currentLevel.assets} />
      </div>
    </aside>
  );
}

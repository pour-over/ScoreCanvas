import { useState, type DragEvent } from "react";
import type { GameLevel, GameProject } from "../data/projects";
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
  projects: GameProject[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  levels: GameLevel[];
  selectedLevelId: string;
  onSelectLevel: (id: string) => void;
  currentLevel: GameLevel;
}

function CollapsibleSection({ title, defaultOpen = true, count, children }: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-canvas-accent/20 transition-colors"
      >
        <svg
          width="8" height="8" viewBox="0 0 8 8" fill="currentColor"
          className={`text-canvas-muted/60 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        >
          <polygon points="1,0 7,4 1,8" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-canvas-muted flex-1 text-left">{title}</span>
        {count !== undefined && (
          <span className="text-[9px] font-mono text-canvas-muted/40">{count}</span>
        )}
      </button>
      {open && <div className="px-3 pb-2">{children}</div>}
    </div>
  );
}

export function Sidebar({ projects, selectedProjectId, onSelectProject, levels, selectedLevelId, onSelectLevel, currentLevel }: SidebarProps) {
  const [showAllAssets, setShowAllAssets] = useState(false);

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/scorecanvas-node", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Collect all assets across levels for "All Assets" mode
  const allAssets = showAllAssets
    ? levels.flatMap((l) => l.assets.map((a) => ({ ...a, id: `${l.id}-${a.id}` })))
    : currentLevel.assets;

  return (
    <aside data-tour="sidebar" className="w-60 bg-[#0d0d1a] border-r border-canvas-accent flex flex-col shrink-0 overflow-hidden">
      {/* Project Switcher */}
      <div className="px-2 pt-2 pb-1">
        <div className="flex gap-1 bg-canvas-bg rounded-lg p-0.5">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`flex-1 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all truncate ${
                selectedProjectId === proj.id
                  ? "bg-canvas-highlight/20 text-canvas-highlight border border-canvas-highlight/40 shadow-sm"
                  : "text-canvas-muted hover:text-canvas-text hover:bg-canvas-accent/30 border border-transparent"
              }`}
              title={proj.name}
            >
              {proj.id === "journey-2" ? "Journey 2" : "Bloodborne 2"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-canvas-accent" />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Levels */}
        <CollapsibleSection title="Levels" count={levels.length}>
          <LevelBrowser levels={levels} selectedId={selectedLevelId} onSelect={onSelectLevel} />
        </CollapsibleSection>

        <div className="mx-3 border-t border-canvas-accent" />

        {/* Node Palette */}
        <CollapsibleSection title="Add Nodes" defaultOpen={false} count={nodeTemplates.length}>
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
        </CollapsibleSection>

        <div className="mx-3 border-t border-canvas-accent" />

        {/* Level Assets */}
        <CollapsibleSection title="Level Assets" count={allAssets.length}>
          {/* Toggle: This Level / All Levels */}
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setShowAllAssets(false)}
              className={`flex-1 px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                !showAllAssets
                  ? "bg-canvas-highlight/20 text-canvas-highlight border border-canvas-highlight/30"
                  : "text-canvas-muted border border-canvas-accent hover:text-canvas-text"
              }`}
            >
              This Level
            </button>
            <button
              onClick={() => setShowAllAssets(true)}
              className={`flex-1 px-1.5 py-0.5 text-[9px] font-mono rounded transition-colors ${
                showAllAssets
                  ? "bg-canvas-highlight/20 text-canvas-highlight border border-canvas-highlight/30"
                  : "text-canvas-muted border border-canvas-accent hover:text-canvas-text"
              }`}
            >
              All Levels
            </button>
          </div>
          <AssetBrowser assets={allAssets} />
        </CollapsibleSection>
      </div>
    </aside>
  );
}

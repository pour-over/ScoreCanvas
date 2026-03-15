import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./components/Canvas";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ProjectAssets } from "./components/ProjectAssets";
import { ExportModal } from "./components/ExportModal";
import { ViewModeProvider } from "./context/ViewModeContext";
import { levels } from "./data/levels";
import "./App.css";

export default function App() {
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id);
  const [showProjectAssets, setShowProjectAssets] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const currentLevel = levels.find((l) => l.id === selectedLevelId) ?? levels[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas-bg">
      <TopBar
        projectName="JOURNEY 2: THE RECKONING"
        levelName={currentLevel.name}
        levelSubtitle={currentLevel.subtitle}
        nodeCount={currentLevel.nodes.length}
        edgeCount={currentLevel.edges.length}
        assetCount={currentLevel.assets.length}
        onOpenProjectAssets={() => setShowProjectAssets(true)}
        onOpenExport={() => setShowExport(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          levels={levels}
          selectedLevelId={selectedLevelId}
          onSelectLevel={setSelectedLevelId}
          currentLevel={currentLevel}
        />
        <ViewModeProvider>
          <ReactFlowProvider>
            <Canvas level={currentLevel} />
          </ReactFlowProvider>
        </ViewModeProvider>
      </div>
      {showProjectAssets && (
        <ProjectAssets levels={levels} onClose={() => setShowProjectAssets(false)} />
      )}
      {showExport && (
        <ExportModal level={currentLevel} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

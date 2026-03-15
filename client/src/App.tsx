import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./components/Canvas";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { levels } from "./data/levels";
import "./App.css";

export default function App() {
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0].id);
  const currentLevel = levels.find((l) => l.id === selectedLevelId) ?? levels[0];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas-bg">
      <TopBar
        projectName="SAURIAN RIFT"
        levelName={currentLevel.name}
        levelSubtitle={currentLevel.subtitle}
        nodeCount={currentLevel.nodes.length}
        edgeCount={currentLevel.edges.length}
        assetCount={currentLevel.assets.length}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          levels={levels}
          selectedLevelId={selectedLevelId}
          onSelectLevel={setSelectedLevelId}
          currentLevel={currentLevel}
        />
        <ReactFlowProvider>
          <Canvas level={currentLevel} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

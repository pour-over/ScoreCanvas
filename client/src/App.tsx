import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./components/Canvas";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ProjectAssets } from "./components/ProjectAssets";
import { ExportModal } from "./components/ExportModal";
import { StatusReport } from "./components/StatusReport";
import { ViewModeProvider } from "./context/ViewModeContext";
import { projects } from "./data/projects";
import "./App.css";

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const currentProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];

  const [selectedLevelId, setSelectedLevelId] = useState(currentProject.levels[0].id);
  const currentLevel = currentProject.levels.find((l) => l.id === selectedLevelId) ?? currentProject.levels[0];

  const [showProjectAssets, setShowProjectAssets] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showStatusReport, setShowStatusReport] = useState(false);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = projects.find((p) => p.id === projectId) ?? projects[0];
    setSelectedLevelId(proj.levels[0].id);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-canvas-bg">
      <TopBar
        projectName={currentProject.name}
        levelName={currentLevel.name}
        levelSubtitle={currentLevel.subtitle}
        nodeCount={currentLevel.nodes.length}
        edgeCount={currentLevel.edges.length}
        assetCount={currentLevel.assets.length}
        onOpenProjectAssets={() => setShowProjectAssets(true)}
        onOpenExport={() => setShowExport(true)}
        onOpenStatusReport={() => setShowStatusReport(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          levels={currentProject.levels}
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
        <ProjectAssets levels={currentProject.levels} projectName={currentProject.name} onClose={() => setShowProjectAssets(false)} />
      )}
      {showExport && (
        <ExportModal level={currentLevel} onClose={() => setShowExport(false)} />
      )}
      {showStatusReport && (
        <StatusReport levels={currentProject.levels} onClose={() => setShowStatusReport(false)} />
      )}
    </div>
  );
}

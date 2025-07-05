import React from "react";
import {
  LayoutPanelTop,
  Image,
  Paintbrush,
  Layers,
  Grid3x3,
} from "lucide-react";
import ElementsSection from "./ElementsSection";
import ShapeList from "./ShapeList";
import CanvasSection from "./CanvasSection";
import { GridSection } from "./GridSection";

const Sidebar = ({ onSectionClick, activeSection, addShape, handleImageUpload, shapes, onSelectShape, onReorder, onLockShape, canvasSize, updateCanvasSize, downloadCanvas, setGridCols, setGridRows, gridCols, gridRows, generateGridImageWithWorker, showGrid, downloadGrid, gridImage, borderEnabled, setBorderEnabled, borderWidth, setBorderWidth, borderColor, setBorderColor }) => {
  const sections = [
    { label: "Elements", icon: LayoutPanelTop, id: "elements" },
    // { label: "Images", icon: Image, id: "images" },
    { label: "Canvas", icon: Paintbrush, id: "canvas" },
    { label: "Layers", icon: Layers, id: "shapes" },
    { label: "Grid", icon: Grid3x3, id: "grid" },
  ];

  return (
    <div className="flex h-full w-full bg-white">
      {/* Vertical Tabs */}
      <nav className="flex flex-col items-center py-6 px-1 bg-gray-400 gap-2 border-r border-gray-200 h-full min-w-[60px] max-w-[70px]">
        {sections.map(({ label, icon: Icon, id }) => (
          <button
            key={id}
            onClick={() => onSectionClick(id)}
            className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg transition font-medium text-xs ${activeSection === id ? 'bg-teal-100 text-teal-800 shadow' : 'hover:bg-gray-200 text-gray-800'}`}
            title={label}
            type="button"
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[11px]">{label}</span>
          </button>
        ))}
      </nav>
      {/* Section Content */}
      <div className="flex-1 p-2 flex flex-col gap-4 h-full overflow-y-auto bg-gray-200" style={{maxWidth: 320}}>
        {activeSection === "elements" && <ElementsSection addShape={addShape} handleImageUpload={handleImageUpload} />}
        {activeSection === "shapes" && (
          <ShapeList
            shapes={shapes}
            onSelectShape={onSelectShape}
            onReorder={onReorder}
            onLockShape={onLockShape}
          />
        )}
        {activeSection === "canvas" && (
          <CanvasSection canvasSize={canvasSize} updateCanvasSize={updateCanvasSize} downloadCanvas={downloadCanvas} />
        )}
        {activeSection === "grid" && (
          <GridSection 
            setGridCols={setGridCols} 
            setGridRows={setGridRows} 
            gridCols={gridCols} 
            gridRows={gridRows} 
            generateGridImageWithWorker={generateGridImageWithWorker} 
            showGrid={showGrid}
            downloadGrid={downloadGrid}
            gridImage={gridImage}
            borderEnabled={borderEnabled}
            setBorderEnabled={setBorderEnabled}
            borderWidth={borderWidth}
            setBorderWidth={setBorderWidth}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;

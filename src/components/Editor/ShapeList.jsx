import React, { useState } from "react";
import { Circle, Square, Triangle, ImageIcon, Lock, Unlock, Eye, EyeOff, Layers } from "lucide-react";

const ShapeIcon = ({ type }) => {
  switch (type) {
    case "circle":
      return <Circle className="w-4 h-4" />;
    case "square":
      return <Square className="w-4 h-4" />;
    case "triangle":
      return <Triangle className="w-4 h-4" />;
    case "image":
      return <ImageIcon className="w-4 h-4" />;
    default:
      return null;
  }
};

const hslToHex = (hsl) => {
  const [h, s, l] = hsl
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(Number);

  const a = s / 100;
  const b = l / 100;

  const k = (n) => (n + h / 30) % 12;
  const f = (n) =>
    Math.round(255 * (b - a * Math.min(b, 1 - b) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));

  return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};

/**
 * ShapeList
 * @param {Object[]} shapes - Array of shape objects
 * @param {Function} onSelectShape - Callback when a shape is selected
 * @param {Function} onReorder - Callback when shapes are reordered (fromIndex, toIndex)
 * @param {Function} onLockShape - Callback when a shape is locked/unlocked
 */
const ShapeList = ({ shapes, onSelectShape, onReorder, onLockShape }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-base">Shape Layers</span>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
          {shapes.length} shapes
        </span>
      </div>
      
      {shapes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
            <Layers className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm">No shapes yet</p>
          <p className="text-xs text-gray-400">Add shapes from the Elements tab</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {shapes.map((shape, index) => {
            const isDragging = index === draggedIndex;
            const isDragOver = index === dragOverIndex && draggedIndex !== null && draggedIndex !== index;
            return (
              <div
                key={index}
                className={`group relative bg-white border border-gray-200 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  isDragOver ? "bg-blue-50 border-blue-300 shadow-md" : 
                  isDragging ? "opacity-50" : 
                  "hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectShape(shape)}
                aria-grabbed={isDragging}
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  {/* Shape Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                    shape.locked ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
                  }`}>
                    <ShapeIcon type={shape.type} className={shape.locked ? 'text-gray-400' : 'text-gray-600'} />
                  </div>
                  
                  {/* Shape Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-700 capitalize truncate">
                        {shape.type}
                      </p>
                      {shape.locked && (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: shape.color }}
                      />
                      <p className="text-xs text-gray-500 truncate">
                        {shape.color}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLockShape(shape);
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      title={shape.locked ? "Unlock shape" : "Lock shape"}
                      type="button"
                    >
                      {shape.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                
                {/* Drag Handle */}
                {/* <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 bg-gray-300 rounded-full mb-1"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full mb-1"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div> */}
              </div>
            );
          })}
        </div>
      )}
      
      {shapes.length > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Drag to reorder • Click to select • Use lock to prevent changes
        </div>
      )}
    </div>
  );
};

export default ShapeList;

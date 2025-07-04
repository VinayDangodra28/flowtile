import React, { useState } from "react";
import { Circle, Square, Triangle, ImageIcon } from "lucide-react"; // You can swap with any icon library you use

const ShapeIcon = ({ type }) => {
  switch (type) {
    case "circle":
      return <Circle className="w-5 h-5" />;
    case "square":
      return <Square className="w-5 h-5" />;
    case "triangle":
      return <Triangle className="w-5 h-5" />;
    case "image":
      return <ImageIcon className="w-5 h-5" />;
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
 */
const ShapeList = ({ shapes, onSelectShape, onReorder }) => {
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
    <div className="w-full max-w-sm mx-auto mt-4 rounded-xl overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {shapes.map((shape, index) => {
          const isDragging = index === draggedIndex;
          const isDragOver = index === dragOverIndex && draggedIndex !== null && draggedIndex !== index;
          return (
            <li
              key={index}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 ${
                isDragOver ? "bg-blue-100" : isDragging ? "opacity-50" : "hover:bg-gray-50"
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
              <div className="flex-shrink-0 p-1 rounded-full border border-gray-300 bg-white">
                <ShapeIcon type={shape.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 capitalize">{shape.type}</p>
                <p className="text-xs text-gray-500">
                  Color: <span style={{ color: shape.color }}>{shape.color}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShapeList;

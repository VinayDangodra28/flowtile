import React from "react";
import { Circle, Square, Triangle, ImageIcon } from "lucide-react"; // You can swap with any icon library you use

const ShapeIcon = ({ type }) => {
  switch (type) {
    case "circle":
      return <Circle className="w-5 h-5" />;
    case "square":
      return <Square className="w-5 h-5 " />;
    case "triangle":
      return <Triangle className="w-5 h-5 " />;
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

const ShapeList = ({ shapes, onSelectShape, onDragStart, onDragOver, onDrop }) => {
  return (
    <div className="w-full max-w-sm mx-auto mt-4 rounded-xl overflow-hidden ">
      <ul className="divide-y divide-gray-100">
        {shapes.map((shape, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={() => onDrop(index)}
            onClick={() => onSelectShape(shape)}
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
        ))}
      </ul>
    </div>
  );
};

export default ShapeList;

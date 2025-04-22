import React from "react";
import {
  LayoutPanelTop,
  Image,
  Paintbrush,
  Layers,
  Grid3x3,
} from "lucide-react";

const Sidebar = ({ onSectionClick }) => {
  const sections = [
    { label: "Elements", icon: LayoutPanelTop, id: "elements" },
    // { label: "Images", icon: Image, id: "images" },
    { label: "Canvas", icon: Paintbrush, id: "canvas" },
    { label: "Layers", icon: Layers, id: "shapes" },
    { label: "Grid", icon: Grid3x3, id: "grid" },
  ];

  return (
    <aside className="w-1/4 flex flex-col items-center py-4 space-y-6 shadow ">
      {sections.map(({ label, icon: Icon, id }) => (
        <button
          key={id}
          onClick={() => onSectionClick(id)}
          className="group relative flex flex-col items-center justify-center w-10 h-10 hover:bg-gray-700 rounded-lg transition"
        >
          <Icon className="w-5 h-5" />
          <span className="absolute left-full ml-2 whitespace-nowrap text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            {label}
          </span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;

import React from "react";

const LayersSection = ({ deleteShape, moveShapeUp, moveShapeDown }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Layers</h2>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded mb-2 w-full"
        onClick={deleteShape}
      >
        Delete Selected
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-2 w-full"
        onClick={moveShapeUp}
      >
        Move Shape Up
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-2 w-full"
        onClick={moveShapeDown}
      >
        Move Shape Down
      </button>
    </div>
  );
};

export default LayersSection;

import React from "react";

const ArrangeSection = ({ selectedShape, moveShapeUp, moveShapeDown, deleteShape, setShapes, shapes, duplicateShape }) => {
  return (
    <div className="arrange-section">
      <h2 className="text-xl font-semibold mb-2">Arrange</h2>
      {selectedShape ? (
        <>
          <label>
            Color:
            <input
              type="color"
              value={selectedShape.color}
              onChange={(e) => {
                selectedShape.color = e.target.value;
                // Force re-render
                setShapes([...shapes]);
              }}
              className="ml-2"
            />
          </label>
          <br />
          <div className="rotation-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rotation:</label>
            <div className="flex items-center gap-2">
              {/* Dial-like control */}
              <input
                type="range"
                min="0"
                max="360"
                value={(selectedShape.rotation * 180) / Math.PI}
                onChange={(e) => {
                  selectedShape.rotation = (e.target.value * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="rotation-dial"
              />

              {/* Numeric input */}
              <input
                type="number"
                min="0"
                max="360"
                value={Math.round((selectedShape.rotation * 180) / Math.PI)}
                onChange={(e) => {
                  let value = Math.min(Math.max(e.target.value, 0), 360); // Clamp value between 0 and 360
                  selectedShape.rotation = (value * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="rotation-input border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />

              {/* Rotation preview */}
              <span className="rotation-preview text-sm text-gray-500">
                {Math.round((selectedShape.rotation * 180) / Math.PI)}°
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 mt-4">Layering</h3>
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
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={deleteShape}
          >
            Delete Selected
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={duplicateShape}
          >
            Duplicate Selected
          </button>
        </>
      ) : (
        <p>Select a shape to edit</p>
      )}
    </div>
  );
};

export default ArrangeSection;

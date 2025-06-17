import React, { useState } from "react";

const ArrangeSection = ({ selectedShape, moveShapeUp, moveShapeDown, deleteShape, setShapes, shapes, duplicateShape }) => {
  const [isShadowExpanded, setIsShadowExpanded] = useState(false);

  return (
    <div className="arrange-section flex flex-col space-y-4 max-w-full overflow-x-auto overflow-y-scroll">
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
                setShapes([...shapes]);
              }}
              className="ml-2"
            />
          </label>
          <br />
          <div className="rotation-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rotation:</label>
            <div className="flex items-center gap-2">
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
              <input
                type="number"
                min="0"
                max="360"
                value={Math.round((selectedShape.rotation * 180) / Math.PI)}
                onChange={(e) => {
                  let value = Math.min(Math.max(e.target.value, 0), 360);
                  selectedShape.rotation = (value * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="rotation-input border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <span className="rotation-preview text-sm text-gray-500">
                {Math.round((selectedShape.rotation * 180) / Math.PI)}°
              </span>
            </div>
          </div>

          {/* Opacity Control */}
          <div className="opacity-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shape Opacity: {selectedShape.opacity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedShape.opacity}
              onChange={(e) => {
                let newOpacity = parseFloat(e.target.value);
                newOpacity = Math.max(0, Math.min(1, newOpacity));
                console.log("Updating opacity to:", newOpacity);
                selectedShape.opacity = newOpacity;
                setShapes([...shapes]);
              }}
              className="w-full"
            />
          </div>

          {/* Shadow Controls */}
          <div className="shadow-control">
            <button
              className="bg-gray-300 px-4 py-2 rounded w-full text-left"
              onClick={() => setIsShadowExpanded(!isShadowExpanded)}
            >
              Shadow Settings {isShadowExpanded ? "▲" : "▼"}
            </button>

            {isShadowExpanded && (
              <div className="mt-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Shadow Opacity:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedShape.shadow.opacity}
                  onChange={(e) => {
                    selectedShape.shadow.opacity = parseFloat(e.target.value);
                    setShapes([...shapes]);
                  }}
                  className="w-full"
                />
                <label className="block text-sm font-medium text-gray-700">Shadow Color:</label>
                <input
                  type="color"
                  value={selectedShape.shadow.color}
                  onChange={(e) => {
                    selectedShape.shadow.color = e.target.value;
                    setShapes([...shapes]);
                  }}
                  className="w-full"
                />
                <label className="block text-sm font-medium text-gray-700">Shadow Blur:</label>
                <input
                  type="number"
                  value={selectedShape.shadow.blur}
                  onChange={(e) => {
                    selectedShape.shadow.blur = parseInt(e.target.value, 10);
                    setShapes([...shapes]);
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <label className="block text-sm font-medium text-gray-700">Shadow Offset X:</label>
                <input
                  type="number"
                  value={selectedShape.shadow.offsetX}
                  onChange={(e) => {
                    selectedShape.shadow.offsetX = parseInt(e.target.value, 10);
                    setShapes([...shapes]);
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <label className="block text-sm font-medium text-gray-700">Shadow Offset Y:</label>
                <input
                  type="number"
                  value={selectedShape.shadow.offsetY}
                  onChange={(e) => {
                    selectedShape.shadow.offsetY = parseInt(e.target.value, 10);
                    setShapes([...shapes]);
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            )}
          </div>

          {/* Gradient Control */}
          <div className="gradient-control p-2 border rounded bg-gray-50 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gradient Editor:</label>
            {selectedShape.gradient && selectedShape.gradient.length > 0 ? (
              <>
                {selectedShape.gradient.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={e => {
                        selectedShape.gradient[idx].color = e.target.value;
                        setShapes([...shapes]);
                      }}
                      className="w-8 h-8 border rounded"
                    />
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={stop.offset}
                      onChange={e => {
                        let val = Math.max(0, Math.min(1, parseFloat(e.target.value)));
                        selectedShape.gradient[idx].offset = val;
                        setShapes([...shapes]);
                      }}
                      className="w-16 border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-gray-500">Offset</span>
                    <button
                      className="text-red-500 text-xs px-2 py-1 border border-red-200 rounded hover:bg-red-100"
                      onClick={() => {
                        selectedShape.gradient.splice(idx, 1);
                        setShapes([...shapes]);
                      }}
                      disabled={selectedShape.gradient.length <= 2}
                      title="Remove stop (min 2)"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs mb-2"
                  onClick={() => {
                    selectedShape.gradient.push({ offset: 0.5, color: "#00ff00" });
                    setShapes([...shapes]);
                  }}
                >
                  Add Color Stop
                </button>
                {/* Live preview */}
                <div className="h-6 w-full rounded mt-2 border" style={{
                  background: `linear-gradient(90deg, ${selectedShape.gradient
                    .sort((a, b) => a.offset - b.offset)
                    .map(stop => `${stop.color} ${stop.offset * 100}%`) 
                    .join(', ')})`
                }} />
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded text-xs mt-2"
                  onClick={() => {
                    selectedShape.gradient = null;
                    setShapes([...shapes]);
                  }}
                >
                  Remove Gradient
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  selectedShape.gradient = [
                    { offset: 0, color: "#ff0000" },
                    { offset: 1, color: "#0000ff" },
                  ];
                  setShapes([...shapes]);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Gradient
              </button>
            )}
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

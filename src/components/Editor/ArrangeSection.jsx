import React from "react";

const ArrangeSection = ({ selectedShape, moveShapeUp, moveShapeDown, deleteShape, setShapes, shapes }) => {
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
          {/* <label>
            Rotation:
            <input
              type="range"
              min="0"
              max="360"
              value={(selectedShape.rotation * 180) / Math.PI}
              onChange={(e) => {
                selectedShape.rotation = (e.target.value * Math.PI) / 180;
                // Force re-render
                setShapes([...shapes]);
              }}
              className="ml-2"
            />
          </label> */}
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
        </>
      ) : (
        <p>Select a shape to edit</p>
      )}
    </div>
  );
};

export default ArrangeSection;

import React from "react";

const CanvasSection = ({ canvasSize, updateCanvasSize, downloadCanvas }) => {

  const handleWidthChange = (e) => {
    const value = Math.min(Number(e.target.value), 500);
    setCanvasSize((prev) => ({ ...prev, width: value }));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Canvas</h2>

      <div className="flex flex-wrap items-center gap-4">
        {/* Width Input */}
        <div className="flex flex-col w-1/8 min-w-[100px]">
          <label htmlFor="canvasWidth" className="text-sm font-medium text-gray-700 mb-1">
            Width
          </label>
          <input
            id="canvasWidth"
            type="number"
            max={500}
            defaultValue={canvasSize.width}
            onInput={(e) => {
              if (+e.target.value > 500) {
                e.target.value = 500;
              }
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

        </div>

        {/* Height Input */}
        <div className="flex flex-col w-1/8 min-w-[100px]">
          <label htmlFor="canvasHeight" className="text-sm font-medium text-gray-700 mb-1">
            Height
          </label>
          <input
            id="canvasHeight"
            type="number"
            max={500}
            defaultValue={canvasSize.height}
            onInput={(e) => {
              if (+e.target.value > 500) {
                e.target.value = 500;
              }
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
            onClick={updateCanvasSize}
          >
            Update Canvas Size
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
            onClick={() => downloadCanvas("png")}
          >
            Download Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;

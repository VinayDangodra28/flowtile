import React from "react";
import { Grid3x3, Download, Settings } from "lucide-react";

export const GridSection = ({
  setGridCols,
  setGridRows,
  gridCols,
  gridRows,
  generateGridImageWithWorker,
  showGrid,
  downloadGrid,
  gridImage,
  borderEnabled,
  setBorderEnabled,
  borderWidth,
  setBorderWidth,
  borderColor,
  setBorderColor,
}) => {
  return (
    <div className="space-y-4">
      {/* Grid Settings Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Grid Settings</span>
          <Settings className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {/* Columns Input */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs text-gray-600 font-medium">Columns</label>
            <input
              id="gridCols"
              type="number"
              min={1}
              value={gridCols}
              onChange={(e) =>
                setGridCols(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
              placeholder="Enter columns"
            />
          </div>

          {/* Rows Input */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs text-gray-600 font-medium">Rows</label>
            <input
              id="gridRows"
              type="number"
              min={1}
              value={gridRows}
              onChange={(e) =>
                setGridRows(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
              placeholder="Enter rows"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center gap-2"
          onClick={generateGridImageWithWorker}
          type="button"
        >
          <Grid3x3 className="w-4 h-4" />
          Generate Grid
        </button>
      </div>

      {/* Border Settings Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Border Settings</span>
        </div>
        
        <div className="space-y-3">
          {/* Enable Border Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">Enable Border</label>
            <input
              type="checkbox"
              checked={borderEnabled}
              onChange={(e) => setBorderEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>

          {/* Border Width */}
          {borderEnabled && (
            <div className="flex items-center gap-3">
              <label className="w-16 text-xs text-gray-600 font-medium">Width</label>
              <input
                type="number"
                min={1}
                max={50}
                value={borderWidth}
                onChange={(e) => setBorderWidth(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                placeholder="Border width"
              />
            </div>
          )}

          {/* Border Color */}
          {borderEnabled && (
            <div className="flex items-center gap-3">
              <label className="w-16 text-xs text-gray-600 font-medium">Color</label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid Preview Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Grid Preview</span>
          <Download className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Generated grid will appear here
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-0 flex items-center justify-center">
            {showGrid()}
          </div>
          
          {/* Download Button */}
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={downloadGrid}
            disabled={!gridImage}
            type="button"
          >
            <Download className="w-4 h-4" />
            Download Grid
          </button>
          
          <div className="text-xs text-gray-500 text-center">
            Click "Generate Grid" to create a tiled pattern
          </div>
        </div>
      </div>
    </div>
  );
};

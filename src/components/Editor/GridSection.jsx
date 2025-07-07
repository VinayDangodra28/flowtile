import React from "react";
import { Grid3x3, Download, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
  
  return (
    <div className="space-y-4">
      {/* Grid Settings Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Grid Settings</span>
          <Settings className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <div className="space-y-3">
          {/* Columns Input */}
          <div className="flex items-center gap-3">
            <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Columns</label>
            <input
              id="gridCols"
              type="number"
              min={1}
              value={gridCols}
              onChange={(e) =>
                setGridCols(Math.max(1, parseInt(e.target.value) || 1))
              }
              className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5B5] ${
                theme === 'dark'
                  ? 'border-gray-600 bg-[#2d2d2d] text-gray-200 focus:border-[#00A5B5]'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400'
              }`}
              placeholder="Enter columns"
            />
          </div>

          {/* Rows Input */}
          <div className="flex items-center gap-3">
            <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rows</label>
            <input
              id="gridRows"
              type="number"
              min={1}
              value={gridRows}
              onChange={(e) =>
                setGridRows(Math.max(1, parseInt(e.target.value) || 1))
              }
              className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5B5] ${
                theme === 'dark'
                  ? 'border-gray-600 bg-[#2d2d2d] text-gray-200 focus:border-[#00A5B5]'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400'
              }`}
              placeholder="Enter rows"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'bg-[#00A5B5] hover:bg-[#00959f] text-white focus:ring-[#00A5B5]'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400'
          }`}
          onClick={generateGridImageWithWorker}
          type="button"
        >
          <Grid3x3 className="w-4 h-4" />
          Generate Grid
        </button>
      </div>

      {/* Border Settings Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Border Settings</span>
        </div>
        
        <div className="space-y-3">
          {/* Enable Border Toggle */}
          <div className="flex items-center justify-between">
            <label className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Enable Border</label>
            <input
              type="checkbox"
              checked={borderEnabled}
              onChange={(e) => setBorderEnabled(e.target.checked)}
              className={`w-4 h-4 rounded focus:ring-2 focus:ring-[#00A5B5] ${
                theme === 'dark'
                  ? 'text-[#00A5B5] bg-[#2d2d2d] border-gray-600'
                  : 'text-blue-600 bg-gray-100 border-gray-300'
              }`}
            />
          </div>

          {/* Border Width */}
          {borderEnabled && (
            <div className="flex items-center gap-3">
              <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Width</label>
              <input
                type="number"
                min={1}
                max={50}
                value={borderWidth}
                onChange={(e) => setBorderWidth(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5B5] ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-[#2d2d2d] text-gray-200 focus:border-[#00A5B5]'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400'
                }`}
                placeholder="Border width"
              />
            </div>
          )}

          {/* Border Color */}
          {borderEnabled && (
            <div className="flex items-center gap-3">
              <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Color</label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className={`w-12 h-10 border rounded-lg cursor-pointer ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-[#2d2d2d]'
                    : 'border-gray-300 bg-white'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid Preview Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Grid Preview</span>
          <Download className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <div className="space-y-3">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Generated grid will appear here
          </p>
          
          <div className={`border rounded-lg p-0 flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-[#2d2d2d] border-gray-600'
              : 'bg-white border-gray-200'
          }`}>
            {showGrid()}
          </div>
          
          {/* Download Button */}
          <button
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-green-700 hover:bg-green-600 text-white focus:ring-green-400'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-400'
            }`}
            onClick={downloadGrid}
            disabled={!gridImage}
            type="button"
          >
            <Download className="w-4 h-4" />
            Download Grid
          </button>
          
          <div className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Click "Generate Grid" to create a tiled pattern
          </div>
        </div>
      </div>
    </div>
  );
};

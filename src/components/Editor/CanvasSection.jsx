import React from "react";
import { Download, Settings } from "lucide-react";

const CanvasSection = ({ canvasSize, updateCanvasSize, downloadCanvas }) => {
  return (
    <div className="space-y-4">
      {/* Canvas Size Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Canvas Size</span>
          <Settings className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {/* Width Input */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs text-gray-600 font-medium">Width</label>
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
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
              placeholder="Width"
            />
            <span className="text-xs text-gray-400 w-8">px</span>
          </div>

          {/* Height Input */}
          <div className="flex items-center gap-3">
            <label className="w-16 text-xs text-gray-600 font-medium">Height</label>
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
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
              placeholder="Height"
            />
            <span className="text-xs text-gray-400 w-8">px</span>
          </div>
        </div>

        {/* Update Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={updateCanvasSize}
          type="button"
        >
          Update Canvas Size
        </button>
      </div>

      {/* Canvas Info Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Canvas Info</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Current Size</span>
            <span className="text-xs font-medium text-gray-700">
              {canvasSize.width} × {canvasSize.height}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Aspect Ratio</span>
            <span className="text-xs font-medium text-gray-700">
              {(canvasSize.width / canvasSize.height).toFixed(2)}:1
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Max Size</span>
            <span className="text-xs font-medium text-gray-700">500 × 500</span>
          </div>
        </div>
      </div>

      {/* Export Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Export Canvas</span>
          <Download className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            Download your canvas as an image file
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-blue-300 group"
              onClick={() => downloadCanvas("png")}
              type="button"
            >
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-1 text-blue-600">📄</div>
                <span className="text-xs font-medium text-gray-700">PNG</span>
              </div>
            </button>
            
            <button
              className="flex items-center justify-center p-3 bg-white hover:bg-green-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-green-300 group"
              onClick={() => downloadCanvas("svg")}
              type="button"
            >
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-1 text-green-600">🖼️</div>
                <span className="text-xs font-medium text-gray-700">SVG</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;

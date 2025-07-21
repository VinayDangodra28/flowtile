import React from "react";
import { Download, Settings } from "lucide-react";
import { useTheme } from "../../context";

const CanvasSection = ({ canvasSize, updateCanvasSize, downloadCanvas }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-4">
      {/* Canvas Size Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Canvas Size</span>
          <Settings className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <div className="space-y-3">
          {/* Width Input */}
          <div className="flex items-center gap-3">
            <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Width</label>
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
              className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5B5] ${
                theme === 'dark'
                  ? 'border-gray-600 bg-[#2d2d2d] text-gray-200 focus:border-[#00A5B5]'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400'
              }`}
              placeholder="Width"
            />
            <span className={`text-xs w-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>px</span>
          </div>

          {/* Height Input */}
          <div className="flex items-center gap-3">
            <label className={`w-16 text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Height</label>
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
              className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5B5] ${
                theme === 'dark'
                  ? 'border-gray-600 bg-[#2d2d2d] text-gray-200 focus:border-[#00A5B5]'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-blue-400'
              }`}
              placeholder="Height"
            />
            <span className={`text-xs w-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>px</span>
          </div>
        </div>

        {/* Update Button */}
        <button
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === 'dark'
              ? 'bg-[#00A5B5] hover:bg-[#00959f] text-white focus:ring-[#00A5B5]'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400'
          }`}
          onClick={updateCanvasSize}
          type="button"
        >
          Update Canvas Size
        </button>
      </div>

      {/* Canvas Info Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Canvas Info</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current Size</span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {canvasSize.width} × {canvasSize.height}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Aspect Ratio</span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {(canvasSize.width / canvasSize.height).toFixed(2)}:1
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Max Size</span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>500 × 500</span>
          </div>
        </div>
      </div>

      {/* Export Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Export Canvas</span>
          <Download className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        
        <div className="space-y-2">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Download your canvas as an image file
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-md group ${
                theme === 'dark'
                  ? 'bg-[#2d2d2d] hover:bg-[#4a4a4a] border-gray-600 hover:border-blue-400'
                  : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => downloadCanvas("png")}
              type="button"
            >
              <div className="text-center">
                <div className={`w-6 h-6 mx-auto mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>📄</div>
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>PNG</span>
              </div>
            </button>
            
            <button
              className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-md group ${
                theme === 'dark'
                  ? 'bg-[#2d2d2d] hover:bg-[#4a4a4a] border-gray-600 hover:border-green-400'
                  : 'bg-white hover:bg-green-50 border-gray-200 hover:border-green-300'
              }`}
              onClick={() => downloadCanvas("svg")}
              type="button"
            >
              <div className="text-center">
                <div className={`w-6 h-6 mx-auto mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>🖼️</div>
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>SVG</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;

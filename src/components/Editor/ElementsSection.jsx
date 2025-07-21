import React, { useState } from "react";
import { Circle, Square, Triangle, ImagePlus, X } from "lucide-react";
import { useTheme } from "../../context";

const shapeIcons = {
  square: <Square className="w-5 h-5" />,
  triangle: <Triangle className="w-5 h-5" />,
  circle: <Circle className="w-5 h-5" />
};

const ElementsSection = ({ addShape, handleImageUpload }) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    handleImageUpload(e);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Shapes Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Add Shapes</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["square", "triangle", "circle"].map((shape) => (
            <button
              key={shape}
              className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-md group ${
                theme === 'dark'
                  ? 'bg-[#2d2d2d] hover:bg-[#4a4a4a] border-gray-600 hover:border-[#00A5B5]'
                  : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => addShape(shape)}
              type="button"
            >
              <div className={`w-8 h-8 flex items-center justify-center mb-2 ${
                theme === 'dark'
                  ? 'text-gray-400 group-hover:text-[#00A5B5]'
                  : 'text-gray-600 group-hover:text-blue-600'
              }`}>
                {shapeIcons[shape]}
              </div>
              <span className={`text-xs font-medium capitalize ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{shape}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Images Card */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
        theme === 'dark' 
          ? 'border-gray-600 bg-[#3a3a3a]' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Add Images</span>
        </div>
        <button
          className={`flex items-center justify-center p-4 border rounded-lg transition-all duration-200 hover:shadow-md group w-full ${
            theme === 'dark'
              ? 'bg-[#2d2d2d] hover:bg-[#4a4a4a] border-gray-600 hover:border-green-400'
              : 'bg-white hover:bg-green-50 border-gray-200 hover:border-green-300'
          }`}
          onClick={() => setShowModal(true)}
          type="button"
        >
          <ImagePlus className={`w-6 h-6 mr-3 ${
            theme === 'dark'
              ? 'text-gray-400 group-hover:text-green-400'
              : 'text-gray-600 group-hover:text-green-600'
          }`} />
          <span className={`font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>Upload Image</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`rounded-xl p-6 shadow-xl w-80 relative max-w-[90vw] ${
            theme === 'dark' 
              ? 'bg-[#2d2d2d] border border-gray-600' 
              : 'bg-white'
          }`}>
            <button
              onClick={() => setShowModal(false)}
              className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3a]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>Upload an Image</h3>

            <div className="space-y-4">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-[#00A5B5]'
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full text-sm file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0 file:text-sm file:font-semibold
                             cursor-pointer ${
                               theme === 'dark'
                                 ? 'text-gray-300 file:bg-[#00A5B5] file:text-white hover:file:bg-[#00959f]'
                                 : 'text-gray-700 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                             }`}
                />
              </div>
              
              <div className={`text-xs text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Supported formats: JPG, PNG, GIF, WebP
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementsSection;

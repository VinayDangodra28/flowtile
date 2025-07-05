import React, { useState } from "react";
import { Circle, Square, Triangle, ImagePlus, X } from "lucide-react";

const shapeIcons = {
  square: <Square className="w-5 h-5" />,
  triangle: <Triangle className="w-5 h-5" />,
  circle: <Circle className="w-5 h-5" />
};

const ElementsSection = ({ addShape, handleImageUpload }) => {
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    handleImageUpload(e);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Shapes Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Add Shapes</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["square", "triangle", "circle"].map((shape) => (
            <button
              key={shape}
              className="flex flex-col items-center justify-center p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-blue-300 group"
              onClick={() => addShape(shape)}
              type="button"
            >
              <div className="w-8 h-8 flex items-center justify-center mb-2 text-gray-600 group-hover:text-blue-600">
                {shapeIcons[shape]}
              </div>
              <span className="text-xs font-medium text-gray-700 capitalize">{shape}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Images Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700 text-base">Add Images</span>
        </div>
        <button
          className="flex items-center justify-center p-4 bg-white hover:bg-green-50 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-green-300 group w-full"
          onClick={() => setShowModal(true)}
          type="button"
        >
          <ImagePlus className="w-6 h-6 mr-3 text-gray-600 group-hover:text-green-600" />
          <span className="font-medium text-gray-700">Upload Image</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80 relative max-w-[90vw]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload an Image</h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                             cursor-pointer"
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center">
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

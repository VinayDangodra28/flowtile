import React, { useState } from "react";
import { Circle, Square, Triangle, ImagePlus, X } from "lucide-react";

const shapeIcons = {
  // circle: <Circle className="w-5 h-5 mr-2" />,
  square: <Square className="w-5 h-5 mr-2" />,
  triangle: <Triangle className="w-5 h-5 mr-2" />,
  ellipse: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="8" ry="4" />
    </svg>
  )
};

const ElementsSection = ({ addShape, handleImageUpload }) => {
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    handleImageUpload(e);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">Add Shape</h2>
        <div className="flex flex-col gap-2">
          {[ "square", "triangle", "ellipse"].map((shape) => (
            <button
              key={shape}
              className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition text-left"
              onClick={() => addShape(shape)}
            >
              {shapeIcons[shape]}
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Add Image</h2>
        <button
          className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition"
          onClick={() => setShowModal(true)}
        >
          <ImagePlus className="w-5 h-5 mr-2" />
          Upload Image
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center gray-bg">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Upload an Image</h3>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                         file:rounded file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementsSection;

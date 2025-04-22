import React from "react";

const ImagesSection = ({ handleImageUpload }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Images</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
    </div>
  );
};

export default ImagesSection;

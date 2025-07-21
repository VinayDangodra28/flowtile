import React from "react";

const UIControls = ({ addShape, deleteShape, downloadCanvas, updateCanvasSize }) => (
  <div>
    <button onClick={addShape}>Add Shape</button>
    <button onClick={deleteShape}>Delete Selected</button>
    <button onClick={downloadCanvas}>Download Canvas</button>
  </div>
);

export default UIControls;

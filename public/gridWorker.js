self.onmessage = function (e) {
  const { gridCols, gridRows, canvasData, canvasWidth, canvasHeight, tileType, borderEnabled, borderWidth, borderColor } = e.data;

  // Validate inputs
  if (!gridCols || !gridRows || !canvasData || !canvasWidth || !canvasHeight) {
    throw new Error("Invalid input data for worker.");
  }

  // Calculate border width (0 if disabled)
  const actualBorderWidth = borderEnabled ? (borderWidth || 0) : 0;
  
  // Create a grid canvas with border space between tiles
  const gridCanvas = new OffscreenCanvas(
    canvasWidth * gridCols + (actualBorderWidth * (gridCols - 1)), 
    canvasHeight * gridRows + (actualBorderWidth * (gridRows - 1))
  );
  const gridCtx = gridCanvas.getContext("2d");

  // Fill background with border color if border is enabled
  if (borderEnabled && actualBorderWidth > 0) {
    gridCtx.fillStyle = borderColor || "#000000";
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
  }

  // Create an ImageData object from the canvas data
  const canvasImageData = new ImageData(
    new Uint8ClampedArray(canvasData),
    canvasWidth,
    canvasHeight
  );

  // Repeat the canvas content across the grid
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      let x = col * (canvasWidth + actualBorderWidth);
      let y = row * (canvasHeight + actualBorderWidth);
      
      // For brick pattern, offset every other row by half the width
      if (tileType === "brick" && row % 2 === 1) {
        x += (canvasWidth + actualBorderWidth) / 2;
      }
      
      gridCtx.putImageData(canvasImageData, x, y);
    }
  }

  // Convert the grid canvas to a blob and send it back
  gridCanvas.convertToBlob().then((imageBlob) => {
    self.postMessage({ imageUrl: imageBlob });
  });
};

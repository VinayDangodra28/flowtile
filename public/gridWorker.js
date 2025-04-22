self.onmessage = function (e) {
  const { gridCols, gridRows, boxImageData, boxWidth, boxHeight } = e.data;

  // Validate inputs
  if (!gridCols || !gridRows || !boxImageData || !boxWidth || !boxHeight) {
    throw new Error("Invalid input data for worker.");
  }

  // Create a grid canvas
  const gridCanvas = new OffscreenCanvas(boxWidth * gridCols, boxHeight * gridRows);
  const gridCtx = gridCanvas.getContext("2d");

  // Create an ImageData object from the inner content (excluding border)
  const innerBoxImage = new ImageData(
    new Uint8ClampedArray(boxImageData),
    boxWidth,
    boxHeight
  );

  // Repeat the inner box content across the grid
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      gridCtx.putImageData(innerBoxImage, col * boxWidth, row * boxHeight);
    }
  }

  // Convert the grid canvas to a blob and send it back
  gridCanvas.convertToBlob().then((imageBlob) => {
    self.postMessage({ imageUrl: imageBlob });
  });
};

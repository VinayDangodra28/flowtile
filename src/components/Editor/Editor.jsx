import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Shape from "./Shape";
import ShapeList from "./ShapeList";
import Sidebar from "./Sidebar";
import ElementsSection from "./ElementsSection";
import ImagesSection from "./ImagesSection";
import CanvasSection from "./CanvasSection";
import ArrangeSection from "./ArrangeSection";
import { GridSection } from "./GridSection";
import './styles.css'
import { saveProject as saveProjectModel, loadProject as loadProjectModel, listProjects } from "../../utils/projectModel";

const Editor = () => {
  const { projectName } = useParams();
  const canvasRef = useRef(null);
  const parentRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [gridImage, setGridImage] = useState(null);
  const [gridCols, setGridCols] = useState(10);
  const [gridRows, setGridRows] = useState(10);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("elements");
  const [maxCanvasWidth, setMaxCanvasWidth] = useState(800); // Default max width
  const [maxCanvasHeight, setMaxCanvasHeight] = useState(600); // Default max height
  const [isSnapping, setIsSnapping] = useState(false); // Track snapping state
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [prevShapeState, setPrevShapeState] = useState(null); // Track previous shape state
  const [lastAction, setLastAction] = useState(null); // Track last action type
  const [tileType, setTileType] = useState("square");
  const [brickOffset, setBrickOffset] = useState(50); // for brick offset

  // Define custom snap lines
  const customSnapLines = [
    { type: 'vertical', position: 250 },
    { type: 'horizontal', position: 250 },
    { type: 'vertical', position: 500 },
    { type: 'horizontal', position: 500 },
    { type: 'vertical', position: 0 },
    { type: 'horizontal', position: 0 },
  ];

  // Define snap lines dynamically based on shapes, excluding the selected shape while dragging
  const dynamicSnapLines = shapes.flatMap((shape) => {
    if (dragging && selectedShape && shape === selectedShape) {
      return [];
    }
    return [
      { type: 'vertical', position: shape.x - shape.width / 2 }, // Left
      { type: 'vertical', position: shape.x }, // Center
      { type: 'vertical', position: shape.x + shape.width / 2 }, // Right
      { type: 'horizontal', position: shape.y - shape.height / 2 }, // Top
      { type: 'horizontal', position: shape.y }, // Center
      { type: 'horizontal', position: shape.y + shape.height / 2 }, // Bottom
    ];
  });

  // Combine custom snap lines with dynamic snap lines
  const snapLines = [...customSnapLines, ...dynamicSnapLines];

  useEffect(() => {
    const updateParentDimensions = () => {
      if (parentRef.current) {
        const parentWidth = parentRef.current.clientWidth;
        const parentHeight = parentRef.current.clientHeight;
        setMaxCanvasWidth(parentWidth);
        setMaxCanvasHeight(parentHeight);
      }
    };

    updateParentDimensions();
    window.addEventListener("resize", updateParentDimensions);
    return () => window.removeEventListener("resize", updateParentDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snap lines only if snapping
      if (isSnapping) {
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        snapLines.forEach(line => {
          if (line.type === 'vertical') {
            ctx.beginPath();
            ctx.moveTo(line.position, 0);
            ctx.lineTo(line.position, canvas.height);
            ctx.stroke();
          } else if (line.type === 'horizontal') {
            ctx.beginPath();
            ctx.moveTo(0, line.position);
            ctx.lineTo(canvas.width, line.position);
            ctx.stroke();
          }
        });

        ctx.setLineDash([]); // Reset dashed lines
      }

      shapes.forEach((shape) => {
        if (shape instanceof Shape) {
          shape.updatePosition(canvas.width, canvas.height);
          shape.draw(ctx, canvas.width, canvas.height, shape === selectedShape, tileType); // Pass tileType here
        } else {
          console.error("Invalid shape object detected:", shape);
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [shapes, selectedShape, snapLines, dragging, isSnapping]);

  // Helper to push current shapes to undo stack
  const pushToUndoStack = () => {
    setUndoStack((prev) => [...prev, JSON.stringify(shapes)]);
    setRedoStack([]); // Clear redo stack on new action
  };

  // Undo function
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack((prev) => [...prev, JSON.stringify(shapes)]);
    const prevShapes = JSON.parse(undoStack[undoStack.length - 1]);
    setShapes(prevShapes.map((data) => new Shape(
      data.x, data.y, data.width, data.height, data.color, data.type, data.image, data.opacity, data.shadow, data.gradient
    )));
    setUndoStack((prev) => prev.slice(0, -1));
  };

  // Redo function
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack((prev) => [...prev, JSON.stringify(shapes)]);
    const nextShapes = JSON.parse(redoStack[redoStack.length - 1]);
    setShapes(nextShapes.map((data) => new Shape(
      data.x, data.y, data.width, data.height, data.color, data.type, data.image, data.opacity, data.shadow, data.gradient
    )));
    setRedoStack((prev) => prev.slice(0, -1));
  };

  const handleMouseDown = (e) => {
    if (selectedShape && selectedShape.locked) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedShape && selectedShape.isResizeHandleClicked(x, y)) {
      setResizing(true);
      setLastAction('resize');
      setPrevShapeState(JSON.stringify(shapes));
      return;
    }

    const clickedShape = [...shapes].reverse().find((shape) => shape.isClicked(x, y));
    setSelectedShape(clickedShape);

    if (clickedShape) {
      setDragging(true);
      setLastAction('move');
      clickedShape.offset = {
        x: x - clickedShape.x,
        y: y - clickedShape.y,
      };
      setPrevShapeState(JSON.stringify(shapes));
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isShiftPressed = e.shiftKey;

    // --- Resize ---
    if (resizing && selectedShape) {
      const dx = x - selectedShape.x;
      const dy = y - selectedShape.y;
      const aspectRatio = selectedShape.width / selectedShape.height;

      let newWidth = Math.max(10, Math.abs(dx) * 2);
      let newHeight = Math.max(10, Math.abs(dy) * 2);

      if (isShiftPressed) {
        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }
      }

      selectedShape.width = newWidth;
      selectedShape.height = newHeight;
      // Push to undo stack on every resize step
      if (lastAction === 'resize') {
        setUndoStack((prev) => [...prev, prevShapeState]);
        setRedoStack([]);
        setPrevShapeState(JSON.stringify(shapes));
        setLastAction(null); // Only once per resize session
      }
    }

    // --- Rotate ---
    if (rotating && selectedShape) {
      const dx = x - selectedShape.x;
      const dy = y - selectedShape.y;
      selectedShape.rotation = Math.atan2(dy, dx);
    }

    // --- Drag + Snap ---
    const snapThreshold = 8;
    let isSnappingLocal = false; // Local snapping state

    if (dragging && selectedShape) {
      let newX = x - selectedShape.offset.x;
      let newY = y - selectedShape.offset.y;

      const shapeWidth = selectedShape.width;
      const shapeHeight = selectedShape.height;

      const shapeLeft = newX - (shapeWidth / 2);
      const shapeRight = newX + (shapeWidth / 2);
      const shapeCenterX = newX;

      const shapeTop = newY - (shapeHeight / 2);
      const shapeBottom = newY + (shapeHeight / 2);
      const shapeCenterY = newY;

      // Snap to vertical lines
      snapLines.forEach(line => {
        if (line.type === 'vertical') {
          if (Math.abs(shapeLeft - line.position) < snapThreshold) {
            newX = line.position + (shapeWidth / 2);
            isSnappingLocal = true;
          } else if (Math.abs(shapeRight - line.position) < snapThreshold) {
            newX = line.position - (shapeWidth / 2);
            isSnappingLocal = true;
          } else if (Math.abs(shapeCenterX - line.position) < snapThreshold) {
            newX = line.position;
            isSnappingLocal = true;
          }
        }
      });

      // Snap to horizontal lines
      snapLines.forEach(line => {
        if (line.type === 'horizontal') {
          if (Math.abs(shapeTop - line.position) < snapThreshold) {
            newY = line.position + (shapeHeight / 2);
            isSnappingLocal = true;
          } else if (Math.abs(shapeBottom - line.position) < snapThreshold) {
            newY = line.position - (shapeHeight / 2);
            isSnappingLocal = true;
          } else if (Math.abs(shapeCenterY - line.position) < snapThreshold) {
            newY = line.position;
            isSnappingLocal = true;
          }
        }
      });

      selectedShape.x = newX;
      selectedShape.y = newY;
      // Push to undo stack on every move step
      if (lastAction === 'move') {
        setUndoStack((prev) => [...prev, prevShapeState]);
        setRedoStack([]);
        setPrevShapeState(JSON.stringify(shapes));
        setLastAction(null); // Only once per move session
      }
    }

    setIsSnapping(isSnappingLocal); // Update snapping state
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setRotating(false);
    setIsSnapping(false); // Reset snapping state
    if (selectedShape) {
      delete selectedShape.offset;
    }
    setPrevShapeState(null);
    setLastAction(null);
  };

  const addShape = (type) => {
    pushToUndoStack();
    const x = Math.random() * canvasSize.width;
    const y = Math.random() * canvasSize.height;
    const size = 20 + Math.random() * 30;
  
    // Generate a random hex color
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
    const newShape = new Shape(x, y, size, size, color, type);
  
    if (newShape instanceof Shape) {
      newShape.locked = false; // Initialize lock state
      setShapes((prevShapes) => [...prevShapes, newShape]);
    } else {
      console.error("Attempted to add an invalid shape object:", newShape);
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxSize = Math.min(canvasSize.width, canvasSize.height) * 0.5;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height / width) * maxSize;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          const x = Math.random() * (canvasSize.width - width);
          const y = Math.random() * (canvasSize.height - height);

          const uniqueImageSrc = event.target.result;

          const newShape = new Shape(x, y, width, height, "transparent", "image", uniqueImageSrc);
          console.log(newShape.image.src)
          newShape.locked = false;
          setShapes((prevShapes) => [...prevShapes, newShape]);
        };
        img.src = event.target.result;
      };
      e.target.value = null;
      reader.readAsDataURL(file);
    }
  };

  const deleteShape = () => {
    pushToUndoStack();
    if (selectedShape) {
      setShapes(shapes.filter((shape) => shape !== selectedShape));
      setSelectedShape(null);
    }
  };

  const moveShapeUp = () => {
    pushToUndoStack();
    if (selectedShape) {
      const index = shapes.indexOf(selectedShape);
      if (index < shapes.length - 1) {
        const newShapes = [...shapes];
        newShapes.splice(index, 1);
        newShapes.splice(index + 1, 0, selectedShape);
        setShapes(newShapes);
      }
    }
  };

  const moveShapeDown = () => {
    pushToUndoStack();
    if (selectedShape) {
      const index = shapes.indexOf(selectedShape);
      if (index > 0) {
        const newShapes = [...shapes];
        newShapes.splice(index, 1);
        newShapes.splice(index - 1, 0, selectedShape);
        setShapes(newShapes);
      }
    }
  };

  const duplicateShape = () => {
    pushToUndoStack();
    if (selectedShape) {
      const duplicatedShape = new Shape(
        selectedShape.x + 20, // Offset the duplicated shape slightly
        selectedShape.y + 20,
        selectedShape.width,
        selectedShape.height,
        selectedShape.color,
        selectedShape.type,
        selectedShape.image?.src || null, // Use the image source if available
        selectedShape.opacity,
        selectedShape.shadow,
        selectedShape.gradient
      );
      duplicatedShape.rotation = selectedShape.rotation;
      duplicatedShape.locked = selectedShape.locked;
      setShapes((prevShapes) => [...prevShapes, duplicatedShape]);
    }
  };

  const downloadCanvas = (format = "png") => {
    if (format === "svg") {
      convertCanvasToSVG(); // <-- Call the manual SVG converter
      return;
    }

    const canvas = canvasRef.current;

    // Create a new canvas element with the same dimensions as the original canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");

    // Draw the original canvas content onto the new canvas
    exportCtx.drawImage(canvas, 0, 0);

    // Export the canvas content as an image with the original quality
    const link = document.createElement("a");
    link.download = `canvas.${format}`;
    link.href = exportCanvas.toDataURL(`image/${format}`, 1.0);
    link.click();
  };

  // Convert canvas to SVG manually (basic shapes only)
  const convertCanvasToSVG = () => {
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize.width}" height="${canvasSize.height}">`;

    shapes.forEach((shape) => {
      if (shape.type === "rectangle") {
        svgContent += `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.color}" transform="rotate(${shape.rotation}, ${shape.x}, ${shape.y})"/>`;
      } else if (shape.type === "circle") {
        svgContent += `<circle cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" r="${shape.width / 2}" fill="${shape.color}" />`;
      } else if (shape.type === "image") {
        svgContent += `<image href="${shape.imageSrc}" x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" />`;
      }
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "canvas.svg";
    link.href = url;
    link.click();
  };

  const updateCanvasSize = () => {
    const widthInput = parseInt(document.getElementById("canvasWidth").value, 10);
    const heightInput = parseInt(document.getElementById("canvasHeight").value, 10);

    let width = widthInput;
    let height = heightInput;

    const aspectRatio = width / height;

    // Adjust width and height based on maximum allowed dimensions
    if (width > maxCanvasWidth) {
      width = maxCanvasWidth;
      height = width / aspectRatio;
    }

    if (height > maxCanvasHeight) {
      height = maxCanvasHeight;
      width = height * aspectRatio;
    }

    // Ensure the aspect ratio is maintained
    if (width > maxCanvasWidth || height > maxCanvasHeight) {
      if (width / height > maxCanvasWidth / maxCanvasHeight) {
        width = maxCanvasWidth;
        height = width / aspectRatio;
      } else {
        height = maxCanvasHeight;
        width = height * aspectRatio;
      }
    }

    // console.log("New width:", width, "New height:", height); // Debugging line

    setCanvasSize({ width, height });
  };

  const generateGridImageWithWorker = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const contentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const worker = new Worker("/gridWorker.js");

    worker.postMessage({
      gridCols,
      gridRows,
      boxImageData: contentImageData.data,
      boxWidth: canvas.width,
      boxHeight: canvas.height,
    });

    worker.onmessage = function (e) {
      const { imageUrl } = e.data;
      setGridImage(URL.createObjectURL(imageUrl));
    };

    worker.onerror = function (err) {
      console.error("Worker error:", err.message);
      alert("Failed to generate grid. Check the console for details.");
    };
  };

  const showGrid = () => {
    return gridImage ? (
      <div className="flex justify-center mt-4">
        <img
          src={gridImage}
          alt="Generated Grid"
          className="border rounded"
        />
      </div>
    ) : (
      <p className="text-center mt-4">No grid generated yet.</p>
    );
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const reversedIndex = shapes.length - 1 - index;
    if (draggedIndex === reversedIndex) return;

    const newShapes = [...shapes];
    const draggedShape = newShapes[draggedIndex];
    newShapes.splice(draggedIndex, 1);
    newShapes.splice(reversedIndex, 0, draggedShape);

    setShapes(newShapes);
    setDraggedIndex(reversedIndex);
  };

  const handleDrop = (index) => {
    setDraggedIndex(null);
  };

  const handleLockShape = (shape) => {
    shape.locked = !shape.locked;
    setShapes([...shapes]); // Force re-render
  };

  // Helper to get serializable shapes for saving/export
  const getSerializableShapes = () =>
    shapes.map((shape) => ({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      color: shape.color,
      type: shape.type,
      rotation: shape.rotation,
      locked: shape.locked,
      image: shape.type === "image" ? shape.image?.src || null : null,
      opacity: shape.opacity,
      shadow: shape.shadow,
      gradient: shape.gradient,
    }));

  const exportShapes = () => {
    const exportData = {
      shapes: getSerializableShapes(),
      canvasSize,
      tileType,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "shapes.flowtile";
    link.href = url;
    link.click();
  };

  const importShapes = (e) => {
    pushToUndoStack();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const importData = JSON.parse(event.target.result);
        if (importData.shapes && Array.isArray(importData.shapes)) {
          setShapes(
            importData.shapes.map((data) => {
              const newShape = new Shape(
                data.x,
                data.y,
                data.width,
                data.height,
                data.color,
                data.type,
                data.image,
                data.opacity,
                data.shadow,
                data.gradient
              );
              // Ensure images are loaded correctly
              if (data.imageSrc) {
                const img = new Image();
                img.src = data.imageSrc;
                img.onload = () => {
                  newShape.image = img;
                  setShapes((prevShapes) => [...prevShapes, newShape]);
                };
              }
              return newShape;
            })
          );
        }
        if (importData.canvasSize) setCanvasSize(importData.canvasSize);
        if (importData.tileType) setTileType(importData.tileType);
      };
      reader.readAsText(file);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Normalize key for cross-browser (e.key can be 'Z' or 'z')
      const key = e.key.toLowerCase();
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      // Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z for redo
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (key === 'y' || (key === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, shapes]);

  // Save Project Functionality (save to current project only, using export logic)
  const saveProject = () => {
    if (!projectName) {
      alert("No project is currently open.");
      return;
    }
    const projectData = {
      shapes: getSerializableShapes(),
      canvasSize,
      tileType,
      // Add other relevant state if needed
    };
    saveProjectModel(projectName, projectData);
    alert(`Project '${projectName}' saved!`);
  };

  // Load Project Functionality (using the model)
  useEffect(() => {
    if (projectName) {
      const data = loadProjectModel(projectName);
      if (data && Array.isArray(data.shapes)) {
        setCanvasSize(data.canvasSize || { width: 500, height: 500 });
        setShapes(
          data.shapes.map(
            (s) => new Shape(
              s.x, s.y, s.width, s.height, s.color, s.type, s.image, s.opacity, s.shadow, s.gradient
            )
          )
        );
        if (data.tileType) setTileType(data.tileType);
      } else {
        // If no data, reset to blank
        setCanvasSize({ width: 500, height: 500 });
        setShapes([]);
        setTileType("square");
      }
    }
    // Only run on mount or when projectName changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  // Autosave to current project if projectName is present
  useEffect(() => {
    if (!projectName) return;
    // Only save if shapes or canvasSize are not empty/default
    if (shapes.length === 0 && canvasSize.width === 500 && canvasSize.height === 500) return;
    const projectData = { shapes: getSerializableShapes(), canvasSize, tileType };
    saveProjectModel(projectName, projectData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, canvasSize, projectName, tileType]);

  return (
    <div ref={parentRef} className="flex flex-col editor" style={{ height: "90vh" }}>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-3/10 bg-gray-200 flex flex-row justify-between gap-1 z-10">
          <div></div>
          <Sidebar onSectionClick={setActiveSection} />
          <div className="w-3/4 p-2">
            {activeSection === "elements" && <ElementsSection addShape={addShape} handleImageUpload={handleImageUpload} />}
            {/* {activeSection === "images" && <ImagesSection handleImageUpload={handleImageUpload} />} */}
            {activeSection === "shapes" && (
              <div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2">Shape List</h2>
                  <ShapeList
                    shapes={shapes}
                    onSelectShape={setSelectedShape}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onLockShape={handleLockShape}
                  />
                </div>

              </div>
            )}
            {activeSection === "canvas" && (
              <div>
                <CanvasSection canvasSize={canvasSize} updateCanvasSize={updateCanvasSize} downloadCanvas={downloadCanvas} />
              </div>
            )}
            {activeSection === "grid" && (
              <div>
                <GridSection setGridCols={setGridCols} setGridRows={setGridRows} gridCols={gridCols} gridRows={gridRows} generateGridImageWithWorker={generateGridImageWithWorker} showGrid={showGrid} />
              </div>
            )}

          </div>
        </div>

        {/* Canvas Section */}
        <div className="w-5/10 flex flex-col items-center p-4">
          {/* Tile Type Selector */}
          <div className="flex gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Tile Type:</label>
            <select
              value={tileType}
              onChange={e => setTileType(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="square">Square</option>
              <option value="brick">Brick</option>
              <option value="hex">Hex</option>
            </select>
            {tileType === "brick" && (
              <>
                <label className="ml-2 text-sm font-medium text-gray-700">Brick Offset %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={brickOffset}
                  onChange={e => setBrickOffset(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
                />
              </>
            )}
          </div>
          {/* Main Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border rounded"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        {/* Tools Section */}
        <div className="w-2/10 bg-gray-200 p-4 flex flex-col"
        style={{
          height: "90vh",
        }}
        >
          <div className="mb-4 flex flex-col space-x-2">
            <div className="flex space-x-2 mb-2 items-center">
              <button
                onClick={handleUndo}
                className="w-1/2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                disabled={undoStack.length === 0}
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                className="w-1/2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                disabled={redoStack.length === 0}
              >
                Redo
              </button>
            </div>
            <div className="flex space-x-2 mb-2 items-center">
              <button
                onClick={exportShapes}
                className="w-1/2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Export
              </button>

              {/* Label styled like a button to trigger the input */}
              <label
                htmlFor="upload-input"
                className="flex items-center justify-center text-center w-1/2 cursor-pointer px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              >
                Import
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                accept=".flowtile"
                onChange={importShapes}
                id="upload-input"
                className="hidden"
              />
            </div>
            {/* Save and Load Project Buttons */}
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded mb-2 w-full"
              onClick={saveProject}
            >
              Save Project
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
              onClick={() => alert('Load Project logic goes here!')}
            >
              Load Project
            </button>
          </div>

          {selectedShape && (
            <ArrangeSection
              selectedShape={selectedShape}
              moveShapeUp={moveShapeUp}
              moveShapeDown={moveShapeDown}
              deleteShape={deleteShape}
              shapes={shapes} // Pass shapes prop
              setShapes={setShapes} // Pass setShapes prop
              duplicateShape={duplicateShape}
            />
          )}
        </div>
      </div>
    </div>
  );

};

export default Editor;

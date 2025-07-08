import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Shape from "./Shape";
import ShapeList from "./ShapeList";
import Sidebar from "./Sidebar";
import ElementsSection from "./ElementsSection";
import ImagesSection from "./ImagesSection";
import CanvasSection from "./CanvasSection";
import ArrangeSection from "./ArrangeSection";
import { GridSection } from "./GridSection";
import './styles.css'
import { saveProject as saveProjectModel, loadProject as loadProjectModel, listProjects, saveImageToIndexedDB, getImageFromIndexedDB, renameProject } from "../../utils/projectModel";
import { FaUndo, FaRedo, FaFileExport, FaFileImport, FaDownload, FaSave, FaFolderOpen, FaImage } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useProject } from "../../context/ProjectContext";
import { Maximize2 } from "lucide-react";

const Editor = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setCurrentProject, updateProjectName } = useProject();
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
  const [borderEnabled, setBorderEnabled] = useState(false);
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState("#000000");
  const [pendingDownload, setPendingDownload] = useState(false);
  const [pendingExport, setPendingExport] = useState(false);
  const [pendingGrid, setPendingGrid] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("svg");
  const [canvasBg, setCanvasBg] = useState("transparent");

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
      // Draw canvas background
      if (canvasBg === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (typeof canvasBg === 'string') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else if (canvasBg && typeof canvasBg === 'object' && canvasBg.type === 'gradient') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Use angle and stops from canvasBg
        const angle = (typeof canvasBg.gradientAngle === 'number' ? canvasBg.gradientAngle : 45) * Math.PI / 180;
        const halfDiag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const dx = Math.cos(angle) * halfDiag;
        const dy = Math.sin(angle) * halfDiag;
        const x1 = cx - dx;
        const y1 = cy - dy;
        const x2 = cx + dx;
        const y2 = cy + dy;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        (canvasBg.gradient || []).forEach(({ offset, color }) => {
          grad.addColorStop(Math.max(0, Math.min(1, offset)), color);
        });
        ctx.save();
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

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

  // Helper to serialize shapes for undo/redo
  const serializeShapes = (shapesArray) => {
    return shapesArray.map(shape => ({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      color: shape.color,
      type: shape.type,
      rotation: shape.rotation,
      opacity: shape.opacity,
      shadow: shape.shadow,
      gradient: shape.gradient,
      gradientAngle: shape.gradientAngle,
      locked: shape.locked,
      imageKey: shape.imageKey,
    }));
  };

  // Helper to deserialize shapes from undo/redo
  const deserializeShapes = (serializedShapes) => {
    return serializedShapes.map(data => {
      const shape = new Shape(
        data.x, data.y, data.width, data.height, data.color, data.type, null, data.opacity, data.shadow, data.gradient
      );
      // Restore all additional properties
      shape.rotation = data.rotation || 0;
      shape.gradientAngle = data.gradientAngle;
      shape.locked = data.locked || false;
      shape.imageKey = data.imageKey;
      
      // Restore image if it exists
      if (data.type === "image" && data.imageKey) {
        getImageFromIndexedDB(data.imageKey).then((dataUrl) => {
          if (dataUrl) {
            const imgObj = new window.Image();
            imgObj.src = dataUrl;
            shape.image = imgObj;
          }
        });
      }
      
      return shape;
    });
  };

  // Helper to push current shapes to undo stack
  const pushToUndoStack = () => {
    setUndoStack((prev) => [...prev, JSON.stringify(serializeShapes(shapes))]);
    setRedoStack([]); // Clear redo stack on new action
  };

  // Undo function
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack((prev) => [...prev, JSON.stringify(serializeShapes(shapes))]);
    const prevShapes = JSON.parse(undoStack[undoStack.length - 1]);
    setShapes(deserializeShapes(prevShapes));
    setUndoStack((prev) => prev.slice(0, -1));
  };

  // Redo function
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack((prev) => [...prev, JSON.stringify(serializeShapes(shapes))]);
    const nextShapes = JSON.parse(redoStack[redoStack.length - 1]);
    setShapes(deserializeShapes(nextShapes));
    setRedoStack((prev) => prev.slice(0, -1));
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for resize handle click first
    if (selectedShape && selectedShape.isResizeHandleClicked(x, y)) {
      if (selectedShape.locked) return; // Prevent resizing locked shapes
      setResizing(true);
      setLastAction('resize');
      setPrevShapeState(JSON.stringify(serializeShapes(shapes)));
      return;
    }

    const clickedShape = [...shapes].reverse().find((shape) => shape.isClicked(x, y));
    setSelectedShape(clickedShape);

    if (clickedShape) {
      if (clickedShape.locked) {
        // Allow selection but prevent dragging of locked shapes
        return;
      }
      setDragging(true);
      setLastAction('move');
      clickedShape.offset = {
        x: x - clickedShape.x,
        y: y - clickedShape.y,
      };
      setPrevShapeState(JSON.stringify(serializeShapes(shapes)));
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isShiftPressed = e.shiftKey;

    // --- Resize ---
    if (resizing && selectedShape && !selectedShape.locked) {
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
        setPrevShapeState(JSON.stringify(serializeShapes(shapes)));
        setLastAction(null); // Only once per resize session
      }
    }

    // --- Rotate ---
    if (rotating && selectedShape && !selectedShape.locked) {
      const dx = x - selectedShape.x;
      const dy = y - selectedShape.y;
      selectedShape.rotation = Math.atan2(dy, dx);
    }

    // --- Drag + Snap ---
    const snapThreshold = 8;
    let isSnappingLocal = false; // Local snapping state

    if (dragging && selectedShape && !selectedShape.locked) {
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
        setPrevShapeState(JSON.stringify(serializeShapes(shapes)));
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
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new window.Image();
        img.onload = async () => {
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

          // Store image in IndexedDB and get key
          const imageKey = await saveImageToIndexedDB(event.target.result);

          const newShape = new Shape(x, y, width, height, "transparent", "image", null);
          newShape.imageKey = imageKey;
          newShape.locked = false;
          // Load image for display
          getImageFromIndexedDB(imageKey).then((dataUrl) => {
            if (dataUrl) {
              const imgObj = new window.Image();
              imgObj.src = dataUrl;
              newShape.image = imgObj;
              setShapes((prevShapes) => [...prevShapes, newShape]);
            }
          });
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
        null, // imageSrc is not used
        selectedShape.opacity,
        selectedShape.shadow,
        selectedShape.gradient
      );
      duplicatedShape.rotation = selectedShape.rotation;
      duplicatedShape.locked = selectedShape.locked;
      if (selectedShape.type === "image" && selectedShape.imageKey) {
        duplicatedShape.imageKey = selectedShape.imageKey;
        getImageFromIndexedDB(selectedShape.imageKey).then((dataUrl) => {
          if (dataUrl) {
            const imgObj = new window.Image();
            imgObj.src = dataUrl;
            duplicatedShape.image = imgObj;
            setShapes((prevShapes) => [...prevShapes, duplicatedShape]);
          }
        });
      } else {
        setShapes((prevShapes) => [...prevShapes, duplicatedShape]);
      }
    }
  };

  const downloadCanvas = (format = "png") => {
    setSelectedShape(null);
    setPendingDownload(format);
  };

  // Convert canvas to SVG manually (basic shapes only, now with gradient, square, and wraparound support)
  const convertCanvasToSVG = async () => {
    let svgContent = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${canvasSize.width}\" height=\"${canvasSize.height}\">`;
    let defs = '';
    let shapeSvgs = '';
    let shadowDefs = '';
    const shadowIdMap = {}; // To avoid duplicate filters
    let shadowCount = 0;

    // --- SVG Background (canvasBg) ---
    let bgRect = '';
    if (canvasBg && typeof canvasBg === 'object' && canvasBg.type === 'gradient') {
      // SVG gradient background
      const gradId = 'canvasBgGrad';
      const halfDiag = Math.sqrt(canvasSize.width * canvasSize.width + canvasSize.height * canvasSize.height) / 2;
      const cx = canvasSize.width / 2, cy = canvasSize.height / 2;
      const dx = Math.cos(angle) * halfDiag;
      const dy = Math.sin(angle) * halfDiag;
      // SVG uses 0-1 for x1/y1/x2/y2, so normalize to canvas bounds
      const x1 = 0.5 - dx / canvasSize.width;
      const y1 = 0.5 - dy / canvasSize.height;
      const x2 = 0.5 + dx / canvasSize.width;
      const y2 = 0.5 + dy / canvasSize.height;
      defs += `<linearGradient id=\"${gradId}\" x1=\"${x1}\" y1=\"${y1}\" x2=\"${x2}\" y2=\"${y2}\">`;
      (canvasBg.gradient || []).forEach(stop => {
        defs += `<stop offset=\"${stop.offset * 100}%\" stop-color=\"${stop.color}\"/>`;
      });
      defs += `</linearGradient>`;
      bgRect = `<rect x=\"0\" y=\"0\" width=\"${canvasSize.width}\" height=\"${canvasSize.height}\" fill=\"url(#${gradId})\"/>`;
    } else if (canvasBg && typeof canvasBg === 'string' && canvasBg !== 'transparent') {
      // Solid color background
      bgRect = `<rect x=\"0\" y=\"0\" width=\"${canvasSize.width}\" height=\"${canvasSize.height}\" fill=\"${canvasBg}\"/>`;
    }

    // Helper: getOffsets logic (copied from Shape class)
    function getOffsets(tileType, canvasWidth, canvasHeight) {
      switch(tileType) {
        case "square":
          return [
            { dx: -canvasWidth, dy: 0 },
            { dx: canvasWidth, dy: 0 },
            { dx: 0, dy: -canvasHeight },
            { dx: 0, dy: canvasHeight },
            { dx: -canvasWidth, dy: -canvasHeight },
            { dx: canvasWidth, dy: -canvasHeight },
            { dx: -canvasWidth, dy: canvasHeight },
            { dx: canvasWidth, dy: canvasHeight },
          ];
        case "brick":
          return [
            { dx: -canvasWidth, dy: 0 },
            { dx: canvasWidth, dy: 0 },
            { dx: -canvasWidth / 2, dy: -canvasHeight },
            { dx: canvasWidth / 2, dy: -canvasHeight },
            { dx: -canvasWidth / 2, dy: canvasHeight },
            { dx: canvasWidth / 2, dy: canvasHeight },
          ];
        default:
          return [{ dx: 0, dy: 0 }];
      }
    }

    // For image shapes, fetch all image data from IndexedDB first
    const imageDataUrlMap = {};
    await Promise.all(
      shapes.map(async (shape) => {
        if (shape.type === "image" && shape.imageKey) {
          if (!imageDataUrlMap[shape.imageKey]) {
            imageDataUrlMap[shape.imageKey] = await getImageFromIndexedDB(shape.imageKey);
          }
        }
      })
    );

    shapes.forEach((shape, idx) => {
      let fillAttr = '';
      let opacityAttr = shape.opacity !== undefined ? ` opacity=\\\"${shape.opacity}\\\"` : '';
      // Handle gradient
      if (shape.gradient && Array.isArray(shape.gradient) && shape.gradient.length > 1) {
        const gradId = `grad${idx}`;
        // Calculate gradient vector based on angle and shape size
        const angle = (typeof shape.gradientAngle === 'number' ? shape.gradientAngle : 45) * Math.PI / 180;
        const halfDiag = Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
        const cx = shape.x, cy = shape.y;
        const dx = Math.cos(angle) * halfDiag;
        const dy = Math.sin(angle) * halfDiag;
        // SVG uses 0-1 for x1/y1/x2/y2, so normalize to shape bounds
        const x1 = 0.5 - dx / shape.width;
        const y1 = 0.5 - dy / shape.height;
        const x2 = 0.5 + dx / shape.width;
        const y2 = 0.5 + dy / shape.height;
        defs += `<linearGradient id=\\\"${gradId}\\\" x1=\\\"${x1}\\\" y1=\\\"${y1}\\\" x2=\\\"${x2}\\\" y2=\\\"${y2}\\\">`;
        shape.gradient.forEach(stop => {
          defs += `<stop offset=\\\"${stop.offset * 100}%\\\" stop-color=\\\"${stop.color}\\\"/>`;
        });
        defs += `</linearGradient>`;
        fillAttr = `fill=\\\"url(#${gradId})\\\"`;
      } else {
        fillAttr = `fill=\\\"${shape.color}\\\"`;
      }

      let filterAttr = '';
      if (shape.shadow) {
        // Create a unique filter for each unique shadow
        const key = JSON.stringify(shape.shadow);
        if (!shadowIdMap[key]) {
          const shadowId = `shadow${shadowCount++}`;
          shadowIdMap[key] = shadowId;
          // Parse color and opacity
          let color = shape.shadow.color || "#000";
          let opacity = 1;
          if (color.startsWith("rgba")) {
            const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (match) {
              color = `rgb(${match[1]},${match[2]},${match[3]})`;
              opacity = match[4];
            }
          }
          shadowDefs += `
            <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="${shape.shadow.offsetX || 0}" dy="${shape.shadow.offsetY || 0}" stdDeviation="${(shape.shadow.blur || 0) / 2}" flood-color="${color}" flood-opacity="${opacity}"/>
            </filter>
          `;
        }
        filterAttr = `filter="url(#${shadowIdMap[key]})"`;
      }

      // Always include the original shape at (0,0) offset
      const allOffsets = [{ dx: 0, dy: 0 }, ...getOffsets(tileType, canvasSize.width, canvasSize.height)];
      allOffsets.forEach(({ dx, dy }) => {
        const x = shape.x + dx;
        const y = shape.y + dy;
        if (shape.type === "rectangle" || shape.type === "square") {
          shapeSvgs += `<rect x=\\\"${x - shape.width / 2}\\\" y=\\\"${y - shape.height / 2}\\\" width=\\\"${shape.width}\\\" height=\\\"${shape.height}\\\" ${fillAttr}${opacityAttr} ${filterAttr} transform=\\\"rotate(${(shape.rotation || 0) * 180 / Math.PI}, ${x}, ${y})\\\"/>`;
        } else if (shape.type === "circle") {
          shapeSvgs += `<ellipse cx=\\\"${x}\\\" cy=\\\"${y}\\\" rx=\\\"${shape.width / 2}\\\" ry=\\\"${shape.height / 2}\\\" ${fillAttr}${opacityAttr} ${filterAttr}/>`;
        } else if (shape.type === "image") {
          const dataUrl = shape.imageKey ? imageDataUrlMap[shape.imageKey] : null;
          if (dataUrl) {
            shapeSvgs += `<image href=\\\"${dataUrl}\\\" x=\\\"${x - shape.width / 2}\\\" y=\\\"${y - shape.height / 2}\\\" width=\\\"${shape.width}\\\" height=\\\"${shape.height}\\\"${opacityAttr} ${filterAttr}/>`;
          }
        } else if (shape.type === "triangle") {
          // Calculate triangle points
          const angle = shape.rotation || 0;
          const hw = shape.width / 2;
          const hh = shape.height / 2;
          // Equilateral triangle centered at (x, y)
          const points = [
            { x: x, y: y - hh }, // Top
            { x: x - hw, y: y + hh }, // Bottom left
            { x: x + hw, y: y + hh }, // Bottom right
          ].map(pt => {
            // Apply rotation
            const dx = pt.x - x;
            const dy = pt.y - y;
            return {
              x: x + dx * Math.cos(angle) - dy * Math.sin(angle),
              y: y + dx * Math.sin(angle) + dy * Math.cos(angle),
            };
          });
          const pointsAttr = points.map(pt => `${pt.x},${pt.y}`).join(' ');
          shapeSvgs += `<polygon points=\\\"${pointsAttr}\\\" ${fillAttr}${opacityAttr} ${filterAttr}/>`;
        }
      });
    });

    if (defs || shadowDefs) {
      svgContent += `<defs>${defs}${shadowDefs}</defs>`;
    }
    if (bgRect) svgContent += bgRect;
    svgContent += shapeSvgs;
    svgContent += `</svg>`;

    const blob = new Blob([svgContent.replace(/\\\"/g, '"')], { type: "image/svg+xml" });
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
    setSelectedShape(null);
    setPendingGrid(true);
  };

  const downloadGrid = () => {
    if (!gridImage) {
      alert("No grid generated yet. Please generate a grid first.");
      return;
    }
    
    // Create a temporary link to download the image
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `grid-${gridCols}x${gridRows}-${timestamp}.png`;
    link.href = gridImage;
    link.click();
  };

  const showGrid = () => {
    return gridImage ? (
      <div className="flex justify-center">
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
  const getSerializableShapes = () => serializeShapes(shapes);

  const exportShapes = () => {
    setSelectedShape(null);
    setPendingExport(true);
  };

  const importShapes = (e) => {
    pushToUndoStack();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const importData = JSON.parse(event.target.result);
        if (importData.shapes && Array.isArray(importData.shapes)) {
          setShapes(deserializeShapes(importData.shapes));
        }
        if (importData.canvasSize) setCanvasSize(importData.canvasSize);
        if (importData.tileType) setTileType(importData.tileType);
        if (importData.canvasBg !== undefined) setCanvasBg(importData.canvasBg);
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

  // Generate thumbnail from canvas
  const generateThumbnail = () => {
    if (!canvasRef.current) return null;
    return new Promise((resolve) => {
      // Wait for the next frame to ensure canvas is fully rendered
      requestAnimationFrame(() => {
        // Add a small delay to ensure all shapes are drawn
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (!canvas) {
            resolve(null);
            return;
          }
          const thumbnailCanvas = document.createElement('canvas');
          const thumbnailSize = 300; // Thumbnail size
          // Calculate aspect ratio
          const aspectRatio = canvas.width / canvas.height;
          let thumbWidth, thumbHeight;
          if (aspectRatio > 1) {
            thumbWidth = thumbnailSize;
            thumbHeight = thumbnailSize / aspectRatio;
          } else {
            thumbHeight = thumbnailSize;
            thumbWidth = thumbnailSize * aspectRatio;
          }
          thumbnailCanvas.width = thumbWidth;
          thumbnailCanvas.height = thumbHeight;
          const ctx = thumbnailCanvas.getContext('2d');
          // Draw the canvas content to thumbnail
          ctx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);
          const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/png', 0.8);
          resolve(thumbnailDataUrl);
        }, 100); // Small delay to ensure rendering is complete
      });
    });
  };

  // Save Project Functionality (save to current project only, using export logic)
  const saveProject = async () => {
    if (!projectName) {
      // This should not happen now since we auto-create projects, but just in case
      await createNewProject();
      return;
    }
    const projectData = {
      shapes: getSerializableShapes(),
      canvasSize,
      tileType,
      canvasBg,
      // Add other relevant state if needed
    };
    const thumbnail = await generateThumbnail();
    saveProjectModel(projectName, projectData, thumbnail);
    alert(`Project '${projectName}' saved!`);
  };

  // Regenerate thumbnail for current project
  const regenerateThumbnail = async () => {
    if (!projectName) {
      // This should not happen now since we auto-create projects, but just in case
      await createNewProject();
      return;
    }
    const thumbnail = await generateThumbnail();
    if (thumbnail) {
      const currentData = loadProjectModel(projectName);
      if (currentData) {
        saveProjectModel(projectName, currentData, thumbnail);
        alert("Thumbnail regenerated successfully!");
      }
    } else {
      alert("Failed to generate thumbnail. Please try again.");
    }
  };

  // Generate a unique project name
  const generateUniqueProjectName = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    const existingProjects = listProjects();
    let baseName = `New Project ${timestamp}`;
    let counter = 1;
    let uniqueName = baseName;
    
    while (existingProjects.some(p => p.name === uniqueName)) {
      uniqueName = `${baseName} (${counter})`;
      counter++;
    }
    
    return uniqueName;
  };

  // Create and save a new project
  const createNewProject = async () => {
    const newProjectName = generateUniqueProjectName();
    const initialData = {
      shapes: [],
      canvasSize: { width: 500, height: 500 },
      tileType: "square",
      canvasBg: "transparent"
    };
    
    // Generate initial thumbnail
    const thumbnail = await generateThumbnail();
    saveProjectModel(newProjectName, initialData, thumbnail);
    
    // Navigate to the new project
    navigate(`/editor/${encodeURIComponent(newProjectName)}`, { replace: true });
    return newProjectName;
  };

  // Load Project Functionality (using the model)
  useEffect(() => {
    const loadOrCreateProject = async () => {
      if (projectName) {
        // Load existing project
        const data = loadProjectModel(projectName);
        if (data && Array.isArray(data.shapes)) {
          setCanvasSize(data.canvasSize || { width: 500, height: 500 });
          setShapes(deserializeShapes(data.shapes));
          if (data.tileType) setTileType(data.tileType);
          if (data.canvasBg !== undefined) setCanvasBg(data.canvasBg);
        } else {
          // If no data, reset to blank
          setCanvasSize({ width: 500, height: 500 });
          setShapes([]);
          setTileType("square");
          setCanvasBg("transparent");
        }
        // Set current project in context
        setCurrentProject({ name: projectName });
      } else {
        // No project is open, create a new one automatically
        const newProjectName = await createNewProject();
        // Set current project in context
        setCurrentProject({ name: newProjectName });
      }
    };

    loadOrCreateProject();
    // Only run on mount or when projectName changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  // Autosave to current project if projectName is present
  useEffect(() => {
    if (!projectName) return;
    // Only save if shapes or canvasSize are not empty/default
    if (shapes.length === 0 && canvasSize.width === 500 && canvasSize.height === 500) return;
    
    const performAutosave = async () => {
      const projectData = { shapes: getSerializableShapes(), canvasSize, tileType, canvasBg };
      const thumbnail = await generateThumbnail();
      saveProjectModel(projectName, projectData, thumbnail);
    };
    
    performAutosave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes, canvasSize, projectName, tileType, canvasBg]);

  useEffect(() => {
    // Download Canvas after unselect
    if (selectedShape === null && pendingDownload) {
      const format = pendingDownload;
      setPendingDownload(false);
      if (format === "svg") {
        (async () => {
          await convertCanvasToSVG();
        })();
        return;
      }
      const canvasEl = canvasRef.current;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvasEl.width;
      exportCanvas.height = canvasEl.height;
      const exportCtx = exportCanvas.getContext("2d");
      exportCtx.drawImage(canvasEl, 0, 0);
      const link = document.createElement("a");
      link.download = `canvas.${format}`;
      link.href = exportCanvas.toDataURL(`image/${format}"`, 1.0);
      link.click();
    }
    // Export Shapes after unselect
    if (selectedShape === null && pendingExport) {
      setPendingExport(false);
      const exportData = {
        shapes: getSerializableShapes(),
        canvasSize,
        tileType,
        canvasBg,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "shapes.flowtile";
      link.href = url;
      link.click();
    }
    // Generate Grid after unselect
    if (selectedShape === null && pendingGrid) {
      setPendingGrid(false);
      const canvasEl = canvasRef.current;
      const ctxEl = canvasEl.getContext("2d");
      const canvasDataEl = ctxEl.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
      const workerEl = new Worker("/gridWorker.js");
      workerEl.postMessage({
        gridCols,
        gridRows,
        canvasData: canvasDataEl,
        canvasWidth: canvasEl.width,
        canvasHeight: canvasEl.height,
        tileType,
        borderEnabled,
        borderWidth,
        borderColor,
      });
      workerEl.onmessage = function (e) {
        const { imageUrl } = e.data;
        setGridImage(URL.createObjectURL(imageUrl));
      };
    }
  }, [selectedShape, pendingDownload, pendingExport, pendingGrid, gridCols, gridRows, tileType, borderEnabled, borderWidth, borderColor]);

  // Move shape from fromIndex to toIndex
  const handleReorderShapes = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setShapes(prevShapes => {
      const updated = [...prevShapes];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // Cleanup: Clear current project when component unmounts
  useEffect(() => {
    return () => {
      setCurrentProject(null);
    };
  }, [setCurrentProject]);

  return (
    <div ref={parentRef} className={`flex flex-col editor ${theme === 'dark' ? 'bg-[#242424]' : 'bg-gray-50'}`} style={{ height: "90vh" }}>
      <div className="flex flex-1" style={{ height: "calc(90vh - 70px)" }}>
        {/* Left Sidebar */}
        <div className={`w-3/10 z-10 ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`}>
          <Sidebar 
            onSectionClick={setActiveSection} 
            activeSection={activeSection}
            addShape={addShape}
            handleImageUpload={handleImageUpload}
            shapes={shapes}
            onSelectShape={setSelectedShape}
            onReorder={handleReorderShapes}
            onLockShape={handleLockShape}
            canvasSize={canvasSize}
            updateCanvasSize={updateCanvasSize}
            downloadCanvas={downloadCanvas}
            setGridCols={setGridCols}
            setGridRows={setGridRows}
            gridCols={gridCols}
            gridRows={gridRows}
            generateGridImageWithWorker={generateGridImageWithWorker}
            showGrid={showGrid}
            downloadGrid={downloadGrid}
            gridImage={gridImage}
            borderEnabled={borderEnabled}
            setBorderEnabled={setBorderEnabled}
            borderWidth={borderWidth}
            setBorderWidth={setBorderWidth}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
          />
        </div>

        {/* Canvas Section */}
        <div className={`w-5/10 flex flex-col items-center p-4 ${theme === 'dark' ? 'bg-[#242424]' : 'bg-white'}`}>
          {/* Tile Type Selector */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tile Type</span>
            <div className={`flex items-center rounded-full p-1 ${theme === 'dark' ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`}>
              <button
                className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                  tileType === "square" 
                    ? theme === 'dark' ? "bg-[#00A5B5] shadow text-white" : "bg-white shadow text-[#00A5B5]"
                    : theme === 'dark' ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTileType("square")}
                type="button"
              >
                Square
              </button>
              <button
                className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                  tileType === "brick" 
                    ? theme === 'dark' ? "bg-[#00A5B5] shadow text-white" : "bg-white shadow text-[#00A5B5]"
                    : theme === 'dark' ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTileType("brick")}
                type="button"
              >
                Brick
              </button>
            </div>
          </div>
          {/* Main Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={`border rounded ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        {/* Tools Section (Sidebar) */}
        <div className={`w-3/10 p-0 pr-0 pb-0 pt-0 flex flex-col ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`}
          style={{
            height: "100%",
          }}
        >
          {selectedShape ? (
            <ArrangeSection
              selectedShape={selectedShape}
              moveShapeUp={moveShapeUp}
              moveShapeDown={moveShapeDown}
              deleteShape={deleteShape}
              shapes={shapes}
              setShapes={setShapes}
              duplicateShape={duplicateShape}
              canvasSize={canvasSize}
              setSelectedShape={setSelectedShape}
              canvasBg={canvasBg}
              setCanvasBg={setCanvasBg}
            />
          ) : (
            <ArrangeSection
              selectedShape={null}
              canvasBg={canvasBg}
              setCanvasBg={setCanvasBg}
              canvasSize={canvasSize}
              setSelectedShape={setSelectedShape}
            />
          )}
        </div>
      </div>
      {/* Bottom Tools Strip - align with main editor content */}
      <div className={`flex justify-center w-full ${theme === 'dark' ? 'bg-[#242424]' : 'bg-transparent'}`}>
        <div
          className={`border-t shadow-lg z-50 flex flex-row items-center justify-center gap-8 py-3 ${
            theme === 'dark' 
              ? 'bg-[#2d2d2d] border-gray-700' 
              : 'bg-white border-gray-300'
          }`}
          style={{ minHeight: 64, width: '100%'}}
        >
          {/* Undo/Redo Group */}
          <div className="flex gap-2 items-center group-undo-redo">
            <button
              onClick={handleUndo}
              className={`toolbar-btn ${
                theme === 'dark' 
                  ? 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a] focus:ring-2 focus:ring-[#00A5B5]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-[#00A5B5]'
              }`}
              disabled={undoStack.length === 0}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <FaUndo className="inline mr-1" /> Undo
            </button>
            <button
              onClick={handleRedo}
              className={`toolbar-btn ${
                theme === 'dark' 
                  ? 'bg-[#3a3a3a] text-gray-300 hover:bg-[#4a4a4a] focus:ring-2 focus:ring-[#00A5B5]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-[#00A5B5]'
              }`}
              disabled={undoStack.length === 0}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <FaRedo className="inline mr-1" /> Redo
            </button>
          </div>
          {/* Import/Export Group */}
          <div className="flex gap-2 items-center group-import-export">
            <button
              onClick={exportShapes}
              className={`toolbar-btn ${
                theme === 'dark' 
                  ? 'bg-green-900 text-green-100 hover:bg-green-800 focus:ring-2 focus:ring-green-400' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-2 focus:ring-green-400'
              }`}
              title="Export Shapes"
              aria-label="Export"
            >
              <FaFileExport className="inline mr-1" /> Export
            </button>
            <label
              htmlFor="upload-input"
              className={`toolbar-btn cursor-pointer flex items-center ${
                theme === 'dark' 
                  ? 'bg-purple-900 text-purple-100 hover:bg-purple-800 focus:ring-2 focus:ring-purple-400' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200 focus:ring-2 focus:ring-purple-400'
              }`}
              title="Import Shapes"
              aria-label="Import"
              style={{ marginBottom: 0 }}
            >
              <FaFileImport className="inline mr-1" /> Import
            </label>
            <input
              type="file"
              accept=".flowtile"
              onChange={importShapes}
              id="upload-input"
              className="hidden"
            />
          </div>
          {/* Download/Save/Load Group */}
          <div className="flex gap-2 items-center group-download-save">
            <button
              className={`toolbar-btn ${
                theme === 'dark' 
                  ? 'bg-blue-900 text-blue-100 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400'
              }`}
              onClick={() => setShowDownloadModal(true)}
              title="Download Canvas"
              aria-label="Download"
            >
              <FaDownload className="inline mr-1" /> Download
            </button>
            <button
              className={`toolbar-btn ${
                theme === 'dark' 
                  ? 'bg-yellow-900 text-yellow-100 hover:bg-yellow-800 focus:ring-2 focus:ring-yellow-400' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400'
              }`}
              onClick={saveProject}
              title="Save Project"
              aria-label="Save"
            >
              <FaSave className="inline mr-1" /> Save
            </button>
            
          </div>
        </div>
      </div>
      {/* Download Settings Modal */}
      {showDownloadModal && (
        <div className="modal-overlay">
          <div
            className={`modal-card ${
              theme === 'dark'
                ? 'bg-[#2d2d2d] border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            style={
              theme === 'dark'
                ? {
                    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.85)',
                    border: '1.5px solid #444',
                  }
                : {}
            }
          >
            <button
              className={`modal-close-btn ${
                theme === 'dark'
                  ? 'text-white hover:text-[#00A5B5]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Close download modal"
              onClick={() => setShowDownloadModal(false)}
            >
              ×
            </button>
            <h2
              className={`modal-title font-semibold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Download Canvas
            </h2>
            <div className="modal-options flex gap-3 mb-4">
              <label
                className={`modal-radio-label flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition border font-medium ${
                  downloadFormat === 'svg'
                    ? 'bg-[#00A5B5] text-white border-[#00A5B5] shadow'
                    : theme === 'dark'
                    ? 'bg-[#3a3a3a] text-white border-gray-600 hover:bg-[#444]'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="svg"
                  checked={downloadFormat === 'svg'}
                  onChange={() => setDownloadFormat('svg')}
                  aria-label="SVG format"
                  className="accent-[#00A5B5] mr-2"
                />
                <span className="modal-radio-icon">🖼️</span>
                <span className="font-semibold">SVG</span>
              </label>
              <label
                className={`modal-radio-label flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition border font-medium ${
                  downloadFormat === 'png'
                    ? 'bg-[#00A5B5] text-white border-[#00A5B5] shadow'
                    : theme === 'dark'
                    ? 'bg-[#3a3a3a] text-white border-gray-600 hover:bg-[#444]'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={downloadFormat === 'png'}
                  onChange={() => setDownloadFormat('png')}
                  aria-label="PNG format"
                  className="accent-[#00A5B5] mr-2"
                />
                <span className="modal-radio-icon">📄</span>
                <span className="font-semibold">PNG</span>
              </label>
            </div>
            <div className="modal-actions flex gap-2 mt-2">
              <button
                className={`modal-btn cancel px-4 py-2 rounded font-medium transition border ${
                  theme === 'dark'
                    ? 'bg-[#3a3a3a] text-white border-gray-600 hover:bg-[#444]'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setShowDownloadModal(false)}
                aria-label="Cancel download"
              >
                Cancel
              </button>
              <button
                className={`modal-btn confirm px-4 py-2 rounded font-semibold transition border ${
                  theme === 'dark'
                    ? 'bg-[#00A5B5] text-white border-[#00A5B5] hover:bg-[#00959f]'
                    : 'bg-[#00A5B5] text-white border-[#00A5B5] hover:bg-[#00959f]'
                }`}
                onClick={() => {
                  setShowDownloadModal(false);
                  downloadCanvas(downloadFormat);
                }}
                aria-label="Confirm download"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Editor;

import React, { useState, useEffect, useRef } from "react";

const ArrangeSection = ({ selectedShape, moveShapeUp, moveShapeDown, deleteShape, setShapes, shapes, duplicateShape }) => {
  const [isShadowExpanded, setIsShadowExpanded] = useState(false);
  const [colorMode, setColorMode] = useState("color");
  const [selectedStopIdx, setSelectedStopIdx] = useState(0);
  const gradientBarRef = useRef(null);

  // Sync colorMode with selectedShape.gradient
  useEffect(() => {
    if (selectedShape) {
      setColorMode(selectedShape.gradient && selectedShape.gradient.length > 0 ? "gradient" : "color");
    }
  }, [selectedShape]);

  useEffect(() => {
    // Reset selected stop when switching shapes or modes
    setSelectedStopIdx(0);
  }, [selectedShape, colorMode]);

  const handleColorModeChange = (mode) => {
    setColorMode(mode);
    if (mode === "color") {
      selectedShape.gradient = null;
      setShapes([...shapes]);
    } else if (mode === "gradient") {
      if (!selectedShape.gradient || selectedShape.gradient.length < 2) {
        selectedShape.gradient = [
          { offset: 0, color: selectedShape.color || "#ff0000" },
          { offset: 1, color: "#0000ff" },
        ];
      }
      setShapes([...shapes]);
    }
  };

  // Helper: get gradient bar background
  const getGradientBarBg = () => {
    if (!selectedShape.gradient) return '#fff';
    return `linear-gradient(90deg, ${selectedShape.gradient
      .slice()
      .sort((a, b) => a.offset - b.offset)
      .map(stop => `${stop.color} ${stop.offset * 100}%`)
      .join(', ')})`;
  };

  // Helper: handle bar click to add stop
  const handleBarClick = (e) => {
    if (!gradientBarRef.current) return;
    const rect = gradientBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const offset = Math.max(0, Math.min(1, x / rect.width));
    // Interpolate color at this offset
    let color = '#000000';
    const sorted = selectedShape.gradient.slice().sort((a, b) => a.offset - b.offset);
    for (let i = 1; i < sorted.length; i++) {
      if (offset <= sorted[i].offset) {
        const prev = sorted[i - 1];
        const next = sorted[i];
        const t = (offset - prev.offset) / (next.offset - prev.offset);
        // Simple linear interpolation (not perceptually accurate)
        const lerp = (a, b) => Math.round(a + (b - a) * t);
        const hexToRgb = hex => hex.length === 7 ? [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)) : [0,0,0];
        const rgbToHex = ([r,g,b]) => `#${[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}`;
        const c1 = hexToRgb(prev.color), c2 = hexToRgb(next.color);
        color = rgbToHex([lerp(c1[0],c2[0]), lerp(c1[1],c2[1]), lerp(c1[2],c2[2])]);
        break;
      }
    }
    selectedShape.gradient.push({ offset, color });
    setShapes([...shapes]);
    setSelectedStopIdx(selectedShape.gradient.length - 1);
  };

  // Helper: handle dragging a stop
  const handleStopDrag = (idx, e) => {
    if (!gradientBarRef.current) return;
    const rect = gradientBarRef.current.getBoundingClientRect();
    const onMove = (moveEvent) => {
      const x = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      let offset = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      // Prevent overlap
      const stops = selectedShape.gradient;
      if (idx > 0) offset = Math.max(offset, stops[idx-1].offset + 0.01);
      if (idx < stops.length-1) offset = Math.min(offset, stops[idx+1].offset - 0.01);
      stops[idx].offset = parseFloat(offset.toFixed(2));
      setShapes([...shapes]);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  // Helper: remove stop
  const handleRemoveStop = (idx) => {
    if (selectedShape.gradient.length <= 2) return;
    selectedShape.gradient.splice(idx, 1);
    setShapes([...shapes]);
    setSelectedStopIdx(0);
  };

  return (
    <div className="arrange-section flex flex-col space-y-4 max-w-full overflow-x-auto overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-2">Arrange</h2>

      {selectedShape ? (
        <>
          {/* Color/Gradient Toggle */}
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="colorMode"
                value="color"
                checked={colorMode === "color"}
                onChange={() => handleColorModeChange("color")}
              />
              Solid Color
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="colorMode"
                value="gradient"
                checked={colorMode === "gradient"}
                onChange={() => handleColorModeChange("gradient")}
              />
              Gradient
            </label>
          </div>

          {/* Show color picker if colorMode is 'color' */}
          {colorMode === "color" && (
            <label>
              Color:
              <input
                type="color"
                value={selectedShape.color}
                onChange={(e) => {
                  selectedShape.color = e.target.value;
                  setShapes([...shapes]);
                }}
                className="ml-2"
              />
            </label>
          )}

          {/* Show gradient editor if colorMode is 'gradient' */}
          {colorMode === "gradient" && (
            <div className="gradient-control p-2 border rounded bg-gray-50 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gradient Editor:</label>
              {selectedShape.gradient && selectedShape.gradient.length > 0 && (
                <>
                  {/* Gradient Bar with Stops */}
                  <div
                    ref={gradientBarRef}
                    className="relative h-8 w-full rounded mb-4 border cursor-pointer flex items-center"
                    style={{ background: getGradientBarBg() }}
                    onClick={handleBarClick}
                  >
                    {selectedShape.gradient
                      .slice()
                      .sort((a, b) => a.offset - b.offset)
                      .map((stop, idx) => {
                        // Find the index in the unsorted array for editing
                        const realIdx = selectedShape.gradient.findIndex(s => s === stop);
                        return (
                          <div
                            key={realIdx}
                            style={{
                              position: 'absolute',
                              left: `calc(${stop.offset * 100}% - 10px)`,
                              top: 0,
                              width: 20,
                              height: 20,
                              zIndex: 2,
                              cursor: 'pointer',
                              border: selectedStopIdx === realIdx ? '2px solid #2563eb' : '2px solid #fff',
                              borderRadius: '50%',
                              background: stop.color,
                              boxShadow: '0 0 2px #0008',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseDown={e => { e.stopPropagation(); handleStopDrag(realIdx, e); setSelectedStopIdx(realIdx); }}
                            onTouchStart={e => { e.stopPropagation(); handleStopDrag(realIdx, e); setSelectedStopIdx(realIdx); }}
                            onClick={e => { e.stopPropagation(); setSelectedStopIdx(realIdx); }}
                          >
                            {selectedShape.gradient.length > 2 && (
                              <span
                                style={{
                                  color: '#fff',
                                  fontSize: 10,
                                  marginLeft: 12,
                                  cursor: 'pointer',
                                  userSelect: 'none',
                                }}
                                title="Remove stop"
                                onClick={ev => { ev.stopPropagation(); handleRemoveStop(realIdx); }}
                              >×</span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {/* Color Picker for Selected Stop */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Selected Stop:</span>
                    <input
                      type="color"
                      value={selectedShape.gradient[selectedStopIdx]?.color || '#000000'}
                      onChange={e => {
                        selectedShape.gradient[selectedStopIdx].color = e.target.value;
                        setShapes([...shapes]);
                      }}
                      className="w-8 h-8 border rounded"
                    />
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedShape.gradient[selectedStopIdx]?.offset || 0}
                      onChange={e => {
                        let val = Math.max(0, Math.min(1, parseFloat(e.target.value)));
                        // Prevent overlap
                        const stops = selectedShape.gradient;
                        if (selectedStopIdx > 0) val = Math.max(val, stops[selectedStopIdx-1].offset + 0.01);
                        if (selectedStopIdx < stops.length-1) val = Math.min(val, stops[selectedStopIdx+1].offset - 0.01);
                        stops[selectedStopIdx].offset = parseFloat(val.toFixed(2));
                        setShapes([...shapes]);
                      }}
                      className="w-16 border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-gray-500">Offset</span>
                  </div>
                  {/* Live preview */}
                  <div className="h-6 w-full rounded mt-2 border" style={{ background: getGradientBarBg() }} />
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded text-xs mt-2"
                    onClick={() => {
                      selectedShape.gradient = null;
                      setShapes([...shapes]);
                      setColorMode('color');
                    }}
                  >
                    Remove Gradient
                  </button>
                </>
              )}
            </div>
          )}

          <div className="rotation-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rotation:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="360"
                value={(selectedShape.rotation * 180) / Math.PI}
                onChange={(e) => {
                  selectedShape.rotation = (e.target.value * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="rotation-dial"
              />
              <input
                type="number"
                min="0"
                max="360"
                value={Math.round((selectedShape.rotation * 180) / Math.PI)}
                onChange={(e) => {
                  let value = Math.min(Math.max(e.target.value, 0), 360);
                  selectedShape.rotation = (value * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="rotation-input border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <span className="rotation-preview text-sm text-gray-500">
                {Math.round((selectedShape.rotation * 180) / Math.PI)}°
              </span>
            </div>
          </div>

          {/* Opacity Control */}
          <div className="opacity-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shape Opacity: {selectedShape.opacity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedShape.opacity}
              onChange={(e) => {
                let newOpacity = parseFloat(e.target.value);
                newOpacity = Math.max(0, Math.min(1, newOpacity));
                console.log("Updating opacity to:", newOpacity);
                selectedShape.opacity = newOpacity;
                setShapes([...shapes]);
              }}
              className="w-full"
            />
          </div>

          {/* Shadow Controls */}
          <div className="shadow-control mb-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded w-full text-left"
              onClick={() => setIsShadowExpanded(!isShadowExpanded)}
            >
              Shadow Settings {isShadowExpanded ? "▲" : "▼"}
            </button>

            {isShadowExpanded && (
              <div className="mt-2 space-y-4 p-3 border rounded bg-white shadow-sm">
                {/* Opacity */}
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 w-24">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.shadow.opacity}
                    onChange={e => {
                      selectedShape.shadow.opacity = parseFloat(e.target.value);
                      setShapes([...shapes]);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.shadow.opacity}
                    onChange={e => {
                      let v = Math.max(0, Math.min(1, parseFloat(e.target.value)));
                      selectedShape.shadow.opacity = v;
                      setShapes([...shapes]);
                    }}
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </div>
                {/* Color */}
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 w-24">Color</label>
                  <input
                    type="color"
                    value={selectedShape.shadow.color}
                    onChange={e => {
                      selectedShape.shadow.color = e.target.value;
                      setShapes([...shapes]);
                    }}
                    className="w-10 h-8 border rounded"
                  />
                </div>
                {/* Blur */}
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 w-24">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={selectedShape.shadow.blur}
                    onChange={e => {
                      selectedShape.shadow.blur = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={selectedShape.shadow.blur}
                    onChange={e => {
                      let v = Math.max(0, Math.min(50, parseInt(e.target.value, 10)));
                      selectedShape.shadow.blur = v;
                      setShapes([...shapes]);
                    }}
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </div>
                {/* Offset X */}
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 w-24">Offset X</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow.offsetX}
                    onChange={e => {
                      selectedShape.shadow.offsetX = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow.offsetX}
                    onChange={e => {
                      let v = Math.max(-100, Math.min(100, parseInt(e.target.value, 10)));
                      selectedShape.shadow.offsetX = v;
                      setShapes([...shapes]);
                    }}
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </div>
                {/* Offset Y */}
                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium text-gray-700 w-24">Offset Y</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow.offsetY}
                    onChange={e => {
                      selectedShape.shadow.offsetY = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow.offsetY}
                    onChange={e => {
                      let v = Math.max(-100, Math.min(100, parseInt(e.target.value, 10)));
                      selectedShape.shadow.offsetY = v;
                      setShapes([...shapes]);
                    }}
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                </div>
                {/* Reset Button */}
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs border hover:bg-gray-300"
                    onClick={() => {
                      selectedShape.shadow = {
                        offsetX: 0,
                        offsetY: 0,
                        blur: 0,
                        color: "#000000",
                        opacity: 1,
                      };
                      setShapes([...shapes]);
                    }}
                  >
                    Reset Shadow
                  </button>
                </div>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-4">Layering</h3>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={moveShapeUp}
          >
            Move Shape Up
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={moveShapeDown}
          >
            Move Shape Down
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={deleteShape}
          >
            Delete Selected
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            onClick={duplicateShape}
          >
            Duplicate Selected
          </button>
        </>
      ) : (
        <p>Select a shape to edit</p>
      )}
    </div>
  );
};

export default ArrangeSection;

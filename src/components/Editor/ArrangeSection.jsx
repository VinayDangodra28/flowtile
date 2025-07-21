import React, { useState, useEffect, useRef } from "react";
import { FaLock, FaLockOpen, FaPalette, FaSlidersH, FaTrash, FaArrowsAltV, FaLayerGroup, FaSun, FaRedo, FaBullseye } from "react-icons/fa";
import { useTheme } from "../../context";

const ArrangeSection = ({ selectedShape, moveShapeUp, moveShapeDown, deleteShape, setShapes, shapes, duplicateShape, canvasSize, setSelectedShape, canvasBg, setCanvasBg }) => {
  const { theme } = useTheme();
  const [isShadowExpanded, setIsShadowExpanded] = useState(false);
  const [colorMode, setColorMode] = useState("color");
  const [selectedStopIdx, setSelectedStopIdx] = useState(0);
  const gradientBarRef = useRef(null);
  const [lockRatio, setLockRatio] = useState(false);
  const [widthPercent, setWidthPercent] = useState(selectedShape ? ((selectedShape.width / canvasSize.width) * 100).toString() : "100");
  const [heightPercent, setHeightPercent] = useState(selectedShape ? ((selectedShape.height / canvasSize.height) * 100).toString() : "100");
  const [activeSection, setActiveSection] = useState(selectedShape ? "layer" : "canvas");
  const [canvasSelectedStopIdx, setCanvasSelectedStopIdx] = useState(0);

  // Automatically switch to default section when selectedShape changes
  useEffect(() => {
    setActiveSection(selectedShape ? "layer" : "canvas");
  }, [selectedShape]);

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

  // Sync with shape changes
  useEffect(() => {
    if (selectedShape) {
      setWidthPercent(((selectedShape.width / canvasSize.width) * 100).toString());
      setHeightPercent(((selectedShape.height / canvasSize.height) * 100).toString());
    }
  }, [selectedShape, canvasSize.width, canvasSize.height]);

  const handleColorModeChange = (mode) => {
    if (!selectedShape) return;
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
    if (!selectedShape || !selectedShape.gradient) return '#fff';
    return `linear-gradient(90deg, ${selectedShape.gradient
      .slice()
      .sort((a, b) => a.offset - b.offset)
      .map(stop => `${stop.color} ${stop.offset * 100}%`)
      .join(', ')})`;
  };

  // Helper: handle bar click to add stop
  const handleBarClick = (e) => {
    if (!gradientBarRef.current || !selectedShape || !selectedShape.gradient) return;
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
    if (!gradientBarRef.current || !selectedShape || !selectedShape.gradient) return;
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
    if (!selectedShape || !selectedShape.gradient || selectedShape.gradient.length <= 2) return;
    selectedShape.gradient.splice(idx, 1);
    setShapes([...shapes]);
    setSelectedStopIdx(0);
  };

  // Section menu config
  const sections = selectedShape
    ? [
        { id: "layer", icon: FaLayerGroup, label: "Actions" },
        { id: "fill", icon: FaPalette, label: "Fill" },
        { id: "resize", icon: FaArrowsAltV, label: "Size & Position" },
        { id: "shadow", icon: FaSun, label: "Shadow" },
      ]
    : [
        { id: "canvas", icon: FaPalette, label: "Canvas" },
      ];

  return (
    <div className={`flex h-full w-full justify-end ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
      {/* Vertical Tabs */}
      
      {/* Section Content */}
      <div className={`flex-1 p-2 flex flex-col gap-4 h-full overflow-y-auto ${
        theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-200'
      }`} style={{maxWidth: 320}}>
        {/* Each section is a card */}
        {activeSection === "fill" && selectedShape && (
          <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
            theme === 'dark' 
              ? 'border-gray-600 bg-[#3a3a3a] text-white' 
              : 'border-gray-200 bg-gray-50 text-gray-900'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Fill</span>
              <div className={`flex items-center rounded-full p-1 ${
                theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-200'
              }`}>
                <button
                  className={`px-3 py-1 rounded-full transition text-xs ${
                    colorMode === "color" 
                      ? theme === 'dark' ? "bg-[#00A5B5] shadow text-white" : "bg-white shadow text-[#00A5B5]"
                      : theme === 'dark' ? "text-gray-300" : "text-gray-500"
                  }`}
                  onClick={() => handleColorModeChange("color")}
                  type="button"
                >
                  Solid
                </button>
                <button
                  className={`px-3 py-1 rounded-full transition text-xs ${
                    colorMode === "gradient" 
                      ? theme === 'dark' ? "bg-[#00A5B5] shadow text-white" : "bg-white shadow text-[#00A5B5]"
                      : theme === 'dark' ? "text-gray-300" : "text-gray-500"
                  }`}
                  onClick={() => handleColorModeChange("gradient")}
                  type="button"
                >
                  Gradient
                </button>
              </div>
            </div>
            {colorMode === "color" && selectedShape && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Color:</span>
                  <label className="relative cursor-pointer">
                    <span
                      className="w-7 h-7 rounded-full border-2 border-gray-300 inline-block"
                      style={{ background: selectedShape.color, display: "inline-block" }}
                      title="Pick color"
                    />
                    <input
                      type="color"
                      value={selectedShape.color}
                      onChange={e => {
                        if (selectedShape) {
                          selectedShape.color = e.target.value;
                          setShapes([...shapes]);
                        }
                      }}
                      className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                      style={{ appearance: "none" }}
                    />
                  </label>
                </div>
                {/* Opacity Control */}
                <div className="flex items-center gap-2">
              <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} w-16`}>Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.opacity !== undefined ? selectedShape.opacity : 1}
                    onChange={e => {
                      if (selectedShape) {
                        selectedShape.opacity = parseFloat(e.target.value);
                        setShapes([...shapes]);
                      }
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.opacity !== undefined ? selectedShape.opacity : 1}
                    onChange={e => {
                      if (selectedShape) {
                        let val = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                        selectedShape.opacity = val;
                        setShapes([...shapes]);
                      }
                    }}
                    className={`w-12 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Opacity value"
                  />
              <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{((selectedShape.opacity !== undefined ? selectedShape.opacity : 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
            {colorMode === "gradient" && selectedShape && (
              <div className={`gradient-control p-2 border rounded mt-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}>
            <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Gradient Editor</label>
                {selectedShape.gradient && selectedShape.gradient.length > 0 && (
                  <>
                    {/* Gradient Bar with Stops */}
                    <div
                      ref={gradientBarRef}
                      className="relative h-10 w-full rounded mb-3 border cursor-pointer flex items-center bg-gradient-to-r from-gray-100 to-gray-200"
                      style={{ background: getGradientBarBg() }}
                      onClick={handleBarClick}
                    >
                      {selectedShape.gradient
                        .slice()
                        .sort((a, b) => a.offset - b.offset)
                        .map((stop, idx) => {
                          const realIdx = selectedShape.gradient.findIndex(s => s === stop);
                          const isSelected = selectedStopIdx === realIdx;
                          return (
                            <div
                              key={realIdx}
                              style={{
                                position: 'absolute',
                                left: `calc(${stop.offset * 100}% - 14px)`,
                                top: 0,
                                width: 28,
                                height: 40,
                                zIndex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              {/* Delete button above stop */}
                              {selectedShape.gradient.length > 2 && (
                                <button
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translate(-50%, -60%)',
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '50%',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ef4444',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    boxShadow: '0 1px 4px #0001',
                                    cursor: 'pointer',
                                  }}
                                  title="Remove stop"
                                  onClick={ev => { ev.stopPropagation(); handleRemoveStop(realIdx); }}
                                >×</button>
                              )}
                              {/* Color swatch for stop */}
                              <label
                                style={{
                                  border: isSelected ? '2px solid #2563eb' : '2px solid #fff',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  background: stop.color,
                                  boxShadow: '0 0 2px #0008',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  marginBottom: 2,
                                }}
                                title="Edit stop color"
                                onMouseDown={e => { e.stopPropagation(); handleStopDrag(realIdx, e); setSelectedStopIdx(realIdx); }}
                                onTouchStart={e => { e.stopPropagation(); handleStopDrag(realIdx, e); setSelectedStopIdx(realIdx); }}
                                onClick={e => { e.stopPropagation(); setSelectedStopIdx(realIdx); }}
                              >
                                <input
                                  type="color"
                                  value={stop.color}
                                  onChange={e => {
                                    stop.color = e.target.value;
                                    setShapes([...shapes]);
                                  }}
                                  className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                                  style={{ appearance: "none" }}
                                />
                              </label>
                            </div>
                          );
                        })}
                    </div>
                    {/* Color Picker for Selected Stop */}
                    <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>Selected Stop:</span>
                      <label className="relative cursor-pointer">
                        <span
                          className="w-7 h-7 rounded-full border-2 border-gray-300 inline-block"
                          style={{ background: selectedShape.gradient[selectedStopIdx]?.color || '#000000', display: "inline-block" }}
                          title="Pick color"
                        />
                        <input
                          type="color"
                          value={selectedShape.gradient[selectedStopIdx]?.color || '#000000'}
                          onChange={e => {
                            if (selectedShape && selectedShape.gradient && selectedShape.gradient[selectedStopIdx]) {
                              selectedShape.gradient[selectedStopIdx].color = e.target.value;
                              setShapes([...shapes]);
                            }
                          }}
                          className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                          style={{ appearance: "none" }}
                        />
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        value={selectedShape.gradient[selectedStopIdx]?.offset || 0}
                        onChange={e => {
                          if (!selectedShape || !selectedShape.gradient || !selectedShape.gradient[selectedStopIdx]) return;
                          let val = Math.max(0, Math.min(1, parseFloat(e.target.value)));
                          // Prevent overlap
                          const stops = selectedShape.gradient;
                          if (selectedStopIdx > 0) val = Math.max(val, stops[selectedStopIdx-1].offset + 0.01);
                          if (selectedStopIdx < stops.length-1) val = Math.min(val, stops[selectedStopIdx+1].offset - 0.01);
                          stops[selectedStopIdx].offset = parseFloat(val.toFixed(2));
                          setShapes([...shapes]);
                        }}
                        className={`w-16 border rounded px-2 py-1 text-xs ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>Offset</span>
                    </div>
                    {/* Gradient Angle */}
                    <div className="flex items-center gap-2 mb-2">
                  <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} w-20`}>Angle</label>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={selectedShape.gradientAngle !== undefined ? selectedShape.gradientAngle : 45}
                        onChange={e => {
                          if (selectedShape) {
                            selectedShape.gradientAngle = parseInt(e.target.value, 10);
                            setShapes([...shapes]);
                          }
                        }}
                        className="flex-1 accent-blue-500"
                      />
                      <input
                        type="number"
                        min={0}
                        max={360}
                        step={1}
                        value={selectedShape.gradientAngle !== undefined ? selectedShape.gradientAngle : 45}
                        onChange={e => {
                          if (selectedShape) {
                            let val = Math.max(0, Math.min(360, parseInt(e.target.value, 10) || 0));
                            selectedShape.gradientAngle = val;
                            setShapes([...shapes]);
                          }
                        }}
                        className={`w-14 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        aria-label="Gradient angle in degrees"
                      />
                      <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>°</span>
                    </div>
                    {/* Live preview */}
                    <div className="h-5 w-full rounded mt-2 border" style={{ background: getGradientBarBg() }} />
                    <button
                      className={`px-3 py-1 rounded text-xs mt-2 ${theme === 'dark' ? 'bg-[#444] text-white hover:bg-[#00A5B5]' : 'bg-gray-400 text-white hover:bg-[#00A5B5]'}`}
                      onClick={() => {
                        if (selectedShape) {
                          selectedShape.gradient = null;
                          setShapes([...shapes]);
                          setColorMode('color');
                        }
                      }}
                    >
                      Remove Gradient
                    </button>
                    {/* Opacity Control for Gradient */}
                    <div className="flex items-center gap-2 mt-3">
                      <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} w-16`}>Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selectedShape.opacity !== undefined ? selectedShape.opacity : 1}
                        onChange={e => {
                          if (selectedShape) {
                            selectedShape.opacity = parseFloat(e.target.value);
                            setShapes([...shapes]);
                          }
                        }}
                        className="flex-1 accent-blue-500"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selectedShape.opacity !== undefined ? selectedShape.opacity : 1}
                        onChange={e => {
                          if (selectedShape) {
                            let val = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                            selectedShape.opacity = val;
                            setShapes([...shapes]);
                          }
                        }}
                        className="w-12 border rounded px-2 py-1 text-xs ml-2"
                        aria-label="Opacity value"
                      />
                      <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{((selectedShape.opacity !== undefined ? selectedShape.opacity : 1) * 100).toFixed(0)}%</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {activeSection === "resize" && selectedShape && (
          <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
            theme === 'dark' 
              ? 'border-gray-600 bg-[#3a3a3a]' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Size & Position</span>
              <button
                className={`ml-2 px-2 py-1 rounded transition border ${
                  lockRatio 
                    ? theme === 'dark' ? "bg-[#00A5B5] border-[#00A5B5] text-white" : "bg-blue-100 border-blue-400"
                    : theme === 'dark' ? "bg-[#2d2d2d] border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300"
                }`}
                title={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                onClick={() => setLockRatio(l => !l)}
                type="button"
              >
                {lockRatio ? <FaLock className="text-blue-600" /> : <FaLockOpen className="text-gray-500" />}
              </button>
            </div>
            {/* Position X */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`w-14 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>X</label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={((selectedShape.x / canvasSize.width) * 100).toFixed(1)}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  selectedShape.x = (percent / 100) * canvasSize.width;
                  setShapes([...shapes]);
                }}
                className="flex-1 accent-blue-500"
                aria-label="X position in %"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={((selectedShape.x / canvasSize.width) * 100).toFixed(1)}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  selectedShape.x = (percent / 100) * canvasSize.width;
                  setShapes([...shapes]);
                }}
                className={`w-16 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                aria-label="X position in %"
              />
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>%</span>
            </div>
            {/* Position Y */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`w-14 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Y</label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={((selectedShape.y / canvasSize.height) * 100).toFixed(1)}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  selectedShape.y = (percent / 100) * canvasSize.height;
                  setShapes([...shapes]);
                }}
                className="flex-1 accent-blue-500"
                aria-label="Y position in %"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={((selectedShape.y / canvasSize.height) * 100).toFixed(1)}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                  selectedShape.y = (percent / 100) * canvasSize.height;
                  setShapes([...shapes]);
                }}
                className={`w-16 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                aria-label="Y position in %"
              />
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>%</span>
            </div>
            {/* Width */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`w-14 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Width</label>
              <input
                type="number"
                min="1"
                step="1"
                value={widthPercent}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(1, parseFloat(e.target.value) || 1);
                  setWidthPercent(percent);
                  let newWidth = (percent / 100) * canvasSize.width;
                  if (lockRatio) {
                    const aspect = selectedShape.width / selectedShape.height;
                    selectedShape.width = newWidth;
                    selectedShape.height = newWidth / aspect;
                  } else {
                    selectedShape.width = newWidth;
                  }
                  setShapes([...shapes]);
                }}
                onBlur={() => {
                  if (selectedShape) {
                    setWidthPercent(
                      ((selectedShape.width / canvasSize.width) * 100).toString().replace(/\.0+$/, '')
                    );
                  }
                }}
                className={`w-16 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                aria-label="Width in %"
              />
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>%</span>
            </div>
            {/* Height */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`w-14 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Height</label>
              <input
                type="number"
                min="1"
                step="1"
                value={heightPercent}
                onChange={e => {
                  if (!selectedShape) return;
                  let percent = Math.max(1, parseFloat(e.target.value) || 1);
                  setHeightPercent(percent);
                  let newHeight = (percent / 100) * canvasSize.height;
                  if (lockRatio) {
                    const aspect = selectedShape.height / selectedShape.width;
                    selectedShape.height = newHeight;
                    selectedShape.width = newHeight * aspect;
                  } else {
                    selectedShape.height = newHeight;
                  }
                  setShapes([...shapes]);
                }}
                onBlur={() => {
                  if (selectedShape) {
                    setHeightPercent(
                      ((selectedShape.height / canvasSize.height) * 100).toString().replace(/\.0+$/, '')
                    );
                  }
                }}
                className={`w-16 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                aria-label="Height in %"
              />
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}>%</span>
            </div>
            {/* Rotation */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`w-14 text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Rotation</label>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={((selectedShape.rotation || 0) * 180 / Math.PI).toFixed(0)}
                onChange={e => {
                  if (!selectedShape) return;
                  selectedShape.rotation = (parseInt(e.target.value, 10) * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                min={0}
                max={360}
                step={1}
                value={((selectedShape.rotation || 0) * 180 / Math.PI).toFixed(0)}
                onChange={e => {
                  if (!selectedShape) return;
                  let deg = Math.max(0, Math.min(360, parseInt(e.target.value, 10) || 0));
                  selectedShape.rotation = (deg * Math.PI) / 180;
                  setShapes([...shapes]);
                }}
                className={`w-14 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                aria-label="Rotation in degrees"
              />
              <span className={`w-10 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>°</span>
            </div>
          </div>
        )}
        {activeSection === "shadow" && selectedShape && (
          <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
            theme === 'dark' 
              ? 'border-gray-600 bg-[#3a3a3a]' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-2">
              <label className={`text-xs font-medium mr-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Enable Shadow</label>
              <input
                type="checkbox"
                checked={!!selectedShape.shadow}
                onChange={e => {
                  if (!selectedShape) return;
                  if (e.target.checked) {
                    if (!selectedShape.shadow) {
                      selectedShape.shadow = {
                        offsetX: 0,
                        offsetY: 0,
                        blur: 0,
                        color: "#000000",
                        opacity: 1,
                      };
                    }
                  } else {
                    selectedShape.shadow = null;
                  }
                  setShapes([...shapes]);
                }}
                className="ml-1"
              />
            </div>
            {!!selectedShape.shadow && <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className={`block text-xs font-medium w-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.shadow?.opacity ?? 1}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      selectedShape.shadow.opacity = parseFloat(e.target.value);
                      setShapes([...shapes]);
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedShape.shadow?.opacity ?? 1}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      let val = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                      selectedShape.shadow.opacity = val;
                      setShapes([...shapes]);
                    }}
                    className={`w-12 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Shadow opacity"
                  />
                  <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{((selectedShape.shadow?.opacity ?? 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`block text-xs font-medium w-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Color</label>
                  <label className="relative cursor-pointer">
                    <span
                      className="w-7 h-7 rounded-full border-2 border-gray-300 inline-block"
                      style={{ background: selectedShape.shadow?.color ?? '#000000', display: "inline-block" }}
                      title="Pick shadow color"
                    />
                    <input
                      type="color"
                      value={selectedShape.shadow?.color ?? '#000000'}
                      onChange={e => {
                        if (!selectedShape.shadow) return;
                        selectedShape.shadow.color = e.target.value;
                        setShapes([...shapes]);
                      }}
                      className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                      style={{ appearance: "none" }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`block text-xs font-medium w-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={selectedShape.shadow?.blur ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      selectedShape.shadow.blur = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={selectedShape.shadow?.blur ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      let val = Math.max(0, Math.min(50, parseInt(e.target.value, 10) || 0));
                      selectedShape.shadow.blur = val;
                      setShapes([...shapes]);
                    }}
                    className={`w-12 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Shadow blur"
                  />
                  <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{selectedShape.shadow?.blur ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`block text-xs font-medium w-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Offset X</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow?.offsetX ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      selectedShape.shadow.offsetX = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow?.offsetX ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      let val = Math.max(-100, Math.min(100, parseInt(e.target.value, 10) || 0));
                      selectedShape.shadow.offsetX = val;
                      setShapes([...shapes]);
                    }}
                    className={`w-12 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Shadow offset X"
                  />
                  <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{selectedShape.shadow?.offsetX ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`block text-xs font-medium w-16 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Offset Y</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow?.offsetY ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      selectedShape.shadow.offsetY = parseInt(e.target.value, 10);
                      setShapes([...shapes]);
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    step="1"
                    value={selectedShape.shadow?.offsetY ?? 0}
                    onChange={e => {
                      if (!selectedShape.shadow) return;
                      let val = Math.max(-100, Math.min(100, parseInt(e.target.value, 10) || 0));
                      selectedShape.shadow.offsetY = val;
                      setShapes([...shapes]);
                    }}
                    className={`w-12 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Shadow offset Y"
                  />
                  <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{selectedShape.shadow?.offsetY ?? 0}</span>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    className={`px-3 py-1 rounded text-xs border ${theme === 'dark' ? 'bg-[#3a3a3a] text-gray-200 border-gray-600 hover:bg-[#4a4a4a]' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
                    onClick={() => {
                      if (!selectedShape) return;
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
                    Reset
                  </button>
                </div>
              </div>
            </>}
          </div>
        )}
        {activeSection === "layer" && selectedShape && (
          <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 items-center w-full max-w-[320px] mx-auto ${
            theme === 'dark' 
              ? 'border-gray-600 bg-[#3a3a3a]' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <span className={`font-semibold text-base mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Actions</span>
            <div className="flex flex-row gap-5 justify-center flex-wrap">
              {/* Duplicate */}
              <div className="flex flex-col items-center">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full border border-blue-200 shadow-sm"
                  onClick={duplicateShape}
                  title="Duplicate Shape"
                  type="button"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#2563eb" strokeWidth="2"/><rect x="2" y="2" width="13" height="13" rx="2" stroke="#2563eb" strokeWidth="2"/></svg>
                </button>
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Duplicate</span>
              </div>
              {/* Delete */}
              <div className="flex flex-col items-center">
                <button
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full border border-red-200 shadow-sm"
                  onClick={deleteShape}
                  title="Delete Shape"
                  type="button"
                >
                  <FaTrash size={18} color="#ef4444" />
                </button>
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Delete</span>
              </div>
              {/* Center */}
              <div className="flex flex-col items-center">
                <button
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full border border-green-200 shadow-sm"
                  onClick={() => {
                    if (selectedShape) {
                      selectedShape.x = canvasSize.width / 2;
                      selectedShape.y = canvasSize.height / 2;
                      setShapes([...shapes]);
                    }
                  }}
                  title="Center Shape"
                  type="button"
                >
                  <FaBullseye className="w-5 h-5" />
                </button>
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Center</span>
              </div>
              {/* Reset */}
              <div className="flex flex-col items-center">
                <button
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-full border border-yellow-200 shadow-sm"
                  onClick={() => {
                    if (selectedShape) {
                      selectedShape.x = canvasSize.width / 2;
                      selectedShape.y = canvasSize.height / 2;
                      selectedShape.width = canvasSize.width * 0.2;
                      selectedShape.height = canvasSize.height * 0.2;
                      selectedShape.rotation = 0;
                      setShapes([...shapes]);
                    }
                  }}
                  title="Reset Size/Position"
                  type="button"
                >
                  <FaRedo className="w-5 h-5" />
                </button>
                <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Reset</span>
              </div>
            </div>
          </div>
        )}
        {/* Canvas Section (when no shape selected) */}
        {activeSection === "canvas" && !selectedShape && (
          <div className={`rounded-xl border shadow-sm p-4 flex flex-col gap-4 w-full max-w-[320px] mx-auto ${
            theme === 'dark' 
              ? 'border-gray-600 bg-[#3a3a3a]' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <span className={`font-semibold text-base mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Canvas Background</span>
            {/* Mode Switch */}
            <div className="flex-col items-center gap-4 mb-3">
              <span className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Background</span>
              <div className={`flex items-center rounded-full p-1 w-full ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`}>
                <button
                  className={`flex-1 px-3 py-1 rounded-full transition text-xs ${canvasBg && typeof canvasBg === 'string' && canvasBg !== 'transparent' ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                  style={{ minWidth: 0 }}
                  onClick={() => setCanvasBg("#ffffff")}
                  type="button"
                >
                  Color
                </button>
                <button
                  className={`flex-1 px-3 py-1 rounded-full transition text-xs ${canvasBg && typeof canvasBg === 'object' && canvasBg.type === 'gradient' ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                  style={{ minWidth: 0 }}
                  onClick={() => setCanvasBg({
                    type: 'gradient',
                    gradient: [
                      { offset: 0, color: "#ff0000" },
                      { offset: 1, color: "#0000ff" },
                    ],
                    gradientAngle: 45,
                  })}
                  type="button"
                >
                  Gradient
                </button>
                <button
                  className={`flex-1 px-3 py-1 rounded-full transition text-xs ${canvasBg === 'transparent' ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                  style={{ minWidth: 0 }}
                  onClick={() => setCanvasBg("transparent")}
                  type="button"
                >
                  Transparent
                </button>
              </div>
            </div>
            {/* Color Picker for Solid */}
            {canvasBg && typeof canvasBg === 'string' && canvasBg !== 'gradient' && canvasBg !== 'transparent' && (
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Color:</span>
                <label className="relative cursor-pointer">
                  <span
                    className="w-7 h-7 rounded-full border-2 border-gray-300 inline-block"
                    style={{ background: canvasBg, display: "inline-block" }}
                    title="Pick color"
                  />
                  <input
                    type="color"
                    value={canvasBg}
                    onChange={e => setCanvasBg(e.target.value)}
                    className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                    style={{ appearance: "none" }}
                  />
                </label>
              </div>
            )}
            {/* Gradient Editor for Canvas */}
            {canvasBg && typeof canvasBg === 'object' && canvasBg.type === 'gradient' && (
              <div className={`gradient-control p-2 border rounded mt-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}>
                <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Gradient Editor</label>
                {/* Gradient Bar with Stops */}
                <div
                  className="relative h-10 w-full rounded mb-3 border cursor-pointer flex items-center bg-gradient-to-r from-gray-100 to-gray-200"
                  style={{ background: (() => {
                    if (!canvasBg.gradient) return '#fff';
                    return `linear-gradient(${canvasBg.gradientAngle ?? 45}deg, ${canvasBg.gradient
                      .slice()
                      .sort((a, b) => a.offset - b.offset)
                      .map(stop => `${stop.color} ${stop.offset * 100}%`)
                      .join(', ')})`;
                  })() }}
                  onClick={e => {
                    // Add stop at click position
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const offset = Math.max(0, Math.min(1, x / rect.width));
                    // Interpolate color
                    let color = '#000000';
                    const sorted = canvasBg.gradient.slice().sort((a, b) => a.offset - b.offset);
                    for (let i = 1; i < sorted.length; i++) {
                      if (offset <= sorted[i].offset) {
                        const prev = sorted[i - 1];
                        const next = sorted[i];
                        const t = (offset - prev.offset) / (next.offset - prev.offset);
                        const lerp = (a, b) => Math.round(a + (b - a) * t);
                        const hexToRgb = hex => hex.length === 7 ? [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)) : [0,0,0];
                        const rgbToHex = ([r,g,b]) => `#${[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}`;
                        const c1 = hexToRgb(prev.color), c2 = hexToRgb(next.color);
                        color = rgbToHex([lerp(c1[0],c2[0]), lerp(c1[1],c2[1]), lerp(c1[2],c2[2])]);
                        break;
                      }
                    }
                    const newStops = [...canvasBg.gradient, { offset, color }];
                    setCanvasBg({ ...canvasBg, gradient: newStops });
                    setCanvasSelectedStopIdx(newStops.length - 1);
                  }}
                >
                  {canvasBg.gradient
                    .slice()
                    .sort((a, b) => a.offset - b.offset)
                    .map((stop, idx) => {
                      const realIdx = canvasBg.gradient.findIndex(s => s === stop);
                      const isSelected = canvasSelectedStopIdx === realIdx;
                      return (
                        <div
                          key={realIdx}
                          style={{
                            position: 'absolute',
                            left: `calc(${stop.offset * 100}% - 14px)`,
                            top: 0,
                            width: 28,
                            height: 40,
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {/* Delete button above stop */}
                          {canvasBg.gradient.length > 2 && (
                            <button
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translate(-50%, -60%)',
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444',
                                fontWeight: 'bold',
                                fontSize: 14,
                                boxShadow: '0 1px 4px #0001',
                                cursor: 'pointer',
                              }}
                              title="Remove stop"
                              onClick={ev => {
                                ev.stopPropagation();
                                const newStops = canvasBg.gradient.slice();
                                newStops.splice(realIdx, 1);
                                setCanvasBg({ ...canvasBg, gradient: newStops });
                                setCanvasSelectedStopIdx(0);
                              }}
                            >×</button>
                          )}
                          {/* Color swatch for stop */}
                          <label
                            style={{
                              border: isSelected ? '2px solid #2563eb' : '2px solid #fff',
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              background: stop.color,
                              boxShadow: '0 0 2px #0008',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              marginBottom: 2,
                            }}
                            title="Edit stop color"
                            onClick={e => { e.stopPropagation(); setCanvasSelectedStopIdx(realIdx); }}
                          >
                            <input
                              type="color"
                              value={stop.color}
                              onChange={e => {
                                const newStops = canvasBg.gradient.slice();
                                newStops[realIdx].color = e.target.value;
                                setCanvasBg({ ...canvasBg, gradient: newStops });
                              }}
                              className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                              style={{ appearance: "none" }}
                            />
                          </label>
                        </div>
                      );
                    })}
                </div>
                {/* Color Picker for Selected Stop */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>Selected Stop:</span>
                  <label className="relative cursor-pointer">
                    <span
                      className="w-7 h-7 rounded-full border-2 border-gray-300 inline-block"
                      style={{ background: canvasBg.gradient[canvasSelectedStopIdx]?.color || '#000000', display: "inline-block" }}
                      title="Pick color"
                    />
                    <input
                      type="color"
                      value={canvasBg.gradient[canvasSelectedStopIdx]?.color || '#000000'}
                      onChange={e => {
                        const newStops = canvasBg.gradient.slice();
                        newStops[canvasSelectedStopIdx].color = e.target.value;
                        setCanvasBg({ ...canvasBg, gradient: newStops });
                      }}
                      className="absolute left-0 top-0 w-7 h-7 opacity-0 cursor-pointer"
                      style={{ appearance: "none" }}
                    />
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={canvasBg.gradient[canvasSelectedStopIdx]?.offset || 0}
                    onChange={e => {
                      let val = Math.max(0, Math.min(1, parseFloat(e.target.value)));
                      // Prevent overlap
                      const stops = canvasBg.gradient;
                      if (canvasSelectedStopIdx > 0) val = Math.max(val, stops[canvasSelectedStopIdx-1].offset + 0.01);
                      if (canvasSelectedStopIdx < stops.length-1) val = Math.min(val, stops[canvasSelectedStopIdx+1].offset - 0.01);
                      const newStops = canvasBg.gradient.slice();
                      newStops[canvasSelectedStopIdx].offset = parseFloat(val.toFixed(2));
                      setCanvasBg({ ...canvasBg, gradient: newStops });
                    }}
                    className={`w-16 border rounded px-2 py-1 text-xs ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}>Offset</span>
                </div>
                {/* Gradient Angle */}
                <div className="flex items-center gap-2 mb-2">
                  <label className={`block text-xs font-medium w-20 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Angle</label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={canvasBg.gradientAngle ?? 45}
                    onChange={e => {
                      setCanvasBg({ ...canvasBg, gradientAngle: parseInt(e.target.value, 10) });
                    }}
                    className="flex-1 accent-blue-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={360}
                    step={1}
                    value={canvasBg.gradientAngle ?? 45}
                    onChange={e => {
                      let val = Math.max(0, Math.min(360, parseInt(e.target.value, 10) || 0));
                      setCanvasBg({ ...canvasBg, gradientAngle: val });
                    }}
                    className={`w-14 border rounded px-2 py-1 text-xs ml-2 ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    aria-label="Gradient angle in degrees"
                  />
                  <span className={`w-8 text-right text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>°</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <nav className={`flex flex-col items-center py-6 px-1 gap-2 border-r h-full min-w-[60px] max-w-[70px] ${
        theme === 'dark' 
          ? 'bg-[#3a3a3a] border-gray-600' 
          : 'bg-gray-400 border-gray-200'
      }`}>
        {sections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg transition font-medium text-xs ${
              activeSection === id 
                ? theme === 'dark' ? 'bg-[#00A5B5] text-white shadow' : 'bg-[#00A5B5] text-white shadow'
                : theme === 'dark' ? 'hover:bg-[#4a4a4a] text-gray-300' : 'hover:bg-gray-200 text-gray-800'
            }`}
            title={label}
            type="button"
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[11px]">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ArrangeSection;

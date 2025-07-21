import React, { useState } from "react";
import { useTheme } from "../context";
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutPanelTop, 
  Image, 
  Paintbrush, 
  Layers, 
  Grid3x3,
  Square,
  Circle,
  Triangle,
  Download,
  Save,
  Upload,
  FileDown,
  Undo,
  Redo,
  Copy,
  Trash2,
  Lock,
  Move,
  RotateCw,
  Palette,
  Sliders,
  Eye,
  Settings
} from "lucide-react";

const DocsPage = () => {
  const { theme } = useTheme();
  const [openSections, setOpenSections] = useState({
    'getting-started': true,
    'interface': false,
    'tools': false,
    'shapes': false,
    'canvas': false,
    'layers': false,
    'grid': false,
    'keyboard': false,
    'export': false,
    'tips': false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ id, title, icon: Icon, children }) => (
    <div className={`rounded-lg border ${
      theme === 'dark' 
        ? 'border-gray-600 bg-[#2d2d2d]' 
        : 'border-gray-200 bg-white'
    } shadow-sm overflow-hidden`}>
      <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors ${
          theme === 'dark'
            ? 'hover:bg-[#3a3a3a] text-white'
            : 'hover:bg-gray-50 text-gray-900'
        }`}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#00A5B5]" />
          <h2 className="text-base md:text-lg font-semibold">{title}</h2>
        </div>
        {openSections[id] ? (
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
      {openSections[id] && (
        <div className={`p-3 md:p-4 border-t ${
          theme === 'dark' 
            ? 'border-gray-600 bg-[#242424]' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          {children}
        </div>
      )}
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, features }) => (
    <div className={`rounded-lg border p-3 md:p-4 ${
      theme === 'dark'
        ? 'border-gray-600 bg-[#3a3a3a]'
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#00A5B5] flex-shrink-0" />
        <h3 className={`font-semibold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>
      <p className={`text-xs md:text-sm mb-2 md:mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
      {features && (
        <ul className={`text-xs md:text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#00A5B5] rounded-full flex-shrink-0 mt-1.5"></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const KeyboardShortcut = ({ keys, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2">
      <span className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {description}
      </span>
      <div className="flex items-center gap-1 flex-wrap">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className={`px-2 py-1 text-xs font-mono rounded ${
              theme === 'dark'
                ? 'bg-[#3a3a3a] border border-gray-600 text-gray-300'
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}>
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-gray-500">+</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${
        theme === 'dark' 
          ? 'border-gray-700 bg-[#242424]' 
          : 'border-gray-200 bg-white'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-start md:items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00A5B5] to-[#00859A] rounded-xl flex items-center justify-center flex-shrink-0">
              <LayoutPanelTop className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                FlowTile Documentation
              </h1>
              <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete guide to the FlowTile visual design editor
              </p>
            </div>
          </div>
          <div className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Learn how to create stunning visual designs with our powerful shape editor and grid system
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
        <div className="space-y-4 md:space-y-6">
          
          {/* Getting Started */}
          <SectionHeader id="getting-started" title="Getting Started" icon={Settings}>
            <div className="space-y-4">
              <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                FlowTile is a powerful visual design editor that allows you to create, arrange, and export geometric shapes 
                and designs. Whether you're creating patterns, layouts, or artistic compositions, FlowTile provides the tools 
                you need to bring your vision to life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <FeatureCard
                  icon={LayoutPanelTop}
                  title="Shape Creation"
                  description="Add and customize various geometric shapes"
                  features={["Squares, circles, triangles", "Custom colors and gradients", "Opacity and shadow effects", "Image support"]}
                />
                <FeatureCard
                  icon={Grid3x3}
                  title="Grid System"
                  description="Generate perfect tile patterns"
                  features={["Square and brick layouts", "Customizable dimensions", "Border controls", "Export as images"]}
                />
              </div>
            </div>
          </SectionHeader>

          {/* Interface Overview */}
          <SectionHeader id="interface" title="Interface Overview" icon={LayoutPanelTop}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                The FlowTile interface is divided into three main areas: the left sidebar for tools and elements, 
                the center canvas for your design, and the right panel for shape properties.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-[#3a3a3a]' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Left Sidebar
                  </h4>
                  <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Elements panel</li>
                    <li>• Canvas settings</li>
                    <li>• Layers management</li>
                    <li>• Grid generator</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-[#3a3a3a]' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Center Canvas
                  </h4>
                  <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Design workspace</li>
                    <li>• Tile type selector</li>
                    <li>• Visual snap guides</li>
                    <li>• Interactive editing</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-[#3a3a3a]' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Right Panel
                  </h4>
                  <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Shape properties</li>
                    <li>• Color controls</li>
                    <li>• Transform options</li>
                    <li>• Background settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </SectionHeader>

          {/* Tools & Actions */}
          <SectionHeader id="tools" title="Tools & Actions" icon={Settings}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                The bottom toolbar provides quick access to essential editing functions and project management tools.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Editing Tools
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Undo className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Undo/Redo</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Step backward or forward through your edit history
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Copy className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Duplicate</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Create copies of selected shapes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Delete</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Remove shapes from the canvas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Project Management
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Save className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Save Project</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Save your work with automatic thumbnail generation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileDown className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Export/Import</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Share designs or load existing projects
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-[#00A5B5]" />
                      <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Download</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Export your canvas as SVG or PNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionHeader>

          {/* Shape Management */}
          <SectionHeader id="shapes" title="Shape Management" icon={Square}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Create and manipulate various geometric shapes with powerful customization options.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Available Shapes
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rectangle/Square</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Circle/Ellipse</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Triangle className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Triangle</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Images (PNG, JPG, GIF)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Transform Operations
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Move className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Move and position with snap guides</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sliders className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Resize with aspect ratio lock</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCw className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rotate around center point</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-[#00A5B5]" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Lock to prevent accidental edits</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-l-4 border-[#00A5B5] ${
                theme === 'dark' ? 'bg-[#3a3a3a]' : 'bg-blue-50'
              }`}>
                <h5 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Pro Tip: Shape Properties
                </h5>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select any shape to access advanced properties including colors, gradients, opacity, shadows, 
                  and precise positioning controls in the right panel.
                </p>
              </div>
            </div>
          </SectionHeader>

          {/* Canvas Controls */}
          <SectionHeader id="canvas" title="Canvas Controls" icon={Paintbrush}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Customize your workspace and canvas settings for optimal design creation.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Sliders}
                  title="Canvas Size"
                  description="Set custom dimensions for your design"
                  features={["Width and height controls", "Automatic aspect ratio", "Maximum size limits", "Responsive constraints"]}
                />
                <FeatureCard
                  icon={Palette}
                  title="Background Options"
                  description="Choose how your canvas appears"
                  features={["Transparent background", "Solid colors", "Gradient backgrounds", "Pattern overlays"]}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Grid3x3}
                  title="Tile Types"
                  description="Select layout patterns for your design"
                  features={["Square grid layout", "Brick pattern offset", "Custom spacing", "Alignment guides"]}
                />
                <FeatureCard
                  icon={Download}
                  title="Export Options"
                  description="Download your canvas in various formats"
                  features={["SVG vector format", "PNG raster format", "High-quality output", "Scalable graphics"]}
                />
              </div>
            </div>
          </SectionHeader>

          {/* Layers System */}
          <SectionHeader id="layers" title="Layers System" icon={Layers}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Manage the stacking order and organization of your design elements.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Layer Operations
                  </h4>
                  <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Drag and drop to reorder layers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Move shapes forward or backward
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Lock layers to prevent editing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Visual layer thumbnails
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Selection Features
                  </h4>
                  <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Click any layer to select on canvas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Visual selection highlighting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Quick duplicate and delete
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full"></span>
                      Shape type identification
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SectionHeader>

          {/* Grid Generator */}
          <SectionHeader id="grid" title="Grid Generator" icon={Grid3x3}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Create perfect tile patterns and grids from your canvas design.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Grid3x3}
                  title="Grid Configuration"
                  description="Set up your pattern dimensions"
                  features={["Custom rows and columns", "Square or brick layout", "Automatic tiling", "Preview generation"]}
                />
                <FeatureCard
                  icon={Sliders}
                  title="Border Controls"
                  description="Add borders to your grid pattern"
                  features={["Enable/disable borders", "Custom border width", "Color selection", "Pattern integration"]}
                />
              </div>
              <div className={`p-4 rounded-lg border-l-4 border-[#00A5B5] ${
                theme === 'dark' ? 'bg-[#3a3a3a]' : 'bg-blue-50'
              }`}>
                <h5 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Grid Export Process
                </h5>
                <ol className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>1. Configure grid dimensions (rows × columns)</li>
                  <li>2. Choose tile type (square or brick pattern)</li>
                  <li>3. Set border preferences if desired</li>
                  <li>4. Generate preview to check the pattern</li>
                  <li>5. Download the final grid as PNG image</li>
                </ol>
              </div>
            </div>
          </SectionHeader>

          {/* Keyboard Shortcuts */}
          <SectionHeader id="keyboard" title="Keyboard Shortcuts" icon={Settings}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Speed up your workflow with these keyboard shortcuts.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    General Actions
                  </h4>
                  <div className={`space-y-1 ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <KeyboardShortcut keys={['Ctrl', 'Z']} description="Undo last action" />
                    <KeyboardShortcut keys={['Ctrl', 'Y']} description="Redo last action" />
                    <KeyboardShortcut keys={['Ctrl', 'S']} description="Save project" />
                    <KeyboardShortcut keys={['Del']} description="Delete selected shape" />
                    <KeyboardShortcut keys={['Ctrl', 'D']} description="Duplicate selected shape" />
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Shape Manipulation
                  </h4>
                  <div className={`space-y-1 ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <KeyboardShortcut keys={['Shift', 'Drag']} description="Maintain aspect ratio while resizing" />
                    <KeyboardShortcut keys={['↑']} description="Move shape up in layers" />
                    <KeyboardShortcut keys={['↓']} description="Move shape down in layers" />
                    <KeyboardShortcut keys={['L']} description="Lock/unlock selected shape" />
                    <KeyboardShortcut keys={['Esc']} description="Deselect all shapes" />
                  </div>
                </div>
              </div>
            </div>
          </SectionHeader>

          {/* Export & Sharing */}
          <SectionHeader id="export" title="Export & Sharing" icon={Download}>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Multiple ways to save and share your FlowTile creations.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <FeatureCard
                  icon={Download}
                  title="Canvas Download"
                  description="Export your design"
                  features={["SVG vector format", "PNG raster format", "High resolution", "Transparent backgrounds"]}
                />
                <FeatureCard
                  icon={FileDown}
                  title="Project Export"
                  description="Share complete projects"
                  features={["FlowTile project files", "All shape data included", "Cross-platform compatible", "Version control friendly"]}
                />
                <FeatureCard
                  icon={Grid3x3}
                  title="Grid Export"
                  description="Download pattern grids"
                  features={["PNG format", "Custom dimensions", "Tile patterns", "Border options"]}
                />
              </div>
            </div>
          </SectionHeader>

          {/* Tips & Best Practices */}
          <SectionHeader id="tips" title="Tips & Best Practices" icon={Eye}>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Design Tips
                  </h4>
                  <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Use snap guides for precise alignment by dragging shapes near other elements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Hold Shift while resizing to maintain aspect ratios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Lock background elements to prevent accidental editing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Use the layers panel to organize complex designs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Workflow Tips
                  </h4>
                  <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Save frequently with Ctrl+S for automatic backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Export projects to share with collaborators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Use descriptive project names for better organization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00A5B5] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Test grid patterns before creating large designs</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'border-green-600 bg-green-900/20' 
                  : 'border-green-200 bg-green-50'
              }`}>
                <h5 className={`font-semibold mb-2 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-800'
                }`}>
                  <span className="text-lg">💡</span> Pro Workflow
                </h5>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-green-200' : 'text-green-700'
                }`}>
                  Start with a basic canvas size, create your core design elements, then test the pattern using 
                  the grid generator. Once satisfied, increase the grid dimensions for your final export. 
                  This iterative approach saves time and ensures consistent results.
                </p>
              </div>
            </div>
          </SectionHeader>

        </div>

        {/* Footer */}
        <footer
          className={`text-center py-8 mt-12 border-t transition-colors duration-300
            ${theme === 'dark' ? 'border-gray-700 bg-[#181c1f] text-gray-400' : 'border-gray-200 bg-[#fafdff] text-gray-500'}`}
        >
          <p className="text-sm mb-2">
            Need help? Check out the interface tooltips.
          </p>
          <div className="flex justify-center items-center gap-2 text-xs opacity-80">
            <span className="font-semibold">FlowTile</span>
            <span>•</span>
            <span>{new Date().getFullYear()} &copy; All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DocsPage;

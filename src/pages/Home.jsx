import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Maximize2, Repeat, Grid, Layers, Download, RotateCw, Copy, Palette } from "lucide-react";
import { SampleGallery, TileBurst } from "../components/shared";
import "../styles/homepage.css";
import { useTheme } from "../context";

// Colors from logo and complementary palette
const logoColors = [
  'from-[#00343C] to-[#00A5B5]', // deep teal to aqua
  'from-[#00A5B5] to-[#006B74]', // aqua to dark teal
  'from-[#00A5B5] to-[#82E9F0]', // aqua to light aqua
  'from-[#00343C] to-[#006B74]', // deep teal to dark teal
];

const complementaryColors = {
  coral: '#FF6B6B',
  sand: '#FFE3D8',
  mint: '#98D7C2',
  deepBlue: '#167D7F'
};


// Improved FeatureCard: adjusts background and text contrast based on position and theme
const FeatureCard = ({ icon, title, description, colorIdx = 0 }) => {
  const { theme } = useTheme();

  // For homepage, alternate backgrounds for cards for visual rhythm
  // Odd cards: slightly lighter dark, Even cards: slightly darker dark
  // In light mode, alternate subtle grays
  const isEven = colorIdx % 2 === 0;
  const darkBg = isEven ? '#23272b' : '#292d31';
  const darkText = isEven ? '#eaf6fa' : '#f3f3f3';
  const darkDesc = isEven ? '#b6c2ce' : '#bfcad6';
  const lightBg = isEven ? '#fafdff' : '#f3f7fa';
  const lightText = '#00343C';
  const lightDesc = '#006B74';

  // Border color for top accent
  const borderColors = [
    complementaryColors.coral,
    complementaryColors.mint,
    complementaryColors.deepBlue,
    '#82E9F0'
  ];

  return (
    <div
      className={`rounded-xl shadow-md hover:shadow-lg transition-all p-4 md:p-6 border feature-card transform hover:-translate-y-1 duration-300 border-t-4 ${theme === 'dark' ? '' : ''}`}
      style={{
        background: theme === 'dark' ? darkBg : lightBg,
        color: theme === 'dark' ? darkText : lightText,
        borderColor: theme === 'dark' ? '#3a3a3a' : '#e0f7fa',
        borderTop: `4px solid ${borderColors[colorIdx % borderColors.length]}`
      }}
    >
      <div className={`mb-3 md:mb-4 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${logoColors[colorIdx % logoColors.length]} text-white`}>
        {icon}
      </div>
      <h3
        className="text-lg md:text-xl font-semibold mb-2"
        style={{ color: theme === 'dark' ? darkText : lightText }}
      >
        {title}
      </h3>
      <p
        className="text-sm md:text-base"
        style={{ color: theme === 'dark' ? darkDesc : lightDesc }}
      >
        {description}
      </p>
    </div>
  );
};

const GradientButton = ({ to, children, primary }) => {
  const { theme } = useTheme();
  
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1 ${
        primary 
          ? "bg-gradient-to-r from-[#00343C] to-[#00A5B5] hover:from-[#006B74] hover:to-[#82E9F0] text-white shadow-lg hover:shadow-xl" 
          : theme === 'dark' 
            ? "bg-[#2d2d2d] text-[#82E9F0] hover:bg-[#3a3a3a] border border-[#00A5B5] hover:border-[#82E9F0]" 
            : "bg-white text-[#00343C] hover:bg-gray-50 border border-[#00A5B5] hover:border-[#82E9F0]"
      }`}
    >
      {children}
    </Link>
  );
};

const Home = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const steps = document.querySelectorAll('[data-step]');
      const stepImages = document.querySelectorAll('.step-image');
      const stepLabel = document.querySelector('.step-label');
      const stepTitle = document.querySelector('.step-title');
      const stepDescription = document.querySelector('.step-description');
      const stepStatus = document.querySelector('.step-status');

      const stepData = {
        1: {
          label: "Design Canvas",
          title: "Start Designing", 
          description: "Add shapes and elements to your single tile canvas. Watch as they automatically prepare for seamless tiling.",
          status: "Design elements ready"
        },
        2: {
          label: "Edge Wrapping",
          title: "Smart Edge Detection",
          description: "Elements near edges automatically wrap to opposite sides. See how your shapes connect seamlessly across tile boundaries.",
          status: "Edge-connected elements"
        },
        3: {
          label: "Pattern Layout",
          title: "Choose Tile Pattern",
          description: "Select between square or brick tiling patterns. Your design adapts to create perfect repetition in any layout.",
          status: "Pattern layout applied"
        },
        4: {
          label: "Seamless Grid",
          title: "Generate Full Grid",
          description: "Export as multi-tile grid to see infinite repetition. Your pattern maintains perfect continuity across any surface.",
          status: "Grid generation ready"
        }
      };

      let currentStep = 1;
      
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if step is in viewport center
        if (rect.top <= viewportHeight * 0.6 && rect.bottom >= viewportHeight * 0.4) {
          currentStep = index + 1;
        }
      });

      // Update step images visibility
      stepImages.forEach(image => {
        const stepNumber = image.getAttribute('data-step-image');
        if (stepNumber == currentStep) {
          image.style.opacity = '1';
        } else {
          image.style.opacity = '0';
        }
      });

      // Update labels and descriptions
      if (stepData[currentStep]) {
        if (stepLabel) stepLabel.textContent = stepData[currentStep].label;
        if (stepTitle) stepTitle.textContent = stepData[currentStep].title;
        if (stepDescription) stepDescription.textContent = stepData[currentStep].description;
        if (stepStatus) stepStatus.textContent = stepData[currentStep].status;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-[90vh] ${theme === 'dark' ? 'bg-[#242424]' : 'bg-gradient-to-b from-[#e6fafd] via-[#f6ffff] to-[#e6fafd]'} hero-pattern`}>
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-16 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {theme === 'dark' ? (
            // Solid background with minimal texture in dark mode
            <div className="absolute inset-0 bg-[#242424]">
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
            </div>
          ) : (
            <>
              <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-50 to-transparent opacity-70"></div>
              <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float bg-purple-100"></div>
              <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 bg-indigo-100"></div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-center justify-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`} style={{ fontFamily: 'Garbata, sans-serif' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 min-h-[3.5rem] sm:min-h-[4.5rem] md:min-h-[5.5rem] lg:min-h-[6.5rem]">
                <span>Create Patterns That</span>
                <div className="hidden md:block">
                  <TileBurst />
                </div>
              </div>
              <div className="md:hidden mt-4">
                <TileBurst />
              </div>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-3 md:mb-4 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Design seamless repeating patterns for walls, tiles, fabrics, and digital art. What you create on one tile magically appears on all connected tiles.
            </p>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-6 md:mb-10 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              FlowTile's smart edge-wrapping technology ensures your patterns connect flawlessly across any surface.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <GradientButton to="/editor" primary>
                Start Creating <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </GradientButton>
              <GradientButton to="/projects">
                View Projects
              </GradientButton>
            </div>
          </div>

          {/* Preview Image */}
          <div className={`relative mx-auto max-w-5xl shadow-2xl rounded-xl md:rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-700 ring-1 ring-[#3a3a3a]' : 'border-gray-200'}`}>
            <div className={`aspect-video flex items-center justify-center relative ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
              {/* Editor screenshot */}
              <div className="relative w-full h-full">
                <img src="/flowtilescreenshot.png" alt="FlowTile Editor Preview" className={`w-full h-full object-cover z-0 ${theme === 'dark' ? 'opacity-90' : 'opacity-100'}`} />
                {/* <div className={`absolute bottom-2 left-0 right-0 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  <p className="text-sm font-medium">Create patterns that repeat seamlessly</p>
                </div> */}
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-black/40 to-transparent' : 'from-black/20 to-transparent'} z-10`}></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#242424]' : 'bg-gradient-to-br from-[#00343C]/5 to-[#82E9F0]/5'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-gray-50 relative inline-block' : 'text-[#00343C]'}`} style={{ fontFamily: 'Garbata, sans-serif' }}>
              How FlowTile Magic Works
              {theme === 'dark' && <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00A5B5] to-transparent"></span>}
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>
              Discover the seamless edge technology that makes patterns connect perfectly across any surface.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-12 md:space-y-24">
              <div className="flex items-start gap-4 md:gap-6 min-h-[300px] md:min-h-[400px]" data-step="1">
                <div className="relative">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00343C] to-[#00A5B5] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    1
                  </div>
                  <div className={`absolute left-1/2 top-full h-16 md:h-24 w-0.5 bg-gradient-to-b ${theme === 'dark' ? 'from-[#00A5B5]/70' : 'from-[#00A5B5]'} to-transparent`}></div>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>Design on Your Canvas</h3>
                  <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Start with a single tile canvas. Add shapes, upload images, or create custom designs using our intuitive editor.</p>
                  <div className="space-y-3 md:space-y-4">
                    <div className={`rounded-lg p-3 md:p-4 shadow-sm border ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#374151]' : 'bg-white border-[#82E9F0]/20'}`}>
                      <h4 className={`font-medium mb-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>✨ What happens in this step:</h4>
                      <ul className={`text-xs md:text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>
                        <li>• Create your design on a single tile</li>
                        <li>• Add basic shapes like circles, squares, triangles</li>
                        <li>• Upload your own images and graphics</li>
                        <li>• Use the intuitive drag-and-drop interface</li>
                      </ul>
                    </div>
                  </div>
                  {/* Mobile image for step 1 */}
                  <div className="lg:hidden mt-4">
                    <div className={`relative aspect-square rounded-lg overflow-hidden border-2 max-w-xs mx-auto ${theme === 'dark' ? 'border-[#00A5B5]/10' : 'border-[#00A5B5]/20'}`}>
                      <img src="/step_1.png" alt="Design Canvas - Add shapes to your tile" className="w-full h-full object-contain" />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#00A5B5]/80' : 'bg-[#00A5B5]'} text-white`}>
                        Step 1
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 min-h-[300px] md:min-h-[400px]" data-step="2">
                <div className="relative">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00A5B5] to-[#006B74] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    2
                  </div>
                  <div className={`absolute left-1/2 top-full h-16 md:h-24 w-0.5 bg-gradient-to-b ${theme === 'dark' ? 'from-[#006B74]/70' : 'from-[#006B74]'} to-transparent`}></div>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>Smart Edge Wrapping</h3>
                  <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Every shape you create automatically appears at all 8 surrounding positions, creating seamless edge connections. Move a shape near an edge to see it wrap to the opposite side.</p>
                  <div className="space-y-3 md:space-y-4">
                    <div className={`rounded-lg p-3 md:p-4 shadow-sm border ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#374151]' : 'bg-white border-[#82E9F0]/20'}`}>
                      <h4 className={`font-medium mb-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>🔄 Watch the magic happen:</h4>
                      <ul className={`text-xs md:text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>
                        <li>• Shapes automatically appear on opposite edges</li>
                        <li>• Elements crossing boundaries wrap seamlessly</li>
                        <li>• Real-time preview of edge connections</li>
                        <li>• No manual positioning required</li>
                      </ul>
                    </div>
                  </div>
                  {/* Mobile image for step 2 */}
                  <div className="lg:hidden mt-4">
                    <div className={`relative aspect-square rounded-lg overflow-hidden border-2 max-w-xs mx-auto ${theme === 'dark' ? 'border-[#00A5B5]/10' : 'border-[#00A5B5]/20'}`}>
                      <img src="/step_2.png" alt="Edge Wrapping - Elements wrap to opposite sides" className="w-full h-full object-contain" />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#006B74]/80' : 'bg-[#006B74]'} text-white`}>
                        Step 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 min-h-[300px] md:min-h-[400px]" data-step="3">
                <div className="relative">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#006B74] to-[#00A5B5] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    3
                  </div>
                  <div className={`absolute left-1/2 top-full h-16 md:h-24 w-0.5 bg-gradient-to-b ${theme === 'dark' ? 'from-[#00A5B5]/70' : 'from-[#00A5B5]'} to-transparent`}></div>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>Choose Tile Pattern</h3>
                  <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Select between square or brick tiling patterns. Your design adapts to create perfect repetition in any layout.</p>
                  <div className="space-y-3 md:space-y-4">
                    <div className={`rounded-lg p-3 md:p-4 shadow-sm border ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#374151]' : 'bg-white border-[#82E9F0]/20'}`}>
                      <h4 className={`font-medium mb-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>🔲 Pattern options:</h4>
                      <ul className={`text-xs md:text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>
                        <li>• Square pattern: Perfect grid alignment</li>
                        <li>• Brick pattern: Offset rows for variety</li>
                        <li>• Instant preview of both layouts</li>
                        <li>• Switch between patterns anytime</li>
                      </ul>
                    </div>
                  </div>
                  {/* Mobile image for step 3 */}
                  <div className="lg:hidden mt-4">
                    <div className={`relative aspect-square rounded-lg overflow-hidden border-2 max-w-xs mx-auto ${theme === 'dark' ? 'border-[#00A5B5]/10' : 'border-[#00A5B5]/20'}`}>
                      <img src="/step_3.png" alt="Choose Tile Pattern - Square or brick layouts" className="w-full h-full object-contain" />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#006B74]/80' : 'bg-[#006B74]'} text-white`}>
                        Step 3
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-6 min-h-[300px] md:min-h-[400px]" data-step="4">
                <div className="relative">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00A5B5] to-[#82E9F0] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>Generate Seamless Grid</h3>
                  <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Export your pattern as a multi-tile grid to see how it repeats infinitely across any surface, maintaining perfect continuity.</p>
                  <div className="space-y-3 md:space-y-4">
                    <div className={`rounded-lg p-3 md:p-4 shadow-sm border ${theme === 'dark' ? 'bg-[#2d2d2d] border-[#374151]' : 'bg-white border-[#82E9F0]/20'}`}>
                      <h4 className={`font-medium mb-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#00343C]'}`}>📥 Export options:</h4>
                      <ul className={`text-xs md:text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>
                        <li>• Single tile for pattern libraries</li>
                        <li>• Multi-tile grid for visualization</li>
                        <li>• High-resolution PNG or SVG formats</li>
                        <li>• Perfect for printing and digital use</li>
                      </ul>
                    </div>
                  </div>
                  {/* Mobile image for step 4 */}
                  <div className="lg:hidden mt-4">
                    <div className={`relative aspect-square rounded-lg overflow-hidden border-2 max-w-xs mx-auto ${theme === 'dark' ? 'border-[#00A5B5]/10' : 'border-[#00A5B5]/20'}`}>
                      <img src="/step_4.png" alt="Generate Seamless Grid - Export perfect patterns" className="w-full h-full object-contain" />
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#00A5B5]/80' : 'bg-[#00A5B5]'} text-white`}>
                        Step 4
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`hidden lg:block lg:sticky lg:top-8 rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-700' : 'bg-white border-[#82E9F0]/20'}`}>
              {/* Live preview only visible on desktop (lg and up) */}
              <div
                className={`relative aspect-square rounded-lg overflow-hidden border-2 ${theme === 'dark' ? 'border-[#00A5B5]/10' : 'border-[#00A5B5]/20'}`}
                id="live-preview"
                style={{
                  background: "none",
                  backgroundColor: theme === 'dark' ? '#333' : '#fff', // adjust background based on theme
                }}
              >
                {/* Step 1: Design Canvas */}
                <div className="absolute inset-0 step-image opacity-100 transition-opacity duration-700" data-step-image="1">
                  <img src="/step_1.png" alt="Design Canvas - Add shapes to your tile" className="w-full h-full object-contain" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#00A5B5]/80' : 'bg-[#00A5B5]'} text-white`}>
                    Step 1
                  </div>
                </div>
                {/* Step 2: Edge Wrapping */}
                <div className="absolute inset-0 step-image opacity-0 transition-opacity duration-700" data-step-image="2">
                  <img src="/step_2.png" alt="Edge Wrapping - Elements wrap to opposite sides" className="w-full h-full object-contain" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#006B74]/80' : 'bg-[#006B74]'} text-white`}>
                    Step 2
                  </div>
                </div>
                {/* Step 3: Pattern Layout */}
                <div className="absolute inset-0 step-image opacity-0 transition-opacity duration-700" data-step-image="3">
                  <img src="/step_3.png" alt="Pattern Layout - Square vs Brick tiling" className="w-full h-full object-contain" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#00A5B5]/80' : 'bg-[#00A5B5]'} text-white`}>
                    Step 3
                  </div>
                </div>
                {/* Step 4: Grid Generation */}
                <div className="absolute inset-0 step-image opacity-0 transition-opacity duration-700" data-step-image="4">
                  <img src="/step_4.png" alt="Grid Generation - Multi-tile seamless pattern" className="w-full h-full object-contain" />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-[#82E9F0]/70 text-[#00343C]' : 'bg-[#82E9F0] text-[#00343C]'}`}>
                    Step 4
                  </div>
                </div>
                <div className={`absolute bottom-2 right-2 text-xs font-medium step-label ${theme === 'dark' ? 'text-[#82E9F0]' : 'text-[#00A5B5]'}`}>
                  Design Canvas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#242424]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-gray-50 relative inline-block' : 'text-[#00343C]'}`} style={{ fontFamily: 'Garbata, sans-serif' }}>
              Powerful Design Tools
              {theme === 'dark' && <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#82E9F0] to-transparent"></span>}
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto px-4 ${theme === 'dark' ? 'text-[#82E9F0]/90' : 'text-[#00A5B5]'}`}>
              Everything you need to create professional, seamless patterns.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m9 21 5-5-5-5"/></svg>}
              title="Basic Shapes & Images"
              description="Add squares, circles, triangles, and upload your own images. All elements work with the tiling system."
              colorIdx={0}
            />
            <FeatureCard
              icon={<Repeat className="w-6 h-6" />}
              title="Smart Edge Connection"
              description="Elements that cross tile boundaries automatically appear on the opposite side for seamless continuity."
              colorIdx={1}
            />
            <FeatureCard
              icon={<Grid className="w-6 h-6" />}
              title="Square & Brick Tiling"
              description="Choose between square grid layout or offset brick pattern for different aesthetic effects."
              colorIdx={2}
            />
            <FeatureCard
              icon={<Palette className="w-6 h-6" />}
              title="Colors & Gradients"
              description="Apply solid colors or create custom gradients with multiple color stops and adjustable angles."
              colorIdx={3}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Layer Management"
              description="Reorder, lock, and manage multiple layers with drag-and-drop functionality."
              colorIdx={0}
            />
            <FeatureCard
              icon={<RotateCw className="w-6 h-6" />}
              title="Transform Controls"
              description="Rotate, resize, and position elements with precision. Maintain aspect ratios with lock controls."
              colorIdx={1}
            />
            <FeatureCard
              icon={<Copy className="w-6 h-6" />}
              title="Duplicate & Arrange"
              description="Duplicate shapes and arrange them to create complex patterns within your tile design."
              colorIdx={2}
            />
            <FeatureCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c-1.85-3.52-6.03-6-9-6s-7.15-2.48-9 6c1.85 3.52 6.03 6 9 6s7.15-2.48 9-6z"/></svg>}
              title="Grid Preview"
              description="Generate and preview how your pattern looks when repeated across multiple tiles."
              colorIdx={3}
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Export Options"
              description="Download your single tile as SVG/PNG or export multi-tile grids for production use."
              colorIdx={0}
            />
          </div>
        </div>
      </section>

      {/* Sample Gallery Section */}
        {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#00343C] mb-4" style={{ fontFamily: 'Garbata, sans-serif' }}>Pattern Examples</h2>
              <p className="text-xl text-[#00A5B5] max-w-2xl mx-auto">
                Get inspired by what you can create with FlowTile's seamless tiling technology.
              </p>
            </div>
            <SampleGallery />
            <div className="mt-10 text-center">
              <p className="text-[#006B74] mb-4">Ready to create your own seamless patterns?</p>
              <GradientButton to="/editor" primary>
                Try It Now <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </div>
          </div>
        </section> */}

      {/* Use Cases Section */}
      <section className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#242424]' : 'bg-[#e6fafd]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-gray-50 relative inline-block' : 'text-[#00343C]'}`} style={{ fontFamily: 'Garbata, sans-serif' }}>
              Perfect For
              {theme === 'dark' && <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00A5B5] to-transparent"></span>}
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto px-4 ${theme === 'dark' ? 'text-[#82E9F0]/90' : 'text-[#00A5B5]'}`}>
              FlowTile creates patterns that work across many industries and applications.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className={`rounded-xl shadow-md p-4 md:p-6 text-center border hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 ${theme === 'dark' ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-[#00A5B5]'}`}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00343C] to-[#00A5B5] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 text-white"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>
              <h3 className={`text-base md:text-lg font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-50' : 'text-[#00343C]'}`}>Wall Tiles</h3>
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Design ceramic, stone, and decorative wall tile patterns</p>
            </div>
            <div className={`rounded-xl shadow-md p-4 md:p-6 text-center border hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 ${theme === 'dark' ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-[#00A5B5]'}`}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00A5B5] to-[#006B74] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <h3 className={`text-base md:text-lg font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-50' : 'text-[#00343C]'}`}>Fabric Design</h3>
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Create patterns for clothing, upholstery, and textiles</p>
            </div>
            <div className={`rounded-xl shadow-md p-4 md:p-6 text-center border hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 ${theme === 'dark' ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-[#00A5B5]'}`}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00A5B5] to-[#82E9F0] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 text-white"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3 className={`text-base md:text-lg font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-50' : 'text-[#00343C]'}`}>Digital Art</h3>
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Create backgrounds and textures for websites and apps</p>
            </div>
            <div className={`rounded-xl shadow-md p-4 md:p-6 text-center border hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 ${theme === 'dark' ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-white border-[#00A5B5]'}`}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#00343C] to-[#006B74] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 text-white"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <h3 className={`text-base md:text-lg font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-50' : 'text-[#00343C]'}`}>Packaging</h3>
              <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#006B74]'}`}>Design wrapping papers and product packaging patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Removed repeated Sample Gallery and Use Cases sections to avoid duplication */}

      {/* CTA Section */}
      <section className={`py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${theme === 'dark' ? 'bg-[#242424]' : 'bg-white'}`}>
        <div className="absolute inset-0 z-0">
          <div className={`absolute right-0 bottom-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-30 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-indigo-100'}`}></div>
          <div className={`absolute left-0 top-0 w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl opacity-30 ${theme === 'dark' ? 'bg-cyan-900/20' : 'bg-purple-100'}`}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className={`rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 text-center border ${theme === 'dark' ? 'bg-[#2a2a2a] border-[#3a3a3a] ring-1 ring-[#3a3a3a]' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`} style={{ fontFamily: 'Garbata, sans-serif' }}>Ready to Create Seamless Patterns?</h2>
            <p className={`text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto px-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
              Start designing patterns that tile perfectly with FlowTile's smart edge-wrapping technology. No technical knowledge required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <GradientButton to="/editor" primary>
                Start Creating Free <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </GradientButton>
              <GradientButton to="/projects">
                Browse Projects
              </GradientButton>
            </div>
            <p className={`text-xs md:text-sm mt-3 md:mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No signup required • Works in your browser</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 md:py-12 px-4 sm:px-6 lg:px-8 text-white ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <div className="flex items-center mb-3 md:mb-4">
              <img src="/flowtile.svg" alt="FlowTile Logo" className="h-6 w-6 md:h-8 md:w-8 mr-2" />
              <h3 className="text-lg md:text-xl font-semibold" style={{ fontFamily: 'Garbata, sans-serif' }}>FlowTile</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base">
              Create seamless, repeating patterns with smart edge-wrapping technology. Perfect for tiles, fabrics, and digital art.
            </p>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-medium mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/editor" className="text-gray-400 hover:text-white transition text-sm md:text-base">Pattern Editor</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-white transition text-sm md:text-base">My Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base md:text-lg font-medium mb-3 md:mb-4">Open Source</h4>
            <a
              href="https://github.com/VinayDangodra28/flowtile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 md:w-5 md:h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 .297a12 12 0 00-3.794 23.406c.6.11.793-.261.793-.577v-2.256c-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.303 3.492.996.107-.775.418-1.304.762-1.603-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.803 5.624-5.475 5.921.43.37.814 1.102.814 2.222v3.293c0 .319.192.694.8.576A12.003 12.003 0 0012 .297z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
            <p className="text-gray-400 text-xs md:text-sm mt-2">
              Free and open source pattern design tool
            </p>
          </div>
        </div>
        <div className={`mt-6 md:mt-8 pt-6 md:pt-8 border-t text-center ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-800 text-gray-500'}`}>
          <p className="text-xs md:text-sm">&copy; {new Date().getFullYear()} FlowTile. Free to use for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

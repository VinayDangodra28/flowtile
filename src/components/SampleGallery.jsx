import React from "react";

// This component will display a gallery of sample patterns
const SampleGallery = () => {
  // Sample patterns with gradients representing what can be made with the actual features
  const samplePatterns = [
    {
      id: 1,
      gradient: "from-blue-400 via-blue-500 to-purple-600",
      name: "Geometric Tiles",
      type: "Square Grid",
      description: "Overlapping circles and squares"
    },
    {
      id: 2,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      name: "Botanical Flow",
      type: "Brick Pattern",
      description: "Organic shapes with gradients"
    },
    {
      id: 3,
      gradient: "from-rose-400 via-pink-500 to-red-600",
      name: "Triangle Mesh",
      type: "Square Grid",
      description: "Interlocking triangular patterns"
    },
    {
      id: 4,
      gradient: "from-amber-400 via-orange-500 to-yellow-600",
      name: "Solar Mandala",
      type: "Square Grid",
      description: "Circular patterns with rotation"
    },
    {
      id: 5,
      gradient: "from-violet-400 via-purple-500 to-indigo-600",
      name: "Layered Dots",
      type: "Brick Pattern",
      description: "Multi-layer circular elements"
    },
    {
      id: 6,
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      name: "Wave Pattern",
      type: "Square Grid",
      description: "Flowing curved shapes"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {samplePatterns.map((pattern) => (
        <div key={pattern.id} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          {/* Pattern Preview with more sophisticated design */}
          <div className={`aspect-square bg-gradient-to-br ${pattern.gradient} relative overflow-hidden`}>
            {/* Add some visual elements to suggest actual patterns */}
            <div className="absolute inset-0 opacity-20">
              {pattern.type === "Square Grid" ? (
                <div className="grid grid-cols-4 h-full">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="border border-white/30"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 h-full">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`border border-white/30 ${i % 2 === 0 ? 'translate-x-2' : '-translate-x-2'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pattern-specific decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              {pattern.name.includes("Geometric") && (
                <div className="grid grid-cols-2 gap-2 opacity-40">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                  <div className="w-8 h-8 bg-white"></div>
                  <div className="w-8 h-8 bg-white"></div>
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              )}
              {pattern.name.includes("Triangle") && (
                <div className="flex space-x-1 opacity-40">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white"></div>
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white"></div>
                </div>
              )}
              {pattern.name.includes("Mandala") && (
                <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center opacity-40">
                  <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                </div>
              )}
              {pattern.name.includes("Dots") && (
                <div className="grid grid-cols-3 gap-2 opacity-40">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 transform translate-y-0 group-hover:translate-y-0 transition-all duration-300">
            <h3 className="font-medium text-gray-900 mb-1">{pattern.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{pattern.type}</p>
            <p className="text-xs text-gray-500">{pattern.description}</p>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <p className="text-sm font-medium">View Pattern</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleGallery;

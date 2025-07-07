
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";


const TileBurst = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current;
      const rect = text.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  // Gap and tile size calculations (available for both effect and render)
  const gap = 2
  const tileSize = dimensions.height / 2;
  const tileSizeWithGap = tileSize + gap;
  const cols = Math.ceil(dimensions.width / tileSizeWithGap);
  const totalTiles = cols * 2;
  const totalGridHeight = 2 * tileSizeWithGap - gap; // 2 rows with gap

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const tiles = containerRef.current.querySelectorAll(".tile");
    const text = textRef.current;

    // Initial state
    gsap.set(tiles, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      transformOrigin: "center center"
    });

    gsap.set(text, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0
    });

    // Create timeline for coordinated animation
    const tl = gsap.timeline();

    // Step 1: Explosive tile burst from center
    tl.to(tiles, {
      opacity: 1,
      scale: gsap.utils.random(1, 1.5),
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(0, 720),
      duration: 0.8,
      ease: "power2.out",
      stagger: {
        amount: 0.3,
        from: "center",
        grid: "auto"
      }
    })
    // Step 2: Tiles converge and form perfect grid behind text (2 rows)
    .to(Array.from(tiles).slice(0, totalTiles), {
      x: (i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const totalGridWidth = cols * tileSizeWithGap - gap; // Subtract final gap
        return (col * tileSizeWithGap) - (totalGridWidth / 2) + (tileSize / 2);
      },
      y: (i) => {
        const row = Math.floor(i / cols);
        return (row * tileSizeWithGap) - (totalGridHeight / 2) + (tileSize / 2);
      },
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.8)",
      stagger: {
        amount: 0.4,
        from: "random"
      }
    }, "-=0.3")

    // Continuous floating animation for tiles (oscillate within grid cell)
    .to(Array.from(tiles).slice(0, totalTiles), {
      y: (i) => {
        const row = Math.floor(i / cols);
        const baseY = (row * tileSizeWithGap) - (totalGridHeight / 2) + (tileSize / 2);
        // Oscillate up and down by 2px from baseY (never leaves cell)
        return baseY + 2;
      },
      rotation: (i) => (i % 2 === 0 ? 2 : -2),
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: function() {
        // Clamp y to within the cell (optional, for extra safety)
        Array.from(tiles).slice(0, totalTiles).forEach((tile, i) => {
          const row = Math.floor(i / cols);
          const baseY = (row * tileSizeWithGap) - (totalGridHeight / 2) + (tileSize / 2);
          const y = gsap.getProperty(tile, 'y');
          const minY = baseY - 2;
          const maxY = baseY + 2;
          if (y < minY) gsap.set(tile, { y: minY });
          if (y > maxY) gsap.set(tile, { y: maxY });
        });
      }
    });

    // Add hover effect
    const handleMouseEnter = () => {
      gsap.to(Array.from(tiles).slice(0, totalTiles), {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: {
          amount: 0.2
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(Array.from(tiles).slice(0, totalTiles), {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
    };

    const container = containerRef.current.parentElement;
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      tl.kill();
    };
  }, [dimensions]);
  // Theme-based colors
  const darkText = '#242424';
  const lightText = '#F4F6FD';
  const darkStroke = '#242424';
  const lightStroke = '#ffffff';
  const darkTileBg = 'linear-gradient(135deg, #00a5b5 0%, #004d57 100%)';
  const lightTileBg = 'linear-gradient(135deg, #00a5b5 0%, #004d57 100%)';
  const darkTileBorder = '1px solid #1e293b';
  const lightTileBorder = '1px solid rgba(0, 165, 181, 0.5)';
  const darkTileShadow = '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)';
  const lightTileShadow = '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)';

  return (
    <span className="relative inline-block cursor-pointer">
      <span
        ref={textRef}
        className={`relative z-20 font-bold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap ${theme === 'dark' ? '' : ''}`}
        style={{
          color: theme === 'dark' ? darkText : lightText,
          WebkitTextStroke: `0.25px ${theme === 'dark' ? darkStroke : lightStroke}`,
          textStroke: `0.25px ${theme === 'dark' ? darkStroke : lightStroke}`,
          // textShadow: theme === 'dark'
          //   ? '0 2px 8px #00343C, 0 1px 0 #242424'
          //   : '0 2px 8px #82E9F0, 0 1px 0 #ffffff',
          transition: 'color 0.3s, text-shadow 0.3s',
        }}
      >
        Tile Perfectly
      </span>
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          left: '0',
          top: '0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: totalTiles }).map((_, i) => (
          <div
            key={i}
            className="tile absolute rounded-sm"
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              background: theme === 'dark' ? darkTileBg : lightTileBg,
              border: theme === 'dark' ? darkTileBorder : lightTileBorder,
              boxShadow: theme === 'dark' ? darkTileShadow : lightTileShadow,
              transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
            }}
          />
        ))}
      </div>
    </span>
  );
};

export default TileBurst;
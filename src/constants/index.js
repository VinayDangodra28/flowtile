// Application constants
export const PROJECT_PREFIX = 'flowtile_project_';
export const IMAGE_DB_NAME = 'flowtile_images_db';
export const IMAGE_STORE_NAME = 'flowtile_images';

// Canvas defaults
export const DEFAULT_CANVAS_SIZE = { width: 500, height: 500 };
export const DEFAULT_MAX_CANVAS_WIDTH = 800;
export const DEFAULT_MAX_CANVAS_HEIGHT = 600;

// Grid defaults
export const DEFAULT_GRID_COLS = 5;
export const DEFAULT_GRID_ROWS = 5;
export const DEFAULT_BRICK_OFFSET = 50;

// Border defaults
export const DEFAULT_BORDER_WIDTH = 2;
export const DEFAULT_BORDER_COLOR = '#000000';

// Breakpoints
export const MOBILE_BREAKPOINT = 768;

// Editor sections
export const EDITOR_SECTIONS = {
  ELEMENTS: 'elements',
  IMAGES: 'images', 
  CANVAS: 'canvas',
  ARRANGE: 'arrange',
  GRID: 'grid'
};

// Tile types
export const TILE_TYPES = {
  SQUARE: 'square',
  BRICK: 'brick',
  HEXAGON: 'hexagon'
};

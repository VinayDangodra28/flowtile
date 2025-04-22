export const generateRandomColor = () => {
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
  };
  
  export const generateRandomPosition = (canvasWidth, canvasHeight) => {
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
    };
  };
  
  export const isPointInsideCircle = (x, y, circleX, circleY, radius) => {
    return Math.hypot(x - circleX, y - circleY) <= radius;
  };
  
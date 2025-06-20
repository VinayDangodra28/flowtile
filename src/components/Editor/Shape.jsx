export default class Shape {
  constructor(x, y, width, height, color, type = "square", imageSrc = null, opacity = 1, shadow = null, gradient = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.rotation = 0;

    this.image = null;

    if (type === "image" && imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }

    this.opacity = typeof opacity === 'number' ? opacity : 1;
    this.shadow = shadow || {
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: "black",
      opacity: 1,
    };
    this.gradient = gradient || null;
  }

  draw(ctx, canvasWidth, canvasHeight, isSelected) {
    ctx.save(); // Save the initial state

    // Set shadow properties
    if (this.shadow) {
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowColor = this.shadow.color;
    }

    // Draw the shape with opacity
    ctx.save(); // Save the state before setting opacity
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.x, -this.y);

    if (this.gradient) {
      const gradient = ctx.createLinearGradient(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2
      );
      this.gradient.forEach(({ offset, color }) => {
        gradient.addColorStop(offset, color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = this.color;
    }

    if (this.type === "square") {
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else if (this.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.height / 2);
      ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "rectangle") {
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else if (this.type === "circle") {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "image" && this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    ctx.restore(); // Restore the state after drawing

    // Draw the non-rotating outline and resize handle if selected
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      const handleSize = 10;
      const handleX = this.x + this.width / 2 - handleSize / 2;
      const handleY = this.y + this.height / 2 - handleSize / 2;
      ctx.fillStyle = "gray";
      ctx.fillRect(handleX, handleY, handleSize, handleSize);
      ctx.restore();
    }

    ctx.restore(); // Restore the initial state

    this.wrapAround(ctx, canvasWidth, canvasHeight);
  }

  // ... rest of the Shape class methods (isClicked, isPointInTriangle, etc.) ...
// }


  isClicked(mx, my) {
    if (this.type === "square" || this.type === "rectangle" || this.type === "image") {
      return mx >= this.x - this.width / 2 && mx <= this.x + this.width / 2 && my >= this.y - this.height / 2 && my <= this.y + this.height / 2;
    } else if (this.type === "triangle") {
      let a = { x: this.x, y: this.y - this.height / 2 };
      let b = { x: this.x - this.width / 2, y: this.y + this.height / 2 };
      let c = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
      return this.isPointInTriangle({ x: mx, y: my }, a, b, c);
    } else if (this.type === "circle") {
      const dx = mx - this.x;
      const dy = my - this.y;
      return (dx * dx) / (this.width * this.width / 4) + (dy * dy) / (this.height * this.height / 4) <= 1;
    }
    return false;
  }

  isPointInTriangle(p, a, b, c) {
    function sign(p1, p2, p3) {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    let d1 = sign(p, a, b);
    let d2 = sign(p, b, c);
    let d3 = sign(p, c, a);

    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(hasNeg && hasPos);
  }

  isResizeHandleClicked(mx, my) {
    const handleSize = 10;
    const handleX = this.x + this.width / 2 - handleSize / 2;
    const handleY = this.y + this.height / 2 - handleSize / 2;
    return mx >= handleX && mx <= handleX + handleSize && my >= handleY && my <= handleY + handleSize;
  }
getOffsets(tileType, canvasWidth, canvasHeight) {
  switch(tileType) {
    case "square":
      return [
        { dx: 0, dy: 0 },
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
      // In a brick pattern, every alternate row is horizontally offset by half a tile
      return [
        { dx: 0, dy: 0 },
        { dx: -canvasWidth, dy: 0 },
        { dx: canvasWidth, dy: 0 },
        { dx: -canvasWidth / 2, dy: -canvasHeight },
        { dx: canvasWidth / 2, dy: -canvasHeight },
        { dx: -canvasWidth / 2, dy: canvasHeight },
        { dx: canvasWidth / 2, dy: canvasHeight },
      ];

    case "hex":
      // Assuming pointy-top hexagons (you can adapt for flat-top)
      const w = canvasWidth;
      const h = canvasHeight * 0.75; // vertical distance between rows
      return [
        { dx: 0, dy: 0 },
        { dx: w, dy: 0 },
        { dx: -w, dy: 0 },
        { dx: w / 2, dy: h },
        { dx: -w / 2, dy: h },
        { dx: w / 2, dy: -h },
        { dx: -w / 2, dy: -h },
      ];

    default:
      return [{ dx: 0, dy: 0 }];
  }
}

  wrapAround(ctx, canvasWidth, canvasHeight, tileType = "brick") {
   const offsets = this.getOffsets(tileType, canvasWidth, canvasHeight);
    offsets.forEach(({ dx, dy }) => {
      ctx.save();
      ctx.translate(this.x + dx, this.y + dy);
      ctx.rotate(this.rotation);
      ctx.translate(-(this.x + dx), -(this.y + dy));

      // Gradient fix: create gradient for each repeated shape
      let fillStyle = this.color;
      if (this.gradient) {
        const gradient = ctx.createLinearGradient(
          this.x + dx - this.width / 2,
          this.y + dy - this.height / 2,
          this.x + dx + this.width / 2,
          this.y + dy + this.height / 2
        );
        this.gradient.forEach(({ offset, color }) => {
          gradient.addColorStop(offset, color);
        });
        fillStyle = gradient;
      }
      ctx.fillStyle = fillStyle;

      if (this.type === "square" || this.type === "rectangle") {
        ctx.fillRect(this.x + dx - this.width / 2, this.y + dy - this.height / 2, this.width, this.height);
      } else if (this.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(this.x + dx, this.y + dy - this.height / 2);
        ctx.lineTo(this.x + dx - this.width / 2, this.y + dy + this.height / 2);
        ctx.lineTo(this.x + dx + this.width / 2, this.y + dy + this.height / 2);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === "circle") {
        ctx.beginPath();
        ctx.ellipse(this.x + dx, this.y + dy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "image" && this.image && this.image.complete) {
        ctx.drawImage(this.image, this.x + dx - this.width / 2, this.y + dy - this.height / 2, this.width, this.height);
      }

      ctx.restore();
    });
  }

  updatePosition(canvasWidth, canvasHeight) {
    if (this.x < 0) {
      this.x += canvasWidth;
    } else if (this.x > canvasWidth) {
      this.x -= canvasWidth;
    }

    if (this.y < 0) {
      this.y += canvasHeight;
    } else if (this.y > canvasHeight) {
      this.y -= canvasHeight;
    }
  }
}

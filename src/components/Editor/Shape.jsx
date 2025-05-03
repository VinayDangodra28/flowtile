export default class Shape {
  constructor(x, y, width, height, color, type = "square", imageSrc = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.rotation = 0; // New rotation property

    this.image = null;

    if (type === "image" && imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }
  }

  draw(ctx, canvasWidth, canvasHeight, isSelected) {
    ctx.save(); // Save the current state
    ctx.translate(this.x, this.y); // Move to the shape's center
    ctx.rotate(this.rotation); // Apply rotation
    ctx.translate(-this.x, -this.y); // Move back

    // Draw the shape
    ctx.fillStyle = this.color;
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

    ctx.restore(); // Restore the previous state

    // Draw the non-rotating outline and resize handle if selected
    if (isSelected) {
      ctx.save();

      // Draw the outline
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

      // Draw the resize handle
      const handleSize = 10;
      const handleX = this.x + this.width / 2 - handleSize / 2;
      const handleY = this.y + this.height / 2 - handleSize / 2;
      ctx.fillStyle = "gray";
      ctx.fillRect(handleX, handleY, handleSize, handleSize);

      ctx.restore();
    }

    this.wrapAround(ctx, canvasWidth, canvasHeight);
  }

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

  wrapAround(ctx, canvasWidth, canvasHeight) {
    const offsets = [
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

    offsets.forEach(({ dx, dy }) => {
      ctx.save();
      ctx.translate(this.x + dx, this.y + dy);
      ctx.rotate(this.rotation);
      ctx.translate(-(this.x + dx), -(this.y + dy));

      if (this.type === "square" || this.type === "rectangle") {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + dx - this.width / 2, this.y + dy - this.height / 2, this.width, this.height);
      } else if (this.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(this.x + dx, this.y + dy - this.height / 2);
        ctx.lineTo(this.x + dx - this.width / 2, this.y + dy + this.height / 2);
        ctx.lineTo(this.x + dx + this.width / 2, this.y + dy + this.height / 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      } else if (this.type === "circle") {
        ctx.beginPath();
        ctx.ellipse(this.x + dx, this.y + dy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
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

export default class Shape {
  constructor(x, y, width, height, color, type = "circle", imageSrc = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;

    this.image = null;

    if (type === "image" && imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
    }
  }

  draw(ctx, canvasWidth, canvasHeight, isSelected) {
    ctx.fillStyle = this.color;

    if (this.type === "circle") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "square") {
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
    } else if (this.type === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "pentagon") {
      const angle = (2 * Math.PI) / 5;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2 * Math.cos(0), this.y + this.height / 2 * Math.sin(0));
      for (let i = 1; i < 5; i++) {
        ctx.lineTo(
          this.x + this.width / 2 * Math.cos(i * angle),
          this.y + this.height / 2 * Math.sin(i * angle)
        );
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "hexagon") {
      const angle = (2 * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2 * Math.cos(0), this.y + this.height / 2 * Math.sin(0));
      for (let i = 1; i < 6; i++) {
        ctx.lineTo(
          this.x + this.width / 2 * Math.cos(i * angle),
          this.y + this.height / 2 * Math.sin(i * angle)
        );
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "star") {
      const outerRadius = this.width / 2;
      const innerRadius = this.height / 2;
      ctx.beginPath();
      ctx.moveTo(this.x + outerRadius * Math.cos(0), this.y + outerRadius * Math.sin(0));
      for (let i = 1; i < 5; i++) {
        ctx.lineTo(
          this.x + innerRadius * Math.cos((i + 0.5) * 2 * Math.PI / 5),
          this.y + innerRadius * Math.sin((i + 0.5) * 2 * Math.PI / 5)
        );
        ctx.lineTo(
          this.x + outerRadius * Math.cos(i * 2 * Math.PI / 5),
          this.y + outerRadius * Math.sin(i * 2 * Math.PI / 5)
        );
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "image" && this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    if (isSelected) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      if (this.type === "circle" || this.type === "ellipse") {
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      } else if (this.type === "square" || this.type === "rectangle" || this.type === "image") {
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      } else if (this.type === "triangle" || this.type === "pentagon" || this.type === "hexagon" || this.type === "star") {
        ctx.stroke();
      }

      const handleSize = 10;
      ctx.fillStyle = "gray";
      ctx.fillRect(this.x + this.width / 2 - handleSize / 2, this.y + this.height / 2 - handleSize / 2, handleSize, handleSize);
    }

    this.wrapAround(ctx, canvasWidth, canvasHeight);
  }

  isClicked(mx, my) {
    if (this.type === "circle") {
      return Math.hypot(mx - this.x, my - this.y) <= this.width / 2;
    } else if (this.type === "square" || this.type === "rectangle" || this.type === "image") {
      return mx >= this.x - this.width / 2 && mx <= this.x + this.width / 2 && my >= this.y - this.height / 2 && my <= this.y + this.height / 2;
    } else if (this.type === "triangle") {
      let a = { x: this.x, y: this.y - this.height / 2 };
      let b = { x: this.x - this.width / 2, y: this.y + this.height / 2 };
      let c = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
      return this.isPointInTriangle({ x: mx, y: my }, a, b, c);
    } else if (this.type === "ellipse") {
      const dx = mx - this.x;
      const dy = my - this.y;
      return (dx * dx) / (this.width * this.width / 4) + (dy * dy) / (this.height * this.height / 4) <= 1;
    } else if (this.type === "pentagon" || this.type === "hexagon" || this.type === "star") {
      const ctx = document.createElement('canvas').getContext('2d');
      this.draw(ctx, 0, 0, false);
      return ctx.isPointInPath(this.path, mx, my);
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
      if (this.type === "circle") {
        ctx.beginPath();
        ctx.arc(this.x + dx, this.y + dy, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "square" || this.type === "rectangle" || this.type === "image") {
        if (this.type === "image" && this.image && this.image.complete) {
          ctx.drawImage(this.image, this.x + dx - this.width / 2, this.y + dy - this.height / 2, this.width, this.height);
        } else {
          ctx.fillRect(this.x + dx - this.width / 2, this.y + dy - this.height / 2, this.width, this.height);
        }
      } else if (this.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(this.x + dx, this.y + dy - this.height / 2);
        ctx.lineTo(this.x + dx - this.width / 2, this.y + dy + this.height / 2);
        ctx.lineTo(this.x + dx + this.width / 2, this.y + dy + this.height / 2);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(this.x + dx, this.y + dy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "pentagon") {
        const angle = (2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.moveTo(this.x + dx + this.width / 2 * Math.cos(0), this.y + dy + this.height / 2 * Math.sin(0));
        for (let i = 1; i < 5; i++) {
          ctx.lineTo(
            this.x + dx + this.width / 2 * Math.cos(i * angle),
            this.y + dy + this.height / 2 * Math.sin(i * angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else if (this.type === "hexagon") {
        const angle = (2 * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(this.x + dx + this.width / 2 * Math.cos(0), this.y + dy + this.height / 2 * Math.sin(0));
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(
            this.x + dx + this.width / 2 * Math.cos(i * angle),
            this.y + dy + this.height / 2 * Math.sin(i * angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else if (this.type === "star") {
        const outerRadius = this.width / 2;
        const innerRadius = this.height / 2;
        ctx.beginPath();
        ctx.moveTo(this.x + dx + outerRadius * Math.cos(0), this.y + dy + outerRadius * Math.sin(0));
        for (let i = 1; i < 5; i++) {
          ctx.lineTo(
            this.x + dx + innerRadius * Math.cos((i + 0.5) * 2 * Math.PI / 5),
            this.y + dy + innerRadius * Math.sin((i + 0.5) * 2 * Math.PI / 5)
          );
          ctx.lineTo(
            this.x + dx + outerRadius * Math.cos(i * 2 * Math.PI / 5),
            this.y + dy + outerRadius * Math.sin(i * 2 * Math.PI / 5)
          );
        }
        ctx.closePath();
        ctx.fill();
      }
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

class Ball {
    constructor(x, y, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
    }
  
    draw() {
      //this.x += this.speedX;
      //this.y += this.speedY;
      //this.x = (this.x + width) % width;
      //this.y = (this.y + height) % height;
      //if (this.x < 0 || this.x > width)
      //  this.speedX = -this.speedX;
      //if (this.y < 0 || this.y > width)
      //  this.speedY = -this.speedY;

      this.speedY += 0.1;
      this.y += this.speedY;
      if (this.y < 0 || this.y > width)
          this.speedY = -this.speedY;
      circle(this.x, this.y, 15);
    }
  }
  
  var balls = [];
  
  function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(0);
    balls.forEach(ball => {
      ball.draw();
    });
  }
  
  function mouseClicked() {
    balls.push(new Ball(mouseX, mouseY, 0, 0));
  }
  
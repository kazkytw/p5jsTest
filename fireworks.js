let fireworks = [];
let launchSound, explosionSound, bgm;
let backgroundImg;

let wind; // 定義全域風場
let lastWindChange = 0; // 記錄上一次風場改變的時間
let windChangeInterval = 5000; // 風場改變的間隔時間（毫秒）

function preload() {
    launchSound = loadSound('launch.wav');
    explosionSound = loadSound('expl.wav');
    bgm = loadSound('uchiagehanabi.mp3');
    backgroundImg = loadImage('bg.jpg');
  }

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  changeWind(); // 初始化風場方向

  bgm.loop();
}

function draw() {
    background(backgroundImg);

  // 每隔指定時間改變風場
  if (millis() - lastWindChange > windChangeInterval) {
    changeWind();
    lastWindChange = millis(); // 更新最後改變風場的時間
  }

   for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1); // 移除已完成的煙火
    }
  }
}

function mousePressed() {
  // 在滑鼠點擊位置產生煙火
  let firework = new Firework(mouseX, height);
  fireworks.push(firework);
  launchSound.play();
}

// 改變風場方向
function changeWind() {
    let windDirection = random(TWO_PI); // 隨機生成風的角度
    let windStrength = random(0.01, 0.1); // 隨機生成風的強度
    wind = p5.Vector.fromAngle(windDirection).mult(windStrength); // 根據角度和強度生成風向量
}

class Particle {
    constructor(x, y, firework, color) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.color = color; // 使用傳入的顏色
      this.lifespan = 255; // 使用 RGB 模式下的最大透明度
      this.vel = firework ? createVector(0, random(-8, -6)) : p5.Vector.random2D().mult(random(3, 13));
      this.acc = createVector(0, 0);
    }
  
    applyForce(force) {
        this.acc.add(force);
    }
  
    show() {
      colorMode(RGB); // 設置 RGB 模式
      if (this.firework) {
        stroke(255, 255, 255); // 煙火上升時的亮白色
        strokeWeight(4);
      } else {
        stroke(red(this.color), green(this.color), blue(this.color), this.lifespan); // 使用粒子的顏色和透明度
        strokeWeight(2);
      }
      point(this.pos.x, this.pos.y);
    }
  
    update() {
      if (!this.firework) {
        this.vel.mult(0.9); // 火花粒子逐漸減速
        this.lifespan -= 2; // 更慢的漸暗效果
      }
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  
    done() {
      return this.lifespan < 0; // 當透明度低於 0 時，粒子將消失
    }
  }

class Firework {
  constructor(x, y) {
    this.firework = new Particle(x, y, true); // 煙火上升的粒子
    this.exploded = false;
    this.particles = [];
    this.color = color(random(150, 255), random(150, 255), random(150, 255)); // 隨機顏色
  }

  show() {
    if (!this.exploded)
      this.firework.show();
    for (let p of this.particles)
      p.show();
  }

  explode() { // 煙火爆炸後產生火花粒子
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false, this.color);
      this.particles.push(p);
    }
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, -0.2)); // 向上移動的力
      this.firework.update();

      if (this.firework.pos.y <= 100) { // 煙火到點時爆炸
        this.exploded = true;
        this.explode();
        explosionSound.play();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.1)); // 重力向下
      this.particles[i].applyForce(wind); // 只對火花粒子作用風場
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1); // 移除已消失的火花粒子
      }
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }
}


  
  

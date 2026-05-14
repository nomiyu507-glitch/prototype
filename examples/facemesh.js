// Track A starter 03 from the PDF.
// PDF 第四部分 Track A 示例 03。
// ml5.faceMesh() -> mouth opening and smile amount to particles.
// 用 faceMesh 抓取表情变化，并把表情变化转换成粒子系统。

let faceMesh;
let video;
let faces = [];
let particles = [];
let smoothedMouthOpen = 0;
let smoothedSmile = 0;
// These smoothed values reduce jitter.
// 这两个平滑值用来减少识别抖动。

function preload() {
  faceMesh = ml5.faceMesh({
    maxFaces: 1,
    refineLandmarks: true,
    flipped: true
  });
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  faceMesh.detectStart(video, (results) => {
    faces = results;
  });
}

function draw() {
  background(0, 25);

  if (faces.length > 0) {
    const face = faces[0];

    // Mouth opening: distance between upper lip center and lower lip center.
    // 嘴巴开合：上嘴唇中心到下嘴唇中心的距离。
    const mouthOpen = dist(
      face.keypoints[13].x,
      face.keypoints[13].y,
      face.keypoints[14].x,
      face.keypoints[14].y
    );
    // Smile amount: distance between the two mouth corners.
    // 微笑程度：左右嘴角之间的距离。
    const smile = dist(
      face.keypoints[61].x,
      face.keypoints[61].y,
      face.keypoints[291].x,
      face.keypoints[291].y
    );

    // lerp() smooths the values frame by frame.
    // 用 lerp() 在每一帧做平滑过渡，减少跳动。
    smoothedMouthOpen = lerp(smoothedMouthOpen, mouthOpen, 0.2);
    smoothedSmile = lerp(smoothedSmile, smile, 0.2);

    // Mapping section:
    // 映射区：
    // mouthOpen -> number of particles
    // 嘴巴张开程度 -> 粒子数量
    // smile -> particle hue
    // 微笑程度 -> 粒子颜色
    const emitCount = floor(map(smoothedMouthOpen, 0, 60, 0, 20, true));
    const particleHue = map(smoothedSmile, 50, 150, 200, 30, true);

    // Use the nose tip as the particle emitter.
    // 用鼻尖作为粒子的发射位置。
    const cx = face.keypoints[1].x;
    const cy = face.keypoints[1].y;
    for (let i = 0; i < emitCount; i += 1) {
      particles.push(new FaceParticle(cx, cy, particleHue));
    }

    // Debug view: draw all face landmarks as tiny dots.
    // 调试用：把所有脸部关键点都画成小点。
    noStroke();
    fill(255, 80);
    for (const kp of face.keypoints) {
      circle(kp.x, kp.y, 1);
    }
  }

  // Update and draw particles every frame.
  // 每一帧更新并绘制粒子。
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class FaceParticle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.life = 255;
    // Students can remap expression to other color logic here.
    // 学生可以在这里把表情数据映射成别的颜色逻辑。
    this.hue = hue;
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 3;
  }

  show() {
    colorMode(HSB, 360, 100, 100, 255);
    noStroke();
    fill(this.hue, 70, 100, this.life);
    circle(this.pos.x, this.pos.y, 5);
    colorMode(RGB, 255);
  }

  isDead() {
    return this.life <= 0;
  }
}

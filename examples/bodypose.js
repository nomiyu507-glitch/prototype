// Track A starter 01 from the PDF.
// PDF 第四部分 Track A 示例 01。
// ml5.bodyPose() + keypoints + skeleton + particle visualization.
// 使用 ml5.bodyPose() 做身体姿态识别，并把关键点、骨架和粒子效果画出来。

let bodyPose;
let video;
let poses = [];
let connections = [];
let particles = [];

const TARGET_KEYPOINTS = ["left_wrist", "right_wrist", "nose"];
// Students can change this list first.
// 学生最适合先改这里：决定哪些身体部位会触发视觉效果。

function preload() {
  // Load the pose model before setup starts.
  // 在 setup 之前预加载姿态识别模型。
  bodyPose = ml5.bodyPose("MoveNet", { flipped: true });
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  // flipped: true makes the webcam act like a mirror.
  // flipped: true 会让摄像头像镜子一样左右翻转，更符合交互直觉。
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // Start continuous pose detection.
  // 开始持续检测人体姿态。
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection pairs once.
  // 先取出骨架连接关系，后面画线时直接复用。
  connections = bodyPose.getSkeleton();
}

function draw() {
  // Option 1: draw the webcam as the background.
  // 方案 1：把摄像头画面作为背景。
  image(video, 0, 0, width, height);
  // Students can try:
  // 学生也可以改成下面这些方式：
  // background(0);
  // background(0, 30);

  for (let i = 0; i < poses.length; i += 1) {
    const pose = poses[i];

    // Draw skeleton lines between connected keypoints.
    // 根据骨架连接关系，把关键点之间的线画出来。
    stroke(255, 200);
    strokeWeight(2);
    for (let j = 0; j < connections.length; j += 1) {
      const [a, b] = connections[j];
      const kpA = pose.keypoints[a];
      const kpB = pose.keypoints[b];
      if (kpA.confidence > 0.3 && kpB.confidence > 0.3) {
        line(kpA.x, kpA.y, kpB.x, kpB.y);
      }
    }

    // Draw each detected keypoint as a small circle.
    // 把每个关键点画成一个小圆点。
    noStroke();
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      const kp = pose.keypoints[j];
      if (kp.confidence > 0.3) {
        fill(0, 255, 200);
        circle(kp.x, kp.y, 8);
      }
    }

    // Emit particles from selected body parts only.
    // 只从选中的身体部位发射粒子。
    for (const name of TARGET_KEYPOINTS) {
      const kp = pose.keypoints.find((point) => point.name === name);
      if (kp && kp.confidence > 0.3) {
        // Students can redesign the visual language here.
        // 学生可以重点改这里：把粒子换成文字、线条、图标都可以。
        for (let k = 0; k < 2; k += 1) {
          particles.push(new Particle(kp.x, kp.y));
        }
      }
    }
  }

  // Update and remove particles every frame.
  // 每一帧更新粒子，并删除生命周期结束的粒子。
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function gotPoses(results) {
  // Save the latest pose results from ml5.
  // 保存 ml5 返回的最新姿态结果。
  poses = results;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 3));
    this.life = 255;
    this.size = random(4, 10);
    // Students can tune color mood here.
    // 学生可以在这里调整粒子的整体色调。
    this.hue = random(160, 220);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 4;
  }

  show() {
    noStroke();
    colorMode(HSB, 360, 100, 100, 255);
    fill(this.hue, 70, 100, this.life);
    circle(this.pos.x, this.pos.y, this.size);
    colorMode(RGB, 255);
  }

  isDead() {
    return this.life <= 0;
  }
}

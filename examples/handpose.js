// Track A starter 02 from the PDF.
// PDF 第四部分 Track A 示例 02。
// ml5.handPose() -> finger angle and pinch distance mapping.
// 用 handPose 抓取手势数据，并把角度、距离映射到图形变化上。

let handPose;
let video;
let hands = [];

function preload() {
  // maxHands: 2 means the model will try to detect up to two hands.
  // maxHands: 2 表示最多同时识别两只手。
  handPose = ml5.handPose({ maxHands: 2, flipped: true });
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, (results) => {
    hands = results;
  });
}

function draw() {
  background(0, 40);
  // Draw the webcam first, then cover it with a translucent layer.
  // 先画摄像头，再覆盖一层半透明黑色，形成拖影感。
  image(video, 0, 0, width, height);
  fill(0, 120);
  rect(0, 0, width, height);

  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
    if (hand.confidence < 0.7) {
      continue;
    }

    // Angle of the index finger joint: 5-6-7.
    // 检测食指关节 5-6-7 形成的夹角。
    const angleIndex = fingerAngle(hand, 5, 6, 7);
    // Distance between thumb tip and index finger tip.
    // 检测拇指尖和食指尖的距离，也就是 pinch 程度。
    const pinchDist = dist(
      hand.keypoints[4].x,
      hand.keypoints[4].y,
      hand.keypoints[8].x,
      hand.keypoints[8].y
    );

    // Mapping section: input data -> visual variables.
    // 映射区：把识别到的输入数据转换成视觉变量。
    // Students should edit these two lines first.
    // 学生最适合优先修改下面这两行。
    const size = map(angleIndex, 0, PI, 200, 20);
    const hue = map(pinchDist, 0, 250, 0, 360);

    // Wrist point as the local center of the drawing.
    // 以手腕位置作为图形中心。
    const cx = hand.keypoints[0].x;
    const cy = hand.keypoints[0].y;

    push();
    translate(cx, cy);
    rotate(angleIndex);
    colorMode(HSB, 360, 100, 100, 1);
    noFill();
    stroke(hue, 80, 100, 0.9);
    strokeWeight(2);
    circle(0, 0, size);

    // Connect fingertip points into a polygon.
    // 把五个手指尖连成一个多边形。
    beginShape();
    for (const tip of [4, 8, 12, 16, 20]) {
      const kp = hand.keypoints[tip];
      vertex(kp.x - cx, kp.y - cy);
    }
    endShape(CLOSE);
    colorMode(RGB, 255);
    pop();
  }
}

function fingerAngle(hand, a, b, c) {
  // Compute the angle at point b formed by a-b-c.
  // 计算 a-b-c 三点中，以 b 为顶点的夹角。
  const v1 = createVector(
    hand.keypoints[a].x - hand.keypoints[b].x,
    hand.keypoints[a].y - hand.keypoints[b].y
  );
  const v2 = createVector(
    hand.keypoints[c].x - hand.keypoints[b].x,
    hand.keypoints[c].y - hand.keypoints[b].y
  );
  return p5.Vector.angleBetween(v1, v2);
}

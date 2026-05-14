// Track B starter 02 from the PDF.
// PDF 第四部分 Track B 示例 02。
// ml5.imageClassifier() -> subtitle style text overlay.
// 用图像分类结果生成字幕式文本叠加效果。

let classifier;
let video;
let currentLabel = "";
let currentConfidence = 0;

function preload() {
  // MobileNet is the default pretrained classifier.
  // MobileNet 是默认使用的预训练分类模型。
  classifier = ml5.imageClassifier("MobileNet");

  // To use a Teachable Machine model instead, replace the line above with:
  // 如果要换成自己的 Teachable Machine 模型，就把上面一行替换成下面这段：
  // classifier = ml5.imageClassifier(
  //   "https://teachablemachine.withgoogle.com/models/<YOUR-ID>/model.json"
  // );
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  classifyLoop();
}

function classifyLoop() {
  // Classify every 500ms instead of every frame to keep it lighter.
  // 每 500ms 分类一次，而不是每帧都分类，这样更轻量。
  classifier.classify(video, (results) => {
    if (results && results[0]) {
      currentLabel = results[0].label;
      currentConfidence = results[0].confidence;
    }
    setTimeout(classifyLoop, 500);
  });
}

function draw() {
  image(video, 0, 0, width, height);

  // Subtitle panel.
  // 字幕面板。
  fill(0, 160);
  rect(0, height - 120, width, 120);

  noStroke();
  fill(255);
  textFont("monospace");
  textSize(24);
  // Students can rewrite this visual tone completely.
  // 学生可以重点改这里，把冷冰冰的英文标签改成诗性文字、批评性字幕或中文文本。
  text(currentLabel || "waiting for classification...", 20, height - 72);

  textSize(14);
  fill(180, 220, 255);
  // Confidence helps students understand how sure the model is.
  // confidence 可以帮助学生理解模型当前有多确定。
  text(`confidence: ${nf(currentConfidence, 1, 3)}`, 20, height - 42);

  fill(255, 190);
  text(
    "Try switching to a poetic Korean subtitle or your Teachable Machine model.",
    20,
    height - 18
  );
}

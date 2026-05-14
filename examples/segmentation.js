// Track B starter 01 from the PDF.
// PDF 第四部分 Track B 示例 01。
// ml5.bodySegmentation() + background compositing + export notes.
// 用身体分割把人物从画面中抠出来，再叠加到新的背景上。

let segmenter;
let video;
let segmentation;
let bgImage;

const USE_FILE = false;
// false = webcam input
// false = 使用摄像头输入
// true = pre-recorded video input
// true = 使用本地视频文件输入

function preload() {
  // Background image for the composited scene.
  // 作为合成背景使用的图片。
  bgImage = loadImage(
    "assets/background.jpg",
    () => {},
    () => {
      bgImage = null;
    }
  );

  // SelfieSegmentation is light and usually easier to run in class.
  // SelfieSegmentation 更轻量，课堂上更容易跑起来。
  segmenter = ml5.bodySegmentation("SelfieSegmentation", {
    maskType: "background"
  });
  // Students can also try other mask types.
  // 学生也可以尝试别的 maskType，例如 "body"。
}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  if (USE_FILE) {
    // Use a local video file instead of webcam.
    // 使用本地视频文件而不是摄像头。
    video = createVideo(["mySource.mp4"], () => {
      video.loop();
      video.volume(0);
      video.size(640, 480);
      video.hide();
      segmenter.detectStart(video, gotResults);
    });
  } else {
    // Use live webcam input.
    // 使用实时摄像头输入。
    video = createCapture(VIDEO, { flipped: true });
    video.size(640, 480);
    video.hide();
    segmenter.detectStart(video, gotResults);
  }
}

function gotResults(results) {
  // Save the latest segmentation result.
  // 保存最新的人体分割结果。
  segmentation = results;
}

function draw() {
  // Step 1: draw the new background first.
  // 第一步：先画新的背景层。
  drawBackgroundLayer();

  if (segmentation && segmentation.mask) {
    // Step 2: keep only the person area with the mask.
    // 第二步：利用 mask 只保留人物区域。
    const g = createGraphics(width, height);
    g.image(video, 0, 0, width, height);
    g.drawingContext.globalCompositeOperation = "destination-in";
    g.image(segmentation.mask, 0, 0, width, height);
    image(g, 0, 0);
  }

  // Step 3: add text or other overlays.
  // 第三步：叠加字幕、文本或其他视觉元素。
  noStroke();
  fill(255);
  textSize(14);
  textFont("monospace");
  text("THIS IS A TEST. THE MACHINE IS WATCHING.", 20, height - 20);
}

function drawBackgroundLayer() {
  if (bgImage) {
    // If the image loads successfully, use it directly.
    // 如果背景图加载成功，就直接使用它。
    image(bgImage, 0, 0, width, height);
    return;
  }

  // Fallback background when the image is missing.
  // 如果背景图缺失，就用代码生成一个渐变背景。
  for (let y = 0; y < height; y += 1) {
    const t = y / height;
    const c = lerpColor(color("#1d3557"), color("#f28482"), t);
    stroke(c);
    line(0, y, width, y);
  }
}

function keyPressed() {
  // Press "r" to start or stop recording if p5.capture is available.
  // 如果页面里加载了 p5.capture，按 r 可以开始或停止录制。
  if (key === "r" && window.P5Capture) {
    const cap = P5Capture.getInstance();
    if (cap.state === "idle") {
      cap.start({ format: "mp4", framerate: 30 });
    } else {
      cap.stop();
    }
  }
}

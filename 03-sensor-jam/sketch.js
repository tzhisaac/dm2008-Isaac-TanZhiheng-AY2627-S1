// DM2008 — Coding Jam (Week 9)
// Sensor-to-Screen
// By Tan Zhiheng Isaac & Belinda Chai Yu Xuan
// (Rebuilt from our video — the original file is on Isaac's computer.)
//
// The ultrasonic sensor sends the distance of your hand (in cm) from the Arduino.
// Hand CLOSER  -> shape in the middle gets BIGGER
// Hand FURTHER -> shape gets SMALLER
// The background and shape flash random neon colours, and the shape
// switches between a square, circle and triangle.
//
// Open in Chrome, click "Connect to Arduino" and pick your board.
// (Close the Arduino Serial Monitor first — only one program can use the port.)

let port;
let connectBtn;

let circleSize = 100; // the size we draw
let targetSize = 100; // the size the sensor wants
let shapeType = 0;    // 0 = square, 1 = circle, 2 = triangle

let bgColor;
let shapeColor;

// bright neon colours to flash between
let neons = [
  "#ff00ff", // magenta
  "#39ff14", // neon green
  "#00e5ff", // cyan
  "#ffff00", // yellow
  "#ff3131", // red
  "#1f51ff", // blue
  "#ff6ec7"  // pink
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);

  bgColor = random(neons);
  shapeColor = random(neons);

  // serial connection (p5.webserial)
  port = createSerial();

  // reconnect automatically to a port we've used before
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  // flash new neon colours every 20 frames (about 3 times a second)
  if (frameCount % 20 === 0) {
    bgColor = random(neons);
    shapeColor = random(neons);
    // make sure the shape doesn't disappear into the background
    while (shapeColor === bgColor) {
      shapeColor = random(neons);
    }
    shapeType = floor(random(3));
  }

  background(bgColor);

  updateSensor();

  // ease towards the target size so the shape grows/shrinks smoothly
  circleSize = lerp(circleSize, targetSize, 0.2);

  fill(shapeColor);
  if (shapeType === 0) {
    square(width / 2, height / 2, circleSize);
  } else if (shapeType === 1) {
    circle(width / 2, height / 2, circleSize);
  } else {
    let r = circleSize / 2;
    triangle(
      width / 2, height / 2 - r,
      width / 2 - r, height / 2 + r,
      width / 2 + r, height / 2 + r
    );
  }

  connectBtn.html(port.opened() ? "Disconnect" : "Connect to Arduino");
}

// read one line from the Arduino and turn the distance into a size
function updateSensor() {
  if (port.opened()) {
    let str = port.readUntil("\n");
    if (str.length > 0) {
      let val = float(str.trim());
      if (!isNaN(val)) {
        console.log(val);
        // 5cm (close) -> big shape, 100cm (far) -> small shape
        targetSize = map(val, 5, 100, min(width, height) * 0.8, 30, true);
      }
    }
  }
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open(9600);
  } else {
    port.close();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

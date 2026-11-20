// DM2008 — Activity 2a
// Mode Switch (20 min)
//
// Use keys 1, 2, 3 to switch between at least 3 modes.
// Each mode should change more than just the background — think fill, size, or motion.
//
// Stretch: add a 4th mode, or make the ellipse change shape between modes.

let x = 0; // ellipse x-position
let size = 50; // ellipse size
let bgColor; // background color, changed by key presses
let baseSpeed = 2;
let trueSpeed = 2;
let basecolor; //ellipse Color

function setup() {
  createCanvas(400, 400);
  bgColor = color(220);
}

function draw() {
  background(bgColor);
  basecolor = map(mouseY, 0, height, 0, 255); // Track Y-axis to shift old to new code
  // height for flexibility

  // Draw Circle Speed and dynamic fill
  // fill(0);
  fill(255, basecolor, 39);
  noStroke();
  ellipse(x, height / 2, size);

  x += trueSpeed;

  if (x > width + size / 2) {
    x = 0;
  }

  // if (mouseX < width/2) {
  //   speed = 20;
  // } else {
  //   speed = 2;
  // }

  //Speed Over Distance
  trueSpeed = baseSpeed + mouseX / 10;

  //Height Color Change
}

// Keys 1, 2, 3 change the background color
function keyPressed() {
  switch (key) {
    case "1":
      bgColor = color(200, 100, 100);
      break; // red
    case "2":
      bgColor = color(100, 200, 100);
      break; // green
    case "3":
      bgColor = color(100, 100, 200);
      break; // blue
    default:
      bgColor = color(220); // grey
  }
  //Edit
}

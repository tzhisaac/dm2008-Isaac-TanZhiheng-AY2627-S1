// DM2008 — Activity 3b
// One Function Wonder (20 min)
//
// Write a function that draws a shape or group of shapes.
// It should take at least one parameter — try x, y, size, or color.
// Call it several times with different values to create variation.
//
// Ideas: a simple face, a flower, a house, an icon.
// Example: myShape(100, 200, 50); myShape(300, 200, 80);
//
// Stretch: call your function inside a for loop to create a repeating pattern.

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  noLoop();
}

function draw() {
  background("#4d2d00");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i % 2 == 0) {
        fill(255);
        rect(i * 40, j * 40 + 20, 40);
      } else {
        shape1(i * 40, j * 40 + 20, 40);
      }
    }
  }

  // Call your function here with different values each time
}

// Define your function outside draw()
// It can be called from anywhere in your sketch

function shape1(x, y, s) {
  noStroke();
  fill("#ff7429");
  square(x, y, s);
  fill(random(255));
  ellipse(x - s / 2, y, s, s);
  ellipse(x + s / 2, y, s, s);
}

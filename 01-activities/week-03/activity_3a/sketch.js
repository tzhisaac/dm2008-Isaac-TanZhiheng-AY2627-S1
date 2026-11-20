// Create a new array with some colors
let palette = ["#f06449", "#009988", "#3c78d8"];

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(225);
  
  // Even spacing based on how many items are in the array
  const spacing = width / (palette.length + 1);
  // Draw one circle for each palette color
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]);                   // use the i-th color
    const x = (i + 1) * spacing;        // position from the loop index
    ellipse(x, height / 2, width/palette.length);

  // for (let i = 0; i < palette.length; i++) {
  //   fill(palette[i]);                   // use the i-th color
  //   const x = (i + 1) * height;        // position from the loop index
  //   // ellipse(x, height + 1 / 2, 100);

  }
}


// Try changing the array while the loop keeps adapting
function keyPressed() {
  if (key == 'a' || key == 'A') {
    // Add a new random color to the end
    palette.push(color(random(255), random(255), random(255)));
  }
  if (key == 'r' || key == 'R' ) {
    // Remove the last color (if any)
    if (palette.length > 0) {
      palette.splice(palette.length - 1, 1);
    }
  }
}
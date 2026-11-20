
const spacing = 10

function setup() {
  createCanvas(400, 400);
  background(255);
  noStroke();
  fill();
  let startcolor = color('#FF4C00')
  let endcolor = color('#0008ff')
}

function draw() {
  background(217, 255, 0);
  noStroke();
  
  for (let i = 0; i < height; i += spacing) {
    if ((i / spacing) % 2 == 0) {
      fill(mouseY * 2, 106, 0, 100);
      ellipse(i + spacing/2, height/2, mouseY); //Orange size
    }
    // If the step is odd
    else {
      fill(26, 255, 0);
      rect(i + spacing/2, height/2, 14);
    }
  }
}
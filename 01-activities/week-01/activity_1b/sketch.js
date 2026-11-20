// DM2008 — Activity 1b [Ryoji Ikeda]
// Learning By Making (30 min)

let x;
let w;

function setup() {
  createCanvas(800, 800);
  background(0);
  noStroke();
}

function draw() {
  background(0);
  
  x = random(width);
  w = random(1, 10);
  circle(x, 225, w, height/5);
  
  x = random(width);
  circle(x, height/2, w, height/2);
  
  y = random(height);
  w = random(10, 80);
  
  noStroke();
  strokeWeight(random(0.5, 2));
  fill(26, 255, 0);
  rect(x, y, w, w);
}

function keyPressed() {
  saveCanvas("activity1b-image", "jpg");
}
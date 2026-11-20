// Drawing
// Googly eyes
//
// Main course I learned from:
// The Coding Train - Code! Programming with p5.js (YouTube playlist)
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

// Each line is a list of points. strokes is a list of lines.
// ref: Coding Train 7.1 What is an array? + 7.3 Arrays of Objects (playlist above)
let strokes = [];
let activeStroke = null;

// --- NEW: Mode & Farm state ---
let currentMode = "DRAW"; // "DRAW" or "FARM"
let farmAnimals = [];

// settings
let modeButton;     // toggle between draw & farm view
let saveDbButton;   // save drawing array to Firebase
let sizeSlider;     // thickness of line
let hueSlider;      // Colour (0 - 360 - colour wheel)
let patternSlider;  // spike count
let spikeSlider;    // length spike
let dotSlider;      // dot white
let wiggleSlider;   // wiggle (animation)

// Googly eyes
let eyes = [];
let eyeSlider;
let draggedEye = null;

function setup() {
  createCanvas(500, 400);

  // Buttons.
  const controls = createDiv();

  // --- NEW: Mode toggle and Database save buttons ---
  modeButton = createButton("Switch to Farm View");
  modeButton.parent(controls);
  modeButton.mousePressed(toggleMode);

  saveDbButton = createButton("Save to Farm");
  saveDbButton.parent(controls);
  saveDbButton.mousePressed(saveDrawingToFirebase);

  const clearButton = createButton("Clear drawing");
  clearButton.parent(controls);
  clearButton.mousePressed(clearDrawing);

  const saveButton = createButton("Save image to computer");
  saveButton.parent(controls);
  saveButton.mousePressed(() => {
    saveCanvas("my-drawing", "png");
  });

  // Sliders: createSlider(lowest, highest, start, step)
  // ref: https://p5js.org/reference/p5/createslider/
  // ref: Coding Train 8.5 Sliders, Buttons and Text Inputs
  // https://codingtrain.github.io/website-archive/Tutorials/8-html-css-dom/8.5-interacting-with-the-dom
  createP("Line size");
  sizeSlider = createSlider(5, 60, 25, 1);

  createP("Colour (hue)");
  hueSlider = createSlider(0, 360, 0, 1);

  createP("Spikes");
  patternSlider = createSlider(0, 10, 4, 1);

  createP("Spike length");
  spikeSlider = createSlider(0.2, 1.5, 0.5, 0.1);

  createP("Dots");
  dotSlider = createSlider(0, 0.5, 0.1, 0.05);

  createP("Wiggle");
  wiggleSlider = createSlider(0, 1, 0.3, 0.1);

  createP("Eye size");
  eyeSlider = createSlider(20, 100, 60, 1);

  eyes.push(new Eye(200, 150));
  eyes.push(new Eye(280, 150));

  // --- NEW: Subscribe to Firebase updates ---
  listenToDatabase();
}

function draw() {
  // --- NEW: If in farm mode, render the farm instead ---
  if (currentMode === "FARM") {
    drawFarmMode();
    return;
  }

  background(255);

  // HSB colour mode:
  // hue (0-360), saturation (0-100), brightness (0-100)
  // ref: https://p5js.org/reference/p5/colorMode/
  // ref: https://www.geeksforgeeks.org/p5-js-colormode-function/amp/
  colorMode(HSB);

  // read all the sliders once
  // ref: https://p5js.org/reference/p5/createslider/
  let size = sizeSlider.value();
  let hueVal = hueSlider.value(); // --- RENAMED FROM hue TO hueVal ---
  let spikes = patternSlider.value();
  let spikeLength = spikeSlider.value();
  let dots = dotSlider.value();
  let wiggle = wiggleSlider.value();

  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();

  // LAYER 1: thick outline, in the opposite-ish colour
  // (hueVal + 200) moves around the colour wheel, % 360 keeps it under 360
  stroke((hueVal + 200) % 360, 80, 70); // --- UPDATED TO hueVal ---
  strokeWeight(size + 20);
  for (let path of strokes) {
    drawPath(path);
  }

  // LAYER 2: the main colour line
  stroke(hueVal, 50, 97); // --- UPDATED TO hueVal ---
  strokeWeight(size);
  for (let path of strokes) {
    drawPath(path);
  }

  // LAYER 3: black spikes that wiggle
  // spikes use polar coordinates (angle + length -> x, y with cos and sin)
  // ref: Coding Train 3.4 Polar Coordinates
  // https://thecodingtrain.com/tracks/supershapes/noc/3-angles/4-polar-coordinates
  // ref: Coding Train 4.2 Nested Loops (playlist above)
  stroke(0);
  strokeWeight(2);
  for (let path of strokes) {
    for (let p of path) {
      for (let i = 0; i < spikes; i++) {
        // spread the spikes evenly around the point
        // TWO_PI = one full turn (360 degrees)
        let a = p.angle + i * TWO_PI / spikes;

        // animation: sin() goes up and down over time, so the spike swings
        // ref: Coding Train 3.5 Harmonic Motion
        // https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/3-angles/5-harmonic-motion
        a = a + sin(frameCount * 0.05 + i) * wiggle;

        let len = size * spikeLength;
        let x2 = p.x + cos(a) * len;
        let y2 = p.y + sin(a) * len;
        line(p.x, p.y, x2, y2);
      }
    }
  }

  // LAYER 4: white dots
  // every point has its own random number (0 to 1).
  // if it's smaller than the slider, that point gets a dot.
  // ref: Coding Train 3.1 Conditional Statements + 2.4 random() (playlist above)
  noStroke();
  fill(0, 0, 100); // white in HSB
  for (let path of strokes) {
    for (let p of path) {
      if (p.dotNum < dots) {
        circle(p.x, p.y, size * 0.4);
      }
    }
  }

  // back to normal colours for the eyes
  colorMode(RGB);

  if (draggedEye !== null) {
    draggedEye.pos.set(mouseX, mouseY);
  }

  for (let e of eyes) {
    e.display();
  }
}

// draws one line from its list of points (connect-the-dots)
// ref: https://p5js.org/reference/p5/beginShape/
// ref: Coding Train 5.1 Function Basics (playlist above)
function drawPath(path) {
  if (path.length === 1) {
    point(path[0].x, path[0].y);
  } else {
    beginShape();
    for (let p of path) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

// makes a new point. The random numbers are picked ONCE here,
// so the drawing doesn't flicker.
// ref: Coding Train 2.4 random() + 7.3 Arrays of Objects (playlist above)
function makePoint() {
  return {
    x: mouseX,
    y: mouseY,
    angle: random(TWO_PI),  // which way the spikes start
    dotNum: random(),       // used by the Dots slider
  };
}

// ref: Coding Train 7.4 Mouse Interaction with Objects (playlist above)
function mousePressed() {
  if (currentMode !== "DRAW") return; // if im in farm mode, then i cannot be drawing or editting

  // did we click on an eye?
  for (let e of eyes) {
    if (dist(mouseX, mouseY, e.pos.x, e.pos.y) < eyeSlider.value() / 2) {
      draggedEye = e;
      return;
    }
  }

  if (insideCanvas()) {
    activeStroke = [];
    strokes.push(activeStroke);
    activeStroke.push(makePoint());
  }
}

function mouseDragged() {
  if (currentMode !== "DRAW") return; // if im in farm mode, then i cannot be drawing or editting

  if (activeStroke !== null) {
    if (insideCanvas()) {
      activeStroke.push(makePoint());
    } else {
      activeStroke = null;
    }
  }
}

function mouseReleased() {
  activeStroke = null;
  draggedEye = null;
}

function insideCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

function clearDrawing() {
  strokes = [];
  activeStroke = null;
}

// Eye class: one blueprint, many eyes
// ref: Coding Train 6.2 Classes in JavaScript
// https://www.youtube.com/watch?v=T-HGdc8L-7w
class Eye {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  display() {
    let size = eyeSlider.value();

    // white part
    stroke(0);
    strokeWeight(3);
    fill(255);
    circle(this.pos.x, this.pos.y, size);

    // which way is the mouse?
    // ref: https://p5js.org/reference/p5/atan2/
    let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);

    let pd = size * 0.2;
    let pupilSize = size / 2;

    // move the pupil that way (same cos/sin trick as the spikes)
    let x2 = this.pos.x + pd * cos(angle);
    let y2 = this.pos.y + pd * sin(angle);

    // pupil
    noStroke();
    fill(0);
    circle(x2, y2, pupilSize);
  }
}

// ------------------------------------------------------------------
// FIREBASE & FARM VIEW FUNCTIONS
// tutorial used: https://www.youtube.com/watch?v=RUSvMxxm_Jo 
// ------------------------------------------------------------------

function toggleMode() { //if the mode is on draw, then button will show the farm and vice versa 
  if (currentMode === "DRAW") {
    currentMode = "FARM";
    modeButton.html("Switch to Draw Mode");
  } else {  //relabels the button to show somtying different 
    currentMode = "DRAW";
    modeButton.html("Switch to Farm View");
  }
}

function saveDrawingToFirebase() {
  if (strokes.length === 0) { //empty drawings cannot be saved 
    alert("Draw something before saving!");
    return;
  }

  // Structure drawing parameters and points into an object array
  //Structures the data to be stored
  const drawingData = {
    settings: {
      size: sizeSlider.value(),
      hue: hueSlider.value(),
      spikes: patternSlider.value(),
      spikeLength: spikeSlider.value(),
      dots: dotSlider.value(),
      wiggle: wiggleSlider.value(),
      eyeSize: eyeSlider.value()
    },
    strokes: strokes,
    eyes: eyes.map(e => ({ x: e.pos.x, y: e.pos.y })),
    createdAt: Date.now()
  };

  //pushes the data to firebase
  const animalsRef = window.dbRef(window.db, 'animals');
  window.dbPush(animalsRef, drawingData)
    .then(() => {
      alert("Animal saved to database!");
      clearDrawing();
    })
    .catch((err) => {
      console.error("Firebase save error:", err);
    });
}

function listenToDatabase() {
  const animalsRef = window.dbRef(window.db, 'animals');//calls back to the firebase - you can see the file named "animals" in the database screen 
  window.dbOnValue(animalsRef, (snapshot) => { //Every time a new animal is saved to Firebase, this entire block automatically runs again
    const data = snapshot.val(); //extract the actual raw drawing numbers (strokes, colors, slider values)
    farmAnimals = []; //Empties our current farmAnimals array in p5.js,, basically wipes it clean so theres no duplicates 

    if (data) {
      Object.keys(data).forEach(key => { //Firebase stores each saved drawing under a random unique ID key > loops through each ID one by one and goes to next next tline 
        const item = data[key]; //gets a list of all those unique IDs and then goes back to previous line 
        farmAnimals.push(new Animal(item)); //grabs the drawing details and turns it into a living creature
      });
    }
  });
}

function drawFarmMode() {
  background(100, 200, 100); // Green grass field

  for (let animal of farmAnimals) {
    animal.update();
    animal.display();
  }

  // fill(0, 150);
  // noStroke();
  // rect(10, 10, 200, 30, 5);
  // fill(255);
  // textSize(14);
  // textAlign(LEFT, CENTER);
  // text(`Farm Animals: ${farmAnimals.length}`, 20, 25);
}

// Animal class: Re-renders saved array stroke data into autonomous moving creatures
class Animal { // class because we want all the drawings to have the same behaviour 
  constructor(data) {
    this.strokes = data.strokes || []; //Stores the array of drawn lines for this specific animal
    this.settings = data.settings || {}; //Stores the saved slider settings
    this.eyes = data.eyes || []; //Stores the positions of the googly eyes

    this.pos = createVector(random(50, width - 50), random(50, height - 50)); //Picks a random $(x, y)$ starting location for the animal on the canvas, keeping it at least 50 pixels away from the outer edges
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5)); //picks a completely random walking direction in 360 degrees and scales that direction by a random walking speed between 0.5 and 1.5 pixels per frame.
    this.scale = 0.4;
  }

  update() {// animates the animals so that they run around and bounce 
    this.pos.add(this.vel);
    if (this.pos.x < 30 || this.pos.x > width - 30) this.vel.x *= -1;
    if (this.pos.y < 30 || this.pos.y > height - 30) this.vel.y *= -1; //checks toi see if it has hit the edge of the wall
  }

display() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.scale);
    translate(-250, -200);

    colorMode(HSB);

    // ISAAC I RENAMED hue TO hueVal 
    let { size, hue: hueVal, spikes, spikeLength, dots, wiggle, eyeSize } = this.settings;

    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();

    //refers back to code earlier where youre just redrawing the things again
  
    // LAYER 1: thick outline
    stroke((hueVal + 200) % 360, 80, 70); // --- UPDATED TO hueVal ---
    strokeWeight(size + 20);
    for (let path of this.strokes) drawPath(path);

    // LAYER 2: main line
    stroke(hueVal, 50, 97); // --- UPDATED TO hueVal ---
    strokeWeight(size);
    for (let path of this.strokes) drawPath(path);

    // ... (rest of display function remains the same)


    // LAYER 3: spikes
    stroke(0);
    strokeWeight(2);
    for (let path of this.strokes) {
      for (let p of path) {
        for (let i = 0; i < spikes; i++) {
          let a = p.angle + i * TWO_PI / spikes + sin(frameCount * 0.05 + i) * wiggle;
          let len = size * spikeLength;
          let x2 = p.x + cos(a) * len;
          let y2 = p.y + sin(a) * len;
          line(p.x, p.y, x2, y2);
        }
      }
    }

    // LAYER 4: white dots
    noStroke();
    fill(0, 0, 100);
    for (let path of this.strokes) {
      for (let p of path) {
        if (p.dotNum < dots) circle(p.x, p.y, size * 0.4);
      }
    }

    // Googly Eyes
    colorMode(RGB);
    for (let e of this.eyes) {
      stroke(0);
      strokeWeight(3);
      fill(255);
      circle(e.x, e.y, eyeSize);

      noStroke();
      fill(0);
      circle(e.x, e.y, eyeSize / 2);
    }

    pop();
  }
}

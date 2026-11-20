// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)
//
// Complete this scaffold into a playable game.
// Your game should have player control, collision detection,
// score tracking, and at least two game states.
//
// Not sure where to start? Try this order:
// 1. Get the bird flapping — add control in keyPressed()
// 2. Get pipes spawning — uncomment the spawn logic in draw()
// 3. Add collision detection between the bird and pipes
// 4. Add scoring when the bird passes a pipe
// 5. Add game states — at minimum a playing state and a game over state
//
// Stretch: add a start screen, a high score, or a difficulty curve.

/* ----------------- Globals ----------------- */
let bird;
let pipes = [];
let score = 0;
let spawnCounter = 0;
let bgImage;
let bgScroll = 0; //this keeps track of how far the background has moved
let bgSpeed = 1.5;
let bgWidth;
let bgMusic; //background music
let birdImage; //jumpybird nott flappy
let columnImages = [];
let jumpSound;
let loseSound;
let startImage;
let gameOverImage;

const SPAWN_RATE = 90; // frames between new pipes — increase this for more horizontal space between pipes
const PIPE_SPEED = 2.5; // also affects spacing: distance between pipes ≈ SPAWN_RATE × PIPE_SPEED
const PIPE_GAP = 140;
const PIPE_W = 60;

// Game states: "playing" or "gameover" — add more if you need them
let gameState = "start";

/* ----------------- Setup & Draw ----------------- */
async function setup() {
  bgImage = await loadImage("assets/background.png"); //kapi taught us on wk 6-lastest p5jsversion
  birdImage = await loadImage("assets/BirdBird.png"); //flappybird image
  bgMusic = await loadSound("assets/bgmusic.mp3");
  jumpSound = await loadSound("assets/JumpSound.mp3");
loseSound = await loadSound("assets/LoseSound.mp3");
  startImage = await loadImage("assets/StartGame.png");
gameOverImage = await loadImage("assets/GameOver.png");
  columnImages[0] = await loadImage("assets/ColumnOne.png");
columnImages[1] = await loadImage("assets/ColumnTwo.png");
columnImages[2] = await loadImage("assets/ColumnThree.png");
  bgMusic.loop(true); // Makes it repeat the music when it ends!
  createCanvas(480, 640);
  noStroke();
  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width + 40));

  console.log(bgImage.width);
  bgWidth = bgImage.width * (height / bgImage.height);
}

function draw() {
  // background(18, 22, 28);
  // belinda removed this and replaced it with below!

  image(bgImage, bgScroll, 0, bgWidth, height);
  image(bgImage, bgScroll + bgWidth, 0, bgWidth, height);

  bgScroll -= bgSpeed; // Controls the speed of the background, i want it slower

  if (bgScroll <= -bgWidth) {
    bgScroll = 0;
  }

  if (gameState === "start") {
  bird.show();

  // Gently grow and shrink around the normal size
  const pulse = 1 + sin(frameCount * 0.05) * 0.08;
  const logoWidth = 340 * pulse;
  const logoHeight =
    startImage.height * (logoWidth / startImage.width);

  push();
  imageMode(CENTER);
  image(
    startImage,
    width / 2,
    height / 2 - 100,
    logoWidth,
    logoHeight
  );
  pop();

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Press Space to start", width / 2, height / 2 + 80);
}

    if (gameState === "playing") {
    bird.update();
      
    // Spawn a new pipe every SPAWN_RATE frames, then reset the counter
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // When the bird hits a pipe, trigger game over
      // if (pipes[i].hits(bird)) {
      if (pipes[i].hits(bird)) {
  endGame();
  break;
}
        // What should happen when the game ends?
      

      // When the bird passes a pipe, increment the score
      // Hint: use pipes[i].passed to make sure you only score once per pipe
      if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
        //if (not number of pipes passed and position x of pipes plus position w of pipes is less than bosition of bird in x axis) score increases
        // increment score here
        score++;
        pipes[i].passed = true;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.show(); //the first wprd referes to the bird class and the show refers to the properties that this bird class has

    // Display the score — look up textAlign() and textSize() in the p5.js reference
    // This is the score counter — shown centred at the top of the canvas
    fill(255);
    textAlign(CENTER, TOP); // CENTER horizontally, TOP vertically — change these to reposition the text
    textSize(32); // increase/decrease this to make the score bigger or smaller
    text(score, width / 2, 20); // width / 2 keeps it centred; 20 is the distance from the top edge
  }

  // if (gameState === "gameover") {
 if (gameState === "gameover") {
  fill(0, 180);
  rect(0, 0, width, height);

  const logoWidth = 340;
  const logoHeight =
    gameOverImage.height * (logoWidth / gameOverImage.width);

  push();
  imageMode(CENTER);
  image(
    gameOverImage,
    width / 2,
    height / 2 - 80,
    logoWidth,
    logoHeight
  );
  pop();

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(22);
  text("Score: " + score, width / 2, height / 2 + 40);

  textSize(18);
  text("Press Space to restart", width / 2, height / 2 + 80);
}
}
    // What should the player see when the game ends?
    // How do they restart?


/* ----------------- Input ----------------- */
function keyPressed() {
  if (key !== " " && keyCode !== UP_ARROW) {
    return;
  }

  // Space starts or restarts the game
  if (gameState === "start" || gameState === "gameover") {
    if (key !== " ") {
      return;
    }

    loseSound.stop();
    bird = new Bird(120, height / 2);
    pipes = [new Pipe(width + 40)];
    score = 0;
    spawnCounter = 0;
    gameState = "playing";
  }

  if (!bgMusic.isPlaying()) {
    bgMusic.start();
  }

  bird.flap();
}
 // jump height is controlled by flapStrength in the Bird constructor below

/* ----------------- Classes ----------------- */
function endGame() {
  if (gameState !== "playing") {
    return; // Prevent the lose sound from playing more than once
  }

  gameState = "gameover";
  loseSound.start();
}

class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 24;
    this.hitR = 10; // Smaller collision area
    this.gravity = 0.5; // how fast the bird drops — increase for a faster fall, decrease for a floatier drop
    this.flapStrength = -8.0; // how high the bird jumps on flap — more negative = higher jumps
    this.angle = 0; //bird starts upright
  }
  

  applyForce(fy) {
    //function under bird
    this.acc.y += fy; //
  }

  flap() {
    // A negative y velocity moves the bird upward
    this.vel.y = this.flapStrength;
    this.angle = TWO_PI; // Start a full spin

    jumpSound.stop(); // Restart the sound on each jump
  jumpSound.start();
  }

  update() {
    this.applyForce(this.gravity); //applyforce takes value from gravity
    this.vel.add(this.acc); //takes from this.acc
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep the bird below the top edge
  if (this.pos.y < this.r) {
    this.pos.y = this.r;
    this.vel.y = 0;
  }

  // Touching the ground ends the game
  if (this.pos.y > height - this.r) {
    this.pos.y = height - this.r;
    this.vel.y = 0;
     endGame();
}

  // Spin every frame, wherever the bird is
  this.angle -= 0.4;

  if (this.angle < 0) {
    this.angle = 0;
  }
}

    // Touching the ground is game over — same as hitting a pipe
//    if (this.pos.y > height - this.r) {
//   this.pos.y = height - this.r;
//   this.vel.y = 0;
//   gameState = "gameover";
// }
//   }

  // show() {
  //   //turns bird into a bird
  //   const birdHeight = this.r * 2;
  //   const birdWidth = birdImage.width * (birdHeight / birdImage.height);

  //   push();
  //   imageMode(CENTER);
  //   image(birdImage, this.pos.x, this.pos.y, birdWidth, birdHeight);
  //   pop();
  // }
   show() {
    const birdHeight = this.r * 2;
    const birdWidth =
      birdImage.width * (birdHeight / birdImage.height);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(birdImage, 0, 0, birdWidth, birdHeight);
    pop();
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;
    this.columnImage = random(columnImages);

    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);
    this.top = gapY;
    this.bottom = gapY + PIPE_GAP;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  // show() {
  //   fill(120, 200, 160);
  //   rect(this.x, 0, this.w, this.top);
  //   rect(this.x, this.bottom, this.w, height - this.bottom);
  // }

 show() {
  const img = this.columnImage;

  // Crop empty space from the left and right
  const cropX = img.width * 0.2;
  const cropWidth = img.width * 0.6;

  push();
  imageMode(CORNER);

  // Upper column
  push();
  translate(this.x, this.top);
  scale(1, -1);

  image(
    img,
    0, 0, this.w, this.top,       // Position and size on canvas
    cropX, 0, cropWidth, img.height // Part of the PNG to use
  );

  pop();

  // Lower column
  image(
    img,
    this.x, this.bottom, this.w, height - this.bottom,
    cropX, 0, cropWidth, img.height
  );

  pop();
}

  offscreen() {
    // 'return' sends a value back to wherever this method was called
    // We'll cover this properly next week, for now just know it gives back true or false
    return this.x + this.w < 0;
  }

  // Checks if the bird overlaps with either pipe rectangle
  // 1) Is the bird within the pipe's x range?
  // 2) If yes, is it outside the gap — above the top or below the bottom?
hits(bird) {
  // Does the bird overlap the column horizontally?
  const withinX =
    bird.pos.x + bird.hitR > this.x &&
    bird.pos.x - bird.hitR < this.x + this.w;

  const aboveGap = bird.pos.y - bird.hitR < this.top;
  const belowGap = bird.pos.y + bird.hitR > this.bottom;

  return withinX && (aboveGap || belowGap);
}
    // This method also uses 'return' — coming up next week!
    // const withinX = (bird.pos.x + bird.r > this.x) && (bird.pos.x - bird.r < this.x + this.w);
    // const aboveGap = bird.pos.y - bird.r < this.top;
    // const belowGap = bird.pos.y + bird.r > this.bottom;
    // return withinX && (aboveGap || belowGap);
  }

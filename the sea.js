let noiseVal;
let noiseScale = 0.125;
let cols, rows;
let scl = 20;
let w = 2000;
let h = 1600;
let xOffset = 0;
let yOffset = 0;
let targetXOffset = 0;
let targetYOffset = 0;
let easing = 0.01;
let buttonSpacing = 7; // Spacing between buttons
let buttonSize = 20; // Size of the buttons

let currentPage = -1; // Variable to keep track of the current page
let expanding = false; // Variable to track if the red square is expanding
let expandedSize = buttonSize * 6; // Size of the expanded rectangle
let expandedImage;
let fadeAlpha = 0; // Variable to control fading effect

function preload() {
  expandedImage = loadImage('image.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = w / scl;
  rows = h / scl;
  noiseDetail(8, 0.5); // Increased noise detail for smoother contours
}

function draw() {
  background(255);
  stroke(0); // Set stroke color to black
  xOffset += (targetXOffset - xOffset) * easing;
  yOffset += (targetYOffset - yOffset) * easing;

  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  if (document.body.style.position === 'fixed') {
    // Adjust for fixed body positioning
    centerX += window.pageXOffset;
    centerY += window.pageYOffset;
  }

  let yoff = yOffset;

  for (let y = 0; y < rows; y++) {
    let xoff = xOffset;
    beginShape();
    noFill(); // Set contour lines as outlines only
    for (let x = 0; x < cols; x++) {
      let angle = noise(xoff, yoff) * TWO_PI * 2;
      let v = p5.Vector.fromAngle(angle);
      let xn = x * scl - w / 2 + centerX;
      let yn = y * scl - h / 2 + centerY;
      let curveX = xn + v.x * scl * 0.5;
      let curveY = yn + v.y * scl * 0.5;
      vertex(curveX, curveY);

      xoff += noiseScale;
    }
    endShape();
    yoff += noiseScale;
  }

  let yoffButtons = yOffset;
  for (let y = 0; y < rows; y++) {
    let xoffButtons = xOffset;
    for (let x = 0; x < cols; x++) {
      if (x % buttonSpacing === 0 && y % buttonSpacing === 0) {
        let angle = noise(xoffButtons, yoffButtons) * TWO_PI * 2;
        let v = p5.Vector.fromAngle(angle);
        let xn = x * scl - w / 2 + centerX;
        let yn = y * scl - h / 2 + centerY;
        let bx = xn + v.x * scl * 0.5 - buttonSize / 2;
        let by = yn + v.y * scl * 0.5 - buttonSize / 2;

        if (
          mouseX > bx &&
          mouseX < bx + buttonSize &&
          mouseY > by &&
          mouseY < by + buttonSize
        ) {
          fill(255, 0, 0); // Change color to red when hovered
          if (mouseIsPressed) {
            currentPage = x + y * cols; // Calculate the current page based on button position
            expanding = true;
            fadeAlpha = 0; // Reset fadeAlpha when the red square is clicked
          }
        } else {
          fill(0); // Default black color for buttons
          if (!expanding) {
            currentPage = -1;
          }
        }

        noStroke();
        rect(bx, by, buttonSize, buttonSize);

        // Display the expanded image with fading effect when the red square is clicked
        if (expanding && currentPage === x + y * cols) {
          let expandedX = bx - (expandedSize - buttonSize) / 2 - expandedSize * 0.2 + centerX;
          let expandedY = by - (expandedSize - buttonSize) / 2 + centerY;
          
          fill(255, 0, 0, fadeAlpha); // Set fill with fading effect
          image(expandedImage, expandedX, expandedY, expandedSize * 1.5, expandedSize); // Display the loaded image

          // Gradually increase alpha for fading effect
          fadeAlpha = min(fadeAlpha + 5, 255);
        }
      }
      xoffButtons += noiseScale;
    }
    yoffButtons += noiseScale;
  }
}

function mouseMoved() {
  targetXOffset = map(mouseX, 0, windowWidth, -w / 300, w / 300);
  targetYOffset = map(mouseY, 0, windowHeight, -h / 300, h / 300);

  // Reset currentPage when the mouse is not hovering over any button
  if (!expanding) {
    currentPage = -1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

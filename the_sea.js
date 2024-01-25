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
          }
        } else {
          fill(0); // Default black color for buttons
          if (!expanding) {
            currentPage = -1;
          }
        }

        noStroke();
        rect(bx, by, buttonSize, buttonSize);

        // Display the expanded image when the red square is clicked
        if (expanding && currentPage === x + y * cols) {
          let expandedX = bx - (expandedSize - buttonSize) / 2 - expandedSize * 0.2 + centerX;
          let expandedY = by - (expandedSize - buttonSize) / 2 + centerY;
          image(expandedImage, expandedX, expandedY, expandedSize * 1.5, expandedSize); // Display the loaded image
        }
      }
      xoffButtons += noiseScale;
    }
    yoffButtons += noiseScale;
  }
}

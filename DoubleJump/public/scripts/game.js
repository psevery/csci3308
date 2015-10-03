function update() {
  
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  board.draw();
  window.requestAnimationFrame(draw);
}

document.addEventListener("mousedown", mouse.handler, false);

draw();

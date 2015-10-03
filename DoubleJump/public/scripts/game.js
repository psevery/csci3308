function update() {
  queue.forEach(function(move) {
    if (move.isValid()) {
      board.exec(move);
    }
  });
  queue = [];
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  board.draw();
}

function loop() {
  update();
  draw();
  window.requestAnimationFrame(loop);
}

loop();

var mouse = {
  firstClick: true,
  last: { row: 0, col: 0 },
};
mouse.pixelToGrid = function (x) {
  return Math.trunc(x / square.sidelen);
};
mouse.clickedInBounds = function (x, y) {
  if (x < 0 || x > board.width) {
    return false;
  }
  else if (y < 0 || y > board.height) {
    return false;
  }
  else {
    return true;
  }
};
mouse.clickedOwnedPiece = function (row, col) {
  return player.numbers().indexOf(board.matrix[row][col]) != -1;
};
mouse.clickedEmptySquare = function (row, col) {
  return board.matrix[row][col] == square.id("empty");
};
mouse.handler = function (e) {
  var x = e.clientX - canvas.offsetLeft;
  var y = e.clientY;
  if (mouse.clickedInBounds(x, y)) {
    var row = mouse.pixelToGrid(y);
    var col = mouse.pixelToGrid(x);
    if (mouse.firstClick && mouse.clickedOwnedPiece(row, col)) {
      board.highlight(row, col);
      mouse.last = { row: row, col: col };
      mouse.firstClick = false;

    } else if (!mouse.firstClick) {
      board.unhighlight(mouse.last.row, mouse.last.col);
      mouse.firstClick = true;

      if (mouse.clickedEmptySquare(row, col)) {
        var src = mouse.last;
        var dst = { row: row, col: col };
        queue.push(new Move(src, dst));
        player.nextTurn();
      }
    }
  }
}

document.addEventListener("mousedown", mouse.handler, false);

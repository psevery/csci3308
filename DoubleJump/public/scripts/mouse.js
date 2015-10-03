var mouse = {
  firstClick: true,
  lastClick: { row: 0, col: 0 },
  savedPiece: 0,
};
mouse.pixelToGrid = function (x) {
  return Math.trunc(x / square.side);
}
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
}
mouse.clickedOwnedPiece = function (x, y) {
  var row = mouse.pixelToGrid(y);
  var col = mouse.pixelToGrid(x);
  if (player.numbers().indexOf(board.squares[row][col]) != -1) {
    return true;
  }
}
mouse.clickedEmptySquare = function (x, y) {
  var row = mouse.pixelToGrid(y);
  var col = mouse.pixelToGrid(x);
  return board.squares[row][col] == square.number["none"];
}

mouse.handler = function (e) {
  var x = e.clientX - canvas.offsetLeft;
  var y = e.clientY;
  if (mouse.clickedInBounds(x, y)) {
    var row = mouse.pixelToGrid(y);
    var col = mouse.pixelToGrid(x);
    if (mouse.firstClick && mouse.clickedOwnedPiece(x, y)) {
      mouse.savedPiece = board.squares[row][col];
      board.squares[row][col] = square.number["light-blue"];
      mouse.lastClick = { row: row, col: col };
      mouse.firstClick = false;

    } else if (!mouse.firstClick) {
      if (mouse.clickedEmptySquare(x, y)) {
        board.squares[mouse.lastClick.row][mouse.lastClick.col] = mouse.savedPiece;
        var source = mouse.lastClick;
        var destination = { row: row, col: col };
        board.movePiece(source, destination);
        mouse.firstClick = true;
        player.nextTurn();
      } else {
        board.squares[mouse.lastClick.row][mouse.lastClick.col] = mouse.savedPiece;
        mouse.firstClick = true;
      }
    }
  }
}



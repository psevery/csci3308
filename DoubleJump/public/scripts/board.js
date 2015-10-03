var board = {
  rows: 8,
  cols: 8,
  savedSquare: 0,
  matrix: [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
  ],
};
board.width  = board.cols * square.sidelen,
board.height = board.rows * square.sidelen,
board.print = function () {
  for (var row = 0; row < board.rows; ++row) {
    console.log(board.matrix[row]);
  }
};
board.draw = function () {
  var black = true;
  for (var row = 0; row < board.rows; ++row) {
    for (var col = 0; col < board.cols; ++col) {
      context.fillStyle = black ? "black" : drawUtils.fillStyles["empty"];
      context.fillRect(
        col * square.sidelen,
        row * square.sidelen,
        square.sidelen,
        square.sidelen
      );
      square.draw(board.matrix[row][col], row, col);
      black = !black;
    }
    black = !black;
  }
}
board.saveSquare = function (row, col) {
  board.savedSquare = board.matrix[row][col];
};
board.highlight = function (row, col) {
  board.saveSquare(row, col);
  board.matrix[row][col] = square.id("light-blue");
};
board.unhighlight = function (row, col) {
  board.matrix[row][col] = board.savedSquare;
};
board.exec = function (move) {
  board.matrix[move.dst.row][move.dst.col] =
    board.matrix[move.src.row][move.src.col];
  board.matrix[move.src.row][move.src.col] = square.id("empty");
}

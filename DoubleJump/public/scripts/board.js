var fillStyle = {
  "none":       "rgba(0, 0, 0, 0)",
  "red":        "rgba(200, 0, 0, 1)",
  "grey":       "#2f4f4f",
  "yellow":     "#ffff00",
  "light-grey": "#d3d3d3",
  "light-blue": "#add8e6",
  "black":      "rgba(0, 0, 0, 1)",
};

var board = {
  rows: 8,
  cols: 8,
  squares: [
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
board.width  = board.cols * square.side,
board.height = board.rows * square.side,
board.print = function () {
  for (var row = 0; row < board.rows; ++row) {
    console.log(board.squares[row]);
  }
};
board.draw = function () {
  var black = true;
  for (var row = 0; row < board.rows; ++row) {
    for (var col = 0; col < board.cols; ++col) {
      context.fillStyle = black ? fillStyle["black"]
                                : fillStyle["none"];
      context.fillRect(
        col * square.side,
        row * square.side,
        square.side,
        square.side
      );
      square.draw(board.squares[row][col], row, col);
      black = !black;
    }
    black = !black;
  }
}
board.movePiece = function (src, dst) {
  board.squares[dst.row][dst.col] = board.squares[src.row][src.col];
  board.squares[src.row][src.col] = square.number["none"];
};

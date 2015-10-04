var Board = function (matrix) {
  this.matrix = matrix;
  this.rows = matrix.length;
  this.cols = matrix[0].length;
};

Board.prototype.squareAt = function (row, col) {
  return new Square(this.matrix[row][col], row, col);
}

Board.prototype.move = function(m) {
  this.matrix[m.dst.row][m.dst.col] = this.matrix[m.src.row][m.src.col];
  this.matrix[m.src.row][m.src.col] = Square.empty;
}

Board.prototype.draw = function (context) {
  var black = true;
  for (var row = 0; row < this.rows; ++row) {
    for (var col = 0; col < this.cols; ++col) {
      if (black) {
        this.squareAt(row, col).draw(context);
      }
      black = !black;
    }
    black = !black;
  }
};

var Click = function (x, y) {
  this.x = x;
  this.y = y;
};

function pixelToRow(y) {
  return Math.trunc(y / Square.len);
};
var pixelToCol = pixelToRow;

Click.prototype.inBounds = function () {
  if (this.x < 0 || this.x > Board.cols * Square.len) {
    return false;
  }
  else if (this.y < 0 || this.y > Board.rows * Square.len) {
    return false;
  }
  else {
    return true;
  }
};

Click.prototype.toSquare = function (board) {
  if (!this.inBounds()) {
    return null;
  }
  else {
    var row = pixelToRow(this.y);
    var col = pixelToCol(this.x);
    return board.squareAt(row, col);
  }
};

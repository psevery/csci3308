var Move = function (src, dst) {
  this.src = src;
  this.dst = dst;
};

Move.prototype.isValidNotHop = function (board) {
  var validDstSquares = [];
  var validDst = false;
  if (this.src.id == 1) {
    validDstSquares.push(board.squareAt(this.src.row + 1, this.src.col - 1));
    validDstSquares.push(board.squareAt(this.src.row + 1, this.src.col + 1));
    for (var i = 0; i < validDstSquares.length; ++i) {
      var square = validDstSquares[i];
      if (square && this.dst.row == square.row && this.dst.col == square.col) {
        validDst = true;
        break;
      }
    }
  }
  else if (this.src.id == 2) {
    validDstSquares = [
      board.squareAt(this.src.row - 1, this.src.col - 1),
      board.squareAt(this.src.row - 1, this.src.col + 1),
    ];
    for (var i = 0; i < validDstSquares.length; ++i) {
      var square = validDstSquares[i];
      if (this.dst.row == square.row && this.dst.col == square.col) {
        validDst = true;
        break;
      }
    }
  }
  return validDst;
};

Move.prototype.isValidHop = function (board) {
  return false;
};

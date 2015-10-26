// MODULE FOR BOARD OPERATIONS AND RELATED CODE

var BOARD_ROWS = 8;
var BOARD_COLS = 8;

// Board type (consists of a matrix and two number values,
// "rows" and "cols").
var Board = function(matrix, rows, cols) {
    this.matrix = matrix;
    this.rows = rows;
    this.cols = cols;
}

Board.new = function(matrix) {
    var matrix = matrix ? matrix : [
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
    ];

    if (matrix.length != BOARD_ROWS
        || matrix[0].length != BOARD_COLS)
    {
        throw "Board.new: matrix has incorrect dimensions";
    }

    return new Board(matrix, BOARD_ROWS, BOARD_COLS);
}

Board.prototype.print = function() {
    console.log('<---Top--->');
    for (var row = 0; row < this.rows; ++row) {
        var row_str = "";
        for (var col = 0; col < this.cols; ++col) {
            var piece = this.matrix[row][col];
            row_str += piece + " ";
        }
        console.log(row_str);
    }
    console.log('<---Bottom--->');
}

Board.prototype.equals = function(other_board) {
    if (this.rows != other_board.rows || this.cols != other_board.cols)
        throw "Board.prototype.equals: board dimensions are not equal";

    for (var i = 0; i < this.rows; ++i) {
        for (var j = 0; j < this.cols; ++j) {
            if (this.matrix[i][j] != other_board.matrix[i][j])
                return false;
        }
    }
    return true;
}

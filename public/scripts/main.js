/**
 *  Main module.
 *  @module main
 */

/**
 *  Board state, including state at each square, coordinates to draw at, width, and current turn.
 */
var board;

/**
 *  Initialize all game state and start listeners.
 */
function main() {
  initBoard();

  loadCanvas();
 
  loadImages();

  board_img.onload=function(){drawBoard(board,-1)};

  loadCanvasListeners();
}

/**
 *  Initialize board state.
 */
function initBoard() {
  board = {
    pieces: "1010101001010101101010100000000000000000020202022020202002020202",
    topx: 0,
    topy: 20,
    width: 9,
    whiteMove: true
  };
}

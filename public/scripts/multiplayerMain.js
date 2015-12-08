/**
 *  multiplayerMain module.
 *  @module multiplayerMain
 */

/**
 *  board global for the game 
 * @global
 * @type string
 */
var board;


/**
 *  main driver for multiplayer
 */
function main() {
  initBoard();
  
  setUsername();

  loadImages();

  loadCanvas();
 
  initSocketio();

  initDatabase();

  //board_img.onload=function(){drawBoard(board,-1)};

  loadCanvasListeners();
}

/**
 *  initilazes the board
 */
function initBoard() {
  board = {
    pieces: "1010101001010101101010100000000000000000020202022020202002020202",
    topx: 0,
    topy: 20,
    width: 9,
    whiteMove: true,
    whitePlayer: { nickname: "a", socketId: -1},
    blackPlayer: { nickname: "b", socketId: -1}
  };
}

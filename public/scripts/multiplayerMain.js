var board;

function main() {
  initDatabase();

  initBoard();

  loadCanvas();
 
  loadImages();

  initSocketio();

  board_img.onload=function(){drawBoard(board,-1)};

  loadCanvasListeners();
}

function initBoard() {
  board = {
    pieces: "1010101001010101101010100000000000000000020202022020202002020202",
    topx: 0,
    topy: 20,
    width: 9,
    whiteMove: true
  };
}

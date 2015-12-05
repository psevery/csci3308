var board_img;
var pieces_img;
var canvas;
var context;
var boardFlipped = false;

/**
 * Initializes global context variable with CanvasRenderingContext2D from document element with id "canvas".
 */
function loadCanvas() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
}

/**
 * Initializes board_img and pieces_img with checkerboard image and checker piece sprite sheet.
 */
function loadImages() {
  board_img = new Image();
  board_img.src = "../images/checkerboard.jpg";
  pieces_img = new Image();
  pieces_img.src = "../images/checker_images.png"; 
  board_img.onload=function(){drawBoard(board,-1)};
}
/**
 * Draws a checker piece to the global canvas context at (x,y).
 * @param {integer} image_id - The integer associated with the piece to be drawn. 1: black, 2: red, 3: black king, 4: red king.
 * @param {float} x - The x coordinate of the top left of the square to draw to.
 * @param {float} y - The y coordinate of the top left of the square to draw to.
 */
function drawPiece(image_id, x, y) {
  // image_id - 1 = convert to 0-based x offset in source image
  // Each sprite is 64 units wide
  // 64 * (image_id - 1) is the x coordinate of the left edge of
  // the desired checker piece sprite.
  context.drawImage(pieces_img, 64 * (image_id - 1), 0, 64, 64, x, y, 64, 64);
}

// Drawing board
function drawBoard(board,mask) {
  context.clearRect(0,0,canvas.width,canvas.height);
  context.drawImage(board_img, 0, 0, 600, 597, board.topx, board.topy, 600, 597);

  if(!boardFlipped){
    // Reads in the string and will draw checkers based
    // on the character at the ith position in the string
    for (i = 0; i < 64; i++) {
      // If the character at position i is 0, it leaves an empty space
      if (board.pieces.charAt(i) != "0" && i != mask) {
        drawPiece(parseInt(board.pieces.charAt(i), 10),
          (64 + board.width) * (i % 8) + board.topx + board.width,
          Math.floor(i / 8) * (64 + board.width) + board.topy + board.width
          );
      }
    }
  }
  else {
    for (i = 0; i < 64 ; i++) {
      if (board.pieces.charAt(63-i) != "0" && i != mask) {
        drawPiece(parseInt(board.pieces.charAt(63-i), 10),
          (64 + board.width) * (i % 8) + board.topx + board.width,
          Math.floor(i / 8) * (64 + board.width) + board.topy + board.width
          );
      }
    }
  }
}

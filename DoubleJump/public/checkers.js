// Doublejump board drawing
// Test script for using canvassing to display board


// Globals
var board_img;
var pieces_img;
var canvas;
var context;
var movestr;
var mouseDown;
var pieceBuffer;
var pieceLocation;

var INIT_BOARD =
  "10101010" +
  "01010101" +
  "10101010" +
  "00000000" +
  "00000000" +
  "02020202" +
  "20202020" +
  "02020202";


// <body onload="start()">
function start() {

  // Init canvas
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  
  // Init sprites
  board_img = new Image();
  board_img.src = "images/checkerboard.jpg";
  pieces_img = new Image();
  pieces_img.src = "images/checker_images.png";

  var board = {
    pieces: INIT_BOARD,
    topx: 0,
    topy: 20,
    width: 9
  };

  // Draw sprites
  drawBoard(board,-1);

  // Init events
  mouseDown = false;
  movestr = "";
  canvas.addEventListener("mousedown",function(evt){mouseStart(evt,board)},false);
  canvas.addEventListener("mouseup",function(evt){mouseEnd(evt,board)},false);
  canvas.addEventListener("mousemove",function(evt){mouseMove(evt,board)},false);
}

// Drawing a checker piece.
// image_id is the integer associated with the checker piece
// 1: black
// 2: red
// 3: black king
// 4: red king
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

	// Reads in the string and will draw checkers based
  // on the character at the ith position in the string
	for (i = 0; i < 64; i++) {

		// If the character at position i is 0, it leaves an empty space
		if (board.pieces.charAt(i) != "0" && i != mask) {
			drawPiece(
          parseInt(board.pieces.charAt(i), 10),
          (64 + board.width) * (i % 8) + board.topx + board.width,
          Math.floor(i / 8) * (64 + board.width) + board.topy + board.width
      );
		}
	}
}

//Takes in the move and applies it to the board
//Move notation is <startsquare><endsquare> where square is 
//<row><column> from the top left corner
//Example: 1134 moves checker from the top left corner to a square
//         3 rows down from the top and 4 squares left
function addMove(board,move) {
  //getting the indexes of the location in the pieces string of the start and 
  //destination squares
  from_index = (parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1;
  to_index = (parseInt(move.charAt(2), 10)-1)*8+parseInt(move.charAt(3))-1;
  //saves the piece type
  piece_type = board.pieces.substr(from_index,1);
  //clears the start spot on the board
  board.pieces = board.pieces.substr(0,from_index) + "0" + board.pieces.substr(from_index+1);
  //fills the desination spot on the board
  board.pieces = board.pieces.substr(0,to_index) + piece_type + board.pieces.substr(to_index+1);
}

function mouseStart(evt,board) {
  mouseDown = true;
  // Builds the first two characters of the piece move using the mouse
  // location relative to the canvas. Accounts for board width.
  movestr = (Math.floor((evt.pageY-canvas.offsetTop-board.topy)/(board.width+64))+1).toString()+(Math.floor((evt.pageX-canvas.offsetLeft-board.topx)/(board.width+64))+1).toString();
  // Saves board location of the piece being selected to mask out that
  // piece while it is being dragged
  pieceLocation = 8*(parseInt(movestr.charAt(0),10)-1)+parseInt(movestr.charAt(1),10)-1;
  pieceBuffer = board.pieces.charAt(pieceLocation);
}

function mouseEnd(evt,board) {
  mouseDown = false;
  movestr = movestr + (Math.floor((evt.pageY-canvas.offsetTop-board.topy)/(board.width+64))+1).toString()+(Math.floor((evt.pageX-canvas.offsetLeft-board.topx)/(board.width+64))+1).toString();
  addMove(board,movestr);
  drawBoard(board,-1);
}

function mouseMove(evt,board) {
  if(mouseDown == false) {
    return;
  }
  drawBoard(board,pieceLocation);
  drawPiece(pieceBuffer,evt.pageX-32,evt.pageY-canvas.offsetTop-32);
}

start();

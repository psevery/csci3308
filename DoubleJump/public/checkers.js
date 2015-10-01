// Doublejump board drawing
// Test script for using canvassing to display board
//window.onload = start;

// Globals
var board_img;
var pieces_img;
var canvas;
var context;

var INIT_BOARD =
  "10101010" +
  "01010101" +
  "10101010" +
  "00000000" +
  "00000000" +
  "02020202" +
  "20202020" +
  "02020202";

var board = {
  pieces: INIT_BOARD,
  topx: 0,
  topy: 20,
  width: 9
};
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
  // Draw sprites
  drawBoard(board);
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
function drawBoard(board) {
	context.drawImage(board_img, 0, 0, 600, 597, board.topx, board.topy, 600, 597);

	// Reads in the string and will draw checkers based
  // on the character at the ith position in the string
	for (i = 0; i < 64; i++) {

		// If the character at position i is 0, it leaves an empty space
		if (board.pieces.charAt(i) != "0") {
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
  console.log("in addmove");
  from_index = (parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1;
  to_index = (parseInt(move.charAt(2), 10)-1)*8+parseInt(move.charAt(3))-1;
  //saves the piece type
  piece_type = board.pieces.substr(from_index,1);
  //clears the start spot on the board
  board.pieces = board.pieces.substr(0,from_index) + "0" + board.pieces.substr(from_index+1);
  //fills the desination spot on the board
  board.pieces = board.pieces.substr(0,to_index) + piece_type + board.pieces.substr(to_index+1);
  drawBoard(board);

}



start();
//has to be after start
canvas.addEventListener("mousedown", getPosition, false);
var themove = "";
function getPosition(event)
{
  //want to find the row collumn pair
  var row;
  var collumn;
  //geting the x and y location of the mouse
  var x = event.x;
  var y = event.y;
  //making x and y relative to the canvas 
  x -= (canvas.offsetLeft);
  y -= (canvas.offsetTop);
  
  //ugly way to get row and collumn, sorry
    if (x < 80){
      collumn = 1;
    }
    else if (x < 152){
      collumn = 2;
    }
    else if (x < 224){
      collumn = 3;
    }
    else if (x < 296){
      collumn = 4;
    }
    else if (x < 370){
      collumn = 5;
    }
    else if (x < 442){
      collumn = 6;
    }
    else if (x < 516){
      collumn = 7;
    }
    else if (x < 610){
      collumn = 8;
    }
  
    if (y < 103){
      row = 1;
    }
    else if (y < 174){
      row = 2;
    }
    else if (y < 249){
      row = 3;
    }
    else if (y < 320){
      row = 4;
    }
    else if (y< 391){
      row = 5;
    }
    else if (y < 467){
      row = 6;
    }
    else if (y < 538){
      row = 7;
    }
    else if (y < 610){
      row = 8;
    }
    themove = themove+row+collumn;
    if (themove.length == 4){
      console.log(themove);
      addMove(board,themove);
      themove = "";
      console.log(themove);
    }
    
  
}





//Doublejump board drawing
//Test script for using canvassing to display board

//initializing everything, images and canvas
//setting up canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//loading images
var checkerboard = new Image();
checkerboard.src = "images/checkerboard.jpg";
var checker = new Image();
checker.src = "images/checker_images.png";

//draw function draws the board and pieces
function draw() {
	//board information 
	var board = {pieces:"1010101001010101101010100000000000000000020202022020202002020202", topx:0, topy:20, width:9};

	//drawing the board
	drawBoard(board);
}

//drawing a checker. Image=1 draws black checker 2 draws a red checker 3 draws a black king 4 draws a red king
function drawChecker(image,x,y) {
	context.drawImage(checker,64*(image-1),0,64,64,x,y,64,64);
}

//drawing board
function drawBoard(_board) {
	context.drawImage(checkerboard,0,0,600,597,_board.topx,_board.topy,600,597);
	//reads in the string and will draw checkers based on the character at the ith position in the string
	for(i=0;i<64;i++) {
		//if the character at position i is 0, it leaves an empty space
		if(_board.pieces.charAt(i)!="0"){
			drawChecker(parseInt(_board.pieces.charAt(i),10),(64+_board.width)*(i%8)+_board.topx+_board.width,Math.floor(i/8)*(64+_board.width)+_board.topy+_board.width);
		}
	}
}

//calling draw
draw();

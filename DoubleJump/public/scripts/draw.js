var board_img;
var pieces_img;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function loadImages() {
  board_img.src = "../images/checkerboard.jpg";
  pieces_img.src = "../images/checker_images.png";
}

function drawBoard(board) {
  context.clearRect(0,0,canvas.width,canvas.height);
  // The board is scalable based on the width and height of the canvas
  //context.drawImage(board_img, 0, 0, 588, 590, canvas.width/588*20, canvas.height/590*20, canvas.width, canvas.height);
  context.drawImage(board_img, 0, 0, canvas.width, canvas.height);
  // Loops through the board matrix and for each nonzer entry places a piece on the board
  for(i=0; i<8; i++) {
    for(j=0; j<8; j++) {
      if(board.matrix[i][j]!=0) {
        // 64*(board[i][j]-1) specifies the x location in the pieces image from which to start drawing
        // ((board.width-(9/600)*board.width)/8)*j+(9/600)*canvas.width) takes into account the width of the spaces between
        // the squares on the board: (9/600)*board.width while dividing by 8 gives the space inbetween where the pieces
        // should be drawn (8 squares on a row/column). An additional space is added to shift the starting location off of
        // one of the board's grey spaces.
        context.drawImage(pieces_img, 64 * (board.matrix[i][j] - 1), 0, 64, 64, 
          ((canvas.width-(9/588)*canvas.width)/8)*j+(9/588)*canvas.width, 
          ((canvas.height-(9/590)*canvas.height)/8)*i+(9/590)*canvas.height, 
          64*canvas.width/588, 64*canvas.height/590);
      }
    }
  }
}

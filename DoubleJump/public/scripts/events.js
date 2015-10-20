var movestr;
var mouseDown;
var pieceBuffer;
var pieceLocation;
mouseDown = false;
movestr = "";

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
  // Makes sure that the mouse was down when mouseup was given.
  if(mouseDown == false) {
    return;
  }
  mouseDown = false;
  movestr = movestr + (Math.floor((evt.pageY-canvas.offsetTop-board.topy)/(board.width+64))+1).toString()+(Math.floor((evt.pageX-canvas.offsetLeft-board.topx)/(board.width+64))+1).toString();
  addMove(board,movestr);
  drawBoard(board,-1);
}

function mouseMove(evt,board) {
  if(mouseDown == false) {
    return;
  }

  // Mask used with drwaboard for piece dragging
  drawBoard(board,pieceLocation);
  drawPiece(pieceBuffer,evt.pageX-32,evt.pageY-canvas.offsetTop-32);
}

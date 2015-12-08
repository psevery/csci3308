/**
 *  Module for mouse events.
 *  @module events
 */

/**
 *  Variable for representing player moves.
 *  @type string
 */
var movestr;

/**
 *  Flag representing when the mouse is being held.
 *  @type boolean
 */
var mouseDown;

/**
 *  Buffer for holding piece state temporarily.
 *  @type string
 */
var pieceBuffer;

/**
 *  Variable for holding location of piece being moved.
 *  @type integer
 */
var pieceLocation;

mouseDown = false;
movestr = "";

/**
 *  Register all event listeners, allowing game to begin.
 */
function loadCanvasListeners() {
  canvas.addEventListener("mousedown",function(evt){mouseStart(evt,board)},false);
  canvas.addEventListener("mouseup",function(evt){mouseEnd(evt,board)},false);
  canvas.addEventListener("mousemove",function(evt){mouseMove(evt,board)},false);  
}

/**
 *  
 */
function mouseStart(evt,board) {
  mouseDown = true;
 
  // Builds the first two characters of the piece move using the mouse
  // location relative to the canvas. Accounts for board width.
  movestr = (Math.floor((evt.pageY-canvas.offsetTop-board.topy)/(board.width+64))+1).toString()+(Math.floor((evt.pageX-canvas.offsetLeft-board.topx)/(board.width+64))+1).toString();
  
  // Saves board location of the piece being selected to mask out that
  // piece while it is being dragged
  pieceLocation = 8*(parseInt(movestr.charAt(0),10)-1)+parseInt(movestr.charAt(1),10)-1;
  if(!boardFlipped){
    pieceBuffer = board.pieces.charAt(pieceLocation);
  }
  else {
    pieceBuffer = board.pieces.charAt(63-pieceLocation);
  }
}

function mouseEnd(evt,board) {
  // Makes sure that the mouse was down when mouseup was given.
  if(mouseDown == false) {
    return;
  }
  mouseDown = false;
  movestr = movestr + (Math.floor((evt.pageY-canvas.offsetTop-board.topy)/(board.width+64))+1).toString()+(Math.floor((evt.pageX-canvas.offsetLeft-board.topx)/(board.width+64))+1).toString();
  if(!boardFlipped){
    addMove(movestr);
  }
  else {
    addMove(((9-parseInt(movestr.charAt(0),10))%9).toString()+((9-parseInt(movestr.charAt(1),10))%9).toString()+((9-parseInt(movestr.charAt(2),10))%9).toString()+((9-parseInt(movestr.charAt(3),10))%9).toString())
  }
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

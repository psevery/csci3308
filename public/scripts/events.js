/**
 *  Module for mouse events.
 *  @module events
 */

/**
 * Stores user provided moves.
 * @type {string}
 */
var movestr;

/**
 * Determines if the left mouse button is being held down.
 * @type {boolean}
 */
var mouseDown;

/**
 * Holds type of piece currently being selected.
 * @type {string}
 */
var pieceBuffer;

/**
 * Saves the starting location of the piece as it is being dragged.
 * @type {string}
 */
var pieceLocation;

mouseDown = false;
movestr = "";

/**
 * Loads listeners on the canvas element to check for mouse events.
 */
function loadCanvasListeners() {
  canvas.addEventListener("mousedown",function(evt){mouseStart(evt,board)},false);
  canvas.addEventListener("mouseup",function(evt){mouseEnd(evt,board)},false);
  canvas.addEventListener("mousemove",function(evt){mouseMove(evt,board)},false);  
}

/**
 *  
 * Records the coordinates of where the piece is on a left mouse click.
 * @param {object} evt - Event object containing data captured by the listener.
 * @param {object} board - Board object containing the current status of the board.
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

/**
 * Records the coordinates of where the piece was placed on release of the left mouse button.
 * @param {object} evt - Event object containing data captured by the listener.
 * @param {object} board - Board object containing the current status of the board.
 */
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

/**
 * Draws the current location of the selected piece while the left mouse button is held down.
 * @param {object} evt - Event object containing data captured by the listener.
 * @param {object} board - Board object containing the current status of the board.
 */
function mouseMove(evt,board) {
  if(mouseDown == false) {
    return;
  }

  // Mask used with drwaboard for piece dragging
  drawBoard(board,pieceLocation);
  drawPiece(pieceBuffer,evt.pageX-32,evt.pageY-canvas.offsetTop-32);
}

/**
 * Clears the pieces of the calling user from the board to forfeit the game.
 * @param {object} board - Board object containing the current status of the board.
 */ 
function surrender(board) {
  if(board.blackPlayer.nickname == username) {
    board.pieces = board.pieces.replace(/1|3/g, "0");
  } else {
    board.pieces = board.pieces.replace(/2|4/g, "0");
  }
  socket.emit('move',board);
}

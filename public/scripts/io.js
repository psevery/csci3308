/**
 *  Socket IO and networking module.
 *  @module io
 */

/**
 *  Variable for socket.io context object.
 */
var socket;

/**
 *  Variable used to store previous jump in multi-jump sequence.
 *  @type {string}
 */
var doubleJump = "--";

/**
 *  Initializes client socket.io context, communicates with server to receive a new game.
 */
function initSocketio(){
  socket = io();
//  socket.emit('getBoard',' ');
  socket.on('board',function(newBoard){
    board = newBoard;
    changeMoveIndicator();
    drawBoard(board,-1);
    if(board.pieces.match(/1|3/) == null) {
      if(board.blackPlayer.nickname == username) {
        window.alert("Sorry, you have lost.");
      } else {
        window.alert("Yay! You are a Winner!");
      }
    } else if(board.pieces.match(/2|4/) == null) {
      if(board.blackPlayer.nickname == username) {
        window.alert("Yay! You are a Winner!");
      } else {
        window.alert("Sorry, you have lost.");
      }
    }
  });
  socket.on('registered',function(newBoard){
    board = newBoard;
    setOpponentName(board.blackPlayer.nickname); 
    if(board.blackPlayer.nickname == username){
      setOpponentName(board.whitePlayer.nickname); 
      boardFlipped = true;
    }
    else {
      setOpponentName(board.blackPlayer.nickname); 
    }
    drawBoard(board,-1);
  });
  socket.emit('register',board);
}

/**
 *  Alternates colored square next to board which indicates whose turn it is.
 */
function changeMoveIndicator() {
  if(board.whiteMove){
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:red;float:left");
  }
  else {
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:black;float:left");
  }
}

/**
 *  If a valid move, changes game state and emits new game state to server. Otherwise, return.
 *  @param {string} move - A 4-character string of the form "abcd", where c,d = row,col of square to move piece at a,b = row,col to.
 */
function addMove(move){
  if(!isValid(move)){
    return;
  }
  from_index = (parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1;
  to_index = (parseInt(move.charAt(2), 10)-1)*8+parseInt(move.charAt(3))-1;
  piece_type = board.pieces.substr(from_index,1);
  board.pieces = board.pieces.substr(0,from_index) + "0" + board.pieces.substr(from_index+1);
  board.pieces = board.pieces.substr(0,to_index) + piece_type + board.pieces.substr(to_index+1);
  board.whiteMove = !board.whiteMove;
  changeMoveIndicator();
  socket.emit('move',board);
}

/**
 *  Determines if a move is valid, given the current board and turn state.
 *  @param {string} move - A 4-character string of the form "abcd", where c,d = row,col of square to move piece at a,b = row,col to.
 *  @returns {boolean} Move is valid.
 */
function isValid(move){
  if(username==board.whitePlayer.nickname && !board.whiteMove){
    return false;
  }
  if(username==board.blackPlayer.nickname && board.whiteMove){
    return false;
  }
  var pieceType = parseInt(board.pieces.charAt((parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1),10);
  var fromRow = parseInt(move.charAt(0),10);
  var fromCol = parseInt(move.charAt(1),10);
  var toRow = parseInt(move.charAt(2),10);
  var toCol = parseInt(move.charAt(3),10);
  if(doubleJump != "--") {
    if(move.substr(0,2)!=doubleJump){
      return false;
    }
    if(Math.abs(toCol-fromCol)!=2 || Math.abs(toRow-fromRow)!=2){
      return false;
    }
  }
  else if((pieceType==2 && fromRow<=toRow) || (pieceType==1 && fromRow>=toRow)) {
    return false;
  }
  if((pieceType%2==1 && board.whiteMove) || (pieceType%2==0 && !board.whiteMove) || (move.substr(0,2)==move.substr(2,4))) {
    return false;
  }
  if(fromCol == toCol){
    return false;
  }
  if(Math.abs(fromCol-toCol)>2){
    return false;
  }
  if(pieceAt(toRow,toCol)!=0){
    return false;
  }
  if(Math.abs(fromCol-toCol)==2 && pieceAt((toRow-fromRow)/2+fromRow,(toCol-fromCol)/2+fromCol)==0){
    return false;
  }
  if(Math.abs(fromCol-toCol)==2 && pieceAt((toRow-fromRow)/2+fromRow,(toCol-fromCol)/2+fromCol)%2==pieceAt(fromRow,fromCol)%2){
    return false;
  }
  if(Math.abs(toCol-fromCol)!=Math.abs(toRow-fromRow)){
    return false;
  }
  if(Math.abs(fromCol-toCol)==2 && pieceAt((toRow-fromRow)/2+fromRow,(toCol-fromCol)/2+fromCol)!=0){
    var from_index = ((toRow-fromRow)/2+fromRow-1)*8+(toCol-fromCol)/2+fromCol-1;
    board.pieces = board.pieces.substr(0,from_index) + "0" + board.pieces.substr(from_index+1);
    if(isDoubleJumpAvailable(move,pieceType)){
      doubleJump = move.substr(2,4);
      board.whiteMove = !board.whiteMove;
    }
    else {
      doubleJump = "--";
    }
  }
  if(pieceType==2 && toRow==1){
    var from_index = (fromRow-1)*8+fromCol-1;
    board.pieces = board.pieces.substr(0,from_index) + "4" + board.pieces.substr(from_index+1);
  }
  else if(pieceType==1 && toRow==8){
    var from_index = (fromRow-1)*8+fromCol-1;
    board.pieces = board.pieces.substr(0,from_index) + "3" + board.pieces.substr(from_index+1);
  }
  return true;
}

/**
 *  Returns integer at row, col of the game board.
 *  @param {integer} row - Row of game board.
 *  @param {integer} col - Column of game board.
 *  @returns {integer} Integer at row, col of game board.
 */
function pieceAt(row, col) {
  if(row>8 || row <1 || col <1 || col>8) {
    return -1;
  }
  return parseInt(board.pieces.charAt((row-1)*8+(col-1)),10);
}


/**
 *  Returns boolean representing whether there are any double jumps available.
 *  @param {string} move - A 4-character string of the form "abcd", where c,d = row,col of square to move piece at a,b = row,col to.
 *  @param {integer} pieceType - The integer corresponding to the piece being examined.
 *  @returns {boolean} Double Jump is possible from the given move and piece.
 */
function isDoubleJumpAvailable(move,pieceType) {
  var startRow = parseInt(move.charAt(2),10);
  var startCol = parseInt(move.charAt(3),10);
  if(pieceAt(startRow+1,startCol+1)!=0 && pieceAt(startRow+1,startCol+1)%2!=pieceType%2 && pieceAt(startRow+1,startCol+1)!=(pieceType-2) && pieceAt(startRow+2,startCol+2)==0){
    return true;
  }
  if(pieceAt(startRow+1,startCol-1)!=0 && pieceAt(startRow+1,startCol-1)%2!=pieceType%2 && pieceAt(startRow+1,startCol-1)!=(pieceType-2) && pieceAt(startRow+2,startCol-2)==0){
    return true;
  }
  if(pieceAt(startRow-1,startCol+1)!=0 && pieceAt(startRow-1,startCol+1)%2!=pieceType%2 && pieceAt(startRow-1,startCol+1)!=(pieceType-2) && pieceAt(startRow-2,startCol+2)==0){
    return true;
  }
  if(pieceAt(startRow-1,startCol-1)!=0 && pieceAt(startRow-1,startCol-1)%2!=pieceType%2 && pieceAt(startRow-1,startCol-1)!=(pieceType-2) && pieceAt(startRow-2,startCol-2)==0){
    return true;
  }
  return false;
}

var socket;

function initSocketio(){
  socket = io();
  socket.emit('getBoard',' ');
  socket.on('board',function(newBoard){
    board = newBoard;
    changeMoveIndicator();
    drawBoard(board,-1);
  });
}

function refreshBoard() {
  socket.emit('refresh','refresh');
}

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

function isValid(move){
  var pieceType = parseInt(board.pieces.charAt((parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1),10)%2;
  // Move color test
  if((pieceType==1 && board.whiteMove) || (pieceType==0 && !board.whiteMove) || (move.substr(0,2)==move.substr(2,4))) {
    return false;
  }
  // Move direction test
  if((pieceType==0 && move.substr(0,1)<move.substr(2,3)) || (pieceType==1 && move.substr(0,1)>move.substr(2,3))) {
    return false;
  }
  return true;
}

function changeMoveIndicator(){
  if(board.whiteMove){
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:red;float:left");
  }
  else {
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:black;float:left");
  }
}

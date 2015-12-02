var doubleJump = "--";

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
  if(board.whiteMove){
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:red");
  }
  else {
    document.getElementById("moveIndicator").setAttribute("style","width:50px;height:50px;background-color:black");
  }
}

function isValid(move){
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

function pieceAt(row, col) {
  if(row>8 || row <1 || col <1 || col>8) {
    return -1;
  }
  return parseInt(board.pieces.charAt((row-1)*8+(col-1)),10);
}

function isDoubleJumpAvailable(move,pieceType) {
  var startRow = parseInt(move.charAt(2),10);
  var startCol = parseInt(move.charAt(3),10);
  if(pieceAt(startRow+1,startCol+1)!=0 && pieceAt(startRow+1,startCol+1)!=pieceType && pieceAt(startRow+2,startCol+2)==0){
    return true;
  }
  if(pieceAt(startRow+1,startCol-1)!=0 && pieceAt(startRow+1,startCol-1)!=pieceType && pieceAt(startRow+2,startCol-2)==0){
    return true;
  }
  if(pieceAt(startRow-1,startCol+1)!=0 && pieceAt(startRow-1,startCol+1)!=pieceType && pieceAt(startRow-2,startCol+2)==0){
    return true;
  }
  if(pieceAt(startRow-1,startCol-1)!=0 && pieceAt(startRow-1,startCol-1)!=pieceType && pieceAt(startRow-2,startCol-2)==0){
    return true;
  }
  return false;
}

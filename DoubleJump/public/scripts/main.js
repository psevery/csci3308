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

function start() {

  // Init canvas
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  
  // Init sprites
  board_img = new Image();
  board_img.src = "../images/checkerboard.jpg";
  pieces_img = new Image();
  pieces_img.src = "../images/checker_images.png";

  var board = {
    pieces: INIT_BOARD,
    topx: 0,
    topy: 20,
    width: 9
  };
  socket.emit('getBoard','current');
  socket.on('board',function(newboard){
    board.pieces = newboard;
    drawBoard(board,-1);
  });

  canvas.addEventListener("mousedown",function(evt){mouseStart(evt,board)},false);
  canvas.addEventListener("mouseup",function(evt){mouseEnd(evt,board)},false);
  canvas.addEventListener("mousemove",function(evt){mouseMove(evt,board)},false);
  board_img.onload=function(){pieces_img.onload=function(){drawBoard(board,-1)}};
}

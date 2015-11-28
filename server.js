// Parts of code from http://socket.io/docs/
// instructions on .use(express.static()) at:
// http://expressjs.com/starter/static-files.html

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.set('port', 3000);
app.set('ip', "127.0.0.1");

server.listen(app.get('port'),app.get('ip')); 

app.use(express.static('public'));

var board = {
  pieces: "1010101001010101101010100000000000000000020202022020202002020202",
  topx: 0,
  topy: 20,
  width: 9,
  whiteMove: true
};

io.on('connection',function(socket) {
  console.log('connection');
  socket.on('move', function(newBoard){
    board = newBoard;
    io.emit('board',board);
  });
  socket.on('getBoard',function(state){
    io.emit('board',board);
  });
  socket.on('refresh',function(refresh){
    console.log('refresh');
    board.pieces = "1010101001010101101010100000000000000000020202022020202002020202";
    board.whiteMove = true;
    io.emit('board',board);
  });
});

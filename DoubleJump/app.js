// Parts of code from http://socket.io/docs/
// instructions on .use(express.static()) at:
// http://expressjs.com/starter/static-files.html
// merged with app.js code from Patrick

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function(){
  console.log('listening on port 3000');
});

app.use(express.static('public'));
//app.get('/', function(req,res){
//  res.sendFile(__dirname + '/public');
//});

var board = "1010101001010101101010100000000000000000020202022020202002020202";

io.on('connection',function(socket) {
  console.log('connection');
  socket.broadcast.emit('board',board);
  socket.on('move', function(move){
    console.log(move);
    addMove(move);
    io.emit('board',board);
  });
});

function addMove(move){
  from_index = (parseInt(move.charAt(0), 10)-1)*8+parseInt(move.charAt(1))-1;
  to_index = (parseInt(move.charAt(2), 10)-1)*8+parseInt(move.charAt(3))-1;
  piece_type = board.substr(from_index,1);
  board = board.substr(0,from_index) + "0" + board.substr(from_index+1);
  board = board.substr(0,to_index) + piece_type + board.substr(to_index+1);
}

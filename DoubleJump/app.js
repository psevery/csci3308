// Parts of code from http://socket.io/docs/
// instructions on .use(express.static()) at:
// http://expressjs.com/starter/static-files.html
// merged with app.js code from Patrick

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function(){
  console.log('listening on port 80');
});

app.use(express.static('public'));
//app.get('/', function(req,res){
//  res.sendFile(__dirname + '/public');
//});

io.on('connection',function(socket) {
  console.log('connection');
  socket.on('move', function(move){
    console.log(move);
  });
});

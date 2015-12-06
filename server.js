// Parts of code from http://socket.io/docs/
// instructions on .use(express.static()) at:
// http://expressjs.com/starter/static-files.html

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongourl = 'mongodb://localhost:27017/test';

var gameSearch = false;
var boardBuffer;
//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.set('port', 3000);
app.set('ip', "127.0.0.1");

server.listen(app.get('port'),app.get('ip')); 

app.use(express.static('public'));

//var startBoard = {
//  pieces: "1010101001010101101010100000000000000000020202022020202002020202",
//  topx: 0,
//  topy: 20,
//  width: 9,
//  whiteMove: true
//};

//var board = startBoard;

io.on('connection',function(socket) {
  console.log('connection');
  socket.on('move', function(board){
    io.to(board.whitePlayer.socketId).emit('board',board);
    io.to(board.blackPlayer.socketId).emit('board',board);
  });
  socket.on('register', function(board){
    if(!gameSearch){
      board.whitePlayer.socketId = socket.id;
      boardBuffer = board;
      gameSearch = true;
    }
    else {
      board.blackPlayer.socketId = socket.id;
      board.whitePlayer.socketId = boardBuffer.whitePlayer.socketId;
      board.blackPlayer.nickname = board.whitePlayer.nickname;
      board.whitePlayer.nickname = boardBuffer.whitePlayer.nickname;
      board.whitePlayer.socketid = boardBuffer.whitePlayer.socketid;
      gameSearch = false;
      io.to(board.whitePlayer.socketId).emit('registered',board);
      io.to(board.blackPlayer.socketId).emit('registered',board);
      console.log("match found: "+board.whitePlayer.nickname+" "+board.blackPlayer.nickname);
    }
  });
  socket.on('login', function(username) {
    MongoClient.connect(mongourl, function(err, db) {
      assert.equal(null, err);
      login(db, username, socket.id, function() { db.close();});
    });
  });

//  socket.on('getBoard',function(state){
//    io.emit('board',board);
//  });
//  socket.on('refresh',function(refresh){
//    console.log('refresh');
//    board = startBoard;
//    io.emit('board',board);
//  });
});

function login(db, username, socketId, callback) {
  var newuser = true;
  var cursor = db.collection('users').find( { "name": username } );
  cursor.toArray(function(err, result) {
    assert.equal(err, null);
    if(result.length > 0) {
      db.collection('users').updateOne( { "name": username }, { $inc: { "stats.logins": 1 } } );
    } else {
      var newdoc = {
        "name" : username,
        "stats": {
          "logins": 0,
          "wins" : 0,
          "losses": 0
        }
      };
      db.collection('users').insertOne(newdoc);
      db.collection('users').updateOne( { "name": username }, { $inc: { "stats.logins": 1 } } );
      result[0] = newdoc;
    }
    io.to(socketId).emit('stats', result[0]);
    console.log(result[0]);
  });
};

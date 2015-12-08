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

// For local hosting uncomment the code in this section:
// =====================================================
//var mongourl = 'mongodb://localhost:27017/test';
//app.set('port', 3000);
//app.set('ip', "127.0.0.1");
// =====================================================

// connectionstring example from openshift mongodb https://blog.openshift.com/getting-started-with-mongodb-on-nodejs-on-openshift/

// For openshift uncomment the code in this section:
// =================================================
//var connection_string = '127.0.0.1:27017/doublejump';
//if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
//  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//  process.env.OPENSHIFT_APP_NAME;
//}
//var mongourl = "mongodb://"+connection_string;
//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
// =================================================

var gameSearch = false;
var boardBuffer;

server.listen(app.get('port'),app.get('ip')); 

app.use(express.static('public'));

io.on('connection',function(socket) {
  console.log('connection');
  socket.on('move', function(board){
    if(board.pieces.match(/1|3/) == null) {
      MongoClient.connect(mongourl, function(err, db) {
        assert.equal(null, err);
        winner(db, 2, board.blackPlayer.nickname, board.whitePlayer.nickname, function() { db.close(); });
      });
    } else if(board.pieces.match(/2|4/) == null){
      MongoClient.connect(mongourl, function(err, db) {
        assert.equal(null, err);
        winner(db, 1, board.blackPlayer.nickname, board.whitePlayer.nickname, function() { db.close(); });
      });
    }
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
});

function login(db, username, socketId, callback) {
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
  });
};

function winner(db, winnerid, blackusername, redusername, callback) {
  if(winnerid == 1) {
    console.log("Black Wins!");
    db.collection('users').updateOne( { "name": blackusername }, { $inc: { "stats.wins": 1 } } );
    db.collection('users').updateOne( { "name": redusername }, { $inc: { "stats.losses": 1 } } );
  } else {
    console.log("Red Wins!");
    db.collection('users').updateOne( { "name": blackusername }, { $inc: { "stats.losses": 1 } } );
    db.collection('users').updateOne( { "name": redusername }, { $inc: { "stats.wins": 1 } } );
  } 
};

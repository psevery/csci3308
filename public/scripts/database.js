var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var username;
var opponentName;

function initDatabase(){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
  });

  username = window.prompt("Nickname","");
  var name = document.getElementById("user2");
  name.innerHTML = username;
  board.whitePlayer.nickname = username;
}

function setOpponentName(name){
  opponentName = name;
  var name = document.getElementById("user1");
  name.innerHTML = opponentName;
}

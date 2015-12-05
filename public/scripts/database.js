var username;
var opponentName;

function initDatabase(){
  username = window.prompt("Nickname","");
  var name = document.getElementById("user2");
  name.innerHTML = username;
  board.whitePlayer.nickname = username;
  socket.emit('login', username);
}

function setOpponentName(name){
  opponentName = name;
  var name = document.getElementById("user1");
  name.innerHTML = opponentName;
}

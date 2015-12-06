function initDatabase(){
  socket.emit('login', username);
  socket.on('stats',function(user){
    var stats = document.getElementById("stats");
    stats.innerHTML = "Personal Stats:<br>Times Logged In: "+user.stats.logins.toString()
      +"<br>Wins: "+user.stats.wins.toString()+"<br>Losses: "+user.stats.losses.toString();
  });
}

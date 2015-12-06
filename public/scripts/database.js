function initDatabase(){
  socket.emit('login', username);
  socket.on('stats',function(user){
    var timesLoggedIn = document.getElementById("timesLoggedIn");
    timesLoggedIn.innerHTML = "Times Logged In: "+user.stats.logins.toString();
  });
}

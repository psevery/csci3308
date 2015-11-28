var username;

function initDatabase(){
  username = window.prompt("Nickname","");
  var name = document.getElementById("user2");
  name.innerHTML = username;
}

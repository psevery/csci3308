/**
 *  userNames module.
 *  @module usernames
 */

 /**
 * username global 
 * @global
 * @type string
 */
var username;

 /**
 * oppenent username
 * @global
 * @type string
 */
var opponentName;

/**
 * set the player's username
 */
function setUsername(){
  username = window.prompt("Nickname","");
  var name = document.getElementById("user2");
  name.innerHTML = username;
  board.whitePlayer.nickname = username;
}


/**
 *  set oppenent's username
 * @param {string} name
 */
function setOpponentName(name){
  opponentName = name;
  var name = document.getElementById("user1");
  name.innerHTML = opponentName;
}

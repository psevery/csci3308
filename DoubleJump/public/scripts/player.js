// Player object type
// Ex.
//  var player1 = new Player(1);
//  console.log("Player 1 id: " + player1.id);
var Player = function(id) {
    this.id = id;
}

Player.new = function(id) {
    return new Player(id);
}

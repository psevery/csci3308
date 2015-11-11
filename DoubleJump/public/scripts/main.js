// To test the game, change the list of moves, or write
// a function that runs a test and uses an assertion/etc
function main() {
    loadCanvas();
    var game = Game.new();
    game.start();
}

window.onload = main;

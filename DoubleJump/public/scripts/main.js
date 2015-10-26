// To test the game, change the list of moves, or write
// a function that runs a test and uses an assertion/etc
function main() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var game = new Game(canvas, context);
    loadImages();
    game.run();
}

window.onload = main;

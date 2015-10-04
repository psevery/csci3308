function main() {
  var game = {
    canvas:  document.getElementById(Config.canvas.id),
    context: canvas.getContext('2d'),
    board: new Board(Config.Board.matrix),
    srcSquare: null,
    currentPlayer: 1,
    move: null,
  };

  game.nextTurn = function () {
    game.currentPlayer = game.currentPlayer == 1 ? 2 : 1;
  };

  var mouseDownHandler = function (e) {
    var x = e.clientX - game.canvas.offsetLeft;
    var y = e.clientY;
    var square = (new Click(x, y)).toSquare(game.board);
    if (square) {
      if (game.srcSquare == null && square.owner() == game.currentPlayer) {
        square.highlight(game.board);
        game.srcSquare = square;
      }
      else if (game.srcSquare) {
        var src = game.srcSquare;
        var dst = square;
        if (dst.isEmpty()) {
          src.unhighlight(game.board);
          game.move = new Move(src, dst);
          game.srcSquare = null;
        } else if (dst.owner() == game.currentPlayer) {
          src.unhighlight(game.board);
          game.srcSquare = dst;
          game.srcSquare.highlight(game.board);
        } else {
          src.unhighlight(game.board);
          game.srcSquare = null;
        }
      }
    }
  };
  document.addEventListener("mousedown", mouseDownHandler, false);

  function loop() {
    if (game.move != null) {
      if (game.move.isValidNotHop(game.board)) {
        game.board.move(game.move);
        game.nextTurn();
      } else if (game.move.isValidHop(game.board)) {
        game.board.hop(game.move);
        game.nextTurn();
      }
      game.move = null;
    }
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.board.draw(game.context);
    window.requestAnimationFrame(loop);
  }

  loop();
}

window.onload = main;

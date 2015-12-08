/**
 * Test module.
 * @module tests
 */

/**
 *  Initializes barebones game state for testing.
 */
function initTestGame() {
  initBoard();
}

/**
 *  QUnit test driver (registerer).
 */
function tests() {
  QUnit.test("Red moves first", function(assert) {
    initTestGame();
    assert.equal(board.whiteMove, true, "board.whiteMove == true");
  });

  QUnit.test("Pieces only allowed to move one square diagonally", function(assert) {
    initTestGame();
    var validMoves = ["6251", "6253"];
    validMoves.forEach(function(move) {
      assert.equal(isValid(move), true,
                   "Move red " + move[0] + "," + move[1]
                   + " to " + move[2] + "," + move[3] + " is valid");
    });
    for (var i = 1; i < 9; ++i) {
      for (var j = 1; j < 9; ++j) {
        var invalidMove = "62" + i + j;
        if (validMoves.indexOf(invalidMove) != -1)
          continue;
        assert.equal(isValid(invalidMove), false,
                     "Move red 6,2 to " + i + "," + j + " is invalid");
      }
    }
  });

  QUnit.test("Red can single hop black", function(assert) {
    initTestGame();
    board.pieces = "1010101001010101101010000000010000002000020002022020202002020202";
    var singleHop = "5537";
    assert.equal(isValid(singleHop), true,
                 "Red at 5,5 hops black at 6,4, final red position 3,7");
  });
}

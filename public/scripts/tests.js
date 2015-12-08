/**
 * Test module.
 * @module tests
 */

/**
 *  Initializes barebones game state for testing.
 */
function initTestGame() {
  initBoard();
  doubleJump = "--";
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

  QUnit.test("Red can double hop black", function(assert) {
    initTestGame();
    board.pieces = "1010101001010100101010100200000000001000020202022000202002020202";
    var firstHop = "6446";
    assert.equal(isValid(firstHop), true,
                 "Red at 6,4 hops black at 5,5, final red position 4,6");
    board.whiteMove = true;
    assert.equal(doubleJump, "46", "doubleJump should be 46 in between hops");
    board.pieces = "1010101001010100101010100200020000000000020002022000202002020202";
    var secondHop = "4628";
    assert.equal(isValid(secondHop), true,
                 "Red at 4,6 hops black at 3,7, final red position 2,8");
  });
}

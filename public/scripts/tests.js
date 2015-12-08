/**
 * Test module.
 * @module tests
 */

function initTestGame() {
  initBoard();
}

function tests() {
  QUnit.test("First Move Is Red", function(assert) {
    initTestGame();
    assert.equal(board.whiteMove, true, "board.whiteMove == true");
  });
}

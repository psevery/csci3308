var player = {
  turn: 1,
  1: {
    score: 0,
    numbers: [1, 3],
  },
  2: {
    score: 0,
    numbers: [2, 4],
  },
};
player.current = function () {
  return player[player.turn];
};
player.nextTurn = function () {
  player.turn = player.turn == 1 ? 2 : 1;
};
player.numbers = function() {
  return player.current().numbers;
}

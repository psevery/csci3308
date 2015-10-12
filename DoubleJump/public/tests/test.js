var tests = {
    move_piece: function() {
        var game = new Game();
        game.run_move_list([
            [[2, 0], [3, 1]]
        ]);
        if (game.board[3][1] != 1) {
            console.error("ERROR, piece unsuccessfully moved\n");
        }
        if (game.board[2][0] != 0) {
            console.error("ERROR, src square was not cleared after move\n");
        }
    },
};

function run_tests() {
    for (var test in tests) {
        tests[test]();
    }
}

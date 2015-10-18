function assert(condition) {
    if (!condition) {
        console.error("ASSERTION FAILED");
    }
}

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
    simple_move: function() {
        /*
         Player 1's turn, select 2,2 as src,
         only valid dst's are 3,3 and 3,1
         all other attempted moves should return failure
            1 0 1 0 1 0 1 0
            0 1 0 1 0 1 0 1
            1 0 # 0 1 0 1 0
            0 0 0 0 0 0 0 0
            0 0 0 0 0 0 0 0
            0 2 0 2 0 2 0 2
            2 0 2 0 2 0 2 0
            0 2 0 2 0 2 0 2
        */
        var game = new Game();

        // Only 2 valid simple moves from 2,2 when player 1 = turn
        assert(game.valid_move([2,2], [3,3]));
        assert(game.valid_move([2,2], [3,1]));

        // Some random, invalid moves
        assert(!game.valid_move([2,2], [3,0]));
        assert(!game.valid_move([2,2], [0,0]));
        assert(!game.valid_move([2,2], [1,1]));
        assert(!game.valid_move([2,2], [1,3]));
        assert(!game.valid_move([2,2], [2,3]));
    },
};

// Iterates through "tests" dictionary, executes
// each element (i.e., this function executes
// all the tests in the dictionary)
function run_tests() {
    for (var test in tests) {
        tests[test]();
    }
}

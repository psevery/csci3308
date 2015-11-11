function assert(condition, desc) {
    if (!condition) {
        console.error("ASSERTION FAILED: " + desc);
    }
    else {
        console.log("ASSERTION PASSED: " + desc);
    }
}

function run_test_game(movelist, init_board) {
    var game = Game.new(init_board);
    game.loop_manual(movelist);
    return game;
}

var tests = {
    simple_move: function() {
        // Only 2 valid simple moves from 2,2 when player 1 = turn
        var final = run_test_game([ [[2,2],[3,3]] ]);
        assert(final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])), "simple_move: 2,2 to 3,3 is valid");
        var final = run_test_game([ [[2,2],[3,1]] ]);
        assert(final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])), "simple_move: 2,2 to 3,1 is valid");
        // Try all other squares, assert no change in state
        for (var i = 0; i < BOARD_ROWS; ++i) {
            for (var j = 0; j < BOARD_COLS; ++j) {
                if (i == 3 && (j == 1 || j == 3))
                    continue;
                var final = run_test_game([ [[2,2],[i,j]] ]);
                assert(final.board.equals(Board.new([
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                    [2, 0, 2, 0, 2, 0, 2, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                ])), "simple_move: 2,2 to " + i + "," + j + " is invalid");
            }
        }
    },
    next_turn: function() {
        var final = run_test_game([
            [[2,2],[3,1]],
            [[5,1],[4,2]],
        ]);
        assert(final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])), "next_turn:\nplayer1: 2,2 to 3,1, player2: 5,1 to 4,2");
    },

    // Test Purpose: Test correctness of valid_hop()
    // Src Location: game.js: Game.prototype.valid_hop(src, dst)
    valid_hop: function() {
        var game = Game.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ]);
        assert(game.valid_hop([2,2], [4,4]), "Single hop from 2,2 to 4,4: should succeed");
        assert(!game.valid_hop([2,2], [5,5]), "Hop from 2,2 to 5,5: should NOT succeed");
    },
    king_me: function() {
        var game = Game.new([
            [0, 0, 2, 0, 0, 0, 4, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 2, 0],
            [0, 0, 0, 1, 0, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 3, 0],
        ]);

        // King logic
        assert(game.king_me([0,2]), "0,2: piece should be kinged");
        assert(game.king_me([7,1]), "7,1: piece should be kinged");
        assert(!game.king_me([0,6]), "0,6: piece already kinged, should not be kinged again");
        assert(!game.king_me([7,6]), "7,6: piece already kinged, should not be kinged again");
        assert(!game.king_me([0,0]), "0,0: square is empty, should not be kinged");

        // King move test
        // Change turn to red
        assert(game.valid_hop([2,2], [4,4]), "Red King should be able to execute hop backwards");
        assert(game.valid_move([2,2], [3,1]), "Red King should be able to move backwards");
        assert(game.valid_move([2,2], [1,1]), "Red King should be able to move forwards");
        assert(game.valid_hop([3,5], [1,7]), "Black King should be able to hop backwards");
        assert(game.valid_move([3,5], [2,4]), "Black King should be able to move backwards");
        assert(!game.valid_move([2,2], [2,3]), "Red King should not be able to move sideways");
        assert(!game.valid_move([2,2], [3,2]), "Red king should not be able to move onto a piece inhabited by a Black pawn");
    },
    double_jump: function() {
        var final = run_test_game([
            [[2,4],[4,6]],
            [[4,6],[6,4]],
        ],
        // Init board has a double jump setup for player 1
        [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 0, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ]);
        assert(final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 0, 0, 2],
            [2, 0, 2, 0, 1, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])), "double_jump:\nplayer1: double jump move, [2,4] to [4,6], then [4,6] to [6,4]");
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

// Actually run tests
run_tests();

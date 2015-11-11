function assert(desc, condition) {
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
        assert("simple_move: 2,2 to 3,3", final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])));
        var final = run_test_game([ [[2,2],[3,1]] ]);
        assert("simple_move: 2,2 to 3,1", final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])));
        // Try all other squares, assert no change in state
        for (var i = 0; i < BOARD_ROWS; ++i) {
            for (var j = 0; j < BOARD_COLS; ++j) {
                if (i == 3 && (j == 1 || j == 3))
                    continue;
                var final = run_test_game([ [[2,2],[i,j]] ]);
                assert("simple_move: 2,2 to " + i + "," + j + " invalid",
                       final.board.equals(Board.new([
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                    [2, 0, 2, 0, 2, 0, 2, 0],
                    [0, 2, 0, 2, 0, 2, 0, 2],
                ])));
            }
        }
    },
    next_turn: function() {
        var final = run_test_game([
            [[2,2],[3,1]],
            [[5,1],[4,2]],
        ]);
        assert("next_turn:\nplayer1: 2,2 to 3,1, player2: 5,1 to 4,2",
               final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])));
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
        assert("Single hop from 2,2 to 4,4: should succeed", game.valid_hop([2,2], [4,4]));
        assert("Hop from 2,2 to 5,5: should NOT succeed", !game.valid_hop([2,2], [5,5]));
    },
    /*
    king_me: function() {
        var game = new Game();
        game.board = [
            [0, 0, 2, 0, 0, 0, 4, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 2, 0],
            [0, 0, 0, 1, 0, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 3, 0],
        ];
        game.board.rows = 8;
        game.board.cols = 8;

        // King logic
        assert(game.king_me([0,2]));
        assert(game.king_me([7,1]));
        assert(!game.king_me([0,6]));
        assert(!game.king_me([7,6]));
        assert(!game.king_me([0,0]));
        game.print();

        // King move test
        assert(game.valid_move([2,2], [4,4]));
        assert(game.valid_move([2,2], [3,1]));
        assert(game.valid_move([2,2], [1,1]));
        assert(game.valid_move([3,5], [1,7]));
        assert(game.valid_move([3,5], [2,4]));
        assert(!game.valid_move([2,2], [2,3]));
        assert(!game.valid_move([2,2], [3,2]));
    },
    */
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
        assert("double_jump:\nplayer1: double jump move, [2,4] to [4,6], then [4,6] to [6,4]",
               final.board.equals(Board.new([
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 0, 0, 2],
            [2, 0, 2, 0, 1, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ])));
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

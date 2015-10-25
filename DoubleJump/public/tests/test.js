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
    hop: function() {
        var game = new Game();
        game.board = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ];
        game.board.rows = 8;
        game.board.cols = 8;
        //game.print();

        assert(game.valid_move([2,2], [4,4]));
        assert(!game.valid_move([2,2], [3,4]));
        assert(!game.valid_move([2,2], [4,3]));
        assert(!game.valid_move([2,2], [3,3]));
        assert(!game.valid_move([2,2], [5,5]));
    },
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
    double_jump: function() {
        var game = new Game();
        game.board = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ];
        game.board.rows = 8;
        game.board.cols = 8;
        game.run_move_list([
            [[2,2], [6,6]],
        ]);
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

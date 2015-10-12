// Player object type
// Ex.
//  var player1 = new Player(1);
//  console.log("Player 1 id: " + player1.id);
var Player = function(id) {
    this.id = id;
}

// Game object type
// Ex.
//  var game = new Game();
//  // Fields in game:
//  game.board: returns array of arrays (matrix)
//  game.board.rows, game.board.cols: return number of rows/cols
//  game.players: returns array of 2 Player objects
//  game.turn: id number of current player
var Game = function() {
    this.board = [
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
    ];
    this.board.rows = 8;
    this.board.cols = 8;
    this.players = [new Player(1), new Player(2)];
    this.turn = this.players[0].id;
}
// Change turns by changing this.turn to opposite player id
// var game = new Game();
// game.next_turn(); // Now game.turn = 2
Game.prototype.next_turn = function() {
    // If current player is player 1, turn = player2.id
    if (this.turn == this.players[0].id) {
        this.turn = this.players[1].id;
    }
    // Else, current player is player 2, turn = player1.id
    else {
        this.turn = this.players[0].id;
    }
}
// Move the src element's id number to dst, replace dst with 0 (empty)
// var Game = new Game();
// // Move top left player 1 piece to diagonal square
// src and dst are both 2-element arrays
// game.move_piece([0, 0], [1, 1]);
Game.prototype.move_piece = function(src, dst) {
    this.board[dst[0]][dst[1]] = this.board[src[0]][src[1]];
    this.board[src[0]][src[1]] = 0;
}
// Validate src and dst coordinates
// If invalid, do nothing
// If valid simple move, move piece, advance turn
// If valid hop, move piece, wait for new input (not sure how to implement yet)
//  If input received before timeout, call execute_move recursively
//  Else, advance turn
Game.prototype.execute_move = function(src, dst) {
    var move_type = this.move_type(src, dst);
    if (move_type == 0) {
        console.log('Invalid move');
    }
    else if (move_type == 1) {
        this.move_piece(src, dst);
        this.next_turn();
    } else if (move_type == 2) {
        this.move_piece(src, dst);
        // TODO: Somehow wait for next move here, and if the player
        // clicks fast enough, execute another move
        this.next_turn();
    }
}
// If src and dst constitute a valid move on this.board,
// then return true
// else return false
Game.prototype.valid_simple_move = function(src, dst) {
   return true;
}
// If src and dst constitute a valid hop on this.board,
// then return true
// else return false
Game.prototype.valid_hop = function(src, dst) {
    return true;
}
// Check if src and dst constitute a valid move on this.board
// of some type, then return this type
Game.prototype.move_type = function(src, dst) {
    // Simple move
    if (this.valid_simple_move(src, dst)) {
        return 1;
    }
    // Single hop
    else if (this.valid_hop(src, dst)) {
        return 2;
    }
    // Invalid move detected
    else {
        return 0;
    }
}
// Assume input is a function that returns a list of moves,
// a list of 2-element lists containing 2 2-element arrays
// i.e., input = [ [[0, 0], [1, 1]], [[1, 1], [2, 2]] ]
// where input[0] = move1
// and   input[1] = move2
// and   move1[0] = move1 src coordinates
// and   move1[1] = move1 dst coordinates
// and   the same for move 2's src and dst coordinates
// input should return a list moves for the game to execute
// when there is input to be read, otherwise we just continue
//
// End Game: if input() returns -1, assume game should end
// This function might seem overly complicated,
// but I'm trying to make it so that we can replace
// input_function with a function that waits for
// input from the mouse.
Game.prototype.run = function(input) {
    while (true) {
        var moves = input();
        if (moves == -1) {
            break;
        }
        else if (moves) {
            var moves_length = moves.length;

            for (var i = 0; i < moves_length; ++i) {
                var move = moves[i];
                this.execute_move(move[0], move[1]);
                console.log('');
                this.print();
            }
        }
    }
}

// Printing function, for debugging board state.
Game.prototype.print = function () {
    for (var row = 0; row < this.board.rows; ++row) {
        var row_str = "";
        for (var col = 0; col < this.board.cols; ++col) {
            var piece = this.board[row][col] ? this.board[row][col] : ' ';
            row_str += " " + piece + " ";
        }
        console.log(row_str);
    }
}

// A function the sends input to the game for debugging
// purposes. This will be modified or replaced to allow for
// mouse handling.
// If you want to test the game with a hard-coded move list,
// this function will send the moves to the game object
// and execute the game as if we had made a series of clicks
function test_input_function(moves_list) {
    return function() {
        if (!test_input_function.finished) {
            test_input_function.finished = true;
            return moves_list;
        } else {
            return -1;
        }
    }
}
test_input_function.finished = false;

// We can use this function to test the game with
// different lists of moves!
function test_game_with_move_list(move_list) {
    var game = new Game();
    game.run(test_input_function(move_list));
}

// To test the game, change the list of moves, or write
// a function that runs a test and uses an assertion/etc
function main() {
    test_game_with_move_list([
        [[0, 0], [1, 1]],
        [[1, 1], [2, 2]],
    ]);
}

main();
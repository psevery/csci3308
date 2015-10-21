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
    else {
        if (move_type == 1) {
            this.move_piece(src, dst);
            this.next_turn();
        }
        else if (move_type == 2) {
            this.move_piece(src, dst);
            // TODO Peter
            // Remove piece that got hopped
            // Somehow wait for next move here, and if the player
            // clicks fast enough, execute another move
            this.next_turn();
        }
        // Check if a normal piece is at end of board
        // If true, crown that piece
        // else, nothing
        if (this.king_me(dst)) {
            console.log('A piece has been crowned! Fight back!');
        }
    }
}

// Checks the board to see if the most recent move results in a king piece
// Returns true if a piece has been crowned, false if not
// Also replaces the old piece with a king if it is valid
Game.prototype.king_me = function(dst) {
    // Checks to see if the piece at the dst is at the end of the board
    if((dst[0] == 0) || (dst[0] == (this.board.rows-1))){
        // Checks to see if the piece is not yet a king and replaces with a king if not
        if((this.board[dst[0]][dst[1]] == 1) || (this.board[dst[0]][dst[1]] == 2)){
            this.board[dst[0]][dst[1]] += 2;
            return true;   
        }
    }
    return false;
}


// If src and dst constitute a valid move on this.board,
// then return true
// else return false
Game.prototype.valid_move = function(src, dst) {
    //this means it is moving more than one row or collumn, check the validity in jump 
    //if(Math.abs(src[0]-dst[0]) > 1 || Math.abs(src[1]-dst[1]) > 1){
            //return this.valid_hop(src, dst);
        //}
    //black normal logic
    if (this.board[src[0]][src[1]] == 1){
        //must be moving down screen
        if (src[0] >= dst[0]){
            return false;
        }
    }
    //red normal logic
    if (this.board[src[0]][src[1]] == 2){
        //must be moving upscreen
        if(src[0] <= dst[0]){
            return false;
        }
    }
    // if above is true, just have to make sure destination square is ok. 
    return this.check_dest(src, dst);
}


// If src and dst constitute a valid hop on this.board,
// then return true
// else return false
Game.prototype.valid_hop = function(src, dst) {
    // Check to see if the direction of move is correct

    // Black Normal Move
    if((this.board[src[0]][src[1]] == 1) && (src[0] >= dst[0])){
        return false;
    }
    // Red Normal Move
    if((this.board[src[0]][src[1]] == 2) && (src[0] <= dst[0])){
        return false;
    }
    // Check to see if the hop distance is invalid
    if((Math.abs(src[0]-dst[0]) != 2) || (Math.abs(src[1]-dst[1]) != 2)){
        return false;
    }
    // Calculate the middle space between the jump
    var middlex = src[0] + ((dst[0]-src[0])/2);
    var middley = src[1] + ((dst[1]-src[1])/2);
    // Check to see if there is a opponent's piece to hop over
    if((this.board[middlex][middley] == 0) || (this.board[middlex][middley] == this.board[src[0]][src[1]])){
        return false;
    }     

    return this.check_dest(src, dst);
}


// Check if src and dst constitute a valid move on this.board
// of some type, then return this type
Game.prototype.move_type = function(src, dst) {
    // Check to see if valid hop
    if (this.valid_hop(src, dst)) {
        return 2;
    }
    //other wise it is a normal 1X1 move    
    else if (this.valid_move(src, dst)) {
        return 1;
    }
    // Invalid move detected
    else {
        return 0;
    }
}

// Helper function to ensure destination square has no piece on it 
// and it is a legal square for a piece to sit on
Game.prototype.check_dest = function(src, dst) {
    //squares where any piece should never ever be
    if ((dst[0]%2==0 && dst[1]%2!=0) || (dst[0]%2!=0 && dst[1]%2==0)){
        return false;
    }
    // Checks to see if there is a piece at the dst
    if (this.board[dst[0]][dst[1]] != 0){
        return false;
    }
    return true;
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
                // If simple move executed, break from loop
                // If hop move executed, break, start timer/etc.
                // If invalid move, continue
                this.execute_move(move[0], move[1]);
                if (this.is_end_game()) {
                    console.log("End game state reached");
                    return;
                }
                console.log('');
                this.print();
            }
        }
    }
}


// Printing function, for debugging board state.
Game.prototype.print = function () {
    console.log('<---Top--->');
    for (var row = 0; row < this.board.rows; ++row) {
        var row_str = "";
        for (var col = 0; col < this.board.cols; ++col) {
            var piece = this.board[row][col] ? this.board[row][col] : ' ';
            row_str += "[" + piece + "]";
        }
        console.log(row_str);
    }
    console.log('<---Bottom--->');
}


// We can use this function to test the game with
// different lists of moves!
Game.prototype.run_move_list = function(move_list) {
    var moves_sent = false;
    this.run(function() {
        if (!moves_sent) {
            moves_sent = true;
            return move_list;
        } else {
            return -1;
        }
    });
}

// TODO Ryan
// Function that draws the game board and the pieces on it
// context parameter = Canvas 2d context object to use for drawing
Game.prototype.draw = function(context) {
    // Drawing code goes here
}


Game.prototype.is_end_game = function() {
    // I return true if one type has a count of 0 on the board, yay
    var count = this.count_pieces()
    if ((count[0]==0) || count[1]==0)){
        return true;
    }
    else{
        return false;
    }
}
//helper to count pieces for is_end_game and can be reused for a scoreboard function 
Game.prototype.count_pieces = funtion(){
    //keep track of number of red and black pieces
    var redCount = 0;
    var blackCount = 0;
    //loop through board and get type of each square (red, black, or empty), hard coded 8 because efficency ;)
    for (var row = 0; row < 8; row ++ ){
        for (var collumn=0; collumn < 8; collumn++){
            if ((this.board.[row][col] == 1) || (this.board.[row][col] == 3)){
                blackCount++; 
            }
            else if ((this.board.[row][col] == 2) || (this.board.[row][col] == 4)){
                redCount++; 
            }
        }
    }
    //make the counts into an array to return. 
    var redblackCount = [red,back];
    return redblackCount;
}

Game.prototype.get_score = function(){
    piecesLeft = this.count_pieces();
    redsLeft = piecesLeft[0];
    blacksLeft = piecesLeft[1];
    //interact with html here ....
}









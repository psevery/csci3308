// Game object type
// Ex.
//  var game = new Game();
//  // Fields in game:
//  game.board: returns array of arrays (matrix)
//  game.board.rows, game.board.cols: return number of rows/cols
//  game.players: returns array of 2 Player objects
//  game.turn: id number of current player
var Game = function(board, canvas, context,
                    players, turn, first_click,
                    second_click, move_to_execute)
{
    this.board = board;
    this.canvas = canvas;
    this.context = context;
    this.players = players;
    this.turn = turn;
    this.first_click = first_click;
    this.second_click = second_click;
    this.move_to_execute = move_to_execute;
}

Game.new = function(matrix) {
    var board = Board.new(matrix);
    var players = [Player.new(1), Player.new(2)];
    var turn = 1;
    return new Game(board, null, null, players, turn, null, null, null);
}

// Everything in the game starts from here
Game.prototype.start = function() {
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    document.addEventListener("mousedown",
                              this.mouse_handler.bind(this), false);
    loadImages();
    this.loop();
}

Game.prototype.loop = function() {
    this.process_input();
    this.update();
    this.render();
    // requestAnimationFrame tells the browser
    // to end this function and call the 
    // parameter function (in this case, "this.run")
    // when the next frame occurs in the browser.
    // This will result in the run() function looping,
    // but only executing as fast (or slower) as the
    // screen refresh rate (usually 60Hz).
    // .bind(this) is needed to make sure the callback
    // is still tied to the "Game" this, otherwise it
    // will make this = window.
    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.process_input = function() {
    if (this.first_click != null && this.second_click != null) {
        // Copy row and col pairs from click variables
        var src = [this.first_click[0], this.first_click[1]];
        var dst = [this.second_click[0], this.second_click[1]];
        var move = [src, dst];
        // Erase click variables
        this.first_click = null;
        this.second_click = null;
        // Prepare to execute move in update()
        this.move_to_execute = move;
    }
}

Game.prototype.update = function() {
    if (this.move_to_execute) {
        this.execute_move(this.move_to_execute);
        this.move_to_execute = null;
    }
}

Game.prototype.render = function() {
    drawBoard(this.board, this.canvas, this.context);
}

// Validate src and dst coordinates
// If invalid, do nothing
// If valid simple move, move piece, advance turn
// If valid hop, move piece, wait for new input (not sure how to implement yet)
//  If input received before timeout, call execute_move recursively
//  Else, advance turn
Game.prototype.execute_move = function(move) {
    var src = move[0];
    var dst = move[1];

    var move_type = this.move_type(src, dst);
    if (move_type == 0) {
        //console.log('Invalid move');
    }
    else {
        if (move_type == 1) {
            this.move_piece(src, dst);
            this.next_turn();
        }
        else if (move_type == 2) {
            this.move_piece(src, dst);
            //this.board
            // TODO Peter
            // Remove piece that got hopped
            // Somehow wait for next move here, and if the player
            // clicks fast enough, execute another move
            //setTimeout(this.next_turn(), 1000);
            //^quickie
            
        }
        // Check if a normal piece is at end of board
        // If true, crown that piece
        // else, nothing
        if (this.king_me(dst)) {
            console.log('A piece has been crowned! Fight back!');
        }
    }
    return move_type;
}

Game.prototype.xy_to_rowcol = function(x, y) {
    // TODO change this to true values
    var square_len = this.canvas.width / BOARD_COLS;
    var row = Math.trunc(y / square_len);
    var col = Math.trunc(x / square_len);
    return [row, col];
}

Game.prototype.mouse_handler = function(e) {
    var x = e.clientX - this.canvas.offsetLeft;
    var y = e.clientY;
    var rowcol = this.xy_to_rowcol(x, y);
    if (rowcol != null) {
        var row = rowcol[0];
        var col = rowcol[1];
        if (this.first_click == null) {
            this.first_click = [row, col];
        }
        else if (this.first_click != null && this.second_click == null) {
            this.second_click = [row, col];
        }
    }
}

// If src and dst constitute a valid move on this.board,
// then return true
// else return false
Game.prototype.valid_move = function(src, dst) {
    //this means it is moving more than one row or collumn, check the validity in jump 
    //black normal logic
    if (this.board.matrix[src[0]][src[1]] == 1){
        //must be moving down screen
        if (src[0] >= dst[0]){
            return false;
        }
    }
    //red normal logic
    if (this.board.matrix[src[0]][src[1]] == 2){
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
    if((this.board.matrix[src[0]][src[1]] == 1) && (src[0] >= dst[0])){
        return false;
    }
    // Red Normal Move
    if((this.board.matrix[src[0]][src[1]] == 2) && (src[0] <= dst[0])){
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
    if((this.board.matrix[middlex][middley] == 0) || (this.board.matrix[middlex][middley] == this.board.matrix[src[0]][src[1]])){
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

Game.prototype.print = function() {
    this.board.print();
}

Game.prototype.check_dest = function(src, dst) {
    //squares where any piece should never ever be
    if ((dst[0]%2==0 && dst[1]%2!=0) || (dst[0]%2!=0 && dst[1]%2==0)){
        return false;
    }
    // Checks to see if there is a piece at the dst
    if (this.board.matrix[dst[0]][dst[1]] != 0){
        return false;
    }
    return true;
}

Game.prototype.is_end_game = function() {
    // I return true if one type has a count of 0 on the board, yay
    var count = this.count_pieces()
    if ((count[0]==0) || count[1]==0) {
        return true;
    }
    else {
        return false;
    }
}
//helper to count pieces for is_end_game and can be reused for a scoreboard function 
Game.prototype.count_pieces = function() {
    //keep track of number of red and black pieces
    var redCount = 0;
    var blackCount = 0;
    //loop through board and get type of each square (red, black, or empty), hard coded 8 because efficency ;)
    for (var row = 0; row < 8; row ++ ){
        for (var col = 0; col < 8; col++){
            if ((this.board.matrix[row][col] == 1) || (this.board.matrix[row][col] == 3)){
                blackCount++; 
            }
            else if ((this.board.matrix[row][col] == 2) || (this.board.matrix[row][col] == 4)){
                redCount++; 
            }
        }
    }
    //make the counts into an array to return. 
    var redblackCount = [redCount,blackCount];
    return redblackCount;
}

Game.prototype.get_score = function(){
    piecesLeft = this.count_pieces();
    redsLeft = piecesLeft[0];
    blacksLeft = piecesLeft[1];
    //interact with html here ....
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
    this.board.matrix[dst[0]][dst[1]] = this.board.matrix[src[0]][src[1]];
    this.board.matrix[src[0]][src[1]] = 0;
}

// Checks the board to see if the most recent move results in a king piece
// Returns true if a piece has been crowned, false if not
// Also replaces the old piece with a king if it is valid
Game.prototype.king_me = function(dst) {
    // Checks to see if the piece at the dst is at the end of the board
    if((dst[0] == 0) || (dst[0] == (this.board.rows-1))){
        // Checks to see if the piece is not yet a king and replaces with a king if not
        if((this.board.matrix[dst[0]][dst[1]] == 1) || (this.board.matrix[dst[0]][dst[1]] == 2)){
            this.board.matrix[dst[0]][dst[1]] += 2;
            return true;   
        }
    }
    return false;
}

// This function should not be used directly!
// It is only for testing, and is used in the
// run_test_game() function in the test module.
// If you want to run a test, use run_test_game().
// movelist is an array of complete moves (src and destination)
Game.prototype.loop_manual = function(movelist, verbose) {
    for (var i = 0; i < movelist.length; ++i) {
        this.move_to_execute = movelist[i];
        this.update();
        if (verbose)
            this.print();
    }
}


// Game object type
// Ex.
//  var game = new Game();
//  // Fields in game:
//  game.board: returns array of arrays (matrix)
//  game.board.rows, game.board.cols: return number of rows/cols
//  game.players: returns array of 2 Player objects
//  game.turn: id number of current player
var Game = function(board, players, turn, first_click,
                    second_click, move_to_execute, last_double_jump)
{
    this.board = board;
    this.score = score;
    this.players = players;
    this.turn = turn;
    this.first_click = first_click;
    this.second_click = second_click;
    this.move_to_execute = move_to_execute;
    this.last_double_jump = last_double_jump;
}

Game.new = function(matrix) {
    var board = Board.new(matrix);
    var players = [Player.new(1), Player.new(2)];
    // Black moves first
    var turn = 1;
    return new Game(board, players, turn, null, null, null, null);
}

// Everything in the game starts from here
Game.prototype.start = function() {
    //this.board = document.getElementById("score");
    document.addEventListener("mousedown", this.mouse_handler.bind(this), false);
    loadImages();
    this.loop();
}

Game.prototype.loop = function() {
    this.process_input();
    var not_end_game = this.update();
    this.render();
    //this.scoreboard(); 
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
    if (not_end_game)
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
    if (this.last_double_jump != null) {
        var date = new Date();
        var now = date.getTime();
        if ((now - this.last_double_jump[1]) > 1000) {
            // If the person has clicked the piece they hopped, don't go to next turn
            var last_hop = this.last_double_jump[0];
            //console.log("last_hop: " + last_hop);
            //console.log("first_click: " + this.first_click);
            if (!this.move_to_execute && (this.first_click == null || this.first_click[0] != last_hop[0] || this.first_click[1] != last_hop[1])) {
                console.log("Too much time before next hop, next turn");
                this.next_turn();
                this.last_double_jump = null;
            }
        }
    }
    if (this.move_to_execute) {
        this.execute_move(this.move_to_execute);
        this.move_to_execute = null;
    }
    if (this.is_end_game()) {
        // TODO Say which player won
        console.log("End game achieved\n");
        // Don't continue game loop
        return false;
    }
    // Continue game loop
    return true;
}

Game.prototype.render = function() {
    drawBoard(this.board);
    this.get_score();
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
        // previously, a double jump was executed, but the
        // next move was invalid, so advance turn, and set last_double to null
        if (this.last_double_jump != null) {
            this.last_double_jump = null;
            this.next_turn();
        }
        //console.log('Invalid move');
    }
    else {
        // Simple move
        if (move_type == 1) {
            this.move_piece(src, dst);
            this.next_turn();
        }
        // Hop move
        else if (move_type == 2) {
            //if (this.last_double_jump == null) {
                this.execute_hop(src, dst);
                // Now the player's piece is on the dst square
                var date = new Date();
                this.last_double_jump = [dst, date.getTime()];
            //}
            //else {
            //}
            //this.next_turn();
            //window.setTimeout(this.double_jump.bind(this), 1000);
            //this.next_turn();
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
    var square_len = canvas.width / BOARD_COLS;
    var row = Math.trunc(y / square_len);
    var col = Math.trunc(x / square_len);
    console.log("row= " + row + " col = " + col);
    return [row, col];
}

Game.prototype.mouse_handler = function(e) {
    var x = (e.clientX)- canvas.offsetLeft;
    var y = (e.clientY) - canvas.offsetTop;
    var rowcol = this.xy_to_rowcol(x, y);
    //to
    if (rowcol[0] > 7 || rowcol[1] > 7){
        return;
    }
    if (rowcol != null) {
        var row = rowcol[0];
        var col = rowcol[1];
        if (this.first_click == null) {
            // Also make sure the player actually clicked a piece
            // they own, otherwise it is frustrating to wait for 
            // second click to be made! TODO: Consider splitting
            // move validation into first-click and second-click
            // phases. Then, we can apply first-click validation
            // here, and second-click validation on second click
            // or during move execution.
            var piece = this.board.matrix[row][col];
            // Square is not empty
            if (piece != 0) {
                // Check that piece is owned by player
                if (this.turn == 1) {
                    if (piece == 1 || piece == 3) {
                        this.first_click = [row, col];
                    }
                // This condition can be removed once
                // we know for sure that this.turn is only
                // equal to 1 or 2. Until then, it is helpful
                // to keep this for debugging purposes
                } else if (this.turn == 2) {
                    if (piece == 2 || piece == 4) {
                        this.first_click = [row, col];
                    }
                }
            }
        }
        else if (this.first_click != null && this.second_click == null) {
            this.second_click = [row, col];
            //this.execute_move(this.first_click,this.second_click);
        }
    }
}

// If src and dst constitute a valid move on this.board,
// then return true
// else return false
Game.prototype.valid_move = function(src, dst) {
    //this means it is moving more than one row or collumn
    if((Math.abs(src[0]-dst[0]) != 1) || (Math.abs(src[1]-dst[1]) != 1)){
        return false;
    }
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
    // Passed above test, just have to make sure destination square is ok. 
    return this.check_dest(src, dst);
}


// If src and dst constitute a valid hop on this.board,
// then return true
// else return false
Game.prototype.valid_hop = function(src, dst) {
    // Check to see if the direction of move is correct
    // If a double jump is being execute, then the src has to be the dst of the
    // last double jump
    if (this.last_double_jump != null) {
        if (this.last_double_jump[0][0] != src[0] || this.last_double_jump[0][1] != src[1]) {
            console.log("double jump must be same piece");
            return false;
        }
    }

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
    if (this.turn == 1) {
        if (this.board.matrix[src[0]][src[1]] != 1 &&
            this.board.matrix[src[0]][src[1]] != 3) {
            return 0;
        }
    }
    if (this.turn == 2) {
        if (this.board.matrix[src[0]][src[1]] != 2 &&
            this.board.matrix[src[0]][src[1]] != 4) {
            return 0;
        }
    }
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
    redActive = "<ins><b> RED </b></ins> &#8826 ";
    redInactive = "RED";
    blackActive = "<ins><b> BLACK </b></ins> &#8826 "; 
    blackInactive = "BLACK";
    if (this.turn == 2){ 
        document.getElementById("redname").innerHTML = redActive;
        document.getElementById("blackname").innerHTML = blackInactive;
    }
    else{
        document.getElementById("redname").innerHTML = redInactive;
        document.getElementById("blackname").innerHTML = blackActive;
    }
    document.getElementById("blackscore").innerHTML = blacksLeft;
    document.getElementById("redscore").innerHTML = redsLeft;
    if (redsLeft == 0){
            document.getElementById("gameover").innerHTML = "BLACK WINS!";
    }
    if (blacksLeft == 0){
            document.getElementById("gameover").innerHTML = "RED WINS!";
    }


}

// Change turns by changing this.turn to opposite player id
// var game = new Game();
// game.next_turn(); // Now game.turn = 2
Game.prototype.next_turn = function() {
    // If current player is player 1, turn = player2.id
    if (this.turn == 1) {
        this.turn = 2;
    }
    // Else, current player is player 2, turn = player1.id
    else {
        this.turn = 1;
    }
}
Game.prototype.set_turn = function(player) {
    // If current player is player 1, turn = player2.id
    this.turn == player;
}

// Move the src element's id number to dst, replace dst with 0 (empty)
// var Game = new Game();
// Move top left player 1 piece to diagonal square
// src and dst are both 2-element arrays
// game.move_piece([0, 0], [1, 1]);
Game.prototype.move_piece = function(src, dst) {
    this.board.matrix[dst[0]][dst[1]] = this.board.matrix[src[0]][src[1]];
    this.board.matrix[src[0]][src[1]] = 0;
}

// Takes the src and dst to calculate the piece hopped over.
// If there is an opposing piece there, proceeds to remove the piece
// from the board.
// Note: Do not call without checking for a valid hop.
Game.prototype.remove_piece = function(src, dst) {
    // Calculate the coordinates of the middle space between the hop.
    var middlex = src[0] + ((dst[0]-src[0])/2);
    var middley = src[1] + ((dst[1]-src[1])/2); 
    // Removes the middle piece.
    this.board.matrix[middlex][middley] = 0;
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

Game.prototype.execute_hop = function(src, dst) {
    // Move piece that's hopping to its final destination square
    this.move_piece(src, dst);
    // Remove piece that got hopped
    this.remove_piece(src, dst);
}

function squares_equal(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}

Game.prototype.double_jump = function(src) {
    if (this.move_to_execute) {
        if (squares_equal(src, this.move_to_execute[0])) {
            this.execute_hop
            this.move_to_execute = null;
        }
    }
}

// Initialize socket
var socket = io();

// Sending move to server
function addMove(board,move) {
  socket.emit('move',move);
}

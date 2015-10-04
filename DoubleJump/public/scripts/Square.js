var Square = function (id, row, col) {
  this.id = id;
  this.row = row;
  this.col = col;
};

Square.empty = Config.Square.empty;
Square.len = Config.Square.len;
Square.fillStyles = Config.Square.fillStyles;
Square.backgroundColor = Config.Square.backgroundColor;

Square.prototype.drawBackground = function (context) {
  context.fillStyle = Square.backgroundColor;
  context.fillRect(
    this.col * Square.len,
    this.row * Square.len,
    Square.len,
    Square.len
  );
};

Square.prototype.owner = function () {
  return Player.map[this.id];
};

Square.prototype.fillStyle = function () {
  return Square.fillStyles[this.id];
};
Square.prototype.drawPiece = function (context) {
  context.fillStyle = this.fillStyle();
  context.beginPath();
  context.arc(
    Square.len * this.col + Square.len / 2,
    Square.len * this.row + Square.len / 2,
    Square.len / 2.5,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.fill();
};

Square.prototype.draw = function (context) {
  this.drawBackground(context);
  if (this.id != 0) {
    this.drawPiece(context);
  }
};

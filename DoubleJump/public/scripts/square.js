var square = {
  sidelen: canvas.width / 8,
  // "color" maps indices to colors
  colors: [
    "empty",
    "red",
    "grey",
    "yellow",
    "light-grey",
    "light-blue",
  ],
  // "ids" maps colors to id numbers
  ids: {
    "empty":      0,
    "red":        1,
    "grey":       2,
    "yellow":     3,
    "light-grey": 4,
    "light-blue": 5,
  },
};
square.color = function (id) {
  return drawUtils.fillStyles[square.colors[id]];
};
square.id = function (color) {
  return square.ids[color];
};
square.draw = function (number, row, col) {
  context.fillStyle = square.color(number);
  context.beginPath();
  context.arc(
    square.sidelen * col + square.sidelen / 2,
    square.sidelen * row + square.sidelen / 2,
    square.sidelen / 2.5,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.fill();
};

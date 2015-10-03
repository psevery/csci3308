var square = {
  side: 50,
  // "color" maps indices to colors
  color: [
    "none",
    "red",
    "grey",
    "yellow",
    "light-grey",
    "light-blue",
  ],
  // "number" maps colors to indices
  number: {
    "none":       0,
    "red":        1,
    "grey":       2,
    "yellow":     3,
    "light-grey": 4,
    "light-blue": 5,
  },
};
square.numberToFillStyle = function (number) {
  var color = square.color[number];
  return fillStyle[color];
};
square.draw = function (number, row, col) {
  context.fillStyle = square.numberToFillStyle(number);
  context.beginPath();
  context.arc(
    square.side * col + square.side / 2,
    square.side * row + square.side / 2,
    square.side / 2.5,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.fill();
};



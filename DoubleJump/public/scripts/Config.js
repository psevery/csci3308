var Config = {};

Config.canvas = {
  id: 'canvas',
  width: 400,
  height: 400,
};

Config.Board = {
  rows: 8,
  cols: 8,
  matrix: [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
  ],
};

Config.Square = {
  len: Config.canvas.width / Config.Board.cols,
  fillStyles: [
    "rgba(0, 0, 0, 0)",
    "rgba(200, 0, 0, 1)",
    "#2f4f4f",
    "#ffff00",
    "#d3d3d3",
    "#add8e6",
  ],
  backgroundColor: "black",
  empty: 0,
  highlighted: 5,
};

Config.Player = {
  map: {
    1: 1,
    2: 2,
    3: 1,
    4: 2,
  },
};

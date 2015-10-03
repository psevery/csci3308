var queue = [];
var Move = function (src, dst) {
  this.src = src;
  this.dst = dst;
};
Move.prototype.isValid = function () {
  return true;
};

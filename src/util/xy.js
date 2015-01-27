var prop = require('./prop.js');

function xy(x, y) {
  if (!(this instanceof xy)) {
    return new xy(x, y);
  }
  this.x = prop(x);
  this.y = prop(y);
}

var proto = {
  toString: function() {
    return this.x() + ',' + this.y();
  },
  eq: function(xy) {
    return this.x() === xy.x() && this.y() === xy.y();
  }
};

Object.keys(proto).forEach(function(key) {
  Object.defineProperty(xy.prototype, key, {
    value: proto[key]
  });
});

module.exports = xy;

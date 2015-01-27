
var _ = require('lodash');
var Entity = require('./entity.js');

var map = {
  human: function() {
    return new Entity({});
  }
};

var entities = {
  get: function (howMany, what) {
    return howMany === 1 ?
      map[what]() :
      _.range(0, howMany).map(map[what]);
  }
};

module.exports = entities;


var _ = require('lodash');
var Entity = require('./entity.js');

var map = {
  human: function(pos) {
    return new Entity({
      type: 'human',
      actor: true,
      pos: pos,
      stats: {
        speed: Math.random() * 100 | 0
      }
    });
  },
  wall: function(pos) {
    return new Entity({
      type: 'wall',
      actor: false,
      pos: pos,
      blocking: true,
      transparent: false
    });
  },
  floor: function(pos) {
    return new Entity({
      type: 'floor',
      actor: false,
      pos: pos,
      blocking: false,
      transparent: false
    });
  }
};

var entities = {
  get: function (howMany, what, pos) {
    return howMany === 1 ?
      map[what](pos) :
      _.range(0, howMany).map(map[what]);
  }
};

module.exports = entities;

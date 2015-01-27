var
_ = require('lodash'),
u = require('../util/all.js'),
entities = require('./entities.js'),
rot = require('rot-js').ROT;

function Map(properties) {
  this.initialise(properties);
}

Object.defineProperties(Map, {
  random: {
    value: function () {
      var w = 20,
          h = 20;
      var es = [],
          free_cells = [];
      var maze_digger = new rot.Map.DividedMaze(w, h);
      maze_digger.create(function(x, y, blocked) {
        if (blocked) {
          es.push(entities.get(1, 'wall', [x, y]));
        } else {
          es.push(entities.get(1, 'floor', [x, y]));
          free_cells.push([x, y]);
        }
      });
      return new Map({
        tiles: (function() {
          var coords = [];
          _.range(0, w).forEach(function(x) {
            _.range(0, h).forEach(function(y) {
              coords.push([x, y]);
            });
          });
          return coords;
        })(),
        entities: free_cells.sort(function() {
          return Math.random() < 0.3;
        }).slice(0, 10).map(entities.get.bind(null, 1, 'human')).concat(es)
      });
    }
  }
});

Object.defineProperties(Map.prototype, {
  initialise: {
    value: function(properties) {
      properties.tiles.forEach((function(t) {
        //this[t.pos] = new Tile();
        this[t] = [];
      }).bind(this));

      if (properties.entities) {
        properties.entities.forEach((function(e) {
          this[e.pos()].push(e);
        }).bind(this));
        this.get_entities = function() {
          return properties.entities.slice(0);
        };
      }
    }
  },

  // add,
  // move,
  // remove,
  // get
});



module.exports = Map;

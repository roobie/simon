
var m = require('mori');
var _ = require('lodash');
var Engine = require('../event_loop/engine.js');
var Scheduler = require('../event_loop/scheduler.js');

function World(properties) {
  this.initialise(properties);
}

Object.defineProperties(World.prototype, {
  initialise: {
    value: function (properties) {
      var schedu = new Scheduler();
      var engine = new Engine({
        scheduler: schedu
      });
      if (!properties) {
        // no config, so use random values.
        properties = {
          entities: [ ]
        };
      }

      _.forEach(properties.entities, function(entity) {
        schedu.add(entity, true);
      });

      _.assign({}, properties, {
        scheduler: schedu,
        engine: engine
      });

      _.forEach(properties, (function(value, key) {
        Object.defineProperty(this, key, {
          value: value
        });
      }).bind(this));

      engine.start();
    }
  },

  start: {
    value: function (properties) {
      return this;
    }
  }
});

module.exports = World;

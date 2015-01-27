
var
m = require('mori'),
_ = require('lodash'),
u = require('../util/all.js'),
Engine = require('../event_loop/engine.js'),
Scheduler = require('../event_loop/scheduler.js'),
Map = require('./map.js'),
entities = require('./entities.js');

function World(properties) {
  this.initialise(properties);
}

Object.defineProperties(World, {
    random: {
    value: function() {
      var map = Map.random();
      return new World({
        map: map,
        entities: map.get_entities(),
      });
    }
  }
});

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
        entity.actor() && schedu.add(entity, entity.actor());
      });

      _.assign(properties, {
        scheduler: schedu,
        engine: engine
      });

      _.forEach(properties, (function(value, key) {
        Object.defineProperty(this, key, {
          value: u.prop(value)
        });
      }).bind(this));

    }
  },

  start: {
    value: function (properties) {
      this.engine().start();
      return this;
    }
  }
});

module.exports = World;

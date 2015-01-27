
var u = require('../util/all.js');
var _ = require('lodash');

var AI = require('../ai/main.js');

var getId = (function() {
  var counter = 0;
  return function() {
    return (counter++);
  };
})();

function Entity(properties) {
  this.initialise(properties);
}

Object.defineProperties(Entity.prototype, {
  initialise: {
    value: function(properties) {
      properties.$id = getId();

      if (properties.actor) {
        if (!properties.ai) {
          properties.ai = new AI({
            type: 'default'
          });
        }

        if (!properties.state) {
          properties.state = [
            // 0.0 to 1.0
            // completely missing to fully satiated.
            {name: 'hunger', value: 1},
            {name: 'thirst', value: 1},
            {name: 'procreation', value: 1},
            {name: 'revenge', value: 1},
          ];
        }
      }

      if (!properties.pos) {
        throw new Error('Entity has to have a pos');
      }

      _.forEach(properties, (function(value, key) {
        Object.defineProperty(this, key, {
          value: u.prop(value),
          enumerable: true
        });
      }).bind(this));
    }
  },

  observeExternalState: {
    value: function() {
    }
  },

  observeInternalState: {
    value: function() {
    }
  },

  act: {
    value: function(setDuration) {
      var action = this.ai().act(this);
      setDuration(action.duration);
      return action.exec();
    }
  }
});

module.exports = Entity;


var u = require('../util/all.js');
var _ = require('lodash');

var AI = require('../ai/main.js');

function Entity(properties) {
  this.initialise(properties);
}

Object.defineProperties(Entity.prototype, {
  initialise: {
    value: function(properties) {
      if (!properties.ai) {
        properties.ai = new AI({
          type: 'default'
        });
      }
      _.forEach(properties, (function(value, key) {
        Object.defineProperty(this, key, {
          value: u.prop(value),
          enumerable: true
        });
      }).bind(this));
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

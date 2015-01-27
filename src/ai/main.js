var
_ = require('lodash');


function AI(properties) {
  this.initialise(properties);
}

var randomWeight = function() {
  return Math.random();
};

var getWeight = function(name, value) {
  return {
    name: name,
    value: value
  };
};

var maybeRandomiseWeights = function(weights) {
  var mutation_factor = 0.04;
  return weights.map(function(w) {
    if (Math.random() < mutation_factor) {
      return getWeight(w.name, randomWeight());
    }
    return _.assign({}, w);
  });
};

Object.defineProperties(AI.prototype, {
  initialise: {
    value: function(properties) {
      /// ...

      if (properties.weights) {
        this.weights = maybeRandomiseWeights(properties.weights);
      } else {
        this.weights = [
          getWeight('hunger', randomWeight()),
          getWeight('thirst', randomWeight()),
          getWeight('procreation', randomWeight()),
          getWeight('revenge', randomWeight()),
        ];
      }
    }
  },

  computeNextBehaviour: {
    value: function(properties) {
      console.log(properties.entity.$id(), properties.entity.stats().speed);
      return {
        duration_mod: 1,
        exec: function() {
        }
      };
    }
  },

  act: {
    value: function(entity) {
      /// observe
      var obsE = entity.observeExternalState();
      var obsI = entity.observeInternalState();

      /// compute
      var action = this.computeNextBehaviour({
        entity: entity,
        ext: obsE,
        int: obsI
      });

      /// respond
      return {
        duration: 1 * entity.stats().speed * action.duration_mod,
        exec: action.exec
      };
    }
  }
});

module.exports = AI;


function AI(properties) {
  this.initialise(properties);
}

Object.defineProperties(AI.prototype, {
  initialise: {
    value: function(properties) {
      /// ...
    }
  },

  act: {
    value: function(entity) {
      /// observe
      // var obsE = entity.observeExternalState();
      // var obsI = entity.observeInternalState();
      /// compute
      /// respond
      return {
        duration: 1,
        exec: function() {
          return true;
        }
      };
    }
  }
});

module.exports = AI;

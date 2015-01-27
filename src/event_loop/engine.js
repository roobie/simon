
var u = require('../util/all.js');
var _ = require('lodash');

var asap = require('../lib/asap_browser.js');


/**
 * @class Asynchronous main loop
 * @param {Scheduler} scheduler
 */
function Engine(properties) {
  this.initialise(properties);
}

Object.defineProperties(Engine.prototype, {
  initialise: {
    value: function(properties) {
      var data = {
        scheduler: u.prop(properties.scheduler),
        locks: u.prop(1),
        time: u.prop(0)
      };
      _.forEach(data, (function(value, key) {
        Object.defineProperty(this, key, {
          value: value
        });
      }).bind(this));
    }
  },

  /**
   * Start the main loop. When this call returns, the loop is locked.
   */
  start: {
    value: function() {
      return this.unlock();
    }
  },


  /**
   * Interrupt the engine by an asynchronous action
   */
  lock: {
    value: function() {
      this.locks(this.locks() + 1);
      return this;
    }
  },

  /**
   * Resume execution (paused by a previous lock)
   */
  unlock: {
    value: function(timestamp) {
      var progress = timestamp - this.time();
      this.time(timestamp);

      var fps = 1000 / progress;
      if (!this.locks()) { throw new Error("Cannot unlock unlocked engine"); }
      this.locks(this.locks() - 1);

      var actor = this.scheduler().next();
      if (!actor) {
        // no actors
        console.warn('no actors');
        return this.lock();
      }

      var result = actor.act((function setDuration_bound(duration) {
        this.scheduler().setDuration(duration);
      }).bind(this));

      this.lock();

      // asap((function() {
      //   if (result && result.then) {
      //     // actor returned a "thenable", looks like a Promise
      //     result.then(this.unlock.bind(this));
      //   } else {
      //     this.unlock();
      //   }
      // }).bind(this));

      setTimeout((function() {
        if (result && result.then) {
          // actor returned a "thenable", looks like a Promise
          result.then(this.unlock.bind(this));
        } else {
          this.unlock();
        }
      }).bind(this), 50);

      return this;
    }
  }
});


module.exports = Engine;


/**
 * @class Generic event queue: stores events and retrieves them based on their time
 */
function EventQueue() {
  this._time = 0;
  this._events = [];
  this._eventTimes = [];
}

/**
 * @returns {number} Elapsed time
 */
EventQueue.prototype.getTime = function() {
  return this._time;
};

/**
 * Clear all scheduled events
 */
EventQueue.prototype.clear = function() {
  this._events = [];
  this._eventTimes = [];
  return this;
};

/**
 * @param {?} event
 * @param {number} time
 */
EventQueue.prototype.add = function(event, time) {
  var index = this._events.length;
  for (var i=0;i<this._eventTimes.length;i++) {
    if (this._eventTimes[i] > time) {
      index = i;
      break;
    }
  }

  this._events.splice(index, 0, event);
  this._eventTimes.splice(index, 0, time);
};

/**
 * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
 * @returns {? || null} The event previously added by addEvent, null if no event available
 */
EventQueue.prototype.get = function() {
  if (!this._events.length) { return null; }

  var time = this._eventTimes.splice(0, 1)[0];
  if (time > 0) { /* advance */
    this._time += time;
    for (var i=0;i<this._eventTimes.length;i++) { this._eventTimes[i] -= time; }
  }

  return this._events.splice(0, 1)[0];
};

/**
 * Remove an event from the queue
 * @param {?} event
 * @returns {bool} success?
 */
EventQueue.prototype.remove = function(event) {
  var index = this._events.indexOf(event);
  if (index == -1) { return false; }
  this._remove(index);
  return true;
};

/**
 * Remove an event from the queue
 * @param {int} index
 */
EventQueue.prototype._remove = function(index) {
  this._events.splice(index, 1);
  this._eventTimes.splice(index, 1);
};


/**
 * @class Abstract scheduler
 */
function Scheduler() {
  this._queue = new EventQueue();
  this._repeat = [];
  this._current = null;
}

/**
 * @see EventQueue#getTime
 */
Scheduler.prototype.getTime = function() {
  return this._queue.getTime();
};

/**
 * @param {?} item
 * @param {bool} repeat
 */
Scheduler.prototype.add = function(item, repeat) {
  if (repeat) { this._repeat.push(item); }
  return this;
};

/**
 * Clear all items
 */
Scheduler.prototype.clear = function() {
  this._queue.clear();
  this._repeat = [];
  this._current = null;
  return this;
};

/**
 * Remove a previously added item
 * @param {?} item
 * @returns {bool} successful?
 */
Scheduler.prototype.remove = function(item) {
  var result = this._queue.remove(item);

  var index = this._repeat.indexOf(item);
  if (index != -1) { this._repeat.splice(index, 1); }

  if (this._current == item) { this._current = null; }

  return result;
};

/**
 * Schedule next item
 * @returns {?}
 */
Scheduler.prototype.next = function() {
  this._current = this._queue.get();
  return this._current;
};

/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
var extend = function(parent) {
  this.prototype = Object.create(parent.prototype);
  this.prototype.constructor = this;
  return this;
};

/**
 * @class Action-based scheduler
 * @augments Scheduler
 */
function Scheduler_Action() {
  Scheduler.call(this);
  this._defaultDuration = 1; /* for newly added */
  this._duration = this._defaultDuration; /* for this._current */
};
extend.call(Scheduler_Action, Scheduler);

/**
 * @param {object} item
 * @param {bool} repeat
 * @param {number} [time=1]
 * @see Scheduler#add
 */
Scheduler_Action.prototype.add = function(item, repeat, time) {
  this._queue.add(item, time || this._defaultDuration);
  return Scheduler.prototype.add.call(this, item, repeat);
};

Scheduler_Action.prototype.clear = function() {
  this._duration = this._defaultDuration;
  return Scheduler.prototype.clear.call(this);
};

Scheduler_Action.prototype.remove = function(item) {
  if (item == this._current) { this._duration = this._defaultDuration; }
  return Scheduler.prototype.remove.call(this, item);
};

/**
 * @see Scheduler#next
 */
Scheduler_Action.prototype.next = function() {
  if (this._current && this._repeat.indexOf(this._current) != -1) {
    this._queue.add(this._current, this._duration || this._defaultDuration);
    this._duration = this._defaultDuration;
  }
  return Scheduler.prototype.next.call(this);
};

/**
 * Set duration for the active item
 */
Scheduler_Action.prototype.setDuration = function(time) {
  if (this._current) { this._duration = time; }
  return this;
};

module.exports = Scheduler_Action;

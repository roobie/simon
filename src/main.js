
var World = require('./model/world.js');

var entities = require('./model/entities.js');

var w = new World({
  entities: [
    entities.get(1, 'human')
  ]
}).start();
window.world = w;

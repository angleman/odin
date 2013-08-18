var Primus = require('primus');
var Socket = Primus.createSocket({ transformer: 'engine.io', parser: 'JSON' });

var util = require('util');
var Adapter = require('./primus');
var WebsocketAdapter = module.exports = function(url, options) {
  this.clazz = Socket;
  Adapter.apply(this, arguments);
}
util.inherits(WebsocketAdapter, Adapter);

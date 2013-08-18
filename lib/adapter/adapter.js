var events = require('events');
var util = require('util');

var Adapter = module.exports = function(url, options) {
  this.socket = null;
  this.getSocket(url, options);
}

util.inherits(Adapter, events.EventEmitter);

/**
 *  Abstract implementation to instantiate the underlying
 *  client socket.
 */
Adapter.prototype.getSocket = function(url, options) {}

/**
 *  Abstract implementation to write to the client socket.
 */
Adapter.prototype.write = function(task) {}

/**
 *  Abstract implementation to close the client socket.
 */
Adapter.prototype.close = function(task) {}

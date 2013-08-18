var events = require('events');
var util = require('util');

var Adapter = module.exports = function(url, options) {
  this._socket = null;
  this._session = null;
  this._task = null;
  this._args = null;
  this._binary = false;
  this.getSocket(url, options);
}

util.inherits(Adapter, events.EventEmitter);

Adapter.prototype.session = function(session) {
  if(session) this._session = session;
  return this._session;
}

Adapter.prototype.task = function(task) {
  if(task) this._task = task;
  return this._task;
}

Adapter.prototype.args = function(args) {
  if(args) this._args = args;
  return this._args;
}


Adapter.prototype.binary = function() {
  return this._binary;
}

Adapter.prototype.socket = function() {
  return this._socket;
}

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

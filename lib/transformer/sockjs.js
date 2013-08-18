var util = require('util');
var Socket = require('sockjs-client-node');
var Adapter = require('./adapter');

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  var self = this;
  var socket = this._socket = new Socket(url);
  socket.onopen = function open() {
    self.emit('open');
  }
  socket.onmessage = function error(e) {
    self.emit('message', e.data);
  }
  socket.onerror = function error(err) {
    self.emit('error', err);
  }
  socket.onclose = function close() {
    self.emit('close');
  }
}

WebsocketAdapter.prototype.write = function(callback) {
  var self = this;
  var session = this.session();
  var task = this.task();
  var socket = this.socket();
  session.json(task.size, function message(err, data) {
    var start = self.last = Date.now();
    socket.send(data);
    callback(err, data);
  });
}

WebsocketAdapter.prototype.close = function() {
  this.socket().close();
}

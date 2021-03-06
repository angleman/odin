var util = require('util');
var Adapter = require('./adapter');
var Socket;

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  var self = this;
  var socket = this._socket = new this.clazz(url);
  socket.on('open', function open() {
    self.emit('open');
  });
  socket.on('error', function error(err) {
    self.emit('error', err);
  });
  socket.on('data', function message(data) {
    self.emit('message', data);
  });
  socket.on('end', function close() {
    self.emit('close');
  });
}

WebsocketAdapter.prototype.write = function(callback) {
  var self = this;
  var session = this.session();
  var task = this.task();
  var socket = this.socket();
  session.json(task.size, function message(err, message) {
    var start = self.last = Date.now();
    socket.write(message);
    callback(err, message);
  });
}

WebsocketAdapter.prototype.close = function() {
  this.socket().end();
}

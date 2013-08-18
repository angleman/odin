var util = require('util');
var io = require('socket.io-client')
var Adapter = require('./adapter');

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  var self = this;
  var socket = this._socket = io.connect(
    url, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true
  });
  socket.on('connect', function open() {
    self.emit('open');
  });
  socket.on('error', function error(err) {
    self.emit('error', err);
  });
  socket.on('message', function message(data) {
    self.emit('message', data);
  });
  socket.on('disconnect', function close() {
    self.emit('close');
  });
}

WebsocketAdapter.prototype.write = function(callback) {
  var self = this;
  var session = this.session();
  var task = this.task();
  var socket = this.socket();
  session.json(task.size, function message(err, data) {
    var packet = {message: data};
    var start = self.last = Date.now();
    socket.emit('message', packet);
    callback(err, data);
  });
}

WebsocketAdapter.prototype.close = function() {
  this.socket().disconnect();
}

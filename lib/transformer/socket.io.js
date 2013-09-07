var util = require('util');
var io = require('socket.io-client')
var Adapter = require('./adapter');

var http = require('http');
http.globalAgent.maxSockets = Number.MAX_VALUE;

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  var self = this;
  var socket = this._socket = io.connect(
    url, {
    'reconnect': true,
    'reconnection delay': 500,
    'reopen delay': 500,
    'max reconnection attempts': 5,
    'force new connection': false,
    'transports': ['websocket']
  });
  socket.on('connect', function open() {
    self.emit('open');
  });
  socket.on('error', function error(err) {
    self.emit('error', err);
  });
  socket.on('echo', function message(data) {
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
    socket.emit('echo', packet);
    callback(err, data);
  });
}

WebsocketAdapter.prototype.close = function() {
  this.socket().disconnect();
}

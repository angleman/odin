var util = require('util');
var Socket = require('ws');
//var session = require(process.argv[2]);
var Adapter = require('./adapter');

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  var self = this;
  var socket = this._socket = new Socket(url, options);
  socket.on('open', function open() {
    self.emit('open');
  });
  socket.on('close', function close() {
    self.emit('close');
  });
  socket.on('error', function error(err) {
    self.emit('error', err);
  });

  socket.on('message', function message(data) {
    self.emit('message', data);
  });
}

WebsocketAdapter.prototype.write = function(callback) {
  var self = this;
  var binary = this.args().binary;
  var masked = this.args().masked;
  var session = this.session();
  var task = this.task();
  var socket = this.socket();
  session[binary ? 'binary' : 'utf8'](task.size, function message(err, data) {
    var start = self.last = Date.now();
    socket.send(data, {
      binary: binary,
      mask: masked
    }, function sending(err) {
      if (err) {
        process.send({ type: 'error', message: err.message, concurrent: --concurrent, id: id });

        //socket.close();
        //delete connections[id];
        //close(socket, task);
        self.close();
      }

      callback(err, data);
    });
  });
}

WebsocketAdapter.prototype.close = function() {
  this.socket().close();
}

var Primus = require('primus');
var Socket = Primus.createSocket({ transformer: 'websockets', parser: 'JSON' });
//var adapter = require('./primus');
//adapter.setSocket(Socket);
//module.exports = adapter;

var util = require('util');
var Adapter = require('./primus');

var WebsocketAdapter = module.exports = function(url, options) {
  this.clazz = Socket;
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

//WebsocketAdapter.prototype.getSocket = function(url, options) {
  //var self = this;
  //var socket = this._socket = new Socket(url);
  //socket.on('open', function open() {
    //self.emit('open');
  //});
  //socket.on('error', function error(err) {
    //self.emit('error', err);
  //});
  //socket.on('data', function message(data) {
    //self.emit('message', data);
  //});
  //socket.on('end', function close() {
    //self.emit('close');
  //});
//}

//WebsocketAdapter.prototype.write = function(callback) {
  //var self = this;
  //var session = this.session();
  //var task = this.task();
  //var socket = this.socket();
  //session.json(task.size, function message(err, message) {
    //var start = self.last = Date.now();
    //socket.write(message);
    //callback(err, message);
  //});
//}

//WebsocketAdapter.prototype.close = function() {
  //this.socket().end();
//}

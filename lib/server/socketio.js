process.env.NODE_ENV = 'production';
var memwatch = require('memwatch');
var server = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

var conf = require('./conf/socketio.js');

var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');

var sockets = io.listen(server, conf);

function handler(req, res) {
  res.writeHead(200);
  res.end('socket.io sockets');
}

sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  });
});

memwatch.on('leak', function info(info) {
  console.error(info);
});

server.listen(port);

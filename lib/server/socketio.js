process.env.NODE_ENV = 'production';
var server = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

var conf = require('./conf/socketio.js');

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

server.listen(process.env.npm_package_config_port);

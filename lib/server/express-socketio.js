process.env.NODE_ENV = 'production';
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io');

var conf = require('./conf/socketio.js');

app.get('*', function (req, res) {
  res.writeHead(200);
  res.end('express+socket.io server');
});

var sockets = io.listen(server, conf);

sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  });
});

server.listen(process.env.npm_package_config_port);

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io');

app.get('*', function (req, res) {
  res.writeHead(200);
  res.end('express+socket.io server');

});

var sockets = io.listen(server,
  {
    'flash policy server': false,
    transports: ['websocket'],
    'log level': 1
  }
);

sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  });
});

server.listen(process.env.npm_package_config_port);

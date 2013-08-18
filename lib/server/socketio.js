var app = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

var server = io.listen(app,
  {
    'flash policy server': false,
    transports: ['websocket']
  }
);
server.set('log level', 1);

app.listen(process.env.npm_package_config_port);

function handler (req, res) {
  res.writeHead(200);
  res.end('socket.io server');
}

server.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  });
});

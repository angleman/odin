process.env.NODE_ENV = 'production';
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: process.env.npm_package_config_port});
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    ws.send(message);
  });
});

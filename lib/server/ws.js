process.env.NODE_ENV = 'production';
var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: port});
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    ws.send(message);
  });
});

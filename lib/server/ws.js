process.env.NODE_ENV = 'production';
var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');

var memwatch = require('memwatch');
var http = require('http');
http.globalAgent.maxSockets = Number.MAX_VALUE;

memwatch.on('leak', function info(info) {
  console.error(info);
});

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: port});
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    ws.send(message);
  });
});

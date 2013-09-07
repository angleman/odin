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

var clients = 0;

var server = http.createServer()
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  clients++;
  ws.on('message', function(message) {
    ws.send(message);
  });
  ws.on('close', function() {
    clients--;
    //console.log("websocket closed, remaining clients %s", clients);
  });
});
server.listen(port, 65536);

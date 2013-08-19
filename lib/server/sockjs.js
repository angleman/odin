process.env.NODE_ENV = 'production';
var http = require('http');
var sockjs = require('sockjs');

var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
  conn.on('data', function(message) {
    //console.log("got data message: " + message);
    conn.write(message);
  });
  conn.on('close', function() {});
});

var server = http.createServer();
echo.installHandlers(server);
server.listen(port);

var http = require('http');
var sockjs = require('sockjs');

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
server.listen(process.env.npm_package_config_port);

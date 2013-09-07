//var posix = require('posix');

// raise maximum number of open file descriptors to 10k,
// hard limit is left unchanged
//posix.setrlimit('nofile', { soft: 65536, hard: 65536 });

process.env.NODE_ENV = 'production';
var memwatch = require('memwatch');
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
  conn.on('close', function() {
    //console.log("sockjs client connection closed");
  });
});

memwatch.on('leak', function info(info) {
  console.error(info);
});

var server = http.createServer();
server.on('error', function(err) {
  console.error(err);
})
echo.installHandlers(server, {log: function log(severity, message){}});
server.listen(port);

process.env.NODE_ENV = 'production';
var memwatch = require('memwatch');
var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');
var primus = require('primus');
var http = require('http');
var server  = http.createServer();
var primus = new primus(server, {
  transformer: "socket.io",
  parser: 'JSON'
});

primus.on('connection', function (spark) {
  spark.on('data', function (data) {
    spark.write(data);
  });
})

//var client = new primus.Socket('http://localhost:9090');
//client.write('whatever');

memwatch.on('leak', function info(info) {
  console.error(info);
});

server.listen(port);

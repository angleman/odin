'use strict';

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

server.listen(process.env.npm_package_config_port);

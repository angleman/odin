'use strict';

var primus = require('primus');
var http = require('http');
var server  = http.createServer();
var primus = new primus(server, {
  transformer: "websockets",
  parser: 'JSON'
});

primus.on('connection', function (spark) {
  //console.log('connection has the following headers', spark.headers);
  //console.log('connection was made from', spark.address);
  //console.log('connection id', spark.id);
  spark.on('data', function (data) {
    //console.log('received data from the client %j', data);

    //
    // Always close the connection if we didn't receive our secret imaginary handshake.
    //
    //if ('foo' !== data.secrethandshake) spark.end();
    //spark.write({ foo: 'bar' });
    spark.write(data);
  });

  //spark.write('Hello world');
})

//var client = new primus.Socket('http://localhost:9090');
//client.write('whatever');

server.listen(process.env.npm_package_config_port);

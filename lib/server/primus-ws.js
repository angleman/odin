process.env.NODE_ENV = 'production';
var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');
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
    spark.write(data);
  });
})

//var client = new primus.Socket('ws://localhost:9090');
//client.write('whatever');

server.listen(port);

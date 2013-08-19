process.env.NODE_ENV = 'production';
var primus = require('primus');
var http = require('http');
var server  = http.createServer();
var primus = new primus(server, {
  transformer: "sockjs",
  parser: 'JSON'
});

primus.on('connection', function (spark) {
  spark.on('data', function (data) {
    spark.write(data);
  });
})

//var client = new primus.Socket('ws://localhost:9090');
//client.write('whatever');

server.listen(process.env.npm_package_config_port);

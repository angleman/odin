process.env.NODE_ENV = 'production';
var server = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

var conf = require('./conf/socketio.js');

var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

var sockets = io.listen(server, conf);

sockets.set('store', new RedisStore({
  redisPub : pub
, redisSub : sub
, redisClient : client
}));

function handler(req, res) {
  res.writeHead(200);
  res.end('redis+socket.io sockets');
}

sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.emit('message', data);
  });
});

server.listen(process.env.npm_package_config_port);

process.env.NODE_ENV = 'production';
var memwatch = require('memwatch');
var server = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

var conf = require('./conf/socketio.js');

var nconf = require('nconf');
nconf.argv();
var port = nconf.get('port');

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
  socket.on('echo', function (data) {
    socket.emit('echo', data);
  });
});

memwatch.on('leak', function info(info) {
  console.error(info);
});


server.listen(port);

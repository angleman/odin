'use strict';

var session = require(process.argv[2]);
var transformers = require('./transformer');

var connections = {}
  , concurrent = 0;

//
// WebSocket connection details.
//
var masked = process.argv[4] === 'true'
  , binary = process.argv[5] === 'true'
  , transformer = process.argv[6]
  , protocol = +process.argv[3] || 13;

var Adapter = transformers[transformer];

process.on('message', function message(task) {
  var handler = new Adapter(task.url);
  handler.session(session);
  handler.task(task);
  handler.args({binary: binary, masked: masked});
  var now = Date.now();

  //
  // Write a new message to the socket. The message should have a size of x
  //
  if ('write' in task) {
    Object.keys(connections).forEach(function write(id) {
      write(connections[id], task, id);
    });
  }

  //
  // Shut down every single socket.
  //
  if (task.shutdown) {
    //console.log('got shutdown...');
    Object.keys(connections).forEach(function shutdown(id) {
      close(connections[id]);
    });
  }

  // End of the line, we are gonna start generating new connections.
  if (!task.url) return;

  var socket = handler.socket();

  var write = function() {
    handler.write(function(err, data) {
      //console.log("wrote data to socket...");
      if(err) {
        process.send(
          { type: 'error', message: err.message, concurrent: --concurrent, id: id });
      }
    });
  }

  handler.once('open', function() {
    process.send(
      {
        type: 'open',
        duration: Date.now() - now,
        id: task.id,
        concurrent: concurrent
      }
    );
    write();
  });

  handler.on('error', function error(err) {
    process.send(
      {
        type: 'error',
        message: err.message,
        id: task.id,
        concurrent: --concurrent
      }
    );
    close(handler);
  });

  handler.on('message', function message(data) {
    process.send({
      type: 'message',
      latency: Date.now() - handler.last,
      concurrent: concurrent,
      id: task.id
    });
    // Only write as long as we are allowed to send messages
    if (--task.messages) {
      write();
    } else {
      close(handler);
    }
  });

  handler.once('close', function() {
    var internal = socket._socket || {};
    process.send({
      type: 'close', id: task.id, concurrent: --concurrent,
      read: internal.bytesRead || 0,
      send: internal.bytesWritten || 0
    });
    delete connections[task.id];
  });

  // Adding a new socket to our socket collection.
  ++concurrent;
  connections[task.id] = handler;
});

function close(handler) {
  handler.close();
  var task = handler.task();
  delete connections[task.id];
}

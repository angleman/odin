'use strict';

var Socket = require('ws')
  , io = require('socket.io-client')
  , connections = {}
  , concurrent = 0;

//
// Get the session document that is used to generate the data.
//
var session = require(process.argv[2]);

var transformers = require('./transformer');

//console.log("using %s", process.argv[2]);
//

//
// WebSocket connection details.
//
var masked = process.argv[4] === 'true'
  , binary = process.argv[5] === 'true'
  , transformer = process.argv[6]
  , protocol = +process.argv[3] || 13;

var sio = false;

var Adapter = transformers[transformer];

process.on('message', function message(task) {
  var handler = new Adapter(task.url);
  handler.session(session);
  handler.task(task);
  handler.args({binary: binary, masked: masked});
  var now = Date.now();

  //console.log("use sio %s", sio);
  //console.log("recevied message %j", task);


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
    console.log('got shutdown...');
    Object.keys(connections).forEach(function shutdown(id) {
      //connections[id].close();
      close(connections[id]);
    });
  }

  // End of the line, we are gonna start generating new connections.
  if (!task.url) return;

  //console.log("created socket client handler...%s", Object.keys(connections).length);

  var socket = handler.socket();
  if(!sio) {
    //socket = new Socket(task.url, {
      //protocolVersion: protocol
    //});
  }else{
    //socket = io.connect(
      //task.url, {
      //'reconnection delay': 0,
      //'reopen delay': 0,
      //'force new connection': true
    //});
  }

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


  //socket.on(sio ? 'connect' : 'open', function open() {
    //////console.log("socket connection opened...");
    ////process.send({ type: 'open', duration: Date.now() - now, id: task.id, concurrent: concurrent });
    ////write(socket, task, task.id);

    //// As the `close` event is fired after the internal `_socket` is cleaned up
    //// we need to do some hacky shit in order to tack the bytes send.
  //});

  //socket.on(sio ? 'ping' : 'message', function message(data) {
    ////console.log("got socket response...");
    //process.send({
      //type: 'message', latency: Date.now() - socket.last, concurrent: concurrent,
      //id: task.id
    //});

    //// Only write as long as we are allowed to send messages
    //if (--task.messages) {
      //write(socket, task, task.id);
    //} else {
      ////socket.close();
      //close(handler);
    //}
  //});

  //socket.on(sio ? 'disconnect' : 'close', function close() {
    ////console.log("got disconnect / close");
    //var internal = socket._socket || {};

    //process.send({
      //type: 'close', id: task.id, concurrent: --concurrent,
      //read: internal.bytesRead || 0,
      //send: internal.bytesWritten || 0
    //});

    //delete connections[task.id];
  //});

  //socket.on('error', function error(err) {
    //process.send({ type: 'error', message: err.message, id: task.id, concurrent: --concurrent });

    ////socket.close();
    ////delete connections[task.id];
    //close(socket, task);
  //});

  // Adding a new socket to our socket collection.
  ++concurrent;
  connections[task.id] = handler;
});

function close(handler) {
  handler.close();
  var task = handler.task();
  delete connections[task.id];
}

/**
 * Helper function from writing messages to the socket.
 *
 * @param {WebSocket} socket WebSocket connection we should write to
 * @param {Object} task The given task
 * @param {String} id
 * @param {Function} fn The callback
 * @api private
 */
//function write(socket, task, id, fn) {
  //if(!sio) {
    //session[binary ? 'binary' : 'utf8'](task.size, function message(err, data) {
      //var start = socket.last = Date.now();
      //socket.send(data, {
        //binary: binary,
        //mask: masked
      //}, function sending(err) {
        //if (err) {
          //process.send({ type: 'error', message: err.message, concurrent: --concurrent, id: id });

          ////socket.close();
          ////delete connections[id];
          //close(socket, task);
        //}

        //if (fn) fn(err);
      //});
    //});
  //}else{
    ////console.log("write to socket.io...");
    //session.json(task.size, function message(err, data) {
      //var packet = {req: {start: new Date().getTime()}};
      ////packet.message = data.message;
      ////console.log("got data %s", data);
      //var start = socket.last = Date.now();
      //socket.emit('ping', packet);
      //if (fn) fn();
    //});
  //}
//}

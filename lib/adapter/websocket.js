var util = require('util');
var Adapter = require('./adapter');

var WebsocketAdapter = module.exports = function(url, options) {
  Adapter.apply(this, arguments);
}

util.inherits(WebsocketAdapter, Adapter);

WebsocketAdapter.prototype.getSocket = function(url, options) {
  this.socket = new Socket(url, options);
}

WebsocketAdapter.prototype.write = function() {

}

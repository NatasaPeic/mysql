var Net      = require('net');
var Config   = require('./Config');
var Protocol = require('./protocol/Protocol');

module.exports = MysqlConnection;
function MysqlConnection(options) {
  this.config   = new Config(options.config);
  this.socket   = options.socket;
  this.protocol = new Protocol();
}

MysqlConnection.prototype.connect = function(cb) {
  if (!this.socket) {
    this.socket = Net.createConnection(this.config.port, this.config.host);
  }

  this.socket.pipe(this.protocol);
  this.protocol.pipe(this.socket);

  this.protocol.handshake(this.config, cb);
};

MysqlConnection.prototype.query = function(sql, cb) {
  this.protocol.query({
    sql: sql,
  }, cb);
};

MysqlConnection.prototype.end = function() {
  this.socket.destroy();
};
var express = require('express');

var http = require('http');
var logger = require('./common/logger');

process.title = 'Socket服务器';

var port = 5050;

var app = express();
app.use(require('cors')());
var server = http.createServer(app);

require('./io/io-stream').init(server, true);
app.use('/io/channel', require('./io/channel'));

server.listen(port, function () {
    logger.info('Server listen on port ' + port);
});
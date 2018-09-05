var express = require('express');
var ioStream = require('./io-stream');
var logger = require('../common/logger');
var bodyParser = require('body-parser');
var app = module.exports = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var badRequestResult = {errcode: 404, message: 'Bad request'};

app.post('/add', function (req, res) {
    logger.info('channel add>>>' + JSON.stringify(req.body));
    if (req.body) {
        var channel = req.body.channel;
        ioStream.addChannel(channel, function (result) {
            res.json(result);
        });
    } else {
        res.json(badRequestResult);
    }
});
app.post('/remove', function (req, res) {
    logger.info('channel remove>>>' + JSON.stringify(req.body));
    if (req.body) {
        var channel = req.body.channel;
        ioStream.removeChannel(channel, function (result) {
            res.json(result);
        });
    } else {
        res.json(badRequestResult);
    }
});
app.post('/broadcast', function (req, res) {
    logger.info('channel broadcast>>>' + JSON.stringify(req.body));
    if (req.body) {
        var channel = req.body.channel;
        var event = req.body.event;
        var data = req.body.data;
        if (channel && event && data) {
            ioStream.emit(channel, event, data, function (result) {
                res.json(result);
            });
        }
        else {
            res.json(badRequestResult);
        }
    }
    else {
        res.json(badRequestResult);
    }
});
var _ = require('underscore');
var logger = require('../common/logger');
// var redis = require('../common/redis');
var io = null;

var Channel = function (name) {
  var self = this;

  this.name = name;
  this.userNum = 0;

  this.create = function (io, callbacks) {
    self.nsp = io.of('/' + this.name);
    self.nsp.on('connection', function (socket) {
      self.userNum++;
      logger.info('Someone connect to ' + self.name + ':' + self.userNum);

      socket.on('disconnect', function () {
        self.userNum--;
        logger.info('Someone disconnect from ' + self.name + ':' + self.userNum);
      });

      if (callbacks && callbacks.length > 0) {

        _.each(callbacks, function (callback) {
          var event = callback.event;
          var func = callback.func;
          if (_.isString(event) && event !== '' && _.isFunction(func)) {
            socket.on(event, function (data) {
              func(socket, data);
            });
          }
        });
      }

    });
  };
};

var channels = [];
var channels2string = function(){
    var channelnamelist = "";
    for(var i=0;i<channels.length;i++){
      channelnamelist+="["+channels[i].name+"]";
    }
    return channelnamelist;
}
var init = function (server, heartbeat) {
     io = require('socket.io')(server, {pingTimeout: 300000});
    // redis.client.msmembers(redis.key.REDIS_KEY_SOCKET,function(err,ret){
    //     if(ret){
    //         for(var i=0;i<ret.length;i++){
    //             var item = ret[i];
    //             var channel = new Channel(item.channelname);
    //             logger.info("init channel:"+item.channelname);
    //             channel.create(io);
    //         }
    //     }
    // })
};
var addChannel = function (channelName,callback){
    logger.info('addChannel to ' + channelName);
    var channel = _.find(channels, function (c) {
      return c.name == channelName;
    });
    if(!channel){
         channel = new Channel(channelName);
         channel.create(io);
         channels.push(channel);
        var data = {channelname:channelName,createDt:new Date()}
        // redis.client.msadd(redis.key.REDIS_KEY_SOCKET,data);
    }


  logger.info('after addChannel: ' + channels2string());
    callback({"status":1});
};
var removeChannel = function(channelName,callback){
  logger.info('removeChannel from ' + channels2string() + ',' +channelName);
  for(var i=0;i<channels.length;i++){
    if(channels[i].name==channelName){
      channels.splice(i,1);
      //break;
    }
  }
  logger.info('after removeChannel : ' + channels2string());
  callback({"status":1});
};
var emit = function (channelName, event, data, callback) {
  var channel = _.find(channels, function (c) {
    return c.name == channelName;
  });
  if (channel) {
    channel.nsp.emit(event, data);
    if (_.isFunction(callback)) {
      callback({});
    }
  } else {
    if (_.isFunction(callback)) {
      callback({errcode: 404, message: 'Cannot find target channel'});
    }
  }
};

module.exports = {
  init: init,
  addChannel: addChannel,
  removeChannel: removeChannel,
  emit: emit
};

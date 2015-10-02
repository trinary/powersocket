var _ = require('lodash');
var http = require('http');
var https = require('https');
var zlib = require('zlib');
var oboe = require('oboe');
var url = require('url');

// default agent configuration

var DEFAULT_CONFIG = {
  hostname: 'stream.gnip.com',
  port: 443,
  method: 'GET',
  headers: { 'accept': '*/*', 'accept-encoding': 'gzip' }
};

// construct a power track connection

module.exports.Connection = function(customConfig) {

  // construct configuration

  var config = _.extend({}, customConfig, DEFAULT_CONFIG);
  config.auth = [customConfig.username, customConfig.password].join(':');

  if (config.url) {
    var streamUrl = url.parse(config.url);
    config.port = streamUrl.port || streamUrl.protocol == 'http' ? 80 : 443;
    config.path = streamUrl.path;
    config.hostname = streamUrl.hostname;
    config.auth = streamUrl.auth || config.auth;
  }

  // setup connection

  var request = https.request(config, function (res) {
    console.log('Got a response, status: ', res.statusCode);
    oboe(res.pipe(zlib.createGunzip())).done(config.onTweet);
  });
  request.end();
  request.on('error', function(e) {
    console.log(e);
    throw new Error(e);
  });

  // return configuration

  return config;
};


var http = require('http');
var https = require('https');
var zlib = require('zlib');
var oboe = require('oboe');

var requestOptions = {
    hostname: 'stream.gnip.com',
    port: 443,
    method: 'GET',
    headers: { 'accept': '*/*',
               'accept-encoding': 'gzip' },
    rejectUnauthorized: false
};

requestOptions.agent = new https.Agent(requestOptions);

var callback;

module.exports.configuration = function(config) {
  requestOptions.path = config.path;
  requestOptions.auth = [config.username, config.password].join(':');

};

module.exports.callback = function(fn) {
  callback = fn;
  var req = https.request(requestOptions, function (res) {
    console.log('Got a response, status: ', res.statusCode);
    oboe(res.pipe(zlib.createGunzip()))
      .done(fn);
  });
  req.end();
};



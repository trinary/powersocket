var http = require('http'),
    https = require('https'),
    oboe = require('oboe'),
    url = require('url'),
    zlib = require('zlib');


var requestOptions = {
    port: 443,
    hostname: 'stream.gnip.com',
    method: 'GET',
    headers: { 'accept': '*/*',
               'accept-encoding': 'gzip' },
};

requestOptions.agent = new https.Agent(requestOptions);

var callback;

module.exports.configuration = function(config) {
  var streamUrl, port;
  if(config.path) {
    requestOptions.path = config.path;
    requestOptions.auth = [config.username, config.password].join(':');
  } else {
    streamUrl = url.parse(config.url);
    port = streamUrl.port || streamUrl.protocol == 'http' ? 80 : 443; 
    requestOptions.path = streamUrl.path;
    requestOptions.hostname = streamUrl.hostname;
    requestOptions.port = port;
    requestOptions.auth = streamUrl.auth || [config.username, config.password].join(':');
  }
  console.log(requestOptions);
};

module.exports.callback = function(fn) {
  callback = fn;
  var req = https.request(requestOptions, function (res) {
    console.log('Got a response, status: ', res.statusCode);
    oboe(res.pipe(zlib.createGunzip()))
      .done(fn);
  });
  req.end();
  req.on('error', function(e) {
    console.log(e);
    throw new Error(e);
  });
};



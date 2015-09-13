# Powersocket

A tiny library for connecting to Gnip Powertrack streams.

### Usage

There are two ways to configure PowerSocket:

Provide three separate User, Password, and Path (just the path section of your PT url) arguments, and a callback for when a tweet arrives:
```javascript
var ps = require('powersocket');
ps.configuration({
  username: process.env.POWERSOCKET_USER,
  password: process.env.POWERSOCKET_PASS,
  path: process.env.POWERSOCKET_PATH
});

ps.callback(function(tweet) {
  io.sockets.emit('tweet', tweet);
});
```

Or, just provide a full URL that includes your PT username and password, and a callback:
```javascript
var ps = require('powersocket');
ps.configuration({
  url: process.env.POWERSOCKET_URL
});

ps.callback(function(tweet) {
  io.sockets.emit('tweet', tweet);
});
```

Your callback will be triggered whenever a new tweet arrives. An error will be raised on any error in the HTTP client.

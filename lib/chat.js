var config = require('./../config.js').settings;


var xmpp = require('node-xmpp'),
  express = require('express'),
  http = require('http'),
  app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('AION chatbot');
});

app.listen(port);

//heroku keep alive ping
if ( !! config.herokuUrl) {
  setInterval(function() {
    http.request({
      host: config.herokuUrl
    }, function(res) {
      console.log('keep alive ping!');
    }).end();
  }, 1200000);
}

module.exports = function() {
  var local = this;

  var client = new xmpp.Client(config.client);
  var conn = client.connection;

  conn.socket.setTimeout(0);
  conn.socket.setKeepAlive(true, 10000);



  var setStatusMessage = function(statusMessage) {
    var presence_elem = new xmpp.Element('presence', {})
      .c('show').t('chat').up()
      .c('status').t(config.status_message);
    client.send(presence_elem);
  };

  var requestGoogleRoster = function() {
    var rosterElem = new xmpp.Element('iq', {
      from: conn.jid,
      type: 'get',
      id: 'google-roster'
    })
      .c('query', {
        xmlns: 'jabber:iq:roster',
        'xmlns:gr': 'google:roster',
        'gr:ext': '2'
      });
    client.send(rosterElem);
  };

  var acceptSubscriptionRequests = function(stanza) {
    if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
      var subscribeElem = new xmpp.Element('presence', {
        to: stanza.attrs.from,
        type: 'subscribed'
      });
      client.send(subscribeElem);
    }
  };

  this.onMessage = function(callback) {
    conn.addListener('stanza', function(stanza) {
      if (stanza.is('message')) {
        console.log('message received: ' + stanza.toString());
        var msg = stanza.getChildText('body');
        var from = stanza.attrs.from;

        if ( !! msg) {
          callback({
            message: msg,
            from: from
          });
        }
      }
    });
  };

  this.sendMessage = function(to, msg) {
    var elem = new xmpp.Element('message', {
      to: to,
      type: 'chat'
    }).c('body').t(msg);
    client.send(elem);
  };

  client.on('online', function() {
    console.log('getting online');
    setStatusMessage(config.status_message);
    setInterval(function() {
      client.send(' ');
    }, 30000);
  });

  if (config.allow_auto_subscribe) {
    client.addListener('online', requestGoogleRoster);
    client.addListener('stanza', acceptSubscriptionRequests);
  }


};

var config = require('./../config.js').settings;


var xmpp = require('node-xmpp'),
  request_helper = require('request'),
  util = require('util'),
  express = require('express'),
  httpClient = require('scoped-http-client'),
  app = express();

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('AION chatbot');
});

app.listen(port);

var client = new xmpp.Client(config.client);
var conn = client.connection;

conn.socket.setTimeout(0);
conn.socket.setKeepAlive(true, 10000);


console.log('config.herokuUrl:' + config.herokuUrl);

if ( !! config.herokuUrl) {
  setInterval(function() {
    httpClient.create(config.herokuUrl).post(function() {
      console.log('keep alive ping!');
    });
  }, 1200000);
}


function set_status_message(status_message) {
  var presence_elem = new xmpp.Element('presence', {})
    .c('show').t('chat').up()
    .c('status').t(status_message);
  client.send(presence_elem);
}

client.on('online', function() {
  console.log('getting online');
  set_status_message(config.status_message);
  setInterval(function() {
    client.send(' ');

  }, 30000);
});


function request_google_roster() {
  var roster_elem = new xmpp.Element('iq', {
    from: conn.jid,
    type: 'get',
    id: 'google-roster'
  })
    .c('query', {
      xmlns: 'jabber:iq:roster',
      'xmlns:gr': 'google:roster',
      'gr:ext': '2'
    });
  client.send(roster_elem);
}

if (config.allow_auto_subscribe) {
  client.addListener('online', request_google_roster);
  client.addListener('stanza', accept_subscription_requests);
}

function accept_subscription_requests(stanza) {
  if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
    var subscribe_elem = new xmpp.Element('presence', {
      to: stanza.attrs.from,
      type: 'subscribed'
    });
    client.send(subscribe_elem);
  }
}

conn.addListener('stanza', function(stanza) {
  if (stanza.is('message')) {
    console.log('message received: ' + stanza.toString());
    var msg = stanza.getChildText('body');
    var from = stanza.attrs.from;

    if ( !! msg) {
      console.log('msg: ' + msg);
      console.log('from: ' + from)

      var elem = new xmpp.Element('message', {
        to: from,
        type: 'chat'
      }).c('body').t('hey! você disse: ' + msg);
      client.send(elem);
    }
  }
});

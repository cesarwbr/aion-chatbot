var config = require('./../config').settings;
var Brain = require('./brain');
var Chat = require('./chat');

var brain = new Brain();
brain.load("./../profile/greetings.json");

var chat = new Chat();

chat.onMessage(function(msgObj) {
  var answer = brain.bestMatch(msgObj.message);
  chat.sendMessage(msgObj.from, answer);
});

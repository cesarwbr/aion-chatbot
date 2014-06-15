var config = require('./../config').settings;
var Brain = require('./brain');
var Chat = require('./chat');
var converter = require('./aion-converter.js');
var Promise = require('promise'),
  readFile = Promise.denodeify(require('fs').readFile);


var brain = new Brain();

var promises = [];
promises.push(readFile(__dirname + '/../aimls/movies.aiml'));
promises.push(readFile(__dirname + '/../aimls/money.aiml'));
promises.push(readFile(__dirname + '/../aimls/salutations.aiml'));
promises.push(readFile(__dirname + '/../aimls/sports.aiml'));

Promise.all(promises).then(function(res) {
  brain.load(converter.aiml(res[0]));
});

var chat = new Chat();

chat.onMessage(function(msgObj) {
  var answer = brain.bestMatch(msgObj.message);
  chat.sendMessage(msgObj.from, answer);
});
var config = require('./../config').settings,
    Brain = require('./brain'),
    Chat = require('./chat'),
    converter = require('./aion-converter.js'),
    Promise = require('promise'),
    fs = require('fs'),
    readFile = Promise.denodeify(fs.readFile);


var brain = new Brain();

var aimlsDir = __dirname + '/../aimls/';

var loadFiles = function(files) {
  var promises = [];

  files.forEach(function(file) {
    console.log('loading: ' + aimlsDir + file);
    promises.push(readFile(aimlsDir + file));
  });

  Promise.all(promises).then(function(res) {
    for(var item in res){
      brain.load(converter.aiml(res[item]));
    }
  });
};

fs.readdir(aimlsDir, function(err, files) {
  if (err) {
    throw err;
  }

  loadFiles(files);
});



var chat = new Chat();

chat.onMessage(function(msgObj) {
  var answer = brain.bestMatch(msgObj.message);
  chat.sendMessage(msgObj.from, answer);
});

var config = require('./../config').settings,
    Brain = require('./brain'),
    Chat = require('./chat'),
    converter = require('./aion-converter.js'),
    Promise = require('promise'),
    fs = require('fs'),
    readFile = Promise.denodeify(fs.readFile);


var brain = new Brain();

var aionsDir = __dirname + '/../aions/';

var loadFiles = function(files) {
  var promises = [];

  files.forEach(function(file) {
    console.log('loading: ' + aionsDir + file);
    promises.push(readFile(aionsDir + file));
  });

  Promise.all(promises).then(function(res) {
    for(var item in res){
      brain.load( JSON.parse( res[item] ));
    }
  });
};

fs.readdir(aionsDir, function(err, files) {
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

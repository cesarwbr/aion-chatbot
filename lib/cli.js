var config = require('./../config').settings,
  Brain = require('./brain'),
  Promise = require('promise'),
  fs = require('fs'),
  readFile = Promise.denodeify(fs.readFile),
  readline = require('readline'),
  colors = require('colors');

var brain = new Brain();

var printHelp = function() {
  console.log("\n\tlist topic:".bold + "\tList all topics loaded from aion files.");
  console.log("\n\tprint topic:".bold + "\tPrint the topic used to finde the best answer.");
  console.log("\n\tlist gradient:".bold + "\tList all gradients.");
  console.log("\n\tprint gradient:".bold + "\tPrint the best gradient found.");
  console.log("\n\tprint hmap:".bold + "\tPrint the humour map.");
  console.log("\n\tprint match:".bold + "\tPrint the match ( question and answer for the best gradient ).");
  console.log("\n\thelp:".bold + "\t\tPrint this help.");
  console.log("\n\texit:".bold + "\t\tFinish session.\n");
};

var repl = function() {

  var rl = readline.createInterface(process.stdin, process.stdout);
  var lastInput = "";
  var timeTaken = 0;

  rl.setPrompt('>> ');
  rl.prompt();

  rl.on('line', function(line) {
    switch (line) {

      case "":
        break;

      case " ":
        break;

      case "exit":
        rl.close();
        break;

      case "help":
        printHelp();
        break;

      case "list gradient":
        console.log(brain.getGradientArray());
        break;

      case "print sentiment":
        console.log(brain.getInputSentiment());
        break;

      case "print gradient":
        console.log(brain.getBestGradient());
        break;

      case "print match":
        var map = brain.getGradientMap();
        var bestG = brain.getBestGradient();
        var match = map[bestG];
        var humour = brain.getInputSentiment();

        if(match === undefined){
          console.log("[ERROR] Provide an input for match first!".red);
          break;
        }

        var answer = match.answer[humour];
        var inputHzd = brain.sanitize(lastInput);
        var topic = brain.getCurrentTopic();

        console.log("Input humanized: ".green+inputHzd);
        console.log("Topic: ".green+topic);
        console.log("Pattern: ".green+match.pattern);
        console.log("Humour : ".green+humour);
        console.log("Answer : ".green+answer);
        console.log("Time : ".blue+timeTaken.toString().blue);
        break;

      case "list topic":
        console.log(brain.getTopics());
        break;

      case "print topic":
        console.log(brain.getCurrentTopic());
        break;

      case "print hmap":
        var hmap = brain.getHumourMap();
        console.log(hmap);
        break;

      default:
        lastInput = line;
        timeTaken = process.hrtime();
        var out = brain.bestMatch(line);
        timeTaken = process.hrtime(timeTaken);
        console.log('>> ' + out.green);
    }

    console.log("");
    rl.prompt();

  }).on('close', function() {
    process.exit(0);
  });
};

var aionsDir = __dirname + '/../aions/';

var loadFiles = function(files) {
  var promises = [];

  files.forEach(function(file) {
    console.log('loading: ' + aionsDir + file.blue);
    promises.push(readFile(aionsDir + file));
  });

  Promise.all(promises).then(function(res) {
    var count = res.length;
    for (var item in res) {
      brain.load(JSON.parse(res[item]));
      if (item == count - 1) {
        console.log("\n");
        repl();
      }
    }
  });
};

fs.readdir(aionsDir, function(err, files) {
  if (err) {
    throw err;
  }
  loadFiles(files);
});

var jscosine = require('./../vendor/jscosine');
var fs = require('fs');

module.exports = function() {
  "use strict";

  this.map = [];
  var that = this;

  this.insert = function(aion) {
    this.map[aion.answer.neutral] = aion.pattern;
  };

  this.bestMatch = function(input) {
    /*Algorithm: Cosine similarity
    en.wikipedia.org/wiki/Cosine_similarity*/

    input = this.sanitize(input);

    var gradientMap = [];

    for (var item in this.map) {
      var gradient = jscosine.textCosineSimilarity(this.map[item], input)
      gradientMap[gradient] = item;
    }

    //Sort better gradient and return
    var gradientArray = Object.keys(gradientMap);

    console.log(gradientArray);

    gradientArray.sort();

    var best = gradientMap[gradientArray[gradientArray.length - 1]];
    console.log(best);

    return best;
  };

  this.sanitize = function(input) {
    //TODO (sanitize inputs from client)
    return input;
  };

  this.load = function(file) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      } else {
        var aion = JSON.parse(data).aion;
        for (var item in aion) {
          that.insert(aion[item]);
        }

      }
    });
  };

  this.memorize = function() {
    //TODO (learn from inputs)
  };

  this.printMap = function() {
    console.log(this.map);
  };

};


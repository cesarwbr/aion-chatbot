var jscosine = require('./../vendor/jscosine');

module.exports = function() {
  "use strict";

  this.map = [];
  var that = this;

  this.insert = function(key, value) {
    this.map[key] = value;
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

  this.load = function(json) {
    var aionArray = json.aion;

    for (var item in aionArray) {
      that.insert(aionArray[item].answer.neutral, aionArray[item].pattern);
    }
  };

  this.memorize = function() {
    //TODO (learn from inputs)
  };

  this.printMap = function() {
    console.log(this.map);
  };

};
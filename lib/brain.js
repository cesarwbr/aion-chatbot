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
      gradientMap[gradient] = {
        answer: item,
        question: this.map[item]
      };
    }

    //Sort better gradient and return
    var gradientArray = Object.keys(gradientMap).sort();

    var bestGradient = gradientArray[gradientArray.length - 1];

    console.log("BEST: " + bestGradient);

    var best = gradientMap[bestGradient].answer;

    console.log(best);

    if (bestGradient < 0.8) {
      return "Did you mean: " + gradientMap[bestGradient].question + "? Answer: " + best;
    }

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
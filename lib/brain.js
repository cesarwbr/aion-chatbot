var jscosine = require('./../vendor/jscosine');

module.exports = function() {
  "use strict";

  this.map = [];

  this.insert = function(data) {
    this.map[data.output] = data.input;
  };

  this.bestMatch = function(input) {
    /*Algorithm: Cosine similarity
    en.wikipedia.org/wiki/Cosine_similarity*/

    input = this.sanitize( input );

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

  this.sanitize = function( input ) {
    //TODO (sanitize inputs from client)
    return input;
  };

  this.load = function() {
    //TODO (load data in memory 'map')
    this.insert({
      input: "What is your name?",
      output: "My name is Teste!"
    });

    this.insert({
      input: "How are you?",
      output: "I´m fine"
    });

  };

  this.memorize = function() {
    //TODO (learn from inputs)
  };

  this.print = function() {
    console.log(this.map);
  };

};

/*var brain = new Brain();

brain.load();
brain.bestMatch("how are you?");*/
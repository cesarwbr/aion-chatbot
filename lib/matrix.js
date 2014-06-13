var jscosine = require('./../vendor/jscosine');

var Matrix = function() {

  this.map = [];

  this.insert = function(options) {
    //Coisa desnecessaria criar um metodo so pra isso hehe
    this.map[options.output] = options.input;
  };

  this.bestMatch = function(input) {
    //Algorithm: Cosine similarity
    //en.wikipedia.org/wiki/Cosine_similarity
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

  this.print = function() {
    console.log(this.map);
  };

};


//===============================================
//Testing node matrix.js

var mtx = new Matrix();
mtx.insert({
  input: "What is your name?",
  output: "My name is Teste!"
});

mtx.insert({
  input: "How are you?",
  output: "I´m fine"
});



mtx.bestMatch("how are you?");

//mtx.print();

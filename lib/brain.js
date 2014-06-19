var jscosine = require('./../vendor/jscosine'),
  psico = require("speakeasy-nlp"),
  natural = require('natural'),
  classifier = new natural.BayesClassifier();

module.exports = function() {
  "use strict";

  //HARDCODED HUMOUR MAP (FIX-ME)
  //set in profile.json
  var humourMap = [];
  humourMap["2"] = "excited";
  humourMap["1"] = "happy";
  humourMap["0"] = "neutral";
  humourMap["-1"] = "sad";
  humourMap["-2"] = "angry";

  this.map = [];
  var that = this;

  this.insert = function(topic, data) {
    this.map[topic] = data;
    for (var item in data) {
      console.log("Classying: " + data[item].pattern + " Topic: " + topic);
      classifier.addDocument(data[item].pattern, topic);
    }
    classifier.train();
  };

  this.bestMatch = function(input) {

    input = this.sanitize(input);
    var inputSentiment = that.sentiment(input);

    var gradientMap = [],
      //Classify topic
      currentTopic = that.classify(input),
      mapTopic = this.map[currentTopic];

    for (var item in mapTopic) {
      var gradient = jscosine.textCosineSimilarity(mapTopic[item].pattern, input);

      gradientMap[gradient] = {
        answer: mapTopic[item].answer,
        question: mapTopic[item].pattern
      };
    }

    //Sort better gradient and return
    var gradientArray = Object.keys(gradientMap).sort();

    var bestGradient = gradientArray[gradientArray.length - 1];

    console.log("BEST GRADIENT: " + bestGradient);

    //FIX ME (maybe 2 is not a good number..)
    inputSentiment = inputSentiment < -2 ? -2 : inputSentiment;
    inputSentiment = inputSentiment > 2 ? 2 : inputSentiment;


    var answerSentiment = humourMap[inputSentiment];
    var best = gradientMap[bestGradient].answer[answerSentiment];

    if (bestGradient < 0.8) {
      return "Did you mean: " + gradientMap[bestGradient].question + "? Answer: " + best;
    }
    return best;
  };

  this.classify = function(input) {
    return classifier.classify(input);
  };

  this.sentiment = function(input) {
    return psico.sentiment.analyze(input).score;
  };

  this.sanitize = function(input) {
    //TODO (sanitize inputs from client)
    return input;
  };

  this.load = function(json) {
    var topic = Object.keys(json)[0];
    that.insert(topic, json[topic]);
  };

  this.memorize = function() {
    //TODO (learn from inputs)
  };

  this.printMap = function() {
    console.log(this.map);
  };

};

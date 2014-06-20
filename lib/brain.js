var jscosine = require('./../vendor/jscosine'),
  psico = require("speakeasy-nlp"),
  natural = require('natural'),
  _ = require('underscore'),
  classifier = new natural.BayesClassifier();

_.mixin(require('underscore.inflections'));

module.exports = function() {
  "use strict";

  //HARDCODED HUMOUR MAP (FIX-ME)
  //set in profile.json
  var humourMap = {};
  humourMap["2"] = "excited";
  humourMap["1"] = "happy";
  humourMap["0"] = "neutral";
  humourMap["-1"] = "sad";
  humourMap["-2"] = "angry";

  this.topicMap = [];

  var gradientArray = [],
    gradientMap = {},
    bestGradient,
    currentTopic,
    inputSentiment,
    that = this;

  this.insert = function(topic, data) {
    this.topicMap[topic] = data;

    _.map(data, function(item) {
      classifier.addDocument(item.pattern, topic);
    });

    classifier.train();
  };

  this.bestMatch = function(input) {

    input = this.sanitize(input);
    inputSentiment = that.sentiment(input);

    //Classify topic
    currentTopic = that.classify(input);
    var dataTopic = this.topicMap[currentTopic];

    _.map(dataTopic, function(item) {
      var gradient = jscosine.textCosineSimilarity(item.pattern, input);
      gradientMap[gradient] = {
        answer: item.answer,
        pattern: item.pattern
      };

    });

    gradientArray = Object.keys(gradientMap);

    bestGradient = _.max(gradientArray);

    //FIX ME (maybe 2 is not a good number..)
    inputSentiment = inputSentiment < -2 ? -2 : inputSentiment;
    inputSentiment = inputSentiment > 2 ? 2 : inputSentiment;

    var answerSentiment = humourMap[inputSentiment] === undefined ? 'neutral' : humourMap[inputSentiment];

    var best = gradientMap[bestGradient].answer[answerSentiment];

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
    return _.humanize(input);
  };

  this.load = function(json) {
    var topic = Object.keys(json)[0];
    that.insert(topic, json[topic]);
  };

  this.memorize = function() {
    //TODO (learn from inputs)
  };

  this.getHumourMap = function() {
    return humourMap;
  };

  this.getGradientArray = function() {
    return gradientArray;
  };

  this.getBestGradient = function() {
    return bestGradient;
  };

  this.getTopics = function() {
    return Object.keys(that.topicMap);
  };

  this.getCurrentTopic = function() {
    return currentTopic;
  };

  this.getInputSentiment = function() {
    return humourMap[inputSentiment];
  };

  this.getGradientMap = function(){
    return gradientMap;
  };

};

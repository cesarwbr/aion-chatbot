var xmlParser = require('xml2json');

var exports = module.exports;

exports.aiml = function(aiml) {

  var jsonData = xmlParser.toJson(aiml);
  jsonData = JSON.parse(jsonData);

  var categories = jsonData.aiml.category,
      aion = {aion: []},
      i = 0,
      categoriesLen = categories.length;

  for (i = 0; i < categoriesLen; i++) {
    var category = categories[i];
    if (typeof category.template === 'string') {
      aion.aion.push({
        pattern: category.pattern,
        answer: {
          neutral: category.template
        }
      });
    }
  }

  return aion;
};

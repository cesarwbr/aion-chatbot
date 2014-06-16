var xmlParser = require('xml2json');

var exports = module.exports;

exports.aiml = function(aiml) {

  var jsonData = xmlParser.toJson(aiml),
      aion = {aion: []};

  jsonData = JSON.parse(jsonData);

  if (!jsonData.aiml || !jsonData.aiml.category) {
    return aion;
  }

  var categories = jsonData.aiml.category,
      i = 0,
      categoriesLen = categories.length;

  for (i = 0; i < categoriesLen; i++) {
    var category = categories[i];
    if (typeof category.template === 'string' && typeof category.pattern === 'string') {
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

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/streamfilterdb');

var schema = new mongoose.Schema({ source: { id: String, name: String },
      date: String,
      author: [String],
      title: String,
      description: String,
      links: [String],
      publisher: String,
      url: String,
      urlToImage: String,
      publishedAt: String,
      content: String,
      isRelevant: Boolean
  });

var LineItem = mongoose.model('LineItem', schema);

module.exports = LineItem; // this is what you want


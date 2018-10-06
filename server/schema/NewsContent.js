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
      queryTerm: String
  });

var NewsContent = mongoose.model('NewsContent', schema);

module.exports = NewsContent; // this is what you want


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('ca1262bfa3ff48b293d32126af29f124');
var axios = require('axios');
var extractor = require('unfluff');
var NewsContent = require('../schema/NewsContent');

module.exports  = {
  getArticleRows: function(queryTerm) {
    let currentDate = new Date(Date.now());
    var yesterday = new Date(Date.now() - 86400000);
    return newsapi.v2.everything({
      q: queryTerm,
      from: yesterday,
      to: currentDate,
      language: 'en',
      sortBy: 'relevancy',
      page: 2
    }).then(response => {
        response.articles.forEach(function(resItem){
            let uri = resItem.url;
            
            axios.get(uri).then(function(queryResponse){
                let htmlData = extractor(queryResponse.data);
                resItem['content'] = htmlData.text;
                
                var content = new NewsContent(resItem);
                content.save(function (err, res) {
                  if (err) {
                      console.log(err);
                  }
                  console.log(res);
                });

            }, resItem);
        })
      return response;
    });
  }    
}
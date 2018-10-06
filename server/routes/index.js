var express = require('express');
var router = express.Router();

var QueryNewsSource = require('../models/QueryNewsSource');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Endpoint to query an external aggregation api
 **/
router.get('/aggregate-news', function(req, res){
    QueryNewsSource.getArticleRows("ethereum").then(function(response){
       res.send({"data": "success"}); 
    });
});

module.exports = router;

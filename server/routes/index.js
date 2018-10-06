var express = require('express');
var router = express.Router();

var QueryNewsSource = require('../models/QueryNewsSource');
var NewsLines = require("../models/NewsLines");


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


router.get("/raw-news-lines", function(req, res){
   NewsLines.getRawLines("ethereum").then(function(response){
       res.send({"data": response});
   });
});

module.exports = router;

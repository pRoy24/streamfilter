var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors')
var app = express()

app.use(cors())
var NewsLines = require('./models/NewsLines');

var Web3 = require('web3');
var schedule = require('node-schedule');
require('dotenv').config()

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'http://34.220.70.126:7545');


var contract1 = new web3.eth.Contract( [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contentsFinalizedStatus",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "contents",
      "outputs": [
        {
          "name": "accuracyScore",
          "type": "uint8"
        },
        {
          "name": "status",
          "type": "uint8"
        },
        {
          "name": "ballotCount",
          "type": "uint16"
        },
        {
          "name": "stakedAmount",
          "type": "uint256"
        },
        {
          "name": "closeAt",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getBallots",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "name": "accuracy",
                  "type": "uint8"
                },
                {
                  "name": "relevant",
                  "type": "uint8"
                }
              ],
              "name": "evaluationScore",
              "type": "tuple"
            },
            {
              "name": "stakingAmount",
              "type": "uint256"
            },
            {
              "name": "player",
              "type": "address"
            },
            {
              "name": "createdAt",
              "type": "uint256"
            }
          ],
          "name": "",
          "type": "tuple[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getAccuracyScore",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getStakedAmount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getBallotCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getRewardWonPlayers",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "getCloseAt",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "isClosed",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        },
        {
          "name": "accuracy",
          "type": "uint8"
        },
        {
          "name": "relevant",
          "type": "uint8"
        },
        {
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ballot",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "contentID",
          "type": "uint256"
        }
      ],
      "name": "calcScoreAndSendRewardsIfNeeded",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], process.env.CONTRACT_ADDRESS, {
    from: process.env.USER_ADDRESS, // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

// Start async smart contract calls for giving rewards 
// Dispense rewards hourly
var j = schedule.scheduleJob('0 * * * *', function(){
  NewsLines.dispenseRewards(contract1);
});



// Start a scheduled process which queries all posts sequentially and gives out awards if due




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

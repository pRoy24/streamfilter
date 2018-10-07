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

const Web3 = require('web3'); const web3 = new Web3(new Web3.providers.HttpProvider("http://34.217.192.198:7545/"));

web3.eth.defaultAccount = web3.eth.accounts[1];


var MyContract = new web3.eth.Contract([
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
              "name": "user",
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
        },
        {
          "components": [
            {
              "name": "targetUser",
              "type": "address"
            },
            {
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "rewards",
          "type": "tuple[]"
        }
      ],
      "name": "sendRewards",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ])


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

var express = require('express');
var path = require('path');
var logger = require('morgan');
var config = require('./config/config');
var cors = require('cors');
var authRoute = require('./routes/auth.route');
var userRoute = require('./routes/user.route');
var productRoute = require('./routes/product.route');
var apiRoute = require('./routes/api.route');
require('./config/db.config');

var authenticate = require('./middlewares/authenticate');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use('/api', apiRoute);
app.use('/auth', authRoute);
app.use('/user', authenticate, userRoute);
app.use('/products', authenticate, productRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return next({
        message: 'not found',
        status: 404,
    })
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 400).json({
        status: err.status || 400,
        message: err.message
    });
});

app.listen(config.port, function (err, done) {
    if (err) {
        console.log('error in listening');
        return;
    }
    console.log('listening in port: ', config.port);
})
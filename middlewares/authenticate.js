var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var UserModel = require('./../models/user.model');


module.exports = function (req, res, next) {
    if (req.headers['x-access-token']) {
        var token = req.headers['x-access-token']
    }
    if (req.headers['token']) {
        var token = req.headers['token'];
    }
    if (req.headers['authorization']) {
        var token = req.headers['authorization'];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, function (err, verified) {
            if (err) return next(err);
            UserModel.findById(verified.id, function (err, user) {
                if (err) return next(err);
                if (user) {
                    req.loggedinUser = user;
                    return next();
                } else {
                    return next({
                        message: 'user no found'
                    })
                }
            });
        });
    } else {
        return next({
            message: 'token not provided'
        })
    }
}
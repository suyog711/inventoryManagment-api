var express = require('express');
var router = express.Router();
var UserModel = require('./../models/user.model');
var passwordHash = require('password-hash');
var mapUser = require('./../helpers/mapUserReq');
var config = require('./../config/config');
var generateToken = require('./../helpers/createToken');


/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('login', { message: req.query.message || '' });
});
router.post('/login', function (req, res, next) {
    UserModel.findOne({
        username: req.body.username,
    })
        .exec(function (err, user) {
            if (err) return next(err);
            if (user) {
                if (!user.activeStatus) {
                    return next({
                        message: 'Account not activated. Please activate account'
                    })
                }
                var isMatch = passwordHash.verify(req.body.password, user.password)
                if (isMatch) {
                    var token = generateToken.createToken({ name: user.name, id: user._id }, config.jwtSecret)
                    res.json({
                        user: user,
                        token: token
                    });
                } else {
                    return next({
                        message: 'invalid login credentials'
                    })
                }
            } else {
                return next({
                    message: 'invalid login credentials'
                })
            }
        })
});
router.get('/register', function (req, res, next) {
    res.render('register', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
    var newUser = new UserModel({});
    var newMappedUser = mapUser(newUser, req.body);
    newMappedUser.save(function (err, saved) {
        if (err) return next(err);
        res.json(saved);
    })

    // res.redirect('/auth/login?message=registration successful please login')
});

module.exports = router;

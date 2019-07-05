var express = require('express');
var router = express.Router();
var UserModel = require('./../models/user.model');
var authorize = require('./../middlewares/authorize');
var mapUser = require('./../helpers/mapUserReq');

router.route('/')
    .get(function (req, res, next) {
        UserModel.find({})
            .sort({
                _id: -1
            })
            .exec(function (err, done) {
                if (err) return next(err);
                res.json(done);
            })
    })

router.route('/:id')
    .get(function (req, res, next) {
        UserModel.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            if (user) {
                res.json(user);
            } else {
                return next({
                    message: 'user not found'
                })
            }
        })
    })
    .put(function (req, res, next) {
        UserModel.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            if (user) {
                var updatedUser = mapUser(user, req.body)
                updatedUser.updatedBy = req.loggedinUser.name;
                updatedUser.save(function (err, updated) {
                    if (err) return next(err)
                    res.json(updated);
                })
            } else {
                return next({
                    message: 'user not found'
                })
            }
        })
    })
    .delete(authorize, function (req, res, next) {
        UserModel.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            if (user) {
                user.remove(function (err, removed) {
                    if (err) return next(err);
                    res.json(removed);
                })
            } else {
                return next({
                    message: 'user not found'
                })
            }
        })
    })

module.exports = router;

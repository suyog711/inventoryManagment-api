var express = require('express');
var router = express.Router();
var ProductModel = require('./../components/products/models/product.model');
var mapProduct = require('./../components/products/helpers/mapProductReq');
var multer = require('multer');
var fs = require('fs');
var path = require('path');


var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, './public/images');
    }
});

function filter(req, file, cb) {
    if (file.mimetype.split('/')[0] == 'image') {
        cb(null, true);
    } else {
        req.fileError = true;
        cb(null, false);
    }

}

var upload = multer({
    storage: storage,
    fileFilter: filter
})
// var upload = multer({
//     dest: './public/images'
// })

router.route('/')
    .get(function (req, res, next) {
        condition = {};
        if (req.loggedinUser.role == 2) {
            condition.createdBy = req.loggedinUser._id;
        }
        ProductModel.find(condition)
            .populate('createdBy', {
                username: 1,
                name: 1
            })
            .sort({
                _id: -1
            })
            .exec(function (err, products) {
                if (err) return next(err);
                res.json(products);
            })
    })
    .post(upload.single('image'), function (req, res, next) {
        if (req.fileError) {
            return next({
                message: 'invalid file format'
            })
        }
        var newProduct = new ProductModel({});
        console.log('req body>>', req.body);
        console.log('req file>>', req.file);
        console.log('warranty>>', req.body.warranty.status);

        mapProduct(newProduct, req.body);
        // if (req.file) {
        //     if (req.file.mimetype.split('/')[0] !== 'image') {
        //         fs.unlink(path.join(process.cwd(), './public/images/' + req.file.filename), function (err, done) {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log('done', done);
        //             }
        //         })
        //         return next({
        //             message: 'invalid file format'
        //         });
        //     } else {
        //         newProduct.image = req.file.filename;
        //     }
        // }
        if (req.file) {
            newProduct.image = req.file.filename;
        }
        console.log('new product>>', newProduct);
        newProduct.createdBy = req.loggedinUser._id;
        // res.json(newProduct);
        newProduct.save(function (err, saved) {
            if (err) return next(err);
            res.json(saved);
        })
    });

router.route('/search')
    .get(function (req, res, next) {
        var condition = {};
        // console.log('in search post req body', req.body);
        var searchCondition = mapProduct(condition, req.query);
        // console.log('in search post',searchCondition,condition);
        ProductModel.find(searchCondition, function (err, product) {
            if (err) return next(err);
            res.json(product);
        })
    })
    .post(function (req, res, next) {
        console.log(req.body)
        var condition = {};
        // console.log('in search post req body', req.body);
        var searchCondition = mapProduct(condition, req.body);

        if (req.body.maxPrice) {
            searchCondition.price = {
                $lte: req.body.maxPrice
            }
        }
        if (req.body.minPrice) {
            searchCondition.price = {
                $gte: req.body.minPrice
            }
        }
        if (req.body.maxPrice && req.body.minPrice) {
            searchCondition.price = {
                $lte: req.body.maxPrice,
                $gte: req.body.minPrice
            }
        }
        if (req.body.fromDate && req.body.toDate) {
            var fromDate = new Date(req.body.fromDate).setHours(0, 0, 0, 0);
            var toDate = new Date(req.body.toDate).setHours(23, 59, 0, 0);
            searchCondition.createdAt = {
                $lte: new Date(toDate),
                $gte: new Date(fromDate)
            }
        }
        if (req.body.colors) {
            searchCondition.colors = {
                $in: req.body.colors.split(',')
            }
        }

        if (req.body.tags) {
            searchCondition.tags = {
                $in: req.body.tags.split(',')
            }
        }
        console.log('in search post', searchCondition);
        ProductModel.find(searchCondition, function (err, product) {
            if (err) return next(err);
            res.json(product);
        })
    });

router.route('/:id')
    .get(function (req, res, next) {
        ProductModel.findById(req.params.id, function (err, product) {
            if (err) return next(err);
            if (product) {
                res.json(product);
            } else {
                return next({
                    message: 'product not found'
                })
            }
        })
    })
    .put(upload.single('image'), function (req, res, next) {
        if (req.fileError) {
            return next({
                message: 'invalid file format'
            })
        }
        ProductModel.findById(req.params.id, function (err, product) {
            if (err) return next(err);
            if (product) {
                var oldImage = product.image;
                mapProduct(product, req.body);
                if (req.file) {
                    product.image = req.file.filename;
                }
                if (req.body.ratings) {
                    product.ratings.push({
                        point: req.body.ratingsPoint,
                        message: req.body.ratingsMessage,
                        byUser: req.loggedinUser._id,
                        productRef: product._id
                    })
                }
                product.save(function (err, saved) {
                    if (err) return next(err);
                    fs.unlink(path.join(process.cwd(), './public/images/' + oldImage), function (err, done) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('done');
                        }
                    })
                    res.json(saved);
                })
            } else {
                return next({
                    message: 'product not found'
                })
            }

        })
    })
    .delete(function (req, res, next) {
        ProductModel.findByIdAndDelete(req.params.id, function (err, deleted) {
            if (err) return next(err);
            res.json(deleted);
        })

    });

module.exports = router;
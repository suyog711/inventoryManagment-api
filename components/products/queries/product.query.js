var ProductModel = require('./../models/product.model');
var mapProduct = require('./../helpers/mapProductReq');

function insert(data) {
    return new Promise(function (resolve, reject) {
        var newProduct = new ProductModel;
        mapProduct(newProduct, data);
        newProduct.save(function (err, saved) {
            if (err) {
                reject(err);
            } else {
                resolve(saved);
            }
        })
    })
}

function find(condition, cb) {
    ProductModel.find(condition)
        .exec(function (err, product) {
            if (err) {
                cb(err);
            } else {
                cb(null, product);
            }
        })
}

function update(id, data) {
    return new Promise(function (resolve, reject) {
        ProductModel.findById({ _id: id })
            .exec(function (err, product) {
                if (err) {
                    reject(err);
                }
                if (product) {
                    mapProduct(product, data);
                    product.save(function (err, saved) {
                        if (err) {
                            reject(err);
                        }
                        resolve(saved);
                    })
                } else {
                    reject({
                        message: 'product not found'
                    })
                }
            })
    })
}

function remove(id) {
    return new Promise(function (resolve, reject) {
        ProductModel.findByIdAndRemove(id)
            .exec(function (err, done) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(done);
                }
            })
    })
}

module.exports = {
    insert, update, remove, find
}
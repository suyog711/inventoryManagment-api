var productQueries = require('./../queries/product.query');

function getAllProducts(req, res, next) {
    var condition = {}
    if (req.loggedinUser.role != 1) {
        condition.createdBy = req.loggedinUser._id;
    }
    productQueries.find(condition, function (err, product) {
        if (err) return next(err);
        res.status(200);
        res.json(product);
    });
};

function getById(req, res, next) {
    var id = req.params.id;
    var condition = {
        _id: id
    }
    productQueries.find(condition, function (err, product) {
        if (err) return next(err);
        res.status(200);
        res.json(product[0]);
    })

};

function createNewProduct(req, res, next) {
    var data = req.body;
    data.createdBy = req.loggedinUser._id;
    productQueries.insert(data)
        .then(function (done) {
            res.status(200).json(done);
        })
        .catch(function (err) {
            next(err);
        })
};

function updateProduct(req, res, next) {
    productQueries.update(req.params.id, req.body)
        .then(function (updated) {
            res.status(200).json(updated);
        })
        .catch(function (error) {
            next(err);
        });
};

function removeProduct(req, res, next) {
    productQueries.remove(req.params.id)
        .then(function (result) {
            res.status(200).json(updated);
        })
        .catch(function (err) {
            next(err);
        });
};

function search(req, res, next) {

};
module.exports = {
    getAllProducts, getById, createNewProduct, updateProduct, removeProduct, search

}






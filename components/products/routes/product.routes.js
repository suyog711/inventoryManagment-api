var express = require('express');
var router = express.Router();
var productController = require('./../controllers/product.ctrl');
var authenticate = require('./../../../middlewares/authenticate')

router.route('/')
    .get(authenticate, productController.getAllProducts)
    .post(productController.createNewProduct);

router.route('/search')
    .get(productController.search)
    .post(productController.search)

router.route('/:id')
    .get(productController.getById)
    .put(productController.updateProduct)
    .delete(productController.removeProduct)

module.exports = router;
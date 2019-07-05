var router = require ('express').Router();
var productRoute = require('./../components/products/routes/product.routes');
//load component here

router.use('/products', productRoute);
module.exports = router;
module.exports = function (newProduct, productDetails) {
    if (productDetails.name)
        newProduct.name = productDetails.name
    if (productDetails.category)
        newProduct.category = productDetails.category
    if (productDetails.brand)
        newProduct.brand = productDetails.brand
    if (productDetails.description)
        newProduct.description = productDetails.description
    if (productDetails.quantity)
        newProduct.quantity = productDetails.quantity
    if (productDetails.price)
        newProduct.price = productDetails.price
    if (productDetails.status)
        newProduct.status = productDetails.status
    if (productDetails.modelNo)
        newProduct.modelNo = productDetails.modelNo
    if (productDetails.tags) {
        var tags = productDetails.tags.split(',');
        newProduct.tags = tags;
    }
    if (productDetails.colors) {
        var colors = productDetails.colors.split(',');
        newProduct.colors = colors;
    }
    if (productDetails.warranty.status) {
        newProduct.warranty = {
            status: productDetails.warranty.status,
            warrantyPeriod: productDetails.warranty.warrantyPeriod,
            warrantyDescription: productDetails.wwarranty.arrantyDescription
        }
    }


    return newProduct;
}
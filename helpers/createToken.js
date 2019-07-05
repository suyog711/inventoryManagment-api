var jwt = require('jsonwebtoken');


function createToken(data, secretKey, expTime = false) {
    var token;
    if (expTime) {
        token = jwt.sign(data, secretKey, {
            expiresIn: '60'
        });
    }else{
        token = jwt.sign(data, secretKey);
    }
    return token;

}
module.exports = {
    createToken
}
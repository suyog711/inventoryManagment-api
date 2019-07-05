

module.exports = function (req, res, next) {
    if (req.loggedinUser.role == 1) {
        return next();
    }else{
        return next({
            message: 'no privilege'
        });
    }
}
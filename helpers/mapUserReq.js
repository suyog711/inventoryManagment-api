var passwordHash = require('password-hash');

module.exports = function (user, userDetails) {
    if (userDetails.name) user.name = userDetails.name;
    if (userDetails.username) user.username = userDetails.username;
    if (userDetails.password) user.password = passwordHash.generate(userDetails.password);
    if (userDetails.phoneNumber) user.phoneNumber = userDetails.phoneNumber;
    if (userDetails.email) user.email = userDetails.email;
    if (userDetails.gender) user.gender = userDetails.gender;
    if (userDetails.role) user.role = userDetails.role;
    if (user.activeStatus != userDetails.activeStatus) {
        user.activeStatus = userDetails.activeStatus
    }
    return user;
}
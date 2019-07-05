var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    point: Number,
    productRef: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
        timestamps: true
    });

var RatingModule = mongoose.model('ratings', RatingSchema);
module.exports = RatingModule;
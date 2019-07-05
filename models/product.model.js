var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
    point: Number,
    productRef: {
        type: Schema.Types.ObjectId,
        ref: 'products',
    },
    message: String,
    byUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

var ProductSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    brand: {
        type: String,
    },
    description: {
        type: String
    },
    quantity: String,
    price: Number,
    image: String,
    status: {
        type: String,
        enum: ['available', 'out of stock'],
        default: 'available',
    },
    colors: [String],
    modelNo: String,
    ratings: [ratingSchema],
    warranty: {
        status: {
            type: String
        },
        warrantyPeriod: String,
        warrantyDescription: String,
    },
    tags: [String],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    }

}, {
    timestamps: true
});

var ProductModule = mongoose.model('products', ProductSchema);
module.exports = ProductModule;
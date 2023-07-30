const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please enter FirstName']
    },
    price: {
        type: Number,
        required: [true, 'Please enter LastName']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product', ProductSchema)
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter FirstName']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter LastName']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('MakeUpuser', UserSchema)
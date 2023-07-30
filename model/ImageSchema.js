const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: [true, 'Please select image']
    },
    ImagePath: {
        type: String,
        required: [true, 'Please enter LastName']
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'MakeUpuser',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Image', ImageSchema)
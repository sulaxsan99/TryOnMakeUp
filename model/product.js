const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true,
        maxLength: [100, "product cannot be lessa than 100 characters"]
    },
   
    ImagePath: {
        type: String,
        required: [true, 'Please enter LastName']
    },
    Available: {
        type: Number,
        required: true,
        default: 0.0,
    },
     image: { 
                type:String,
                required:true
              } 
    ,
    // user: {
    //     type : mongoose.Schema.Types.ObjectId
    // }
    // ,
    createdAt:{
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('MakeUpProducts',productSchema)
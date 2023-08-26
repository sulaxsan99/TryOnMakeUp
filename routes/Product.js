const express = require('express')
const router = express.Router();
const productSchema = require('../model/product')
const multer = require('multer');

const {getAllProduct,deleteProduct,GetSingleProduct,UpdateProduct} = require('../Controller/Product')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './products/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body)
        console.log("file", req.file)
        const existingProduct = await productSchema.findOne({ name: req.body.name })
        // console.log(existingUser)
        if (existingProduct) {
            return res.status(400).json("product  already exists");
        }
        const postData = await new productSchema({
            name: req.body.name,
            Available: req.body.Available,
            ImagePath: req.file.path,
            image: req.file.originalname,
        });
        const postUser = await postData.save();
        if (postUser) {
            return res.status(200).json("product successfully");
        }
    } catch (error) {
        res.status(200).json({ message: "failed to create product", error })
    }
})

router.get('/getAllPoduct',getAllProduct )
router.delete('/deleteProduct/:id',deleteProduct)
router.put('/update/:id',UpdateProduct)
router.get('/singlePro/:id',GetSingleProduct)
module.exports = router 
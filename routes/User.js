const express = require('express')
const router = express.Router();
const UserSchema = require('../model/UserSchema')
const { hashPassword, validPassword, generateToken, TokenValidator, decodeToken, validateToken, } = require('../utils/helper')
const multer = require('multer');
const imageSchema = require('../model/ImageSchema')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');

const {CreateUser,UserLogin,GetUserDetail,forgotpassword,resetpassword,getAllImages} = require('../Controller/User')

router.post('/register',CreateUser)
router.post("/login", UserLogin);

router.get("/detail",GetUserDetail);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('filename'), async (req, res) => {
    try {
        // console.log(req.file)
        const { filename, path } = req.file;
        // console.log(filename)
        const { userid } = req.body;
        const newImage = new imageSchema({
            filename,
            ImagePath: path,
            userid,
        });

        await newImage.save();
        res.status(200).send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading image');
    }
});



// Get all images endpoint
router.get('/images',getAllImages);
router.post('/forgot-password',forgotpassword)
router.post('/reset-password/:id/:token', resetpassword)


module.exports = router 
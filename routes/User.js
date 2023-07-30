const express = require('express')
const router = express.Router();
const UserSchema = require('../model/UserSchema')
const { hashPassword, validPassword, generateToken, TokenValidator, decodeToken, validateToken, } = require('../utils/helper')
const multer = require('multer');
const imageSchema = require('../model/ImageSchema')
router.post('/register', async (req, res) => {
    try {
        const existingUser = await UserSchema.findOne({ email: req.body.email })
        // console.log(existingUser)
        if (existingUser) {
            return res.status(400).json("email already exists");
        }
        const hashPwd = await hashPassword(req.body.password);
        const postData = await new UserSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPwd,
        });
        const postUser = await postData.save();
        if (postUser) {
            return res.status(200).json("Registered successfully");
        }
    } catch (error) {
        res.status(200).json({ message: " account Created failed", error })
    }
})



router.post("/login", async (req, res) => {
    try {
        const validData = await UserSchema.findOne({ email: req.body.email });
        if (!validData) {
            return res.status(400).json("Invalid email");
        }

        const validPass = await validPassword(req.body.password, validData);

        if (validPass) {
            const userToken = await generateToken(validData);

            res.header(process.env.TOKEN_KEY, userToken).json({ "userToken": userToken, validData, message: "Account Login successfully" });
        } else {
            return res.status(400).json("Invalid password");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/detail", validateToken, async (req, res) => {
    try {
        const uid = decodeToken(req.headers.makeover)?._id;
        const user = await UserSchema.findOne({ _id: uid })
            .select("-password")
            .exec();

        //   const board = await BoardSchema.findOne({ uid }).exec();

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
});


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
router.get('/images',async (req, res) => {
    try {
        const images = await imageSchema.find({}, 'filename');
        res.status(200).json(images);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching images');
      }
  });
  


module.exports = router 
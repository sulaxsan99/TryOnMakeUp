const UserSchema =require('../model/UserSchema')
const { hashPassword, validPassword, generateToken, TokenValidator, decodeToken, validateToken, } = require('../utils/helper')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const imageSchema = require('../model/ImageSchema')

exports.CreateUser= async (req, res) => {
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
}


exports.UserLogin= async (req, res) => {
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
}

exports.GetUserDetail =  validateToken, async (req, res) => {
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
}

exports.getAllImages = async (req, res) => {
    try {
        const images = await imageSchema.find({}, 'filename');
        res.status(200).json(images);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching images');
    }
}


exports.forgotpassword =  async (req, res) => {
    const { email } = req.body;
    console.log(req.body)

    const user = await UserSchema.findOne({ email: email });
    if (!user) {
        return res.status(400).json("Invalid email");
    }

    const token = jwt.sign({ id: user._id }, "makeover", { expiresIn: "1d" })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 's.mahan19com@gmail.com',
            pass: 'rvtlnrkiaxaluggi'
        }
    });
    var mailOptions = {
        from: 's.mahan19com@gmail.com',
        to: email,
        subject: 'Reset Password Link',
        text: `http://localhost:3000/reset-password?id=${user._id}&token=${token}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send({ Status: "Success" })
        }
    })
}

exports.resetpassword = async (req, res) => {
    const { id, token } = req.params
    const { password } = req.body
    console.log(req.body)
    console.log(req.params)

    try {
        const valid =  TokenValidator(token)
        if (valid) {
            const decoded =  decodeToken(token)
            if (!decoded) {
                return res.status(403).json({ Status: "Error with token" })
            } else {
                const pass = await hashPassword(password);
                const passUpdate = await UserSchema.findByIdAndUpdate({ _id: id }, { password: pass })
                if (!passUpdate) {
                    return res.status(403).json("password not updated")
                } else {
                    return res.status(200).json("successfully password updated")
                }
            }
        }else{
            return res.status(403).json("invalid token ")
        }
    } catch (error) {
        console.log(error)
    }
}
const express = require('express')

const productSchema = require('../model/product')
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './products/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

exports.createProduct= upload.single('image'), async (req, res) => {
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
}



exports.getAllProduct = async (req, res) => {
    try {
        const allProducts = await productSchema.find();
        return res.status(200).json({
            allProducts,
        });

    } catch (error) {
        console.log(error)
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const deleteProduct = await productSchema.findById(req.params.id);
        if (!deleteProduct) {
            return res.status(400).json("Product not found");
        }
        const dpro = await productSchema.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "product deleted successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

exports.GetSingleProduct=async(req,res)=>{
    try {
        const oneproduct = await productSchema.findById(req.params.id)
    if (!oneproduct) {
        return res.status(400).json("Product not found");
    }
    res.status(201).json({
        success: true,
        oneproduct
    })
    } catch (error) {
        
    }
}

exports.UpdateProduct = async(req,res)=>{
    try {
      console.log(req.body)
      const oneproduct = await productSchema.findById(req.params.id)
      if (!oneproduct) { 
          return res.status(400).json("Product not found");
      }
      const updateProduct = await productSchema.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      })
      res.status(201).json({
          success: true,
          updateProduct
      })
    } catch (error) {
      console.log(error)
    }
  }
const express = require('express')
const app  = express();
const path =require('path')
const DB = require('./Dbconnection')
const mongoose = require('mongoose');
const userRoute = require('./routes/User')
const productRoute= require('./routes/Product')
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config()

app.use('/api/user',userRoute)
app.use('/api/admin',productRoute)
DB();

app.listen(5000 ||  process.env.PORT , () => {
    console.log(`Port listen in ${process.env.PORT}`);
});

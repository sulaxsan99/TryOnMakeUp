const express = require('express')
const app  = express();
const DB = require('./Dbconnection')
const mongoose = require('mongoose');
const userRoute = require('./routes/User')
const cors = require('cors')
app.use(express.json())
app.use(cors())
require('dotenv').config()

app.use('/api/user',userRoute)
DB();

app.listen(5000 ||  process.env.PORT , () => {
    console.log(`Port listen in ${process.env.PORT}`);
});

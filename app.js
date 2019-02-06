const express = require('express'); //use express
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose'); //use the Mongoose ODM

const app = express(); 

//db configuration
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{ userNewUrlParser:true})
    .then(() => console.log('Connected to mongodb successfully!'))
    .catch(err => console.log(err));

//use embedded js as the template engine
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser middleware
app.use(express.urlencoded({extended:false}));

//routes
app.use('/',require('./routes/index')); //index
app.use('/users',require('./routes/users'));//login and register

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));


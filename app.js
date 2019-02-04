const express = require('express'); //use express
const expressLayouts = require('express-ejs-layouts');

const app = express(); 

//use embedded js as the template engine
app.use(expressLayouts);
app.set('view engine','ejs');

//routes
app.use('/',require('./routes/index')); //index
app.use('/users',require('./routes/users'));//login and register

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));


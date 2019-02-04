const express = require('express');
const router = express.Router(); //using express routers

router.get('/',(req,res)=>res.render('welcome'));

module.exports = router;
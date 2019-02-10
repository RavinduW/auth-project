const express = require('express');
const router = express.Router(); //using express routers
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User'); //User model

//login route
router.get('/login',(req,res)=>res.render('login'));

//register route
router.get('/register',(req,res)=>res.render('register'));

router.post('/register',(req,res)=>{
    const{name,email,password,confirm_password} = req.body;
    let errors = []; //let variable type is introduced since ES2015. this is limited to a scope.

    //check required fields
    if(!name || !email || !password || !confirm_password){
        errors.push({msg:'Please fill in all fields'});
    }

    //check the password length
    if(password.length < 6 && password.length>0){
        errors.push({msg: 'Password should be at least 6 characters'});
    } 

    //check the passwords match
    if(password !== confirm_password){
        errors.push({msg:'Passwords do not match'});
    } 

    //check if there is any error occured
    if(errors.length >0){
        res.render('register',{
            errors,name,email,password,confirm_password
        });

        //res.redirect('/users/register');
    }else{ //no validation errors
        User.findOne({email:email}) //mongoose to find data
            .then(user =>{
                if(user){ //find if the particular email is existing
                    errors.push({msg: 'Email is already taken'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        confirm_password
                    }); 
                }else{
                    const newUser = new User({ //make a new User model
                        name,
                        email,
                        password
                    }); 

                    //hashing the password
                    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;

                        //set password to hashed
                        newUser.password = hash;

                        //save user
                        newUser.save()
                            .then(user =>{
                                req.flash('success_msg','You are registered.Now you can logged in.')
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));    
                    }));

                    console.log('New User is registered');
                }
            });
        
    }
});

//login
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
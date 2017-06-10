const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Process
router.post('/register', (req,res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('email', 'email is not valid').isEmail();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors) {
    // flash message test
    req.flash('danger', errors);
	  res.render('register', {
      errors: errors
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(newUser.password, salt, (err, hash)=>{
         if(err){
           console.log(err);
         }
         newUser.password = hash
         newUser.save((err) => {
           if(err){
             console.log(err);
             return;
           } else {
             req.flash('success', 'You are new registered and can log in');
             res.redirect('/users/login');
           }
         });
       });
    });
  }
});
// Login Form
router.get('/login', function(req, res){
  res.render('login');
});
/*
router.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/);
    });
  })(req, res, next);
});
*/
// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Cheerio! you are logged out');
  res.redirect('/');
})


router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});
/* Login Process

router.post('/login',
  passport.authenticate('local', {
     successRedirect: '/',
     failureRedirect: '/login',
     failureFlash: true })
);
*/

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;

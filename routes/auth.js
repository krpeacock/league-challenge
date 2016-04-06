const express = require("express");
const router = express.Router()
const authHelpers = require("../helpers/authHelpers")
const passwordHelpers = require("../helpers/passwordHelpers")
const knex = require("../db/knex");
var passport = require("passport");

router.get('/signup', authHelpers.preventLoginSignup, function(req,res){
    res.render('auth/signup', {message: req.flash('loginMessage')});
});

router.get('/login', authHelpers.preventLoginSignup, function(req,res){
    res.render('auth/login', {message: req.flash('loginMessage')});
});

router.post('/signup', authHelpers.preventLoginSignup, function(req, res, next) {
  passwordHelpers.createUser(req).then((user) => {
    passport.authenticate('local', function(err, user) {
      if (err) { return next(err); }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/users/');
      });
    })(req, res, next);
  }).catch((err) =>{
    if(err.constraint === 'users_username_unique'){
      req.flash('loginMessage', 'username is already taken')
      res.redirect('/signup');
    }
    else if(err) {
      req.flash('loginMessage', err.message)
      res.redirect('/signup');
    }
    res.render('error', {err})

  })
});

// authenticate users when logging in - no need for req,res passport does this for us
router.post('/login',
  passport.authenticate('local', {
    successRedirect: `/users`,
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', authHelpers.checkAuthentication, function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/login');
});



module.exports = router;
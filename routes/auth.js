const express = require("express");
const router = express.Router()
const authHelpers = require("../helpers/authHelpers")
const passwordHelpers = require("../helpers/passwordHelpers")
const knex = require("../db/knex");
const passport = require("passport");

router.get('/signup', authHelpers.preventLoginSignup, (req,res) => {
    res.render('auth/signup', {message: req.flash('loginMessage')});
});

router.get('/login', authHelpers.preventLoginSignup, (req,res) => {
    res.render('auth/login', {message: req.flash('loginMessage'), val: "Login"});
});

router.post('/signup', authHelpers.preventLoginSignup, (req, res, next)  => {
  passwordHelpers.createUser(req).then((user) => {
    passport.authenticate('local', (err, user)  => {
      if (err) { return next(err); }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err)  => {
        if (err) {
          return next(err);
        }
        return res.redirect('/users/');
      });
    })(req, res, next);
  }).catch((err) =>{
    if(err.constraint === 'users_username_unique'){
      err.message = 'username is already taken'
    }
    if(err) {
      req.flash('loginMessage', err.message)
      res.redirect('/signup');
    }
    else {
      res.render('error', {err})
    }
  })
});

// authenticate users when logging in - no need for req,res passport does this for us
router.post('/login', passport.authenticate('local', {
    successRedirect: `/users`,
    failureRedirect: '/login'
  }));

router.get('/logout', authHelpers.checkAuthentication, (req,res) => {
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/login');
});



module.exports = router;
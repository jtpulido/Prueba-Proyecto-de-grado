const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const { isLoggedIn,isNotLoggedIN } = require('../lib/auth');

// SIGNUP
router.get('/signup',isNotLoggedIN, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup',isNotLoggedIN,passport.authenticate('local.singup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/signin', isNotLoggedIN,(req, res) => {
  res.render('auth/signin');
});

router.post('/signin',isNotLoggedIN, (req, res, next) => {
  check('username', 'Username is Required').notEmpty();
  check('password', 'Password is Required').notEmpty();
  const errors = validationResult(req);
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout',isLoggedIn,(req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});
module.exports = router;
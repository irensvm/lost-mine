const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ensureLogin = require('connect-ensure-login')
const User = require('../models/User-model')
const bcryptSalt = 10

/* CREATE ACCOUNT  */


router.post('/signup', (req, res, next) => {
  const { email, password } = req.body

  console.log("signing up: ", req.body)

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' })
    return
  }

  console.log("Finding the user in the database...")
  User.findOne({ email }).then(user => {
    console.log("found user ", user)

    if (user !== null) {
      res.status(400).json({ message: 'email already exists. Choose another one.' })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.create({
      email,
      password: hashPass
    })
      .then(newUser => res.status(200).json(newUser))
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "email check went bad." })
      })

  })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "email check went bad." })
      return
    })
})


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {

    console.log("This is the callback function passport will call after authentication...")

    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    console.log("Login successful")

    // passport login: saves the user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Logged out successfully!' });
});



router.get('/irene', (req, res, next) => {
  console.log('here')
})
router.get(
  "/auth/google",
      passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })

)

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3001/",
    failureRedirect: "http://localhost:3001/login"
  })
)

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);

router.get('/check', ensureAuthenticated, (req, res, next) => {
  console.log("Authenticated call to the API")
  console.log("User in request: ", req.user)
  console.log("USer in session (do you really need another place to keep the user?): ", req.session.user)
  res.status(200).json({ message: 'check!' })
})

module.exports = router
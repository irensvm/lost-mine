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
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email })
    .then(user => {
      console.log("user", user)
      if (!user) {
        res.status(400).json({ message: 'no user' })
        return
      }
      if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json({message: 'no auth'})
        return

      }
      req.session.user=user
      res.status(200).json(user)

    })
    .catch(err => console.log(err))

})


router.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.session.user=null
  res.status(200).json({ message: 'Logged out successfully!' });
});




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
    successRedirect: "http://localhost:3001/profile",
    failureRedirect: "/login"
  })
)

router.get('/profile', (req, res, next) => {

  console.log('usuario logado:', req.session.currentUser._id)
  const userId = req.session.currentUser._id
  console.log(userId)

})

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);

router.get('/check', ensureAuthenticated, (req, res, next) => {
  console.log("Authenticated call to the API")
  console.log("User in request: ", req.user)
  console.log("USer in session (do you really need another place to keep the user?): ", req.session.user)
  res.status(200).json({ message: 'check!' })
})

module.exports = router
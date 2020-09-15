const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ensureLogin = require('connect-ensure-login')
const User = require('../models/user-model')
const bcryptSalt = 10

/* CREATE ACCOUNT  */



router.post('/signup', (req, res, next) => {
  const { email, password } = req.body

  console.log("signing up: ", req.body)

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' })
    return
  }
  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
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

    const aNewUser = new User({
      email: email,
      password: hashPass
    });
    aNewUser.save(err => {
      if (err) {
        res.status(400).json({ message: 'Saving user to database went wrong.' });
        return;
      }

      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {

        if (err) {
          res.status(500).json({ message: 'Login after signup went bad.' });
          return;
        }

        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
      });
    });
  });
});

router.post('/login', async(req, res, next) => {
  const {
    email,
    password
  } = req.body
  if (!email || !password) {
    res.status(400).json({message: "Please provide an email and password"})
    return;
  }
  try {
    user = await User.findOne({email})
    console.log("Se esta logueando", user)
    if(!user){
      res.status(401).json({message: "This user does not exists"})
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log("Usuario guardado en sesion", req.session.currentUser)
      res.status(200).json(req.session.currentUser)
    } else {
      res.status(400).json({message: "Incorrect password"})
      console.log("password erroneo")
    }
  } catch (error) {
    next(error)
  }

  
});




router.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

router.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.session.user = null
  res.status(200).json({ message: 'Logged out successfully!' });
});
//router.get('/profile', (req, res, next) => {
//
//  console.log('usuario logado:', req.session.currentUser._id)
//  const userId = req.session.currentUser._id
//  console.log(userId)
//
//})

//const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);
//
//router.get('/check', ensureAuthenticated, (req, res, next) => {
//  console.log("Authenticated call to the API")
//  console.log("User in request: ", req.user)
//  console.log("USer in session (do you really need another place to keep the user?): ", req.session.user)
//  res.status(200).json({ message: 'check!' })
//})

module.exports = router
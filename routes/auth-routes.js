const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ensureLogin = require('connect-ensure-login')
const User = require('../models/User-model')
const saltRounds = 10

/* CREATE ACCOUNT  */


router.post('/signup', (req, res, next) => {
    console.log(res)
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        res.status(400).json({
            errorMessage: 'All fields are mandatory. Please provide your email and password.'
        });
        return;
    }

    if(password.length < 7){
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }
    

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                email,
                //fullName,
                passwordHash: hashedPassword
            });

        })

        .then(userFromDB => {
            req.session.currentUser = userFromDB;
            res.redirect('/profile');
        })

        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).json({
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.status(500).json({
                    errorMessage: 'Email need to be unique. Either username or email is already used.'
                });
            } else {
                next(error);
            }
        });

        
});


/* LOGIN */

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true,
        passReqToCallback: true
    })
);
router.get("/auth/google", passport.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
}));
router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));

/* LOGOUT */

router.post('/logout', (req, res, next) => {
    req.session.destroy();
});

/* LOGGEDIN */

router.get('/loggedin', (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
    }
    res.status(403).json({ message: 'acces Unauthorized' });
  });



module.exports = router;
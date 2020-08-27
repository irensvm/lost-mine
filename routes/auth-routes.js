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


authRoutes.post('/signup', (req, res, next) => {
    console.log(res)
    const {
        email,
        fullName,
        password
    } = req.body;

    if (!email || !password) {
        res.status(400)({
            errorMessage: 'All fields are mandatory. Please provide your email and password.'
        });
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)({
                errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
            });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                email,
                fullName,
                passwordHash: hashedPassword
            });

        })

        .then(userFromDB => {
            req.session.currentUser = userFromDB;
            res.redirect('/homepage');
        })

        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500)({
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.status(500)({
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
        successRedirect: '/homepage',
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
    successRedirect: "/",
    failureRedirect: "/"
}));

/* LOGOUT */

router.post('/logout', (req, res, next) => {
    req.session.destroy();
});



module.exports = authRoutes;
const session= require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

module.exports = app => {
  app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000000000},
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 600 * 600 * 24 
    })
  }))
}
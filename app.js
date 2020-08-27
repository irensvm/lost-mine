require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const User = require('./models/User-model')

const session       = require('express-session');
const passport      = require('passport');
require('./configs/passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Str

mongoose
  .connect('mongodb://localhost/lost-mine-be', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
require('./config/session.config')(app)

app.use(
  session({
    secret: 'una-secret-cualquiera',
    resave: true,
    saveUninitialized: true
  })
);
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("Google account details:", profile);
    User.findOne({
      googleID: profile.id
    }).then(user => {
      if (user) {
        done(null, user);
        return;
      }
      User.create({
        googleID: req.body.profile.id,
        fullName: profile.displayName,
        avatar: profile.photos[0].value,
        email: profile.emails[0].value
      })
        .then(newUser => {
          console.log("error-message", newUser)
          done(null, newUser);
        })
        .catch(err => done(err)); // closes User.create()
    })
      .catch(err => done(err)); // closes User.findOne()
  })
);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            console.error(err);
            return res.sendStatus(400); // Bad request
        }

        next();
    });
});

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Lost&Mine';

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3001', 'http://localhost:3000'] // <== aceptar llamadas desde este dominio
  })
);
// ADD SESSION SETTINGS HERE:
app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));

// USE passport.initialize() and passport.session() HERE:
app.use(passport.initialize());
app.use(passport.session());



const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/auth-routes');
app.use('/api', authRoutes);


module.exports = app;

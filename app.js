require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const User = require('./models/User-model')
const passport      = require('passport');

require('./configs/mongodb');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
const session = require('./configs/session.config')(app)


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())



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
    origin: ['http://localhost:3001', 'http://localhost:3000', "https://accounts.google.com", "https://www.googleapis.com"] // <== aceptar llamadas desde este dominio
  
  })
);

require('./configs/passport');

// USE passport.initialize() and passport.session() HERE:
app.use(passport.initialize());
app.use(passport.session());



const index = require('./routes/index');
app.use('/', index);
const router = require('./routes/auth-routes');
app.use('/api', router);

const bookRoute = require('./routes/book-routes');
app.use('/api', bookRoute);

const profileRoute = require('./routes/profile-routes');
app.use('/api', profileRoute);

module.exports = app;

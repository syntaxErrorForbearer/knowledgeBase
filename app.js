//console.log('hello from inside app.js!');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const PASSPORT = require('passport');


mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to the mongo db!!!');
});

// Check for db errors
db.on('error', (err) => {
  console.log(err);
});

// Init app
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  // can messages be substituted to use another type of message?
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// Passport config
require('./config/passport')(PASSPORT);
// Passport Middleware
app.use(PASSPORT.initialize());
console.log('PASSPORT.Initialize()!!!!!1');
app.use(PASSPORT.session());
console.log('PASSPORT.session()!!!!!!');

// Global Variable
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if(err){
      console.log(err);
    }
    else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

// Start Sever
app.listen(3000, () => {
  console.log('hidehoo! server started on port 3000')
});

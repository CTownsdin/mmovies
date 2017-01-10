const dotenv = require('dotenv').config(); // load .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');  // setup a flash msg before redirects to be displayed on the new page, as explanation of redirect action

// MONGOOSE & MONGOOSE MODELS
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const User = require('./models/user');
const Comment = require('./models/comment');

// ROUTES
const commentRoutes = require('./routes/comments');
const movieRoutes = require('./routes/movies');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/meaningful_movies');

app.use( bodyParser.urlencoded({extended: true}) );  // stnd bodyParser

// SET VIEW ENGINE
app.set('views', './views'); // make dflt explicit
app.set('view engine', 'ejs'); // set view engine, choice

app.use(express.static(__dirname + '/public'));  // serve the public directory
app.use(methodOverride('_method'));
app.use(flash());

// EXPRESS-SESSION
app.use(require('express-session')({  // initialize the session; session({options})
    secret: 'This little light of mine, had a little lamb, merrily merrily merrily life is but a dream!',
    resave: false,
    saveUninitialized: false
    // cookie: {secure: true}     https only
}));
// ref@: https://github.com/expressjs/session
// session requires state
// http is stateless
// express-session sets values on the req.session property, to pass stateful session information back and forth, like whether the user is logged in or not.
// cookie contains session ID, session data is saved serverside, passed in req.session to client
// req.session.id    each session has a unique ID assoc'd with it. This will contain that.
// recall:  stealing session cookies!
// req.sessionID    get the ID of the session


// PASSPORT
app.use(passport.initialize());
app.use(passport.session());  // passport uses session to manage login/logout

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// // SEEDDB  - notes: movies needs .author.id property
// seedDB = require('./seeds');
// seedDB();

// add in a middleware, defn'd here, to add
    // res.locals.currentUser, &&  res.locals.message
app.use((req, res, next) => {
    res.locals.currentUser = req.user;   // ! currentUser available to all routes.
    res.locals.error = req.flash('error');  // add flash message if exists
    res.locals.success = req.flash('success');
    next();
});

// CONNECT ROUTES/ROUTERS
app.use(indexRoutes);
app.use('/movies', movieRoutes);
app.use('/movies/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`\n${(new Date).getTime()} - Meaningful Movies server has started. :)`);
});

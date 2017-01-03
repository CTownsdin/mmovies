const dotenv = require('dotenv').config(); // load .env file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');

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

// PASSPORT
app.use(require('express-session')({
    secret: 'This little light of mine, had a little lamb, merrily merrily merrily life is but a dream!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SEEDDB
seedDB = require('./seeds');
seedDB();

// add currentUser middleware
// res.locals is what is available inside each ejs template
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// CONNECT ROUTES/ROUTERS
app.use(indexRoutes);
app.use('/movies', movieRoutes);
app.use('/movies/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`\n${(new Date).getTime()} - Meaningful Movies server has started. :)`);
});

const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

// ROUTES ***************************
// TODO: use express router modularly
//
router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/landing', (req, res) => {
    res.render('landing');
});

router.get('/logout', (req, res) => {
    req.logout();  // came with packages installed
    req.flash('success', 'Logged you out');
    res.redirect('landing');
});

// AUTH ROUTES
router.get('/login', (req, res) => {
    res.render('login');  // flash msg here was:  {message: req.flash('error')}
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: "/movies",
        failureRedirect: "/login"   // TODO: ?  redirect to failureRetry page ?
    }), (req, res) => {
        // callback
    }
);

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(new User( { username: req.body.username } ), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate('local')(req, res, function(){   // strategy choice is here.
            res.redirect('/movies');
        });
    });
});

module.exports = router;

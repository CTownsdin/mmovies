// all the middleware goes here
const Comment = require('../models/comment');
const Movie = require('../models/movie');
const middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Movie.findById(req.params.id, (err, foundMovie) => {
            if (err) res.redirect('back');
            else {
                if (foundMovie.author.id.equals(req.user._id)){  // they own it
                    next();
                }
                else {
                    res.redirect('back'); // they don't own it.
                }
            }
        });
    }
    else {
        res.redirect('back');  // user is not logged in
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log('checkCommentOwnership got err:', err);
                res.redirect('back');
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {  // they own it
                    next();
                }
                else {
                    console.log('you do not own that comment');
                    res.redirect('back'); // they don't own it.
                }
            }
        });
    }
    else {
        // TODO: flash sign in first
        console.log('you must be logged in');
        res.redirect('back');  // user is not logged in
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Please login first, then you can do that...');  // in flash, stash the msg
    // req.flash enables you to add in some data that will be passed from this middleware to the next, and can be used there, ie in the redirect;  a one time thing :)
    res.redirect('/login');
};

module.exports = middlewareObj;

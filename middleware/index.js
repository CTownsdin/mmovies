// all the middleware goes here
const Comment = require('../models/comment');
const Movie = require('../models/movie');
const middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Movie.findById(req.params.id, (err, foundMovie) => {
            if (err) {
                req.flash('error', 'Movie not found');
                res.redirect('back');
            }
            else {
                if (foundMovie.author.id.equals(req.user._id)){  // they own it
                    next();
                }
                else {
                    req.flash('error', 'You don\'t have permission to do that.');
                    res.redirect('back'); // they don't own it.
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');  // user is not logged in
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash('error', 'finding comment owner failed, something went wrong');
                res.redirect('back');
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {  // they own it
                    next();
                }
                else {
                    req.flash('error', 'you did not author that comment');
                    res.redirect('back'); // they don't own it.
                }
            }
        });
    }
    else {
        req.flash('error', 'Please login and try again')
        res.redirect('back');  // user is not logged in
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Please login first, and try again');  // in flash, stash the msg
    // req.flash enables you to add in some data that will be passed from this middleware to the next, and can be used there, ie in the redirect;  a one time thing :)
    res.redirect('/login');
};

module.exports = middlewareObj;

const express = require('express');
const router = express.Router({mergeParams: true});  // thf req.params.id will be avail
const Movie = require('../models/movie');
const Comment = require('../models/comment');

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// TODO:  redirect /comment to /comments/new
// NEW               /movies/:id/comments/new   GET
router.get('/new', isLoggedIn, (req, res) => {
    // find movie by id
    Movie.findById(req.params.id, (err, foundMovie) => {
        if (err) return console.log(err);
        res.render('comments/new', { movie: foundMovie });
    })
});

// COMMENT CREATE
router.post('', isLoggedIn, (req, res) => {
    // lookup movie using ID
    const movieId = req.params.id;
    Movie.findById(movieId, (err, foundMovie) => {
        if (err) {
            console.log(err);
            res.redirect('/movies');   // TODO: ? explain this redirect to the user
        }
        else {
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) return console.log(err);
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                newComment.save();
                foundMovie.comments.push(newComment);
                foundMovie.save();
                res.redirect(`/movies/${movieId}`);
            });
        }
    })
});

// COMMENT EDIT
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) return console.log('could not find comment id', err);
        res.render('comments/edit', {movie_id: req.params.id, comment: foundComment});
    });
});

// COMMENT UPDATE
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {

        if (err) {
            console.log('unable to update comment\n', err);
            res.redirect('back');          // TODO:  flash the redirect
        }
        else {
            res.redirect('/movies/' + req.params.id);   // rem, req.params.id is availabe as this route in concat'd when app.use'd in app.js file
        }
    });
});

// COMMENT DELETE      effective route:  /movies/:id/comments + /:comment_id
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, removedComment) => {
        if (err) return console.log('could not find comment id for deletion', err);
        // TODO:  flash comment successfully removed
        res.redirect(`/movies/${req.params.id}`);  // back to show page, & see comment is deleted.
    });
});

function checkCommentOwnership(req, res, next){
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
}

module.exports = router;

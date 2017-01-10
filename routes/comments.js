const express = require('express');
const router = express.Router({mergeParams: true});  // thf req.params.id will be avail
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const mw = require('../middleware');

// COMMENT NEW
router.get('/new', mw.isLoggedIn, (req, res) => {
    // find movie by id
    Movie.findById(req.params.id, (err, foundMovie) => {
        if (err) return console.log(err);
        res.render('comments/new', { movie: foundMovie });
    })
});

// COMMENT CREATE
router.post('', mw.isLoggedIn, (req, res) => {
    // lookup movie using ID
    const movieId = req.params.id;
    Movie.findById(movieId, (err, foundMovie) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Could not find the movie to comment on, something went wrong');
            res.redirect('/movies');
        }
        else {
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) {
                    req.flash('error', 'Could not create comment, something went wrong.');
                    return console.log(err);
                }
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                newComment.save();
                foundMovie.comments.push(newComment);
                foundMovie.save();
                req.flash('success', 'Added new comment');
                res.redirect(`/movies/${movieId}`);
            });
        }
    })
});

// COMMENT EDIT
router.get('/:comment_id/edit', mw.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) return console.log('could not find comment id', err);
        res.render('comments/edit', {movie_id: req.params.id, comment: foundComment});
    });
});

// COMMENT UPDATE
router.put('/:comment_id', mw.checkCommentOwnership, (req, res) => {
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
router.delete('/:comment_id', mw.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, removedComment) => {
        if (err) return console.log('could not find comment id for deletion', err);
        req.flash('success', 'Comment successfully deleted');
        res.redirect(`/movies/${req.params.id}`);
    });
});

module.exports = router;

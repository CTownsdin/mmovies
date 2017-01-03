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
        if (err) console.log(err);
        else {
            res.render('comments/new', { movie: foundMovie });
        }
    })
});

// COMMENTS CREATE
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
                if (err) console.log(err);
                else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundMovie.comments.push(newComment);
                    foundMovie.save();
                    res.redirect(`/movies/${movieId}`);
                }
            });
        }
    })
});

module.exports = router;

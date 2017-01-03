const express = require('express');
const router = express.Router({mergeParams: true});  // thf req.params.id will be avail
const Movie = require('../models/movie');
const Comment = require('../models/comment');

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

router.post('', isLoggedIn, (req, res) => {
    // lookup movie using ID
    const movieId = req.params.id;
    Movie.findById(movieId, (err, foundMovie) => {
        if (err) {
            console.log(err);
            res.redirect('/movies');   // TODO: ? explain this redirect to the user
        }
        else {
            // create a new comment
            // DEBUG console.log(`req.body.comment ${JSON.stringify(req.body.comment)}`);
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) console.log(err);
                else {
                    // connect new comment to movie
                    foundMovie.comments.push(newComment);
                    foundMovie.save();
                    // redirect back to movie show page
                    res.redirect(`/movies/${movieId}`);
                }
            });
        }
    })
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

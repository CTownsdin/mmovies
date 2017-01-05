const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/', (req, res) => {
    Movie.find({}, (err, allMovies) => {
        if (err) return console.log(err);
        res.render('movies/index', { movies: allMovies });
    });
});

// get FORM for a new movie
router.get('/new', isLoggedIn, (req, res) => {
    res.render('movies/new');  // new.ejs
});

// CREATE a movie
router.post('/', isLoggedIn, (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newMovie = { title, image, description, author };  // not using auth, but could
    Movie.create(newMovie, (err, movie) => {
        if (err) return console.log(err);
        res.redirect('/movies');
    });
});

// SHOW a movie
router.get('/:id', (req, res) => {
    const movieId = req.params.id;  // doc.populate()  populates the references
    Movie.findById(movieId).populate('comments').exec((err, foundMovie) => {
        if (err) return console.log(err);
        res.render('movies/show', { movie: foundMovie });
    });
});

// EDIT a movie
router.get('/:id/edit', (req, res) => {
    const movieId = req.params.id;
    Movie.findById(movieId, (err, foundMovie) => {
        if (err) {
            console.log(err);  // TODO:  flash a redirect message
            res.redirect('/movies');
        }
        res.render('movies/edit', { movie: foundMovie });
    });
});

// UPDATE movie route
router.put('/:id', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, (err, updatedMovie) => {
        if (err) {
            console.log('unable to update movie', err);
            res.redirect('/movies');          // TODO:  flash the redirect
        }
        else {
            res.redirect('/movies/' + req.params.id);
        }
    });
});

// DESTROY movie route
router.delete('/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log('an error deleting the movie', err);
        }
        res.redirect('/movies');  // redirect either way
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

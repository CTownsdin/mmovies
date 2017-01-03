const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.get('/', (req, res) => {
    Movie.find({}, (err, allMovies) => {
        if (err){ console.log(err); }
        else {
            // render while passing in an object that the view template can pull props from
            res.render('movies/index', { movies: allMovies });
        }
    });
});

// FORM for new movie
router.get('/new', (req, res) => {
    res.render('movies/new');  // new.ejs
});

// CREATE
router.post('/', (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const description = req.body.description;
    const newMovie = {title, image, description};
    Movie.create(newMovie, (err, movie) => {
        if (err){ console.log(err); }
        else {
            res.redirect('/movies');
        }
    });
});

// SHOW ONE MOVIE
router.get('/:id', (req, res) => {
    const movieId = req.params.id;  // doc.populate()  populates the references
    Movie.findById(movieId).populate('comments').exec((err, foundMovie) => {
        if (err) console.log(err);
        else {
            res.render('movies/show', { movie: foundMovie });
        }
    })
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;

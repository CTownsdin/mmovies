const mongoose = require('mongoose');
const Movie = require('./models/movie');
const Comment = require('./models/comment');

const movies = [{
    title: 'Who to Invade Next',
    image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU3MjI2ODkzMF5BMl5BanBnXkFtZTgwMjkzMjY5NzE@._V1_SY1000_CR0,0,680,1000_AL_.jpg',
    description: 'Listicle hashtag tacos pork belly authentic echo park. Edison bulb gastropub pickled, distillery offal echo park semiotics. Mustache enamel pin hot chicken sriracha, fam banh mi stumptown meh locavore disrupt. Helvetica sartorial copper mug pickled, venmo hot chicken ramps vaporware keffiyeh photo booth everyday carry readymade thundercats. Dreamcatcher pok pok venmo salvia beard.'
}, {
    title: 'Idiocracy',
    image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMWQ4MzI2ZDQtYjk3MS00ODdjLTkwN2QtOTBjYzIwM2RmNzgyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_SX676_AL_.jpg',
    description: 'Listicle hashtag tacos pork belly authentic echo park. Edison bulb gastropub pickled, distillery offal echo park semiotics. Mustache enamel pin hot chicken sriracha, fam banh mi stumptown meh locavore disrupt. Helvetica sartorial copper mug pickled, venmo hot chicken ramps vaporware keffiyeh photo booth everyday carry readymade thundercats. Dreamcatcher pok pok venmo salvia beard.'
}, {
    title: 'Fast Food Nation',
    image: 'https://images-na.ssl-images-amazon.com/images/M/MV5BYzM0ODQ5OGItZDZhMy00NDk0LWJmNTgtZGRiMTBjMDI1YTAwXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
    description: 'Listicle hashtag tacos pork belly authentic echo park. Edison bulb gastropub pickled, distillery offal echo park semiotics. Mustache enamel pin hot chicken sriracha, fam banh mi stumptown meh locavore disrupt. Helvetica sartorial copper mug pickled, venmo hot chicken ramps vaporware keffiyeh photo booth everyday carry readymade thundercats. Dreamcatcher pok pok venmo salvia beard.'
}];

function seedDB(){
    // remove all movies
    Movie.remove({}, err => {
        if (err) console.log(err);
        console.log('removed movies');

        // add movies, hardcoded to use movies from above
        movies.forEach((movie) => {
            const title = movie.title;
            const image = movie.image;
            const description = movie.description;
            const comments = [];
            const newMovie = { title, image, description, comments };

            Movie.create(newMovie, (err, movie) => {  // create does a save()
                if (err){ console.log(err); }
                else {
                    console.log(`add movie: ${title}`);

                    // add comments
                    // Comment.create(
                    //     {
                    //         text: 'placeholder review text',
                    //         commenter: 'placeholder reviewer'
                    //     }, (err, comment) => {
                    //     if (err) console.log(err);
                    //     else {
                    //         movie.comments.push(comment);  // note!  movie not Movie, Movie is the MovieModel
                    //         movie.save();
                    //         console.log('created new dummy comment');
                    //     }
                    // });
                }
            });
        });
    });
}



module.exports = seedDB;

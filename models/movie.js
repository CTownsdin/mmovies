const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [  // array of reference objects, by ObjectId, to the actual comments.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

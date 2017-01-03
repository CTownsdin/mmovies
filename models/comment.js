const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    commenter: String
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

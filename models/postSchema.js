
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author_id: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        required: true
    },
    dislikes: {
        type: Number,
        default: 0,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: new Date().getTime(),
        required: true
    },
});

module.exports = mongoose.model('Post', Post);
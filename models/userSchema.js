
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    user_name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    last_login_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// User.createIndex({ email: 1 });

module.exports = mongoose.model('users', User);
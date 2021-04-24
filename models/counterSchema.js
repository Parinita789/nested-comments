
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = new Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true 
    }
});

module.exports = mongoose.model('Counters', Counter);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    id: {
        type: String,
        required: true
    },
    item_type: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    total_peice: {
        type: Number,
        required: true
    },
    total_color: {
        type: Number,
        required: true
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

module.exports = mongoose.model('product', Product);
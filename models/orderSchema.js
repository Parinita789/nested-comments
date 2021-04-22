
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    items_id: {
        type: Array,
        required: true
    },
    status: {
        type: String,
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

module.exports = mongoose.model('order', Order);
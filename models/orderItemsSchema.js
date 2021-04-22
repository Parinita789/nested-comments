
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItems = new Schema({
    id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    address_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
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

module.exports = mongoose.model('order_items', OrderItems);
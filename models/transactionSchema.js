
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Transaction = new Schema({
    id: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        required: true
    },
    total_amount: {
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

module.exports = mongoose.model('transaction', Transaction);
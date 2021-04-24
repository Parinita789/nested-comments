
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const Customer = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true
    },
    email: {
        type: String
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
},
{
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false // disable `autoCreate` since `bufferCommands` is false
});

autoIncrement.initialize(mongoose.connection);
// Customer.plugin(autoIncrement.plugin, 'Customer');

Customer.plugin(autoIncrement.plugin, {
    model: 'customers',
    field: 'id',
    startAt: 1,
    incrementBy: 1
})

module.exports = mongoose.model('customers', Customer);
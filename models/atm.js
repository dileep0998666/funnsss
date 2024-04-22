const mongoose = require("mongoose")

const atmSchema = new mongoose.Schema({
    account: {
        type: Number,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [{
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['withdraw', 'deposit'], 
        },
        date: {
            type: Date,
            required: true
        }
    }]
})

module.exports = mongoose.model('Account', atmSchema)

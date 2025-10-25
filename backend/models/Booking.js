const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    productionType: {
        type: String,
        required: true,
        enum: ['movie', 'play', 'concert']
    },
    productionName: {
        type: String,
        required: true
    },
    performanceDate: {
        type: Date,
        required: true
    },
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    seats: {
        type: [Number],
        required: true,
        validate: {
            validator: function(seats) {
                return seats.every(seat => seat >= 1 && seat <= 100) && 
                       seats.length > 0 && 
                       seats.length <= 10;
            },
            message: 'Seats must be between 1 and 100, and you can book up to 10 seats'
        }
    },
    saleDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
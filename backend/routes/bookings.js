const router = require('express').Router();
const Booking = require('../models/Booking');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check seat availability
router.get('/check-seats', async (req, res) => {
    try {
        const { date, production } = req.query;
        const bookings = await Booking.find({
            performanceDate: date,
            productionName: production
        });

        const bookedSeats = bookings.reduce((seats, booking) => {
            return [...seats, ...booking.seats];
        }, []);

        res.json({ bookedSeats });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
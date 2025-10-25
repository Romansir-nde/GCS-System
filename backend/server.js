const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gold-cinema', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const supportRoutes = require('./routes/support');

app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/support', supportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
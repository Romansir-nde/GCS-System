const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        
        const token = jwt.sign({ id: user._id }, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        });

        res.status(201).json({ 
            message: 'Registration successful',
            user: {
                uniqueId: user.uniqueId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token 
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already registered' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, uniqueId } = req.body;
        const user = await User.findOne({ email, uniqueId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        });

        res.json({ 
            user: {
                uniqueId: user.uniqueId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
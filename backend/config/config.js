require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/gold-cinema',
    jwtSecret: process.env.JWT_SECRET || 'gold-cinema-secret-key',
    jwtExpiration: '24h'
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    advisor: {
        type: String,
        default: null
    },
    supportTickets: [{
        issue: String,
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open'
        },
        messages: [{
            sender: String,
            content: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        assignedAdvisor: {
            type: String,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Generate unique ID before saving
userSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await mongoose.model('User').countDocuments();
        this.uniqueId = `GCS-${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a new support ticket
router.post('/ticket', auth, async (req, res) => {
    try {
        const { issue, advisorId } = req.body;
        const user = req.user;

        const newTicket = {
            issue,
            assignedAdvisor: advisorId || null,
            messages: [{
                sender: user.firstName + ' ' + user.lastName,
                content: issue
            }]
        };

        user.supportTickets.push(newTicket);
        await user.save();

        res.status(201).json({
            message: 'Support ticket created successfully',
            ticketId: user.supportTickets[user.supportTickets.length - 1]._id
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's support tickets
router.get('/tickets', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.supportTickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add message to support ticket
router.post('/ticket/:ticketId/message', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;
        
        const ticket = user.supportTickets.id(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({
            sender: user.firstName + ' ' + user.lastName,
            content: message
        });

        await user.save();
        res.status(201).json({ message: 'Message added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
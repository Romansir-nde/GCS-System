// Handle login form submission
document.getElementById('Login Form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        uniqueId: document.getElementById('unique-id').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }

        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Login successful!');
        window.location.href = 'booking.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Handle registration form submission
document.getElementById('SignUp Form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        mobile: document.getElementById('mobile').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zip').value,
        advisor: document.getElementById('advisor Name').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(`Registration successful! Your Unique ID is: ${data.user.uniqueId}`);
        window.location.href = 'booking.html';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});

// Show/Hide forms based on tab selection
function showForm(formType) {
    const loginForm = document.getElementById('Login Form');
    const signupForm = document.getElementById('SignUp Form');
    
    if (formType === 'Login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    }
}

// Show login form by default when page loads
document.addEventListener('DOMContentLoaded', () => {
    showForm('Login');
    initializeSupport();
});

// Support chat functionality
function initializeSupport() {
    const submitIssueBtn = document.getElementById('submit-issue');
    const issueDescription = document.getElementById('issue-description');
    const advisorSelect = document.getElementById('advisor-select');
    const chatMessages = document.getElementById('chat-messages');

    submitIssueBtn?.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first to submit an issue');
            return;
        }

        const issue = issueDescription.value.trim();
        if (!issue) {
            alert('Please describe your issue');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/support/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    issue,
                    advisorId: advisorSelect.value || null
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message);
            }

            // Add message to chat
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            messageDiv.innerHTML = `
                <div class="message-header">You - ${new Date().toLocaleTimeString()}</div>
                <div class="message-content">${issue}</div>
            `;
            chatMessages.appendChild(messageDiv);

            // Clear input
            issueDescription.value = '';
            
            alert('Your issue has been submitted successfully. An advisor will respond shortly.');
        } catch (error) {
            alert('Failed to submit issue: ' + error.message);
        }
    });

    // Load existing tickets if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        loadUserTickets();
    }
}

async function loadUserTickets() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/support/tickets', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const tickets = await response.json();
        const chatMessages = document.getElementById('chat-messages');
        
        tickets.forEach(ticket => {
            ticket.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.sender.includes('Advisor') ? 'advisor-message' : 'user-message'}`;
                messageDiv.innerHTML = `
                    <div class="message-header">${message.sender} - ${new Date(message.timestamp).toLocaleTimeString()}</div>
                    <div class="message-content">${message.content}</div>
                `;
                chatMessages.appendChild(messageDiv);
            });
        });
    } catch (error) {
        console.error('Failed to load tickets:', error);
    }
}
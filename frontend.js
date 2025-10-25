// Add this script tag at the end of your booking.html file, before the closing body tag
document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        productionType: document.getElementById('production-type').value,
        productionName: document.getElementById('production-name').value,
        performanceDate: document.getElementById('performance-date').value,
        numberOfTickets: parseInt(document.getElementById('numberOfTickets').value),
        seatPreference: document.getElementById('seat-preference').value,
        saleDate: document.getElementById('saleDate').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Booking failed');
        }

        const data = await response.json();
        alert('Booking successful! Booking ID: ' + data._id);
        document.getElementById('booking-form').reset();
    } catch (error) {
        alert('Error making booking: ' + error.message);
    }
});
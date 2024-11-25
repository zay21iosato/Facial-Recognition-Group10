document.getElementById('createEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventData = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        type: document.getElementById('eventType').value
    };
    console.log('Event created:', eventData);
    
    // Store the event data in localStorage
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Event created successfully!',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect to the events page
            window.location.href = 'Event.html';
        }
    });
});
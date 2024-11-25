 // Fetch events from create_event.js
 let events = [];
 // Function to add a new event
 function addEvent(eventData) {
     events.push(eventData);
 }
 // Function to remove past events
 function removePastEvents() {
     const currentDate = new Date().toISOString().split('T')[0];
     events = events.filter(event => event.date >= currentDate);
 }
 // Fetch events from createEvent.html
 fetch('createEvent.html')
     .then(response => response.json())
     .then(data => {
         data.forEach(eventData => {
             addEvent(eventData);
         });
     })
     .catch(error => console.error('Error fetching events:', error));

// Listen for messages from createEvent.html
 window.addEventListener('message', function(event) {
     if (event.data.type === 'newEvent') {
         addEvent(event.data.eventData);
     }
 });
 document.getElementById('viewEventsBtn').addEventListener('click', () => {
     removePastEvents();
     if (events.length > 0) {
         let eventListHtml = '<ul>';
         const eventsToShow = events.slice(0, 5); // Show up to 5 events
         eventsToShow.forEach((event) => {
             const time = new Date(`2000-01-01T${event.time}`);
             const formattedTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
             eventListHtml += `<li>${event.name} - ${event.date} ${formattedTime}</li>`;
         });
         eventListHtml += '</ul>';
         if (events.length > 5) {
             eventListHtml += '<p>And more...</p>';
         }
         Swal.fire({
             title: 'Upcoming Events',
             html: eventListHtml,
             icon: 'info',
             confirmButtonText: 'Close'
         });
     } else {
         Swal.fire({
             title: 'No Events',
             text: 'No upcoming events scheduled.',
             icon: 'info',
             confirmButtonText: 'OK'
         });
     }
 });
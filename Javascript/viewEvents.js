 // Fetch events from localStorage
 let events = JSON.parse(localStorage.getItem('events')) || [];
 // Function to add a new event
 function addEvent(eventData) {
     events.push(eventData);
     localStorage.setItem('events', JSON.stringify(events));
     Swal.fire({
         title: 'Event Added',
         text: 'Your event has been successfully added.',
         icon: 'success',
         confirmButtonText: 'OK'
     });
 }
 // Function to remove past events
 function removePastEvents() {
     const currentDate = new Date().toISOString().split('T')[0];
     events = events.filter(event => event.date >= currentDate);
     localStorage.setItem('events', JSON.stringify(events));
     Swal.fire({
         title: 'Events Updated',
         text: 'Past events have been removed.',
         icon: 'info',
         confirmButtonText: 'OK'
     });
 }
 // Listen for messages from create_event.html
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
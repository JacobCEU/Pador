// appsToday.js

// Function to format time
function formatTime(rawTime) {
  const timeParts = rawTime.split(':');
  return `${(+timeParts[0] % 12) || 12}:${timeParts[1]} ${(timeParts[0] >= 12) ? 'PM' : 'AM'}`;
}

// Function to fetch and display today's appointments
function fetchTodayAppointments() {
  let url = 'http://localhost:8000/admin/viewToday';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const appointmentsTableBody = document.getElementById('appointmentsTableBody');
      appointmentsTableBody.innerHTML = ''; // Clear previous content
      console.log("content: ", data);


      if (data.successful && data.appointments && data.appointments.length > 0) {
        data.appointments.forEach(appointment => {
          // Append a new row for each appointment
          appointmentsTableBody.innerHTML += `
            <tr>
              <td>${appointment.first_name} ${appointment.last_name}</td>
              <td>${appointment.time}</td>
              <td>${appointment.service_name}</td>
              <td>${appointment.status}</td>
            </tr>
          `;
        });
      } else {
        // Display a message if there are no appointments
        appointmentsTableBody.innerHTML = '<tr><td colspan="4">No appointments available</td></tr>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  fetchTodayAppointments();
});

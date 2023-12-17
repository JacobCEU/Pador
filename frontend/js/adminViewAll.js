document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the server
    let url = 'http://localhost:8000/admin/viewAll';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const appointmentsTableBody = document.getElementById('appointmentsTableBody');
            appointmentsTableBody.innerHTML = ''; // Clear previous content

            if (data.successful && data.appointments && data.appointments.length > 0) {
                data.appointments.forEach(appointment => {
                    // Append a new row for each appointment
                    appointmentsTableBody.innerHTML += `
                        <tr>
                            <td>${appointment.ref_no}</td>
                            <td>${appointment.suffix}</td>
                            <td>${appointment.first_name}</td>
                            <td>${appointment.middle_name}</td>
                            <td>${appointment.last_name}</td>
                            <td>${appointment.contact_no}</td>
                            <td>${appointment.email}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td>${appointment.service_name}</td>
                            <td>
                                ${appointment.note}
                                <button class="viewNoteBtn" onclick="viewNote('${appointment.note}')">View Note</button>
                            </td>
                            <td>
                                ${appointment.status}
                                <button class="cancelBtn" onclick="confirmCancel('${appointment.ref_no}', '${appointment.status}')">
                                    ${appointment.status === 'Canceled' ? 'Delete' : 'Cancel'}
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                // Display a message if there are no appointments
                appointmentsTableBody.innerHTML = '<tr><td colspan="11">No appointments available</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Function to view the entire note
function viewNote(note) {
    alert('Note: ' + note);
}

// Function to confirm canceling an appointment
function confirmCancel(refNo, currentStatus) {
    const confirmation = confirm('Are you sure you want to cancel this appointment?');

    if (confirmation) {
        cancelAppointment(refNo, currentStatus);
    }
}

// Function to cancel an appointment
function cancelAppointment(refNo, currentStatus) {
    let url = `http://localhost:8000/admin/cancelAppointment/${refNo}`;

    // Update or delete based on the current status
    fetch(url, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.successful) {
                alert('Appointment canceled successfully');
                location.reload(); // Reload the page after cancellation
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

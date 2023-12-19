document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the server
    let url = 'http://localhost:8000/admin/viewAll';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const appointmentsTableBody2 = document.getElementById('appointmentsTableBody2');
            appointmentsTableBody2.innerHTML = ''; // Clear previous content
            console.log("content: ", data);

            const itemsPerPage = 10; // Adjust the number of items per page as needed
            let currentPage = 1;

            // Function to update the table content based on the current page
            function updateTableContent() {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const displayedAppointments = data.appointments.slice(startIndex, endIndex);

                appointmentsTableBody2.innerHTML = ''; // Clear previous content

                if (displayedAppointments.length > 0) {
                    displayedAppointments.forEach(appointment => {
                        // Shorten the note and append a new row for each appointment
                        const shortenedNote = (appointment.note.length > 10) ? (appointment.note.substring(0, 10) + '...') : appointment.note;

                        appointmentsTableBody2.innerHTML += `
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
                                    ${appointment.status}
                                    <button class="cancelBtn" onclick="confirmCancel('${appointment.ref_no}', '${appointment.status}')">
                                        ${appointment.status === 'Canceled' ? 'Delete' : 'Cancel'}
                                    </button>
                                    <button class="finishBtn" onclick="finishAppointment('${appointment.ref_no}')">Finish</button>
                                </td>
                                <td>
                                    ${shortenedNote}
                                    <button class="viewNoteBtn" onclick="viewNote('${appointment.note}')">View Note</button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    appointmentsTableBody2.innerHTML = '<tr><td colspan="11">No appointments available</td></tr>';
                }

                document.getElementById('currentPage').innerText = currentPage;
            }

            // Function to change the current page
            window.changePage = function (change) {
                const newPage = currentPage + change;

                if (newPage > 0 && newPage <= Math.ceil(data.appointments.length / itemsPerPage)) {
                    currentPage = newPage;
                    updateTableContent();
                }
            };

            // Initial table content update
            updateTableContent();
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

// Function to finish an appointment
function finishAppointment(refNo) {
    let url = `http://localhost:8000/admin/finish/${refNo}`;

    // Update the status to "Finished"
    fetch(url, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(data => {
            if (data.successful) {
                alert('Appointment finished successfully');
                location.reload(); // Reload the page after finishing
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

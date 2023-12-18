document.addEventListener('DOMContentLoaded', function () {
    fetchAppointmentCounts();
});

function fetchAppointmentCounts() {
    let url = 'http://localhost:8000/admin/countAppointments';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const finishedApps = document.getElementById('finishedApps');
            const ongoingApps = document.getElementById('ongoingApps');

            // Display finished appointments count
            finishedApps.innerHTML = `<p> ${data.finishedCount}</p>`;

            // Display ongoing appointments count
            ongoingApps.innerHTML = `<p> ${data.ongoingCount}</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

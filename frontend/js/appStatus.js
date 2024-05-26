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
            const canceledApps = document.getElementById('canceledApps'); // New element for Canceled Apps

            // Display finished appointments count
            finishedApps.innerHTML = `<p> ${data.finishedCount}</p>`;

            // Display ongoing appointments count
            ongoingApps.innerHTML = `<p> ${data.ongoingCount}</p>`;

            // Display canceled appointments count
            canceledApps.innerHTML = `<p> ${data.canceledCount}</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

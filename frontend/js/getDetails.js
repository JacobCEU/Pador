document.addEventListener('DOMContentLoaded', function () {
    // Retrieve details from sessionStorage
    const appointmentDetails = JSON.parse(sessionStorage.getItem("appointmentDetails"));

    // Update details in the HTML
    document.getElementById('ref_no').innerText = appointmentDetails.ref_no;
    document.getElementById('first_name').innerText = appointmentDetails.first_name;
    document.getElementById('middle_name').innerText = appointmentDetails.middle_name;
    document.getElementById('last_name').innerText = appointmentDetails.last_name;
    document.getElementById('suffix').innerText = appointmentDetails.suffix;
    document.getElementById('phone_num').innerText = appointmentDetails.contact_no;
    document.getElementById('email').innerText = appointmentDetails.email;
    document.getElementById('date').innerText = appointmentDetails.date;
    document.getElementById('time').innerText = appointmentDetails.time;
    document.getElementById('service').innerText = appointmentDetails.service_name;
    document.getElementById('note').innerText = appointmentDetails.note;
});


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ref_no = urlParams.get('ref_no');
    const contact_no = urlParams.get('contact_no');

    let url = `http://localhost:8000/appoint/searchAppointment/${ref_no}/${contact_no}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.successful === true) {
                // Update details in the HTML
                document.getElementById('ref_no').innerText = data.data.ref_no;
                document.getElementById('first_name').innerText = data.data.first_name;
                // Add other fields as needed
            } else {
                // Handle the case when the credentials don't match
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});
function clientInfo() {
    // Create the payload
    let payload = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        suffix: document.getElementById("suffix").value,
        middle_name: document.getElementById("middleName").value,
        contact_no: document.getElementById("contactNumber").value,
        email: document.getElementById("email").value,
        date: document.getElementById("preferredAppointmentDate").value,
        time: document.getElementById("preferredAppointmentTime").value,
        serviceid: document.getElementById("serviceRequired").value,
        note: document.getElementById("note").value
    };

    // Log the values for validation using payload properties
    console.log("Client Info - First Name:", payload.first_name);
    console.log("Client Info - Last Name:", payload.last_name);
    console.log("Client Info - Suffix:", payload.suffix);
    console.log("Client Info - Middle Name:", payload.middle_name);
    console.log("Client Info - Contact Number:", payload.contact_no);
    console.log("Client Info - Email:", payload.email);
    console.log("Client Info - Date:", payload.date);
    console.log("Client Info - Time:", payload.time);
    console.log("Client Info - Service ID:", payload.serviceid);
    console.log("Client Info - Note:", payload.note);

    // Log the payload for validation
    console.log("Payload:", payload);

    // Submit the appointment
    submitAppointment(payload);
}


function api_client( url, content, callback) {
    console.log('URL:', url);
    console.log('Content:', content)

    fetch(url, content)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
}

function submitAppointment(payload){
    console.log("Payload:", payload);
    let url = "http://localhost:8000/appoint/bookAppointment"

    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    api_client(url, content, (response) => {
        if (response.successful == true) {
            let message = `${response.message}: ${response.ref_no}`
            alert(message);

            // Redirect to appointmentDetails.html after successful submission
            window.location.href = "appointmentDetails.html";
        } else {
            alert(response.message);
        }
    })
}


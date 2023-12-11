function getRefInfo() {
    // Get values from the form
    let ref_no = encodeURIComponent(document.getElementById("ref_no").value);
    let contact_no = encodeURIComponent(document.getElementById("contact_no").value);

    // Build the URL with route parameters
    let url = `http://localhost:8000/appoint/searchAppointment/${ref_no}/${contact_no}`;

    // Submit the credentials
    submitInfo(url);
    
    document.querySelector('.submitbutton2').classList.add('clicked');
}

// Reset the click effect on mouseup (when the click is released)
document.addEventListener('mouseup', function() {
  document.querySelector('.submitbutton2').classList.remove('clicked');
});

function api_client(url, content, callback) {
    console.log('URL:', url);
    console.log('Content:', content);

    fetch(url, content)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            callback(data);
        })
        .catch(error => console.error('Error:', error));
}

function submitInfo(url) {
    console.log('URL:', url);

    let content = {
        method: 'GET', // Change to GET method
        headers: {
            'Content-Type': 'application/json'
        }
    };

    api_client(url, content, (response) => {
        if (response.successful === true) {
            alert(response.message);
            window.location.href = "../html/yourDetails.html"; 
        } else {
            alert(message = "Please enter required credentials.");
        }
    });
}

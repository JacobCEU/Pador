const urlParams = new URLSearchParams(window.location.search);
const ref_no = urlParams.get('ref_no');
const contact_no = urlParams.get('contact_no');

if (!ref_no) {
  console.error('Error: Missing ref_no in URL parameters');
} else {
  let url = `http://localhost:8000/appoint/searchAppointment?ref_no=${ref_no}&contact_no=${contact_no}`;
  fetchInfo(url);
}

function formatTime(rawTime) {
  const timeParts = rawTime.split(':');
  return `${(+timeParts[0] % 12) || 12}:${timeParts[1]} ${(timeParts[0] >= 12) ? 'PM' : 'AM'}`;
}

function formatDate(rawDate) {
  const appointmentDate = new Date(rawDate);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[appointmentDate.getMonth()]} ${appointmentDate.getDate()}, ${appointmentDate.getFullYear()}`;
}

function api_client(url, content, callback) {
  console.log('URL:', url);
  console.log('Content:', content);

  fetch(url, content)
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Data from server:', data);
      console.log('Details from server:', data.data);
      const detailsDiv = document.getElementById("details");
      const details = data.data;

      console.log('Details: ', details);
      console.log('Details Div:', detailsDiv);

      if (details) {
        detailsDiv.innerHTML = `
          <div class="transaction-details">Appointment Details</div>
 
          <div class="details-container">
              <div class="left-side">
                  <label for="refNumber">Reference Number:</label>
                  <p id="ref_no">${details.ref_no}</p>
 
                  <div class="name-details">
                      <label for="firstName">First Name:</label>
                      <div id="first_name">${details.first_name}</div>
 
                      <label for="middleName">Middle Name:</label>
                      <div id="middle_name">${details.middle_name}</div>
 
                      <label for="lastName">Last Name:</label>
                      <div id="last_name">${details.last_name}</div>
 
                      <label for="suffix">Suffix:</label>
                      <div id="suffix">${details.suffix}</div>
                  </div>
 
                  <div class="contact-details">
                      <label for="contactNumber">Contact number:</label>
                      <div id="phone_num">${details.contact_no}</div>
 
                      <label for="email">Email:</label>
                      <div id="email">${details.email}</div>
                  </div>
              </div>
 
              <div class="right-side">
                  <div class="datetime-details">
                      <label for="date">Date:</label>
                      <div id="date">${formatDate(details.date)}</div>

                      <label for="time">Time:</label>
                      <div id="time">${formatTime(details.time)}</div>
                  </div>
 
                  <label for="service">Service:</label>
                  <div id="service"> ${details.service_name}</div>
 
                  <label for="note">Note:</label>
                  <div id="note">${details.note}</div>

                  <label for="payStatus">Payment Status:</label>
                  <div id="payStatus"> ${details.payment_status}</div>
 
                  <label for="status">Appointment status:</label>
                  <div id="status">${details.status}</div>
              </div>
          </div>
        `;
      } else {
        console.log('Details is empty:', details);
        detailsDiv.textContent = "Incomplete details received from the server";
      }
  })
    .catch(error => {
      console.error('Error:', error);
    });
}

function fetchInfo(url) {
  
    let content = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    api_client(url, content, (response) => {
      if (response.successful === true) {
        alert(response.message);
      } else {
        alert("No details were fetched");
      }
    });
}
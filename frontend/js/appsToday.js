let url = `http://localhost:8000/admin/viewToday`;
fetchInfo(url);

function formatTime(rawTime) {
  const timeParts = rawTime.split(':');
  return `${(+timeParts[0] % 12) || 12}:${timeParts[1]} ${(timeParts[0] >= 12) ? 'PM' : 'AM'}`;
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
      const namesRow = document.getElementById("namesRows");
      const timeRow = document.getElementById("timeRows");
      const serviceRow = document.getElementById("serviceRows");
      const statusRow = document.getElementById("statusRows");

      namesRow.innerHTML = ""; // Clear previous content
      timeRow.innerHTML = "";
      serviceRow.innerHTML = "";
      statusRow.innerHTML = "";

      const appointments = data.data;

      console.log(appointments);

      if (appointments && appointments.length > 0) {
        appointments.forEach(appointment => {
          // Populate Name row
          namesRow.innerHTML += `
            <div class="name">
                <label>${appointment.firstName} ${appointment.lastName}</label>
            </div>
          `;

          // Populate Time row
          timeRow.innerHTML += `
            <div class="time">
                <label for="${appointment.time}">${formatTime(appointment.time)}</label>
            </div>
          `;

          // Populate Service row
          serviceRow.innerHTML += `
            <div class="service">
                <label for="${appointment.service.toLowerCase().replace(/\s+/g, '-')}">${appointment.service}</label>
            </div>
          `;

          // Populate Status row
          statusRow.innerHTML += `
            <div class="status">
                <label for="${appointment.status.toLowerCase()}">${appointment.status}</label>
            </div>
          `;
        });
      } else {
        namesRow.textContent = "No appointments today";
        timeRow.textContent = "";
        serviceRow.textContent = "";
        statusRow.textContent = "";
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
      alert("No appointments today");
    }
  });
}

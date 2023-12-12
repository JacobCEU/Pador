 // Get the ref_no from the query string
 const urlParams = new URLSearchParams(window.location.search);
 const ref_no = urlParams.get('ref_no');

 // Make the HTTP request to retrieve the details
 fetch(`http://localhost:8000/appoint/viewAppointmentByID?ref_no=${ref_no}`)
   .then(response => response.json())
   .then(data => {
     // Populate the details div with the received data
     const detailsDiv = document.getElementById("details");

     if (data.success) {
       // Display the fetched details
       detailsDiv.innerHTML = `
         <p>Ref No: ${data.ref_no}</p>
         <p>Service ID: ${data.serviceid}</p>
         <p>First Name: ${data.first_name}</p>
         <p>Last Name: ${data.last_name}</p>
         <p>Suffix: ${data.suffix}</p>
         <p>Middle Name: ${data.middle_name}</p>
         <p>Contact No: ${data.contact_no}</p>
         <p>Email: ${data.email}</p>
         <p>Date: ${data.date}</p>
         <p>Time: ${data.time}</p>
         <p>Note: ${data.note}</p>
       `;
     } else {
       // Display an error message if fetching details failed
       detailsDiv.textContent = "Failed to fetch details";
     }
   })
   .catch(error => {
     console.error("Error:", error);
   });
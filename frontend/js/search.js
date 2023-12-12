function getRefInfo() {
    // Get values from the form
    let ref_no = encodeURIComponent(document.getElementById("ref_no").value);
    let contact_no = encodeURIComponent(document.getElementById("contact_no").value);
  
    // Build the URL with query parameters
    let url = `http://localhost:8000/appoint/searchAppointment?ref_no=${ref_no}&contact_no=${contact_no}`;
  
    // Submit the credentials
    submitInfo(url, ref_no, contact_no);
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
        callback(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
function submitInfo(url, ref_no, contact_no) {
  
    let content = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    api_client(url, content, (response) => {
      if (response.successful === true) {
        alert(response.message);
        window.location.href = `../html/yourDetails.html?ref_no=${ref_no}&contact_no=${contact_no}`;
        
      } else {
        alert("Please enter required credentials.");
      }
    });
}
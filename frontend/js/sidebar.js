
  function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

  function showContent(option) {
    // Hide all content sections
    var contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(function(section) {
      section.classList.remove('active');
    });

    // Show the selected content section
    document.getElementById('content' + option).classList.add('active');
  }

//   date and time functionality
  // Function to update the current date and time
  function updateDateTime() {
    var currentDateTimeElement = document.getElementById("current-date-time");
    var currentDate = new Date();

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    var formattedDateTime = currentDate.toLocaleDateString('en-US', options);

    currentDateTimeElement.textContent = formattedDateTime;
  }

  // Update the date and time initially and every second
  updateDateTime();
  setInterval(updateDateTime, 1000);





//   script for details and cancel button
function viewDetails() {
    // Add your logic for viewing details here
    alert('View details clicked');
}

function cancelAppointment() {
    // Add your logic for canceling appointment here
    alert('Cancel appointment clicked');
}

function deleteAppointment() {
    // Add your logic for deleting appointment here
    alert('Delete appointment clicked');
}
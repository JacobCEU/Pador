//changes
function showContent(option) {
  // Hide all content sections
  const contentSections = document.querySelectorAll('.content-section');
  contentSections.forEach(section => {
      section.style.display = 'none';
  });

  // Show the selected content
  const selectedContent = document.getElementById(`content${option}`);
  if (selectedContent) {
      selectedContent.style.display = 'block';
  }

  // Store the selected option in localStorage
  localStorage.setItem('selectedOption', option);
}

// Function to open sidebar and show content for the stored option
function initializePage() {
  openNav();  // Open sidebar

  // Retrieve the stored option from localStorage
  const storedOption = localStorage.getItem('selectedOption');

  // Show content for the stored option or default to option 1
  showContent(storedOption || 1);
}

// Attach the initializePage function to the window onload event
window.onload = initializePage;
//pang sidebar para hindi may collapse kada may papalitan sidebar changes

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

// Function for details, cancel, and delete buttons
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

function changeStatusColor(selectElement) {
  var selectedStatus = selectElement.value;

  // Remove existing classes from the select element
  selectElement.classList.remove('finish', 'ongoing', 'waiting');

  // Add the appropriate class based on the selected status
  selectElement.classList.add(selectedStatus);
}

// Open the sidebar and show content option 1 on page load
window.onload = function() {
  openNav();
  showContent(1);
};
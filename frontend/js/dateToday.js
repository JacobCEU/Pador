document.addEventListener("DOMContentLoaded", function() {
    // Get the container element
    var todayContainer = document.querySelector('.today');

    // Create a new label element
    var label = document.createElement('label');

    // Set the "for" attribute and content of the label
    label.setAttribute('for', 'today-date');
    label.textContent = 'Today: ' + getCurrentDate();

    // Append the label to the container
    todayContainer.appendChild(label);
});

function getCurrentDate() {
    // Create a new Date object
    var currentDate = new Date();

    // Format the date as desired (e.g., November 11, 2023)
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-US', options);

    return formattedDate;
}
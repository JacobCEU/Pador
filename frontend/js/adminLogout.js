const { response } = require("express");

function logoutUser() {
    // Clear the adminToken from session storage
    sessionStorage.removeItem('adminToken', response.adminToken);

    // Redirect the user to the login page
    console.log("User logged out"); // Placeholder message
    window.location.href = '../html/adminLogin.html';
}

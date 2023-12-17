// document.addEventListener("DOMContentLoaded", function () {
//     // Add event listener to the login form
//     document.querySelector(".login-form").addEventListener("submit", function (event) {
//         event.preventDefault(); // Prevent the form from submitting normally

//         // Get the username and password from the form
//         const username = document.getElementById("username").value;
//         const password = document.getElementById("password").value;

//         // Perform basic validation
//         if (username.trim() === "" || password.trim() === "") {
//             alert("Please enter both username and password.");
//             return;
//         }

//         // You need to replace the following URL with your actual backend API endpoint
//         const apiUrl = "http://localhost:8000/admin/adminLogin"; // Replace with your actual API URL

//         console.log("Credentials:", username, password);

//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ username, password }),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 // Check the authentication status from the server response
//                 if (data.success) {
//                     // Authentication successful
//                     alert("Login successful! Redirect to the admin dashboard or perform other actions.");

//                     // You can redirect the user to the admin dashboard or perform other actions here
//                     window.location.href = "../html/adminDashboardMP";
//                 } else {
//                     // Authentication failed
//                     alert("Login failed. Please check your username and password.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error during login:", error);
//                 alert("An error occurred during login. Please try again later.");
//             });
//     });
// });


function loginAdminInfo() {
    // Create the payload
    let payload = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    // Log the values for validation using payload properties
    console.log("admin Info - user:", payload.username);
    console.log("admin Info - password:", payload.password);

    // Log the payload for validation
    console.log("Payload:", payload);

    // Submit the login
    submitLogin(payload);
}


function api_client( url, content, callback) {
    console.log('URL:', url);
    console.log('Content:', content)

    fetch(url, content)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error:', error));
}

function submitLogin(payload) {
    console.log("Payload:", payload);
    let url = "http://localhost:8000/admin/adminLogin";

    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    api_client(url, content, (response) => {
        if (response.successful == true) {
            alert(response.message);
            window.location.href = "../html/admin_dashboard.html"; 
        } else {
            alert(response.message);
        }
    });
}
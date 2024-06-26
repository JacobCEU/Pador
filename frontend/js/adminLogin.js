function loginAdminInfo() {
    let payload = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    console.log("admin Info - user:", payload.username);
    console.log("admin Info - password:", payload.password);
    console.log("Payload:", payload);

    submitLogin(payload);
}

function api_client(url, content, callback) {
    console.log('URL:', url);
    console.log('Content:', content);

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
            sessionStorage.setItem('adminToken', response.adminToken);
            window.location.href = "../html/adminDashboardMP.html";
        } else {
            alert(response.message);
        }
    });
}


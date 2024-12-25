document.getElementById('loginform').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        const responseDiv = document.getElementById('response');
        if (data.success) {
            responseDiv.innerHTML = '<p style="color: green;">Login successful!</p>';
            // Redirect to admin dashboard after a slight delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            responseDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('button-login').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    authenticate(username, password)
});

function authenticate(username, password) {
    fetch(`/development/login/${username}/${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => 
        {
            if (data['result'] == true) {
                document.cookie = `username=${username}`;
                window.location.href = '/rq1';
            } else {
                alert("Invalid username or password");
            }
        }
    )
}


document.getElementById('button-register').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    register(username, password)
});

function register(username, password) {
    fetch(`/development/register/${username}/${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
}
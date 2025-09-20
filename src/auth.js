
const loginForm = `
    <form id="login-form">
        <h3>Login</h3>
        <input type="text" id="login-username" placeholder="Username" required>
        <input type="password" id="login-password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
`;

const registerForm = `
    <form id="register-form">
        <h3>Register</h3>
        <input type="text" id="register-username" placeholder="Username" required>
        <input type="password" id="register-password" placeholder="Password" required>
        <button type="submit">Register</button>
    </form>
`;

const authContainer = document.getElementById('auth-container');
authContainer.innerHTML = loginForm + registerForm;

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.auth) {
            localStorage.setItem('token', data.token);
            window.location.reload();
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
});

const token = localStorage.getItem('token');
if (token) {
    authContainer.innerHTML = '<button id="logout-button">Logout</button>';
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
    });
} else {
    document.getElementById('games').style.display = 'none';
}

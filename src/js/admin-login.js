// admin-login.js

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;
    const msg = document.getElementById('adminLoginMessage');
    if (user === 'admin' && pass === 'Ajhf2929*') {
        localStorage.setItem('admin-auth', 'true');
        window.location.href = 'admin.html';
    } else {
        msg.textContent = 'Usuário ou senha incorretos!';
        msg.className = 'message error';
    }
}); 
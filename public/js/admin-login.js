// admin-login.js - Login específico para administrador
const API_URL = 'http://localhost:3001';

document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form de login admin submetido');
    
    const usuario = document.getElementById('adminUser').value.trim();
    const senha = document.getElementById('adminPass').value;
    const message = document.getElementById('adminLoginMessage');
    
    console.log('Tentando login com:', usuario);
    
    if (!usuario || !senha) {
        message.textContent = 'Preencha todos os campos!';
        message.className = 'message error';
        return;
    }
    
    try {
        console.log('Fazendo requisição para:', `${API_URL}/login`);
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuario,
                password: senha
            })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
            message.textContent = data.error || 'Erro no login!';
            message.className = 'message error';
            return;
        }
        
        // Verificar se é realmente um admin
        if (data.role !== 'admin') {
            message.textContent = 'Acesso negado. Apenas administradores podem acessar esta área.';
            message.className = 'message error';
            return;
        }
        
        console.log('Login admin bem-sucedido, salvando no localStorage');
        // Salvar dados do admin logado
        localStorage.setItem('admin-auth', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            username: data.username,
            role: data.role
        }));
        
        message.textContent = 'Login realizado com sucesso!';
        message.className = 'message success';
        
        console.log('Redirecionando para admin.html em 1 segundo...');
        // Redirecionar para o painel admin
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        
    } catch (error) {
        console.error('Erro no login admin:', error);
        message.textContent = 'Erro de conexão com o servidor!';
        message.className = 'message error';
    }
}); 
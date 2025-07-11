// auth.js - Integrado com API
const API_URL = 'http://localhost:3001';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const perfil = document.getElementById('perfil').value;
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const message = document.getElementById('loginMessage');
    
    if (!perfil || !usuario || !senha) {
        message.textContent = 'Preencha todos os campos!';
        message.className = 'message error';
        return;
    }
    
    try {
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
        
        const data = await response.json();
        
        if (!response.ok) {
            message.textContent = data.error || 'Erro no login!';
            message.className = 'message error';
            return;
        }
        
        // Verificar se o perfil selecionado corresponde ao role do usuário
        if (data.role !== perfil) {
            message.textContent = 'Perfil incorreto para este usuário!';
            message.className = 'message error';
            return;
        }
        
        // Salvar dados do usuário logado
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            username: data.username,
            role: data.role,
            aluno: data.aluno
        }));
        
        message.textContent = 'Login realizado com sucesso!';
        message.className = 'message success';
        
        // Redirecionar baseado no perfil
        setTimeout(() => {
            if (perfil === 'admin') {
                window.location.href = 'admin.html';
            } else if (perfil === 'aluno') {
                window.location.href = 'aluno.html';
            } else if (perfil === 'professor') {
                window.location.href = 'professor.html';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erro:', error);
        message.textContent = 'Erro de conexão com o servidor!';
        message.className = 'message error';
    }
});
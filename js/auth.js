const usuarios = {
    'joao': { perfil: 'aluno', senhaHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' },
    'maria': { perfil: 'aluno', senhaHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' },
    'pedro': { perfil: 'aluno', senhaHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' },
    'professor': { perfil: 'professor', senhaHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' }
};

function gerarHash(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    return crypto.subtle.digest('SHA-256', data)
        .then(hash => {
            const hexArray = Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'));
            return hexArray.join('');
        });
}

async function login(event) {
    event.preventDefault();
    
    const perfil = document.getElementById('perfil').value;
    const usuario = document.getElementById('usuario').value.toLowerCase();
    const senha = document.getElementById('senha').value;
    const messageElement = document.getElementById('loginMessage');

    if (!usuario || !senha || !perfil) {
        messageElement.textContent = "Todos os campos são obrigatórios!";
        messageElement.className = "message error";
        return;
    }

    const user = usuarios[usuario];
    const senhaHash = await gerarHash(senha);

    if (user && user.perfil === perfil && user.senhaHash === senhaHash) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
            nome: usuario,
            perfil: perfil
        }));
        
        window.location.href = perfil === 'professor' ? "professor.html" : "aluno.html";
    } else {
        messageElement.textContent = "Credenciais inválidas ou perfil incorreto!";
        messageElement.className = "message error";
    }
}

document.getElementById('loginForm')?.addEventListener('submit', login);

// Limpar mensagens quando o usuário começar a digitar
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#loginForm input, #loginForm select');
    const messageElement = document.getElementById('loginMessage');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (messageElement.textContent) {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }
        });
    });
});
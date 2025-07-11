// admin.js - Integrado com API
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin.js carregado');
    renderUsersTable();

    // Modal logic
    const modal = document.getElementById('createUserModal');
    const openBtn = document.getElementById('openCreateUser');
    const closeBtn = document.getElementById('closeCreateUser');
    
    console.log('Modal:', modal);
    console.log('OpenBtn:', openBtn);
    console.log('CloseBtn:', closeBtn);
    
    if (openBtn) {
        openBtn.onclick = () => { 
            console.log('Botão criar usuário clicado');
            modal.style.display = 'flex'; 
        };
    }
    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; resetCreateUserForm(); };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetCreateUserForm();
        }
    };

    const form = document.getElementById('createUserForm');
    console.log('Form:', form);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submetido');
            createUser();
        });
    }
});

async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function renderUsersTable() {
    const users = await getUsers();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach((user, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${user.username}" data-id="${user.id}" class="edit-usuario" style="width:90px"></td>
            <td>
                <select data-id="${user.id}" class="edit-perfil">
                    <option value="aluno" ${user.role === 'aluno' ? 'selected' : ''}>Aluno</option>
                    <option value="professor" ${user.role === 'professor' ? 'selected' : ''}>Professor</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
            </td>
            <td><div class="actions">
                <button onclick="saveUser(${user.id})">Salvar</button>
                <button onclick="deleteUser(${user.id})">Apagar</button>
            </div></td>
        `;
        tbody.appendChild(tr);
    });
}

async function createUser() {
    const usuario = document.getElementById('novoUsuario').value.trim();
    const senha = document.getElementById('novaSenha').value;
    const perfil = document.getElementById('novoPerfil').value;
    const message = document.getElementById('createUserMessage');
    
    if (!usuario || !senha || !perfil) {
        message.textContent = 'Preencha todos os campos!';
        message.className = 'message error';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuario,
                password: senha,
                role: perfil
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            message.textContent = data.error || 'Erro ao criar usuário!';
            message.className = 'message error';
            return;
        }
        
        message.textContent = 'Conta criada com sucesso!';
        message.className = 'message success';
        document.getElementById('createUserForm').reset();
        renderUsersTable();
        
        // Fechar modal após sucesso
        setTimeout(() => {
            document.getElementById('createUserModal').style.display = 'none';
            resetCreateUserForm();
        }, 1500);
        
    } catch (error) {
        console.error('Erro:', error);
        message.textContent = 'Erro de conexão com o servidor!';
        message.className = 'message error';
    }
}

async function saveUser(userId) {
    const tr = document.querySelector(`[data-id="${userId}"]`).closest('tr');
    const usuario = tr.querySelector('.edit-usuario').value.trim();
    const perfil = tr.querySelector('.edit-perfil').value;
    
    if (!usuario || !perfil) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuario,
                role: perfil
            })
        });
        
        if (response.ok) {
            renderUsersTable();
        } else {
            console.error('Erro ao atualizar usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function deleteUser(userId) {
    if (!confirm('Tem certeza que deseja apagar esta conta?')) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            renderUsersTable();
        } else {
            console.error('Erro ao deletar usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function resetCreateUserForm() {
    document.getElementById('createUserForm').reset();
    document.getElementById('createUserMessage').textContent = '';
} 
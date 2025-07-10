// admin.js
// Funções para gerenciar contas de usuários (CRUD)

document.addEventListener('DOMContentLoaded', () => {
    renderUsersTable();

    // Modal logic
    const modal = document.getElementById('createUserModal');
    const openBtn = document.getElementById('openCreateUser');
    const closeBtn = document.getElementById('closeCreateUser');
    if (openBtn) openBtn.onclick = () => { modal.style.display = 'flex'; };
    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; resetCreateUserForm(); };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetCreateUserForm();
        }
    };

    document.getElementById('createUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createUser();
    });
});

function getUsers() {
    // Supondo que database.js use localStorage para armazenar usuários
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function setUsers(users) {
    localStorage.setItem('usuarios', JSON.stringify(users));
}

function renderUsersTable() {
    const users = getUsers();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    users.forEach((user, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${user.usuario}" data-idx="${idx}" class="edit-usuario" style="width:90px"></td>
            <td>
                <select data-idx="${idx}" class="edit-perfil">
                    <option value="aluno" ${user.perfil === 'aluno' ? 'selected' : ''}>Aluno</option>
                    <option value="professor" ${user.perfil === 'professor' ? 'selected' : ''}>Professor</option>
                    <option value="admin" ${user.perfil === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
            </td>
            <td><div class="actions">
                <button onclick="saveUser(${idx})">Salvar</button>
                <button onclick="deleteUser(${idx})">Apagar</button>
            </div></td>
        `;
        tbody.appendChild(tr);
    });
}

function createUser() {
    const usuario = document.getElementById('novoUsuario').value.trim();
    const senha = document.getElementById('novaSenha').value;
    const perfil = document.getElementById('novoPerfil').value;
    const message = document.getElementById('createUserMessage');
    if (!usuario || !senha || !perfil) {
        message.textContent = 'Preencha todos os campos!';
        message.className = 'message error';
        return;
    }
    let users = getUsers();
    if (users.some(u => u.usuario === usuario)) {
        message.textContent = 'Usuário já existe!';
        message.className = 'message error';
        return;
    }
    users.push({ usuario, senha, perfil });
    setUsers(users);
    message.textContent = 'Conta criada com sucesso!';
    message.className = 'message success';
    document.getElementById('createUserForm').reset();
    renderUsersTable();
}

function saveUser(idx) {
    let users = getUsers();
    const tr = document.querySelectorAll('#usersTable tbody tr')[idx];
    const usuario = tr.querySelector('.edit-usuario').value.trim();
    const perfil = tr.querySelector('.edit-perfil').value;
    if (!usuario || !perfil) return;
    users[idx].usuario = usuario;
    users[idx].perfil = perfil;
    setUsers(users);
    renderUsersTable();
}

function deleteUser(idx) {
    let users = getUsers();
    if (!confirm('Tem certeza que deseja apagar esta conta?')) return;
    users.splice(idx, 1);
    setUsers(users);
    renderUsersTable();
}

function resetCreateUserForm() {
    document.getElementById('createUserForm').reset();
    document.getElementById('createUserMessage').textContent = '';
} 
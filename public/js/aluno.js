// aluno.js - Integrado com API
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosAluno();
});

async function carregarDadosAluno() {
    const dadosAluno = document.getElementById('dadosAluno');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id || currentUser.role !== 'aluno') {
        dadosAluno.innerHTML = '<h2>Erro: Usuário não autorizado</h2>';
        return;
    }
    
    try {
        console.log('Dados do usuário atual:', currentUser);
        
        // Verificar se o aluno tem dados associados
        if (!currentUser.aluno || !currentUser.aluno.id) {
            dadosAluno.innerHTML = '<h2>Erro: Dados do aluno não encontrados</h2>';
            return;
        }
        
        // Buscar dados completos do aluno
        const response = await fetch(`${API_URL}/alunos/${currentUser.aluno.id}/dados`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do aluno');
        }
        
        const aluno = await response.json();
        console.log('Dados do aluno carregados:', aluno);
        exibirDadosAluno(aluno);
        
    } catch (error) {
        console.error('Erro ao carregar dados do aluno:', error);
        dadosAluno.innerHTML = '<h2>Erro ao carregar dados do aluno</h2>';
    }
}

function exibirDadosAluno(aluno) {
    const dadosAluno = document.getElementById('dadosAluno');
    
    let html = `
        <h2>Dados do Aluno</h2>
        <div class="aluno-info">
            <p><strong>Nome:</strong> ${aluno.nome}</p>
            <p><strong>Usuário:</strong> ${aluno.user?.username || 'N/A'}</p>
        </div>
    `;
    
    // Exibir notas
    if (aluno.notas && aluno.notas.length > 0) {
        html += `
            <h3>Notas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Matéria</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        aluno.notas.forEach(nota => {
            html += `
                <tr>
                    <td>${nota.materia}</td>
                    <td>${nota.valor}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
    } else {
        html += '<p>Nenhuma nota registrada ainda.</p>';
    }
    
    // Exibir frequência
    if (aluno.frequencias && aluno.frequencias.length > 0) {
        const ultimaFreq = aluno.frequencias[0];
        html += `
            <h3>Frequência</h3>
            <p><strong>Percentual:</strong> ${ultimaFreq.percentual}%</p>
            <p><strong>Data:</strong> ${new Date(ultimaFreq.data).toLocaleDateString('pt-BR')}</p>
        `;
    } else {
        html += '<p>Nenhuma frequência registrada ainda.</p>';
    }
    
    dadosAluno.innerHTML = html;
}
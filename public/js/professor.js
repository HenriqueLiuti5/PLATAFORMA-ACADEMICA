// professor.js - Integrado com API
const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
    await carregarAlunos();
    
    document.getElementById('notasForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await salvarNotas();
    });
});

async function carregarAlunos() {
    const selectAluno = document.getElementById('aluno');
    console.log('Carregando alunos...');
    
    try {
        const response = await fetch(`${API_URL}/alunos`);
        console.log('Response status:', response.status);
        
        if (!response.ok) throw new Error('Erro ao buscar alunos');
        
        const alunos = await response.json();
        console.log('Alunos carregados:', alunos);
        
        selectAluno.innerHTML = '<option value="">Selecione o aluno</option>';
        alunos.forEach(aluno => {
            console.log('Adicionando aluno:', aluno.nome);
            selectAluno.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
        });
        
        console.log('Total de alunos carregados:', alunos.length);
        
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        selectAluno.innerHTML = '<option value="">Erro ao carregar alunos</option>';
    }
}

async function salvarNotas() {
    const alunoId = document.getElementById('aluno').value;
    const mensagem = document.getElementById('mensagem');
    
    if (!alunoId) {
        mensagem.textContent = 'Selecione um aluno!';
        mensagem.className = 'message error';
        return;
    }
    
    const notas = {
        matematica: document.getElementById('matematica').value,
        portugues: document.getElementById('portugues').value,
        historia: document.getElementById('historia').value,
        geografia: document.getElementById('geografia').value,
        fisica: document.getElementById('fisica').value,
        quimica: document.getElementById('quimica').value,
        biologia: document.getElementById('biologia').value,
        ingles: document.getElementById('ingles').value
    };
    
    const frequencia = document.getElementById('frequencia').value;
    
    try {
        // Salvar notas
        const responseNotas = await fetch(`${API_URL}/alunos/${alunoId}/notas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notas)
        });
        
        if (!responseNotas.ok) {
            throw new Error('Erro ao salvar notas');
        }
        
        // Salvar frequência
        if (frequencia) {
            const responseFreq = await fetch(`${API_URL}/alunos/${alunoId}/frequencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ percentual: parseFloat(frequencia) })
            });
            
            if (!responseFreq.ok) {
                throw new Error('Erro ao salvar frequência');
            }
        }
        
        mensagem.textContent = 'Dados salvos com sucesso!';
        mensagem.className = 'message success';
        
        // Limpar formulário
        document.getElementById('notasForm').reset();
        
    } catch (error) {
        console.error('Erro:', error);
        mensagem.textContent = 'Erro ao salvar dados!';
        mensagem.className = 'message error';
    }
}
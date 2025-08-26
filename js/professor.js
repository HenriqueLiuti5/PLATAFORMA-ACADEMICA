document.addEventListener('DOMContentLoaded', () => {
    const alunosSelect = document.getElementById('aluno');
    const notasForm = document.getElementById('notasForm');
    const messageElement = document.getElementById('mensagem');

    // Verificar se é professor
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario || usuario.perfil !== 'professor') {
        window.location.href = "index.html";
        return;
    }

    // Carrega lista de alunos
    const alunos = db.listarAlunos();
    if (alunos.length === 0) {
        alunosSelect.innerHTML = '<option value="">Nenhum aluno cadastrado</option>';
        showMessage("Nenhum aluno encontrado no sistema", "error");
    } else {
        alunosSelect.innerHTML = '<option value="">Selecione um aluno</option>' + 
            alunos.map(aluno => 
                `<option value="${aluno.usuario}">${aluno.nome}</option>`
            ).join('');
    }

    // Manipula envio do formulário
    notasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const aluno = alunosSelect.value;
        const frequencia = document.getElementById('frequencia').value;

        // Validações
        if (!aluno) {
            showMessage("Por favor, selecione um aluno", "error");
            return;
        }

        if (frequencia < 0 || frequencia > 100) {
            showMessage("Frequência deve estar entre 0 e 100%", "error");
            return;
        }

        // Atualiza frequência
        if (!db.atualizarFrequencia(aluno, frequencia)) {
            showMessage("Erro ao atualizar frequência", "error");
            return;
        }

        // Atualiza notas
        const materias = [
            'matematica', 'portugues', 'historia', 'geografia',
            'fisica', 'quimica', 'biologia', 'ingles'
        ];

        let notasAtualizadas = 0;
        let notasValidas = 0;
        
        materias.forEach(materia => {
            const nota = document.getElementById(materia).value;
            if (nota !== '') {
                notasValidas++;
                if (nota >= 0 && nota <= 10) {
                    if (db.atualizarNotas(aluno, materia, nota)) {
                        notasAtualizadas++;
                    }
                } else {
                    showMessage(`Nota de ${materia} deve estar entre 0 e 10`, "error");
                    return;
                }
            }
        });

        if (notasValidas === 0) {
            showMessage("Nenhuma nota foi preenchida", "error");
            return;
        }

        const alunoNome = alunos.find(a => a.usuario === aluno)?.nome || aluno;
        showMessage(`Dados salvos com sucesso para ${alunoNome}! ${notasAtualizadas} notas atualizadas.`, "success");
        notasForm.reset();
        alunosSelect.value = '';
    });

    function showMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.className = `message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === "success") {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 5000);
        }
        
        // Auto-hide error messages after 8 seconds
        if (type === "error") {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 8000);
        }
    }

    // Adicionar validação em tempo real para as notas (0-10)
    const notaInputs = document.querySelectorAll('input[type="number"]:not(#frequencia)');
    notaInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value < 0) {
                e.target.value = 0;
            } else if (value > 10) {
                e.target.value = 10;
            }
        });
    });

    // Validação específica para frequência (0-100)
    const frequenciaInput = document.getElementById('frequencia');
    frequenciaInput.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        if (value < 0) {
            e.target.value = 0;
        } else if (value > 100) {
            e.target.value = 100;
        }
    });

    // Limpar mensagens quando o usuário interagir com o formulário
    const formInputs = document.querySelectorAll('#notasForm input, #notasForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (messageElement.textContent && !messageElement.textContent.includes('✅')) {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }
        });
    });
});
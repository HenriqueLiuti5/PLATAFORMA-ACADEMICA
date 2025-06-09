document.addEventListener('DOMContentLoaded', () => {
    const alunosSelect = document.getElementById('aluno');
    const notasForm = document.getElementById('notasForm');
    const messageElement = document.getElementById('mensagem');

    // Carrega lista de alunos
    const alunos = db.listarAlunos();
    alunosSelect.innerHTML = alunos.map(aluno => 
        `<option value="${aluno.usuario}">${aluno.nome}</option>`
    ).join('');

    // Manipula envio do formulário
    notasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const aluno = alunosSelect.value;
        const frequencia = document.getElementById('frequencia').value;

        // Validações
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
        materias.forEach(materia => {
            const nota = document.getElementById(materia).value;
            if (nota && nota >= 0 && nota <= 10) {
                if (db.atualizarNotas(aluno, materia, nota)) {
                    notasAtualizadas++;
                }
            }
        });

        showMessage(`Dados salvos com sucesso! ${notasAtualizadas} notas atualizadas.`, "success");
        notasForm.reset();
    });

    function showMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.style.color = type === "error" ? "red" : "green";
    }
});
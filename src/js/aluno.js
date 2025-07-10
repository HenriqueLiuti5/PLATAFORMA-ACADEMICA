document.addEventListener('DOMContentLoaded', () => {
    const dadosAluno = document.getElementById('dadosAluno');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    const aluno = db.getAluno(usuario.nome);
    
    if (!aluno) {
        dadosAluno.innerHTML = "<p>Nenhum dado encontrado para seu usuário.</p>";
        return;
    }

    let html = `<h2>Notas de ${usuario.nome.charAt(0).toUpperCase() + usuario.nome.slice(1)}</h2>`;
    
    if (Object.keys(aluno.notas).length > 0) {
        html += `<table>
            <tr><th>Matéria</th><th>Nota</th></tr>`;
        
        for (const [materia, nota] of Object.entries(aluno.notas)) {
            html += `<tr>
                <td>${materia.charAt(0).toUpperCase() + materia.slice(1)}</td>
                <td>${nota.toFixed(1)}</td>
            </tr>`;
        }
        
        html += `</table>`;
    } else {
        html += "<p>Nenhuma nota cadastrada ainda.</p>";
    }

    html += `<h3>Frequência: ${aluno.frequencia}%</h3>`;
    
    dadosAluno.innerHTML = html;
});
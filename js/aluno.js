document.addEventListener('DOMContentLoaded', () => {
    const dadosAluno = document.getElementById('dadosAluno');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    const aluno = db.getAluno(usuario.nome);
    
    if (!aluno) {
        dadosAluno.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #666; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Nenhum dado encontrado para seu usuário.
                </h3>
                <p style="color: #888;">Entre em contato com seu professor para cadastrar suas informações.</p>
            </div>`;
        return;
    }

    let html = `<h3>
        <svg class="welcome-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        Bem-vindo, ${usuario.nome.charAt(0).toUpperCase() + usuario.nome.slice(1)}!
    </h3>`;
    
    // Seção de Notas
    if (Object.keys(aluno.notas).length > 0) {
        html += `<h3>
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09v6h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
            Suas Notas
        </h3>`;
        
        for (const [materia, nota] of Object.entries(aluno.notas)) {
            const materiaIcon = getMateriaIcon(materia);
            const notaClass = nota >= 7 ? 'nota-boa' : nota >= 5 ? 'nota-media' : 'nota-ruim';
            
            html += `<div class="nota-item">
                <span class="nota-materia">${materiaIcon} ${materia.charAt(0).toUpperCase() + materia.slice(1)}</span>
                <span class="nota-valor ${notaClass}">${nota.toFixed(1)}</span>
            </div>`;
        }
        
        // Calcular média
        const notas = Object.values(aluno.notas);
        const media = notas.reduce((a, b) => a + b, 0) / notas.length;
        html += `<div class="nota-item" style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: white; font-weight: bold;">
            <span class="nota-materia">
                <svg class="nota-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Média Geral
            </span>
            <span class="nota-valor" style="color: white;">${media.toFixed(1)}</span>
        </div>`;
    } else {
        html += `<div style="text-align: center; padding: 2rem; background: var(--light-gray); border-radius: 12px; margin: 1rem 0;">
            <h4 style="color: #666; margin-bottom: 1rem;">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; margin-right: 8px;">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Nenhuma nota cadastrada ainda
            </h4>
            <p style="color: #888;">Aguarde seu professor cadastrar suas notas.</p>
        </div>`;
    }

    // Seção de Frequência
    html += `<div class="frequencia-info">
        <h3>
            <svg class="freq-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            Sua Frequência
        </h3>
        <div class="frequencia-valor">${aluno.frequencia}%</div>
        <p style="margin-top: 1rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            ${aluno.frequencia >= 75 ? 
                '<svg class="status-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Excelente frequência!' : 
              aluno.frequencia >= 60 ? 
                '<svg class="status-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> Frequência regular' : 
                '<svg class="status-icon" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg> Frequência baixa'}
        </p>
    </div>`;
    
    dadosAluno.innerHTML = html;
});

function getMateriaIcon(materia) {
    const icons = {
        'matematica': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
        'portugues': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.83-6.96l-.01-.01L9.35 3H4.72C4.25 1.44 5.61.43 7.27.88L12.87 15.07zM12.87 15.07l2.54-2.51.03-.03c1.74-1.94 2.01-4.65.83-6.96l-.01-.01L14.65 3h4.63c.47-1.56-.89-2.57-2.55-2.12L12.87 15.07z"/></svg>',
        'historia': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        'geografia': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
        'fisica': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></svg>',
        'quimica': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
        'biologia': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        'ingles': '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.83-6.96l-.01-.01L9.35 3H4.72C4.25 1.44 5.61.43 7.27.88L12.87 15.07zM12.87 15.07l2.54-2.51.03-.03c1.74-1.94 2.01-4.65.83-6.96l-.01-.01L14.65 3h4.63c.47-1.56-.89-2.57-2.55-2.12L12.87 15.07z"/></svg>'
    };
    return icons[materia] || '<svg class="materia-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09v6h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>';
}
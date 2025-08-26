class Database {
    constructor() {
        this.dados = JSON.parse(localStorage.getItem('academicDB')) || {
            alunos: {
                'joao': { nome: 'João', notas: {}, frequencia: 0 },
                'maria': { nome: 'Maria', notas: {}, frequencia: 0 },
                'pedro': { nome: 'Pedro', notas: {}, frequencia: 0 }
            }
        };
    }

    salvarDados() {
        localStorage.setItem('academicDB', JSON.stringify(this.dados));
    }

    getAluno(usuario) {
        return this.dados.alunos[usuario] || null;
    }

    atualizarNotas(usuario, materia, nota) {
        if (!this.dados.alunos[usuario]) return false;
        
        this.dados.alunos[usuario].notas[materia] = parseFloat(nota);
        this.salvarDados();
        return true;
    }

    atualizarFrequencia(usuario, frequencia) {
        if (!this.dados.alunos[usuario]) return false;
        
        this.dados.alunos[usuario].frequencia = parseFloat(frequencia);
        this.salvarDados();
        return true;
    }

    listarAlunos() {
        return Object.keys(this.dados.alunos).map(key => ({
            usuario: key,
            nome: this.dados.alunos[key].nome
        }));
    }
}

const db = new Database();
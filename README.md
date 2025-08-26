# 🎓 EduSync - Plataforma Acadêmica

Uma plataforma acadêmica moderna e intuitiva para gestão de notas e frequência de alunos.

## ✨ Características

- **🎨 Design Moderno**: Interface com tema laranja e branco, responsiva e amigável
- **👥 Múltiplos Perfis**: Sistema de login para alunos e professores
- **📊 Gestão de Notas**: Cadastro e visualização de notas por matéria
- **📈 Controle de Frequência**: Acompanhamento da frequência dos alunos
- **📱 Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **🔒 Seguro**: Sistema de autenticação com hash SHA-256

## 🚀 Como Usar

### Login
- **Usuários**: joao, maria, pedro (alunos) | professor (professor)
- **Senha**: 123 (para todos os usuários)

### Para Alunos
1. Faça login selecionando "Aluno"
2. Visualize suas notas por matéria
3. Acompanhe sua frequência
4. Veja sua média geral

### Para Professores
1. Faça login selecionando "Professor"
2. Selecione um aluno
3. Cadastre notas (0-10) para cada matéria
4. Defina a frequência (0-100%)
5. Salve os dados

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno com gradientes e animações
- **JavaScript**: Funcionalidades interativas
- **LocalStorage**: Armazenamento local dos dados
- **Google Fonts**: Tipografia Poppins

## 📁 Estrutura do Projeto

```
PLATAFORMA ACADEMICA/
├── index.html          # Página de login
├── aluno.html          # Painel do aluno
├── professor.html      # Painel do professor
├── edusync.png         # Logo da plataforma
├── css/
│   └── style.css       # Estilos principais
├── js/
│   ├── auth.js         # Sistema de autenticação
│   ├── database.js     # Gerenciamento de dados
│   ├── aluno.js        # Funcionalidades do aluno
│   └── professor.js    # Funcionalidades do professor
└── README.md           # Documentação
```

## 🎨 Design System

### Cores
- **Primária**: #FF6B35 (Laranja vibrante)
- **Secundária**: #FF8C42 (Laranja claro)
- **Acento**: #FFB366 (Laranja suave)
- **Branco**: #FFFFFF
- **Texto**: #2C3E50 (Azul escuro)

### Tipografia
- **Títulos**: Poppins (Bold)
- **Corpo**: Segoe UI

## 🔧 Funcionalidades Técnicas

- **Validação em Tempo Real**: Notas limitadas entre 0-10
- **Feedback Visual**: Mensagens de sucesso e erro
- **Cálculo Automático**: Média geral dos alunos
- **Responsividade**: Adaptação para diferentes telas
- **Animações**: Transições suaves e hover effects

## 📱 Compatibilidade

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móveis
- ✅ Tablets

## 🔮 Próximas Melhorias

- [ ] Sistema de recuperação de senha
- [ ] Dashboard com gráficos
- [ ] Exportação de relatórios
- [ ] Notificações push
- [ ] Sistema de mensagens
- [ ] Backup em nuvem

---

**Desenvolvido com ❤️ para facilitar a gestão acadêmica**

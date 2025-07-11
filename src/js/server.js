// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Função para hash de senha
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Função para validar senha
function validatePassword(password) {
  if (password.length < 6) {
    return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
  }
  return { valid: true };
}

// Função para validar username
function validateUsername(username) {
  if (username.length < 3) {
    return { valid: false, error: 'Username deve ter pelo menos 3 caracteres' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username deve conter apenas letras, números e underscore' };
  }
  return { valid: true };
}

// Middleware de validação melhorada
const validateUser = (req, res, next) => {
  const { username, password, role } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  if (!['admin', 'aluno', 'professor'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }
  
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.error });
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }
  
  next();
};

// Middleware de autenticação básica
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação necessário' });
  }
  // Implementação básica - em produção usar JWT
  next();
};

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Plataforma Acadêmica rodando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ===== ROTAS DE USUÁRIOS =====

// Buscar todos os usuários
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        aluno: {
          select: {
            id: true,
            nome: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar usuário
app.post('/users', validateUser, async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username já existe' });
    }
    
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: { 
        username, 
        password: hashedPassword, 
        role 
      }
    });
    
    res.status(201).json({ 
      id: user.id, 
      username: user.username, 
      role: user.role,
      message: 'Usuário criado com sucesso'
    });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar usuário
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  
  if (!username || !role) {
    return res.status(400).json({ error: 'Username e role são obrigatórios' });
  }
  
  if (!['admin', 'aluno', 'professor'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }
  
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.error });
  }
  
  try {
    // Verificar se username já existe em outro usuário
    const existingUser = await prisma.user.findFirst({
      where: { 
        username,
        id: { not: parseInt(id) }
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username já existe' });
    }
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, role }
    });
    
    res.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role,
      message: 'Usuário atualizado com sucesso'
    });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar usuário
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTA DE LOGIN =====

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }
    
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      aluno: user.aluno,
      message: 'Login realizado com sucesso'
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE ALUNOS =====

// Buscar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        notas: true,
        frequencias: {
          orderBy: { data: 'desc' },
          take: 1
        }
      }
    });
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Criar aluno
app.post('/alunos', async (req, res) => {
  const { nome, userId } = req.body;
  
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  
  try {
    const aluno = await prisma.aluno.create({
      data: { 
        nome,
        userId: userId || null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });
    res.status(201).json(aluno);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// ===== ROTAS DE NOTAS =====

// Buscar notas de um aluno
app.get('/alunos/:alunoId/notas', async (req, res) => {
  const { alunoId } = req.params;
  
  try {
    const notas = await prisma.nota.findMany({
      where: { alunoId: parseInt(alunoId) },
      orderBy: { id: 'desc' }
    });
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notas' });
  }
});

// Criar/atualizar notas
app.post('/alunos/:alunoId/notas', async (req, res) => {
  const { alunoId } = req.params;
  const { matematica, portugues, historia, geografia, fisica, quimica, biologia, ingles } = req.body;
  
  try {
    const materias = [
      { materia: 'Matemática', valor: matematica },
      { materia: 'Português', valor: portugues },
      { materia: 'História', valor: historia },
      { materia: 'Geografia', valor: geografia },
      { materia: 'Física', valor: fisica },
      { materia: 'Química', valor: quimica },
      { materia: 'Biologia', valor: biologia },
      { materia: 'Inglês', valor: ingles }
    ].filter(n => n.valor !== undefined && n.valor !== null);
    
    // Deletar notas existentes
    await prisma.nota.deleteMany({
      where: { alunoId: parseInt(alunoId) }
    });
    
    // Criar novas notas
    const notas = await prisma.nota.createMany({
      data: materias.map(n => ({
        alunoId: parseInt(alunoId),
        materia: n.materia,
        valor: parseFloat(n.valor)
      }))
    });
    
    res.status(201).json({ message: 'Notas salvas com sucesso', count: notas.count });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar notas' });
  }
});

// ===== ROTAS DE FREQUÊNCIA =====

// Buscar frequência de um aluno
app.get('/alunos/:alunoId/frequencia', async (req, res) => {
  const { alunoId } = req.params;
  
  try {
    const frequencias = await prisma.frequencia.findMany({
      where: { alunoId: parseInt(alunoId) },
      orderBy: { data: 'desc' }
    });
    res.json(frequencias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar frequência' });
  }
});

// Criar frequência
app.post('/alunos/:alunoId/frequencia', async (req, res) => {
  const { alunoId } = req.params;
  const { percentual } = req.body;
  
  if (!percentual || percentual < 0 || percentual > 100) {
    return res.status(400).json({ error: 'Percentual deve estar entre 0 e 100' });
  }
  
  try {
    const frequencia = await prisma.frequencia.create({
      data: {
        alunoId: parseInt(alunoId),
        percentual: parseFloat(percentual)
      }
    });
    res.status(201).json(frequencia);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar frequência' });
  }
});

// ===== ROTA DE DADOS COMPLETOS DO ALUNO =====

app.get('/alunos/:alunoId/dados', async (req, res) => {
  const { alunoId } = req.params;
  
  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: parseInt(alunoId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        notas: true,
        frequencias: {
          orderBy: { data: 'desc' },
          take: 1
        }
      }
    });
    
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do aluno' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
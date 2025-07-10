// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API da Plataforma Acadêmica rodando!');
});

// Exemplo: buscar todos os usuários
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Exemplo: criar usuário
app.post('/users', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, password, role }
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário', details: err });
  }
});

// (Adicione outras rotas conforme necessário...)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
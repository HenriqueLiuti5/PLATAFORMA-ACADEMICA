// seed.js - Script para popular o banco com dados iniciais
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Função para hash de senha
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // Limpar dados existentes (opcional)
    console.log('🧹 Limpando dados existentes...');
    await prisma.frequencia.deleteMany();
    await prisma.nota.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.user.deleteMany();
    
    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashPassword('Ajhf2929*'),
        role: 'admin'
      }
    });
    console.log('✅ Admin criado:', admin.username);
    
    // Criar alguns alunos de exemplo
    const alunos = [
      { nome: 'João Silva', username: 'joao', password: '123456' },
      { nome: 'Maria Santos', username: 'maria', password: '123456' },
      { nome: 'Pedro Costa', username: 'pedro', password: '123456' },
      { nome: 'Ana Oliveira', username: 'ana', password: '123456' },
      { nome: 'Carlos Ferreira', username: 'carlos', password: '123456' }
    ];
    
    for (const alunoData of alunos) {
      // Criar aluno primeiro
      const aluno = await prisma.aluno.create({
        data: {
          nome: alunoData.nome
        }
      });
      
      // Criar usuário e conectar ao aluno
      const user = await prisma.user.create({
        data: {
          username: alunoData.username,
          password: hashPassword(alunoData.password),
          role: 'aluno',
          alunoId: aluno.id
        }
      });
      
      console.log(`✅ Aluno criado: ${aluno.nome} (${user.username})`);
    }
    
    // Criar professor
    const professor = await prisma.user.create({
      data: {
        username: 'professor',
        password: hashPassword('123456'),
        role: 'professor'
      }
    });
    console.log('✅ Professor criado:', professor.username);
    
    // Criar alguns dados de exemplo (notas e frequência)
    const alunosCriados = await prisma.aluno.findMany();
    
    for (const aluno of alunosCriados) {
      // Criar notas de exemplo
      const materias = ['Matemática', 'Português', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês'];
      const notas = materias.map(materia => ({
        alunoId: aluno.id,
        materia,
        valor: Math.floor(Math.random() * 10) + 1 // Nota entre 1 e 10
      }));
      
      await prisma.nota.createMany({
        data: notas
      });
      
      // Criar frequência de exemplo
      await prisma.frequencia.create({
        data: {
          alunoId: aluno.id,
          percentual: Math.floor(Math.random() * 30) + 70 // Entre 70% e 100%
        }
      });
      
      console.log(`📊 Dados criados para: ${aluno.nome}`);
    }
    
    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📋 Dados de acesso:');
    console.log('Admin: admin / Ajhf2929*');
    console.log('Professor: professor / 123456');
    console.log('Alunos: joao, maria, pedro, ana, carlos / 123456');
    console.log(`\n📊 Total de registros criados:`);
    console.log(`- ${await prisma.user.count()} usuários`);
    console.log(`- ${await prisma.aluno.count()} alunos`);
    console.log(`- ${await prisma.nota.count()} notas`);
    console.log(`- ${await prisma.frequencia.count()} frequências`);
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); 
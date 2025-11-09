import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário gerente padrão
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const manager = await prisma.user.upsert({
    where: { email: 'admin@helpline.com' },
    update: {},
    create: {
      email: 'admin@helpline.com',
      name: 'Administrador',
      password: hashedPassword,
      department: 'TI',
      role: 'manager',
    },
  });

  console.log('Usuário gerente criado:', manager);

  // Criar usuário comum de exemplo
  const userPassword = await bcrypt.hash('usuario123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'usuario@helpline.com' },
    update: {},
    create: {
      email: 'usuario@helpline.com',
      name: 'Usuário de Teste',
      password: userPassword,
      department: 'Operações',
      role: 'user',
    },
  });

  console.log('Usuário comum criado:', user);

  // Criar alguns artigos de exemplo
  const articles = [
    {
      title: 'Problema com a Internet',
      description: 'Desligue o modem da tomada por 10 segundos e religue para restaurar a conexão.',
      category: 'Rede',
      icon: 'Rede',
    },
    {
      title: 'Tela Azul no Computador',
      description: 'Reinicie o sistema e verifique se há atualizações pendentes do Windows.',
      category: 'Hardware',
      icon: 'Hardware',
    },
    {
      title: 'Erro ao Acessar VPN',
      description: 'Confira suas credenciais e tente reconectar. Se persistir, reinicie o roteador.',
      category: 'Rede',
      icon: 'Rede',
    },
  ];

  // Verificar se já existem artigos
  const existingArticles = await prisma.article.findMany();
  
  if (existingArticles.length === 0) {
    for (const article of articles) {
      const created = await prisma.article.create({
        data: {
          ...article,
          authorId: manager.id,
        },
      });
      console.log('Artigo criado:', created.title);
    }
  } else {
    console.log('Artigos já existem, pulando criação...');
  }

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


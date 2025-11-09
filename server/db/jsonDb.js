// Database adapter usando JSON como armazenamento temporário
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/db.json');

// Inicializar banco de dados JSON
const initDB = () => {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      tickets: [],
      articles: [],
      feedback: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

// Ler banco de dados
const readDB = () => {
  initDB();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

// Escrever no banco de dados
const writeDB = (data) => {
  initDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Gerar ID único
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Database operations
export const db = {
  // Users
  user: {
    async findUnique({ where }) {
      const data = readDB();
      if (where.email) {
        return data.users.find(u => u.email === where.email) || null;
      }
      if (where.id) {
        return data.users.find(u => u.id === where.id) || null;
      }
      return null;
    },

    async findMany({ where = {} } = {}) {
      const data = readDB();
      let users = [...data.users];
      
      if (where.role) {
        users = users.filter(u => u.role === where.role);
      }
      
      return users;
    },

    async create({ data: userData }) {
      const data = readDB();
      const user = {
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.users.push(user);
      writeDB(data);
      return user;
    },

    async update({ where, data: updateData }) {
      const data = readDB();
      const index = data.users.findIndex(u => 
        (where.id && u.id === where.id) || 
        (where.email && u.email === where.email)
      );
      
      if (index === -1) return null;
      
      data.users[index] = {
        ...data.users[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeDB(data);
      return data.users[index];
    },

    async delete({ where }) {
      const data = readDB();
      const index = data.users.findIndex(u => 
        (where.id && u.id === where.id) || 
        (where.email && u.email === where.email)
      );
      
      if (index === -1) return null;
      
      const deleted = data.users.splice(index, 1)[0];
      writeDB(data);
      return deleted;
    }
  },

  // Tickets
  ticket: {
    async findUnique({ where }) {
      const data = readDB();
      if (where.id) {
        return data.tickets.find(t => t.id === where.id) || null;
      }
      if (where.protocol) {
        return data.tickets.find(t => t.protocol === where.protocol) || null;
      }
      return null;
    },

    async findMany({ where = {} } = {}) {
      const data = readDB();
      let tickets = [...data.tickets];
      
      if (where.requesterId) {
        tickets = tickets.filter(t => t.requesterId === where.requesterId);
      }
      
      // Ordenar por data de criação (mais recente primeiro)
      tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return tickets;
    },

    async create({ data: ticketData }) {
      const data = readDB();
      
      // Buscar requester
      const requester = data.users.find(u => u.id === ticketData.requesterId);
      
      const ticket = {
        id: generateId(),
        protocol: generateId().substring(0, 8).toUpperCase(),
        ...ticketData,
        requester: requester ? {
          id: requester.id,
          name: requester.name,
          email: requester.email,
          department: requester.department
        } : null,
        assignee: ticketData.assigneeId ? data.users.find(u => u.id === ticketData.assigneeId) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      data.tickets.push(ticket);
      writeDB(data);
      return ticket;
    },

    async update({ where, data: updateData }) {
      const data = readDB();
      const index = data.tickets.findIndex(t => t.id === where.id);
      
      if (index === -1) return null;
      
      // Atualizar assignee se necessário
      if (updateData.assigneeId) {
        const assignee = data.users.find(u => u.id === updateData.assigneeId);
        updateData.assignee = assignee || null;
      }
      
      data.tickets[index] = {
        ...data.tickets[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeDB(data);
      return data.tickets[index];
    },

    async delete({ where }) {
      const data = readDB();
      const index = data.tickets.findIndex(t => t.id === where.id);
      
      if (index === -1) return null;
      
      const deleted = data.tickets.splice(index, 1)[0];
      writeDB(data);
      return deleted;
    }
  },

  // Articles
  article: {
    async findUnique({ where }) {
      const data = readDB();
      if (where.id) {
        return data.articles.find(a => a.id === where.id) || null;
      }
      return null;
    },

    async findMany({ where = {} } = {}) {
      const data = readDB();
      let articles = [...data.articles];
      
      // Ordenar por data de criação (mais recente primeiro)
      articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return articles;
    },

    async create({ data: articleData }) {
      const data = readDB();
      
      // Buscar autor
      const author = data.users.find(u => u.id === articleData.authorId);
      
      const article = {
        id: generateId(),
        ...articleData,
        author: author ? {
          id: author.id,
          name: author.name,
          email: author.email
        } : null,
        feedback: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      data.articles.push(article);
      writeDB(data);
      return article;
    },

    async update({ where, data: updateData }) {
      const data = readDB();
      const index = data.articles.findIndex(a => a.id === where.id);
      
      if (index === -1) return null;
      
      data.articles[index] = {
        ...data.articles[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      writeDB(data);
      return data.articles[index];
    },

    async delete({ where }) {
      const data = readDB();
      const index = data.articles.findIndex(a => a.id === where.id);
      
      if (index === -1) return null;
      
      const deleted = data.articles.splice(index, 1)[0];
      writeDB(data);
      return deleted;
    }
  },

  // Feedback
  feedback: {
    async create({ data: feedbackData }) {
      const dbData = readDB();
      
      const feedback = {
        id: generateId(),
        ...feedbackData,
        createdAt: new Date().toISOString()
      };
      
      dbData.feedback.push(feedback);
      
      // Adicionar feedback ao artigo
      const articleIndex = dbData.articles.findIndex(a => a.id === feedbackData.articleId);
      if (articleIndex !== -1) {
        if (!dbData.articles[articleIndex].feedback) {
          dbData.articles[articleIndex].feedback = [];
        }
        dbData.articles[articleIndex].feedback.push(feedback);
      }
      
      writeDB(dbData);
      return feedback;
    }
  }
};

// Inicializar banco na primeira importação
initDB();

// Seed inicial
export const seedDB = async () => {
  const data = readDB();
  
  // Verificar se já existe admin
  const adminExists = data.users.find(u => u.email === 'admin@helpline.com');
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await db.user.create({
      data: {
        email: 'admin@helpline.com',
        name: 'Administrador',
        password: hashedPassword,
        department: 'TI',
        role: 'manager'
      }
    });
    console.log('Admin criado:', admin.email);
  }
  
  // Verificar se já existe usuário comum
  const userExists = data.users.find(u => u.email === 'usuario@helpline.com');
  
  if (!userExists) {
    const hashedPassword = await bcrypt.hash('usuario123', 10);
    const user = await db.user.create({
      data: {
        email: 'usuario@helpline.com',
        name: 'Usuário de Teste',
        password: hashedPassword,
        department: 'Operações',
        role: 'user'
      }
    });
    console.log('Usuário criado:', user.email);
  }
  
  // Criar artigos de exemplo se não existirem
  if (data.articles.length === 0) {
    const admin = data.users.find(u => u.email === 'admin@helpline.com');
    if (admin) {
      const articles = [
        {
          title: 'Problema com a Internet',
          description: 'Desligue o modem da tomada por 10 segundos e religue para restaurar a conexão.',
          category: 'Rede',
          icon: 'Rede',
          authorId: admin.id
        },
        {
          title: 'Tela Azul no Computador',
          description: 'Reinicie o sistema e verifique se há atualizações pendentes do Windows.',
          category: 'Hardware',
          icon: 'Hardware',
          authorId: admin.id
        },
        {
          title: 'Erro ao Acessar VPN',
          description: 'Confira suas credenciais e tente reconectar. Se persistir, reinicie o roteador.',
          category: 'Rede',
          icon: 'Rede',
          authorId: admin.id
        }
      ];
      
      for (const articleData of articles) {
        await db.article.create({ data: articleData });
      }
      console.log('Artigos de exemplo criados');
    }
  }
};

// Popular dados iniciais
seedDB().catch(console.error);


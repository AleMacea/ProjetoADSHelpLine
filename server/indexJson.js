import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authJson.js';
import ticketRoutes from './routes/ticketsJson.js';
import articleRoutes from './routes/articlesJson.js';
import userRoutes from './routes/usersJson.js';
import { seedDB } from './db/jsonDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running with JSON database' });
});

// Inicializar banco de dados e iniciar servidor
async function startServer() {
  try {
    await seedDB();
    console.log('✅ Banco de dados JSON inicializado');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📁 Using JSON database: server/data/db.json`);
      console.log(`🔑 Admin login: admin@helpline.com / admin123`);
      console.log(`👤 User login: usuario@helpline.com / usuario123`);
    });
  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err);
    process.exit(1);
  }
}

startServer();


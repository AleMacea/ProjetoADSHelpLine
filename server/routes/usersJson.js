import express from 'express';
import { db } from '../db/jsonDb.js';
import { authenticateToken, requireManager } from '../middleware/auth.js';

const router = express.Router();

// Listar usuários
router.get('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const users = await db.user.findMany();
    // Remover senhas
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Obter usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const user = await db.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

// Listar gerentes
router.get('/managers/list', authenticateToken, requireManager, async (req, res) => {
  try {
    const managers = await db.user.findMany({ where: { role: 'manager' } });
    const managersWithoutPassword = managers.map(({ password, ...manager }) => manager);
    res.json(managersWithoutPassword);
  } catch (error) {
    console.error('Erro ao listar gerentes:', error);
    res.status(500).json({ error: 'Erro ao listar gerentes' });
  }
});

export default router;


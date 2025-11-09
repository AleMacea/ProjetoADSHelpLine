import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireManager } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Listar usuários (apenas gerente)
router.get('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Obter usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Usuário comum só pode ver seu próprio perfil
    if (req.user.role !== 'manager' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

// Listar gerentes (para atribuição de tickets)
router.get('/managers/list', authenticateToken, requireManager, async (req, res) => {
  try {
    const managers = await prisma.user.findMany({
      where: {
        role: 'manager'
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true
      }
    });

    res.json(managers);
  } catch (error) {
    console.error('Erro ao listar gerentes:', error);
    res.status(500).json({ error: 'Erro ao listar gerentes' });
  }
});

export default router;


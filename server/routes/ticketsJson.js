import express from 'express';
import { db } from '../db/jsonDb.js';
import { authenticateToken, requireManager } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Listar tickets
router.get('/', async (req, res) => {
  try {
    const where = req.user.role === 'manager' 
      ? {} 
      : { requesterId: req.user.userId };

    const tickets = await db.ticket.findMany({ where });
    res.json(tickets);
  } catch (error) {
    console.error('Erro ao listar tickets:', error);
    res.status(500).json({ error: 'Erro ao listar tickets' });
  }
});

// Criar ticket
router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority = 'medium' } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios' });
    }

    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        category,
        priority,
        requesterId: req.user.userId,
        status: 'open'
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ error: 'Erro ao criar ticket' });
  }
});

// Obter ticket por ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await db.ticket.findUnique({ where: { id: req.params.id } });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    if (req.user.role !== 'manager' && ticket.requesterId !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Erro ao obter ticket:', error);
    res.status(500).json({ error: 'Erro ao obter ticket' });
  }
});

// Atualizar ticket
router.put('/:id', async (req, res) => {
  try {
    const ticket = await db.ticket.findUnique({ where: { id: req.params.id } });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const isManager = req.user.role === 'manager';
    const isRequester = ticket.requesterId === req.user.userId;

    if (!isManager && !isRequester) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const managerOnlyFields = ['status', 'assigneeId', 'priority'];
    const updateData = { ...req.body };

    if (!isManager) {
      managerOnlyFields.forEach(field => {
        delete updateData[field];
      });
    }

    const updatedTicket = await db.ticket.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    res.status(500).json({ error: 'Erro ao atualizar ticket' });
  }
});

// Deletar ticket
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const ticket = await db.ticket.findUnique({ where: { id: req.params.id } });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    await db.ticket.delete({ where: { id: req.params.id } });
    res.json({ message: 'Ticket deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(500).json({ error: 'Erro ao deletar ticket' });
  }
});

export default router;


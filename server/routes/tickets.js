import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireManager } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Listar tickets (usuário comum vê apenas os seus, gerente vê todos)
router.get('/', async (req, res) => {
  try {
    const where = req.user.role === 'manager' 
      ? {} 
      : { requesterId: req.user.userId };

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority,
        requesterId: req.user.userId,
        status: 'open'
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        }
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
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Usuário comum só pode ver seus próprios tickets
    if (req.user.role !== 'manager' && ticket.requesterId !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Erro ao obter ticket:', error);
    res.status(500).json({ error: 'Erro ao obter ticket' });
  }
});

// Atualizar ticket (apenas gerente ou o próprio usuário para alguns campos)
router.put('/:id', async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Verificar permissões
    const isManager = req.user.role === 'manager';
    const isRequester = ticket.requesterId === req.user.userId;

    if (!isManager && !isRequester) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Campos que apenas gerente pode atualizar
    const managerOnlyFields = ['status', 'assigneeId', 'priority'];
    const updateData = { ...req.body };

    if (!isManager) {
      managerOnlyFields.forEach(field => {
        delete updateData[field];
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    res.status(500).json({ error: 'Erro ao atualizar ticket' });
  }
});

// Deletar ticket (apenas gerente)
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    await prisma.ticket.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Ticket deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(500).json({ error: 'Erro ao deletar ticket' });
  }
});

export default router;


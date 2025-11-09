import express from 'express';
import { db } from '../db/jsonDb.js';
import { authenticateToken, requireManager } from '../middleware/auth.js';

const router = express.Router();

// Listar artigos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const articles = await db.article.findMany();
    res.json(articles);
  } catch (error) {
    console.error('Erro ao listar artigos:', error);
    res.status(500).json({ error: 'Erro ao listar artigos' });
  }
});

// Criar artigo
router.post('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const { title, description, category, icon } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios' });
    }

    const article = await db.article.create({
      data: {
        title,
        description,
        category,
        icon: icon || null,
        authorId: req.user.userId
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    res.status(500).json({ error: 'Erro ao criar artigo' });
  }
});

// Adicionar feedback
router.post('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body;

    if (!type || (type !== 'like' && type !== 'dislike')) {
      return res.status(400).json({ error: 'Tipo de feedback inválido' });
    }

    const article = await db.article.findUnique({ where: { id: req.params.id } });

    if (!article) {
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }

    const feedback = await db.feedback.create({
      data: {
        articleId: req.params.id,
        type
      }
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    res.status(500).json({ error: 'Erro ao adicionar feedback' });
  }
});

// Atualizar artigo
router.put('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const { title, description, category, icon } = req.body;

    const article = await db.article.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(icon !== undefined && { icon })
      }
    });

    res.json(article);
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    res.status(500).json({ error: 'Erro ao atualizar artigo' });
  }
});

// Deletar artigo
router.delete('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    await db.article.delete({ where: { id: req.params.id } });
    res.json({ message: 'Artigo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    res.status(500).json({ error: 'Erro ao deletar artigo' });
  }
});

export default router;


const prisma = require('../lib/prisma');

async function createAuthor(req, res, next) {
  const { name, biography } = req.body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }

  if (biography !== undefined && biography !== null && typeof biography !== 'string') {
    return res.status(400).json({ error: 'biography must be a string or null' });
  }

  try {
    const author = await prisma.author.create({
      data: {
        name: name.trim(),
        ...(biography !== undefined ? { biography } : {})
      }
    });

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'An author with this name already exists' });
    }

    return next(error);
  }
}

module.exports = { createAuthor };
const prisma = require('../lib/prisma');

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateBook(body) {
  if (typeof body?.title !== 'string' || body.title.trim() === '') {
    return 'title is required and must be a non-empty string';
  }

  if (!Number.isInteger(body.release_year)) {
    return 'release_year is required and must be an integer';
  }

  if (typeof body.author_id !== 'string' || !uuidPattern.test(body.author_id)) {
    return 'author_id is required and must be a valid UUID';
  }

  return null;
}

async function createBook(req, res, next) {
  const validationError = validateBook(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const author = await prisma.author.findUnique({ where: { id: req.body.author_id } });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const book = await prisma.book.create({
      data: {
        title: req.body.title.trim(),
        release_year: req.body.release_year,
        author: { connect: { id: req.body.author_id } }
      }
    });

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Author not found' });
    }

    return next(error);
  }
}

async function listBooks(req, res, next) {
  try {
    const books = await prisma.book.findMany({ include: { author: true } });
    return res.status(200).json(books);
  } catch (error) {
    return next(error);
  }
}

async function updateBook(req, res, next) {
  if (!uuidPattern.test(req.params.id)) {
    return res.status(400).json({ error: 'id must be a valid UUID' });
  }

  const validationError = validateBook(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const author = await prisma.author.findUnique({ where: { id: req.body.author_id } });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title.trim(),
        release_year: req.body.release_year,
        author: { connect: { id: req.body.author_id } }
      }
    });

    return res.status(200).json(book);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Author not found' });
    }

    return next(error);
  }
}

async function deleteBook(req, res, next) {
  if (!uuidPattern.test(req.params.id)) {
    return res.status(400).json({ error: 'id must be a valid UUID' });
  }

  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Book not found' });
    }

    return next(error);
  }
}

module.exports = { createBook, listBooks, updateBook, deleteBook };
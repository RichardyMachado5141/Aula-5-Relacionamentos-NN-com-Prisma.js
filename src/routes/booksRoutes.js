const express = require('express');
const {
  createBook,
  listBooks,
  updateBook,
  deleteBook
} = require('../controllers/booksController');

const router = express.Router();

router.post('/', createBook);
router.get('/', listBooks);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
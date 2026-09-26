const express = require('express');
const authorsRoutes = require('./src/routes/authorsRoutes');
const booksRoutes = require('./src/routes/booksRoutes');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/authors', authorsRoutes);
app.use('/books', booksRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
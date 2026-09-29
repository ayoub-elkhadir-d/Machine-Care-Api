const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route de vérification (Health check)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur API MachineCare' });
});

module.exports = app;

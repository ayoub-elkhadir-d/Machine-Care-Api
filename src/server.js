require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connexion à la base de données puis démarrage du serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
});

require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const { createDefaultUser } = require('./controllers/authController');

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET must be configured');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connecté !');
    
    await createDefaultUser();

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion MongoDB :', err);
  });
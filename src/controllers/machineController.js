const Machine = require('../models/Machine');

const validStatuses = ['operational', 'maintenance', 'offline', 'degraded'];

exports.createMachine = async (req, res) => {
  try {
    const { name, code, type, location, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Le nom et le code de la machine sont obligatoires' });
    }

    const normalizedStatus = validStatuses.includes(status) ? status : 'operational';

    const machine = await Machine.create({
      name,
      code,
      type,
      location,
      status: normalizedStatus,
    });

    res.status(201).json(machine);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Ce code machine existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

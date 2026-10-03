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

exports.getMachines = async (req, res) => {
  try {
    const { status, location } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = new RegExp(location, 'i');

    const machines = await Machine.find(filter).sort({ createdAt: -1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({ message: 'Machine introuvable' });
    }

    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({ message: 'Machine introuvable' });
    }

    const allowedFields = ['name', 'code', 'type', 'location', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'status' && !validStatuses.includes(req.body[field])) {
          return res.status(400).json({ message: 'Statut invalide' });
        }
        machine[field] = req.body[field];
      }
    }

    await machine.save();
    res.json(machine);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Ce code machine existe déjà' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

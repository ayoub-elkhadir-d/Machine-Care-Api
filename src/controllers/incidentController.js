const Incident = require('../models/Incident');
const Machine = require('../models/Machine');

exports.createIncident = async (req, res) => {
  try {
    const { machineId, description } = req.body;

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'La description est obligatoire' });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: 'Machine introuvable' });
    }

    const incident = await Incident.create({
      machine: machineId,
      declaredBy: req.user._id,
      description
    });

    res.status(201).json({ message: 'Signalement créé avec succès', incident });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const { machine, statut } = req.query;
    const filter = {};

    if (machine) filter.machine = machine;
    if (statut) filter.statut = statut;

    const incidents = await Incident.find(filter)
      .populate('machine', 'reference nom atelier')
      .populate('declaredBy', 'email')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('machine', 'reference nom atelier')
      .populate('declaredBy', 'email');

    if (!incident) {
      return res.status(404).json({ message: 'Signalement introuvable' });
    }

    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateIncident = async (req, res) => {
  try {
    const { statut, resolutionNote, description } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Signalement introuvable' });
    }

    if (description) incident.description = description;

    if (statut) {
      const allowedStatuses = ['ouvert', 'en cours', 'resolu'];
      if (!allowedStatuses.includes(statut)) {
        return res.status(400).json({ message: 'Statut inconnu' });
      }

      // شرط إجباري: إذا تم تغيير الحالة إلى "resolu"، يجب تقديم ملاحظة الحل
      if (statut === 'resolu') {
        const note = resolutionNote || incident.resolutionNote;
        if (!note || note.trim() === '') {
          return res.status(400).json({
            message: 'Une note de résolution est obligatoire pour marquer le signalement comme résolu'
          });
        }
        incident.resolutionNote = note;
        incident.resolvedAt = new Date();
      }

      incident.statut = statut;
    }

    await incident.save();
    res.json({ message: 'Signalement mis à jour', incident });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

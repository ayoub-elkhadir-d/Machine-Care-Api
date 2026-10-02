// const Machine = require('../models/Machine');
// const Incident = require('../models/Incident');
// 
// exports.createMachine = async (req, res) => {
//   try {
//     const { reference, nom, atelier, etat } = req.body;
// 
//     if (!reference || !nom || !atelier) {
//       return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
//     }
// 
//     const existingMachine = await Machine.findOne({ reference });
//     if (existingMachine) {
//       return res.status(400).json({ message: 'Cette référence existe déjà' });
//     }
// 
//     const machine = await Machine.create({ reference, nom, atelier, etat });
//     res.status(201).json({ message: 'Machine créée avec succès', machine });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
// 
// exports.getMachines = async (req, res) => {
//   try {
//     const { atelier, etat } = req.query;
//     const filter = {};
// 
//     if (atelier) filter.atelier = atelier;
//     if (etat) filter.etat = etat;
// 
//     const machines = await Machine.find(filter);
//     res.json(machines);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
// 
// exports.getMachineById = async (req, res) => {
//   try {
//     const machine = await Machine.findById(req.params.id);
//     if (!machine) {
//       return res.status(404).json({ message: 'Machine introuvable' });
//     }
// 
//     const incidents = await Incident.find({ machine: machine._id })
//       .populate('declaredBy', 'email')
//       .sort({ createdAt: -1 });
// 
//     res.json({ machine, incidents });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
// 
// exports.updateMachine = async (req, res) => {
//   try {
//     const { reference, nom, atelier, etat } = req.body;
//     const machine = await Machine.findById(req.params.id);
// 
//     if (!machine) {
//       return res.status(404).json({ message: 'Machine introuvable' });
//     }
// 
//     if (reference && reference !== machine.reference) {
//       const existingRef = await Machine.findOne({ reference });
//       if (existingRef) {
//         return res.status(400).json({ message: 'Cette référence existe déjà' });
//       }
//       machine.reference = reference;
//     }
// 
//     if (nom) machine.nom = nom;
//     if (atelier) machine.atelier = atelier;
//     if (etat) machine.etat = etat;
// 
//     await machine.save();
//     res.json({ message: 'Machine mise à jour', machine });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
// 
// exports.deleteMachine = async (req, res) => {
//   try {
//     const machine = await Machine.findById(req.params.id);
//     if (!machine) {
//       return res.status(404).json({ message: 'Machine introuvable' });
//     }
// 
//     const activeIncidents = await Incident.findOne({
//       machine: machine._id,
//       statut: { $in: ['ouvert', 'en cours'] }
//     });
// 
//     if (activeIncidents) {
//       return res.status(400).json({
//         message: 'Impossible de supprimer une machine avec des signalements actifs'
//       });
//     }
// 
//     await Incident.deleteMany({ machine: machine._id });
//     await Machine.findByIdAndDelete(req.params.id);
// 
//     res.json({ message: 'Machine et son historique supprimés avec succès' });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
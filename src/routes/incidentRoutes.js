const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
} = require('../controllers/incidentController');

router.use(protect);
router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/', createIncident);
router.patch('/:id', updateIncident);
router.patch('/:id/status', updateIncident);

module.exports = router;

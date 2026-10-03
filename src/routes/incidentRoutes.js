const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', incidentController.cretepanne);
 router.get('/', incidentController.getPannes);
router.get('/:id', incidentController.getPanneById);
router.put('/:id', incidentController.updatePanne);

module.exports = router;

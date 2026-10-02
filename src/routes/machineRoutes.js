const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createMachine,
  getMachines,
  getMachineById,
  updateMachine,
} = require('../controllers/machineController');

router.use(protect);
router.get('/', getMachines);
router.get('/:id', getMachineById);
router.post('/', createMachine);
router.patch('/:id', updateMachine);

module.exports = router;

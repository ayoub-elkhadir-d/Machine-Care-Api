const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

router.post('/register', protect, authController.register);
router.get('/getallusers', protect, authController.getallusers);
router.get('/me', protect, authController.getProfile);
router.put('/me', protect, authController.updateProfile);

module.exports = router;

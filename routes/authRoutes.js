const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;

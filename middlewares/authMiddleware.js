const { verifyToken } = require('../controllers/authController');

// Middleware de autenticación que usa la función verifyToken del controlador
const authMiddleware = (req, res, next) => {
  verifyToken(req, res, next);
};

module.exports = authMiddleware;

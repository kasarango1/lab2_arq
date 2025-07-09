const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/libros', bookController.getBooks);
router.get('/libros/:id', bookController.getBookById);

// Rutas protegidas (requieren autenticación)
router.post('/libros/agregar', authMiddleware, bookController.addBook);
router.put('/libros/actualizar/:id', authMiddleware, bookController.updateBook);
router.delete('/libros/eliminar/:id', authMiddleware, bookController.deleteBook);

module.exports = router;

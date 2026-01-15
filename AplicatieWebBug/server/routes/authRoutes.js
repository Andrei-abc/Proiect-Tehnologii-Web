const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute pentru autentificare si gestionare utilizatori
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsers);

module.exports = router;

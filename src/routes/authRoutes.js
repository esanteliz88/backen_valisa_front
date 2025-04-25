const express = require('express');
const router = express.Router();
const axios = require('axios');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
require('dotenv').config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

// Endpoint de login
router.post('/login', authController.login);

// Endpoint de registro (si se necesita)
router.post('/register', authController.register);

// Endpoint para obtener perfil del usuario (requiere autenticación)
router.get('/profile', auth, authController.getProfile);

module.exports = router;

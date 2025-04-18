const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

// Endpoint de login
router.post('/login', async (req, res) => {
  console.log('✅ Llegó al backend desde el frontend');
  console.log('Body recibido:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Reenviar la solicitud a la API real
    const response = await axios.post(`${EXTERNAL_API_URL}/api/auth/login`, {
      email,
      password
    });

    // Responder al frontend con los datos de la API real
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al reenviar login:', error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: 'Error interno del servidor intermediario' });
  }
});

module.exports = router;

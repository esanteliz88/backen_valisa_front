const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:5000';

// Configuración global de axios
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

// Función auxiliar para manejar errores
const handleApiError = (error, operation) => {
  console.error(`Error en operación ${operation}:`, error);
  
  if (error.response) {
    console.error('Respuesta de error:', {
      status: error.response.status,
      data: error.response.data
    });
    return {
      status: error.response.status,
      error: error.response.data
    };
  }
  
  if (error.code === 'ECONNREFUSED') {
    console.error('No se pudo conectar con la API externa:', EXTERNAL_API_URL);
    return {
      status: 503,
      error: {
        message: 'El servicio no está disponible en este momento',
        error: 'ECONNREFUSED',
        details: `No se pudo conectar con ${EXTERNAL_API_URL}`
      }
    };
  }
  
  return {
    status: 500,
    error: {
      message: 'Error interno del servidor',
      error: error.message
    }
  };
};

const authController = {
  // Login - Reenvía la solicitud al API externo
  async login(req, res) {
    try {
      console.log('✅ Solicitud de login recibida:', req.body);
      
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }

      try {
        console.log('Intentando conectar con:', `${EXTERNAL_API_URL}/api/auth/login`);
        
        const response = await axios.post(`${EXTERNAL_API_URL}/api/auth/login`, req.body, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          },
          timeout: 5000 // 5 segundos de timeout
        });
        
        console.log('Respuesta recibida:', {
          status: response.status,
          data: response.data
        });
        
        if (response.data && response.data.token) {
          res.cookie('token', response.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
          });
          
          return res.status(200).json({
            success: true,
            token: response.data.token,
            user: response.data.user || {}
          });
        }
        
        return res.status(response.status).json(response.data);
      } catch (apiError) {
        const error = handleApiError(apiError, 'login');
        return res.status(error.status).json(error.error);
      }
    } catch (error) {
      console.error('Error general en login:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Registro - Reenvía la solicitud al API externo
  async register(req, res) {
    try {
      console.log('✅ Solicitud de registro recibida:', req.body);
      
      try {
        const response = await axios.post(`${EXTERNAL_API_URL}/api/auth/register`, req.body, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Respuesta de API externa (registro):', response.data);
        return res.status(201).json(response.data);
      } catch (apiError) {
        console.error('Error desde la API externa (registro):', apiError.response?.data || apiError.message);
        
        if (apiError.response) {
          return res.status(apiError.response.status).json(apiError.response.data);
        }
        
        return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Obtener perfil del usuario - Reenvía la solicitud al API externo
  async getProfile(req, res) {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        return res.status(401).json({ message: 'No hay token de autorización' });
      }
      
      try {
        const response = await axios.get(`${EXTERNAL_API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Respuesta de API externa (perfil):', response.data);
        return res.status(200).json(response.data);
      } catch (apiError) {
        console.error('Error desde la API externa (perfil):', apiError.response?.data || apiError.message);
        
        if (apiError.response) {
          return res.status(apiError.response.status).json(apiError.response.data);
        }
        
        return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
      }
    } catch (error) {
      console.error('Error en getProfile:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

module.exports = authController; 
const axios = require('axios');
require('dotenv').config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:5000';

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log("Token en createUser:", token);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.post(`${EXTERNAL_API_URL}/api/users`, req.body, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (crear usuario):", response.data);
      return res.status(201).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (crear usuario):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Listar todos los usuarios de una empresa
exports.listUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log("Token en listUsers:", token);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      // Pasar los query params recibidos a la API externa
      const response = await axios.get(`${EXTERNAL_API_URL}/api/users`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        params: req.query // Incluir parámetros de consulta como page, limit, etc.
      });

      console.log("Respuesta de la API externa (listar usuarios):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (listar usuarios):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en listUsers:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener detalles de un usuario específico
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = req.params.id;

    console.log("Token en getUserDetails:", token);
    console.log("ID de usuario solicitado:", userId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.get(`${EXTERNAL_API_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (detalle de usuario):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (detalle de usuario):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en getUserDetails:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar información de un usuario
exports.updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = req.params.id;

    console.log("Token en updateUser:", token);
    console.log("ID de usuario a actualizar:", userId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.put(`${EXTERNAL_API_URL}/api/users/${userId}`, req.body, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (actualizar usuario):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (actualizar usuario):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un usuario (lógicamente)
exports.deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = req.params.id;

    console.log("Token en deleteUser:", token);
    console.log("ID de usuario a eliminar:", userId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.delete(`${EXTERNAL_API_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (eliminar usuario):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (eliminar usuario):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 
const axios = require('axios');
require('dotenv').config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:5000';

// Configuración global de axios para roles
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

// Función auxiliar para manejar errores
const handleApiError = (error, operation) => {
  console.error(`\n❌ Error en operación ${operation}:`);
  
  if (error.response) {
    console.error('Respuesta de error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
    return {
      status: error.response.status,
      error: error.response.data
    };
  }
  
  if (error.code === 'ECONNREFUSED') {
    console.error(`No se pudo conectar con ${EXTERNAL_API_URL}`);
    return {
      status: 503,
      error: {
        message: 'El servicio no está disponible en este momento',
        error: 'ECONNREFUSED',
        details: `No se pudo conectar con ${EXTERNAL_API_URL}`
      }
    };
  }
  
  console.error('Error no manejado:', error);
  return {
    status: 500,
    error: {
      message: 'Error interno del servidor',
      error: error.message
    }
  };
};

// Crear un nuevo rol
exports.createRole = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const idcompany = req.params.idcompany;
    console.log("Token en createRole:", token);
    console.log("ID de compañía:", idcompany);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.post(`${EXTERNAL_API_URL}/api/roles/${idcompany}`, req.body, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (crear rol):", response.data);
      return res.status(201).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (crear rol):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en createRole:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Listar todos los roles
exports.listRoles = async (req, res) => {
  console.log("\n📋 Iniciando listRoles");
  try {
    const token = req.headers.authorization;
    const idcompany = req.params.idcompany;
    
    console.log("Parámetros recibidos:", {
      idcompany,
      token: token ? token.substring(0, 20) + '...' : 'No presente',
      query: req.query
    });

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    if (!idcompany) {
      return res.status(400).json({ message: 'ID de compañía es requerido' });
    }

    try {
      const url = `${EXTERNAL_API_URL}/api/roles/${idcompany}`;
      console.log(`🔄 Realizando petición GET a: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: req.query,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
        timeout: 5000 // 5 segundos
      });

      if (response.status === 404) {
        console.log("❌ La API externa retornó 404");
        return res.status(404).json({
          message: 'Roles no encontrados',
          details: response.data
        });
      }

      console.log("✅ Respuesta recibida:", {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      return res.status(response.status).json(response.data);
    } catch (apiError) {
      console.error("❌ Error en la petición a la API externa:", apiError.message);
      if (apiError.response) {
        console.error("Detalles del error:", {
          status: apiError.response.status,
          data: apiError.response.data,
          headers: apiError.response.headers
        });
      }
      const error = handleApiError(apiError, 'listRoles');
      return res.status(error.status).json(error.error);
    }
  } catch (error) {
    console.error('Error general en listRoles:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener detalles de un rol específico
exports.getRoleDetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const idcompany = req.params.idcompany;
    const roleId = req.params.id;

    console.log("Token en getRoleDetails:", token);
    console.log("ID de compañía:", idcompany);
    console.log("ID de rol solicitado:", roleId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.get(`${EXTERNAL_API_URL}/api/roles/${idcompany}/${roleId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (detalle de rol):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (detalle de rol):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en getRoleDetails:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar información de un rol
exports.updateRole = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const idcompany = req.params.idcompany;
    const roleId = req.params.id;

    console.log("Token en updateRole:", token);
    console.log("ID de compañía:", idcompany);
    console.log("ID de rol a actualizar:", roleId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.put(`${EXTERNAL_API_URL}/api/roles/${idcompany}/${roleId}`, req.body, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (actualizar rol):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (actualizar rol):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en updateRole:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un rol
exports.deleteRole = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const idcompany = req.params.idcompany;
    const roleId = req.params.id;

    console.log("Token en deleteRole:", token);
    console.log("ID de compañía:", idcompany);
    console.log("ID de rol a eliminar:", roleId);

    if (!token) {
      return res.status(401).json({ message: 'No hay token de autorización' });
    }

    try {
      const response = await axios.delete(`${EXTERNAL_API_URL}/api/roles/${idcompany}/${roleId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      console.log("Respuesta de la API externa (eliminar rol):", response.data);
      return res.status(200).json(response.data);
    } catch (apiError) {
      console.error('Error desde la API externa (eliminar rol):', apiError.response?.data || apiError.message);
      
      if (apiError.response) {
        return res.status(apiError.response.status).json(apiError.response.data);
      }
      
      return res.status(500).json({ message: 'Error al comunicarse con la API externa' });
    }
  } catch (error) {
    console.error('Error en deleteRole:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 
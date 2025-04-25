const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    console.log('\n🔐 === Verificación de Token ===');
    
    // Obtener el token del header
    const token = req.header('Authorization');
    console.log('Token recibido:', token ? 'Presente' : 'No presente');
    
    if (!token) {
      console.log('❌ No hay token presente');
      return res.status(401).json({ 
        message: 'No hay token de autorización',
        error: 'TOKEN_MISSING'
      });
    }

    try {
      // Remover el prefijo 'Bearer ' si existe
      const tokenToVerify = token.startsWith('Bearer ') ? token.slice(7) : token;
      console.log('Token a verificar:', tokenToVerify.substring(0, 20) + '...');
      
      // Verificar el token
      const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET || 'turistik2024');
      
      console.log('✅ Token decodificado:', {
        userId: decoded.userId,
        companyId: decoded.companyId,
        email: decoded.email,
        roles: decoded.roles
      });
      
      // Agregar la información del usuario decodificada a la request
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('❌ Error al verificar el token:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expirado',
          error: 'TOKEN_EXPIRED'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Token inválido',
          error: 'TOKEN_INVALID'
        });
      }
      
      return res.status(401).json({ 
        message: 'Error en la autenticación',
        error: error.message
      });
    }
  } catch (error) {
    console.error('❌ Error general en autenticación:', error);
    res.status(500).json({ 
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

module.exports = auth; 
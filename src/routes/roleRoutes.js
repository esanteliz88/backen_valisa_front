const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');

// Middleware de logging específico para roles
router.use((req, res, next) => {
  console.log('\n🔍 === DEBUG ROLES ===');
  console.log('URL completa:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Parámetros:', req.params);
  console.log('Query:', req.query);
  console.log('Headers:', {
    authorization: req.headers.authorization ? 'Presente' : 'No presente',
    contentType: req.headers['content-type'],
    accept: req.headers.accept
  });
  console.log('Body:', req.body);
  console.log('===================\n');
  next();
});

// Ruta de prueba sin autenticación (debe ir ANTES del middleware auth)
router.get('/health', (req, res) => {
  res.json({ 
    message: 'Ruta de roles funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de autenticación para las rutas protegidas
//router.use(auth);

// Rutas protegidas para gestión de roles
router.get('/:idcompany', roleController.listRoles);
router.post('/:idcompany', roleController.createRole);
router.get('/:idcompany/:id', roleController.getRoleDetails);
router.put('/:idcompany/:id', roleController.updateRole);
router.delete('/:idcompany/:id', roleController.deleteRole);

module.exports = router; 
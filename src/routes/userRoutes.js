const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Todas las rutas necesitan autenticación
router.use(auth);

// Rutas para gestión de usuarios
router.post('/:idcompany/', userController.createUser);
router.get('/:idcompany', userController.listUsers);
router.get('/:idcompany/:id', userController.getUserDetails);
router.put('/:idcompany/:id', userController.updateUser);
router.delete('/:idcompany/:id', userController.deleteUser);

module.exports = router; 
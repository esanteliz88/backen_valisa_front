const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      return;
      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Enviar respuesta sin la contraseña
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role
      };

      res.json({
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  async register(req, res) {
    try {
      const { name, email, password, companyName } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear nuevo usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        companyName
      });

      await newUser.save();

      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: newUser._id,
          email: newUser.email,
          role: newUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Enviar respuesta sin la contraseña
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        companyName: newUser.companyName,
        role: newUser.role
      };

      res.status(201).json({
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = authController; 
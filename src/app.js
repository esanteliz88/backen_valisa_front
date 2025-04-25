const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Inicializar la aplicación
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware básicos
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging general
app.use((req, res, next) => {
  console.log('\n=== Nueva petición ===');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('==================\n');
  next();
});

// Ruta de prueba
app.get('/test', (req, res) => {
  console.log('Ruta de prueba accedida');
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Middleware de diagnóstico para rutas de roles
app.use('/api/roles', (req, res, next) => {
  console.log('\n🔍 Diagnóstico de ruta de roles');
  console.log('URL completa:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Base URL:', req.baseUrl);
  console.log('Ruta:', req.path);
  console.log('Parámetros:', req.params);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('------------------------\n');
  next();
});

// Rutas
console.log('Montando rutas...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Log de rutas registradas
console.log('Rutas registradas:');
console.log('- /test');
console.log('- /api/auth');
console.log('- /api/users');
console.log('- /api/roles');
console.log('- /api/roles/health');

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  console.log('⚠️ Ruta no encontrada:', req.originalUrl);
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal!',
    error: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 
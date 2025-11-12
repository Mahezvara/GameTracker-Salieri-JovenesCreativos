const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar JWT
exports.protect = async (req, res, next) => {
  let token;

  // Obtener token del header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar que existe token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta',
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui');
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta',
    });
  }
};

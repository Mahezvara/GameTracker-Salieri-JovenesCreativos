const jwt = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tu_clave_secreta_aqui', {
    expiresIn: '30d',
  });
};


exports.register = async (req, res) => {
  try {
    const { nombre, email, contraseña, confirmarContraseña } = req.body;

    
    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden',
      });
    }

    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    
    user = await User.create({
      nombre,
      email,
      contraseña,
    });

    
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    
    if (!email || !contraseña) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña',
      });
    }

    
    const user = await User.findOne({ email }).select('+contraseña');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña inválidos',
      });
    }

  
    const isMatch = await user.matchPassword(contraseña);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email o contraseña inválidos',
      });
    }

    
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada',
  });
};

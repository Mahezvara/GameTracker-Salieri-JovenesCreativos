import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: contextError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validar = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener mínimo 6 caracteres';
    }
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validar();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const result = await register(
        formData.nombre,
        formData.email,
        formData.contraseña,
        formData.confirmarContraseña
      );
      if (result.success) {
        navigate('/biblioteca');
      } else {
        setErrors({ general: result.message });
      }
      setLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a Salieri y comienza tu biblioteca</p>
        </div>

        {contextError && <div className="error-message">{contextError}</div>}
        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              id="contraseña"
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.contraseña && <span className="error">{errors.contraseña}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
            <input
              id="confirmarContraseña"
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              disabled={loading}
            />
            {errors.confirmarContraseña && (
              <span className="error">{errors.confirmarContraseña}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

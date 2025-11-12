import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: contextError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
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
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validar();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const result = await login(formData.email, formData.contraseña);
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
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta a Salieri</p>
        </div>

        {contextError && <div className="error-message">{contextError}</div>}
        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.contraseña && <span className="error">{errors.contraseña}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

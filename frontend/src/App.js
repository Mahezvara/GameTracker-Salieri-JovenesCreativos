import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/biblioteca"
              element={
                <PrivateRoute>
                  <DashboardPage view="biblioteca" />
                </PrivateRoute>
              }
            />
            <Route
              path="/reseñas"
              element={
                <PrivateRoute>
                  <DashboardPage view="reseñas" />
                </PrivateRoute>
              }
            />
            <Route
              path="/estadisticas"
              element={
                <PrivateRoute>
                  <DashboardPage view="estadisticas" />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

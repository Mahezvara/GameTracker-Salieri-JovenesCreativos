import React from 'react';
import BibliotecaJuegos from '../components/BibliotecaJuegos';
import ListaReseñas from '../components/ListaReseñas';
import EstadisticasPersonales from '../components/EstadisticasPersonales';
import '../styles/DashboardPage.css';

const DashboardPage = ({ view = 'biblioteca' }) => {
  return (
    <div className="dashboard">
      {view === 'biblioteca' && <BibliotecaJuegos />}
      {view === 'reseñas' && <ListaReseñas />}
      {view === 'estadisticas' && <EstadisticasPersonales />}
    </div>
  );
};

export default DashboardPage;

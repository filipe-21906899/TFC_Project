import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Inscricao from './pages/Inscricao';
import Documentos from './pages/Documentos';
import InscricaoTecnicos from './pages/InscricaoTecnicos';
import Torneio from './pages/Torneio';
import FichaJogo from './pages/FichaJogo';
import Login from './pages/Login';
import CCData from './pages/CCData';
import Jogos from './pages/Jogos';
import JogoInfo from './pages/JogoInfo';
import EquipasInscricao from './pages/EquipasInscrição';
import Information from './pages/Information';


function App() {

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('usersTypeId');
    localStorage.removeItem('clubeId');
    localStorage.removeItem('clubeName');
    window.location.href = '/';
  };

  const isAdmin = localStorage.getItem('username') === 'Admin';

  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <div className='Home'>
            <Link to="/">Taça Barnabé</Link>
          </div>
          <Link to="/documentos">Documentos</Link>
          <Link to="/torneio">Torneios</Link>
          {localStorage.getItem('accessToken') && (
            <>
              <Link to="/info">Informação Equipas</Link>
              <Link to="/inscrição">Inscrição Jogadores</Link>
              <Link to="/inscrição_tecnico">Inscrição Equipa Tecnica</Link>
              {isAdmin && <Link to="/ficha_jogo">Ficha de Jogo</Link>}
              {isAdmin && <Link to="/ccdata">CC Dados</Link>}
              {isAdmin && <Link to="/equipa_inscricao">Inscrição Equipas</Link>}
            </>
          )}
          <div className="login-right">
            {!localStorage.getItem('accessToken') && <Link to="/login">Login</Link>}
            <h1>{localStorage.getItem('username')}</h1>
            {localStorage.getItem('accessToken') && <button onClick={logout}> Logout</button>}
          </div>
        </div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/inscrição" exact element={<Inscricao />} />
          <Route path="/documentos" exact element={<Documentos />} />
          <Route path="/inscrição_tecnico" exact element={<InscricaoTecnicos />} />
          <Route path="/torneio" exact element={<Torneio />} />
          <Route path="/inscricao" exact element={<Inscricao />} />
          <Route path="/ficha_jogo" exact element={<FichaJogo />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/ccdata" exact element={<CCData />} />
          <Route path="/torneio/:id" exact element={<Jogos />} />
          <Route path="/jogo/:id" exact element={<JogoInfo />} />
          <Route path="/equipa_inscricao" exact element={<EquipasInscricao />} />
          <Route path="/info" exact element={<Information />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

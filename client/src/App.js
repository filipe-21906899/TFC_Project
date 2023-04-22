import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from "./pages/Home";
import Inscricao from "./pages/Inscricao";
import Documentos from './pages/Documentos';
import InscricaoTecnicos from './pages/InscricaoTecnicos';
import Torneio from './pages/Torneio';
import FichaJogo from './pages/FichaJogo';
import Cartoes from './pages/Cartoes';
import Login from './pages/Login';
//import { useEffect } from 'react';


function App() {

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('usersTypeId');
    window.location.reload(false);
  }

  return (
    <div className="App">
        <Router>
          <div className='navbar'>
          <Link to="/">Taça Barnabé</Link>
          <Link to="/documentos">Documentos</Link>
          <Link to="/torneio">Torneios</Link>
          {localStorage.getItem('accessToken') && (
              <>
              <Link to="/inscrição">Inscrição Jogadores</Link>
              <Link to="/inscrição_tecnico">Inscrição Equipa Tecnica</Link>
              <Link to="/ficha_jogo">Ficha de Jogo</Link>
              <Link to="/cartoes">Cartões Jogadores</Link>
              </>
            )     
            }
          <div className='login-right'>
            {!localStorage.getItem('accessToken') &&(
              <>
              <Link to="/login">Login</Link>
              </>
            )}
            <h1>{localStorage.getItem('username')}</h1>
            {localStorage.getItem('accessToken') && <button onClick={logout}> Logout</button>}
          </div>
          </div>
          <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path='/inscrição' exact element={<Inscricao/>}/>
            <Route path='/documentos' exact element={<Documentos/>}/>
            <Route path='/inscrição_tecnico' exact element={<InscricaoTecnicos/>}/>
            <Route path='/torneio' exact element={<Torneio/>}/>
            <Route path='/inscricao' exact element={<Inscricao/>}/>
            <Route path='/ficha_logo' exact element={<FichaJogo/>}/>
            <Route path='/cartoes' exact element={<Cartoes/>}/>
            <Route path='/login' exact element={<Login/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;

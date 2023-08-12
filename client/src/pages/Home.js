import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import "../home.css";

function Home() {
  
  useEffect(() => {
  }, []);
  return (
    <div>
      <div className="lander">
        <h3><p>16ª Edição: início a </p></h3>
        <h4><p style={{ color: 'red' }}>Prazo limite de inscrições:</p></h4>
      </div>
      <p>Para participar no torneio, as coletividades interessadas terão de inscrever os escalões e respectivos jogadores e equipa técnica
        neste site.<br />
        A partir da 13ª edição (2018) as inscrições devem ser feitas exclusivamente através deste site.
        Mantêm-se os requisitos das edições anteriores: é necessário uma <strong>fotografia</strong> e a <strong>folha de inscrição</strong>
        &nbsp; (disponível na área de <Link to="/Documentos">documentos</Link>) com os dados do jogador e assinatura (para jogadores menores
        de 18 anos a assinatura do encarregado de educação).
        A fotografia pode ser tirada com um telemóvel (deve ser idêntica a uma fotografia tipo passe) e a folha de inscrição deve ser preenchida
        e posteriormente digitalizada, sendo ambos carregados na página de inscrição de jogador. Para a equipa técnica apenas é necessária a fotografia.</p>
      <p>Os escalões disponíveis para inscrição são os seguintes:</p>
      <div className='escalao'>
        <ul>
          <li><strong>Escolinhas</strong> - masculino e feminino, para nascidos entre 22/11/2013 e 31/12/2017 (Dos 5 aos 8 anos);</li>
          <li><strong>I Escalão</strong> - masculino e feminino, para nascidos entre 22/11/2009 e 21/11/2013 (Dos 8 aos 12 anos);</li>
          <li><strong>II Escalão</strong> - masculino para nascidos entre 22-11-2004 a 21-11-2009 (Dos 13 aos 17 anos);</li>
          <li><strong>III Escalão</strong> - masculino para nascidos antes de 21-11-2004 (+ de 17 anos);</li>
          <li><strong>Escalão Feminino</strong> - para nascidas antes de 21-11-2009 (+ de 12 anos).</li>
        </ul>
      </div>
      <p>Para mais informações sobre o torneio consulte o
        <a href="https://drive.google.com/file/d/1Uj-wNu0Gv4q9FGyd8EEhgQ2N6VpBUYC4/view?usp=sharing" target="_blank" rel="noopener noreferrer"> Regulamento Desportivo</a>.</p>

      <p>Acompanhem-nos na página do torneio e também no Facebook e no Twitter.</p>
      <div className='links'>
        <h2>Links</h2>
        <div className='links'>
          <a href="https://leverade.com/pt/manager/barnabe" target="_blank" rel="noopener noreferrer">Página do torneio</a>
          <a href="https://www.facebook.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>

      </div>
    </div>
  )
}

export default Home

import React from 'react'
import { useNavigate } from "react-router-dom"

function JogoInfo() {

  const navigate = useNavigate();

  return (
    <div className='Inscrição'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>Informação Jogo</h1>
    </div>
  )
}

export default JogoInfo

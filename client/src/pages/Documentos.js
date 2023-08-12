import React, { useEffect } from 'react'

    // { name: 'MapaPavilhao.pdf', type: 'Mapa de ocupação de pavilhão', download: 'https://drive.google.com/file/d/1giu3mqrjgrED9WaaKovQcVmxVrpjq9Kx/view?usp=sharing' }

function Documentos() {
    useEffect(()=>{
    }, []);
  return (
    
    <table className='a'>
        
        <tr id='topo'>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Download</th>
        </tr>
        <tr>
            <th>Ficha_Inscricao_Jogador.pdf</th>
            <th>Ficha Individual de Jogador</th>
            <td><a href="https://drive.google.com/file/d/1WgNrlMmyZnD_-TAFRH40G1TZCiKr7bYj/view?usp=sharing" target="_blank" rel="noopener noreferrer">Download</a></td>
        </tr>
        <tr>
            <th>Regulamento_Desportivo_2022.pdf</th>
            <th>Regulamento Desportivo 2022</th>
            <td><a href="https://drive.google.com/file/d/1Uj-wNu0Gv4q9FGyd8EEhgQ2N6VpBUYC4/view?usp=sharing" target="_blank" rel="noopener noreferrer">Download</a></td>
        </tr>
        <tr>
            <th>Regulamento_Organizacao.pdf</th>
            <th>Regulamento da Organização</th>
            <td><a href="https://drive.google.com/file/d/0B6mGDIzH6fPwOEdwTnREMmVFbUttSjlvdlNDamNVOWUzSHBR/view?usp=sharing&resourcekey=0-D_JJwmynKutiIrKPQieC6A" target="_blank" rel="noopener noreferrer">Download</a></td>
        </tr>
    </table>
  )
}

export default Documentos
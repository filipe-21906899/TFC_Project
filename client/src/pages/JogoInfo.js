import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


function JogoInfo() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [torneioData, setTorneioData] = useState(null);
  const [escalaoName, setEscalaoName] = useState(null);
  const username = localStorage.getItem('username');
  const [jogadores, setJogadores] = useState(null);
  const [tecnicoHome, setTecnicoHome] = useState(null);
  const [tecnicoAway, setTecnicoAway] = useState(null);
  const [tecnicosType, setTecnicosType] = useState([]);
  const [escaloes, setEscaloes] = useState([]);

  const isAdmin = username === 'Admin';

  const navigate = useNavigate();

  const initialValues = {
    JogadoreId: "",
    TempoJogo: "",
    JogoId: id,
  };

  const validationSchema = Yup.object({
    JogadoreId: Yup.string().required('Indique o Jogador'),
    TempoJogo: Yup.string().required('Tempo Jogo em falta'),
  });

  const initialValues2 = {
    JogadoreId: "",
    Tipo: "",
    JogoId: id,
  };

  const validationSchema2 = Yup.object({
    JogadoreId: Yup.string().required('Indique o Jogador'),
    Tipo: Yup.string().required('Indique a cor do cartão'),
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3001/jogo/${id}`)
      .then((response) => {
        setData(response.data);
        console.log("Game Data:", response.data); // Log the fetched game data
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/jogo_jogadores/${id}`)
      .then((response) => {
        setJogadores(response.data);
        console.log("Game Data:", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);


  useEffect(() => {
    if (data) {
      axios
        .get(`http://localhost:3001/torneio/${data.TorneioId}`)
        .then((response) => {
          setTorneioData(response.data); // Set the fetched torneio data in the state
          console.log("Torneio Data:", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [data]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const tecnicosTypeResponse = await fetch('http://localhost:3001/tecnicos_type');
        const tecnicosTypeData = await tecnicosTypeResponse.json();

        setTecnicosType(tecnicosTypeData);

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (data && torneioData) {
        try {
          const homeResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${data.HomeId}&EscalaoId=${torneioData.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
          const awayResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${data.AwayId}&EscalaoId=${torneioData.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);

          const homeData2 = await homeResponse.json();
          const awayData2 = await awayResponse.json();

          if (homeData2.equipaId != null && awayData2.equipaId != null) {
            console.log('Both Home and Away clubs exist in equipas table for the current year.');
            console.log("Home equipaId value:", homeData2.equipaId);
            console.log("Away equipaId value:", awayData2.equipaId);

            const TecnnicosHome = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${homeData2.equipaId}`);
            const TecnnicosAway = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${awayData2.equipaId}`);

            const tecnicosHomeData = await TecnnicosHome.json();
            const tecnicosAwayData = await TecnnicosAway.json();

            if (tecnicosAwayData.length > 0 && tecnicosHomeData.length > 0) {
              console.log('Tecnnicos found in equipaTecnnicos table for equipaId:', awayData2.equipaId);
              console.log('Tecnnicos found in equipaTecnnicos table for equipaId:', homeData2.equipaId);
              console.log('TecnnicosAway:', tecnicosAwayData);
              console.log('TecnnicosHome:', tecnicosHomeData);

              const tecnicoHomeResults = await Promise.all(
                tecnicosHomeData.map(async (tecnicosId) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosId}`);
                  const tecnicoInfo = await tecnicoResponse.json();
                  return tecnicoInfo;
                })
              );

              const tecnicoAwayResults = await Promise.all(
                tecnicosAwayData.map(async (tecnicosId) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosId}`);
                  const tecnicoInfo2 = await tecnicoResponse.json();
                  return tecnicoInfo2;
                })
              );

              // Now you can set the state with the fetched data
              setTecnicoHome(tecnicoHomeResults);
              setTecnicoAway(tecnicoAwayResults);
              console.log('TecnicoHome state:', tecnicoHomeResults);
              console.log('TecnicoAway state:', tecnicoAwayResults);
            }
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    };

    fetchData();
  }, [data, torneioData]);


  useEffect(() => {
    if (torneioData) {
      axios
        .get(`http://localhost:3001/escalao/${torneioData.EscalaoId}`)
        .then((response) => {
          setEscalaoName(response.data); // Set the fetched torneio data in the state
          console.log("AwayName Data:", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [torneioData]);

  useEffect(() => {
    const fetchEscaloes = async () => {
      try {
        const response = await fetch('http://localhost:3001/escalao');
        const data = await response.json();
        setEscaloes(data);
      } catch (error) {
        console.error('Error fetching escaloes:', error);
      }
    };

    fetchEscaloes();
  }, []);

  const jogoFim = async (values) => { };

  const golosSubmit = async (values) => { };

  const cartoesSubmit = async (values) => { };

  //falta só fazer os submits and depois fazer display dos Cartoes e Golos


  return (
    <div className='Inscrição3'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div>
        {data && torneioData && escalaoName && jogadores && tecnicoHome && tecnicoAway && (
          <>
            <div className='players'>
              <h2 >Jogadores</h2>
            </div>
            <div className='tableSBS'>
              <div className='tableHome'>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={5}>
                        {data.Home}
                      </th>
                    </tr>
                    <tr>
                      <th>id</th>
                      <th>Nome</th>
                      <th>Residente</th>
                      <th>Castigado</th>
                      <th>Escalão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jogadores.map((item) => (
                      item.Clube === data.Home && (
                        <tr key={item.id}>
                          <td>{item.JogadorId}</td>
                          <td>{item.Nome}</td>
                          <td
                            style={{
                              color: item.Reside ? 'inherit' : 'inherit',
                              backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                            }}
                          >
                            {item.Reside ? 'Sim' : 'Não'}
                          </td>
                          <td>{item.Castigado === 0 ? 'Não' : 'Sim'}</td>
                          <td>{item.Escalao}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='tableHome'>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={5}>
                        {data.Away}
                      </th>
                    </tr>
                    <tr>
                      <th>id</th>
                      <th>Nome</th>
                      <th>Residente</th>
                      <th>Castigado</th>
                      <th>Escalão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jogadores.map((item) => (
                      item.Clube === data.Away && (
                        <tr key={item.id}>
                          <td>{item.JogadorId}</td>
                          <td>{item.Nome}</td>
                          <td
                            style={{
                              color: item.Reside ? 'inherit' : 'inherit',
                              backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                            }}
                          >
                            {item.Reside ? 'Sim' : 'Não'}
                          </td>
                          <td>{item.Castigado === 0 ? 'Não' : 'Sim'}</td>
                          <td>{item.Escalao}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='players2'>
              <h2 >Equipa Técnica</h2>
            </div>

            <div className='tableSBS2'>
              <div className='tableHome'>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={5}>
                        {data.Home}
                      </th>
                    </tr>
                    <tr>
                      <th>id</th>
                      <th>Nome</th>
                      <th>Residente</th>
                      <th>Função</th>
                      <th>Escalão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tecnicoHome.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td
                          style={{
                            color: item.Reside ? 'inherit' : 'inherit',
                            backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                          }}
                        >
                          {item.Reside ? 'Sim' : 'Não'}
                        </td>
                        <td>{tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}</td>
                        <td>{escaloes.find((escalao) => escalao.id === item.EscalaoId)?.Nome || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='tableHome'>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={5}>
                        {data.Away}
                      </th>
                    </tr>
                    <tr>
                      <th>id</th>
                      <th>Nome</th>
                      <th>Residente</th>
                      <th>Função</th>
                      <th>Escalão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tecnicoAway.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td
                          style={{
                            color: item.Reside ? 'inherit' : 'inherit',
                            backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                          }}
                        >
                          {item.Reside ? 'Sim' : 'Não'}
                        </td>
                        <td>{tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}</td>
                        <td>{escaloes.find((escalao) => escalao.id === item.EscalaoId)?.Nome || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {isAdmin && jogadores && (
          <>
            <div className='btnColor'>
              <button className='btnInfo' onClick={jogoFim}>Jogo Terminado</button>
            </div>
            <div className='cG'>
              <Formik initialValues={initialValues} onSubmit={golosSubmit} validationSchema={validationSchema}>
                <Form className='formContainer4' encType="multipart/form-data">
                  <div style={{ textAlign: 'center' }}>
                    <h1>Golos</h1>
                  </div>
                  <div style={{ display: 'flex' }}>

                    <div className='formLeft'>

                      <label className='field'>Jogador: </label>
                      <Field as='select' name='JogadoreId'>
                        <option value=''>Select Player ID</option>
                        {jogadores.map((item) => (
                          <option key={item.id} value={item.JogadorId}>
                            {`${item.JogadorId} - ${item.Nome}`} {/* Display both JogadorId and Nome */}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name='JogadoreId' component='span' />

                      <label className='field'>Tempo Jogo:</label>
                      <Field type='time' id='timeInput' name='TempoJogo' />
                      <ErrorMessage name='TempoJogo' component='span' />

                      <div className='btnInfo'>
                        <button type='submit'>Obter Ficha Jogo</button>
                      </div>

                    </div>
                  </div>

                </Form>
              </Formik>
              <Formik initialValues={initialValues2} onSubmit={cartoesSubmit} validationSchema={validationSchema2}>
                <Form className='formContainer4' encType="multipart/form-data">
                  <div style={{ textAlign: 'center' }}>
                    <h1>Cartões</h1>
                  </div>
                  <div style={{ display: 'flex' }}>

                    <div className='formLeft'>

                      <label className='field'>Jogador: </label>
                      <Field as='select' name='JogadoreId'>
                        <option value=''>Select Player ID</option>
                        {jogadores.map((item) => (
                          <option key={item.id} value={item.JogadorId}>
                            {`${item.JogadorId} - ${item.Nome}`} {/* Display both JogadorId and Nome */}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name='JogadoreId' component='span' />

                      <label className='field'>Tipo Cartão:</label>
                      <Field as='select' name='Tipo'>
                        <option value=''>Select Tipo Cartão</option>
                        <option value='Amarelo'>Amarelo</option>
                        <option value='Vermelho'>Vermelho</option>
                      </Field>
                      <ErrorMessage name='Tipo' component='span' />

                      <div className='btnInfo'>
                        <button type='submit'>Obter Ficha Jogo</button>
                      </div>

                    </div>
                  </div>

                </Form>
              </Formik>
            </div>
          </>
        )}


      </div>
    </div>
  )
}

export default JogoInfo

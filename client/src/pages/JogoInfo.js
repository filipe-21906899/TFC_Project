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
  const [cartoes, setCartoes] = useState([]);
  const [golos, setGolos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

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

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

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
    axios
      .get(`http://localhost:3001/cartoes/${id}`)
      .then((response) => {
        setCartoes(response.data);
        console.log("Cartoes Data:", response.data); // Log the fetched cartoes data
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/golos/${id}`)
      .then((response) => {
        setGolos(response.data);
        console.log("Golos Data:", response.data); // Log the fetched golos data
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

  const jogoFim = async () => {
    try {
      if (jogadores) {
        let anyPlayerCastigado = false; // Flag to check if any player is castigado
        for (const jogador of jogadores) {
          if (jogador.Castigado) {
            anyPlayerCastigado = true; // Set the flag if a player is castigado
            const jogadorId = jogador.JogadorId;
            console.log("Resetting Castigado for jogador:", jogadorId);
  
            const updateJogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}/reset`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                Castigado: false,
                NCartao: 0,
              }),
            });
  
            if (!updateJogadorResponse.ok) {
              console.error(`Failed to update player ${jogadorId}`);
            } else {
              console.log(`Player ${jogadorId} updated`);
              setShowAlert(true);
            }
          }
        }
  
        // If no player is castigado, log the message
        if (!anyPlayerCastigado) {
          console.log("Jogo terminado nenhum Jogador Castigado");
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error('Error updating players:', error);
    }
  };
  

  const golosSubmit = async (values) => {
    try {
      const selectedPlayer = jogadores.find((item) => item.JogadorId === values.JogadoreId);
      const jogadorId = selectedPlayer.JogadorId;
      const nome = selectedPlayer.Nome;
  
      // Include selected player's data in the submission
      const dataToSubmit = {
        ...values,
        JogadoreId: jogadorId, // Update the selected JogadoreId
        Nome: nome, // Update the Nome
      };
  
      const response = await fetch('http://localhost:3001/golos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        throw new Error('Failed to post golo');
      }
  
      const data = await response.json();
      console.log('Golo posted:', data);
  
      window.location.reload();
  
      return data; // Return the posted golo data if needed
    } catch (error) {
      console.error('Error posting golo:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  const cartoesSubmit = async (values) => {
    try {

      const selectedPlayer = jogadores.find((item) => item.JogadorId === values.JogadoreId);
      const jogadorId = selectedPlayer.JogadorId;
      const nome = selectedPlayer.Nome;
  
      // Include selected player's data in the submission
      const dataToSubmit = {
        ...values,
        JogadoreId: jogadorId, // Update the selected JogadoreId
        Nome: nome, // Update the Nome
      };
  
      const response = await fetch('http://localhost:3001/cartoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to post cartao');
      }

      const data = await response.json();
      console.log('Cartao posted:', data);

      // Increment NCartao of associated player
      try {
        const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${values.JogadoreId}/ncartao`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!jogadorResponse.ok) {
          throw new Error('Failed to update player NCartao');
        }

        console.log('Player NCartao updated');

        // Fetch the player's updated information
        const updatedPlayerResponse = await fetch(`http://localhost:3001/jogadores/${values.JogadoreId}`);
        const updatedPlayerData = await updatedPlayerResponse.json();

        // Check conditions and update Castigado if needed
        if (values.Tipo === 'Amarelo' && updatedPlayerData.NCartao === 2 && !updatedPlayerData.Castigado) {
          const updateCastigadoResponse = await fetch(`http://localhost:3001/jogadores/${values.JogadoreId}/castigado`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Castigado: true
            }),
          });

          if (!updateCastigadoResponse.ok) {
            console.error('Failed to update player Castigado');
          } else {
            console.log('Player Castigado updated');
          }
        } else if (values.Tipo === 'Vermelho') {
          const updateCastigadoResponse = await fetch(`http://localhost:3001/jogadores/${values.JogadoreId}/vermelho`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Castigado: true
            }),
          });

          if (!updateCastigadoResponse.ok) {
            console.error('Failed to update player Castigado');
          } else {
            console.log('Player Castigado updated');
          }
        }
      } catch (error) {
        console.error('Error updating player NCartao:', error);
      }

      // Reload the page after successful submission
      window.location.reload();

      return data; // Return the posted cartao data if needed
    } catch (error) {
      console.error('Error posting cartao:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };


  return (
    <div className='Inscrição3'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div>
        {data && torneioData && escalaoName && jogadores && tecnicoHome && tecnicoAway && golos && cartoes && (
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
                          <td>{item.Castigado ? 'Sim' : 'Não'}</td>
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
                          <td>{item.Castigado ? 'Sim' : 'Não'}</td>
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

            <div className='tableSBS2'>
              <div className='tableHome'>
                <table>
                  <thead>
                    <tr>
                      <th colSpan={2}>
                        Golos
                      </th>
                    </tr>
                    <tr>
                      <th>Nome</th>
                      <th>TempoJogo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {golos.map((item) => (
                      <tr key={item.id}>
                        <td>{item.Nome}</td>
                        <td>{item.TempoJogo}</td>
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
                        Cartões
                      </th>
                    </tr>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartoes.map((item) => (
                      <tr key={item.id}>
                        <td>{item.Nome}</td>
                        <td>{item.Tipo}</td>
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
                        <option value=''>Select Player</option>
                        {jogadores.map((item) => (
                          <option key={item.id} value={item.JogadorId}>
                            {`${item.JogadorId} - ${item.Nome}`}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name='JogadoreId' component='span' />

                      <label className='field'>Tempo Jogo:</label>
                      <Field type='time' id='timeInput' name='TempoJogo' />
                      <ErrorMessage name='TempoJogo' component='span' />

                      <div className='btnInfo'>
                        <button type='submit'>Introduzir Golos</button>
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
                        <option value=''>Select Player</option>
                        {jogadores.map((item) => (
                          <option key={item.id} value={item.JogadorId}>
                            {`${item.JogadorId} - ${item.Nome}`}
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
                        <button type='submit'>Introduzir Cartões</button>
                      </div>

                    </div>
                  </div>

                </Form>
              </Formik>
            </div>
          </>
        )}


      </div>
      {showAlert && (
        <div className='custom-alert-overlay'>
          <div className="custom-alert">
            <p>Jogo Terminado!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JogoInfo

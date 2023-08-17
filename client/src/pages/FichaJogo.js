import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';

function FichaJogo() {

  //na ficha de jogo verificar se as 2 equipas escolhidas estao inscritas naquele escalao
  //na ficha de jogo fazer com q se um opção estiver escolhida para a equipa1 nao aparecer para a equipa 2
  //ver as folhas dadas e criar o template para a folha de jogo e depois meter la a info

  //ficha equipa ver exemplo dado pela junta não é dificil de fazer

  const [clubeOptions, setClubeOptions] = useState([]);
  const [escalaoOptions2, setEscalaoOptions2] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [showAlert, setShowAlert] = useState(false)
  const [detailedJogadores, setDetailedJogadores] = useState([]);
  const [detailedTecnico, setDetailedTecnico] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tecnicosType, setTecnicosType] = useState([]);


  const initialValues = {
    EscalaoId: "",
    Home: "",
    Away: "",
  };

  const validationSchema = Yup.object().shape(
    {
      EscalaoId: Yup.string()
        .required("Campo Obrigatório"),

      Home: Yup.string()
        .required("Campo Obrigatório"),

      Away: Yup.string()
        .required("Campo Obrigatório"),
    }
  )

  const initialValues1 = {
    EscalaoId: "",
    ClubeId: "",
  };

  const validationSchema1 = Yup.object().shape(
    {
      ClubeId: Yup.string()
        .required("Campo Obrigatório"),

      EscalaoId: Yup.string()
        .required("Campo Obrigatório"),
    }
  )

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
    axios
      .get('http://localhost:3001/clubes')
      .then((response) => {
        setClubes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();


        const clubeResponse = await fetch('http://localhost:3001/clubes');
        const clubeData = await clubeResponse.json();

        setClubeOptions(clubeData);

        setEscalaoOptions2(escalaoData)

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const fichaJogo = async (values) => {
    // Implement your logic for fichaJogo here
  };

  const fichaEquipa = async (values) => {
    try {
      console.log('Form Values:', values);

      // Clear previous data and set visibility
      setFormSubmitted(false);
      setDetailedJogadores([]);
      setDetailedTecnico([]);

      const response = await fetch(`http://localhost:3001/equipa/check?ClubeId=${values.ClubeId}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
      const equipaIdData = await response.json();

      if (equipaIdData.equipaId != null) {
        console.log('Combination of ClubeId and EscalaoId exists in equipas table for the current year.');
        console.log("equipaId value:", equipaIdData.equipaId);


        console.log("Jogador")

        // Fetch jogadores data from the server for the given equipaId
        const jogadoresResponse = await fetch(`http://localhost:3001/equipa_jogadores/check?equipaId=${equipaIdData.equipaId}`);
        const jogadoresData = await jogadoresResponse.json();

        if (jogadoresData.length > 0) {
          console.log('Jogadores found in equipaJogadores table for equipaId:', equipaIdData.equipaId);
          console.log('Jogadores:', jogadoresData);

          // Fetch detailed information for each JogadoreId in the array
          const detailedJogadores = await Promise.all(
            jogadoresData.map(async (jogadorId) => {
              const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}`);
              const jogadorInfo = await jogadorResponse.json();
              return jogadorInfo;
            })
          );

          setDetailedJogadores(detailedJogadores);

          console.log('Detailed Jogadores:', detailedJogadores);


        } else {
          console.log('No jogadores found in equipaJogadores table for equipaId:', equipaIdData.equipaId);

        }
        console.log("Tecnico")
        // Fetch tecnicos data from the server for the given equipaId
        const tecnicosResponse = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${equipaIdData.equipaId}`);
        const tecnicosData = await tecnicosResponse.json();

        if (tecnicosData.length > 0) {
          console.log('Tecnicos found in equipaTecnicas table for equipaId:', equipaIdData.equipaId);
          console.log('Tecnicos:', tecnicosData);

          const detailedTecnico = await Promise.all(
            tecnicosData.map(async (tecnicosIds) => {
              const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
              const tecnicoInfo = await tecnicoResponse.json();
              return tecnicoInfo;
            })
          );

          setDetailedTecnico(detailedTecnico);

          console.log('Detailed Tecnicos:', detailedTecnico);


        } else {
          console.log('No tecnicos found in tecnicosEquipa table for equipaId:', equipaIdData.equipaId);

        }


      } else {
        // Show a popup message indicating that the combination is not found
        setShowAlert(true);
      }
      setFormSubmitted(true);

    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };


  return (
    <div className='FichaJogo'>
      <div className='formLeft2'>
        <Formik initialValues={initialValues} onSubmit={fichaJogo} validationSchema={validationSchema}>
          <Form className='formContainer' encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Ficha Jogo</h1>
            </div>
            <div style={{ display: 'flex' }}>

              <div className='formLeft'>

                <label className='field'>Escalão: </label>
                <Field as='select' name='EscalaoId'>
                  <option value=''>Select Escalão</option>
                  {escalaoOptions2.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='EscalaoId' component='span' />

                <label className='field'>Equipa 1:</label>
                <Field as='select' id='select1' name='Home'>
                  <option value=''>Select an option</option>
                  {clubes.map((clube) => (
                    <option value={clube.Nome} key={clube.id}>
                      {clube.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='Home' component='span' />

                <label className='field'>Equipa 2:</label>
                <Field as='select' id='select2' name='Away'>
                  <option value=''>Select an option</option>
                  {clubes.map((clube) => (
                    <option value={clube.Nome} key={clube.id}>
                      {clube.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='Away' component='span' />
                <div className='btnInfo'>
                  <button type='submit'>Obter Ficha Jogo</button>
                </div>

              </div>
            </div>

          </Form>
        </Formik>
      </div>

      <div className='formRight2'>
        <Formik initialValues={initialValues1} onSubmit={fichaEquipa} validationSchema={validationSchema1}>
          <Form className='formContainer' encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Ficha Equipa</h1>
            </div>
            <div style={{ display: 'flex' }}>

              <div className='formLeft'>

                <label className='field' >Clube: </label>
                <Field as='select' name='ClubeId'>
                  <option value=''>Select Clube</option>
                  {clubeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='ClubeId' component='span' />

                <label className='field'>Escalão: </label>
                <Field as='select' name='EscalaoId'>
                  <option value=''>Select Escalão</option>
                  {escalaoOptions2.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='EscalaoId' component='span' />

                <div className='btnInfo'>
                  <button type='submit'>Obter Ficha Equipa</button>
                </div>

              </div>
            </div>
          </Form>
        </Formik>
      </div>
      <div className='bellow'>
        {formSubmitted && (
          <>
            <div className='header-info'>
              <h2>Época: {new Date().getFullYear()}</h2>
              <h2>Equipa: {detailedJogadores[0].Clube || ""}</h2>
              <h2>Escalão: {escalaoOptions2.find((escalao) => escalao.id === detailedJogadores[0].EscalaoId)?.Nome || ""}</h2>
            </div>
            {detailedJogadores.length > 0 && (

              <div className="info-table2">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Data Nascimento</th>
                      <th>CC Jogador</th>
                      <th>Residente</th>
                      {/* Add more columns based on the detailed jogadores information */}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedJogadores.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td>{item.DataNascimento}</td>
                        <td>{item.CCJogador.substring(0, 8)}</td>{/*.substring(0, 8) show only the first 8 digits*/}
                        <td
                          style={{
                            color: item.Reside ? 'inherit' : 'inherit',
                            backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                          }}
                        >
                          {item.Reside ? 'Sim' : 'Não'}
                        </td>

                        {/* Add more cells based on the detailed jogadores information */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
            {detailedTecnico.length > 0 && (
              <div className="info-table2">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Data Nascimento</th>
                      <th>CC Tecnico</th>
                      <th>Tipo Tecnico</th>
                      {/* Add more columns based on the detailed tecnico information */}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedTecnico.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td>{item.DataNascimento}</td>
                        <td>{item.CCTecnico.substring(0, 8)}</td>
                        <td>
                          {tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}
                        </td>
                        {/* Add more cells based on the detailed tecnico information */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {showAlert && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>Clube não inscrito no escalão selecionado!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div >

  )
}

export default FichaJogo

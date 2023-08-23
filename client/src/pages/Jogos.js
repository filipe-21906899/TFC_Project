import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom"


function Jogos() {

  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(null);
  const [escalaoData, setEscalaoData] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [jogoType, setJogoType] = useState([]);
  const [listOfjogos, setListOfJogos] = useState([]);
  const username = localStorage.getItem('username');
  const [teamNotRegistered, setTeamNotRegistered] = useState("");
  const [showAlert2, setShowAlert2] = useState(false)

  const go = useNavigate();
  const navigate = useNavigate();
  const escalaoId = escalaoData ? escalaoData.id : null;


  const validationSchema = Yup.object().shape({
    DataJogo: Yup.date().required('Quando é que o jogo se irá realizar'),
    JogoTypeId: Yup.date().required('Qual o tipo de Jogo'),
    Home: Yup.string().required('Escolha a equipa 1'),
    Away: Yup.string()
      .required("Campo Obrigatório")
      .test("differentClubs", "Clubes tem de ser diferentes", function (value) {
        const { Home } = this.parent;
        return value !== Home;
      }),
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3001/torneio/${id}`)
      .then((response) => {
        setData(response.data);
        fetchEscalaoData(response.data.EscalaoId);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

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
    axios
      .get('http://localhost:3001/jogo_type')
      .then((response) => {
        setJogoType(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/jogo').then((response) => {
      const filteredJogos = response.data.filter((jogo) => jogo.TorneioId === Number(id));
      setListOfJogos(filteredJogos);
    });
  }, [id]);

  const fetchEscalaoData = (escalaoId) => {
    axios
      .get(`http://localhost:3001/escalao/${escalaoId}`)
      .then((response) => {
        setEscalaoData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseAlert = () => {
    setShowAlert2(false);
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      console.log(escalaoId)

      const clubesNameToId = {};
      clubes.forEach((clube) => {
        clubesNameToId[clube.Nome] = clube.id;
      });

      const homeClubId = clubesNameToId[values.Home];
      const awayClubId = clubesNameToId[values.Away];


      const homeResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${homeClubId}&EscalaoId=${escalaoId}&CurrentYear=${new Date().getFullYear()}`);
      const awayResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${awayClubId}&EscalaoId=${escalaoId}&CurrentYear=${new Date().getFullYear()}`);

      const homeData = await homeResponse.json();
      const awayData = await awayResponse.json();

      if (homeData.equipaId != null && awayData.equipaId != null) {
        // Both clubs are registered for the selected Escalao and current year
        console.log('Both Home and Away clubs exist in equipas table for the current year.');
        console.log("Home equipaId value:", homeData.equipaId);
        console.log("Away equipaId value:", awayData.equipaId);

        values.HomeId = homeClubId;
        values.AwayId = awayClubId;

        

        const response = await fetch('http://localhost:3001/jogo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const createdJogo = await response.json();
          console.log('Created Jogo:', createdJogo);

          

          const homeResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${homeClubId}&EscalaoId=${escalaoId}&CurrentYear=${new Date().getFullYear()}`);
          const awayResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${awayClubId}&EscalaoId=${escalaoId}&CurrentYear=${new Date().getFullYear()}`);
    
          const homeData2 = await homeResponse.json();
          const awayData2 = await awayResponse.json();
    
          if (homeData2.equipaId != null && awayData2.equipaId != null) {
            // Both clubs are registered for the selected Escalao and current year
            console.log('Both Home and Away clubs exist in equipas table for the current year.');
            console.log("Home equipaId value:", homeData2.equipaId);
            console.log("Away equipaId value:", awayData2.equipaId);
    
            const jogadoresHome = await fetch(`http://localhost:3001/equipa_jogadores/check?equipaId=${homeData2.equipaId}`);
            const jogadoresAway = await fetch(`http://localhost:3001/equipa_jogadores/check?equipaId=${awayData2.equipaId}`);
    
            const jogadoresHomeData = await jogadoresHome.json();
            const jogadoresAwayData = await jogadoresAway.json();
    
            if (jogadoresAwayData.length > 0 && jogadoresHomeData.length > 0) {
              console.log('Jogadores found in equipaJogadores table for equipaId:', awayData2.equipaId);
              console.log('Jogadores found in equipaJogadores table for equipaId:', homeData2.equipaId);
              console.log('Jogadores:', jogadoresAwayData);
              console.log('Jogadores:', jogadoresHomeData);
    
    
              const detailedJogadores = await Promise.all(
                jogadoresHomeData.map(async (jogadorId) => {
                  const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}`);
                  const jogadorInfo = await jogadorResponse.json();
                  return jogadorInfo;
                })
              );
    
              const detailedJogadores2 = await Promise.all(
                jogadoresAwayData.map(async (jogadorId) => {
                  const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}`);
                  const jogadorInfo2 = await jogadorResponse.json();
                  return jogadorInfo2;
                })
              );
    
              const allDetailedJogadores = [...detailedJogadores, ...detailedJogadores2];

              const jogoJogadoresData = allDetailedJogadores.map((item) => {
                return {
                  JogadorId : item.id,
                  Nome: item.Nome,
                  Clube: item.Clube,
                  Reside: item.Reside,
                  Castigado: item.Castigado,
                  Escalao: escalaoData?.Nome,
                  EscalaoId: item.EscalaoId,
                  JogoId: createdJogo.id, // Use the ID of the created Jogo
                };
              });

              console.log('Detailed Jogadores:', jogoJogadoresData);
              

              await Promise.all(
                jogoJogadoresData.map(async (playerData) => {
                  const response = await fetch('http://localhost:3001/jogo_jogadores', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(playerData),
                  });
        
                  if (!response.ok) {
                    console.error('Failed to add player to JogoJogadores:', response);
                  }
                })
              );
    
            } else {
              console.log('No jogadores found in equipaJogadores table  for equipaId:', awayData.equipaId);
              console.log('No jogadores found in equipaJogadores table for equipaId:', homeData.equipaId);
            }
          }
          window.location.reload()
        } else {
          // Handle error response
          console.error('Failed to create Jogo:', response);
        }

      }else {
        const notRegisteredTeam = homeData.equipaId == null ? 'Equipa 1' : 'Equipa 2';
        setTeamNotRegistered(notRegisteredTeam);
        setShowAlert2(true);
      }
    

    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Jogo:', error);
    }
  };

  return (
    <div className='Inscrição3'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      {username === 'Admin' ? (<Formik
        initialValues={{
          DataJogo: '',
          Home: '',
          Away: '',
          JogoTypeId: '',
          TorneioId: id, // Set the TorneioId field with the value from the URL parameter
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className='formContainer3' encType='multipart/form-data'>

          <div style={{ textAlign: 'center' }}>
            <h1>Jogos Escalão: {escalaoData?.Nome}</h1>
          </div>
          <label className='field' >Dia do Jogo:</label>
          <Field type='date' id='date' name='DataJogo' />
          <ErrorMessage name='DataJogo' component='span' />

          <label className='field' >Tipo de Jogo:</label>
          <Field as='select' id='select3' name='JogoTypeId'>
            <option value=''>Select an option</option>
            {jogoType.map((jogoType) => (
              <option value={jogoType.id} key={jogoType.id}>
                {jogoType.Nome}
              </option>
            ))}
          </Field>
          <ErrorMessage name='JogoTypeId' component='span' />

          <label className='field'>Equipa 1:</label>
          <Field as='select' id='select1' name='Home'>
            <option value=''>Select an option</option>
            {clubes.map((clube) => (
              <option value={clube.Nome} key={clube.id}>
                {clube.Nome}
              </option>
            ))}
          </Field>
          <ErrorMessage name='Home' component='div' className='error' />

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
            <button type='submit'>Submit</button>
          </div>

        </Form>
      </Formik>) : null}
      <div className='torneio-container'>
        {listOfjogos.map((value, key) => {
          const formattedDate = format(new Date(value.DataJogo), 'yyyy-MM-dd');
          // Find the corresponding JogoType based on JogoTypeId
          const jogoTypeItem = jogoType.find((type) => type.id === value.JogoTypeId);
          return (
            <div className='jogo' onClick={() => { go(`/jogo/${value.id}`) }} key={key}>
              <div className='DataJogo'>{formattedDate}</div>
              <div className='Home'>{value.Home}</div>
              <div className='Away'>{value.Away}</div>
              <div className='JogoTypeId'>{jogoTypeItem ? jogoTypeItem.Nome : ''}</div>
            </div>
          );
        })}
      </div>
      {showAlert2 && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>{`'${teamNotRegistered}' não inscrita no escalão selecionado!`}</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jogos;

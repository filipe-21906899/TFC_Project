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

  const go = useNavigate();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    DataJogo: Yup.date().required('Quando é que o jogo se irá realizar'),
    JogoTypeId: Yup.date().required('Qual o tipo de Jogo'),
    Home: Yup.string().required('Escolha a equipa 1'),
    Away: Yup.string()
      .required('Escolha a equipa 2')
      .notOneOf([Yup.ref('Home')], 'Equipas tem de ser diferentes'),
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

  const handleSubmit = async (values) => {
    try {
      console.log(values);

      values.DataJogo = format(new Date(values.DataJogo), 'yyyy-MM-dd');

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
        // Handle success, e.g., show a success message or redirect to another page
      } else {
        // Handle error response
        console.error('Failed to create Jogo:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Jogo:', error);
    }
  };
  
  return (
    <div className='Inscrição'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h1>Jogos Escalão: {escalaoData?.Nome}</h1>
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
    <Form className='formContainer' encType='multipart/form-data'>
      <label htmlFor='date'>Dia do Jogo:</label>
      <Field type='date' id='date' name='DataJogo' />
      <ErrorMessage name='DataJogo' component='div' className='error' />

      <label htmlFor='select1'>Tipo de Jogo:</label>
      <Field as='select' id='select3' name='JogoTypeId'>
        <option value=''>Select an option</option>
        {jogoType.map((jogoType) => (
          <option value={jogoType.id} key={jogoType.id}>
            {jogoType.Nome}
          </option>
        ))}
      </Field>
      <ErrorMessage name='JogoTypeId' component='div' className='error' />

      <label htmlFor='select1'>Equipa 1:</label>
      <Field as='select' id='select1' name='Home'>
        <option value=''>Select an option</option>
        {clubes.map((clube) => (
          <option value={clube.Nome} key={clube.id}>
            {clube.Nome}
          </option>
        ))}
      </Field>
      <ErrorMessage name='Home' component='div' className='error' />

      <label htmlFor='select2'>Equipa 2:</label>
      <Field as='select' id='select2' name='Away'>
        <option value=''>Select an option</option>
        {clubes.map((clube) => (
          <option value={clube.Nome} key={clube.id}>
            {clube.Nome}
          </option>
        ))}
      </Field>
      <ErrorMessage name='Away' component='div' className='error' />

      <button type='submit'>Submit</button>
    </Form>
  </Formik>) : null}
      <div className='torneio-container'>
        {listOfjogos.map((value, key) => {
          const formattedDate = format(new Date(value.DataJogo), 'yyyy-MM-dd');
          // Find the corresponding JogoType based on JogoTypeId
          const jogoTypeItem = jogoType.find((type) => type.id === value.JogoTypeId);
          return (
            <div className='jogo' onClick={()=> {go(`/jogo/${value.id}`)}} key={key}>
              <div className='DataJogo'>{formattedDate}</div>
              <div className='Home'>{value.Home}</div>
              <div className='Away'>{value.Away}</div>
              <div className='JogoTypeId'>{jogoTypeItem ? jogoTypeItem.Nome : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jogos;

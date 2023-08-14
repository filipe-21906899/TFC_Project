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

  const initialValues = {};

  const validationSchema = Yup.object().shape()

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
    // Implement your logic for fichaEquipa here
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
                <ErrorMessage name='Away' component='div' className='error' />
                <div className='btnInfo'>
                  <button type='submit'>Obter Ficha Jogo</button>
                </div>

              </div>
            </div>

          </Form>
        </Formik>
      </div>

      <div className='formRight2'>
        <Formik initialValues={initialValues} onSubmit={fichaEquipa} validationSchema={validationSchema}>
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
    </div >

  )
}

export default FichaJogo

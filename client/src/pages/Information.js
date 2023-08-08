import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';

function Info() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [escalaoOptions2, setEscalaoOptions2] = useState([]);
  const [clubeOptions, setClubeOptions] = useState([]);
  const username = localStorage.getItem('username');
  const clubeName = localStorage.getItem('clubeName');

  const isAdmin = username === 'Admin';
  
  const initialValues = {

    ClubeId: '',
    EscalaoId: "",
    Tipo: "",
  };

  const validationSchema = Yup.object().shape({

    ClubeId: Yup.string()
    .required("Campo Obrigatório"),
    
    EscalaoId: Yup.string()
    .required("Campo Obrigatório"),

    Tipo: Yup.string()
    .required("Campo Obrigatório"),

  })

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();

        // Retrieve the 'clubeId' from local storage
        const loggedInClubeId = localStorage.getItem('clubeId');
        

        // Fetch all the 'equipas' with the 'ClubeId' of the logged-in team
        const equipasResponse = await fetch(
          `http://localhost:3001/equipa?ClubeId=${loggedInClubeId}`
        );
        const equipasData = await equipasResponse.json();

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Extract 'EscalaoId' values from the fetched 'equipas' data
        const escalaoOptionsFiltered = escalaoData.filter((option) =>
          equipasData.some((equipa) => equipa.EscalaoId === option.id && equipa.Ano === currentYear)
        );

        setEscalaoOptions(escalaoOptionsFiltered);

        const clubeResponse = await fetch('http://localhost:3001/clubes'); // Updated endpoint
        const clubeData = await clubeResponse.json();

        setClubeOptions(clubeData);

        setEscalaoOptions2(escalaoData)

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit2 = async (values) => {
    try {

      console.log('Form Values:', values);

      console.log('Form submitted successfully!');
    } catch (error) {
      // Handle error
      console.error('Error creating Equipa:', error);
    }
  };


  return (
    <div className='info'>
      <Formik initialValues={initialValues} onSubmit={handleSubmit2} validationSchema={validationSchema}>
        <Form className='formContainer' encType="multipart/form-data">
        <h1>Informação Jogadores</h1>

        {isAdmin ? (
            <>
              <label>Clube: </label>
              <Field as='select' name='ClubeId'>
                <option value=''>Select Clube</option>
                {clubeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.Nome}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='ClubeId' component='span' />
            </>
          ) : (
            <>
              <label className='club-name'>Clube: {clubeName}</label>
            </>
          )}

          {isAdmin ? (
            <>
              <label>Escalão: </label>
              <Field as='select' name='EscalaoId'>
                <option value=''>Select Escalão</option>
                {escalaoOptions2.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.Nome}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='EscalaoId' component='span' />
            </>
          ) : (
            <>
              <label>Escalão: </label>
              <Field as='select' name='EscalaoId'>
                <option value=''>Select Escalão</option>
                {escalaoOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.Nome}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='EscalaoId' component='span' />
            </>
          )}  

          <label>Tipo: </label>
          <Field as="select" name="Tipo">
            <option value="">Select Jogador ou Técnico</option>
            <option value="Jogador">Jogador</option>
            <option value="Técnico">Técnico</option>
          </Field>
          <ErrorMessage name='Tipo' component="span" />

          <button type='submit'>Obter Informação</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Info
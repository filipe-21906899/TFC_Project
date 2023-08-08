import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

function Info() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [escalaoOptions2, setEscalaoOptions2] = useState([]);
  const [clubeOptions, setClubeOptions] = useState([]);
  const username = localStorage.getItem('username');
  const clubeName = localStorage.getItem('clubeName');
  const [showAlert, setShowAlert] = useState(false)

  const isAdmin = username === 'Admin';

  const initialValues = {

    ClubeId: isAdmin ? '' : localStorage.getItem('clubeId'),
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

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

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

      if (isAdmin) {
        // Check if the combination of ClubeId, EscalaoId, and CurrentYear exists in the equipas table
        const response = await fetch(`http://localhost:3001/equipa/check?ClubeId=${values.ClubeId}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
        const equipaIdData = await response.json();

        if (equipaIdData.equipaId != null) {
          console.log('Combination of ClubeId and EscalaoId exists in equipas table for the current year.');
          console.log("equipaId value:", equipaIdData.equipaId);
          
          //fazer verificação do tipo se for jogador vai procurar a equipaJogador se for tecnico vai procurar na equipatecnica
          //fazer a validação se alguma equipa foi criada se nao mostrar pop up se sim criar tabela com os jogadores ou tecnicos 
          //que tenham sido inscritos nessa equipa mostrar em tabela os jogadores todos inscritos nessa equipa

        } else {
          // Show a popup message indicating that the combination is not found
          setShowAlert(true);
        }
      }else{
        const response = await fetch(`http://localhost:3001/equipa/check?ClubeId=${localStorage.getItem('clubeId')}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
        const equipaIdData = await response.json();

        if (equipaIdData.equipaId != null) {
          console.log("equipaId value:", equipaIdData.equipaId);

          //fazer verificação do tipo se for jogador vai procurar a equipaJogador se for tecnico vai procurar na equipatecnica
          //fazer a validação se alguma equipa foi criada se nao mostrar pop up se sim criar tabela com os jogadores ou tecnicos 
          //que tenham sido inscritos nessa equipa mostrar em tabela os jogadores todos inscritos nessa equipa

        } else {
          // Show a popup message
          setShowAlert(true);
        }
      }


    } catch (error) {
      // Handle error
      console.error('Error:', error);
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
      {showAlert && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>Clube não inscrito no escalão selecionado!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Info
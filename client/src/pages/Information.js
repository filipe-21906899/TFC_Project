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

          // Check the 'tipo' field
          if (values.Tipo === 'Jogador') {
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

              console.log('Detailed Jogadores:', detailedJogadores);


            } else {
              console.log('No jogadores found in equipaJogadores table for equipaId:', equipaIdData.equipaId);

            }

          } else if (values.Tipo === 'Tecnico') {
            console.log("Tecnico")
            // Fetch tecnicos data from the server for the given equipaId
            const tecnicosResponse = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${equipaIdData.equipaId}`);
            const tecnicosData = await tecnicosResponse.json();

            if (tecnicosData.length > 0) {
              console.log('Tecnicos found in equipaTecnicas table for equipaId:', equipaIdData.equipaId);
              console.log('Tecnicos:', tecnicosData);

              // Fetch detailed information for each JogadoreId in the array
              const detailedTecnico = await Promise.all(
                tecnicosData.map(async (tecnicosIds) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
                  const tecnicoInfo = await tecnicoResponse.json();
                  return tecnicoInfo;
                })
              );

              console.log('Detailed Tecnicos:', detailedTecnico);


            } else {
              console.log('No tecnicos found in tecnicosEquipa table for equipaId:', equipaIdData.equipaId);

            }


          } else {
            // Handle invalid 'tipo' value
            console.log("Invalid 'tipo' value:", values.Tipo);
          }

          //add a couple of equipa and tecnicos ao equipaJogadores e equipaTecnicos e testar o codigo acima para ambos
          //meter os dados guardados no array numa tablela para dar display e limitar os dados se o username nao for Admin
          //add a function to change the residente to false e change is color to red


        } else {
          // Show a popup message indicating that the combination is not found
          setShowAlert(true);
        }
      } else {
        const response = await fetch(`http://localhost:3001/equipa/check?ClubeId=${localStorage.getItem('clubeId')}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
        const equipaIdData = await response.json();

        if (equipaIdData.equipaId != null) {
          console.log("equipaId value:", equipaIdData.equipaId);

          // Check the 'tipo' field
          if (values.Tipo === 'Jogador') {
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

              console.log('Detailed Jogadores:', detailedJogadores);

            } else {
              console.log('No jogadores found in equipaJogadores table for equipaId:', equipaIdData.equipaId);
              // Show a message or take appropriate action
              // ...
            }

          } else if (values.Tipo === 'Técnico') {
            console.log("Tecnico")
            // Fetch tecnicos data from the server for the given equipaId
            const tecnicosResponse = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${equipaIdData.equipaId}`);
            const tecnicosData = await tecnicosResponse.json();

            if (tecnicosData.length > 0) {
              console.log('Tecnicos found in equipaTecnicas table for equipaId:', equipaIdData.equipaId);
              console.log('Tecnicos:', tecnicosData);

              // Fetch detailed information for each JogadoreId in the array
              const detailedTecnico = await Promise.all(
                tecnicosData.map(async (tecnicosIds) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
                  const tecnicoInfo = await tecnicoResponse.json();
                  return tecnicoInfo;
                })
              );

              console.log('Detailed Tecnicos:', detailedTecnico);


            } else {
              console.log('No tecnicos found in tecnicosEquipa table for equipaId:', equipaIdData.equipaId);
              // Show a message or take appropriate action
              // ...
            }

          } else {
            // Handle invalid 'tipo' value
            console.log("Invalid 'tipo' value:", values.Tipo);
          }

          //add a couple of equipa and tecnicos ao equipaJogadores e equipaTecnicos e testar o codigo acima para ambos
          //meter os dados guardados no array numa tablela para dar display e limitar os dados se o username nao for Admin
          //add a function to change the residente to false e change is color to red


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
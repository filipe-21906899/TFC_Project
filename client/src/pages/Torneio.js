import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"

function Torneio() {
  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const username = localStorage.getItem('username');
  const [showAlert, setShowAlert] = useState(false)

  const go = useNavigate();

  const [listOfTorneios, setListOfTorneios] = useState([]);

  const initialValues = {
    EscalaoId: '',
    Ano: new Date().getFullYear().toString(),
  };

  const validationSchema = Yup.object().shape({
    EscalaoId: Yup.string().required('Escolha o escalão!'),
  });

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    axios.get('http://localhost:3001/torneio').then((response) => {
      setListOfTorneios(response.data);
    });
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();
        setEscalaoOptions(escalaoData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (values) => {
    try {
        console.log(values);

        // Check if the values exist in the torneios table
        const checkResponse = await fetch(`http://localhost:3001/torneio/check?EscalaoId=${values.EscalaoId}&Ano=${values.Ano}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (checkResponse.ok) {
            const listOfTorneio = await checkResponse.json();
            console.log(listOfTorneio);

            if (listOfTorneio.length > 0) {
                // Torneio already exists for the given EscalaoId and current year
                console.log('Torneio already exists:', listOfTorneio);
                setShowAlert(true);
                return;
            }

            // If the torneio does not exist, proceed with the creation
            const response = await fetch('http://localhost:3001/torneio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const createdTorneio = await response.json();
                console.log('Created Torneio:', createdTorneio);
                window.location.reload();
            } else {
                // Handle error response
                console.error('Failed to create Torneio:', response);
            }
        } else {
            // Handle error response
            console.error('Error checking Torneio existence:', checkResponse);
        }
    } catch (error) {
        // Handle network error or other exceptions
        console.error('Error creating Torneio:', error);
    }
};


  

  return (
    <div className="Inscrição3">
      {username === 'Admin' ? ( // Render the form only if the username is "Admin"
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          <Form className="formContainer3" encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Criação Torneio</h1>
            </div>

            <label className='field'>Escalão: </label>
            <Field as="select" name="EscalaoId">
              <option value="">Select Escalão</option>
              {escalaoOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.Nome}
                </option>
              ))}
            </Field>
            <ErrorMessage name="EscalaoId" component="span" />

            
            <Field hidden autoComplete="off" id="ano" name="Ano" />
            

            <div className='btnInfo'>
              <button type="submit">Inscrever Técnico</button>
            </div>

          </Form>
        </Formik>
      ) : null}
      <div>
        <div className="torneio-container">

          {listOfTorneios.map((value, key) => {
            const escalaoOption = escalaoOptions.find((option) => option.id === value.EscalaoId);
            const escalaoNome = escalaoOption ? escalaoOption.Nome : '';
            return (
              <div className="torneio" onClick={() => { go(`/torneio/${value.id}`) }} key={key}>
                <div className="ano">{value.Ano}</div>
                <div className="escalao">{escalaoNome}</div>
              </div>
            );
          })}
        </div>
      </div>

      {showAlert && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>Torneio já criado!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Torneio;


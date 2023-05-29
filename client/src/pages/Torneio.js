import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"

function Torneio() {
  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const username = localStorage.getItem('username');

  const go = useNavigate();

  const [listOfTorneios, setListOfTorneios] = useState([]);

  const initialValues = {
    EscalaoId: '',
  };

  const validationSchema = Yup.object().shape({
    EscalaoId: Yup.string().required('Escolha o escalão!'),
  });

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
        // Handle success, e.g., show a success message or redirect to another page
      } else {
        // Handle error response
        console.error('Failed to create Torneio:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Torneio:', error);
    }
  };

  return (
    <div className="Inscrição">
      {username === 'Admin' ? ( // Render the form only if the username is "Admin"
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          <Form className="formContainer" encType="multipart/form-data">
            <h1>Criação Torneio</h1>

            <label>Escalão: </label>
            <Field as="select" name="EscalaoId">
              <option value="">Select Escalão</option>
              {escalaoOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.Nome}
                </option>
              ))}
            </Field>
            <ErrorMessage name="EscalaoId" component="span" />

            <label>Ano: </label>
            <Field autoComplete="off" id="ano" name="Ano" placeholder="Ex. 2023" />
            <ErrorMessage name="Ano" component="span" />

            <button type="submit">Inscrever Técnico</button>
          </Form>
        </Formik>
      ) : null}

      <div className="torneio-container">
        {listOfTorneios.map((value, key) => {
          const escalaoOption = escalaoOptions.find((option) => option.id === value.EscalaoId);
          const escalaoNome = escalaoOption ? escalaoOption.Nome : '';
          return (
            <div className="torneio" onClick={()=> {go(`/torneio/${value.id}`)}} key={key}>
              <div className="ano">{value.Ano}</div>
              <div className="escalao">{escalaoNome}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Torneio;


import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
//import { useNavigate } from "react-router-dom"

function EquipasInscricao() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [clubeOptions, setClubeOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const currentYear = new Date().getFullYear()

  //const go = useNavigate();

  const initialValues = {
    EscalaoId: '',
    ClubeId: '',
    Ano: currentYear.toString(),
    Pontos: 0,
  };

  const validationSchema = Yup.object().shape({
    EscalaoId: Yup.string().required('Escolha o escalão!'),
    ClubeId: Yup.string().required('Escolha o clube!'),
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();
        setEscalaoOptions(escalaoData);

        const clubeResponse = await fetch('http://localhost:3001/clubes');
        const clubeData = await clubeResponse.json();
        setClubeOptions(clubeData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  /*

  const handleSubmit2 = async (values) => {
    try {
      // Log the form values
      console.log('Form Values:', values);

      // Your API call here...

      // For demonstration purposes, we are just logging the success message.
      console.log('Form submitted successfully!');
    } catch (error) {
      // Handle error
      console.error('Error creating Equipa:', error);
    }
  };

  */

  const handleSubmit = async (values) => {
    try {
      console.log(values);

      const response = await fetch('http://localhost:3001/equipa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Equipa inscrita:', responseData);
        // Handle success, e.g., show a success message or redirect to another page
      } else if (response.status === 400) {
        // If the status code is 400, it means the team already exists
        console.error('Equipa already saved:', responseData.error);
        setShowAlert(true); // Show a pop-up message
      } else {
        // Handle other error responses
        console.error('Failed to create equipa:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Equipa:', error);
    }
  };

  return (
    <div className='equipas'>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        <Form className="formContainer" encType="multipart/form-data">
          <h1>Inscrição Equipas</h1>

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

          <label className='field'>Clube: </label>
          <Field as="select" name="ClubeId">
            <option value="">Select Clube</option>
            {clubeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.Nome}
              </option>
            ))}
          </Field>
          <ErrorMessage name="ClubeId" component="span" />

          <Field type="hidden" name="Ano" />
          <Field type="hidden" name="Pontos" />

          <div className='btnInfo'>
            <button type="submit">Inscrever Equipa</button>
          </div>

        </Form>
      </Formik>

      {showAlert && (
        <div className='custom-alert-overlay'>
          <div className="custom-alert">
            <p>Equipa já inscrita!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipasInscricao
import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';

function InscricaoTecnicos() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [tecnicosTypeOptions, setTecnicosTypeOptions] = useState([]);

  const initialValues = {
    Escalao: "",
    Nome: "",
    Clube: localStorage.getItem('clubeName'),
    Reside: false,
    Morada: "",
    CodigoPostal: "",
    Contacto: "",
    Email: "",
    CC: "",
    DataNascimento: "",
    TecnicosType: "",
    Imagem: "",
  };

  const validationSchema = Yup.object().shape({
    Escalao: Yup.string().required("Campo Obrigatório"),
    Nome: Yup.string().required("Campo Obrigatório"),
    Morada: Yup.string().required("Campo Obrigatório"),
    CodigoPostal: Yup.number().required("Campo Obrigatório"),
    Contacto: Yup.number().required("Campo Obrigatório"),
    Email: Yup.string().required("Campo Obrigatório"),
    CC: Yup.number().required("Campo Obrigatório"),
    DataNascimento: Yup.string().required("Campo Obrigatório"),
    TecnicosType: Yup.string().required("Campo Obrigatório"),
    Imagem: Yup.mixed()
    .test("fileRequired", "Campo Obrigatório", (value) => {
      // Check if any file is selected
      return value && value.length > 0;
    })
  })

  useEffect(() => {
    fetchTecnicosTypeOptions();
  }, []);

  const fetchTecnicosTypeOptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/tecnicos_type');
      const data = await response.json();
      setTecnicosTypeOptions(data);
    } catch (error) {
      console.error('Error fetching TecnicosType options:', error);
    }
  };

  useEffect(() => {
    fetchEscalaoOptions();
  }, []);

  const fetchEscalaoOptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/escalao');
      const data = await response.json();
      setEscalaoOptions(data);
    } catch (error) {
      console.error('Error fetching Escalao options:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/caderno_eleitoral');
      const cadernoEleitoralData = await response.json();
      
      const ccValues = cadernoEleitoralData.map((item) => item.CC);
      const ccFieldValue = data.CC;
      
      if (ccValues.includes(ccFieldValue)) {
        data.Reside = true;
      }
      
      // Submit the form data to the database
      const submitResponse = await fetch('http://localhost:3001/tecnicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Handle the response
      if (submitResponse.ok) {
        console.log('Form submitted successfully');
        // Handle any further actions or redirects
      } else {
        console.log('Failed to submit form');
        // Handle the error
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error
    }
  };
  
  return (
    <div className='Inscrição'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
        <h1>Inscrição Equipa Técnica</h1>

        <label>Escalão: </label>
        <Field as="select" name="Escalao">
            <option value="">Select Escalão</option>
            {escalaoOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.Nome}
              </option>
            ))}
          </Field>
          <ErrorMessage name='Escalao' component="span" />

          <Field
          autoComplete="off" 
          id ="clube" 
          name="Clube" 
          type="hidden"/>

          <Field
          autoComplete="off" 
          id ="residente" 
          name="Reside" 
          type="hidden"/>

          <label>Nome: </label>
          <Field
          autoComplete="off" 
          id ="name" 
          name="Nome" 
          placeholder="Ex. João Pedro Pascal"/>
          <ErrorMessage name='Nome' component="span" />

          <label>Morada: </label>
          <Field
          autoComplete="off" 
          id ="morada" 
          name="Morada" 
          placeholder="Ex. Rua Mario Santos nº33"/>
          <ErrorMessage name="Morada" component="span"/>

          <label>Código Postal: </label>
          <Field
          autoComplete="off" 
          id ="cpostal" 
          name="CodigoPostal" 
          placeholder="Ex. 2453-993"/>
          <ErrorMessage name='CodigoPostal' component="span"/>

          <label>Contacto: </label>
          <Field
          autoComplete="off" 
          id ="contacto" 
          name="Contacto" 
          placeholder="Ex. 945645321"/>
          <ErrorMessage name='Contacto' component="span"/>

          <label>Email: </label>
          <Field
          autoComplete="off" 
          id ="Email" 
          name="Email" 
          placeholder="Ex. teste@gmail.com"/>
          <ErrorMessage name='Email' component="span"/>

          <label>Nº CC: </label>
          <Field
          autoComplete="off" 
          id ="cc" 
          name="CC" 
          placeholder="Ex. 155555554XW3"/>
          <ErrorMessage name='CC' component="span"/>

          <label>Data Nascimento: </label>
          <Field autoComplete="off" id="data" name="DataNascimento" type="date" />
          <ErrorMessage name="DataNascimento" component="span" /> 
          
          <label>Tipo de Técnico: </label>
          <Field as="select" name="TecnicosType">
            <option value="">Select Tipo de Técnico</option>
            {tecnicosTypeOptions.map((option) => (
            <option key={option.id} value={option.id}>
            {option.Nome}
            </option>
            ))}
          </Field>
          <ErrorMessage name="TecnicosType" component="span" />

          <label>Imagem: </label>
          <input id='imagem' name='Imagem' type='file' accept='image/*'/>
          <ErrorMessage name='Imagem' component='span' />

          <button type='submit'>Inscrever Técnico</button>
        </Form>
      </Formik>
    </div>
  )
}

export default InscricaoTecnicos

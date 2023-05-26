import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';

function InscricaoTecnicos() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [tecnicosTypeOptions, setTecnicosTypeOptions] = useState([]);

  const initialValues = {
    EscalaoId: "",
    Nome: "",
    Clube: localStorage.getItem('clubeName'),
    Reside: 0,
    Morada: "",
    CodigoPostal: "",
    Contacto: "",
    Email: "",
    CC: "",
    DataNascimento: "",
    TecnicosTypeId: "",
    Imagem: "",
  };

  const validationSchema = Yup.object().shape({
    EscalaoId: Yup.string().required("Campo Obrigatório"),
    Nome: Yup.string().required("Campo Obrigatório"),
    Morada: Yup.string().required("Campo Obrigatório"),
    CodigoPostal: Yup.number().required("Campo Obrigatório"),
    Contacto: Yup.number().required("Campo Obrigatório"),
    Email: Yup.string().required("Campo Obrigatório"),
    CC: Yup.number().required("Campo Obrigatório"),
    DataNascimento: Yup.string().required("Campo Obrigatório"),
    TecnicosTypeId: Yup.string().required("Campo Obrigatório"),
    Imagem: Yup.mixed()
    .test("fileRequired", "Campo Obrigatório", (value) => {
      // Check if any file is selected
      return value && value.length > 0;
    })
  })

  useEffect(() => {
    // Fetch and set the options for escalao and tecnicosType
    // Example code to fetch options from the server:
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();
        setEscalaoOptions(escalaoData);

        const tecnicosTypeResponse = await fetch('http://localhost:3001/tecnicos_type');
        const tecnicosTypeData = await tecnicosTypeResponse.json();
        setTecnicosTypeOptions(tecnicosTypeData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  

  const handleSubmit = async (values) => {
    try {
      // Check if the value of CC exists in the CadernoEleitoral table
      const ccExists = await fetch(`http://localhost:3001/caderno_eleitoral/tecnicos?CC=${values.CC}`);
      const ccData = await ccExists.json();
  
      if (ccData.length > 0) {
        values.Reside = 1; // Update the Reside field to 1 if CC exists in the CadernoEleitoral table
      } else {
        values.Reside = 0; // Set the Reside field to 0 if CC does not exist
      }
      console.log(values)
  
      const response = await fetch('http://localhost:3001/tecnicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
  
      if (response.ok) {
        const createdTecnico = await response.json();
        console.log('Created Tecnico:', createdTecnico);
        // Handle success, e.g., show a success message or redirect to another page
      } else {
        // Handle error response
        console.error('Failed to create Tecnico:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Tecnico:', error);
    }
  };
  
  
  
  
  
  return (
    <div className='Inscrição'>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        <Form className='formContainer' encType="multipart/form-data">
        <h1>Inscrição Equipa Técnica</h1>

        <label>Escalão: </label>
        <Field as="select" name="EscalaoId">
            <option value="">Select Escalão</option>
            {escalaoOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.Nome}
              </option>
            ))}
          </Field>
          <ErrorMessage name='EscalaoId' component="span" />

          <Field
          autoComplete="off" 
          id ="clube" 
          name="Clube" 
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
          <Field as="select" name="TecnicosTypeId">
            <option value="">Select Tipo de Técnico</option>
            {tecnicosTypeOptions.map((option) => (
            <option key={option.id} value={option.id}>
            {option.Nome}
            </option>
            ))}
          </Field>
          <ErrorMessage name="TecnicosTypeId" component="span" />

          <label>Imagem: </label>
          <Field id='imagem' name='Imagem' type='file' accept='image/*'/>
          <ErrorMessage name='Imagem' component='span' />

          <button type='submit'>Inscrever Técnico</button>
        </Form>
      </Formik>
    </div>
  )
}

export default InscricaoTecnicos

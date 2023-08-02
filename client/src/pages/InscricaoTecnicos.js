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
    CCTecnico: "",
    DataNascimento: "",
    TecnicosTypeId: "",
    Imagem: "",
  };

  const validationSchema = Yup.object().shape({
    
    EscalaoId: Yup.string()
    .required("Campo Obrigatório"),

    Nome: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/, "Deve conter apenas letras")
    .min(2, "Nome muito curto")
    .max(50, "Nome muito longo"),

    Morada: Yup.string()
    .required("Campo Obrigatório")
    .min(5, "Morada muito curta")
    .max(100, "Morada muito longa")
    .matches(/^[A-Za-zÀ-ÿÇç0-9\s.,'-]*$/, "Morada inválida"),

    CodigoPostal: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^\d{4}-\d{3}$/, "Código Postal inválido"),

    Contacto: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^\d{9}$/, "Contacto inválido"),

    Email: Yup.string()
    .required("Campo Obrigatório")
    .email("Email inválido"),

    CCTecnico: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^\d{9}[A-Z][A-Z]\d$/, "CC inválido - Deve ter 9 números seguidos por 2 letras maiúsculas e 1 número."),

    DataNascimento: Yup.string()
    .required("Campo Obrigatório"),

    TecnicosTypeId: Yup.string()
    .required("Campo Obrigatório"),

    Imagem: Yup.mixed()
    .test("fileRequired", "Campo Obrigatório", (value) => {
      // Check if any file is selected
      return value && value.length > 0;
    })
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

        const tecnicosTypeResponse = await fetch('http://localhost:3001/tecnicos_type');
        const tecnicosTypeData = await tecnicosTypeResponse.json();
        setTecnicosTypeOptions(tecnicosTypeData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

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
      // Check if the value of CC exists in the CadernoEleitoral table
      const ccExists = await fetch(`http://localhost:3001/caderno_eleitoral/tecnicos?CC=${values.CC}`);
      const ccData = await ccExists.json();
  
      if (ccData.length > 0) {
        values.Reside = 1; // Update the Reside field to 1 if CC exists in the CadernoEleitoral table
      } else {
        values.Reside = 0; // Set the Reside field to 0 if CC does not exist
      }
      console.log(values);
  
      // Step 1: Create and save the Tecnico in the tecnicos table
      const response = await fetch('http://localhost:3001/tecnicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const createdTecnico = await response.json();
  
        // Step 2: Retrieve the equipaId based on the provided EscalaoId, ClubeId, and Ano
        const equipaResponse = await fetch(`http://localhost:3001/equipa/equipaId?EscalaoId=${values.EscalaoId}&ClubeId=${localStorage.getItem('clubeId')}&Ano=${new Date().getFullYear()}`);
        const equipaData = await equipaResponse.json();
  
        if (equipaData.equipaId) {
          const equipaId = equipaData.equipaId;
  
          // Step 3: Save the id and the corresponding EscalaoId in the equipatecnica table
          const equipaTecnicaData = {
            TecnicoId: createdTecnico.id,
            EquipaId: equipaId,
          };
  
          const equipaTecnicaResponse = await fetch('http://localhost:3001/equipa_tecnica', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(equipaTecnicaData),
          });
  
          if (equipaTecnicaResponse.ok) {
            const createdEquipaTecnica = await equipaTecnicaResponse.json();
            console.log('Created EquipaTecnica:', createdEquipaTecnica);
            // Handle success, e.g., show a success message or redirect to another page
          } else {
            // Handle error response
            console.error('Failed to create EquipaTecnica:', equipaTecnicaResponse);
          }
        } else {
          // Handle the case when no matching equipa is found for the selected EscalaoId
          console.error('No matching equipa found for the selected EscalaoId:', values.EscalaoId);
        }
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
          name="CCTecnico" 
          placeholder="Ex. 155555554XW3"
          />
          <ErrorMessage name='CCTecnico' component="span"/>

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

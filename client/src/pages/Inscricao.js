import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';

function calculateAge(date) {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Function to validate age based on EscalaoId
function validateAge(escalaoId, dateOfBirth) {
  const age = calculateAge(dateOfBirth);

  switch (escalaoId) {
    case "1":
      return { valid: age >= 5 && age <= 8, message: "A idade do jogador deve estar entre 5 e 8 anos." };
    case "2":
      return { valid: age >= 8 && age <= 12, message: "A idade do jogador deve estar entre 8 e 12 anos." };
    case "3":
      return { valid: age >= 13 && age <= 17, message: "A idade do jogador deve estar entre 13 e 17 anos." };
    case "4":
      return { valid: age >= 18, message: "O jogador deve ter mais de 17 anos." };
    case "5":
      return { valid: age >= 12, message: "O jogador deve ter mais de 12 anos." };
    default:
      return { valid: false, message: "Selecione um escalão válido." };
  }
}


function Inscricao() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);

  const initialValues = {
    EscalaoId: "",
    Nome: "",
    Clube: localStorage.getItem('clubeName'),
    Reside: 0,
    Castigado: 0,
    Morada: "",
    CodigoPostal: "",
    Contacto: "",
    Email: "",
    CC: "",
    CCGuardiao: "",
    DataNascimento: "",
    TecnicosTypeId: "",
    Imagem: "",
    File: "",
  };

  const validationSchema = Yup.object().shape({
    EscalaoId: Yup.string().required("Campo Obrigatório"),

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

    CC: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^\d{9}[A-Z][A-Z]\d$/, "CC inválido - Deve ter 9 números seguidos por 2 letras maiúsculas e 1 número."),

    CCGuardiao: Yup.string()
    .required("Campo Obrigatório")
    .matches(/^\d{9}[A-Z][A-Z]\d$/, "CC inválido - Deve ter 9 números seguidos por 2 letras maiúsculas e 1 número."),

    DataNascimento: Yup.string()
    .required("Campo Obrigatório")
    .test("validAge", function (value) {
      const { EscalaoId } = this.parent;
      const { valid, message } = validateAge(EscalaoId, value);
      return valid || this.createError({ message });
    }),

    Imagem: Yup.mixed()
    .test("fileRequired", "Campo Obrigatório", (value) => {
      // Check if any file is selected
      return value && value.length > 0;
    }),

    File: Yup.mixed()
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

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const submitJogador2 = async (values) => {
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

  const submitJogador = async (values) => {
    console.log("here")
    try {
      // Check if the value of CC exists in the CadernoEleitoral table
      const ccExists = await fetch(`http://localhost:3001/caderno_eleitoral?CC=${values.CC}&CCGuardiao=${values.CCGuardiao}`);
      const ccData = await ccExists.json();
  
      if (ccData.length > 0) {
        values.Reside = 1; // Update the Reside field to 1 if CC exists in the CadernoEleitoral table
      } else {
        values.Reside = 0; // Set the Reside field to 0 if CC does not exist
      }
      console.log(values)
  
      const response = await fetch('http://localhost:3001/jogadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
  
      if (response.ok) {
        const createdJogadores = await response.json();
        console.log('Created Jogador:', createdJogadores);
        // Handle success, e.g., show a success message or redirect to another page
      } else {
        // Handle error response
        console.error('Failed to create Jogador:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Jogador:', error);
    }
  };

  return (
    <div className='Inscrição'>
      <Formik initialValues={initialValues} onSubmit={submitJogador2} validationSchema={validationSchema}>
        <Form className='formContainer' encType="multipart/form-data">
        <h1>Inscrição Jogadores</h1>

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
          id ="clube1" 
          name="Clube" 
          type="hidden"/>

          <label>Nome: </label>
          <Field
          autoComplete="off" 
          id ="name1" 
          name="Nome" 
          placeholder="Ex. João Pedro Pascal"/>
          <ErrorMessage name='Nome' component="span" />

          <label>Morada: </label>
          <Field
          autoComplete="off" 
          id ="morada1" 
          name="Morada" 
          placeholder="Ex. Rua Mario Santos nº33"/>
          <ErrorMessage name="Morada" component="span"/>

          <label>Código Postal: </label>
          <Field
          autoComplete="off" 
          id ="cpostal1" 
          name="CodigoPostal" 
          placeholder="Ex. 2453-993"/>
          <ErrorMessage name='CodigoPostal' component="span"/>

          <label>Contacto: </label>
          <Field
          autoComplete="off" 
          id ="contacto1" 
          name="Contacto" 
          placeholder="Ex. 945645321"/>
          <ErrorMessage name='Contacto' component="span"/>

          <label>Email: </label>
          <Field
          autoComplete="off" 
          id ="Email1" 
          name="Email" 
          placeholder="Ex. teste@gmail.com"/>
          <ErrorMessage name='Email' component="span"/>

          <label>Nº CC: </label>
          <Field
          autoComplete="off" 
          id ="CC" 
          name="CC" 
          placeholder="Ex. 155555554XW3"/>
          <ErrorMessage name='CC' component="span"/>

          <label>Nº CC Guardião: </label>
          <Field
          autoComplete="off" 
          id ="CCGuardiao" 
          name="CCGuardiao" 
          placeholder="Ex. 155555554XW3"/>
          <ErrorMessage name='CCGuardiao' component="span"/>

          <label>Data Nascimento: </label>
          <Field autoComplete="off" id="data" name="DataNascimento" type="date" />
          <ErrorMessage name="DataNascimento" component="span" /> 

          <label>Imagem: </label>
          <Field id='imagem1' name='Imagem' type='file' accept='image/*'/>
          <ErrorMessage name='Imagem' component='span' />

          <label>Ficheiro PDF: </label>
          <Field id='pdf1' name='File' type='file' accept='application/pdf'/>
          <ErrorMessage name='File' component='span' />

          <button type='submit'>Inscrever Jogador</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Inscricao

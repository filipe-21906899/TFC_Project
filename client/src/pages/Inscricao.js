import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
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
    CCJogador: "",
    CCGuardiao: "",
    DataNascimento: "",
    NCartao: 0,
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

    CCJogador: Yup.string()
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
      .required('Campo Obrigatório'),

    File: Yup.mixed()
      .required('Campo Obrigatório'),

  })

  useEffect(() => {
    // Example code to fetch options from the server:
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

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  /*
  const submitJogador2 = async (values) => {
    try {

      console.log('Form Values:', values);

      console.log('Form submitted successfully!');
    } catch (error) {
      // Handle error
      console.error('Error creating Equipa:', error);
    }
  };
  */


  const submitJogador = async (values) => {
    try {
      // Check if the value of CC exists in the CadernoEleitoral table
      const ccExists = await fetch(`http://localhost:3001/caderno_eleitoral?CC=${values.CC}&CCGuardiao=${values.CCGuardiao}`);
      const ccData = await ccExists.json();

      //this will not be used so the value of reside will always be 1 and only change after manualy

      if (ccData.length > 0) {
        values.Reside = 1; // Update the Reside field to 1 if CC exists in the CadernoEleitoral table
      } else {
        values.Reside = 1; // Set the Reside field to 0 if CC does not exist
      }
      console.log(values);
      console.log(values.Imagem)
      console.log(values.File)

      // Step 1: Create and save the Jogador in the jogadores table
      const response = await fetch('http://localhost:3001/jogadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const createdJogador = await response.json();

        // Step 2: Retrieve the equipaId based on the provided EscalaoId, ClubeId, and Ano
        const equipaResponse = await fetch(`http://localhost:3001/equipa/equipaId?EscalaoId=${values.EscalaoId}&ClubeId=${localStorage.getItem('clubeId')}&Ano=${new Date().getFullYear()}`);
        const equipaData = await equipaResponse.json();

        if (equipaData.equipaId) {
          const equipaId = equipaData.equipaId;

          // Step 3: Save the id and the corresponding EscalaoId in the equipa_jogadores table
          const equipaJogadoresData = {
            JogadoreId: createdJogador.id,
            EquipaId: equipaId,
          };


          const equipaJogadoresResponse = await fetch('http://localhost:3001/equipa_jogadores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(equipaJogadoresData),
          });

          if (equipaJogadoresResponse.ok) {
            const createdEquipaJogadores = await equipaJogadoresResponse.json();
            console.log('Created EquipaJogadores:', createdEquipaJogadores);
            window.location.reload()
          } else {
            // Handle error response
            console.error('Failed to create EquipaJogadores:', equipaJogadoresResponse);
          }
        } else {
          // Handle the case when no matching equipa is found for the selected EscalaoId
          console.error('No matching equipa found for the selected EscalaoId:', values.EscalaoId);
        }
      } else {
        // Handle error response
        console.error('Failed to create Jogador:', response);
      }
    } catch (error) {
      // Handle network error or other exceptions
      console.error('Error creating Jogador:', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleProfile = async (e, setFieldValue, name) => {
    const file = e.target.files[0];
    if (file?.size / 1024 / 1024 < 2) {
      const base64 = await convertToBase64(file);
      setFieldValue(name, base64);
      console.log(base64)
    }
    else {
      console.log('Image size must be of 2MB or less');
    };
  }


  return (
    <div className='Inscrição'>
      <Formik initialValues={initialValues} onSubmit={submitJogador} validationSchema={validationSchema}>
        <Form className='formContainer2' encType="multipart/form-data">
          <div style={{ textAlign: 'center' }}>
            <h1>Inscrição Jogadores</h1>
          </div>

          <div style={{ display: 'flex' }}>

            <div className='formLeft'>

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
                id="clube1"
                name="Clube"
                type="hidden" />

              <label>Nome: </label>
              <Field
                autoComplete="off"
                id="name1"
                name="Nome"
                placeholder="Ex. João Pedro Pascal" />
              <ErrorMessage name='Nome' component="span" />

              <label>Morada: </label>
              <Field
                autoComplete="off"
                id="morada1"
                name="Morada"
                placeholder="Ex. Rua Mario Santos nº33" />
              <ErrorMessage name="Morada" component="span" />

              <label>Código Postal: </label>
              <Field
                autoComplete="off"
                id="cpostal1"
                name="CodigoPostal"
                placeholder="Ex. 2453-993" />
              <ErrorMessage name='CodigoPostal' component="span" />

              <label>Contacto: </label>
              <Field
                autoComplete="off"
                id="contacto1"
                name="Contacto"
                placeholder="Ex. 945645321" />
              <ErrorMessage name='Contacto' component="span" />

              <label>Email: </label>
              <Field
                autoComplete="off"
                id="Email1"
                name="Email"
                placeholder="Ex. teste@gmail.com" />
              <ErrorMessage name='Email' component="span" />

            </div>

            <div className='formRight'>
              <label>Nº CC: </label>
              <Field
                autoComplete="off"
                id="CC"
                name="CCJogador"
                placeholder="Ex. 155555554XW3" />
              <ErrorMessage name='CCJogador' component="span" />

              <label>Nº CC Guardião: </label>
              <Field
                autoComplete="off"
                id="CCGuardiao"
                name="CCGuardiao"
                placeholder="Ex. 155555554XW3" />
              <ErrorMessage name='CCGuardiao' component="span" />

              <label>Data Nascimento: </label>
              <Field autoComplete="off" id="data" name="DataNascimento" type="date" />
              <ErrorMessage name="DataNascimento" component="span" />

              <label>Imagem: </label>
              <Field name='Imagem'>
                {({ form, field }) => {
                  const { setFieldValue } = form
                  return (
                    <input
                      type="file"
                      accept='image/*'
                      className='form-control'
                      onChange={(e) => handleProfile(e, setFieldValue, "Imagem")}
                    />
                  )
                }}
              </Field>
              <ErrorMessage name='Imagem' component='span' />

              <label>Ficheiro PDF: </label>
              <Field name='File'>
                {({ form, field }) => {
                  const { setFieldValue } = form
                  return (
                    <input
                      type="file"
                      accept='application/pdf'
                      className='form-control'
                      onChange={(e) => handleProfile(e, setFieldValue, "File")}
                    />
                  )
                }}
              </Field>
              <ErrorMessage name='File' component='span' />
            </div>


          </div>

          <div style={{ textAlign: 'center' }}>
            <button type='submit'>Inscrever Jogador</button>
          </div>

        </Form>
      </Formik>
    </div>
  )
}

export default Inscricao

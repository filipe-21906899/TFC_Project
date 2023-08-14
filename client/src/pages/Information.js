import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { Link } from 'react-router-dom';


function Info() {

  const [escalaoOptions, setEscalaoOptions] = useState([]);
  const [escalaoOptions2, setEscalaoOptions2] = useState([]);
  const [clubeOptions, setClubeOptions] = useState([]);
  const username = localStorage.getItem('username');
  const clubeName = localStorage.getItem('clubeName');
  const [showAlert, setShowAlert] = useState(false)
  const [detailedJogadores, setDetailedJogadores] = useState([]);
  const [detailedTecnico, setDetailedTecnico] = useState([]);
  const [tecnicosType, setTecnicosType] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);


  const isAdmin = username === 'Admin';

  const initialValues = {

    ClubeId: isAdmin ? '' : localStorage.getItem('clubeId'),
    EscalaoId: "",
    Tipo: "",
  };

  const initialValues2 = {
    id: "",
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const tecnicosTypeResponse = await fetch('http://localhost:3001/tecnicos_type');
        const tecnicosTypeData = await tecnicosTypeResponse.json();

        setTecnicosType(tecnicosTypeData);

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit2 = async (values) => {
    try {
      console.log('Form Values:', values);

      // Clear previous data and set visibility
      setFormSubmitted(false);
      setDetailedJogadores([]);
      setDetailedTecnico([]);

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

              setDetailedJogadores(detailedJogadores);

              console.log('Detailed Jogadores:', detailedJogadores);


            } else {
              console.log('No jogadores found in equipaJogadores table for equipaId:', equipaIdData.equipaId);

            }

          } else if (values.Tipo === 'Técnico') {
            console.log("Tecnico")
            // Fetch tecnicos data from the server for the given equipaId
            const tecnicosResponse = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${equipaIdData.equipaId}`);
            const tecnicosData = await tecnicosResponse.json();

            if (tecnicosData.length > 0) {
              console.log('Tecnicos found in equipaTecnicas table for equipaId:', equipaIdData.equipaId);
              console.log('Tecnicos:', tecnicosData);

              const detailedTecnico = await Promise.all(
                tecnicosData.map(async (tecnicosIds) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
                  const tecnicoInfo = await tecnicoResponse.json();
                  return tecnicoInfo;
                })
              );

              setDetailedTecnico(detailedTecnico);

              console.log('Detailed Tecnicos:', detailedTecnico);


            } else {
              console.log('No tecnicos found in tecnicosEquipa table for equipaId:', equipaIdData.equipaId);

            }


          } else {
            // Handle invalid 'tipo' value
            console.log("Invalid 'tipo' value:", values.Tipo);
          }


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

              setDetailedJogadores(detailedJogadores);

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


              const detailedTecnico = await Promise.all(
                tecnicosData.map(async (tecnicosIds) => {
                  const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
                  const tecnicoInfo = await tecnicoResponse.json();
                  return tecnicoInfo;
                })
              );

              setDetailedTecnico(detailedTecnico);

              console.log('Detailed Tecnicos:', detailedTecnico);


            } else {
              console.log('No tecnicos found in tecnicosEquipa table for equipaId:', equipaIdData.equipaId);

            }

          } else {
            console.log("Invalid 'tipo' value:", values.Tipo);
          }



        } else {
          // Show a popup message
          setShowAlert(true);
        }
      }

      setFormSubmitted(true);

    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };


  const handleSubmit = async (values) => {
    try {
      console.log('Form Values:', values);
  
      let detailedData = null;
      let updatedDetailedItems = [];
      
      if (detailedJogadores.length > 0) {
        const response = await fetch(`http://localhost:3001/jogadores/${values.id}`);
        detailedData = await response.json();
        
        if (detailedData) {
          const updatedResideValue = !detailedData.Reside;
  
          // Send a PUT request to update the "Reside" value
          await fetch(`http://localhost:3001/jogadores/${values.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Reside: updatedResideValue })
          });
  
          updatedDetailedItems = detailedJogadores.map(item =>
            item.id === detailedData.id ? { ...detailedData, Reside: updatedResideValue } : item
          );
        }
      } else if (detailedTecnico.length > 0) {
        const response = await fetch(`http://localhost:3001/tecnicos/${values.id}`);
        detailedData = await response.json();
        
        if (detailedData) {
          const updatedResideValue = !detailedData.Reside;
  
          // Send a PUT request to update the "Reside" value
          await fetch(`http://localhost:3001/tecnicos/${values.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Reside: updatedResideValue })
          });
  
          updatedDetailedItems = detailedTecnico.map(item =>
            item.id === detailedData.id ? { ...detailedData, Reside: updatedResideValue } : item
          );
        }
      }
  
      // Set the appropriate state based on the condition
      if (detailedJogadores.length > 0) {
        setDetailedJogadores(updatedDetailedItems);
      } else if (detailedTecnico.length > 0) {
        setDetailedTecnico(updatedDetailedItems);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openImageInNewWindow = (imageData) => {
    const imageWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Image</title>
        </head>
        <body>
          <img src="${imageData}" alt="Image" />
        </body>
      </html>
    `;
    imageWindow.document.open();
    imageWindow.document.write(content);
    imageWindow.document.close();
  };

  const openPdfInNewWindow = (pdfUrl) => {
    const pdfWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>PDF Document</title>
        </head>
        <body>
          <embed src="${pdfUrl}" width="100%" height="100%" type="application/pdf">
        </body>
      </html>
    `;
    pdfWindow.document.open();
    pdfWindow.document.write(content);
    pdfWindow.document.close();
  };
  
  
  



  return (
    <div className='info'>
      <div className="form-wrapper">
        <Formik initialValues={initialValues} onSubmit={handleSubmit2} validationSchema={validationSchema}>
          <Form className='formContainer3' encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Informação</h1>
            </div>

            {isAdmin ? (
              <>
                <label className='field' >Clube: </label>
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
                <label className='field'>Escalão: </label>
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
                <label className='field'>Escalão: </label>
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

            <label className='field'>Tipo: </label>
            <Field as="select" name="Tipo">
              <option value="">Select Jogador ou Técnico</option>
              <option value="Jogador">Jogador</option>
              <option value="Técnico">Técnico</option>
            </Field>
            <ErrorMessage name='Tipo' component="span" />

            <div className='btnInfo'>
              <button type='submit'>Obter Informação</button>
            </div>
          </Form>
        </Formik>
      </div>


      {formSubmitted && (
        <>
          <Formik initialValues={initialValues2} onSubmit={handleSubmit}>
            <Form className='formContainer3' encType="multipart/form-data">
              <div className='formRight'>
                {isAdmin && detailedJogadores.length > 0 && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <h1>Residencia</h1>
                    </div>
                    <label className='ids'>ID Jogador/Tecnico: </label>
                    <Field name='id' component='select'>
                      <option value=''>Select Id</option>
                      {detailedJogadores.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.id}
                        </option>
                      ))}


                    </Field>
                    <ErrorMessage name='id' component='span' />
                    <div className='btnInfo'>
                      <button type='submit'> Residente</button>
                    </div>
                  </>
                )}
                {isAdmin && detailedTecnico.length > 0 && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <h1>Residencia</h1>
                    </div>
                    <label className='ids'>ID Jogador/Tecnico: </label>
                    <Field name='id' component='select'>
                      <option value=''>Select Id</option>
                      {detailedTecnico.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.id}
                        </option>
                      ))}


                    </Field>
                    <ErrorMessage name='id' component='span' />
                    <div className='btnInfo'>
                      <button type='submit'>Residente</button>
                    </div>
                  </>
                )}
              </div>
            </Form>
          </Formik>
          {!isAdmin && detailedJogadores.length > 0 && (
            <div className="info-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Clube</th>
                    <th>Morada</th>
                    <th>Codigo-Postal</th>
                    <th>Contacto</th>
                    <th>Data Nascimento</th>
                    <th>Email</th>
                    <th>CC Jogador</th>
                    <th>CC Guardião</th>
                    <th>Foto</th>
                    <th>PDF</th>
                    {/* Add more columns based on the detailed jogadores information */}
                  </tr>
                </thead>
                <tbody>
                  {detailedJogadores.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.Nome}</td>
                      <td>{item.Clube}</td>
                      <td>{item.Morada}</td>
                      <td>{item.CodigoPostal}</td>
                      <td>{item.Contacto}</td>
                      <td>{item.DataNascimento}</td>
                      <td>{item.Email}</td>
                      <td>{item.CCJogador}</td>
                      <td>{item.CCGuardiao}</td>
                      <td><Link to="#" onClick={() => openImageInNewWindow(item.Imagem)}>Foto</Link></td>
                      <td><Link to="#" onClick={() => openPdfInNewWindow(item.File)}>PDF</Link></td>
                      {/* Add more cells based on the detailed jogadores information */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isAdmin && detailedJogadores.length > 0 && (
            <div className="info-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Clube</th>
                    <th>Morada</th>
                    <th>Codigo-Postal</th>
                    <th>Contacto</th>
                    <th>Data Nascimento</th>
                    <th>Email</th>
                    <th>CC Jogador</th>
                    <th>CC Guardião</th>
                    <th>Residente</th>
                    <th>Foto</th>
                    <th>PDF</th>
                    {/* Add more columns based on the detailed jogadores information */}
                  </tr>
                </thead>
                <tbody>
                  {detailedJogadores.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.Nome}</td>
                      <td>{item.Clube}</td>
                      <td>{item.Morada}</td>
                      <td>{item.CodigoPostal}</td>
                      <td>{item.Contacto}</td>
                      <td>{item.DataNascimento}</td>
                      <td>{item.Email}</td>
                      <td>{item.CCJogador}</td>
                      <td>{item.CCGuardiao}</td>
                      <td
                        style={{
                          color: item.Reside ? 'inherit' : 'inherit',
                          backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                        }}
                      >
                        {item.Reside ? 'Sim' : 'Não'}
                      </td>
                      <td><Link to="#" onClick={() => openImageInNewWindow(item.Imagem)}>Foto</Link></td>
                      <td><Link to="#" onClick={() => openPdfInNewWindow(item.File)}>PDF</Link></td>

                      {/* Add more cells based on the detailed jogadores information */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isAdmin && detailedTecnico.length > 0 && (
            <div className="info-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Clube</th>
                    <th>Morada</th>
                    <th>Codigo-Postal</th>
                    <th>Contacto</th>
                    <th>Data Nascimento</th>
                    <th>Email</th>
                    <th>CC Tecnico</th>
                    <th>Tipo Tecnico</th>
                    <th>Foto</th>
                    {/* Add more columns based on the detailed tecnico information */}
                  </tr>
                </thead>
                <tbody>
                  {detailedTecnico.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.Nome}</td>
                      <td>{item.Clube}</td>
                      <td>{item.Morada}</td>
                      <td>{item.CodigoPostal}</td>
                      <td>{item.Contacto}</td>
                      <td>{item.DataNascimento}</td>
                      <td>{item.Email}</td>
                      <td>{item.CCTecnico}</td>
                      <td>
                        {tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}
                      </td>
                      <td><Link to="#" onClick={() => openImageInNewWindow(item.Imagem)}>Foto</Link></td>
                      {/* Add more cells based on the detailed tecnico information */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isAdmin && detailedTecnico.length > 0 && (
            <div className="info-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Clube</th>
                    <th>Morada</th>
                    <th>Codigo-Postal</th>
                    <th>Contacto</th>
                    <th>Data Nascimento</th>
                    <th>Email</th>
                    <th>CC Tecnico</th>
                    <th>Residente</th>
                    <th>Tipo Tecnico</th>
                    <th>Foto</th>
                    {/* Add more columns based on the detailed tecnico information */}
                  </tr>
                </thead>
                <tbody>
                  {detailedTecnico.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.Nome}</td>
                      <td>{item.Clube}</td>
                      <td>{item.Morada}</td>
                      <td>{item.CodigoPostal}</td>
                      <td>{item.Contacto}</td>
                      <td>{item.DataNascimento}</td>
                      <td>{item.Email}</td>
                      <td>{item.CCTecnico}</td>
                      <td
                        style={{
                          color: item.Reside ? 'inherit' : 'inherit',
                          backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                        }}
                      >
                        {item.Reside ? 'Sim' : 'Não'}
                      </td>
                      <td>
                        {tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}
                      </td>
                      <td><Link to="#" onClick={() => openImageInNewWindow(item.Imagem)}>Foto</Link></td>
                      {/* Add more cells based on the detailed tecnico information */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}



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
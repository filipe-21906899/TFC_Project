import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';


function FichaJogo() {

  const [clubeOptions, setClubeOptions] = useState([]);
  const [escalaoOptions2, setEscalaoOptions2] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [showAlert, setShowAlert] = useState(false)
  const [showAlert2, setShowAlert2] = useState(false)
  const [detailedJogadores, setDetailedJogadores] = useState([]);
  const [detailedTecnico, setDetailedTecnico] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tecnicosType, setTecnicosType] = useState([]);
  const [sameClubsError, setSameClubsError] = useState(false);
  const [formSubmitted2, setFormSubmitted2] = useState(false);
  const [detailedJogadores2, setDetailedJogadores2] = useState([]);
  const [detailedTecnico2, setDetailedTecnico2] = useState([]);
  const [teamNotRegistered, setTeamNotRegistered] = useState("");
  

  const componentPDF = useRef();
  const componentPDF2 = useRef();
  const componentPDF3 = useRef();
  const componentPDF4 = useRef();

  const initialValues = {
    EscalaoId: "",
    Home: "",
    Away: "",
  };

  const validationSchema = Yup.object().shape(
    {
      EscalaoId: Yup.string()
        .required("Campo Obrigatório"),

      Home: Yup.string()
        .required("Campo Obrigatório"),

      Away: Yup.string()
        .required("Campo Obrigatório")
        .test("differentClubs", "Clubes tem de ser diferentes", function (value) {
          const { Home } = this.parent;
          return value !== Home;
        }),
    }
  )

  const initialValues1 = {
    EscalaoId: "",
    ClubeId: "",
  };

  const validationSchema1 = Yup.object().shape(
    {
      ClubeId: Yup.string()
        .required("Campo Obrigatório"),

      EscalaoId: Yup.string()
        .required("Campo Obrigatório"),
    }
  )

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

  useEffect(() => {
    axios
      .get('http://localhost:3001/clubes')
      .then((response) => {
        setClubes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const escalaoResponse = await fetch('http://localhost:3001/escalao');
        const escalaoData = await escalaoResponse.json();


        const clubeResponse = await fetch('http://localhost:3001/clubes');
        const clubeData = await clubeResponse.json();

        setClubeOptions(clubeData);

        setEscalaoOptions2(escalaoData)

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const fichaJogo = async (values) => {
    try {

      setFormSubmitted(false);
      setFormSubmitted2(false);
      setDetailedJogadores([]);
      setDetailedTecnico([]);
      setDetailedJogadores2([]);
      setDetailedTecnico2([]);

      // Check if both Home and Away club IDs exist for the current year and EscalaoId
      console.log(values.Home)
      console.log(values.Away)
      const homeResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${values.Home}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
      const awayResponse = await fetch(`http://localhost:3001/equipa/check?ClubeId=${values.Away}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);

      const homeData = await homeResponse.json();
      const awayData = await awayResponse.json();

      if (homeData.equipaId != null && awayData.equipaId != null) {
        // Both clubs are registered for the selected Escalao and current year
        console.log('Both Home and Away clubs exist in equipas table for the current year.');
        console.log("Home equipaId value:", homeData.equipaId);
        console.log("Away equipaId value:", awayData.equipaId);

        const jogadoresHome = await fetch(`http://localhost:3001/equipa_jogadores/check?equipaId=${homeData.equipaId}`);
        const tecnicosHome = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${homeData.equipaId}`);

        const jogadoresHomeData = await jogadoresHome.json();
        const tecnicosHomeData = await tecnicosHome.json();

        if (jogadoresHomeData.length > 0 && tecnicosHomeData.length > 0) {
          console.log('Jogadores and tecnicos found in equipaJogadores table and equipaTecnica table for equipaId:', homeData.equipaId);
          console.log('Jogadores:', jogadoresHomeData);
          console.log('Tecnicos:', tecnicosHomeData);

          // Fetch detailed information for each JogadoreId in the array
          const detailedJogadores = await Promise.all(
            jogadoresHomeData.map(async (jogadorId) => {
              const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}`);
              const jogadorInfo = await jogadorResponse.json();
              return jogadorInfo;
            })
          );

          const detailedTecnico = await Promise.all(
            tecnicosHomeData.map(async (tecnicosIds) => {
              const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
              const tecnicoInfo = await tecnicoResponse.json();
              return tecnicoInfo;
            })
          );

          setDetailedJogadores(detailedJogadores);
          setDetailedTecnico(detailedTecnico)

          console.log('Detailed Jogadores:', detailedJogadores);
          console.log('Detailed Tecnicos:', detailedTecnico);

        } else {
          console.log('No jogadores found in equipaJogadores table for equipaId:', homeData.equipaId);
        }

        const jogadoresAway = await fetch(`http://localhost:3001/equipa_jogadores/check?equipaId=${awayData.equipaId}`);
        const tecnicosAway = await fetch(`http://localhost:3001/equipa_tecnica/check?equipaId=${awayData.equipaId}`);

        const jogadoresAwayData = await jogadoresAway.json();
        const tecnicosAwayData = await tecnicosAway.json();

        if (jogadoresAwayData.length > 0 && tecnicosAwayData.length > 0) {
          console.log('Jogadores and tecnicos found in equipaJogadores table and equipaTecnica table for equipaId:', awayData.equipaId);
          console.log('Jogadores:', jogadoresAwayData);
          console.log('Tecnicos:', tecnicosAwayData);

          // Fetch detailed information for each JogadoreId in the array
          const detailedJogadores2 = await Promise.all(
            jogadoresAwayData.map(async (jogadorId) => {
              const jogadorResponse = await fetch(`http://localhost:3001/jogadores/${jogadorId}`);
              const jogadorInfo = await jogadorResponse.json();
              return jogadorInfo;
            })
          );

          const detailedTecnico2 = await Promise.all(
            tecnicosAwayData.map(async (tecnicosIds) => {
              const tecnicoResponse = await fetch(`http://localhost:3001/tecnicos/${tecnicosIds}`);
              const tecnicoInfo = await tecnicoResponse.json();
              return tecnicoInfo;
            })
          );

          setDetailedJogadores2(detailedJogadores2);
          setDetailedTecnico2(detailedTecnico2)

          console.log('Detailed Jogadores:', detailedJogadores2);
          console.log('Detailed Tecnicos:', detailedTecnico2);

        } else {
          console.log('No jogadores found in equipaJogadores table neither in equipatecnica table for equipaId:', awayData.equipaId);
        }


      } else {
        const notRegisteredTeam = homeData.equipaId == null ? 'Equipa 1' : 'Equipa 2';
        setTeamNotRegistered(notRegisteredTeam);
        setShowAlert2(true);
      }

      setFormSubmitted2(true);

    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const fichaEquipa = async (values) => {
    try {
      console.log('Form Values:', values);

      // Clear previous data and set visibility
      setFormSubmitted(false);
      setFormSubmitted2(false);
      setDetailedJogadores([]);
      setDetailedTecnico([]);
      setDetailedJogadores2([]);
      setDetailedTecnico2([]);

      console.log(values.ClubeId)
      const response = await fetch(`http://localhost:3001/equipa/check?ClubeId=${values.ClubeId}&EscalaoId=${values.EscalaoId}&CurrentYear=${new Date().getFullYear()}`);
      const equipaIdData = await response.json();

      if (equipaIdData.equipaId != null) {
        console.log('Combination of ClubeId and EscalaoId exists in equipas table for the current year.');
        console.log("equipaId value:", equipaIdData.equipaId);


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
        // Show a popup message indicating that the combination is not found
        setShowAlert(true);
      }
      setFormSubmitted(true);

    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setShowAlert2(false);
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "JogoData1",
  });
  const generatePDF2 = useReactToPrint({
    content: () => componentPDF2.current,
    documentTitle: "JogoData1",
  });
  const generatePDF3 = useReactToPrint({
    content: () => componentPDF3.current,
    documentTitle: "JogoData1",
  });
  const generatePDF4 = useReactToPrint({
    content: () => componentPDF4.current,
    documentTitle: "JogoData1",
  });

  return (
    <div className='FichaJogo'>
      <div className='formLeft2'>
        <Formik initialValues={initialValues} onSubmit={fichaJogo} validationSchema={validationSchema}>
          <Form className='formContainer' encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Ficha Jogo</h1>
            </div>
            <div style={{ display: 'flex' }}>

              <div className='formLeft'>

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

                <label className='field'>Equipa 1:</label>
                <Field as='select' id='select1' name='Home'>
                  <option value=''>Select an option</option>
                  {clubes.map((clube) => (
                    <option value={clube.id} key={clube.id}>
                      {clube.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='Home' component='span' />

                <label className='field'>Equipa 2:</label>
                <Field as='select' id='select2' name='Away'>
                  <option value=''>Select an option</option>
                  {clubes.map((clube) => (
                    <option value={clube.id} key={clube.id}>
                      {clube.Nome}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='Away' component='span' />
                <div className='btnInfo'>
                  <button type='submit'>Obter Ficha Jogo</button>
                </div>

              </div>
            </div>

          </Form>
        </Formik>
      </div>

      <div className='formRight2'>
        <Formik initialValues={initialValues1} onSubmit={fichaEquipa} validationSchema={validationSchema1}>
          <Form className='formContainer' encType="multipart/form-data">
            <div style={{ textAlign: 'center' }}>
              <h1>Ficha Equipa</h1>
            </div>
            <div style={{ display: 'flex' }}>

              <div className='formLeft'>

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

                <div className='btnInfo'>
                  <button type='submit'>Obter Ficha Equipa</button>
                </div>

              </div>
            </div>
          </Form>
        </Formik>
      </div>

      <div className='downloadFichas'>
        {formSubmitted2 && (
          <>
            <button className='btnInfo' onClick={generatePDF}>PDF FichaJogo1</button>
            <button className='btnInfo' onClick={generatePDF2}>PDF FichaJogo2</button>
          </>
        )}
        {formSubmitted && (
          <>
            <button className='btnInfo' onClick={generatePDF3}>PDF FichaEquipa1</button>
            <button className='btnInfo' onClick={generatePDF4}>PDF FichaEquipa2</button>
          </>
        )}
      </div>

      <div ref={componentPDF3} className='bellow'>
        {formSubmitted && (
          <>
            <div className='header-info'>
              <h2>Época: {new Date().getFullYear()}</h2>
              <h2>Equipa: {detailedJogadores[0].Clube || ""}</h2>
              <h2>Escalão: {escalaoOptions2.find((escalao) => escalao.id === detailedJogadores[0].EscalaoId)?.Nome || ""}</h2>
            </div>
            {detailedJogadores.length > 0 && (

              <div className="info-table2">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Data Nascimento</th>
                      <th>CC Jogador</th>
                      <th>Residente</th>
                      {/* Add more columns based on the detailed jogadores information */}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedJogadores.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td>{item.DataNascimento}</td>
                        <td>{item.CCJogador.substring(0, 8)}</td>{/*.substring(0, 8) show only the first 8 digits*/}
                        <td
                          style={{
                            color: item.Reside ? 'inherit' : 'inherit',
                            backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                          }}
                        >
                          {item.Reside ? 'Sim' : 'Não'}
                        </td>

                        {/* Add more cells based on the detailed jogadores information */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
            {detailedTecnico.length > 0 && (
              <div className="info-table2">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Data Nascimento</th>
                      <th>CC Tecnico</th>
                      <th>Tipo Tecnico</th>
                      {/* Add more columns based on the detailed tecnico information */}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedTecnico.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.Nome}</td>
                        <td>{item.DataNascimento}</td>
                        <td>{item.CCTecnico.substring(0, 8)}</td>
                        <td>
                          {tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}
                        </td>
                        {/* Add more cells based on the detailed tecnico information */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      <div ref={componentPDF4} className='bellow2'>
        {formSubmitted && (
          <>
            <h2 className='smallerFont'>Sociedade Recreativa e Desportiva de {detailedJogadores[0].Clube || ""}</h2>
            <div className='header-info'>
              <h2>Escalão: {escalaoOptions2.find((escalao) => escalao.id === detailedJogadores[0].EscalaoId)?.Nome || ""}</h2>
              <h2>Adversário: ______________________________</h2>
            </div>
            {detailedJogadores.length > 0 && (

              <div className="info-table3">
                <table>
                  <thead>
                    <tr>
                      <th colSpan={15}>Jogadores</th>
                      <th colSpan={3}>Cartões</th>
                    </tr>
                    <tr>
                      <th>Nome</th>
                      <th>Camisola</th>
                      <th>CAP</th>
                      <th>SC</th>
                      <th>GR</th>
                      <th>G1</th>
                      <th>G2</th>
                      <th>G3</th>
                      <th>G4</th>
                      <th>G5</th>
                      <th>G6</th>
                      <th>G7</th>
                      <th>G8</th>
                      <th>G9</th>
                      <th>G10</th>
                      <th>A1</th>
                      <th>A2</th>
                      <th>V</th>
                      {/* Add more columns based on the detailed jogadores information */}
                    </tr>
                  </thead>
                  <tbody>
                    {detailedJogadores.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                        }}>
                          {item.Nome}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* Add more cells based on the detailed jogadores information */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {detailedTecnico.length > 0 && (
              <div className='sidebside'>
                <div className="info-table4">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan={2}>EQUIPA TÉCNICA</th>
                      </tr>
                      <tr>
                        <th>Funcção</th>
                        <th>Nome</th>
                        {/* Add more columns based on the detailed tecnico information */}
                      </tr>
                    </thead>
                    <tbody>
                      {detailedTecnico
                        .filter((item) => tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome === 'Treinador')
                        .map((item) => (
                          <tr key={item.id}>
                            <td> {tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}</td>
                            <td>{item.Nome}</td>
                            {/* Add more cells based on the detailed tecnico information */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <table className='faltasdescontos'>
                  <thead>
                    <tr>
                      <th>Faltas próprias</th>
                      <th>1ºTempo</th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th>2ºTempo</th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                    </tr>
                    <tr>
                      <th>Faltas do adversário</th>
                      <th>1ºTempo</th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th>2ºTempo</th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                    </tr>
                    <tr>
                      <th>Descontos próprias</th>
                      <th>1ºTempo</th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th>2ºTempo</th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                      <th className='largerCell'> </th>
                    </tr>
                    <tr>
                      <th>Descontos do adversário</th>
                      <th>1ºTempo</th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                      <th>2ºTempo</th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                      <th>  </th>
                    </tr>
                  </thead>
                </table>

              </div>
            )}
            <h2 className='smallerFont'> Resultado: 1ºTempo _____/_____ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Final _____/_____ </h2>
          </>
        )}
      </div>


      <div ref={componentPDF} className='jogoBellow'>
        {formSubmitted2 && (
          <>
            <h2 className='smallerFont'>{escalaoOptions2.find((escalao) => escalao.id === detailedJogadores[0].EscalaoId)?.Nome || ""} -- Jornada:______Local:______________________________________________ </h2>
            <h2 className='smallerFont'>Data e hora:___/____/________ - ____:____</h2>
            <div className='homeAway'>
              {detailedJogadores.length > 0 && detailedTecnico.length > 0 && (
                <div className='home'>
                  <div className="homeTable">
                    <table>
                      <thead>
                        <tr>
                          <th className='largeCell2' colSpan={2}>{detailedJogadores[0].Clube || ""}</th>
                          <th colSpan={1}>Cap.<br />Sub.<br />G.R.</th>
                          <th className='largeCell3' colSpan={8}>Golos</th>
                          <th colSpan={3}>Cartões</th>
                          <th colSpan={1}>Cas.</th>
                        </tr>
                        <tr>
                          <th>Nº</th>
                          <th>Nome</th>
                          <th className='largerCell'></th>
                          <th className='largerCell'>1</th>
                          <th className='largerCell'>2</th>
                          <th className='largerCell'>3</th>
                          <th className='largerCell'>4</th>
                          <th className='largerCell'>5</th>
                          <th className='largerCell'>6</th>
                          <th className='largerCell'>7</th>
                          <th className='largerCell'>8</th>
                          <th>A</th>
                          <th>A</th>
                          <th>V</th>
                          <th>S/N</th>
                          {/* Add more columns based on the detailed jogadores information */}
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(18)].map((_, index) => {
                          const item = detailedJogadores[index] || {}; // Use an empty object if no player data exists
                          return (
                            <tr key={index}>
                              <td></td>
                              <td style={{
                                backgroundColor: item.Nome ? (item.Reside ? 'inherit' : '#A45A52') : 'inherit'
                              }}>
                                {item.Nome || ''} {/* Display player name or an empty string */}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{item.Nome ? (item.Castigado ? 'Sim' : 'Não') : ''}</td>
                              {/* Add more empty cells as needed */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className='tecnicoTable'>
                      <table>
                        <thead>
                          <tr>
                            <th className='large1'>Função</th>
                            <th>Nome</th>

                            {/* Add more columns based on the detailed jogadores information */}
                          </tr>
                        </thead>
                        <tbody>
                          {detailedTecnico.map((item) => (
                            <tr key={item.id}>
                              <td>{tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}</td>
                              <td style={{
                                backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                              }}>
                                {item.Nome}
                              </td>
                              {/* Add more cells based on the detailed jogadores information */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className='sBys'>
                      <div className='faltas'>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={6}>Faltas</th>
                            </tr>
                            <tr>
                              <th className='largerCell'>1ºT</th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                            <tr>
                              <th>2ºT</th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className='desconto'>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={2}>Desconto</th>
                            </tr>
                            <tr>
                              <th className='largerCell'>1ºT</th>
                              <th></th>
                            </tr>
                            <tr>
                              <th className='largerCell'>2ºT</th>
                              <th></th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className='delegado'>
                        <table>
                          <thead>
                            <tr>
                              <th>Delegado:</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              )}
              {detailedJogadores2.length > 0 && detailedTecnico2.length > 0 && (
                <div className='away'>
                  <div className="homeTable">
                    <table>
                      <thead>
                        <tr>
                          <th className='largeCell2' colSpan={2}>{detailedJogadores2[0].Clube || ""}</th>
                          <th colSpan={1}>Cap.<br />Sub.<br />G.R.</th>
                          <th className='largeCell3' colSpan={8}>Golos</th>
                          <th colSpan={3}>Cartões</th>
                          <th colSpan={1}>Cas.</th>
                        </tr>
                        <tr>
                          <th>Nº</th>
                          <th>Nome</th>
                          <th className='largerCell'></th>
                          <th className='largerCell'>1</th>
                          <th className='largerCell'>2</th>
                          <th className='largerCell'>3</th>
                          <th className='largerCell'>4</th>
                          <th className='largerCell'>5</th>
                          <th className='largerCell'>6</th>
                          <th className='largerCell'>7</th>
                          <th className='largerCell'>8</th>
                          <th>A</th>
                          <th>A</th>
                          <th>V</th>
                          <th>S/N</th>
                          {/* Add more columns based on the detailed jogadores information */}
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(18)].map((_, index) => {
                          const item = detailedJogadores2[index] || {}; // Use an empty object if no player data exists
                          return (
                            <tr key={index}>
                              <td></td>
                              <td style={{
                                backgroundColor: item.Nome ? (item.Reside ? 'inherit' : '#A45A52') : 'inherit'
                              }}>
                                {item.Nome || ''} {/* Display player name or an empty string */}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{item.Nome ? (item.Castigado ? 'Sim' : 'Não') : ''}</td>
                              {/* Add more empty cells as needed */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className='tecnicoTable'>
                      <table>
                        <thead>
                          <tr>
                            <th className='large1'>Função</th>
                            <th>Nome</th>

                            {/* Add more columns based on the detailed jogadores information */}
                          </tr>
                        </thead>
                        <tbody>
                          {detailedTecnico2.map((item) => (
                            <tr key={item.id}>
                              <td>{tecnicosType.find((type) => type.id === item.TecnicosTypeId)?.Nome || 'Unknown'}</td>
                              <td style={{
                                backgroundColor: item.Reside ? 'inherit' : '#A45A52'
                              }}>
                                {item.Nome}
                              </td>
                              {/* Add more cells based on the detailed jogadores information */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className='sBys'>
                      <div className='faltas'>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={6}>Faltas</th>
                            </tr>
                            <tr>
                              <th className='largerCell'>1ºT</th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                            <tr>
                              <th>2ºT</th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className='desconto'>
                        <table>
                          <thead>
                            <tr>
                              <th colSpan={2}>Faltas</th>
                            </tr>
                            <tr>
                              <th className='largerCell'>1ºT</th>
                              <th></th>
                            </tr>
                            <tr>
                              <th className='largerCell'>2ºT</th>
                              <th></th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className='delegado'>
                        <table>
                          <thead>
                            <tr>
                              <th>Delegado:</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
            <h2 className='smallerFont'>Resultado: 1ºTempo ____/____  Final ____/____  Mesa: _____________________  MVP: _____________________________</h2>

          </>
        )}
      </div>

      <div ref={componentPDF2} className='jogoBellow2'>
        {formSubmitted2 && (
          <>
            <div className='evo'>
              <table>
                <thead>
                  <tr className='colored'>
                    <th className='larg' colSpan={22}>EVOLUÇÃO RESULTADO</th>
                  </tr>
                  <tr>
                    <th colSpan={2}></th>
                    <th colSpan={20}>Golos</th>
                  </tr>
                  <tr>
                    <th colSpan={2}>Equipa</th>
                    <th>1º</th>
                    <th>2º</th>
                    <th>3º</th>
                    <th>4º</th>
                    <th>5º</th>
                    <th>6º</th>
                    <th>7º</th>
                    <th>8º</th>
                    <th>9º</th>
                    <th>10º</th>
                    <th>11º</th>
                    <th>12º</th>
                    <th>13º</th>
                    <th>14º</th>
                    <th>15º</th>
                    <th>16º</th>
                    <th>17º</th>
                    <th>18º</th>
                    <th>19º</th>
                    <th>20º</th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>Casa</th>
                    <th colSpan={1}>Nº</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Min.</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>Fora</th>
                    <th colSpan={1}>Nº</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Min.</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
              </table>

              <table>
                <thead>
                  <tr className='colored'>
                    <th className='larg' colSpan={25}>DISCIPLINA</th>
                  </tr>
                  <tr>
                    <th colSpan={1} rowSpan={2}>Cartões</th>
                    <th colSpan={3}>1º Cartão</th>
                    <th colSpan={3}>2º Cartão</th>
                    <th colSpan={3}>3º Cartão</th>
                    <th colSpan={3}>4º Cartão</th>
                    <th colSpan={3}>5º Cartão</th>
                    <th colSpan={3}>6º Cartão</th>
                    <th colSpan={3}>7º Cartão</th>
                    <th colSpan={3}>8º Cartão</th>
                  </tr>
                  <tr>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                    <th>Nº</th>
                    <th>Min.</th>
                    <th>Cor</th>
                  </tr>
                  <tr>
                    <th>Casa</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Fora</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
              </table>

              <table>
                <thead>
                  <tr>
                    <th className='colored'>
                      COMENTÁRIO AO JOGO
                    </th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                </thead>
              </table>

              <table>
                <thead>
                  <tr>
                    <th className='colored'>
                      RELATÓRIO DO DELEGADO DA EQUIPA VISITADA
                    </th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'>NADA A ASSINALAR <span className="square-box"></span> -  ASSINATURA</th>
                  </tr>
                </thead>
              </table>

              <table>
                <thead>
                  <tr>
                    <th className='colored'>
                      RELATÓRIO DO DELEGADO DA EQUIPA VISITANTE
                    </th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'>NADA A ASSINALAR <span className="square-box"></span> -  ASSINATURA</th>
                  </tr>
                </thead>
              </table>

              <table>
                <thead>
                  <tr>
                    <th className='colored'>
                      RELATÓRIO DA MESA
                    </th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'></th>
                  </tr>
                  <tr>
                    <th className='big'>NADA A ASSINALAR <span className="square-box"></span> -  ASSINATURA</th>
                  </tr>
                </thead>
              </table>

            </div>
          </>
        )}
      </div>

      {showAlert2 && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>{`'${teamNotRegistered}' não inscrita no escalão selecionado!`}</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}

      {showAlert && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>Clube não inscrito no escalão selecionado!</p>
            <button onClick={handleCloseAlert}>OK</button>
          </div>
        </div>
      )}
      {sameClubsError && (
        <div className='custom-alert-overlay2'>
          <div className="custom-alert2">
            <p>As equipas não podem ser iguais!</p>
            <button onClick={() => setSameClubsError(false)}>OK</button>
          </div>
        </div>
      )}
    </div >

  )
}

export default FichaJogo

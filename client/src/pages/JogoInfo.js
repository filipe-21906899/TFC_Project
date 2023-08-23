import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom';
import axios from 'axios';
//import { Formik, Form, Field, ErrorMessage } from 'formik';
//import * as Yup from 'yup';

function JogoInfo() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [torneioData, setTorneioData] = useState(null);
  const [escalaoName, setEscalaoName] = useState(null);
  const username = localStorage.getItem('username');

  const isAdmin = username === 'Admin';

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/jogo/${id}`)
      .then((response) => {
        setData(response.data);
        console.log("Game Data:", response.data); // Log the fetched game data
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    if (data) {
      axios
        .get(`http://localhost:3001/torneio/${data.TorneioId}`)
        .then((response) => {
          setTorneioData(response.data); // Set the fetched torneio data in the state
          console.log("Torneio Data:", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [data]);

  useEffect(() => {
    if (torneioData) {
      axios
        .get(`http://localhost:3001/escalao/${torneioData.EscalaoId}`)
        .then((response) => {
          setEscalaoName(response.data); // Set the fetched torneio data in the state
          console.log("AwayName Data:", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [torneioData]);

  return (
    <div className='Inscrição3'>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      {data && torneioData &&  escalaoName &&(
          <div>
            <h2>Home: {data.Home}</h2>
            <h2>Away: {data.Away}</h2>
            <h2>HomeID: {data.HomeId}</h2>
            <h2>AwayID: {data.AwayId}</h2>
            <h2>EscalaoId : {torneioData.EscalaoId}</h2>
            <h2>Escalão Name: {escalaoName.Nome}</h2>
          </div>
      )}
    </div>
  )
}

export default JogoInfo

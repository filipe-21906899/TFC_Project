const express = require('express')
const router = express.Router()
const { Equipas } = require('../models')

router.get('/', async (req, res) => {
  try {
    const { ClubeId } = req.query;
    if (!ClubeId) {
      // If 'ClubeId' is not provided in the query parameters, return an error
      return res.status(400).json({ error: 'ClubeId is required in the query parameters.' });
    }

    // Fetch 'equipas' with the provided 'ClubeId'
    const listOfPost = await Equipas.findAll({ where: { ClubeId } });
    res.json(listOfPost);
  } catch (error) {
    console.error('Error fetching equipas:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post("/", async (req, res) => {
    const cc = req.body;
    const { EscalaoId, ClubeId, Ano } = cc;
  
    // Check if the team already exists by querying the database with EscalaoId and ClubeId
    const existingTeam = await Equipas.findOne({ where: { EscalaoId, ClubeId, Ano } });
  
    if (existingTeam) {
      // If the team already exists, send a response with an error message
      return res.status(400).json({ error: 'Equipa already saved' });
    }
  
    // Create the team since it doesn't exist
    const createdTeam = await Equipas.create(cc);
    res.json(createdTeam);
  });

  // New GET endpoint to fetch the equipaId based on EscalaoId, ClubeId, and Ano
router.get('/equipaId', async (req, res) => {
  try {
    const { EscalaoId, ClubeId, Ano } = req.query;

    // Check if all required parameters are provided
    if (!EscalaoId || !ClubeId || !Ano) {
      return res.status(400).json({ error: 'EscalaoId, ClubeId, and Ano are required in the query parameters.' });
    }

    // Fetch equipaId with the provided EscalaoId, ClubeId, and Ano
    const equipa = await Equipas.findOne({ where: { EscalaoId, ClubeId, Ano } });

    if (!equipa) {
      return res.status(404).json({ error: 'No matching equipa found for the provided EscalaoId, ClubeId, and Ano.' });
    }

    res.json({ equipaId: equipa.id });
  } catch (error) {
    console.error('Error fetching equipaId:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router
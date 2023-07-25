const express = require('express')
const router = express.Router()
const { Equipas } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Equipas.findAll();
    res.json(listOfPost);
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

module.exports = router
const express = require('express')
const router = express.Router()
const { Jogadores } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Jogadores.findAll();
    res.json(listOfPost);
});

router.post('/', async (req, res) => {
    try {
      const jogadoresData = req.body;
      const createdJogadores = await Jogadores.create(jogadoresData);
      return res.json(createdJogadores);
    } catch (error) {
      console.error('Error creating Jogador:', error);
      return res.status(500).json({ error: 'Failed to create Jogador' });
    }
  });

module.exports = router
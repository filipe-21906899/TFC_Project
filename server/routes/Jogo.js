const express = require('express')
const router = express.Router()
const { Jogo } = require('../models')

router.get('/', async (req, res) => {
  const listOfJogos = await Jogo.findAll();
  res.json(listOfJogos);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const jogo = await Jogo.findByPk(id);
  return res.json(jogo);
});

router.post('/', async (req, res) => {
    try {
      const newJogo = await Jogo.create(req.body);
      res.json(newJogo);
    } catch (error) {
      console.error('Error creating Jogo:', error);
      res.status(500).json({ error: 'Failed to create Jogo' });
    }
  });

module.exports = router
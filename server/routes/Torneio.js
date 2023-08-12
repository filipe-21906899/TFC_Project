const express = require('express');
const router = express.Router();
const { Torneio } = require('../models');

router.get('/', async (req, res) => {
  const listOfTorneio = await Torneio.findAll();
  res.json(listOfTorneio);
});

router.get('/check', async (req, res) => {
  try {
      const { EscalaoId, Ano } = req.query;

      if (!EscalaoId || !Ano) {
          return res.status(400).json({ error: 'EscalaoId and Ano are required query parameters.' });
      }

      const currentYear = new Date().getFullYear();

      // Find torneios matching the provided EscalaoId and Ano
      const listOfTorneio = await Torneio.findAll({
          where: {
              EscalaoId,
              Ano: currentYear,
          },
      });

      res.json(listOfTorneio);
  } catch (error) {
      console.error('Error fetching Torneios:', error);
      res.status(500).json({ error: 'An error occurred while fetching Torneios.' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const escalao = await Torneio.findByPk(id);
  return res.json(escalao);
});

router.post('/', async (req, res) => {
  try {
    const newTorneio = await Torneio.create(req.body);
    res.json(newTorneio);
  } catch (error) {
    console.error('Error creating Torneio:', error);
    res.status(500).json({ error: 'Failed to create Torneio' });
  }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const { Torneio } = require('../models');

router.get('/', async (req, res) => {
  const listOfTorneio = await Torneio.findAll();
  res.json(listOfTorneio);
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

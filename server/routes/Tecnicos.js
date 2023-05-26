const express = require('express');
const router = express.Router();
const { Tecnicos } = require('../models');

router.get('/', async (req, res) => {
  try {
    const listOfTecnicos = await Tecnicos.findAll();
    return res.json(listOfTecnicos);
  } catch (error) {
    console.error('Error fetching Tecnicos:', error);
    return res.status(500).json({ error: 'Failed to fetch Tecnicos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const tecnicosData = req.body;
    const createdTecnicos = await Tecnicos.create(tecnicosData);
    return res.json(createdTecnicos);
  } catch (error) {
    console.error('Error creating Tecnicos:', error);
    return res.status(500).json({ error: 'Failed to create Tecnicos' });
  }
});


module.exports = router;

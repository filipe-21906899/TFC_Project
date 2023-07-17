const express = require('express');
const router = express.Router();
const { Escalao } = require('../models');

router.get('/', async (req, res) => {
  const listOfPost = await Escalao.findAll();
  res.json(listOfPost);
});

router.get('/:id', async (req, res) => {
  const escalaoId = req.params.id;
  const escalaoData = await Escalao.findByPk(escalaoId);
  res.json(escalaoData);
});

router.post('/', async (req, res) => {
  try {
    const preDefinedValues = [
      { Nome: 'Escolinhas' },
      { Nome: 'I Escalão' },
      { Nome: 'II Escalão' },
      { Nome: 'III Escalão' },
      { Nome: 'Escalão Feminino' }
    ];

    // Loop through the pre-defined values
    for (const value of preDefinedValues) {
      const existingValue = await Escalao.findOne({ where: { Nome: value.Nome } });

      // If the value doesn't exist, create it in the database
      if (!existingValue) {
        await Escalao.create(value);
      }
    }

    return res.status(201).json({ message: 'Pre-defined values added successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add pre-defined values to the database.' });
  }
});

module.exports = router;

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

// GET all CCTecnicos values
router.get('/cc', async (req, res) => {
  try {
    const listOfCCTecnicos = await Tecnicos.findAll({
      attributes: ['CCTecnico'], // Specify the column you want to fetch
    });
    const ccTecnicosValues = listOfCCTecnicos.map((tecnico) => tecnico.CCTecnicos);
    return res.json(ccTecnicosValues);
  } catch (error) {
    console.error('Error fetching CCTecnico:', error);
    return res.status(500).json({ error: 'Failed to fetch CCTecnico' });
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

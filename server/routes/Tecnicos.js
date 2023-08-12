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
    const ccTecnicosValues = listOfCCTecnicos.map((tecnico) => tecnico.CCTecnico);
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

// GET detailed information for a specific TecnicoId
router.get('/:id', async (req, res) => {
  try {
    const tecnicoId = req.params.id;

    // Fetch detailed information for the specified JogadoreId
    const tecnico = await Tecnicos.findByPk(tecnicoId);

    if (tecnico) {
      res.json(tecnico);
    } else {
      res.status(404).json({ error: 'Tecnico not found' });
    }
  } catch (error) {
    console.error('Error fetching Tecnico:', error);
    res.status(500).json({ error: 'Failed to fetch Tecnico' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tecnicosId = req.params.id;
    const updatedResideValue = req.body.Reside;

    // Fetch the Jogadore by ID
    const tecnico = await Tecnicos.findByPk(tecnicosId);

    if (tecnico) {
      // Update the Reside field
      tecnico.Reside = updatedResideValue;
      await tecnico.save(); // Save the updated Jogadore

      res.json(tecnico);
    } else {
      res.status(404).json({ error: 'Tecnicos not found' });
    }
  } catch (error) {
    console.error('Error updating Tecnicos Reside:', error);
    res.status(500).json({ error: 'Failed to update Tecnicos Reside' });
  }
});


module.exports = router;

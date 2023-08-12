const express = require('express')
const router = express.Router()
const { Jogadores } = require('../models')

router.get("/", async (req, res) => {
  const listOfPost = await Jogadores.findAll();
  res.json(listOfPost);
});

// GET all CCGuardiao values
router.get('/cc/guardiao', async (req, res) => {
  try {
    const listOfCCGuardiao = await Jogadores.findAll({
      attributes: ['CCGuardiao'], // Specify the column you want to fetch
    });
    const ccGuardiaoValues = listOfCCGuardiao.map((jogador) => jogador.CCGuardiao);
    return res.json(ccGuardiaoValues);
  } catch (error) {
    console.error('Error fetching CCGuardiao:', error);
    return res.status(500).json({ error: 'Failed to fetch CCGuardiao' });
  }
});

// GET all CCJogador values
router.get('/cc', async (req, res) => {
  try {
    const listOfCCJogador = await Jogadores.findAll({
      attributes: ['CCJogador'], // Specify the column you want to fetch
    });
    const ccJogadorValues = listOfCCJogador.map((jogador) => jogador.CCJogador);
    return res.json(ccJogadorValues);
  } catch (error) {
    console.error('Error fetching CCJogador:', error);
    return res.status(500).json({ error: 'Failed to fetch CCJogador' });
  }
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

// GET detailed information for a specific JogadoreId
router.get('/:id', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch detailed information for the specified JogadoreId
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      res.json(jogadore);
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error fetching Jogadore:', error);
    res.status(500).json({ error: 'Failed to fetch Jogadore' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const jogadoreId = req.params.id;
    const updatedResideValue = req.body.Reside;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      // Update the Reside field
      jogadore.Reside = updatedResideValue;
      await jogadore.save(); // Save the updated Jogadore

      res.json(jogadore);
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error updating Jogadore Reside:', error);
    res.status(500).json({ error: 'Failed to update Jogadore Reside' });
  }
});


module.exports = router
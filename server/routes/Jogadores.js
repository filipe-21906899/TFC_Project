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

router.put('/:id/ncartao', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      // Increment the NCartao field by 1
      jogadore.NCartao += 1;
      await jogadore.save(); // Save the updated Jogadore

      res.json(jogadore);
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error updating Jogadore NCartao:', error);
    res.status(500).json({ error: 'Failed to update Jogadore NCartao' });
  }
});

router.put('/:id/castigado', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      // Check conditions and update Castigado
      if (jogadore.NCartao === 2 && !jogadore.Castigado) {
        jogadore.Castigado = true;
        await jogadore.save(); // Save the updated Jogadore
        res.json(jogadore);
      } else {
        res.json(jogadore); // Return the Jogadore without making any changes
      }
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error updating Jogadore Castigado:', error);
    res.status(500).json({ error: 'Failed to update Jogadore Castigado' });
  }
});

router.put('/:id/vermelho', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      // Update Castigado to true for "Vermelho" cards
      jogadore.Castigado = true;
      await jogadore.save(); // Save the updated Jogadore
      res.json(jogadore);
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error updating Jogadore Castigado for Vermelho:', error);
    res.status(500).json({ error: 'Failed to update Jogadore Castigado for Vermelho' });
  }
});

router.put('/:id/reset', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      jogadore.Castigado = false;
      jogadore.NCartao = 0;
      await jogadore.save(); // Save the updated Jogadore
      res.json(jogadore);
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error updating Jogadore Castigado for Vermelho:', error);
    res.status(500).json({ error: 'Failed to update Jogadore Castigado for Vermelho' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const jogadoreId = req.params.id;

    // Fetch the Jogadore by ID
    const jogadore = await Jogadores.findByPk(jogadoreId);

    if (jogadore) {
      // Delete the Jogadore
      await jogadore.destroy();

      res.json({ message: 'Jogadore deleted successfully' });
    } else {
      res.status(404).json({ error: 'Jogadore not found' });
    }
  } catch (error) {
    console.error('Error deleting Jogadore:', error);
    res.status(500).json({ error: 'Failed to delete Jogadore' });
  }
});


module.exports = router
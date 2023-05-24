const express = require('express');
const router = express.Router();
const { CadernoEleitoral } = require('../models');

router.get('/', async (req, res) => {
  try {
    const listOfCC = await CadernoEleitoral.findAll();
    return res.json(listOfCC);
  } catch (error) {
    console.error('Error fetching CadernoEleitoral data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/cc-data', async (req, res) => {
  const ccData = req.body;

  try {
    await CadernoEleitoral.bulkCreate(ccData);
    res.json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

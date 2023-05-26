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
    return res.json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    await CadernoEleitoral.destroy({
      truncate: true, // Deletes all rows from the table
    });
    return res.json({ message: 'All data deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

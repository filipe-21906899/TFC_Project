const express = require('express')
const router = express.Router()
const { Clubes } = require('../models')

router.get("/:userId", async (req, res) =>{
    const userId = req.params.userId;
    const clubes = await Clubes.findAll({ where: { UserId: userId}});
    res.json(clubes); 
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Clubes.create(cc);
    res.json(cc);
})

router.get('/', async (req, res) => {
    try {
      const clubes = await Clubes.findAll();
      return res.json(clubes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  });

module.exports = router
const express = require('express');
const router = express.Router();
const {Tecnicos} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await Tecnicos.findAll();
    res.json(listOfPost);
});

router.post('/', async (req, res) => {
    try {
      const { Imagem, ...rest } = req.body;
  
      // Convert the Base64 image data to a string
      const imageString = Imagem.toString();
  
      // Create a new Tecnicos record
      const tecnicos = await Tecnicos.create({
        ...rest,
        Imagem: imageString,
      });
  
      res.json(tecnicos);
    } catch (error) {
      console.error('Error creating Tecnicos:', error);
      res.status(500).json({ error: 'Failed to create Tecnicos' });
    }
  });
  

module.exports = router

const express = require('express');
const router = express.Router();
const {TecnicosType} = require('../models');

router.get('/', async (req, res) => {
    const listOfTecnicosType = await TecnicosType.findAll();
    res.json(listOfTecnicosType);
  });

  router.post("/", async (req, res) => {
    const cc = req.body;
  
    const predefinedValues = [
      { Nome: "Treinador" },
      { Nome: "Treinador-Adjunto" },
      { Nome: "Delegado" },
      { Nome: "Massagista" },
      { Nome: "Médico" }
    ];
    try {
        // Loop through the pre-defined values and create them in the database
        for (const value of predefinedValues) {
          const existingValue = await TecnicosType.findOne({ where: { Nome: value.Nome } });
    
          // If the value doesn't exist, create it in the database
          if (!existingValue) {
            await TecnicosType.create(value);
          }
        }
    
        res.status(201).json({ message: "Pre-defined values added successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add pre-defined values to the database." });
      }
    });

module.exports = router
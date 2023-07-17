const express = require('express');
const router = express.Router();
const {JogoType} = require('../models');

router.get("/", async (req, res) =>{
    const listOfJogoType = await JogoType.findAll();
    res.json(listOfJogoType);
});

router.post("/", async (req, res) => {
    const cc = req.body;
  
    const predefinedValues = [
      { Nome: "GrupoA" },
      { Nome: "GrupoB" },
      { Nome: "GrupoC" },
      { Nome: "GrupoD" },
      { Nome: "Semi-Final" },
      { Nome: "Final" }
    ];
    try {
        // Loop through the pre-defined values and create them in the database
        for (const value of predefinedValues) {
          const existingValue = await JogoType.findOne({ where: { Nome: value.Nome } });
    
          // If the value doesn't exist, create it in the database
          if (!existingValue) {
            await JogoType.create(value);
          }
        }
    
        res.status(201).json({ message: "Pre-defined values added successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add pre-defined values to the database." });
      }
    });

module.exports = router
const express = require('express')
const router = express.Router()
const { UsersType } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await UsersType.findAll();
    return res.json(listOfPost);
});

router.post("/", async (req, res) => {
    try {
      const preDefinedValues = [
        { Nome: "Admin" },
        { Nome: "Clubes" }
      ];
  
      // Loop through the pre-defined values and create them in the database
      for (const value of preDefinedValues) {
        const existingValue = await UsersType.findOne({ where: { Nome: value.Nome } });
  
        // If the value doesn't exist, create it in the database
        if (!existingValue) {
          await UsersType.create(value);
        }
      }
  
      res.status(201).json({ message: "Pre-defined values added successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add pre-defined values to the database." });
    }
  });
  

module.exports = router
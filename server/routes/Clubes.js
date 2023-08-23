const express = require('express')
const router = express.Router()
const { Clubes } = require('../models')

router.get("/:userId", async (req, res) =>{
    const userId = req.params.userId;
    const clubes = await Clubes.findAll({ where: { UserId: userId}});
    res.json(clubes); 
});

router.get("/:clubName", async (req, res) => {
  const clubName = req.params.clubName;
  try {
    const club = await Clubes.findOne({ where: { Nome: clubName } });
    if (club) {
      res.json({ id: club.id });
    } else {
      res.status(404).json({ message: "Club not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
      const preDefinedValues = [
          { Nome: "Sabugo", UserId: 2 },
          { Nome: "Saloios Dª Maria", UserId: 3 },
          { Nome: "Maceira", UserId: 4 },
          { Nome: "Montelavar", UserId: 5 },
          { Nome: "Negrais", UserId: 6 },
          { Nome: "Almargem Do Bispo", UserId: 7 },
          { Nome: "Albogas", UserId: 8 },
          { Nome: "Vale De Lobo", UserId: 9 },
          { Nome: "Camarões", UserId: 10 },
          { Nome: "Anços", UserId: 11 },
          { Nome: "Almornos", UserId: 12 },
          { Nome: "Aruil", UserId: 13 },
          { Nome: "Camponeses Dª Maria", UserId: 14 },
          { Nome: "Covas de Ferro", UserId: 15 },
          { Nome: "Pêro Pinheiro", UserId: 16 },
      ];

      // Loop through the pre-defined values and create them in the database
      for (const value of preDefinedValues) {
          const existingValue = await Clubes.findOne({ where: { Nome: value.Nome, UserId: value.UserId } });

          // If the value doesn't exist, create it in the database
          if (!existingValue) {
              await Clubes.create(value);
          }
      }

      res.status(201).json({ message: "Pre-defined values added successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add pre-defined values to the database." });
  }
});

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